# How We Built This Site: Session Log

- **Skill:** none (written directly)
- **Date:** 2026-11-26
- **Book:** Mediterranean Travels
- **Model:** Claude Sonnet 5.5 (Claude Code)
- **Result:** new appendix `docs/appendices/how-we-built-this-site.md`, 22
  steps with prompts, skill versions, and time estimates. The author was
  very happy with it.

## Author Feedback

The author was very happy with the amount of detail in each step: "I love
the amount of detail in each step." Each step gives the time it ran, a rough
time estimate, the skill and its version, the model where it mattered, the
prompts that were used, and what the step produced. Keep this level of
detail if the page is updated or a similar page is written for another book.

## Sources

| Source | What it gave the page |
|---|---|
| `git log` (115 commits) | The order of the work, commit times, and the count of pre-trip commits (3 of 115) |
| `logs/*.md` | Skill versions, start and end times, and results for the learning graph, chapter design, chapters, FAQ, color themes, and 404 page |
| 39 Claude Code session transcripts for this project | The author's actual prompts and their times. Times in the transcripts are UTC; the page uses US Central to match the commits. |
| `../ibook-skills` git history | The `metadata.ibook.version` of each skill on November 11, 24, 25, and 26. Only `book-installer` changed (1.0.4 to 1.0.5, after the pre-trip step). |
| `docs/learning-graph/book-metrics.md`, `data/photo-profile.md` | Counts: 598 concepts, 21 chapters, 666 glossary terms, 94 FAQs, 22 stories, 1,465 photos and videos (4.4 GB) |
| `scripts/` | How the low-token photo pipeline works (Apple Vision labels, GPS matching, contact sheets, web export) |

## Decisions

- **Prompts were cleaned up, not quoted word for word.** Typos were fixed and
  long prompts were shortened, so a reader can reuse them. An API key the
  author pasted in one session was left out.
- **Time estimates use the prompt and commit times.** Sessions often ran at
  the same time, so the page says the step times overlap. Elapsed time (about
  46 hours) and the author's own time (about 15 hours) are given separately.
- **Over 95 percent after the trip** is supported by the commits: 3 of 115
  were made before the trip.
- **The LinkedIn step** used a prompt that named `/book-media-generator`, but
  the LinkedIn guide is in `book-publisher` v1.0. The page lists
  `book-publisher` and notes this.
- **Quizzes and references** have not been generated, so the page lists them
  under "Not Done Yet."

## Changes Made at the Author's Request

1. **Models.** Sonnet 5.5 was the default model, and Opus 5.5 was used for
   the MicroSims and posters. The page also notes that the logs record Opus
   5.5 for the learning graph, chapter design, and color themes.
2. **Photos never went to GitHub.** A new section shows that the original
   photos and videos (the 4.4 GB Takeout export), the zip, and the contact
   sheets stayed on the author's MacBook, kept out by `data/.gitignore`. Only
   121 small web copies with GPS removed are in the book. This was checked
   with the command below, which printed nothing for every branch:

    ```bash
    git log --all --name-only --format= | grep -iE '\.(heic|mov|mp4)$|takeout/'
    ```

3. **GPS coordinates.** `data/photo-inventory.csv` is committed and holds a
   latitude and longitude for each photo. The author said this is not a
   concern, and it was left as is.
4. **OpenAI images.** Every AI-generated image (story panels and poster
   illustrations) was made by OpenAI. The author used the ChatGPT desktop app
   and told it to render the images from the descriptions Claude wrote to the
   book's files. The author believes the model was OpenAI Images 2.6
   (`gpt-image-2.6-flare` / `gpt-image-2.6-sunburst`), but no image metadata
   proves it, and the page says so.
5. **Ephesus map.** That poster's picture is the author's photo of the site
   sign, not a generated image, so the page says "every AI-generated image"
   rather than "all the images."

## Files

| File | Change |
|---|---|
| `docs/appendices/how-we-built-this-site.md` | New appendix |
| `docs/appendices/index.md` | Added item 6, How We Built This Site |
| `mkdocs.yml` | Added the page under Appendices in `nav:` |
| `logs/wrote-how-we-built-this-site.md` | This log |

## Validation

- `mkdocs build --strict` (built to a scratch directory, not `site/`): clean.
  The only notices are four pages that were already outside the nav.
- The `#our-photos-never-went-to-github` and `#models-used` anchors exist in
  the built page.
