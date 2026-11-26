# Custom 404 Error Page Session Log

- **Skill:** book-installer v1.0.5 (feature 32, `references/custom-404-page.md`)
- **Date:** 2026-11-26
- **Book:** Mediterranean Travels
- **Model:** Claude Sonnet 5.5 (Claude Code)
- **Result:** custom 404 page with Glaux's warning pose and a joke, approved by the author

## Summary

The author asked for a fun 404 page that uses a humorous joke and the mascot's
warning pose (`docs/img/mascot/warning.png`). MkDocs cannot use a Markdown file
as its 404 page, so the page is a theme override template. It extends
Material's `base.html`, so the site header and footer still appear around it.
`mkdocs build --strict` passes, and a made-up URL on the dev server
(`http://127.0.0.1:8000/mediterranean-travels/no-such-page/`) shows the new
page with an HTTP 404 status.

## Files

| File | Change |
|---|---|
| `overrides/404.html` | New. Jinja2 template with the mascot image, heading, joke, and links. |
| `mkdocs.yml` | Added `custom_dir: overrides` and `static_templates: [404.html]` under `theme:`, right after `name: material`. |

## The Joke

The text follows Glaux's voice from `docs/img/mascot/character-sheet.md`: dry
wit, "we" as a fellow traveler, no stacked exclamation marks. It opens with
Glaux's catchphrase, "Look closer."

- **Heading:** "404 — This Page Is in Ruins"
- **Joke:** "We looked closer. Then we looked everywhere. This page is like the
  Colossus of Rhodes: everyone has heard of it, but nobody can find a single
  piece of it."
- **Follow-up:** "We asked the Oracle at Delphi where it went. She said, 'If
  you click a link, a great page will be found.' She did not say which one."

Both jokes point at places in the book. The Colossus of Rhodes (Chapter 12) is
famous, but no piece of it has ever been found. The Oracle line copies the
answer Croesus got: "a great empire will be destroyed," without saying which
one (Chapters 17 and 18).

## Design Notes

- The image and link paths are absolute (`/mediterranean-travels/...`) because
  a 404 page can be served at any URL depth, where relative paths break.
- The warning pose is portrait (1024×1230), so the image has a fixed height of
  220px with `width: auto`. This follows the same portrait-pose rule as
  `mascot.css`.
- There are two links: back to the home page and to the List of Chapters.
  Material search is an overlay, not a page, so there is no search link.
