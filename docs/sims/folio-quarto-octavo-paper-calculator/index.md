---
title: "Folding the Sheet: Folio, Quarto, Octavo"
description: "Calculate the pages and sheets of paper in one copy of Virgil printed as a folio with commentary, a plain octavo, and an Aldine-style octavo in compact italic, and see a sheet fold into 2, 4, or 8 leaves."
status: built
image: /sims/folio-quarto-octavo-paper-calculator/folio-quarto-octavo-paper-calculator.png
og:image: /sims/folio-quarto-octavo-paper-calculator/folio-quarto-octavo-paper-calculator.png
twitter:image: /sims/folio-quarto-octavo-paper-calculator/folio-quarto-octavo-paper-calculator.png
social:
   cards: false
quality_score: 100
---

# Folding the Sheet: Folio, Quarto, Octavo

<iframe src="main.html" height="624px" width="100%" scrolling="no" title="Calculate the paper in a folio, quarto, or octavo Virgil"></iframe>

[Run the Folding the Sheet MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Early books were printed on large sheets of handmade paper, then folded and
cut. The number of folds sets the format:

| Format | Folds | Leaves per sheet | Pages per sheet |
|---|---|---|---|
| Folio | 1 | 2 | 4 |
| Quarto | 2 | 4 | 8 |
| Octavo | 3 | 8 | 16 |

Paper was one of the largest costs of an early book, so the number of sheets a
copy needs is close to a measure of its price. This calculator holds the text
fixed, Virgil's *Eclogues*, *Georgics*, and *Aeneid*, about 12,900 lines in
all, and asks us to work out the paper for three editions:

1. A folio with the verses surrounded by commentary, 15 lines of Virgil per page.
2. An octavo with the same 15 lines per page.
3. An Aldine-style octavo in compact italic with no commentary, 30 lines per page.

Two rules do all the work. Pages equal the lines divided by the lines per
page, and sheets per copy equal the pages divided by the pages per sheet.
Both round up, because a part-page is still a page, and a part-sheet still
has to be bought. Challenge 2 changes only the fold, and challenge 3 changes
only the page density, so we can see how much each choice saves: the fold
cuts the paper from 215 sheets to 54, and the denser page halves it again to
27, about one-eighth of the folio.

When we press **Check**, a drawing folds a sheet into the challenge's format,
draws one leaf at the same scale, and lists the two pages printed on each
leaf. The lines per page are illustrative round numbers, not measurements of
real editions.

## How to Use

1. Read the challenge: the format and the lines of Virgil per page.
2. Type the pages per copy and the sheets per copy, then press **Check** (or
   Enter). Each challenge allows two attempts.
3. A wrong first attempt gets a hint. A wrong second attempt shows the worked
   calculation, and the challenge counts as missed.
4. Press **Next challenge**. The bars at the bottom fill in as each challenge
   is settled, and "Challenges correct" counts the ones you got right.
5. After challenge 3, press **Start exploring**. The format menu and the
   sliders for lines per page (10 to 40) and copies (100 to 2,000) unlock,
   and the pages, sheets per copy, and sheets per edition update at once.
6. **Reset** starts the three challenges again.

## Lesson Plan

**Audience:** adult travelers preparing for the trip.  
**Duration:** 10 to 15 minutes.  
**Prerequisites:** sheet, folio, quarto, octavo, italic type, commentary, and
Aldine editions.  
**Learning objective (Bloom: Apply):** Calculate the number of pages and
sheets of paper needed for one copy of Virgil's works in folio, quarto, or
octavo format at a given number of lines per page, getting all three
challenge calculations exactly right within two attempts each.

### Activities

1. **Fold a real sheet (3 min):** Take a sheet of printer paper and fold it
   once, twice, and three times. Count the leaves after each fold, then
   number the pages front and back. Compare with the table above.
2. **Calculate (6 min):** Work the three challenges without a calculator
   first, then check. Write down which rule caught you: the fold, or the
   rounding.
3. **Explore (4 min):** With the format on Octavo, move the lines per page
   from 15 to 30 and watch the sheets per copy halve. Then set Folio, 15
   lines, and 1,000 copies, and compare the sheets per edition with Octavo,
   30 lines.

### Assessment

Mastery is all three challenges correct within two attempts each. As a
follow-up, ask: *A quarto Virgil prints 20 lines per page. How many sheets
does one copy need?* A strong answer finds 12,900 ÷ 20 = 645 pages, then
645 ÷ 8 = 80.6, rounded up to 81 sheets.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/folio-quarto-octavo-paper-calculator/main.html"
        height="624px"
        width="100%"
        scrolling="no"
        title="Calculate the paper in a folio, quarto, or octavo Virgil"></iframe>
```

## References

1. [Book size](https://en.wikipedia.org/wiki/Book_size) — Wikipedia. Folio, quarto, and octavo as one, two, and three folds of the sheet, giving 2, 4, and 8 leaves.
2. [Aldine Press](https://en.wikipedia.org/wiki/Aldine_Press) — Wikipedia. Aldus Manutius's small octavo classics, beginning with the Virgil of 1501.
3. [Italic type](https://en.wikipedia.org/wiki/Italic_type) — Wikipedia. The italic cut for Aldus by Francesco Griffo and first used for a whole book in the 1501 Virgil.
4. [Aeneid](https://en.wikipedia.org/wiki/Aeneid) — Wikipedia. The poem's length of 9,896 lines.
5. [Georgics](https://en.wikipedia.org/wiki/Georgics) and [Eclogues](https://en.wikipedia.org/wiki/Eclogues) — Wikipedia. The *Georgics* run to 2,188 lines and the ten *Eclogues* average about 83 lines each, so the three works total about 12,900 lines.
6. [Gaskell, Philip. *A New Introduction to Bibliography*](https://en.wikipedia.org/wiki/Philip_Gaskell) — Oxford: Clarendon Press, 1972. The standard account of how hand-press books were imposed, folded, and gathered.
7. [p5.js](https://p5js.org/) — p5.js 2.3.4, the library used to draw the sheet and the bars.
