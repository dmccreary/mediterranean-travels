# Chapter Content Generator Session Log

**Skill Version:** 1.11
**Date:** 2026-11-24
**Execution Mode:** Sequential (single chapter)
**Chapter:** 01-long-timeline, "Before We Go, Part 1: The Long Timeline of the Eastern Mediterranean"

## Timing

| Metric | Value |
|--------|-------|
| Start Time | 2026-11-24 12:17:08 |
| End Time | 2026-11-24 12:31:47 |
| Elapsed Time | 14 minutes 39 seconds |

## Setup Checks

- **Edge direction:** `prereqs[edge['from']].add(edge['to'])` gives 16 foundational concepts, all simple root ideas (Eastern Mediterranean, Civilization, Judaism, and so on). Direction is correct.
- **Chapter dependency order:** 0 violations across all 21 chapters.
- **cis_max:** 1771 (Ancient Greece), computed across all 598 nodes.
- **Reading level:** general adult travelers with no professional background in the field (trip description, Audience).
- **Mascot:** Glaux the Little Owl. Chapter 1 opens with the one-time self-introduction.

## Elaboration Budget

The tier mix is unusual: 24 of 27 concepts are Tier A, because Chapter 1 holds the book's foundational concepts. The tiering was checked against the content, and it fits: nearly every later chapter depends on these concepts.

| Tier | Concepts | Target words each |
|------|----------|-------------------|
| A | 24 (everything except the three below) | 500–750 |
| B | 1 (Mycenaean Greeks, E = 0.48) | 250–400 |
| C | 2 (BCE and CE Dating, E = 0.19; Ottoman Period, E = 0.15) | 120–200 |
| **Budget total** | 27 | **12,490–18,800** |

## Results

| Measure | Value |
|---|---|
| Prose words (excluding MicroSim specifications) | ~13,100 (inside the 12,490–18,800 budget, near its low end) |
| Words in MicroSim specifications | ~4,300 |
| Concepts covered | 27 of 27 |
| Markdown tables | 28 (plus the Concepts Covered table) |
| Mascot admonitions | 9 (welcome/self-introduction 1, thinking 2, tip 2, warning 2, encourage 1, celebration 1) |
| Embedded existing MicroSim | 1 (`viking-cruise-map`) |
| New MicroSim specifications | 3 |

Every Tier A concept has a worked example and a table, a sim, or both. Three concepts (Judaism, Christianity, Islam) share one comparison table. All the eras share the timeline and sorter specifications, and their tables.

### MicroSim reuse

