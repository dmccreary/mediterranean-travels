---
title: "Spec: Delphi, Climbing the Sacred Way"
description: Build spec for the Delphi Sacred Way call-out poster, with the nine markers in climbing order, sources, quiz, and open questions for the author.
---

# Spec: Delphi, Climbing the Sacred Way

**Status:** spec and draft data only. No image has been generated, and there is
no `index.md` or `main.html` yet, so this poster is not in the nav.

## Learning Objective

The learner will name nine places on the Delphi hillside in the order a visitor
climbs them, say what a petitioner or an athlete did at each, and say what
survives to see today.

## Why This Poster

[Chapter 18](../../chapters/18-delphi/index.md) is a walk, and
[Chapter 17](../../chapters/17-oracle/index.md) is the explanation of what the
walk was for. A reader on Day 12 will have about an hour on a steep slope with
ruins scattered up it, and a list of names does not tell them which stone is
which or what is above what. One elevation shows the whole climb at once, with
the Sacred Way as a visible zigzag, and each marker names what was done there
and what is left.

## Layout Decision

**One hillside elevation, call-out engine.** Numbered markers with leader lines,
in the order of the chapter's walk: Castalian Spring, Sacred Way, treasuries,
Athenian Treasury, polygonal wall, the temple terrace, theater, stadium, then
down to Athena Pronaia and its Tholos. The picture is **stylized and not to
scale**, but the relative order is the one the chapters give, and the prompt
fixes it:

- The sanctuary gate is at the southeast corner; the Sacred Way runs west along
  the lowest terrace, turns at the Athenian Treasury, climbs east along the
  polygonal wall, and turns up to the temple (Chapter 18, The Sacred Way).
- The stadium is the highest feature, above the theater and outside the wall
  (Chapter 18, The Stadium; Chapter 17, The Sanctuary of Apollo).
- The Castalian Spring is just east of the sanctuary; Athena Pronaia is a short
  walk further east, below the modern road (Chapter 18).

East is therefore on the right, as if looking north up the slope from the valley.

| # | Marker | Chapter section | Petitioner or athlete |
|---|---|---|---|
| 1 | Castalian Spring | [18](../../chapters/18-delphi/index.md): The Castalian Spring | Washed before entering |
| 2 | Sacred Way | 18: The Sacred Way of Delphi | Walked it, between rival monuments |
| 3 | Treasuries | 18: The Treasuries of Delphi | Looked at, not entered |
| 4 | Athenian Treasury | 18: The Athenian Treasury | The one still standing |
| 5 | Polygonal Wall | 18: The Polygonal Wall; Manumission Records | Read the records of freedom |
| 6 | Temple of Apollo and altar | [17](../../chapters/17-oracle/index.md): The Temple of Apollo; The Oracle Consultation | Sacrificed, then asked |
| 7 | Theater | 18: The Theater of Delphi | Musical contests |
| 8 | Stadium | 18: The Stadium of Delphi | Athletic contests |
| 9 | Athena Pronaia and Tholos | 18: The Athena Pronaia Sanctuary; The Tholos | First shrine from the east |

Marker positions in `data.json` are estimates from the positions stated in
`image-prompt.md`. They must be calibrated against the real image with
`main.html?edit=true`. Markers are at least 8 percentage points apart.

## Sources

All facts in `data.json` come from Chapter 18 (Parts One to Four) and Chapter 17
(The Sanctuary of Apollo, The Temple of Apollo at Delphi, The Pythia, The Oracle
Consultation). The drawing's only inventions are details of how a building looks,
not claims about it.

## Tone Rules

1. **Say what is standing and what is not.** Only the Athenian Treasury stands,
   rebuilt in 1903 to 1906. The temple is foundations and six re-erected columns.
   The markers say so.
2. **Keep the uncertain parts uncertain.** The Athenian Treasury is "possibly"
   built from the spoils of Marathon. The Tholos has no known purpose. The
   omphalos is a copy and the original is lost.
3. **Treat the oracle as a living faith of its own time**, as Chapter 17 does. No
   "primitive superstition" wording, and no foaming Pythia: the prompt draws no
   Pythia at all.
