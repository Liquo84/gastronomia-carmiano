# Sito ordini gastronomia Carmiano

## Cos'è
Sito di pre-ordine per la gastronomia d'asporto con catering di Via Leverano 29/A, Carmiano (LE):
l'attività di DB & G che Davide e Luca (Salento Energia / SEESCo) stanno rilevando.
Il nome «Bottega Leverano 29» è un **segnaposto**: il nome vero non è ancora deciso.

Il modello è **vendere sul venduto**: il cliente sceglie il giorno, ordina entro la sera prima,
la bottega la mattina sa esattamente cosa cucinare. Non è un menù sempre disponibile.
Il ragionamento completo sta in `PROGETTO.md`.

## Stato
Fase 1, **versione di prova online**: negozio e gestionale funzionano davvero nel browser,
ma i dati (menù, ordini, impostazioni) stanno nel localStorage di chi guarda. Niente database,
niente pagamenti veri, niente WhatsApp. Serve a far provare il flusso e a decidere le regole.

## Vincoli e regole
- **Si pubblica solo la cartella `sito/`.** Il resto della cartella non va online.
- **Niente framework, niente build.** HTML, CSS e JavaScript puri, aperti dal file: ogni pagina
  carica `assets/dati.js` → `assets/comune.js` → il proprio modulo. L'ordine conta.
- **La palette è panna**: avorio, burro, caffè, con salvia/ocra/mattone solo per gli stati.
  Un solo tema, niente variante scura. Decisione di Davide del 13/09/2026, non riaprirla.
- **Il gestionale è sempre raggiungibile**, senza finte schermate di accesso. Il login vero
  arriva con il database (fase 2). Il link «Gestionale» in alto nel negozio va tolto quando
  il sito diventa pubblico per i clienti.
- **I testi sono provvisori** (Davide, 14/09: «sicuramente da rivedere»). Si cambiano senza
  chiedere finché il sito è di prova; quando ci sarà il nome vero si fa un giro completo.
- Le regole del pre-ordine (chiusura alle 20:00, giorno stesso fino alle 10:00, tetti per piatto,
  fasce da 15 minuti) sono in `comune.js` e si cambiano dalle Impostazioni del gestionale.
  Non duplicarle altrove.
- La pubblicazione è automatica via GitHub Pages, workflow `.github/workflows/pubblica.yml`.
  Le modifiche verificate si caricano su `main` senza chiedere, come per il sito di Maurizio:
  poi si dice a Davide com'è andata.

## Dove stanno le cose
- `sito/index.html` — il negozio: giorno, menù, carrello, checkout, modulo catering.
- `sito/gestionale.html` — il gestionale: produzione, ordini, menù e giorni, catering, incassi, impostazioni.
  Si apre direttamente su una pagina con `#orders`, `#menu`, ecc.
- `sito/assets/stile.css` — tutto lo stile, palette in cima.
- `sito/assets/dati.js` — menù, formule catering, orari e impostazioni di partenza (esempi).
- `sito/assets/comune.js` — stato condiviso e **le regole del pre-ordine**. Negozio e gestionale
  in due schede si aggiornano a vicenda (evento `storage`).
- `sito/assets/negozio.js`, `sito/assets/gestionale.js` — le due interfacce.
- `PROGETTO.md` — documento di progetto: modello, regole, dati, stack, fasi, decisioni aperte.
- `JOURNAL.md` — diario di lavoro: leggerlo in apertura, aggiornarlo quando si decide qualcosa.

## Come si verifica
- `node --check sito/assets/*.js` per la sintassi.
- Aprire `sito/index.html` e `sito/gestionale.html` nel browser, fare un ordine dal negozio e
  vederlo comparire nel gestionale (anche in due schede aperte insieme).
- Controllare a 1280 e a 375 px che nulla sbordi.

## Prossime fasi
1. Decidere nome, orari di chiusura prenotazioni, consegna sì/no, politica contanti (vedi `PROGETTO.md`).
2. Database e accesso (Supabase): i dati escono dal browser, il gestionale ha un login.
3. Pagamenti veri (Stripe) e avvisi WhatsApp.
