---
title: "Spec: A Scribe's Page and an Aldine Page"
description: Build spec for the scribe-and-Aldine poster, with the six feature pairs, sources, items to verify, and open questions for the author.
---

# Spec: A Scribe's Page and an Aldine Page

**Status:** spec and draft data only. No image has been generated, and there is
no `index.md` or `main.html` yet, so this poster is not in the nav.

## Learning Objective

The learner will compare a hand-copied Byzantine page with a small Aldine page
along six features (surface, hand or type, page and size, who made it, how long
it took, and who could own one), and for each pair name where the comparison
stops being fair.

## Why This Poster

Three chapters tell one story in pieces. [Chapter 4](../../chapters/04-byzantine-constantinople/index.md)
gives the Byzantine copyists and the filter of the 9th-century script change.
[Chapter 6](../../chapters/06-bazaars-scripts-presses/index.md) gives the cost of
copying and the press's fixed cost. [Chapter 14](../../chapters/14-venetian-heraklion/index.md)
gives Aldus, the octavo, and the many hands behind an Aldine book. They are
Day 2, Day 4, and Day 9, so a reader meets them a week apart. One picture puts
the two pages side by side and asks the book's third-thread question of each
feature: who is still outside?

## Layout Decision

**Six small diptychs in a 3 × 2 grid, not one picture of two open books.** The
idea entry in [Poster Ideas](../poster-ideas.md) pictures two open books of the
same size, with a zone for each feature. Features such as "how long it took" and
"who could afford it" are not parts of a page, so they have no place on two
open books. They would need captions or labels, which the image cannot carry.
The [Oracle and the Algorithm](../oracle-vs-algorithm/index.md) poster met the
same problem and solved it with six diptychs, so this poster follows it. Each tile keeps the book
idea: a gold seam, like a book's gutter, runs down the middle, with the scribe's
page on the left and the Aldine page on the right. A zone is one whole tile.

| Column 1 | Column 2 | Column 3 |
|---|---|---|
| **1. Writing Surface** | **2. Hand or Type** | **3. Page and Size** |
| **4. Who Made It** | **5. How Long** | **6. Who Could Own** |

The left half is a Byzantine monastery workshop, because Chapter 4's chain
(papyrus, Byzantine minuscule, Italian print) is the one that ends in the 1513
Aldine Plato. The Ottoman copyists of Chapter 6 appear in the facts for tiles 4
and 5.

## The Six Pairs

| Tile | Scribe's page | Aldine page | Where the comparison breaks down | Chapter sections |
|---|---|---|---|---|
| 1. Writing Surface | Parchment from a flock's skins | Handmade paper in sheets | Aldus changed the number of sheets, not the material | 4: Byzantine Manuscript Copying. 14: Aldine Editions |
| 2. Hand or Type | Minuscule, joined-up, from about 800 | Compact italic, modeled on a scholar's hand | A scribe's slip stays in one copy; a type's error is in all | 4: Byzantine Manuscript Copying. 14: Aldine Editions, Marcus Musurus. 6: Gutenberg |
| 3. Page and Size | Layout the copyist's choice, copy by copy | Octavo, 16 pages to a sheet, dense plain page | The chapter compares the octavo with a printed folio, not with a manuscript | 14: Aldine Editions |
| 4. Who Made It | Monks in a scriptorium; Ottoman *müstensih* | Aldus, Musurus, Griffo, Torresani, and others | The Aldine team worked from the scribes' manuscripts | 4: Byzantine Manuscript Copying. 6: Scribes and Copyists. 14: Marcus Musurus, Aldus Manutius |
| 5. How Long | Cost almost all per copy | Cost mostly fixed up front | The numbers are an illustrative model, not historical prices | 6: Scribes and Copyists, The Printing Press |
| 6. Who Could Own | A handful of collections, a paid scribe, a teacher | A student's pocket octavo | The circle widened but not to women, villagers, or non-readers; Aldus built a gate too | 14: Learning for All |

The draft facts are in `data.json`. Each fact is taken from those chapter
sections, so the poster repeats what the book already says.

## Tone Rules

1. **No lettering, anywhere.** Every page, sign, and slip is drawn as blurred
   gray bars. The prompt forbids decorative letters too, so the decorated
   initial is an abstract square of pattern.
2. **No ladder.** The scribe's page is not the "before" of a better after. The
   chapter says copyists decided what the future could read, and also that
   print multiplied errors as freely as truth.
3. **Break each pair.** Every zone carries a fact that begins "Where the pair
   breaks down", as the Oracle and the Algorithm poster does. Tile 3's comes
   before its route line.
4. **Illustrative numbers are labeled.** Tiles 1, 3, and 5 carry numbers from
   the chapters' illustrative models, and each fact says "illustrative" or "in
   the chapter's example".
5. **Respect for the Islamic calligraphic tradition.** The Ottoman copyists
   appear in facts as skilled calligraphers, not as a foil for print.

## Quiz

Ten questions are drafted in `data.json`: two each for tiles 2, 4, 5, and 6 and
one each for tiles 1 and 3. They ask about features and ideas, not about which
half is drawn on which side. The sample question from the idea entry ("Which
feature let a scholar carry a classic in a pocket?") is question 1.

## To Verify Before Approval

These are not in the chapters, so none of them is in `data.json`.

1. **Whether parchment is a fair "scribe" surface.** The chapters give Byzantine
   parchment, but they do not say which manuscripts used paper instead.
   Scribes also wrote on paper, so the surface pair is not strictly a scribe
   against a press. The zone says only that Aldus changed the number of
   sheets.
2. **A wide margin and a decorated initial.** The chapters do not describe a
   Byzantine page's layout. The picture's large margin and initial are an
   illustrator's choices for tile 3.
3. **Sizes and prices.** The chapters give formats (folio, quarto, octavo) and
   the "portable little books" description but no centimeters, no price of an
   Aldine octavo, and no price of a manuscript.

## Open Questions for the Author

1. **Facing pages or six diptychs?** The prompt follows the Oracle poster. The
   alternative is a literal spread of two open books with only two zones,
   which loses the pair-by-pair quiz.
2. **A seventh pair: who checked it?** Chapter 14's editor (collation and
   emendation, Musurus and Plato) and the copyists' slips are a strong pair, but
   the image would need a 4 + 3 layout.
3. **Which scribe on the left?** The Byzantine copyist ties to Plato's chain.
   An Ottoman calligrapher would tie to Chapter 6's roundels and to Day 4.
4. **Companion sims.** The lesson page should link
   [Scribe or Press?](../../sims/scribe-or-press/index.md),
   [Folding the Sheet - Folio, Quarto, Octavo](../../sims/folio-quarto-octavo-paper-calculator/index.md),
   [Who Made a Greek Book in Venice?](../../sims/greek-book-makers-venice-network/index.md),
   and [When Printing Arrived](../../sims/when-printing-arrived/index.md).

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. Tile 2 and tile 3 are the riskiest, because of the rule against any letters. |
| `data.json` | Drafted. Six zones and ten questions. The rectangles are computed from the layout in the prompt (24 px margin and gap) and need re-measuring against the real image. |
| `scribe-and-aldine-page.png` | Not generated. |
| `main.html`, `scribe-and-aldine-page.js`, `index.md`, `metadata.json` | Not created. |

## Next Steps

1. Author reviews the prompt and the open questions, and generates the image.
2. Re-measure the six rectangles with `main.html?edit=true` once the image
   exists.
3. Create `index.md` with `status: scaffold`, then `built`. Only the author sets
   `approved`.