4. **No ladder, no ranking of sites.** The poster does not say Delphi was
   better or more important than the other places on the trip.

## Quiz

Ten questions are drafted here. The call-out engine builds its own quiz mode
from each marker's `hint`, and its `data.json` has no `quiz[]` field, so these
are for the author's review and for any companion page.

| # | Question | Answer | Explanation |
|---|---|---|---|
| 1 | Where would a petitioner have washed before entering the sanctuary? | 1, Castalian Spring | Nobody approached Apollo unwashed; purifying with its water was the second step of a consultation. |
| 2 | Which road did rival cities line with monuments facing each other? | 2, Sacred Way | Pilgrims walked between the claims, as Pausanias described monument by monument. |
| 3 | Which buildings held gifts, but were mainly there to carry a city's name? | 3, Treasuries | A treasury was not a bank; it displayed a city's wealth and piety. |
| 4 | Which building stands today because archaeologists rebuilt it from its original blocks? | 4, Athenian Treasury | French archaeologists rebuilt it between 1903 and 1906, with money from Athens. |
| 5 | Which wall is fitted without mortar, survived the earthquake of 373 BCE, and carries records of freedom? | 5, Polygonal Wall | The interlocking blocks resist earthquakes; the smooth face became the sanctuary's archive. |
| 6 | Where was the goat sacrificed before a consultation? | 6, temple terrace | On the great altar before the temple's east front. |
| 7 | Where were the musical contests of the Pythian Games held? | 7, Theater | Music came first in the program; the athletics followed higher up. |
| 8 | Which structure is the highest, and lies outside the sanctuary wall? | 8, Stadium | It is about 178 m long, and in winter the path up is not always open. |
| 9 | Which shrine was the first a pilgrim reached on the road from the east? | 9, Athena Pronaia | Its name means "before the temple." |
| 10 | Which building is one of the most admired in Greece, though nobody knows why it was built? | 9, Tholos | No ancient writer says what it was for. |

## Open Questions for the Author

1. **Scale and honesty.** The picture squeezes the slope and enlarges buildings.
   The relative order is right. If you would rather add a small sidebar
   ("about 100 m of climb from entrance to stadium", from Chapter 17) on the lesson
   page, say so.
2. **Marker order.** The numbering follows our climb and puts Athena Pronaia last,
   as Chapter 18 does. A pilgrim arriving from the east would have met Pronaia
   first. Keep the chapter's order, or renumber to the pilgrim's?
3. **Left or right.** East on the right is what the chapter's directions give when
   viewed from the valley. A generator may mirror the picture; if so, the markers
   need only be moved, but the compass note in the lesson should be edited.
4. **Companion sims.** The lesson page should link
   [A Day at the Oracle](../../sims/delphi-consultation-steps/index.md),
   [Two Ends of the Serpent Column](../../sims/serpent-column-two-ends/index.md),
   [Read a Freedom Record on the Polygonal Wall](../../sims/delphi-freedom-record-reader/index.md),
   and [Eleven Centuries of the Oracle](../../sims/delphi-oracle-strength-timeline/index.md).

## To Verify Before Approval

- The real relative positions and heights of the terraces. The chapters give the
  order, not the distances, and the prompt only places the features by order.
- Where the Siphnian Treasury stood on the Sacred Way. The chapters name it but
  do not locate it, so marker 3 is a general marker for the row.
- Where the Stoa of the Athenians and the Castalian Spring's older fountain stand
  in relation to the road. The prompt draws them as the chapters word them.
- The current state of the upper paths and the stadium climb on the day.

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Drafted. Nine markers, estimated positions, to be calibrated with `?edit=true`. |
| `delphi-sacred-way.png` | Not generated. |
| `main.html`, `index.md`, `metadata.json` | Not created. The call-out library (`diagram.js`, `style.css`) is already installed in `docs/sims/shared-libs/`; the page loads it from `../../sims/shared-libs/`. |

## Next Steps

1. Author reviews the prompt and the nine markers, then generates the image.
2. Install the call-out library, build the page, and calibrate the markers.
3. Answer the marker-order and mirroring questions above.
