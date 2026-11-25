---
title: "Spec: The Antikythera Mechanism, Opened Up"
description: Build spec for The Antikythera Mechanism, Opened Up call-out poster, with the marker table, sources, items to verify, and open questions for the author.
---

# Spec: The Antikythera Mechanism, Opened Up

**Status:** built (2026-11-25). The image is generated, the marker positions are calibrated
to it, and the page is in the nav at [The Antikythera Mechanism, Opened Up](index.md). It is `built`, not
`approved`: the author approves it after trying the controls.

## Learning Objective

The learner will name the main parts of the Antikythera mechanism, the crank,
the gear train, and the front and back dials, and match each dial to the
question an owner could ask of it, from the Moon's phase to the next eclipse.

## Why This Poster

[Chapter 20](../../chapters/20-athens-museums-city-today/index.md) lists the
dials in a table and sends readers to the
[Antikythera Gears](../../sims/antikythera-gears/index.md) MicroSim to see tooth
counts at work. The MicroSim is a simplified teaching model of three outputs,
and it says plainly that it omits lunar phases, eclipse prediction, and the
calendar spirals. The poster fills the gap by **orientation**: what the whole
object looked like, which dial answers which question, and what survives. It is
the picture a reader needs before the sim makes sense. It also sets up the
"ancient prediction machine" idea that connects the oracle chapters to the
algorithm chapters.

## Layout Decision

**Call-out engine, one exploded view.** The picture has three groups: the front
dial lifted away on the left, the open wooden case with the gear train and
crank in the middle, and the two back panels stacked on the right, with a few
corroded fragments on the ground at lower left. Keeping the groups apart gives
each dial a clear place for a marker. The picture is **schematic**, not a
reconstruction of the actual gear layout, and the lesson page should say so. The poster does not repeat the sim's gear arithmetic; the
crank marker points to the sim.

The engine is `layout: "side-panel"`, `orientation: "landscape"`,
`showNumbers: true`. Marker positions in `data.json` are **estimates** taken
from the positions stated in `image-prompt.md`. They must be calibrated with
`?edit=true` once the image exists.

## The Nine Markers

| # | Marker | Source section | Day |
|---|---|---|---|
| 1 | Hand Crank | Chapter 20: "The Antikythera Mechanism", "Ancient Prediction Machines"; sim: [Antikythera Gears](../../sims/antikythera-gears/index.md) | 13 |
| 2 | The Gear Train | Chapter 20: "The Antikythera Mechanism"; appendix [Who Created the Antikythera Mechanism](../../appendices/antikythera-mechanism.md): "What the Mechanism Is", "Why Rhodes" | 13, 8 |
| 3 | Zodiac and Calendar Rings | Chapter 20 table, front dial; appendix dial table | 13 |
| 4 | Moon-Phase Ball | Chapter 20 table, front dial; appendix "Skills" table; sim page, "What We Simplified" | 13 |
| 5 | Metonic Spiral | Chapter 20 table, back upper; appendix worked example "why a 235-month spiral" | 13 |
| 6 | Games Dial | Chapter 20 table, back upper; appendix "Why Rhodes" | 13, 8 |
| 7 | Saros Eclipse Spiral | Chapter 20 table, back lower; "Ancient Prediction Machines"; appendix | 13 |
| 8 | Exeligmos Dial | Appendix "What the Mechanism Is" (dial table and eclipse paragraph) | 13 |
| 9 | Surviving Fragments | Chapter 20: "The Antikythera Mechanism"; appendix | 13 |

Every marker rests on Chapter 20 for its core claim: the crank, the dial and
the cycle it answers, and the fragments. Some added detail is **only in the
appendix**: the pin-and-slot Moon gears and the Hipparchus link (2), the
Egyptian calendar and the planets in modern reconstructions (3), the five-turn
arithmetic (5), the Halieia reading (6), the prime 223 and the eclipse symbols
(7), and the whole exeligmos dial (8). The appendix is part of the book, but it
is not a chapter. See "To Verify" below.

## Tone Rules

1. **Say what is certain.** Each marker states only what Chapter 20 or the
   appendix says, in the chapter's own terms. Nothing about the mechanism is
   drawn from outside the book.
2. **Do not call it a modern computer.** The tip on marker 9 repeats the
   appendix's warning: it was a calculator with one job, and a wrong ratio stayed
   wrong.
