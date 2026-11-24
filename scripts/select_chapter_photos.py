#!/usr/bin/env python3
"""Pick candidate trip photos for each chapter without looking at the pixels.

Pipeline (all local, zero LLM tokens until the contact sheets are reviewed):

1. Place  - every geotagged photo goes to the nearest landmark in
            data/chapter-places.json whose radius contains it, and so to that
            landmark's chapters.
2. Filter - drops placards, documents and screenshots, photos with
            people tagged in Google Photos, and photos where a face fills
            more than --max-face-area of the frame (the book is public).
3. Rank   - Apple Vision aesthetic score, plus small bonuses for photos you
            viewed often, described, or edited. Bursts (shots seconds apart
            at the same place) are collapsed to the best one.
4. Sheets - the top --per-chapter photos for each chapter are tiled into one
            numbered contact sheet, data/contact-sheets/chNN.jpg, so a whole
            chapter can be reviewed for the cost of a single image.

Inputs:  the extracted Takeout album folder, data/photo-labels.jsonl (from
         scripts/photo_labels.swift) and data/chapter-places.json.
Outputs: data/photo-candidates.csv (commit-safe: file names, places, scores)
         data/contact-sheets/       (photo thumbnails: gitignored)

Usage (from the repo root):

    python3 scripts/select_chapter_photos.py \
        "data/takeout/Takeout/Google Photos/Ann & Dan Eastern Mediterranean Cruise 2026"
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import re
import subprocess
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

from PIL import Image, ImageDraw, ImageFont, ImageOps

REPO = Path(__file__).resolve().parent.parent
DATA = REPO / "data"
PHOTO_EXT = {".heic", ".heif", ".jpg", ".jpeg", ".png"}
BURST_SECONDS = 20
DOCUMENT_LABELS = {"document", "printed_page", "illustrations", "map", "screenshot", "receipt", "text"}

# Contact-sheet geometry: 5 x 4 cells of 300 x 250 -> 1500 x ~1060 px,
# about the token cost of one ordinary photo.
COLS, CELL_W, THUMB_H, CAPTION_H, HEADER_H = 5, 300, 225, 25, 40


# ---------------------------------------------------------------------------
# Loading
# ---------------------------------------------------------------------------

def load_sidecars(album: Path) -> dict[str, dict]:
    """Map media file name -> sidecar metadata. '-edited' copies share the original's sidecar."""
    by_title = {}
    for sc in album.glob("*.json"):
        if sc.name == "metadata.json":
            continue
        meta = json.loads(sc.read_text(encoding="utf-8"))
        if isinstance(meta.get("title"), str):
            by_title[meta["title"]] = meta
    result = {}
    for media in album.iterdir():
        if media.suffix.lower() not in PHOTO_EXT:
            continue
        original = re.sub(r"-edited(?=\.[^.]+$)", "", media.name)
        meta = by_title.get(media.name) or by_title.get(original)
        if meta:
            result[media.name] = meta
    return result


def load_labels(path: Path) -> dict[str, dict]:
    return {r["file"]: r for r in map(json.loads, path.read_text().splitlines()) if r.get("file")}


def chapter_titles() -> dict[str, str]:
    titles = {}
    for index in sorted((REPO / "docs" / "chapters").glob("[0-9][0-9]-*/index.md")):
        num = index.parent.name[:2]
        h1 = next((ln[2:].strip() for ln in index.read_text(encoding="utf-8").splitlines() if ln.startswith("# ")), "")
        titles[num] = h1 or index.parent.name
    return titles


# ---------------------------------------------------------------------------
# Placing and ranking
# ---------------------------------------------------------------------------

def haversine_m(lat1, lon1, lat2, lon2) -> float:
    r = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def nearest_place(lat, lon, places):
    best = None
    for p in places:
        d = haversine_m(lat, lon, p["lat"], p["lon"])
        if d <= p["radius_m"] and (best is None or d < best[1]):
            best = (p, d)
    return best[0] if best else None


