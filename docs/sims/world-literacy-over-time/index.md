---
title: "World Literacy Over Two Centuries"
description: "Predict how many of the world's people could read in 1820, when more than half first could, and what share of adults still cannot, then see each answer on two centuries of literacy data."
status: built
image: /sims/world-literacy-over-time/world-literacy-over-time.png
og:image: /sims/world-literacy-over-time/world-literacy-over-time.png
twitter:image: /sims/world-literacy-over-time/world-literacy-over-time.png
social:
   cards: false
quality_score: 100
---

# World Literacy Over Two Centuries

<iframe src="main.html" height="614px" width="100%" scrolling="no" title="Predict and explore world literacy from 1820 to today"></iframe>

[Run the World Literacy Over Two Centuries MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Most of us carry a rough mental timeline of literacy, and it is usually wrong
by a century or more. This MicroSim tests that timeline with three
predictions, each locked in before the chart reveals the data:

| Question | What the chart reveals | Answer from the data |
|---|---|---|
| 1. In 1820, what share of the world's people could read? | The 1820 point | Under 25% (12.1%) |
| 2. In which period did more than half the world first become literate? | The full line and its 50% crossing | 1920–1969 or 1970–2020 (see below) |
| 3. About 750 million adults cannot read. What share of the world's adults is that? | The gap above the latest point | About 10–15% (12.3% in 2024) |

The line is the share of the world's people who can read, from 1820 to 2024.
The shaded area above it is the share who cannot. Two gold markers mark
events from the chapter: Sequoyah's Cherokee syllabary (1821) and Turkey's
switch to a Latin-based alphabet (1928). After the third question, hover over
any point or marker to read it.

**The gap in the data.** The series has no values between 1960 (41.6%) and
1975 (65.4%), so the line crosses 50% in that gap. A straight line between the
two points crosses around 1965, while the first year in the data at or above
half is 1975. Because the two readings fall in different periods, question 2
accepts both 1920–1969 and 1970–2020. Either way, the lesson is the same: mass
literacy is mostly a 20th-century achievement.

**Changing definitions.** The older values are estimates built from very
different sources, some of which counted anyone who could sign their name.
The dip between 1940 (41.9%) and 1950 (36.0%) most likely reflects the switch
to UNESCO's 1950 census-based world estimate rather than a real fall. Modern
values count adults aged 15 and over who can read and write a short, simple
sentence about everyday life.

## How to Use

1. Read the question and choose an answer. Each question allows one attempt.
2. The chart reveals the relevant data. The correct answer turns green, a
   different choice turns red, and the feedback explains the answer with the
   actual values.
3. Press **Next question**. The score at the top right counts correct
   predictions.
4. After question 3, press **Explore the chart** and hover over any point or
   either gold marker.
5. **Restart** clears the score and the chart.

## Lesson Plan

**Audience:** adult travelers preparing for the trip.  
**Duration:** 10 minutes.  
**Prerequisites:** literacy, functional literacy, the 1820 and present-day
literacy estimates, and the UNESCO estimate of adults who cannot read.  
**Learning objective (Bloom: Understand):** Interpret a line chart of the
share of the world's people who could read from 1820 to today, answering at
least 2 of 3 prediction questions correctly before each answer is revealed.

### Activities

1. **Predict (4 min):** Before each question, sketch on paper what you expect
   the line to look like. Then answer and compare.
2. **Explore (3 min):** Hover over 1900 and 2000. How much did the share
   change in each of those centuries?
3. **Connect (3 min):** Find the 1928 marker. The Turkish alphabet reform is
   one of the "simpler scripts" the chapter credits with widening literacy.
   What else does the chapter name as a driver of the 20th-century rise?

### Assessment

Mastery is 2 of 3 correct predictions. A follow-up question: *The share of
adults who cannot read fell from about 88% in 1820 to about 12% in 2024. Why
can the number of adults who cannot read still be large?* Because the world's
adult population grew several times over, about 12% of roughly 6.1 billion
adults is still about three-quarters of a billion people.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/world-literacy-over-time/main.html"
        height="614px"
        width="100%"
        scrolling="no"
        title="Predict and explore world literacy from 1820 to today"></iframe>
```

The data used by the chart, with its source and download date, is in
[world-literacy-data.json](world-literacy-data.json).

## References

1. [Literate and illiterate world population](https://ourworldindata.org/grapher/literate-and-illiterate-world-population) — Our World in Data. The World series used for the line, downloaded November 24, 2026; it combines van Zanden et al. (OECD, *How Was Life?*, 2014) for 1820–1970, UNESCO's 1953 and 1957 reports, and the UNESCO Institute for Statistics from 1970 on.
2. [Literacy](https://www.unesco.org/en/literacy) — UNESCO. The estimate of roughly three-quarters of a billion adults who lack basic literacy skills, nearly two-thirds of them women.
3. [World Population Prospects 2024](https://population.un.org/wpp/) — United Nations. The source of the approximate figure of 6.1 billion people aged 15 and over.
4. [Literacy](https://en.wikipedia.org/wiki/Literacy) — Wikipedia. Definitions of literacy and functional literacy, and the history of mass literacy.
5. [Cherokee syllabary](https://en.wikipedia.org/wiki/Cherokee_syllabary) and [Turkish alphabet](https://en.wikipedia.org/wiki/Turkish_alphabet) — Wikipedia. The two event markers.
6. [Chart.js documentation](https://www.chartjs.org/docs/latest/) — The charting library used for the line chart.
