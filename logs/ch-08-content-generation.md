# Chapter 8 Content Generation Log

- Start: 2026-11-24 17:08:44
- End: 2026-11-24 17:29:12

## Chapter Details

Recorded 2026-11-24, from the chapter file as it stands: `docs/chapters/08-troy-and-gallipoli/index.md`.

**Title:** Day 6: Troy and Gallipoli  
**Generated:** 2026-11-24 17:08:44  
**How:** Written by one background agent working from a shared brief (sequential: one chapter at a time), then checked by the coordinating session; chapter-content-generator v1.11.

### Reading Level

- **Target:** general adult readers with no professional background in the subject (course description, "Audience"); every term is explained when it first appears. In the skill's terms this is between Senior High and College: plain sentences, technical words defined in place.
- **Measured:** Flesch-Kincaid grade 10.0, Flesch reading ease 62.4 (60–70 is "plain English"), average sentence length 22.1 words. Measured with `textstat` on the chapter's plain paragraphs only (tables, lists, admonitions, figures and MicroSim specifications excluded).

### Size

| Measure | Value |
|---|---|
| Concepts | 37 (1 Tier A / 14 Tier B / 22 Tier C) |
| CIS word budget | 6,640–10,750 |
| Plain-paragraph words | 9,042 (within the budget) |
| All prose words (includes tables, lists, admonitions, Practical Notes, Key Takeaways) | 12,240 (14% over the top of the budget) |
| MicroSim specification words | 3,580 |
| Worked examples | 15 |

### Non-Text Elements

| Element | Count |
|---|---|
| Markdown tables (excluding Concepts Covered) | 11 |
| Trip photos | 7 |
| MicroSim and diagram specifications | 3 |
| Embedded MicroSims (iframes) | 0 |
| Mascot admonitions | 11 (celebration 1, encourage 1, thinking 3, tip 3, warning 2, welcome 1) |
| Pronounce buttons in this chapter | 6 |
| AI-Native Schools chapters linked | 1 |

### MicroSims and Diagrams

| Title | sim-id | Type | Library | Bloom | Status |
|---|---|---|---|---|---|
| The Olympian Gods at Troy | `olympian-gods-at-troy` | microsim | p5.js | Understand / classify | Specified |
| Finish the Line Like a Homeric Singer | `homeric-formula-builder` | microsim | p5.js | Apply / use | Specified |
| Mind the Gap: How Old Is the Evidence? | `troy-gallipoli-evidence-gap` | timeline | vis-timeline | Evaluate / judge | Specified |

### Content-Length Decisions

About 14% over budget. Tier C concepts carry stories earlier chapters promised: the "Johnnies and Mehmets" words (treated as debated authorship), cultural memory at Gallipoli, and Homer's move from memory to writing. Chapter 2's alphabet material was referenced rather than retaught.

The budget comparisons above use two counts. Plain-paragraph words are ordinary prose paragraphs only. All prose words is the count the generating session worked from (everything except the MicroSim specifications), and it is the count meant when the note above says "over budget" or "within budget".

General rule applied to every chapter: per CONTENT-GENERATION-GUIDE.md, the CIS budgets are guidelines, not targets. Length was never added by restating earlier text; overruns were accepted when they came from worked examples, tables, or stories an earlier chapter promised, and trimmed where a pass could cut repetition.

Full session notes, facts to verify, and caption changes are in `logs/chapter-content-generator-2026-11-24.md`.
