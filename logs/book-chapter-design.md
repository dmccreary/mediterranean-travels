# Book Chapter Generator Session Log

- **Skill:** book-chapter-generator v1.1.2
- **Date:** 2026-11-24
- **Book:** Mediterranean Travels
- **Model:** Claude Opus 5.5 (Claude Code)
- **Result:** 21 chapters, 598 concepts, 0 dependency violations, approved by the author

## Summary

The skill read the trip description and the learning graph. It then designed
a chapter structure that follows the itinerary day by day and showed it to the
author. The author reviewed it three times. The first proposal had 19
chapters. The author asked for two oversized chapters to be split, and
approved the third version, which has 21 chapters. The skill then wrote the
chapter folders and outline pages and updated the `mkdocs.yml` nav.
`mkdocs build --strict` passes.

## Inputs Read

| Input | What it gave the design |
|---|---|
| `docs/course-description.md` (quality score 97) | A fixed chapter structure: an orientation chapter, one chapter per day for 13 days, two deep dives (Paul at Ephesus; The Oracle and the Algorithm), and a closing chapter. It also set reading times for the deep dives and assigned each Learning for All story to a stop. |
| `docs/learning-graph/learning-graph.json` | 598 concepts, 942 dependency edges, 15 taxonomy groups, and a pre-computed `cis` (Concept Impact Score) on every node |
| `docs/learning-graph/concept-taxonomy.md` | What each of the 15 categories means (FOUND, TRAV, BRONZ, CLASS, HELRO, PAUL, BYZ, MEDV, OTTO, MODRN, FOOD, DELPH, PRED, LEAD, LFA) |
| `mkdocs.yml` | An empty `Chapters:` section containing only `List of Chapters`. `navigation.tabs` is not present. |
| `CONTENT-GENERATION-GUIDE.md` | Markdown formatting rules (a blank line before every list) and the anti-padding style rules used for the chapter summaries |
| `book-installer/references/mkdocs-nav-editing.md` | The nav-editing rules: read before writing, touch only the Chapters section, number-only chapter labels |

The learning graph has 598 concepts rather than the 595 in the
learning-graph log. The extra three (Saffron, Eggplant, Graffiti) were added
in commit `4c38208`.

## Validation Before Design

- **Edge direction:** I built the prerequisite map as `prereqs[edge['from']].add(edge['to'])`.
  That gives 16 foundational concepts with no prerequisites. All 16 are simple
  root ideas: Eastern Mediterranean, Historical Timeline, Civilization,
  Archaeology, Ancient Greece, Roman Empire, Christianity, Judaism, Islam,
  Thoughtful Traveler, Ottoman Empire, Food as History, Human Need for
  Foresight, Artificial Intelligence, Change Leadership, and Literacy. The
  direction is therefore correct.
- **IDs:** 598 nodes and 598 unique IDs.
- **CIS:** present on every node. The maximum is 1771 (Ancient Greece), and
  191 terminal concepts have `cis = 1`. These are real values, not the
  all-ones default that would mean the graph predates `learning-graph-generator` v1.06.

## The Central Design Problem

The skill's guidelines call for 6–20 chapters of 8–25 concepts each, ideally
12–18. The trip description fixes the chapter structure at 17 (orientation,
13 days, 2 deep dives, closing). Spreading 598 concepts over 17 chapters
averages 35 each.

Every chapter had to stay inside the trip's order, because the guide is read
one day at a time. A concept could only move to the day where it is seen, or
to an earlier chapter that the day depends on. The route's order does not
match the order of history:

- Istanbul (Byzantine, Ottoman, modern Turkey) comes first.
- The Bronze Age (Troy, Crete) comes in the middle.
- Classical Athens comes near the end.

So many dependencies crossed backward in time. Every one had to be resolved
by moving a concept earlier or moving its dependent concept later.

## Design Iterations and Author Feedback

### Version 1 — 19 chapters (proposed)

The skill's first proposal had 19 chapters, not 17. Each deep dive was split
into two parts, because a single chapter would have held about 87 concepts:

