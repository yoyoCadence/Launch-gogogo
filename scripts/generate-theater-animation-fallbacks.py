from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
THEATER_ROOT = ROOT / "assets" / "theater"

STYLES = [
    "anime",
    "cyberpunk",
    "gothic-lolita",
    "pixel",
    "arcade",
    "retro-16bit",
    "storybook",
    "chibi",
    "painted-fantasy",
    "muted-jp-life",
    "arcade-fighter-90s",
]

CHARACTERS = ["runner", "foodie", "thinker"]
GENDERS = ["female", "male"]
RESTAURANT_TYPES = ["bento", "drink", "noodle", "fastFood", "cafe"]

STYLE_ACCENTS = {
    "anime": ((255, 113, 158), (126, 200, 227)),
    "cyberpunk": ((0, 232, 255), (255, 64, 180)),
    "gothic-lolita": ((142, 23, 54), (220, 184, 87)),
    "pixel": ((86, 214, 120), (72, 120, 255)),
    "arcade": ((255, 214, 42), (255, 65, 65)),
    "retro-16bit": ((96, 190, 92), (104, 120, 210)),
    "storybook": ((210, 122, 78), (112, 160, 118)),
    "chibi": ((255, 146, 196), (124, 214, 226)),
    "painted-fantasy": ((198, 132, 72), (112, 92, 190)),
    "muted-jp-life": ((156, 166, 150), (196, 142, 116)),
    "arcade-fighter-90s": ((255, 70, 50), (80, 150, 255)),
}

FOOD_COLORS = {
    "bento": ((245, 209, 138), (102, 72, 48), (88, 160, 94)),
    "drink": ((166, 222, 242), (223, 168, 105), (245, 245, 245)),
    "noodle": ((244, 209, 136), (190, 92, 56), (80, 150, 70)),
    "fastFood": ((238, 178, 62), (166, 78, 48), (238, 64, 64)),
    "cafe": ((116, 76, 52), (234, 202, 142), (242, 236, 220)),
}


def fit_image(src: Image.Image, max_w: int, max_h: int) -> Image.Image:
    src = src.convert("RGBA")
    bbox = src.getbbox()
    if bbox:
        src = src.crop(bbox)
    scale = min(max_w / src.width, max_h / src.height)
    size = (max(1, round(src.width * scale)), max(1, round(src.height * scale)))
    return src.resize(size, Image.Resampling.LANCZOS)


def paste_centered(cell: Image.Image, sprite: Image.Image, x: int, bottom: int) -> None:
    cell.alpha_composite(sprite, (round(x - sprite.width / 2), bottom - sprite.height))


