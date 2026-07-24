# RBA Edilizia — Coda contenuti SEO (push graduale, 2 pagine/settimana)

Tracciamento interno, non collegato dal sito pubblico. Aggiornato dal task schedulato settimanale.

## Fase 1 — Pagine zona già promesse in zone.html/JSON-LD ma senza pagina dedicata
Priorità massima: questi comuni sono già elencati come serviti, quindi crearne la pagina non è "espansione" ma allineamento.

- [x] Bresso (MI) — pubblicato 2026-07-20 (commit a348c36)
- [x] Cusano Milanino (MI) — pubblicato 2026-07-20 (commit a348c36)
- [x] Limbiate (MB) — pubblicato 2026-07-24 (commit PENDING)
- [x] Bovisio Masciago (MB) — pubblicato 2026-07-24 (commit PENDING)
- [ ] Lesmo (MB)
- [ ] Usmate Velate (MB)
- [ ] Bernareggio (MB)
- [ ] Cormano (MI)
- [ ] Meda (MB)

## Fase 2 — Articoli combo servizio+comune (alto intento d'acquisto, comuni già forti)
Da avviare dopo la Fase 1. Formato: clonare template da news/cappotto-termico-materiali-confronto.html.

- [ ] Rifacimento bagno a Villasanta
- [ ] Cappotto termico ad Arcore
- [ ] Ristrutturazione cucina a Brugherio
- [ ] Rifacimento bagno ad Arcore
- [ ] Cappotto termico a Brugherio
- [ ] Ristrutturazione cucina ad Agrate Brianza
- [ ] Rifacimento bagno a Concorezzo
- [ ] Cappotto termico a Villasanta

## Fase 3 — Nuovi comuni non ancora promessi (vera espansione, valutare dopo Fase 1-2)
Candidati entro 15km da Monza, non ancora citati sul sito: Biassono, Macherio, Sovico, Albiate, Triuggio,
Giussano, Barlassina, Lentate sul Seveso, Novate Milanese, Bollate, Baranzate, Senago, Garbagnate Milanese.
Richiedono prima un OK esplicito dell'utente prima di aggiungerli a zone.html/JSON-LD (ampliano una promessa
di copertura territoriale, non solo un allineamento).

## Regole per chi esegue un batch
1. Prendere le prime 2 voci non spuntate (fasi in ordine, Fase 1 prima di Fase 2 prima di Fase 3).
2. Zone page: clonare struttura da zone/ristrutturazioni-villasanta.html, personalizzare intro con
   dati reali del comune (popolazione, comuni confinanti, tipo di patrimonio edilizio), aggiornare
   footer "Zone Servite" sitewide (3 varianti prefisso: root=`zone/`, zone/*=``, news|servizi=`../zone/`),
   sezione "Pagine Dedicate" in zone.html, nav dropdown dove già presente il pattern.
3. Articolo combo: clonare da news/cappotto-termico-materiali-confronto.html (Article+FAQPage+BreadcrumbList
   JSON-LD, price-table, alert-box "Consiglio RBA", 3 FAQ, box Articoli Correlati).
4. Verificare in browser prima di committare (nessun link rotto, footer coerente).
5. Commit + push su origin (repo collegato a deploy live — vedi memoria feedback utente: push automatico
   confermato esplicitamente il 2026-07-20 per questa routine specifica).
6. Spuntare la voce in questo file con data e commit hash, poi commit+push anche di questo file.