3. **Contested origin is a labeled tip.** Marker 6's tip says that where it
   was made is argued, and what points away from Rhodes.
4. **No ladder.** The poster ties the device to the oracle and the algorithm
   as a point on a line of ways to predict, not as the better way.
5. **No lettering.** The real dials are covered in tiny Greek text. The picture
   shows tick marks and dots only.

## Quiz

The call-out engine's built-in quiz mode asks "Click on: <label>" from the
`hint` text. A written question bank is drafted here for the lesson page or a
later extension. Each marker answers at least one.

| # | Question | Answer marker |
|---|---|---|
| 1 | Which dial predicts eclipses? | 7 |
| 2 | Which part do you turn to read the sky on a future or past date? | 1 |
| 3 | Where does the Moon's phase show? | 4 |
| 4 | Which dial tracks 235 lunar months, so the Moon calendar keeps in step with the solar year? | 5 |
| 5 | Where would an owner check whether the Olympic Games fall in a given year? | 6 |
| 6 | Where are the Sun and the Moon among the stars on a given date? | 3 |
| 7 | Which part did the Moon's changing speed make hardest to build? | 2 |
| 8 | Which small dial tells the user how many hours to add to an eclipse time? | 8 |
| 9 | What is left of the device that divers found in 1900? | 9 |
| 10 | Which marker shows the cycle Babylonian astronomers found from centuries of records? | 7 |

## To Verify Before Approval

The chapters and the sim give the **82 fragments**, **at least 30 gears**, the
**2nd century BCE** date, the **about 70 to 60 BCE** wreck date, and the
**dial table**, so those are in `data.json`. These are not in the chapters, and
are not stated as facts there.

1. **Which parts are certain and which are reconstructed.** The idea calls for
   "fragments versus reconstructed parts." Chapter 20 does not say which dials
   or pointers survive and which are inferred. The appendix says only that the
   five planets appear "in modern reconstructions." The image prompt draws the
   dials complete; the lesson page needs a source before it marks any of them as
   reconstructed.
2. **Details from the appendix, not a chapter.** The exeligmos dial (marker 8),
   the Halieia reading (6), the pin-and-slot Moon gears (2), the Egyptian
   calendar (3), and the 235 = 5 × 47 and prime-223 arithmetic (5, 7) come only
   from the appendix. If the author wants chapter-only facts, drop or relocate
   them.
3. **Layout details in the image.** The Metonic spiral drawn with five turns
   comes from the appendix (235 = 5 × 47). The Saros spiral's number of turns,
   the two front pointers, the case's open sides, the crank's side, and the
   number of gears drawn are illustrative and not in the book.
4. **"A main drive wheel."** The idea lists one. Neither the chapter nor the
   appendix names it, so there is no marker for it.
5. **Dimensions.** Chapter 20 says "about the size of a shoebox"; the appendix
   gives 34 × 18 × 9 cm. The picture is not to scale and states neither.

## Open Questions for the Author

1. **Keep the appendix-only details (markers 2, 3, 5 to 8)?** The alternative is a smaller
   poster with six markers from Chapter 20 alone.
2. **Link the appendix?** The lesson page should link
   [Who Created the Antikythera Mechanism](../../appendices/antikythera-mechanism.md)
   and the [Antikythera Gears](../../sims/antikythera-gears/index.md) MicroSim, and
   note that the sim's ratios are not a reconstruction.
3. **Oracle thread.** Chapter 20 sets the mechanism between the oracle and the
   learned model. A tenth marker could carry that link, but nothing in the
   picture suggests where it would sit. The lesson page can say it instead.

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Draft: 9 call-outs, estimated positions from the prompt. Calibrate with `?edit=true` after the image exists. |
| `antikythera-opened.png` | Not generated. |
| `main.html`, `index.md`, `metadata.json` | Not created. |
| Call-out library | Installed: `diagram.js` and `style.css` are in `docs/sims/shared-libs/`. The page loads them from `../../sims/shared-libs/`. |

## Next Steps

1. Author reviews this spec and `image-prompt.md`, and answers the open
   questions.
2. Author generates the image and saves it as `antikythera-opened.png`.
3. Install the call-out library, build `main.html` and `index.md` (born
   `scaffold`), calibrate marker positions with `?edit=true`, and run
   `mkdocs build --strict`.
