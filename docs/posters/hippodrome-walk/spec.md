---
title: "Spec: Walk Down the Hippodrome"
description: Build spec for the Walk Down the Hippodrome call-out poster, with the marker table, sources, items to verify, and open questions for the author.
---

# Spec: Walk Down the Hippodrome

**Status:** built (2026-11-25). The image is generated, the marker positions are calibrated
to it, and the page is in the nav at [Walk Down the Hippodrome](index.md). It is `built`, not
`approved`: the author approves it after trying the controls.

## Learning Objective

The learner will read the three monuments on the Hippodrome's old track line as
three borrowed layers, and for each one state where it came from, who set it up
here, and which way of adding a layer it shows: built over, reused, converted,
or removed.

## Why This Poster

[Chapter 4](../../chapters/04-byzantine-constantinople/index.md) spends a
worked example reading Sultanahmet Square layer by layer, and then a MicroSim
asks readers to place each layer in its era. A single annotated view keeps the
whole row in sight at once: an Egyptian obelisk raised by a Roman emperor in
390 CE, a Greek victory monument carried from Delphi, and a rough tower that a
Byzantine emperor sheathed in bronze and Crusaders stripped in 1204. That is
*spolia* made visible, and it is the first thing the group sees on Day 2. The
Serpent Column's second end is at Delphi on Day 12, so the poster also closes a
loop that [Chapter 18](../../chapters/18-delphi/index.md) opens.

## Layout Decision

**Call-out engine, one wide elevation.** The picture is one flat side view of
the square, with the three monuments standing clear of each other along the
track line, so each can carry a numbered marker without crossing the others.
The fountain and the Blue Mosque are included for context, and the pit gets its
own marker because it shows a layer literally. The poster does not retell the
Serpent Column's two ends; the
[Two Ends of the Serpent Column](../../sims/serpent-column-two-ends/index.md)
MicroSim does that, and the Serpent Column marker's tip points to it.

The engine is `layout: "side-panel"`, `orientation: "landscape"`,
`showNumbers: true`. Marker positions in `data.json` are **estimates** taken
from the positions stated in `image-prompt.md`. They must be calibrated with
`?edit=true` once the image exists.

## The Eight Markers

| # | Marker | Source section | Day |
|---|---|---|---|
| 1 | The long square: track, Hippodrome, Blues and Greens, Nika Riots | Chapter 4: "The Hippodrome", "The Nika Riots", worked example "standing in the Hippodrome"; "Following four horses" | 2 |
| 2 | German Fountain, 1900 | Chapter 4: layer table in "Layers of a City" and the MicroSim card list | 2 |
| 3 | Obelisk of Thutmose III | Chapter 4: worked example, "Spolia" | 2 |
| 4 | The marble base carved with Theodosius I | Chapter 4: worked example | 2 |
| 5 | Serpent Column | Chapter 4: worked example, "Spolia"; Chapter 18: "The Serpent Column" | 2, 12 |
| 6 | The pit | Chapter 4: worked example; Chapter 18: "The Serpent Column" | 2 |
| 7 | Walled Obelisk | Chapter 4: worked example, table of layers | 2 |
| 8 | Blue Mosque | Chapter 4: worked example; [Chapter 5](../../chapters/05-ottoman-istanbul/index.md): "The Blue Mosque" | 2, 3 |

The order is the order a visitor reads the square: the whole shape first, then
the row from the north end to the south, then the mosque beside it. Justinian
and the Nika Riots live in marker 1, because they explain why the square is
still a shape on the map.

## Tone Rules

1. **Spell out which layer, and why.** Each monument marker names the layer by
   when it *arrived*, not when it was made. The trap statement from Chapter 4
   is in marker 3's tip.
2. **Contested items go in a tip.** The 30,000 death toll is one writer's count;
   who should keep the four bronze horses is opinion. Neither is stated as
   plain fact.
