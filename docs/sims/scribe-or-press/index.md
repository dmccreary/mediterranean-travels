---
title: "Scribe or Press?"
description: "Predict how many copies of a 200-page book it takes before printing becomes cheaper than hand-copying, for an ordinary copyist and a master calligrapher, then move a slider to watch the fixed-cost and per-copy lines cross."
status: built
image: /sims/scribe-or-press/scribe-or-press.png
og:image: /sims/scribe-or-press/scribe-or-press.png
twitter:image: /sims/scribe-or-press/scribe-or-press.png
social:
   cards: false
quality_score: 100
---

# Scribe or Press?

<iframe src="main.html" height="562px" width="100%" scrolling="no" title="Predict when printing a book becomes cheaper than copying it by hand"></iframe>

[Run the Scribe or Press? MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A scribe and a printing press pay for a book in opposite ways. A scribe's
cost is almost all **marginal cost**: every copy takes as long as the last.
A press has a large **fixed cost**, casting type, building the press and
setting every page, and after that each copy costs very little. So for one
copy the scribe is cheaper, and for a hundred copies the press wins. This
MicroSim asks where, exactly, the two lines cross.

The model uses one unit for everything: the **workday**, one person's day of
skilled work. The book has 200 pages.

| Method | Rate | Fixed cost | Cost per copy |
|---|---|---|---|
| Ordinary copyist | 8 pages a day | 0 | 200 ÷ 8 = 25 workdays |
| Master calligrapher | 2 pages a day | 0 | 200 ÷ 2 = 100 workdays |
| Printing press | type set once | 350 workdays | 0.2 workdays |

The press's fixed cost covers casting the type, building the press and
setting all 200 pages; its cost per copy covers printing, paper handling and
binding labor. These are round numbers chosen to show the shape of the
comparison, **an illustrative model, not historical prices.**

The total costs for N copies are:

- Scribe: cost per copy × N
- Press: 350 + 0.2 × N

The **crossover** is the smallest whole number of copies at which the press
is cheaper:

| Scribe | Inequality | Solution | Crossover |
|---|---|---|---|
| Ordinary copyist | 25 × N > 350 + 0.2 × N | N > 14.1 | 15 copies |
| Master calligrapher | 100 × N > 350 + 0.2 × N | N > 3.51 | 4 copies |

The slower and more beautiful the handwriting, the sooner the press wins.

## How to Use

1. Read the table of the three methods. The highlighted rows are the scribe
   you are comparing and the press.
2. With **Ordinary copyist** selected, type your prediction of the crossover
   into the box and press **Check Prediction** (or Enter). A prediction
   within one copy of the true crossover counts as correct. You get two
   tries; after a second miss the sim shows the worked inequality.
3. The **Copies** slider is locked until your prediction is checked, so the
   chart cannot give the answer away. Then move the slider from 1 to 500
   copies. Both total-cost lines grow from zero copies to the slider's value,
   the table shows each method's total, and the chart says which is cheaper.
   When the lines have crossed, a dashed line marks the crossover and a gold
   dot marks where they meet. The horizontal axis widens as the slider moves.
4. Choose **Master calligrapher**, predict again and check.
5. Move the slider to 200 copies and compare the costs: 5,000.0 workdays for
   the copyist, 20,000.0 for the calligrapher and 390.0 for the press.
6. **Reset** clears both predictions.

## Lesson Plan

**Audience:** adult travelers reading Chapter 6, "Day 4: Bazaars, Scripts,
and Presses".  
**Duration:** 10–15 minutes.  
**Prerequisites:** scribe, copyist, movable type, printing press, fixed cost
and marginal cost, from the chapter sections "Scribes and Copyists",
"Gutenberg" and "The Printing Press".  
**Learning objective (Bloom: Apply):** Calculate the number of copies at
which printing a 200-page book becomes cheaper than copying it by hand, for
an ordinary copyist and for a master calligrapher, predicting each crossover
within one copy.

### Activities

1. **Read the model (2 min):** Which method has a fixed cost? Which has the
   larger cost per copy? At one copy, which is cheaper, and by how much?
2. **Predict and check (5 min):** Set scribe cost equal to press cost,
   solve for N, and round up to the next whole copy. Check the prediction for
   the ordinary copyist, then for the master calligrapher.
3. **Compare (3 min):** At 200 copies, how many times more does the
   copyist cost than the press? The calligrapher?
4. **Transfer (3 min):** Suppose the press's fixed cost doubled to 700
   workdays. Without the sim, estimate the new crossover for the ordinary
   copyist. (700 ÷ 24.8 ≈ 28.2, so 29 copies.)

### Assessment

Mastery is both predictions correct, within one copy, in no more than two
tries each. Follow-up questions:

- Why was the scribe cheaper for a single copy? (The press must pay its
  whole fixed cost before it prints anything.)
- Was the press's advantage only speed? (No: its cost per copy was over a
  hundred times lower than the copyist's.)
- Why did beautiful handwriting make the press win *sooner*? (A slower
  scribe has a higher cost per copy, so the press's fixed cost is paid back
  in fewer copies.)

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/scribe-or-press/main.html"
        height="562px"
        width="100%"
        scrolling="no"
        title="Predict when printing a book becomes cheaper than copying it by hand"></iframe>
```

To experiment with the code, copy
[scribe-or-press.js](scribe-or-press.js) into the
[p5.js Editor](https://editor.p5js.org/) using p5.js 2.3.4.

## References

1. [Printing press](https://en.wikipedia.org/wiki/Printing_press) — Wikipedia. Gutenberg's system and how printing spread across Europe after about 1450.
2. [Scribe](https://en.wikipedia.org/wiki/Scribe) — Wikipedia. The profession of writing and copying by hand before printing.
3. [Fixed cost](https://en.wikipedia.org/wiki/Fixed_cost) — Wikipedia. Costs that do not change with the number of units produced.
4. [Marginal cost](https://en.wikipedia.org/wiki/Marginal_cost) — Wikipedia. The cost of producing one more unit.
5. [Break-even (economics)](https://en.wikipedia.org/wiki/Break-even_(economics)) — Wikipedia. Finding the output at which two cost structures are equal.
