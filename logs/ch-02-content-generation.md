# Chapter 2 Content Generation Log

## Timestamps (raw)

- 2026-11-24 12:52:52
- 2026-11-24 13:08:02

## Chapter Details

Recorded 2026-11-24, from the chapter file as it stands: `docs/chapters/02-traveling-well/index.md`.

**Title:** Before We Go, Part 2: Traveling Well and the Learning for All Thread  
**Generated:** 2026-11-24 12:52:52  
**How:** Written in an earlier session with chapter-content-generator v1.11 (single chapter, sequential).

### Reading Level

- **Target:** general adult readers with no professional background in the subject (course description, "Audience"); every term is explained when it first appears. In the skill's terms this is between Senior High and College: plain sentences, technical words defined in place.
- **Measured:** Flesch-Kincaid grade 8.8, Flesch reading ease 66.5 (60–70 is "plain English"), average sentence length 19.6 words. Measured with `textstat` on the chapter's plain paragraphs only (tables, lists, admonitions, figures and MicroSim specifications excluded).

### Size

| Measure | Value |
|---|---|
| Concepts | 20 (6 Tier A / 11 Tier B / 3 Tier C) |
| CIS word budget | 6,110–9,500 |
| Plain-paragraph words | 6,694 (within the budget) |
| All prose words (includes tables, lists, admonitions, Practical Notes, Key Takeaways) | 9,966 (5% over the top of the budget) |
| MicroSim specification words | 5,079 |
| Worked examples | 17 |

### Non-Text Elements

| Element | Count |
|---|---|
| Markdown tables (excluding Concepts Covered) | 14 |
| Trip photos | 5 |
| MicroSim and diagram specifications | 5 |
| Embedded MicroSims (iframes) | 0 |
| Mascot admonitions | 9 (celebration 1, thinking 3, tip 2, warning 2, welcome 1) |
| Pronounce buttons in this chapter | 6 |
| AI-Native Schools chapters linked | 3 |

### MicroSims and Diagrams

| Title | sim-id | Type | Library | Bloom | Status |
|---|---|---|---|---|---|
| Thoughtful Traveler Choices | `thoughtful-traveler-choices` | microsim | p5.js | Evaluate / judge | Specified |
| November Weather at Our Stops | `november-weather-at-our-stops` | chart | Chart.js | Understand / interpret | Specified |
| Sort the Scripts | `sort-the-scripts` | microsim | p5.js | Understand / classify | Specified (from template) |
| Read a Greek Sign | `read-a-greek-sign` | microsim | p5.js | Apply / use | Specified |
| World Literacy Over Two Centuries | `world-literacy-over-time` | chart | Chart.js | Understand / interpret | Specified |

### Content-Length Decisions

Prose ran slightly over the top of the budget. The extra length is in Trip Itinerary (the day-by-day table), the Learning for All route preview, and the Greek Language section's 24-letter table, all reference material the rest of the book points back to. Tier C items such as November Weather stayed short.

The budget comparisons above use two counts. Plain-paragraph words are ordinary prose paragraphs only. All prose words is the count the generating session worked from (everything except the MicroSim specifications), and it is the count meant when the note above says "over budget" or "within budget".

General rule applied to every chapter: per CONTENT-GENERATION-GUIDE.md, the CIS budgets are guidelines, not targets. Length was never added by restating earlier text; overruns were accepted when they came from worked examples, tables, or stories an earlier chapter promised, and trimmed where a pass could cut repetition.

Full session notes, facts to verify, and caption changes are in `logs/chapter-content-generator-2026-11-24.md`.
