---
title: "Spec: Roman Bath and Turkish Hamam"
description: Build spec for the Roman Bath and Turkish Hamam interactive poster, with the two-plan layout, the five matched stages, sources, items to verify, and open questions for the author.
---

# Spec: Roman Bath and Turkish Hamam

**Status:** spec and draft data only. No image has been generated, and there is
no `index.md` or `main.html` yet, so this poster is not in the nav.

## Learning Objective

The learner will compare the rooms of a Roman bath with the rooms of a Turkish
hamam, and for each of five stages state what the two share, where the match
breaks, and why the hamam is best described as adapted from the Roman and
Byzantine baths, not copied from them.

## Why This Poster

[Chapter 6](../../chapters/06-bazaars-scripts-presses/index.md) covers the bath
in two short sections, *Roman Bath Culture* and *The Turkish Bath*, and the
reader has to hold the Roman sequence in mind while reading the Turkish one. A
visitor may well book a hamam on Day 4, so this is also a practical poster: it
shows what the rooms are, what is worn, and what happens on the heated stone.
Two plans on the same footprint, one above the other, let the eye run down a
column and see the pair at once. The modest claim the chapter makes, "descended
from the Roman and Byzantine baths but adapted", is the thread of every zone.

## Layout Decision

The first sketch in [Poster Ideas](../poster-ideas.md) allowed "two cutaway
panels stacked or side by side". This spec uses **two stacked floor plans**
(Roman above, hamam below), each a wide strip with the roof removed, with the
rooms in the order a bather walks through them, left to right. Stacked strips
make the five columns line up, so a zone is **one column through both plans**
and one hover compares the pair. This is the same idea as the diptych tiles in
[Oracle and Algorithm](../oracle-vs-algorithm/spec.md), turned on its side.
Image generators keep two wide strips aligned far better than two squarish
plans.

| Column | Roman bath | Hamam | Zone id |
|---|---|---|---|
| 1 | Changing room, with a garden court beside it | Cool domed hall, first half | `changing` |
| 2 | Cold room (*frigidarium*) | Cool domed hall, second half | `cold` |
| 3 | Warm room (*tepidarium*) | Warm room | `warm` |
| 4 | Hot room (*caldarium*) | Hot steam room with the *göbek taşı* | `hot` |
| 5 | Furnace, with the *hypocaust* shown under the floors | Furnace area (generic) | `heat` |

The hamam has **three** main rooms in the chapter and the Roman bath has four,
so in the lower plan the cool hall is drawn as one wide room across columns 1
and 2, with no wall between them. That is deliberate: it shows the first place
where the parallel breaks. The poster says so in the `changing` and `cold`
zones.

## Sources and Where Each Zone Comes From

All facts in `data.json` are from these sections of the book.

| Zone | Chapter sections |
|---|---|
| Changing Room | [6](../../chapters/06-bazaars-scripts-presses/index.md): *Roman Bath Culture*, *The Turkish Bath* (and its Glaux tip, "A Hamam Before Boarding"). |
| Cold Room | 6: *Roman Bath Culture*, *The Turkish Bath*. [4](../../chapters/04-byzantine-constantinople/index.md) for the Hippodrome stop on Day 2. |
| Warm Room | 6: both sections. [5](../../chapters/05-ottoman-istanbul/index.md): *The Külliye Mosque Complex*, the bath's fee. [12](../../chapters/12-rhodes/index.md): *Ottoman Rhodes*, the 16th-century bath. |
| Hot Room | 6: *The Turkish Bath* (göbek taşı, kese, foam). *Roman Bath Culture* (caldarium, hypocaust). |
| Heat Source | 6: *Roman Bath Culture*, *The Turkish Bath*. 5: *The Külliye Mosque Complex*, the complex's public bath (Day 3). |

Companion sims that exist: [What Did the Külliye Do?](../../sims/suleymaniye-kulliye-sorter/index.md)
(its "public bath" card makes the point that a bath was a source of income),
and [Read the Ruin - Which Layer?](../../sims/read-the-ruin-layers/index.md)
for the ruins we walk at Ephesus.

## Tone Rules

1. **Keep the continuity claim modest.** Say "descended from" and "adapted to",
   as the chapter does. Never "the hamam is a Roman bath" and never "a direct
   copy". No zone says which people invented which room.
