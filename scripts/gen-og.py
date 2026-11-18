"""Generate 1200x630 Open Graph cards under public/og/.

Deck cards reuse page 1 of the published PDF (so a share preview shows the
actual deck cover); everything else gets a typographic card in the site's
palette. Run once per content change:

    python scripts/gen-og.py
"""

import json
import os
import re

import fitz  # PyMuPDF
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
OG = os.path.join(PUBLIC, "og")
W, H = 1200, 630
INK = (41, 37, 29)
PAPER = (242, 241, 236)
ACCENT = (195, 164, 123)
MUTED = (168, 156, 133)

SANS = "C:/Windows/Fonts/msyh.ttc"
SANS_B = "C:/Windows/Fonts/msyhbd.ttc"
SERIF_I = "C:/Windows/Fonts/georgiai.ttf"
SERIF = "C:/Windows/Fonts/georgia.ttf"

os.makedirs(OG, exist_ok=True)


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.truetype(SANS, size)


def wrap(draw, text, fnt, max_w):
    lines, cur = [], ""
    for ch in text:
        if ch == "\n":
            lines.append(cur)
            cur = ""
            continue
        trial = cur + ch
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = ch
    if cur:
        lines.append(cur)
    return lines


def card(kicker, title, footer, out, title_size=64, bg=INK):
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    # accent rule
    d.rectangle([72, 96, 152, 102], fill=ACCENT)
    f_kick = font(SANS_B, 22)
    f_title = font(SANS_B, title_size)
    f_foot = font(SANS, 24)
    d.text((72, 120), kicker, font=f_kick, fill=ACCENT)
    lines = wrap(d, title, f_title, W - 144)
    y = 176
    for line in lines[:4]:
        d.text((72, y), line, font=f_title, fill=PAPER)
        y += int(title_size * 1.28)
    # bottom hairline + footer
    d.rectangle([72, H - 108, W - 72, H - 107], fill=(70, 63, 50))
    d.text((72, H - 86), footer, font=f_foot, fill=MUTED)
    d.text((W - 72 - 168, H - 86), "yhyu13.github.io", font=font(SERIF_I, 26), fill=ACCENT)
    img.save(out, quality=90, optimize=True, progressive=True)


def from_pdf(pdf_path, out, kicker, footer):
    doc = fitz.open(pdf_path)
    page = doc[0]
    pix = page.get_pixmap(dpi=200)
    src = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    doc.close()
    img = Image.new("RGB", (W, H), INK)
    # fit the slide inside the card with margin
    margin = 56
    scale = min((W - 2 * margin) / src.width, (H - 2 * margin) / src.height)
    sized = src.resize((int(src.width * scale), int(src.height * scale)), Image.LANCZOS)
    x = (W - sized.width) // 2
    y = (H - sized.height) // 2
    img.paste(sized, (x, y))
    d = ImageDraw.Draw(img)
    d.text((margin, 18), kicker, font=font(SANS_B, 20), fill=ACCENT)
    d.text((W - margin - 158, H - 34), "yhyu13.github.io", font=font(SERIF_I, 22), fill=ACCENT)
    img.save(out, quality=90, optimize=True, progressive=True)


def from_image(path, out, kicker):
    src = Image.open(path).convert("RGB")
    scale = max(W / src.width, H / src.height)
    sized = src.resize((int(src.width * scale), int(src.height * scale)), Image.LANCZOS)
    left = (sized.width - W) // 2
    top = (sized.height - H) // 2
    img = sized.crop((left, top, left + W, top + H))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 74], fill=(41, 37, 29, 0))
    d.text((40, 22), kicker, font=font(SANS_B, 20), fill=ACCENT)
    d.text((W - 200, H - 34), "yhyu13.github.io", font=font(SERIF_I, 22), fill=ACCENT)
    img.save(out, quality=90, optimize=True, progressive=True)


def load_manifest():
    path = os.path.join(ROOT, "dist", "share-manifest.json")
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def main():
    entries = load_manifest()
    made = 0
    for entry in entries:
        path = entry["path"]
        kind = entry["kind"]
        title = entry["title"]
        desc = entry["description"]
        if kind == "deck":
            slug = path.rsplit("/", 1)[-1]
            pdf = os.path.join(PUBLIC, "decks", f"{slug}.pdf")
            out = os.path.join(OG, f"deck-{slug}.jpg")
            if os.path.exists(pdf):
                from_pdf(pdf, out, "VIDEO SLIDES · HANG YU", "")
                made += 1
                continue
            card("VIDEO SLIDES", title, desc, out)
        elif kind == "course":
            slug = path.rsplit("/", 1)[-1]
            out = os.path.join(OG, f"course-{slug}.jpg")
            poster = None
            base = os.path.join(PUBLIC, "courses", slug, "files", "posters")
            if os.path.isdir(base):
                for name in sorted(os.listdir(base)):
                    if name.lower().endswith((".png", ".jpg")):
                        poster = os.path.join(base, name)
                        break
            if poster:
                from_image(poster, out, "COURSES · HANG YU")
            else:
                card("COURSES", title, desc, out)
        elif kind == "work":
            wid = path.rsplit("/", 1)[-1]
            card("WORKS · 可当场打开", title, desc, os.path.join(OG, f"work-{wid}.jpg"))
        elif kind == "note":
            slug = path.rsplit("/", 1)[-1]
            card("FIELD NOTES", title, desc, os.path.join(OG, f"note-{slug}.jpg"), title_size=58)
        elif kind == "volume":
            vid = path.rsplit("/", 1)[-1] or "identity"
            card("FIELD MANUAL", title, desc, os.path.join(OG, f"volume-{vid}.jpg"))
        elif kind == "index":
            card("INDEX · 64 ITEMS", title, desc, os.path.join(OG, "index.jpg"))
        made += 1
    print(f"og cards: {made} written to public/og")


if __name__ == "__main__":
    main()
