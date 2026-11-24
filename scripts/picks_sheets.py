#!/usr/bin/env python3
"""Render one review sheet per chapter from data/photo-picks.csv.

Each thumbnail is numbered in chapter order and labeled with its draft
caption, so the picks can be checked (and captions corrected) at a glance.
Sheets go to data/contact-sheets/picks-chNN.jpg, which is gitignored.

Usage (from the repo root):

    python3 scripts/picks_sheets.py \
        "data/takeout/Takeout/Google Photos/Ann & Dan Eastern Mediterranean Cruise 2026"
"""

from __future__ import annotations

import argparse
import csv
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from select_chapter_photos import DATA, chapter_titles, contact_sheet  # noqa: E402


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("album_dir", type=Path)
    ap.add_argument("--picks", type=Path, default=DATA / "photo-picks.csv")
    args = ap.parse_args()

    by_chapter = defaultdict(list)
    for row in csv.DictReader(args.picks.open(encoding="utf-8")):
        by_chapter[row["chapter"]].append({
            "path": args.album_dir / row["file"],
            "place": row["place"],
            "label": row["draft_caption"],
            "order": int(row["order"]),
        })

    titles = chapter_titles()
    sheets = DATA / "contact-sheets"
    cache = sheets / "thumbs"
    cache.mkdir(parents=True, exist_ok=True)
    for ch, picks in sorted(by_chapter.items()):
        picks.sort(key=lambda p: p["order"])
        out = sheets / f"picks-ch{ch}.jpg"
        contact_sheet(f"Picks for Ch {ch}: {titles.get(ch, '')}", picks, cache, out)
        print(f"{out.name}: {len(picks)} photos")


if __name__ == "__main__":
    main()