The search-microsims catalog was available. All three candidate searches came back as `generate`, with top WHAT scores of 0.44, 0.42 and 0.54 (U.S. history and forensics timelines, which don't fit this book).

| sim-id | Type / Library | Bloom | Decision |
|---|---|---|---|
| `viking-cruise-map` | map / Leaflet | n/a | Embedded from this book (already exists) |
| `eastern-med-eras-timeline` | timeline / vis-timeline | Understand / compare | Newly specified |
| `eastern-med-trade-routes-map` | map / Leaflet | Understand / infer | Newly specified |
| `place-the-site-in-its-era` | microsim / p5.js | Apply / apply | Newly specified |

Reused 0, from template 0, newly specified 3.

## Validation

- Frontmatter parses as YAML, and `date` is a string.
- `validate-chapter-mascots.py`: OK, no placement rule violations. One earlier failure was fixed: a tip had 5 sentences.
- `mkdocs build --strict`: exit 0.
- Specification self-check: all six header lines are present, no indented lines, and no layout, size or color instructions.
- The TODO placeholder has been removed.

## Items for the author to check

- The trade-routes map coordinates are approximate, and the spec tells the generator to check them against Wikipedia. Seven sorter-card dates come from standard references rather than the chapter prose, and the spec flags them the same way.
- The chapter is written in the guide's "before we go" voice. The Trade Routes section has one first-person mention of the saffron bought at the Spice Bazaar.

## Files Created/Updated

- `docs/chapters/01-long-timeline/index.md`
- `logs/ch-01-content-generation.md` (start and end timestamps)
- `logs/chapter-content-generator-2026-11-24.md` (this log)

---

# Chapter 2 — Before We Go, Part 2: Traveling Well and the Learning for All Thread

**Skill Version:** 1.11
**Execution Mode:** Sequential (single chapter)

| Metric | Value |
|--------|-------|
| Start Time | 2026-11-24 12:52:52 |
| End Time | 2026-11-24 13:08:02 |
| Elapsed Time | 15 minutes 10 seconds |

## Validation

- Edge direction: 16 foundational concepts, all simple root ideas (direction correct).
- Chapter prerequisites: all in Chapter 1 or earlier in Chapter 2 (0 violations).
- `cis_max` = 1771 (Ancient Greece), global normalization.
- Frontmatter parses; `mkdocs build --strict` exits 0; mascot validator: 9 admonitions, no violations.

## Elaboration Budget vs Actual (prose words, specs excluded)

| Concept | CIS | E(c) | Tier | Target | Actual |
|---|---|---|---|---|---|
| Thoughtful Traveler | 59 | 0.55 | A | 500-750 | ~634 |
| Writing Systems | 155 | 0.68 | A | 500-750 | ~541 |
| Alphabet | 98 | 0.61 | A | 500-750 | ~645 |
| Greek Language | 84 | 0.59 | A | 500-750 | ~840 (incl. 24-letter table) |
| Artificial Intelligence | 74 | 0.58 | A | 500-750 | ~591 |
| Literacy | 44 | 0.51 | A | 500-750 | ~520 |
| Learning for All | 39 | 0.49 | B | 250-400 | ~500 (incl. route preview table) |
| Viking Star Cruise | 25 | 0.44 | B | 250-400 | ~357 |
| Ancient Mediterranean Treasures | 21 | 0.41 | B | 250-400 | ~292 |
| Trip Itinerary | 20 | 0.41 | B | 250-400 | ~585 (incl. itinerary table) |
| Empathy in Travel | 18 | 0.39 | B | 250-400 | ~472 |
| Democratization of Education | 15 | 0.37 | B | 250-400 | ~326 |
| AI in Education | 14 | 0.36 | B | 250-400 | ~406 |
| Off-Season Travel | 13 | 0.35 | B | 250-400 | ~310 |
| Mediterranean Climate | 12 | 0.34 | B | 250-400 | ~368 |
| Daily Chapter Routine | 5 | 0.24 | B | 250-400 | ~487 (incl. reading table) |
| Travel Journal | 4 | 0.22 | B | 250-400 | ~300 |
| November Weather | 2 | 0.15 | C | 120-200 | ~190 |
| Packing for November | 1 | 0.09 | C | 120-200 | ~211 |
| Opening Hours and Closures | 1 | 0.09 | C | 120-200 | ~308 (incl. table and tip) |

Budget sum: ~6,100-9,500 words. Actual: ~9,800 prose words, ~15,300 words with specifications.

## Non-text Elements

- 7 markdown tables, 6 markdown lists
- 9 mascot admonitions (welcome 1, thinking 3, tip 2, warning 2, celebration 1)
- 5 new MicroSim specifications (all Status: Specified):
  - `thoughtful-traveler-choices` (p5.js, Evaluate/judge)
  - `november-weather-at-our-stops` (Chart.js, Understand/interpret)
  - `sort-the-scripts` (p5.js, Understand/classify) — template: computer-science/symbol-character-quiz (score 0.607)
  - `read-a-greek-sign` (p5.js, Apply/use)
  - `world-literacy-over-time` (Chart.js, Understand/interpret)
- Reuse search: 0 reused, 1 from template, 4 newly specified
- Link to the existing `viking-cruise-map` sim

## Concepts Covered

20 of 20.

## Notes for the Author

- The climate chart spec tells the generator to copy Wikipedia climate tables and to flag any mismatch with the prose values (Istanbul/Çanakkale ~15-16 °C; Athens, Rhodes, Heraklion ~19-21 °C).
- Sunset times (Athens/Heraklion ~5:10 PM, Istanbul ~5:45 PM) were computed from latitude, longitude and time zone, not looked up.
- Viking Star facts (2015, ~930 guests, adults only, included excursion per port) and Greek winter-hours claims are from general knowledge and should be confirmed against Viking and the Greek Ministry of Culture.

---

# Chapter 3 Session: 03-istanbul-two-continents

**Skill Version:** 1.11
**Execution Mode:** Sequential (single chapter)
**Chapter:** "Day 1: Istanbul, a City on Two Continents"

## Timing

| Metric | Value |
|--------|-------|
| Start Time | 2026-11-24 13:18:41 |
| End Time | 2026-11-24 13:33:11 |
| Elapsed Time | 14 minutes 30 seconds |

## Setup Checks

- **Edge direction:** 16 foundational concepts, all root ideas. Direction is correct.
- **Chapter dependency order:** 0 violations across all 21 chapters. Every Chapter 3 prerequisite is in Chapter 1, Chapter 2 or earlier in Chapter 3.
- **cis_max:** 1771, global across 598 nodes.
- **MicroSim reuse search:** available. All five queries returned `generate` (best WHAT score 0.589), so there were 0 reused, 0 from template, and 5 newly specified.

## Elaboration Budget

| Tier | Concepts | Target words each |
|------|----------|-------------------|
| A | 11: Bosphorus Strait, Byzantium, Constantine the Great, Constantinople, Byzantine Empire, Theodosian Walls, Ottoman Empire, Sultan, Mehmed the Conqueror, Fall of Constantinople, Food as History | 500–750 |
| B | 6: Empire, Turkish Language, Theodosius I, Theodosian Decrees, Istanbul, Turkish Cuisine | 250–400 |
| C | 11: Basic Turkish Phrases, Turkish Hospitality, Tipping Customs, Currency and Payments, Golden Horn, Galata Tower, Turkish Breakfast, Simit, Turkish Tea, Turkish Coffee, Balik Ekmek | 120–200 |
| **Budget total** | 28 | **8,320–12,850** |

## Results

| Measure | Value |
|---|---|
| Total words on disk | ~19,180 |
| Prose words (excluding MicroSim specifications) | ~13,580, of which ~1,480 are the intro, practical notes, Learning for All and Key Takeaways; the concept sections themselves come to ~12,100, inside the budget |
| Concepts covered | 28 of 28 |
| Markdown tables | 18 |
| MicroSim specifications | 5: istanbul-three-shores-map (Leaflet), theodosian-walls-layers (html infographic), siege-of-1453-step-through (p5.js), food-history-layers-sorter (p5.js), turkish-phrase-situations (p5.js) |
| Mascot admonitions | 8 (welcome 1, thinking 2, tip 1, warning 2, encourage 1, celebration 1). Validator: no violations |
| `mkdocs build --strict` | Clean |

Concepts outside their budget tolerance:

- **Over:** Bosphorus Strait (~980 words, including the crossings table and the shore definitions the map needs), Fall of Constantinople (~1,020, including the aftermath), Turkish Language (~590, including the pronunciation table), Currency and Payments (~250).
- **Under:** Food as History (~425 words of prose; its required worked example and MicroSim are both present), Simit (~95).

## Files Created/Updated

- docs/chapters/03-istanbul-two-continents/index.md
- logs/ch-03-content-generation.md

---

# Chapters 4–6 Session: 04-byzantine-constantinople, 05-ottoman-istanbul, 06-bazaars-scripts-presses

**Skill Version:** 1.11
**Execution Mode:** Sequential (three chapters, one at a time)

## Timing

| Metric | Value |
|--------|-------|
| Start Time | 2026-11-24 15:59:38 |
| End Time | 2026-11-24 16:27:59 |

## Setup Checks

- **Edge direction and chapter order:** unchanged since the Chapter 1 session; every prerequisite of a Chapter 4–6 concept is in an earlier chapter or earlier in the same chapter.
- **cis_max:** 1771 (global). Tier cut points: Tier A at CIS >= 42, Tier B at CIS >= 4.
- **MicroSim reuse search:** available. All seven queries returned `generate` (best WHAT score 0.555), so 0 reused, 0 from template, 7 newly specified.
- **Photos:** picks for chapters 04–06 exported with `scripts/export_web_photos.py` (21 photos). Two captions in `data/photo-picks.csv` changed: 06,8 "(verify)" became "An Ottoman stone gateway near the Grand Bazaar"; 05,2 "at dusk" became "in the late afternoon", because 17:39 Istanbul time is before the ~17:47 sunset.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 4. Byzantine Constantinople | 3 / 13 / 13 | 6,310–10,050 | ~10,500 (~8,800 in concept sections) | ~3,400 | 29/29 |
| 5. Ottoman Istanbul | 0 / 9 / 21 | 4,770–7,800 | ~7,950 (~6,400 in concept sections) | ~1,700 | 30/30 |
| 6. Bazaars, Scripts, and Presses | 0 / 10 / 15 | 4,300–7,000 | ~7,150 (~5,800 in concept sections) | ~1,800 | 25/25 |

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 4 | 6 | 7 | 10 (welcome 1, thinking 3, tip 2, warning 2, encourage 1, celebration 1) | source-myth-or-contested (p5.js, Understand/classify); read-the-ruin-layers (p5.js, Apply/classify); schism-to-sack-timeline (vis-timeline, Understand/explain) |
| 5 | 5 | 6 | 8 (welcome 1, thinking 3, tip 2, warning 1, celebration 1) | day-3-prayer-time-planner (p5.js, Apply/solve); suleymaniye-kulliye-sorter (p5.js, Understand/classify) |
| 6 | 1 | 8 | 9 (welcome 1, thinking 3, tip 2, warning 1, encourage 1, celebration 1) | scribe-or-press (p5.js, Apply/calculate); when-printing-arrived (Chart.js, Understand/interpret) |

## Validation

- Frontmatter parses for all three chapters; `date` is a string.
- `validate-chapter-mascots.py`: no violations in any of the three.
- `mkdocs build --strict`: exit 0.
- Specification self-check: required header lines present, no indented lines, no layout or pixel instructions.
- `scripts/pronunciations.py all`: 22 new terms with audio; check OK. Buttons for Chora (Ch 3) and Sephardic and Ladino (Ch 1) landed in earlier chapters, at their first use.

## Corrections to Earlier Chapters

- Chapter 3 gave Istanbul's November sunset as 4:50 PM (twice). Turkey stays on UTC+3 all year, so it is about 5:45 PM, as Chapter 2 already said. Both places are fixed.

## Notes for the Author

- Prayer times for November 13 (noon about 12:55 PM, afternoon about 3:25 PM, sunset about 5:50 PM) were computed from the sun's position, not taken from the Diyanet table. The planner sim labels its closure windows as illustrative.
- The Ottoman-script spellings in Chapter 6 (قول for kol and kul; كور for kör, gör and gür) and the 1477 household percentages (about 58% Muslim) come from general knowledge and are worth checking.
- "Minoan Palatial Centres of Crete" is listed as a 2025 UNESCO inscription in the Chapter 4 table.
- Chapter 5 uses "Suleiman" in English prose (matching the learning graph) and "Süleymaniye" for the mosque.

## Files Created/Updated

- docs/chapters/04-byzantine-constantinople/index.md, img/ (7 photos)
- docs/chapters/05-ottoman-istanbul/index.md, img/ (6 photos)
- docs/chapters/06-bazaars-scripts-presses/index.md, img/ (8 photos)
- docs/chapters/01-long-timeline/index.md and 03-istanbul-two-continents/index.md (pronounce buttons; Chapter 3 sunset fix)
- data/photo-picks.csv, data/pronunciations.csv, docs/appendices/pronunciation-guide.md, docs/audio/*.mp3 (22 new)
- logs/ch-04/05/06-content-generation.md, this log

# Chapter 7 Session: 07-end-of-empire-modern-turkey

**Skill Version:** 1.11
**Execution Mode:** Single chapter

## Timing

| Metric | Value |
|--------|-------|
| Start Time | 2026-11-24 16:48:03 |
| End Time | 2026-11-24 17:07:27 |

## Setup Checks

- **Edge direction and chapter order:** every prerequisite of a Chapter 7 concept is in an earlier chapter or earlier in this chapter (for example Nation's Schools after Alphabet Reform of 1928, Gülhane Park and Literacy; Hagia Sophia Status Debate after Secularism in Turkey and Contested History).
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4.
- **MicroSim reuse search:** available. All three queries returned `generate` (WHAT scores 0.350, 0.397, 0.356), so 0 reused, 0 from template, 3 newly specified.
- **Photos:** Chapter 7 has no rows in `data/photo-picks.csv`; no photos placed and nothing exported.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 7. End of Empire and Modern Turkey | 5 / 9 / 8 | 5,710–8,950 | ~10,950 (~9,500 in concept sections, including tables and the Learning for All closing) | ~3,400 | 22/22 |

Tier A: Ottoman Decline (135), World War I (79), Ottoman Rule in Greece (52), Greek War of Independence (51), Modern Greek State (50). The chapter runs over budget, mainly because the Learning for All concepts (all Tier C by CIS) carry the alphabet, Nation's Schools and literacy-uncertainty story that Chapters 2 and 6 promised, and because the Greco-Turkish War section carries the 1923 population exchange that Chapter 6 promised.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 7 | 9 (plus 3 inside specs) | 0 | 8 (welcome 1, thinking 3, encourage 1, warning 1, tip 1, celebration 1) | ottoman-retreat-map (Leaflet, Understand/classify); population-exchange-1923-cases (p5.js, Apply/apply); sevres-versus-lausanne (html, Analyze/differentiate) |

Lists: pressures on the empire, Ottoman Greek institutions, crossings of the Dardanelles, national holidays, reform dates, the four-step pattern, Practical Notes, Key Takeaways.

## Validation

- Frontmatter parses; `date` is a string.
- `validate-chapter-mascots.py`: OK, no violations.
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines.
- Specification self-check: header lines present, no indented lines, no layout or pixel instructions; counts match Content (14 places in 4 eras; 10 cases, 3/2/5; 10 terms, 6 reversed and 4 kept).
- No TODO left; all 22 concepts appear in bold.
- `scripts/pronunciations.py all`: 8 new terms with audio; check OK. Buttons for Dolmabahçe (Ch 5) and Atatürk (Ch 4) landed in earlier chapters at their first use; Filiki Eteria, Megali Idea, Sèvres, laiklik, Anıtkabir and Millet Mektepleri landed in Chapter 7.

## Caption Changes

- None (no photo picks for this chapter).

## Image Suggestions (Wikimedia Commons, not downloaded)

- Dolmabahçe Palace from the Bosphorus, and its Ceremonial Hall chandelier (we did not photograph the palace).
- The closed central gate of the Ecumenical Patriarchate in Fener.
- Atatürk teaching the new letters at a portable blackboard, 1928, and a Nation's Schools classroom, if public-domain copies with clear licenses exist.

## Corrections to Earlier Chapters (reported, not edited)

- Chapter 5, "Friday Prayer": "since 1935 the official weekend has been Saturday and Sunday." The 1935 law moved the weekly day of rest from Friday to Sunday; a full Saturday-and-Sunday weekend came later. Chapter 7 says only that Sunday became the day of rest in 1935.

## Notes for the Author

- Literacy figures: 1927 census "usually quoted as about 10.6 percent"; 1935 census "about one person in five"; today "well over 95 percent". Worth checking against a census source.
- Nation's Schools: attendance expected of adults "roughly 16 to 45"; "more than a million adults earned certificates in the schools' first years" (the government's own count).
- Dolmabahçe: chandelier "said to weigh about four and a half tonnes" and to be Queen Victoria's gift; "14 tonnes of gold leaf" given as an often-quoted figure; "a clock in that room still shows 9:05"; 285 rooms; facade about 600 m.
- Population exchange: about 1.2 million Orthodox Christians and about 400,000 Muslims; Imbros and Tenedos Greek exemption attributed to Lausanne Article 14; Agios Titos in Heraklion "became a church again in 1925". Istanbul's Greek community "more than a hundred thousand" in 1923.
- Tonight's sailing distance (~250 km) and the passage under the 1915 Çanakkale Bridge are computed from the map, not taken from Viking's route.
- Sakarya "about 80 km from Ankara"; Sèvres and Lausanne terms in the sevres-versus-lausanne spec; the National Pact's wording is paraphrased.
- Economy: "around 50 million foreign visitors a year"; Istanbul "about 30 percent" of output; inflation "more than 80 percent in the year to late 2022".
- Armenian deaths given as a range "from about 600,000 to more than a million", with the genocide recognition and the Turkish state's position both stated.
- The red-brick Phanar Greek Orthodox College dated 1881–1883; Gregory V hanged April 22, 1821 (Gregorian).

## Files Created/Updated

- docs/chapters/07-end-of-empire-modern-turkey/index.md
- docs/chapters/04-byzantine-constantinople/index.md and 05-ottoman-istanbul/index.md (pronounce buttons for Atatürk and Dolmabahçe only)
- data/pronunciations.csv (8 rows), docs/appendices/pronunciation-guide.md, docs/audio/{dolmabahce,ataturk,anitkabir,millet-mektepleri,laiklik,megali-idea,filiki-eteria,sevres}.mp3
- logs/ch-07-content-generation.md, this log

# Chapter 8 Session: 08-troy-and-gallipoli

**Skill Version:** 1.11
**Execution Mode:** Single chapter

## Timing

| Metric | Value |
|--------|-------|
| Start Time | 2026-11-24 17:08:44 |
| End Time | 2026-11-24 17:29:12 |

## Setup Checks

- **Edge direction and chapter order:** concepts are presented in prerequisite order within the chapter (Stratigraphy before Hisarlik Mound; Olympian Gods before Greek Mythology before Trojan War; Bronze Age Collapse, Greek Dark Age, Oral Tradition, Homer; Historicity of Troy after Iliad, Troy VI and VIIa and Wilusa; Tourism Economy, Off-Season Livelihoods, Canakkale Today; Phoenician Alphabet, Greek Alphabet, Homer Written Down, Lowering the Cost of Reading, Simpler Interface to Knowledge). Cultural Memory and Johnnies and Mehmets Words follow Contested History (Chapter 4) and the Gallipoli Campaign (Chapter 7).
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4.
- **MicroSim reuse search:** available. All three queries returned `generate` (WHAT scores 0.394, 0.467, 0.492), so 0 reused, 0 from template, 3 newly specified.
- **Photos:** 7 picks; all 7 placed. Pick 7 "(verify)" resolved from the contact sheet as a general caption.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 8. Troy and Gallipoli | 1 / 14 / 22 | 6,640–10,750 | ~12,240 (brief's counter; includes the stub sections, tables, admonitions, Practical Notes and Key Takeaways) | ~3,590 | 37/37 |

Tier A: Olympian Gods (120). Tier B: Greek Mythology, Troy, Bronze Age Collapse, Greek Dark Age, Site Museum, Stratigraphy, Tourism Economy, Hisarlik Mound, Oral Tradition, Off-Season Livelihoods, Homer, Trojan War, Phoenician Alphabet, Greek Alphabet. The chapter runs about 14% over the top of the budget, mainly because several Tier C concepts carry stories the earlier chapters promised (the Johnnies and Mehmets debate, cultural memory at Gallipoli, Homer written down and the AI parallel in Learning for All). One trimming pass removed about 120 words of recap.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 8 | 9 (plus 8 inside specs) | 7 | 11 (welcome 1, thinking 3, tip 3, warning 2, encourage 1, celebration 1) | olympian-gods-at-troy (p5.js, Understand/classify); homeric-formula-builder (p5.js, Apply/use); troy-gallipoli-evidence-gap (vis-timeline, Evaluate/judge) |

Lists: where Troy's finds are (4 countries), the Trojan War legend in order, the Johnnies and Mehmets tests, the four-step pattern, Practical Notes, Key Takeaways.

## Validation

- Frontmatter parses; `date` is a string.
- `validate-chapter-mascots.py`: OK, no violations.
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines.
- Specification self-check: header lines present, no indented lines, no layout, pixel, color or Implementation lines; counts match Content (12 cards, 5/4/3; 6 formulas and 6 lines; 8 stories, 3/2/3 verdicts) and Chapter Anchors match the prose.
- No TODO and no "(verify)" left; all 37 concepts appear in bold.
- `scripts/pronunciations.py all`: 7 new terms with audio; check OK. Schliemann's button landed in Chapter 1 (first running-text use); Hisarlık, Wilusa, Ahhiyawa, Hephaestus, Eceabat and Mehmetçik landed in Chapter 8.

## Caption Changes

- Pick 6: "Dawn on the Dardanelles" -> "Early morning on the Dardanelles, just after sunrise". Taken 07:18 Athens time = 08:18 Turkish time; computed sunrise at Çanakkale on November 16 is about 8:00 AM.
- Pick 7: "A WWI-era gun on display in Çanakkale (verify)" -> "A heavy artillery gun on display in Çanakkale". The contact sheet shows a large gun on a street island, but its date and history cannot be confirmed from the photo.

## Image Suggestions (Wikimedia Commons, not downloaded)

- We have no Gallipoli photos (all picks are from Troy and the Çanakkale waterfront). Candidates: Anzac Cove with the Arıburnu memorial, the Çanakkale Martyrs' Memorial, and the Lone Pine or Chunuk Bair memorials.
- Priam's Treasure: Schliemann's published photograph of Sophia wearing the diadems (public domain).
- The Troy Museum building and the Polyxena Sarcophagus.

## Corrections to Earlier Chapters (reported, not edited)

- Chapter 7, "The Gallipoli Campaign": "British and French forces at and near its southern tip." On April 25 the French made a diversionary landing at Kum Kale on the Asian shore, then re-embarked to join the Helles sector. Not wrong in effect, but imprecise.
- The chapter brief gives Çanakkale's November sunset as about 5:40 PM. A NOAA-style calculation for November 16 gives sunrise about 8:00 AM and sunset about 5:58 PM local time; Chapter 8 uses "about 6:00 PM".

## Notes for the Author

- Kritoboulos's account of Mehmed II visiting Troy in 1462 and speaking of avenging the Trojans: widely cited, but I could not open the passage this session.
- Johnnies and Mehmets: the 1953 Şükrü Kaya interview, the absence of 1934 records and obituary mentions, and the late-1970s Campbell correspondence follow Honest History and a Newsroom (NZ) article; Canberra memorial 1985, Wellington 1990. The chapter presents the authorship as debated, not settled.
- Gallipoli deaths as round numbers: Ottoman 57,000–87,000; British Empire (with India and Newfoundland) about 35,000; France about 10,000; Australia about 8,700; New Zealand about 2,800. Served: about 50,000 Australians, about 15,000 New Zealanders.
- Çanakkale Martyrs' Memorial: 41.7 m, pillars 7.5 m, slab 25 m square, design competition 1944, foundation 1954, opened 1960, cemetery of 600 soldiers (Wikipedia).
- Penn Museum Troy-region gold: bought 1966, sent to Turkey in 2012 (I believe as a long-term transfer or loan; wording kept as "sent back").
- Troy Museum opened 2018; Polyxena Sarcophagus about 520–500 BCE, found 1994 "in the region".
- Homeric details: Iliad Book 20 sides; Iliad 1.84, 1.121, 1.7 and Odyssey 6.1 cited in the formula spec; the "rosy-fingered Dawn" line "about twenty times" in the Odyssey; Avdo Međedović's song "more than 12,000 lines".
- Hittite texts table: dates c. 1400, c. 1280, c. 1250 BCE and late 13th century are conventional approximations.
- Lefkandi building "about 45 m"; Nestor's Cup 740–720 BCE; Athens adopted the Ionian alphabet in 403 BCE.
- Our photos show the Çanakkale waterfront at about 10:40–11:30 AM and Troy at about 12:40–1:45 PM Turkish time; the chapter keeps the stub's plan (Troy morning, Gallipoli afternoon) as a guide and says only that our day began on the waterfront.

## Files Created/Updated

- docs/chapters/08-troy-and-gallipoli/index.md
- docs/chapters/08-troy-and-gallipoli/img/ (7 exported JPEGs)
- docs/chapters/01-long-timeline/index.md (pronounce button for Schliemann only)
- data/photo-picks.csv (2 captions), data/pronunciations.csv (7 rows), docs/appendices/pronunciation-guide.md, docs/audio/{hisarlik,schliemann,wilusa,ahhiyawa,hephaestus,eceabat,mehmetcik}.mp3
- logs/ch-08-content-generation.md, this log

# Chapter 9 Session: 09-paul-life-letters

**Skill Version:** 1.11
**Execution Mode:** Single chapter (deep dive)

## Timing

| Metric | Value |
|--------|-------|
| Start Time | 2026-11-24 17:30:09 |
| End Time | 2026-11-24 17:55:46 |

## Setup Checks

- **Edge direction and chapter order:** concepts are presented in prerequisite order within the chapter: Athens, Greek Philosophy, Socrates, Socratic Method, Plato, Plato's Academy, Aristotle, Alexander the Great, Hellenistic Kingdoms, Koine Greek; Roman Province of Asia before Ephesus; Roman Roads and Roman Citizenship; Pharisees, Jewish Law, Gentiles, Jesus of Nazareth, Early Jesus Movement; Tarsus before Paul of Tarsus, Paul as Persecutor, Road to Damascus, Paul's Missionary Journeys, Timothy and Titus, Book of Acts; Pauline Letters before Seven Undisputed and Disputed letters, then Ephesians, Galatians, First Corinthians, Romans, Phoebe, New Testament; Paul in Ephesus before Hall of Tyrannus, Priscilla and Aquila, Apollos, Farewell at Miletus; Paul's Death in Rome; Euangelion, Evangelist, Shared Language Spreads Ideas.
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4.
- **MicroSim reuse search:** available. All three queries returned `generate` (WHAT scores 0.393, 0.398, 0.432), so 0 reused, 0 from template, 3 newly specified.
- **Photos:** 3 picks; all 3 placed. Pick 1 "(verify)" and pick 3 rewritten as general captions after viewing the contact sheet.
- **Coverage split honored:** the Great Theater, the riot of Demetrius, St. Paul's Prison Tower, the Temple of Artemis, and the Ephesus harbor are mentioned only as pointers to Chapter 10; grace and faith, "neither Jew nor Greek," one body, love, the Council of Jerusalem, tentmaking, and the leadership analysis are pointers to Chapter 11; Paul on the Areopagus to Chapter 16; the Delphic oracle and Socrates to Chapter 17; the Lyceum, Aristotle tutoring Alexander, and the *Phaedrus* to Chapter 20; Titus in Crete to Chapter 14; the shadow side of evangelism and mother-tongue AI to Chapter 21.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 9. Paul at Ephesus, Part 1 | 22 / 14 / 8 | 15,460–23,700 | ~19,040 (brief's counter; includes the stub sections, tables, admonitions, and Key Takeaways) | ~4,070 | 44/44 |

Tier A (22): Athens, Greek Philosophy, Socrates, Plato, Plato's Academy, Aristotle, Alexander the Great, Hellenistic Kingdoms, Koine Greek, Roman Province of Asia, Roman Citizenship, Roman Roads, Ephesus, Jesus of Nazareth, Early Jesus Movement, Tarsus, Pharisees, Paul of Tarsus, Paul as Persecutor, Road to Damascus, Paul's Missionary Journeys, Pauline Letters. Tier B (14): Socratic Method, Jewish Law, Gentiles, Seven Undisputed Letters, Disputed Pauline Letters, First Corinthians, Letter to the Galatians, Letter to the Romans, Paul in Ephesus, Priscilla and Aquila, Timothy and Titus, Farewell at Miletus, Euangelion, Evangelist. Tier C (8): Book of Acts, New Testament, Letter to the Ephesians, Hall of Tyrannus, Apollos, Phoebe, Paul's Death in Rome, Shared Language Spreads Ideas.

The chapter sits in the lower-middle of its budget. The Athens and philosophy concepts (Tier A by CIS because Chapters 15, 16, 17, and 20 build on them) were deliberately kept to about 300–500 words each, focused on what Paul's world inherited, so as not to pre-empt those chapters; Chapter 1 had already covered the Hellenistic period, Koine, and the province of Asia at an introductory level. Tier C concepts that carry the chapter's honesty about sources (Book of Acts, Paul's Death in Rome) run above their 200-word target.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 9 | 28 (plus 4 inside specs) | 3 | 12 (welcome 1, thinking 4, tip 2, warning 3, encourage 1, celebration 1) | paul-journeys-and-our-route (Leaflet, Understand/classify); who-says-so-paul-sources (p5.js, Analyze/differentiate); paul-letters-on-his-timeline (vis-timeline, Analyze/organize) |

Lists: the Socratic method's four steps, ethos/pathos/logos in Philemon, Koine's features, the three Jewish schools, the three marks of Jewish law, the God-fearer inscriptions, the three kinds of synagogue listener, the two Roman-era witnesses to Jesus, Paul's mission method, the evidence for the undisputed letters, the subjects of 1 Corinthians, the farewell speech at Miletus, Key Takeaways. The validator gave no advisory on the mascot total (12 for 44 concepts).

## Validation

- Frontmatter parses; `date` is a string.
- `validate-chapter-mascots.py`: OK, no violations.
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines.
- Specification self-check: header lines present, no indented lines, no layout, pixel, color, or Implementation lines; counts match Content (12 places, 3/5/2/2; 14 cards, 5/5/2/2; 6 bands, 4 events, 7 letter cards) and Chapter Anchors match the prose.
- No more than 4 consecutive prose paragraphs without a non-text element (checked by script after adding tables and lists in a second pass).
- No TODO and no "(verify)" left; all 44 concepts appear in bold.
- `scripts/pronunciations.py all`: 8 new terms with audio; check OK. Buttons landed at first running-text use: Koine, Miletus, and Aquila (Tiberius Julius Aquila) in Chapter 1; euangelion in Chapter 2; Gamaliel, Tyrannus, Apollos, and Cenchreae in Chapter 9. The first Apollos insertion fell inside a quoted slogan; the sentence was reworded so the button sits after the bare name.

## Caption Changes

- Pick 1: "Ruins below Mount Pion; possibly the Great Theatre of Acts 19 (verify)" -> "Rows of stone seats rising behind a line of columns, Ephesus". The contact sheet shows a small semicircular seating area behind a row of column bases, and the photo was taken at 9:26 AM Turkish time, before the Nike relief and the Memmius Monument at the top of Curetes Street. It is almost certainly the Odeon (bouleuterion) behind the Basilica Stoa of the State Agora, not the Great Theater, but the caption stays general. The chapter places it in "Paul in Ephesus" without claiming it is the theater of Acts 19.
- Pick 3: "A column above the marble street, Ephesus" -> "A lone column beside a paved street, Ephesus". Taken three minutes after the Nike relief, so the street is very probably upper Curetes Street, not Marble Street (a Chapter 10 concept).
- Pick 2 unchanged ("Relief of Nike, goddess of victory, Ephesus"), placed in First Corinthians beside Paul's *nikos*, "victory."

## Image Suggestions (Wikimedia Commons, not downloaded)

- None required; our three Ephesus photos fit. Optional: the Priene inscription of 9 BCE (the *euangelia* of Augustus' birthday), the Erastus inscription at Corinth, or a page of the papyrus P46.

## Corrections to Earlier Chapters (reported, not edited)

- None found. Chapter 1's worked example says Paul traveled "around 50 to 58 CE"; this chapter dates the journeys about 46–57 CE and the voyage to Rome about 59–60 CE. Both are within normal scholarly ranges; no edit needed.

## Notes for the Author

- Vegetius' dates (sea closed November 11 to March 10; safe from late May to mid-September) are from *De re militari* 4.39, written around 400 CE, well after Paul.
- Philemon "about 335" and Romans "about 7,100" Greek words, and "a typical papyrus letter under a hundred words," are standard round figures I could not re-verify this session.
- The Ulpian rule that the proconsul of Asia had to land first at Ephesus (Digest 1.16.4.5) is from memory.
- Rodney Stark's growth model (1,000 in 40 CE, 40 percent per decade, about 7,530 in 100 CE, about 6.3 million in 300 CE) is computed here and matches his published table.
- Apple "software evangelist" and Guy Kawasaki: the title and his role are well known, but I did not check whether he was the first to hold it; the chapter says only "the best known of them."
- The 2009 Vatican announcement on bone fragments from St. Paul Outside the Walls, and the dates in the Paul's-death source table (Dionysius of Corinth about 170 CE via Eusebius; Tertullian about 200 CE), are from memory.
- Map coordinates in the journeys spec are approximate (from memory, to 0.01°); the spec tells the generator to check each against Wikipedia. Lystra and Derbe are the least certain.
- Straight-line distances (Ephesus to Colossae about 170 km, to Troas about 225 km, to Corinth about 380 km; Kuşadası to Miletus under 40 km; Priene about 20 km south of Kuşadası; Tarsus about 680 km east) were computed from approximate coordinates.
- The voyage route of the Viking Star past Lesbos and Chios is described loosely ("somewhere off to the west"), since the exact course is not known.
- Aristotle at Assos "about two years" (347–345 BCE) and the Assos–Troas straight-line distance of about 30 km are approximate.
- The chapter uses "One of us, Dan, would describe himself as an evangelist for artificial intelligence in education," following the brief and the author's stated role; adjust the wording if you prefer.

## Files Created/Updated

- docs/chapters/09-paul-life-letters/index.md
- docs/chapters/09-paul-life-letters/img/ (3 exported JPEGs)
- docs/chapters/01-long-timeline/index.md (pronounce buttons for Koine, Miletus, Aquila only)
- docs/chapters/02-traveling-well/index.md (pronounce button for euangelion only)
- data/photo-picks.csv (2 captions, 3 web paths), data/pronunciations.csv (8 rows), docs/appendices/pronunciation-guide.md, docs/audio/{koine,euangelion,miletus,gamaliel,tyrannus,aquila,apollos,cenchreae}.mp3
- logs/ch-09-content-generation.md, this log

# Chapter 10 Session: 10-ephesus-greco-roman-city

**Skill Version:** 1.11
**Execution Mode:** Single chapter (daily)

## Timing

| Metric | Value |
|--------|-------|
| Start Time | 2026-11-24 17:56:57 |
| End Time | 2026-11-24 18:19:10 |

## Setup Checks

- **Edge direction and chapter order:** concepts follow their learning-graph prerequisites within the chapter: Ephesus Harbor Silting after Kuşadası and Selçuk; Seven Wonders before Temple of Artemis before Artemis of Ephesus; Classical Orders before Ionic, Doric, Corinthian; Inscription; Curetes Street before Hadrian, Temple of Hadrian (also after Corinthian), the latrines, Fresco, and Terrace Houses; Library of Celsus and Marble Street; Greek Theater before Great Theater before Riot of the Silversmiths (also after Artemis of Ephesus) and Demetrius; St. Paul's Prison Tower; Church of Mary before Council of Ephesus; Ephesus Museum after Artemis of Ephesus; John the Apostle before Basilica of St. John and House of the Virgin Mary; Burning of Smyrna, Treaty of Lausanne, Population Exchange, Asia Minor Refugees; Library as Public Access before Philanthropy for Knowledge. The Temple of Artemis is told at the Magnesian Gate (where its processions entered the city) so that it precedes the riot, with the site visit itself in the afternoon.
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4.
- **MicroSim reuse search:** available. All three queries returned `generate` (WHAT scores 0.506, 0.450, 0.395), so 0 reused, 0 from template, 3 newly specified.
- **Photos:** 8 picks; all 8 placed. Chapter 9's three Ephesus photos (Odeon seats, Nike relief, lone column) are not reused.
- **Coverage split honored:** Paul's Ephesian years, Tyrannus, Priscilla and Aquila, Apollos, and Miletus are not retold (pointers to Chapter 9 only); the riot is told here at the theater; its leadership reading ("economics of resistance") is left to Chapter 11 with a pointer. The burning of Smyrna, Lausanne, and the exchange are told only through this coast (Şirince, Kuşadası, Samos, the two September commemorations), referring back to Chapter 7 for the general account.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 10. Ephesus, a Greco-Roman City | 0 / 17 / 19 | 6,530–10,600 | ~13,340 (brief's counter; includes the stub sections, 8 tables, 6 lists, admonitions, Practical Notes, Learning for All, and Key Takeaways) | ~3,400 | 36/36 |

Tier B (17): Classical Orders, Doric Order, Greek Theater, Treaty of Lausanne, Ionic Order, Population Exchange of 1923, Seven Wonders of the World, Curetes Street, Temple of Artemis, Artemis of Ephesus, Marble Street, Great Theater of Ephesus, Library of Celsus, Fresco, Riot of the Silversmiths, Burning of Smyrna, Library as Public Access. Tier C (19): the rest.

The chapter runs above its concept budget, comparable to Chapter 8 (37 concepts, ~12,240). Reasons: a walking-order daily chapter needs connective prose between stops (the upper city, Part Two's gate framing, Part Eight's introduction), and several Tier C concepts carry the chapter's history-versus-tradition work (John the Apostle, House of the Virgin Mary, St. Paul's Prison Tower) and run near 200–300 words. One trimming pass removed about 300 words of restatement.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 10 | 8 (plus 3 inside specs) | 8 | 11 (welcome 1, thinking 4, tip 2, warning 2, encourage 1, celebration 1) | classical-orders-identifier (html infographic, Understand/classify); ephesus-walk-timeline (vis-timeline, Understand/compare); ephesus-sites-evidence-judge (p5.js, Evaluate/judge) |

Tables: Seven Wonders; Temple of Artemis from shrine to marsh; the three orders compared; Greek versus Roman theater; Acts 19 details against Ephesian evidence; claims about John and their earliest sources; the two September commemorations; Aquila's library versus Carnegie libraries. Lists: the three sites of Ephesus, the four steps of a fresco, the people in the riot story, the Ephesus Museum's highlights, Practical Notes, Key Takeaways.

## Validation

- Frontmatter parses; `date` is a string.
- `validate-chapter-mascots.py`: OK, no violations.
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines (run after all edits, including the Chapter 1 button move).
- Specification self-check: six header lines present, no indented lines, no layout, pixel, color, or Implementation lines; counts match Content (12 cards; 9 monuments and 8 predictions with comparison years listed; 10 cards, 5/2/3) and Chapter Anchors match the prose.
- No more than 4 consecutive prose paragraphs without a non-text element (checked by script; one run of 5 fixed by merging paragraphs).
- No TODO and no "(verify)" left; all 36 concepts appear in bold ("Kusadasi and Selcuk" appears as **Kuşadası** and **Selçuk**, per the guide's Turkish-letters rule).
- `scripts/pronunciations.py`: 6 new terms with audio (Curetes, Vitruvius, Prytaneion, Theotokos, Şirince, Ayasuluk); check OK. Buttons: Curetes in Chapter 1 (its first running-text use; the script put it between "Curetes" and "Street", so I moved it after "Curetes Street"); the other five in Chapter 10. The insert step was run with the uncommitted "Antikythera" row temporarily removed, because the script would have put its button in Chapter 20's Summary (a stub); the row was restored and the appendix rebuilt with it (87 terms). `check` reports Antikythera with audio and no chapter button.

## Caption Changes

- Pick 1: "Hadrian's Temple on Curetes Street, 2nd century CE" -> "The arch of the Temple of Hadrian on Curetes Street, 2nd century CE".
- Pick 2: "Fountain ruins on Curetes Street (verify)" -> "The Fountain of Trajan on Curetes Street, early 2nd century CE". Identified from the contact sheet (raised pediment above composite/Corinthian capitals, the restored Nymphaeum Traiani), the time (between the Nike relief and Hadrian's temple), and the sidecar GPS (37.93798, 27.34254, about 70 m uphill of the Hadrian photo).
- Pick 3: "The Memmius Monument (verify)" -> "The Memmius Monument, 1st century BCE, Ephesus". The contact sheet shows the reconstructed monument with standing relief figures; the time and GPS place it at Domitian Square.
- Pick 4: "Corinthian columns along a colonnaded street" -> "..., Ephesus" (acanthus capitals confirmed on the contact sheet).
- Pick 5: "A marble-paved street of Ephesus" -> "A walkway past a row of columns and fields of fallen marble, Ephesus". The contact sheet shows a plank boardwalk, not marble paving.
- Pick 6: "Fallen column drums" -> "Fallen column drums, Ephesus".
- Pick 7: "Ruined walls and an arch (verify)" -> "Stone walls and a ruined arch in the upper city of Ephesus" (general; the arch may be the Pollio Fountain's, unconfirmed).
- Pick 8: "The Byzantine castle on Pigeon Island, Kuşadası" -> "The floodlit fortress on Pigeon Island, Kuşadası, at dawn". Taken 7:41 AM Turkish time, before sunrise (about 7:55 AM); "Byzantine" dropped because the fortress's present walls are largely Ottoman-era rebuilding and its origin is uncertain to me.

## Image Suggestions (Wikimedia Commons, not downloaded)

- The Library of Celsus façade and the Great Theater: we have no clear photo of either (the Ch 9 "rows of seats" photo is the Odeon). Both are the chapter's centerpieces; a Commons image of each would help.
- Optional: the "Great Artemis" or "Beautiful Artemis" statue in the Ephesus Museum, and the single column of the Temple of Artemis.

## Corrections to Earlier Chapters (reported, not edited)

- Chapter 2's Learning for All route table says the library was "a son's gift of 12,000 scrolls." The 12,000 figure is a modern estimate from the niches, not an ancient number, and the gift was the building plus an endowment for books. This chapter says so; the Chapter 2 wording could add "about" or "room for."

## Notes for the Author

- Fountain of Trajan and Memmius Monument identifications (picks 2 and 3) are confident but worth a glance at the full photos.
- The Doric colonnade along the west side of Marble Street (Neronian stoa) is from memory; it is used in the Doric section and Marble Street.
- The Basilica Stoa's Ionic capitals with bulls' heads, the Salutaris details (104 CE, about thirty statues, more than 500 lines, procession "about every two weeks" per G. M. Rogers), and the inscription naming a Demetrius among the temple officials are from memory.
- The Socrates fresco in the terrace houses (labeled in Greek) is from memory; the chapter does not say where it is displayed now.
- Şirince: the Greek name Kirkintze, the 1926 renaming to Şirince, the refugee village of Nea Efesos in Pieria, and the resettlement by Muslims from northern Greece are from memory. The "ugly name to keep outsiders away" story is presented as a legend.
- Greece's September 14 remembrance day (law of 1998) and İzmir's September 9 liberation day are from memory.
- Lausanne Article 12 (three-mile rule for islands near the Asian coast) and Samos's status (autonomous principality from the 1830s, union with Greece 1912) are from memory.
- Carnegie figures (more than 2,500 libraries, about 1,700 in the United States, 1883–1929, upkeep pledge of about a tenth of the gift a year) and Aquila's 25,000 denarii are standard figures, not re-verified this session.
- Viking's included Ephesus tour route (upper gate down to the lower gate) is stated as "usually"; check the shore-excursion description.
- The Ephesus Museum highlights list (Eros on a dolphin, gladiator room) reflects the museum as I know it; the displays may have changed.

## Files Created/Updated

- docs/chapters/10-ephesus-greco-roman-city/index.md
- docs/chapters/10-ephesus-greco-roman-city/img/ (8 exported JPEGs)
- docs/chapters/01-long-timeline/index.md (pronounce button for Curetes only)
- data/photo-picks.csv (8 captions, 8 web paths), data/pronunciations.csv (6 rows), docs/appendices/pronunciation-guide.md, docs/audio/{curetes,vitruvius,prytaneion,theotokos,sirince,ayasuluk}.mp3
- logs/ch-10-content-generation.md, this log

# Chapter 11 Session: 11-paul-ideas-leadership

**Skill Version:** 1.11
**Execution Mode:** Single chapter (deep dive)

## Timing

| Metric | Value |
|--------|-------|
| Start Time | 2026-11-24 18:19:53 |
| End Time | 2026-11-24 18:39:30 |

## Setup Checks

- **Edge direction and chapter order:** every concept follows its in-chapter prerequisites: Council of Jerusalem before Essential Versus Inherited; Grace and Faith before Augustine before Protestant Reformation before Individual Conscience; Neither Jew Nor Greek before Idea of Human Equality and Compelling Inclusive Vision; One Body Many Parts before Systems Thinking; Paul's Contested Legacy before Christian Anti-Judaism before Who Is Hurt by Change; Change Leadership before Legacy Institution before Direct Instruction before AI-Native School; Paul as Change Case Study before all its dependents; Insider Change Leader before Veteran Teacher Champions; Essential Versus Inherited before Grammar of Schooling before Seat Time and Carnegie Unit; Lecture to Dialogue before Teacher as Coach; Diffusion of Innovation and Hub and Spoke Diffusion before Pilot School as Hub; Building a Team before Guiding Coalition; Tentmaking before Sustainable Funding; Systems Thinking before School as a System before Anchoring; Implementation Dip before Change Fatigue; Succession Planning before Anchoring Change in Culture before New Model Becomes Legacy before Limits of the Paul Parallel before Leadership Reflection.
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4.
- **AI-Native Schools chapters opened before citing:** 01, 03, 11, 15, 16, 17, 18, 19, 20 (titles copied exactly; claims checked against their text: Rogers' categories and percentages, opinion leaders, beachhead; Fullan's implementation dip with the 70/63/78 illustrative series; Kotter's guiding coalition and anchoring, Senge's shared vision, Bridges' endings and losses; Tyack and Tobin's grammar of schooling, change fatigue, the two rollout loops; teacher champions, pilot classrooms, fear of job loss; the AI-native school and teacher as coach; the 250-to-150-minute compressed morning; the 13-of-28 class; the Carnegie unit). "Succession planning" and "sustainable funding" are not attributed to that book, since it does not treat them.
- **MicroSim reuse search:** available. Timeline `generate` (0.427); sorter `generate` (0.545); causal-loop `template` (0.616, systems-thinking/cld-creation-workflow, recorded as a Template line). 0 reused, 1 from template, 2 newly specified. Note: *AI-Native Schools* Chapter 18 has a local sim `reinforcing-or-balancing` with the same counting-rule design; this chapter's loop spec reuses its two rollout loops (credited in Provenance) and adds four loops from Paul's world and change fatigue.
- **Coverage split honored:** Paul's life, letters, team, hub worked example, and Miletus (Chapter 9) and the riot narrative (Chapter 10) are referenced, not retold. Promises kept from Chapter 9 (the Jerusalem meeting, tentmaking, anti-Judaism, one body and love, faith not works) and Chapter 10 (the riot as economics of resistance).

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 11. Paul at Ephesus, Part 2 | 1 / 16 / 26 | 7,620–12,350 | ~13,080 (brief's counter; includes tables, lists, admonitions, Key Takeaways) | ~3,430 | 43/43 |

Tier A (1): Change Leadership. Tier B (16): Paul as Change Case Study, Legacy Institution, Direct Instruction, Paul's Contested Legacy, AI-Native School, One Body Many Parts, Systems Thinking, Grace and Faith, Diffusion of Innovation, School as a System, Succession Planning, Christian Anti-Judaism, Anchoring Change in Culture, Council of Jerusalem, New Model Becomes Legacy, Who Is Hurt by Change. Tier C (26): the rest.

About 6% above the top of the budget, in line with Chapters 9 (~19,040) and 10 (~13,340). The excess is mostly tables and short lists added to keep runs of prose to four paragraphs or fewer, and the two-subject structure (theology, then leadership) needs bridging prose.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 11 | 17 (plus 3 inside specs) | 3 | 12 (welcome 1, thinking 3, tip 2, warning 3, encourage 2, celebration 1) | how-pauls-words-traveled (vis-timeline, Analyze/organize); essential-or-inherited-school-practices (p5.js, Evaluate/judge); loops-ephesus-to-staff-room (vis-network causal-loop, Analyze/differentiate) |

Tables: Acts 15 vs Galatians 2; four readings of faith and works; Livy's body vs Paul's; the chain of readers of Romans; six contested lines; the teaching of contempt; three changes on our route; two legacy institutions; the compressed-morning minutes; Paul-to-school map with AI-Native Schools chapters; adopter groups for 60 teachers; two rollout loops; one change through six parts of a school; single-point-of-failure test; Paul's anchors; three generations of school reform; "who is hurt" inventory. Lists include Paul's Abraham argument, Pelagius vs Augustine, Paul's uses of conscience, Galatians 3:28's three divisions, champion needs, pilot elements, letter strengths and limits, Paul's team, funding sources, teacher roles, limits of the parallel, and the three reflection questions.

## Validation

- Frontmatter parses; `date` is a string (exit 0).
- `validate-chapter-mascots.py`: OK, no violations (exit 0).
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines (run after all edits).
- Specification self-check: six header lines (plus one Template line), no indented lines, no layout, pixel, color, or Implementation lines; counts match Content (12 events, 4/2/3/3; 12 cards, 6/6 with trap pair 5 and 11; 6 loops, 4 reinforcing and 2 balancing) and Chapter Anchors match the prose. The loop spec sits after the Change Fatigue section so every term it uses is defined above it.
- No more than 4 consecutive prose paragraphs without a non-text element (checked by script; five runs of 5 fixed with lists or merges).
- No TODO and no "(verify)"; all 43 concepts appear in bold (three with small wording variants: "love as the greatest virtue," "Paul as a change case study," and "seat time" plus "Carnegie unit" bolded separately).
- `scripts/pronunciations.py`: 5 new terms with audio (Chrysostom, Pelagius, Menenius Agrippa, agapē, Nostra Aetate); all 5 buttons landed in Chapter 11; check OK. The uncommitted Antikythera row was temporarily removed for `all` (the script would have put its button in Chapter 20's Summary, a stub), then restored byte-for-byte in place, and `appendix` and `check` rerun with it (92 terms; Antikythera has audio and no chapter button).

## Caption Changes

- Pick 1 (IMG_0831): "Standing columns at Ephesus (verify)" -> "Standing columns in the upper city of Ephesus". General caption: the contact sheet is too small to name the building or confirm the order; the time (08:34 Athens, before the Memmius Monument photo) puts it in the upper city.
- Pick 2 (IMG_0846): "A ruined arch at Ephesus (verify)" -> "A lone arch above fallen blocks in the upper city of Ephesus". It is the same arch as Chapter 10's pick 7 (IMG_0845) from a closer angle, so the caption stays general and the photo is used for a different passage (legacy institutions).
- Pick 3 (IMG_0932): "A stone pine above the ruins" -> "A stone pine above the ruins of Ephesus".

## Corrections to Earlier Chapters (reported, not edited)

- None found. Chapter 9's and Chapter 10's forward references to Chapter 11 are all honored.

## Notes for the Author

- Listen to the new recordings, especially agapē (TTS may read it as English "agape," mouth open), Chrysostom, and Nostra Aetate; regenerate with the phonetic fallback if needed.
- From memory, worth checking: Jefferson's 1820 letter calling Paul the first corrupter of Jesus' teaching; the 1807 *Slave Bible* omitting Galatians 3:28 (as widely reported in 2018); Ignatius naming Onesimus as bishop of Ephesus about 110 CE; Pliny's letter 10.96 (about 112 CE) on temples and sacrificial meat; the Kairos Document (1985) on Romans 13; the councils of 416 and 418 against Pelagius; the ELCA's 1994 repudiation of Luther's anti-Jewish writings; Methodists joining the Joint Declaration (2006); Quincy Grammar School (1848) as the first age-graded school; US public schools at about 50 million students and more than 3 million teachers.
- Augustine's "witness" doctrine is dated "early 5th century"; it appears in several works, notably *City of God* Book 18.
- Acts 21:1 (Miletus to Cos, Rhodes, Patara) is paraphrased, not quoted.
- Scripture quotations follow the NRSV wording and are kept under 15 words each; Galatians 3:28 is quoted in part and paraphrased.
- The causal loops for the Ephesus silversmiths and for Corinth are illustrative simplifications, labeled so in the spec.

## Files Created/Updated

- docs/chapters/11-paul-ideas-leadership/index.md
- docs/chapters/11-paul-ideas-leadership/img/ (3 exported JPEGs)
- data/photo-picks.csv (3 captions, 3 web paths), data/pronunciations.csv (5 rows), docs/appendices/pronunciation-guide.md, docs/audio/{chrysostom,pelagius,menenius-agrippa,agape,nostra-aetate}.mp3
- logs/ch-11-content-generation.md, this log

# Chapter 12 Session (Day 8: Rhodes)

- **Start:** 2026-11-24 18:40:03
- **End:** 2026-11-24 18:58:34
- **Chapter:** docs/chapters/12-rhodes/index.md ("Day 8: Rhodes, From the Colossus to the Knights")
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4.
- **Promises from earlier chapters honored:** Chapter 2's November waiter and "port day that is ours" (lunch in the Old Town, afternoon in La Juderia), the short November menu, *efcharistó*, *kaliméra*, *óchi* (tied to Ochi Day); Chapter 4's Metropolis of Rhodes under the Ecumenical Patriarchate and the Fourth Crusade; Chapter 5's siege of 1522 told "from the knights' side" and the Mosque of Suleiman (1808); Chapter 6's Sephardic families and the 1944 tragedy; Chapter 7's Italian rule from 1912 and the 1923 exchange not applying to Rhodes; Chapters 1 and 10 on the Colossus (not retold). Clock change (Greece one hour behind Turkey) in the opening and Practical Notes.
- **AI-Native Schools chapters opened before citing:** 10 (Student Privacy and Data Governance) and 13 (Social Learning and Human Skills); titles copied exactly, claims match their summaries. Chapter 11 (Mastery Learning, two-sigma) deliberately left for Chapter 20, which owns "Teaching Comes to Learner."
- **MicroSim reuse search:** available. Layers sorter `generate` (0.339); timeline `generate` (0.364); olive-oil label `generate` (0.556). 0 reused, 0 from template, 3 newly specified.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 12. Rhodes | 0 / 15 / 16 | 5,670–9,200 | ~11,810 (brief's counter; includes 8 tables, lists, admonitions, Key Takeaways) | ~3,440 | 31/31 |

Tier B (15): Rhodes, Knights Hospitaller, Hospitaller Rhodes, Rhodes Medieval Town, Greek Cuisine, Athena, Olive Oil, Rhodes City Walls, Siege of Rhodes 1522, Mediterranean Diet, Ottoman Rhodes, World War II, Rhodes School of Rhetoric, Italian Rule of Rhodes, Jewish Quarter of Rhodes. Tier C (16): the rest.

About 28% above the top of the budget, after one trimming pass (from ~12,050). Similar to Chapters 10 and 11. The excess comes from the many-layered history (eight rulers), the care given to the 1944 deportation (a Tier C concept by CIS, written at Tier B length on purpose, with sourced ranges), and two Learning for All notes.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 12 | 8 (plus 9 inside specs) | 8 | 10 (welcome 1, thinking 3, tip 2, warning 2, encourage 1, celebration 1) | rhodes-changes-hands-1912-1948 (vis-timeline, Understand/interpret); rhodes-old-town-layers-sorter (p5.js, Analyze/attribute); read-the-olive-oil-label (p5.js, Evaluate/judge) |

Tables: Greek phrases; cruise-fee seasons; Athena's attributes; the knights' headquarters 1099 to today; Athens vs Rhodes in WWII; taverna menu sections; olive oil grades; Roman visitors to Rhodes.

## Validation

- Frontmatter parses; `date` is a string (exit 0).
- `validate-chapter-mascots.py`: OK, no violations (exit 0).
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines (run after all edits).
- Specification self-check: six header lines, no indented lines, no layout, pixel, color, or Implementation lines; no "for example/such as/etc." in Content; counts match (13 events, 5 questions; 12 cards with summary 2/3/4/3; 9 labels, 3 supporting); Chapter Anchors match the prose.
- No more than 4 consecutive prose paragraphs without a non-text element (script check, max run 4).
- No TODO and no "(verify)"; all 31 concepts appear in bold.
- `scripts/pronunciations.py`: 6 new terms with audio (philoxenia, Mandraki, Hospitaller, Juderia, Kahal Shalom, Selahattin Ülkümen). Buttons: 5 in Chapter 12; Kahal Shalom landed in Chapter 1 (its first running-text use, the "why Spanish was spoken in Rhodes" worked example). The uncommitted Antikythera row was temporarily removed for `all` (the dry run showed its button would land in Chapter 20's stub Summary), restored byte-for-byte (`cmp` clean), and `appendix` (98 terms) and `check` (OK; Antikythera has audio and no chapter button) were rerun.

## Caption Changes

- Pick 4 (IMG_0967): "Medieval windmills on the Mandraki harbor mole" -> "Windmills on the mole of Mandraki harbor" (the windmills' date is not certain).
- Pick 5 (IMG_1109): "Stone siege balls in the moat (verify)" -> "Stone siege balls in the grass of the dry moat". Contact sheet shows round stone balls on grass; taken 15:05, five minutes before the dry-moat photo at the same spot.
- Pick 6 (IMG_0982): "A Gothic arch in the Old Town (verify)" -> "A ruined Gothic arch in the Old Town of Rhodes". General caption: possibly the ruined church of Our Lady of the Burgh, but not certain from the sheet.
- Pick 7 (IMG_0979): "Bronze dolphin sculpture at the harbor" -> "A dolphin sculpture at the harbor, with the Old Town walls behind" (material not certain).
- Pick 8 (IMG_0976): "The harbor walls across the water" -> "The walls of the Old Town across the harbor in the morning" (08:18 Athens time; sunrise about 6:45 AM).

## Corrections to Earlier Chapters (reported, not edited)

- Chapters 1 and 7 say the Dodecanese "joined Greece in 1947." The Paris treaty (February 10, 1947) and Greek administration (spring 1947) are 1947, but formal union was March 7, 1948. Chapter 12 explains both dates; the earlier wording is defensible but could say "1947–1948."

## Notes for the Author

- All our Day 8 photos are in the Old Town (08:00–09:19 and 15:05–15:10). The chapter does not say whether we went to Lindos; the Practical Notes treat it as optional. If we did, add a sentence and perhaps a photo.
- Holocaust figures are given as sourced ranges: deported "more than 1,700" (CDEC) with source estimates from about 1,600 to over 1,700 from Rhodes and 65–100 from Kos; survivors 151 (USHMM) to 179 (CDEC, includes Kos). Dates: July 23, 1944 departure; train from Athens August 3; Auschwitz August 16 (some sources say August 17). Ülkümen: 42 released, about 50 protected; Righteous Among the Nations 1989.
- The registry list of spring 1944 is from a study of the Italian administration's role in the deportation (cyberleninka.ru article, "The role of the Italian civil administration in the deportation of the Rhodes Jewish community, July 1944"); worth reading before publishing the Learning for All note.
- From memory, worth checking: Rhodes island size and population (~125,000); Hippodamus attribution; Rome making Delos a free port in 166 BCE; the trireme relief at Lindos (about 180 BCE); Lindian Chronicle found 1904; Cicero in *Brutus* 316 (Molon reining in his style) and Plutarch's *Cicero* 4 (teacher's name uncertain, so not named); Pompey's visits to Posidonius (66 and 62 BCE); the Senate's expulsion of Greek rhetoricians (161 BCE) and the censors' edict (92 BCE); Hospitaller langues (eight by 1462); Margat/Acre after 1187; Malta for a falcon; hospital 1440–1489; Liberty Gate 1924; Church of the Annunciation 1925; Italian imposed in schools under De Vecchi (from about 1937); Greek administration March 31, 1947; German surrender of the Dodecanese May 8, 1945 (signed on Symi); Viking Star capacity 930 guests; Greek cruise fees as announced in 2025 (€1 per passenger at Rhodes November to March; sources disagree on season boundaries); EU olive-oil limits (Reg. (EU) 2022/2104) and the 27 °C cold-extraction rule; PREDIMED's ~30% figure.
- Listen to the new recordings, especially Juderia (Ladino *j* as *h*) and Selahattin Ülkümen.
- Eggplant is mentioned briefly (melitzanosalata, with pointers to moussaka, papoutsákia and briám in Chapter 15), per the coverage split.

## Files Created/Updated

- docs/chapters/12-rhodes/index.md
- docs/chapters/12-rhodes/img/ (8 exported JPEGs)
- docs/chapters/01-long-timeline/index.md (Kahal Shalom pronounce button only)
- data/photo-picks.csv (5 captions, web paths), data/pronunciations.csv (6 rows), docs/appendices/pronunciation-guide.md, docs/audio/{philoxenia,mandraki,hospitaller,juderia,kahal-shalom,selahattin-ulkumen}.mp3
- logs/ch-12-content-generation.md, this log

# Chapter 13 Session (Day 9, Part 1: Knossos, the Minoans, and Linear B)

- **Start:** 2026-11-24 18:59:55
- **End:** 2026-11-24 19:18:29
- **Chapter:** docs/chapters/13-knossos-minoans-linear-b/index.md ("Day 9, Part 1: Knossos, the Minoans, and Linear B")
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4.
- **What we actually did:** the chapter teaches Knossos in full but says in the first person that we took Viking's "The Villages of Crete" excursion (Avli winery, Thrapsano) instead of the Knossos excursion, and spent the morning (photos 09:15–10:06) in the Heraklion Archaeological Museum. All nine photos are from the museum. Pithoi are tied forward to Thrapsano; Chapter 14's excursion material was not taken.
- **Promises from earlier chapters honored:** Chapter 1's "two layers" of Knossos (extended, not retold) and Linear B basics; Chapter 2's Linear B syllabary, sign-count rule, "few dozen scribes," and route-table story for Crete; Chapter 4's restoration vs reconstruction and myth test (Evans as the case; myth-test tables for Thera/Atlantis and the Minotaur); Chapter 6's Saffron Gatherer (one back-reference) and knowledge gatekeepers; Chapter 8's Bronze Age collapse and promise to explain how the tablets were read; Chapter 10's fresco definition; Chapter 12's closing link.
- **AI-Native Schools chapters opened before citing:** 21 (Implementing the AI-Native Model Responsibly; "Vendor Lock-In" section) for concentrated AI risk, and 13 (Social Learning and Human Skills; collaboration definition) for credit and teamwork. Chapter 18 (suggested in the course description) was read and judged a weaker fit.
- **MicroSim reuse search:** available. Sorter `generate` (0.374); grid `generate` (0.477); timeline `generate` (0.454). 0 reused, 0 from template, 3 newly specified.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 13. Knossos, Minoans, Linear B | 0 / 6 / 18 | 3,660–6,000 | ~9,150 (brief's counter; includes 6 tables, 9 photo captions counted twice, lists, admonitions, Practical Notes, Key Takeaways) | ~3,890 | 24/24 |

Tier B (6): Knossos Palace (11), Palace Economy (5), Linear A (15), Linear B (13), Alice Kober (5), Michael Ventris (4). Tier C (18): the rest.

Above the CIS budget after one trimming pass (from ~9,335). The excess is in the museum section (the part we saw, carrying six of the nine photos), the Learning for All note (seven concepts plus the AI parallel), and worked examples for several Tier C concepts that needed one to be honest (Minotaur myth test, Evans reconstructions). Comparable to Chapters 5 and 6.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 13 | 6 (plus 9 inside specs) | 9 | 8 (welcome 1, thinking 2, tip 2, warning 1, encourage 1, celebration 1) | knossos-minoan-or-evans (p5.js, Analyze/distinguish); knossos-village-to-decipherment-timeline (vis-timeline, Understand/interpret); crack-linear-b-like-ventris (p5.js, Apply/solve) |

Tables: phases of Knossos; Thera claims vs evidence; Minotaur myth-test sources; Cretan scripts compared; Kober triplet; three AI lessons. Lists: Evans's reconstruction stages, Linear B spelling rules, Ventris's four steps.

## Validation

- Frontmatter parses; `date` is a string (exit 0).
- `validate-chapter-mascots.py`: OK, no violations (exit 0).
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines (run after all edits).
- Specification self-check: six header lines, no indented lines, no layout, pixel, color, or Implementation lines; counts match (10 cards with summary 4/3/3; 16 events, 4 questions; 3 place-name groups, 4 tablet words, 19 signs with Unicode code points verified with Python's unicodedata); Chapter Anchors match the prose.
- No more than 4 consecutive prose paragraphs without a non-text element (script check, max run 4).
- No TODO and no "(verify)"; all 24 concepts appear in bold.
- `scripts/pronunciations.py`: 8 new terms with audio (Phaistos, pithoi, rhyton, Thera, Kamares, larnakes, Thrapsano, labrys). Buttons: 6 in Chapter 13; Phaistos and Thera landed in Chapter 1 (first running-text uses in "The Minoan Civilization"). The uncommitted Antikythera row was temporarily removed for `all` (the dry run showed its button would land in Chapter 20's stub Summary), restored byte-for-byte (diff against the saved copy shows only the 8 appended rows), and `appendix` (106 terms) and `check` (OK; Antikythera has audio and no chapter button) were rerun.

## Caption Changes

- Pick 8 (IMG_1239): "A fragmentary Minoan fresco (verify)" -> "Fragments of a Minoan wall painting set into a modern plaster panel". The contact sheet shows fragments mounted on a plaster panel; the scene could not be identified with certainty, so the caption is general (and illustrates the chapter's point about restored frescoes).
- Other eight captions kept. All photos 09:15–10:06 Athens time; no time-of-day words used.

## Image Suggestions (Wikimedia Commons, not downloaded)

- We have no photos of the Knossos site itself (we did not go). If wanted: the North Entrance with Evans's red columns and the bull-relief copy, the Throne Room, and a Linear B tablet (e.g. the Pylos tripod tablet Ta 641) would each illustrate a section.

## Corrections to Earlier Chapters (reported, not edited)

- Chapter 8 ("the Linear B tablets were baked hard by the fires that ended the palace world") and Chapter 2's worked example ("when the palaces fell around 1200–1100 BCE ... the script died with the scribes" of Knossos) imply Knossos fell in the general collapse. In the usual dating Knossos burned about 1375 BCE, more than a century earlier (some scholars argue for about 1200). Chapter 13 states the usual date with that caveat.
- Chapter 14's pick 9 (IMG_1150) is captioned "Sunset over Heraklion harbor" but was taken at 07:08 Athens time; sunrise in Heraklion on November 19 is about 7:00 AM, so it is a sunrise/early-morning photo. Not edited (Chapter 14's picks).

## Notes for the Author

- From memory, worth checking: Knossos central court "roughly 50 m by 25 m"; Neolithic settlement about 7000 BCE; first palace about 1900, rebuilt about 1700, final destruction about 1375 BCE; Kalokairinos 1878; Evans at Knossos from March 1900, Throne Room April 1900; reconstruction phases (wood from about 1905, concrete mainly 1920s; Christian Doll, Piet de Jong, the Gilliérons); Venice Charter (1964) Article 15; Thera about 110 km from Crete; Marinatos 1939; Bull-Leaping Fresco "about 1450–1400 BCE", "less than a meter high", east wing; bull's-head rhyton details (black stone, rock-crystal eye, restored gilded horns); the smaller Snake Goddess found without its head, head and cat restored; Heraklion museum building by Patroklos Karantinos 1937–1940, reopened 2014, frescoes upstairs; about 1,400 Linear A inscriptions, most tablets from Hagia Triada, *ku-ro* = total; Phaistos Disc about 16 cm, 241 signs, 45 kinds, 61 groups, found 1908 by Pernier; KN Gg 702 honey to "the Mistress of the Labyrinth"; Knossos sheep tablets "tens of thousands"; Kober about 180,000 cards, cigarette cartons, papers at UT Austin (PASP), triplet example a-mi-ni-so / a-mi-ni-si-jo / a-mi-ni-si-ja (presented as "of the kind she found"); Ventris at the 1936 Burlington House exhibition, 20 Work Notes, BBC broadcast July 1, 1952, death September 6, 1956; Chadwick as wartime codebreaker; Bennett's Pylos Tablets 1951; Blegen's tripod tablet (found 1952, read 1953); Vesuvius Challenge winners (Farritor, Nader, Schilliger) and Brent Seales; MIT 2019 neural decipherment (Luo, Cao, Barzilay).
- Practical Notes avoid prices, exact winter hours, and bus numbers ("check on the day"); a combined Knossos-museum ticket is mentioned as "offered in past years."
- Listen to the new recordings, especially Phaistos (local *feh-STOS*; English speakers often say *FYE-stos* or *FEST-os*), Thrapsano, and Kamares.
- No Greek food section here (Chapter 14 owns the Cretan diet), so the eggplant thread is not touched in this chapter.

## Files Created/Updated

- docs/chapters/13-knossos-minoans-linear-b/index.md
- docs/chapters/13-knossos-minoans-linear-b/img/ (9 exported JPEGs)
- docs/chapters/01-long-timeline/index.md (Phaistos and Thera pronounce buttons only)
- data/photo-picks.csv (1 caption, 9 web paths), data/pronunciations.csv (8 rows), docs/appendices/pronunciation-guide.md, docs/audio/{phaistos,pithoi,rhyton,thera,kamares,larnakes,thrapsano,labrys}.mp3
- logs/ch-13-content-generation.md, this log
