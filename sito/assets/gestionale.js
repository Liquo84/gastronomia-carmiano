/* Gestionale: lista di produzione, ordini, menù e giorni, catering, incassi, impostazioni. */

let page="prod";
let aday=load(K.aday,null);if(!aday||!nextDays(7).includes(aday))aday=TODAY;
const persist=persistState;
const PAYL={card:"Carta",satispay:"Satispay",cash:"Contanti"};

document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{page=b.dataset.page;document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("on",x===b));renderAdmin()});
$("#pauseSw").onclick=()=>{settings.pause=!settings.pause;persist();renderAdmin();toast(settings.pause?"Ordini online sospesi":"Ordini online riaperti")};

function dayTabs(countFn){return`<div class="daytabs">${nextDays(7).map(k=>{const c=countFn(k);return`<button class="${k===aday?"on":""}" data-aday="${k}" ${hoursOf(k)?"":'style="opacity:.5"'}>${dlabel(k)} <span class="small" style="font-weight:600;opacity:.8">${DN[wd(k)].slice(0,3)} ${new Date(k+"T00:00").getDate()}</span>${c?`<span class="c num">${c}</span>`:""}</button>`}).join("")}</div>`}
function bindDayTabs(M){M.querySelectorAll("[data-aday]").forEach(b=>b.onclick=()=>{aday=b.dataset.aday;save(K.aday,aday);renderAdmin()})}

