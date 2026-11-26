---
title: Quiz Generation Quality Report
description: Quality metrics for the 210 chapter quiz questions in Mediterranean Travels, generated with quiz-generator v0.5.
---
# Quiz Generation Quality Report

- **Generated:** 2026-11-26
- **Skill:** quiz-generator v0.5
- **Execution mode:** Serial (1 agent)
- **Wall-clock time:** about 23 minutes (06:04 to 06:27)

## Overall Statistics

| Measure | Value |
|---|---|
| Chapters with a quiz | 21 of 21 |
| Total questions | 210 |
| Questions per chapter | 10 |
| Explanation length | 64 to 92 words (average 81; target 50 to 100) |
| Major sections tested | 125 of 138 (91%) |
| Broken section links | 0 (every **See:** link checked against the chapter's real headings) |
| Near-duplicate questions | 0 |
| **Overall quality score** | **93/100** |

## Score Breakdown

| Component | Score | Basis |
|---|---|---|
| Bloom's distribution | 24/25 | Every level within 3 points of its target |
| Answer balance | 14/15 | Each letter is correct 23% to 28% of the time; D is slightly high |
| Concept coverage | 18/20 | 91% of major sections; three deep-dive chapters test 6 of 8 |
| Explanation quality | 19/20 | All 210 explain why the answer is right, and most say why a tempting option is wrong |
| Format and links | 10/10 | All questions pass the format check, and all links resolve |
| Distractor quality | 8/10 | Spot-checked, not reviewed question by question |

## Per-Chapter Summary

Bloom's columns are Remember / Understand / Apply / Analyze / Evaluate / Create.
Answer columns are A / B / C / D.

| Chapter | Type | Questions | Bloom's | Answers | Sections tested |
|---|---|---|---|---|---|
| [1. Before We Go, Part 1: The Long Timeline of the Eastern Mediterranean](../chapters/01-long-timeline/quiz.md) | Introductory | 10 | 4/4/1/1/0/0 | 3/2/2/3 | 5/6 (83%) |
| [2. Before We Go, Part 2: Traveling Well and the Learning for All Thread](../chapters/02-traveling-well/quiz.md) | Introductory | 10 | 4/4/2/0/0/0 | 3/2/2/3 | 5/6 (83%) |
| [3. Day 1: Istanbul, a City on Two Continents](../chapters/03-istanbul-two-continents/quiz.md) | Introductory | 10 | 4/4/1/1/0/0 | 3/2/2/3 | 7/7 (100%) |
| [4. Day 2: Byzantine Constantinople and Hagia Sophia](../chapters/04-byzantine-constantinople/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 3/2/3/2 | 8/8 (100%) |
| [5. Day 3: Ottoman Istanbul, Topkapı, and Friday Prayer](../chapters/05-ottoman-istanbul/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 2/2/3/3 | 5/5 (100%) |
| [6. Day 4: Bazaars, Scripts, and Presses](../chapters/06-bazaars-scripts-presses/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 3/3/2/2 | 5/6 (83%) |
| [7. Day 5: The End of Empire and the Birth of Modern Turkey](../chapters/07-end-of-empire-modern-turkey/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 3/2/2/3 | 5/6 (83%) |
| [8. Day 6: Troy and Gallipoli](../chapters/08-troy-and-gallipoli/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 2/3/3/2 | 6/6 (100%) |
| [9. Paul at Ephesus, Part 1: The Apostle's Life, Letters, and Ephesian Years](../chapters/09-paul-life-letters/quiz.md) | Advanced | 10 | 2/2/2/3/1/0 | 2/3/2/3 | 6/8 (75%) |
| [10. Day 7: Ephesus, a Greco-Roman City](../chapters/10-ephesus-greco-roman-city/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 3/2/2/3 | 8/9 (89%) |
| [11. Paul at Ephesus, Part 2: Ideas, Legacy, and Lessons in Leading Change](../chapters/11-paul-ideas-leadership/quiz.md) | Advanced | 10 | 2/2/3/2/1/0 | 3/2/2/3 | 8/8 (100%) |
| [12. Day 8: Rhodes, From the Colossus to the Knights](../chapters/12-rhodes/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 2/2/3/3 | 6/6 (100%) |
| [13. Day 9, Part 1: Knossos, the Minoans, and Linear B](../chapters/13-knossos-minoans-linear-b/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 2/3/3/2 | 5/5 (100%) |
| [14. Day 9, Part 2: Venetian Heraklion and Crete Today](../chapters/14-venetian-heraklion/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 3/2/2/3 | 5/5 (100%) |
| [15. Day 10: Athens, the Acropolis, and the Persian Wars](../chapters/15-athens-acropolis/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 3/2/2/3 | 6/7 (86%) |
| [16. Day 11: Athens, the Agora, Democracy, and Paul on the Areopagus](../chapters/16-athens-agora-democracy/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 2/2/3/3 | 7/7 (100%) |
| [17. The Oracle and the Algorithm, Part 1: The Oracle](../chapters/17-oracle/quiz.md) | Advanced | 10 | 2/2/3/2/1/0 | 3/2/2/3 | 6/8 (75%) |
| [18. Day 12: Delphi](../chapters/18-delphi/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 3/3/2/2 | 7/7 (100%) |
| [19. The Oracle and the Algorithm, Part 2: The Algorithm](../chapters/19-algorithm/quiz.md) | Advanced | 10 | 2/2/3/2/1/0 | 2/2/3/3 | 6/8 (75%) |
| [20. Day 13: Athens, Museums, Tutors, and the City Today](../chapters/20-athens-museums-city-today/quiz.md) | Intermediate | 10 | 2/3/3/2/0/0 | 2/3/2/3 | 5/6 (83%) |
| [21. Going Home: Learning With Communities, Not To Them](../chapters/21-going-home/quiz.md) | Advanced | 10 | 2/2/2/2/1/1 | 2/3/2/3 | 4/4 (100%) |

Chapter types set the Bloom's target. Chapters 1 to 3 are introductory. The
five deep dives (9, 11, 17, 19, and 21) are advanced, and they include
Evaluate questions. The rest are intermediate.

## Bloom's Taxonomy Distribution (Overall)

The target is the sum of each chapter's own target.

| Level | Questions | Actual | Target | Deviation |
|---|---|---|---|---|
| Remember | 48 | 22.9% | 24.8% | -1.9 |
| Understand | 61 | 29.0% | 29.0% | +0.0 |
| Apply | 56 | 26.7% | 26.7% | +0.0 |
| Analyze | 39 | 18.6% | 16.0% | +2.6 |
| Evaluate | 5 | 2.4% | 2.4% | +0.0 |
| Create | 1 | 0.5% | 1.2% | -0.7 |

## Answer Balance (Overall)

| Letter | Correct answers | Share |
|---|---|---|
| A | 54 | 25.7% |
| B | 49 | 23.3% |
| C | 49 | 23.3% |
| D | 58 | 27.6% |

In every chapter, each letter is correct two or three times, and no letter is
correct three times in a row.

## Recommendations

- **Chapters 9, 17, and 19** test 6 of their 8 major sections. A second quiz
  or two more questions each would cover the rest.
- **Only one Create question** is in the book (Chapter 21). The deep dives
  could each add one, for example "Write a short Learning for All note for a
  place not on our route."
- **Distractors were spot-checked**, not reviewed one by one. Reading each
  quiz once on the site is the best final check.
- **Some explanations borrow a fact from another chapter** to rule out a
  wrong option (for example, Chapter 11, Question 4 relies on Chapter 9's list
  of undisputed letters). Each borrowed fact is stated in the book.

## Files

- `docs/chapters/*/quiz.md` (21 quizzes)
- `docs/learning-graph/quiz-bank.json` (all 210 questions with options,
  answers, explanations, Bloom's levels, and concepts, for LMS or chatbot use)
