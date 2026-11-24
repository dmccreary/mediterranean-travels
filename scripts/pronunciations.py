#!/usr/bin/env python3
"""Pronounce buttons for hard-to-say terms, driven by data/pronunciations.csv.

The CSV is the registry of every term the book pronounces. This script keeps
three things in step with it:

  generate  make docs/audio/<slug>.mp3 for any term without one, using the
            book-media-generator ElevenLabs script (needs ELEVENLABS_API_KEY
            in the environment); stops at the first failure
  insert    put ONE pronounce button in the chapters for each term with audio,
            at its first running-text use in reading order, unless a chapter
            already has that term's button
  appendix  rebuild docs/appendices/pronunciation-guide.md, the running list
            of every term with its respelling and a button
  check     report each term's audio and chapter-button status, and fail if
            any term has a button in more than one chapter
  all       generate, insert, appendix, check

Usage (from the repo root):

    python3 scripts/pronunciations.py all
    python3 scripts/pronunciations.py insert --dry-run

Rules are in CONTENT-GENERATION-GUIDE.md, section "Pronounce Buttons".
"""

from __future__ import annotations

import argparse
import csv
import os
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CSV_PATH = REPO / "data" / "pronunciations.csv"
AUDIO = REPO / "docs" / "audio"
CHAPTERS = REPO / "docs" / "chapters"
APPENDIX = REPO / "docs" / "appendices" / "pronunciation-guide.md"

# Words that complete a name, so "Mehmed II" and "Galata Bridge" stay together.
NAME_TAIL = r"( (?:[IVX]+\b|Bridge|Palace|Park|Mosque|Greeks|Tower|Square|Decrees|Walls))+"


def load_terms() -> list[dict]:
    return list(csv.DictReader(CSV_PATH.open(encoding="utf-8")))


def chapter_files() -> list[Path]:
    return sorted(CHAPTERS.glob("[0-9][0-9]-*/index.md"))


def button_html(slug: str, respelling: str, rel_audio: str) -> str:
    return (f'<audio id="audio-{slug}" src="{rel_audio}{slug}.mp3" preload="none"></audio>'
            f'<button onclick="document.getElementById(\'audio-{slug}\').play()" '
            f'class="pronounce-btn">🔊 Pronounce</button>')


def chapters_with_button(slug: str) -> list[Path]:
    return [p for p in chapter_files() if f'id="audio-{slug}"' in p.read_text(encoding="utf-8")]


# ---------------------------------------------------------------------------
# Finding the first running-text use
# ---------------------------------------------------------------------------

def running_text_lines(lines: list[str]):
    """Indexes of running-text lines: after Prerequisites; not in tables, headings,
    figures, details blocks, code fences, admonition titles, or image lines."""
    prereq = next((i for i, l in enumerate(lines) if l.startswith("## Prerequisites")), -1)
    start = next((i for i, l in enumerate(lines) if i > prereq and l.startswith("## ")), 0)
    in_details = in_fence = in_figure = False
    for i in range(start, len(lines)):
        line, s = lines[i], lines[i].strip()
        if s.startswith("```"):
            in_fence = not in_fence
            continue
        if s.startswith("<details"):
            in_details = True
        if s.startswith("</details"):
            in_details = False
            continue
        if s.startswith("<figure"):
            in_figure = True
        if s.startswith("</figure"):
            in_figure = False
            continue
        if in_fence or in_details or in_figure:
            continue
        if not s or s.startswith(("#", "|", "!!!", "<", "![")):
            continue
        yield i


def insertion_point(line: str, term: str) -> int | None:
    for m in re.finditer(r"(?<![\w])" + re.escape(term) + r"(s)?(?![\w])", line):
        before = line[: m.start()]
        if before.count("[") > before.count("]") or before.count("`") % 2:
            continue  # inside link text or inline code
        bold_open = before.count("**") % 2 == 1
        if bold_open and before[before.rfind("**"):].startswith("**Worked example"):
            continue  # inside a bold "Worked example:" lead-in
        pos = m.end()
        tail = re.match(NAME_TAIL, line[pos:])
        if tail:
            pos += tail.end()
        if line[pos: pos + 2] in ("'s", "’s"):
            pos += 2
        if bold_open:
            close = line.find("**", pos)
            if close < 0:
                continue
            pos = close + 2
        elif re.sub(r"\*\*", "", before).count("*") % 2 == 1:
            close = line.find("*", pos)
            if close < 0:
                continue
            pos = close + 1
        return pos
    return None


def first_use(term: str):
    for md in chapter_files():
        lines = md.read_text(encoding="utf-8").split("\n")
        for i in running_text_lines(lines):
            pos = insertion_point(lines[i], term)
            if pos is not None:
                return md, i, pos
    return None


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def cmd_generate(terms, dry_run=False) -> bool:
    script = Path(os.environ.get("BK_HOME", "")) / "skills/book-media-generator/scripts/audio/generate-pronunciation.py"
    missing = [t for t in terms if not (AUDIO / f"{t['slug']}.mp3").exists()]
    if not missing:
        print("generate: every term already has audio")
        return True
    if not script.exists():
        print(f"generate: cannot find {script}; set BK_HOME")
        return False
    AUDIO.mkdir(parents=True, exist_ok=True)
    for t in missing:
        out = AUDIO / f"{t['slug']}.mp3"
        if dry_run:
            print(f"generate: would create {out.relative_to(REPO)}")
            continue
        r = subprocess.run([sys.executable, str(script), t["term"], "--output", str(out)],
                           capture_output=True, text=True)
        if r.returncode != 0 or not out.exists():
            print(f"generate: FAILED on {t['term']!r}, stopping. {r.stderr.strip()[-300:]}")
            return False
        print(f"generate: {out.relative_to(REPO)}")
    return True


