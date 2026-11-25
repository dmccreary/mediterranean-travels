# Chapter 20 Content Generation Log

- Start: 2026-11-24 21:31:02
- End: 2026-11-24 21:51:25

## Chapter Details

Recorded 2026-11-24, from the chapter file as it stands: `docs/chapters/20-athens-museums-city-today/index.md`.

**Title:** Day 13: Athens, Museums, Tutors, and the City Today  
**Generated:** 2026-11-24 21:31:02  
**How:** Written by one background agent working from a shared brief (sequential: one chapter at a time), then checked by the coordinating session; chapter-content-generator v1.11.

### Reading Level

- **Target:** general adult readers with no professional background in the subject (course description, "Audience"); every term is explained when it first appears. In the skill's terms this is between Senior High and College: plain sentences, technical words defined in place.
- **Measured:** Flesch-Kincaid grade 11.2, Flesch reading ease 56.8 (60–70 is "plain English"), average sentence length 23.6 words. Measured with `textstat` on the chapter's plain paragraphs only (tables, lists, admonitions, figures and MicroSim specifications excluded).

### Size

| Measure | Value |
|---|---|
| Concepts | 26 (0 Tier A / 5 Tier B / 21 Tier C) |
| CIS word budget | 3,770–6,200 |
| Plain-paragraph words | 7,994 (29% over the top of the budget) |
| All prose words (includes tables, lists, admonitions, Practical Notes, Key Takeaways) | 11,034 (78% over the top of the budget) |
| MicroSim specification words | 3,430 |
| Worked examples | 6 |

### Non-Text Elements

| Element | Count |
|---|---|
| Markdown tables (excluding Concepts Covered) | 10 |
| Trip photos | 10 |
| MicroSim and diagram specifications | 3 |
| Embedded MicroSims (iframes) | 1 |
| Mascot admonitions | 9 (celebration 1, encourage 1, neutral 1, thinking 2, tip 1, warning 2, welcome 1) |
| Pronounce buttons in this chapter | 3 |
| AI-Native Schools chapters linked | 2 |

### MicroSims and Diagrams

| Title | sim-id | Type | Library | Bloom | Status |
|---|---|---|---|---|---|
| Oracle, Gears, or Data? | `oracle-gears-or-data-sorter` | microsim | p5.js | Analyze / differentiate | Specified |
| Why Athens Looks the Way It Does | `modern-athens-timeline` | timeline | vis-timeline | Understand / infer | Specified |
| Tutoring Effect Size Explorer | `tutoring-effect-size-explorer` | chart | Plotly | Understand / interpret | Specified (from template) |

Embedded: `../../sims/antikythera-gears/main.html`

### Content-Length Decisions

Well over budget. The extra is the National Archaeological Museum section (four photos) and a Learning for All section that carries nine concepts (tutoring, Bloom's 2 sigma finding and its critiques, the Phaedrus). Rebetiko, Plaka, Migration and Greek-Turkish Relations are the easiest sections to trim if the author wants it shorter.

The budget comparisons above use two counts. Plain-paragraph words are ordinary prose paragraphs only. All prose words is the count the generating session worked from (everything except the MicroSim specifications), and it is the count meant when the note above says "over budget" or "within budget".

General rule applied to every chapter: per CONTENT-GENERATION-GUIDE.md, the CIS budgets are guidelines, not targets. Length was never added by restating earlier text; overruns were accepted when they came from worked examples, tables, or stories an earlier chapter promised, and trimmed where a pass could cut repetition.

Full session notes, facts to verify, and caption changes are in `logs/chapter-content-generator-2026-11-24.md`.
