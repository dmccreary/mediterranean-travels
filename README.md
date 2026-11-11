# Mediterranean Travels

[![MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-526CFE?logo=materialformkdocs)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=materialformkdocs)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/View%20on-GitHub%20Pages-blue?logo=github)](https://dmccreary.github.io/mediterranean-travels/)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-DA7857?logo=anthropic)](https://claude.ai/code)
[![Claude Skills](https://img.shields.io/badge/Uses-Claude%20Skills-DA7857?logo=anthropic)](https://github.com/dmccreary/ibook-skills)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## View the Live Site

Read the guide at
[https://dmccreary.github.io/mediterranean-travels/](https://dmccreary.github.io/mediterranean-travels/)

## Overview

Mediterranean Travels is a day-by-day travel guide for a thirteen-day journey
through Turkey and Greece, from **November 11 to November 23, 2026**. The trip
has three parts: three days on our own in Istanbul, the Viking Star's
seven-night *Ancient Mediterranean Treasures* cruise from Istanbul to Athens,
and three days on our own in Athens.

The guide has one chapter for each day of the trip, meant to be read at
breakfast or the night before. Each chapter prepares the reader for that day's
place: what happened there, who built it and why, what to look for when standing
in front of it, what to eat, and who lives there now. The goal is not to tick
off sights. It is to notice more, understand more, and meet the people of each
place with real empathy.

The guide is written for curious adults who love the history of civilization,
culture, and food. It assumes no background in archaeology, classics, or
Middle Eastern or Balkan history; every term is explained when it first
appears. Interactive MicroSims, such as the
[Viking Cruise Map](https://dmccreary.github.io/mediterranean-travels/sims/viking-cruise-map/),
show the route and places along the way.

## The Itinerary

| Days | Dates | Place |
|------|-------|-------|
| 1–3 | Nov 11–13 | Istanbul on our own |
| 4–5 | Nov 14–15 | Istanbul, embarking the Viking Star |
| 6 | Nov 16 | Çanakkale (Troy and Gallipoli), Turkey |
| 7 | Nov 17 | Kusadasi (Ephesus), Turkey |
| 8 | Nov 18 | Rhodes, Greece |
| 9 | Nov 19 | Heraklion (Knossos), Crete, Greece |
| 10 | Nov 20 | Athens (Piraeus), Greece; final night aboard |
| 11–13 | Nov 21–23 | Athens on our own |

See the [Trip Description](docs/course-description.md) for the full plan and
port times.

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/dmccreary/mediterranean-travels.git
cd mediterranean-travels
```

### Install Dependencies

This project uses MkDocs with the Material theme:

```bash
pip install mkdocs mkdocs-material
```

### Build and Serve Locally

Build the site, treating broken links and missing files as errors:

```bash
mkdocs build --strict
```

Serve locally with live reload:

```bash
mkdocs serve
```

Then open `http://localhost:8000/mediterranean-travels/` in your browser.

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

This builds the site and pushes it to the `gh-pages` branch.

## Repository Structure

```text
mediterranean-travels/
├── docs/                          # MkDocs source
│   ├── index.md                   # Home page
│   ├── course-description.md      # Trip description and itinerary
│   ├── chapters/                  # One chapter per day of the trip
│   ├── sims/                      # Interactive MicroSims
│   │   └── viking-cruise-map/     # Leaflet map of the cruise route
│   │       ├── main.html          # Standalone sim (embeddable via iframe)
│   │       └── index.md           # Lesson page
│   ├── learning-graph/            # Concept list and dependency graph
│   ├── css/extra.css              # Custom styles
│   └── img/                       # Cover image and license badge
├── plugins/social_override.py     # Social-media preview meta tags
├── AGENTS.md                      # Instructions for AI coding agents
├── CONTENT-GENERATION-GUIDE.md    # Writing and formatting rules
├── mkdocs.yml                     # Site configuration and navigation
└── README.md                      # This file
```

## Reporting Issues

Found a mistake, an outdated port time, or have a suggestion? Please open an
issue:

[GitHub Issues](https://github.com/dmccreary/mediterranean-travels/issues)

Please include the page or MicroSim, a description of the problem, and your
browser if the issue is with an interactive element.

## License

This work is licensed under the
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

**You are free to:**

- **Share** — copy and redistribute the material
- **Adapt** — remix, transform, and build upon the material

**Under the following terms:**

- **Attribution** — Give appropriate credit with a link to the original
- **NonCommercial** — No commercial use without permission
- **ShareAlike** — Distribute contributions under the same license

See the [license page](docs/license.md) for full details.

## Acknowledgements

This guide is built on open source tools:

- **[MkDocs](https://www.mkdocs.org/)** — Static site generator for documentation
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** — Responsive theme
- **[Leaflet](https://leafletjs.com/)** — Interactive maps
- **[Claude AI](https://claude.ai)** by Anthropic — AI-assisted content generation
- **[GitHub Pages](https://pages.github.com/)** — Free hosting for open source projects

## Contact

**Dan McCreary**

- LinkedIn: [linkedin.com/in/danmccreary](https://www.linkedin.com/in/danmccreary/)
- GitHub: [@dmccreary](https://github.com/dmccreary)

Questions or suggestions? Connect on LinkedIn or open an issue on GitHub.