def score(photo: dict) -> float:
    s = photo["aesthetic"]
    s += 0.15 * math.log1p(photo["views"]) / math.log1p(11)  # 11 = most-viewed item in this album
    s += 0.2 if photo["described"] else 0
    s += 0.2 if photo["edited"] else 0
    s -= 0.15 if photo["utility"] else 0
    return round(s, 3)


def build_photos(album: Path, labels: dict, places: list, tz: ZoneInfo, max_face_area: float):
    sidecars = load_sidecars(album)
    names = {p.name for p in album.iterdir() if p.suffix.lower() in PHOTO_EXT}
    edited_originals = {re.sub(r"-edited(?=\.[^.]+$)", "", n) for n in names if "-edited." in n}

    photos, skipped = [], defaultdict(int)
    for name in sorted(names):
        if name in edited_originals:
            skipped["superseded by an edited copy"] += 1
            continue
        meta, lab = sidecars.get(name), labels.get(name)
        if not meta or not lab or "aesthetic" not in lab:
            skipped["missing metadata or labels"] += 1
            continue
        geo = meta.get("geoData") or {}
        lat, lon = geo.get("latitude", 0.0), geo.get("longitude", 0.0)
        if not (lat or lon):
            skipped["no location"] += 1
            continue
        place = nearest_place(lat, lon, places)
        if place is None:
            skipped["not near any listed place"] += 1
            continue
        # Vision's "utility" flag also fires on mosaics, statues and interiors in
        # this album, so it only excludes when the content looks like a document
        # (museum placards, printed pages, maps); otherwise it is a score penalty.
        top_labels = {l["label"] for l in lab.get("labels", [])[:3]}
        if lab.get("utility") and top_labels & DOCUMENT_LABELS:
            skipped["placard / document / screenshot"] += 1
            continue
        if meta.get("people"):
            skipped["people tagged in Google Photos"] += 1
            continue
        if lab.get("max_face_area", 0) > max_face_area:
            skipped["prominent face"] += 1
            continue
        taken = datetime.fromtimestamp(int(meta["photoTakenTime"]["timestamp"]), tz=timezone.utc).astimezone(tz)
        photo = {
            "file": name,
            "path": album / name,
            "place": place["name"],
            "chapters": place["chapters"] or ["extras"],
            "taken": taken,
            "aesthetic": lab["aesthetic"],
            "views": int(meta.get("imageViews", 0) or 0),
            "described": bool((meta.get("description") or "").strip()),
            "edited": "-edited." in name,
            "labels": [l["label"] for l in lab.get("labels", [])[:3]],
            "landscape": lab.get("width", 0) >= lab.get("height", 0),
            "utility": bool(lab.get("utility")),
        }
        photo["score"] = score(photo)
        photos.append(photo)
    return photos, skipped


def collapse_bursts(photos: list) -> list:
    """Within each place, keep only the best photo of any run taken BURST_SECONDS apart."""
    kept = []
    by_place = defaultdict(list)
    for p in photos:
        by_place[p["place"]].append(p)
    for group in by_place.values():
        group.sort(key=lambda p: p["taken"])
        burst = [group[0]]
        for p in group[1:]:
            if (p["taken"] - burst[-1]["taken"]).total_seconds() <= BURST_SECONDS:
                burst.append(p)
            else:
                kept.append(max(burst, key=lambda q: q["score"]))
                burst = [p]
        kept.append(max(burst, key=lambda q: q["score"]))
    return kept


# ---------------------------------------------------------------------------
# Contact sheets
# ---------------------------------------------------------------------------

def thumbnail(src: Path, cache: Path) -> Image.Image:
    out = cache / (src.stem + ".jpg")
    if not out.exists():
        subprocess.run(["sips", "-s", "format", "jpeg", "-Z", "600", str(src), "--out", str(out)],
                       check=True, capture_output=True)
    img = ImageOps.exif_transpose(Image.open(out)).convert("RGB")
    img.thumbnail((CELL_W - 6, THUMB_H - 6))
    return img


def sheet_font(size: int) -> ImageFont.ImageFont:
    """A system font with Turkish and Greek letters (Pillow's default lacks ç, ş, ı)."""
    for path in ("/System/Library/Fonts/Supplemental/Arial Unicode.ttf", "/System/Library/Fonts/Helvetica.ttc"):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default(size=size)


