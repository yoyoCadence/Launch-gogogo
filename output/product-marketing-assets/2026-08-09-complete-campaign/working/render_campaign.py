import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[4]
WORK = ROOT / "output" / "product-marketing-assets" / "2026-08-09-complete-campaign" / "working"
CAPTURES = ROOT / "output" / "product-marketing-assets" / "2026-08-09-complete-campaign" / "raw-captures"
SHOWCASE = Path(os.environ.get("LAUNCH_CAMPAIGN_OUTPUT_DIR", ROOT / "showcase"))
SHOWCASE.mkdir(parents=True, exist_ok=True)

W, H = 1600, 1000
BG = "#06121f"
BG_2 = "#0a1d2b"
SURFACE = "#102838"
SURFACE_2 = "#153447"
INK = "#f7f1e5"
MUTED = "#a9bdc7"
GREEN = "#41d3a2"
CORAL = "#ff7a64"
CYAN = "#58b9ff"
TICKET = "#f1e6d2"
TICKET_INK = "#132634"
LINE = "#365466"

FONT_REG = r"C:\Windows\Fonts\msjh.ttc"
FONT_BOLD = r"C:\Windows\Fonts\msjhbd.ttc"
FONT_MONO = r"C:\Windows\Fonts\consola.ttf"


def font(size, bold=False, mono=False):
    return ImageFont.truetype(FONT_MONO if mono else FONT_BOLD if bold else FONT_REG, size)


def load(path):
    return Image.open(path).convert("RGB")


def cover(im, size, focus=(0.5, 0.5)):
    tw, th = size
    scale = max(tw / im.width, th / im.height)
    resized = im.resize((round(im.width * scale), round(im.height * scale)), Image.Resampling.LANCZOS)
    left = round((resized.width - tw) * focus[0])
    top = round((resized.height - th) * focus[1])
    left = max(0, min(left, resized.width - tw))
    top = max(0, min(top, resized.height - th))
    return resized.crop((left, top, left + tw, top + th))


