---
title: "Antikythera Gears"
description: "Explore how gear tooth counts produce simplified Sun, Moon, and Mars cycles."
status: built
image: /sims/antikythera-gears/antikythera-gears.png
og:image: /sims/antikythera-gears/antikythera-gears.png
twitter:image: /sims/antikythera-gears/antikythera-gears.png
social:
  cards: false
quality_score: 100
---

# Antikythera Gears

<iframe src="main.html" height="699px" width="100%" scrolling="no" title="Simplified Antikythera gear model"></iframe>

[Run the Antikythera Gears MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A gear train turns tooth counts into a calculation. Here, three expanded
trains share the same time input: every tan gear on the left turns once per
model year. The colored output gears represent simplified Sun, Moon, and Mars
cycles. Numbers inside the gears are tooth counts; the dark spokes show rotation.
The counters show total output turns since the starting position, ignoring direction.

For two meshing gears, the output speed is the input speed multiplied by the
number of driver teeth divided by the number of driven teeth. The direction
reverses at each mesh. A larger gear driving a smaller gear increases speed.

| Output | Tooth-count calculation | Turns per model year |
|---|---|---|
| Sun | 48 / 48 | 1 |
| Moon | (48 / 12) × (39 / 12) | 13 |
| Mars | 24 / 48 | 0.5 |

The Moon's 12-tooth intermediate gear and 39-tooth driver share a rigid axle,
so they turn together. They are drawn apart and joined by a dashed line to
make both stages visible. The dashed line represents that shared axle, not
another pair of meshing gears. Likewise, the three left input gears are
separated for readability; their common drive is omitted.

## How to Use

1. Leave the model paused and drag **Year** to compare any time from zero to two years. The slider also works backward.
2. Use **+1 month** to advance by one twelfth of a model year. Each step pauses playback.
3. Press **Start** to watch the meshing gears. Adjust **Speed** to change playback speed without changing any ratios.
4. Press **Pause** to inspect a position, or **Reset** to restore time zero and the default speed. Playback stops at two years; Start then begins again at zero.

At one year, the output counters read **1, 13, and 0.5**. At two years,
they read **2, 26, and 1**. The small Moon gear moves quickly because both
stages multiply its speed.

## What We Simplified

This is an Antikythera-inspired teaching model, **not a reconstruction of the
ancient gear arrangement**. Its tooth counts were chosen for easy arithmetic.
The annual Sun cycle, 13 lunar circuits per year, and two-year Mars orbital
cycle are rounded teaching values. The lunar circuit is a circuit relative to
the stars, not a new-moon-to-new-moon phase cycle. Mars's orbital cycle is not
its apparent geocentric motion or its interval between oppositions.

The model omits lunar phases, variable orbital speed, retrograde motion,
eclipse prediction, calendar spirals, and the other planets. Gear rotation
direction is a mechanical consequence of meshing, not a prediction of which
way a body moves across the sky. The triangular teeth are a schematic drawing,
not a manufacturing template.

Read the [Antikythera mechanism appendix](../../appendices/antikythera-mechanism.md)
for the historical setting and the more complex functions of the original.

## Lesson Plan

**Audience:** adult travelers and introductory science learners.  
**Duration:** 10–15 minutes.  
**Prerequisites:** fractions, multiplication, and the idea of a rotating axle.  
**Learning objective (Bloom: Apply):** Calculate output turns from gear tooth
counts and test the calculation by changing the model's time input.

### Activities

1. **Predict:** Before moving the time slider, calculate the three output counts after half a year.
2. **Test:** Set Year to 0.500. Compare the counters with your prediction: Sun 0.50, Moon 6.50, Mars 0.25.
3. **Trace:** Follow the Moon train. Explain why the dashed axle connection preserves speed while each meshing pair changes it.
4. **Compare:** Advance to one year, then two years. Identify which output completes a turn last.

### Assessment

If the Mars driver had 48 teeth instead of 24, how many turns would its
48-tooth output make in one year? Explain using the ratio before answering:
48 / 48 gives **one turn**. This is a paper calculation; the model's tooth
counts remain fixed.

## Iframe Embed Code

Copy this iframe to your website:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/antikythera-gears/main.html"
        height="699px" width="100%" scrolling="no"
        title="Simplified Antikythera gear model"></iframe>
```

To experiment with the code, copy [antikythera-gears.js](antikythera-gears.js)
into the [p5.js Editor](https://editor.p5js.org/) using p5.js 2.3.4.

## References

1. [A Model of the Cosmos in the ancient Greek Antikythera Mechanism](https://doi.org/10.1038/s41598-021-84310-w) — 2021 — Freeth and colleagues, *Scientific Reports*. A research reconstruction; the simplified trains here are not taken from that reconstruction.
2. [p5.js createSlider reference](https://p5js.org/reference/p5/createSlider/) — p5.js documentation for the native time and speed controls.