function renderAdmin(){
 $("#pauseSw").classList.toggle("on",settings.pause);updateDots();
 const M=$("#adminMain");
 const dayOrders=k=>orders.filter(o=>o.date===k&&o.st!=="rej");

 /* ---- Lista di produzione ---- */
 if(page==="prod"){
  const os=dayOrders(aday);const st=orderState(aday);
  const rows=products.filter(p=>offeredOn(p,aday)||sold(p.id,aday)>0).map(p=>({p,q:sold(p.id,aday)})).filter(r=>r.q>0||r.p.limit!=null).sort((a,b)=>CATS.indexOf(a.p.cat)-CATS.indexOf(b.p.cat)||b.q-a.q);
  const portions=os.reduce((s,o)=>s+o.rows.reduce((a,r)=>a+r.q,0),0);const rev=os.reduce((s,o)=>s+o.tot.tot,0);const cash=os.filter(o=>o.pay==="cash").reduce((s,o)=>s+o.tot.tot,0);
  const frozen=!st.open&&aday>=TODAY;
  M.innerHTML=`<div class="ph"><div><h2>Lista di produzione</h2><p>Quanto cucinare per ogni giorno: è la somma degli ordini. Alla chiusura la lista si congela e la cucina parte da qui.</p></div><button class="btn sm sec" id="printProd">Stampa la lista</button></div>
  ${dayTabs(k=>dayOrders(k).length)}
  <div class="kpis"><div class="kpi ${frozen?"":"warn"}"><div class="eyebrow">Ordini per ${dlabel(aday).toLowerCase()}</div><div class="v">${frozen?"Chiusi":"Aperti"}<small>${st.why}</small></div></div><div class="kpi"><div class="eyebrow">Ordini ricevuti</div><div class="v num">${os.length}<small>${os.filter(o=>o.mode==="consegna").length} consegne</small></div></div><div class="kpi"><div class="eyebrow">Porzioni da cucinare</div><div class="v num">${portions}</div></div><div class="kpi"><div class="eyebrow">Incasso previsto</div><div class="v num">${eur(rev)}<small>${eur(cash)} in contanti</small></div></div></div>
  <h3 style="margin:0 0 10px;font-size:18px">Produzione di ${dfull(aday)}</h3>
  <div class="tw"><table><tr><th>Piatto</th><th>Categoria</th><th style="width:140px">Porzioni ordinate</th><th>Tetto del giorno</th><th style="width:200px">Riempimento</th></tr>
  ${rows.length?rows.map(({p,q})=>{const lim=p.limit;const pct=lim?Math.min(100,Math.round(q/lim*100)):0;const cls=lim&&q>=lim?"c":lim&&pct>=80?"w":"";return`<tr><td><b>${esc(p.n)}</b></td><td class="small muted">${p.cat}</td><td class="num" style="font-weight:800;font-size:16px">${q}</td><td class="num">${lim?`${lim} <span class="small muted">· restano ${Math.max(0,lim-q)}</span>`:'<span class="muted">nessuno</span>'}</td><td>${lim?`<div class="bar"><i class="${cls}" style="width:${pct}%"></i></div>`:'<span class="small muted">senza limite</span>'}</td></tr>`}).join("")+`<tr class="tot"><td colspan="2">Totale porzioni</td><td class="num">${portions}</td><td colspan="2"></td></tr>`:`<tr><td colspan="5" class="muted">Nessun ordine per ${dlabel(aday).toLowerCase()}.</td></tr>`}</table></div>
  <h3 style="margin:24px 0 10px;font-size:18px">Chi ritira e quando</h3>
  <div class="tw"><table><tr><th>Ora</th><th>Ordine</th><th>Cliente</th><th>Piatti</th><th>Pagamento</th><th>Stato</th></tr>${os.length?os.slice().sort((a,b)=>a.slot.localeCompare(b.slot)).map(o=>`<tr><td class="num" style="font-weight:800;color:var(--accent)">${o.slot}</td><td class="num">#${o.n}</td><td><b>${esc(o.cust.name)}</b><div class="small muted">${o.mode==="consegna"?"Consegna · "+esc(o.addr):"Ritiro"}</div></td><td class="small">${o.rows.map(r=>{const p=products.find(x=>x.id===r.id);return r.q+"× "+(p?esc(p.n):"—")}).join(", ")}</td><td><span class="pill ${o.pay==="cash"?"unpaid":"pay"}">${o.pay==="cash"?"Contanti da incassare":PAYL[o.pay]+" · pagato"}</span></td><td><span class="pill">${{new:"Da confermare",prep:"Confermato",ready:"Pronto",done:o.mode==="consegna"?"Consegnato":"Ritirato"}[o.st]}</span></td></tr>`).join(""):`<tr><td colspan="6" class="muted">Nessun ordine.</td></tr>`}</table></div>`;
  bindDayTabs(M);$("#printProd").onclick=()=>window.print();
 }

 /* ---- Ordini ---- */
 if(page==="orders"){
  const cols=[["new","Da confermare"],["prep","Confermati"],["ready","Pronti"],["done","Consegnati / ritirati"]];
  const late=o=>o.st!=="done"&&o.date===TODAY&&o.slot<nowHM();
  const card=o=>`<div class="oc ${o.st}"><div class="h"><b>#${o.n} · ${esc(o.cust.name)}</b><span class="when num">${o.slot}</span></div>
   <div style="display:flex;gap:6px;flex-wrap:wrap"><span class="pill ${o.mode==="consegna"?"del":""}">${o.mode==="consegna"?"Consegna · "+esc(o.zone):"Ritiro"}</span><span class="pill ${o.pay==="cash"?"unpaid":"pay"}">${o.pay==="cash"?"Contanti da incassare":PAYL[o.pay]+" · pagato"}</span>${late(o)?'<span class="pill late">In ritardo</span>':""}${o.ex?'<span class="pill ex">esempio</span>':""}</div>
   <ul>${o.rows.map(r=>{const p=products.find(x=>x.id===r.id);return`<li><span><b class="num">${r.q}×</b> ${p?esc(p.n):"—"}</span></li>`}).join("")}</ul>
   ${o.addr?`<div class="small muted">📍 ${esc(o.addr)}</div>`:""}${o.note?`<div class="small" style="color:var(--warn);font-weight:700">Nota: ${esc(o.note)}</div>`:""}
   <div class="f"><b class="num">${eur(o.tot.tot)}</b><span class="small muted">${esc(o.cust.tel)}</span></div>
   <div class="acts">${o.st==="new"?`<button class="btn sm ok" data-st="prep" data-n="${o.n}">Conferma</button><button class="btn sm danger" data-st="rej" data-n="${o.n}">Rifiuta</button>`:o.st==="prep"?`<button class="btn sm ok" data-st="ready" data-n="${o.n}">Segna pronto</button><button class="btn sm sec" data-print="${o.n}">Stampa comanda</button>`:o.st==="ready"?`<button class="btn sm ok" data-st="done" data-n="${o.n}">${o.mode==="consegna"?"Consegnato":"Ritirato"}${o.pay==="cash"?" · incassa "+eur(o.tot.tot):""}</button>`:`<span class="small muted">Chiuso alle ${o.closed||"—"}</span>`}</div></div>`;
  const os=dayOrders(aday);
  M.innerHTML=`<div class="ph"><div><h2>Ordini</h2><p>Alla chiusura si confermano tutti insieme con un tasto, oppure uno per uno. Il cliente riceve un WhatsApp a ogni passaggio.</p></div><div style="display:flex;gap:8px"><button class="btn sm" id="confirmAll" ${os.some(o=>o.st==="new")?"":"disabled"}>Conferma tutti i nuovi</button><button class="btn sm sec" id="resetDemo">Ripristina esempi</button></div></div>
  ${dayTabs(k=>orders.filter(o=>o.date===k&&o.st==="new").length)}
  <div class="board">${cols.map(([k,t])=>{const list=os.filter(o=>o.st===k);return`<div class="col"><h3>${t}<span class="num">${list.length}</span></h3>${list.length?list.map(card).join(""):'<div class="small muted" style="padding:10px 6px">Nessun ordine</div>'}</div>`}).join("")}</div>`;
  bindDayTabs(M);
  M.querySelectorAll("[data-st]").forEach(b=>b.onclick=()=>{const o=orders.find(x=>x.n==b.dataset.n);const s=b.dataset.st;if(s==="rej"){if(!confirm(`Rifiutare l'ordine #${o.n}? Il cliente riceve un messaggio e, se ha già pagato, va rimborsato.`))return;o.st="rej";toast(`#${o.n} rifiutato, cliente avvisato`)}else{o.st=s;if(s==="done")o.closed=nowHM();toast({prep:`#${o.n} confermato, entra in produzione`,ready:`#${o.n} pronto, cliente avvisato`,done:`#${o.n} chiuso`}[s])}persist();renderAdmin()});
  M.querySelectorAll("[data-print]").forEach(b=>b.onclick=()=>toast("Comanda inviata alla stampante di cucina"));
  $("#confirmAll").onclick=()=>{const n=os.filter(o=>o.st==="new");n.forEach(o=>o.st="prep");persist();renderAdmin();toast(`${n.length===1?"1 ordine confermato, cliente avvisato":n.length+" ordini confermati, clienti avvisati"} su WhatsApp`)};
  $("#resetDemo").onclick=()=>{if(!confirm("Tornare a menù, ordini e impostazioni di esempio? Le modifiche fatte si perdono."))return;clearAll();location.reload()};
 }

 /* ---- Menù e giorni ---- */
 if(page==="menu"){
  M.innerHTML=`<div class="ph"><div><h2>Menù e giorni</h2><p>Per ogni piatto: in quali giorni si fa e quante porzioni al massimo. Ogni modifica si vede subito nel negozio.</p></div><button class="btn sm" id="addProd">+ Nuovo piatto</button></div>
  <div class="tw"><table><tr><th>Piatto</th><th style="width:100px">Prezzo</th><th>Giorni</th><th style="width:110px">Tetto porzioni</th><th>Esaurito oggi</th><th>Nascosto</th><th></th></tr>
  ${products.map(p=>`<tr><td><b>${esc(p.n)}</b><div class="small muted">${p.cat}${p.d?" · "+esc(p.d):""}</div></td><td><input class="num" type="number" step="0.10" min="0" value="${p.p.toFixed(2)}" data-price="${p.id}"></td><td><div class="dchips">${["lun","mar","mer","gio","ven","sab","dom"].map(d=>`<button class="${(p.days||[]).includes(d)?"on":""}" data-pd="${p.id}" data-d="${d}" ${settings.hours[d]?"":'title="Bottega chiusa" disabled'}>${d[0].toUpperCase()}</button>`).join("")}</div></td><td><input class="num" type="number" min="0" placeholder="∞" value="${p.limit??""}" data-limit="${p.id}"></td><td><label class="sw crit ${p.out?"on":""}" data-out="${p.id}"><i></i></label></td><td><label class="sw ${p.hidden?"on":""}" data-hid="${p.id}"><i></i></label></td><td><button class="btn sm sec" data-del="${p.id}">Elimina</button></td></tr>`).join("")}</table></div>`;
  M.querySelectorAll("[data-price]").forEach(i=>i.onchange=()=>{const p=products.find(x=>x.id==i.dataset.price);p.p=+i.value||p.p;persist();toast("Prezzo aggiornato")});
  M.querySelectorAll("[data-limit]").forEach(i=>i.onchange=()=>{const p=products.find(x=>x.id==i.dataset.limit);p.limit=i.value===""?null:Math.max(0,+i.value);persist();toast(p.limit==null?"Nessun tetto: si cucina quello che ordinano":`Tetto: ${p.limit} porzioni al giorno`)});
  M.querySelectorAll("[data-pd]").forEach(b=>b.onclick=()=>{const p=products.find(x=>x.id==b.dataset.pd);p.days=p.days||[];const d=b.dataset.d;p.days=p.days.includes(d)?p.days.filter(x=>x!==d):[...p.days,d];persist();renderAdmin()});
  M.querySelectorAll("[data-out]").forEach(l=>l.onclick=()=>{const p=products.find(x=>x.id==l.dataset.out);p.out=!p.out;persist();renderAdmin()});
  M.querySelectorAll("[data-hid]").forEach(l=>l.onclick=()=>{const p=products.find(x=>x.id==l.dataset.hid);p.hidden=!p.hidden;persist();renderAdmin()});
  M.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{const p=products.find(x=>x.id==b.dataset.del);if(!confirm(`Eliminare «${p.n}» dal menù?`))return;products=products.filter(x=>x!==p);persist();renderAdmin()});
  $("#addProd").onclick=()=>{const n=prompt("Nome del piatto");if(!n)return;const pr=parseFloat((prompt("Prezzo in euro","6.00")||"0").replace(",","."));const cat=prompt("Categoria: "+CATS.join(", "),CATS[0]);products.push({id:Date.now(),n,d:"",p:pr||0,cat:CATS.includes(cat)?cat:CATS[0],days:ALL.slice(),limit:null});persist();renderAdmin();toast("Piatto aggiunto per tutti i giorni: togli quelli in cui non si fa")};
 }

 /* ---- Richieste catering ---- */
 if(page==="catering"){
  const STL={nuova:["Nuova richiesta","late"],preventivo:["Preventivo inviato","unpaid"],confermata:["Confermata · acconto ricevuto","pay"],persa:["Non conclusa",""]};
  M.innerHTML=`<div class="ph"><div><h2>Richieste catering</h2><p>Arrivano dal modulo del negozio. Il preventivo parte da qui entro 24 ore, con il link per l'acconto del 30%.</p></div></div>
  <div class="card" style="padding:0">${catReqs.length?catReqs.map(r=>{const f=FORMULE.find(x=>x.n===r.formula);const stima=f?f.pp*r.persone:0;return`<div class="cat-req"><div><b>${esc(r.nome)} · ${r.persone} persone · ${new Date(r.data+"T00:00").toLocaleDateString("it-IT",{day:"numeric",month:"long"})}</b><div class="m">${[r.tipo,r.formula,r.luogo,r.tel].filter(Boolean).map(esc).join(" · ")}${r.note?" · «"+esc(r.note)+"»":""}</div><div style="margin-top:6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap"><span class="pill ${STL[r.st][1]}">${STL[r.st][0]}</span>${r.importo?`<span class="small num"><b>${eur(r.importo)}</b> · acconto ${eur(r.importo*0.3)}</span>`:`<span class="small muted num">a listino ${eur(stima)}</span>`}${r.ex?'<span class="pill ex">esempio</span>':""}</div></div>
   <div style="display:flex;gap:6px;flex-direction:column">${r.st==="nuova"?`<button class="btn sm" data-q="${r.id}">Invia preventivo</button>`:r.st==="preventivo"?`<button class="btn sm ok" data-conf="${r.id}">Acconto ricevuto</button><button class="btn sm sec" data-lost="${r.id}">Non conclusa</button>`:""}</div></div>`}).join(""):'<div class="cat-req muted">Nessuna richiesta di preventivo.</div>'}</div>`;
  M.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{const r=catReqs.find(x=>x.id==b.dataset.q);const f=FORMULE.find(x=>x.n===r.formula);const v=prompt("Importo del preventivo in euro",String(f?f.pp*r.persone:0));if(v===null)return;r.importo=parseFloat(v.replace(",","."))||0;r.st="preventivo";persist();renderAdmin();toast("Preventivo inviato con il link per l'acconto")});
  M.querySelectorAll("[data-conf]").forEach(b=>b.onclick=()=>{const r=catReqs.find(x=>x.id==b.dataset.conf);r.st="confermata";persist();renderAdmin();toast("Evento confermato, acconto ricevuto")});
  M.querySelectorAll("[data-lost]").forEach(b=>b.onclick=()=>{const r=catReqs.find(x=>x.id==b.dataset.lost);r.st="persa";persist();renderAdmin()});
 }

 /* ---- Incassi ---- */
 if(page==="stats"){
  const all=orders.filter(o=>o.st!=="rej");const done=all.filter(o=>o.st==="done");const inc=done.reduce((s,o)=>s+o.tot.tot,0);const booked=all.filter(o=>o.st!=="done").reduce((s,o)=>s+o.tot.tot,0);const cash=all.filter(o=>o.pay==="cash"&&o.st!=="done").reduce((s,o)=>s+o.tot.tot,0);
  const cnt={};all.forEach(o=>o.rows.forEach(r=>{cnt[r.id]=(cnt[r.id]||0)+r.q}));const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,6);
  M.innerHTML=`<div class="ph"><div><h2>Incassi</h2><p>Solo ordini online. Le vendite al banco restano sul registratore di cassa.</p></div></div>
  <div class="kpis"><div class="kpi"><div class="eyebrow">Incassato (consegnati e ritirati)</div><div class="v num">${eur(inc)}</div></div><div class="kpi"><div class="eyebrow">Già ordinato</div><div class="v num">${eur(booked)}<small>prossimi giorni</small></div></div><div class="kpi"><div class="eyebrow">Scontrino medio</div><div class="v num">${eur(all.length?all.reduce((s,o)=>s+o.tot.tot,0)/all.length:0)}</div></div><div class="kpi warn"><div class="eyebrow">Contanti da incassare</div><div class="v num">${eur(cash)}</div></div></div>
  <div class="grid2"><div class="card"><h3>Piatti più ordinati</h3><ul class="top5">${top.map(([id,q])=>{const p=products.find(x=>x.id==id);return`<li><span>${p?esc(p.n):"—"}</span><b class="num">${q}</b></li>`}).join("")||"<li class='muted'>Ancora nessun ordine</li>"}</ul></div><div class="card"><h3>Come pagano</h3><ul class="top5">${Object.entries(PAYL).map(([k,l])=>`<li><span>${l}</span><b class="num">${all.filter(o=>o.pay===k).length}</b></li>`).join("")}</ul><p class="hint" style="margin:12px 0 0">Occhio ai contanti: un ordine non ritirato è cibo cucinato per niente. Nel sito finito si terrà il conto degli ordini non ritirati di ogni cliente.</p></div></div>`;
 }

 /* ---- Impostazioni ---- */
 if(page==="settings"){
  M.innerHTML=`<div class="ph"><div><h2>Impostazioni</h2><p>Quando chiudono gli ordini, quanti ne regge la cucina ogni quarto d'ora, dove si consegna e come si paga.</p></div></div>
  <div class="grid2">
   <div class="card"><h3>Chiusura degli ordini</h3><div class="form"><label>Per il giorno dopo, entro le<input type="time" id="s_cut" value="${settings.cutoff}"></label><label>Per il giorno stesso, entro le<input type="time" id="s_scut" value="${settings.sameDayCutoff}" ${settings.sameDay?"":"disabled"}></label><label class="full"><span class="sw ${settings.sameDay?"on":""}" id="s_same"><i></i>Accetta ordini per il giorno stesso (solo piatti già in produzione)</span></label></div>
    <h3 style="margin-top:20px">Tempi e capacità</h3><div class="form"><label>Tempo minimo di preparazione (min)<input type="number" id="s_prep" value="${settings.prep}" min="5" step="5"></label><label>Ordini massimi per fascia di 15 min<input type="number" id="s_cap" value="${settings.cap}" min="1"></label></div></div>
   <div class="card"><h3>Orari di apertura</h3><div class="hours">${Object.keys(DN).map(k=>{const h=settings.hours[k];return`<div class="row"><b>${DN[k]}</b>${h?`<span class="num">${h[0].join("–")}</span><span class="num">${h[1]?h[1].join("–"):""}</span>`:`<span class="muted">Chiuso</span><span></span>`}</div>`}).join("")}</div><p class="hint" style="margin:12px 0 0">In questa versione gli orari sono fissi. Nel sito finito si cambiano da qui, con ferie e chiusure straordinarie.</p>
    <h3 style="margin-top:20px">Metodi di pagamento</h3><div style="display:grid;gap:10px">${[["card","Carta online (Stripe)"],["satispay","Satispay"],["cash","Contanti al ritiro o alla consegna"]].map(([k,l])=>`<label class="sw ${settings.pay[k]?"on":""}" data-pay="${k}"><i></i>${l}</label>`).join("")}</div></div>
   <div class="card zones" style="grid-column:1/-1"><h3>Zone di consegna</h3><div class="row small muted"><span>Comune</span><span>Costo consegna</span><span>Ordine minimo</span><span></span></div>${settings.zones.map((z,i)=>`<div class="row"><input value="${esc(z.c)}" data-zc="${i}"><input class="num" type="number" step="0.5" value="${z.cost}" data-zcost="${i}"><input class="num" type="number" step="1" value="${z.min}" data-zmin="${i}"><button class="btn sm sec" data-zdel="${i}" ${i===0?"disabled title='La prima zona è quella della bottega'":""}>Togli</button></div>`).join("")}<button class="btn sm ghost" id="zadd" style="margin-top:6px">+ Aggiungi comune</button></div>
  </div>`;
  $("#s_cut").onchange=e=>{settings.cutoff=e.target.value||"20:00";persist();toast("Chiusura degli ordini aggiornata")};
  $("#s_scut").onchange=e=>{settings.sameDayCutoff=e.target.value||"10:00";persist();toast("Chiusura per il giorno stesso aggiornata")};
  $("#s_same").onclick=()=>{settings.sameDay=!settings.sameDay;persist();renderAdmin()};
  $("#s_prep").onchange=e=>{settings.prep=+e.target.value||20;persist();toast("Tempo di preparazione aggiornato")};
  $("#s_cap").onchange=e=>{settings.cap=+e.target.value||6;persist();toast("Massimo ordini per fascia aggiornato")};
  M.querySelectorAll("[data-pay]").forEach(l=>l.onclick=()=>{settings.pay[l.dataset.pay]=!settings.pay[l.dataset.pay];if(!Object.values(settings.pay).some(Boolean)){settings.pay[l.dataset.pay]=true;toast("Serve almeno un metodo di pagamento");}persist();renderAdmin()});
  M.querySelectorAll("[data-zc]").forEach(i=>i.onchange=()=>{settings.zones[i.dataset.zc].c=i.value;persist()});
  M.querySelectorAll("[data-zcost]").forEach(i=>i.onchange=()=>{settings.zones[i.dataset.zcost].cost=+i.value||0;persist()});
  M.querySelectorAll("[data-zmin]").forEach(i=>i.onchange=()=>{settings.zones[i.dataset.zmin].min=+i.value||0;persist()});
  M.querySelectorAll("[data-zdel]").forEach(b=>b.onclick=()=>{settings.zones.splice(+b.dataset.zdel,1);persist();renderAdmin()});
  $("#zadd").onclick=()=>{settings.zones.push({c:"Nuovo comune",cost:3,min:20});persist();renderAdmin()};
 }
}

/* Il negozio in un'altra scheda ha fatto un ordine o una richiesta: ridisegno. */
function onStateChanged(){renderAdmin()}

/* ---------- avvio ---------- */
const hp=(location.hash||"").replace("#","");
if(["prod","orders","menu","catering","stats","settings"].includes(hp)){page=hp;document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("on",x.dataset.page===hp))}
renderAdmin();