def shadow(draw: ImageDraw.ImageDraw, cx: int, y: int, w: int, h: int) -> None:
    draw.ellipse((cx - w // 2, y - h // 2, cx + w // 2, y + h // 2), fill=(0, 0, 0, 58))


def cell_with_sprite(src: Image.Image, action: str, frame: int) -> Image.Image:
    cell = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    draw = ImageDraw.Draw(cell)
    if action == "sit-eat":
        sprite = fit_image(src, 78, 90)
        lean = [-4, 0, 4, 0][frame]
        paste_centered(cell, sprite, 66 + lean, 118)
        draw.ellipse((68, 92, 113, 108), fill=(255, 255, 255, 230), outline=(80, 65, 50, 120), width=2)
        bite = [0, 1, 2, 1][frame]
        draw.ellipse((76 + bite * 4, 95, 101, 104), fill=(235, 170, 76, 235))
        draw.line((54, 79, 84, 96), fill=(100, 70, 45, 190), width=2)
        return cell
    if action == "done":
        sprite = fit_image(src, 76, 86)
        paste_centered(cell, sprite, 63, 118)
        draw.ellipse((70, 94, 112, 107), fill=(245, 245, 245, 215), outline=(80, 65, 50, 100), width=2)
        draw.arc((76, 97, 102, 106), 0, 180, fill=(120, 100, 80, 130), width=2)
        return cell

    sprite = fit_image(src, 86, 116)
    if action == "walk-right":
        offsets = [(-8, 0), (0, -2), (8, 0), (0, -2)]
        x, y = offsets[frame]
        shadow(draw, 64 + x, 121, 58, 12)
        paste_centered(cell, sprite, 64 + x, 121 + y)
    elif action == "paying":
        offsets = [(0, 0), (1, -1), (0, 0), (-1, -1)]
        x, y = offsets[frame]
        shadow(draw, 64, 121, 54, 12)
        paste_centered(cell, sprite, 64 + x, 121 + y)
        draw.rounded_rectangle((84, 54 + y, 107, 68 + y), radius=3, fill=(252, 244, 180, 235), outline=(80, 70, 50, 150), width=2)
    else:
        offsets = [(0, 0), (1, -1), (0, 0), (-1, -1)]
        x, y = offsets[frame]
        shadow(draw, 64, 121, 54, 12)
        paste_centered(cell, sprite, 64 + x, 121 + y)
    return cell


def sprite_sheet(src: Image.Image, action: str) -> Image.Image:
    sheet = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    for frame in range(4):
        cell = cell_with_sprite(src, action, frame)
        sheet.alpha_composite(cell, ((frame % 2) * 128, (frame // 2) * 128))
    return sheet


def save_character_sheets(style: str, character: str, gender: str) -> None:
    src_path = THEATER_ROOT / style / "characters" / f"{character}-{gender}.png"
    if not src_path.exists():
        return
    out_dir = THEATER_ROOT / style / "animated" / f"{character}-{gender}"
    out_dir.mkdir(parents=True, exist_ok=True)
    src = Image.open(src_path)
    for action, filename in [
        ("idle", "idle-sheet.png"),
        ("walk-right", "walk-right-sheet.png"),
        ("paying", "paying-sheet.png"),
        ("sit-eat", "sit-eat-sheet.png"),
        ("done", "done-sheet.png"),
    ]:
        sprite_sheet(src, action).save(out_dir / filename)
    meta = {
        "source": str(src_path.relative_to(ROOT)).replace("\\", "/"),
        "generator": "scripts/generate-theater-animation-fallbacks.py",
        "note": "Fallback animation sheets derived from existing static theater cutouts. Replace with hand/generated sheets when a style is art-directed.",
        "frames": 4,
        "layout": "2x2",
    }
    (out_dir / "pipeline-meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")


def food_image(restaurant_type: str, state: int, accent: tuple[int, int, int]) -> Image.Image:
    img = Image.new("RGBA", (96, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    c1, c2, c3 = FOOD_COLORS[restaurant_type]
    draw.ellipse((14, 38, 82, 56), fill=(0, 0, 0, 45))
    draw.rounded_rectangle((18, 28, 78, 48), radius=10, fill=(245, 245, 238, 235), outline=accent + (180,), width=2)
    if state < 2:
        fill_width = 46 if state == 0 else 28
        if restaurant_type == "drink":
            draw.rounded_rectangle((34, 11, 60, 47), radius=7, fill=c1 + (235,), outline=c2 + (200,), width=2)
            draw.rectangle((38, 15 + state * 10, 56, 42), fill=c2 + (210,))
            draw.line((55, 7, 62, 42), fill=c3 + (230,), width=2)
        elif restaurant_type == "noodle":
            draw.ellipse((25, 18, 71, 46), fill=c1 + (235,), outline=c2 + (210,), width=2)
            for i in range(3 - state):
                y = 25 + i * 5
                draw.arc((31, y, 65, y + 10), 0, 180, fill=c2 + (220,), width=2)
        else:
            draw.rounded_rectangle((25, 20, 25 + fill_width, 39), radius=6, fill=c1 + (235,))
            draw.ellipse((45, 18, 69, 37), fill=c2 + (230,))
            draw.rectangle((30, 35, 68, 42), fill=c3 + (210,))
    else:
        draw.arc((30, 32, 66, 46), 0, 180, fill=(130, 110, 90, 170), width=2)
        draw.ellipse((61, 36, 66, 41), fill=c2 + (170,))
    return img


def save_food_props(style: str) -> None:
    out_dir = THEATER_ROOT / style / "props" / "food"
    out_dir.mkdir(parents=True, exist_ok=True)
    accent = STYLE_ACCENTS[style][0]
    for restaurant_type in RESTAURANT_TYPES:
        for state in range(3):
            food_image(restaurant_type, state, accent).save(out_dir / f"{restaurant_type}-food-{state}.png")


def save_server(style: str) -> None:
    out_dir = THEATER_ROOT / style / "npcs"
    out_dir.mkdir(parents=True, exist_ok=True)
    primary, secondary = STYLE_ACCENTS[style]
    sheet = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    for frame in range(4):
        cell = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
        draw = ImageDraw.Draw(cell)
        sway = [0, -1, 0, 1][frame]
        draw.ellipse((42, 26 + sway, 86, 70 + sway), fill=(248, 206, 172, 255), outline=(70, 45, 36, 120), width=2)
        draw.pieslice((39, 18 + sway, 89, 54 + sway), 180, 360, fill=secondary + (245,))
        draw.rounded_rectangle((35, 68 + sway, 93, 112 + sway), radius=14, fill=primary + (245,), outline=(40, 35, 50, 130), width=2)
        draw.rounded_rectangle((47, 76 + sway, 81, 109 + sway), radius=8, fill=(246, 242, 230, 235))
        draw.arc((53, 43 + sway, 75, 57 + sway), 15, 165, fill=(80, 55, 45, 180), width=2)
        sheet.alpha_composite(cell, ((frame % 2) * 128, (frame // 2) * 128))
    sheet.save(out_dir / "server-idle-sheet.png")


def save_fx(style: str) -> None:
    out_dir = THEATER_ROOT / style / "fx"
    out_dir.mkdir(parents=True, exist_ok=True)
    primary, secondary = STYLE_ACCENTS[style]
    sheet = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    for frame in range(4):
        cell = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
        draw = ImageDraw.Draw(cell)
        scale = [18, 26, 34, 26][frame]
        alpha = [160, 230, 255, 180][frame]
        draw.ellipse((64 - scale, 64 - scale, 64 + scale, 64 + scale), outline=primary + (alpha,), width=5)
        draw.line((47, 65, 58, 77, 83, 48), fill=secondary + (alpha,), width=7)
        draw.ellipse((28, 28, 45, 45), fill=(255, 218, 78, alpha))
        draw.ellipse((88, 77, 104, 93), fill=(255, 236, 130, max(90, alpha - 40)))
        cell = cell.filter(ImageFilter.GaussianBlur(0.15))
        sheet.alpha_composite(cell, ((frame % 2) * 128, (frame // 2) * 128))
    sheet.save(out_dir / "payment-dollar-sheet.png")


def main() -> None:
    for style in STYLES:
        for character in CHARACTERS:
            for gender in GENDERS:
                save_character_sheets(style, character, gender)
        save_food_props(style)
        save_server(style)
        save_fx(style)


if __name__ == "__main__":
    main()
