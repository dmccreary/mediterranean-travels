# Chapter 19 Content Generation Log

- Start: 2026-11-24 21:15:56
- End: 2026-11-24 21:29:53

## Chapter Details

Recorded 2026-11-24, from the chapter file as it stands: `docs/chapters/19-algorithm/index.md`.

**Title:** The Oracle and the Algorithm, Part 2: The Algorithm  
**Generated:** 2026-11-24 21:15:56  
**How:** Written by one background agent working from a shared brief (sequential: one chapter at a time), then checked by the coordinating session; chapter-content-generator v1.11.

### Reading Level

- **Target:** general adult readers with no professional background in the subject (course description, "Audience"); every term is explained when it first appears. In the skill's terms this is between Senior High and College: plain sentences, technical words defined in place.
- **Measured:** Flesch-Kincaid grade 10.0, Flesch reading ease 60.5 (60–70 is "plain English"), average sentence length 20.8 words. Measured with `textstat` on the chapter's plain paragraphs only (tables, lists, admonitions, figures and MicroSim specifications excluded).

### Size

| Measure | Value |
|---|---|
| Concepts | 32 (1 Tier A / 11 Tier B / 20 Tier C) |
| CIS word budget | 5,650–9,150 |
| Plain-paragraph words | 8,036 (within the budget) |
| All prose words (includes tables, lists, admonitions, Practical Notes, Key Takeaways) | 11,152 (22% over the top of the budget) |
| MicroSim specification words | 4,485 |
| Worked examples | 14 |

### Non-Text Elements

| Element | Count |
|---|---|
| Markdown tables (excluding Concepts Covered) | 18 |
| Trip photos | 0 |
| MicroSim and diagram specifications | 3 |
| Embedded MicroSims (iframes) | 0 |
| Mascot admonitions | 10 (celebration 1, encourage 1, thinking 3, tip 2, warning 2, welcome 1) |
| Pronounce buttons in this chapter | 2 |
| AI-Native Schools chapters linked | 4 |

### MicroSims and Diagrams

| Title | sim-id | Type | Library | Bloom | Status |
|---|---|---|---|---|---|
| Next-Word Prediction and Temperature | `next-word-temperature-toy` | microsim | p5.js | Understand / infer | Specified |
| When a Prediction Feeds Itself | `prediction-feedback-loops` | causal-loop | vis-network | Analyze / differentiate | Specified |
| How Calibrated Are You? | `calibration-confidence-game` | microsim | p5.js | Evaluate / assess | Specified (from template) |

### Content-Length Decisions

Within budget in plain paragraphs; the all-prose count, with its tables and reflection questions, runs about 22% over. Each of Chapter 17's seven closing questions is paired with one AI question; machine-learning concepts are explained with concrete examples rather than extra prose. The Antikythera mechanism was deliberately left unnamed for Chapter 20.

The budget comparisons above use two counts. Plain-paragraph words are ordinary prose paragraphs only. All prose words is the count the generating session worked from (everything except the MicroSim specifications), and it is the count meant when the note above says "over budget" or "within budget".

General rule applied to every chapter: per CONTENT-GENERATION-GUIDE.md, the CIS budgets are guidelines, not targets. Length was never added by restating earlier text; overruns were accepted when they came from worked examples, tables, or stories an earlier chapter promised, and trimmed where a pass could cut repetition.

Full session notes, facts to verify, and caption changes are in `logs/chapter-content-generator-2026-11-24.md`.
