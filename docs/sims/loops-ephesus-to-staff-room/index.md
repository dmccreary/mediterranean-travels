---
title: "Reinforcing or Balancing? Loops From Ephesus to the Staff Room"
description: "Classify six causal loops, two from Paul's world and four from school change, as reinforcing or balancing by counting the minus signs around each one, and see that harmful loops can be reinforcing and that the Ephesus riot has the same structure as a rollout pushback."
status: built
image: /sims/loops-ephesus-to-staff-room/loops-ephesus-to-staff-room.png
og:image: /sims/loops-ephesus-to-staff-room/loops-ephesus-to-staff-room.png
twitter:image: /sims/loops-ephesus-to-staff-room/loops-ephesus-to-staff-room.png
social:
   cards: false
quality_score: 100
---

# Reinforcing or Balancing? Loops From Ephesus to the Staff Room

<iframe src="main.html" height="564px" width="100%" scrolling="no" title="Classify six causal loops as reinforcing or balancing by counting minus signs"></iframe>

[Run the Reinforcing or Balancing? MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A causal loop diagram draws a chain of cause and effect that circles back on
itself. Each arrow carries a sign: **+** when the two variables move in the
same direction, **−** when they move in opposite directions. A loop is
**reinforcing** when a change comes back around amplified, and
**balancing** when it comes back pushing the other way. The rule for telling
them apart is simple enough to apply without any intuition about the
variables:

> Count the minus signs around the whole loop. An even number, including
> zero, makes the loop reinforcing; an odd number makes it balancing.

This MicroSim gives six loops, one at a time:

| # | Setting | Loop |
|---|---|---|
| 1 | School | Student results → teacher confidence → quality of use → student results |
| 2 | School | Rollout speed → teacher overload → resistance → rollout speed |
| 3 | School | New initiatives → change fatigue → effort on each → student results → new initiatives |
| 4 | Ephesus | Converts to Paul's message → sales of silver shrines → silversmiths' opposition → converts |
| 5 | Corinth | Honor given to weaker members → sense of belonging → care for one another → honor |
| 6 | School | Pressure for quick results → teachers' fear of mistakes → practice → student results → pressure |

Loops 1 and 2 are the worked example in *AI-Native Schools*, Chapter 18,
repeated in this chapter's section on systems thinking. Loop 4 comes from
the silversmiths' riot in Acts 19 and from Pliny the Younger's letter to the
emperor Trajan of about 112 CE, which reports the same economic pattern in
Bithynia. Loop 5 is Paul's picture of one body with many parts
(1 Corinthians 12). Loops 3 and 6 come from the chapter's sections on change
fatigue and the implementation dip. All six are illustrative simplifications;
real systems have many more links.

The set is built to break three habits. Reinforcing does not mean good:
loops 3 and 6 are harmful, and both are reinforcing. A minus sign does not
make a loop balancing: loops 3 and 6 each have two. And the number of boxes
decides nothing: three-box loops appear among both the reinforcing and the
balancing loops. Structure, not
setting, decides behavior, which is why the Ephesus loop and the school
rollout loop push back in the same way.

## How to Use

1. Read the loop. Hover over any arrow to read what the link means, for
   example "more fatigue, less effort on each." The **+**, **−**, and
   **Reset view** buttons zoom; drag the background to pan.
2. Count the red minus signs around the whole loop, then select
   **Reinforcing** or **Balancing** (or press **R** or **B**) and press
   **Submit**.
3. If the first answer is wrong, the sim gives a hint and one more try. The
   second answer does not change the score; after it, the correct type is
   shown and the loop counts as missed.
4. Once a loop is answered, its marker turns into **R** or **B** and the
   minus signs are numbered, so the count is visible. Press **Next loop**.
5. After loop 6, press **See summary** for a table of all six loops with
   their minus-sign counts and types. **Try again** restarts from loop 1.

## Lesson Plan

**Audience:** adult travelers, especially teachers and school leaders, who
have read Part Seven of Chapter 11.  
**Duration:** 10–15 minutes.  
**Prerequisites:** systems thinking, feedback loops, reinforcing and
balancing loops, the counting rule, one body many parts, the economics of
resistance, the implementation dip, and change fatigue (all in Chapter 11).  
**Learning objective (Bloom: Analyze):** Differentiate reinforcing from
balancing feedback loops by counting the minus signs around each of six
causal loops, classifying at least 5 of 6 correctly on the first attempt.

### Activities

1. **Predict (2 min):** Before starting, guess: is a loop that ends in
   falling student results reinforcing or balancing? Write the guess down.
2. **Classify (6 min):** Work through the six loops. For each, trace one
   push around the loop out loud ("more initiatives, more fatigue, less
   effort...") before counting.
3. **Compare (4 min):** Open the summary. Find the two harmful loops and
   their type. Then compare loops 2 and 4: what plays the role of resistance
   in Ephesus?
4. **Apply (3 min):** Pick one loop from your own school or workplace. Draw
   it with three or four variables, mark each link's sign, and classify it.

### Assessment

Mastery is 5 of 6 correct on the first attempt. As a follow-up, ask: *A
principal says, "Our results are dropping, so we are launching two new
programs this year." Which loop is this, and what would weaken it?* A strong
answer names loop 3, identifies it as reinforcing because it has two minus
signs, and proposes cutting the number of initiatives so that effort on each
can recover.

## Editing the Layout

Add `?edit=true` to the URL to reposition the diagrams:

[Open the Layout Editor](main.html?edit=true){ .md-button }

In edit mode we can drag every box and every loop marker, and the markers
show R or B from the start. Use **← Loop** and **Loop →** to move between
the six loops. Click an arrow, or its sign, to select it, then use **Flip
Curve**, **Curve −**, **Curve +**, or **Straight** to reshape it. The layout
is kept in this browser as we work, so a reload does not lose it. **Reset
Layout** discards it and reloads the layout from the JSON file. When the
layout looks right, press **Copy JSON** or **Download JSON** and replace the
contents of `loops-ephesus-to-staff-room-cld.json` with the result. All six
loops live in that one file; each node's `loop` field says which loop it
belongs to.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/loops-ephesus-to-staff-room/main.html"
        height="564px"
        width="100%"
        scrolling="no"
        title="Classify six causal loops as reinforcing or balancing by counting minus signs"></iframe>
```

## References

1. [*AI-Native Schools*](https://dmccreary.github.io/ai-native-schools/),
   [Sustaining Change: Systems Thinking and National Adoption](https://dmccreary.github.io/ai-native-schools/chapters/18-sustaining-change-systems-thinking/).
   The two rollout loops used as loops 1 and 2.
2. Donella H. Meadows, *Thinking in Systems: A Primer* (Chelsea Green,
   2008). Stocks, flows, and reinforcing and balancing feedback.
3. Peter M. Senge, *The Fifth Discipline: The Art and Practice of the
   Learning Organization* (Doubleday, 1990). Systems thinking as a
   discipline of organizations.
4. [Causal loop diagram](https://en.wikipedia.org/wiki/Causal_loop_diagram) —
   Wikipedia. Link polarity and the rule for classifying loops.
5. Michael Fullan, *Leading in a Culture of Change* (Jossey-Bass, 2001). The
   implementation dip.
6. Eric Abrahamson, "Change Without Pain," *Harvard Business Review*
   (July–August 2000). Repetitive change syndrome, the source of loop 3.
7. Acts 19:23–41 (the silversmiths' riot) and 1 Corinthians 12 (one body,
   many parts), in any modern translation; Pliny the Younger, *Letters*
   10.96, on the Christians of Bithynia. See
   [Pliny the Younger on Christians](https://en.wikipedia.org/wiki/Pliny_the_Younger_on_Christians) — Wikipedia.
8. [vis-network](https://visjs.github.io/vis-network/docs/network/) —
   vis-network 9.1.9, the network library.
