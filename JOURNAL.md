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
| Testi | Provvisori, da rivedere |
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
**Esito.** Da verificare all'indirizzo pubblico dopo il primo workflow.

## 13/09 — Seconda versione del prototipo: panna e pre-ordini

**Cosa.** Palette rifatta in panna (Davide: «i colori non centrano nulla, io giocherei col
colore panna e simili»); il negozio ricostruito attorno alla scelta del giorno, con chiusura
prenotazioni la sera prima e tetti di porzioni per piatto; gestionale aperto senza finto login,
con la lista di produzione come prima pagina.
**Perché.** «Vendere sul venduto»: la piattaforma deve spingere sui pre-ordini. Nella prima
versione il gestionale stava dietro un pulsante «Entra» e Davide non l'ha trovato.
**Esito.** Approvato il 14/09, con i testi da rivedere.
