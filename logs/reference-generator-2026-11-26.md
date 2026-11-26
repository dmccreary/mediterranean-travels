# Reference Generator Session Log

- **Skill:** reference-generator v1.0
- **Date:** 2026-11-26
- **Book:** Mediterranean Travels
- **Model:** Claude Sonnet 5.5 (Claude Code)
- **Prompt:** `/reference-generator`
- **Execution mode:** one background agent, all 21 chapters in order
- **Time:** about 35 minutes (about 6:35 to 7:10 AM). The agent ran for 27
  minutes, with 154 tool calls and 364,372 tokens.
- **Result:** 21 `references.md` files, 210 references: 63 Wikipedia
  articles, 42 books, and 105 other online resources

## What Each Chapter Got

| Positions | Kind | Rule |
|---|---|---|
| 1–3 | Wikipedia articles | Canonical titles, checked through the Wikipedia API; no article used in two chapters |
| 4–5 | Books, no URL | Each names the author's specific contribution (for example, Margalit Fox telling the Linear B decipherment through Alice Kober's index cards); every title, author, publisher, and year checked with a web search; no book used twice |
| 6–10 | Online resources | Museums, heritage bodies, universities, and sources such as Perseus, BBC In Our Time, and the Greek Ministry of Culture's Odysseus site; every URL fetched before it was written down |

## Validation

A separate script checked all 21 files after the agent finished:

- Every file has exactly 10 items, numbered 1–10, under a heading that matches
  the chapter's H1.
- Items 1–3 are Wikipedia links, 4–5 have no URL, and 6–10 are non-Wikipedia
  links.
- Every description is 22–37 words (target 20–40), and none uses
  "comprehensive."
- No URL or book appears twice in the book (168 distinct URLs, 42 books).
- Every URL was fetched again with curl. **165 of 168 returned 200**, and no
  Wikipedia link redirects.
- `mkdocs build --strict`: clean.

## Three UNESCO Links Not Re-Checked

UNESCO started rate-limiting this computer (HTTP 429, "Too many requests")
during the agent's checks, and the limit also applied in Chrome. These three
links could not be re-checked at the end of the session:

| Chapter | Item | URL | What the agent saw earlier |
|---|---|---|---|
| 3 | 10 | `https://ich.unesco.org/en/RL/turkish-coffee-culture-and-tradition-00645` | 200, with a matching page title |
| 21 | 6 | `https://www.unesco.org/en/articles/why-mother-language-based-education-essential` | 200, but the page body could not be read; topic confirmed by web search only |
| 21 | 8 | `https://www.unesco.org/gem-report/en/publication/technology` | 200, with a matching page title |

Re-check these after the rate limit clears (about an hour).

## Decisions and Compromises

- **Sites that block scripts were left out.** Britannica, World History
  Encyclopedia, Smarthistory, the UNESCO World Heritage list, the Met's
  Heilbrunn Timeline, the British Museum, Khan Academy, and the Acropolis
  Museum returned 403 or 429 to both curl and WebFetch, so they could not be
  verified. Verified alternatives were used instead.
- **Odysseus pages use http.** The Greek Ministry of Culture's Odysseus site
  only loads over http.
- **Ch2 #7:** a UNESCO literacy page was swapped for Room to Read because its
  content could not be confirmed.
- **Ch5 #9:** the National Gallery of Art catalogue is a 155 MB PDF; the
  description warns readers.
- **Ch18 #9:** the École française d'Athènes page on Delphi is in French; the
  description says so.
- **Ch6 #1–3:** Wikipedia's canonical title is "Ibrahim Muteferrika," so the
  link text has no Turkish letters, while the description spells İbrahim
  Müteferrika.
- **Book editions with two publishers or dates.** Summerson (Thames & Hudson
  1980 revised edition), Lowry (Cornell 1979; Blackwell also 1979), Hughes
  (Weidenfeld & Nicolson 2017), Herrin (Princeton 2007; Allen Lane in the UK),
  Abulafia (Oxford University Press 2011, US; Allen Lane in the UK), and Freire
  (Herder and Herder 1970, the first English edition). All are real books.

## Files

| File | Change |
|---|---|
| `docs/chapters/*/references.md` | 21 new files |
| `docs/chapters/*/index.md` | Each ends with `[See Annotated References](./references.md)` |
| `mkdocs.yml` | `Annotated References:` nested under each chapter, after `Quiz:` |
| `logs/reference-generator-2026-11-26.md` | This log |
