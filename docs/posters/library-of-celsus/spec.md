---
title: "Spec: The Library of Celsus Facade"
description: Build spec for the Library of Celsus Facade call-out poster, with the nine markers, sources, quiz, and what the chapters do not say.
---

# Spec: The Library of Celsus Facade

**Status:** spec and draft data only. No image has been generated, and there is
no `index.md` or `main.html` yet, so this poster is not in the nav.

## Learning Objective

The learner will read the front of the Library of Celsus part by part: say which
parts are original design, which are copies or reconstruction, and what the
building was for, a public library built as a son's memorial and a tomb.

## Why This Poster

[Chapter 10](../../chapters/10-ephesus-greco-roman-city/index.md) teaches the
classical orders and the reading of inscriptions on Day 7, then uses the library
as the place to use both skills at once ("One square, and every skill of the day
is in use"). It is also the book's example of *library as public access* in the
Learning for All thread. A straight-on drawing with markers lets the reader find
the capitals, the niches, the statue bases, and the removed bronze letters on one
front, before standing in front of the real one. The Three Classical Orders
poster teaches the orders on a single column each; this poster shows them in use
on a building. See [The Three Classical Orders](../column-types/index.md).

## Layout Decision

**One straight-on view, call-out engine.** The idea asked for two layers
(before the earthquake and as reassembled). The chapter says only that the
building burned in the 3rd century CE, that an earthquake later brought down the
façade, and that it was re-erected in 1970 to 1978, so there is no detailed
"before" to draw. The picture shows the front as it stands now, with one marker
(8) for what was reassembled, and the "before" layer is dropped. Markers run from
the street, up the front, then to the hidden chamber and the neighboring gate.

| # | Marker | Chapter 10 section |
|---|---|---|
| 1 | Curetes Street and the square | Curetes Street; Hadrian; The Temple of Hadrian at Ephesus |
| 2 | Steps and statue bases | Inscription; The Library of Celsus |
| 3 | Podium and lower columns | The Library of Celsus ("The trick"); The Corinthian Order |
| 4 | Niches with statues | The Library of Celsus ("The statues") |
| 5 | Upper story and Corinthian capitals | Classical Orders; The Corinthian Order |
| 6 | Reading room doorway | The Library of Celsus; Learning for All |
| 7 | Burial chamber of Celsus | The Library of Celsus |
| 8 | What was reassembled | The Library of Celsus; Chapter 4, Restoration and Reconstruction |
| 9 | Gate of Mazaeus and Mithridates | The Library of Celsus ("The inscriptions") |

Marker positions in `data.json` are estimates from the positions stated in
`image-prompt.md`. They must be calibrated against the real image with
`main.html?edit=true`. Markers are at least 8 percentage points apart.

## Sources

All facts come from [Chapter 10](../../chapters/10-ephesus-greco-roman-city/index.md):
The Library of Celsus, Curetes Street, Hadrian, The Temple of Hadrian at Ephesus,
Inscription, Classical Orders, The Corinthian Order, and "Learning for All: A
Son's Gift of Books"; plus
[Chapter 4](../../chapters/04-byzantine-constantinople/index.md) for the
restoration versus reconstruction distinction.

## What the Chapter Does Not Say

The idea asked for several details that Chapter 10 does not give, so they are not
in `data.json`; see "To Verify Before Approval". Hadrian does not appear on the
facade: the chapter dates the library to around 110 CE and Hadrian's reign to
117 to 138 CE, so he appears only in marker 1, through the Temple of Hadrian on
Curetes Street.

## Tone Rules

1. **Mark reconstruction as reconstruction.** Marker 8 and marker 4 say what is a
   copy and what was put back, in the chapter's words.
2. **The 12,000 scrolls are a modern estimate**, not an ancient number. The
   marker says so.
3. **Corinthian "type".** The chapter says both stories have capitals "of the
   Corinthian type", and `data.json` repeats that.
4. **No ladder.** The library is not ranked above the Library at Alexandria or any
   other. The marker ends on the book's own question, who was still outside the
   door.

## Quiz

Ten questions are drafted here. The call-out engine builds its own quiz mode from
each marker's `hint`, and its `data.json` has no `quiz[]` field, so these are for
the author's review and for any companion page.

| # | Question | Answer | Explanation |
|---|---|---|---|
| 1 | Which order of capital stands on the front, in both stories, according to Chapter 10? | 5, upper story | Both stories have paired columns with capitals of the Corinthian type, the Roman favorite. |
| 2 | Who is buried beneath the reading room, and why is that unusual? | 7, burial chamber | Celsus lay in a marble sarcophagus; Romans did not normally bury the dead inside a city. |
| 3 | Which feature tells us who paid for the library's books and upkeep? | 2, steps and bases | The inscription records Aquila's 25,000 denarii, and the bases name Celsus in Greek and Latin. |
| 4 | Which feature shows four virtues, and what is true of the ones we see? | 4, niches | They are copies, and the originals went to Vienna. |
| 5 | Which marker shows work done in 1970 to 1978? | 8, reassembly | Austrian archaeologists re-erected the front from its fallen pieces. |
| 6 | Why does the front look taller and grander than its width? | 3, podium | Podium under the lower columns, and slightly larger columns and spaces near the center. |
| 7 | Which feature is the best example of "what was removed"? | 9, the gate | The holes are where bronze letters were once pinned. |
| 8 | About how many scrolls is the library said to have held, and how do we know? | 6, doorway | About 12,000, a modern estimate from the size and number of the niches. |
| 9 | Which street leads down to the library, and what is the footing like? | 1, Curetes Street | Marble-paved and polished smooth, so slippery when wet. |
| 10 | Which feature shows a gift of knowledge that reaches only as far as readers' means? | 6, doorway | A reader had to walk in and be able to read, and most people in Roman Ephesus probably could not. |

## Open Questions for the Author

1. **The "before" layer.** Drop it, as drafted, or add a note to Chapter 10 about
   how the façade fell, so a second layer is possible?
2. **Marker 8 position.** The prompt asks for a few paler blocks near the upper
   right corner as a visual device. Chapter 10 does not say which parts of the front
   are new, so move the marker, or drop the paler blocks, if the real image
   suggests a claim.
3. **Companion pages.** The lesson page should link
   [Doric, Ionic, or Corinthian?](../../sims/classical-orders-identifier/index.md),
   [One Walk, Seven Centuries](../../sims/ephesus-walk-timeline/index.md), and
   [Documented, Debated, or Tradition?](../../sims/ephesus-sites-evidence-judge/index.md).
   The first uses the same orders wording.

## To Verify Before Approval

- **The lower-story order.** Chapter 10 says both stories carry Corinthian-type
  capitals. The idea entry asked which order is on the lower story, and published
  descriptions of this façade differ. Check a source before approving question 1.
- **Doors, windows, roofline, and relief detail.** The chapter does not describe
  the entrance doors, the upper windows, or the pediment, so no marker names
  them and the prompt draws them generically.
- **Which parts of the front are original and which are new stone.** Not in the
  chapter.
- **The date of the earthquake** that brought down the façade. Not in the chapter.

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Drafted. Nine markers, estimated positions, to be calibrated with `?edit=true`. |
| `library-of-celsus.png` | Not generated. |
| `main.html`, `index.md`, `metadata.json` | Not created. The call-out library (`diagram.js`, `style.css`) is already installed in `docs/sims/shared-libs/`; the page loads it from `../../sims/shared-libs/`. |

## Next Steps

1. Author reviews the prompt and markers, resolves the lower-story question, and
   generates the image.
2. Install the call-out library, build the page, and calibrate the markers.
