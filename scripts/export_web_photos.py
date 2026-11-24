#!/usr/bin/env python3
"""Export picked photos as web-ready JPEGs for the book, with GPS removed.

For each row of data/photo-picks.csv in the chosen chapters:

0. The source is the Takeout album file named in `file`, or, when `file`
   contains a slash, a repo-relative path (Wikimedia Commons downloads are
   kept in data/commons/, which is gitignored).
1. `sips` (built into macOS) converts the original to JPEG and
   downsizes it so the long edge is at most --max-edge pixels.
2. Pillow applies the camera orientation and re-saves the image WITHOUT any
   EXIF block, which removes GPS coordinates, timestamps, and device details.
   The color profile is kept so iPhone (Display P3) colors stay accurate.
3. The file is written to docs/chapters/<chapter-dir>/img/<slug>.jpg and the
   relative path is recorded in the picks CSV's `web_path` column.

Usage (from the repo root):

    python3 scripts/export_web_photos.py \
        "data/takeout/Takeout/Google Photos/Ann & Dan Eastern Mediterranean Cruise 2026" \
        --chapters 01 02 03
"""

from __future__ import annotations

import argparse
import csv
import re
import subprocess
import tempfile
import unicodedata
from pathlib import Path

from PIL import Image, ImageOps

REPO = Path(__file__).resolve().parent.parent
PICKS = REPO / "data" / "photo-picks.csv"
STOP = {"a", "an", "the", "of", "on", "in", "at", "with", "from", "and", "to", "as", "its", "our"}


def slugify(caption: str, words: int = 5) -> str:
    text = unicodedata.normalize("NFKD", caption.replace("ı", "i")).encode("ascii", "ignore").decode()
    tokens = [t for t in re.findall(r"[a-z0-9]+", text.lower()) if t not in STOP]
    return "-".join(tokens[:words]) or "photo"


def chapter_dir(chapter: str) -> Path:
    matches = sorted((REPO / "docs" / "chapters").glob(f"{chapter}-*"))
    if not matches:
        raise SystemExit(f"error: no docs/chapters/{chapter}-* directory")
    return matches[0]


def export(src: Path, dest: Path, max_edge: int, quality: int) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        staged = Path(tmp) / "staged.jpg"
        subprocess.run(["sips", "-s", "format", "jpeg", "-Z", str(max_edge), str(src), "--out", str(staged)],
                       check=True, capture_output=True)
        with Image.open(staged) as img:
            icc = img.info.get("icc_profile")
            clean = ImageOps.exif_transpose(img).convert("RGB")
            dest.parent.mkdir(parents=True, exist_ok=True)
            clean.save(dest, "JPEG", quality=quality, optimize=True, progressive=True, icc_profile=icc)


def verify_clean(path: Path) -> None:
    with Image.open(path) as img:
        exif = img.getexif()
        if len(exif) or "exif" in img.info:
            raise SystemExit(f"error: {path} still carries EXIF metadata")


def main() -> None:
    ap = argparse.ArgumentParser(description="Export picked photos as web JPEGs without GPS.")
    ap.add_argument("album_dir", type=Path)
    ap.add_argument("--chapters", nargs="+", required=True, help="chapter numbers, e.g. 01 02 03")
    ap.add_argument("--max-edge", type=int, default=1600)
    ap.add_argument("--quality", type=int, default=80)
    args = ap.parse_args()

    rows = list(csv.DictReader(PICKS.open(encoding="utf-8")))
    fields = list(rows[0]) + (["web_path"] if "web_path" not in rows[0] else [])
    used: set[Path] = set()
    for row in rows:
        if row["chapter"] not in args.chapters:
            continue
        caption = row["draft_caption"].replace("(verify)", "").strip()
        out_dir = chapter_dir(row["chapter"]) / "img"
        dest = out_dir / f"{slugify(caption)}.jpg"
        n = 2
        while dest in used:
            dest = out_dir / f"{slugify(caption)}-{n}.jpg"
            n += 1
        used.add(dest)
        # Our photos are named by file within the Takeout album; Wikimedia
        # Commons downloads are given as a repo path such as data/commons/x.jpg.
        src = REPO / row["file"] if "/" in row["file"] else args.album_dir / row["file"]
        if not src.exists():
            raise SystemExit(f"error: source image not found: {src}")
        export(src, dest, args.max_edge, args.quality)
        verify_clean(dest)
        row["web_path"] = str(dest.relative_to(REPO))
        print(f"{row['file']:<16} -> {row['web_path']}  ({dest.stat().st_size // 1024} KB)")

    with PICKS.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=fields)
        w.writeheader()
        w.writerows({k: r.get(k, "") for k in fields} for r in rows)


if __name__ == "__main__":
    main()
