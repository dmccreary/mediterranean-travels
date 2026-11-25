---
title: "The Oracle and the Algorithm, Part 2: The Algorithm"
description: "A deep dive for the drive back from Delphi: how machine learning, predictive models, and large language models work, paired with the oracle's stories to ask about data, interpretation, bias, self-fulfilling predictions, funding, calibration, track records, prediction horizons, values, climate, and consent, and where the parallel breaks."
generated_by: claude skill chapter-content-generator
date: "2026-11-24 21:15:56"
version: 1.11
---

# The Oracle and the Algorithm, Part 2: The Algorithm

## Summary

Read this deep-dive chapter on the drive back from Delphi or that evening. It explains machine learning, predictive models, training data, and large language models in plain terms, then pairs each Delphi story with a question about AI: the oracle as a data hub, ambiguous answers and keeping a human in the loop, confirmation bias, self-fulfilling prophecy, who funds the model, calibration and trust, and the prediction horizon. It asks what 'Know thyself' and 'Nothing in excess' mean for values and climate models. It closes honestly with where the parallel breaks down and with reflection questions for our own decisions.

## Concepts Covered

This chapter covers the following 32 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Machine Learning | 48 |
| Predictive Model | 35 |
| Training Data | 9 |
| Data Bias | 7 |
| Large Language Model | 3 |
| Next-Word Prediction | 1 |
| Weather Forecasting | 1 |
| Loan and Hiring Algorithms | 5 |
| Prediction Uncertainty | 16 |
| Oracle as Data Hub | 1 |
| Interpreting Ambiguous Answers | 6 |
| Human in the Loop | 1 |
| Confirmation Bias | 1 |
| Self-Fulfilling Prophecy | 3 |
| Student Risk Prediction | 1 |
| Predictive Policing | 1 |
| Who Funds the Model | 1 |
| Model Calibration | 6 |
| Track Record and Trust | 1 |
| Prediction Horizon | 3 |
| AI Capability Forecasting | 2 |
| AI Doubling Curves | 1 |
| Answer as Start of Inquiry | 3 |
| AI as Thinking Partner | 1 |
| Values Beyond Prediction | 3 |
| Climate Models | 5 |
| Acting on Foresight | 4 |
| Long-Term Consequences | 3 |
| Consent in Mass Prediction | 4 |
| Testability of Predictions | 4 |
| Limits of the Oracle Parallel | 3 |
| Delphi Reflection Questions | 2 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Before We Go, Part 2: Traveling Well and the Learning for All Thread](../02-traveling-well/index.md)
- [Chapter 9: Paul at Ephesus, Part 1: The Apostle's Life, Letters, and Ephesian Years](../09-paul-life-letters/index.md)
- [Chapter 17: The Oracle and the Algorithm, Part 1: The Oracle](../17-oracle/index.md)

---

## The Drive Back from Delphi

Day 12, Sunday, November 22, ends on the road. The sun sets over Delphi at about 5:15 PM, so by the time the coach has wound down through Arachova and out onto the plain of Boeotia, the windows are dark and the temple terraces are a memory a few hours old. It is a good time for this chapter. Last night, Chapter 17 explained the oracle as an institution and left us seven questions. This morning, Chapter 18 walked us up the Sacred Way past the stones where those questions were asked. Tonight we put the same questions to the prediction machines of our own time.

Chapter 2 started this conversation. It explained that most of today's artificial intelligence is built by machine learning, that the chatbots we use are large language models that predict the next word, and that a chatbot asked when Hagia Sophia would close for Friday prayer could only predict a typical answer. It promised that the Delphi chapters would come back to this, because asking a source about the future is a very old human habit in a new form. This chapter keeps that promise. It explains, in plain terms and with worked examples, how machines learn to predict, and then it sets each Delphi story beside a question we should ask of any AI: where its knowledge comes from, who interprets its answers, who pays for it, how we would know whether to trust it, and what no prediction can decide for us.

!!! mascot-welcome "The Tripod and the Phone"
    ![Glaux waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This morning we stood where kings waited for a god's answer; tonight half the coach is asking a phone what time the traffic will clear. The questions have barely changed in 2,500 years, and Croesus, Themistocles, and Socrates still have a lot to teach us about how to ask them. By the time we reach Athens, an AI's answer will look less like a verdict and more like the start of a conversation. Look closer.

The chapter has eight parts. Part One explains how machines learn from examples, and how the examples can mislead them. Part Two looks at three prediction machines we already use: the weather forecast, the language model, and the honest range around every prediction. Part Three asks the oracle's questions about data, interpretation, and bias. Part Four follows predictions that change the world they predict. Part Five asks what earns trust: who pays, how well calibrated a source is, its track record, whether its claims can be tested, and how far ahead it can see. Part Six turns an answer into the start of an inquiry. Part Seven asks what "Know thyself" and "Nothing in excess" mean for values, climate, and long-term choices. Part Eight asks who consented to being predicted, admits where the parallel between the oracle and the algorithm breaks down, and ends with questions for our own decisions.

## Part One: Learning From Examples

### Machine Learning

Chapter 2 defined **machine learning** briefly: instead of being given step-by-step rules, a computer program is shown a large number of examples and adjusts itself until it can find the patterns in them. Because most of this chapter rests on that idea, it is worth taking slowly. Machine learning is the branch of artificial intelligence in which a program improves at a task by learning from data rather than by following rules a person has written for it. The result of the learning is called a **model**: a set of numbers, often millions or billions of them, that turns an input (a photo, a sentence, a list of facts about a loan applicant) into an output (a label, a next word, a probability).

There are two ways to get a computer to do something. The traditional way is to write the rules: "if the email contains these words, mark it as spam." That works when people can state the rules. But many things we do easily, such as recognizing a face or understanding a spoken sentence, follow rules that no one can write down. Machine learning turns the problem around. We supply examples with the right answers, and the program finds its own rules.

**Worked example: teaching a program to tell Doric from Ionic.** Let's teach a computer the difference between two of the column styles we have seen all week: the plain cushion-shaped top of a **Doric** capital, as on the Parthenon and the Temple of Apollo at Delphi, and the paired scrolls of an **Ionic** capital, as on the Erechtheion. A rule-writer would have to describe a scroll in terms of pixels, which is nearly impossible. A machine-learning approach goes like this.

1. **Collect labeled examples.** We gather 10,000 photos of capitals, and a person labels each one "Doric" or "Ionic." These labeled examples are the training data, the subject of the next sections.
2. **Hold some back.** We set 2,000 photos aside, unseen, for testing. The program learns from the other 8,000.
3. **Start with a guess and adjust.** The model begins with random internal numbers, called **parameters**, and guesses a label for each training photo. Every wrong guess nudges the parameters slightly in the direction that would have made the guess less wrong. After many passes through the 8,000 photos, the guesses are mostly right.
4. **Test on the photos it never saw.** If the model labels 1,900 of the 2,000 held-back photos correctly, its test accuracy is \( 1{,}900 \div 2{,}000 = 0.95 \), or 95 percent. That number, not its score on the training photos, tells us how well it **generalizes**, that is, how well it handles examples it was not trained on.
5. **Use it, and keep checking.** Now we can point a phone at a capital in a museum and get "Ionic, 97 percent." But if we show it a broken Corinthian capital in fog, a style it was never taught, it will still answer "Doric" or "Ionic," because those are the only two answers it knows.

Notice what the model learned and what it did not. It found patterns of light and shape that separate the two labels in the photos it was given. It does not know what a column is, who carved it, or why. Everything it can do comes from the examples, and everything the examples leave out, it cannot do. The table below sets the two approaches side by side.

| | Rules written by people | Machine learning |
|---|---|---|
| Where the rules come from | A person states them | The program finds them in examples |
| Works best when | The rules can be stated: tax tables, ship schedules | The rules are too complex to state: faces, speech, language |
| Can explain its answer | Yes: point to the rule | Often only partly; the "rules" are millions of numbers |
| Fails when | A case arises that the rule-writer did not foresee | A case arises that the examples did not contain |
| What it needs | An expert | Many good examples with correct answers |

!!! mascot-thinking "A Model Is a Summary of the Past"
    ![Glaux thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of a trained model as a very detailed summary of the examples it was shown, compressed into numbers. When it predicts, it is really asking, "what usually came next in cases like this one?" Every strength and every weakness in the rest of this chapter follows from that one fact.

### Predictive Model

A **predictive model** is a model that estimates an unknown outcome, usually a future one, from information available now. Its inputs are the facts we know (the date, the weather, a person's payment history); its output is a prediction, often a probability ("a 30 percent chance"). Not every model predicts the future: the column classifier labels something present. But the method is the same, and most of the models that shape our lives, from weather forecasts to credit scores, are predictive.

**Worked example: will the coach be late tonight?** Let's build a tiny predictive model of our own drive home, using invented numbers to show the idea. Suppose a coach company had kept records of 500 past Sunday trips from Delphi to Athens in November, and noted three facts about each: whether there was snow on the road near Arachova, whether the ski season was open (which fills the road on winter weekends), and whether the coach arrived more than 30 minutes late. The "model" is simply the fraction of late trips in each kind of day.

| Snow near Arachova? | Ski season open? | Past trips | Late trips | Predicted chance of being late |
|---|---|---|---|---|
| No | No | 300 | 30 | 10 percent |
| No | Yes | 100 | 25 | 25 percent |
| Yes | No | 60 | 24 | 40 percent |
| Yes | Yes | 40 | 24 | 60 percent |

Tonight there is no snow and the ski season has not opened, so the model predicts a 10 percent chance of a late arrival. Three things about this toy are true of every predictive model. First, it does not know *why* coaches are late; it only knows how often lateness went with snow and skiers in the past. Second, it assumes that the future resembles the past: a new road, a new tunnel, or a strike would make every number in the table wrong. Third, its prediction is about a kind of day, not about this particular coach: "10 percent" means that on about 1 night in 10 like this one, the coach is late, and it cannot say whether tonight is that night. Real predictive models use many more inputs and far more complicated arithmetic than counting, but they rest on the same three assumptions.

### Training Data

**Training data** is the set of examples from which a machine-learning model learns: the labeled column photos, the 500 past coach trips, or, for a language model, a vast collection of written text. A model can only be as good as its training data, because the data is the only experience it has. Three questions decide whether the data is good enough: Is there enough of it? Is it correctly labeled? And does it look like the cases the model will meet in use?

**Worked example: the model that learned the weather.** Let's go back to the column classifier and suppose something went wrong that we did not notice. Most of our Doric photos came from tourists at outdoor sites such as the Parthenon and Delphi, so they show blue sky behind the stone. Most of our Ionic photos came from museum catalogs, so they show capitals indoors against a gray wall. The model scores 95 percent on the test set, because the test set was drawn from the same collection. Then we show it an Ionic capital photographed outdoors at the Erechtheion against a bright sky, and it answers "Doric." It had learned a shortcut: blue sky means Doric. Nothing in its training told it that the sky was not part of the answer. This kind of failure has been reported many times in real systems, and it is hard to catch, because the shortcut works on every example that resembles the training data. The fix is to make the training data look like the world the model will be used in, here by adding outdoor Ionic and indoor Doric photos, and to test the model on examples gathered in a different way from the training set.

### Data Bias

**Data bias** is a systematic difference between the training data and the world it is supposed to represent, which makes a model's predictions worse, or unfair, for some cases or some groups of people. The weather shortcut above came from data bias, but a harmless kind. The serious kinds involve people. Three kinds come up again and again, and naming them makes them easier to spot.

| Kind of bias | What goes wrong | A travel-sized example |
|---|---|---|
| Sampling bias | Some cases or groups are missing or rare in the data | A restaurant app trained on reviews written in English by tourists recommends places near the hotels and misses the taverna the village uses |
| Historical bias | The data accurately records a past that was itself unfair | A model trained on which guides a tour company hired over 30 years learns the company's old preference for men |
| Measurement bias | What is recorded is only a stand-in for what we care about | "Number of five-star reviews" stands in for "good food," but rewards places that ask every customer for a review |

**Worked example: who is missing from the reviews?** Let's follow the first row. Suppose a recommendation model learns from 50,000 restaurant reviews in Athens, and 90 percent of them were written by visitors who stayed within a mile of their hotels. The model will learn, correctly, that those visitors liked certain places near the Plaka. It will then predict that *we* will like them too, and it will rarely recommend a neighborhood taverna, not because the food is worse but because few reviewers went there. The model is accurate about its data and biased about the city. Chapter 2's advice, "ask someone who lives here," is the human correction for exactly this bias: it adds a voice that the data left out.

!!! mascot-warning "The Data Cannot Show Who Is Missing"
    ![Glaux warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common trap is to trust a model because it was trained on "millions of examples." Millions of examples from the same kind of person still leave everyone else out, and nothing in the numbers will warn you. The fix is to ask one question of any prediction: whose experience was in the data, and is mine like theirs?

### Loan and Hiring Algorithms

**Loan and hiring algorithms** are predictive models that help banks decide who gets credit and employers decide whom to interview or hire, by estimating from an applicant's data how likely they are to repay a loan or succeed in a job. They are attractive for real reasons: they are fast, consistent, and do not have bad moods. But they learn from past decisions and past outcomes, so they can carry historical and measurement bias straight into the future, at a scale no single biased manager could reach.

**Worked example: removing the column does not remove the bias.** Let's follow the best-known case. In 2018 the news agency Reuters reported that Amazon had abandoned an experimental program that rated job applicants' résumés. It had been trained on about ten years of résumés submitted to the company, most of them from men, and it learned to mark down résumés that included the word "women's," as in "women's chess club captain," and those from graduates of two women's colleges. The engineers edited the program to ignore those particular terms, but could not be sure it would not find other ways to sort candidates, so the project was dropped. The lesson is general. Taking "gender" or "race" out of the data does not stop a model from learning them, because other details, such as a club, a college, a first name, or a home address, can act as **proxies**, stand-ins that carry the same information. In lending, a home address can be such a proxy: in the United States, neighborhoods were long segregated, and in the 1930s government maps marked many Black neighborhoods as poor risks, the practice called **redlining**, so where a family lives can still carry the history of who was refused credit.

Most countries now have laws that forbid lenders and employers to discriminate, and many require them to explain a refusal. A well-run system is tested for unequal results across groups before and after it is used. *AI-Native Schools* shows how such an audit works, using the "four-fifths rule" from employment law, in [Student Privacy and Data Governance](https://dmccreary.github.io/ai-native-schools/chapters/10-student-privacy-data-governance/), because the same kind of model now makes judgments about students.

## Part Two: Three Prediction Machines We Already Use

### Weather Forecasting

**Weather forecasting** is predicting the state of the atmosphere for a place and time, and it is the oldest and most successful prediction machine we use every day. Modern forecasts start from millions of measurements, from weather stations, balloons, ships, aircraft, and satellites, and feed them into computer models that apply the laws of physics to the atmosphere, divided into a grid of boxes, to calculate how it will change. Because the starting measurements are never perfect, forecasting centers run the model many times with slightly different starting conditions. This set of runs is called an **ensemble**. If 6 of 10 runs bring rain to Delphi tomorrow afternoon, the forecast says "60 percent chance of rain." So a percentage in a forecast is a statement about many possible tomorrows: on days like this one, rain falls about 6 times in 10. Machine learning is now being used alongside the physics as well, both to correct the models' known errors and, increasingly, to forecast directly from past weather data. Forecasters also check themselves: national weather services compare their forecasts with what actually happened and publish the results. That habit, as Part Five shows, is what makes their percentages worth trusting.

### Prediction Uncertainty

**Prediction uncertainty** is the range of outcomes that remain possible after a prediction is made, together with how likely each one is. Every honest prediction has some, and the question is never whether a prediction is uncertain but how uncertain it is and whether it says so. Uncertainty comes from several sources, and they call for different responses.

| Source | What it means | Example from today |
|---|---|---|
| Imperfect measurement | We do not know the present exactly | No station measures the wind on every bend of the Arachova road |
| Chaos | Tiny differences grow into large ones | A small error in today's temperature becomes a wrong forecast in ten days |
| Missing factors | Something that matters is not in the model | Our coach model knows snow and skiers but not a breakdown or a strike |
| A changed world | The future stops resembling the past | A new road would make every past travel time out of date |
| Model error | The model's own rules are wrong or too simple | A model that treats every November Sunday as the same |

**Worked example: three ways to say the same forecast.** Let's state tomorrow morning's weather in Athens three ways and notice what each one tells us. *A single number:* "13 °C at 9 AM." It is clear and easy to plan with, but it hides how sure the forecaster is. *A range:* "between 10 and 15 °C at 9 AM." Now we know to bring a layer, because the low end is cool. *A probability:* "a 20 percent chance of a shower before noon." Now we can weigh the cost of carrying an umbrella against the cost of getting wet, as Part Seven does. The weather is the same in all three; what changes is how much of the forecaster's uncertainty reaches us. A good source shows its uncertainty. A source that always speaks in single confident numbers is not more certain; it is only hiding the range.

This matters for language models in particular, because their fluent sentences carry no visible error bars. A chatbot can state a museum's closing time in exactly the same confident tone whether it is reporting a well-documented fact or guessing. We can ask it how sure it is, and what would change its answer, and sometimes the reply is useful. But a model's description of its own confidence is itself a prediction, and it is not always a well-calibrated one.

### Large Language Model

A **large language model** (LLM) is a machine-learning model trained on an enormous collection of text to predict what comes next in a piece of writing, and then refined so that its predictions take the form of helpful answers. Chapter 2 introduced it. Here are three more details. First, the model reads and writes in **tokens**, pieces of words; a common word may be one token, a rare one several. Second, it is built in stages: first it learns to predict text from a vast body of writing; then it is trained further on examples of good answers and on people's ratings of its replies, which teaches it to answer questions politely and to decline some requests. Third, unless it is connected to a search tool or a document, it does not look anything up; it produces what its training makes likely.

Whether such a model "understands" what it says is an open debate. Some researchers argue that it only stitches together patterns of words, a view captured in a much-discussed 2021 paper that called such models "stochastic parrots," using *stochastic* <audio id="audio-stochastic" src="../../audio/stochastic.mp3" preload="none"></audio><button onclick="document.getElementById('audio-stochastic').play()" class="pronounce-btn">🔊 Pronounce</button> *stuh-KAS-tik*, a statistician's word for "random." Others point to evidence that these models build internal representations of the things they write about, and that predicting text well requires something like understanding. Both sides agree on the practical point: a language model can be useful, and it can be fluently, confidently wrong, and the two can appear in the same paragraph.

### Next-Word Prediction

**Next-word prediction** is the core task of a language model: given the words so far, assign a probability to every possible next word (strictly, next token), choose one, add it to the text, and repeat. Everything a chatbot writes, from a poem to a timetable, is produced one word at a time this way. How the next word is chosen from the probabilities is controlled by a setting called **temperature**. At temperature 0, the model always takes the single most likely word. At temperature 1, it picks at random in proportion to the probabilities, so a word with a 20 percent probability is chosen about 1 time in 5. Above 1, the probabilities are flattened, so unlikely words are chosen more often; below 1, they are sharpened toward the favorite.

**Worked example: completing the god's advice.** Let's give an imaginary small model the words carved on the temple porch, "Know ___," and suppose it assigns these illustrative probabilities to the next word: *thyself* 60 percent, *yourself* 20, *the* 10, *your* 6, *nothing* 4. The table shows how temperature changes them. The rule is to raise each probability to the power \( 1/T \), where \( T \) is the temperature, and then rescale so the five add up to 100 percent.

| Next word | Temperature 0.5 | Temperature 1.0 | Temperature 2.0 |
|---|---|---|---|
| thyself | 86.7 | 60.0 | 39.1 |
| yourself | 9.6 | 20.0 | 22.6 |
| the | 2.4 | 10.0 | 15.9 |
| your | 0.9 | 6.0 | 12.4 |
| nothing | 0.4 | 4.0 | 10.1 |

At temperature 0.5, the model says "thyself" almost 9 times in 10; at 2.0, fewer than 4 times in 10, and "nothing" turns up about once in 10. Low temperature makes a model predictable and repetitive; high temperature makes it varied and more likely to wander. Now suppose the words are "On Sundays the Grand Bazaar is ___," and the model gives *closed* 45 percent and *open* 30 percent. At temperature 1, about 3 answers in 10 will say "open," which Chapter 2 told us is usually false. The model has not changed its mind about the facts. It is sampling from what is likely to be written, and likely is not the same as true. That is why the same question can get different answers on different days.

The MicroSim below lets us set the temperature and watch the choices change, predicting each effect before we see it.

#### Diagram: Next-Word Prediction and Temperature

<details markdown="1">
<summary>Next-Word Prediction and Temperature</summary>
Type: microsim
**sim-id:** next-word-temperature-toy<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Bloom Level:** Understand<br/>
**Bloom Verb:** infer<br/>
**Learning Objective:** The learner will infer how changing the temperature changes which next word a language model chooses and how often, answering at least 4 of 5 prediction questions correctly before the sampled results are revealed.

**Prerequisites:** large language model, token, next-word prediction, temperature, probability (defined in "Large Language Model" and "Next-Word Prediction" above).

**Evidence of Mastery:** For each of five challenge questions, the learner commits to one answer before pressing Reveal. An answer is correct when it matches the Correct answer in Content. Mastery is at least 4 of 5 correct on the first attempt. Moving the temperature and drawing samples in free exploration is not evidence.

**Misconceptions:** (1) A language model always gives the same answer to the same words (challenge 1 and free exploration). (2) A higher temperature makes the model more accurate or more "creative" without cost (challenges 2 and 5). (3) If the most likely word is correct, the model will never say the wrong one (challenge 3). (4) Temperature changes what the model knows, rather than how it chooses (challenge 4).

**Instructional Rationale:** Understand-level inference needs the learner to predict an effect from the rule and then see whether the prediction holds. Committing to an answer before the sampled results appear forces that inference, and drawing 20 samples turns a probability into a visible count.

**Content:**

Four prompts, each with five candidate next words and their probabilities at temperature 1.0 (illustrative):

| Prompt | Word 1 | Word 2 | Word 3 | Word 4 | Word 5 |
|---|---|---|---|---|---|
| 1. "Know ___" | thyself 60% | yourself 20% | the 10% | your 6% | nothing 4% |
| 2. "Nothing in ___" | excess 55% | the 15% | particular 12% | life 10% | common 8% |
| 3. "On Sundays the Grand Bazaar is ___" | closed 45% | open 30% | busy 15% | quiet 6% | crowded 4% |
| 4. "The oracle at Delphi was ___" | consulted 30% | famous 25% | a 20% | closed 15% | silent 10% |

Probabilities after applying the temperature rule, in percent, rounded to one decimal (for checking the sim):

| Prompt | Temperature 0.5 | Temperature 2.0 |
|---|---|---|
| 1 | 86.7 / 9.6 / 2.4 / 0.9 / 0.4 | 39.1 / 22.6 / 15.9 / 12.4 / 10.1 |
| 2 | 85.0 / 6.3 / 4.0 / 2.8 / 1.8 | 35.8 / 18.7 / 16.7 / 15.2 / 13.6 |
| 3 | 63.2 / 28.1 / 7.0 / 1.1 / 0.5 | 32.7 / 26.7 / 18.9 / 11.9 / 9.8 |
| 4 | 40.0 / 27.8 / 17.8 / 10.0 / 4.4 | 24.9 / 22.7 / 20.3 / 17.6 / 14.4 |

A fact note shown with prompt 3: "The Grand Bazaar is usually closed on Sundays (Chapter 2). The model's probabilities describe what is often written, not what is true."

Five challenge questions, in this order:

| # | Prompt and setting | Question | Choices | Correct answer | Why (shown as feedback) |
|---|---|---|---|---|---|
| 1 | Prompt 1, temperature 0 | In 20 tries, which word will the model choose? | thyself every time; mostly thyself, sometimes yourself; a different word each time | thyself every time | At temperature 0 the model always takes the most likely word, so the same words always get the same answer. |
| 2 | Prompt 1, temperature raised from 1.0 to 2.0 | What happens to the probability of "nothing"? | It goes up; it goes down; it stays at 4% | It goes up | A higher temperature flattens the probabilities, so the least likely word rises from 4.0% to 10.1%. |
| 3 | Prompt 3, temperature 1.0 | About how many of 20 sampled answers will say "open"? | about 0; about 6; about 15 | about 6 | At temperature 1 each word is chosen in proportion to its probability: 30% of 20 is 6, even though "open" is usually false. |
| 4 | Prompt 1, temperature lowered from 1.0 to 0.5 | What is the probability of "thyself" now? | about 30%; about 60%; about 87% | about 87% | A lower temperature sharpens the probabilities toward the favorite: 60% becomes 86.7%. The model's knowledge is unchanged; only its way of choosing changed. |
| 5 | Prompt 4 | At which temperature are the five words closest to equally likely? | 0; 0.5; 2.0 | 2.0 | The highest temperature flattens the most: at 2.0 the five range only from 24.9% to 14.4%. |

**Provenance:** All probabilities are illustrative, invented to show the rule; the sim labels them "Illustrative probabilities, not from a real model." The temperature rule is the standard softmax-temperature rescaling described in the chapter section "Next-Word Prediction." The Grand Bazaar fact is from Chapter 2, "Artificial Intelligence."

**Rules:**

- Temperature T: minimum 0.0, maximum 2.0, step 0.1, default 1.0, no unit.
- For T > 0: adjusted probability of word i = p_i^(1/T) divided by the sum over all five words of p_j^(1/T). Display to one decimal place.
- For T = 0: the most likely word has probability 100% and the others 0%. (No prompt has a tie for first place.)
- Draw 20: draws 20 independent samples from the adjusted probabilities and shows how many times each word was chosen. Counts always total 20. Samples are random each time; a new draw replaces the previous counts.
- Changing the prompt or the temperature clears the previous counts.
- Challenge mode: the prompt and temperature are set by the challenge and locked until the learner has committed an answer and pressed Reveal; Reveal then shows the adjusted probabilities and a fresh draw of 20.

**Learner Activity:**

1. The learner reads challenge 1 and chooses an answer.
2. The learner presses Reveal. The adjusted probabilities and a draw of 20 appear, followed by the feedback.
3. The learner continues through challenges 2 to 5.
4. After challenge 5, free exploration unlocks: the learner chooses any prompt, moves the temperature, and draws samples as often as they like.
5. In free exploration, the learner should notice that at temperature 1.0, prompt 3 produces "open" in some draws, and that at temperature 0 it never does.

**Feedback:** Five challenges, fixed order, one scored attempt each. Correct: "Correct:" followed by the Why text. Incorrect: "Not quite. The answer is [correct answer]:" followed by the Why text. A running count "Correct on first attempt: n of 5" is shown. After challenge 5: if the score is at least 4, "You can predict what temperature does: it changes how the model chooses, not what it knows."; otherwise, "Try challenges 2 and 4 again in free exploration: watch the bars as you move the temperature."

**Starting State:** Challenge 1 is shown: prompt 1, temperature locked at 0, the five candidate words with no bars yet, and the question "In 20 tries, which word will the model choose?"

**Chapter Anchors:** The chapter's worked example uses prompt 1 with thyself 60, yourself 20, the 10, your 6, nothing 4 percent, and gives 86.7 / 60.0 / 39.1 percent for "thyself" and 0.4 / 4.0 / 10.1 percent for "nothing" at temperatures 0.5, 1.0 and 2.0. It states that about 3 answers in 10 to prompt 3 will say "open" at temperature 1, with closed 45 and open 30 percent. Temperature 0 always takes the most likely word.
</details>

## Part Three: The Oracle's Questions, Asked of Machines

### Oracle as Data Hub

The first of last night's questions was whether Delphi, by hearing questions from cities all over the Greek world for centuries, became better informed. The idea of the **oracle as a data hub** is that the sanctuary worked, among other things, as a meeting point for information: envoys arrived from colonies in Sicily and on the Black Sea, from Sparta and Athens and Lydia, and each brought news along with a question. The priests heard which cities were planning colonies, which were at war, and which were struck by plague. Some historians have suggested that this flow of information helps explain why many of the oracle's practical answers, about where to settle or which god to honor, were sensible. It is a reasonable suggestion, not a proven one: we have no archive of the questions Delphi heard, and no ancient writer says the priests kept one.

The comparison with a language model is close, and so is the warning. A model trained on text from all over the world is a kind of data hub too, a place where an enormous number of voices have been gathered and compressed. And like Delphi's, its sources are uneven. The envoys who reached the oracle were mostly from cities that could afford the journey, and Croesus' Lydians, Chapter 17 showed, went to the front of the line. The text that reaches a language model comes mostly from people and languages that write a great deal online. A hub knows a great deal about the people who come to it, and much less about the people who never make the trip.

### Interpreting Ambiguous Answers

**Interpreting ambiguous answers** is the work of deciding what an answer that can be read in more than one way actually means for our decision. The wooden wall is the great example. Chapter 17 told how the Athenian Assembly argued over the god's words: some said the wooden wall was the old thorn hedge around the Acropolis, others said it was the fleet; the professional interpreters read "divine Salamis" as a warning, and Themistocles read it as a promise. The answer itself decided nothing. The interpreting did.

AI answers are often ambiguous in the same way, not because a god is being cryptic but because a model produces the kind of answer that usually fits a question, and usual answers are hedged. "Many visitors drive to Delphi in winter without difficulty, but conditions on mountain roads can change quickly" is true, fluent, and nearly useless for deciding about tomorrow.

**Worked example: reading an AI answer the way the Assembly read the oracle.** Let's suppose that last night we had asked a chatbot, "Should we take the coach to Delphi tomorrow if snow is forecast above Arachova?" and received the answer above. Let's apply the Assembly's method in four steps.

1. **List the readings.** It could mean "go, it is usually fine," or "be careful, it might not be," or simply "I do not know tomorrow's road conditions."
2. **Ask what each reading predicts.** "Usually fine" predicts the road will be open. "I do not know" predicts nothing at all; it is Chapter 17's hedge, an answer that cannot lose.
3. **Bring other evidence.** The real forecast for the Arachova road, the coach company's own decision (it decides whether to go), and the hotel clerk who has driven that road every winter.
4. **Decide, and own the decision.** The Athenians voted, and the choice was theirs. Ours is too: if we go and the road closes, it was not the chatbot that chose.

The method turns an answer from a verdict into one piece of evidence among several, which is all an answer ever was.

!!! mascot-tip "Ask the Source How It Could Be Wrong"
    ![Glaux giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Here's a quick diagnostic for any vague AI answer: reply, "What would have to be true for that to be wrong, and how would I check it?" A useful answer names something concrete, such as an official site, a date, or a condition. If the reply only repeats the hedge, treat the first answer as saying "I don't know."

### Human in the Loop

**Human in the loop** means designing a system so that a person reviews, and is responsible for, the decisions that an automated system recommends, rather than letting the system act on its own. The Athenian Assembly was a human in the loop of the oracle: the god's answer came in, but citizens argued over it and voted, and Themistocles, Chapter 17 noted, was valued for his own forecasting judgment, not only for his reading of the god. A human in the loop is only a safeguard if the human can actually disagree. People tend to accept a machine's recommendation even when they have reason to doubt it, a tendency researchers call **automation bias**. A loan officer who approves whatever the score says, or a teacher who never questions an at-risk flag, is in the loop on paper only. A meaningful loop needs three things: the person has time to think, has information the machine lacks, and is free to overrule it without penalty.

### Confirmation Bias

**Confirmation bias** is the habit of noticing, seeking, and believing the evidence that supports what we already think, and of overlooking the evidence against it. Croesus is its patron saint. Told that if he made war on Persia he would destroy a great empire, he heard only the reading he wanted, and never asked the obvious follow-up the Pythia later threw back at him: which empire? Xenophon, in Chapter 17, showed the same habit one step earlier, in the question itself: having already decided to go, he asked only how to succeed.

We do both with machines. We phrase questions so that they carry our answer ("Why is Delphi better than the beach for our last Sunday?"), and language models make the trap deeper, because they tend to follow the framing of a question and are trained partly on people's approval of their replies, which can teach them to agree with us. A model asked a leading question will often supply the reasons we wanted.

!!! mascot-warning "The Leading Question Gets the Agreeable Answer"
    ![Glaux warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common slip is to ask an AI "Isn't it true that...?" and take its agreement as independent support. It happens because the model follows our framing, as Apollo answered Xenophon's question rather than the one he should have asked. The fix is to ask the question both ways, or to ask directly for the strongest case against our plan, and compare the two answers.

## Part Four: Predictions That Change the World

### Self-Fulfilling Prophecy

A **self-fulfilling prophecy** is a prediction that comes true partly because it was made: people who hear it change their behavior in ways that bring it about. The American sociologist Robert K. Merton gave the idea its name in 1948, with the example of a sound bank that fails because a false rumor that it will fail sends every depositor to withdraw their money at once. The oldest example on our route is the myth of Oedipus. Chapter 17 traced its chain: Laius abandoned his son to escape the prophecy, and Oedipus fled Corinth to escape it, and each escape was a link in the chain that fulfilled it. Would it have come true if no one had heard it? In the myth, no.

The opposite also happens. A **self-defeating prophecy** is one that fails because it was made: a forecast of a traffic jam on the road to Delphi at 9 AM sends drivers out early, and the jam never forms. Both kinds matter for predictive models, because a model's prediction is not only a statement about the world; when people act on it, it becomes part of the world. The more a prediction is used, the more it changes the data from which the next prediction will be learned.

!!! mascot-thinking "A Prediction Is Also an Action"
    ![Glaux thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that a weather forecast cannot change the weather, but a forecast about people can change the people. Once a prediction is used to decide where police patrol or which class a child joins, it stops being a neutral report and starts pushing on the outcome. Ask of every prediction about people: what will we do because of it, and how will that change what happens next?

### Student Risk Prediction

**Student risk prediction** is the use of a predictive model to estimate which students are likely to fail a course, fall behind, or drop out, so that schools can help them early. Many school systems use such early-warning systems, built from attendance, grades, behavior records, and sometimes family and neighborhood data. The goal is good, since help that comes early works better, and a simple, transparent warning, such as "three weeks of missed classes," can be valuable.

The risk is a self-fulfilling loop. If a "high-risk" label leads to lower expectations or a less demanding class, the student may learn less, which raises the risk score, which confirms the label. Research on teachers' expectations, beginning with a famous and much-debated 1968 study known as *Pygmalion in the Classroom*, suggests that expectations can affect students' results, though how strongly is still argued. There is also the question of fairness: *AI-Native Schools* reports a 2023 investigation finding that Wisconsin's dropout early-warning system gave false alarms more often for Black and Hispanic students than for white students ([Student Privacy and Data Governance](https://dmccreary.github.io/ai-native-schools/chapters/10-student-privacy-data-governance/)). The test of a risk prediction is what the school does with it: a flag that brings a tutor helps; a flag that lowers the ceiling harms.

### Predictive Policing

**Predictive policing** is the use of predictive models, trained on past crime records, to forecast where crimes are likely to happen or who is likely to be involved, so that police can send patrols in advance. Its weakness is a feedback loop built from measurement bias. Crime records are not a measure of crime; they are a measure of crime that was reported or discovered. If patrols are sent where the model predicts crime, officers there will discover more of it, which adds more records from that area, which raises the next prediction for that area, while crime in unpatrolled areas goes unrecorded. In 2016 the statisticians Kristian Lum and William Isaac used police records from Oakland, California, to show how such a loop could send officers again and again to the same neighborhoods, even though health surveys suggested that drug use was spread widely across the city. Several American cities that tried predictive policing have since stopped using it, citing doubts about both its effectiveness and its fairness. The general point is the one Oedipus teaches: when a prediction guides the action that produces the next data, the model can end up predicting its own behavior.

The MicroSim below lets us trace three loops like these and tell which kind each one is.

#### Diagram: When a Prediction Feeds Itself

<details markdown="1">
<summary>When a Prediction Feeds Itself</summary>
Type: causal-loop
**sim-id:** prediction-feedback-loops<br/>
**Library:** vis-network<br/>
**Status:** Specified<br/>
**Bloom Level:** Analyze<br/>
**Bloom Verb:** differentiate<br/>
**Learning Objective:** The learner will differentiate reinforcing loops, in which a prediction helps bring itself about, from balancing loops, in which a prediction helps prevent itself, by labeling the direction of every link in three prediction loops and classifying each loop, with at least 9 of 10 links and all 3 loops correct.

**Prerequisites:** predictive model, data bias (measurement bias), self-fulfilling prophecy, self-defeating prophecy, student risk prediction, predictive policing (defined in Parts One and Four above).

**Evidence of Mastery:** The learner labels each of the 10 links as "same direction" (+) or "opposite direction" (−), then classifies each of the 3 loops as reinforcing or balancing, then answers one question per loop. A label, classification or answer is correct when it matches the Content tables. Mastery is at least 9 of 10 links, 3 of 3 loops and 2 of 3 loop questions correct on the first attempt. Opening a node's explanation is exploration, not evidence.

**Misconceptions:** (1) A loop with a minus sign in it must be balancing (Loop 2 has two minus signs and is reinforcing). (2) A prediction that comes true proves the model was accurate (Loop 1). (3) A forecast that "failed" was a bad forecast (Loop 3). (4) Taking more data from the same source fixes a feedback loop (Loop 1 question).

**Instructional Rationale:** Analyze-level work means taking a loop apart into its links and finding the structure that decides its behavior. Labeling each link before classifying the loop makes the learner derive the loop type from the parts, using the counting rule, rather than guessing from the story's moral.

**Content:**

Definitions shown to the learner:

- Same direction (+): if the first factor rises, the second rises; if the first falls, the second falls.
- Opposite direction (−): if the first factor rises, the second falls; if the first falls, the second rises.
- Reinforcing loop: a change travels around the loop and comes back larger, in the same direction. A self-fulfilling prediction is a reinforcing loop.
- Balancing loop: a change travels around the loop and comes back opposed. A self-defeating prediction is a balancing loop.
- Counting rule: a loop with an even number of opposite (−) links, including zero, is reinforcing; a loop with an odd number is balancing.

Nodes, links and correct labels (loops are named Loop 1, Loop 2 and Loop 3 so that no name gives the answer away):

| Link | Loop | From | To | Correct label | Why (shown as feedback) |
|---|---|---|---|---|---|
| L1 | 1 | Predicted crime in a district | Patrols sent to that district | + | Police send more patrols where the model predicts more crime. |
| L2 | 1 | Patrols sent to that district | Crimes recorded in that district | + | More officers on the street discover and record more of the crime that is there. |
| L3 | 1 | Crimes recorded in that district | Predicted crime in a district | + | The model is retrained on the records, so more records raise the next prediction. |
| L4 | 2 | Student's risk score | Placement in a lower-level course | + | A higher score makes a lower-level placement more likely. |
| L5 | 2 | Placement in a lower-level course | Access to challenging coursework | − | The lower-level course offers less challenging work. |
| L6 | 2 | Access to challenging coursework | Grades and test scores | + | Students who are taught more challenging material tend to score higher on it. |
| L7 | 2 | Grades and test scores | Student's risk score | − | Higher grades lower the risk score. |
| L8 | 3 | Predicted traffic at 9 AM on the Athens–Delphi road | Drivers who leave earlier or take another road | + | A forecast of heavy traffic sends more drivers out early or onto other roads. |
| L9 | 3 | Drivers who leave earlier or take another road | Traffic at 9 AM | − | The more drivers avoid 9 AM, the lighter the 9 AM traffic. |
| L10 | 3 | Traffic at 9 AM | Predicted traffic at 9 AM on the Athens–Delphi road | + | Next week's forecast is learned from this week's traffic. |

Loops and correct classifications:

| Loop | Links | Opposite links | Correct classification | Why (shown as feedback) |
|---|---|---|---|---|
| 1 | L1, L2, L3 | 0 | Reinforcing | No opposite links: a higher prediction brings more patrols, more records, and a still higher prediction, whatever the true crime rate. |
| 2 | L4, L5, L6, L7 | 2 | Reinforcing | Two opposite links cancel: a higher risk score leads, through less challenging work and lower grades, to a still higher risk score. |
| 3 | L8, L9, L10 | 1 | Balancing | One opposite link: a forecast of heavy traffic leads to lighter traffic and a lower forecast next week, so the prediction defeats itself. |

Outside factor shown in Loop 1 but not part of the loop: "True crime in the district," with a + link to "Crimes recorded in that district." Its note reads: "Records rise with true crime and with patrols; the model cannot tell which."

Loop questions (one per loop, three choices each):

| # | Question | Choices | Correct | Why (shown as feedback) |
|---|---|---|---|---|
| Q1 | Which change would weaken Loop 1? | Train the model on crimes reported by victims and residents rather than on crimes discovered by patrols; send more patrols to every district; retrain the model every week instead of every month | Train on reported crimes | Records that do not depend on where the patrols went no longer carry L2's effect into L3; more patrols or more frequent retraining only feed the same loop. |
| Q2 | Which use of the risk score would turn Loop 2 from harm to help? | Keep the student in the challenging course and add tutoring when the score is high; hide the score from the student; recompute the score every month | Keep the course and add tutoring | Adding support instead of lowering the placement replaces link L5's loss of challenging work with more help, so a high score leads to higher grades. |
| Q3 | Next Sunday the 9 AM forecast said "heavy traffic," and the road was light. What is the best explanation? | Drivers acted on the forecast, so the jam it predicted did not form; the model was badly trained; traffic is purely random | Drivers acted on the forecast | In a balancing loop a useful forecast can look wrong, because people change their behavior to avoid what it predicts. |

**Provenance:** The loops are simplified from the chapter sections "Self-Fulfilling Prophecy," "Student Risk Prediction," and "Predictive Policing." The link directions are the chapter's qualitative claims, not measured effects; the sim labels the diagram "Simplified causal model: directions only, no sizes."

**Rules:**

- Links are labeled one at a time in the order L1 to L10 (fixed). Each link has one scored attempt; after it, the correct label and Why text are shown and the link displays its correct sign.
- A loop can be classified only after all of its links are labeled. Each loop has one scored attempt.
- The loop questions are answered after all three loops are classified, in the order Q1, Q2, Q3, one scored attempt each.
- Scoring: links 0 to 10, loops 0 to 3, questions 0 to 3. Mastery requires links >= 9, loops = 3 and questions >= 2.
- The counting rule is shown only after the learner's first loop classification, whether right or wrong.
- Start Over resets every label, classification, answer and score.

**Learner Activity:**

1. The learner reads the definitions of same-direction and opposite-direction links and sees Loop 1 with its three links unlabeled.
2. The learner labels L1, L2 and L3; after each, the feedback appears and the sign is drawn on the link.
3. The learner classifies Loop 1 as reinforcing or balancing; the feedback and the counting rule appear.
4. The learner repeats steps 2 and 3 for Loop 2 (L4 to L7) and Loop 3 (L8 to L10).
5. The learner answers Q1, Q2 and Q3.
6. The learner should notice that Loop 2 contains two opposite links and still reinforces, and that the loop which looks like a failed forecast, Loop 3, is the one in which the forecast worked.

**Feedback:** Correct link: "Correct:" plus the Why text. Incorrect link: "This link runs the [same/opposite] way:" plus the Why text. Correct loop: "Correct:" plus the Why text. Incorrect loop: "Count the opposite links: [n]. This loop is [classification]:" plus the Why text. Questions: "Correct:" or "The best answer is: [choice].", plus the Why text. Running scores "Links n of 10, Loops n of 3, Questions n of 3" are shown throughout. At the end, if mastery is met: "You can read a feedback loop: a prediction about people can make itself come true, or keep itself from coming true."; otherwise: "Look again at Loop 2: count its opposite links before deciding."

**Starting State:** Loop 1 is shown with its three nodes, the outside factor, and three unlabeled links. The question on screen is "If the model predicts more crime here, what happens next?"

**Chapter Anchors:** The chapter describes the predictive policing loop (patrols where crime is predicted, more crime discovered, more records, higher prediction), the student risk loop (a high-risk label leading to a less demanding class, lower learning and a higher score), and a self-defeating traffic forecast for 9 AM on the road to Delphi. It names Merton (1948) and the Lum and Isaac Oakland study (2016), which the sim does not need to show.
</details>

## Part Five: What Earns Trust

### Who Funds the Model

**Who funds the model** is the question of who pays to build and run a prediction system, and how that payment might shape whose interests it serves. Delphi answers the question vividly. Croesus' gold bought his Lydians the right to consult first and pay no fees. The Alcmaeonids, Herodotus says, rebuilt the temple's front in marble and also bribed the Pythia to tell every Spartan who came, on any business, to free Athens; the Spartans eventually did. Chapter 17 showed the defense too: when the Spartan king Cleomenes' bribery was found out, the Pythia was removed from office.

Building a large AI model today costs so much in computing, energy, and expert labor that only a small number of companies, and a few governments and research groups, can do it. That does not make the models corrupt. It does mean that four questions belong with every answer we get from one: *Who built it?* *How does it earn money:* subscriptions, advertising, selling to businesses, or public funding? *What would it gain* by steering our choice, toward a product, a store, or simply toward spending more time with it? *Who checks it* from outside, as the Amphictyonic League was supposed to check the sanctuary? For schools the question is sharper still, because a free tutoring app may be paid for with students' data. Some models are released openly, so that anyone can run and inspect them; others are closed. Neither kind is automatically trustworthy, but a source that can be inspected can be checked.

### Model Calibration

**Model calibration** is how well the probabilities a forecaster gives match how often things actually happen. A forecaster is **well calibrated** if, of all the days on which they said "70 percent chance of rain," it rained on about 70 percent. Chapter 17 noted that a percentage forecast cannot be proven wrong by a single day; calibration is how it can be tested over many. A forecaster who says 90 percent when the true frequency is 60 percent is **overconfident**; one who says 60 percent when the true frequency is 90 percent is **underconfident**. Calibration is not the same as being right: a forecaster who says "30 percent" every day in a place where it rains on 30 percent of days is perfectly calibrated and not very helpful. The best forecasters are both calibrated and sharp, willing to say 90 or 10 percent when they have reason to.

**Worked example: two forecasters, ten rainy-season days each.** Let's compare two forecasters for Delphi, with illustrative records. Forecaster A said "70 percent chance of rain" on ten days, and it rained on 7 of them. Forecaster B said "90 percent" on ten other days, and it rained on 6. A said 70 and got 70: well calibrated. B said 90 and got 60: overconfident. We can put a number on the difference with the **Brier score** <audio id="audio-brier" src="../../audio/brier.mp3" preload="none"></audio><button onclick="document.getElementById('audio-brier').play()" class="pronounce-btn">🔊 Pronounce</button> *BRY-er*, the average of the squared differences between the forecast probability and what happened (1 if it rained, 0 if not). Lower is better; 0 is perfect.

| | Forecaster A | Forecaster B |
|---|---|---|
| Forecast | 70 percent, 10 days | 90 percent, 10 days |
| Days with rain | 7 | 6 |
| Calibration | Well calibrated | Overconfident by 30 points |
| Score on a rainy day | \( (0.7 - 1)^2 = 0.09 \) | \( (0.9 - 1)^2 = 0.01 \) |
| Score on a dry day | \( (0.7 - 0)^2 = 0.49 \) | \( (0.9 - 0)^2 = 0.81 \) |
| Brier score | \( (7 \times 0.09 + 3 \times 0.49) \div 10 = 0.21 \) | \( (6 \times 0.01 + 4 \times 0.81) \div 10 = 0.33 \) |

B's confident forecasts look impressive on the six rainy days, but they are punished heavily on the four dry ones, and A wins. For comparison, a forecaster who said "50 percent" every day would score exactly 0.25, so B did worse than not forecasting at all. Studies since the 1970s have found that professional weather forecasts are among the best-calibrated predictions people make, largely because forecasters get fast, public feedback every day. Most of us are less calibrated: when we say we are "90 percent sure" of a fact, we are usually right less often than that.

!!! mascot-encourage "Probabilities Feel Slippery at First"
    ![Glaux encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    If "70 percent" still feels like a vague hunch rather than a claim that can be checked, that is normal; most people need to keep score for a while before it clicks. Start the way the forecasters do: write down a percentage for a few small things each day, then count how often the 70s came true. The game below does the counting for you.

The MicroSim below turns this into a game: we give probabilities for twelve statements from this book, and it tells us how calibrated we were.

#### Diagram: How Calibrated Are You?

<details markdown="1">
<summary>How Calibrated Are You?</summary>
Type: microsim
**sim-id:** calibration-confidence-game<br/>
**Library:** p5.js<br/>
**Status:** Specified<br/>
**Template:** https://github.com/dmccreary/ai-persona-testing/tree/main/docs/sims/confidence-calibration-challenge<br/>
**Bloom Level:** Evaluate<br/>
**Bloom Verb:** assess<br/>
**Learning Objective:** The learner will assess whether their own probability judgments, and those of two weather forecasters, are overconfident, underconfident, or well calibrated, by stating probabilities for twelve statements and judging the results against a reliability table, with all three assessments correct.

**Prerequisites:** probability, prediction uncertainty, model calibration, overconfident, underconfident, Brier score (defined in "Prediction Uncertainty" and "Model Calibration" above).

**Evidence of Mastery:** Three committed judgments, each with one attempt: (1) after stating probabilities for the twelve statements and seeing their reliability table, the learner judges their own record as overconfident, about right, or underconfident; it is correct when it matches the verdict computed by Rules; (2) the learner judges which of Forecaster A and Forecaster B is better calibrated; (3) the learner judges whether Forecaster B was overconfident or underconfident. Mastery is 3 of 3 correct. Stating the twelve probabilities is the data for judgment 1, not itself evidence.

**Misconceptions:** (1) Being confident is the same as being well calibrated (Forecaster B; statements answered at 100 percent). (2) A 70 percent forecast is "wrong" whenever the event does not happen (Forecaster A). (3) Saying 50 percent on everything is a safe strategy (the 0.25 baseline). (4) Twelve answers are enough to know one's calibration for sure (the small-sample note).

**Instructional Rationale:** Evaluate-level work asks the learner to judge a record against a standard. Generating their own record first makes the judgment personal and exposes overconfidence directly, and the two forecasters give a second, cleaner case in which the standard can be applied without the learner's own stakes.

**Content:**

Part A: twelve statements, shown one at a time in this order. The learner states the probability that each statement is true.

| # | Statement | True or false | Why (shown after the learner commits) |
|---|---|---|---|
| 1 | Mount Parnassus rises more than 2,000 m above sea level. | True | It rises to 2,457 m (Chapter 17). |
| 2 | Delphi is more than 300 km by road from Athens. | False | It is about 180 km, about two and a half hours by coach (Chapter 18). |
| 3 | The Oracle of Delphi gave answers for more than 1,000 years. | True | From at least about 750 BCE to 391 CE, about 1,140 years (Chapter 17). |
| 4 | The Byzantine Empire lasted longer than the oracle did. | False | The Byzantine Empire lasted 1,123 years; the oracle about 1,140 (Chapter 17). |
| 5 | Herodotus wrote down the Croesus prophecy within 20 years of the fall of Sardis. | False | He wrote about 115 to 120 years later (Chapter 17). |
| 6 | Joseph Fontenrose collected more than 500 Delphic responses. | True | He collected about 535 (Chapter 17). |
| 7 | More than 4,000 lead question tablets survive from the oracle of Zeus at Dodona. | True | More than 4,000 survive (Chapter 17). |
| 8 | The Temple of Apollo whose ruins we saw at Delphi was finished in the 6th century BCE. | False | It was finished around 330 BCE, in the 4th century; the 6th-century temple burned in 548 BCE (Chapter 17). |
| 9 | At Salamis, Athens supplied almost half of the Greek ships. | True | 180 of 378 ships, about 48 percent (Chapter 15). |
| 10 | The council of the Amphictyonic League had 24 votes. | True | Twelve member peoples with two votes each (Chapter 17). |
| 11 | Fewer than 100 records of freed slaves survive at Delphi. | False | More than a thousand manumission records survive (Chapter 18). |
| 12 | The Athenian Treasury at Delphi was rebuilt from its original blocks in the 20th century. | True | French archaeologists rebuilt it between 1903 and 1906 (Chapter 18). |

Totals: 7 true (1, 3, 6, 7, 9, 10, 12) and 5 false (2, 4, 5, 8, 11).

Part B: two forecasters' records (illustrative), shown after Part A.

| Forecaster | Forecast | Days | Days with rain | Brier score |
|---|---|---|---|---|
| A | 70% chance of rain | 10 | 7 | 0.21 |
| B | 90% chance of rain | 10 | 6 | 0.33 |

Judgment questions:

| # | Question | Choices | Correct | Why (shown as feedback) |
|---|---|---|---|---|
| J1 | Looking at your reliability table, how calibrated were you? | Overconfident; about right; underconfident | The verdict computed by Rules | Your average confidence was [c]% and you were right [h]% of the time. |
| J2 | Which forecaster is better calibrated? | A; B | A | A said 70% and it rained on 7 of 10 days; B said 90% and it rained on 6 of 10. |
| J3 | Was Forecaster B overconfident or underconfident? | Overconfident; underconfident | Overconfident | B's 90% came true only 60% of the time, so B claimed more certainty than the record supports. |

Notes always shown with the results: "Twelve answers is a small sample; forecasters are judged over hundreds." and "Saying 50% on everything scores 0.25: never wrong, never useful."

**Provenance:** Statements 1 to 12 and their reasons come from Chapters 15, 17 and 18 of this book, as cited in each row; the sim copies them verbatim. Forecaster records are illustrative and labeled "Illustrative records." The Brier score values are computed from the Rules and match the chapter's worked example in "Model Calibration."

**Rules:**

- Probability input for each statement: minimum 0, maximum 100, step 10, default 50, unit percent; it means "the chance this statement is true."
- The learner must commit a probability before the answer and reason are shown; a committed probability cannot be changed.
- Brier score: the mean over all twelve statements of (p − o)², where p is the probability as a fraction (0.0 to 1.0) and o is 1 if the statement is true and 0 if false. Range 0.00 to 1.00, shown to two decimals; lower is better. Baseline for always answering 50 percent: 0.25.
- Leaning: p > 50 means the learner leans "true" with confidence p; p < 50 means the learner leans "false" with confidence 100 − p; p = 50 means no lean. A leaned statement is a hit when the lean matches the truth.
- Reliability table: one row for each confidence level 60, 70, 80, 90 and 100 percent, showing the number of leaned statements at that level, the number of hits, and the percentage of hits; a row with no statements shows "none."
- Verdict for J1: compute c = mean confidence of leaned statements and h = percentage of leaned statements that were hits. Overconfident if c − h > 10 percentage points; underconfident if c − h < −10; about right if −10 <= c − h <= 10.
- J1 unlocks only if at least 6 of the 12 statements are leaned (p ≠ 50). If fewer are leaned, the sim says "Lean one way on at least 6 statements so there is a record to judge," and offers Try Again.
- The verdict, c and h are shown only after J1 is committed; the reliability table and Brier score are shown before.
- Try Again clears all twelve probabilities, the judgments and the scores.

**Learner Activity:**

1. The learner reads statement 1 and sets a probability that it is true.
2. The learner presses Commit; the truth and the reason appear.
3. The learner continues through all twelve statements.
4. The sim shows the learner's Brier score, the 0.25 baseline, and the reliability table.
5. The learner answers J1, judging their own calibration from the table; the verdict with c and h appears.
6. The learner sees the two forecasters' records and answers J2 and J3.
7. The learner should notice whether their 90 and 100 percent answers were right as often as they claimed, and that Forecaster B's confident record scored worse than the 50 percent baseline.

**Feedback:** For each statement after Commit: "True." or "False." followed by the reason, and "Your score on this one: [(p − o)² to two decimals]." For J1, J2 and J3: correct shows "Correct:" plus the Why text; incorrect shows "Not quite:" plus the Why text. One attempt each; the correct answer is shown after the attempt. At the end: if J1, J2 and J3 are all correct, "You can judge a forecaster, including yourself: confidence has to be earned by the record."; otherwise, "Compare the stated percentage with the percentage that came true, row by row."

**Starting State:** Statement 1 is shown with the probability set to 50 percent, a Commit control, and the question "How likely is this to be true?"

**Chapter Anchors:** Forecaster A: 70 percent on ten days, rain on 7, Brier score 0.21. Forecaster B: 90 percent on ten days, rain on 6, Brier score 0.33, overconfident by 30 points. Always saying 50 percent scores 0.25. Twelve statements from this book.
</details>

### Track Record and Trust

**Track record and trust** is the principle that a source of predictions deserves trust in proportion to its record of predictions made, and written down, before the outcomes were known. Chapter 17 asked who remembers Delphi's misses. Nobody kept a scorecard. Every famous prophecy in Chapter 17's table was first written down after it "came true," and the oracle's 1,140 years of trust rested on stories of hits, while the misses, if there were any, were forgotten or explained away. Croesus came closest to a scorecard. Before trusting any oracle, he tested seven of them with a question whose answer he alone knew, what he was doing on the hundredth day, and only Delphi passed. In modern terms, he ran a **benchmark**: a test with known answers, used to compare sources before relying on them. And his story shows the benchmark's limit: an oracle that could see a tortoise boiling in Sardis still gave him an answer he misread about the future.

AI systems are judged the same way today, on benchmarks of questions with known answers, and the same limits apply. A model can do well on a test it has, in effect, seen before, and a high score on one kind of task says little about another. The track records worth trusting are public, cover many predictions, include the misses, and were scored by someone other than the forecaster.

### Testability of Predictions

**Testability of predictions** is the property of a claim that lets the world prove it wrong: it says clearly enough what will happen, and when, that a later observation could contradict it. Chapter 17's test was "a prediction has to be able to lose." Testability adds what is needed to *check* that it lost: a claim recorded before the outcome, an outcome that can be observed, a deadline, and, for a probability, many such claims to score. A hedge cannot be tested at all; a single probability can be tested only as part of a record; a clear, dated, recorded claim can be tested by anyone.

**Worked example: rewriting the Croesus answer so it could lose.** Let's take the most famous untestable answer and make it testable, one step at a time.

| Version | The claim | Could it lose? |
|---|---|---|
| The oracle's | "If you make war on the Persians, you will destroy a great empire." | No: either empire's fall fulfills it |
| Name the empire | "If you make war on the Persians, you will destroy the Persian Empire." | Yes, but only someday |
| Add a deadline | "If you cross the Halys this year, Persia will fall within three years." | Yes, and soon enough to check |
| Add a probability | "If you cross the Halys this year, there is a 30 percent chance that Persia falls within three years." | Only as part of a record of many such forecasts |
| Record it in advance | The same, carved on a dated stone before Croesus marches | Yes, and no one can rewrite it afterward |

The last row is what Delphi never did, and it is what makes a modern forecast trustworthy: the prediction is fixed before the outcome. The same rewriting works on claims about AI. "AI will transform education" cannot lose. "By the end of 2028, a majority of the public schools in our state will give every student access to an AI tutor during the school day" can, and in three years someone can check.

### Prediction Horizon

The **prediction horizon** is how far ahead a forecaster can predict with useful accuracy before its predictions become no better than a guess based on long-run averages. Chapter 17 ended with Apollo's winter absence: for three months of the year, even the god of prophecy did not answer. Every forecaster has its own winter. For daily weather, useful detail fades after about a week to ten days. In the 1960s the meteorologist Edward Lorenz showed why: the atmosphere is chaotic, so small errors in today's measurements double and double again until, after roughly two weeks, the forecast says nothing that a calendar of average weather could not. Beyond the horizon, the honest forecast is the long-run average: "Delphi in late November is usually cold, often wet." Different questions have different horizons. A train timetable can be trusted for months; the result of an election can be forecast only roughly a year out; a single coin toss cannot be predicted at all. A good forecaster knows its horizon and says so. A bad one answers every question at the same confident length, which is one more thing to check about a chatbot asked about next week.

### AI Capability Forecasting

**AI capability forecasting** is predicting what AI systems will be able to do in the future, so that schools, companies, and governments can plan. It is hard for all the reasons in this part: the systems change quickly, their builders have reasons to promise much, and "capability" is hard to measure. One careful approach comes from METR, a nonprofit research organization that studies what advanced AI systems can do on their own. Instead of a test score, METR measures the length of task, in the time a skilled person would need to do it, that an AI system can complete about half the time, which it calls the **50 percent time horizon**. Measured this way, the horizon has been growing quickly: in its 2025 study, METR found that the length of task the best systems could complete had been doubling every several months for several years. That is a measured trend, not a promise. *AI-Native Schools* explains how METR produces the number, and why a 50 percent success rate is a coin flip rather than a reliable worker, in [Measuring AI Capability: The METR Task-Horizon Studies](https://dmccreary.github.io/ai-native-schools/chapters/04-measuring-ai-capability-metr/).

### AI Doubling Curves

An **AI doubling curve** is a chart of some measure of AI, such as the task horizon, computing power, or cost, that grows by doubling at a steady interval, and the projection made by extending that doubling into the future. Doubling is deceptive. Something that doubles every five months grows about fivefold in a year and nearly 150-fold in three years, so a curve that looks flat for years can suddenly seem to explode. The forecast's weakness is the one Part Two gave every prediction: it assumes the forces behind the trend continue. Many curves that looked like endless doubling turned out to be the early part of an S-shape that levels off when it meets a limit, such as energy, money, or data. And a small change in the doubling time changes the long-range answer enormously. *AI-Native Schools* works through these projections and their uncertainty, and how a school can plan with a range of scenarios instead of one line, in [Projecting AI Growth: Doubling Curves, Limits, and Uncertainty](https://dmccreary.github.io/ai-native-schools/chapters/05-projecting-ai-growth-doubling-curves/). By the measure of this chapter, the honest AI forecast states its range, names its horizon, and gets checked.

## Part Six: An Answer as the Start of an Inquiry

### Answer as Start of Inquiry

An **answer as the start of an inquiry** is an answer treated not as the end of thinking but as a claim to be tested, which then becomes the beginning of an investigation. Chaerephon's question is the model. Told that no one was wiser than Socrates, Socrates did not accept the compliment, and he did not dismiss it. He set out to test it, questioning politicians, poets, and craftsmen, and concluded that his only wisdom was knowing what he did not know. Chapter 17 noted that of all the famous answers, this is the only one whose questioner treated it as a beginning. It is also the only one that has lasted as a way of life: the Socratic method of Chapter 9, teaching by questions, grew out of it. An answer that is tested teaches us something whether it passes or fails. An answer taken on trust teaches us only what the source already believed.

### AI as Thinking Partner

**AI as a thinking partner** is using an AI system to help us think, by asking it to question our reasoning, argue the other side, explain a step, or suggest what to check, rather than to think for us by handing over a finished answer. It is the Socrates habit applied to a machine. The difference is not in the technology but in how we ask.

| Asking for an answer | Asking for a thinking partner |
|---|---|
| "Write our Delphi travel journal entry." | "Ask me five questions about today that would help me write it." |
| "Was the oracle a fraud?" | "Give me the strongest case that the Pythia was sincere, then the strongest case against, and tell me what evidence would settle it." |
| "Which Athens museum should we see tomorrow?" | "Here is what we loved this week. What should we ask ourselves before choosing a museum?" |
| "Explain the geological fault theory." | "I think the ethylene theory was disproved. Check my reasoning and tell me where I'm wrong." |

**Worked example: one question, asked two ways.** Let's take the second row and imagine the replies. Asked "Was the oracle a fraud?", a chatbot will produce a balanced paragraph, and we will remember whichever half confirmed what we thought, Croesus' error again. Asked for both cases and the deciding evidence, it gives us Fontenrose's plain historical answers, Plutarch's sincere priesthood, the Alcmaeonid bribery, and the disputed gas, and then the question becomes ours to weigh, as it was for Socrates. The second way takes longer, and it is the way that leaves us knowing more. *AI-Native Schools* builds this idea into the design of AI tutors, which offer hints and questions rather than answers, in [AI Guardrails: Teaching Thinking Without Over-Reliance](https://dmccreary.github.io/ai-native-schools/chapters/12-ai-guardrails-teaching-thinking-without/), and tomorrow, at the Lyceum, Chapter 20 picks up tutoring and the old fear that a new tool will think for us.

## Part Seven: What Prediction Cannot Decide

### Values Beyond Prediction

**Values beyond prediction** is the principle that a prediction can tell us what is likely to happen if we act, but not what we ought to want; deciding what matters is a question of values, and no model can answer it for us. Chapter 17 showed that "Know thyself" was carved on the porch, free, before anyone reached the Pythia's paid answer: know who you are and what you care about before you ask what will happen. Philosophers since the 18th-century Scottish thinker David Hume have pointed out that no amount of facts about what *is* adds up to a conclusion about what *ought* to be. A model can predict that a child will score higher on next year's test if she drops music for extra math; whether that trade is worth it is a question about what a good education is for. Recommendation systems predict what we will click, not what we would choose on reflection. The temple's order is still the right one: the free advice first, then the paid answer.

!!! mascot-thinking "The Porch Before the Tripod"
    ![Glaux thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of every AI question as a visit to Delphi with two stops. At the tripod, we ask what will happen. At the porch, which comes first, we have to answer for ourselves what we want to happen, and no machine can stand there for us.

### Climate Models

A **climate model** is a computer simulation of the Earth's climate system, the atmosphere, oceans, ice, and land, built from the laws of physics and used to project how the climate will change over decades under different assumptions about future emissions of greenhouse gases. Climate models are cousins of weather models, but they answer a different question. A weather forecast predicts the state of the atmosphere on a particular day, and its horizon is about two weeks. A climate model does not try to say whether it will rain at Delphi on November 22, 2060; it projects the long-run average, which is predictable for the same reason that we can be sure the coming July will be hotter than January without knowing the weather on any day of it.

Two terms keep climate forecasts honest. A **projection** is a forecast that depends on a stated condition: "*if* emissions follow this path, global warming will be about this much by 2100." A **scenario** is the stated path. Climate scientists publish several scenarios, from rapid cuts to continued growth in emissions, because the biggest uncertainty about the climate of 2100 is not the physics but what people will choose to do. That makes climate projections the opposite of a self-fulfilling prophecy: they are made so that the worst ones will not come true.

**Worked example: testing old climate models.** Let's apply Part Five's test of a track record. A prediction earns trust when it was recorded before the outcome and later checked. Climate models have been making projections since the 1970s, so we can now check the old ones against the warming that followed. A 2020 study did exactly that for a set of models published between 1970 and 2007, and found that most of them had projected the warming that actually occurred, once differences between the emissions they assumed and the real emissions were taken into account. The Intergovernmental Panel on Climate Change, the United Nations body that assesses climate science, reported that by the decade 2011–2020 the Earth's surface had warmed by about 1.1 °C since the late 19th century. In the 2015 Paris Agreement, nearly every country agreed to aim to hold warming well below 2 °C and to pursue efforts to limit it to 1.5 °C. Scientists describe the Mediterranean as a climate-change hotspot, warming faster than the global average, and the dry hills we have driven through this week are part of that story.

"Nothing in excess," the second saying on the temple, is a fair summary of what climate models ask of us: a sense of limits. The models can tell us roughly what each path is likely to bring. They cannot tell us which path to take, which returns us to the porch.

### Acting on Foresight

**Acting on foresight** is making a decision now, at a known cost, because of a prediction about the future, before the predicted outcome is certain. The hardest part of foresight is not seeing what may come but acting on it. Chapter 15 gave us the classic case: in 483 BCE, when the silver mines at Laurion struck a rich vein, Themistocles persuaded the Athenians to build 200 warships instead of sharing out the money, and three years later those ships won at Salamis. The citizens gave up ten drachmas each, a sure cost, against an uncertain threat. Had Persia never come, the ships would have looked like a waste.

**Worked example: the umbrella rule.** Let's make the logic exact with a decision we face every morning. Suppose carrying an umbrella costs us a little bother, which we will call 1 unit, and getting soaked on a day out costs us much more, say 4 units. If the chance of rain is \( p \), then not carrying the umbrella costs us \( 4p \) on average, and carrying it costs 1 every time. Carrying it is worth it when \( 4p > 1 \), that is, when \( p > 1 \div 4 = 0.25 \), or 25 percent. So with a 30 percent chance of rain at Delphi, we carry the umbrella; with 20 percent in Athens tomorrow, we leave it. The general rule is to act when the probability is greater than the cost of acting divided by the loss it prevents. The rule explains why sensible people act on predictions that will "probably not" come true: when the loss is large and the precaution cheap, a small probability is enough. It is the reasoning behind flood barriers, vaccines, insurance, and Themistocles' ships, and it is why a calibrated forecast is so valuable, because the rule only works if the probability can be trusted.

!!! mascot-tip "Divide the Cost by the Loss"
    ![Glaux giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Here's a shortcut for any precaution: divide what it costs by what it would save, and act if the forecast's chance is higher than that fraction. A cheap precaution against a big loss is worth taking at quite low odds. If you cannot put numbers on either one, at least ask which is bigger.

### Long-Term Consequences

**Long-term consequences** are the effects of a decision that arrive years, generations, or centuries after it is made, often long after the people who made it are gone. They are hard to weigh because they fall beyond every prediction horizon, and because the people who will bear them cannot vote today. Our route is full of decisions made for the long term. After the First Sacred War, Chapter 17 told, the plain below Delphi was dedicated to Apollo and left unfarmed, a rule meant to bind every later generation. The Ottoman vakıf endowments of Chapter 5 were written to run forever, and some ran for four hundred years. The carbon dioxide we emit on this trip will go on warming the planet for centuries. "Nothing in excess" is, among other things, advice about the long term: the excess that seems harmless this year is the one our grandchildren inherit. For education, the long term is the whole point, since a school's choices about AI today shape what its five-year-olds can do when they are thirty.

## Part Eight: Who Asked, and Where the Parallel Breaks

### Consent in Mass Prediction

**Consent in mass prediction** is the question of whether the people a predictive system makes predictions about have agreed to it, or even know about it. At Delphi, every prediction was asked for. A consultant climbed the mountain, paid the fee, and put a question; no one received an oracle about themselves without asking. Today the arrangement is reversed. Predictions about us are made constantly, by systems we never consulted, from data we may not know we gave.

**Worked example: the predictions made about us today.** Let's count the predictions that were probably made about us on this one Sunday, without our asking.

- **The bank card** we used for lunch in Arachova was checked by a fraud model that predicted whether the purchase was really ours.
- **The phone's keyboard** predicted our next word in every message home.
- **The map app** predicted the drive time back to Athens from the movements of thousands of other phones.
- **The streaming service** in the hotel will predict what we want to watch tonight.
- **The airline** may already be predicting, from our booking and browsing, which seat upgrade we might pay for on the flight home.
- **Advertising systems** predicted, from our searches about Delphi, which hotels and tours to show us next.

Most of these are helpful, and the fraud check protects us. We agreed to many of them, technically, by accepting terms we did not read. But we asked for none of them, and we can see the workings of none. When predictions decide matters that are more serious, a loan, a job interview, a child's school placement, the question of consent becomes urgent. European data-protection law gives people some rights not to be subject to important decisions made solely by automated systems, and to an explanation of them, and other places are debating similar rules. Students cannot really consent for themselves at all, which is why their data needs special protection; *AI-Native Schools* sets out the laws and the governance practices in [Student Privacy and Data Governance](https://dmccreary.github.io/ai-native-schools/chapters/10-student-privacy-data-governance/). The question to carry home is simple: who asked for this prediction, and who gets to see it?

### Limits of the Oracle Parallel

The **limits of the oracle parallel** are the ways in which Delphi is not like a modern predictive model, and where reading one as a lesson about the other misleads. The parallel has carried this chapter, so it is fair to end by saying where it breaks.

| | The Oracle of Delphi | A modern predictive model |
|---|---|---|
| What it was | A religious institution, a living faith for its users | A tool, built from data and arithmetic |
| Who asked | Only those who chose to come | Often no one; predictions are made about us without asking |
| How many answers | A few per consultation day, nine months a year | Millions a day |
| Its typical answer | Mostly commands and approvals, by Fontenrose's count | Mostly probabilities and generated text |
| Can it be tested? | Barely; famous answers were written down afterward | Yes, at scale, if someone records and scores its predictions |
| Who stood behind it | People, the Pythia and the priests, with their own judgment and interests | Companies and institutions; the model itself has no aims of its own, as far as we know |
| How it could be checked | By the Amphictyonic League, and by its consultants' choice to stop coming | By audits, regulators, published evaluations, and the law |

Three of these differences matter most. First, **respect**: for the people who climbed to Delphi, consulting Apollo was an act of piety, as Chapter 17 insisted, and reducing it to "an early algorithm" misses what it meant to them. Second, **testability**: we can do something with models that no one ever did with the oracle, which is to keep score, so the lessons of Part Five are not only possible but expected. Third, **scale and consent**: the oracle answered the few who asked; models predict the many who did not. In that respect, the modern situation is harder than the ancient one, and the old wisdom, test the answer, own the decision, know yourself, and keep a measure, is needed more, not less.

### Delphi Reflection Questions

**Delphi reflection questions** are a short set of questions, in our own words, about how the oracle's lessons apply to the predictions in our own lives. Chapter 2 set up the travel journal for exactly this kind of writing. Each question takes a sentence or two, and the drive back to Athens is long enough for all of them.

1. **What did I ask a machine this week,** and did I treat its answer as a verdict or as the start of an inquiry?
2. **Where did I read an answer the way Croesus did,** hearing the reading I already wanted?
3. **Which prediction about me,** made without my asking, would I most like to see, and who could show it to me?
4. **When did I last act on foresight,** paying a small cost now against a larger loss later, and when did I fail to?
5. **What source do I trust most** for news about the future, and what is its track record of predictions written down beforehand?
6. **Know thyself:** what do I want my own learning, or my grandchildren's, to be for, before any model tells me what is likely?
7. **For Dan, the evangelist's question:** if AI can bring something like a personal tutor to every child, as Chapter 20 will discuss, what would it take for families to trust it, and which of tonight's tests, calibration, track record, consent, a human in the loop, would it have to pass first?

## Key Takeaways

- **Machine learning** finds patterns in examples instead of following written rules; a **predictive model** turns present facts into a probability about an unknown outcome, assuming the future resembles the past.
- A model is only as good as its **training data**. **Data bias**, from sampling, history, or measurement, makes predictions worse or unfair for the people the data left out. **Loan and hiring algorithms** can learn old discrimination through proxies even when protected traits are removed.
- **Weather forecasting** runs ensembles of physics-based models and states its **prediction uncertainty** as a probability; an honest source shows its range.
- A **large language model** writes by **next-word prediction**, choosing each word from probabilities shaped by temperature. Likely is not the same as true, and whether these models understand is an open debate.
- The **oracle as a data hub** heard from the whole Greek world, but mostly from those who could afford the trip. **Interpreting ambiguous answers**, as the Assembly did with the wooden wall, keeps a **human in the loop** who owns the decision. **Confirmation bias** made Croesus hear what he wanted.
- A **self-fulfilling prophecy** comes true because it was made, as Oedipus' did. **Student risk prediction** and **predictive policing** can feed their own predictions through feedback loops.
- Ask **who funds the model**, as Croesus' gold and the Alcmaeonids' bribe show. **Model calibration** measures whether a source's percentages come true, and the Brier score rewards calibrated forecasts. **Track record and trust** depend on predictions recorded before the outcome, and **testability of predictions** needs a clear, dated, recorded claim.
- Every forecaster has a **prediction horizon**, as Apollo had his winter. **AI capability forecasting**, such as METR's task horizon, and **AI doubling curves** are measured trends with wide uncertainty, not promises.
- Chaerephon's question shows the **answer as the start of an inquiry**, and **AI as a thinking partner** applies Socrates' habit to machines.
- "Know thyself" points to **values beyond prediction**. **Climate models** project long-run change under scenarios, and their early projections have held up. **Acting on foresight** means paying a known cost against an uncertain loss, as Themistocles did; **long-term consequences** fall beyond every horizon.
- **Consent in mass prediction** is the modern reversal of Delphi: we are predicted without asking. The **limits of the oracle parallel** are respect for a living faith, the new power to keep score, and the scale of prediction today. **Delphi reflection questions** carry the lessons into our own decisions.

!!! mascot-celebration "From the Tripod to the Algorithm"
    ![Glaux celebrating with wings spread](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now explain how a machine learns from examples and where its data can mislead it, set a language model's temperature and say what it changes, and score a forecaster, yourself included, for calibration. You can also trace a prediction that feeds itself, rewrite a hedge so that it can lose, and put the oracle's old questions to any AI you meet. Next stop: [Day 13: Athens, Museums, Tutors, and the City Today](../20-athens-museums-city-today/index.md), where an ancient bronze machine that predicted the sky waits in the National Archaeological Museum.
