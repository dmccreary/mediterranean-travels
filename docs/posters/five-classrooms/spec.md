---
title: "Spec: Five Classrooms Across Three Thousand Years"
description: Build spec for the Five Classrooms interactive poster, with the panel layout, the four-step pattern each zone follows, sources, and open questions for the author.
---

# Spec: Five Classrooms Across Three Thousand Years

**Status:** spec and draft data only. No image has been generated, and there is
no `index.md` or `main.html` yet, so this poster is not in the nav.

## Learning Objective

The learner will compare five classrooms from the route, from the Lyceum to a
modern tutoring room, and for each one state who was inside, what opened the
door, and who was still left outside.

## Why This Poster

Learning for All is the book's third thread, and it ends nearly every daily
chapter. Each chapter runs the same four-step pattern from
[Chapter 2](../../chapters/02-traveling-well/index.md): learning is locked up,
a new technology or institution opens it, someone resists, and the circle
widens but never all the way. The pattern is spread over five chapters. A
single row of five rooms lets a reader see it at once, and the zones keep
asking the same question of each room: who is *still* outside?

## Layout Decision

**Five tall panels in a single row**, all drawn at the same scale, from the same
camera height, with the floor at the same level. Side by side is the point: the
reader compares who is in the room, what the learners hold, and how close the
teacher stands. A zone is one whole panel, so this uses the same grid engine
as the [Three Classical Orders](../column-types/index.md) and
[Oracle and Algorithm](../oracle-vs-algorithm/index.md) posters. The panels are
narrow (288 px wide on a 1536 px image), so the prompt asks for people drawn
large and stacked toward the foreground.

| Panel | Room | Date | Chapter |
|---|---|---|---|
| 1 | The Lyceum | about 335 BCE | [20](../../chapters/20-athens-museums-city-today/index.md) |
| 2 | Rhodes, a rhetoric school | first century BCE | [12](../../chapters/12-rhodes/index.md) |
| 3 | A Venetian print shop (Aldus Manutius) | about 1500 | [14](../../chapters/14-venetian-heraklion/index.md) |
| 4 | A medrese at the Süleymaniye | 1550s | [5](../../chapters/05-ottoman-istanbul/index.md) |
| 5 | A learning room with a tutor | today | [20](../../chapters/20-athens-museums-city-today/index.md), [21](../../chapters/21-going-home/index.md) |

The order is chronological left to right, but it is **not a staircase of
progress**. Several rooms widened access while others kept narrowing it, and the
zones say so.

## What Each Zone Says

Panels 2, 3, 4, and 5 follow the chapters' own four steps, so a reader can
read down one step across the whole row.

| Step | Rhodes | Aldine Press | Medrese | Modern Tutor |
|---|---|---|---|---|
| Locked up | Advanced rhetoric lived with a few teachers in a few cities | Plato in Greek needed a manuscript collection, a scribe, and a Greek teacher | Advanced study needed years that poor families could not afford | One-to-one tutoring went to princes, as with Alexander and Aristotle |
| Opened | Rich Romans could sail to the teachers, who built schools for many students | Printed Greek authors with grammars; the 1501 octavo a student could own and carry | An endowment paid tuition, room, meals, and a stipend | AI tutoring, tried in a Harvard physics course and in Edo State, Nigeria |
| Resisted | The Senate expelled Greek teachers in 161 BCE | Collectors scorned print; Aldus's own privileges forbade copying his type | Inertia: the curriculum stayed as founded while the world moved to print | Wrong answers, low use, and a Turkish study showing harm |
| Never all the way | Families who could pay for a voyage and a tutor; daughters almost never | Men who had been to school; few women learned Greek; villagers could not read | Only boys and men; Arabic; Muslim subjects | Children with no connection, device, or tutor in their language |

Panel 1, the Lyceum, does not have the four steps in the book. Chapter 20
treats it as a place to visit, not as a Learning for All story, so the zone
gives the room, the teacher, the method, the setback, and the limits of
Athens's circle (from [Chapter 16](../../chapters/16-athens-agora-democracy/index.md)).
See the open questions below.

The draft facts are in `data.json`. Each fact is taken from those chapter
sections, so the poster repeats what the book already says.

## Tone Rules

1. **No ladder.** Do not draw or word the five as stages leading up to the
   modern tutor. The last panel ends with the same "never all the way" step as
   the others.
2. **Draw the exclusions honestly.** The Lyceum and Rhodes show men, because
   that is who the chapters say attended. The medrese panel includes the
   neighborhood primary school with girls and boys, because the chapter says so.
3. **Keep the human in the last panel.** The chapter's closing idea is learning
   *with* communities, *not to* them. The adult sits beside the child and looks
   at the child, not the screen.
4. **No brands.** No logos, no robots, and no recognizable product screens.
5. **Respect for each tradition.** The medrese is drawn as the serious college
   it was, not as a foil for the modern room.

## Quiz

Ten questions are drafted in `data.json`, two per room. They ask about ideas
(traveling to the teacher, endowed education, the paper cost of a format), not
about what is drawn.

## Open Questions for the Author

1. **The Lyceum.** The chapters do not say who attended Aristotle's school, what
   they paid, or whether the room was a gate or an open door. Options: (a) keep
   the zone as drafted, which says only what the book says; (b) add a short
   four-step note to Chapter 20; (c) swap the panel for Aristotle teaching
   Alexander at Mieza, which Chapter 20 does tell as a "locked up" story, but
   that would put two tutor scenes in the row.
2. **A sixth room?** The Hall of Tyrannus at Ephesus (Acts 19, where Paul taught
   for two years) is the one classroom on the route not in the row. Adding it
   makes six panels of 240 px, and the people get small.
3. **Canvas.** If your image tool can produce 1792 × 1024, the panels would be
   wider (about 336 px). If you switch, tell me and I will recompute the
   zones and the prompt.
4. **Companion sims.** The lesson page should link
   [Who Could Vote in Athens?](../../sims/athens-who-could-vote/index.md),
   [What Did the Külliye Do?](../../sims/suleymaniye-kulliye-sorter/index.md),
   [When Printing Arrived](../../sims/when-printing-arrived/index.md), and
   the [Tutoring Effect Size Explorer](../../sims/tutoring-effect-size-explorer/index.md).

## Files

| File | State |
|---|---|
| `image-prompt.md` | Drafted. Ready for author review before any image is generated. |
| `data.json` | Drafted. Zones are computed from the layout (16 px margin and gap on a 1536 × 1024 image) and must be recalibrated against the real image. |
| `five-classrooms.png` | Not generated. |
| `main.html`, `index.md`, `metadata.json` | Not created. Copy from `docs/posters/oracle-vs-algorithm/` once the image exists. |

## Next Steps

1. Author reviews this spec and `image-prompt.md`, and answers the open
   questions, above all the Lyceum.
2. Generate the image, save it as `five-classrooms.png`, and check that each
   panel's top band is empty and the image has no text.
3. Measure the real panel edges, update the zones, and copy the page files from
   the Oracle and Algorithm poster.
4. Write `index.md` with `status: built` after the controls work, and leave
   `approved` to the author.
5. Add the poster to [List of Posters](../index.md) and to `nav:` in `mkdocs.yml`,
   then run `mkdocs build --strict`.
