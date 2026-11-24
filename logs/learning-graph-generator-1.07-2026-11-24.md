# Learning Graph Generator Session Log

- **Skill:** learning-graph-generator v1.07
- **Date:** 2026-11-24
- **Book:** Mediterranean Travels
- **Model:** Claude Opus 5.5 (Claude Code)

## Python programs used

| Program | Version |
|---|---|
| csv-to-json.py | v1.05 (computes Concept Impact Score) |
| analyze-graph.py | unversioned (copied from skill v1.07) |
| taxonomy-distribution.py | unversioned (copied from skill v1.07) |
| validate-learning-graph.py / .sh | unversioned (copied from skill v1.07) |
| add-taxonomy.py | copied, not used (TaxonomyID was written directly into the CSV) |

## Steps

1. **Course description assessment** — no `quality_score` was present, so the
   description was scored: **97/100** (lost 3 points for no explicit
   out-of-scope list). Added `quality_score: 97` to the frontmatter of
   `docs/course-description.md`. Report: `docs/learning-graph/course-description-assessment.md`.
2. **Concept list** — concepts were authored as a single spec (label,
   TaxonomyID, prerequisite labels) and compiled by a builder script that
   checks label length (max 32; longest is 31), commas, duplicate labels, and
   unresolved prerequisites. The first draft had 618 concepts; 23 low-value leaf
   concepts were cut to stay under the 600 limit, leaving **595**.
3. **Dependency graph** — `learning-graph.csv` with 934 edges. The proceed and
   concept-review pauses were skipped because the author asked for a full run;
   the author should review the concept list now.
4. **Quality analysis** — valid DAG, 0 cycles, 0 self-dependencies, 0 orphans,
   1 connected component, 16 foundational concepts, 190 terminal nodes (31.9%),
   average 1.61 dependencies per concept, longest chain 24. Assessed quality
   score: about 88/100.
5. **Taxonomy** — 15 categories (FOUND, TRAV, BRONZ, CLASS, HELRO, PAUL, BYZ,
   MEDV, OTTO, MODRN, FOOD, DELPH, PRED, LEAD, LFA). Largest is PAUL at 9.4%;
   smallest is MEDV at 3.5%.
6. **JSON** — `learning-graph.json` generated with `color-config.json`,
   `metadata.json`, and `taxonomy-names.json`; it passes schema validation.
   The top CIS concepts are Ancient Greece, Civilization, Roman Empire,
   Historical Timeline, and Bronze Age, which confirms the edges point the right way.
7. **Index and nav** — `index.md` was rebuilt from `index-template.md` and the
   five report pages were added to the `nav:` block of `mkdocs.yml`.

## Follow-up edit (same day)

The author asked to record Turkish Delight and Saffron as foods we bought at
the Spice Market (Spice Bazaar, ID 330).

- **Turkish Delight** (ID 414) already existed; Spice Bazaar was added as a prerequisite.
- **Saffron** was added as concept 596 (FOOD), with Spice Bazaar and Spice Trade as prerequisites.
  It was appended to the end of the list so every existing ConceptID stays the same.
- Regenerated the CSV, JSON, quality metrics, and distribution reports: 596 concepts, 937 edges,
  still a valid single-component DAG.
- **Eggplant** was added as concept 597 (FOOD), a favorite dish of the travelers, with Turkish
  Cuisine and Greek Cuisine as prerequisites. Shared Greek-Turkish Dishes (ID 435) now also
  depends on Eggplant, because eggplant dishes are a shared staple of both countries. The graph
  now has 597 concepts and 940 edges and is still valid.
- **Graffiti** was added as concept 598 (MODRN), for the street art we saw while driving around
  Athens, with Daily Life in Athens and Greek Debt Crisis as prerequisites (Athens' graffiti
  boomed during the crisis years). The graph now has 598 concepts and 942 edges and is still valid.
