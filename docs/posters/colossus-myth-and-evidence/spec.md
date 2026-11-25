---
title: "Spec: The Colossus, Popular Picture and Likely Truth"
description: Build spec for The Colossus interactive poster, with the two-panel layout, six tiles, sources, items to verify before approval, and open questions for the author.
---

# Spec: The Colossus, Popular Picture and Likely Truth

**Status:** spec and draft data only. No image has been generated, and there is
no `index.md` or `main.html` yet, so this poster is not in the nav.

## Learning Objective

The learner will separate what most people imagine about the Colossus of Rhodes
from what the book's evidence supports, and apply the *myth versus history* test
from Chapter 4 (find the earliest source and ask how long after the event it was
written) to three parts of the story: the pose, the place, and the end.

## Why This Poster

Chapter 4 teaches a habit for the whole trip: ask when a story first appeared,
and who wrote it. The Colossus is the cleanest case on the route. Nearly
everyone knows the picture of a giant straddling a harbor, and the book says it
almost certainly is not true. The poster puts the picture and the evidence side
by side so the habit can be seen working, and it is honest about the rest: the
evidence also leaves things open (the pose, the exact site), and the poster says
where. It is the poster for the *myth versus history* concept
([Chapter 4](../../chapters/04-byzantine-constantinople/index.md), *Myth Versus
History*).

## Layout Decision

[Poster Ideas](../poster-ideas.md) asked for two panels, "What most people
imagine" and "What the evidence supports". This spec keeps the **two panels**
(the left column and the right column of the image) and divides each into
**three tiles**, one under the other, so the same question is asked of both
versions at the same scale. A zone is one tile, as in the
[Oracle and Algorithm](../oracle-vs-algorithm/spec.md) poster, so six zones.

| Row | The question | Left tile: popular picture | Right tile: likely truth | Idea's topics covered |
|---|---|---|---|---|
| 1 | The figure | A giant astride the harbor entrance, ships beneath | A standing Helios, about 33 m, drawn as a pale reconstruction | pose, height, how built |
| 2 | The site | The harbor mouth, one foot on each side | The same harbor from above; the statue on land, in one of two possible places | location |
| 3 | The end | The bronze carried off on camels | The fallen pieces, and a visitor at the thumb | how it fell, what became of the bronze |

Tiles are 744 x 320 px, wide strips, which suit a harbor and a caravan better
than tall panels would. Row 2 is drawn from above, so the "too wide" argument
is a picture, not only a sentence.

## What Each Zone Says

| Zone | The point | Chapter sections |
|---|---|---|
| Popular: The Figure | The straddle is the picture people carry. Chapter 12 gives two reasons against it, and Chapter 1 says "almost certainly". Includes Chapter 4's test. | [12](../../chapters/12-rhodes/index.md): *The Colossus of Rhodes*. [1](../../chapters/01-long-timeline/index.md): Hellenistic Period. 4: *Myth Versus History*. |
| Likely: The Figure | Helios, about 33 m, by Chares of Lindos over about twelve years, paid for by the sold siege machines. The pose is not described, so the figure is a guess. | 12: *Helios*, *The Colossus of Rhodes*. |
| Popular: The Site | The popular story puts the feet at the Mandraki entrance. It was far too wide. Rhodes had several harbors. | 12: *The Colossus of Rhodes*, *Rhodes*. |
| Likely: The Site | More likely on land, near the harbor or in a sanctuary of Helios. No one knows. | 12: *The Colossus of Rhodes*, *Helios*, *Rhodes*. |
| Popular: The End | The camel story, from a Byzantine chronicle written centuries later. | 12: *The Colossus of Rhodes*. 4: *Myth Versus History*. |
| Likely: The End | An earthquake about 226 BCE, after about 54 years. Pliny saw the pieces. Nothing survives. | 12, 1, [10](../../chapters/10-ephesus-greco-roman-city/index.md) (Seven Wonders table). |

The draft facts are in `data.json`. Each fact is taken from those chapter
sections.

## Tone Rules

1. **Say clearly what is not known.** Every "likely" tile ends with a "where the
   evidence stops" fact. The right-hand figure is a reconstruction, drawn pale
   and soft-edged on purpose, so that the "truth" column does not look more
   certain than it is.
2. **Do not make the myth a joke.** The popular picture has a real history as
   an image, and Chapter 4 says myths tell us what later people believed or
   wanted. The popular tiles are drawn with the same care as the others.
