---
title: "Spec: Anatomy of an Ottoman Mosque"
description: Build spec for the Anatomy of an Ottoman Mosque call-out poster, with the nine markers, sources, quiz, and open questions for the author.
---

# Spec: Anatomy of an Ottoman Mosque

**Status:** spec and draft data only. No image has been generated, and there is
no `index.md` or `main.html` yet, so this poster is not in the nav.

## Learning Objective

The learner will name nine parts of an Ottoman mosque and its courtyard in the
order a visitor meets them, and say what each part is for and what a respectful
visitor does there.

## Why This Poster

[Chapter 5](../../chapters/05-ottoman-istanbul/index.md) teaches the vocabulary
of a mosque (courtyard, ablution, minaret, mihrab, minbar, qibla) across four
separate sections, and the etiquette list sits in yet another. Day 3 falls on a
Friday, so everyone on the trip will need these words in the same hour. One
cutaway lets a reader follow a worshipper's path from the courtyard to the
qibla wall, with the practical rule for visitors attached to the part where it
applies: shoes at the door, quiet in the hall, no photographs of washing or of
people at prayer.

## Layout Decision

**One cutaway, call-out engine.** Numbered markers with leader lines, in the
order a person walks: courtyard, fountain, door and shoes, hall, dome, walls,
then the qibla end of the hall (mihrab, minbar), and last the minaret outside.
The numbered order follows the idea's "outer gate, fountain, shoe racks, hall,
qibla wall" path. The picture is a longitudinal section with the courtyard on
the left and the qibla wall on the right, which makes the qibla direction the
natural end of the walk.

| # | Marker | Chapter 5 section | Visitor rule it carries |
|---|---|---|---|
| 1 | Courtyard (avlu) | Ottoman Mosque Architecture; Friday Prayer | Visit between prayers |
| 2 | Ablution fountain | Ablution | Do not photograph people washing |
| 3 | Entrance and shoe racks | Mosque Etiquette | Shoes off; scarf; donation box |
| 4 | Prayer hall and visitors' area | Daily Prayer; Mosque Etiquette | Quiet, no flash, never walk in front of someone praying |
| 5 | Dome and semi-domes | Ottoman Mosque Architecture; The Süleymaniye Mosque | none |
| 6 | Calligraphy and tiles | The Quran; İznik Tiles | none |
| 7 | Mihrab and qibla wall | Mihrab and Minbar; Daily Prayer | none |
| 8 | Minbar | Mihrab and Minbar; Friday Prayer | Friday is the longest closure |
| 9 | Minaret | Minaret; The Call to Prayer | none |

Marker positions in `data.json` are estimates taken from the positions stated in
`image-prompt.md`. They must be calibrated against the real image with
`main.html?edit=true`. Markers are all at least 8 percentage points apart.

## Sources

Every fact in `data.json` comes from these chapter sections.

- [Chapter 5](../../chapters/05-ottoman-istanbul/index.md): Daily Prayer, The
  Call to Prayer, Minaret, Ablution, Friday Prayer, Mosque Etiquette, Mimar
  Sinan, Ottoman Mosque Architecture, Mihrab and Minbar, The Süleymaniye Mosque,
  İznik Tiles, The Blue Mosque, The Külliye Mosque Complex.
- [Chapter 4](../../chapters/04-byzantine-constantinople/index.md): Hagia
  Sophia (the 1740 ablution fountain, the eight roundels, the separate visitor
  entrance) and Dress at Sacred Sites.

## Tone Rules

1. **A living faith, not an exhibit.** The poster describes a working place of
   worship. Say what visitors do, not what worshippers "should" do. The
   cutaway shows worshippers standing in a row and nothing more intimate; no one
   is drawn bowing or prostrating.
2. **No decoration that looks like writing.** The prompt forbids Arabic
   calligraphy in the picture, since the generator would make nonsense letters.
   The band on the wall is abstract looping curves.
3. **Practical, not preachy.** Etiquette is stated as the chapter states it,
   once, at the part where it applies.
4. **No ladder.** The poster does not rank Ottoman mosques above Hagia Sophia.
   It reports what Sinan changed and what he kept.

## Quiz

