---
title: "Spec: One Table, Two Names"
description: Build spec for the One Table, Two Names interactive poster, with the mirrored-table layout, six matched dish pairs, sources, items to verify, and open questions for the author.
---

# Spec: One Table, Two Names

**Status:** spec and draft data only. No image has been generated, and there is
no `index.md` or `main.html` yet, so this poster is not in the nav.

## Learning Objective

The learner will match six Turkish and Greek dish pairs, give both names for
each, and explain, without taking a side, why the two kitchens share so many
dishes: one empire for centuries, and the population exchange of 1923.

## Why This Poster

The trip begins at a Turkish meze table on Day 4 and ends with Greek coffee on
Day 13, and the book keeps noticing the same dishes under two names. The matched
list sits in one table in [Chapter 15](../../chapters/15-athens-acropolis/index.md)
(*Shared Greek-Turkish Dishes*), and the rest is spread over Chapters
[3](../../chapters/03-istanbul-two-continents/index.md),
[6](../../chapters/06-bazaars-scripts-presses/index.md),
[16](../../chapters/16-athens-agora-democracy/index.md), and
[20](../../chapters/20-athens-museums-city-today/index.md). A single picture
of one table, with the same plate on both sides, makes the point before any text
does. It is an **empathy poster**: the aim is that a traveler sits down on
either shore and recognizes the food. The 1923 exchange is the reason the two
tables are so alike, and also a loss that both communities still remember
([Chapter 7](../../chapters/07-end-of-empire-modern-turkey/index.md)).

## Layout Decision

The idea in [Poster Ideas](../poster-ideas.md) put the Turkish half on the left
and the Greek half on the right. This spec turns the table the other way:
**one long table seen from above, with a thin runner down its length, the
Turkish dishes above the runner and the Greek dishes below it**, so each pair
sits in the same column, one over the other. Reasons:

- A zone must be one rectangle, and a pair that crosses the runner is then one
  tall column. A left/right split would need a wide row for each pair and chips
  too small to read.
- Six columns leave room for a chip over each pair at the top of the table.
- Diners facing each other across a table is the picture the poster wants.

The order of the columns follows a meal: three cold meze, the drink that goes
with them, the sweet, and the coffee.

| Column | Turkish | Greek | Zone id | Main chapters |
|---|---|---|---|---|
| 1 | Yaprak sarma, dolma | Dolmades | `vine-leaves` | 6, 15 |
| 2 | Cacık | Tzatziki | `yogurt-dip` | 15, 12, 3 |
| 3 | Patlıcan salatası, karnıyarık | Melitzanosalata, papoutsakia | `eggplant` | 6, 15, 7 |
| 4 | Rakı | Ouzo | `anise-spirit` | 6, 16, 14 |
| 5 | Baklava | Baklavas | `baklava` | 5, 15, 3 |
| 6 | Türk kahvesi | Ellinikós kafés | `coffee` | 3, 20 |

The pairs were chosen because the chapters themselves pair them. The table in
Chapter 15 also pairs *gyros* with *döner*, *keftedes* with *köfte*, and
*loukoumi* with *lokum*. They are left out to keep six columns. See the open
questions.

## What Each Zone Says

Each zone has the same shape: both names, what the dish is, one shared root, one
place the pair breaks, and where we meet it on the route. The break is a
different kind in each column, so the poster avoids saying that every pair is
the same dish.

| Zone | Where the pair breaks |
|---|---|
| Vine leaves | Hardly at all. The names differ. |
| Yogurt dip | The Turkish version is often thinner (Chapter 15). |
| Eggplant | Papoutsakia wear béchamel and karnıyarık does not; Greek moussaka's béchamel is credited to the early 20th century. |
| Anise spirit | Strength (about 45 and about 40 percent), and the Cretan *raki* that has no anise. |
| Baklava | The names match but the ownership claims are argued among Turks, Greeks, and Arabs. |
| Coffee | The drink is the same, but "Greek coffee" is a name that replaced an older one after 1974. |

The draft facts are in `data.json`. Every fact is from the cited chapter
sections, and none claims who invented what.

## Tone Rules

1. **Never argue about who invented what.** The chapters say that this is asked
   in both countries, often with feeling, and that the honest answer is that
   each dish belongs to everyone who cooked it. The poster repeats that and
   goes no further.
