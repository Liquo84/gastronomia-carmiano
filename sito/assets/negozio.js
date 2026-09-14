/* Negozio: scelta del giorno, menù, carrello, checkout, modulo catering. */

let cart=load(K.cart,{});
let mode=load(K.mode,"ritiro");
let day=load(K.day,null);

const cartRows=()=>Object.entries(cart).map(([id,q])=>({p:products.find(x=>x.id==id),q})).filter(r=>r.p&&r.q>0);
const cartSub=()=>cartRows().reduce((s,r)=>s+r.p.p*r.q,0);
const cartCount=()=>cartRows().reduce((s,r)=>s+r.q,0);
function pickDefaultDay(){const ds=nextDays(7);return ds.find(k=>orderState(k).open)||ds[1]}
if(!day||!nextDays(7).includes(day))day=pickDefaultDay();
const persistShop=()=>{save(K.cart,cart);save(K.mode,mode);save(K.day,day)};

/* ---------- disegno ---------- */
function renderHero(){$("#pauseBanner").classList.toggle("hide",!settings.pause)}
function renderDays(){
 const ds=nextDays(7);
 $("#days").innerHTML=ds.map(k=>{const st=orderState(k);const cnt=k===day?"on":"";const d=new Date(k+"T00:00");return`<button class="day ${cnt} ${st.open?"":"off"}" data-day="${k}" ${st.open?"":"disabled"}><small>${DN[wd(k)].slice(0,3)} ${d.getDate()}</small><b>${dlabel(k)}</b>${st.open?(k===TODAY?`<span>${st.why}</span>`:""):`<span>${st.why}</span>`}</button>`}).join("");
 $("#days").querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{if(b.disabled)return;setDay(b.dataset.day)});
 const st=orderState(day);
 $("#dayTitle").textContent=`Menù di ${dfull(day)}`;
 $("#dayCut").textContent=st.open?(day===TODAY?`Ordina entro le ${settings.sameDayCutoff}`:day===TOMORROW?`Ordina entro le ${settings.cutoff} di oggi`:`Ordina entro le ${settings.cutoff} del giorno prima`):"Prenotazioni chiuse";
}
function setDay(k){if(k===day)return;const removed=cartRows().filter(r=>!offeredOn(r.p,k)||remaining(r.p,k)<r.q);removed.forEach(r=>delete cart[r.p.id]);day=k;refreshShop();if(removed.length)toast(`${removed.length===1?"Un piatto":removed.length+" piatti"} del carrello non si ${removed.length===1?"fa":"fanno"} ${dlabel(k).toLowerCase()}: tolt${removed.length===1?"o":"i"}`)}
function renderCats(){
 $("#cats").innerHTML=CATS.map((c,i)=>`<button data-c="${c}" class="${i===0?"on":""}">${c}</button>`).join("")+`<button data-c="catering">Catering</button>`;
 $("#cats").querySelectorAll("button").forEach(b=>b.onclick=()=>{const id=b.dataset.c==="catering"?"catering":"cat-"+CATS.indexOf(b.dataset.c);const el=document.getElementById(id);if(el){const y=el.getBoundingClientRect().top+window.scrollY-120;window.scrollTo({top:y,behavior:"smooth"})}$("#cats").querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b))});
}
function renderMenu(){
 const st=orderState(day);
 const html=CATS.map((c,i)=>{const list=products.filter(p=>p.cat===c&&offeredOn(p,day));if(!list.length)return"";return`<div id="cat-${i}"><div class="cat-h"><h2>${c}</h2></div>${list.map(p=>{const q=cart[p.id]||0;const rem=remaining(p,day);const out=rem<=0;const dis=out||!st.open;const few=rem!==Infinity&&rem<=5&&!out;return`<div class="item ${out?"off":""}"><div><div class="n">${esc(p.n)}</div>${p.d?`<div class="d">${esc(p.d)}</div>`:""}<div class="meta"><span class="price num">${eur(p.p)}</span>${p.veg?'<span class="tag veg">Veg</span>':""}${out?'<span class="tag out">Esaurito</span>':few?`<span class="tag few">Ne restano ${rem}</span>`:""}</div></div><div class="act">${q>0&&!dis?`<span class="stepper"><button data-dec="${p.id}" aria-label="Togli">−</button><b class="num">${q}</b><button data-inc="${p.id}" aria-label="Aggiungi">+</button></span>`:`<button class="add" data-inc="${p.id}" ${dis?"disabled":""} aria-label="Aggiungi ${esc(p.n)}">+</button>`}</div></div>`}).join("")}</div>`}).join("");
 $("#menu").innerHTML=html||`<div class="empty-day">Per ${dlabel(day).toLowerCase()} non c'è un menù pubblicato.</div>`;
 $("#menu").querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{const id=+b.dataset.inc;const p=products.find(x=>x.id===id);const rem=remaining(p,day);if((cart[id]||0)+1>rem){toast(`Di ${p.n} per ${dlabel(day).toLowerCase()} ne restano ${rem}`);return}cart[id]=(cart[id]||0)+1;refreshShop();});
 $("#menu").querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{const id=b.dataset.dec;cart[id]=Math.max(0,(cart[id]||0)-1);if(!cart[id])delete cart[id];refreshShop();});
}
function renderCart(){
 const rows=cartRows();const sub=cartSub();const zone=settings.zones[0];const del=mode==="consegna"?zone.cost:0;const min=mode==="consegna"?zone.min:0;const under=sub<min;const st=orderState(day);
 const body=rows.length?`<div class="cart-body">${rows.map(r=>`<div class="line"><span class="q num">${r.q}×</span><span>${esc(r.p.n)}<div class="qbtn"><button data-cdec="${r.p.id}">−</button><button data-cinc="${r.p.id}">+</button></div></span><span class="num">${eur(r.p.p*r.q)}</span></div>`).join("")}
 <div class="tot"><div><span>Subtotale</span><span class="num">${eur(sub)}</span></div><div><span>${mode==="consegna"?"Consegna a "+zone.c:"Ritiro in bottega"}</span><span class="num">${del?eur(del):"gratis"}</span></div><div class="grand"><span>Totale</span><span class="num">${eur(sub+del)}</span></div></div>
 ${under?`<div class="minwarn">Per la consegna a ${zone.c} l'ordine minimo è ${eur(min)}: mancano ${eur(min-sub)}.</div>`:""}
 ${!st.open?`<div class="minwarn">Prenotazioni ${st.why} per ${dlabel(day).toLowerCase()}.</div>`:""}
 <button class="btn" id="goCheckout" ${under||!st.open?"disabled":""}>Prenota per ${dlabel(day).toLowerCase()} · ${eur(sub+del)}</button>
 </div>`
 :`<div class="cart-empty">Il carrello è vuoto.</div>`;
 $("#cart").innerHTML=`<div class="for"><b>${dlabel(day)}</b><span class="small muted">${dfull(day)}</span></div><div class="mode"><button class="${mode==="ritiro"?"on":""}" data-mode="ritiro">Ritiro</button><button class="${mode==="consegna"?"on":""}" data-mode="consegna">Consegna</button></div>${body}`;
 $("#cart").querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;refreshShop()});
 $("#cart").querySelectorAll("[data-cinc]").forEach(b=>b.onclick=()=>{const p=products.find(x=>x.id==b.dataset.cinc);if(cart[p.id]+1>remaining(p,day)){toast(`Di ${p.n} ne restano ${remaining(p,day)}`);return}cart[p.id]++;refreshShop()});
 $("#cart").querySelectorAll("[data-cdec]").forEach(b=>b.onclick=()=>{const id=b.dataset.cdec;cart[id]--;if(cart[id]<=0)delete cart[id];refreshShop()});
 const gc=$("#goCheckout");if(gc)gc.onclick=openCheckout;
 const bar=$("#cartbar");const n=cartCount();bar.classList.toggle("hide",!n);bar.innerHTML=`<span>${n} ${n===1?"articolo":"articoli"} · ${dlabel(day).toLowerCase()}</span><span>Prenota · ${eur(sub+del)}</span>`;bar.onclick=()=>{if(under){toast(`Ordine minimo per la consegna: ${eur(min)}`);return}if(!st.open){toast(`Prenotazioni ${st.why}`);return}openCheckout()};
}
function renderFormule(){
 $("#formule").innerHTML=FORMULE.map(f=>`<div class="formula"><h3>${f.n}</h3><span class="pp">da ${eur(f.pp)} a persona</span><span class="small muted">${f.l.join(", ").toLowerCase()}</span></div>`).join("");
 $("#catFormula").innerHTML=FORMULE.map(f=>`<option>${f.n}</option>`).join("");
}
function refreshShop(){persistShop();renderHero();renderDays();renderMenu();renderCart();updateDots()}

$("#catForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const r=Object.fromEntries(f.entries());r.id=Date.now();r.st="nuova";r.persone=+r.persone;loadState();catReqs.unshift(r);save(K.catreqs,catReqs);e.target.reset();$("#catFormula").selectedIndex=0;updateDots();toast("Richiesta inviata. Ti rispondiamo entro 24 ore");};

/* ---------- checkout ---------- */
let co=null;
function openCheckout(){co={step:1,mode,slot:null,name:"",tel:"",email:"",addr:"",citofono:"",note:"",zone:settings.zones[0].c,pay:settings.pay.card?"card":(settings.pay.satispay?"satispay":"cash"),err:""};renderCheckout()}
function closeCheckout(){const o=$("#ov");if(o)o.remove();co=null}
function renderCheckout(){
 let o=$("#ov");if(!o){o=document.createElement("div");o.id="ov";o.className="overlay";document.body.appendChild(o);o.onclick=e=>{if(e.target===o)closeCheckout()}}
 const titles={1:"Come e a che ora",2:"I tuoi dati",3:"Pagamento",4:"Riepilogo",5:"Prenotazione ricevuta"};
 const rows=cartRows();const sub=cartSub();const zone=settings.zones.find(z=>z.c===co.zone)||settings.zones[0];const del=co.mode==="consegna"?zone.cost:0;const tot=sub+del;
 let body="";
 if(co.step===1){const sl=slotsFor(day);body=`<div class="opts">
  <label class="opt ${co.mode==="ritiro"?"on":""}" data-m="ritiro"><span class="rad"></span><span><b>Ritiro in bottega</b><span>Via Leverano 29/A</span></span><span class="num">gratis</span></label>
  <label class="opt ${co.mode==="consegna"?"on":""}" data-m="consegna"><span class="rad"></span><span><b>Consegna a casa</b><span>Carmiano e dintorni</span></span><span class="num">da ${eur(Math.min(...settings.zones.map(z=>z.cost)))}</span></label></div>
  ${co.mode==="consegna"?`<div style="margin:14px 0 0"><label class="small muted" style="font-weight:700">Comune<select id="zoneSel">${settings.zones.map(z=>`<option ${z.c===co.zone?"selected":""}>${z.c} · ${z.cost?eur(z.cost):"gratis"} · min. ${eur(z.min)}</option>`).join("")}</select></label></div>`:""}
  <div class="eyebrow" style="margin:22px 0 4px">A che ora, ${dlabel(day).toLowerCase()}</div>
  <div class="slots">${sl.length?sl.map(s=>`<button data-slot="${s.s}" class="${co.slot===s.s?"on":""}" ${s.full?"disabled title='Fascia piena'":""}>${s.s}</button>`).join(""):'<span class="muted small">Nessun orario disponibile.</span>'}</div>
  ${co.err?`<p class="err">${co.err}</p>`:""}`;
 }else if(co.step===2){body=`<div class="form">
  <label>Nome<input id="f_name" value="${esc(co.name)}"></label>
  <label>Telefono<input id="f_tel" type="tel" value="${esc(co.tel)}" placeholder="Per avvisarti su WhatsApp"></label>
  <label class="full">Email <span class="muted" style="font-weight:500">(facoltativa)</span><input id="f_email" type="email" value="${esc(co.email)}"></label>
  ${co.mode==="consegna"?`<label class="full">Indirizzo · ${co.zone}<input id="f_addr" value="${esc(co.addr)}" placeholder="Via e numero civico"></label><label>Citofono<input id="f_cit" value="${esc(co.citofono)}"></label>`:""}
  <label class="full">Note<textarea id="f_note" rows="2" placeholder="Senza cipolla, porzione doppia di pane…">${esc(co.note)}</textarea></label></div>${co.err?`<p class="err">${co.err}</p>`:""}`;
 }else if(co.step===3){const P=[["card","Carta","Visa, Mastercard, Apple Pay, Google Pay",settings.pay.card],["satispay","Satispay","Confermi dall'app",settings.pay.satispay],["cash",co.mode==="consegna"?"Contanti alla consegna":"Contanti al ritiro","Se non passi, avvisaci",settings.pay.cash]].filter(x=>x[3]);
  body=`<div class="opts">${P.map(([k,t,d])=>`<label class="opt ${co.pay===k?"on":""}" data-p="${k}"><span class="rad"></span><span><b>${t}</b><span>${d}</span></span><span></span></label>`).join("")}</div>
  ${co.pay==="card"?`<div class="form" style="margin-top:16px"><label class="full">Numero carta<input value="4242 4242 4242 4242" readonly></label><label>Scadenza<input value="12/28" readonly></label><label>CVC<input value="123" readonly></label><span class="full hint">Versione di prova: nessun addebito.</span></div>`:""}`;
 }else if(co.step===4){body=`<div class="sum">
  <div class="blk"><b>${dfull(day)} alle ${co.slot} · ${co.mode==="consegna"?"consegna a "+esc(co.addr)+", "+co.zone:"ritiro in Via Leverano 29/A"}</b><span class="muted">${esc(co.name)} · ${esc(co.tel)}</span>${co.note?`<span class="muted">Note: ${esc(co.note)}</span>`:""}</div>
  ${rows.map(r=>`<div class="row"><span><b class="num">${r.q}×</b> ${esc(r.p.n)}</span><span class="num">${eur(r.p.p*r.q)}</span></div>`).join("")}
  <div class="row muted"><span>Consegna</span><span class="num">${del?eur(del):"gratis"}</span></div>
  <div class="row" style="font-weight:800;font-size:17px;border-top:1px solid var(--line);padding-top:8px"><span>Totale</span><span class="num">${eur(tot)}</span></div>
  <div class="row muted"><span>Pagamento</span><span>${{card:"Carta",satispay:"Satispay",cash:"Contanti"}[co.pay]}</span></div>
  <span class="hint">Puoi annullare fino alla chiusura delle prenotazioni.</span></div>`;
 }else{const ord=co.placed;const seqs=["new","prep","ready","done"];const idx=ord.st==="rej"?-1:seqs.indexOf(ord.st);
  body=`<div class="success"><div class="eyebrow">Grazie, ${esc(ord.cust.name.split(" ")[0])}</div><div class="big">${ord.st==="rej"?"Prenotazione rifiutata":"Prenotazione ricevuta"}</div><div class="code">#${ord.n}</div>
  <p class="muted" style="margin:0 0 16px">${ord.st==="rej"?"La bottega non può accettare questa prenotazione: ti ha scritto su WhatsApp al "+esc(ord.cust.tel)+"."+(ord.pay!=="cash"?" Il pagamento viene stornato.":""):`${dfull(ord.date)} alle ${ord.slot}, ${ord.mode==="consegna"?"a "+esc(ord.addr):"in Via Leverano 29/A"}.<br>Ti avvisiamo su WhatsApp al ${esc(ord.cust.tel)}.`}</p>
  <div class="timeline">${[["Ricevuta"],["Confermata"],["Pronta"],[ord.mode==="consegna"?"Consegnata":"Ritirata"]].map((t,i)=>`<div class="tl ${i<idx?"done":i===idx?"now":""}"><i class="b"></i><div><b>${t[0]}</b></div></div>`).join("")}</div></div>`;
 }
 const canBack=co.step>1&&co.step<5;
 o.innerHTML=`<div class="modal" role="dialog" aria-label="Checkout"><header><div><h2>${titles[co.step]}</h2>${co.step<5?`<small>${dfull(day)}</small>`:""}</div><button class="x" id="coX" aria-label="Chiudi">×</button></header><div class="mbody">${co.step<5?`<div class="steps">${[1,2,3,4].map(i=>`<div class="${i<=co.step?"done":""}"></div>`).join("")}</div>`:""}${body}</div>
 <div class="mfoot">${canBack?`<button class="btn sec" id="coBack">Indietro</button>`:"<span></span>"}${co.step<4?`<button class="btn" id="coNext">Continua</button>`:co.step===4?`<button class="btn" id="coNext">${co.pay==="cash"?"Conferma la prenotazione":"Paga "+eur(tot)+" e prenota"}</button>`:`<button class="btn" id="coDone">Torna al menù</button>`}</div></div>`;
 $("#coX").onclick=closeCheckout;
 o.querySelectorAll("[data-m]").forEach(l=>l.onclick=()=>{co.mode=l.dataset.m;mode=co.mode;co.err="";renderCheckout()});
 o.querySelectorAll("[data-slot]").forEach(b=>b.onclick=()=>{co.slot=b.dataset.slot;co.err="";renderCheckout()});
 o.querySelectorAll("[data-p]").forEach(l=>l.onclick=()=>{co.pay=l.dataset.p;renderCheckout()});
 const zs=$("#zoneSel");if(zs)zs.onchange=()=>{co.zone=settings.zones[zs.selectedIndex].c;renderCheckout()};
 const bk=$("#coBack");if(bk)bk.onclick=()=>{co.step--;co.err="";renderCheckout()};
 const dn=$("#coDone");if(dn)dn.onclick=()=>{closeCheckout();window.scrollTo({top:0,behavior:"smooth"})};
 const nx=$("#coNext");if(nx)nx.onclick=()=>{
  if(co.step===1){if(!co.slot){co.err="Scegli l'ora di ritiro o consegna.";return renderCheckout()}if(co.mode==="consegna"&&sub<zone.min){co.err=`Per ${zone.c} l'ordine minimo è ${eur(zone.min)}.`;return renderCheckout()}co.step=2;co.err="";return renderCheckout()}
  if(co.step===2){co.name=$("#f_name").value.trim();co.tel=$("#f_tel").value.trim();co.email=$("#f_email").value.trim();co.note=$("#f_note").value.trim();if(co.mode==="consegna"){co.addr=$("#f_addr").value.trim();co.citofono=$("#f_cit").value.trim()}
   if(!co.name||co.tel.replace(/\D/g,"").length<9||(co.mode==="consegna"&&!co.addr)){co.err="Servono nome, telefono"+(co.mode==="consegna"?" e indirizzo.":".");return renderCheckout()}co.step=3;co.err="";return renderCheckout()}
  if(co.step===3){co.step=4;return renderCheckout()}
  if(co.step===4){placeOrder();return}
 };
 if(co.step===2)setTimeout(()=>{const f=$("#f_name");if(f)f.focus()},30);
}
/* Rileggo lo stato prima di scrivere, così non sovrascrivo cambi fatti dal gestionale. */
function placeOrder(){loadState();seq++;const ord={n:seq,date:day,st:"new",mode:co.mode,cust:{name:co.name,tel:co.tel,email:co.email},rows:cartRows().map(r=>({id:r.p.id,q:r.q})),pay:co.pay,slot:co.slot,zone:co.mode==="consegna"?co.zone:null,addr:co.mode==="consegna"?co.addr+(co.citofono?" ("+co.citofono+")":""):null,note:co.note,created:nowHM(),paid:co.pay!=="cash"};ord.tot=orderTotal(ord);orders.unshift(ord);save(K.orders,orders);save(K.seq,seq);cart={};co.placed=ord;co.step=5;refreshShop();renderCheckout();}

/* Il gestionale in un'altra scheda ha cambiato qualcosa: ridisegno, tracking compreso. */
function onStateChanged(){refreshShop();if(co&&co.placed){const o=orders.find(x=>x.n===co.placed.n);if(o){co.placed=o;renderCheckout()}}}

/* ---------- avvio ---------- */
renderCats();renderFormule();refreshShop();
