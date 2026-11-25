# Chapter 15 content generation log

- Start: 2026-11-24 19:41:32
- End: 2026-11-24 20:10:10

## Chapter Details

Recorded 2026-11-24, from the chapter file as it stands: `docs/chapters/15-athens-acropolis/index.md`.

**Title:** Day 10: Athens, the Acropolis, and the Persian Wars  
**Generated:** 2026-11-24 19:41:32  
**How:** Written by one background agent working from a shared brief (sequential: one chapter at a time), then checked by the coordinating session; chapter-content-generator v1.11.

### Reading Level

- **Target:** general adult readers with no professional background in the subject (course description, "Audience"); every term is explained when it first appears. In the skill's terms this is between Senior High and College: plain sentences, technical words defined in place.
- **Measured:** Flesch-Kincaid grade 10.4, Flesch reading ease 59.8 (60–70 is "plain English"), average sentence length 22.2 words. Measured with `textstat` on the chapter's plain paragraphs only (tables, lists, admonitions, figures and MicroSim specifications excluded).

### Size

| Measure | Value |
|---|---|
| Concepts | 27 (0 Tier A / 10 Tier B / 17 Tier C) |
| CIS word budget | 4,540–7,400 |
| Plain-paragraph words | 7,376 (within the budget) |
| All prose words (includes tables, lists, admonitions, Practical Notes, Key Takeaways) | 10,787 (46% over the top of the budget) |
| MicroSim specification words | 3,280 |
| Worked examples | 12 |

### Non-Text Elements

| Element | Count |
|---|---|
| Markdown tables (excluding Concepts Covered) | 15 |
| Trip photos | 7 |
| MicroSim and diagram specifications | 3 |
| Embedded MicroSims (iframes) | 0 |
| Mascot admonitions | 10 (celebration 1, encourage 1, thinking 3, tip 2, warning 2, welcome 1) |
| Pronounce buttons in this chapter | 6 |
| AI-Native Schools chapters linked | 1 |

### MicroSims and Diagrams

| Title | sim-id | Type | Library | Bloom | Status |
|---|---|---|---|---|---|
| Xerxes' Road to Salamis | `persian-wars-campaign-map` | map | Leaflet | Understand / infer | Specified |
| The Parthenon's Five Lives | `parthenon-five-lives-timeline` | timeline | vis-timeline | Understand / classify | Specified |
| Agreed Fact or Position? | `parthenon-marbles-fact-or-position` | microsim | p5.js | Analyze / differentiate | Specified |

### Content-Length Decisions

Over budget after two trimming passes (from about 12,800 words). The extra is in the ten tables, the eggplant section (a favorite of ours, linking back to the Turkish dishes in Chapters 5 and 6), and the Parthenon Marbles dispute, presented as contested history with both positions.

The budget comparisons above use two counts. Plain-paragraph words are ordinary prose paragraphs only. All prose words is the count the generating session worked from (everything except the MicroSim specifications), and it is the count meant when the note above says "over budget" or "within budget".

General rule applied to every chapter: per CONTENT-GENERATION-GUIDE.md, the CIS budgets are guidelines, not targets. Length was never added by restating earlier text; overruns were accepted when they came from worked examples, tables, or stories an earlier chapter promised, and trimmed where a pass could cut repetition.

Full session notes, facts to verify, and caption changes are in `logs/chapter-content-generator-2026-11-24.md`.