def cmd_insert(terms, dry_run=False) -> None:
    edits: dict[Path, list] = {}
    for t in terms:
        slug = t["slug"]
        if chapters_with_button(slug):
            continue
        if not (AUDIO / f"{slug}.mp3").exists():
            print(f"insert: skip {t['term']!r} (no audio yet)")
            continue
        hit = first_use(t["term"])
        if hit is None:
            print(f"insert: {t['term']!r} not found in running text yet")
            continue
        md, i, pos = hit
        line = md.read_text(encoding="utf-8").split("\n")[i]
        print(f"insert: {t['term']:<14} {md.parent.name}:{i + 1}  …{line[max(0, pos - 40):pos]}⟦🔊⟧")
        edits.setdefault(md, []).append((i, pos, t))
    if dry_run:
        return
    for md, items in edits.items():
        lines = md.read_text(encoding="utf-8").split("\n")
        for i, pos, t in sorted(items, key=lambda x: (x[0], x[1]), reverse=True):
            html = " " + button_html(t["slug"], t["respelling"], "../../audio/") + f" *{t['respelling']}*"
            lines[i] = lines[i][:pos] + html + lines[i][pos:]
        md.write_text("\n".join(lines), encoding="utf-8")


def chapter_link(md: Path) -> str:
    return f"[Chapter {int(md.parent.name[:2])}](../chapters/{md.parent.name}/index.md)"


def cmd_appendix(terms) -> None:
    rows = []
    for t in sorted(terms, key=lambda t: t["slug"]):
        has_audio = (AUDIO / f"{t['slug']}.mp3").exists()
        listen = button_html(t["slug"], t["respelling"], "../../audio/") if has_audio else "—"
        where = chapters_with_button(t["slug"])
        if not where:  # no button yet: show where the term first appears
            hit = first_use(t["term"])
            where = [hit[0]] if hit else []
        first = chapter_link(where[0]) if where else "—"
        style = "Local" if t["style"] == "local" else "English"
        rows.append(f"| **{t['term']}** | *{t['respelling']}* | {listen} | {style} | {first} |")
    page = "\n".join([
        "---",
        "title: Pronunciation Guide",
        "description: How to say the hard names and words of the Istanbul-to-Athens trip, with a button to hear each one.",
        "---",
        "# Pronunciation Guide",
        "",
        "Every hard-to-say name and word in this book, in one place. Each term also",
        "has a pronounce button where it is first used in the chapters. The",
        "respelling shows the stressed syllable in capitals.",
        "",
        "**English** means the usual English pronunciation of a name that has one,",
        "such as Ephesus. **Local** means the Turkish or modern Greek pronunciation,",
        "such as Kuşadası.",
        "",
        "| Term | Say it | Listen | Pronunciation | First used in |",
        "|---|---|---|---|---|",
        *rows,
        "",
        "<!-- Generated by scripts/pronunciations.py from data/pronunciations.csv. Do not edit by hand. -->",
        "",
    ])
    APPENDIX.write_text(page, encoding="utf-8")
    print(f"appendix: {APPENDIX.relative_to(REPO)} ({len(rows)} terms)")


def cmd_check(terms) -> bool:
    ok = True
    for t in terms:
        where = chapters_with_button(t["slug"])
        audio = (AUDIO / f"{t['slug']}.mp3").exists()
        if len(where) > 1:
            ok = False
            print(f"check: {t['term']!r} has buttons in {len(where)} chapters: {[p.parent.name for p in where]}")
        elif not audio or not where:
            print(f"check: {t['term']:<14} audio={'yes' if audio else 'NO'}  chapter={'—' if not where else where[0].parent.name}")
    known = {t["slug"] for t in terms}
    for md in chapter_files():
        for slug in re.findall(r'id="audio-([a-z0-9-]+)"', md.read_text(encoding="utf-8")):
            if slug not in known:
                ok = False
                print(f"check: {md.parent.name} has a button for {slug!r}, which is not in {CSV_PATH.name}")
    print("check: OK" if ok else "check: FAILED")
    return ok


def main() -> None:
    ap = argparse.ArgumentParser(description="Manage pronounce buttons from data/pronunciations.csv.")
    ap.add_argument("command", choices=["generate", "insert", "appendix", "check", "all"])
    ap.add_argument("--dry-run", action="store_true", help="show what would change without writing")
    args = ap.parse_args()
    terms = load_terms()
    slugs = [t["slug"] for t in terms]
    if len(slugs) != len(set(slugs)):
        sys.exit("error: duplicate slug in data/pronunciations.csv")

    if args.command == "generate":
        sys.exit(0 if cmd_generate(terms, args.dry_run) else 1)
    if args.command == "insert":
        cmd_insert(terms, args.dry_run)
    if args.command == "appendix":
        cmd_appendix(terms)
    if args.command == "check":
        sys.exit(0 if cmd_check(terms) else 1)
    if args.command == "all":
        cmd_generate(terms, args.dry_run)
        cmd_insert(terms, args.dry_run)
        if not args.dry_run:
            cmd_appendix(terms)
        sys.exit(0 if cmd_check(terms) else 1)


if __name__ == "__main__":
    main()
