---
title: "How Calibrated Are You?"
description: "State the probability that each of twelve statements from this book is true, see your Brier score, reliability table and calibration chart, judge whether you were overconfident, then judge two weather forecasters whose 70 and 90 percent forecasts came true 7 and 6 times in 10."
status: built
image: /sims/calibration-confidence-game/calibration-confidence-game.png
og:image: /sims/calibration-confidence-game/calibration-confidence-game.png
twitter:image: /sims/calibration-confidence-game/calibration-confidence-game.png
social:
   cards: false
quality_score: 0
---

# How Calibrated Are You?

<iframe src="main.html" height="604px" width="100%" scrolling="no" title="State probabilities for twelve statements, then judge your own calibration and that of two forecasters"></iframe>

[Run the How Calibrated Are You? MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A forecaster is **well calibrated** when the things they call "70 percent
likely" happen about 70 percent of the time. This game turns that standard
on ourselves. We state the chance that each of twelve statements from this
book is true, from 0 to 100 percent in steps of 10, and commit before the
answer appears. Then the sim scores the record two ways.

**The Brier score** is the average, over all twelve statements, of
\( (p - o)^2 \), where \( p \) is our probability as a fraction and \( o \)
is 1 if the statement was true and 0 if false. Lower is better: 0 is
perfect, 1 is the worst possible. Saying 50 percent on everything scores
exactly 0.25 every time, which makes 0.25 the baseline to beat: never wrong,
never useful. The Brier score rewards both calibration and *sharpness*,
being willing to say 90 or 10 percent when we have reason to.

**The reliability table** groups our answers by confidence. An answer above
50 percent leans "true" with that confidence; an answer below 50 leans
"false" with confidence 100 minus the answer (so 30 percent counts as a 70
percent lean toward false); 50 percent has no lean. For each confidence
level from 60 to 100 percent the table shows how many answers we gave and
how many leaned the right way. The **calibration chart** (also called a
reliability diagram) plots the same rows: stated confidence across, percent
right up. Points on the dashed diagonal are well calibrated, points below it
are overconfident, and points above it are underconfident.

To judge our own record (J1), the sim compares our average confidence
\( c \) with the percentage of leaned answers that were right, \( h \). If
\( c \) is more than 10 points above \( h \) the verdict is overconfident;
more than 10 points below, underconfident; otherwise about right. At least 6
of the 12 answers must lean one way, or there is no record to judge.

Part B shows two illustrative forecasters for Delphi, from the chapter's
worked example:

| Forecaster | Forecast | Days | Days with rain | Brier score |
|---|---|---|---|---|
| A | 70% chance of rain | 10 | 7 | \( (7 \times 0.09 + 3 \times 0.49) \div 10 = 0.21 \) |
| B | 90% chance of rain | 10 | 6 | \( (6 \times 0.01 + 4 \times 0.81) \div 10 = 0.33 \) |

A is well calibrated. B is overconfident by 30 points, and B's confident
record scores worse than the 0.25 a forecaster would get by always saying 50
percent.

The twelve statements, with the chapters they come from:

| # | Statement | True? |
|---|---|---|
| 1 | Mount Parnassus rises more than 2,000 m above sea level. | True (2,457 m, Chapter 17) |
| 2 | Delphi is more than 300 km by road from Athens. | False (about 180 km, Chapter 18) |
| 3 | The Oracle of Delphi gave answers for more than 1,000 years. | True (about 1,140 years, Chapter 17) |
| 4 | The Byzantine Empire lasted longer than the oracle did. | False (1,123 years against about 1,140, Chapter 17) |
| 5 | Herodotus wrote down the Croesus prophecy within 20 years of the fall of Sardis. | False (about 115 to 120 years later, Chapter 17) |
| 6 | Joseph Fontenrose collected more than 500 Delphic responses. | True (about 535, Chapter 17) |
| 7 | More than 4,000 lead question tablets survive from the oracle of Zeus at Dodona. | True (Chapter 17) |
| 8 | The Temple of Apollo whose ruins we saw at Delphi was finished in the 6th century BCE. | False (about 330 BCE, Chapter 17) |
| 9 | At Salamis, Athens supplied almost half of the Greek ships. | True (180 of 378, Chapter 15) |
| 10 | The council of the Amphictyonic League had 24 votes. | True (Chapter 17) |
| 11 | Fewer than 100 records of freed slaves survive at Delphi. | False (more than a thousand, Chapter 18) |
| 12 | The Athenian Treasury at Delphi was rebuilt from its original blocks in the 20th century. | True (1903–1906, Chapter 18) |

**What is uncertain.** Twelve answers is a small sample; forecasters are
judged over hundreds. With so few answers, luck alone can move the percent
right by 10 points or more, so the J1 verdict describes this one record, not
a lasting trait. The 10-point band for "about right" is a rule of thumb, not
a statistical test. The forecasters' records are illustrative, not real
data. Some numbers in the statements are approximate in the sources, such as
the oracle's start date (at least about 750 BCE) and the count of Fontenrose's
responses.

## How to Use

1. Read the statement and move the **Chance true** slider to the probability
   that it is true. The gauge shows which way we lean and how confidently.
2. Press **Commit** (or Enter). The answer, its reason, and our score on that
   statement appear. A committed probability cannot be changed.
3. Press **Next statement** and continue through all twelve. The strip at the
   top keeps each answer, green when the lean was right, red when wrong, gray
   at 50 percent.
4. After statement 12, press **See my record**. Study the Brier score, the
   reliability table and the chart, then answer J1 (keys 1 to 3). The verdict
   with our average confidence and percent right appears.
5. Press **The forecasters** and answer J2 and J3. **Finish** shows the
   result. **Try Again** clears all twelve answers and the judgments.

## Lesson Plan

**Audience:** adult travelers who have read the Delphi chapters.  
**Duration:** 15 minutes.  
**Prerequisites:** probability, prediction uncertainty, model calibration,
overconfident, underconfident, and Brier score (Chapter 19, "Prediction
Uncertainty" and "Model Calibration").  
**Learning objective (Bloom: Evaluate):** Assess whether one's own
probability judgments, and those of two weather forecasters, are
overconfident, underconfident, or well calibrated, by stating probabilities
for twelve statements and judging the results against a reliability table,
with all three assessments correct.

### Activities

1. **Play (8 min):** State a probability for each statement. Use 50 percent
   only when we truly have no idea, and 100 percent only when we would bet
   anything on it.
2. **Judge yourself (3 min):** Before answering J1, look at the 90 and 100
   percent rows. Were those answers right as often as claimed?
3. **Judge the forecasters (2 min):** Answer J2 and J3. Why does B score
   worse than always saying 50 percent?
4. **Discuss (2 min):** A chatbot states a museum's closing time in the same
   confident tone whether it is sure or guessing. What would a calibrated
   chatbot do differently?

### Assessment

Mastery is 3 of 3 judgments correct on the first attempt. Stating the twelve
probabilities is the data for J1, not itself evidence. As a follow-up, ask:
*A forecaster said "70 percent chance of rain" and it stayed dry. Was the
forecast wrong?* A strong answer says that one day cannot show it, because a
70 percent forecast expects dry weather about 3 days in 10; only the record
over many such days can.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/calibration-confidence-game/main.html"
        height="604px"
        width="100%"
        scrolling="no"
        title="State probabilities for twelve statements, then judge your own calibration and that of two forecasters"></iframe>
```

## References

1. Glenn W. Brier, "Verification of Forecasts Expressed in Terms of
   Probability," *Monthly Weather Review* 78, no. 1 (1950): 1–3. The paper
   that introduced the Brier score.
2. [Brier score](https://en.wikipedia.org/wiki/Brier_score) — Wikipedia. The
   formula, its range, and its decomposition into reliability, resolution
   and uncertainty.
3. Allan H. Murphy and Robert L. Winkler, "Reliability of Subjective
   Probability Forecasts of Precipitation and Temperature," *Journal of the
   Royal Statistical Society, Series C (Applied Statistics)* 26, no. 1
   (1977): 41–47. Evidence that professional weather forecasters are well
   calibrated.
4. Sarah Lichtenstein, Baruch Fischhoff and Lawrence D. Phillips,
   "Calibration of Probabilities: The State of the Art to 1980," in
   *Judgment Under Uncertainty: Heuristics and Biases*, edited by Daniel
   Kahneman, Paul Slovic and Amos Tversky (Cambridge University Press,
   1982). The classic review of overconfidence in answers to general
   knowledge questions, using the same "lean and confidence" format as this
   game.
5. Philip E. Tetlock and Dan Gardner, *Superforecasting: The Art and Science
   of Prediction* (Crown, 2015). How forecasters improve calibration by
   keeping score with Brier scores.
6. Chuan Guo, Geoff Pleiss, Yu Sun and Kilian Q. Weinberger, "On Calibration
   of Modern Neural Networks," *Proceedings of the 34th International
   Conference on Machine Learning* (2017). Reliability diagrams for machine
   learning models, and the finding that many modern networks are
   overconfident.
7. Saurav Kadavath and others, "Language Models (Mostly) Know What They
   Know" (2022, [arXiv:2207.05221](https://arxiv.org/abs/2207.05221)).
   Measures how well large language models' stated confidence matches their
   accuracy.
8. [p5.js](https://p5js.org/) — p5.js 2.3.4, the library used to draw the
   MicroSim.
