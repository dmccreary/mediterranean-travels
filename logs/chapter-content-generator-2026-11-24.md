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
