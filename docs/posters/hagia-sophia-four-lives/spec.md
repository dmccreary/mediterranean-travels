---
title: "Spec: Hagia Sophia, One Building, Four Lives"
description: Build spec for the Hagia Sophia interactive poster, with the panel layout, the four lives and the shared-structure zone, sources, a neutral contested-history note, and open questions for the author.
---

# Spec: Hagia Sophia, One Building, Four Lives

**Status:** built (2026-11-25). The image is generated, the zones are calibrated
to it, and the page is in the nav at [Hagia Sophia: One Building, Four Lives](index.md). It is `built`, not
`approved`: the author approves it after trying the controls.

## Learning Objective

The learner will name the four lives of Hagia Sophia (cathedral, mosque,
museum, mosque again), state for each one what was added, covered, or
uncovered, and say which parts of the structure stayed through all four.

## Why This Poster

Hagia Sophia is the clearest "city of layers" subject on the route, and
[Chapter 4](../../chapters/04-byzantine-constantinople/index.md) already gives
its four lives in a single table. The facts are spread over six sections, and
the chapter's own advice is to read the building as a document with many
authors. One picture that holds the room fixed and changes only what was put
into it or taken out of it lets a reader see each author's hand. It is also a
living religious site and a contested one, so the poster needs a place where the
dates (which are agreed) are kept apart from their meaning (which is not).

## Layout Decision

**Four interior tiles in a 2 × 2 block, plus one tall cross-section panel at the
right.** The idea entry in [Poster Ideas](../poster-ideas.md) calls for the same
interior view drawn four times, with an optional fifth zone for what never
changed. A fifth zone cannot be a rectangle on top of the four tiles, so the
fifth zone gets its own panel. The panel is a vertical cross-section of the
dome, pendentives, and ring of windows, which a tall shape fits better than
another interior view would.

| Column 1 | Column 2 | Column 3 (tall) |
|---|---|---|
| **1. Cathedral**, 537 to 1453 | **2. Mosque**, 1453 to 1934 | **5. What Stayed** |
| **3. Museum**, 1935 to 2020 | **4. Mosque Again**, 2020 to today | (spans both rows) |

All four tiles share one camera position, from the nave floor looking east. The
prompt asks the image tool to draw the architecture once and change only the
furnishing layer, because tools do not hold a room fixed across four tiles
reliably. If the tiles drift, the zones still work. A zone is one whole tile.

## What Each Zone Says

| Zone | What was added | What was covered | What was revealed | Chapter 4 sections |
|---|---|---|---|---|
| 1. Cathedral | Gold mosaics with figures after 843; Komnenos panel (about 1122); Deesis (about 1261) | Nothing yet | Justinian's dome, rebuilt 562 | Hagia Sophia; The Hagia Sophia Dome; Byzantine Mosaics; The Fourth Crusade |
| 2. Mosque | Mihrab, minbar, minarets, fountain (1740), roundels (about 1850) | Figural mosaics, gradually, under plaster | Some mosaics, briefly, by the Fossati brothers (1847 to 1849) | Hagia Sophia; Restoration and Reconstruction; Byzantine Mosaics |
| 3. Museum | Restoration work | Nothing new | The plastered mosaics, from the 1930s | Contested History; Mosaic; Byzantine Mosaics |
| 4. Mosque Again | Carpets on the ground floor | Some images, by curtains or lighting during prayers | Nothing new | Hagia Sophia; Dress at Sacred Sites |
| 5. What Stayed | Buttresses, over the centuries | Nothing | The 562 dome on its pendentives | The Hagia Sophia Dome |

The draft facts are in `data.json`. Each fact is taken from those chapter
sections, so the poster repeats what the book already says.

## Contested History: A Labeled Note

The chapter's own words for this are: the dates are agreed, the meaning is not.
Following that, the zone summaries and facts state only dates and physical
changes. The two zones where a decision changed the building's status, Museum
(1934) and Mosque Again (2020), each carry one fact that begins "Contested
history note:". It gives the readings that the chapter gives and no others. The
chapter gives readings for 2020 and a single reading of 1934. It gives none for
1453, so the Mosque zone has no such note (see the open questions). Quiz
questions on these decisions ask for the dates and the physical consequences,
and never ask the learner to say which reading is right.