def contact_sheet(title: str, picks: list, cache: Path, out: Path) -> None:
    rows = math.ceil(len(picks) / COLS)
    sheet = Image.new("RGB", (COLS * CELL_W, HEADER_H + rows * (THUMB_H + CAPTION_H)), "white")
    draw = ImageDraw.Draw(sheet)
    font, small = sheet_font(18), sheet_font(13)
    draw.text((10, 10), title[:120], fill="black", font=font)
    for i, p in enumerate(picks):
        x, y = (i % COLS) * CELL_W, HEADER_H + (i // COLS) * (THUMB_H + CAPTION_H)
        img = thumbnail(p["path"], cache)
        sheet.paste(img, (x + (CELL_W - img.width) // 2, y + (THUMB_H - img.height) // 2))
        label = p.get("label") or p["place"]
        draw.text((x + 6, y + THUMB_H + 4), f"{i + 1}. {label[:38]}", fill="black", font=small)
        draw.rectangle([x + 4, y + 4, x + 32, y + 26], fill="black")
        draw.text((x + 8, y + 6), str(i + 1), fill="white", font=font)
    sheet.save(out, quality=82)


# ---------------------------------------------------------------------------

def main() -> None:
    ap = argparse.ArgumentParser(description="Pick candidate photos per chapter.")
    ap.add_argument("album_dir", type=Path)
    ap.add_argument("--labels", type=Path, default=DATA / "photo-labels.jsonl")
    ap.add_argument("--places", type=Path, default=DATA / "chapter-places.json")
    ap.add_argument("--per-chapter", type=int, default=20)
    ap.add_argument("--max-face-area", type=float, default=0.01,
                    help="drop photos whose largest face covers more than this share of the frame")
    ap.add_argument("--tz", default="Europe/Athens")
    ap.add_argument("--no-sheets", action="store_true")
    args = ap.parse_args()

    places = json.loads(args.places.read_text())["places"]
    photos, skipped = build_photos(args.album_dir, load_labels(args.labels), places,
                                   ZoneInfo(args.tz), args.max_face_area)
    before = len(photos)
    photos = collapse_bursts(photos)

    pools = defaultdict(list)
    for p in photos:
        for ch in p["chapters"]:
            pools[ch].append(p)

    titles = chapter_titles()
    titles["extras"] = "Extras: places no chapter covers yet"
    sheets = DATA / "contact-sheets"
    cache = sheets / "thumbs"
    if not args.no_sheets:
        cache.mkdir(parents=True, exist_ok=True)

    rows = []
    print(f"{'Chapter':<8}{'Pool':>6}{'Picked':>8}  Title")
    for ch in sorted(pools, key=lambda c: (c == "extras", c)):
        picks = sorted(pools[ch], key=lambda p: -p["score"])[: args.per_chapter]
        print(f"{ch:<8}{len(pools[ch]):>6}{len(picks):>8}  {titles.get(ch, '')[:70]}")
        for rank, p in enumerate(picks, 1):
            rows.append({
                "chapter": ch, "sheet_number": rank, "file": p["file"], "place": p["place"],
                "score": p["score"], "aesthetic": p["aesthetic"], "views": p["views"],
                "edited": p["edited"], "described": p["described"],
                "orientation": "landscape" if p["landscape"] else "portrait",
                "taken_local": p["taken"].isoformat(timespec="minutes"),
                "labels": "; ".join(p["labels"]),
            })
        if not args.no_sheets:
            contact_sheet(f"Ch {ch}: {titles.get(ch, '')}", picks, cache, sheets / f"ch{ch}.jpg")

    with (DATA / "photo-candidates.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)

    print(f"\nEligible photos: {before:,} ({before - len(photos):,} burst duplicates collapsed to {len(photos):,})")
    for reason, n in sorted(skipped.items(), key=lambda kv: -kv[1]):
        print(f"  skipped {n:>4}  {reason}")
    print(f"Wrote {DATA / 'photo-candidates.csv'}" + ("" if args.no_sheets else f" and {len(pools)} sheets in {sheets}"))


if __name__ == "__main__":
    main()
