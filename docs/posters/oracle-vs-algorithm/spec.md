---
title: "Spec: The Oracle and the Algorithm, Side by Side"
description: Build spec for the Oracle vs. Algorithm interactive poster, with the tile layout, zone table, sources, and open questions for the author.
---

# Spec: The Oracle and the Algorithm, Side by Side

**Status:** built (2026-11-25). The image is generated, the zones are calibrated
to it, and the page is in the nav at
[The Oracle and the Algorithm, Side by Side](index.md). It is `built`, not
`approved`: the author approves it after trying the controls.

## Learning Objective

The learner will compare how the Delphic oracle and a modern predictive model
answer questions, and name, for each of six matched stages, one way the two are
alike and one way the parallel breaks.

## Why This Poster

Chapters [17](../../chapters/17-oracle/index.md) and
[19](../../chapters/19-algorithm/index.md) run the oracle and the algorithm in
parallel, but the parallel is spread over about thirty-five thousand words and
the *Limits of the Oracle Parallel* table sits at the very end. One picture lets
a reader see the six pairs at once, and the zones make the limits visible next to
each pair instead of after it. It is also the one poster where a quiz can test
the *breaks* in a comparison, not only the matches.

## Layout Decision

The first sketch in [Poster Ideas](../poster-ideas.md) used six horizontal rows
across a split scene. Image generators do not keep six rows aligned, so this
spec uses **six tiles in a 3 × 2 grid**, each a small diptych with Delphi on the
left and today on the right. A zone is one whole tile, so one hover compares
both halves. This matches the grid engine used by the
[Three Classical Orders](../column-types/index.md) poster.

| Column 1 | Column 2 | Column 3 |
|---|---|---|
| **1. Who asks** | **2. Where knowledge comes from** | **3. The form of the answer** |
| **4. Who interprets** | **5. How we mishear** | **6. When the answer changes the future** |

The reading order follows the life of one question: someone asks, a source
knows, an answer comes back in some form, someone interprets it, we hear what
we want, and the answer changes what happens next.

## The Six Pairs

| Tile | At Delphi | Today | Where the parallel breaks | Chapter sections |
|---|---|---|---|---|
| 1. Who asks | A petitioner who climbed, paid the *pelanos*, and sacrificed an animal | A user typing a prompt, and the people scored without asking | The oracle answered the few who chose to come; models predict the many who did not | 17: Fees and Sacrifice. 19: Consent in Mass Prediction, Limits of the Oracle Parallel |
| 2. Where knowledge comes from | Envoys from many cities, bringing news with their questions | Training data from many voices, compressed into a model | The Delphi data-hub idea is plausible but unproven; a model's training data is real, if hidden | 19: Oracle as Data Hub, Training Data, Data Bias |
| 3. The form of the answer | A verse that came true whichever side won | A fluent, hedged paragraph or a probability | By Fontenrose's count, the oracle mostly gave commands and approvals, not predictions | 17: Hedging Answers, The Croesus Prophecy. 19: Interpreting Ambiguous Answers, Prediction Uncertainty |
| 4. Who interprets | The Athenian Assembly debating the wooden wall | A human in the loop | The Assembly could disagree and vote. A reviewer who cannot disagree is in the loop on paper only | 17: The Wooden Walls Prophecy. 19: Human in the Loop |
| 5. How we mishear | Croesus hearing victory | A leading question that gets an agreeable answer | Croesus misheard a god. A model may agree because it was trained partly on approval | 17: The Croesus Prophecy. 19: Confirmation Bias |
| 6. When the answer changes the future | Oedipus at the crossroads | A prediction that feeds, or defeats, itself | The oracle's prophecies were told afterward as stories. A model's feedback loop can be measured, if someone keeps score | 17: The Oedipus Prophecy. 19: Self-Fulfilling Prophecy, Student Risk Prediction, Testability of Predictions |

The draft facts for each tile are in `data.json`. Every fact is taken from
those chapter sections, so the poster repeats what the book already says and
adds nothing new.

## Tone Rules

1. **Respect for the oracle.** Chapter 19 insists that for the people who climbed
   to Delphi, consulting Apollo was an act of piety, and that calling it "an
   early algorithm" misses what it meant to them. Each Delphi half is drawn with
   dignity, and each tile's last fact is a place the parallel breaks.
2. **No claim that the oracle was a data center.** The hub idea is labeled a
   reasonable suggestion, not a proven one.
3. **No vendor logos, brand colors, or recognizable product screens** on the
   right halves.
4. **No score-keeping of "who is smarter."** The point is the questions we ask
   of any source.

## Quiz

Nine questions are drafted in `data.json`, covering all six tiles, with three
tiles asked about twice. The questions deliberately ask about the *ideas*
(consent, hedging, automation bias), not about what is drawn, so a reader who
understands the chapters can answer without recognizing a figure.

## Open Questions for the Author

1. **Six tiles or seven?** The chapters also have a strong seventh pair:
   *calibration and track record* (a Pythia whose answers were written down
   afterward, against a model scored on written predictions). Adding it makes a
   3 × 3 grid with one empty cell, or a 4 + 3 layout. Six keeps the image clean.
2. **Which image tool?** The prompt is written for a general text-to-image
   model. Tile 3 is the riskiest, because of the rule against any letters.
3. **Reuse the Glaux mascot?** Not in the image, so the poster stays neutral.
   Glaux can appear on the lesson page.
4. **Companion sims.** The lesson page should link
   [Oracle, Gears, or Data?](../../sims/oracle-gears-or-data-sorter/index.md),
   [Can This Answer Lose?](../../sims/oracle-answer-hedging-test/index.md),
   and [When a Prediction Feeds Itself](../../sims/prediction-feedback-loops/index.md)
   as the next step after each tile.

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Done. Zone rectangles are measured from the generated image's tile edges. Two chip labels were shortened to fit one line: "Knowledge Source" and "Feedback Loop". |
| `oracle-vs-algorithm.png` | Generated, 1536 × 1024, no text in the image. `oracle-vs-algorithm-card.png` is the 1200 px social card. |
| `main.html`, `oracle-vs-algorithm.js`, `index.md`, `metadata.json` | Created from the Orders poster. |

## Next Steps

1. Author tries Explore and Quiz, checks the six zones with `main.html?edit=true`
   if any edge looks off, and sets `status: approved` in `index.md`.
2. Optionally, add the seventh pair (calibration and track record) if a 3 × 3
   grid is wanted.
