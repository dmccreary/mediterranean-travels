# Chapter 12 Content Generation Log

- Start: 2026-11-24 18:40:03
- End: 2026-11-24 18:58:34

## Chapter Details

Recorded 2026-11-24, from the chapter file as it stands: `docs/chapters/12-rhodes/index.md`.

**Title:** Day 8: Rhodes, From the Colossus to the Knights  
**Generated:** 2026-11-24 18:40:03  
**How:** Written by one background agent working from a shared brief (sequential: one chapter at a time), then checked by the coordinating session; chapter-content-generator v1.11.

### Reading Level

- **Target:** general adult readers with no professional background in the subject (course description, "Audience"); every term is explained when it first appears. In the skill's terms this is between Senior High and College: plain sentences, technical words defined in place.
- **Measured:** Flesch-Kincaid grade 10.2, Flesch reading ease 62.2 (60–70 is "plain English"), average sentence length 22.5 words. Measured with `textstat` on the chapter's plain paragraphs only (tables, lists, admonitions, figures and MicroSim specifications excluded).

### Size

| Measure | Value |
|---|---|
| Concepts | 31 (0 Tier A / 15 Tier B / 16 Tier C) |
| CIS word budget | 5,670–9,200 |
| Plain-paragraph words | 9,097 (within the budget) |
| All prose words (includes tables, lists, admonitions, Practical Notes, Key Takeaways) | 11,814 (28% over the top of the budget) |
| MicroSim specification words | 3,430 |
| Worked examples | 15 |

### Non-Text Elements

| Element | Count |
|---|---|
| Markdown tables (excluding Concepts Covered) | 13 |
| Trip photos | 8 |
| MicroSim and diagram specifications | 3 |
| Embedded MicroSims (iframes) | 0 |
| Mascot admonitions | 10 (celebration 1, encourage 1, thinking 3, tip 2, warning 2, welcome 1) |
| Pronounce buttons in this chapter | 5 |
| AI-Native Schools chapters linked | 2 |

### MicroSims and Diagrams

| Title | sim-id | Type | Library | Bloom | Status |
|---|---|---|---|---|---|
| Rhodes Changes Hands, 1912–1948 | `rhodes-changes-hands-1912-1948` | timeline | vis-timeline | Understand / interpret | Specified |
| Who Built What We See in the Old Town? | `rhodes-old-town-layers-sorter` | microsim | p5.js | Analyze / attribute | Specified |
| Read the Olive Oil Label | `read-the-olive-oil-label` | microsim | p5.js | Evaluate / judge | Specified |

### Content-Length Decisions

Over budget even after one trim (from about 12,050 words). Earlier chapters promised several Rhodes stories: the siege of 1522 from the knights' side (Chapter 5) and the 1944 deportation (Chapter 6). The deportation figures are given as sourced ranges rather than single numbers.

The budget comparisons above use two counts. Plain-paragraph words are ordinary prose paragraphs only. All prose words is the count the generating session worked from (everything except the MicroSim specifications), and it is the count meant when the note above says "over budget" or "within budget".

General rule applied to every chapter: per CONTENT-GENERATION-GUIDE.md, the CIS budgets are guidelines, not targets. Length was never added by restating earlier text; overruns were accepted when they came from worked examples, tables, or stories an earlier chapter promised, and trimmed where a pass could cut repetition.

Full session notes, facts to verify, and caption changes are in `logs/chapter-content-generator-2026-11-24.md`.
