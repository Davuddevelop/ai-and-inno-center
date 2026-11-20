#!/usr/bin/env python3
"""Build every deck in src/decks/ into one self-contained HTML file.

    python3 docs/curriculum/src/build.py            # all weeks
    python3 docs/curriculum/src/build.py --sample   # include the design test deck

Each output file carries its own CSS and JS, so a single deck still works when it
is sent on its own. Only the fonts and the logo are separate files, and decks fall
back to system fonts if those are missing.
"""
import importlib.util
import json
import pathlib
import re
import shutil
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
OUT = ROOT / "slides"
sys.path.insert(0, str(HERE))
from lib import Deck, esc, FORBIDDEN  # noqa: E402

FONTS = (HERE / "fonts.css").read_text()
CSS = (HERE / "engine.css").read_text()
JS = (HERE / "engine.js").read_text()

# Glyph coverage of the bundled font subsets (latin + latin-ext + the punctuation block).
def covered(ch):
    o = ord(ch)
    return (o <= 0x024F or 0x02BB <= o <= 0x02C6 or 0x1E00 <= o <= 0x1EFF or 0x2000 <= o <= 0x206F
            or o in (0x20AC, 0x2122, 0x2191, 0x2193, 0x2212, 0x2215, 0x2022, 0x2026))

HELP = [("Right / Space / Enter", "next step or slide"), ("Left / Backspace", "back"), ("G", "slide overview"),
        ("P", "presenter view (notes + timer)"), ("H", "handout / reading mode"), ("F", "fullscreen"),
        ("Home / End", "first / last slide"), ("?", "this help"), ("Esc", "close overlays")]


def page(deck):
    slides = "".join(s.render() for s in deck.slides)
    meta = json.dumps({"id": deck.id, "week": deck.week, "date": deck.date, "title": deck.title, "deadline": deck.deadline})
    help_rows = "".join(f"<tr><td>{esc(a)}</td><td>{esc(b)}</td></tr>" for a, b in HELP)
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Week {deck.week:02d} - {esc(deck.title)} | AI &amp; Innovation Center</title>
<style>{FONTS}
{CSS}</style></head>
<body>
<div class="deck"><div class="stage">
<div class="chrome top"><span><b>AI &amp; Innovation Center</b></span><span>Week {deck.week:02d} &nbsp;/&nbsp; {esc(deck.date_label)}</span><span id="c-pos"></span></div>
<div class="rule"></div>
{slides}
<div class="chrome bottom"><span id="c-sec"></span><span>{esc(deck.title)}</span></div>
<div class="progress"></div>
</div></div>
<div class="overlay" id="ov-grid"><div class="ov-h">Slides</div><div class="grid-ov"></div></div>
<div class="overlay" id="ov-help"><div class="help"><div class="ov-h">Keyboard</div><table>{help_rows}</table></div></div>
<script type="application/json" id="meta">{meta}</script>
<script>{JS}</script>
</body></html>"""


def slug(deck):
    return f"week-{deck.week:02d}-" + re.sub(r"[^a-z0-9]+", "-", deck.title.lower()).strip("-")


def check(deck):
    problems, warns = [], []
    total = sum(float(s.mins) for s in deck.slides)
    for i, s in enumerate(deck.slides, 1):
        text = re.sub(r"<[^>]+>", "", s.html + s.notes)
        if not s.notes:
            problems.append(f"slide {i} ({s.title[:40]}): no speaker notes")
        for ch in set(text):
            if ch in FORBIDDEN:
                problems.append(f"slide {i}: forbidden glyph U+{ord(ch):04X} ({FORBIDDEN[ch]})")
            elif not covered(ch):
                problems.append(f"slide {i}: glyph U+{ord(ch):04X} {ch!r} is not in the bundled fonts")
    if deck.live and not 75 <= total <= 95:
        warns.append(f"planned time is {total:.0f} min (target 80-90)")
    return problems, warns, total


def load(path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.DECK


def build_launcher(built):
    """slides/index.html: one page that opens every week. The list is inlined, because a file:// page cannot fetch a JSON file."""
    cards = []
    for deck, name, total in built:
        if name == "_sample":
            continue
        meta = "self-guided, for the team to read" if not deck.live else f"{len(deck.slides)} slides, about {int(round(total))} min"
        cards.append(
            f'<div class="card" data-date="{esc(deck.date)}"><div class="w"><span>Week {deck.week:02d}</span><b>{esc(deck.date_label)}</b></div>'
            f'<h3>{esc(deck.title)}</h3><div class="m">{esc(meta)}</div>'
            f'<div class="a"><a class="btn p" href="{name}.html">Open</a><a class="btn" href="{name}.html?handout">Handout</a></div></div>')
    src = (HERE / "launcher.html").read_text()
    (OUT / "index.html").write_text(src.replace("/*FONTS*/", FONTS).replace("<!--WEEKS-->", "\n".join(cards)))
    print("ok   index.html")


def build_board():
    """team-board.html sits one level above slides/, so its font URLs point into slides/fonts/."""
    src = (HERE / "board.html").read_text()
    fonts = FONTS.replace("url(fonts/", "url(slides/fonts/")
    (ROOT / "team-board.html").write_text(src.replace("/*FONTS*/", fonts))
    print("ok   team-board.html")


def main():
    OUT.mkdir(exist_ok=True)
    logo = HERE.parent.parent.parent / "public" / "logo-mark.png"
    if logo.exists():
        shutil.copy(logo, OUT / "logo-mark.png")
    files = sorted((HERE / "decks").glob("w*.py"))
    if "--sample" in sys.argv:
        files.append(HERE / "decks" / "_sample.py")
    failed = False
    built = []
    for f in files:
        deck = load(f)
        problems, warns, total = check(deck)
        name = "_sample" if f.stem == "_sample" else slug(deck)
        (OUT / f"{name}.html").write_text(page(deck))
        built.append((deck, name, total))
        flag = "FAIL" if problems else "ok  "
        print(f"{flag} {name:48s} {len(deck.slides):3d} slides  {total:4.0f} min")
        for p in problems:
            print("       problem:", p); failed = True
        for w in warns:
            print("       note:   ", w)
    build_launcher(built)
    build_board()
    (OUT / "_manifest.json").write_text(json.dumps([{"week": d.week, "date": d.date, "label": d.date_label, "title": d.title, "file": n + ".html", "slides": len(d.slides)} for d, n, _ in built if n != "_sample"], indent=1))
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
