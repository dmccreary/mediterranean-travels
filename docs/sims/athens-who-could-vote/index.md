---
title: Who Could Vote in Athens?
description: Calculate what share of Attica's people could vote around 431 BCE from scholarly estimates for four groups, push the estimates to their limits, and compare a full Assembly of 6,000 with everyone it governed.
status: built
image: /sims/athens-who-could-vote/athens-who-could-vote.png
og:image: /sims/athens-who-could-vote/athens-who-could-vote.png
twitter:image: /sims/athens-who-could-vote/athens-who-could-vote.png
social:
   cards: false
quality_score: 100
---

# Who Could Vote in Athens?

<iframe src="main.html" height="584px" width="100%" scrolling="no" title="Calculate the share of Attica's population that could vote around 431 BCE"></iframe>

[Run the Who Could Vote in Athens? MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Athens called itself a democracy, a city ruled by its people. This MicroSim
asks how many of its people that was. One stacked bar shows everyone living in
Attica around 431 BCE, at the start of the Peloponnesian War, in four groups.
Only the first group, the adult male citizens, could vote. A thick line divides
them from the three groups who could not. A second bar shows a full Assembly of
6,000 on the Pnyx against the same total.

| Group | Estimate range | Default | Could vote? |
|---|---|---|---|
| Adult male citizens | 30,000–50,000 | 40,000 | Yes |
| Citizens' wives, daughters, and young sons | 70,000–130,000 | 100,000 | No |
| Metics, of all ages | 20,000–40,000 | 30,000 | No |
| Enslaved people | 60,000–100,000 | 80,000 | No |

The calculation is simple: the voting share is the citizens divided by
everyone, times 100. At the defaults that is 40,000 ÷ 250,000 = 16 percent,
about one person in six. With these ranges the share can never rise above 25.0
percent (50,000 ÷ 200,000) or fall below 10.0 percent (30,000 ÷ 300,000).

**Every number here is an estimate.** No ancient census of Attica survives.
Historians build these figures from scattered evidence: Thucydides' count of
Athens's soldiers in 431 BCE (2.13), the size of the meeting place on the Pnyx,
grain imports, and remarks by ancient writers. The ranges are the chapter's
rounded summary of most modern estimates, and the sim labels them as such. A
range is not a mistake; it is an honest report of how thin the evidence is.

Some estimates fall outside these ranges, and it is worth knowing which way
they pull:

- **Citizens.** A. W. Gomme (1933) estimated about 43,000 adult male citizens in
  431 BCE. Mogens Herman Hansen argued for a higher figure, perhaps as many as
  60,000, before the plague and the war cut the number sharply. With 60,000
  citizens and the other groups at their minimums, the share would reach about
  29 percent: still fewer than one person in three.
- **Enslaved people.** Estimates vary more than for any other group, from about
  20,000–30,000 (A. H. M. Jones) to about 115,000 (Gomme). The orator Hyperides
  spoke of 150,000 enslaved people in Attica in the 4th century BCE, which
  historians treat as an impression, not a count.
- **The Pnyx.** In its first form the Assembly place probably held about 6,000
  people, the number required for certain votes; estimates for its capacity run
  from about 6,000 to 13,000.

The sim's conclusion survives every one of these alternatives: the people who
voted were a minority of the people who lived under their decisions.

## How to Use

1. Read the bar. Each segment shows its estimate; the share of voters is hidden
   as **?** until you work it out.
2. **Challenge 1:** type the percent of everyone who could vote, then press
   **Check** (or Enter). You have two attempts; the first wrong answer gives a
   hint, the second shows the worked answer.
3. **Challenge 2:** the four sliders unlock. Set them to give voters the largest
   share the evidence allows, watching the share update, then press **Check**.
4. **Challenge 3:** the estimates return to their defaults. Type the percent of
   everyone who sat in a full Assembly of 6,000.
5. Press **Explore freely** to unlock the sliders and test the limits yourself.
   **Try Again** repeats the three challenges.

## Lesson Plan

**Audience:** adult travelers reading Chapter 16, "Day 11: Athens, the Agora,
Democracy, and Paul on the Areopagus".  
**Duration:** 10 minutes.  
**Prerequisites:** Athenian democracy, the Assembly, the Pnyx, Athenian
citizenship, metics, enslaved people, and the idea of an estimate given as a
range.  
**Learning objective (Bloom: Apply):** Calculate the share of Attica's
population that could vote around 431 BCE from estimated ranges for four
groups, to within one percentage point, and identify the combination of
estimates that gives the largest possible share.

### Activities

1. **Predict (1 min):** Before touching the sim, guess: what share of the
   people of Athens could vote? Write the guess down.
2. **Calculate (5 min):** Work through the three challenges. Compare your
   prediction with the answer to challenge 1.
3. **Test the limits (2 min):** In free exploration, find the smallest share
   the ranges allow. Which group's estimate moves the share most?
4. **Discuss (2 min):** A full Assembly was about one person in forty. In what
   sense was Athens ruled by its people, and in what sense was it not?

### Assessment

Mastery is 3 of 3 challenges, each within two attempts: 16.0 percent (±1.0),
the settings 50,000 / 70,000 / 20,000 / 60,000 for 25.0 percent, and 2.4
percent (±0.2). Moving the sliders freely is exploration, not evidence. A
follow-up question: *A historian proposes 60,000 citizens. Does that overturn
the chapter's point?* A strong answer computes the new maximum, about 29
percent, and notes that voters remain a minority.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/mediterranean-travels/sims/athens-who-could-vote/main.html"
        height="584px"
        width="100%"
        scrolling="no"
        title="Calculate the share of Attica's population that could vote around 431 BCE"></iframe>
```

## References

1. [Athenian democracy](https://en.wikipedia.org/wiki/Athenian_democracy) — Wikipedia. Estimates of 250,000–300,000 people in Attica in the 4th century BCE, about 30,000 adult male citizens then, perhaps as many as 60,000 in the mid-5th century, the 6,000 quorum for certain votes, and Hyperides' figure of 150,000 enslaved people as an impression.
2. A. W. Gomme, *The Population of Athens in the Fifth and Fourth Centuries B.C.* (Oxford: Blackwell, 1933). The classic reconstruction from Thucydides' military figures: about 43,000 adult male citizens and about 115,000 enslaved people in 431 BCE.
3. Mogens Herman Hansen, *The Athenian Democracy in the Age of Demosthenes* (Oxford: Blackwell, 1991), and *Three Studies in Athenian Demography* (Copenhagen, 1988). The case for a larger citizen body in 431 BCE and for a Pnyx holding about 6,000.
4. Ben Akrigg, *Population and Economy in Classical Athens* (Cambridge University Press, 2019), chapter 4, "Population Size 2: Noncitizens." A modern review of the estimates for metics and enslaved people, from Jones's low figures to Gomme's high ones.
5. Thucydides, *History of the Peloponnesian War* 2.13 — Pericles' count of Athens's hoplites, cavalry, and archers in 431 BCE, the main ancient evidence behind the citizen estimates.
6. [Pnyx](https://en.wikipedia.org/wiki/Pnyx) — Wikipedia. The three building phases of the Assembly place and estimates of its capacity, from about 6,000 to 13,000.
7. [Metic](https://en.wikipedia.org/wiki/Metic) and [Slavery in ancient Greece](https://en.wikipedia.org/wiki/Slavery_in_ancient_Greece) — Wikipedia. The legal status of resident foreigners and enslaved people in Athens.
8. [Chart.js documentation](https://www.chartjs.org/docs/latest/) — The charting library used for the stacked bars.
