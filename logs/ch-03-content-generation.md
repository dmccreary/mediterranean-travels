# Chapter 3 Content Generation Log

## Timestamps (raw)

- 2026-11-24 13:18:41
- 2026-11-24 13:33:11

## Chapter Details

Recorded 2026-11-24, from the chapter file as it stands: `docs/chapters/03-istanbul-two-continents/index.md`.

**Title:** Day 1: Istanbul, a City on Two Continents  
**Generated:** 2026-11-24 13:18:41  
**How:** Written in an earlier session with chapter-content-generator v1.11 (single chapter, sequential).

### Reading Level

- **Target:** general adult readers with no professional background in the subject (course description, "Audience"); every term is explained when it first appears. In the skill's terms this is between Senior High and College: plain sentences, technical words defined in place.
- **Measured:** Flesch-Kincaid grade 9.7, Flesch reading ease 62.1 (60–70 is "plain English"), average sentence length 20.6 words. Measured with `textstat` on the chapter's plain paragraphs only (tables, lists, admonitions, figures and MicroSim specifications excluded).

### Size

| Measure | Value |
|---|---|
| Concepts | 28 (11 Tier A / 6 Tier B / 11 Tier C) |
| CIS word budget | 8,320–12,850 |
| Plain-paragraph words | 9,790 (within the budget) |
| All prose words (includes tables, lists, admonitions, Practical Notes, Key Takeaways) | 13,782 (7% over the top of the budget) |
| MicroSim specification words | 5,181 |
| Worked examples | 17 |

### Non-Text Elements

| Element | Count |
|---|---|
| Markdown tables (excluding Concepts Covered) | 17 |
| Trip photos | 8 |
| MicroSim and diagram specifications | 5 |
| Embedded MicroSims (iframes) | 0 |
| Mascot admonitions | 8 (celebration 1, encourage 1, thinking 2, tip 1, warning 2, welcome 1) |
| Pronounce buttons in this chapter | 10 |
| AI-Native Schools chapters linked | 1 |

### MicroSims and Diagrams

| Title | sim-id | Type | Library | Bloom | Status |
|---|---|---|---|---|---|
| Istanbul's Three Shores | `istanbul-three-shores-map` | map | Leaflet | Understand / classify | Specified |
| Layers of the Theodosian Walls | `theodosian-walls-layers` | infographic | html | Remember / identify | Specified |
| The Siege of 1453, Step by Step | `siege-of-1453-step-through` | microsim | p5.js | Analyze / attribute | Specified |
| Reading Food in Layers | `food-history-layers-sorter` | microsim | p5.js | Understand / classify | Specified |
| The Right Words at the Right Moment | `turkish-phrase-situations` | microsim | p5.js | Apply / use | Specified |

### Content-Length Decisions

The concept sections came in within budget; the total runs higher because of the intro, practical notes, Learning for All and Key Takeaways. Over their tier: Bosphorus Strait (the crossings table and shore definitions the map needs), Fall of Constantinople (including its aftermath), Turkish Language (the pronunciation table). Under: Food as History (its worked example and MicroSim carry the weight) and Simit.

The budget comparisons above use two counts. Plain-paragraph words are ordinary prose paragraphs only. All prose words is the count the generating session worked from (everything except the MicroSim specifications), and it is the count meant when the note above says "over budget" or "within budget".

General rule applied to every chapter: per CONTENT-GENERATION-GUIDE.md, the CIS budgets are guidelines, not targets. Length was never added by restating earlier text; overruns were accepted when they came from worked examples, tables, or stories an earlier chapter promised, and trimmed where a pass could cut repetition.

Full session notes, facts to verify, and caption changes are in `logs/chapter-content-generator-2026-11-24.md`.