## Tone Rules

1. **Living faiths.** Hagia Sophia is a working mosque and a church that
   Orthodox Christians call their mother church. People in the image are small
   and seen from behind, and no face is drawn in detail. No scene shows prayer
   in close view.
2. **No ladder and no verdict.** The four lives are in date order, but the
   poster never ranks them or says which is the building's true purpose.
3. **Neutral verbs.** The chapter's verbs are used as written: "made a mosque",
   "made a museum", "returned to use as a mosque". The poster does not use
   "converted back", "restored", or "reclaimed", because each of them carries
   a side.
4. **Honest about 537.** The cathedral tile shows the later Byzantine state,
   with figural mosaics. Justinian's own mosaics had only crosses and
   patterns, and a fact in the zone says so.
5. **No calligraphy in the image.** The roundels are drawn as abstract flourishes
   on discs, because the image tool will garble real lettering.

## Quiz

Ten questions are drafted in `data.json`, two per zone. They ask about ideas and
features (what a mihrab and minbar mark, what a cabinet decision changed, how a
pendentive works), not about which tile is drawn where. Every zone is the answer
to two questions.

## To Verify Before Approval

These are not in the chapters, so none of them is in `data.json`.

1. **The mihrab and minbar.** The chapter lists them as signs of the mosque life
   but gives no dates, no builders, and no position. The image shows a prayer
   niche in the apse and a stepped pulpit beside it, which is the usual
   arrangement and needs a source.
2. **The museum years, floor and roundels.** The chapter does not say whether
   the floor was bare or carpeted between 1935 and 2020, or whether the roundels
   stayed on the piers. The image shows bare marble and roundels in place.
3. **The 2020 changes in detail.** The chapter says "curtains or lighting over
   some images during prayers". It does not say which images or how. The image
   shows one pale curtain over the apse mosaic, which is an illustration, not a
   claim.
4. **The scaffold in Tile 3.** The chapter mentions "restoration work" for the
   museum life but not scaffolding. If the author prefers, the tile can drop
   the scaffold.
5. **Readings of 1453.** The chapter lists the 1453 conversion as contested but
   gives no readings of it.

## Open Questions for the Author

1. **Worshippers in Tiles 2 and 4.** The prompt puts a few small figures, seen
   from behind and far away, in the mosque tiles. If you would rather show no
   people in a prayer space, say so, and the prompt will use an empty carpeted
   floor in both.
2. **Which cathedral?** The tile shows the building after 867, with the Virgin
   and Child in the apse, so it matches what visitors see in the galleries. The
   alternative is Justinian's 537 state, with gold, crosses, and no figures.
3. **The 1453 note.** Add a "contested history" note to the Mosque zone only if
   the chapter gains readings of 1453.
4. **Chip for the fourth life.** "Mosque Again" fits on one line and avoids
   "restored". An alternative is "Mosque Today".
5. **Companion sims.** The lesson page should link
   [Read the Ruin - Which Layer?](../../sims/read-the-ruin-layers/index.md),
   [Place the Site in Its Era](../../sims/place-the-site-in-its-era/index.md),
   [Source, Myth, or Contested?](../../sims/source-myth-or-contested/index.md),
   and [From the Schism to the Sack, 1054–1261](../../sims/schism-to-sack-timeline/index.md).

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Drafted. Five zones and ten questions. The rectangles are computed from the layout in the prompt and need re-measuring against the real image. |
| `hagia-sophia-four-lives.png` | Not generated. |
| `main.html`, `hagia-sophia-four-lives.js`, `index.md`, `metadata.json` | Not created. |

## Next Steps

1. Author reviews the prompt and the open questions, and generates the image.
2. Re-measure the five rectangles with `main.html?edit=true` once the image
   exists.
3. Create `index.md` with `status: scaffold`, then `built`. Only the author sets
   `approved`.
