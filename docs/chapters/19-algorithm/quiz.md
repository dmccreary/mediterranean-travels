# Quiz: The Oracle and the Algorithm, Part 2: The Algorithm

Test your understanding of how prediction machines learn, how they can mislead, what earns them trust, and where the oracle parallel breaks down with these review questions.

---

#### 1. Amazon's experimental hiring program was edited to ignore words like "women's," yet the project was dropped. Why does removing a column such as gender not remove the bias?

<div class="upper-alpha" markdown>
1. The engineers forgot to delete the gender column from the training data
2. Hiring algorithms are deliberately programmed to prefer men
3. Other details, such as a club, a college, a first name, or an address, can act as proxies that carry the same information
4. The model was trained on too few résumés to learn anything useful
</div>

??? question "Show Answer"
    The correct answer is **C**. The program was trained on about ten years of résumés, most from men, and learned to mark down résumés mentioning "women's" or two women's colleges. Engineers removed those terms but could not be sure the model would not find other ways to sort candidates. Details like a club, college, first name, or home address can act as proxies, stand-ins carrying the same information. The bias was learned from past decisions, not deliberately programmed (option B). Well-run systems are tested for unequal results across groups.

    **Concept Tested:** Loan and Hiring Algorithms

    **See:** [Loan and Hiring Algorithms](index.md#loan-and-hiring-algorithms)

---

#### 2. A restaurant app trained on 50,000 Athens reviews, 90 percent written by visitors staying near their hotels, keeps recommending places near the Plaka. What is the best way to correct for its bias?

<div class="upper-alpha" markdown>
1. Trust it more, because 50,000 reviews is a very large sample
2. Ask whose experience was in the data, and add a voice it left out, such as someone who lives here
3. Choose the lowest-rated restaurant, since the ratings must be reversed
4. Use a different app trained on the same reviews with a newer design
</div>

??? question "Show Answer"
    The correct answer is **B**. The model is accurate about its data and biased about the city: it rarely recommends a neighborhood taverna, not because the food is worse but because few reviewers went there. Millions of examples from the same kind of person still leave everyone else out, and nothing in the numbers warns you, so option A is the trap the chapter names. The fix is to ask whose experience was in the data and whether yours is like theirs, then add a missing voice, such as a local.

    **Concept Tested:** Data Bias

    **See:** [Data Bias](index.md#data-bias)

---

#### 3. A language model completing "On Sundays the Grand Bazaar is ___" gives *closed* a 45 percent probability and *open* 30 percent. At temperature 1, about how often will it answer "open"?

<div class="upper-alpha" markdown>
1. Never, because the model always picks the most likely word
2. About 7 times in 10, because higher temperature favors unlikely words
3. Exactly half the time, because there are two main choices
4. About 3 times in 10, because at temperature 1 it samples in proportion to the probabilities
</div>

??? question "Show Answer"
    The correct answer is **D**. At temperature 1, a model picks each next word at random in proportion to its probability, so a word with 30 percent is chosen about 3 times in 10. Option A describes temperature 0, which always takes the single most likely word. The model has not changed its mind about the facts; it samples from what is likely to be written, and likely is not the same as true. That is why the same question can get different answers on different days.

    **Concept Tested:** Next-Word Prediction

    **See:** [Next-Word Prediction](index.md#next-word-prediction)

---

#### 4. According to the chapter, what three things does a meaningful "human in the loop" need?

<div class="upper-alpha" markdown>
1. Time to think, information the machine lacks, and freedom to overrule it without penalty
2. A faster computer, a larger dataset, and a second machine to check the first
3. A signature on every decision, a manager's approval, and a written log
4. Training in programming, access to the code, and a vote on the model's design
</div>

??? question "Show Answer"
    The correct answer is **A**. A human in the loop reviews and is responsible for the decisions an automated system recommends. But people tend to accept a machine's recommendation even when they have reason to doubt it, a tendency called automation bias. A loan officer who approves whatever the score says is in the loop on paper only. A meaningful loop needs time to think, information the machine lacks, and freedom to overrule without penalty. The Athenian Assembly arguing over the wooden-wall answer was a human in the loop of the oracle.

    **Concept Tested:** Human in the Loop

    **See:** [Human in the Loop](index.md#human-in-the-loop)

---

#### 5. A school's early-warning system labels a student "high risk," and she is moved to a less demanding class. How could this prediction feed itself?

<div class="upper-alpha" markdown>
1. It cannot, because a prediction has no effect on the outcome it predicts
2. Lower expectations and an easier class mean she learns less, which raises her risk score and confirms the label
3. The label alerts tutors, who raise her grades and prove the model wrong
4. The model deletes her record once she is moved, so no further prediction is made
</div>

??? question "Show Answer"
    The correct answer is **B**. A self-fulfilling prophecy comes true because it was made. If a "high-risk" label leads to lower expectations or a less demanding class, the student may learn less, which raises her risk score, which confirms the label. Research beginning with *Pygmalion in the Classroom* suggests expectations can affect results, though how strongly is debated. The chapter's test is what the school does with the flag: one that brings a tutor helps (as in option C), while one that lowers the challenge harms.

    **Concept Tested:** Student Risk Prediction

    **See:** [Student Risk Prediction](index.md#student-risk-prediction)

---

#### 6. A forecaster said "90 percent chance of rain" on ten days, and it rained on 6 of them. How should you describe this forecaster?

<div class="upper-alpha" markdown>
1. Well calibrated, because it rained on most of the days
2. Underconfident, because the forecaster should have said 100 percent
3. Overconfident, because forecasts of 90 percent came true only 60 percent of the time
4. Perfect, because a percentage forecast can never be proven wrong
</div>

??? question "Show Answer"
    The correct answer is **C**. Calibration measures whether a forecaster's probabilities match how often things happen. Saying 90 percent when the true frequency is 60 percent is overconfident; the chapter's Forecaster A, who said 70 percent and got rain on 7 of 10 days, was well calibrated. On the Brier score, B's confident forecasts are punished heavily on the dry days and score worse than saying "50 percent" every day. A single day cannot prove a percentage wrong, but many days together can (option D).

    **Concept Tested:** Model Calibration

    **See:** [Model Calibration](index.md#model-calibration)

---

#### 7. Two sources offer predictions. One is famous for a dramatic correct call that was written down after the event. The other has a public record of many dated forecasts, misses included, scored by someone else. Which deserves more trust, and why?

<div class="upper-alpha" markdown>
1. The public, scored record, because trust should rest on many predictions recorded before the outcomes
2. The dramatic call, because one spectacular hit shows special insight
3. Both equally, because any source can be right by chance
4. Neither, because no prediction about the future can ever be checked
</div>

??? question "Show Answer"
    The correct answer is **A**. Track record and trust holds that a source deserves trust in proportion to its record of predictions written down before the outcomes. Delphi's 1,140 years of trust rested on stories of hits recorded after they "came true," with the misses forgotten, the weakness of option B. The track records worth trusting are public, cover many predictions, include the misses, and are scored by someone other than the forecaster. Testable, dated claims make checking possible, which rules out option D.

    **Concept Tested:** Track Record and Trust

    **See:** [Track Record and Trust](index.md#track-record-and-trust)

---

#### 8. The chapter compares Delphi as a "data hub" with a large language model. What warning applies to both?

<div class="upper-alpha" markdown>
1. Both forget everything they hear after a short time
2. Both were designed to keep information secret from ordinary people
3. Both speak only in riddles that no one can interpret
4. Both gather many voices unevenly: those who could afford the trip, or who write a great deal online
</div>

??? question "Show Answer"
    The correct answer is **D**. Envoys reached Delphi from Sicily to the Black Sea, bringing news with their questions, and some historians suggest that flow of information helps explain the oracle's sensible practical answers, though no archive proves it. A language model is a hub too, compressing an enormous number of voices. But Delphi's envoys came mostly from cities that could afford the journey, and a model's text comes mostly from people and languages that write a great deal online. A hub knows much less about people who never make the trip.

    **Concept Tested:** Oracle as Data Hub

    **See:** [Oracle as Data Hub](index.md#oracle-as-data-hub)

---

#### 9. How does the chapter describe the reversal between Delphi and modern prediction when it comes to consent?

<div class="upper-alpha" markdown>
1. At Delphi predictions were forced on everyone, while today we choose every prediction made about us
2. At Delphi and today alike, people must pay before any prediction is made about them
3. At Delphi every prediction was asked for, while today systems predict about us without our asking, from data we may not know we gave
4. At Delphi only kings were predicted about, while today only governments make predictions
</div>

??? question "Show Answer"
    The correct answer is **C**. At Delphi, a consultant climbed the mountain, paid the fee, and put a question; no one received an oracle about themselves without asking. Today the arrangement is reversed: on a single Sunday, a fraud model checked our lunch purchase in Arachova and a phone keyboard predicted our next word, all without our asking. The chapter counts scale and consent among the limits of the oracle parallel, making the modern situation harder than the ancient one. Option A reverses the two eras.

    **Concept Tested:** Consent in Mass Prediction

    **See:** [Consent in Mass Prediction](index.md#consent-in-mass-prediction)

---

#### 10. A chart shows an AI measure doubling every five months, and a headline extends it ten years into the future. Which analysis fits the chapter's warning?

<div class="upper-alpha" markdown>
1. The projection is guaranteed, because doubling curves always continue
2. The projection is worthless, because no trend in AI has ever been measured
3. Doubling is too slow to matter, since the measure barely changes in a year
4. Such a curve grows about fivefold a year, but it assumes the forces behind it continue, and many such curves level off into an S-shape at a limit
</div>

??? question "Show Answer"
    The correct answer is **D**. Something that doubles every five months grows about fivefold in a year and nearly 150-fold in three years, so option C is wrong. But the forecast assumes the forces behind the trend continue, and many curves that looked like endless doubling were the early part of an S-shape that leveled off at a limit such as energy, money, or data. A small change in the doubling time also changes the long-range answer enormously. AI doubling curves are measured trends with wide uncertainty, not promises.

    **Concept Tested:** AI Doubling Curves

    **See:** [AI Doubling Curves](index.md#ai-doubling-curves)

---
