# Color Theme Design Log

- **Date:** 2026-11-24
- **Book:** Mediterranean Travels
- **Model:** Claude Opus 5.5 (Claude Code)
- **Result:** Five candidate themes proposed. The author chose **Theme 3,
  Terracotta and olive**, which is now live in `mkdocs.yml` and
  `docs/css/extra.css`.

## Summary

The book had Material's stock `blue` header with an `amber` accent. The same
session made Glaux the owl the header logo, which prompted a look at whether
the palette suited the trip. Claude proposed five Mediterranean-inspired
themes with mock header previews. The author picked Terracotta and olive.
Claude applied it as a Material `custom` palette and checked it with
`mkdocs build --strict` and the live `mkdocs serve` page.

## Design Inputs

The palettes were chosen to fit three things:

1. **The trip itself.** The itinerary runs from Istanbul through Troy,
   Ephesus, Rhodes, and Crete to Athens and Delphi. Each theme borrows its
   colors from something the traveler will actually see: Greek flags and
   island domes, Ottoman tiles, roof tiles and olive groves, Byzantine
   mosaics.
2. **The mascot.** Glaux sits in the upper-left corner of every page, so the
   header color has to suit the owl. Glaux has tan and brown feathers, a
   teal-blue scarf, and an olive satchel. Theme 5 takes its colors straight
   from the mascot, and the olive in Theme 3 matches the satchel.
3. **The cover.** `docs/img/cover.png` is still the generic "Intelligent
   Textbook" placeholder, so it set no constraint. When a real cover is made,
   its prompt should use the chosen palette.

## Design Rules

Every theme follows the same structure so they can be compared fairly:

- **Primary color:** a deep, saturated color for the header bar and the body
  link color. It must be dark enough for white header text. The target is
  WCAG AA, a contrast ratio of 4.5:1 or more against white.
- **Accent color:** a second color from the same place or culture. Material
  uses it for link hover, focused search, and selected controls.
- **No Material named colors.** Material's built-in names (`blue`, `teal`,
  `brown`, …) are generic and none of them matched these places. Every theme
  uses `primary: custom` and `accent: custom` with hex values in CSS.
- **Light and dark shades.** Material also wants a lighter and a darker shade
  of the primary color for some details. These were set by hand about 10–15%
  lighter and darker than the main color.

## The Five Options

The contrast ratios below were computed with the WCAG 2 relative-luminance
formula. 4.5:1 is the AA minimum for normal text, and 3:1 for large text and
interface elements.

| # | Theme | Primary | Accent | Primary vs. white | Accent vs. white |
|---|---|---|---|---|---|
| 1 | Aegean | `#0D5EAF` | `#F2C14E` | 6.5:1 | 1.7:1 |
| 2 | Iznik tile | `#1F4E8C` | `#2BA3A3` | 8.3:1 | 3.1:1 |
| 3 | **Terracotta and olive** (chosen) | `#A4482A` | `#6B7A3A` | 5.9:1 | 4.7:1 |
| 4 | Byzantine purple and gold | `#4E2A63` | `#C9A227` | 11.4:1 | 2.4:1 |
| 5 | Glaux's scarf | `#2F6A88` | `#B5793E` | 5.9:1 | 3.6:1 |
| – | *Previous: Material `blue` / `amber`* | `#2196F3` | `#FFC107` | 3.1:1 | 1.6:1 |

### 1. Aegean

- **Inspiration:** the blue and white of the Greek flag and the domes of the
  Cyclades, with a sun-gold accent.
- **Primary `#0D5EAF`:** close to the flag's official blue. It is the
  smallest change from the old header, and it says "Greek islands" at a
  glance.
- **Accent `#F2C14E`:** a warm Aegean sun gold that looks good on the blue
  header.
- **Caveat:** at 1.7:1 the gold is too light to use as hover text on a white
  page. Using this theme would need a darker gold for hover, such as `#946C08`
  (4.8:1).
- **Status:** this was Claude's recommendation, as the closest to the old
  look.

### 2. Iznik tile

- **Inspiration:** the cobalt and turquoise of the 16th-century Iznik tiles
  in the Blue Mosque, Topkapı Palace, and Rüstem Pasha Mosque.
- **Primary `#1F4E8C`:** cobalt, the dominant tile blue.
- **Accent `#2BA3A3`:** the turquoise used beside it. Picked as the
  alternative if the Turkish chapters (3–8) should set the tone.