- Paul: 56 PAUL plus 33 LEAD concepts.
- Delphi: 46 DELPH plus 36 PRED concepts.

The first assignment draft had 11 dependency violations and 3 bookkeeping
errors (duplicate and missing concepts). All were fixed before the author saw
the design (see "First-Draft Violations" below). Version 1 ranged from 12 to
48 concepts per chapter:

- Crete (Day 9): 48
- Orientation: 47
- Paul Part 1: 44

The proposal itself suggested one trim: move the Linear B decipherment story
from Crete to Day 13.

> **Author feedback 1:** "Day 9 has too many concepts (48) for a single
> chapter. Make it two separate chapters. It is OK to have more chapters."

### Version 2 — 20 chapters (proposed)

Crete was split by time of day:

- **Day 9, Part 1: Knossos, the Minoans, and Linear B** (24) covers the
  morning at Knossos and the Heraklion Archaeological Museum.
- **Day 9, Part 2: Venetian Heraklion and Crete Today** (24) covers the
  afternoon in the Venetian harbor town.

Neither part depends on the other, so they can be read in either order. The
cut made two equal halves, so the suggested Linear B move was no longer
needed and was dropped.

> **Author feedback 2:** "I also think that the first chapter with 47
> concepts is too large. Make that one two chapters also."

### Version 3 — 21 chapters (approved)

The orientation chapter was split by theme:

- **Before We Go, Part 1: The Long Timeline of the Eastern Mediterranean**
  (27) covers geography, eras, early civilizations, the Roman Empire and the
  Pax Romana, and the three faiths.
- **Before We Go, Part 2: Traveling Well and the Learning for All Thread**
  (20) covers the cruise and itinerary, off-season travel, the reading
  routine and journal, writing systems, the alphabet and the Greek language,
  literacy, and AI in education.

Part 1 must come first. Part 2 depends on it: the Viking Star cruise needs
"Eastern Mediterranean", and "Greek Language" needs "Ancient Greece."

This version has 21 chapters, one over the skill's maximum of 20. That was
accepted on the basis of the author's statement that more chapters are fine.

> **Author feedback 3:** "Approve"

## Final Chapter Structure

| # | Chapter | Concepts | When to read |
|---|---|---|---|
| 1 | Before We Go, Part 1: The Long Timeline of the Eastern Mediterranean | 27 | Before departure |
| 2 | Before We Go, Part 2: Traveling Well and the Learning for All Thread | 20 | Before departure |
| 3 | Day 1: Istanbul, a City on Two Continents | 28 | Wed Nov 11 |
| 4 | Day 2: Byzantine Constantinople and Hagia Sophia | 29 | Thu Nov 12 |
| 5 | Day 3: Ottoman Istanbul, Topkapı, and Friday Prayer | 30 | Fri Nov 13 |
| 6 | Day 4: Bazaars, Scripts, and Presses | 25 | Sat Nov 14 |
| 7 | Day 5: The End of Empire and the Birth of Modern Turkey | 22 | Sun Nov 15 |
| 8 | Day 6: Troy and Gallipoli | 37 | Mon Nov 16 |
| 9 | Paul at Ephesus, Part 1: The Apostle's Life, Letters, and Ephesian Years | 44 | Evening of Day 6 |
| 10 | Day 7: Ephesus, a Greco-Roman City | 36 | Tue Nov 17 |
| 11 | Paul at Ephesus, Part 2: Ideas, Legacy, and Lessons in Leading Change | 43 | Evening of Day 7 |
| 12 | Day 8: Rhodes, From the Colossus to the Knights | 31 | Wed Nov 18 |
| 13 | Day 9, Part 1: Knossos, the Minoans, and Linear B | 24 | Thu Nov 19, morning |
| 14 | Day 9, Part 2: Venetian Heraklion and Crete Today | 24 | Thu Nov 19, afternoon |
| 15 | Day 10: Athens, the Acropolis, and the Persian Wars | 27 | Fri Nov 20 |
| 16 | Day 11: Athens, the Agora, Democracy, and Paul on the Areopagus | 26 | Sat Nov 21 |
| 17 | The Oracle and the Algorithm, Part 1: The Oracle | 33 | Night of Day 11 |
| 18 | Day 12: Delphi | 22 | Sun Nov 22 |
| 19 | The Oracle and the Algorithm, Part 2: The Algorithm | 32 | Drive back from Delphi |
| 20 | Day 13: Athens, Museums, Tutors, and the City Today | 26 | Mon Nov 23 |
| 21 | Going Home: Learning With Communities, Not To Them | 12 | Trip home |