Ten questions are drafted here. The call-out engine builds its own quiz mode
from each marker's `hint` ("click the marker that matches this description"),
and its `data.json` has no `quiz[]` field, so these questions are for the
author's review and for any companion page.

| # | Question | Answer | Explanation |
|---|---|---|---|
| 1 | Which marker shows the direction of prayer? | 7, mihrab | The niche is set in the qibla wall, which faces Mecca; from Istanbul that is south-southeast. |
| 2 | Where does a visitor take off shoes before stepping on the carpet? | 3, entrance | There are racks inside the door, or plastic bags to carry them. |
| 3 | Which part is the place for ritual washing before prayer? | 2, fountain | Ablution is done in a fixed order, and visitors do not perform it. |
| 4 | Which part do you count to spot an imperial foundation? | 9, minaret | Ordinary neighborhood mosques have one; only a sultan or his family could build more. |
| 5 | From which part does the imam give the Friday sermon? | 8, minbar | He stands on a lower step, leaving the top step for the Prophet. |
| 6 | Why are mosque walls covered with patterns and writing rather than pictures? | 6, calligraphy and tiles | The Quran's words are sacred, so writing them beautifully became one of the highest arts. |
| 7 | Which part did the Ottomans take from Hagia Sophia and rework into a single unified hall? | 5, dome and semi-domes | The Ottomans kept the central dome idea and changed the space beneath it. |
| 8 | Where do worshippers who cannot fit inside pray on a Friday? | 1, courtyard | The courtyard and street fill with mats before noon. |
| 9 | Which part holds the long rows facing the qibla wall? | 4, prayer hall | Rows stand shoulder to shoulder behind the imam; visitors stay in their own area. |
| 10 | Where does the sound of the call to prayer traditionally come from? | 9, minaret | The muezzin sang it from a balcony, the şerefe; today it is amplified but still sung live. |

## Open Questions for the Author

1. **Women's prayer area.** The chapter says women cover their hair and that
   Friday prayer is required of men and optional for women, but it does not
   describe a women's gallery or rear section. The idea asked for one. It is
   left out of `data.json`; see "To verify" below.
2. **Hagia Sophia is not an Ottoman-built mosque.** Marker 7 and marker 2 cite
   Hagia Sophia only as a comparison, using what Chapter 4 says. If you want a
   poster of Hagia Sophia's Ottoman additions, that is the companion
   [Inside the Hagia Sophia Dome](../hagia-sophia-dome/spec.md).
3. **Which mosque is drawn?** The prompt draws a generic classic Ottoman mosque
   with one minaret. The Süleymaniye has four and the Blue Mosque six. A generic
   picture keeps the markers clear; say if you would rather draw the Süleymaniye
   itself.
4. **Minbar side.** The chapter puts the minbar to the right of the mihrab as
   a worshipper faces the wall. In a side-on cutaway that is the near side of the
   niche, and a generator may flip it. Check after the image is made.
5. **Companion sims.** The lesson page should link
   [Planning Day 3 Around the Prayer Times](../../sims/day-3-prayer-time-planner/index.md)
   and [What Did the Külliye Do?](../../sims/suleymaniye-kulliye-sorter/index.md).

## To Verify Before Approval

- The women's section or gallery, and what a woman visitor should know about it.
  Not in the chapters.
- Whether the Süleymaniye's courtyard has a central ablution fountain (the
  chapter says courtyards "usually" do). Check before saying so of this mosque.
- Whether a visitor's route and entrance exist at each mosque on our route, as
  Chapter 4 says for Hagia Sophia. Chapter 5 says "use the visitors' entrance"
  in general.
- Prayer times for the day, which Chapter 5 flags as its own calculation, and
  not the Diyanet's.

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Drafted. Nine markers, estimated positions, to be calibrated with `?edit=true`. |
| `anatomy-of-a-mosque.png` | Not generated. |
| `main.html`, `index.md`, `metadata.json` | Not created. The call-out library (`diagram.js`, `style.css`) is already installed in `docs/sims/shared-libs/`; the page loads it from `../../sims/shared-libs/`. |

## Next Steps

1. Author reviews the prompt and the nine markers, then generates the image.
2. Install the call-out library, build the page, and calibrate the markers.
3. Decide on the women's section and the "which mosque" questions above.