- **Caveat:** at 3.1:1 the turquoise is fine for interface elements but
  slightly weak as hover text.

### 3. Terracotta and olive (chosen)

- **Inspiration:** the fired-clay roof tiles and amphorae seen everywhere
  from Ephesus to Heraklion, and the olive groves of the Aegean coast. This
  is the earthy, warm option. It covers both Turkey and Greece rather than
  either one.
- **Primary `#A4482A`:** a burnt terracotta. It was darkened from a brighter
  clay orange so that white header text passes AA (5.9:1).
- **Accent `#6B7A3A`:** a muted olive green that matches Glaux's satchel. It
  is the only accent of the five that comes close to AA as hover text on
  white (4.7:1), so hovered links stay readable.
- **Caveat:** olive on terracotta is only 1.3:1, so the accent should never
  be used as text on the header bar. Material doesn't use it there by
  default.

### 4. Byzantine purple and gold

- **Inspiration:** imperial purple and the gold mosaic backgrounds of Hagia
  Sophia, for the Byzantine Constantinople chapter (4).
- **Primary `#4E2A63`:** a deep imperial purple. It has the highest contrast
  of the five (11.4:1).
- **Accent `#C9A227`:** mosaic gold.
- **Caveat:** it is the darkest and most formal option and may feel heavy
  for a travel guide. The gold is too light as hover text on white (2.4:1).

### 5. Glaux's scarf

- **Inspiration:** the mascot. The primary is Glaux's teal-blue scarf and the
  accent is the tan of the owl's feathers. This makes the header and logo
  read as one design.
- **Primary `#2F6A88`:** scarf teal-blue, darkened for 5.9:1 with white.
- **Accent `#B5793E`:** feather tan.
- **Caveat:** the colors aren't tied to any one place, so the theme says
  less about the Mediterranean than the others.

## Preview Method

Each option was shown as a mock site header containing:

- the primary color as the header bar,
- a tan circle with a teal ring standing in for the owl logo,
- a sample "Chapter N" label in a lighter tint of the accent,
- primary and accent swatches with hex codes.

The lighter accent tints in the mockups (`#F2C14E`, `#5FD0CC`, `#D9E3A6`,
`#E0BE52`, `#E2B27A`) were for the preview only and are not in the site CSS.

## How the Chosen Theme Was Applied

`mkdocs.yml`:

```yaml
theme:
  palette:
    # Terracotta and olive theme; colors are defined in docs/css/extra.css
    primary: custom
    accent: custom
```

`docs/css/extra.css`, added at the top of the file:

```css
[data-md-color-primary="custom"] {
    --md-primary-fg-color:        #A4482A;  /* terracotta: header, links */
    --md-primary-fg-color--light: #C2654A;
    --md-primary-fg-color--dark:  #85361C;
    --md-primary-bg-color:        #FFFFFF;
    --md-primary-bg-color--light: rgba(255, 255, 255, 0.7);
}
[data-md-color-accent="custom"] {
    --md-accent-fg-color:              #6B7A3A;  /* olive: hover, focus */
    --md-accent-fg-color--transparent: rgba(107, 122, 58, 0.1);
    --md-accent-bg-color:              #FFFFFF;
    --md-accent-bg-color--light:       rgba(255, 255, 255, 0.7);
}
```

To switch to another theme later, change only the hex values in these two
blocks. Nothing in `mkdocs.yml` needs to change.

## Verification

- `mkdocs build --strict` passes.
- The built HTML has `data-md-color-primary="custom"` and
  `data-md-color-accent="custom"`.
- On the live `mkdocs serve` page, the header background computes to
  `rgb(164, 72, 42)` (`#A4482A`), and a body link ("Trip Description") is the
  same terracotta.
- **Not checked:** the owl logo against the new header. The browser pane was
  narrower than Material's 1220 px breakpoint, which hides the logo. If the
  owl's tan feathers blend into the terracotta, a darker primary such as
  `#8E3B20` (7.5:1 with white) would fix it.

## Related Changes in the Same Session

- Header logo set to `docs/img/logo.png`, a 109×128 px, 30 KB copy of
  `docs/img/mascot/welcome.png`. The 1.8 MB original was too large to load
  on every page.
- `docs/img/favicon.ico` generated from `welcome.png` with the book-installer
  `generate-favicon.py` script.
- Gray circle and drop shadow behind the header logo removed from
  `docs/css/extra.css`.
