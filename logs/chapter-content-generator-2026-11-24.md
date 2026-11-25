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

# Chapter 14 Session (Day 9, Part 2: Venetian Heraklion and Crete Today)

- **Start:** 2026-11-24 19:19:10
- **End:** 2026-11-24 19:40:53
- **Chapter:** docs/chapters/14-venetian-heraklion/index.md ("Day 9, Part 2: Venetian Heraklion and Crete Today")
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4.
- **What we actually did:** old town in the late morning (photos 10:35 Lions Square, 10:38 Loggia, 10:43 Agios Titos, 11:26–11:28 the arsenal at the harbor), then Viking's "The Villages of Crete" in the afternoon (countryside 14:32 at about 310 m; Thrapsano workshop 15:28). The chapter says plainly that Chapter 2 planned the old town for the afternoon and we swapped it. The excursion gets Part Four, in the first person; Avli is described only as "a tasting at the Avli winery", with general (not winery-specific) facts about Cretan grapes and the Peza/Archanes wine country, tied to the Minoan wine press at Vathypetro and Chapter 13's palace economy. Thrapsano is tied to Chapter 13's pithoi with a Minoan-vs-today comparison table.
- **Promises from earlier chapters honored:** Chapter 4 ("Chapter 14 walks its fortifications in Heraklion"; Agios Titos; the 1513 Plato and Byzantine copying, extended through Musurus as editor); Chapter 6 (printing, fixed vs marginal cost not repeated; gatekeepers, applied to the editor and to Aldus's privileges); Chapter 7 (Crete to Greece 1913; Agios Titos a church again in 1925; the other Francesco Morosini and the Parthenon, 1687); Chapter 9 (Letter to Titus treated as disputed; "Chapter 14 will find his church in Heraklion"); Chapter 11 (Titus at Jerusalem); Chapter 12 (Mediterranean diet and Seven Countries Study not retold, Cretan version extended; philoxenia; WWII); Chapter 13 (museum and old town, pithoi to Thrapsano, "Chapter 14 tells that visit"); Chapter 2 (route-table story "Cretan scholars and cheap printed classics"; four-step pattern).
- **AI-Native Schools chapters opened before citing:** 07 (Content Economics and Open Educational Resources; OER definition, free vs open, penny-per-day vision) framed freshly through Aldus's privileges vs the Lyon printers (cheap but not open) and the editor's job when copying is free; paired with 06 (The Five-Level Model of Intelligent Textbooks; Level 2 interactive textbooks) for the Intelligent Textbook concept.
- **MicroSim reuse search:** available. Map `generate` (0.484); folding calculator `generate` (0.437); network `generate` (0.351). 0 reused, 0 from template, 3 newly specified.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 14. Venetian Heraklion and Crete Today | 0 / 8 / 16 | 3,920–6,400 | ~9,260 (brief's counter; includes 6 tables, 9 captions counted twice, lists, admonitions, Practical Notes, Key Takeaways) | ~3,110 | 24/24 |

Tier B (8): Venetian Crete (16), Candia (8), Cretan Renaissance (7), Marcus Musurus (5), Aldus Manutius (5), Cretan Diet (5), Venetian Walls of Heraklion (4), Aldine Editions (4). Tier C (16): the rest.

Above the CIS budget, like Chapters 5, 6 and 13. The excess is in Part Four (the excursion was asked to get real room, so Cretan Village Life, a Tier C concept, runs about 450 words with a worked example and table), the Learning for All note (three concepts plus the AI parallel), and the Ottoman Crete revolts table.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 14 | 6 (plus 9 inside specs) | 9 | 8 (welcome 1, thinking 2, tip 2, warning 2, celebration 1) | walking-venetian-candia-map (Leaflet, Remember/locate); folio-quarto-octavo-paper-calculator (p5.js, Apply/calculate); greek-book-makers-venice-network (vis-network, Analyze/attribute) |

Tables: five names of Heraklion; Crete from revolt to union (1821–1923); Greek vs Latin manner of icon painting; Aldus's early list; Cretan menu by source; Minoan pithos vs Thrapsano jar. Lists: the wine-cask journey, Musurus's four editing steps, Kazantzakis's three books.

## Validation

- Frontmatter parses; `date` is a string (exit 0).
- `validate-chapter-mascots.py`: OK, no violations (exit 0).
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines (run after all edits, including the pronounce buttons).
- Specification self-check: six header lines in each block, no indented lines, no layout, pixel, color, or Implementation lines, no "for example"/"such as"/"etc." in Content; counts match (8 landmarks; 3 formats, 3 challenges with ceiling arithmetic checked, including the 10- and 40-line edge cases; 10 people, 10 cards, 8 links, 3 Cretans); Chapter Anchors match the prose (1628; 1523–1540; seven bastions; less than a kilometer; 12,900 lines, 860/215, 430/27, one-eighth).
- No more than 4 consecutive prose paragraphs without a non-text element (script check, max run 4).
- No TODO and no "(verify)"; all 24 concepts appear in bold.
- `scripts/pronunciations.py`: 8 new terms with audio (Koules, Musurus, Manutius, Theotokopoulos, Erotokritos, Kazantzakis, dakos, tsikoudia). Buttons: 7 in Chapter 14; Manutius landed in Chapter 4 (first running-text use, the "following Plato" worked example). The uncommitted Antikythera row was temporarily removed for `all` (the dry run showed its button would land in Chapter 20's stub Summary), restored byte-for-byte (`cmp` against the saved copy; diff against the pre-run copy shows only the 8 appended rows), and `appendix` (114 terms) and `check` (OK; Antikythera audio=yes, no chapter button) were rerun.

## Caption Changes

Resolved from the contact sheet plus each photo's GPS in the Takeout sidecar metadata (no full-size photos opened):

- Pick 2 (IMG_1269): "Vaulted interior of the Koules Fortress" -> "Vaulted ship shed of the Venetian arsenal, Heraklion". GPS (35.3422, 25.1353) is on the south side of the old harbor, about 300 m from the Koules, and the sheet shows open, partly roofless galley vaults behind a conservation fence.
- Pick 3 (IMG_1268): "Koules Fortress and the Venetian harbor" -> "The Venetian arsenal beside Heraklion's old harbor". Same spot; the vaulted roofs of the arsenal are in frame, the Koules is not identifiable.
- Pick 4 (IMG_1257): "(verify)" removed -> "The Basilica of San Marco (Agios Markos), Heraklion". GPS is in Lions Square; the columned portico matches.
- Pick 5 (IMG_1262): "Interior of Agios Minas Cathedral (verify)" -> "Interior of the Church of Agios Titos, Heraklion". GPS (35.3400, 25.1348) is at Agios Titos, about 100 m east of the Loggia, five minutes after the Loggia photo; Agios Minas is about 400 m southwest. Worth a glance by the author.
- Pick 7 (IMG_1281): "Cloud over a Cretan mountain (verify)" -> "A cloud-capped mountain in inland Crete" (general; taken at 35.122, 25.302, about 310 m, the peak not identifiable).
- Pick 8 (IMG_1306): "Pots drying in a Cretan pottery workshop" -> "Pots drying in a pottery workshop at Thrapsano" (GPS 35.201, 25.258, in the Thrapsano area, during the excursion).
- Pick 9 (IMG_1150): "Sunset over Heraklion harbor" -> "Sunrise over the port of Heraklion" (taken 07:08 Athens time; sunrise about 7:00 AM; GPS in the commercial port where the ship docked).
- Picks 1 and 6 kept.

## Corrections to Earlier Chapters (reported, not edited)

- Chapter 7 says Agios Titos was "a mosque until 1923" (table) and "became a church again in 1925" (worked example). Not a contradiction (the Muslims left in 1923–1924; reconsecration 1925); Chapter 14 states both. No edit needed unless the author wants one date.
- Chapter 2 gives the Heraklion sunset as "around 5:10 PM"; the brief's computed value is about 5:15 PM, which Chapters 13 and 14 use. Trivial.

## Notes for the Author

- From memory, worth checking first: the 1499 contract for 700 icons of the Virgin in 45 days (500 Latin manner, 200 Greek manner, three painters, two dealers); Heraklion's two El Grecos (*View of Mount Sinai*, *The Baptism of Christ*) in the Historical Museum of Crete; the riot of August 25, 1898 (British soldiers and the British vice-consul killed) and 25th August Street being named for it; Orthodox priests having to go off the island for ordination under Venice; the relic of Titus taken to Venice in 1669 and returned in 1966; Musurus as a student of Janus Lascaris; Thrapsano potters traditionally traveling in summer teams; about 40 percent of calories from fat (mostly olive oil) for Cretan men in the Seven Countries Study; dakos also called *koukouvagia*, "owl."
- Also from memory: Boniface sold Crete to Venice in 1204, control by about 1211; Revolt of Saint Titus 1363; Rabdh al-Khandaq "castle of the moat"; Chandax after 961; Herakleion revived in the 19th century after a harbor of Knossos; Loggia built in the 1620s, war-damaged and restored, part of city hall; Morosini Fountain 1628, aqueduct from Mount Juktas, eight-lobed basin with sea reliefs, lions older than the fountain; San Marco 13th century, a mosque, now an exhibition hall; Agios Titos history (after 961, Catholic, mosque, 1856 earthquake, 1925); Gortyn 6th-century basilica; Koules 1523–1540, *Rocca a Mare*, lion reliefs; walls by Michele Sanmicheli; bastion names and order (Sabbionara, Vitturi, Jesus, Martinengo, Bethlehem, Pantocrator, St. Andrew); siege 1648–1669 (Chania 1645, Rethymno 1646, Köprülü Fazıl Ahmed from 1667, French expedition 1669, surrender September 1669; Souda, Gramvousa, Spinalonga, the last until 1715); Arkadi 1866; Theophanes at Meteora and Athos; *Erotokritos* about 10,000 lines, around 1600, printed in Venice 1713; El Greco dates (1541; master by 1563; Venice about 1567; Rome 1570; Toledo 1577; died 1614; signed *Kres*); Musurus (Rethymno; Aristophanes 1498; Plato 1513; Hesychius 1514; Padua; Rome and archbishop 1516; died 1517); Kallierges and Vlastos, *Etymologicum Magnum* 1499; Aldus (Bassiano; Carpi; press about 1494; Torresani partner and father-in-law; New Academy; dolphin and anchor; Lascaris grammar 1495; Aristotle 1495–1498; Virgil 1501 first all-italic book; Sophocles 1502; about thirty Greek first editions; Lyon warning 1503; Venetian privilege for italic; press to 1597); Griffo; Erasmus at the press in 1508; Bembo's Petrarch and Dante; Battle of Crete details (May 20, 1941; Maleme; evacuation end of May; Kreipe kidnapping 1944); Kazantzakis (1883–1957; 33,333 lines; grave on the Martinengo Bastion; epitaph); Heraklion about 180,000, fourth-largest city; Mount Ida 2,456 m; Nativity fast from November 15; Vathypetro wine press; Vidiano, Vilana, Kotsifali, Mandilari; Peza and Archanes.
- The map spec's reference points for cards 1–4 come from our photos' GPS; cards 7 (Martinengo) and 8 (Pantocrator Gate) are approximate, and the spec tells the generator to check all eight against OpenStreetMap.
- The Virgil paper calculation uses illustrative page densities (15 and 30 lines per page), labeled as such in prose and spec.
- No lunch details were invented; the chapter does not say where or what we ate.
- Listen to the new recordings, especially Theotokopoulos, Erotokritos, tsikoudia, and Koules (*koo-LESS*).

## Files Created/Updated

- docs/chapters/14-venetian-heraklion/index.md
- docs/chapters/14-venetian-heraklion/img/ (9 exported JPEGs)
- docs/chapters/04-byzantine-constantinople/index.md (Manutius pronounce button only)
- data/photo-picks.csv (7 captions, 9 web paths), data/pronunciations.csv (8 rows), docs/appendices/pronunciation-guide.md, docs/audio/{koules,musurus,manutius,theotokopoulos,erotokritos,kazantzakis,dakos,tsikoudia}.mp3
- logs/ch-14-content-generation.md, this log

# Chapter 15 Session (Day 10: Athens, the Acropolis, and the Persian Wars)

- **Start:** 2026-11-24 19:41:32
- **End:** 2026-11-24 20:10:10
- **Chapter:** docs/chapters/15-athens-acropolis/index.md ("Day 10: Athens, the Acropolis, and the Persian Wars")
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4.
- **What we actually did:** photos show the Agora around 1:00 PM (Chapter 16's material, not used here) and the Acropolis from 15:18 to 16:14 Athens time, entering by the west slope above the Odeon of Herodes Atticus (GPS), through the Propylaea (15:32), around the Parthenon and the Erechtheion; sunset about 5:10 PM. The chapter says so in the first person and keeps time words to "late afternoon" and "about an hour before sunset."
- **Promises from earlier chapters honored:** Chapter 1 (480 BCE, Salamis near Piraeus, 454 BCE Delian treasury, 447–432 BCE; follow-the-money not retold); Chapter 2 (Pentelic marble, November weather, sunset 5:10 PM, four-step pattern); Chapter 4 (myth test on the marathon runner, the golden ratio and the Caryatids' name; contested history for the marbles; the seven "Reading a Ruin" questions on the Parthenon; restoration vs reconstruction; spolia in the north wall; Serpent Column); Chapter 5 (hünkâr beğendi, baklava dispute); Chapter 6 (imam bayıldı, patlıcan kebabı, döner); Chapter 7 (Ottoman Parthenon and 1687 extended, not retold; Hellespont crossing); Chapter 8 (Mycenaeans, Schliemann, fall of Troy on the north metopes); Chapter 10 (Doric/Ionic orders, Greek theater, Asia Minor refugees); Chapter 12 (Athena, Greek cuisine, "Chapter 15 gives eggplant, moussaka, papoutsakia and briam the full treatment"); Chapter 14 (Morosini's namesake, briam, melitzanosalata). Forward pointers: Chapter 16 (Agora, ostracism, rowers and democracy), Chapter 17 (wooden-walls oracle, Nothing in excess, Oedipus), Chapter 18 (Athenian Treasury), Chapter 20 (National Archaeological Museum copy of the Athena Parthenos, Plaka, Greek coffee).
- **Learning for All choice:** Chapter 2's Days 10–11 story (Socrates; democracy that left most out) is left to Chapter 16. Day 10's note is "History Anyone Can Check": Herodotus' *historia* as a public, checkable account (poets and Darius at Behistun vs inquiry; Thucydides and Plutarch as resistance; free Greek men only). AI parallel: show sources, reports and conclusions separately.
- **AI-Native Schools chapter opened before citing:** 02 (Evidence, Motivation, and the Stakeholders of Schooling; evidence-based practice and curiosity sections). Not previously cited in this book.
- **MicroSim reuse search:** available. Map `generate` (0.325); timeline `generate` (0.343); sorter `generate` (0.356). 0 reused, 0 from template, 3 newly specified.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 15. Athens, the Acropolis, and the Persian Wars | 0 / 10 / 17 | 4,540–7,400 | ~10,790 (brief's counter; includes 10 tables, 7 captions counted twice, lists, admonitions, pronounce respellings, Practical Notes, Key Takeaways) | ~3,290 | 27/27 |

Tier B (10): Acropolis (21), Persian Wars (14), Greek Tragedy (12), Pericles (7), Hubris (7), Phidias (6), Athens as Modern Capital (6), Parthenon (5), Herodotus (5), Themistocles (4). Tier C (17): the rest.

Above budget and above Chapters 13–14 (~9,200) after two trimming passes (from ~12,800). The excess is in the many tables (10), the six-part structure with 27 concepts, worked examples for several Tier C concepts that needed one to be honest (marathon runner myth test, golden ratio, Parthenon's later lives), the eggplant section the brief asked to give room, and the marbles dispute, which needed both positions with dates.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 15 | 10 (plus 7 inside specs) | 7 | 10 (welcome 1, thinking 3, tip 2, warning 2, encourage 1, celebration 1) | persian-wars-campaign-map (Leaflet, Understand/infer); parthenon-five-lives-timeline (vis-timeline, Understand/classify); parthenon-marbles-fact-or-position (p5.js, Analyze/differentiate) |

Tables: Persian Wars on our route; Herodotus' four kinds of statement; marathon-runner myth test; Acropolis buildings; Phidias' works; Parthenon sculptures; the two marbles positions; three tragedians; hubris in Xerxes, Agamemnon, Creon; Greek–Turkish dish pairs. Lists: Athens's three growth waves, trireme numbers, Salamis in five moves, Plutarch's trades, the seven Reading-a-Ruin questions, four eggplant dishes, Practical Notes, Key Takeaways.

## Validation

- Frontmatter parses; `date` is a string (exit 0).
- `validate-chapter-mascots.py`: OK, no violations (10 admonitions for 27 concepts).
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines (run after all edits, including the pronounce buttons).
- Specification self-check (script): six header lines in each block, objective starts "The learner will", all eleven body fields present, no indented lines, no "for example"/"such as"/"etc.", no pixel/color/Implementation lines; counts match (8 places and 5 questions; 12 cards in 5 lives, tally Temple 2, Church 2, Mosque 3, Ruin 2, Protected monument 3; 12 statements, tally 6/3/3); Chapter Anchors match the prose (20 ships, 498, 490, 10,000 and 1,000, 192, 378 and 180, 1.2–6 km from Chapter 7, 1687 and about three hundred, 1801–1812, 1816 and £35,000, 1963, 2009).
- No more than 4 consecutive prose paragraphs without a non-text element (script check, specs counted as non-text, max run 4).
- No TODO and no "(verify)"; all 27 concepts appear in bold.
- `scripts/pronunciations.py`: 8 new terms with audio (Herodotus, Themistocles, Phidias, Propylaea, Erechtheion, Caryatids, Gyros, Papoutsakia). Buttons: 6 in Chapter 15; Herodotus landed in Chapter 1 ("The Classical Period"), Erechtheion in Chapter 10 ("The Ionic Order"), their first running-text uses. The uncommitted Antikythera row was temporarily removed for `all` (the dry run showed its button would land in Chapter 20's stub Summary), restored byte-for-byte (`cmp` identical to the saved copy; diff against the pre-run CSV shows only the 8 appended rows), and `appendix` (122 terms) and `check` (OK; Antikythera audio=yes, no chapter button) were rerun.

## Caption Changes

Resolved from the contact sheet (crops of panels 3 and 4) plus each photo's GPS in the Takeout sidecar metadata (no full-size photos opened):

- Pick 4 (IMG_1399, 15:32): "Looking up into the Propylaea (verify)" -> "Ionic columns and marble ceiling beams in the Propylaea". GPS 37.97178, 23.72523 is at the Propylaea; the sheet shows an Ionic capital and restored marble beams, matching the gateway's inner passage.
- Pick 3 (IMG_1407, 15:39): "Doric columns and entablature of the Parthenon" -> "... of the Parthenon, with new marble set among the old". GPS 37.97169, 23.72663 is beside the Parthenon's west end; the sheet shows bright new marble patches, used in the restoration paragraph.
- Pick 6 (IMG_1422, 16:05): "The Parthenon against the setting sun" -> "The Parthenon against the late-afternoon sun" (about an hour before the 5:10 PM sunset; GPS northeast of the temple, looking toward the low southwestern sun).
- Pick 7 (IMG_1389, 15:22): "Athens seen from the Acropolis" -> "Athens seen from the slope of the Acropolis" (GPS 37.97130, 23.72486, altitude about 118 m, on the west approach below the summit).
- Picks 1, 2, and 5 kept.

## Corrections to Earlier Chapters (reported, not edited)

- None found. Chapter 1's "the Greek fleet destroyed the Persian navy at Salamis" is a little strong (the Persian fleet withdrew with heavy losses and fought again in 479), but not wrong enough to flag for an edit.

## Notes for the Author

- From memory, worth checking first: the Piraeus Lion taken by Morosini in 1687 with Varangian runes; COSCO majority stake since 2016; Line 1 begun 1869; Acropoli and Syntagma station displays; greater Athens about 3.7 million; Lycabettus 277 m; Darius's "remember the Athenians" (Herodotus 5.105); Herodotus' figures (1,700,000 infantry, more than five million in all; 6,400 and 192 at Marathon; 378 ships, 180 Athenian; 200 ships from Laurion at ten drachmas a head); modern army estimates "often 100,000 to 300,000"; Athos canal and Scythian tombs; Marathon 10,000 and 1,000 (later sources); Aeschylus' epitaph; Pausanias on the Athenian Treasury; Plutarch and Lucian on the runner (three names); 1908 and 1921 for 42.195 km; Olympias 36.9 m, about 170 rowers; Sicinnus as the children's tutor; Xerxes at the foot of Aigaleo; Artemisia's advice; the Oath of Plataea's authenticity; north-wall drums; Acropolis about 150 m, about 3 hectares; Glezos and Santas, May 30, 1941; Pericles' generalships "almost without a break from 443"; Plutarch's trades list and the "pay it myself" story (Per. 12, 14); Parthenon building accounts; Promachos visible from Sounion (Pausanias); Athena Parthenos about 12 m, 40 talents (Thucydides 2.13), Attic talent about 26 kg; cup "I belong to Phidias"; Propylaea 437–432, Mnesicles, five doorways, 1656 lightning, tower demolished 1874 with Schliemann's money; Nike temple 427–424, dismantled 1686, rebuilt 1830s, 1930s and 2000s; Parthenon 30.9 by 69.5 m, curvature about 6 and 11 cm; "golden ratio popularized in the 19th and 20th centuries"; 92 metopes, about 160 m frieze; Erechtheion olive shoot (Herodotus 8.55); Caryatid copies 1979, laser cleaning; Vitruvius and the korai in the accounts; church probably by the late 6th century, Basil II 1018, Latin cathedral 1204, mosque after 1458 with minaret at the southwest corner, 1674 drawings; Morosini's failed removal of the west pediment horses; clearing from 1835; Balanos's iron clamps; restoration program from 1975, titanium; Acropolis Museum June 2009, Tschumi with Photiadis, about 300 m southeast; BM holdings (15 metopes, 17 pediment figures, about 75 m of frieze); Elgin's permission surviving only in an Italian translation; 1816 and £35,000; British Museum Act 1963; Mercouri, 1983 request; Palermo 2022 and Vatican 2023 returns; talks "reported since about 2022"; Theater of Dionysus 15,000–17,000; Odeon 161 CE, restored 1950s; 32 surviving tragedies (7/7/18); Pericles as choregos of *The Persians* (472); Phrynichus fined 1,000 drachmas; feta PDO 2002, up to 30 percent goat's milk, two months in brine; gyros arriving with Anatolian refugees (hedged "probably"); Tselementes and the béchamel moussaka (hedged "usually credited"); "Greek coffee" after 1974.
- The marbles section states both positions as each side states them and says the status is under discussion; check the news before publishing for any agreement announced after this writing.
- The map spec's coordinates are approximate; the spec tells the generator to check each against Wikipedia, and Salamis and Mycale are areas, not exact battlefields.
- Practical Notes avoid prices and exact winter hours ("check on the day"); the timed-entry tip says to book the day before.
- No meal details were invented: the eggplant lunch is a worked example ("let's order"), not a claim about what we ate.
- Listen to the new recordings, especially Erechtheion (*eh-REK-thee-on*; some English guides say *eh-rek-THEE-on*), Gyros (local *YEE-ros*), and Papoutsakia.
- Chapter 2's route table assigns Days 10–11 one story; this chapter's Learning for All note (Herodotus' inquiry) is a new, distinct Day 10 story. The route table could be updated to list it.

## Files Created/Updated

- docs/chapters/15-athens-acropolis/index.md
- docs/chapters/15-athens-acropolis/img/ (7 exported JPEGs)
- docs/chapters/01-long-timeline/index.md (Herodotus pronounce button only)
- docs/chapters/10-ephesus-greco-roman-city/index.md (Erechtheion pronounce button only)
- data/photo-picks.csv (4 captions, 7 web paths), data/pronunciations.csv (8 rows), docs/appendices/pronunciation-guide.md, docs/audio/{herodotus,themistocles,phidias,propylaea,erechtheion,caryatids,gyros,papoutsakia}.mp3
- logs/ch-15-content-generation.md, this log

# Chapter 16 Session (Day 11: Athens, the Agora, Democracy, and Paul on the Areopagus)

- **Start:** 2026-11-24 20:10:59
- **End:** 2026-11-24 20:30:10
- **Chapter:** docs/chapters/16-athens-agora-democracy/index.md ("Day 11: Athens, the Agora, Democracy, and Paul on the Areopagus")
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4.
- **What we actually did:** photos show the Agora at 12:58–13:02 on Day 10 and a 16:20 photo whose GPS fix (37.97244, 23.72303) falls about 50 m from the Areopagus. The chapter is written as the Day 11 guide and says in the first person that we walked the Agora around 1:00 PM on Day 10 and came down to the Areopagus at about 4:20 PM, under an hour before the 5:10 PM sunset.
- **Promises from earlier chapters honored:** Chapter 1 (30,000–50,000 citizens, a quarter of a million or more, "come back on Day 11 at the Pnyx"); Chapter 2 (Days 10–11 Learning for All story; four-step pattern; Greek letters for the plaque); Chapter 9 (Socrates' trial in the Agora, Plato's *Apology*, Stoics and Epicureans debating Paul, the Areopagus scene "read on the spot", Gallio inscription, Acts as Luke's account); Chapter 11 (grace, "neither Jew nor Greek", one body; leadership lesson extended, not repeated); Chapter 12 (philoxenia; the Rhodes list as the dark side of counting); Chapter 15 (rowers and democracy; Themistocles' ostracism; Line 1; eggplant not retold). Forward pointers only: Chapter 17 (the oracle and Socrates, in the celebration), Chapter 20 (none needed; Phaedrus, Aristotle and the Lyceum left alone).
- **AI-Native Schools chapters opened before citing:** 19 (Microstrategies for Leading Change; section "Matching the Strategy to the Person", CBAM stage-to-microstrategy table) for meeting people where they are; 21 (Implementing the AI-Native Model Responsibly; "Equity in Implementation": cost barrier, closing or widening gaps) for Learning for All. Also read 16, 17 and 18 for CBAM; 17 is overused, so not cited.
- **MicroSim reuse search:** available. Voter estimator `generate` (0.390); speech step-through `generate` (0.371); Agora infographic `generate` (0.438). 0 reused, 0 from template, 3 newly specified.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 16. Athens, the Agora, Democracy, and Paul on the Areopagus | 0 / 10 / 16 | 4,420–7,200 | ~10,320 (brief's counter; includes 9 tables, 5 captions counted twice, lists, admonitions, Practical Notes, Key Takeaways) | ~3,410 | 26/26 |

Tier B (10): Athenian Democracy (16), Ancient Agora of Athens (13), Stoa (11), Stoicism (10), Areopagus (9), Paul and the Stoics (9), Paul in Athens (9), Areopagus Speech (8), Altar to an Unknown God (6), Meeting People Where They Are (5). Tier C (16): the rest.

Above budget, in line with Chapters 13–15 (~9,200–10,800). The excess is in worked examples for Tier C concepts that needed evidence to be honest (Themistocles ostraka, Sophist fees, the trial's numbers), the three Learning for All sub-concepts, and the speech, which needed both its five moves and its sources.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 16 | 9 (plus 9 inside specs) | 5 | 9 (welcome 1, thinking 2, tip 2, warning 3, celebration 1) | athens-who-could-vote (Chart.js, Apply/calculate); agora-democracy-workplaces (html infographic, Understand/classify); areopagus-speech-stoic-ears (p5.js, Analyze/differentiate) |

Tables: democratic institutions; Attica population estimates; hill or council; Stoics and Paul; Stoics and Epicureans; altar sources; stages of concern; four wines; teachers' fees. Lists: Assembly/Council/courts/officials, metics and enslaved, three Stoic ideas, the speech's five moves, two cautions, three conversations, the four-step pattern, Practical Notes, Key Takeaways.

## Validation

- Frontmatter parses; `date` is a string (exit 0).
- `validate-chapter-mascots.py`: OK, no violations (9 admonitions for 26 concepts).
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines (run after all edits, including the pronounce buttons).
- Specification self-check (script): six header lines in each block, objective starts "The learner will", all eleven body fields present, no indented lines, no "for example"/"such as"/"etc.", no pixel/color/Implementation lines. Counts match: 4 estimates, 3 challenges (16.0, 25.0, 2.4; total range 180,000–320,000, share 10.0–25.0 percent); 10 places, 9 job cards; 10 lines, tally 7 and 3. Chapter Anchors match the prose.
- No more than 4 consecutive prose paragraphs without a non-text element (script check, specs counted as non-text).
- No TODO and no "(verify)"; all 26 concepts appear in bold.
- `scripts/pronunciations.py`: 8 new terms with audio (Areopagus, Pnyx, Stoa Poikile, kleroterion, Epictetus, Aratus, mezedes, Agiorgitiko). Buttons: 5 in Chapter 16; Areopagus landed in Chapter 9 ("Athens"), Pnyx in Chapter 1 (worked example "how big was Athens's democracy?"), mezedes in Chapter 6 ("Meze"), their first running-text uses. The uncommitted Antikythera row was temporarily removed for `all` (the dry run showed its button would land in Chapter 20's stub Summary), restored byte-for-byte (`cmp` identical to the saved copy; the run itself did not change the CSV; diff against the pre-run CSV shows only the 8 appended rows), and `appendix` (130 terms) and `check` (OK; Antikythera audio=yes, no chapter button) were rerun.

## Caption Changes

Resolved from the contact sheet (a crop of panel 5) and the Takeout sidecar GPS (no full-size photos opened):

- Pick 5 (IMG_1439, 16:20): "View from the Areopagus at sunset (verify)" -> "The pedestal of the Monument of Agrippa below the Propylaea, in late-afternoon light". The frame shows the tall Agrippa pedestal at close range and at eye level, with the Propylaea's north wing at the right and the city below on the left, so it was taken on the Acropolis's west approach, not from the Areopagus. Its GPS fix lies about 50 m from the Areopagus, but the photo a minute earlier (IMG_1438, 16:19) is 20 m from the pedestal; the fix looks like GPS drift. 16:20 is about 50 minutes before the 5:10 PM sunset, so "late afternoon". Used in "Paul in Athens" (Roman Athens honoring Agrippa).
- Pick 3 (IMG_1373): added "and the tracks of metro Line 1 in the foreground" (the open cutting along the Agora's north edge is visible).
- Picks 1, 2, and 4 kept.

## Corrections to Earlier Chapters (reported, not edited)

- None found. Chapter 9 says Xenophon's Socrates "charged no fees" and Chapter 1 gives 30,000–50,000 citizens; both are consistent with this chapter.

## Notes for the Author

- **Photo 5 and the Areopagus time:** the only evidence that we stood on the Areopagus at 4:20 PM is the GPS fix of a photo that actually shows the Agrippa pedestal on the Acropolis's west approach. The chapter says we "came down to the Areopagus at about 4:20 PM"; adjust if your memory differs.
- From memory or a quick check, worth verifying first: Agrippa pedestal about 8.9 m, about 178 BCE for a Pergamene chariot (attribution to Eumenes II is debated, so the text says "probably ... a king of Pergamon"), rededicated after about 27 BCE, "their own benefactor" (from Wikipedia/ysma.gr search results); Odeon of Agrippa in the Agora; American School excavation from 1931, "hundreds of houses" demolished; Holy Apostles about 1000 CE; Stoa of Attalos about 150 BCE, about 115 m, 21 shops a floor, Doric below and Ionic above, Attalos "said to have studied in Athens", Heruli 267 CE, rebuilt 1953–1956; Stoa Poikile 460s BCE, found 1981, visible from Adrianou Street; boundary stone about 500 BCE; Stoa of Zeus as a Socratic haunt (hedged "ancient writers"); Temple of Hephaestus begun about 449 BCE, 6 by 13 columns, Heracles and Theseus metopes, church of St. George until 1834; Assembly about 40 meetings a year; Council aged 30+, at most twice; 6,000 jurors; about 700 officials; jury pay from the 450s, Assembly pay from about 400 BCE; the Old Oligarch on rowers; kleroterion mechanism, bronze ballots, water clock about six minutes; Pnyx from about 500 BCE, about 6,000 then 10,000 or more, the red rope in *Acharnians*; ostracism 6,000 votes, ten days, 487 to about 417 BCE, Aristides 482; about 190 Themistocles ostraka in a well on the north slope, "a few different hands"; Pericles' law 451 BCE; population ranges (the chapter's rounded summary, labeled estimates, matching Chapter 1); trial details (Meletus, Anytus, Lycon; about 280 to 220 from *Apology* 36a; Diogenes Laertius on the larger death vote; about a month's delay for the Delos ship; the prison bottles hedged); Zeno's shipwreck story; Epictetus born at Hierapolis; CBT's debt to Epictetus; Strabo on Tarsus and Athenodorus; Seneca Letter 41; the Paul–Seneca letters as a 4th-century forgery; Zeno on temples (Plutarch); Aratus *Phaenomena* line 5; Epimenides attribution; altar sources (Pausanias at Phaleron, Philostratus, Diogenes Laertius 1.110, Jerome on Titus about 387); the *Anastasis*-as-goddess reading; CBAM history (Hall, Hord, University of Texas, 1970s); ouzo about 40 percent, EU protection for Greece and Cyprus, Plomari; Assyrtiko/Agiorgitiko/Xinomavro/Retsina (Savatiano) regions; the resin explanation (hedged "usual explanation"); Eubulus' ten bowls (attributed to "a comic poet"); Plato's *Symposium* set in 416 BCE; Erechtheion wage 1 drachma; Evenus 5 minae (*Apology* 20b); Protagoras 100 minae (Diogenes Laertius 9.52).
- **Areopagus plaque:** no reliable installation date was found (often said to be 1951 for the 1,900th anniversary, but unconfirmed), so the chapter gives none. The annual service "around June 29" at the foot of the hill is from memory; check.
- The speech sim's answers are the chapter's reading of the speech (labeled as such); line 8 (repentance) is the most arguable "Something new."
- Listen to the new recordings, especially Pnyx (*PNIKS*; many English speakers say *NIKS*), mezedes (local *meh-ZEH-dhes*), and Agiorgitiko.
- No meal details were invented: the evening food is a guide, not a claim about what we ate.

## Files Created/Updated

- docs/chapters/16-athens-agora-democracy/index.md
- docs/chapters/16-athens-agora-democracy/img/ (5 exported JPEGs)
- docs/chapters/01-long-timeline/index.md (Pnyx pronounce button only)
- docs/chapters/06-bazaars-scripts-presses/index.md (mezedes pronounce button only)
- docs/chapters/09-paul-life-letters/index.md (Areopagus pronounce button only)
- data/photo-picks.csv (2 captions, 5 web paths), data/pronunciations.csv (8 rows), docs/appendices/pronunciation-guide.md, docs/audio/{areopagus,pnyx,stoa-poikile,kleroterion,epictetus,aratus,mezedes,agiorgitiko}.mp3
- logs/ch-16-content-generation.md, this log

# Chapter 17 Session (The Oracle and the Algorithm, Part 1: The Oracle)

- **Start:** 2026-11-24 20:30:41
- **End:** 2026-11-24 20:55:27
- **Chapter:** docs/chapters/17-oracle/index.md ("The Oracle and the Algorithm, Part 1: The Oracle"), deep dive read the night of Day 11
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4.
- **Structure:** opening "The Night Before Delphi" + welcome; eight Parts (wanting to know the future; mountain, god, sanctuary and temple; how the oracle worked; famous answers tested; flaws and debates; politics, seasons and an insider; two sayings; decline and closing); a closing "Questions to Carry Up the Mountain" list that plants Chapter 19's seven parallels (data hub, human in the loop, confirmation bias, self-fulfilling prophecy, who funds the model, calibration and trust, prediction horizon) without answering them in AI terms; Key Takeaways; celebration linking to Chapter 18. No Practical Notes and no Learning for All section (deep dive).
- **Division of labor:** site places (Castalian Spring, Sacred Way, treasuries, polygonal wall, omphalos, theater, stadium, Tholos, museum, Charioteer, Serpent Column base, French excavation) are mentioned only in passing with forward pointers to Chapter 18.
- **Promises from earlier chapters honored:** Chapter 2 (chatbot about the future, "the Delphi chapters will come back to this"); Chapter 3 (Theodosian Decrees 391–392, the doubtful "last oracle" to Julian, Byzantium's "city of the blind" oracle); Chapter 4 (Serpent Column, primary-source and myth-versus-history test, used on every famous answer with a source-gap table); Chapter 8 (Apollo and Dionysus among the Olympians; sanctuary growth in the 8th century BCE); Chapter 9 (Socrates and the oracle; Thales' eclipse "said to have" predicted); Chapter 10 (Doric order; Croesus' columns at Ephesus); Chapter 15 (Thucydides on Themistocles as forecaster; the wooden walls answer; "Nothing in excess" and hubris); Chapter 16 (Chaerephon's question).
- **AI-Native Schools chapter opened before citing:** 12 (AI Guardrails: Teaching Thinking Without Over-Reliance; "Hints Instead of Answers and Socratic Questioning") as a light pointer in the closing questions section. Chapters 04 and 05 were also opened and left for Chapter 19 (AI capability forecasting, doubling curves).
- **MicroSim reuse search:** consultation step-through `generate` (0.443, diki-pyramid); hedging test `generate` (0.469, bias-classifier-quiz); timeline `generate` (0.424, calculus timeline). 0 reused, 0 from template, 3 newly specified.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 17. The Oracle and the Algorithm, Part 1: The Oracle | 7 / 14 / 12 | 8,440–13,250 | ~14,580 (brief's counter; includes 14 tables, 3 captions counted twice, lists, admonitions, Key Takeaways); ~10,410 in plain paragraphs | ~3,990 | 33/33 |

Tier A (7): Mount Parnassus (88), Delphi (86), Apollo (81), Sanctuary of Apollo (76), Human Need for Foresight (52), Prediction (51), Oracle of Delphi (47). Tier B (14): Pythia (26), Oracle Consultation (22), Temple of Apollo at Delphi (15), Amphictyonic League (6), Nothing in Excess (6), Delphic Neutrality (5), Dionysus at Delphi (5), Plutarch (5), Oracle as Living Faith (4), Chaerephon's Question (4), Know Thyself (4), Apollo's Winter Absence (4), Oedipus Prophecy (4), Decline of the Oracle (4). Tier C (12): the rest.

About 10% above the top of the budget by the brief's counter. The excess is in the Tier C famous-answer concepts (Croesus, wooden walls, bribery, gas theory), which needed their sources and the myth test to be told honestly, and in tables added to keep text runs at four paragraphs or fewer. One table (journey then and now) and one restating paragraph were cut in review.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 17 | 14 (plus 6 inside specs) | 3 | 10 (welcome 1, thinking 3, tip 2, warning 2, encourage 1, celebration 1) | delphi-consultation-steps (p5.js, Understand/explain); oracle-answer-hedging-test (p5.js, Analyze/distinguish); delphi-oracle-strength-timeline (vis-timeline, Analyze/distinguish) |

Tables: methods of foresight; six statements sorted; heights on the road; Apollo's oracles; the sanctuary as a scoreboard; Fontenrose's categories; famous answers and their source gaps; three Croesus versions; three Chaerephon versions; the gas-theory claims by firmness; the Sacred Wars; Apollo and Dionysus; three readings of "Know thyself"; lifespans compared. Lists: three names of Delphi; eight consultation steps; Croesus' gifts; Socrates' three groups; the Oedipus chain; the Pythian dialogues; forces of decline; seven closing questions; Key Takeaways.

## Validation

- Frontmatter parses; `date` is a string (exit 0).
- `validate-chapter-mascots.py`: OK, no violations (10 admonitions for 33 concepts).
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines (run after all edits, including the pronounce buttons).
- Specification self-check (script): six header lines in each block, objective starts "The learner will", all eleven body fields present, no indented lines, no "for example"/"such as"/"etc.", no pixel/color/Implementation lines. Counts match: 8 steps, 2 valid orders, 3 checkpoints; 8 answers (3 / 3 / 2); 14 events (6 strength / 8 weakness), 750 + 391 − 1 = 1,140. Chapter Anchors match the prose.
- No more than 4 consecutive prose paragraphs without a non-text element (script check, specs counted as non-text).
- No TODO and no "(verify)"; all 33 concepts appear in bold.
- `scripts/pronunciations.py`: 7 new terms with audio (Croesus, Chaerephon, Amphictyonic, Phaedriades, adyton, Alcmaeonids, Thyiads). Buttons: 6 in Chapter 17; Croesus landed in Chapter 1 ("the Lydians, whose King Croesus"), its first running-text use. Pythia already had its button in Chapter 3. The uncommitted Antikythera row was temporarily removed for `all` (the dry run showed its button would land in Chapter 20's stub Summary), restored byte-for-byte (`cmp` identical to the saved copy; the run did not change the CSV; diff against the pre-session CSV shows only the 7 appended rows), and `appendix` (137 terms) and `check` (OK; Antikythera audio=yes, no chapter button) were rerun.

## Caption Changes

Resolved from the contact sheet (crops of panels 2 and 3) and the Takeout sidecar GPS (no full-size photos opened):

- Pick 2 (IMG_1732, 13:01): "Columns at the Temple of Apollo (verify)" -> "An ancient column and a tall stone pillar near the east end of the Temple of Apollo". GPS (38.48258, 22.50146) lies just east of the temple, and the frame shows a column and a tall rectangular pillar beside the paved way. The pillar is probably the Pillar of Prusias, but that is not stated. Placed in "The Oracle Consultation" after the steps that end at the great altar.
- Pick 3 (IMG_1708, 12:41): "Stoa of the Athenians and the polygonal wall (verify)" -> "A row of ancient columns below the cliffs at Delphi". The wall behind the columns has rectangular recesses rather than the curved joints of the polygonal wall, the GPS (38.48206, 22.50268) is about 140 m east of the temple near the entrance, and it was taken 8 minutes before the Athenian Treasury photo, so it is probably the Roman agora at the entrance, not the Stoa of the Athenians. **Not placed** in Chapter 17: it belongs to Chapter 18's walk from the entrance. Its exported file was deleted and its `web_path` left empty; suggest moving the row to chapter 18 when that chapter is generated.
- Picks 1 and 4 kept. No time-of-day words used (all photos 12:41–13:20 Athens time).
- Note: `data/photo-picks.csv` in the working tree uses CRLF line endings (written by the export script's csv module in an earlier session); HEAD has LF. The file was kept in CRLF; the byte diff against the pre-session file shows only the four chapter-17 rows.

## Corrections to Earlier Chapters (reported, not edited)

- None found. Chapter 3's "last oracle" verdict, Chapter 9's Socrates pointer, and Chapter 15's Themistocles, wooden-walls, and "Nothing in excess" pointers all agree with this chapter.

## Notes for the Author

- From memory or a quick check, worth verifying first: Fontenrose (1978) counts (535 responses: 75 historical, 268 quasi-historical, 176 legendary, 16 fictional; shown rounded); more than 4,000 Dodona lead tablets; Parnassus 2,457 m (Liakoura), national park 1938, "Greece's largest ski center"; heights (sanctuary about 550–650 m from photo altitudes, Arachova about 950 m, Itea about 15 km by road); the lapse-rate example (6.5 °C per 1,000 m, illustrative); tens of thousands of knucklebones in the Corycian Cave; Homeric Hymn to Apollo (Pytho, dolphin, Cretans from Knossos); Aeschylus *Eumenides* prologue (Earth, Themis, Phoebe); Heraclitus fragment; Tacitus on Claros; Herodotus on Patara (oracle "not always" active); Pliny's 3,000 statues; Thucydides 1.132 (Pausanias' couplet on the Serpent Column, 31 cities); Monument of the Admirals "near" the Marathon monument (Pausanias); Herodotus 2.180 (quarter of the cost, Amasis' 1,000 talents of alum) and 5.62 (Alcmaeonid marble front); temple 6 × 15 columns, about 60 m; pediment subjects (Pausanias 10.19.4); Diodorus 16.26 (Pythia over fifty); three Pythias (Plutarch); the Kodros Painter cup in Berlin, about 440 BCE; Plutarch's dying Pythia; Strabo on verse-makers and on "verse and prose"; consultation calendar (7th of Bysios, later monthly, nine months); the goat test; Phaselis fee inscription (state fee much higher; no figures given); Herodotus 1.54 (Lydian promanteia, freedom from fees); Xenophon *Anabasis* 3.1; Cyrene (Herodotus 4.150–158; the settlers' oath inscription); Croesus' test and gifts (Herodotus 1.46–51), Myson amphora (Louvre, about 500–490 BCE), Bacchylides 3 (468 BCE); wooden walls (Herodotus 7.140–143); Chaerephon (Plato *Apology* 20e–21a; Xenophon *Apology* 14; Diogenes Laertius 2.37); *Oedipus the King* "probably 420s BCE" and the Schiste tradition; Pyrrhus and Cicero *De Divinatione* 2.116; Herodotus 5.63 and 6.66 (Cobon, Perialla); Demosthenes' "philippize"; de Boer, Hale, Chanton (Geology, 2001) and Spiller; the critiques (later gas measurements around Delphi; a toxicologist and a historian, about 2007) are described without names; Amphictyony (twelve peoples, 24 votes, Anthela); Sacred War dates; Diodorus' "more than 10,000 talents"; Peace of Nicias clause; Herodotus 7.148, 7.169, 8.36–39; Thucydides 1.118; Plutarch on Dionysus' share and the three winter months; Clea; the Thyiads in the snowstorm and at Amphissa; Plutarch's dates (about 46 to after 119 CE), about thirty years as priest, the joint Delphian–Chaeronean portrait inscription; Ai Khanoum maxims (Clearchus, early 3rd century BCE, "more than 4,000 km"); Plutarch *Solon* 27 on the chronology; Sulla 87–86 BCE; Nero's 500 statues (Pausanias 10.7.1); Cicero on despised oracles (44 BCE); Hadrian's favor; the "last oracle" text and its late Byzantine source.
- **Winter absence and our date:** the chapter says the oracle would "very probably" have been closed on November 22 in its great days; the three winter months are not pinned to exact modern dates.
- **Didyma/Claros/Patara** are given as Apollo's other oracles near our route, without distances.
- No Wikimedia image needed for this chapter; the Kodros Painter cup (Berlin) would be a strong addition if a freely licensed photo exists.
- Listen to the new recordings, especially Chaerephon (*KAIR-uh-fon*; some say *KEER-*), Phaedriades, and Thyiads.

## Files Created/Updated

- docs/chapters/17-oracle/index.md
- docs/chapters/17-oracle/img/ (3 exported JPEGs)
- docs/chapters/01-long-timeline/index.md (Croesus pronounce button only)
- data/photo-picks.csv (2 captions, 3 web paths), data/pronunciations.csv (7 rows), docs/appendices/pronunciation-guide.md, docs/audio/{croesus,chaerephon,amphictyonic,phaedriades,adyton,alcmaeonids,thyiads}.mp3
- logs/ch-17-content-generation.md, this log

# Chapter 18 Session (Day 12: Delphi)

- **Start:** 2026-11-24 20:56:59
- **End:** 2026-11-24 21:14:22
- **Chapter:** docs/chapters/18-delphi/index.md ("Day 12: Delphi"), Sunday, November 22, day trip by road from Athens
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at CIS >= 4. All 22 concepts have CIS 1–3, so all are Tier C.
- **Structure:** opening "A Sunday on Apollo's Mountain" + welcome; six Parts (road and spring; up the Sacred Way; games for Apollo; Athena before the temple; the museum; Delphi after the oracle); Practical Notes for Day 12; Learning for All; Key Takeaways; celebration linking to Chapter 19.
- **Division of labor:** Chapter 17's oracle material (Pythia, consultation, famous answers, Amphictyony, Sacred Wars, Plutarch, decline) is only pointed to. Chapter 19's AI parallels are left to Chapter 19; the celebration points there.
- **Promises from earlier chapters honored:** Chapter 3 ("on Day 12 we will stand where it first stood"); Chapter 4 (Serpent Column in the Hippodrome pit; Chapter 4's myth-versus-history test used on the Athenian Treasury, Athena Pronaia rockfall and loukoumades stories); Chapter 5 (the head fragment in the Istanbul Archaeology Museums); Chapter 8 (site museum, off-season livelihoods); Chapter 12 (olive harvest); Chapter 14 (thyme honey); Chapter 15 (Marathon, Plataea, melitzanosalata); Chapter 17 (Castalian Spring, omphalos, polygonal wall, Serpent Column base, French excavation, Fourth Sacred War and Amphissa).
- **AI-Native Schools chapter opened before citing:** 08 (Tracking Mastery: xAPI, Learning Record Stores, and MicroSims; section "Data Portability and Student-Controlled Data"). Not previously cited in this book.
- **Learning for All angle:** "Freedom Carved Where Everyone Could Read It": the manumission records as trusted public records, run through the four-step pattern, paralleled with learner-owned, portable mastery records (and the honest difference: a learner's record should be private).
- **MicroSim reuse search:** freedom record `generate` (0.420, Inscribed and Circumscribed Polygons); Serpent Column sorter `generate` (0.461, Ancient Unicorn Civilizations Map); after-the-oracle timeline `generate` (0.384, same). 0 reused, 0 from template, 3 newly specified.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 18. Day 12: Delphi | 0 / 0 / 22 | 2,640–4,400 | ~7,960 (brief's counter; includes 4 tables, 9 captions counted twice, lists, admonitions, Practical Notes, Key Takeaways); ~5,650 in plain paragraphs, of which ~4,940 in the 22 concept sections | ~3,210 | 22/22 |

About 12% above the top of the concept budget in plain paragraphs. The excess is in the sections carrying worked examples: the Serpent Column (~540 words, the brief's "two ends of one object" example), the French excavation (~365, including the four-stage frame the timeline needs), Manumission Records (~325), the Athenian Treasury and Athena Pronaia myth tests, and the Charioteer close-looking example. The opening's second paragraph was cut back in review because it repeated the Parts paragraph.

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 18 | 4 (plus 3 inside specs) | 9 | 7 (welcome 1, thinking 2, tip 1, warning 2, celebration 1) | delphi-freedom-record-reader (html infographic, Analyze/deconstruct); serpent-column-two-ends (p5.js sorter, Analyze/attribute); delphi-after-the-oracle-timeline (vis-timeline, Understand/classify) |

Tables: our day by photo timestamp; parts of a manumission record; Serpent Column evidence by place and source; the four crown games. Lists: museum highlights, Practical Notes, Key Takeaways.

## Validation

- Frontmatter parses (exit 0): "Day 12: Delphi | 2026-11-24 20:56:59".
- `validate-chapter-mascots.py`: OK, no violations (7 admonitions for 22 concepts).
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines, run after all edits including pronounce buttons. Built page has 9 trip-photo figures.
- Spec self-check (script): six header lines, all eleven body fields, objectives start "The learner will", no indented lines, no "for example"/"such as"/"etc."/px/Implementation. Counts match: 8 clauses (4 protect / 3 record / 1 limits); 10 cards (3 Delphi / 3 Istanbul / 4 written); 9 events (1 / 2 / 2 / 4). Chapter Anchors match prose.
- No run of more than 4 prose paragraphs without a non-text element (script check). No TODO, no "(verify)"; all 22 concepts bolded.

## Photos and Caption Changes

All 9 chapter-18 picks placed (none of Chapter 17's three Delphi photos reused). A fresh chapter-18 review sheet was rendered into the scratchpad from the current CSV (the repo's picks-ch18.jpg predated the pick-9 move); picks 4 and 9 were checked on their cached 600 px thumbnails (no full-size photos opened).

- Pick 4 (IMG_1728, 12:57): "Replica of the Serpent Column (verify)" -> "A bronze copy of the Serpent Column in the Sanctuary of Apollo". The thumbnail clearly shows a twisted bronze column of three coils, green patina, on a stepped white base below the cliffs.
- Pick 9 (IMG_1708, 12:41): "A row of ancient columns below the cliffs at Delphi" -> "Columns of the Roman agora at the entrance to the Sanctuary of Apollo". Confirms Chapter 17's guess: the wall behind the columns is Roman brick-and-stone with arched recesses, it is the first sanctuary photo of the day, and it was taken 8 minutes before the Athenian Treasury.
- Pick 8 (IMG_1829, 16:16): "Arachova, the mountain village above Delphi" -> "A roadside sign spelling out Arachova, the mountain village above Delphi" (the frame shows the large #ARACHOVA letters, not the village).
- Others kept. No time-of-day words in captions. `data/photo-picks.csv` kept in CRLF; byte diff shows only the 9 chapter-18 rows (3 captions, 9 web paths).

## Pronounce Buttons

7 new terms with audio: Castalian, omphalos, Pronaia, Tholos, Kastri, Amfissa, loukoumades. Buttons: Kastri, Amfissa, loukoumades in Chapter 18; Castalian, omphalos, Pronaia in Chapter 17 (their first running-text uses); Tholos in Chapter 16 (the Agora's Tholos, its first use; same word and pronunciation). The script split "Castalian Spring" in Chapter 17, so the button was moved by hand to after "Spring". The Amfissa button follows the bold "**Amfissa olive groves**". The uncommitted Antikythera row: dry run showed its button would land in Chapter 20's stub Summary, so it was removed for `all`, then the saved CSV was restored (`cmp` identical; the run did not change the CSV; diff against the pre-session CSV shows only the 7 appended rows); `appendix` (144 terms) and `check` (OK; Antikythera audio=yes, no chapter button) were rerun.

## Corrections to Earlier Chapters (reported, not edited)

- Chapter 17's celebration says "where we walk the Sacred Way in the morning mist"; our photos put the sanctuary visit at about 12:40–1:45 PM in clear weather.
- Chapter 5 (Gülhane Park) says the Istanbul Archaeology Museums hold "one of the three bronze heads" of the Serpent Column; what survives there is usually described as the upper jaw of one head. This chapter says "the upper jaw of one of the serpent heads".

## Notes for the Author

- Worth verifying first: more than a thousand Delphic manumission records, mostly about 200 BCE to 100 CE; the record formula (entrusting the purchase to the god; guarantor; priests as witnesses; paramone); Herodotus 9.81 (tripod on the three-headed serpent "nearest the altar", from a tenth of the spoils); Pausanias 10.13.9 (Phocian leaders took the gold, bronze still there); the monument's base still in place near the altar, and the bronze copy standing near it (installation date not given); heads lost "at the end of the 17th century or soon after"; upper jaw rediscovered in the 19th century; Hesiod's Cronus stone at Pytho and Pausanias 10.24.6 (oiled stone wrapped in wool); a plainer omphalos copy beside the Sacred Way; the archaic Castalian fountain about 600 BCE and the upper fountain often fenced for rockfalls; more than twenty treasury foundations; Corinthian treasury holding Croesus' gifts; Athenian Treasury rebuilt 1903–1906 with money from the city of Athens; the Marathon base inscription and the pre-Marathon dating debate; Delphic Hymns on the treasury's south wall; Pythian Games reorganized 582 BCE, laurel from Tempe (tradition); crown-games table dates (Isthmian c. 582, Nemean c. 573); theater 35 rows, about 5,000, Eumenes II; stadium track about 178 m, about 6,500 seats, Herodes Atticus per Pausanias; Athena Pronaia "a short walk east"; the Massaliot treasury; Herodotus 8.37–39 (rocks at Athena Pronaia) and a rockfall damaging the old temple of Athena "in the early 20th century" (often given as 1905); Tholos 20 Doric and 10 Corinthian columns, three re-erected, Theodorus of Phocaea per Vitruvius; first museum 1903; silver bull and gold-and-ivory heads found 1939; Kleobis and Biton about 580 BCE (and the Dioskouroi debate); Charioteer about 1.8 m, 478–470 BCE, Polyzalos, altered inscription, found 1896, inlay details; Cyriac of Ancona 1436; Spon and Wheler 1676; excavation begun 1892 under Homolle, with an American bid before France won the rights; Delphic Festivals 1927 and 1930 and the Sikelianos house museum; Battle of Arachova 1826 under Karaiskakis and its monument; formaela cheese; *Konservolia Amfissis* PDO; "one of the largest continuous olive groves in Greece" (hedged as "often described"); Pindar's "Delphic bee"; the bee-maidens of the *Homeric Hymn to Hermes*; lokma given out in memory of the dead around İzmir; loukoumades/lokma and loukoumi/lokum etymologies.
- The chapter does not say whether we visited the museum before or after the site; the photo gap from 11:02 to 12:41 suggests the museum came first. Adjust the Practical Notes if you remember the order.
- No Wikimedia image needed; a freely licensed photo of the Charioteer or of the Tholos would strengthen Parts Four and Five, since we have no picks of either.
- Listen to the new recordings, especially Kastri (*kah-STREE*), Amfissa (*AHM-fee-sah*), and loukoumades (*loo-koo-MAH-thes*).

## Files Created/Updated

- docs/chapters/18-delphi/index.md
- docs/chapters/18-delphi/img/ (9 exported JPEGs)
- docs/chapters/17-oracle/index.md (Castalian, omphalos, Pronaia pronounce buttons only)
- docs/chapters/16-athens-agora-democracy/index.md (Tholos pronounce button only)
- data/photo-picks.csv (3 captions, 9 web paths), data/pronunciations.csv (7 rows), docs/appendices/pronunciation-guide.md, docs/audio/{castalian,omphalos,pronaia,tholos,kastri,amfissa,loukoumades}.mp3
- logs/ch-18-content-generation.md, this log

# Chapter 19 Session (The Oracle and the Algorithm, Part 2: The Algorithm)

- **Start:** 2026-11-24 21:15:56
- **End:** 2026-11-24 21:29:53
- **Chapter:** docs/chapters/19-algorithm/index.md, deep dive for the drive back from Delphi on Day 12 (Sunday, November 22) or that evening
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at 4–41, Tier C at <= 3.
- **Structure:** opening "The Drive Back from Delphi" + welcome; eight Parts (learning from examples; three prediction machines; the oracle's questions asked of machines; predictions that change the world; what earns trust; an answer as the start of an inquiry; what prediction cannot decide; who asked, and where the parallel breaks, ending with seven reflection questions); Key Takeaways; celebration linking to Chapter 20. No Practical Notes and no photos (no chapter-19 picks), as briefed.
- **Promises honored:** Chapter 2 (machine learning, LLMs, the Hagia Sophia chatbot question, "the Delphi chapters will come back to this"; the Grand Bazaar Sunday example reused in the next-word section). Chapter 17's seven "Questions to Carry Up the Mountain" are each answered: data hub (Q1), wooden wall and human in the loop (Q2), Croesus and confirmation bias (Q3), Oedipus and self-fulfilling prophecy (Q4), Croesus' promanteia and the Alcmaeonid bribe (Q5), track record and calibration (Q6), Apollo's winter absence and the prediction horizon (Q7). Know thyself → values beyond prediction; Nothing in excess → climate models and long-term consequences. Chapter 15's Laurion silver and Themistocles' ships used for acting on foresight.
- **Left to Chapter 20:** the Antikythera mechanism (not named; the celebration points to "an ancient bronze machine that predicted the sky"), Aristotle and Alexander, Bloom's 2 sigma, AI tutoring, the Phaedrus, AI over-reliance and guardrails (one forward pointer in "AI as Thinking Partner").
- **AI-Native Schools chapters opened before citing:** 04 (Measuring AI Capability: The METR Task-Horizon Studies; 50 percent time horizon), 05 (Projecting AI Growth: Doubling Curves, Limits, and Uncertainty; S-curves, scenario planning), 10 (Student Privacy and Data Governance; algorithmic bias, the four-fifths audit, the Wisconsin early-warning report, GDPR), 12 (AI Guardrails: Teaching Thinking Without Over-Reliance; hints instead of answers, Socratic questioning). Chapter 10 is linked three times (loan and hiring, student risk, consent), the others once.
- **MicroSim reuse search:** calibration game `template` (0.635, Confidence Calibration Challenge, ai-persona-testing; `**Template:**` line added); next-word toy `generate` (0.526, Language Model Response Laboratory); feedback loops `generate` (0.566, Arms Race Dynamics). 0 reused, 1 from template, 2 newly specified.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 19. The Oracle and the Algorithm, Part 2 | 1 / 11 / 20 | 5,650–9,150 | ~11,130 (brief's counter; includes 9 tables, lists, 10 admonitions, Key Takeaways, reflection questions); ~8,020 in plain paragraphs | ~4,490 | 32/32 |

Plain-paragraph prose sits inside the budget. Machine Learning (Tier A) carries the Doric/Ionic worked example and a comparison table; every Tier B concept has a worked example (coach-lateness model, the sky shortcut, the missing reviewers, the Amazon résumé case, three ways to state a forecast, the wooden-wall method, two forecasters and the Brier score, rewriting the Croesus answer, testing old climate models, the umbrella rule, predictions made about us today).

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 19 | 9 (plus 9 inside specs) | 0 | 10 (welcome 1, thinking 3, tip 2, warning 2, encourage 1, celebration 1) | next-word-temperature-toy (p5.js, Understand/infer); prediction-feedback-loops (vis-network causal-loop, Analyze/differentiate); calibration-confidence-game (p5.js, Evaluate/assess, from template) |

Tables: rules vs machine learning; coach-lateness model; three kinds of data bias; sources of uncertainty; temperature and "Know ___"; two forecasters' Brier scores; making the Croesus answer testable; answer vs thinking partner; oracle vs model. Lists: the five-step ML example, the four-step interpretation method, predictions made about us today, reflection questions, Key Takeaways.

## Validation

- Frontmatter parses: "The Oracle and the Algorithm, Part 2: The Algorithm | 2026-11-24 21:15:56".
- `validate-chapter-mascots.py`: OK, no violations (10 admonitions for 32 concepts).
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines, run after the pronounce buttons.
- Spec self-check (script): six header lines, all eleven body fields, objectives start "The learner will", no indented lines, no px/Implementation, no "for example"/"such as"/"etc." in specs. Counts: 4 prompts and 5 challenges; 10 links, 3 loops, 3 questions; 12 statements (7 true, 5 false), 2 forecasters, 3 judgments. Chapter Anchors match prose (86.7/60.0/39.1 and 0.4/4.0/10.1 percent; 0.21, 0.33, 0.25).
- No run of more than 4 prose paragraphs without a non-text element (script). No TODO. All 32 concepts bolded; three with an article inserted ("oracle as a data hub", "answer as the start of an inquiry", "AI as a thinking partner"), as Chapter 17 did with "oracle as a living faith".

## Pronounce Buttons

2 new terms with audio: Brier (*BRY-er*) and stochastic (*stuh-KAS-tik*), both first used in Chapter 19, both buttons in Chapter 19. The script put the stochastic button inside the quoted phrase "stochastic parrots"; the sentence was reworded so the button follows an italic *stochastic* outside the quotation. The uncommitted Antikythera row: dry run showed its button would land in Chapter 20's stub Summary, so it was removed for `all`; the script did not change the CSV; the CSV was then restored so that the pre-session file is a byte-identical prefix and the only difference is the 2 appended rows; `appendix` (146 terms) and `check` (OK; Antikythera audio=yes, no chapter button) were rerun.

## Corrections to Earlier Chapters (reported, not edited)

- None found.

## Notes for the Author

- Worth verifying first: Reuters (2018) on Amazon's abandoned résumé tool (about ten years of résumés, "women's", two women's colleges); Merton's 1948 naming of the self-fulfilling prophecy with the bank example; *Pygmalion in the Classroom* (1968) and the continuing debate; Lum and Isaac (2016) on Oakland drug-crime records and health surveys; "several American cities have since stopped using predictive policing"; Lorenz in the 1960s and the roughly two-week limit, with useful detail fading after about a week to ten days; "studies since the 1970s" on the calibration of weather forecasts; the 2021 "stochastic parrots" paper; METR's 2025 study described only as "doubling every several months" (the companion book plans with five months; the arithmetic "about fivefold in a year, nearly 150-fold in three years" uses five); the 2020 study of climate models published 1970–2007 (Hausfather and colleagues) described as "most of them" accurate; IPCC: about 1.1 °C of warming by 2011–2020; Paris 2015 goals; the Mediterranean as a "hotspot"; European data-protection rights on solely automated decisions (GDPR Article 22, not named); 1930s redlining maps.
- The coach-lateness table, the restaurant-review figures, the two forecasters, the temperature probabilities and the Croesus/AI testable rewrites are illustrative and say so in the text.
- Reflection question 7 is addressed to Dan, as Chapter 11's leadership reflection was; cut it if it feels too personal.
- No Wikimedia image is needed; this chapter has no site to show.
- Listen to the two new recordings, especially Brier (said like "briar").

## Files Created/Updated

- docs/chapters/19-algorithm/index.md
- data/pronunciations.csv (2 rows appended), docs/appendices/pronunciation-guide.md, docs/audio/{brier,stochastic}.mp3
- logs/ch-19-content-generation.md, this log

# Chapter 20 Session (Day 13: Athens, Museums, Tutors, and the City Today)

- **Start:** 2026-11-24 21:31:02
- **End:** 2026-11-24 21:51:25
- **Chapter:** docs/chapters/20-athens-museums-city-today/index.md, the last daily chapter (Monday, November 23)
- **cis_max:** 1771 (global). Tier A at CIS >= 42, Tier B at 4–41, Tier C at <= 3.
- **Structure:** opening "The Last Day in Athens" + welcome (with a first-person note that we saw the National Garden, Syntagma, the Panepistimiou "trilogy" and the National Archaeological Museum, about 1:45–2:15 PM, on Day 11); five Parts (the museum and the bronze machine; Hadrian's temple and Aristotle's school; Athens today; an evening in Plaka; Greek-Turkish relations); Practical Notes for Day 13 (museum hours, airport, sunset about 5:10 PM, Chapter 21 for the flight); Learning for All with two notes (Aristotle tutoring Alexander through Bloom, mastery learning, AI tutoring and the teacher coming to the learner; then the Phaedrus, fear of new learning technology, AI over-reliance and guardrails); Key Takeaways; celebration linking to Chapter 21.
- **Promises honored:** Chapter 19's "ancient bronze machine" (the Antikythera mechanism, introduced as the device between the oracle and the learned model, without re-explaining machine learning or calibration; Chapter 19's "track record" test reused once, to score Socrates' prediction); Chapter 19's pointer to "the Lyceum ... tutoring and the old fear that a new tool will think for us"; Chapter 2's Phaedrus preview, Dipylon jug at the museum, and "Aristotle tutoring the young Alexander"; Chapter 9's "343 BCE ... a story Chapter 20 tells" and Phaedrus row; Chapter 12's "Chapter 20 takes up that side of the story, when the teacher comes to the learner"; Chapter 15's Varvakeion Athena in the museum, Plaka and Monastiraki, and "mostly switched to 'Greek coffee' after 1974, as Chapter 20 tells".
- **AI-Native Schools chapters opened before citing:** 11 (Mastery Learning and the Case for a Compressed Morning: Bloom's two-sigma problem, the Nickow et al. 0.37 and VanLehn 0.79 estimates, von Hippel's critique, the Harvard, Nigeria and Turkey studies, tutoring costs) and 12 (AI Guardrails: Teaching Thinking Without Over-Reliance: guided vs open AI, hints instead of answers, Socratic questioning). Each linked once.
- **MicroSim reuse search:** sorter `generate` (0.521, The AI Flywheel); effect-size chart `template` (0.610, Standard Error and Sample Size Explorer, statistics-course; `**Template:**` line added); modern Athens timeline `generate` (0.453, AGI Timeline Claims History). 0 reused, 1 from template, 2 newly specified. The existing built sim `antikythera-gears` is embedded (iframe + fullscreen button) in the mechanism section.

## Elaboration Budget vs Actual (prose words, specifications excluded)

| Chapter | Tier mix (A/B/C) | Budget | Prose words | Spec words | Concepts |
|---|---|---|---|---|---|
| 20. Day 13: Athens, Museums, Tutors, and the City Today | 0 / 5 / 21 | 3,770–6,200 | ~11,030 (brief's counter; includes 6 tables, 7 lists, 9 admonitions, 10 figures' captions, Key Takeaways); ~8,000 in plain paragraphs | ~3,440 | 26/26 |

Over budget, mainly because this last daily chapter carries a full museum visit with four photos, a Learning for All section of nine concepts, and the modern-Athens survey; no concept is padded, but the author may want to trim Rebetiko, Plaka, Migration or Greek-Turkish Relations (each Tier C at 200–450 words). Every Tier B concept has a worked example: the museum route (for the museum), the lost-quarter recovery arithmetic (debt crisis), our Monday on Athenian time (daily life), the arithmetic of attention (one-on-one tutoring), translating effect sizes into percentiles (Bloom), scoring Socrates' prediction (Phaedrus).

## Non-text Elements

| Chapter | Tables | Photos | Mascots | New MicroSim specs |
|---|---|---|---|---|
| 20 | 6 (plus 6 inside specs) | 10 | 9 (welcome 1, thinking 2, warning 2, tip 1, encourage 1, neutral 1, celebration 1) | oracle-gears-or-data-sorter (p5.js, Analyze/differentiate); modern-athens-timeline (vis-timeline, Understand/infer); tutoring-effect-size-explorer (Plotly chart, Understand/interpret, from template) |

Tables: questions the mechanism answered; the temple's 650-year build; our Monday vs an Athenian's; a century of arrivals and departures; coffee sweetness in Athens and Istanbul; effect sizes as percentiles. Lists: the debt-crisis sequence, signs of Orthodox faith, three places in Plaka, two four-step patterns, fears of new learning technology, Practical Notes, Key Takeaways. Embedded: antikythera-gears.

## Validation

- Frontmatter parses: "Day 13: Athens, Museums, Tutors, and the City Today | 2026-11-24 21:31:02".
- `validate-chapter-mascots.py`: OK, no violations (9 admonitions for 26 concepts).
- `mkdocs build --strict` (into scratchpad): exit 0, no WARNING lines, run after the pronounce buttons.
- Spec self-check (script): six header lines (plus Template on one), all eleven body fields, objectives start "The learner will", no indented lines, no px/Implementation, no "for example"/"such as"/"etc.". Counts: 12 cards, 4 per bin; 14 events and 8 sights (S6 accepts E8 or E9); 5 results. Chapter Anchors match prose (98/84/79/64 percent; 0.3 SD over six weeks; a third to three-quarters of an SD; the timeline dates). The 2004 Olympic rebuilding is anchored by a new sentence in "Daily Life in Athens" and Chapter 15.
- No run of more than 4 plain paragraphs without a non-text element (script; three sections restructured with a list or table to fix a run of 9). No TODO. All 26 concepts bolded; "Teaching Comes to Learner" appears as "teaching comes to the learner".

## Photos and Caption Changes

All 10 chapter-20 picks placed, each after the paragraph about its subject: Jockey, grave stele, horse relief and Aphrodite group in the museum section; stadium in the Temple of Olympian Zeus section (Panathenaic Stadium paragraph, Day 10 midday); Academy and bearded head in the Lyceum section; Parliament in the debt crisis; National Garden in daily life; National Library in the Phaedrus section. Captions resolved from the contact sheet (enlarged crops of tiles 4, 5, 7 and 9):

- 4: "Marble relief of a horse and groom (verify)" → "Marble relief of a horse and its handler" (a figure holds the horse's head; not identifiable as a known relief).
- 5: "Marble portrait head of a bearded man (verify)" → "Marble head of a bearded man in the National Archaeological Museum" (unidentified; the text says so).
- 7: "The National Library of Greece (verify)" → "The National Library of Greece on Panepistimiou Street" (confirmed: Doric portico, curved double stair, statue in front).
- 9: "The Panathenaic Stadium (verify)" → "The Panathenaic Stadium, seen from the square at its entrance" (confirmed: marble horseshoe stands).

No time-of-day words in captions.

## Pronounce Buttons

5 new terms with audio: Phaedrus (*FEE-drus*, english; button landed in Chapter 2, its first running-text use), Kallimarmaro (*kah-lee-MAR-mah-roh*, Chapter 20), Exarchia (*ek-SAR-khee-ah*, Chapter 20), kafeneio (*kah-feh-NEE-oh*; landed in Chapter 14, first use), rebetiko (*reh-BEH-tee-koh*; landed in Chapter 10, first use). The existing Antikythera row (no duplicate added) got its chapter button in Chapter 20's opening paragraph; the script put it between "Antikythera" and "mechanism", and it was moved by hand after "mechanism" to keep the name together. `check`: OK; appendix rebuilt (151 terms).

## Corrections to Earlier Chapters (reported, not edited)

- None found. Pronounce buttons were inserted into Chapters 2, 10 and 14 by the script, as the rules require.

## Notes for the Author

- Worth verifying first: the museum building's dates (1866–1889) and "the central hall just past the entrance holds the Mycenaean collection"; the museum's Monday and winter hours (described only as a pattern); the grave-relief law of about 317 BCE (Demetrius of Phalerum, not named); the Jockey's pieces raised in the late 1920s and 1930s; the Aphrodite group's find-spot in the Berytian merchants' clubhouse on Delos; Aristotle's *Politics* naming the Peisistratids' Olympieion beside the pyramids; Sulla's columns ("is said"); Herodes Atticus' stadium about 144 CE; the Lyceum's discovery in 1996 on Rigillis Street and opening in 2014; the Academy (Hansen, 1885) with Plato, Socrates, Athena and Apollo; the National Library moving in 1903 and to the Stavros Niarchos center in 2018; the National Garden planted from 1838 and public from 1923; "at least 24 civilians killed" in 1973 and the gate preserved on campus; the debt figures (deficit "more than twice", 2012 losses "more than half", unemployment about 27 percent in 2013, debt about 1.5 times output, ratings restored from 2023); leaving home around age 30 and a birth rate of about 1.3; the Nativity Fast (November 15 to Christmas Eve); the Little Metropolis "probably 12th century"; more than 850,000 sea arrivals in 2015 and the Pylos wreck of June 2023; the Abu Simbel graffiti of about 591 BCE; the "Greek coffee" renaming after 1974; the 1957 frappé; Greece as the EU's largest producer of farmed bream and bass, and the frozen-fish asterisk; Vamvakaris (Syros), Eskenazi (Istanbul, Sephardic), 1930s censorship, UNESCO 2017; Papandreou and Cem in 1999; the Athens Declaration of December 2023.
- Plutarch's "lead the Greeks, rule the non-Greeks as a master" comes from his essay *On the Fortune of Alexander*, not the *Life*; the text says only "Plutarch also reports".
- The Mieza tutoring hours (three hours, five pupils), the daily-life schedule, and the 2 percent / 1 percent recovery arithmetic are illustrative and say so.
- Photo 5 (bearded head) is unidentified; if the museum label is in another photo, a name would improve it, or the photo could be dropped. Photo 4 may be a catalogued relief the author can name from the museum card.
- Listen to the five new recordings, especially Kallimarmaro and kafeneio (local stress).
- No Wikimedia image needed; the Antikythera mechanism itself is not among our picks, and the appendix already links close-up photos.

## Files Created/Updated

- docs/chapters/20-athens-museums-city-today/index.md
- docs/chapters/20-athens-museums-city-today/img/ (10 exported JPEGs)
- docs/chapters/02-traveling-well/index.md (Phaedrus pronounce button only), docs/chapters/10-ephesus-greco-roman-city/index.md (rebetiko button only), docs/chapters/14-venetian-heraklion/index.md (kafeneio button only)
- data/photo-picks.csv (4 captions, 10 web paths), data/pronunciations.csv (5 rows appended), docs/appendices/pronunciation-guide.md, docs/audio/{phaedrus,kallimarmaro,exarchia,kafeneio,rebetiko}.mp3
- logs/ch-20-content-generation.md, this log