2. **Say where each pair breaks.** Every zone has a "Where the parallel breaks"
   fact or a fact that makes the break plain: three rooms against four, a
   shared pool against flowing water, a hypocaust against a heated stone.
3. **Everyone is covered.** Bathers in both plans wear a wrap, a towel, or a
   short tunic. No nudity. Drawn from above they are small, simplified, and
   dignified.
4. **Bathing is ordinary and respectful.** The hamam is a living practice and a
   place visitors can go. Etiquette appears as practical facts only (the cloth,
   the locker, the booking), with no gender jokes and no orientalizing.
5. **No ladder.** The Roman plan is not the "early version" of the hamam. They
   are two designs for related habits.

## Quiz

Nine questions are drafted in `data.json`, covering all five stages. They ask
about ideas and features (which room matches the caldarium, which stage had the
hypocaust, why the hamam is "adapted") and not about what is drawn. Two of
them (the cold room, the "adapted" idea) depend on understanding where the
parallel breaks, not on matching names.

## To Verify Before Approval

The chapter does not give these, so none of them are in `data.json`.

1. **How a hamam is heated.** The chapter names the heated *göbek taşı* but does
   not describe a furnace, flues, or an underfloor system for a hamam. The
   image shows a generic furnace area in column 5, which may overstate a link
   to the Roman system. Check a source on Ottoman hamam heating before
   approval, or redraw column 5 with only a service room.
2. **Turkish room names.** The usual Turkish names for the three rooms (the
   cool hall, the warm room, the hot room) are not in the chapter. Add them only
   after checking a source.
3. **A cold plunge pool in the Roman cold room.** The chapter only says that
   Islamic ideas of cleanliness prefer flowing water to "sitting in a shared
   pool". The prompt draws a pool in the Roman cold room to match that line.
   Confirm that a pool in the *frigidarium* is a fair picture.
4. **What the warm room was for.** In both baths, the chapter names the warm
   room but gives it no job of its own, and it does not say in which room the
   scrubbing and soaping took place. The prompt puts that scene in the hot
   room, around the stone. Check where it happened.
5. **The Roman changing room's Latin name** (*apodyterium*) and whether the
   garden court beside it matches the chapter's "exercise courts, gardens".
6. **Dates and sizes** for the Baths of Zeuxippus beyond what the chapter gives
   (beside the Hippodrome, decorated by Constantine, burned in 532), and which
   hamams by Sinan are open. The poster gives none of them.

## Open Questions for the Author

1. **Two zones per column?** One zone per column compares the pair on one
   hover. If you want the Roman and the hamam halves clickable on their own,
   split each column at the gap between the plans (ten zones). The facts would
   need to be split too, and chip labels like "Roman: Hot Room" fit in 300 px.
2. **How much of the Roman bath?** The chapter mentions exercise courts,
   gardens, libraries, and snack sellers. The prompt shows a garden court and a
   snack stall in column 1 only, to keep the footprints equal. Add a library
   and a courtyard if you want the Roman plan to look larger than the hamam's.
3. **Which hamam?** The poster draws a generic hamam. The chapter says two
   historic hamams by Sinan are open to visitors. If you visited one, a plan of
   that bath would be more personal, but then the poster is about one building.
4. **Canvas.** If your image tool can produce 1792 x 1024, the columns would be
   about 350 px wide and the figures larger. If you switch, tell me and I will
   recompute the zones and the prompt.

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Draft. Five zones, nine quiz questions. Zone rectangles are computed from the layout in the prompt (16 px margin, 16 px gap, five columns of 300.8 px each, minus 2 px at each wall) and must be re-measured against the generated image. |
| `bath-and-hamam.png` | Not generated. |
| `main.html`, `bath-and-hamam.js`, `index.md`, `metadata.json` | Not created. Copy them from the Oracle and Algorithm poster once the image exists. |

## Next Steps

1. Author reviews the spec and the prompt and decides the open questions.
2. Author generates the image and saves it as `bath-and-hamam.png` in this
   directory.
3. Re-measure the five column edges against the real image and update
   `data.json`. Check the chip labels fit on one line.
4. Resolve the "To verify" items, then build `index.md` with
   `status: scaffold`, then `built`. Only the author sets `approved`.