**Statistics:** 21 chapters, 598 concepts each assigned exactly once, average
28.5 per chapter, range 12–44, 0 dependency violations.

## Tradeoffs and Design Decisions

### 1. More chapters than the trip description specified

- **Trip description:** 17 chapters.
- **Final:** 21. The two deep dives are each split in two, and both Day 9
  (Crete) and the orientation chapter are split.
- **Why:** to keep chapters readable at one sitting. The split chapters follow
  the description's own reading plan:
  - The description already says the Oracle chapter is read in two halves,
    before and after Delphi.
  - Crete splits naturally into morning (Knossos) and afternoon (Venetian
    Heraklion).
- **Cost:** 21 chapters is one more than the skill's maximum of 20. The
  author explicitly accepted more chapters.

### 2. Paul Part 2 is read after Ephesus, not before

- **Trip description:** the Paul deep dive is read the evening of Day 6.
- **Final:** Part 1 (life, letters, Paul in Ephesus) is still read the evening
  of Day 6. Part 2 (ideas, legacy, and the leadership lessons) is read the
  evening of Day 7.
- **Why:** this is required by dependencies, not just a preference. "Economics
  of Resistance" depends on "Riot of the Silversmiths." The riot belongs on
  Day 7, where we stand in the Great Theater, because it depends on "Artemis
  of Ephesus" and "Great Theater of Ephesus." Reading Part 2 on Day 6 would
  break that dependency.
- **Benefit:** the Paul chapters now mirror the Oracle chapters — story
  before the site, lessons after it.
- **Cost:** Paul's ideas (grace, "neither Jew nor Greek", one body, love)
  moved into Part 2. The trip description lists them as part of the single
  Paul chapter to read before Ephesus.

### 3. The Greek philosophers come before Athens

- **Problem:** "Pauline Letters" depends on "Koine Greek." Koine Greek
  depends on Hellenistic Kingdoms, which depend on Alexander, then Aristotle,
  Plato's Academy, Plato, Socrates, Greek Philosophy, and finally Athens. All
  of that is needed by Chapter 9, but the Athens days are Chapters 15, 16
  and 20.
- **Options considered:**
  - Put the chain in the orientation chapter. Rejected: it pushed
    orientation past 60 concepts.
  - Put it in the Troy chapter (Alexander did visit Troy). Rejected: pulling
    Socrates into Troy felt forced.
  - Put it in Paul Part 1.
- **Chosen:** Paul Part 1 opens with "the Greek and Roman world Paul
  inherited." That chapter covers Athens, Greek Philosophy, Socrates, the
  Socratic Method, Plato, Plato's Academy, Aristotle, Alexander, Hellenistic
  Kingdoms and Koine Greek.
- **Cost:** the Athens chapters cannot introduce Socrates and Plato from
  scratch. They go deeper instead: the Agora, the Sophists, the trial of
  Socrates, the Lyceum, and the *Phaedrus*.
- **Why the Socratic Method is in Chapter 9:** the leadership lesson "Lecture
  to Dialogue" (Chapter 11) depends on it.

### 4. "Euangelion" and "Evangelist" moved out of orientation

- **Trip description:** the orientation chapter opens the Learning for All
  thread "starting with the word *evangelist* itself."
- **Final:** both concepts are in Paul Part 1 (Chapter 9).
- **Why:** "Euangelion" depends on "Pauline Letters." Keeping it in
  orientation would have pulled Paul's whole life into the first chapter.
- **Effect:** orientation opens the thread with literacy, democratizing
  education, and AI in education instead. The content generator can still
  mention the word in passing in Chapter 2 without teaching it.

