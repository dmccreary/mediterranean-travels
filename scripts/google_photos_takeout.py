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

Regenerate the metrics on docs/photos.md and write docs/data/photo-metrics.json:

    python3 scripts/google_photos_takeout.py takeout/*.zip \
        --album "Ann & Dan Eastern Mediterranean Cruise 2026"

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
import json
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
DEFAULT_PAGE = REPO_ROOT / "docs" / "photos.md"
DEFAULT_JSON = REPO_ROOT / "docs" / "data" / "photo-metrics.json"
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
    has_location: bool


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


def has_coordinates(meta: dict) -> bool:
    for key in ("geoData", "geoDataExif"):
        geo = meta.get(key)
        if isinstance(geo, dict) and (geo.get("latitude") or geo.get("longitude")):
            return True
    return False


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
            has_location=has_coordinates(meta),
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
# Metrics
# ---------------------------------------------------------------------------

def compute_metrics(album: Album, tz: ZoneInfo) -> dict:
    items = sorted(album.items, key=lambda it: it.taken_utc)
    if not items:
        sys.exit(f'error: album "{album.title}" has no photo or video sidecars')

    local_days = [it.taken_utc.astimezone(tz).date() for it in items]
    per_day = Counter(local_days)
    videos_per_day = Counter(d for d, it in zip(local_days, items) if it.is_video)
    first_day, last_day = local_days[0], local_days[-1]
    span_days = (last_day - first_day).days + 1
    videos = sum(it.is_video for it in items)

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


def render_block(m: dict) -> str:
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
        f"| First item | {fmt_datetime(m['first_item'])} |",
        f"| Last item | {fmt_datetime(m['last_item'])} |",
        f"| Days covered | {m['days_covered']} |",
        f"| Average items per day | about {fmt_average(m['average_items_per_day'])} |",
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
                        help="markdown page to update (default: docs/photos.md)")
    parser.add_argument("--json", type=Path, default=DEFAULT_JSON,
                        help="metrics JSON to write (default: docs/data/photo-metrics.json)")
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

    metrics = compute_metrics(pick_album(albums, args.album), ZoneInfo(args.tz))
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
