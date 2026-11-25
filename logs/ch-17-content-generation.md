# Chapter 17 content generation log

- Start: 2026-11-24 20:30:41
- End: 2026-11-24 20:55:27

## Chapter Details

Recorded 2026-11-24, from the chapter file as it stands: `docs/chapters/17-oracle/index.md`.

**Title:** The Oracle and the Algorithm, Part 1: The Oracle  
**Generated:** 2026-11-24 20:30:41  
**How:** Written by one background agent working from a shared brief (sequential: one chapter at a time), then checked by the coordinating session; chapter-content-generator v1.11.

### Reading Level

- **Target:** general adult readers with no professional background in the subject (course description, "Audience"); every term is explained when it first appears. In the skill's terms this is between Senior High and College: plain sentences, technical words defined in place.
- **Measured:** Flesch-Kincaid grade 9.3, Flesch reading ease 64.2 (60–70 is "plain English"), average sentence length 20.2 words. Measured with `textstat` on the chapter's plain paragraphs only (tables, lists, admonitions, figures and MicroSim specifications excluded).

### Size

| Measure | Value |
|---|---|
| Concepts | 33 (7 Tier A / 14 Tier B / 12 Tier C) |
| CIS word budget | 8,440–13,250 |
| Plain-paragraph words | 10,372 (within the budget) |
| All prose words (includes tables, lists, admonitions, Practical Notes, Key Takeaways) | 14,590 (10% over the top of the budget) |
| MicroSim specification words | 3,982 |
| Worked examples | 20 |

### Non-Text Elements

| Element | Count |
|---|---|
| Markdown tables (excluding Concepts Covered) | 18 |
| Trip photos | 3 |
| MicroSim and diagram specifications | 3 |
| Embedded MicroSims (iframes) | 0 |
| Mascot admonitions | 10 (celebration 1, encourage 1, thinking 3, tip 2, warning 2, welcome 1) |
| Pronounce buttons in this chapter | 9 |
| AI-Native Schools chapters linked | 1 |

### MicroSims and Diagrams

| Title | sim-id | Type | Library | Bloom | Status |
|---|---|---|---|---|---|
| A Day at the Oracle | `delphi-consultation-steps` | microsim | p5.js | Understand / explain | Specified |
| Can This Answer Lose? | `oracle-answer-hedging-test` | microsim | p5.js | Analyze / distinguish | Specified |
| Eleven Centuries of the Oracle | `delphi-oracle-strength-timeline` | timeline | vis-timeline | Analyze / distinguish | Specified |

### Content-Length Decisions

About 10% over budget. The extra length is in testing the famous oracle answers (Croesus, the wooden wall, Chaerephon) against their sources, and in tables used to keep prose runs short. The site walk was left to Chapter 18 and the AI comparisons to Chapter 19.

The budget comparisons above use two counts. Plain-paragraph words are ordinary prose paragraphs only. All prose words is the count the generating session worked from (everything except the MicroSim specifications), and it is the count meant when the note above says "over budget" or "within budget".

General rule applied to every chapter: per CONTENT-GENERATION-GUIDE.md, the CIS budgets are guidelines, not targets. Length was never added by restating earlier text; overruns were accepted when they came from worked examples, tables, or stories an earlier chapter promised, and trimmed where a pass could cut repetition.

Full session notes, facts to verify, and caption changes are in `logs/chapter-content-generator-2026-11-24.md`.
