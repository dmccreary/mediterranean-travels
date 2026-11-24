#!/usr/bin/env python3
"""Basic data profiling of a Google Photos Takeout album export.

Reads an extracted Takeout album folder (media files plus their JSON
sidecars) and writes three small, commit-safe result files:

    data/photo-profile.md        human-readable profile report
    data/photo-profile.json      the same numbers, machine-readable
    data/photo-inventory.csv     one row per media file

Privacy: the repo is public, so the outputs never contain people's names,
Google Photos URLs, or full-precision GPS. Coordinates are rounded to two
decimals (about 1 km), which is enough to place a port but not a house.

Usage (from the repo root):

    python3 scripts/profile_photos_takeout.py \
        "data/takeout/Takeout/Google Photos/Ann & Dan Eastern Mediterranean Cruise 2026"

Standard library only.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import statistics
from collections import Counter, defaultdict
from datetime import date, datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "data"
VIDEO_EXT = {".mov", ".mp4", ".m4v", ".avi", ".3gp", ".mkv", ".webm"}
COORD_DECIMALS = 2

# IMG_1.HEIC.supplemental-metadata(1).json, IMG_1.HEIC.supplemental-metad.json, IMG_1.HEIC.json
SIDECAR_RE = re.compile(r"^(?P<base>.+?)(?:\.supplemental-metadata|\.supplemental-metad\w*|\.suppl\w*)?(?P<dup>\(\d+\))?\.json$")


def epoch(block) -> datetime | None:
    if isinstance(block, dict) and str(block.get("timestamp", "")).isdigit():
        return datetime.fromtimestamp(int(block["timestamp"]), tz=timezone.utc)
    return None


def coords(meta: dict, key: str) -> tuple[float, float] | None:
    geo = meta.get(key)
    if isinstance(geo, dict):
        lat, lon = geo.get("latitude", 0.0), geo.get("longitude", 0.0)
        if lat or lon:
            return float(lat), float(lon)
    return None


def media_name_for(sidecar: Path, meta: dict, media_names: set[str]) -> str | None:
    """Find the media file a sidecar describes (handles Takeout's name truncation and (n) dups)."""
    m = SIDECAR_RE.match(sidecar.name)
    candidates = []
    if m:
        base, dup = m["base"], m["dup"] or ""
        if dup:
            stem, dot, ext = base.rpartition(".")
            candidates.append(f"{stem}{dup}.{ext}" if dot else base + dup)
        candidates.append(base)
    if isinstance(meta.get("title"), str):
        candidates.append(meta["title"])
    for c in candidates:
        if c in media_names:
            return c
    return None


def sha1(path: Path) -> str:
    h = hashlib.sha1()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def human(n: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:,.1f} {unit}" if unit != "B" else f"{int(n)} B"
        n /= 1024
    return str(n)


def profile(album_dir: Path, tz: ZoneInfo) -> tuple[dict, list[dict]]:
    files = [p for p in album_dir.iterdir() if p.is_file()]
    album_meta = {}
    if (album_dir / "metadata.json").exists():
        album_meta = json.loads((album_dir / "metadata.json").read_text())
    sidecars = [p for p in files if p.suffix.lower() == ".json" and p.name != "metadata.json"]
    media = [p for p in files if p.suffix.lower() != ".json"]
    media_names = {p.name for p in media}

    meta_by_media: dict[str, dict] = {}
    orphan_sidecars = []
    for sc in sidecars:
        meta = json.loads(sc.read_text(encoding="utf-8"))
        name = media_name_for(sc, meta, media_names)
        if name is None:
            orphan_sidecars.append(sc.name)
        else:
            meta_by_media[name] = meta

    rows = []
    hashes = defaultdict(list)
    for p in sorted(media, key=lambda p: p.name):
        meta = meta_by_media.get(p.name, {})
        taken = epoch(meta.get("photoTakenTime"))
        uploaded = epoch(meta.get("creationTime"))
        geo = coords(meta, "geoData")
        geo_exif = coords(meta, "geoDataExif")
        origin = meta.get("googlePhotosOrigin", {})
        device = (origin.get("mobileUpload", {}) or {}).get("deviceType") or (next(iter(origin), "") if origin else "")
        digest = sha1(p)
        hashes[digest].append(p.name)
        local = taken.astimezone(tz) if taken else None
        rows.append({
            "file": p.name,
            "type": "video" if p.suffix.lower() in VIDEO_EXT else "photo",
            "extension": p.suffix.lower().lstrip("."),
            "bytes": p.stat().st_size,
            "has_sidecar": bool(meta),
            "taken_local": local.isoformat() if local else "",
            "local_date": local.date().isoformat() if local else "",
            "upload_delay_min": round((uploaded - taken).total_seconds() / 60, 1) if taken and uploaded else "",
            "lat": round(geo[0], COORD_DECIMALS) if geo else "",
            "lon": round(geo[1], COORD_DECIMALS) if geo else "",
            "has_exif_geo": bool(geo_exif),
            "people_tagged": len(meta.get("people", []) or []),
            "has_description": bool((meta.get("description") or "").strip()),
            "views": int(meta.get("imageViews", 0) or 0),
            "device": device,
            "sha1": digest,
        })

    # ---- aggregates ----
    def stats(values):
        values = [v for v in values if v != ""]
        if not values:
            return {}
        return {"min": min(values), "median": statistics.median(values),
                "mean": round(statistics.mean(values), 1), "max": max(values)}

    dated = [r for r in rows if r["taken_local"]]
    dated.sort(key=lambda r: r["taken_local"])
    per_day = Counter(r["local_date"] for r in dated)
    per_hour = Counter(int(r["taken_local"][11:13]) for r in dated)
    by_ext = Counter(r["extension"] for r in rows)
    bytes_by_type = defaultdict(list)
    for r in rows:
        bytes_by_type[r["type"]].append(r["bytes"])
    day_geo = defaultdict(list)
    for r in dated:
        if r["lat"] != "":
            day_geo[r["local_date"]].append((r["lat"], r["lon"]))
    timestamps = Counter(r["taken_local"] for r in dated)
    dup_groups = [names for names in hashes.values() if len(names) > 1]
    tagged_people = Counter()
    for meta in meta_by_media.values():
        tagged_people[len(meta.get("people", []) or [])] += 1
    distinct_people = {pp.get("name") for meta in meta_by_media.values() for pp in (meta.get("people") or [])}

    first, last = (dated[0]["taken_local"], dated[-1]["taken_local"]) if dated else ("", "")
    span = (date.fromisoformat(last[:10]) - date.fromisoformat(first[:10])).days + 1 if dated else 0
    geotagged = [r for r in rows if r["lat"] != ""]
    lats = [r["lat"] for r in geotagged]
    lons = [r["lon"] for r in geotagged]

    summary = {
        "album_title": album_meta.get("title", album_dir.name),
        "profiled_on": date.today().isoformat(),
        "timezone": tz.key,
        "files": {
            "total_files": len(files),
            "media_files": len(media),
            "sidecar_files": len(sidecars),
            "album_metadata_file": bool(album_meta),
            "media_without_sidecar": sorted(set(media_names) - set(meta_by_media)),
            "sidecars_without_media": sorted(orphan_sidecars),
            "by_extension": dict(by_ext.most_common()),
            "photos": sum(r["type"] == "photo" for r in rows),
            "videos": sum(r["type"] == "video" for r in rows),
            "total_bytes": sum(r["bytes"] for r in rows),
            "bytes_by_type": {t: {"count": len(v), "total": sum(v), **stats(v)} for t, v in bytes_by_type.items()},
            "largest_files": [{"file": r["file"], "bytes": r["bytes"]} for r in sorted(rows, key=lambda r: -r["bytes"])[:5]],
            "exact_duplicate_groups": dup_groups,
        },
        "time": {
            "items_with_taken_time": len(dated),
            "first_item": first,
            "last_item": last,
            "days_covered": span,
            "average_items_per_day": round(len(dated) / span, 1) if span else 0,
            "per_day": dict(sorted(per_day.items())),
            "busiest_day": per_day.most_common(1)[0] if per_day else None,
            "quietest_day": min(per_day.items(), key=lambda kv: kv[1]) if per_day else None,
            "per_hour": {h: per_hour.get(h, 0) for h in range(24)},
            "items_sharing_a_timestamp": sum(c for c in timestamps.values() if c > 1),
            "upload_delay_minutes": stats([r["upload_delay_min"] for r in rows]),
        },
        "fields": {
            "geotagged": len(geotagged),
            "geotagged_pct": round(100 * len(geotagged) / len(rows), 1) if rows else 0,
            "exif_geotagged": sum(r["has_exif_geo"] for r in rows),
            "with_description": sum(r["has_description"] for r in rows),
            "people_tags_per_item": {str(k): v for k, v in sorted(tagged_people.items())},
            "distinct_people_tagged": len(distinct_people),
            "views": stats([r["views"] for r in rows]),
            "never_viewed": sum(r["views"] == 0 for r in rows),
            "device_types": dict(Counter(r["device"] or "(none)" for r in rows).most_common()),
        },
        "location": {
            "coordinate_precision": f"rounded to {COORD_DECIMALS} decimals (~1 km)",
            "bounding_box": {"lat_min": min(lats), "lat_max": max(lats), "lon_min": min(lons), "lon_max": max(lons)} if lats else None,
            "per_day_centroid": {
                d: {"lat": round(statistics.mean(p[0] for p in pts), COORD_DECIMALS),
                    "lon": round(statistics.mean(p[1] for p in pts), COORD_DECIMALS),
                    "geotagged_items": len(pts)}
                for d, pts in sorted(day_geo.items())
            },
        },
    }
    return summary, rows


def render_markdown(s: dict) -> str:
    f, t, fl, loc = s["files"], s["time"], s["fields"], s["location"]
    L = [
        f"# Photo Album Data Profile",
        "",
        f"Album: **{s['album_title']}**. Profiled {s['profiled_on']} from a Google Takeout export. "
        f"Times are in the {s['timezone']} time zone.",
        "",
        "## Files",
        "",
        "| Measure | Value |",
        "|---|---|",
        f"| Files in album folder | {f['total_files']:,} |",
        f"| Media files | {f['media_files']:,} ({f['photos']:,} photos, {f['videos']:,} videos) |",
        f"| JSON sidecars | {f['sidecar_files']:,} |",
        f"| Media without a sidecar | {len(f['media_without_sidecar'])} |",
        f"| Sidecars without media | {len(f['sidecars_without_media'])} |",
        f"| Total size | {human(f['total_bytes'])} |",
        f"| Exact duplicate files (by SHA-1) | {len(f['exact_duplicate_groups'])} groups |",
        "",
        "| Extension | Files |",
        "|---|---:|",
        *[f"| {ext} | {n:,} |" for ext, n in f["by_extension"].items()],
        "",
        "| Type | Count | Total | Median | Largest |",
        "|---|---:|---:|---:|---:|",
        *[f"| {typ} | {b['count']:,} | {human(b['total'])} | {human(b['median'])} | {human(b['max'])} |"
          for typ, b in f["bytes_by_type"].items()],
        "",
    ]
    if f["media_without_sidecar"]:
        L += ["Media without a sidecar: " + ", ".join(f"`{n}`" for n in f["media_without_sidecar"]), ""]
    if f["sidecars_without_media"]:
        L += ["Sidecars without media: " + ", ".join(f"`{n}`" for n in f["sidecars_without_media"]), ""]
    if f["exact_duplicate_groups"]:
        L += ["Duplicate groups: " + "; ".join(", ".join(f"`{n}`" for n in g) for g in f["exact_duplicate_groups"]), ""]

    L += [
        "## Time",
        "",
        "| Measure | Value |",
        "|---|---|",
        f"| Items with a taken time | {t['items_with_taken_time']:,} |",
        f"| First item | {t['first_item']} |",
        f"| Last item | {t['last_item']} |",
        f"| Days covered | {t['days_covered']} |",
        f"| Average items per day | {t['average_items_per_day']} |",
        f"| Busiest day | {t['busiest_day'][0]} ({t['busiest_day'][1]:,} items) |" if t["busiest_day"] else "",
        f"| Quietest day | {t['quietest_day'][0]} ({t['quietest_day'][1]:,} items) |" if t["quietest_day"] else "",
        f"| Items sharing a timestamp (bursts) | {t['items_sharing_a_timestamp']:,} |",
        f"| Upload delay, median minutes | {t['upload_delay_minutes'].get('median', '')} |",
        "",
        "| Day | Items | Geotagged | Centroid (lat, lon) |",
        "|---|---:|---:|---|",
    ]
    for d, n in t["per_day"].items():
        c = loc["per_day_centroid"].get(d)
        centroid = f"{c['lat']}, {c['lon']}" if c else "—"
        geo_n = c["geotagged_items"] if c else 0
        L.append(f"| {d} | {n:,} | {geo_n:,} | {centroid} |")
    L += [
        "",
        "| Hour | Items |",
        "|---|---:|",
        *[f"| {h:02d}:00 | {n:,} |" for h, n in t["per_hour"].items() if n],
        "",
        "## Field Coverage",
        "",
        "| Field | Value |",
        "|---|---|",
        f"| Geotagged items | {fl['geotagged']:,} ({fl['geotagged_pct']}%) |",
        f"| Items with EXIF location | {fl['exif_geotagged']:,} |",
        f"| Items with a description | {fl['with_description']:,} |",
        f"| Distinct people tagged | {fl['distinct_people_tagged']} |",
        f"| Items by number of people tagged | {', '.join(f'{k}: {v:,}' for k, v in fl['people_tags_per_item'].items())} |",
        f"| Views per item (min / median / max) | {fl['views'].get('min')} / {fl['views'].get('median')} / {fl['views'].get('max')} |",
        f"| Items never viewed | {fl['never_viewed']:,} |",
        f"| Device types | {', '.join(f'{k}: {v:,}' for k, v in fl['device_types'].items())} |",
        "",
    ]
    if loc["bounding_box"]:
        b = loc["bounding_box"]
        L += ["## Location", "",
              f"Coordinates are {loc['coordinate_precision']}. Bounding box: latitude {b['lat_min']} to {b['lat_max']}, "
              f"longitude {b['lon_min']} to {b['lon_max']}.", ""]
    L += ["People's names, Google Photos URLs, and full-precision GPS are deliberately left out of these files "
          "because the repository is public.", ""]
    return "\n".join(line for line in L if line is not None)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("album_dir", type=Path, help="extracted Takeout album folder")
    ap.add_argument("--tz", default="Europe/Athens")
    ap.add_argument("--out", type=Path, default=OUT_DIR)
    args = ap.parse_args()

    summary, rows = profile(args.album_dir, ZoneInfo(args.tz))
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "photo-profile.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    (args.out / "photo-profile.md").write_text(render_markdown(summary), encoding="utf-8")
    with (args.out / "photo-inventory.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)
    print(f"Profiled {len(rows):,} media files -> {args.out}/photo-profile.{{md,json}}, photo-inventory.csv")


if __name__ == "__main__":
    main()
