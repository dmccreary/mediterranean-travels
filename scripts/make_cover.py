#!/usr/bin/env python3
"""Build docs/img/cover.png: a scrapbook montage of trip photos with the book
title in the center and Glaux the owl (welcome pose) in the lower-left corner.

Run from the repo root:

    python3 scripts/make_cover.py

The photos are the web JPEGs already published in docs/chapters/*/img/, so the
cover only shows pictures that also appear in the book. Edit PHOTOS to swap a
picture; each entry is (path under docs/chapters, center x, center y, tilt).
"""
from pathlib import Path
import random
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CH = ROOT / "docs" / "chapters"
OUT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / "docs" / "img" / "cover.png"

W, H = 1910, 1000            # 1.91:1, the social-preview ratio
TITLE = "Mediterranean Travels"
SUBTITLE = "Istanbul  •  Troy  •  Ephesus  •  Rhodes  •  Crete  •  Athens  •  Delphi"

# Route order, roughly clockwise from the top-left (Istanbul) to the
# bottom-left (Athens and Delphi), so the montage reads like the trip.
# The center (title) and lower-left corner (owl) stay clear.
PHOTOS = [
    # --- background layer: wide fillers so no blue shows through gaps ---
    ("03-istanbul-two-continents/img/ortakoy-mosque-european-shore-bosphorus.jpg", 560, 120, 3),
    ("06-bazaars-scripts-presses/img/vaulted-main-hall-spice-bazaar.jpg", 1300, 110, -3),
    ("10-ephesus-greco-roman-city/img/corinthian-columns-along-colonnaded-street.jpg", 1830, 430, 4),
    ("14-venetian-heraklion/img/sunrise-over-port-heraklion.jpg", 1500, 900, -2),
    ("18-delphi/img/theater-delphi-above-temple-apollo.jpg", 880, 920, 3),
    ("01-long-timeline/img/temple-poseidon-cape-sounion-about.jpg", 120, 330, -4),
    # --- gap fillers tucked behind the corners of the title panel ---
    ("05-ottoman-istanbul/img/iznik-tiled-galleries-blue-mosque.jpg", 650, 320, -4),
    ("10-ephesus-greco-roman-city/img/fountain-trajan-curetes-street-early.jpg", 1300, 320, 4),
    ("18-delphi/img/sanctuary-terraces-under-cliffs.jpg", 660, 690, 4),
    ("14-venetian-heraklion/img/venetian-loggia-heraklion-17th-century.jpg", 1320, 690, -4),
    # --- top row: Istanbul ---
    ("05-ottoman-istanbul/img/prayer-hall-domes-sultan-ahmed.jpg", 175, 130, -7),
    ("04-byzantine-constantinople/img/lit-columns-basilica-cistern.jpg", 470, 150, 5),
    ("06-bazaars-scripts-presses/img/towers-ground-spices-spice-bazaar.jpg", 770, 115, -4),
    ("06-bazaars-scripts-presses/img/bazaar-cat-among-evil-eye.jpg", 1060, 150, 6),
    ("06-bazaars-scripts-presses/img/rolls-pistachio-turkish-delight.jpg", 1350, 125, -5),
    ("04-byzantine-constantinople/img/mosaic-virgin-child-emperor-john.jpg", 1650, 140, 4),
    # --- right side: Troy, Ephesus, Rhodes ---
    ("08-troy-and-gallipoli/img/wooden-horse-replica-archaeological-site.jpg", 1760, 360, -6),
    ("10-ephesus-greco-roman-city/img/arch-temple-hadrian-curetes-street.jpg", 1560, 520, 5),
    ("12-rhodes/img/windmills-mole-mandraki-harbor.jpg", 1790, 630, -3),
    # --- bottom row: Crete, Athens, Delphi ---
    ("12-rhodes/img/dolphin-sculpture-harbor-old-town.jpg", 1730, 860, 6),
    ("13-knossos-minoans-linear-b/img/bull-s-head-rhyton-knossos.jpg", 1430, 850, -5),
    ("15-athens-acropolis/img/erechtheion-porch-caryatids.jpg", 1140, 870, 4),
    ("15-athens-acropolis/img/parthenon-late-afternoon-light.jpg", 840, 845, -6),
    ("20-athens-museums-city-today/img/jockey-artemision-bronze-about-140.jpg", 545, 875, 5),
    # --- left side, above the owl ---
    ("03-istanbul-two-continents/img/turkish-lunch-meze.jpg", 300, 390, 6),
    ("02-traveling-well/img/kusadasi-first-light-ship-pier.jpg", 150, 520, -5),
]

PHOTO_W, PHOTO_H = 300, 220   # picture area inside the white print border
BORDER, BOTTOM = 10, 26       # instant-print look: wider bottom margin


def font(names, size, want=None):
    for name in names:
        for d in ("/System/Library/Fonts", "/System/Library/Fonts/Supplemental",
                  "/Library/Fonts"):
            p = Path(d) / name
            if not p.exists():
                continue
            if p.suffix == ".ttc" and want:
                for i in range(12):
                    try:
                        f = ImageFont.truetype(str(p), size, index=i)
                    except OSError:
                        break
                    if f.getname()[1].lower() == want.lower():
                        return f
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default(size)


