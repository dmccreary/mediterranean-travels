---
title: Tutoring Effect Size Explorer
description: Predict the percentile that five reported effect sizes for tutoring, mastery learning, and an AI tutor pilot put the average student at, then watch two normal curves separate to check, and explore how effect size in standard deviations turns into percentiles.
status: built
image: /sims/tutoring-effect-size-explorer/tutoring-effect-size-explorer.png
og:image: /sims/tutoring-effect-size-explorer/tutoring-effect-size-explorer.png
twitter:image: /sims/tutoring-effect-size-explorer/tutoring-effect-size-explorer.png
social:
   cards: false
quality_score: 0
---

# Tutoring Effect Size Explorer

<iframe src="main.html" height="568px" width="100%" scrolling="no" title="Predict the percentile for five tutoring effect sizes and watch two normal curves separate"></iframe>

[Run the Tutoring Effect Size Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Studies of teaching report their results as an **effect size**: the gap between
the program group and a comparison group, measured in standard deviations of
the comparison group's scores (Cohen's *d*). The number is easy to quote and
hard to feel. "Two sigma" does not mean the students learned twice as much, and
0.3 does not mean the effect was trivial.

This MicroSim translates effect sizes into a picture. Two normal curves share
one axis of test scores: the conventional class, fixed at mean 0, and the
program group, whose mean sits at *d*. If both groups are spread out in the same
way, the average student in the program outscores the share of the conventional
class lying below the program mean, which is

$$\text{percentile} = 100 \times \Phi(d),$$

where $\Phi$ is the standard normal cumulative distribution function. The sim
shades that share and prints it to one decimal place.

| # | Reported result | *d* | Model percentile |
|---|---|---|---|
| 1 | Bloom's studies, one-on-one tutoring with mastery learning (1984) | 2.00 | 97.7 |
| 2 | Bloom's studies, mastery learning in a class (1984) | 1.00 | 84.1 |
| 3 | VanLehn's review, human tutoring (2011) | 0.79 | 78.5 |
| 4 | Nickow, Oreopoulos, and Quan's review of randomized school tutoring trials (2020) | 0.37 | 64.4 |
| 5 | Nigeria after-school AI tutor pilot, six weeks (World Bank, 2025) | 0.30 | 61.8 |

**Reading these numbers with care.** The five rows are not equally strong
evidence, and the sim does not rank programs.

- **Bloom's 2.0 is an outlier.** It came from a few small studies by Bloom's
  graduate students that lasted a few weeks, covered one unit, and tested
  exactly what had been taught. Later reviews of many trials find much smaller
  averages, and critics such as Paul von Hippel have argued that part of the
  gap came from the extra testing and feedback the tutored students received.
- **The 2020 review's 0.37 shrank on publication.** The 2020 working paper pooled
  randomized trials of school tutoring and reported 0.37; the peer-reviewed
  version (2024) reports about 0.29, near the 61st percentile. Both are large by the standards of
  education research.
- **The AI tutor result is one short pilot.** The World Bank team reported
  gains of about 0.3 standard deviations in English after six weeks of
  after-school sessions in Benin City, Edo State, with teachers present and a
  structured design. One randomized pilot is promising, not proof that AI
  tutoring in general works at that size; short studies with tests close to
  the material often report larger effects than long ones with broad tests.
- **The percentile is a model.** It assumes normal curves with equal spread.
  Real score distributions are lumpier, and the percentile describes the
  average student, not every student.

## How to Use

1. Read the result, its study, and its *d*. The curves start together at
   *d* = 0, where the percentile is 50.0.
2. Type the percentile you predict (a whole number from 0 to 100) and press
   **Check** or Enter. The program curve slides to *d* and the shaded share
   fills in. A prediction within 5 points of the model percentile counts as
   correct.
3. If the first prediction is off, read the hint and try once more. The
   percentile stays hidden until you are right or have used both tries. Only
   the first attempt counts toward "n of 5 within 5 points on the first
   attempt".
4. Press **Next result** to go on. After result 5, the **free exploration**
   slider unlocks: move *d* from 0.00 to 2.00 and watch the percentile change,
   with gold markers showing the five results.
5. **Restart** returns to result 1 and clears the score.

## Lesson Plan

