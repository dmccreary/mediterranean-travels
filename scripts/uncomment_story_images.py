#!/usr/bin/env python3
"""Uncomment graphic-novel image references once their PNGs exist.

Story pages in docs/stories/<story>/index.md are written with each panel's
image line commented out, for example:

    <!-- ![Alt text](./panel-04.png) -->

After the image is generated and saved next to index.md, this script turns
that line into a live image reference:

    ![Alt text](./panel-04.png)

Only single-line comments that wrap exactly one image reference are touched,
and only when the referenced .png file exists. Other HTML comments are left
alone and listed so you can review them.

Usage (from any directory):

    python3 scripts/uncomment_story_images.py          # report only
    python3 scripts/uncomment_story_images.py --apply  # rewrite index.md files
"""

import argparse
import re
from pathlib import Path

STORIES_DIR = Path(__file__).resolve().parent.parent / "docs" / "stories"

COMMENTED_IMAGE = re.compile(
    r"^(\s*)<!--\s*(!\[[^\]]*\]\(([^)\s]+)\))\s*-->\s*$"
)


def process(index_md: Path, apply: bool) -> tuple[int, list[str]]:
    """Return (count uncommented, list of still-missing image paths)."""
    story_dir = index_md.parent
    lines = index_md.read_text(encoding="utf-8").split("\n")
    changed = 0
    missing = []
    rel = index_md.relative_to(STORIES_DIR)

    for i, line in enumerate(lines):
        if "<!--" not in line:
            continue
        m = COMMENTED_IMAGE.match(line)
        if not m:
            print(f"  other comment left as-is: {rel}:{i + 1}: {line.strip()[:90]}")
            continue
        indent, image_ref, target = m.groups()
        if target.lower().endswith(".png") and (story_dir / target).is_file():
            lines[i] = indent + image_ref
            changed += 1
        else:
            missing.append(target)

    if apply and changed:
        index_md.write_text("\n".join(lines), encoding="utf-8")
    return changed, missing


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument(
        "--apply",
        action="store_true",
        help="rewrite the index.md files (default is a report-only dry run)",
    )
    args = parser.parse_args()

    total_changed = 0
    total_missing = 0
    for index_md in sorted(STORIES_DIR.glob("*/index.md")):
        changed, missing = process(index_md, args.apply)
        total_changed += changed
        total_missing += len(missing)
        if changed or missing:
            story = index_md.parent.name
            verb = "uncommented" if args.apply else "would uncomment"
            print(f"{story}: {verb} {changed}; still missing {len(missing)}"
                  + (f" ({', '.join(missing)})" if missing else ""))

    verb = "Uncommented" if args.apply else "Would uncomment"
    print(f"\n{verb} {total_changed} image(s); {total_missing} still waiting on a PNG.")
    if not args.apply and total_changed:
        print("Run again with --apply to rewrite the files.")


if __name__ == "__main__":
    main()
