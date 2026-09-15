# VOCE — Sito ordini gastronomia Carmiano

> Scheda del copywriter per questo progetto. La legge prima di scrivere qualunque testo.
> Ogni fatto ha una fonte. Se un fatto non è qui, non va nei testi: si chiede.
> Aggiornata: 2026-09-15

## Chi è
Gastronomia d'asporto con catering in Via Leverano 29/A a Carmiano (LE). Si ordina online per un
giorno preciso entro la sera prima; la mattina la cucina prepara solo quello che è stato ordinato.
Si ritira in bottega o si riceve a casa, a Carmiano e nei paesi vicini. Fa anche catering per feste
ed eventi, su preventivo.

**Tipo di voce:** attività locale, clienti privati (negozio) · strumento interno di bottega (gestionale)

**Nome:** «Bottega Leverano 29» è un **segnaposto** (CLAUDE.md). Usarlo solo dove c'è già
(titolo, intestazione), non costruirci sopra frasi o giochi di parole.

## Chi legge
- **Negozio:** gente di Carmiano e dei paesi vicini (Magliano, Novoli, Leverano, Monteroni) che vuole
  il pranzo o la cena pronti senza cucinare. Arriva quasi sempre dal telefono. Davide il 14/09: «troppo
  testo, non vorrei mandare il cliente in overwhelming». Quello che lo frena: capire che si ordina per
  un altro giorno e non per subito.
- **Gestionale:** il titolare e chi lavora al banco o in cucina. Lo usano di corsa, fra una comanda e
  l'altra. Serve sapere cosa cucinare, chi passa e quando, chi deve ancora pagare.

## Tono
- **Persona:** tu nel negozio (già in uso in tutto il sito). Nel gestionale si parla alla bottega in modo
  diretto: frasi senza soggetto o il tu da collega («togli quelli in cui non si fa»), mai l'infinito da
  modulo («togliere…»). Il tu nel gestionale era nei testi che hanno vinto il collaudo del 15/09.
- **Registro:** come parla chi sta al banco di una gastronomia di paese: frasi corte, cortese, pratico.
  Nessuna formula da brochure. Nel gestionale, parole da cucina e da cassa.
- **Suona così:**
  - «Ordina entro le 20:00 e domani lo trovi pronto.»
  - «Il carrello è vuoto.»
  - «Per Leverano l'ordine minimo è 20 €.»
- **Non suona così:**
  - «Scopri i sapori autentici della tradizione salentina!»
  - «Operazione completata con successo.»

## Parole
- **Da usare:** ordine, ordinare; ritiro, ritirare; consegna; bottega; piatto; porzioni; menù; comanda;
  lista di produzione; chiusura degli ordini.
- **Vietate:** «autentico», «genuino», «tradizione», «sapori», «esperienza», «passione», «scopri»,
  «delizioso», «fatto con amore», «nel cuore del Salento».
- **Nomi fissi:** carrello (prima del checkout) · ordine (dopo averlo mandato; oggi il sito alterna
  «ordine» e «prenotazione»: una sola parola per oggetto) · ritiro / consegna · bottega · richiesta di
  preventivo (catering).

## Banca fatti
| Fatto | Fonte |
|---|---|
| Indirizzo: Via Leverano 29/A, Carmiano (LE) | CLAUDE.md, memoria progetto |
| Per il giorno dopo si ordina entro le 20:00 del giorno prima (modificabile: variabile `settings.cutoff`) | comune.js / dati.js |
| Per il giorno stesso si ordina fino alle 10:00, se attivo (`settings.sameDay`, `settings.sameDayCutoff`) | comune.js / dati.js |
| Ogni piatto ha i suoi giorni e un tetto di porzioni per giorno | PROGETTO.md, dati.js |
| Il giorno si sceglie nel checkout; i piatti incompatibili si tolgono con «Sistema il carrello» | CLAUDE.md, JOURNAL 14/09 |
| Fasce orarie da 15 minuti, massimo ordini per fascia | comune.js |
| Lunedì chiuso; due turni al giorno (orari di esempio) | dati.js |
| Consegna: Carmiano gratis (min. 10 €), Magliano e Novoli 2,50 €, Leverano e Monteroni 3,50 € (esempi) | dati.js |
| Pagamenti: carta (Visa, Mastercard, Apple Pay, Google Pay), Satispay, contanti al ritiro o alla consegna | PROGETTO.md, negozio.js |
| Avvisi al cliente su WhatsApp a ogni cambio di stato (previsto, fase 2) | PROGETTO.md |
| Si può annullare fino alla chiusura degli ordini | negozio.js (regola già esposta nel sito) |
| Catering: da 15 persone, preventivo entro 24 ore, acconto del 30% via link | index.html, PROGETTO.md |
| Formule catering: aperitivo e finger food da 14 €, buffet completo da 22 €, pranzo o cena servito da 32 € a persona (esempi) | dati.js |
| Il menù (piatti, descrizioni, prezzi) è di esempio e si gestisce dal gestionale | dati.js |
| Il sito è una versione di prova: nessun addebito, dati nel browser | CLAUDE.md |

**Fatti mancanti (segnaposto in uso):**
- Nome vero dell'attività: resta «Bottega Leverano 29».
- Telefono: `0832 000 000` è finto, lasciarlo com'è finché Davide non dà il numero.
- Nessuna storia, anno di apertura, nome del cuoco o provenienza degli ingredienti: **non esistono in banca fatti, non scriverli**.

## Regole speciali del progetto
- Orari, importi, comuni e giorni arrivano da variabili (`${settings.cutoff}`, `${eur(...)}`, `${zone.c}`…):
  vanno preservate, mai scritte come numeri fissi.
- Poco testo nel negozio: la prima schermata del telefono deve mostrare il menù.
- Bottoni corti: sul telefono stanno in mezza riga.
- Il link «Gestionale» e la scritta «Versione di prova» restano finché il sito è di prova.

## Correzioni di Davide
- 15/09/2026 — Tu nel negozio, confermato. Perimetro: tutto il sito, gestionale compreso. Le descrizioni dei piatti e delle formule catering (esempi in dati.js) si riscrivono anche loro, ma descrivono solo il piatto: niente «della casa», «appena sfornato», provenienze o ricette di famiglia.
- 15/09/2026, collaudo alla cieca — le varianti di un piatto si scrivono «Disponibili con …», non «Anche con …». «Ti restituiamo quello che hai pagato» suona finto: si dice «Ti rimborsiamo». Nel negozio e nel gestionale i testi vecchi hanno battuto quelli ripuliti: tenere ingredienti, provenienze del piatto («leccese») e immagini di cucina («la lista si congela», «il carrello si blocca»), togliere solo i vanti.
- 15/09/2026, secondo collaudo — la terza versione ha vinto ovunque. Davide sulla vecchia: «ha solo definizioni più generali». Le descrizioni restano specifiche (ingredienti, formato, varianti), mai generiche.
- 14/09/2026 — «troppo testo»: nel negozio si scrive il minimo, le informazioni stanno dove servono (sotto il giorno scelto, nel carrello, nei passi del checkout).