2. **Same plates, both sides.** The dishes are drawn as near twins, with only the
   differences the chapters give (a thinner dip, a béchamel on one stuffed
   eggplant, a glass of water beside the Greek coffee). No difference the
   chapters do not give.
3. **No national symbols.** No flags, crescents, crosses, national colors, or
   costume. The tablecloth is the same on both halves.
4. **The 1923 exchange is a loss on both sides.** Say that families on both
   shores were uprooted, as Chapter 7 does. Never use it as a punchline or
   frame one side as the victim.
5. **The Cyprus fact is stated as the chapter states it**, as the reason the
   name came to feel wrong to many Greeks. The zone does not say who was
   right.
6. **Alcohol is a choice.** The spirit zone says many Turks do not drink and
   declining is polite, as Chapter 6 does.

## Quiz

Ten questions are drafted in `data.json`, at least one per zone, with three
zones asked about twice. They ask about ideas (contested ownership, a name that
changed, one word with two drinks) and not about what is drawn.

## To Verify Before Approval

None of these is in `data.json`.

1. **Preparation differences beyond the few the chapters give.** Fillings of
   vine leaves, how rakı and ouzo are distilled, the syrup and nuts of each
   baklava, and the thickness of both dips are not in the chapters, apart from
   the one-line differences listed above. The idea entry called baklava a
   "honey pastry". The chapters say syrup, so the data does too.
2. **A kebab or döner pair.** Chapter 15 pairs gyros with döner, and Chapter 15
   also says gyros reached Greece in the 20th century, probably first with
   refugees from Anatolia ("probably" is the chapter's word). If you add the
   pair, keep that hedge.
3. **Greek spellings.** Chapter 15 uses "Elliniko kafe", Chapter 20 uses
   *ellinikós kafés*. The data uses the Chapter 20 form for the coffee, and
   Chapter 15's forms for the rest. Check the transliterations in one pass.
4. **The Turkish half of "Greek coffee".** Chapter 20 says Greeks "usually
   called it Turkish coffee too" until the 1970s. How and when the Turkish
   name arose in Greek is not given. Do not add a date before 1970.
5. **Day numbers.** The coffee route fact uses Day 1 for Turkish coffee because
   Chapter 3 describes it. Change it if your own coffee was on another day.

## Open Questions for the Author

1. **Six columns or seven?** Seven pairs would make each column 215 px wide and
   the chips would need labels of about nine characters. The strongest
   candidates are döner and gyros, and lokum and loukoumi. If you prefer a
   kebab pair, I would swap it for the yogurt dip, not add a seventh column.
2. **Add people?** The prompt draws no people, so no skin tones, clothes, or
   faces need to be chosen. If you want hands passing a plate across the
   runner, say so, and the prompt will add two hands in the baklava column,
   below the plain label band.
3. **Left and right instead of top and bottom?** Possible, with six wide rows
   and chips over each row. The dishes would be smaller. I recommend the
   top-and-bottom layout above.
4. **Where does the 1923 story live?** It appears in the vine-leaves and
   eggplant zones and is the topic of a sim. A seventh zone for "the table
   itself" is possible but does not fit the one-pair-per-zone rule.
5. **Companion sims.** The lesson page should link
   [Reading Food in Layers](../../sims/food-history-layers-sorter/index.md),
   [Who Was Exchanged in 1923?](../../sims/population-exchange-1923-cases/index.md),
   and [Source, Myth, or Contested?](../../sims/source-myth-or-contested/index.md)
   for the baklava question.
6. **Canvas.** If your image tool can produce 1792 x 1024, the columns would be
   about 290 px wide. If you switch, tell me and I will recompute the zones
   and the prompt.

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Draft. Six zones, ten quiz questions. Zone rectangles are computed from the layout in the prompt (16 px margin, six columns of 250.7 px, minus 2 px at each edge) and must be re-measured against the generated image. |
| `one-table-two-names.png` | Not generated. |
| `main.html`, `one-table-two-names.js`, `index.md`, `metadata.json` | Not created. Copy them from the Oracle and Algorithm poster once the image exists. |

## Next Steps

1. Author reviews the spec and the prompt and decides the open questions.
2. Author generates the image and saves it as `one-table-two-names.png` in this
   directory.
3. Re-measure the six column edges and check that each chip label fits on one
   line over a 250 px column.
4. Resolve the "To verify" items, then build `index.md` with
   `status: scaffold`, then `built`. Only the author sets `approved`.
