/* Regole del pre-ordine e stato condiviso fra negozio e gestionale.
   Oggi lo stato vive nel localStorage del browser (stessa origine, quindi
   negozio e gestionale aperti in due schede si vedono a vicenda).
   In fase 2 queste funzioni parleranno con il database. */

/* ---------- formattazione e date ---------- */
const eur=v=>v.toLocaleString("it-IT",{style:"currency",currency:"EUR"});
const pad=n=>String(n).padStart(2,"0");
const nowHM=()=>{const d=new Date();return pad(d.getHours())+":"+pad(d.getMinutes())};
const DAYS=["dom","lun","mar","mer","gio","ven","sab"];
const DN={lun:"Lunedì",mar:"Martedì",mer:"Mercoledì",gio:"Giovedì",ven:"Venerdì",sab:"Sabato",dom:"Domenica"};
const dkey=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const addDays=n=>{const d=new Date();d.setDate(d.getDate()+n);d.setHours(0,0,0,0);return d};
const TODAY=dkey(addDays(0)),TOMORROW=dkey(addDays(1));
const wd=k=>DAYS[new Date(k+"T00:00").getDay()];
const dlabel=(k,long)=>{const d=new Date(k+"T00:00");if(k===TODAY)return"Oggi";if(k===TOMORROW)return"Domani";return d.toLocaleDateString("it-IT",long?{weekday:"long",day:"numeric",month:"long"}:{weekday:"short",day:"numeric"})};
const dfull=k=>{const d=new Date(k+"T00:00");return d.toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})};
function nextDays(n){const out=[];for(let i=0;i<n;i++)out.push(dkey(addDays(i)));return out}

/* ---------- memoria locale ---------- */
const K={products:"bottega.products",settings:"bottega.settings",orders:"bottega.orders",catreqs:"bottega.catreqs",seq:"bottega.seq",cart:"bottega.cart",mode:"bottega.mode",day:"bottega.day",aday:"bottega.aday"};
const load=(k,def)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):def}catch(e){return def}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function clearAll(){Object.values(K).forEach(k=>{try{localStorage.removeItem(k)}catch(e){}})}

let products,settings,orders,catReqs,seq;
function loadState(){
 products=load(K.products,SEED_PRODUCTS);
 settings=Object.assign({},SETTINGS_DEF,load(K.settings,{}));
 orders=load(K.orders,null);
 catReqs=load(K.catreqs,null);
 seq=load(K.seq,148);
 if(!orders){orders=seedOrders();save(K.orders,orders)}
 if(!catReqs){catReqs=seedCat();save(K.catreqs,catReqs)}
}
function persistState(){save(K.products,products);save(K.settings,settings);save(K.orders,orders);save(K.catreqs,catReqs);save(K.seq,seq)}

/* Ordini e richieste di esempio, marcati ex:true per riconoscerli. */
function seedOrders(){
 const mk=(n,date,st,mode,cust,rows,pay,slot)=>({n,date,st,mode,cust,rows:rows.map(([id,q])=>({id,q})),pay,slot,paid:pay!=="cash",ex:true,created:nowHM(),zone:mode==="consegna"?"Carmiano":null,addr:mode==="consegna"?"Via Roma 12, Carmiano":null});
 const d2=dkey(addDays(2)),d3=dkey(addDays(3));
 return [
  mk(140,TODAY,"done","ritiro",{name:"Anna Perrone",tel:"347 000 0001"},[[8,2],[19,4]],"card","12:30"),
  mk(141,TODAY,"done","consegna",{name:"Giuseppe Miglietta",tel:"329 000 0002"},[[8,2],[14,1],[21,2]],"cash","13:00"),
  mk(142,TODAY,"ready","ritiro",{name:"Lucia Rizzo",tel:"340 000 0003"},[[10,1],[13,1],[16,4]],"satispay","19:00"),
  mk(143,TODAY,"prep","consegna",{name:"Marco Calò",tel:"338 000 0004"},[[7,2],[11,1],[22,2]],"card","19:15"),
  mk(144,TODAY,"prep","ritiro",{name:"Federica Greco",tel:"333 000 0005"},[[9,2],[6,1],[20,2]],"cash","19:30"),
  mk(145,d2,"new","ritiro",{name:"Antonio Valzano",tel:"347 000 0006"},[[5,2],[10,2],[23,1]],"card","13:00"),
  mk(146,d2,"new","consegna",{name:"Studio Manca",tel:"0832 000 111"},[[5,6],[7,4],[14,6],[21,10]],"card","12:45"),
  mk(147,d2,"new","ritiro",{name:"Rosaria Capone",tel:"340 000 222"},[[2,2],[13,2],[17,1]],"cash","19:30"),
  mk(148,d3,"new","ritiro",{name:"Paolo De Giorgi",tel:"333 000 333"},[[6,3],[10,3],[20,3]],"satispay","13:15"),
 ].map(o=>{o.tot=orderTotal(o);return o});
}
function seedCat(){return [
 {id:1,tipo:"Pranzo o cena aziendale",formula:"Buffet completo",data:"2026-09-26",persone:40,nome:"Studio Tecnico Manca",tel:"0832 000 111",luogo:"Sede, Monteroni",note:"Due vegetariani, un celiaco.",st:"preventivo",importo:880,ex:true},
 {id:2,tipo:"Compleanno o festa in famiglia",formula:"Aperitivo e finger food",data:"2026-10-04",persone:25,nome:"Rosaria Capone",tel:"340 000 222",luogo:"A casa, Carmiano",note:"",st:"nuova",ex:true},
 {id:3,tipo:"Battesimo / comunione",formula:"Pranzo o cena servito",data:"2026-10-18",persone:60,nome:"Fam. De Giorgi",tel:"333 000 333",luogo:"Masseria, Leverano",note:"Serve personale di sala.",st:"confermata",importo:1920,ex:true},
];}
function orderTotal(o){const sub=o.rows.reduce((s,r)=>{const p=products.find(x=>x.id===r.id);return s+(p?p.p*r.q:0)},0);const z=o.mode==="consegna"?(settings.zones.find(z=>z.c===o.zone)||settings.zones[0]).cost:0;return {sub,del:z,tot:sub+z}}