3. **The Blue Mosque is a working mosque.** It is drawn with respect and no
   figures on the roofs. Its tip points readers to Chapter 5 for etiquette.
4. **No ladder, no villains.** The Crusaders' removal and the Venetians' taking
   of the horses are stated as events; the poster does not rank eras.
5. **No photo-realism, no lettering.** The obelisk's faint carving is drawn as
   squiggles, not hieroglyphs.

## Quiz

The call-out engine's built-in quiz mode asks "Click on: <label>" using the
labels and the `hint` text. A written question bank is also drafted here for the
lesson page or a later extension. Each marker is the answer to at least one.

| # | Question | Answer marker |
|---|---|---|
| 1 | Which monument was first set up at Delphi? | 5 |
| 2 | Which monument was carved in Egypt about 1450 BCE but is a Byzantine layer here? | 3 |
| 3 | Which monument shows a layer of removal, where gilded plates were melted down in 1204? | 7 |
| 4 | Why does the Serpent Column stand below the level of the surrounding ground? | 6 |
| 5 | Which marker shows the oldest layer, the outline of the Roman racetrack? | 1 |
| 6 | Which part of the square is its newest layer, a gift from 1900? | 2 |
| 7 | Where does a reused monument carry the face of the emperor who raised it? | 4 |
| 8 | Which building stands on part of the site of the Byzantine Great Palace? | 8 |
| 9 | Where did the Nika Riots of 532 begin, and where were the rioters trapped? | 1 |

Explanations for each, from the same chapter sections, go in the lesson page.

## To Verify Before Approval

These details are in the idea entry or the image prompt but **not** in the
chapters, so they are not in `data.json`.

1. **Order and spacing of the row.** Chapter 4 lists the obelisk, the Serpent
   Column, and the Walled Obelisk in that order but does not say they are
   arranged north to south, or how far apart. The image prompt draws them that
   way, with the fountain at the north end and the Blue Mosque on the east side.
2. **Relative heights.** The prompt makes the Walled Obelisk tallest and the
   Serpent Column about a third of the Egyptian obelisk. The chapters give no
   heights or pit depth.
3. **The carved base.** Chapter 4 says only that the base is carved with
   Theodosius's portrait. The prompt draws one simplified crowned figure; the
   real carving's scenes are not in the book.
4. **Stone colors and the bare holes.** The obelisk's color and the pattern of
   fixing holes on the Walled Obelisk are illustrative.
5. **Where the horses and the kathisma stood.** The chapter says the horses
   stood "probably above the starting gates" and the kathisma joined the Great
   Palace. Neither is drawn, because the chapters give no position.

## Open Questions for the Author

1. **A ninth marker for the empty place of the horses?** It would carry the
   1204 taking to Venice, but nothing in the picture marks where they stood.
   Currently the story is in marker 1's tip.
2. **Add Hagia Sophia in the background?** It stands to the north in reality, so
   it would sit left of the fountain and crowd marker 2.
3. **Companion links.** The lesson page should link
   [Two Ends of the Serpent Column](../../sims/serpent-column-two-ends/index.md)
   and [Read the Ruin - Which Layer?](../../sims/read-the-ruin-layers/index.md),
   and Chapter 18's Delphi section for the other end of the column.

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Draft: 8 call-outs, estimated positions from the prompt. Calibrate with `?edit=true` after the image exists. |
| `hippodrome-walk.png` | Not generated. |
| `main.html`, `index.md`, `metadata.json` | Not created. |
| Call-out library | Installed: `diagram.js` and `style.css` are in `docs/sims/shared-libs/`. The page loads them from `../../sims/shared-libs/`. |

## Next Steps

1. Author reviews this spec and `image-prompt.md`, and answers the open
   questions.
2. Author generates the image and saves it as `hippodrome-walk.png`.
3. Install the call-out library, build `main.html` and `index.md` (born
   `scaffold`), calibrate marker positions with `?edit=true`, and run
   `mkdocs build --strict`.