def contain(im, size, bg=None):
    tw, th = size
    scale = min(tw / im.width, th / im.height)
    resized = im.resize((round(im.width * scale), round(im.height * scale)), Image.Resampling.LANCZOS)
    if bg is None:
        return resized
    canvas = Image.new("RGB", size, bg)
    canvas.paste(resized, ((tw - resized.width) // 2, (th - resized.height) // 2))
    return canvas


def crop_pct(im, left, top, right, bottom):
    return im.crop((round(im.width * left), round(im.height * top), round(im.width * right), round(im.height * bottom)))


def rounded(im, radius, border=0, border_color=LINE):
    im = im.convert("RGB")
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width - 1, im.height - 1), radius=radius, fill=255)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im.convert("RGBA"), (0, 0), mask)
    if border:
        d = ImageDraw.Draw(out)
        d.rounded_rectangle((border // 2, border // 2, im.width - 1 - border // 2, im.height - 1 - border // 2), radius=radius, outline=border_color, width=border)
    return out


def paste_card(canvas, im, box, radius=28, border=2, shadow=True, focus=(0.5, 0.5), mode="cover"):
    x, y, w, h = box
    fitted = cover(im, (w, h), focus) if mode == "cover" else contain(im, (w, h), BG)
    if shadow:
        sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle((x + 12, y + 18, x + w + 12, y + h + 18), radius=radius, fill=(0, 0, 0, 120))
        sh = sh.filter(ImageFilter.GaussianBlur(18))
        canvas.alpha_composite(sh)
    canvas.alpha_composite(rounded(fitted, radius, border, LINE), (x, y))


def base_canvas(light=False):
    top = Image.new("RGBA", (W, H), BG if not light else "#f1e6d2")
    px = top.load()
    c1 = (6, 18, 31) if not light else (241, 230, 210)
    c2 = (12, 40, 53) if not light else (225, 239, 228)
    for y in range(H):
        t = y / (H - 1)
        row = tuple(round(c1[i] * (1 - t) + c2[i] * t) for i in range(3))
        for x in range(W):
            px[x, y] = (*row, 255)
    d = ImageDraw.Draw(top)
    dot = (61, 91, 105, 65) if not light else (31, 111, 91, 42)
    for y in range(24, H, 32):
        for x in range(24, W, 32):
            d.ellipse((x, y, x + 2, y + 2), fill=dot)
    return top


def wrap_text(draw, text, ft, max_width):
    lines = []
    current = ""
    for ch in text:
        if ch == "\n":
            lines.append(current)
            current = ""
            continue
        candidate = current + ch
        if current and draw.textbbox((0, 0), candidate, font=ft)[2] > max_width:
            lines.append(current)
            current = ch
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def text_block(draw, xy, text, ft, fill, max_width, line_gap=10):
    x, y = xy
    ascent, descent = ft.getmetrics()
    line_h = ascent + descent + line_gap
    for line in wrap_text(draw, text, ft, max_width):
        draw.text((x, y), line, font=ft, fill=fill)
        y += line_h
    return y


def eyebrow(draw, xy, label, accent=GREEN):
    x, y = xy
    ft = font(20, mono=True)
    bbox = draw.textbbox((0, 0), label, font=ft)
    w = bbox[2] - bbox[0] + 34
    h = 40
    draw.rounded_rectangle((x, y, x + w, y + h), radius=20, fill=accent)
    draw.text((x + 17, y + 7), label, font=ft, fill=BG)


def ticket(draw, box, number, title, body, accent=GREEN):
    x, y, w, h = box
    draw.rounded_rectangle((x, y, x + w, y + h), radius=22, fill=TICKET)
    for yy in range(y + 18, y + h - 12, 26):
        draw.ellipse((x - 5, yy, x + 5, yy + 10), fill=BG)
        draw.ellipse((x + w - 5, yy, x + w + 5, yy + 10), fill=BG)
    draw.rounded_rectangle((x + 18, y + 18, x + 78, y + 54), radius=18, fill=accent)
    draw.text((x + 34, y + 22), number, font=font(18, bold=True), fill=BG)
    draw.text((x + 18, y + 70), title, font=font(30, bold=True), fill=TICKET_INK)
    text_block(draw, (x + 18, y + 116), body, font(21), "#425563", w - 36, 7)


def footer_mark(draw, order):
    draw.line((88, 934, 1512, 934), fill=LINE, width=2)
    draw.text((90, 952), "LAUNCH-GOGOGO  /  LUNCH CALL SHEET", font=font(17, mono=True), fill=MUTED)
    draw.text((1450, 952), f"{order:02d}/06", font=font(17, mono=True), fill=GREEN)


def save(canvas, name):
    canvas.convert("RGB").save(SHOWCASE / name, quality=95)


ledger = load(ROOT / "docs" / "screenshots" / "ledger.png")
themes = load(ROOT / "docs" / "screenshots" / "themes.png")
cyber = load(ROOT / "docs" / "screenshots" / "theme-cyberpunk.png")
gothic = load(ROOT / "docs" / "screenshots" / "theme-gothic.png")
neon = load(ROOT / "docs" / "screenshots" / "theme-neon.png")
ledger_live = load(CAPTURES / "ledger-live.png")
lunch_live = load(CAPTURES / "lunch-stores-live.png")
settings_live = load(CAPTURES / "settings-live.png")
settings_backup = load(CAPTURES / "settings-backup-live.png")
generated = load(WORK / "generated-stage-environment.png")
icon = load(ROOT / "icon-512.png")


# 01 Hero: expressive environment plus exact UI.
c = cover(generated, (W, H), (0.48, 0.52)).convert("RGBA")
overlay = Image.new("RGBA", (W, H), (3, 14, 26, 0))
od = ImageDraw.Draw(overlay)
for x in range(980):
    alpha = round(215 * (1 - x / 980) + 35 * (x / 980))
    od.line((x, 0, x, H), fill=(3, 14, 26, alpha))
od.rectangle((0, 0, W, H), fill=(3, 14, 26, 35))
c.alpha_composite(overlay)
d = ImageDraw.Draw(c)
eyebrow(d, (92, 92), "LUNCH CALL SHEET 01")
y = text_block(d, (92, 176), "每一筆午餐，\n都有帳，也有戲。", font(84, bold=True), INK, 780, 12)
text_block(d, (96, y + 34), "Launch-GoGoGo 把同事儲值、餐點扣款與今日小劇場，放進同一個手機帳本。", font(32), "#d1dde2", 710, 12)
for i, (label, color) in enumerate([("同事餘額", GREEN), ("餐點扣款", CORAL), ("訂餐小劇場", CYAN)]):
    x = 98 + i * 210
    d.rounded_rectangle((x, 720, x + 184, 770), radius=25, fill=(6, 18, 31, 210), outline=color, width=2)
    d.text((x + 22, 730), label, font=font(22, bold=True), fill=INK)
paste_card(c, ledger, (1080, 35, 420, 879), radius=36, border=3, mode="contain")
d = ImageDraw.Draw(c)
footer_mark(d, 1)
save(c, "01-hero.png")
save(c, "hero.png")


# 02 One ledger workflow.
c = base_canvas()
d = ImageDraw.Draw(c)
eyebrow(d, (90, 72), "ACCOUNTING CUE 02", CORAL)
text_block(d, (90, 146), "儲值、點餐、餘額，\n留在同一條帳。", font(66, bold=True), INK, 850, 10)
text_block(d, (94, 318), "預付餐點會反映在同事餘額；收款與交易歷史也在同一個 Ledger。", font(28), MUTED, 810, 10)
ticket(d, (92, 500, 265, 260), "01", "儲值", "把同事的預付金記進帳本。", GREEN)
ticket(d, (382, 500, 265, 260), "02", "餐點", "選同事、店家、金額與付款方式。", CORAL)
ticket(d, (672, 500, 265, 260), "03", "餘額", "卡片與歷史顯示交易結果。", CYAN)
d.line((330, 790, 900, 790), fill=GREEN, width=6)
d.polygon([(900, 790), (875, 776), (875, 804)], fill=GREEN)
paste_card(c, ledger, (1068, 58, 432, 858), radius=30, border=3, mode="cover", focus=(0.5, 0.18))
d = ImageDraw.Draw(c)
d.rounded_rectangle((1140, 748, 1430, 824), radius=38, fill=(65, 211, 162, 230))
d.text((1184, 767), "餘額 890 元", font=font(31, bold=True), fill=BG)
footer_mark(d, 2)
save(c, "02-one-ledger.png")


# 03 Signature theater proof.
c = base_canvas()
d = ImageDraw.Draw(c)
eyebrow(d, (88, 70), "THEATER CUE 03", CYAN)
text_block(d, (88, 144), "一筆餐點，\n演成一幕午休小劇場。", font(65, bold=True), INK, 650, 10)
text_block(d, (92, 324), "角色、店家類型、付款狀態與餘額，會一起進到今日場景。", font(28), MUTED, 570, 9)
for i, (label, color) in enumerate([("角色", GREEN), ("店家", CORAL), ("付款狀態", CYAN), ("餘額", "#f6c55b")]):
    yy = 500 + i * 78
    d.ellipse((96, yy, 136, yy + 40), fill=color)
    d.text((158, yy + 1), label, font=font(28, bold=True), fill=INK)
    d.line((300, yy + 20, 645, yy + 20), fill=LINE, width=3)
main_stage = crop_pct(ledger, 0.045, 0.50, 0.96, 0.90)
paste_card(c, main_stage, (690, 105, 820, 690), radius=34, border=3, focus=(0.5, 0.55))
cyber_stage = crop_pct(cyber, 0.05, 0.57, 0.95, 0.90)
gothic_stage = crop_pct(gothic, 0.05, 0.57, 0.95, 0.90)
paste_card(c, cyber_stage, (806, 744, 300, 170), radius=20, border=2, focus=(0.5, 0.45))
paste_card(c, gothic_stage, (1130, 744, 300, 170), radius=20, border=2, focus=(0.5, 0.45))
d = ImageDraw.Draw(c)
d.text((820, 864), "同一筆帳務 · 不同舞台氣氛", font=font(22, bold=True), fill=INK)
footer_mark(d, 3)
save(c, "03-order-theater.png")


# 04 Style breadth.
c = base_canvas()
d = ImageDraw.Draw(c)
eyebrow(d, (88, 68), "SCENE CHANGE 04", GREEN)
text_block(d, (88, 142), "帳本可以很務實，\n也可以很有戲。", font(65, bold=True), INK, 620, 9)
d.text((92, 382), "14", font=font(118, bold=True), fill=GREEN)
d.text((288, 408), "配色主題", font=font(32, bold=True), fill=INK)
d.text((92, 540), "21", font=font(118, bold=True), fill=CORAL)
d.text((288, 566), "小劇場風格", font=font(32, bold=True), fill=INK)
text_block(d, (94, 720), "兩套選擇分開切換；帳務結構保持一致，舞台與氣氛自由換景。", font(27), MUTED, 530, 8)
paste_card(c, crop_pct(themes, 0.0, 0.02, 1.0, 0.55), (660, 72, 390, 840), radius=26, border=3, focus=(0.5, 0.15))
for i, (im, label, color) in enumerate([(cyber, "GREEN", GREEN), (gothic, "CORAL", CORAL), (neon, "PINK", "#f472b6")]):
    x = 1076
    y = 250 + i * 190
    stage = crop_pct(im, 0.05, 0.54, 0.95, 0.90)
    paste_card(c, stage, (x, y, 420, 160), radius=22, border=2, focus=(0.5, 0.52))
    d = ImageDraw.Draw(c)
    d.rounded_rectangle((x + 18, y + 18, x + 138, y + 56), radius=19, fill=color)
    d.text((x + 42, y + 28), label, font=font(16, bold=True, mono=True), fill=BG)
footer_mark(ImageDraw.Draw(c), 4)
save(c, "04-style-system.png")


# 05 Local-first trust proof.
c = base_canvas(light=True)
d = ImageDraw.Draw(c)
eyebrow(d, (88, 70), "LOCAL LEDGER 05", GREEN)
text_block(d, (88, 146), "不登入，也有自己的午餐帳。", font(66, bold=True), TICKET_INK, 900, 9)
text_block(d, (92, 250), "IndexedDB 保存在本機；Service Worker 支援離線開啟，JSON 可手動匯出與匯入。", font(28), "#405763", 900, 9)
nodes = [("瀏覽器", "手機開啟", GREEN), ("IndexedDB", "本機帳務", CYAN), ("JSON", "手動備份", CORAL)]
for i, (title, body, color) in enumerate(nodes):
    x = 94 + i * 286
    d.rounded_rectangle((x, 430, x + 246, 610), radius=28, fill=BG)
    d.ellipse((x + 24, 454, x + 70, 500), fill=color)
    d.text((x + 24, 518), title, font=font(26, bold=True), fill=INK)
    d.text((x + 24, 558), body, font=font(21), fill=MUTED)
    if i < 2:
        d.line((x + 246, 520, x + 280, 520), fill="#6d8b94", width=4)
        d.polygon([(x + 280, 520), (x + 266, 511), (x + 266, 529)], fill="#6d8b94")
paste_card(c, settings_backup, (990, 190, 505, 620), radius=30, border=3, focus=(0.5, 0.44))
icon_small = contain(icon, (110, 110))
c.alpha_composite(rounded(icon_small, 26), (95, 720))
d = ImageDraw.Draw(c)
d.text((232, 736), "純靜態 PWA", font=font(31, bold=True), fill=TICKET_INK)
d.text((232, 784), "不宣稱雲端同步；資料邊界清楚。", font=font(23), fill="#526873")
d.line((88, 934, 1512, 934), fill="#9bb0aa", width=2)
d.text((90, 952), "LAUNCH-GOGOGO  /  LUNCH CALL SHEET", font=font(17, mono=True), fill="#526873")
d.text((1450, 952), "05/06", font=font(17, mono=True), fill="#147f62")
save(c, "05-local-first.png")


# 06 Closing system view.
c = base_canvas()
d = ImageDraw.Draw(c)
icon_small = contain(icon, (96, 96))
c.alpha_composite(rounded(icon_small, 24), (90, 65))
eyebrow(d, (212, 76), "READY FOR LUNCH 06", CORAL)
text_block(d, (88, 190), "午休開場，帳務就位。", font(70, bold=True), INK, 820, 10)
text_block(d, (92, 300), "從同事餘額到午餐店家，再到每一筆訂餐狀態，一個手機優先的 PWA 收住日常。", font(28), MUTED, 900, 9)
screens = [
    (ledger_live, "LEDGER", GREEN, (0.5, 0.14)),
    (lunch_live, "LUNCH STORES", CORAL, (0.5, 0.12)),
    (settings_live, "SETTINGS", CYAN, (0.5, 0.12)),
]
for i, (im, label, color, focus) in enumerate(screens):
    x = 90 + i * 500
    y = 420 if i != 1 else 390
    h = 460 if i != 1 else 500
    paste_card(c, im, (x, y, 420, h), radius=28, border=3, focus=focus)
    d = ImageDraw.Draw(c)
    d.rounded_rectangle((x + 20, y + 20, x + 20 + 180, y + 62), radius=21, fill=color)
    d.text((x + 42, y + 31), label, font=font(18, bold=True, mono=True), fill=BG)
footer_mark(ImageDraw.Draw(c), 6)
save(c, "06-closing.png")


# Purpose-composed 16:9 thumbnail.
TW, TH = 1200, 675
t = cover(generated, (TW, TH), (0.55, 0.48)).convert("RGBA")
shade = Image.new("RGBA", (TW, TH), (3, 14, 26, 70))
sd = ImageDraw.Draw(shade)
for x in range(760):
    alpha = round(235 * (1 - x / 760) + 55 * (x / 760))
    sd.line((x, 0, x, TH), fill=(3, 14, 26, alpha))
t.alpha_composite(shade)
td = ImageDraw.Draw(t)
thumb_icon = contain(icon, (72, 72))
t.alpha_composite(rounded(thumb_icon, 18), (70, 62))
td.text((166, 78), "Launch-GoGoGo", font=font(27, bold=True), fill=INK)
text_block(td, (70, 185), "每一筆午餐，\n都有帳，也有戲。", font(58, bold=True), INK, 620, 8)
td.rounded_rectangle((72, 500, 390, 550), radius=25, fill=GREEN)
td.text((105, 510), "午餐帳本 × 訂餐小劇場", font=font(23, bold=True), fill=BG)
paste_card(t, ledger, (820, 24, 300, 628), radius=30, border=3, mode="contain")
t.convert("RGB").save(SHOWCASE / "thumbnail.png", quality=95)


# Contact sheet generated from approved ordered assets.
ordered = [load(SHOWCASE / name) for name in [
    "01-hero.png", "02-one-ledger.png", "03-order-theater.png",
    "04-style-system.png", "05-local-first.png", "06-closing.png"
]]
cell_w, cell_h = 780, 488
gap, margin = 36, 42
sheet = Image.new("RGB", (margin * 2 + cell_w * 2 + gap, margin * 2 + cell_h * 3 + gap * 2), BG)
for i, im in enumerate(ordered):
    thumb = cover(im, (cell_w, cell_h))
    x = margin + (i % 2) * (cell_w + gap)
    y = margin + (i // 2) * (cell_h + gap)
    sheet.paste(rounded(thumb, 18, 2, LINE).convert("RGB"), (x, y))
sheet.save(SHOWCASE / "contact-sheet.png", quality=95)

print("Rendered 6 campaign assets, hero alias, thumbnail, and contact sheet.")
