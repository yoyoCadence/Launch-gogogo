# Theater Asset Generation Notes

The generated theater pack uses a consistent runtime contract:

- 11 raster theater styles: anime, cyberpunk, gothic-lolita, pixel, arcade, retro-16bit, storybook, chibi, painted-fantasy, muted-jp-life, arcade-fighter-90s.
- 5 restaurant stages per style: bento, drink, noodle, fastFood, cafe.
- 6 character cutouts per style: runner, foodie, thinker, each with female and male variants.
- All 11 planned animated style packs are production generated as of 2026-05-11.
- Current runtime supports female and male character variants through coworker profile settings.

Prompt principles:

- Use original designs only. Famous examples were treated as broad visual-language references, not as IP copies.
- Stages are 16:9, no foreground characters, no readable text, no logos, with a counter on the left, dining area on the right, and a readable center path.
- Character sheets are 3 columns by 2 rows on solid magenta, with columns ordered runner, foodie, thinker and rows ordered female, male.
- Character roles stay stable across styles: runner is energetic, foodie is expressive and meal-focused, thinker is calm and planning-focused.

## Runtime Contract

Animated theater packs use the same app-facing filenames across all visual styles:

```text
assets/theater/{style}/animated/{character}-{gender}/
  idle-sheet.png
  walk-right-sheet.png
  paying-sheet.png
  sit-eat-sheet.png
  done-sheet.png
  pipeline-meta-{action}.json
assets/theater/{style}/props/food/{restaurantType}-food-{0,1,2}.png
assets/theater/{style}/props/food/pipeline-meta-{restaurantType}.json
assets/theater/{style}/npcs/server-idle-sheet.png
assets/theater/{style}/npcs/pipeline-meta-server-idle.json
assets/theater/{style}/fx/payment-dollar-sheet.png
assets/theater/{style}/fx/pipeline-meta-payment-dollar.json
```

Action semantics are strict:

- `idle-sheet.png`: standing idle only.
- `walk-right-sheet.png`: walking only. Do not put seated, eating, or payment poses in this slot.
- `paying-sheet.png`: counter/payment pose.
- `sit-eat-sheet.png`: seated eating loop.
- `done-sheet.png`: seated finished pose.

The app mounts all animated layers through the theater stage, then CSS controls visibility by payment state. If a character appears to eat while walking, inspect the CSS timing and animation fill modes before regenerating assets.

## Raw Asset Intake

`C:\Users\memor\.codex\generated_images` is only a temporary generation dump. Its UUID filenames do not encode style, restaurant, character, action, food state, or runtime destination.

After each generation batch, copy or process the selected source image into deterministic raw paths:

```text
assets/theater/{style}/raw/generated-animated/{character}-{gender}/{action}-sheet-raw.png
assets/theater/{style}/raw/generated-props/{restaurantType}-food-row-raw.png
assets/theater/{style}/raw/generated-npcs-fx/server-idle-sheet-raw.png
assets/theater/{style}/raw/generated-npcs-fx/payment-dollar-sheet-raw.png
```

Raw files may stay local/untracked for normal production PRs, but they must be named deterministically while working so future processing is repeatable. When raw files are included for review, include enough `pipeline-meta-*` output to identify the generator, processor command, style, subject, and source path.

Promotion rules:

- Do not wire runtime assets directly from `generated_images`.
- Do not use simple geometric crops or temporary helpers as final art when polished generated food or character sources exist.
- Runtime folders contain transparent, cropped, size-normalized app assets; raw folders contain selected originals or review-needed sources.
- If a food row is derived from a larger atlas, record the crop mapping in pipeline metadata or notes.
- For single-restaurant food rows, say `1x3 horizontal grid`, `three side-by-side cells`, and `wide landscape canvas` in the prompt. The model may otherwise return a square 2x2-like sheet or a vertical 3-cell sheet, which does not match `foodrow` processing.
- Production folders should keep per-action/per-prop metadata only (`pipeline-meta-{action}.json`, `pipeline-meta-{restaurantType}.json`, `pipeline-meta-server-idle.json`, `pipeline-meta-payment-dollar.json`). Remove old generic fallback `pipeline-meta.json` files after replacing a fallback pack so audits do not report a production style as fallback-generated.

## Food Progression

Every restaurant has three food states:

- `food-0`: just served / full.
- `food-1`: half eaten.
- `food-2`: nearly finished / empty.

The eating timeline should leave each food state visible long enough to read at the small theater size. Do not flash through all three states quickly. If the final prop looks too small, prefer a per-style or per-restaurant runtime size/position adjustment over replacing the polished generated art.

## Placement QA

Generated stage backgrounds do not share identical counter/table geometry. Validate placement per restaurant, not only per style:

- Bento, drink, and noodle generally use right-facing checkout: the server/counter is to the customer's right.
- Cafe and fastFood generally need left-facing checkout because the counter is on the customer's left; otherwise the server can be pushed into the dining area.
- Server sprites must sit inside the actual counter/window area, not over the dining table.
- Payment FX should land between the customer and server.
- Food props must land on the dining table and remain readable.

If fixing only the server position makes checkout awkward, move the whole interaction anchor together: customer stop, server, payment FX, and eventual seat/food position.

## QA Checklist

Before marking a style complete:

- Confirm the full contract exists for all 3 characters x 2 genders x 5 actions, 5 restaurants x 3 food states, server, and payment FX.
- Inspect every `{character}-{gender}/{action}-sheet.png`; remove guide borders, grid leftovers, clipped limbs, and transparent-background failures.
- Verify `walk-right-sheet.png` is actually walking for every character/gender.
- Verify `waiting` has no visible food prop or payment FX.
- Verify early `eating` starts with walking and does not reveal the seated/eating layer too early.
- Screenshot every restaurant type in waiting, early eating, middle eating, and late eating.
- Compare representative outputs against completed packs such as `anime` and `cyberpunk` for detail density, pose variety, material rendering, and style-specific visual language.

## Cache And Versioning

When runtime asset bytes change without path changes, bump `THEATER_ANIMATION_ASSET_VERSION` in `app.js` so browsers fetch fresh PNGs. When cached shell files or service worker-controlled app assets change, bump `CACHE_NAME` in `service-worker.js`. When the theater cache namespace or downloaded theater asset set changes, bump `THEATER_ASSET_CACHE_NAME`.

Style references used for prompt wording:

- Anime: bold clean linework, energetic shonen-inspired silhouettes, bright lunch-app colors.
- Cyberpunk / sci-fi UI: neon rim light, holographic panels, graphite surfaces, cyan/magenta accents.
- Gothic lolita: lace, ribbons, burgundy velvet, black lacquer, gold trim, refined tea-room mood.
- Pixel: limited palette, chunky readable clusters, hard pixel edges, low-resolution game readability.
- Arcade: saturated coin-op energy, glossy floors, cabinet lighting, punchy color accents.
- Retro 16-bit RPG: SNES-era town/tavern language, tile-like floors, compact readable sprites.
- Storybook: watercolor wash, pencil linework, rounded furniture, warm picture-book staging.
- Chibi: big-head small-body proportions, rounded pastel props, toy-like softness.
- Painted fantasy RPG: thick brushwork, tavern/guild materials, warm magical lighting.
- Muted Japanese daily-life: low saturation, soft daylight, simple neighborhood lunch-shop mood.
- 90s arcade fighting: high-contrast rim light, wet pavement, dramatic stage composition, bold sprite-era silhouettes.
