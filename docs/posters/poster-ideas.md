---
title: Poster Ideas
description: Candidate interactive overlay infographics for the trip, favoring side-by-side comparisons and annotated illustrations with call-outs.
---

# Poster Ideas

This page is a planning list, not a finished poster. Each idea below is a
candidate for an **interactive overlay infographic** like
[The Three Classical Orders](column-types/index.md): one illustration with an
interactive layer on top. The ideas favor two kinds of picture, because those
are the ones an overlay improves most.

- **Side-by-side comparisons** (grid engine): two to five panels drawn at the
  same scale, with a hover zone and a detail panel for each. The reader learns
  by looking back and forth.
- **Annotated illustrations** (call-out engine): one picture with numbered
  markers and leader lines that point at parts, in the order a visitor would
  meet them.

Every poster also gets **Quiz mode** for free, so each idea lists one sample
question.

## Ground Rules for Every Poster

1. **No text in the image.** Titles, labels, and numbers live in `data.json`
   and are drawn at runtime. This keeps facts editable and checkable.
2. **Same scale, same viewpoint** in comparison panels. Differences should come
   from the subject, not from the artist's framing.
3. **Every claim in a zone carries a "where we see it on our route" line**, as
   the Orders poster does. A poster that does not connect to a stop on the trip
   has not earned its place.
4. **Dates and numbers marked "verify"** below must be checked against a cited
   source before they go into `data.json`. Treat the figures in this list as
   leads, not facts.
5. **No image is generated until the author approves the idea and its image
   prompt.** Each poster starts with a short `image-prompt.md`, as the Orders
   poster did.

## Recommended First Four

If only a few get built, these give the most for the effort. They cover the
book's three threads: the cities of layers, the Oracle and the Algorithm, and
Learning for All.

