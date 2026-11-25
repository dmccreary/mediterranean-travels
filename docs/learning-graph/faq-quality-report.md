---
title: FAQ Quality Report
description: Quality metrics for the Mediterranean Travels FAQ, covering concept coverage, Bloom's Taxonomy distribution, answer quality, and recommendations.
---
# FAQ Quality Report

Generated: 2026-11-24

This report measures the [FAQ](../faq.md) against the intelligent-textbook FAQ rubric. The numbers come from a script that parses `docs/faq.md`, so they can be regenerated whenever the FAQ changes.

## Overall Statistics

- **Total Questions:** 94
- **Overall Quality Score:** 95/100
- **Content Completeness Score:** 100/100
- **Concept Coverage:** 80% (481 of 598 learning-graph concepts)
- **Total FAQ Words:** about 17,000

## Content Completeness

| Input | Finding | Points |
|---|---|---|
| Course description | Complete, quality score 97, Bloom's outcomes for the trip and each deep dive | 25/25 |
| Learning graph | 598 concepts, 942 dependencies, valid DAG with no cycles | 25/25 |
| Glossary | 666 terms, just generated | 15/15 |
| Chapter content | 21 chapters, about 330,000 words (385,000 across all of `docs/`) | 20/20 |
| Concept coverage in chapters | Every concept is assigned to a chapter's Concepts Covered table | 15/15 |
| **Total** | | **100/100** |

## Category Breakdown

| Category | Questions | Avg Words | Bloom's Levels |
|---|---|---|---|
| Getting Started | 14 | 146 | Remember 8, Understand 6 |
| Core Concepts | 27 | 164 | Remember 6, Understand 16, Analyze 4, Evaluate 1 |
| Technical Details | 23 | 160 | Remember 7, Understand 11, Apply 5 |
| Common Challenges | 13 | 171 | Apply 6, Analyze 6, Evaluate 1 |
| Best Practices | 9 | 191 | Apply 5, Analyze 2, Evaluate 1, Create 1 |
| Advanced Topics | 8 | 210 | Analyze 1, Evaluate 4, Create 3 |

Answers grow longer and climb the taxonomy from Getting Started to Advanced Topics, as intended.

## Bloom's Taxonomy Distribution

| Level | Count | Actual | Target | Deviation |
|---|---|---|---|---|
| Remember | 21 | 22% | 20% | +2% ✓ |
| Understand | 33 | 35% | 30% | +5% ✓ |
| Apply | 16 | 17% | 25% | −8% ⚠ |
| Analyze | 13 | 14% | 15% | −1% ✓ |
| Evaluate | 7 | 7% | 7% | 0% ✓ |
| Create | 4 | 4% | 3% | +1% ✓ |

Total absolute deviation: 17%. Bloom's score: **20/25**. Apply is the one level below target; the Core Concepts and Technical Details categories lean on Understand.

## Answer Quality Analysis

- **Examples:** 43/94 (46%). Target 40%+ ✓
- **Links:** 94/94 (100%) link to a chapter, MicroSim, appendix, or glossary page. Target 60%+ ✓
- **Average length:** 168 words (range 124–235). Target 100–300 ✓
- **Complete answers:** 94/94 (100%) ✓
- **Reading level:** average Flesch-Kincaid grade about 9, suitable for adult general readers. A few list-heavy answers score higher because the formula treats a long list as one sentence.

Answer Quality Score: **25/25**

## Link Validation

- Links checked: every Markdown link in every answer
- Anchor links (`#` fragments): **0** ✓
- Broken internal links: **0** ✓
- External links: only the companion textbook [AI-Native Schools](https://dmccreary.github.io/ai-native-schools/)

## Concept Coverage

Coverage was measured by matching each learning-graph label, with plural and word-order variants, against the FAQ text. By that test, 481 of 598 concepts (80%) appear in at least one answer. Coverage Score: **30/30**.

The matcher has known errors in both directions. It misses some concepts the FAQ discusses under different wording, such as *Pauline Letters* (written "Paul's letters") and *Myth Versus History*, and it may credit a few concepts that are only mentioned in passing. The [FAQ Coverage Gaps](faq-coverage-gaps.md) page lists the uncovered concepts after a manual review.

## Organization Quality

- Logical categorization: ✓
- Progressive difficulty: ✓ (average Bloom's level and answer length rise category by category)
- No duplicates: ✓ No question pair was more than 85% similar. The closest pairs are the two "where does the comparison break down" questions (Paul and schools; the oracle and AI) and three "what is the difference between" questions, which cover different topics.
- Clear questions: ✓ Every question is a full, searchable question ending in a question mark.

Organization Score: **20/20**

## Overall Quality Score: 95/100

| Component | Score |
|---|---|
| Coverage | 30/30 |
| Bloom's Distribution | 20/25 |
| Answer Quality | 25/25 |
| Organization | 20/20 |
| **Total** | **95/100** |

## Accuracy Checks

Answers were drafted from the chapters' summaries and Key Takeaways, then specific claims were checked against the chapter text. That check corrected several first-draft details, including the five layers of the Theodosian Walls, the number of Muslims in the 1923 exchange (about 400,000), the source of the Johnnies and Mehmets words (a 1953 interview with Şükrü Kaya), the 1927 census figure behind "one in ten," the clock change between Kuşadası and Rhodes, the causes of late Arabic-script printing, and the two positions in the Parthenon Marbles dispute.

## Recommendations

### High Priority

1. **Raise Apply-level questions by about seven.** Good candidates are practical: planning a day around prayer times, reading an inscription's first line, dating a column by its order, scoring our own forecasts with the Brier score, and using the stages of concern to diagnose a teacher's worry.
2. **Cover the remaining high-centrality gaps:** *Plato's Academy*, *Greek Dark Age*, *Stoa*, and *Human Need for Foresight*.

### Medium Priority

1. Add questions on the Delphi site itself (the omphalos, the Charioteer, the Tholos, the treasuries), which the FAQ covers only through the oracle.
2. Add a question on the Rhodes deportation of 1944 and the Kahal Shalom Synagogue, a major Learning for All story that has no question of its own.
3. Add a practical question on tipping and currency in Turkey and Greece.

### Low Priority

1. Add Glaux once, as a `mascot-tip` in Getting Started, if the author wants the mascot on this page.
2. Regenerate this report after adding questions, so the counts stay current.

## Suggested Additional Questions

1. "What was Plato's Academy, and how did it differ from Aristotle's Lyceum?" (Core Concepts, Understand)
2. "Why did writing disappear from Greece during the Dark Age?" (Core Concepts, Analyze)
3. "What happened to the Jewish community of Rhodes in 1944?" (Core Concepts, Understand)
4. "What should I look for at the omphalos and the Charioteer in the Delphi museum?" (Technical Details, Apply)
5. "How do I read the first line of a Greek or Roman statue base?" (Technical Details, Apply)
6. "How do I tip and pay in Turkey and in Greece?" (Common Challenges, Apply)
7. "How can I score my own predictions for calibration?" (Best Practices, Apply)
8. "How do the stages of concern help a leader meet teachers where they are?" (Best Practices, Apply)
9. "What does the Polytechnic uprising of 1973 mean to Athenians today?" (Core Concepts, Understand)
10. "Why is the Tholos at Athena Pronaia still unexplained?" (Advanced Topics, Evaluate)
