---
title: "Spec: A Trireme at Salamis"
description: Build spec for the A Trireme at Salamis call-out poster, with the marker table, sources, items to verify, and open questions for the author.
---

# Spec: A Trireme at Salamis

**Status:** spec and draft data only. No image has been generated, and there is
no `index.md` or `main.html` yet, so this poster is not in the nav.

## Learning Objective

The learner will explain how the Athenian trireme linked a sea victory to a
change in who held power, by naming what the ship was made of, who rowed it,
and how Athens's fleet gave the poorest citizens a claim on the city.

## Why This Poster

[Chapter 15](../../chapters/15-athens-acropolis/index.md) gives the trireme in
three numbers and the battle in five moves, and ends the worked example with a
promise: about 30,000 oarsmen, "a fact whose consequences for democracy Chapter
16 follows." [Chapter 16](../../chapters/16-athens-agora-democracy/index.md)
keeps the promise in the next chapter, in the worked example "why the
rowers had a vote that counted." A single cutaway puts the ship, the crew, the
silver, and the narrows in one picture, so the reader sees the whole chain: the
silver bought the ships, the ships needed the poor, and the poor gained power.
The chapters support leading with that link, so marker 1 is the oarsmen and
tells the democracy story first.

## Layout Decision

**Call-out engine, one cutaway in a scene.** The hero is a large trireme in side
view with the hull cut away in the middle, so three ranks of oarsmen, the
oar openings, the deck, and the ram all show on one ship. Behind it, small and
hazy, are the Athenian line on the left, the Persian ships crowded in the
narrows in the middle, and Xerxes' seat on the mountain on the right. That
keeps the battle in view without a second panel.

The engine is `layout: "side-panel"`, `orientation: "landscape"`,
`showNumbers: true`. Marker positions in `data.json` are **estimates** taken
from the positions stated in `image-prompt.md`. They must be calibrated with
`?edit=true` once the image exists.

## The Eight Markers

| # | Marker | Source section | Day |
|---|---|---|---|
| 1 | The Oarsmen: who rowed, and what it did for democracy | Chapter 16: worked example "why the rowers had a vote that counted", "Who democracy left out"; Chapter 15: "Themistocles", worked example "a war play in the war's own city" | 11 |
| 2 | Three Levels of Oars: size and crew | Chapter 15: worked example "what the silver bought"; "Piraeus" | 10 |
| 3 | Bronze Ram | Chapter 15: "what the silver bought"; "The Battle of Salamis"; Part Two map table | 10 |
| 4 | Officers and Marines | Chapter 15: "what the silver bought", Part Two table, "Themistocles"; Chapter 16: the list of institutions | 11 |
| 5 | Silver Behind the Fleet | Chapter 15: "Themistocles"; Chapter 16: "Who democracy left out", ostraka of Themistocles | 11 |
| 6 | The Athenian Fleet | Chapter 15: "what the silver bought", "The Persian Wars", "The Battle of Salamis"; [Chapter 17](../../chapters/17-oracle/index.md): "The Wooden Walls Prophecy" | 10, 12 |
| 7 | The Narrows | Chapter 15: "The Battle of Salamis" | 10 |
| 8 | Xerxes' Seat | Chapter 15: "The Battle of Salamis", "a war play in the war's own city" | 10 |

The order follows the chain: crew, ship, weapon, command, money, then the
fleet and the battle. The Oracle thread appears once, in marker 6, where
Themistocles' reading of the wooden wall is mentioned and sent to Chapter 17.

## Tone Rules

1. **Lead with the link, then say where it stops.** Marker 1's tip names who
   democracy left out: women, metics, and enslaved people, and the enslaved
   miners who dug the silver. The poster does not say the rowers made Athens a
   fair city.
2. **Fair to the Persians.** The Persian ships are drawn as capable ships caught
   in a bad place, and marker 8 uses the chapter's own point that Athenians
   watched their victory as the enemy's tragedy. Marker 7's tip asks which shore
   Herodotus stood on.