def cover_crop(im, w, h):
    """Scale and center-crop to fill w x h exactly."""
    s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def print_card(path, scale=1.0):
    pw, ph = round(PHOTO_W * scale), round(PHOTO_H * scale)
    b, bb = round(BORDER * scale), round(BOTTOM * scale)
    card = Image.new("RGBA", (pw + 2 * b, ph + b + bb), (252, 249, 240, 255))
    card.paste(cover_crop(Image.open(path).convert("RGB"), pw, ph), (b, b))
    return card


def paste_with_shadow(canvas, card, cx, cy, angle):
    rot = card.rotate(angle, resample=Image.BICUBIC, expand=True)
    alpha = rot.getchannel("A")
    shadow = Image.new("RGBA", rot.size, (0, 0, 0, 0))
    shadow.putalpha(alpha.point(lambda a: a * 0.55))
    pad = 30
    sh = Image.new("RGBA", (rot.width + 2 * pad, rot.height + 2 * pad), (0, 0, 0, 0))
    sh.paste(shadow, (pad, pad))
    sh = sh.filter(ImageFilter.GaussianBlur(9))
    x, y = cx - rot.width // 2, cy - rot.height // 2
    canvas.alpha_composite(sh, (x - pad + 6, y - pad + 9))
    canvas.alpha_composite(rot, (x, y))


def background():
    """Aegean blue gradient: deep at the bottom, lighter at the top."""
    top, bot = (38, 120, 176), (10, 44, 92)
    bg = Image.new("RGBA", (W, H))
    d = ImageDraw.Draw(bg)
    for y in range(H):
        t = y / (H - 1)
        d.line([(0, y), (W, y)],
               fill=tuple(round(a + (b - a) * t) for a, b in zip(top, bot)) + (255,))
    return bg


def greek_key_band(w, h, color):
    """A repeating meander strip, used to frame the title panel."""
    band = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(band)
    u = h / 5                                  # grid unit
    lw = max(2, round(u * 0.9))
    step = 5 * u
    x = 0.0
    while x < w:
        pts = [(x, 4.5 * u), (x, 0.5 * u), (x + 4 * u, 0.5 * u), (x + 4 * u, 3 * u),
               (x + 2 * u, 3 * u), (x + 2 * u, 2 * u)]
        d.line([(round(a), round(b)) for a, b in pts], fill=color, width=lw, joint="curve")
        d.line([(round(x), round(4.5 * u)), (round(x + step), round(4.5 * u))],
               fill=color, width=lw)
        x += step
    return band


def title_panel():
    pw, ph = 960, 300
    panel = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    d = ImageDraw.Draw(panel)
    d.rounded_rectangle([0, 0, pw - 1, ph - 1], radius=28, fill=(8, 34, 72, 228),
                        outline=(240, 200, 90, 255), width=5)
    gold = (240, 200, 90, 255)
    key = greek_key_band(pw - 120, 30, gold)
    panel.alpha_composite(key, (60, 26))
    panel.alpha_composite(key.transpose(Image.FLIP_TOP_BOTTOM), (60, ph - 56))

    tf = font(["Optima.ttc"], 92, want="Bold")
    sf = font(["Optima.ttc"], 27, want="Regular")
    tb = d.textbbox((0, 0), TITLE, font=tf)
    tx, ty = (pw - (tb[2] - tb[0])) // 2 - tb[0], 92 - tb[1]
    d.text((tx + 3, ty + 4), TITLE, font=tf, fill=(0, 0, 0, 160))
    d.text((tx, ty), TITLE, font=tf, fill=(255, 255, 255, 255))
    sb = d.textbbox((0, 0), SUBTITLE, font=sf)
    d.text(((pw - (sb[2] - sb[0])) // 2 - sb[0], 200 - sb[1]), SUBTITLE,
           font=sf, fill=(240, 220, 160, 255))
    return panel


def owl():
    im = Image.open(ROOT / "docs/img/mascot/welcome.png").convert("RGBA")
    im = im.crop(im.getbbox())
    h = 470
    im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
    # soft white halo so the owl separates from the photos behind it
    pad = 24
    halo = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
    a = Image.new("L", halo.size, 0)
    a.paste(im.getchannel("A"), (pad, pad))
    a = a.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(8))
    halo.paste((255, 255, 255, 255), mask=a.point(lambda v: v * 0.85))
    halo.alpha_composite(im, (pad, pad))
    return halo


def main():
    random.seed(7)
    canvas = background()
    for i, (rel, cx, cy, ang) in enumerate(PHOTOS):
        scale = 1.12 if i < 10 else 1.0         # fillers a bit larger
        paste_with_shadow(canvas, print_card(CH / rel, scale), cx, cy, ang)

    panel = title_panel()
    # panel shadow
    sh = Image.new("RGBA", (panel.width + 80, panel.height + 80), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([40, 40, 40 + panel.width, 40 + panel.height],
                                         radius=28, fill=(0, 0, 0, 170))
    sh = sh.filter(ImageFilter.GaussianBlur(18))
    px, py = (W - panel.width) // 2 + 40, (H - panel.height) // 2 - 10
    canvas.alpha_composite(sh, (px - 40 + 6, py - 40 + 12))
    canvas.alpha_composite(panel, (px, py))

    o = owl()
    canvas.alpha_composite(o, (-6, H - o.height + 14))

    canvas.convert("RGB").save(OUT, optimize=True)
    print(f"wrote {OUT} ({W}x{H}, {OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
