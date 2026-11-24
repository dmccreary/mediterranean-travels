---
title: Regions of the Eastern Mediterranean Map
description: An atlas-style map of the regions, island groups, seas, and straits named in Chapter 1, with hover infoboxes, a 12-region exploration checklist, a Find the Region challenge, and a live stream of xAPI learning events.
image: /sims/eastern-med-regions-map/eastern-med-regions-map.png
og:image: /sims/eastern-med-regions-map/eastern-med-regions-map.png
twitter:image: /sims/eastern-med-regions-map/eastern-med-regions-map.png
social:
   cards: false
quality_score: 0
status: built
hide:
  toc
---

# Regions of the Eastern Mediterranean Map

<iframe src="main.html" height="746px" width="100%" scrolling="no"></iframe>

[Run the Regions of the Eastern Mediterranean Map MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Chapter 1 opens with a map because almost every later chapter leans on it.
This MicroSim is that map, drawn like an atlas plate from Natural Earth
coastlines. Only the places named in "Part One: The Map" carry labels, along
with the seas and the two countries we travel through, Greece and Turkey.

Twelve places are **key regions**, the ones the rest of the book keeps
returning to:

| Kind | Key regions |
|---|---|
| Seas | Eastern Mediterranean, Aegean Sea |
| Straits | Bosphorus, Dardanelles |
| Land regions | Thrace (European Turkey), Anatolia, Ionia, Attica and Central Greece |
| Islands | Crete, the Cyclades, the Dodecanese, the North Aegean Islands |

Nine more places are labeled as context and can also be clicked: the Black
Sea, the Sea of Marmara, the Ionian Sea, the Sporades, the Saronic Islands, the
Ionian Islands, Cyprus, the Levant, and Egypt.

Historic regions such as Ionia and Thrace never had fixed borders, so their
inland edges are drawn as dashed lines and called approximate. Their coastlines
are exact.

## How to Use

**Explore mode** (the default):

- **Hover** over any region, sea, or strait to see an infobox: what kind of
  place it is, its other names, a one-line summary, and which of our stops
  are in it.
- **Click** a key region to explore it. It turns olive green, gets a ✓ on the
  map and on the checklist, and a small burst of confetti marks the find. The
  detail panel below the map gives the fuller story.
- Explore all 12 and a **confetti cannon** fires.
- Can't find one? Click its name on the **Checklist** and the map zooms to it
  and makes it flash. That gives no credit: the region still has to be clicked
  on the map.
- Drag to pan, and use **+** and **−** to zoom in on the islands. The mouse
  wheel scrolls the page as usual, not the map.

**Find the Region mode** hides the names of the 12 key regions and asks for
them one at a time, in random order:

- A correct click turns the region green and moves on.
- A wrong click names the place that was clicked and gives a hint about where
  to look.
- After two misses, or after pressing **Show me**, the answer flashes yellow
  and must be clicked to continue. It then counts as found, but not on the
  first try.
- The score is the number found on the first try. Finishing fires the confetti
  cannon.

Keyboard users can Tab to each region and press Enter to click it.

## Learning Events (xAPI)

This MicroSim records what a student does as
[xAPI](https://xapi.com/overview/) statements, the standard format a Learning
Record Store reads. It does not send them anywhere yet.

Students never see the statements. To watch them arrive, add
`?show-events=true` to the URL, either the
[sim's own URL](main.html?show-events=true) or the URL of a page that embeds
it, such as [this page](?show-events=true). An **Event stream** tab then
appears under the map, already open. **Copy JSON** copies every statement.

| Verb | When it is emitted | What it carries |
|---|---|---|
| `initialized` | The map loads, or a Find challenge starts | — |
| `experienced` | A hover of at least 0.6 seconds in Explore mode | how long the hover lasted |
| `interacted` | A click on a region in Explore mode, or a mode change | first visit or revisit, count explored |
| `asked` | **Show me**, or a click on a checklist name | which region |
| `answered` | A click in Find mode | correct or not, what was clicked, attempt number |
| `completed` | All 12 explored, or the Find challenge finished | first-try score out of 12 |

Shorter hovers are treated as the mouse passing over, not as evidence, and are
not recorded. The actor is always anonymous. Each statement is also announced to
the page in three ways a future connection can use: a `microsim:xapi` window
event, a `postMessage` to the page that embeds the iframe, and
`window.MicroSimEvents.statements()`.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/eastern-med-regions-map/main.html"
        height="746px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Learning Objective

Locate the 12 key regions, island groups, seas, and straits of the Eastern
Mediterranean on an unlabeled map (Bloom's level: Remember; verb: locate).

### Audience and Duration

Travelers preparing for the trip, or any adult or high-school learner meeting
this geography for the first time. 10–15 minutes.

### Prerequisites

Read "Part One: The Map" in
[Chapter 1](../../chapters/01-long-timeline/index.md), or at least its first
section, "The Eastern Mediterranean".

### Activities

1. **Explore (5 minutes).** Hover across the map from Istanbul to Crete,
   reading each infobox. Then click all 12 key regions until the cannon fires.
   For each one, say aloud which continent it is on.
2. **Notice the straits (2 minutes).** Zoom in on the Bosphorus and the
   Dardanelles. Explain to a travel partner why whoever held these two narrow
   waters could "tax, feed, or starve" the cities of the Black Sea.
3. **Find the Region (5 minutes).** Switch modes and find all 12 with the names
   hidden. Aim for at least 9 on the first try.
4. **Retry the misses.** Any region marked red on the list needed a hint.
   Explore it once more, then play the challenge again.

### Assessment

Mastery is **9 or more of 12 found on the first try** in Find the Region mode.
The `completed` statement records that score, so an instructor connected to a
Learning Record Store can see it without asking.

## References

1. [Eastern Mediterranean](https://en.wikipedia.org/wiki/Eastern_Mediterranean) - Wikipedia - The region this map covers and the countries usually counted in it.
2. [Anatolia](https://en.wikipedia.org/wiki/Anatolia) - Wikipedia - Name, extent, and geography of the Asian part of Turkey.
3. [Ionia](https://en.wikipedia.org/wiki/Ionia) - Wikipedia - The ancient Greek region on Anatolia's Aegean coast.
4. [Aegean Sea](https://en.wikipedia.org/wiki/Aegean_Sea) - Wikipedia - Area, boundaries, and island groups of the Aegean.
5. [Bosporus](https://en.wikipedia.org/wiki/Bosporus) and [Dardanelles](https://en.wikipedia.org/wiki/Dardanelles) - Wikipedia - The Turkish Straits.
6. [Natural Earth](https://www.naturalearthdata.com/) - public-domain map data - Source of the 1:10m country outlines, loaded through the [world-atlas](https://github.com/topojson/world-atlas) package.
7. [D3.js](https://d3js.org/) - Observable - The JavaScript library that draws the map.
8. [xAPI Overview](https://xapi.com/overview/) - Rustici Software - What xAPI statements and Learning Record Stores are.