3. **No blood, wounds, or bodies.** The scene is the start of the battle.
4. **No invented detail.** The chapters give three numbers for the ship. The
   image shows more (deck, steering oars, benches), but `data.json` states none
   of it.
5. **No ladder.** The poster does not frame Athenian democracy as the goal
   toward which history was heading.

## Quiz

The call-out engine's built-in quiz mode asks "Click on: <label>" from the
`hint` text. A written question bank is drafted here for the lesson page or a
later extension. Each marker answers at least one.

| # | Question | Answer marker |
|---|---|---|
| 1 | Which part of the fleet gave poor citizens a claim on power in Athens? | 1 |
| 2 | Which part of the ship did the actual damage in a fight? | 3 |
| 3 | Where were the roughly 170 rowers of a ship seated, in how many levels? | 2 |
| 4 | Who paid for the fleet, and where did the money come from? | 5 |
| 5 | Which part of the picture shows Athens providing almost half of the Greek ships? | 6 |
| 6 | Why did the Persians' larger numbers not help them at Salamis? | 7 |
| 7 | Who watched the battle from the shore, and what did Athens later make of his defeat? | 8 |
| 8 | Which office stayed elected while most others were chosen by lot, and why? | 4 |
| 9 | Which marker shows the weapon that decided the battle in the narrows? | 3 |

## To Verify Before Approval

These details are in the idea entry or the image prompt but **not** in the
chapters, so they are not in `data.json`. The chapters do give the three levels
of rowers, the ram at the bow at the waterline, and the crew of about 170
rowers and about 30 others, so those stay.

1. **How the three levels were arranged and named.** The prompt draws staggered
   ranks stacked diagonally with a row of oar openings per level. The chapters
   say only "three levels."
2. **Steering oars, the deck's shape, and crew by role.** The idea lists steering
   oars and "crew by role." Chapter 15 gives only "officers, deckhands, and
   marines." There is no steering-oar marker; add one only after a source is
   named.
3. **Whether anyone but citizens rowed.** The chapters say "many of them from the
   poorest citizens." They do not say whether foreigners or enslaved men also
   rowed. The picture avoids marking status.
4. **Where Xerxes' seat stood and whether the chair was gilded.** The chapter
   says "a seat at the foot of Mount Aigaleo." The prompt draws it halfway up the
   slope, with a canopy and attendants.
5. **The crew total of about 200.** It is 170 plus 30 from the chapter, but the
   chapter does not add them.

## Open Questions for the Author

1. **Photo of the replica?** The chapter names the replica *Olympias*, built in
   the 1980s. If the author has a photo or a visit planned, a second layer could
   compare the cutaway with it.
2. **Marker 4 is the thinnest.** The chapters say little about the deck. It could
   be dropped, or replaced by a steering-oar marker once a source is chosen.
3. **Companion links.** The lesson page should link
   [Xerxes' Road to Salamis](../../sims/persian-wars-campaign-map/index.md) and
   [Who Could Vote in Athens?](../../sims/athens-who-could-vote/index.md).

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Draft: 8 call-outs, estimated positions from the prompt. Calibrate with `?edit=true` after the image exists. |
| `trireme-at-salamis.png` | Not generated. |
| `main.html`, `index.md`, `metadata.json` | Not created. |
| Call-out library | Installed: `diagram.js` and `style.css` are in `docs/sims/shared-libs/`. The page loads them from `../../sims/shared-libs/`. |

## Next Steps

1. Author reviews this spec and `image-prompt.md`, and answers the open
   questions.
2. Author generates the image and saves it as `trireme-at-salamis.png`.
3. Install the call-out library, build `main.html` and `index.md` (born
   `scaffold`), calibrate marker positions with `?edit=true`, and run
   `mkdocs build --strict`.
