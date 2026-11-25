---
title: "November Weather at Our Stops"
description: "Predict November temperature and rainfall at six stops on our route before the climate chart reveals the answer, then explore each stop's twelve-month climate."
status: built
image: /sims/november-weather-at-our-stops/november-weather-at-our-stops.png
og:image: /sims/november-weather-at-our-stops/november-weather-at-our-stops.png
twitter:image: /sims/november-weather-at-our-stops/november-weather-at-our-stops.png
social:
   cards: false
quality_score: 100
---

# November Weather at Our Stops

<iframe src="main.html" height="616px" width="100%" scrolling="no" title="Predict and explore November weather at six stops on our route"></iframe>

[Run the November Weather at Our Stops MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A climate chart answers the packing question better than any forecast made
weeks ahead: what is a typical November day like here? This MicroSim asks four
prediction questions, and each chart appears only after we lock in an answer.
Predicting first makes us read the pattern in the chart instead of looking up a
single number.

| Question | What the chart shows | Misconception it tests |
|---|---|---|
| 1. Which stop has the coolest November afternoons? | November highs and lows at all six stops | Istanbul has the same weather as Athens because both are "Mediterranean." |
| 2. Is November in Athens wetter or drier than August? | Athens rainfall, month by month | Summer is the wet season, as in many northern climates. |
| 3. Which is the hottest month in Athens? | Athens afternoon highs, month by month | The hottest month is the month of the longest day. |
| 4. How much colder is a November night in Istanbul than a November afternoon in Heraklion? | Istanbul and Heraklion November highs and lows | The Mediterranean is warm all year, so one set of clothes will do. |

After the fourth question, an exploration view opens. Choose any stop to see
its twelve months of afternoon highs and night lows as lines, rainfall as bars,
and November shaded as "our month." Tooltips give every temperature in °C and
°F (°F = °C × 9/5 + 32, rounded).

### The data

Each stop's values are the mean daily maximum, mean daily minimum and mean
monthly precipitation from the climate table in that city's English Wikipedia
article, retrieved on November 24, 2026:

| Stop | Days on our trip | Station and period |
|---|---|---|
| Istanbul | 1–5 | Kireçburnu, 1991–2020 normals |
| Çanakkale (Troy and Gallipoli) | 6 | Çanakkale, 1991–2020 normals |
| İzmir (nearest major station to Ephesus) | 7 | İzmir, 1991–2020 normals |
| Rhodes | 8 | Rhodes International Airport, Paradeisi, September 1996 – August 2026 averages |
| Heraklion (Knossos) | 9 | Nikos Kazantzakis Airport, 1991–2020 normals |
| Athens | 10–13 | Downtown Athens, 1991–2020 normals |

For Heraklion, the article's first climate table is a short record from the
harbor station (2007–2024); the sim uses the article's 1991–2020 airport
normals instead, so that five of the six stops share the same standard
period. Rhodes has no 1991–2020 table in its article, so its longest recent
record is used. Weather in any single November can differ a lot from these
averages.

## How to Use

1. Read the question and choose an answer. The choice is locked in; each
   question allows one attempt.
2. The chart for that question appears. The correct answer turns green, a
   different choice turns red, and the feedback explains the answer with the
   actual values.
3. Press **Next question**. The score at the top right counts correct
   predictions.
4. After question 4, press **Explore the stops** and choose any stop from the
   list. Hover over a month to read its values.
5. **Restart** clears the score and returns to question 1.

## Lesson Plan

**Audience:** adult travelers preparing for the trip.  
**Duration:** 10–15 minutes.  
**Prerequisites:** climate, Mediterranean climate (hot, dry summers and mild,
wet winters), November as the start of the wet season, and mean daily high and
low temperature.  
**Learning objective (Bloom: Understand):** Interpret monthly temperature and
rainfall charts for six stops on our route to predict November conditions,
answering at least 3 of 4 prediction questions correctly before the answer is
revealed.

### Activities

1. **Predict (5 min):** Answer the four questions. Before each one, say aloud
   what you expect the chart to look like.
2. **Explore (5 min):** In the exploration view, step through all six stops.
   For each, find the driest summer month and compare it with November.
3. **Pack (3 min):** Using the November high and low at each stop, decide
   which layers to carry ashore on Day 6 (Çanakkale) and Day 9 (Heraklion).

### Assessment

Mastery is 3 of 4 correct predictions. A follow-up question: *Rhodes and
Heraklion both have November afternoons near 20–21 °C. Which one should we
expect to be wetter in November, and how can you tell from the chart?* Rhodes:
its November rainfall bar (about 97 mm) is well above Heraklion's (about 56 mm).

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/november-weather-at-our-stops/main.html"
        height="616px"
        width="100%"
        scrolling="no"
        title="Predict and explore November weather at six stops on our route"></iframe>
```

## References

1. [Istanbul: Climate](https://en.wikipedia.org/wiki/Istanbul#Climate) — Wikipedia. Climate table for Kireçburnu, 1991–2020 normals (Turkish State Meteorological Service).
2. [Çanakkale: Climate](https://en.wikipedia.org/wiki/%C3%87anakkale#Climate) — Wikipedia. Climate table for Çanakkale, 1991–2020 normals (Turkish State Meteorological Service).
3. [İzmir: Climate](https://en.wikipedia.org/wiki/%C4%B0zmir#Climate) — Wikipedia. Climate table for İzmir, 1991–2020 normals (Turkish State Meteorological Service).
4. [Rhodes: Climate](https://en.wikipedia.org/wiki/Rhodes#Climate) — Wikipedia. Climate table for Rhodes International Airport, Paradeisi, September 1996 – August 2026 (Hellenic National Meteorological Service).
5. [Heraklion: Climate](https://en.wikipedia.org/wiki/Heraklion#Climate) — Wikipedia. Climate table for Nikos Kazantzakis Airport, 1991–2020 normals.
6. [Athens: Climate](https://en.wikipedia.org/wiki/Athens#Climate) — Wikipedia. Climate table for downtown Athens, 1991–2020 normals (National Observatory of Athens).
7. [Mediterranean climate](https://en.wikipedia.org/wiki/Mediterranean_climate) — Wikipedia. Hot, dry summers and mild, wet winters, and why.
8. [Chart.js documentation](https://www.chartjs.org/docs/latest/) — The charting library used for the bar and line charts.
