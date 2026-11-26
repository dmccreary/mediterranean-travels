#!/usr/bin/env python3
"""Google Photos connector for Mediterranean Travels (Google Takeout importer).

Why Takeout: since March 31, 2025 the Google Photos Library API only lets an
app read media that the app itself uploaded. Existing albums -- including the
shared cruise album -- can no longer be read by a script. A Google Takeout
export is the supported way to get the album's metadata out of Google Photos.

How to export
-------------
1. Go to https://takeout.google.com, click "Deselect all", then tick
   "Google Photos".
2. Click "All photo albums included" and select only the cruise album.
3. Export as .zip. Download every zip part into `takeout/` at the repo root
   (that folder is gitignored, so photos never land in git).

How to run
----------
List the albums the export contains:

    python3 scripts/google_photos_takeout.py takeout/*.zip --list

Regenerate the metrics on docs/appendices/photo-metrics.md and write docs/data/photo-metrics.json:

    python3 scripts/google_photos_takeout.py takeout/*.zip \
        --album "Ann & Dan Eastern Mediterranean Cruise 2026"

Book photos: the photos chosen for the chapters (data/photo-picks.csv) are
listed under the area and landmark where they were taken.

Location counts: every item with coordinates is matched to the nearest
landmark in data/chapter-places.json whose radius contains it (the same rule
scripts/select_chapter_photos.py uses to sort photos into chapters), and
landmarks are grouped by their "area" (city or port).

Inputs may be Takeout .zip files (read in place, never extracted) and/or
already-extracted Takeout folders. Only the JSON sidecar files are read; the
photos and videos themselves are never opened or copied.

The script rewrites only the text between these two markers in the page, so
the page's own prose is left alone:

    <!-- photo-metrics:start -->
    <!-- photo-metrics:end -->

Standard library only -- runs in the `mkdocs` conda env or any Python 3.9+.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import re
import sys
import zipfile
from collections import Counter
from dataclasses import dataclass
from datetime import date, datetime, timezone
from pathlib import Path, PurePosixPath
from typing import Callable, Iterator
from zoneinfo import ZoneInfo

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PAGE = REPO_ROOT / "docs" / "appendices" / "photo-metrics.md"
DEFAULT_JSON = REPO_ROOT / "docs" / "data" / "photo-metrics.json"
DEFAULT_PLACES = REPO_ROOT / "data" / "chapter-places.json"
DEFAULT_PICKS = REPO_ROOT / "data" / "photo-picks.csv"
CHAPTERS_DIR = REPO_ROOT / "docs" / "chapters"
ELSEWHERE = "Elsewhere (at sea or on the road)"
NO_LOCATION = "No location recorded"
START_MARKER = "<!-- photo-metrics:start -->"
END_MARKER = "<!-- photo-metrics:end -->"

VIDEO_EXTENSIONS = {
    ".mp4", ".mov", ".m4v", ".avi", ".3gp", ".mkv", ".webm", ".mts", ".m2ts", ".wmv",
}


@dataclass
class Item:
    title: str
    taken_utc: datetime
    is_video: bool
    coords: tuple[float, float] | None

    @property
    def has_location(self) -> bool:
        return self.coords is not None


@dataclass
class Album:
    folder: str
    title: str
    items: list[Item]


# ---------------------------------------------------------------------------
# Reading the export
# ---------------------------------------------------------------------------

def iter_json_entries(sources: list[Path]) -> Iterator[tuple[PurePosixPath, Callable[[], bytes]]]:
    """Yield (path-inside-export, loader) for every .json file in the sources."""
    for source in sources:
        if source.is_dir():
            for path in sorted(source.rglob("*.json")):
                rel = PurePosixPath(path.relative_to(source).as_posix())
                yield rel, path.read_bytes
        elif zipfile.is_zipfile(source):
            zf = zipfile.ZipFile(source)
            for name in zf.namelist():
                if name.lower().endswith(".json"):
                    yield PurePosixPath(name), (lambda n=name, z=zf: z.read(n))
        else:
            sys.exit(f"error: {source} is neither a folder nor a zip file")


def album_folder_of(path: PurePosixPath) -> str | None:
    """Return the album folder name for a path under '.../Google Photos/<album>/...'."""
    parts = path.parts
    for i, part in enumerate(parts[:-2]):
        if part == "Google Photos":
            return parts[i + 1]
    return None


def parse_epoch(block: object) -> datetime | None:
    if isinstance(block, dict) and str(block.get("timestamp", "")).lstrip("-").isdigit():
        return datetime.fromtimestamp(int(block["timestamp"]), tz=timezone.utc)
    return None


def coordinates(meta: dict) -> tuple[float, float] | None:
    """Return (lat, lon), or None when Takeout recorded no location (0, 0)."""
    for key in ("geoData", "geoDataExif"):
        geo = meta.get(key)
        if isinstance(geo, dict) and (geo.get("latitude") or geo.get("longitude")):
            return float(geo.get("latitude") or 0.0), float(geo.get("longitude") or 0.0)
    return None


def load_albums(sources: list[Path]) -> dict[str, Album]:
    albums: dict[str, Album] = {}
    seen: set[tuple[str, str, int]] = set()  # de-dupes items repeated across zip parts

    for path, load in iter_json_entries(sources):
        folder = album_folder_of(path)
        if folder is None:
            continue
        try:
            meta = json.loads(load())
        except (ValueError, UnicodeDecodeError):
            continue
        if not isinstance(meta, dict):
            continue

        album = albums.setdefault(folder, Album(folder=folder, title=folder, items=[]))

        # Album-level metadata.json carries the album's real title.
        if path.name.startswith("metadata") and "photoTakenTime" not in meta:
            if isinstance(meta.get("title"), str) and meta["title"].strip():
                album.title = meta["title"].strip()
            continue

        taken = parse_epoch(meta.get("photoTakenTime")) or parse_epoch(meta.get("creationTime"))
        if taken is None:
            continue  # not a media sidecar (e.g. print-subscriptions.json)

        title = str(meta.get("title") or path.stem)
        key = (folder, title, int(taken.timestamp()))
        if key in seen:
            continue
        seen.add(key)

        album.items.append(Item(
            title=title,
            taken_utc=taken,
            is_video=Path(title).suffix.lower() in VIDEO_EXTENSIONS,
            coords=coordinates(meta),
        ))
    return albums


def pick_album(albums: dict[str, Album], wanted: str) -> Album:
    norm = wanted.strip().casefold()
    for album in albums.values():
        if norm in (album.title.casefold(), album.folder.casefold()):
            return album
    names = "\n  ".join(sorted(a.title for a in albums.values())) or "(none found)"
    sys.exit(f'error: no album named "{wanted}". Albums in this export:\n  {names}')


# ---------------------------------------------------------------------------
# Places
# ---------------------------------------------------------------------------

def load_places(path: Path) -> list[dict]:
    if not path.exists():
        sys.exit(f"error: places file {path} not found")
    return json.loads(path.read_text(encoding="utf-8"))["places"]


def haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6_371_000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lon2 - lon1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def nearest_place(coords: tuple[float, float], places: list[dict]) -> dict | None:
    """The nearest landmark whose radius contains the point, or None."""
    best, best_d = None, float("inf")
    for place in places:
        d = haversine_m(coords[0], coords[1], place["lat"], place["lon"])
        if d <= place["radius_m"] and d < best_d:
            best, best_d = place, d
    return best


def load_picks(path: Path) -> list[dict]:
    """The photos chosen for the chapters (data/photo-picks.csv), in chapter order."""
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    rows.sort(key=lambda r: (r["chapter"], int(r["order"] or 0)))
    return [{"chapter": r["chapter"], "place": r["place"], "caption": r["draft_caption"].strip(),
             "web_path": r["web_path"].removeprefix("docs/")} for r in rows]


def chapter_dirs() -> dict[str, str]:
    """Map a two-digit chapter number to its folder name under docs/chapters."""
    if not CHAPTERS_DIR.is_dir():
        return {}
    return {d.name[:2]: d.name for d in CHAPTERS_DIR.iterdir()
            if d.is_dir() and d.name[:2].isdigit()}


# ---------------------------------------------------------------------------
# Metrics
# ---------------------------------------------------------------------------

def location_metrics(items: list[Item], places: list[dict], tz: ZoneInfo) -> tuple[list, list]:
    """Count items per landmark and per area, in trip order."""
    groups: dict[str, dict] = {}
    for it in items:  # items are already in time order
        if it.coords is None:
            name, area, chapters = NO_LOCATION, NO_LOCATION, []
        else:
            place = nearest_place(it.coords, places)
            if place is None:
                name, area, chapters = ELSEWHERE, ELSEWHERE, []
            else:
                name, area, chapters = place["name"], place.get("area", place["name"]), place["chapters"]
        g = groups.setdefault(name, {"place": name, "area": area, "chapters": chapters,
                                     "items": 0, "videos": 0, "days": set(), "first": it.taken_utc})
        g["items"] += 1
        g["videos"] += it.is_video
        g["days"].add(it.taken_utc.astimezone(tz).date())

    leftovers = (ELSEWHERE, NO_LOCATION)
    area_order: dict[str, datetime] = {}
    for g in groups.values():
        if g["area"] not in leftovers:
            area_order[g["area"]] = min(area_order.get(g["area"], g["first"]), g["first"])
    rank = {a: i for i, a in enumerate(sorted(area_order, key=area_order.get))}
    rank.update({ELSEWHERE: len(rank), NO_LOCATION: len(rank) + 1})

    per_place = sorted(groups.values(), key=lambda g: (rank[g["area"]], -g["items"], g["place"]))
    per_area: dict[str, dict] = {}
    for g in per_place:
        a = per_area.setdefault(g["area"], {"area": g["area"], "items": 0, "videos": 0,
                                            "places": 0, "days": set()})
        a["items"] += g["items"]
        a["videos"] += g["videos"]
        a["places"] += g["area"] not in leftovers
        a["days"] |= g["days"]

    def days_out(days: set) -> list[str]:
        return [d.isoformat() for d in sorted(days)]

    return (
        [{**{k: v for k, v in a.items() if k != "days"}, "days": days_out(a["days"])}
         for a in per_area.values()],
        [{k: v for k, v in g.items() if k not in ("days", "first")} | {"days": days_out(g["days"])}
         for g in per_place],
    )


def compute_metrics(album: Album, tz: ZoneInfo, places: list[dict]) -> dict:
    items = sorted(album.items, key=lambda it: it.taken_utc)
    if not items:
        sys.exit(f'error: album "{album.title}" has no photo or video sidecars')

    local_days = [it.taken_utc.astimezone(tz).date() for it in items]
    per_day = Counter(local_days)
    videos_per_day = Counter(d for d, it in zip(local_days, items) if it.is_video)
    first_day, last_day = local_days[0], local_days[-1]
    span_days = (last_day - first_day).days + 1
    videos = sum(it.is_video for it in items)
    per_area, per_place = location_metrics(items, places, tz)

    return {
        "album_title": album.title,
        "timezone": tz.key,
        "generated": date.today().isoformat(),
        "total_items": len(items),
        "photos": len(items) - videos,
        "videos": videos,
        "geotagged_items": sum(it.has_location for it in items),
        "first_item": items[0].taken_utc.astimezone(tz).isoformat(),
        "last_item": items[-1].taken_utc.astimezone(tz).isoformat(),
        "days_covered": span_days,
        "average_items_per_day": round(len(items) / span_days, 1),
        "per_day": [
            {"date": d.isoformat(), "items": per_day[d], "videos": videos_per_day[d]}
            for d in sorted(per_day)
        ],
        "per_area": per_area,
        "per_place": per_place,
    }


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

def fmt_datetime(iso: str) -> str:
    dt = datetime.fromisoformat(iso)
    hour = dt.strftime("%I").lstrip("0")
    return f"{dt:%A, %B} {dt.day}, {dt.year}, {hour}:{dt:%M %p}"


def fmt_day(iso: str) -> str:
    d = date.fromisoformat(iso)
    return f"{d:%a, %b} {d.day}"


def fmt_average(value: float) -> str:
    return f"{value:.1f}" if value < 10 else f"{round(value):,}"


def fmt_days(days: list[str]) -> str:
    """'Nov 20', 'Nov 13–15', or 'Nov 13, 15' for the days an area or place covers."""
    ds = [date.fromisoformat(d) for d in days]
    if len(ds) == 1:
        return f"{ds[0]:%b} {ds[0].day}"
    consecutive = all((b - a).days == 1 for a, b in zip(ds, ds[1:]))
    same_month = ds[0].month == ds[-1].month
    if consecutive and same_month:
        return f"{ds[0]:%b} {ds[0].day}–{ds[-1].day}"
    if len(ds) > 3:
        return f"{len(ds)} days, {ds[0]:%b} {ds[0].day} to {ds[-1]:%b} {ds[-1].day}"
    if same_month:
        return f"{ds[0]:%b} " + ", ".join(str(d.day) for d in ds)
    return ", ".join(f"{d:%b} {d.day}" for d in ds)


def fmt_chapters(chapters: list[str], dirs: dict[str, str]) -> str:
    links = []
    for ch in sorted(chapters):
        if ch in dirs:
            links.append(f"[{int(ch)}](../chapters/{dirs[ch]}/index.md)")
        else:
            links.append(str(int(ch)))
    return ", ".join(links) or "—"


def render_block(m: dict) -> str:
    dirs = chapter_dirs()
    leftovers = (ELSEWHERE, NO_LOCATION)
    picks = m.get("book_photos", [])
    picks_per_place = Counter(pk["place"] for pk in picks)
    updated = date.fromisoformat(m["generated"])
    lines = [
        START_MARKER,
        "",
        "| Metric | Value |",
        "|---|---|",
        f"| Album title | {m['album_title']} |",
        f"| Total items (photos and videos) | {m['total_items']:,} |",
        f"| Photos | {m['photos']:,} |",
        f"| Videos | {m['videos']:,} |",
        f"| Items with a location | {m['geotagged_items']:,} |",
        f"| Areas visited | {sum(a['area'] not in leftovers for a in m['per_area'])} |",
        f"| Landmarks with photos | {sum(p['place'] not in leftovers for p in m['per_place'])} |",
        f"| Photos used in the book | {len(picks):,} |",
        f"| First item | {fmt_datetime(m['first_item'])} |",
        f"| Last item | {fmt_datetime(m['last_item'])} |",
        f"| Days covered | {m['days_covered']} |",
        f"| Average items per day | about {fmt_average(m['average_items_per_day'])} |",
        "",
        "## Photos by Location",
        "",
        "Each item with a location is matched to the nearest landmark around it, and",
        "landmarks are grouped by city or port. Areas are listed in trip order.",
        "",
        "| Area | Items | Videos | Landmarks | In the book | Days |",
        "|---|---:|---:|---:|---:|---|",
    ]
    area_of = {p["place"]: p["area"] for p in m["per_place"]}
    picks_per_area = Counter(area_of.get(pk["place"], "") for pk in picks)
    lines += [f"| {a['area']} | {a['items']:,} | {a['videos']:,} | {a['places'] or '—'} | "
              f"{picks_per_area[a['area']] or '—'} | {fmt_days(a['days'])} |"
              for a in m["per_area"]]
    lines += [
        "",
        "## Photos by Landmark",
        "",
        "Within each area, landmarks are listed from most items to fewest. A",
        "\"general\" landmark collects items in that city that are not near a more",
        "specific one. \"In the book\" counts the photos chosen for the chapters, and",
        "the last column links to the chapters each landmark illustrates.",
        "",
        "| Landmark | Area | Items | Videos | In the book | Chapters |",
        "|---|---|---:|---:|---:|---|",
    ]
    lines += [f"| {p['place']} | {p['area']} | {p['items']:,} | {p['videos']:,} | "
              f"{picks_per_place[p['place']] or '—'} | {fmt_chapters(p['chapters'], dirs)} |"
              for p in m["per_place"] if p["place"] not in leftovers]

    if picks:
        lines += [
            "",
            "## Book Photos by Location",
            "",
            "Every trip photo used in the chapters, grouped by where it was taken.",
            "Click a caption to open the photo.",
        ]
        for area in (a["area"] for a in m["per_area"] if a["area"] not in leftovers):
            places_here = [p["place"] for p in m["per_place"] if p["area"] == area]
            rows = [pk for place in places_here for pk in picks if pk["place"] == place]
            if not rows:
                continue
            lines += ["", f"### {area} ({len(rows)})", "", "| Landmark | Photo | Chapter |", "|---|---|---|"]
            for pk in rows:
                caption = pk["caption"].rstrip(".")
                lines.append(f"| {pk['place']} | [{caption}](../{pk['web_path']}) | "
                             f"{fmt_chapters([pk['chapter']], dirs)} |")

    lines += [
        "",
        "## Items per Day",
        "",
        "| Day | Items | Videos |",
        "|---|---:|---:|",
    ]
    lines += [f"| {fmt_day(d['date'])} | {d['items']:,} | {d['videos']:,} |" for d in m["per_day"]]
    lines += [
        "",
        f"*Times are shown in the {m['timezone']} time zone. "
        f"Metrics last updated {updated:%B} {updated.day}, {updated.year}, "
        "from a Google Takeout export.*",
        "",
        END_MARKER,
    ]
    return "\n".join(lines)


def update_page(page: Path, block: str) -> None:
    text = page.read_text(encoding="utf-8")
    pattern = re.compile(re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER), re.DOTALL)
    if not pattern.search(text):
        sys.exit(f"error: {page} has no {START_MARKER} ... {END_MARKER} block to update")
    page.write_text(pattern.sub(lambda _m: block, text, count=1), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import Google Photos album metadata from a Google Takeout export.",
    )
    parser.add_argument("sources", nargs="+", type=Path,
                        help="Takeout .zip files and/or extracted Takeout folders")
    parser.add_argument("--list", action="store_true", help="list albums in the export and exit")
    parser.add_argument("--album", help="album title (or Takeout folder name) to import")
    parser.add_argument("--tz", default="Europe/Athens",
                        help="time zone for days and times (default: Europe/Athens)")
    parser.add_argument("--page", type=Path, default=DEFAULT_PAGE,
                        help="markdown page to update (default: docs/appendices/photo-metrics.md)")
    parser.add_argument("--json", type=Path, default=DEFAULT_JSON,
                        help="metrics JSON to write (default: docs/data/photo-metrics.json)")
    parser.add_argument("--places", type=Path, default=DEFAULT_PLACES,
                        help="landmark list (default: data/chapter-places.json)")
    parser.add_argument("--picks", type=Path, default=DEFAULT_PICKS,
                        help="chosen book photos (default: data/photo-picks.csv)")
    parser.add_argument("--dry-run", action="store_true",
                        help="print the generated block instead of writing files")
    args = parser.parse_args()

    albums = load_albums(args.sources)
    if args.list or not args.album:
        if not albums:
            sys.exit("No 'Google Photos/<album>/' folders found in the export.")
        print(f"{'Items':>6}  Album")
        for album in sorted(albums.values(), key=lambda a: a.title.casefold()):
            print(f"{len(album.items):>6}  {album.title}")
        if not args.list:
            print('\nRe-run with --album "<title>" to import one.')
        return

    metrics = compute_metrics(pick_album(albums, args.album), ZoneInfo(args.tz), load_places(args.places))
    metrics["book_photos"] = load_picks(args.picks)
    block = render_block(metrics)

    if args.dry_run:
        print(block)
        return

    update_page(args.page, block)
    args.json.parent.mkdir(parents=True, exist_ok=True)
    args.json.write_text(json.dumps(metrics, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {args.page} and {args.json}: "
          f"{metrics['total_items']:,} items over {metrics['days_covered']} days.")


if __name__ == "__main__":
    main()