### 5. Gallipoli comes on Day 5 as well as Day 6

- **Problem:** the 1928 alphabet reform at Gülhane Park is an Istanbul story
  in the trip description. It depends on Atatürk's reforms, then the Republic
  of Turkey, the Turkish War of Independence, Atatürk, and the Gallipoli
  Campaign. But Gallipoli is Day 6.
- **Alternative considered:** move the alphabet reform to Day 6. Rejected,
  because it would take the Learning for All story away from the park where
  it happened.
- **Chosen:**
  - Day 5 (Chapter 7), "The End of Empire and the Birth of Modern Turkey",
    covers the chain from Ottoman decline through WWI, the Gallipoli
    Campaign, Atatürk, the Republic, and the reforms, plus the alphabet
    reform and the Nation's Schools.
  - Day 6 covers the battlefield itself: the Anzac forces, Anzac Cove, the
    Martyrs' Memorial, "Johnnies and Mehmets", and Çanakkale today.
- **Side effect:** "Daily Life in Istanbul" and "Faith in Modern Turkey" also
  landed on Day 5. They depend on "Turkish Economy Today", which depends on
  "Republic of Turkey."

### 6. The Greek and Turkish independence chain sits in Istanbul

The Greco-Turkish War is needed on Day 5, and it depends on the Greek War of
Independence and the Modern Greek State. Those therefore sit on Day 5 too,
before we reach Greece.

### 7. The 1923 population exchange is set at Ephesus

- **Placement:** Treaty of Lausanne, Population Exchange of 1923, Burning of
  Smyrna, and Asia Minor Refugees are all in Day 7 (Kuşadası and Ephesus).
- **Why:** this coast was home to Greek communities until 1922–23, and
  Smyrna (İzmir) is nearby. Putting the cluster here also relieved the
  overloaded Day 5 and Day 6 chapters.
- **Related placements:** Rebetiko is on Day 13 in Athens. "Shared
  Greek-Turkish Dishes" is on Day 10.

### 8. The Serpent Column moved from Istanbul to Delphi

- **Problem:** the Serpent Column stands in Istanbul's Hippodrome. Its
  prerequisites include the Persian Wars and the Sanctuary of Apollo.
  Pulling the Delphi sanctuary into Day 1 or Day 2 would have put the whole
  Delphi foundation into Istanbul.
- **Chosen:** the Serpent Column is on Day 12 (Chapter 18), where it was
  originally set up. The Delphi chapter summary says "the Serpent Column we
  saw in Istanbul."
- **Cost:** the Istanbul chapter can only mention the column in passing.

### 9. Paul in Athens moved to the Athens days

- **Problem:** "Areopagus Speech" depends on the Areopagus and "Paul and the
  Stoics." Those depend on Stoicism, the Stoa, the Ancient Agora, and
  Athenian Democracy — all Athens concepts.
