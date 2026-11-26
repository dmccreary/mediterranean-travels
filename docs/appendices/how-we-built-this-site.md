---
title: How We Built This Site
description: A step-by-step account of how this travel book was built with Claude Code and the intelligent-textbook skills, with the prompts, skill versions, and rough time for each step.
---
# How We Built This Site

This book was built with [Claude Code](https://claude.com/claude-code) and
a set of open-source
[intelligent-textbook skills](https://github.com/dmccreary/claude-skills).
This page lists the steps in the order we did them. For each step it gives
the prompt we used, the skill and the skill version, and a rough estimate of
how long the step took.

The estimates come from three sources:

- The [commit history](https://github.com/dmccreary/mediterranean-travels/commits/main)
  of this site's GitHub repository (115 commits).
- The session logs in the repository's `logs/` folder, which record the skill
  version, start and end times, and results of the larger steps.
- The time stamps on the prompts in 39 Claude Code sessions.

All times are US Central time. Several sessions often ran at the same time,
so the step times overlap and do not add up to the total elapsed time.

## Before and After the Trip

Only the first step was done before we left. Before the trip, the site held
an empty book frame, a course description, and an interactive map of the
cruise route. That was 3 of the 115 commits.

Everything else, over 95 percent of the work, was done **after** we came
home. This was on purpose. Our shared Google Photos album holds 1,465 photos
and videos, and each one records the date, time, and GPS position where it
was taken. That photo stream is a record of what we actually did. It shows
which day we were at Delphi, that we went to Cape Sounion, and which sites
on the plan we skipped. So the book describes the trip we took, not only the
trip we planned.

## Our Photos Never Went to GitHub

The book is public, but our photo album is not. The original photos and
videos were **never** checked into GitHub. They stayed on the author's
MacBook the whole time.

| | Where it lives | In GitHub? |
|---|---|---|
| Google Takeout export: 1,453 original photos (mostly HEIC) and 15 videos, 4.4 GB | `data/takeout/` on the MacBook | Never |
| Takeout zip file | Downloads folder, deleted after unzipping | Never |
| Contact sheets (thumbnails Claude used to choose photos) | `data/contact-sheets/` on the MacBook | Never |
| 121 small web copies of the chosen photos, with GPS data removed | `docs/chapters/*/img/` | Yes |
| Text files of file names, dates, places, labels, and scores | `data/*.csv`, `data/*.jsonl` | Yes |

Three things kept the originals out:

1. **A `.gitignore` file came first.** When we asked Claude to unzip the
   export, we also asked for a `.gitignore` so it could not be added to the
   repository. The file `data/.gitignore` lists `takeout/`, `*.zip`, and
   `contact-sheets/`, so git does not see those folders at all.
2. **We asked Claude to confirm it.** Before any photo work started, the
   prompt was:

    ```text
    Please confirm that the photos and videos will NOT be added to GitHub.
    ```

3. **Only small copies are published.** `scripts/export_web_photos.py` makes
   a small JPEG of each chosen photo and drops its metadata, including the
   GPS position, before it goes into the book.

Anyone can check this. This command lists every photo or video file, or
Takeout file, that was ever committed to any branch of the repository. It
prints nothing:

```bash
git log --all --name-only --format= | grep -iE '\.(heic|mov|mp4)$|takeout/'
```

Claude worked with the originals without sending them anywhere. The labels
came from Apple's Vision framework running on the laptop, the places came
from the GPS data in Takeout's JSON files, and Claude only looked at one
contact sheet per chapter (see Step 9).

## Models Used

- **Claude Sonnet 5.5** was the default model for most of the work.
- **Claude Opus 5.5** was used to generate the MicroSims and the posters,
  which need more careful code and layout.
- The session logs for the learning graph, the chapter design, and the color
  themes (all on November 24) record that Opus 5.5 was used for those steps.
- **OpenAI** image models made every AI-generated image, including the
  graphic-novel story panels and the poster illustrations. Claude wrote a
  description of each image into the book's files, both on the laptop and on
  GitHub. The author then used the ChatGPT desktop app and simply told it to
  render the images from those descriptions. No prompts were copied and
  pasted by hand. The
  high-quality poster images were critical to the posters: the interactive
  labels only work if the picture underneath is accurate and clear.

!!! note "Which OpenAI image model?"
    We believe the images were made with **OpenAI Images 2.6**, which OpenAI
    released for Codex and ChatGPT on November 4, 2026. Its API versions are
    GPT‑Image‑2.6 Flare (`gpt-image-2.6-flare`) and GPT‑Image‑2.6 Sunburst
    (`gpt-image-2.6-sunburst`). We could not find any metadata in the image
    files that proves this. It is what OpenAI said were its current versions
    when the images were made.

## The Steps at a Glance

| Step | What | When | Rough time |
|---|---|---|---|
| 1 | Book frame, course description, cruise map | Nov 10–11 (before the trip) | 1 hour |
| 2 | Google Photos connector | Nov 24 morning | 30 minutes |
| 3 | Map and itinerary checked against the photos | Nov 24 morning | 25 minutes |
| 4 | Two deep-dive topics added to the course description | Nov 24 morning | 25 minutes |
| 5 | Learning graph | Nov 24 morning | 40 minutes |
| 6 | Chapter design | Nov 24 morning | 30 minutes |
| 7 | Mascot, logo, favicon, colors, pronunciations | Nov 24 | 1 hour |
| 8 | Chapters 1–3 | Nov 24 midday | 1.25 hours |
| 9 | Trip photos picked and added to chapters | Nov 24 afternoon | 2 hours |
| 10 | Fixes to chapters 1–3 and the content guide | Nov 24 afternoon | 1 hour |
| 11 | Appendices | Nov 24 | 1 hour |
| 12 | Chapters 4–21 | Nov 24, 4 PM to 10 PM | 6.5 hours |
| 13 | Glossary | Nov 24 evening | 20 minutes |
| 14 | FAQ | Nov 24 evening | 15 minutes |
| 15 | All the chapter MicroSims | Nov 24 night to Nov 25 morning | 7 hours (unattended) |
| 16 | Graphic-novel stories | Nov 25 | 4 hours |
| 17 | Cover, landing page, About page, galleries | Nov 25 | 1.5 hours |
| 18 | Interactive posters | Nov 24 and Nov 25 | 2.5 hours |
| 19 | LinkedIn announcement and README | Nov 25 afternoon | 30 minutes |
| 20 | Custom 404 page | Nov 26 morning | 10 minutes |
| 21 | Cape Sounion found in the GPS data | Nov 26 morning | 30 minutes |
| 22 | This page | Nov 26 morning | 15 minutes |
| 23 | Chapter quizzes | Nov 26 morning | 25 minutes |

Most of the book was built in about 46 hours of elapsed time, from the
morning of November 24 to the morning of November 26. Much of that time the
agents were working on their own, for example overnight while the MicroSims
were built. The author's own time was closer to 15 hours: writing prompts,
reviewing drafts, and generating images.

## Skill Versions

These are the skill versions in the
[ibook-skills](https://github.com/dmccreary/claude-skills) repository on the
days this book was built. None of them changed between November 11 and
November 26, except `book-installer`, which went from v1.0.4 to v1.0.5 between
the first step and the rest of the work.

| Skill | Version | Used for |
|---|---|---|
| `book-installer` | 1.0.4, then 1.0.5 | Book frame, mascot, favicon, KaTeX, cover, About page, landing page, 404 page, feature checklist |
| `course-description-analyzer` | 0.05 | Scoring the course description (run inside the learning-graph step) |
| `learning-graph-generator` | 1.07 | 598 concepts and their dependencies |
| `book-chapter-generator` | 1.1.2 | The 21-chapter structure |
| `chapter-content-generator` | 1.11 | All 21 chapters |
| `glossary-generator` | 1.0 | 666 glossary terms |
| `faq-generator` | 1.0 | 94 FAQ questions |
| `quiz-generator` | 0.5 | 210 quiz questions, 10 per chapter |
| `microsim-generator` | 1.0.5 | MicroSims and posters |
| `microsim-utils` | 1.0 | Standardizing the map, MicroSim to-do list, iframe heights, gallery page |
| `book-media-generator` | 1.0 | Graphic-novel story scripts, pronunciation audio |
| `book-publisher` | 1.0 | LinkedIn announcement, README metrics |

## Step 1: Build the Frame and the Cruise Map (Before the Trip)

**When:** the evening of November 10 and the morning of November 11.
**Time:** about 1 hour.
**Skills:** `book-installer` v1.0.4, `microsim-utils` v1.0.

We created the GitHub repository and set up an empty MkDocs Material book.
Then we turned an existing HTML map of the cruise into a standard MicroSim,
and wrote a course description from the cruise itinerary.

```text
/book-installer init
```

```text
Refactor the HTML program in docs/sims/viking-cruise-map.html into a standard
MicroSim format using the /microsim-utils standardization guide, and add it to
the MicroSims section of the mkdocs.yml nav.
```

```text
This is not actually a textbook, but a travel guide of things to notice on our
trip. I am a big fan of the history of civilization, culture, cuisine, and
trying to have deep empathy for the people in the places on our trip. Please
update the course description to reflect this. Here are the details of our
travel plans: [the cruise itinerary pasted from the cruise-agency site]
```

The result was the [Viking Cruise Map](../sims/viking-cruise-map/index.md)
and the first version of the [course description](../course-description.md).
Then we packed.

## Step 2: Connect the Google Photos Album

**When:** November 24, 8:27 AM, then 12:56 to 1:35 PM.
**Time:** about 30 minutes of work, plus about 30 minutes waiting for Google.
**Skill:** none (a custom Python script).

Google Photos does not have an open API for reading a shared album, so we
used Google Takeout. Takeout exports the original photos plus a JSON file for
each one with its date, time, and GPS position. Claude wrote
`scripts/google_photos_takeout.py` to read the export, and a profiling script
to summarize it.

!!! warning "Google really let us down here"
    The author was **very** unhappy to learn that there is no simple API for
    reading the photo metadata from a shared album. All we needed was the
    date, time, and GPS position of each photo. That is a few megabytes of
    data.

    Google's Photos API has never returned GPS positions. Google strips the
    location from the photos it hands to apps, and says it does this on
    purpose. Since March 31, 2025, the API cannot even read an album unless
    the same app uploaded its photos. So the only way to get the metadata
    was to download the full 4.4 GB Takeout export of every original photo
    and video. This was slow, and it wasted time, bandwidth, and disk space.
    Google really has let us down. See Google's own notice:
    [Updates to the Google Photos APIs](https://developers.google.com/photos/support/updates).

```text
Add a Google Photos connector to this project.
```

```text
The download is in the Downloads folder as a zip file. Uncompress it and do
basic data profiling of this data. Put the results in the book's data
directory, but do not check the photo files into GitHub. Add a .gitignore so
they are not added to the repository.
```

```text
Please confirm that the photos and videos will NOT be added to GitHub.
```

```text
Delete the zip in Downloads.
```

The export held 1,465 photos and videos (4.4 GB). They stay in `data/takeout/`
on the MacBook, which `data/.gitignore` keeps out of the repository. See
[Our Photos Never Went to GitHub](#our-photos-never-went-to-github).

## Step 3: Check the Plan Against the Photos

**When:** November 24, 8:31 to 8:55 AM.
**Time:** about 25 minutes.

The photo dates showed where the trip differed from the plan. We added
Delphi to the map and fixed the places where the text and the photos
disagreed.

```text
Add another stop to the travel map for our trip to Delphi at the end of the
tour. You can see the dates in the photo metadata. We went there on
November 22.
```

```text
Check that the photo metadata is consistent with course-description.md and
the about.md page.
```

## Step 4: Add the Deep-Dive Topics

**When:** November 24, 8:59 to 9:24 AM.
**Time:** about 25 minutes.

Before generating any concepts, we added the two "deep dive" topics that
make this more than a travel guide: Paul at Ephesus, and the Oracle of Delphi
compared with modern AI prediction. We also asked Claude to look for
parallels with the author's work on AI in education.

```text
Update the course description to add an entire chapter on Paul at Ephesus.
Put his time in Ephesus in the context of the rest of Paul's teaching and his
leadership. The key here is lessons in leadership and change.
```

```text
Now add one more deep-dive chapter about our trip to Delphi to see the ruins
of the Oracle of Delphi. Look for parallels between predicting the future in
ancient times and the new role of machine learning and AI in making
predictions.
```

```text
My role is an evangelist of AI in the democratization of education for all
children on Earth. What other parallels do you see from this trip?
```

```text
Wonderful! Please weave these parallels into the course description.
```

## Step 5: Generate the Learning Graph

**When:** November 24, 9:32 to 10:12 AM.
**Time:** about 40 minutes.
**Skill:** `learning-graph-generator` v1.07.

The learning graph lists every concept the book teaches and which concepts
each one depends on. The skill first scored the course description at 97 out
of 100. Then it built 595 concepts in 15 categories, checked that the graph
had no loops, and created the graph viewer.

```text
Now run the /learning-graph-generator on the updated course description.
```

Then we added a few concepts from the trip itself:

```text
Add "Turkish delight" and "saffron" as foods that we bought in the Spice Market.
```

```text
Please add eggplant as a favorite dish.
```

```text
Add "Graffiti" as a concept from when we drove around Athens.
```

The final graph has 598 concepts and 942 dependencies. See the
[Learning Graph](../learning-graph/index.md) section.

## Step 6: Design the Chapters

**When:** November 24, 10:12 to 10:30 AM, with the log written at 12:15 PM.
**Time:** about 30 minutes.
**Skill:** `book-chapter-generator` v1.1.2.

The skill grouped the 598 concepts into chapters that follow the trip day by
day. Its first plan had 19 chapters. Two of them were too large, so we asked
for them to be split.

```text
Run the /book-chapter-generator skill.
```

```text
Day 9 has too many concepts (48) for a single chapter. Make it two separate
chapters. It is OK to have more chapters.
```

```text
I also think that the first chapter, with 47 concepts, is too large. Make that
one two chapters also.
```

```text
Approve.
```

```text
Create a detailed log of this session in logs/book-chapter-design.md, and
include all the tradeoffs you made in designing the book structure and my
feedback.
```

The approved design has 21 chapters and no chapter that teaches a concept
before the concepts it depends on.

## Step 7: Mascot, Logo, Colors, and Pronunciations

**When:** November 24, at several times during the day.
**Time:** about 1 hour in all.
**Skills:** `book-installer` v1.0.5, `book-media-generator` v1.0.

We asked Claude to suggest a mascot, and chose Glaux, the little owl of
Athena. Then we made Glaux the site logo and favicon, picked a color theme,
and added recorded pronunciations for hard names.

```text
Suggest a mascot for the travel notebook.
```

```text
Make it the owl! I love Athena's little owl!
```

```text
Create a mascot test page in the learning graph directory using the
/book-installer guide.
```

```text
Use docs/img/mascot/welcome.png as the book logo in the upper left corner.
Also generate a favicon using the /book-installer favicon guide.
```

```text
Please suggest some alternative color themes for the book.
```

```text
Apply theme 3, Terracotta and olive, to the book.
```

```text
Use the pronunciation guide to add a pronounce button for "Glaux" in the
first introduction admonition.
```

The pronunciation audio is made with ElevenLabs text-to-speech. The five
color themes we considered are described in `logs/color-themes.md`. The
results are the [Pronunciation Guide](pronunciation-guide.md) and the
terracotta-and-olive colors you see on every page.

## Step 8: Write Chapters 1 to 3

**When:** November 24, 12:17 to 1:33 PM.
**Time:** about 15 minutes per chapter, 1.25 hours in all.
**Skill:** `chapter-content-generator` v1.11.

We wrote the first three chapters one at a time, so we could read each one
and fix problems before writing the rest.

```text
Run the /chapter-content-generator for chapter 1 using the stub at
docs/chapters/01-long-timeline/index.md
```

The same prompt was used for chapters 2 and 3. Each chapter came with written
specifications for its MicroSims. We built a few of them right away to test
the specifications:

```text
Generate the timeline described in the Diagram section of chapter 1 using the
/microsim-generator timeline guide and the vis-timeline JavaScript library.
```

## Step 9: Pick the Trip Photos

**When:** November 24, 1:36 to 3:25 PM.
**Time:** about 2 hours, most of it the computer labeling photos.
**Skill:** none (custom scripts).

We wanted our own photos in the chapters. But sending 1,465 photos to an AI
model to look at would use a very large number of tokens. So we asked for a
cheaper way:

```text
I would like to enhance the chapter content with a small selection of sample
photos. But to do this you would have to analyze the photos for their content,
and that would take a LOT of tokens. Is there a low-token way to select the
photos that should be included?
```

Claude built a pipeline that runs mostly on the laptop and uses no AI tokens
until the last step:

1. `scripts/photo_labels.swift` uses Apple's on-device Vision framework to
   label each photo (for example "ruins," "mosque," or "harbor") and give it a
   quality score.
2. `scripts/select_chapter_photos.py` uses each photo's GPS position to find
   the nearest landmark, and so the chapter it belongs to. It drops
   screenshots, signs, and photos where a face fills the frame, and keeps the
   best photo from each burst.
3. The top photos for each chapter are tiled into one numbered "contact
   sheet" image. Claude reviews a whole chapter's choices by looking at one
   image instead of dozens.
4. `scripts/export_web_photos.py` makes small web copies of the chosen photos
   and removes their GPS data.

```text
Longer chapters can have up to 10 photos that are unique.
```

```text
For each of the photos, add a credit to the photo caption.
```

```text
Add the photo rules to CONTENT-GENERATION-GUIDE.md, including the photo
caption rules.
```

The book now uses 121 of our photos. The counts by place are on the
[Trip Photo Metrics](photo-metrics.md) page.

## Step 10: Fix the First Chapters and the Content Guide

**When:** November 24, 2:25 to 3:48 PM.
**Time:** about 1 hour.
**Skill:** `microsim-generator` v1.0.5.

Reading the first three chapters turned up problems we did not want repeated
in the other 18. We fixed them, wrote the fix into
`CONTENT-GENERATION-GUIDE.md` so later chapters would follow it, and asked
for a consistency check before going on.

```text
In chapter 1, where appropriate, replace the word "clock" with "timeline,"
since a clock does not include dates. Use "map and timeline" instead of "map
and clock."
```

```text
Use the /microsim-generator skill to create a high-level map of the Eastern
Mediterranean region. Label only the regions named in this section, plus the
seas and the larger countries.
```

```text
Put on the hat of a senior instructional designer. Look at what concepts we
are trying to teach in this MicroSim. Would a single eras timeline be a
better simple introduction, with the events moved to another MicroSim? What
are the tradeoffs?
```

```text
Please recheck the consistency of the first three chapters and the content
generation guide and make any updates you feel are needed. I want to make
sure the guide is correct before we generate the remaining content.
```

## Step 11: Add the Appendices

**When:** November 24, at several times from 3:51 to 9:51 PM.
**Time:** about 1 hour in all.
**Skill:** `book-installer` v1.0.5 (for KaTeX).

```text
Please create a new appendix called "Extensions and Excursions" that describes
the optional trips before the cruise in Istanbul and after it in Athens. Do
web research on the Viking website to get a list of the extensions and
excursions. Note that we did an excursion to the villages on the island of
Crete.
```

```text
Add a new appendix called "Who Created the Antikythera Mechanism." Describe
the mechanism and what skills would be needed to build it.
```

```text
Update mkdocs.yml using the /book-installer guide for LaTeX equation rendering
with the KaTeX JavaScript library, and test it.
```

The results are [Extensions and Excursions](extensions-and-excursions.md),
[Who Created the Antikythera Mechanism](antikythera-mechanism.md), and the
[Timeline of Events](timeline-of-events.md).

## Step 12: Write Chapters 4 to 21

**When:** November 24, 3:59 PM to 10:21 PM.
**Time:** about 6.5 hours, or about 20 minutes per chapter.
**Skill:** `chapter-content-generator` v1.11.

With the content guide corrected, we wrote the other 18 chapters. One
background agent wrote each chapter from a shared brief, one chapter at a
time, and the main session checked each chapter before starting the next.
We published the chapters in batches while the rest were being written.

```text
Generate the content for chapters 4, 5, and 6.
```

```text
Continue generating the content for the remaining chapters of the book
(7 through 21).
```

```text
Publish chapters 7–9 now while you work.
```

At the end we asked for better logs:

```text
The log files that match logs/ch-*-content-generation.md only have a start and
stop time. Please add more detail, such as the number of concepts, diagrams,
MicroSims, and photos in each chapter, any decisions you made about the
content length, and the reading level.
```

The 21 chapters hold about 320,000 words, at a reading level of about grade
9 to 10. Each chapter's log is in `logs/`.

## Step 13: Generate the Glossary

**When:** November 24, 10:08 to 10:28 PM.
**Time:** about 20 minutes.
**Skill:** `glossary-generator` v1.0.

```text
/glossary-generator Make sure to add a pronounce button if the term is hard to
pronounce. Use the pronunciation guide to find the sound files to play.
```

The [Glossary](../glossary.md) has 666 terms.

## Step 14: Generate the FAQ

**When:** November 24, 10:28 to 10:43 PM.
**Time:** about 15 minutes.
**Skill:** `faq-generator` v1.0.

```text
/faq-generator and note that the glossary has just been created.
```

The [FAQ](../faq.md) has 94 questions. While writing it, the skill checked
its claims against the chapters and corrected several facts in its first
draft. The details are in `logs/faq.md`.

## Step 15: Build All the MicroSims

**When:** November 24, 10:29 PM, to November 25, 5:53 AM.
**Time:** about 7 hours, overnight and mostly unattended.
**Skills:** `microsim-utils` v1.0, `microsim-generator` v1.0.5.
**Model:** Claude Opus 5.5.

Each chapter includes written specifications for its MicroSims, the small
interactive simulations embedded in the text. We first turned the
specifications into a to-do list, then built them all in one long run, with a
commit after each one.

```text
From the /microsim-utils skill, generate a TODO list using Python of all the
MicroSims that need to be generated, and create stubs for each MicroSim.
```

```text
Now run the /microsim-generator skill on all of the docs/TODO/*.json
specifications.
```

```text
Commit and push the content to GitHub when you finish each MicroSim.
```

The run built about 60 MicroSims, about one every 7 minutes. While building
them, the agent found some facts in the chapters that did not match its
research, and listed them. The next morning one more prompt fixed the
chapter text:

```text
Yes, fix the text.
```

Later we checked that every diagram in the chapters had a working iframe:

```text
Please go through all the Diagram sections in the chapters and make sure
that after each one there is an iframe that loads the MicroSim. Use
/microsim-utils to find the height rules.
```

```text
Run the /microsim-utils tool that will update docs/sims/index.md with a grid
view that includes a screen image of each MicroSim.
```

See the [List of MicroSims](../sims/index.md).

## Step 16: Write and Illustrate the Graphic-Novel Stories

**When:** November 25, 6:06 AM to 12:20 PM.
**Time:** about 4 hours, most of it generating images.
**Skill:** `book-media-generator` v1.0.

The stories tell the history of the places we visited as short illustrated
comics. Claude wrote the story ideas and the panel descriptions. Six
background agents wrote the 22 stories at the same time, in about 15 minutes.

```text
Please generate a list of story ideas for about 20 graphic-novel stories that
would help people understand the history, people, culture, traditions, food,
and mysteries of the Eastern Mediterranean. Here are some suggestions to get
you started: the Trojan Horse, the Oracle of Delphi, the building of the
Parthenon, Paul's writings in Ephesus, and gods like Zeus and Athena with her
owl Glaux. Write the ideas to docs/stories/story-ideas.md. Each story will
have 8 to 16 panels.
```

```text
Now use /book-media-generator to create the directory and main index.md for
each story. Put detailed descriptions of the cover and each panel in the
story's index.md, as the guide describes. Create a single description of the
characters who appear in more than one panel or story, and reference the
character sheet in each index.md for consistency. When you have finished, I
will give the descriptions to a high-quality text-to-image model.
```

The author then told the ChatGPT desktop app to render the 318 cover and
panel images from the descriptions in each story's `index.md` (see
[Models Used](#models-used)). The instructions for ChatGPT are in
`docs/stories/text-to-image-prompt.md`. The character sheet kept faces and
clothing the same from panel to panel. A small script,
`scripts/uncomment_story_images.py`, turned on each image link once its file
existed.

```text
Please verify all images are showing in the stories.
```

See the [Stories](../stories/index.md).

## Step 17: Cover, Landing Page, and About Page

**When:** November 25, 8:50 to 10:14 AM.
**Time:** about 1.5 hours.
**Skill:** `book-installer` v1.0.5.

```text
Update the main landing page, docs/index.md, using the guide in the
/book-installer skill. Provide links to the useful parts of the book,
including the posters and stories.
```

```text
Run the /book-installer tool that generates a cover image. Put the owl
welcome pose in the lower-left corner, and make the title "Mediterranean
Travels" in the center. Place a montage of our photos around these.
```

```text
Run the /book-installer about guide. In this guide, focus on the way that
travel can help you build your empathy skills. As you travel, you can
practice putting yourself in the shoes of others, like a merchant in the
markets of Istanbul or a citizen of ancient Athens.
```

The results are the [home page](../index.md) and the
[About](../about.md) page.

## Step 18: Create the Interactive Posters

**When:** November 24 at 10:00 PM (the first poster), November 25 from
12:55 to 2:50 PM, and November 25 at 9:02 PM (the Ephesus map).
**Time:** about 2.5 hours for 17 posters.
**Skill:** `microsim-generator` v1.0.5 (infographic overlay guide).
**Model:** Claude Opus 5.5.

Each poster is a picture with an interactive overlay. Claude wrote the poster
plan and a detailed image prompt in the poster's `image-prompt.md` file. The
author told the ChatGPT desktop app to render the picture from that file (see
[Models Used](#models-used)). Then Claude placed the
clickable labels on top of it. The prompts ask for a picture with no text at
all, because the labels are added later as an HTML overlay.

```text
Using the microsim generator skill and the guide that builds overlay
infographics, create a three-column comparison of the three orders of
architecture: Doric, Ionic, and Corinthian. Use an image generator to make
the image, and put the files in docs/posters/column-types.
```

```text
Please generate a few ideas for interactive overlay infographic posters. Put
the ideas in docs/posters/poster-ideas.md. Focus on visualizations that can
use overlays with call-outs or that compare items side by side.
```

For each poster, the loop was the same: choose an idea, generate the image
from the prompt Claude wrote, then tell Claude it was ready.

```text
Oracle vs. Algorithm
```

```text
The image has been generated.
```

```text
Continue generating the remaining infographic posters described in
poster-ideas.md.
```

The last poster was a map of Ephesus. Its picture is not generated: it is our
own photo of the map on the information sign at the site, with the
clickable labels placed on top.

```text
Create a new full-screen map of the ancient city of Ephesus. Use the overlay
infographic to add these points from the key on the site's information sign:
1 Magnesia Gate; 2 East Gymnasium; 3 State Agora; ...
```

See the [List of Posters](../posters/index.md).

## Step 19: Announce the Book

**When:** November 25, 2:52 PM.
**Time:** about 30 minutes.
**Skill:** `book-publisher` v1.0 (the prompt named `book-media-generator`).

```text
Generate a LinkedIn announcement using the /book-publisher skill, and update
README.md with the revised metrics.
```

## Step 20: Add a Custom 404 Page

**When:** November 26, 5:01 to 5:11 AM.
**Time:** about 10 minutes.
**Skill:** `book-installer` v1.0.5.

```text
Use the /book-installer skill guide to add a fun 404 error page, with a
humorous joke and the mascot's warning pose.
```

Try a page that does not exist to see Glaux's joke about the Colossus of
Rhodes.

## Step 21: Find Cape Sounion in the GPS Data

**When:** November 26, 5:13 to 5:39 AM.
**Time:** about 30 minutes.

This step shows why we waited until after the trip. Our plan did not include
Cape Sounion, but the photo GPS data showed we had been to the Temple of
Poseidon on November 20, on a Viking excursion. Claude found the visit in the
data and added it to the book.

```text
Please do some analysis of the photo GPS data in data/takeout, and then add
the date that we did a Viking excursion to the Temple of Poseidon. Update the
book with this information.
```

```text
In the cruise map, add a separate stop for the Temple of Poseidon as its own
item 7, and make the Delphi trip item 8.
```

```text
Add the counts of photos by location to the photo metrics page. Add a note at
the end of the page saying how the report was created, with a link to the
source code that created it.
```

## Step 22: Write This Page

**When:** November 26.
**Time:** about 15 minutes.
**Skill:** none.

```text
Using the log file data and GitHub commits, please create a new appendix
called "How We Built This Site." It should be a step-by-step guide with rough
estimates of how long each step took. Whenever possible, suggest the prompt
that was used and the version of the skill.
```

## Step 23: Add the Chapter Quizzes

**When:** November 26, 6:04 to 6:27 AM.
**Time:** about 25 minutes.
**Skill:** `quiz-generator` v0.5.

We almost forgot the quizzes. The skill used one agent that worked through
all 21 chapters in order, writing 10 questions for each. The questions are
spread across Bloom's levels: more recall in the first chapters, and more
analysis and judgment in the deep dives. Many Apply questions are traveler
scenarios, such as "A guide in Ephesus tells you…"

```text
/quiz-generator
```

A script then checked every question: four options, one answer, a working
link to the chapter section it came from, and no near-duplicates. The 210
questions scored 93 out of 100 in the
[Quiz Generation Report](../learning-graph/quiz-generation-report.md). Each
chapter's quiz is in the nav under that chapter.

## Not Done Yet

The intelligent-textbook skills can add one more thing that this book does
not have yet: ten references for each chapter, with `reference-generator`
v1.0.

## Lessons for Your Own Trip Book

- **Set up before, write after.** A small amount of work before the trip (the
  frame, the itinerary, and a map) is enough. The photo stream records what
  you really did, so most of the book is better written afterward.
- **Keep the photos private and use their data.** Add the `.gitignore`
  before you unzip the export. The original photos and videos stay on your
  own computer. Only small web copies, with the GPS removed, go into the book.
- **Avoid sending every photo to the AI.** On-device labels, GPS matching,
  and contact sheets let Claude choose photos for the cost of one image per
  chapter.
- **Write a few chapters, then fix the guide.** Checking chapters 1 to 3 and
  updating `CONTENT-GENERATION-GUIDE.md` before writing the other 18 kept the
  same mistakes from being repeated 18 times.
- **Let long jobs run on their own.** The MicroSims took about 7 hours, but
  needed only three short prompts and one review the next morning.
