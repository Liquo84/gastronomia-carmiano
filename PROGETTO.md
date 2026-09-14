# Un negozio che cucina sul venduto

*Documento di progetto · settembre 2026*

Non un menù sempre disponibile con lo sperpero della vetrina, ma una piattaforma di prenotazione:
il cliente ordina per un giorno, la bottega chiude le prenotazioni la sera prima e la mattina sa
esattamente cosa cucinare, per chi e quanto incassa.

## Le tre facce del sistema

- **Negozio (cliente).** Si sceglie prima il giorno, poi il menù di quel giorno. Carrello,
  checkout in 4 passi, tracking dell'ordine, modulo catering. Pensato per il telefono.
- **Gestionale (bottega).** Lista di produzione per giorno (il cuore), bacheca ordini, menù con
  giorni e limiti di porzioni, catering, incassi, orari di chiusura prenotazioni, zone, pausa.
- **Servizi esterni.** Stripe (carta, Apple/Google Pay, Satispay), WhatsApp/SMS al cliente a ogni
  cambio di stato e come promemoria la sera prima, stampante comande, bottone «Ordina» su Google.

## Come funziona il pre-ordine

| Quando | Cosa succede |
|---|---|
| Sera prima | **La bottega pubblica.** Il menù dei prossimi giorni è già deciso: ogni piatto ha i giorni in cui si fa e, se serve, un tetto di porzioni. |
| Fino alle 20:00 | **I clienti prenotano.** Scelgono il giorno, i piatti, l'ora di ritiro o consegna. Al tetto di porzioni il piatto si chiude da solo. |
| 20:00 | **Chiusura prenotazioni.** La lista di produzione si congela. Promemoria automatico ai clienti, comanda cumulativa per la cucina. |
| Mattina | **Si cucina il venduto.** Quantità esatte per piatto. Gli ordini avanzano: confermato → pronto → ritirato o consegnato. |
| Stesso giorno | **Eccezione governata.** Fino alle 10:00 si può ancora ordinare per oggi, ma solo i piatti già in produzione e nel margine impostato. |

Perché conviene: il costo del venduto scende perché sparisce l'invenduto, la cassa è nota la sera
prima, e i pagamenti online anticipano l'incasso. La domanda si «educa»: chi vuole la parmigiana la
prenota, non passa sperando di trovarla.

## Regole che il sistema fa rispettare

- **Chiusura prenotazioni.** Per il giorno D si ordina fino a un'ora fissa del giorno D−1 (default
  20:00). Il giorno stesso resta aperto fino a un secondo orario (default 10:00) solo sui piatti già
  in produzione.
- **Tetto di porzioni.** Per piatto e per giorno. Raggiunto il tetto, il piatto mostra «esaurito per
  questo giorno» ma resta prenotabile per gli altri.
- **Giorni di produzione.** Ogni piatto ha i suoi giorni: la lasagna la domenica, i pezzetti il
  sabato. Il cliente vede solo ciò che quel giorno si cucina.
- **Fasce di ritiro.** A passi di 15 minuti dentro gli orari del giorno, con un massimo di ordini
  per fascia per non intasare il banco.
- **Zone di consegna.** Per comune: costo, minimo d'ordine. Fuori zona il checkout propone il ritiro.
- **Pagamenti.** Carta e Satispay incassati alla prenotazione; contanti ammessi, ma il gestionale li
  evidenzia perché un ordine in contanti non ritirato è cibo cucinato a vuoto. Opzione futura:
  contanti solo sopra una soglia di affidabilità del cliente.
- **Catering.** Mai un acquisto diretto: richiesta → preventivo con acconto (30%) via link →
  conferma, con la data bloccata in agenda.

## Modello dei dati

| Entità | Campi |
|---|---|
| Piatto | nome, descrizione, prezzo, categoria, allergeni, foto, giorni[] (lun…dom), tetto_porzioni, esaurito_oggi, nascosto |
| Ordine | numero, giorno, fascia, cliente, righe[], modalità (ritiro/consegna), zona, indirizzo, subtotale, consegna, totale, pagamento, pagato, stato, note |
| Lista di produzione | giorno · per piatto: porzioni ordinate, tetto, restano; stato (aperta/congelata). *Vista calcolata, non tabella.* |
| Richiesta catering | tipo_evento, data, persone, formula, luogo, note, stato, importo, acconto |
| Cliente | nome, telefono, email, indirizzi[], storico, ordini_non_ritirati (contanti) |
| Impostazioni | orari[7], chiusura_prenotazioni, chiusura_stesso_giorno, tempo_prep, zone[], pagamenti, tetto_per_fascia, prenotazioni_sospese |

## Stack

**Oggi (fase 1):** HTML, CSS e JavaScript puri su GitHub Pages, dati nel browser. Costo zero,
serve a provare il flusso e fissare le regole.

**Proposta per le fasi successive:** il sito statico resta com'è e si collega a **Supabase**
(Postgres, autenticazione, tempo reale) per i dati e il login del gestionale, e a **Stripe** per i
pagamenti (funzioni serverless di Supabase per creare le sessioni di pagamento). È lo stesso impianto
del CRM preventivi. Notifiche via WhatsApp Business API o SMS. Costo di esercizio sotto i 30 € al
mese più le commissioni Stripe (1,5% + 0,25 € sulle carte europee).

Alternativa senza codice: Shopify con un'app di pre-ordine per data. Parte prima, ma la lista di
produzione per giorno e i tetti di porzioni per giorno non esistono nativamente e vanno simulati
con app a pagamento.

## Fasi di lavoro

| Fase | Cosa esce | Stima |
|---|---|---|
| 1 · Pre-ordine (prova) | Negozio con scelta del giorno, menù per giorno, carrello, checkout, gestionale con lista di produzione e bacheca ordini. **Fatto**, dati nel browser. | — |
| 2 · Dati veri | Database, login del gestionale, ordini che arrivano in tempo reale, WhatsApp al cliente. | 3–4 settimane |
| 3 · Operatività | Chiusura prenotazioni automatica con promemoria, stampante comande, ruoli (titolare, banco, cucina), orari modificabili con ferie. | 2 settimane |
| 4 · Catering | Preventivo con acconto via link, agenda eventi. | 1–2 settimane |
| 5 · Fidelizzazione | Account cliente con riordino in un tocco, «menù della settimana» via WhatsApp, abbonamento pranzo per uffici, statistiche mensili. | 2 settimane |

## Cose da decidere prima della fase 2

- Nome e identità: «Bottega Leverano 29» è un segnaposto. La palette panna è confermata.
- Orario di chiusura prenotazioni: 20:00 della sera prima? E il giorno stesso si accetta o no?
- Consegna con mezzi propri o solo ritiro nella prima fase?
- Contanti: sempre, solo per il ritiro, o solo per clienti già affidabili?
- Fiscalità: scontrino dal registratore di cassa alla consegna o collegamento RT? Da chiarire col commercialista.
