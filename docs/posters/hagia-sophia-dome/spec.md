---
title: "Spec: Inside the Hagia Sophia Dome"
description: Build spec for the Inside the Hagia Sophia Dome call-out poster, with the eight markers, sources, quiz, and the few details the chapters do not give.
---

# Spec: Inside the Hagia Sophia Dome

**Status:** spec and draft data only. No image has been generated, and there is
no `index.md` or `main.html` yet, so this poster is not in the nav.

## Learning Objective

The learner will name the parts that hold up the Hagia Sophia dome, say what each
one does, and tell which parts are Justinian's, which came after the collapse of
558, and which are later Ottoman additions.

## Why This Poster

[Chapter 4](../../chapters/04-byzantine-constantinople/index.md) tells the dome
story across three places: the dome section in Part Four, the exterior-reading
worked example in Part Two, and the restoration section. A visitor on Day 2 will
stand under the dome for a few minutes and wonder what is holding it up, and
[Chapter 5](../../chapters/05-ottoman-istanbul/index.md) then compares it with
Sinan's Süleymaniye the next day. A cross-section shows the load path from the
ring of windows down through the pendentives and piers to the buttresses, and
puts the 558 collapse and the Ottoman minarets in the same picture.

## Layout Decision

**One cross-section, call-out engine.** Numbered markers with leader lines, from
the supports upward and then outward: piers, pendentives, window ring, dome,
half-domes, buttresses, the collapse and rebuild, and the minarets. It is the
companion to the idea "Hagia Sophia: One Building, Four Lives", which is not built
yet: that poster would answer "what happened to it", and this one answers "what
is it". East is on the right, as the chapter's "to the east and west, two
half-domes" suggests.

| # | Marker | Chapter section |
|---|---|---|
| 1 | Piers | Chapter 4, The Hagia Sophia Dome; Hagia Sophia; Chapter 5, Ottoman Mosque Architecture |
| 2 | Pendentives | Chapter 4, The Hagia Sophia Dome |
| 3 | Ring of 40 windows | Chapter 4, The Hagia Sophia Dome; Primary Source |
| 4 | Central dome | Chapter 4, The Hagia Sophia Dome; Chapter 5, comparing the two great domes |
| 5 | Half-domes | Chapter 4, The Hagia Sophia Dome; Chapter 5, Mimar Sinan |
| 6 | Buttresses | Chapter 4, Reading Hagia Sophia's exterior; The Hagia Sophia Dome |
| 7 | Collapse and rebuild | Chapter 4, The Hagia Sophia Dome; Restoration and Reconstruction |
| 8 | Ottoman minarets | Chapter 4, Hagia Sophia; Reading Hagia Sophia's exterior; Contested History |

Marker positions in `data.json` are estimates from the positions stated in
`image-prompt.md`. They must be calibrated against the real image with
`main.html?edit=true`. Markers are at least 8 percentage points apart.

## Sources

All facts come from Chapter 4 and from the comparison in Chapter 5, "Ottoman
Mosque Architecture" and "Mimar Sinan". Chapter 4 states the dimensions (about
31 m across, about 55 m high), the ring of 40 windows, and the dates of the
collapse and rebuild (558 and 562), so these are in `data.json` and not under
"To Verify". The two Isidores, the earthquakes of 553, 557, 989 and 1346, and the
Fossati restoration of 1847 to 1849 are also Chapter 4's.

## Tone Rules

1. **Hagia Sophia is a working mosque.** The minaret marker says so, once, and
   says who uses it and what it means to them is where contested history lives, as
   Chapter 4's own method does. No wording that takes a side on its status.
2. **No hero-worship of Justinian.** Procopius wrote for the emperor, and the
   window marker says to read his "golden chain" with that in mind.
3. **No "ladder."** The Süleymaniye is compared, not ranked: narrower, steeper,
   with hidden buttresses, a different answer to the same problem.
