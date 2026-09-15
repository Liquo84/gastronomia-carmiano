/* Dati di partenza: menù, formule catering, orari e impostazioni.
   Sono i valori di esempio del prototipo. Quando arriverà il database
   (fase 2) questo file sparisce e i dati vengono dal gestionale. */

const CATS=["Antipasti","Primi","Secondi","Contorni","Rustici e pizze","Dolci","Bevande"];
const ALL=["mar","mer","gio","ven","sab","dom"];

const SEED_PRODUCTS=[
 {id:1,cat:"Antipasti",n:"Pittule",d:"Frittelle di pasta lievitata, 10 pezzi. Disponibili con pomodoro o baccalà.",p:4.5,veg:true,days:ALL,limit:null},
 {id:2,cat:"Antipasti",n:"Polpette al sugo",d:"Di vitello, 6 pezzi con il loro sugo.",p:6.5,days:ALL,limit:30},
 {id:3,cat:"Antipasti",n:"Puccia farcita",d:"Puccia leccese con capocollo, caciocavallo e friarielli.",p:5,days:ALL,limit:null},
 {id:4,cat:"Antipasti",n:"Frisella al pomodoro",d:"Pomodoro, capperi, origano e olio.",p:3.5,veg:true,days:ALL,limit:null},
 {id:5,cat:"Primi",n:"Ciceri e tria",d:"Ceci e tagliatelle, in parte fritte.",p:8,veg:true,hot:true,days:["mar","gio","sab"],limit:25},
 {id:6,cat:"Primi",n:"Sagne 'ncannulate al sugo",d:"Pasta fresca attorcigliata, sugo di pomodoro e ricotta forte.",p:7.5,veg:true,days:["mer","ven","dom"],limit:25},
 {id:7,cat:"Primi",n:"Orecchiette con le cime di rapa",d:"Con acciughe e mollica tostata.",p:8,days:ALL,limit:30},
 {id:8,cat:"Primi",n:"Lasagna della domenica",d:"Ragù di carne e besciamella.",p:7.5,days:["dom"],limit:40},
 {id:9,cat:"Secondi",n:"Pezzetti di cavallo al sugo",d:"Cotti a lungo.",p:10,days:["sab","dom"],limit:15},
 {id:10,cat:"Secondi",n:"Parmigiana di melanzane",d:"Melanzane fritte, pomodoro, mozzarella e basilico.",p:7,veg:true,hot:true,days:ALL,limit:20},
 {id:11,cat:"Secondi",n:"Bombette di Cisternino",d:"Involtini di capocollo e caciocavallo, 6 pezzi al forno.",p:9,days:["ven","sab","dom"],limit:20},
 {id:12,cat:"Secondi",n:"Baccalà fritto",d:"In pastella, con limone.",p:9.5,days:["ven"],limit:15},
 {id:13,cat:"Contorni",n:"Fave e cicorie",d:"Purè di fave con cicorie ripassate.",p:5.5,veg:true,days:ALL,limit:null},
 {id:14,cat:"Contorni",n:"Patate al forno",d:"Con rosmarino.",p:3.5,veg:true,days:ALL,limit:null},
 {id:15,cat:"Contorni",n:"Peperoni arrostiti",d:"Con aglio e prezzemolo.",p:4,veg:true,days:ALL,limit:null},
 {id:16,cat:"Rustici e pizze",n:"Rustico leccese",d:"Sfoglia ripiena di besciamella, pomodoro e mozzarella.",p:2,days:ALL,limit:null},
 {id:17,cat:"Rustici e pizze",n:"Pizza rustica",d:"Teglia da 8 porzioni, pomodoro e mozzarella.",p:12,veg:true,days:ALL,limit:10},
 {id:18,cat:"Rustici e pizze",n:"Panzerotto",d:"Fritto, ripieno di pomodoro e mozzarella.",p:2.5,veg:true,days:ALL,limit:null},
 {id:19,cat:"Dolci",n:"Pasticciotto",d:"Frolla ripiena di crema pasticcera.",p:1.8,veg:true,days:ALL,limit:null},
 {id:20,cat:"Dolci",n:"Tiramisù",d:"Porzione singola.",p:4,veg:true,days:ALL,limit:20},
 {id:21,cat:"Bevande",n:"Acqua 50 cl",d:"Naturale o frizzante.",p:1,veg:true,days:ALL,limit:null},
 {id:22,cat:"Bevande",n:"Birra Raffo 33 cl",d:"",p:2.5,days:ALL,limit:null},
 {id:23,cat:"Bevande",n:"Negroamaro 75 cl",d:"",p:9,days:ALL,limit:null},
];

const FORMULE=[
 {n:"Aperitivo e finger food",pp:14,l:["Pittule, rustici, pucce mignon","Frise e taralli","3 assaggi caldi","Acqua e vino"]},
 {n:"Buffet completo",pp:22,l:["6 antipasti caldi e freddi","2 primi","1 secondo con contorni","Dolce, acqua e vino"]},
 {n:"Pranzo o cena servito",pp:32,l:["Antipasto misto al tavolo","Primo e secondo a scelta","Contorni, dolce, caffè","Personale di sala e stoviglie"]},
];

/* Lunedì chiuso. Due turni al giorno. */
const HOURS_DEF={lun:null,mar:[["11:30","14:30"],["18:00","21:30"]],mer:[["11:30","14:30"],["18:00","21:30"]],gio:[["11:30","14:30"],["18:00","21:30"]],ven:[["11:30","14:30"],["18:00","22:00"]],sab:[["11:30","14:30"],["18:00","22:00"]],dom:[["11:30","15:00"],["18:00","21:30"]]};

const SETTINGS_DEF={
 prep:20,            // minuti minimi fra ordine e ritiro, per il giorno stesso
 pause:false,        // prenotazioni sospese
 cap:6,              // ordini massimi per fascia di 15 minuti
 cutoff:"20:00",     // per domani si ordina entro quest'ora di oggi
 sameDay:true,       // si accetta il giorno stesso?
 sameDayCutoff:"10:00",
 zones:[{c:"Carmiano",cost:0,min:10},{c:"Magliano e Novoli",cost:2.5,min:15},{c:"Leverano",cost:3.5,min:20},{c:"Monteroni",cost:3.5,min:20}],
 pay:{card:true,satispay:true,cash:true},
 hours:HOURS_DEF
};
