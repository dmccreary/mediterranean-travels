---
title: Next-Word Prediction and Temperature
description: Predict what the temperature setting does to a language model's choice of the next word, then reveal the adjusted probabilities and a draw of 20 sampled words, for four prompts from "Know ___" to "On Sundays the Grand Bazaar is ___."
status: built
image: /sims/next-word-temperature-toy/next-word-temperature-toy.png
og:image: /sims/next-word-temperature-toy/next-word-temperature-toy.png
twitter:image: /sims/next-word-temperature-toy/next-word-temperature-toy.png
social:
   cards: false
quality_score: 0
---

# Next-Word Prediction and Temperature

<iframe src="main.html" height="576px" width="100%" scrolling="no" title="Predict how temperature changes a language model's choice of the next word, then reveal the probabilities and a draw of 20"></iframe>

[Run the Next-Word Prediction and Temperature MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A language model writes one word at a time. For each next word it assigns a
probability to every candidate, chooses one, adds it to the text, and
repeats. The **temperature** setting controls how that choice is made. This
MicroSim gives an imaginary small model four prompts, each with five
candidate words, and lets us predict what the temperature will do before we
see it.

The rule is the standard softmax-with-temperature rescaling. Raise each
probability to the power \( 1/T \), where \( T \) is the temperature, and
rescale so the five add up to 100 percent:

\[
p_i(T) = \frac{p_i^{1/T}}{\sum_j p_j^{1/T}}
\]

This is the same as dividing the model's raw scores (its *logits*, here
\( \ln p_i \)) by \( T \) before the softmax step. At \( T = 1 \) nothing
changes. Below 1 the probabilities sharpen toward the favorite; above 1 they
flatten. As \( T \) approaches 0 the favorite's share approaches 100 percent,
so \( T = 0 \) is treated as "always take the most likely word" (greedy
choice). The dashed outline on every bar keeps the temperature-1.0
probabilities in view, so we can see that the model's knowledge stays put
while only its way of choosing moves.

| Prompt | Five candidate words at temperature 1.0 |
|---|---|
| 1. "Know ___" | thyself 60, yourself 20, the 10, your 6, nothing 4 |
| 2. "Nothing in ___" | excess 55, the 15, particular 12, life 10, common 8 |
| 3. "On Sundays the Grand Bazaar is ___" | closed 45, open 30, busy 15, quiet 6, crowded 4 |
| 4. "The oracle at Delphi was ___" | consulted 30, famous 25, a 20, closed 15, silent 10 |

**Draw 20** makes 20 independent random picks, each weighted by the bars, and
counts how often each word was chosen. The counts vary from draw to draw: at
temperature 1.0, prompt 3 gives "open" about 6 times in 20 on average, but
any one draw may give 3 or 9. The random numbers come from a fixed starting
seed, so the same sequence of presses reproduces the same counts, and
**Try Again** restarts the sequence.

**What is simplified.** All probabilities are invented to show the rule; the
sim labels them "Illustrative probabilities, not from a real model." A real
model scores tens of thousands of tokens, not five words, and products often
combine temperature with other limits, such as sampling only from the most
likely few tokens (top-k or top-p). Even at temperature 0, some hosted
systems are not perfectly repeatable, because of small numerical differences
in how the computation is run; the idealized rule in the sim is exactly
repeatable.

## How to Use

1. Read the challenge and choose one of the three answers (or press keys 1
   to 3). Only the first choice counts.
2. Press **Reveal** (or Enter). The temperature moves to the challenge's
   setting, the filled bars show the adjusted probabilities, and a draw of 20
   appears, followed by the feedback.
3. Press **Draw 20** to draw again and watch the counts change, then press
   **Next challenge**.
4. After challenge 5, free exploration unlocks: choose any prompt, move the
   **Temperature** slider from 0 to 2.0, and press **Draw 20** as often as
   you like. Changing the prompt or the temperature clears the counts.
5. **Try Again** returns to challenge 1 and resets the score.

## Lesson Plan

**Audience:** adult travelers who use, or are curious about, AI chatbots.  
**Duration:** 10–15 minutes.  
**Prerequisites:** large language model, token, next-word prediction,
temperature, and probability (Chapter 19, "Large Language Model" and
"Next-Word Prediction").  
**Learning objective (Bloom: Understand):** Infer how changing the
temperature changes which next word a language model chooses and how often,
answering at least 4 of 5 prediction questions correctly before the sampled
results are revealed.

### Activities

1. **Predict (8 min):** Work through the five challenges in order. Say the
   reason for each answer out loud, or write it down, before pressing
   Reveal.
2. **Explore (4 min):** Choose prompt 3 at temperature 1.0 and draw five
   times. How many draws contain at least one "open"? Now set the temperature
   to 0 and draw again.
3. **Discuss (3 min):** The model "knows" the Grand Bazaar is usually closed
   on Sundays only in the sense that "closed" is its most likely word. Why
   can the same question get different answers on different days?

### Assessment

Mastery is at least 4 of 5 correct on the first attempt. Moving the slider
and drawing samples in free exploration is not evidence. As a follow-up,
ask: *Does raising the temperature make a model more creative or more
accurate?* A strong answer says that it makes the output more varied by
giving unlikely words more chances, which can help with brainstorming but
also makes wrong or odd words more frequent; it does not change what the
model learned.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/next-word-temperature-toy/main.html"
        height="576px"
        width="100%"
        scrolling="no"
        title="Predict how temperature changes a language model's choice of the next word, then reveal the probabilities and a draw of 20"></iframe>
```

## References

1. [Softmax function](https://en.wikipedia.org/wiki/Softmax_function) —
   Wikipedia. The softmax formula and the temperature parameter that
   sharpens or flattens it.
2. [Large language model](https://en.wikipedia.org/wiki/Large_language_model) —
   Wikipedia. Tokens, training to predict the next token, and how text is
   generated one token at a time.
3. Daniel Jurafsky and James H. Martin, *Speech and Language Processing*,
   3rd edition draft ([online](https://web.stanford.edu/~jurafsky/slp3/)).
   The chapter on large language models explains greedy decoding, random
   sampling, and temperature sampling.
4. Geoffrey Hinton, Oriol Vinyals and Jeff Dean, "Distilling the Knowledge in
   a Neural Network" (2015, [arXiv:1503.02531](https://arxiv.org/abs/1503.02531)).
   Uses a softmax temperature above 1 to produce a "softer" probability
   distribution.
5. Ari Holtzman and others, "The Curious Case of Neural Text Degeneration"
   (ICLR 2020, [arXiv:1904.09751](https://arxiv.org/abs/1904.09751)). Why
   always taking the top word produces dull, repetitive text, and why pure
   sampling can wander; introduces top-p (nucleus) sampling.
6. Emily M. Bender, Timnit Gebru, Angelina McMillan-Major and Shmargaret
   Shmitchell, "On the Dangers of Stochastic Parrots: Can Language Models Be
   Too Big?" (FAccT 2021). The "stochastic parrots" paper mentioned in the
   chapter.
7. [p5.js](https://p5js.org/) — p5.js 2.3.4, the library used to draw the
   MicroSim.
