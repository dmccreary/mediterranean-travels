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
