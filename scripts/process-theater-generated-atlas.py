from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image


MAGENTA = (255, 0, 255)
ROOT = Path(__file__).resolve().parents[1]

CHARACTER_ACTIONS = [
    ("idle", "idle-sheet.png"),
    ("walk-right", "walk-right-sheet.png"),
    ("paying", "paying-sheet.png"),
    ("sit-eat", "sit-eat-sheet.png"),
    ("done", "done-sheet.png"),
]

RESTAURANT_TYPES = ["bento", "drink", "noodle", "fastFood", "cafe"]


def remove_magenta(img: Image.Image, threshold: int = 80) -> Image.Image:
    img = img.convert("RGBA")
    pixels = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = pixels[x, y]
            if abs(r - MAGENTA[0]) <= threshold and g <= threshold and abs(b - MAGENTA[2]) <= threshold:
                pixels[x, y] = (255, 0, 255, 0)
            elif a:
                pixels[x, y] = (r, g, b, a)
    return img


def fit_to_cell(src: Image.Image, size: tuple[int, int], align: str = "bottom") -> Image.Image:
    src = remove_magenta(src)
    bbox = src.getbbox()
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    if not bbox:
        return canvas
    src = src.crop(bbox)
    scale = min((size[0] * 0.9) / src.width, (size[1] * 0.9) / src.height)
    resized = src.resize((max(1, round(src.width * scale)), max(1, round(src.height * scale))), Image.Resampling.LANCZOS)
    x = round((size[0] - resized.width) / 2)
    y = round((size[1] - resized.height) / 2)
    if align == "bottom":
        y = size[1] - resized.height - round(size[1] * 0.04)
    canvas.alpha_composite(resized, (x, y))
    return canvas


def crop_cell(atlas: Image.Image, row: int, col: int, rows: int, cols: int, inset: int = 0) -> Image.Image:
    width = atlas.width // cols
    height = atlas.height // rows
    inset = max(0, min(inset, (width // 2) - 1, (height // 2) - 1))
    return atlas.crop(
        (
            col * width + inset,
            row * height + inset,
            (col + 1) * width - inset,
            (row + 1) * height - inset,
        )
    )


def process_character_atlas(input_path: Path, output_dir: Path, meta: dict[str, str]) -> None:
    atlas = Image.open(input_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    for action_index, (action, filename) in enumerate(CHARACTER_ACTIONS):
        sheet = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
        align = "center" if action in {"sit-eat", "done"} else "bottom"
        for frame in range(4):
            cell = crop_cell(atlas, action_index, frame, 5, 4)
            frame_img = fit_to_cell(cell, (128, 128), align=align)
            sheet.alpha_composite(frame_img, ((frame % 2) * 128, (frame // 2) * 128))
        sheet.save(output_dir / filename)
    write_meta(output_dir / "pipeline-meta.json", input_path, meta | {"layout": "5x4 action atlas"})


def process_food_atlas(input_path: Path, output_dir: Path, meta: dict[str, str]) -> None:
    atlas = Image.open(input_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    for row, restaurant_type in enumerate(RESTAURANT_TYPES):
        for state in range(3):
            cell = crop_cell(atlas, row, state, 5, 3)
            fit_to_cell(cell, (96, 64), align="center").save(output_dir / f"{restaurant_type}-food-{state}.png")
    write_meta(output_dir / "pipeline-meta.json", input_path, meta | {"layout": "5x3 food progression atlas"})


def process_food_row(input_path: Path, output_dir: Path, restaurant_type: str, meta: dict[str, str]) -> None:
    atlas = Image.open(input_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    for state in range(3):
        cell = crop_cell(atlas, 0, state, 1, 3)
        fit_to_cell(cell, (96, 64), align="center").save(output_dir / f"{restaurant_type}-food-{state}.png")
    write_meta(output_dir / f"pipeline-meta-{restaurant_type}.json", input_path, meta | {"layout": "1x3 food progression sheet", "restaurantType": restaurant_type})


def process_sheet_2x2(input_path: Path, output_path: Path, meta_path: Path, meta: dict[str, str], cell_inset: int = 0) -> None:
    atlas = Image.open(input_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    for frame in range(4):
        cell = crop_cell(atlas, frame // 2, frame % 2, 2, 2, inset=cell_inset)
        frame_img = fit_to_cell(cell, (128, 128), align="center")
        sheet.alpha_composite(frame_img, ((frame % 2) * 128, (frame // 2) * 128))
    sheet.save(output_path)
    write_meta(meta_path, input_path, meta | {"layout": "2x2 sheet", "cellInset": str(cell_inset)})


def write_meta(path: Path, input_path: Path, meta: dict[str, str]) -> None:
    path.write_text(
        json.dumps(
            {
                "source": str(input_path.relative_to(ROOT)).replace("\\", "/") if input_path.is_relative_to(ROOT) else str(input_path),
                "generator": "image_gen + scripts/process-theater-generated-atlas.py",
                **meta,
            },
            indent=2,
        ),
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["character", "food", "foodrow", "sheet2x2"])
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--meta", type=Path)
    parser.add_argument("--style", required=True)
    parser.add_argument("--subject", required=True)
    parser.add_argument("--restaurant-type")
    parser.add_argument("--cell-inset", type=int, default=0)
    args = parser.parse_args()

    meta = {"style": args.style, "subject": args.subject}
    if args.mode == "character":
        if not args.output_dir:
            raise SystemExit("--output-dir is required for character mode")
        process_character_atlas(args.input, args.output_dir, meta)
    elif args.mode == "food":
        if not args.output_dir:
            raise SystemExit("--output-dir is required for food mode")
        process_food_atlas(args.input, args.output_dir, meta)
    elif args.mode == "foodrow":
        if not args.output_dir or not args.restaurant_type:
            raise SystemExit("--output-dir and --restaurant-type are required for foodrow mode")
        process_food_row(args.input, args.output_dir, args.restaurant_type, meta)
    else:
        if not args.output or not args.meta:
            raise SystemExit("--output and --meta are required for sheet2x2 mode")
        process_sheet_2x2(args.input, args.output, args.meta, meta, cell_inset=args.cell_inset)


if __name__ == "__main__":
    main()
