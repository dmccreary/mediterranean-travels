# Chapter 1 Content Generation Log

## Timestamps (raw)

- 2026-11-24 12:17:08
- 2026-11-24 12:31:47

## Chapter Details

Recorded 2026-11-24, from the chapter file as it stands: `docs/chapters/01-long-timeline/index.md`.

**Title:** Before We Go, Part 1: The Long Timeline of the Eastern Mediterranean  
**Generated:** 2026-11-24 12:17:08  
**How:** Written in an earlier session with chapter-content-generator v1.11 (single chapter, sequential).

### Reading Level

- **Target:** general adult readers with no professional background in the subject (course description, "Audience"); every term is explained when it first appears. In the skill's terms this is between Senior High and College: plain sentences, technical words defined in place.
- **Measured:** Flesch-Kincaid grade 8.9, Flesch reading ease 62.3 (60–70 is "plain English"), average sentence length 17.4 words. Measured with `textstat` on the chapter's plain paragraphs only (tables, lists, admonitions, figures and MicroSim specifications excluded).

### Size

| Measure | Value |
|---|---|
| Concepts | 27 (24 Tier A / 1 Tier B / 2 Tier C) |
| CIS word budget | 12,490–18,800 |
| Plain-paragraph words | 10,520 (within the budget) |
| All prose words (includes tables, lists, admonitions, Practical Notes, Key Takeaways) | 13,974 (within the budget) |
| MicroSim specification words | 4,160 |
| Worked examples | 26 |

### Non-Text Elements

| Element | Count |
|---|---|
| Markdown tables (excluding Concepts Covered) | 27 |
| Trip photos | 6 |
| MicroSim and diagram specifications | 3 |
| Embedded MicroSims (iframes) | 3 |
| Mascot admonitions | 9 (celebration 1, encourage 1, thinking 2, tip 2, warning 2, welcome 1) |
| Pronounce buttons in this chapter | 35 |
| AI-Native Schools chapters linked | 0 |

### MicroSims and Diagrams

| Title | sim-id | Type | Library | Bloom | Status |
|---|---|---|---|---|---|
| Eras of the Eastern Mediterranean Timeline | `eastern-med-eras-timeline` | timeline | vis-timeline | Understand / compare | Built |
| Trade Routes of the Eastern Mediterranean | `eastern-med-trade-routes-map` | map | Leaflet | Understand / infer | Built |
| Place the Site in Its Era | `place-the-site-in-its-era` | microsim | p5.js | Apply / apply | Built |

Embedded: `../../sims/eastern-med-regions-map/main.html`, `../../sims/viking-cruise-map/main.html`, `../../sims/eastern-med-eras-timeline/main.html`

### Content-Length Decisions

Chapter 1 holds the book's foundational concepts, so 24 of its 27 concepts are Tier A. The tiering was checked against the content and kept: nearly every later chapter depends on these concepts. Prose landed near the low end of the budget, and every Tier A concept has a worked example plus a table, a MicroSim, or both. Three concepts (Judaism, Christianity, Islam) share one comparison table rather than three separate ones.

The budget comparisons above use two counts. Plain-paragraph words are ordinary prose paragraphs only. All prose words is the count the generating session worked from (everything except the MicroSim specifications), and it is the count meant when the note above says "over budget" or "within budget".

General rule applied to every chapter: per CONTENT-GENERATION-GUIDE.md, the CIS budgets are guidelines, not targets. Length was never added by restating earlier text; overruns were accepted when they came from worked examples, tables, or stories an earlier chapter promised, and trimmed where a pass could cut repetition.

Full session notes, facts to verify, and caption changes are in `logs/chapter-content-generator-2026-11-24.md`.
