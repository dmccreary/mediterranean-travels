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