3. **No claim the chapters do not make.** The idea entry says "no source
   describes the straddling pose". The chapters do not say that, so the data
   gives the reasons the chapters do give (the height and the width of the
   entrance). See below.
4. **Same scale and same camera** in each row, so differences come from the
   subject, not from the artist.
5. **No faith claims.** Helios is treated as the sun god of a Greek city,
   described as the book does. No modern religious symbols.

## Quiz

Nine questions are drafted in `data.json`, covering all six tiles, with two
tiles asked about twice. They ask about ideas (what rules the straddle out,
why a late chronicle is weak, why a myth is not worthless) and not about what
is drawn. One asks how the statue was paid for, which leads into the book's
story of the siege.

## To Verify Before Approval

The chapters do not give these, so none is in `data.json`.

1. **"No source describes the straddling pose."** This is the idea entry's claim.
   Chapter 12 gives different reasons: the height and the width of the harbor
   entrance. Check whether any ancient text describes the pose or the
   appearance of the statue before saying so.
2. **The famous engravings.** The chapter refers to "the famous engravings" but
   does not say who made them or when. A date would make the Chapter 4 test
   sharper (how long after the event?). Do not add one without a source.
3. **How it was built.** The chapters give the maker (Chares of Lindos), about
   twelve years, a finish of about 280 BCE, and how it was paid for. They give
   no method, no scaffolding, no base, and no foundation. The idea entry's
   scaffolding and stone base are **not** drawn in the prompt, except a plain
   low platform under the right-hand figure.
4. **How it fell.** The chapters give an earthquake about 226 BCE and an interval
   of about 54 years. Where the statue broke is not given, and the prompt does
   not say.
5. **Pliny and the chronicle.** The chapters do not date Pliny's visit or name
   the Byzantine chronicle or its author. They say only "hundreds of camels" and
   "written centuries later". The data does not add a number.
6. **The pose and crown.** The right-hand figure is standing, with rays around
   the head borrowed from Helios on Rhodian coins (the chapter's evidence for
   coins, not for the statue). Check how scholars reconstruct the figure before
   approval.
7. **Candidate sites.** The chapters name only "near the harbor" and "a sanctuary
   of Helios higher in the city". No other names or locations are in the data.

## Open Questions for the Author

1. **Two zones or six?** The poster could have just two zones, the left panel and
   the right panel. Six tiles answer the idea's list of topics one by one.
   Two would be simpler to build and weaker for the quiz.
2. **The ghost figure.** The prompt draws the right-hand statue as a pale,
   translucent bronze with soft edges, to mark it as a guess. Image models do
   not always honor this. If it comes out solid, we can accept it and let the
   text carry the caveat.
3. **Row 2 diagram.** A bird's-eye harbor with footprints and a translucent band is
   the riskiest tile for a text-to-image model. If it fails, the fallback is a
   plain aerial harbor in both tiles with the figure's footprint in a different
   place.
4. **Companion sims.** The lesson page should link
   [Source, Myth, or Contested?](../../sims/source-myth-or-contested/index.md),
   [Mind the Gap: How Old Is the Evidence?](../../sims/troy-gallipoli-evidence-gap/index.md),
   and [Who Built What We See in the Old Town?](../../sims/rhodes-old-town-layers-sorter/index.md).
5. **Canvas.** If your image tool can produce 1792 x 1024, the tiles would be
   wider (about 872 px). If you switch, tell me and I will recompute the zones
   and the prompt.

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Draft. Six zones, nine quiz questions. Zone rectangles are computed from the layout in the prompt (16 px margin and gap, tiles of 744 x 320 px, minus 2 px at the side edges) and must be re-measured against the generated image. |
| `colossus-myth-and-evidence.png` | Not generated. |
| `main.html`, `colossus-myth-and-evidence.js`, `index.md`, `metadata.json` | Not created. Copy them from the Oracle and Algorithm poster once the image exists. |

## Next Steps

1. Author reviews the spec and the prompt and decides the open questions.
2. Author generates the image and saves it as `colossus-myth-and-evidence.png`
   in this directory.
3. Re-measure the six tile edges and check that the chip labels fit on one line.
4. Resolve the "To verify" items, then build `index.md` with
   `status: scaffold`, then `built`. Only the author sets `approved`.
