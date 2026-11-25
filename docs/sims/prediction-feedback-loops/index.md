---
title: "When a Prediction Feeds Itself"
description: "Label every link in three prediction loops, from predictive policing and student risk scores to a traffic forecast on the road to Delphi, as same or opposite direction, then classify each loop as reinforcing (self-fulfilling) or balancing (self-defeating)."
status: built
image: /sims/prediction-feedback-loops/prediction-feedback-loops.png
og:image: /sims/prediction-feedback-loops/prediction-feedback-loops.png
twitter:image: /sims/prediction-feedback-loops/prediction-feedback-loops.png
social:
   cards: false
quality_score: 0
---

# When a Prediction Feeds Itself

<iframe src="main.html" height="614px" width="100%" scrolling="no" title="Label the links in three prediction loops and classify each as reinforcing or balancing"></iframe>

[Run the When a Prediction Feeds Itself MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

A weather forecast cannot change the weather, but a prediction about people
can change the people, and the changed behavior becomes the data from which
the next prediction is learned. This causal loop diagram takes three such
loops apart link by link.

| Loop | Links | Opposite (−) links | Type |
|---|---|---|---|
| 1 | Predicted crime → patrols sent → crimes recorded → predicted crime | 0 | Reinforcing |
| 2 | Risk score → lower-level placement → challenging coursework → grades → risk score | 2 (L5, L7) | Reinforcing |
| 3 | Predicted 9 AM traffic → drivers who leave early or reroute → 9 AM traffic → predicted traffic | 1 (L9) | Balancing |

A **same direction (+)** link means that if the first factor rises, the
second rises, and if it falls, the second falls. An **opposite direction
(−)** link means the reverse. A **reinforcing** loop sends a change around
and brings it back larger, in the same direction: a self-fulfilling
prediction. A **balancing** loop brings the change back opposed: a
self-defeating prediction. The counting rule follows: an even number of
opposite links, including zero, makes a loop reinforcing; an odd number
makes it balancing.

Two results surprise most people. Loop 2 has two minus signs and still
reinforces, because two reversals cancel. And Loop 3, where a forecast of
heavy traffic is followed by a light road, is the loop in which the forecast
did its job.

Loop 1 also shows an **outside factor**, true crime in the district, with a
dashed arrow into crimes recorded. Records rise with true crime *and* with
patrols, and a model trained on records cannot tell which. That is why a
prediction that "comes true" in such a loop does not, by itself, show that
the model was accurate.

**What is simplified.** The sim labels the diagram "Simplified causal model:
directions only, no sizes." The link directions are the chapter's
qualitative claims, not measured effects. Whether a real loop matters
depends on how strong each link is, and real systems have more links than
these. In particular:

- **Predictive policing.** Lum and Isaac (2016) showed, by applying a
  published prediction algorithm to Oakland drug-arrest records, how such a
  loop could keep sending officers to the same neighborhoods, and Ensign and
  colleagues (2018) proved that the loop can run away when a model learns
  only from crimes that patrols discover. Supporters point to field trials,
  such as Mohler and colleagues (2015), that reported fewer crimes in
  predicted areas; critics note that such trials measure recorded crime, the
  quantity the loop distorts. The loop is a risk to design against, not
  proof that every system behaves this way.
- **Student risk prediction.** A risk score harms only if it is used to
  lower expectations or placements. Used to bring extra help, the same score
  can break the loop, which is the point of question Q2.
- **The traffic loop** is an illustration of a self-defeating forecast, not
  a model of the real Athens–Delphi road.

**Other loops like these.** The same structure appears elsewhere in
computing. A recommendation system shows what it predicts we will click,
our clicks are recorded, and the next model learns from those clicks, which
can narrow what everyone is shown (Chaney and colleagues, 2018). Machine
learning researchers call predictions that change the outcomes they predict
*performative* (Perdomo and colleagues, 2020). A related loop is **model
collapse**: when language models are trained, generation after generation,
mostly on text written by earlier models, they gradually lose the rare and
unusual parts of the original data (Shumailov and colleagues, 2024). How
much this happens in practice depends on how much fresh human-written data
stays in the mix, which is still being studied.

## How to Use

1. Read the two link definitions under the diagram. The current link is
   drawn in orange, and its two factors are outlined in orange.
2. Choose **Same direction (+)** or **Opposite direction (−)** (or press S
   or O), then **Submit** (or Enter). Each link has one scored try. The
   feedback appears and the arrow takes its correct sign.
3. Press **Next link**. After the last link of a loop, press **Classify the
   loop**, choose **Reinforcing** or **Balancing** (or press R or B), and
   submit. The R or B marker appears, and the counting rule is shown from
   then on.
4. Repeat for Loops 2 and 3, then answer the three loop questions (keys 1
   to 3 choose an answer).
5. **See results** shows the scores for links, loops and questions. **Start
   Over** resets everything.

Hover over a box or a labeled arrow to read what it means. Drag the
background to pan, and use **+**, **−** and **Reset view** to zoom.

## Editing the Layout

Add `?edit=true` to the URL to reposition the diagrams:

[Open the Layout Editor](main.html?edit=true){ .md-button }

In edit mode we can drag every box and every loop marker, and the arrows
show their signs and the markers show R or B from the start. Use **← Loop**
and **Loop →** to move between the three loops. Click an arrow, or its sign,
to select it, then use **Flip Curve**, **Curve −**, **Curve +**, or
**Straight** to reshape it. The layout is kept in this browser as we work,
so a reload does not lose it. **Reset Layout** discards it and reloads the
layout from the JSON file. When the layout looks right, press **Copy JSON**
or **Download JSON** and replace the contents of
`prediction-feedback-loops-cld.json` with the result. All three loops live
in that one file; each node's `loop` field says which loop it belongs to.

## Lesson Plan

**Audience:** adult travelers curious about how AI predictions are used in
schools, cities and everyday apps.  
**Duration:** 15–20 minutes.  
**Prerequisites:** predictive model, data bias (measurement bias),
self-fulfilling prophecy, self-defeating prophecy, student risk prediction,
and predictive policing (Chapter 19, Parts One and Four).  
**Learning objective (Bloom: Analyze):** Differentiate reinforcing loops, in
which a prediction helps bring itself about, from balancing loops, in which
a prediction helps prevent itself, by labeling the direction of every link
in three prediction loops and classifying each loop, with at least 9 of 10
links and all 3 loops correct.

### Activities

1. **Warm-up (2 min):** Recall Merton's bank run from the chapter. Which
   way does each link run: rumor of failure → withdrawals → bank's cash →
   failure?
2. **Label and classify (10 min):** Work through the three loops. Say each
   link aloud as "if this rises, that rises" or "if this rises, that falls"
   before choosing.
3. **Answer the loop questions (3 min):** For each question, name the link
   that the best answer changes.
4. **Discuss (5 min):** Think of a prediction about people that affects you,
   such as a credit score, a recommended video, or a school placement. What
   do people do because of it, and does that action feed the next
   prediction?

### Assessment

Mastery is at least 9 of 10 links, all 3 loops, and at least 2 of 3 loop
questions correct on the first try. Opening a tooltip is exploration, not
evidence. As a follow-up, ask: *A forecast said "heavy traffic" and the road
was light. Was it a bad forecast?* A strong answer says that in a balancing
loop a useful forecast can look wrong, because people acted on it, and that
judging it fairly requires asking what would have happened without the
forecast.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/prediction-feedback-loops/main.html"
        height="614px"
        width="100%"
        scrolling="no"
        title="Label the links in three prediction loops and classify each as reinforcing or balancing"></iframe>
```

## References

1. Robert K. Merton, "The Self-Fulfilling Prophecy," *The Antioch Review* 8,
   no. 2 (1948): 193–210. The paper that named the idea, with the example of
   a bank run.
2. Kristian Lum and William Isaac, "To Predict and Serve?" *Significance* 13,
   no. 5 (2016): 14–19. The Oakland study of how predictive policing trained
   on arrest records can concentrate patrols.
3. Danielle Ensign, Sorelle A. Friedler, Scott Neville, Carlos Scheidegger and
   Suresh Venkatasubramanian, "Runaway Feedback Loops in Predictive Policing,"
   *Proceedings of the Conference on Fairness, Accountability and
   Transparency* (2018). A mathematical model of the loop in Loop 1 and of
   ways to correct it.
4. G. O. Mohler and others, "Randomized Controlled Field Trials of Predictive
   Policing," *Journal of the American Statistical Association* 110, no. 512
   (2015): 1399–1411. Field trials that reported fewer crimes in predicted
   areas.
5. Juan C. Perdomo, Tijana Zrnic, Celestine Mendler-Dünner and Moritz Hardt,
   "Performative Prediction," *Proceedings of the 37th International
   Conference on Machine Learning* (2020). Predictions that change the
   outcomes they predict.
6. Allison J. B. Chaney, Brandon M. Stewart and Barbara E. Engelhardt, "How
   Algorithmic Confounding in Recommendation Systems Increases Homogeneity and
   Decreases Utility," *Proceedings of the 12th ACM Conference on Recommender
   Systems* (2018). The recommendation feedback loop.
7. Ilia Shumailov and others, "AI Models Collapse When Trained on Recursively
   Generated Data," *Nature* 631 (2024): 755–759. Model collapse.
8. *AI-Native Schools*,
   [Student Privacy and Data Governance](https://dmccreary.github.io/ai-native-schools/chapters/10-student-privacy-data-governance/).
   The 2023 investigation of Wisconsin's dropout early-warning system cited
   in the chapter.
9. [Causal loop diagram](https://en.wikipedia.org/wiki/Causal_loop_diagram) —
   Wikipedia. Link polarity and the rule for classifying loops.
10. Donella H. Meadows, *Thinking in Systems: A Primer* (Chelsea Green,
    2008). Reinforcing and balancing feedback.
11. [vis-network](https://visjs.github.io/vis-network/docs/network/) —
    vis-network 9.1.9, the network library.