- **Chosen:** Paul in Athens, Paul and the Stoics, the Areopagus Speech, the
  Altar to an Unknown God, and the Areopagus Bronze Plaque are all on Day 11
  (Chapter 16). This matches item 7 of the trip description ("something to
  look for on our Athens days").
- **Lessons that moved with it:** the leadership lessons "Meeting People
  Where They Are" and "Stages of Concern" depend on the Altar story, so they
  are on Day 11 too, not in Paul Part 2.

### 10. The Antikythera mechanism and tutoring stories moved to Day 13

- **The mechanism:** "Ancient Prediction Machines" (a PRED concept) depends
  on the Antikythera Mechanism. Rather than put the National Archaeological
  Museum before the Oracle chapters, the museum, the mechanism, and Ancient
  Prediction Machines all went to Day 13, after both Oracle chapters. That
  fits the trip description's framing of the mechanism as a bridge between
  Delphi and modern AI.
- **Tutoring and writing:** Aristotle tutoring Alexander, Bloom's 2 Sigma,
  Mastery Learning, AI Tutoring, the Lyceum, and the *Phaedrus* warning
  about writing are all on Day 13. "AI Guardrails" depends on "Answer as
  Start of Inquiry", a concept in the Algorithm chapter, so it had to follow
  that chapter anyway.
- **Benefit:** Day 13 grew from 12 concepts to 26, which balanced it against
  the other Athens days.

### 11. Reading-a-ruin skills are spread across the sites

- **Problem:** the FOUND category's ruin-reading concepts would have
  overloaded orientation.
- **Chosen:** each concept goes to the site that demonstrates it best:
  - Hagia Sophia (Day 2): Layers of a City, Reading a Ruin, Mosaic, Spolia,
    Restoration, UNESCO World Heritage Site, Primary Source, Myth Versus
    History, and Contested History.
  - Troy (Day 6): Stratigraphy and Site Museum. Cultural Memory goes with
    Gallipoli on the same day.
  - Ephesus (Day 7): the classical orders (Doric, Ionic, Corinthian), Fresco,
    and Inscription.
- **Tradeoff:** orientation lost its general "how to read a ruin" section.
  In return, each skill is taught where we will use it.

### 12. Minoans and Mycenaeans are in the first chapter

The Bronze Age Collapse (Troy, Day 6) depends on both "Minoan Civilization"
and "Mycenaean Greeks." Crete is Day 9, three days later. Both concepts went
into Chapter 1's timeline, which fits the trip description's "from the
Minoans to modern Turkey and Greece." The Crete chapters then cover Knossos
in depth.

### 13. Other single-concept moves

Most of these were made to fix dependency violations in the first draft or to
balance chapter sizes:

| Concept | Moved to | Reason |
|---|---|---|
| Pax Romana | Ch 1 | Roman Bath Culture (Day 4, Turkish bath) depends on it |
| Seven Wonders of the World | Ch 10 (Ephesus) | Temple of Artemis depends on it |
| Greek Theater | Ch 10 (Ephesus) | Great Theater of Ephesus depends on it |
| Hadrian | Ch 10 (Ephesus) | Temple of Hadrian at Ephesus depends on it |
| Athena | Ch 12 (Rhodes) | Lindos Acropolis depends on it |
| Olive Oil, Mediterranean Diet | Ch 12 (Rhodes) | Greek Salad depends on them; also the first Greek food day |
| Areopagus | Ch 16 (Day 11) | Depends on Athenian Democracy |
| Olympian Gods, Greek Mythology | Ch 8 (Troy) | Introduced alongside the Iliad, which kept orientation small |
| Bosphorus, Empire, Turkish Language, Food as History | Ch 3 (Day 1) | Slimmed orientation; first used in Istanbul |
| Dardanelles Strait | Ch 7 (Day 5) | Needed by the Gallipoli Campaign |
| Port Times | Ch 6 (Day 4) | Embarkation day |
| World War II | Ch 12 (Rhodes) | Was missing from the first draft; first needed for the 1944 deportation |
| Republic of Venice | Ch 4 (Day 2) | Follows from the Fourth Crusade |
| Greek food (feta, salad, souvlaki, eggplant, shared dishes) | Ch 15 (Day 10) | Took load off Rhodes |
| Tentmaking | Ch 11 (Paul 2) | Goes with the Sustainable Funding lesson |
| Mother-Tongue Learning, AI Translation, Education Evangelism, AI-Native Schools Companion, Cost of Delaying Technology, Scribal Resistance | Ch 21 (Going Home) | Fit the closing theme of "with communities, in their languages"; also took load off Paul Part 2 |

### 14. Chapter sizes above the skill's guideline

Fourteen of the 21 chapters have more than 25 concepts. The largest are Paul Part 1 (44),
Paul Part 2 (43), Day 6 Troy and Gallipoli (37), and Day 7 Ephesus (36).
These are the content-heaviest days or the deep dives, which the trip
description says are "longer than a daily chapter." The author asked to split
only Day 9 and Chapter 1, so these were left as they are.

The closing chapter has 12 concepts, which is within the acceptable range and
fits a chapter the trip description calls "short."

### 15. Navigation labels

- Chapter titles contain colons, so every nav label is quoted. Unquoted, YAML
  would read `1. Before We Go, Part 1: The Long Timeline...` as a nested
  key/value pair.
- Labels use the full chapter titles. They are long for the narrow side nav,
  and I offered to shorten them.

## First-Draft Violations (fixed before review)

None of these reached the author. They were fixed by the moves listed above.

| Dependent concept | Needed | Fix |
|---|---|---|
| Roman Bath Culture (Day 4) | Pax Romana (Paul 1) | Pax Romana moved to Ch 1 |
| Bronze Age Collapse (Day 6) | Minoan Civilization, Mycenaean Greeks (Crete) | Both moved to Ch 1 |
| Trojan War (Day 6) | Mycenaean Greeks (Crete) | Same |
| Temple of Artemis (Day 7) | Seven Wonders (Rhodes) | Seven Wonders moved to Day 7 |
| Great Theater of Ephesus (Day 7) | Greek Theater (Athens) | Greek Theater moved to Day 7 |
| Temple of Hadrian at Ephesus (Day 7) | Hadrian (Athens) | Hadrian moved to Day 7 |
| Lindos Acropolis (Rhodes) | Athena (Athens) | Athena moved to Rhodes |
| Greek Salad (Rhodes) | Olive Oil (Crete) | Olive Oil moved to Rhodes |
| Areopagus (Day 10) | Athenian Democracy (Day 11) | Areopagus moved to Day 11 |
| AI Guardrails (Day 11) | Answer as Start of Inquiry (Algorithm) | AI Guardrails moved to Day 13 |
| Duplicates: Hittite Empire, Wilusa, Seeing Past the Tourist Script | — | Removed the duplicate entries |
| Missing: Turkish Language, World War II | — | Assigned to Day 1 and Rhodes |

## Files Created and Changed

- `docs/chapters/index.md` — rewritten. It has the 21-chapter overview with
  one-line summaries, when to read each deep dive, and how to use the guide.
- 21 directories, from `docs/chapters/01-long-timeline/` to
  `docs/chapters/21-going-home/`. Each has an `index.md` containing:
  - a 3–5 sentence summary with the date or reading time;
  - a "Concepts Covered" table (`Concept` and `Concept Impact Score`) in
    dependency order. Within a chapter, every concept comes after its
    prerequisites; ties are broken by concept ID;
  - a "Prerequisites" section linking each earlier chapter that holds a
    prerequisite;
  - the `TODO: Generate Chapter Content` placeholder.
- `mkdocs.yml` — 21 entries added under `Chapters:` after `List of Chapters`.
  Nothing else in the nav was changed.

The URL slugs use only lowercase letters and dashes after the two-digit
prefix; this was checked by an assertion in the generator script.

## Verification

- An assignment check confirmed every concept appears exactly once (598 of
  598) and that no prerequisite falls in a later chapter. This was rerun after
  each of the three versions, and each pass reported 0 violations.
- `mkdocs build --strict` passes. Its only notice is a pre-existing INFO
  message: `img/mascot/character-sheet.md` is not in the nav.
- `navigation.tabs` is not in `mkdocs.yml`.
- Nothing has been committed yet.

## Open Items for the Author

- **Mascot:** the skill strongly recommends creating a learning mascot before
  generating chapter content. This book already has Glaux the Little Owl, set
  up in `CONTENT-GENERATION-GUIDE.md` and `docs/css/mascot.css`. Before
  running `chapter-content-generator`, check that Glaux's poses are complete.
- **Nav label length:** the full titles may wrap in the side nav. Short nav
  labels can be used without changing the page titles.
- **Changes from the trip description to keep in mind when writing content:**
  Paul Part 2 is read after Ephesus; *euangelion* and *evangelist* are in Paul
  Part 1; the Serpent Column is at Delphi; the Antikythera mechanism is on
  Day 13. Each is explained in the tradeoffs above.
- **Design scripts:** the assignment, validation and generator scripts were
  kept in the session scratchpad, not the repo. Each chapter's "Concepts
  Covered" table is the lasting record of its assignment.
