---
title: "Spec: The Acropolis, Then and Now"
description: Build spec for the Acropolis interactive poster, with the two-panel layout, the five monuments used in both panels, sources, items to verify, and open questions for the author.
---

# Spec: The Acropolis, Then and Now

**Status:** built (2026-11-25). The image is generated, the zones are calibrated
to it, and the page is in the nav at [The Acropolis, Then and Now](index.md). It is `built`, not
`approved`: the author approves it after trying the controls.

## Learning Objective

The learner will compare the Acropolis of about 406 BCE with the rock a visitor
climbs today, and for each of five monuments (the path and gateway, the temple
of Athena Nike, the Parthenon, the Erechtheion, and the open-air statue) name
what has been lost, rebuilt, replaced, or removed on purpose.

## Why This Poster

Nearly everyone on the trip stands on the rock on
[Day 10](../../chapters/15-athens-acropolis/index.md), and orientation is
practical: the gateway, the small temple on its bastion, the Parthenon, and the
Erechtheion are met in that order, and the chapter ties each step to a different
century. One aerial view drawn twice lets a reader hold the whole building
program in mind and see the later layers (an explosion in 1687, a clearing in
the 1830s, restoration since 1975) as changes to the same rock. The chapter's
reading-a-ruin questions from Chapter 4 ("Added? Taken away? Restored, and what
did they choose to show?") are the questions the picture asks.

## Layout Decision

**Two tall panels side by side, one zone per panel.** The idea entry in
[Poster Ideas](../poster-ideas.md) also asks for "a matching set of call-outs
inside each panel": the gateway, the small temple, the Parthenon, the
Erechtheion, and the path up. I did **not** build ten small zones, one per
monument per panel, for three reasons.

1. An image tool will not place monuments reliably enough for ten small
   rectangles, and the zones would be re-measured against the picture anyway.
2. Small zones overlap a great deal in an aerial view. The Parthenon alone
   crosses several of the others.
3. The comparison the poster exists for is between the two panels. Two big
   zones, with the five monuments in the same order inside each zone's facts,
   keep that comparison on the screen.

To keep the call-outs available later, the prompt fixes the position of each of
the five monuments, as a percentage of the panel, and asks for the same position
in both panels (see `image-prompt.md`). If the author wants numbered markers, a
second poster on the call-out engine, with one picture and five markers, can reuse
the same image without a new prompt.

The camera is also a change from the idea entry. The entry says "from the
northwest". The prompt asks for a view from the west, a little north of west,
because that is the direction a visitor climbs from, so the gateway, the small
temple on the bastion to its right, and the Parthenon ahead and to the right all
appear in the order the chapter describes.

| Left panel | Right panel |
|---|---|
| **1. Late 5th Century BCE**: the rock rebuilt, with its parts painted and bronze | **2. Today**: a restored ruin with visitors, a gap in the Parthenon, and the later layers cleared |

## What Each Zone Says

Both zones present the five monuments in the same order, so a reader can read
one monument across both zones.

| Monument | Then, about 406 BCE | Today | Chapter 15 sections |
|---|---|---|---|
| Path and gateway | The west slope, the Panathenaic procession, the Propylaea built 437 to 432 BCE and left unfinished | Odeon of Herodes Atticus, Beulé Gate, ceiling beams reset, the tower removed in 1874 | The Acropolis; The Propylaea |
| Temple of Athena Nike | Small Ionic temple, 427 to 424 BCE, wingless Victory | Dismantled in 1686, rebuilt in the 1830s, 1930s, and early 2000s | The Temple of Athena Nike |
| The Parthenon | Complete, painted sculpture, gold-and-ivory Athena | No roof, middle of both sides gone in 1687, new marble among the old | The Parthenon; The Parthenon Sculptures; The Parthenon as Church and Mosque |
| The Erechtheion | New, about 421 to 406 BCE, gathering the old cults | Caryatids replaced by copies in 1979 | The Erechtheion; The Caryatids |
| The open-air statue | Bronze Athena Promachos | An empty base; the statue is known only from descriptions | Phidias |

The draft facts are in `data.json`. Each fact is taken from those chapter
sections, so the poster repeats what the book already says.

## Tone Rules

1. **Mark the reconstruction.** The left panel is a reconstruction, and its zone
   says so in a fact that begins "Where the picture breaks down". Color is
   limited to muted accents on the sculpted parts, because the chapter says only
   that the sculpture was painted and that faint traces remain.
2. **No ladder and no decline.** The right panel is not a fallen version of the
   left. The chapter's point is that the bare classical rock we admire is itself
   a 19th-century choice, and the zone says so.
3. **Neutral on the Marbles.** The Today zone says where the Caryatids and the
   sculpture are (Athens, London, and elsewhere) and takes no side. The
   argument belongs to [Agreed Fact or Position?](../../sims/parthenon-marbles-fact-or-position/index.md).
4. **No regret, no triumph.** The Parthenon was a church and a mosque. The
   Today panel shows no minaret or tower, because they were cleared from 1835,
   and the zone's fact "what was erased" describes that choice without judging it.
5. **No brands or signs.** The flag is plain stripes, the guide's paddle is
   blank, and nothing on the rock carries lettering.

## Quiz

Ten questions are drafted in `data.json`, five per panel. They ask about ideas
(a procession bringing a robe, a cleared rock, a restoration method), not about
what is drawn on which side. The sample question in the idea entry ("Which
monument stands on the bastion at the right of the entrance?") has a monument
as its answer, so it does not fit a two-zone poster. It belongs on the call-out
version if one is built.

## To Verify Before Approval

These are not in the chapters, so none of them is in `data.json`.

1. **Colors on the sculpture.** The chapter says only that the sculpture was
   painted and that faint traces remain. The prompt's dusty blue and warm red
   are an illustrator's choice and must stay labeled as a reconstruction.
2. **Scaffolding and a crane on the Parthenon today.** The chapter says
   restoration continues but does not describe equipment on the rock. The
   picture's scaffold and crane are illustrations of that, and may not match
   the site in November 2026. The author can drop them.
3. **The aerial geometry.** The relative positions of the Erechtheion, the
   Parthenon, and the bastion, as drawn from the west, rest on common
   knowledge of the site, not on a chapter figure. Check them against a plan.
4. **Details of the statue.** The chapter gives the Promachos's material (bronze)
   and a spear tip visible from Cape Sounion. The pose, shield, and height in the
   image are not sourced.
5. **The 5th-century procession.** The chapter describes the Panathenaia
   procession but not how large it was, so the picture's size is an illustration.

## Open Questions for the Author

1. **Call-outs on top?** If you want the five monuments clickable, a call-out
   version can reuse the same image, as described under Layout Decision.
2. **Camera.** West-northwest (the prompt) or the idea's northwest.
3. **A third panel?** The chapter's Parthenon had a church and mosque life
   between the two views (see The Parthenon's Five Lives). A third panel for
   about 1674, before the explosion, would show the mosque and minaret, but it
   would make three panels of 480 px.
4. **Companion sims.** The lesson page should link
   [The Parthenon's Five Lives](../../sims/parthenon-five-lives-timeline/index.md),
   [Agreed Fact or Position?](../../sims/parthenon-marbles-fact-or-position/index.md),
   [Doric, Ionic, or Corinthian?](../../sims/classical-orders-identifier/index.md),
   and [Xerxes' Road to Salamis](../../sims/persian-wars-campaign-map/index.md).

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Drafted. Two zones and ten questions. The rectangles are computed from the layout in the prompt (16 px margin and gap) and need re-measuring against the real image. |
| `acropolis-then-and-now.png` | Not generated. |
| `main.html`, `acropolis-then-and-now.js`, `index.md`, `metadata.json` | Not created. |

## Next Steps

1. Author reviews the prompt and the open questions, and generates the image.
2. Re-measure the two rectangles with `main.html?edit=true` once the image
   exists.
3. Create `index.md` with `status: scaffold`, then `built`. Only the author sets
   `approved`.