4. **The faint ghost arc is a drawing aid.** The chapter says only that the first
   dome was shallower, and marker 7's tip says so.

## Quiz

Ten questions are drafted here. The call-out engine builds its own quiz mode from
each marker's `hint`, and its `data.json` has no `quiz[]` field, so these are for
the author's review and for any companion page.

| # | Question | Answer | Explanation |
|---|---|---|---|
| 1 | Which element turns a square room into a round base for a dome? | 2, pendentives | A curved triangle of masonry fills each corner between two arches, so the dome sits on the ring they make. |
| 2 | Which element makes the dome seem to float, and what did Procopius call the effect? | 3, window ring | Its 40 windows flood the base with light and hide the supports; he wrote of a golden chain. |
| 3 | Which elements carry the four great arches? | 1, piers | Four arches rise from four piers, and everything above rests on them. |
| 4 | Which marker is about 31 m across and about 55 m high? | 4, central dome | For its time it was a daring piece of engineering. |
| 5 | Which elements extend the space east and west into one continuous room? | 5, half-domes | Two half-domes open the central space. |
| 6 | Which element stops the walls spreading under the dome's weight? | 6, buttresses | Every builder after Justinian has held the walls in, and Sinan added more in the 1570s. |
| 7 | When did the first dome fall, and why was the new one built higher? | 7, collapse and rebuild | Its eastern part fell in May 558; the rebuilt dome was steeper and pushed outward less. |
| 8 | Which parts show Hagia Sophia's Ottoman layer outside? | 8, minarets | Four, each built by a different sultan; two of them by Sinan in the 1570s. |
| 9 | What did Sinan's later domes learn from the rebuilt dome? | 7 | A steeper curve pushes outward less. |
| 10 | Which marker shows a source we should read with its purpose in mind? | 3, window ring | Procopius wrote his praise for Justinian. |

## Open Questions for the Author

1. **How much of the Süleymaniye comparison belongs here?** Marker 4 gives the
   Süleymaniye's dome size and marker 1 its slimmed piers. Keep them, or leave the
   comparison to the mosque poster and Chapter 5?
2. **Ghost arc.** The faint outline of the first dome helps marker 7 but may
   confuse a quiz question. If the generator makes it heavy, remove it from the
   prompt and keep the collapse in the marker text alone.
3. **Companion sims.** The lesson page should link
   [Read the Ruin - Which Layer?](../../sims/read-the-ruin-layers/index.md) and
   [Source, Myth, or Contested?](../../sims/source-myth-or-contested/index.md).
   The companion poster is [Anatomy of an Ottoman Mosque](../anatomy-of-a-mosque/spec.md).

## To Verify Before Approval

- **The rededication date.** Chapter 4 says the rebuilt dome was dedicated in 562,
  while its sources table dates Paul the Silentiary's poem to 563 "at the
  rededication." Check which year the chapter means before the page is built.
- **Which buttresses are Byzantine and which are Sinan's.** The chapter says both
  built them but does not say which, so the picture draws one plain type.
- **Details the picture invents:** the shape and height of the first dome (the
  chapter says shallower, and the rebuild about 6 to 7 m higher), the number of
  arches under the half-domes, and the relative size of the piers. None is a claim.
- **Current visitor arrangements.** Chapter 4 says the ground floor is kept for
  worshippers and visitors take a gallery route since January 2024. Check on the day.

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Drafted. Eight markers, estimated positions, to be calibrated with `?edit=true`. |
| `hagia-sophia-dome.png` | Not generated. |
| `main.html`, `index.md`, `metadata.json` | Not created. At build time, install the call-out library (`diagram.js`, `style.css`) into `docs/sims/shared-libs/` from `~/.claude/skills/microsim-generator/assets/infographic-overlay/shared-libs`; it is not there yet. |

## Next Steps

1. Author reviews the prompt and the eight markers, then generates the image.
2. Install the call-out library, build the page, and calibrate the markers.
3. Check the rededication year against the chapter.
