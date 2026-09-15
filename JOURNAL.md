# JOURNAL — Sito ordini gastronomia Carmiano

Registro cronologico delle **decisioni** e di come sono andate.
Le regole stabili stanno in `CLAUDE.md`, il progetto in `PROGETTO.md`. Qui c'è la storia.

Voce nuova in cima. Formato: **cosa**, **perché**, **esito** (aggiornato dopo).

---

## Stato al 14/09/2026

| | |
|---|---|
| Sito | Versione di prova online su GitHub Pages, dati nel browser di chi guarda |
| Indirizzo | https://liquo84.github.io/gastronomia-carmiano/ (gestionale: `/gestionale.html`) |
| Pubblicazione | Automatica a ogni push su `main` |
| Nome | «Bottega Leverano 29», segnaposto |
| Testi | Ridotti all'essenziale il 14/09; da rivedere con il nome vero |
| Costo | Zero |

---

## Questioni aperte

- [ ] **Nome e identità** dell'attività. La palette panna è confermata.
- [ ] **Orario di chiusura prenotazioni**: 20:00 della sera prima va bene? E il giorno stesso si accetta (fino alle 10:00) o no?
- [ ] **Consegna a domicilio** nella prima fase, o solo ritiro?
- [ ] **Contanti**: sempre, solo per il ritiro, o solo per clienti già affidabili?
- [ ] **Fiscalità**: scontrino alla consegna dal registratore di cassa, o collegamento RT? Da chiarire col commercialista.
- [ ] **Testi** di tutto il sito, da riscrivere quando ci sarà il nome.
- [ ] **Fase 2**: database e login. Supabase resta la proposta (stesso impianto del CRM preventivi), va confermata.

---

## 15/09 — Testi riscritti e collaudo alla cieca

**Cosa.** Passaggio del copywriter su negozio, checkout, menù di esempio e gestionale (commit
f6a69f3). L'ordine del cliente si chiama sempre «ordine», mai più «prenotazione». Dal menù sono
spariti i vanti («appena sfornato», «della casa»). Gli errori ora dicono cosa fare. Creata `VOCE.md`.
**Collaudo alla cieca.** Davide ha scelto la versione vecchia per il negozio e per il gestionale,
la nuova per il checkout. **Non promosso.** Frase segnalata nella nuova: «Ti restituiamo quello
che hai pagato», diventata «Ti rimborsiamo». Le varianti delle pittule sono tornate come
«Disponibili con pomodoro o baccalà».
**Da fare.** Secondo giro su negozio e gestionale: tenere i dettagli e le immagini di cucina dei
testi vecchi, togliere solo i vanti, poi un nuovo test su quelle due pagine.

## 14/09 — Il giorno si sceglie nel checkout

**Cosa.** Via la fila dei giorni dalla vetrina. Il menù mostra tutti i piatti in vendita; quelli
che non si fanno tutti i giorni portano l'etichetta «Solo ven, sab, dom». Il giorno si sceglie
al primo passo del checkout, insieme a ritiro/consegna e ora. Scelto il giorno, i piatti che
non si fanno o che superano le porzioni rimaste vengono elencati, con il pulsante «Sistema il
carrello» che li toglie o li riduce.
**Perché.** Davide: «Eliminerei anche i giorni del calendario. Lasciamo la scelta del giorno
solo in fase di checkout». Meno cose da capire prima di vedere i piatti.
**Il rovescio.** Prima il cliente vedeva solo ciò che si cucina il giorno scelto; ora può
mettere nel carrello la lasagna e scoprire al checkout che domani non si fa. L'etichetta e
il pulsante «Sistema il carrello» servono a questo. Se in prova si vedrà che dà fastidio,
si torna a mostrare il giorno, ma sul carrello e non in cima alla pagina.
**Esito.** Online.

## 14/09 — Negozio ridotto all'essenziale

**Cosa.** Tolti dal negozio la spiegazione sotto il titolo, i tre bollini e il riquadro con
orari, consegna e pagamenti; i giorni mostrano solo nome e data (il testo compare solo se
chiuso o per l'eccezione di oggi); niente conteggio piatti per categoria, niente «più
prenotato», «esaurito» secco; via i suggerimenti nel carrello e nel checkout, descrizioni dei
pagamenti a una riga, tracking senza sottotitoli. Modulo catering da 8 campi a 6, formule
con una riga invece dell'elenco.
**Perché.** Davide, dopo averlo visto sul telefono: «troppo testo, non vorrei mandare il
cliente in overwhelming». Sul telefono il menù ora entra nella prima schermata.
**Non toccato.** Il gestionale: è per la bottega, non per il cliente.
**Esito.** Online. Le informazioni tolte (cutoff, consegna, pagamenti) restano dove servono:
sotto il giorno scelto, nel carrello e nei passi del checkout.

## 14/09 — Da artifact a repository su GitHub

**Cosa.** Il prototipo (un solo file HTML pubblicato come artifact il 13/09) è diventato un
repository con la stessa struttura del sito di Maurizio: cartella `sito/` pubblicata da
GitHub Pages con workflow automatico. Il file unico è stato diviso in negozio, gestionale,
stile, dati e regole comuni. La scheda «Progetto» dell'artifact è diventata `PROGETTO.md`.
**Perché.** Davide ha approvato l'idea («l'idea è comunque buona, procederei a costruirla»)
e ha chiesto di procedere via GitHub come per Maurizio. Un indirizzo pubblico senza login
si fa provare a Luca e alla bottega; l'artifact chiedeva l'accesso a claude.ai.
**Scelte tecniche.** Niente framework: la struttura a file separati è già quella su cui
innestare il database in fase 2 (`comune.js` è l'unico punto che parla con i dati).
Negozio e gestionale in due schede si aggiornano a vicenda tramite l'evento `storage`,
così l'ordine fatto dal negozio compare nel gestionale senza ricaricare, e il tracking
del cliente avanza quando la bottega cambia stato. La stampa della lista di produzione
usa la stampa vera del browser, con un foglio di stile dedicato.
**Esito.** Online dal primo workflow (20 secondi). Al controllo sul sito pubblico due difetti,
corretti subito: a 375 px la riga scorrevole delle categorie allargava la griglia del negozio
(la pagina misurava 731 px), e nella bacheca ordini una colonna vuota stirava l'intestazione.
Ordine di prova #149 fatto dal negozio online e comparso nel gestionale.

## 13/09 — Seconda versione del prototipo: panna e pre-ordini

**Cosa.** Palette rifatta in panna (Davide: «i colori non centrano nulla, io giocherei col
colore panna e simili»); il negozio ricostruito attorno alla scelta del giorno, con chiusura
prenotazioni la sera prima e tetti di porzioni per piatto; gestionale aperto senza finto login,
con la lista di produzione come prima pagina.
**Perché.** «Vendere sul venduto»: la piattaforma deve spingere sui pre-ordini. Nella prima
versione il gestionale stava dietro un pulsante «Entra» e Davide non l'ha trovato.
**Esito.** Approvato il 14/09, con i testi da rivedere.
