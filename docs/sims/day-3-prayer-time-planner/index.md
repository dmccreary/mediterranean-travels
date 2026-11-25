---
title: Planning Day 3 Around the Prayer Times
description: Drag Topkapı Palace, three mosques and lunch onto a Friday in Istanbul so that every mosque visit misses the prayer closures, then press Check to see each broken rule named.
status: built
image: /sims/day-3-prayer-time-planner/day-3-prayer-time-planner.png
og:image: /sims/day-3-prayer-time-planner/day-3-prayer-time-planner.png
twitter:image: /sims/day-3-prayer-time-planner/day-3-prayer-time-planner.png
social:
   cards: false
quality_score: 100
---

# Planning Day 3 Around the Prayer Times

<iframe src="main.html" height="578px" width="100%" scrolling="no" title="Plan a Friday in Istanbul around the prayer times"></iframe>

[Run the Planning Day 3 Around the Prayer Times MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Day 3 of the trip, Friday, November 13, 2026, is the Ottoman day in Istanbul,
and it falls on the day of congregational prayer. Mosques welcome visitors,
but not during prayer, and on a Friday the midday closure is the longest of
the week. This MicroSim turns that into a real planning problem: fit five
activities into a day from 9:00 AM to 6:00 PM so that every mosque visit lands
in an open window.

The grid shows the three prayers that fall inside our day, at the times the
chapter calculates from the sun's position for Istanbul on that date:

| Prayer | Time | Mosques closed to visitors (in this exercise) |
|---|---|---|
| Friday prayer (in place of noon prayer) | about 12:55 PM | 11:30 AM to 2:30 PM |
| Afternoon prayer | about 3:25 PM | 3:00 to 4:00 PM |
| Sunset prayer | about 5:50 PM | 5:30 to 6:00 PM |

The closure windows and Topkapı's hours are illustrative, chosen to match the
usual pattern: about an hour around each prayer, longer at Friday noon. On the
day, check the Diyanet's prayer times and each site's posted hours.

The five activities are Topkapı Palace with the Harem (3 hours, Sultanahmet),
the Blue Mosque (1 hour, Sultanahmet), the Süleymaniye Mosque and its
courtyard (1 hour, Süleymaniye), the Rüstem Pasha Mosque (30 minutes,
Süleymaniye) and lunch (1 hour, either area). The rules are:

- A mosque visit may not touch any shaded closure band.
- Topkapı is not affected by prayer, but it must finish by 5:00 PM.
- Activities may not overlap.
- Walking between Sultanahmet and Süleymaniye takes 30 minutes, so two
  sights in different areas need at least one empty slot between them.
  Lunch can be eaten in either area, so it never needs a walk of its own.
- All five activities must be placed.

More than one schedule is valid. After three unsuccessful checks, **Show One
Solution** reveals one of them.

## How to Use

1. Read the question in the panel: *It's Friday. When can we visit the
   mosques?*
2. Drag each card from the right onto the day grid. A dashed outline shows
   the 30-minute slot where the card will snap. Each placed block shows its
   start and end times.
3. To move a block, drag it again. To remove it, drag it off the grid.
4. Press **Check**. A valid plan turns every block green. Otherwise the panel
   lists every broken rule, and each block that breaks one gets a red border
   and a "!".
5. Adjust and check again. The counter in the control row counts your checks.
6. **Reset** clears the grid and the counter.

## Lesson Plan

**Audience:** adult travelers preparing for Day 3 in Istanbul.  
**Duration:** 10–15 minutes.  
**Prerequisites:** daily prayer, prayer times, Friday prayer and mosque
etiquette; where Topkapı Palace, the Blue Mosque, the Süleymaniye and the
Rüstem Pasha Mosque stand.  
**Learning objective (Bloom: Apply):** Solve the Day 3 scheduling problem by
placing five activities into a 9:00 AM to 6:00 PM day so that every mosque
visit falls inside a window when mosques are open to visitors, producing a
valid schedule within three checks.

### Activities

1. **Read the bands (2 min):** Before dragging anything, find the three
   dashed prayer lines and the shaded closures around them. Which closure is
   longest, and why?
2. **Solve (6 min):** Build a full schedule and press Check. Read every
   message before moving a card. Aim for a valid plan within three checks.
3. **Find the windows (3 min):** When your plan is valid, list the open
   windows a mosque visit can use on a Friday. Only two are long: the
   morning, and 4:00 to 5:30 PM.
4. **Change the day (3 min):** Suppose Day 3 were a Saturday, with an
   ordinary noon prayer and a closure of about an hour around it. Which of
   your constraints would relax, and how would you rearrange the day?

### Assessment

Mastery is a valid schedule within three checks. Follow-up questions:

- Why is a list of prayer times from last week not good enough for this
  plan? (Prayer times follow the sun, so they shift a few minutes every day.)
- Why is noon on Friday a poor time to visit a famous mosque, even though
  the mosque is full of people? (It is closed to visitors for the
  congregational prayer and sermon.)

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/day-3-prayer-time-planner/main.html"
        height="578px"
        width="100%"
        scrolling="no"
        title="Plan a Friday in Istanbul around the prayer times"></iframe>
```

To experiment with the code, copy
[day-3-prayer-time-planner.js](day-3-prayer-time-planner.js) into the
[p5.js Editor](https://editor.p5js.org/) using p5.js 2.3.4.

## References

1. [Salah times](https://en.wikipedia.org/wiki/Salah_times) — Wikipedia. How the five prayer times are calculated from the sun's position, including the shadow-length rule for the afternoon prayer.
2. [Friday prayer](https://en.wikipedia.org/wiki/Friday_prayer) — Wikipedia. The congregational prayer and sermon that replace the noon prayer on Fridays.
3. [Presidency of Religious Affairs](https://en.wikipedia.org/wiki/Presidency_of_Religious_Affairs) — Wikipedia. The Diyanet, which publishes Turkey's official prayer times.
4. [Topkapı Palace](https://en.wikipedia.org/wiki/Topkap%C4%B1_Palace) — Wikipedia. The Ottoman palace and its Harem, now a museum.
5. [Süleymaniye Mosque](https://en.wikipedia.org/wiki/S%C3%BCleymaniye_Mosque) — Wikipedia. Sinan's imperial mosque on Istanbul's third hill.
6. [Rüstem Pasha Mosque](https://en.wikipedia.org/wiki/R%C3%BCstem_Pasha_Mosque) — Wikipedia. Sinan's small, tile-covered mosque near the Spice Bazaar.