**Audience:** adult travelers reading Chapter 20, "Day 13: Athens, Museums,
Tutors, and the City Today", in the section "Learning for All: The Prince's
Tutor and the Philosopher's Warning".  
**Duration:** 10–15 minutes.  
**Prerequisites:** standard deviation, effect size, and percentile (defined in
"Bloom's 2 Sigma Problem"); one-on-one tutoring, mastery learning, and AI
tutoring (defined in the sections around the sim).  
**Learning objective (Bloom: Understand):** Interpret five reported effect
sizes for tutoring and mastery learning, given in standard deviations, as the
percentile of a conventional class that the average student in the program
outscores, to within 5 percentage points.

### Activities

1. **Predict (5 min):** Work through the five results, predicting each
   percentile before the curves move. Note the first-attempt score.
2. **Explore (4 min):** Use the slider to find the *d* that reaches the 75th
   percentile (about 0.67) and the 90th (about 1.28). Compare the gain from 0 to
   1 with the gain from 1 to 2.
3. **Discuss (4 min):** A company claims its AI tutor "delivers two sigma".
   What would you ask before believing it? Think about study size, length, the
   test used, and who was in the comparison group.

### Assessment

Mastery is at least 4 of 5 predictions within 5 points on the first attempt. A
follow-up question: *An article says a program "raised scores by 0.25 standard
deviations". About which percentile does the average student reach, and is
that a small effect?* A strong answer gives about the 60th percentile and notes
that a quarter of a standard deviation is a meaningful gain for a whole school.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/tutoring-effect-size-explorer/main.html"
        height="568px"
        width="100%"
        scrolling="no"
        title="Predict the percentile for five tutoring effect sizes and watch two normal curves separate"></iframe>
```

## References

1. Benjamin S. Bloom, "The 2 Sigma Problem: The Search for Methods of Group Instruction as Effective as One-to-One Tutoring," *Educational Researcher* 13, no. 6 (1984): 4–16 ([doi:10.3102/0013189X013006004](https://doi.org/10.3102/0013189X013006004)). Results 1 and 2.
2. Kurt VanLehn, "The Relative Effectiveness of Human Tutoring, Intelligent Tutoring Systems, and Other Tutoring Systems," *Educational Psychologist* 46, no. 4 (2011): 197–221 ([doi:10.1080/00461520.2011.611369](https://doi.org/10.1080/00461520.2011.611369)). Result 3: human tutoring, *d* = 0.79.
3. Andre Nickow, Philip Oreopoulos, and Vincent Quan, "The Impressive Effects of Tutoring on PreK-12 Learning: A Systematic Review and Meta-Analysis of the Experimental Evidence," NBER Working Paper 27476 (2020) ([nber.org](https://www.nber.org/papers/w27476)). Result 4: pooled effect of 0.37.
4. Andre Nickow, Philip Oreopoulos, and Vincent Quan, "The Promise of Tutoring for PreK–12 Learning: A Systematic Review and Meta-Analysis of the Experimental Evidence," *American Educational Research Journal* 61, no. 1 (2024) ([doi:10.3102/00028312231208687](https://doi.org/10.3102/00028312231208687)). The published version, with a pooled effect of about 0.29.
5. Martín E. De Simone and others, "From chalkboards to chatbots: Transforming learning in Nigeria, one prompt at a time," World Bank Education blog, January 9, 2025 ([blogs.worldbank.org](https://blogs.worldbank.org/en/education/From-chalkboards-to-chatbots-Transforming-learning-in-Nigeria)). Result 5: about 0.3 standard deviations after a six-week pilot. The full study is World Bank Policy Research Working Paper 11125 (2025).
6. Paul T. von Hippel, "Two-Sigma Tutoring: Separating Science Fiction from Science Fact," *Education Next* 24, no. 2 (2024) ([educationnext.org](https://www.educationnext.org/two-sigma-tutoring-separating-science-fiction-from-science-fact/)). Why Bloom's 2.0 is an upper bound rather than a typical result.
7. Jacob Cohen, *Statistical Power Analysis for the Behavioral Sciences*, 2nd ed. (Lawrence Erlbaum, 1988). The standardized mean difference *d* and its percentile ("U3") interpretation.
8. [Effect size](https://en.wikipedia.org/wiki/Effect_size) — Wikipedia. Cohen's *d* and how it is computed.
9. [Plotly JavaScript Open Source Graphing Library](https://plotly.com/javascript/) — Plotly documentation for the charting library used here.