/* ---------- DOM ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let toastT;function toast(m){document.querySelectorAll(".toast").forEach(e=>e.remove());const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);clearTimeout(toastT);toastT=setTimeout(()=>t.remove(),2800)}
/* Contatori "nuovi" nella barra e nel menù laterale: presenti solo in alcune pagine. */
function updateDots(){
 const n=orders.filter(o=>o.st==="new").length,c=catReqs.filter(r=>r.st==="nuova").length;
 const el=id=>document.getElementById(id);
 const a=el("cntNew");if(a){a.textContent=n;a.classList.toggle("hide",!n)}
 const b=el("cntCat");if(b){b.textContent=c;b.classList.toggle("hide",!c)}
 const d=el("dotNew");if(d)d.classList.toggle("hide",!n);
}

/* ---------- le regole del pre-ordine ---------- */
const hoursOf=k=>settings.hours[wd(k)];
function isOpenNow(){const h=hoursOf(TODAY);if(!h)return false;const t=nowHM();return h.some(([a,b])=>t>=a&&t<=b)}
/* Stato prenotazioni per un giorno: {open, why}.
   Domani si chiude alle `cutoff` di oggi; oggi si accetta solo fino a `sameDayCutoff`. */
function orderState(k){
 if(settings.pause)return{open:false,why:"prenotazioni sospese"};
 if(!hoursOf(k))return{open:false,why:"chiuso"};
 const t=nowHM();
 if(k===TODAY){if(!settings.sameDay)return{open:false,why:"solo su prenotazione"};return t<settings.sameDayCutoff?{open:true,why:"fino alle "+settings.sameDayCutoff}:{open:false,why:"chiuse alle "+settings.sameDayCutoff}}
 if(k===TOMORROW)return t<settings.cutoff?{open:true,why:"entro le "+settings.cutoff+" di oggi"}:{open:false,why:"chiuse alle "+settings.cutoff};
 return{open:true,why:"aperte"};
}
/* Porzioni già prenotate di un piatto in un giorno (gli ordini rifiutati non contano). */
function sold(pid,k){return orders.filter(o=>o.date===k&&o.st!=="rej").reduce((s,o)=>s+o.rows.filter(r=>r.id===pid).reduce((a,r)=>a+r.q,0),0)}
function remaining(p,k){if(p.limit==null)return Infinity;return Math.max(0,p.limit-sold(p.id,k))}
/* Il piatto si fa quel giorno? Nascosto, giorni di produzione, esaurito oggi. */
function offeredOn(p,k){return !p.hidden&&(!p.days||!p.days.length||p.days.includes(wd(k)))&&!(k===TODAY&&p.out)}
/* Fasce di 15 minuti dentro gli orari del giorno, con il tetto di ordini per fascia. */
function slotsFor(k){const h=hoursOf(k);if(!h)return[];const out=[];const t=nowHM();const [th,tm]=t.split(":").map(Number);const minStart=k===TODAY?th*60+tm+settings.prep:0;
 h.forEach(([a,b])=>{let [ah,am]=a.split(":").map(Number);let [bh,bm]=b.split(":").map(Number);for(let m=ah*60+am;m<=bh*60+bm;m+=15){if(m<minStart)continue;const s=pad(Math.floor(m/60))+":"+pad(m%60);const used=orders.filter(o=>o.date===k&&o.slot===s&&o.st!=="rej").length;out.push({s,full:used>=settings.cap})}});return out}

/* Se l'altra scheda (negozio o gestionale) cambia qualcosa, ricarico e ridisegno. */
window.addEventListener("storage",e=>{if(e.key&&!e.key.startsWith("bottega."))return;loadState();if(typeof onStateChanged==="function")onStateChanged()});

loadState();