| Rank | Idea | Why first |
|---|---|---|
| 1 | [The Oracle and the Algorithm, Side by Side](#1-the-oracle-and-the-algorithm-side-by-side) | The book's central comparison, and no existing sim shows it as one picture |
| 2 | [Five Classrooms Across Three Thousand Years](#2-five-classrooms-across-three-thousand-years) | The Learning for All thread made visible in one view |
| 3 | [Hagia Sophia: One Building, Four Lives](#3-hagia-sophia-one-building-four-lives) | The clearest "city of layers" subject; a strong photo-realistic illustration is easy to describe |
| 4 | [The Acropolis, Then and Now](#4-the-acropolis-then-and-now) | Nearly everyone on the trip will stand there; orientation is practical |

## Where Each Idea Stands

"Built" means the poster page is live. Every poster also has a `spec.md`, an
`image-prompt.md`, and a `data.json` in its folder. The `image-prompt.md` files
are not published on the site.

| # | Idea | Engine | Status |
|---|---|---|---|
| 1 | The Oracle and the Algorithm, Side by Side | Grid | [Built](oracle-vs-algorithm/index.md) |
| 2 | Five Classrooms Across Three Thousand Years | Grid | [Built](five-classrooms/index.md) |
| 3 | Hagia Sophia: One Building, Four Lives | Grid | [Built](hagia-sophia-four-lives/index.md) |
| 4 | The Acropolis, Then and Now | Grid | [Built](acropolis-then-and-now/index.md) |
| 5 | A Scribe's Page and an Aldine Page | Grid | [Built](scribe-and-aldine-page/index.md) |
| 6 | Roman Bath and Turkish Hamam | Grid | [Built](bath-and-hamam/index.md) |
| 7 | One Table, Two Names | Grid | [Built](one-table-two-names/index.md) |
| 8 | The Colossus: Popular Picture and Likely Truth | Grid | [Built](colossus-myth-and-evidence/index.md) |
| 9 | Anatomy of a Mosque | Call-out | [Built](anatomy-of-a-mosque/index.md) |
| 10 | Delphi: Climbing the Sacred Way | Call-out | [Built](delphi-sacred-way/index.md) |
| 11 | The Library of Celsus Facade | Call-out | [Built](library-of-celsus/index.md) |
| 12 | Inside the Hagia Sophia Dome | Call-out | [Built](hagia-sophia-dome/index.md) |
| 13 | Walk Down the Hippodrome | Call-out | [Built](hippodrome-walk/index.md) |
| 14 | A Trireme at Salamis | Call-out | [Built](trireme-at-salamis/index.md) |
| 15 | The Antikythera Mechanism, Opened Up | Call-out | [Built](antikythera-opened/index.md) |

The seven call-out posters use the call-out library (`diagram.js` and
`style.css`), which is installed in `docs/sims/shared-libs/` beside the grid
library. A poster page loads it from `../../sims/shared-libs/`. The call-out
engine builds its quiz from each marker's hint, so those posters keep their
drafted quiz questions in `spec.md`.

## Side-by-Side Comparisons

### 1. The Oracle and the Algorithm, Side by Side

| | |
|---|---|
| **Chapters** | [Chapter 17](../chapters/17-oracle/index.md), [Chapter 18](../chapters/18-delphi/index.md), [Chapter 19](../chapters/19-algorithm/index.md) |
| **Engine** | Grid, six tiles in a 3 × 2 grid, one zone per matched pair |
| **The picture** | Six small diptychs. In each, Delphi is on the left and today's algorithm is on the right, drawn from the same camera height. |
| **Status** | Built: [the poster](oracle-vs-algorithm/index.md) and [its spec](oracle-vs-algorithm/spec.md). |

**Zones** (each zone is one whole tile, so one hover compares the pair):

1. **Who asks**: a petitioner with a yes-or-no choice, and a user typing a prompt.
2. **Where the knowledge came from**: the sanctuary as a hub of traders' and envoys' reports, and training data.
3. **The answer's form**: an ambiguous verse, and a probability or a fluent paragraph.
4. **Who interprets**: the priests, and the human in the loop.
5. **What goes wrong**: motivated reading, and confirmation bias and data bias.
6. **Feedback**: a prophecy that shapes the decision, and a prediction that changes the thing predicted.

**Sample quiz question:** "Which row is the best match for the `training data` of a model?" (Answer: where the knowledge came from.)

**Watch-outs.** The point is the parallel, not a claim that the Pythia was
secretly a data center. Each zone should name where the parallel *breaks*.
Related sims: *oracle-gears-or-data-sorter*, *oracle-answer-hedging-test*,
*prediction-feedback-loops*.

### 2. Five Classrooms Across Three Thousand Years

| | |
|---|---|
| **Chapters** | [Chapter 2](../chapters/02-traveling-well/index.md), [Chapter 12](../chapters/12-rhodes/index.md), [Chapter 14](../chapters/14-venetian-heraklion/index.md), [Chapter 16](../chapters/16-athens-agora-democracy/index.md), [Chapter 20](../chapters/20-athens-museums-city-today/index.md) |
| **Engine** | Grid, five equal-width panels |
| **The picture** | Five classrooms in a row, drawn from the same camera height, in date order: a philosopher walking with students at the Lyceum, a rhetoric lesson on Rhodes, an Aldine print shop with a bound octavo book, a medrese courtyard beside a mosque, and one adult tutoring one child with a tablet. |
| **Status** | Built: [the poster](five-classrooms/index.md) and [its spec](five-classrooms/spec.md). |

**Each zone follows the book's own four-step pattern** from Chapter 2: locked
up, opened, resisted, and widened but never all the way. The last step is the
thread's question, "who was left outside?"

**Sample quiz question:** "Which classroom made one-to-one attention cheap enough for every child?" (Leads into the tutoring-effect sim.)

**Watch-outs.** Do not draw the five as steps on a ladder of progress. Several
widened access while others narrowed it again. Needs care with the
Ottoman panel: the medrese and külliye were charitable foundations, which the
*suleymaniye-kulliye-sorter* sim already covers. Related sims:
*tutoring-effect-size-explorer*, *world-literacy-over-time*.

### 3. Hagia Sophia: One Building, Four Lives

| | |
|---|---|
| **Chapter** | [Chapter 4](../chapters/04-byzantine-constantinople/index.md) |
| **Engine** | Grid, four panels in two rows, plus an optional shared-features zone |
| **The picture** | The same interior view of the nave, drawn four times: as Justinian's cathedral (dedicated 537 CE), as an Ottoman mosque after 1453, as a museum (1935), and as a mosque again (2020). Same dome and same camera. |

**Zones.** One per life, each listing what was added, covered, or revealed.
A fifth zone lists what never changed: the dome, the pendentives, the ring of
windows.

**Sample quiz question:** "In which life do the large round calligraphic medallions first appear on the walls?"

**Watch-outs.** This is a living religious site and a politically contested
one. Use neutral, factual wording, and keep the "who decided and why" in a
labeled **contested history** note rather than in the zone summary. Verify the
dates and the sequence of cover-ups and uncoverings. Related sims:
*read-the-ruin-layers*, *place-the-site-in-its-era*.

### 4. The Acropolis, Then and Now

| | |
|---|---|
| **Chapter** | [Chapter 15](../chapters/15-athens-acropolis/index.md) |
| **Engine** | Grid, two panels, plus a matching set of call-outs inside each panel |
| **The picture** | One aerial view of the rock from the northwest, drawn twice: in the late 5th century BCE with paint and bronze, and today with scaffolding, the Parthenon's missing roof, and tourists. |

**Call-outs in each panel:** the Propylaea gateway, the temple of Athena Nike,
the Parthenon, the Erechtheion with its Caryatid porch, and the path up.

**Sample quiz question:** "Which monument stands on the bastion at the right of the entrance?"

**Watch-outs.** The "then" image must avoid overconfident color. Mark painted
details as reconstruction in the zone text. Related sims:
*parthenon-five-lives-timeline*, *parthenon-marbles-fact-or-position*.

### 5. A Scribe's Page and an Aldine Page

| | |
|---|---|
| **Chapters** | [Chapter 6](../chapters/06-bazaars-scripts-presses/index.md), [Chapter 14](../chapters/14-venetian-heraklion/index.md) |
| **Engine** | Grid, two facing pages, zones for each feature |
| **The picture** | Two open books at the same size on a desk. Left: a hand-copied Greek manuscript with a wide margin and decorated initial. Right: a small Venetian octavo in Aldus Manutius's italic type. |

**Zones:** the writing surface, the hand or type, the layout, who made it, how
long it took, and who could afford it.

**Sample quiz question:** "Which feature let a scholar carry a classic in a pocket?"

**Watch-outs.** The time and cost figures need sources before they appear.
Greek in the image must be avoided, since the generator will garble it. Draw
blurred lines of text instead. Related sims: *scribe-or-press*,
*folio-quarto-octavo-paper-calculator*, *greek-book-makers-venice-network*,
*when-printing-arrived*.

### 6. Roman Bath and Turkish Hamam

| | |
|---|---|
| **Chapter** | [Chapter 6](../chapters/06-bazaars-scripts-presses/index.md) |
| **Engine** | Grid, two cutaway panels stacked or side by side |
| **The picture** | Two cutaway floor plans drawn from above, the same footprint. Left, a Roman bath with its changing room, cold, warm, and hot rooms and the underfloor hypocaust. Right, a Turkish hamam with its entrance hall, cool, warm, and hot rooms and the heated central marble stone. |

**Zones:** the entrance room, the cold room, the warm room, the hot room, the
heat source, and the social function of each.

**Sample quiz question:** "Which room in a hamam does the same job as the Roman *caldarium*?"

**Watch-outs.** Keep this practical. A visitor may well go to a hamam, so the
overlay can include etiquette in one zone. Keep the continuity claim modest:
the hamam developed from Roman and Byzantine bath culture, but it is not a
copy.

### 7. One Table, Two Names

| | |
|---|---|
| **Chapters** | [Chapter 6](../chapters/06-bazaars-scripts-presses/index.md), [Chapter 20](../chapters/20-athens-museums-city-today/index.md) |
| **Engine** | Grid, a mirrored table with matched dish pairs |
| **The picture** | A top-down view of a long shared table. The left half holds a Turkish meze spread, the right half a Greek one, with the shared dishes aligned across the middle: stuffed vine leaves, a yogurt-and-cucumber dip, a layered honey pastry, a thick strong coffee, and an anise spirit. |

**Zones:** one per pair, each with both names, the shared roots, and the
differences in how each country makes it.

**Sample quiz question:** "Which pair shares a name for the same coffee-making method?"

**Watch-outs.** This is an empathy poster. Do not argue about who invented what.
State that the dishes grew out of a shared Ottoman and Byzantine past, and
that each country calls its own version its own. Cross-link the *food-history-layers-sorter*
sim, and point to the chapter's own notes on the population exchange of 1923.

### 8. The Colossus: Popular Picture and Likely Truth

| | |
|---|---|
| **Chapter** | [Chapter 12](../chapters/12-rhodes/index.md) |
| **Engine** | Grid, two panels, "What most people imagine" and "What the evidence supports" |
| **The picture** | Left, a giant bronze figure straddling the harbor mouth with ships passing between its legs. Right, a standing figure on a stone base beside the harbor, with scaffolding to show how it was built. |

**Zones:** pose, location, height (verify), how it was built, how it fell
(verify), and what became of the bronze.

**Sample quiz question:** "Which detail of the popular image has no good evidence behind it?"

**Watch-outs.** This one teaches the book's *myth versus history* habit.
The zone text must say clearly that no source describes the straddling pose,
and that the likely appearance is reconstructed. Verify the construction and
collapse dates before they appear.

## Annotated Illustrations With Call-Outs

### 9. Anatomy of a Mosque

| | |
|---|---|
| **Chapter** | [Chapter 5](../chapters/05-ottoman-istanbul/index.md) |
| **Engine** | Call-out, numbered markers with leader lines |
| **The picture** | A cutaway view of a classic Ottoman mosque and its forecourt: the dome and semi-domes, the minaret, the courtyard with its ablution fountain, the entry, the *mihrab* niche, the *minbar* pulpit, and the women's gallery or rear section. |

**Order of markers:** follow a worshipper's path from the outer gate, to the
fountain, to the shoe racks, into the hall, then toward the *qibla* wall.

**Sample quiz question:** "Which marker shows the direction of prayer?"

**Watch-outs.** Write it with respect and for practical use, since we plan to
be in Istanbul on a Friday. Include dress and shoe etiquette in the relevant
zones. Related sims: *day-3-prayer-time-planner*,
*suleymaniye-kulliye-sorter*.

### 10. Delphi: Climbing the Sacred Way

| | |
|---|---|
| **Chapter** | [Chapter 18](../chapters/18-delphi/index.md) |
| **Engine** | Call-out |
| **The picture** | The sanctuary as one hillside cutaway, drawn from the lower slope up to the stadium: the Castalian Spring, the Athena Pronaia sanctuary and its round *tholos* below the road, the Sacred Way, treasuries, the Athenian treasury, the polygonal wall, the Temple of Apollo, the theater, and the stadium. |

**Order of markers:** the order we will climb. Each call-out names what a
petitioner did there and what we see today.

**Sample quiz question:** "Where would a petitioner have washed before entering the sanctuary?"

**Watch-outs.** Keep the geography honest, since the real site is steep and
the buildings are scattered. Related sims: *delphi-consultation-steps*,
*serpent-column-two-ends*, *delphi-oracle-strength-timeline*.

### 11. The Library of Celsus Facade

| | |
|---|---|
| **Chapter** | [Chapter 10](../chapters/10-ephesus-greco-roman-city/index.md) |
| **Engine** | Call-out |
| **The picture** | A straight-on view of the two-story facade at Ephesus, with steps, paired columns, niches, and statues, shown before the earthquake damage and then, in a second layer, as reassembled. |

**Call-outs:** the steps and entry doors, the niches and the statues of
virtues (verify the names), the ground-floor and upper-floor column orders,
the burial of Celsus beneath the building, and what is reconstruction.

**Sample quiz question:** "Which order of column appears on the lower story?"

**Watch-outs.** This links to the *classical-orders-identifier* sim, so reuse
its wording. Mark clearly which parts were reassembled in the 20th century.
It also fits the Learning for All thread: this was a public library, built as
a memorial. Verify the dates.

### 12. Inside the Hagia Sophia Dome

| | |
|---|---|
| **Chapter** | [Chapter 4](../chapters/04-byzantine-constantinople/index.md) |
| **Engine** | Call-out on a cross-section |
| **The picture** | A clean architectural cross-section: the central dome, the ring of windows at its base, the pendentives carrying it onto four piers, the half-domes, the buttresses, and the minarets added later. |

**Call-outs:** the ring of windows, the pendentives, the piers, the half-domes,
the buttresses, the earlier collapse and rebuild of the dome (verify), and the
Ottoman additions outside.

**Sample quiz question:** "Which element turns a square room into a round base for a dome?"

**Watch-outs.** Companion to idea 3 rather than a replacement. Together they
answer "what is it" and "what happened to it". Verify the dimensions.

### 13. Walk Down the Hippodrome

| | |
|---|---|
| **Chapter** | [Chapter 4](../chapters/04-byzantine-constantinople/index.md) |
| **Engine** | Call-out |
| **The picture** | A side view of the open square as it looks today, with the three surviving monuments along the old track line: the Egyptian obelisk, the twisted bronze column, and the rough masonry obelisk. |

**Call-outs:** where each monument came from, who moved it, what it was
originally for, and what was lost. This is *spolia* made visible: three eras of
borrowed power in one row.

**Sample quiz question:** "Which monument was first set up at Delphi?"

**Watch-outs.** Related sims: *serpent-column-two-ends*,
*read-the-ruin-layers*. Do not duplicate the serpent-column sim's content;
link to it.

### 14. A Trireme at Salamis

| | |
|---|---|
| **Chapter** | [Chapter 15](../chapters/15-athens-acropolis/index.md) |
| **Engine** | Call-out |
| **The picture** | A cutaway of an Athenian trireme from the side, with the three levels of oar benches, the ram at the waterline, the deck, and the steering oars. |

**Call-outs:** the three oar levels, the ram, the deck, the crew by role, and
what crew size meant for who could vote. Citizens of modest means rowed the
ships that saved Athens, and that history shaped the democracy.

**Sample quiz question:** "Which part of the ship did the actual damage in a fight?"

**Watch-outs.** The link to democracy is the interesting part, and it should
lead the first call-out. Related sims: *persian-wars-campaign-map*,
*athens-who-could-vote*.

### 15. The Antikythera Mechanism, Opened Up

| | |
|---|---|
| **Chapter** | [Chapter 20](../chapters/20-athens-museums-city-today/index.md) |
| **Engine** | Call-out on an exploded view |
| **The picture** | A reconstruction of the front and back, with the case open: the front dial, the two back spirals, the crank, and the stacked gears. |

**Call-outs:** the crank, the main drive wheel, the sun and moon pointers, the
calendar and eclipse dials, and the surviving fragments versus the
reconstructed parts.

**Sample quiz question:** "Which dial predicts eclipses?"

**Watch-outs.** This is an "ancient prediction machine", and it ties directly to
idea 1. The *antikythera-gears* sim already covers the gears. The poster's
job is orientation: what the object looked like and which parts are certain.
Verify the number of fragments, the date range, and the dials.

## Other Candidates (Not Yet Developed)

- **Topkapı Palace plan**: the four courtyards as an annotated plan, in the
  order we walk them.
- **Agora of Athens**: the stoa, the temple of Hephaestus, the council house,
  and the Areopagus hill, as one oblique view.
- **Venetian Candia**: a bird's-eye view of the walls and bastions, with the
  Morosini fountain and the Koules fortress.
- **Knossos: What Survives and What Evans Rebuilt**: the throne room, drawn
  twice. This overlaps the *knossos-minoan-or-evans* sim, so build it only if
  the sim's quiz does not already cover the idea well.

## Suggested Build Order

1. Pick one poster. Write a one-paragraph spec and an `image-prompt.md`.
2. After the author approves the prompt, generate the image.
3. Draw zones with `?edit=true`, then fill in `data.json`.
4. Add facts with sources, then write the quiz questions.
5. Create `index.md` with `status: scaffold`, then `built`. Only the author sets `approved`.
6. Add the poster to the table in [List of Posters](index.md) and to `nav:` in `mkdocs.yml`.
