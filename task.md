# Task List

This file tracks upcoming work for Launch-GoGoGo. Keep tasks ordered by product risk and user value, not by implementation novelty.

## Priority Queue

### Done - Data Backup And Recovery

Status: Done

Why: Current data lives in browser IndexedDB only. Before adding richer location or preference data, users need a way to move or recover their records.

Tasks:

- Export coworkers, stores, and transactions to JSON.
- Import JSON with validation before writing to IndexedDB.
- Show a clear warning before import overwrites local data.
- Add unit tests for validation and an E2E smoke test for export/import.

Acceptance:

- A user can export all local data and import it into a fresh browser profile.
- Invalid JSON or incompatible schema is rejected without changing current data.

### Done - Payment Collection

Status: Done (2026-04-27)

Why: Coworkers needed a way to pay back cash owed without going through meal order flow. Added `payment` transaction type (distinct from `topup`) with a "收款" button on each coworker balance card.

### P0 - Manual Balance Adjustment UI

Status: Todo

Why: The data model already supports `adjustment` (import only). Adding an editor closes the gap for corrections, discounts, and manual balance fixes that don't fit topup or payment.

Tasks:

- Add an adjustment entry point in Ledger (positive and negative amounts).
- Save `adjustment` transactions with date, coworker, amount, and note.
- Render adjustment records in daily summary and coworker history (already done for display, needs editor).
- Cover balance recalculation and UI flow with tests.

Acceptance:

- Positive and negative adjustments update coworker balance correctly.
- Adjustment history is auditable from daily and coworker views.

### P1 - Theater Visual Style Expansion

Status: In progress

Why: The lunch status theater is useful as a payment-state signal. Letting users choose a visual style makes it feel more personal without changing the accounting workflow.

Done:

- Add a Settings section for theater styles.
- Ship the first switchable style: Japanese anime style, using clean linework, soft cel-shaded colors, brighter expressions, and a lighter lunch-scene mood.
- Upgrade Japanese anime style from CSS-only skin to generated raster assets: one anime lunch stage background plus three transparent coworker character cutouts.
- Generate the full planned theater style asset set: 11 raster styles, 5 restaurant-type backgrounds per style, and 6 character cutouts per style (runner, foodie, thinker in female and male variants).
- Wire finished raster styles into Settings so each restaurant type can show a matching generated stage.
- Add download-gated theater style cards so first app load keeps only essential files, while raster styles become selectable after their asset pack is cached.
- Add coworker character gender selection and switch theater sprites between female and male variants.
- Add animated theater runtime support for character sheets, server NPCs, food props, and payment FX.
- Add complete fallback animation contract folders for every theater style.
- Replace `anime` fallback sheets with production generated sheets for all character actions, food states, server idle, and payment FX.
- Replace `cyberpunk` fallback sheets with production generated sheets for all character actions, food states, server idle, and payment FX.
- Replace `gothic-lolita` procedural placeholder sheets with true image-generated production sheets for all character actions, food states, server idle, and payment FX.
- Replace `pixel` fallback sheets with production generated sheets for all character actions, food states, server idle, and payment FX.

Style backlog:

- Gothic lolita: lace, ribbons, deep red and gold, ornate dessert-salon mood, elegant tea-table staging.
- Pixel style: visible pixel grid, limited palette, low-resolution silhouettes, crisp readable props and short looping animations.
- Arcade style: saturated colors, coin-op cabinet mood, high-energy flashes, bold status transitions.
- Retro 16-bit RPG: top-down 16-bit character language, tile-like floor patterns, clear outlines, compact RPG loop animations.
- Hand-painted storybook: warm paper texture, hand-drawn linework, soft props, cozy illustrated lunch scene.
- Chibi: big-head small-body proportions, rounded expressions, exaggerated cute eating and waiting poses.
- Painted fantasy RPG: richer light and shadow, tavern-like stage texture, heavier materials, more dramatic food and payment effects.
- Muted Japanese daily-life: low-saturation palette, natural light, quiet lunch-counter atmosphere, soft stationery-like surfaces.
- 90s arcade fighting: heavy outlines, impact streaks, afterimages, energetic stance animation, dramatic payment/eating transitions.

Tasks:

- Replace fallback animation sheets with production generated sheets one style at a time. Next style: `arcade`.
- Add richer per-style motion polish for idle, walk, waiting, paying, eating, and done loops.
- Keep style switching independent from ledger math, payment state, and stored transaction data.
- Add component and e2e coverage for every style that becomes selectable.

Acceptance:

- Users can switch theater style from Settings without affecting app theme or financial records.
- Unfinished styles are not selectable until their visuals and tests are ready.
- Every finished style keeps the payment state readable at mobile and desktop sizes.

#### Theater Animation Asset Spec

Goal: future agents should be able to generate new theater animation packs without rediscovering naming, placement, or runtime expectations.

Implementation handoff notes: keep [`assets/theater/generation-notes.md`](./assets/theater/generation-notes.md) updated with runtime lessons learned, especially raw intake, per-restaurant placement, checkout direction, food-state timing, cache/version bump rules, and screenshot QA.

Current baseline:

- Static stage backgrounds live at `assets/theater/{style}/stages/stage-{restaurantType}.png`.
- Static character cutouts live at `assets/theater/{style}/characters/{character}-{gender}.png`.
- `style` values: `anime`, `cyberpunk`, `gothic-lolita`, `pixel`, `arcade`, `retro-16bit`, `storybook`, `chibi`, `painted-fantasy`, `muted-jp-life`, `arcade-fighter-90s`.
- `restaurantType` values: `bento`, `drink`, `noodle`, `fastFood`, `cafe`.
- `character` values: `runner`, `foodie`, `thinker`.
- `gender` values: `female`, `male`.

Recommended animated folder contract:

```text
assets/theater/{style}/
  stages/
    stage-{restaurantType}.png
  characters/
    {character}-{gender}.png
  animated/
    {character}-{gender}/
      idle-sheet.png
      walk-right-sheet.png
      paying-sheet.png
      sit-eat-sheet.png
      done-sheet.png
      pipeline-meta-{action}.json
  props/
    food/
      {restaurantType}-food-0.png
      {restaurantType}-food-1.png
      {restaurantType}-food-2.png
  npcs/
    server-idle-sheet.png
  fx/
    payment-dollar-sheet.png
```

Animation semantics:

- `idle-sheet.png`: character waits near stage entry or counter; 2-4 frames.
- `walk-right-sheet.png`: side or 3/4 side-view walk cycle moving left to right; 4 frames preferred.
- `paying-sheet.png`: character stands at the counter and presents payment; 2-4 frames.
- `sit-eat-sheet.png`: seated pose with eating motion; 2-4 frames.
- `done-sheet.png`: seated relaxed / finished pose; 2-4 frames.
- `server-idle-sheet.png`: counter server idle loop with subtle head or upper-body motion; 2-4 frames.
- `payment-dollar-sheet.png`: short payment-confirmation effect, such as `$`, coin sparkle, or check pulse; 2-4 frames.
- `{restaurantType}-food-0.png`: meal just served.
- `{restaurantType}-food-1.png`: meal half eaten.
- `{restaurantType}-food-2.png`: empty plate / finished drink.

Runtime timeline target:

1. `idle`: no active order; character stays in a calm loop.
2. `walkToCounter`: unpaid order appears; character uses `walk-right-sheet.png` toward the counter.
3. `waitingPayment`: character switches to `paying-sheet.png` or idle-at-counter; server uses `server-idle-sheet.png`.
4. `paid`: payment transaction appears; show `payment-dollar-sheet.png`.
5. `walkToSeat`: character walks from counter toward the dining area.
6. `sitEating`: character uses `sit-eat-sheet.png`; food advances from `food-0` to `food-1`.
7. `done`: food advances to `food-2`; character uses `done-sheet.png`.

Generation guidance:

- Use the `generate2dsprite` skill for animated character, server, prop, and FX sheets.
- For the current theater layout, prefer `view: side` or `view: 3/4`; do not generate 4-direction topdown sheets until the app has a free-movement floor-map theater.
- The runtime sheet playback, seating positions, food states, and payment FX are validated. `anime`, `cyberpunk`, `gothic-lolita`, and `pixel` are complete production generated packs. Continue replacing fallback packs style by style, starting with `arcade`.
- Keep sprite identity stable against the existing static cutouts: same role silhouette, hair/costume color language, and gender presentation.
- Use solid `#FF00FF` raw sheet backgrounds so the sprite processor can chroma-key to transparent output.
- Keep frame scale and foot/seat anchor consistent across frames. Use bottom/feet anchors for walking characters and seat anchors for seated sheets.
- Avoid readable text or real brand logos in generated props, backgrounds, NPCs, or FX.
- Export transparent PNG sheets and keep `pipeline-meta.json` near the generated sheets for traceability.

Production generation workflow:

1. Generate one 2x2 raw sheet per action with `image_gen`, not with PIL, canvas, SVG, CSS, static-cutout warping, copy/paste transforms, or other procedural drawing. A production pack must have raw source metadata whose generator is `image_gen + scripts/process-theater-generated-atlas.py`. Procedural scripts may only create temporary fallback packs and must not be marked production complete.
2. Before generating a style, inspect existing complete packs such as `anime` and `cyberpunk` side by side with the target style references. The new pack must be comparable in detail density, pose variety, and style-specific material detail.
3. Generate one 2x2 raw sheet per action instead of large multi-action atlases. Large 5x4 action atlases failed QC because cell boundaries drifted and frames were clipped.
4. Use this command for each character action sheet. If the raw generated sheet contains visible grid separators, use `--cell-inset 14`; otherwise omit it so the default processor behavior stays unchanged.

```powershell
py scripts\process-theater-generated-atlas.py sheet2x2 `
  --input assets\theater\<style>\raw\generated-animated\<character-gender>\<sheet>-raw.png `
  --output assets\theater\<style>\animated\<character-gender>\<sheet>.png `
  --meta assets\theater\<style>\animated\<character-gender>\pipeline-meta-<sheet>.json `
  --style <style> `
  --subject <character-gender>-<action> `
  --align bottom `
  --cell-inset 14
```

Use `--align bottom` for `idle`, `walk-right`, and `paying`; use `--align center` for `sit-eat`, `done`, `server-idle`, and payment FX unless QC shows a better anchor.

5. Use this command for each food progression sheet:

```powershell
py scripts\process-theater-generated-atlas.py foodrow `
  --input assets\theater\<style>\raw\generated-props\<restaurantType>-food-row-raw.png `
  --output-dir assets\theater\<style>\props\food `
  --restaurant-type <restaurantType> `
  --style <style> `
  --subject <restaurantType>-food
```

6. Use `sheet2x2` for `npcs/server-idle-sheet.png` and `fx/payment-dollar-sheet.png`.
7. Raw generated files may live under `assets/theater/<style>/raw/` locally, but keep raw experiment folders out of normal PRs unless a review explicitly needs them.
8. QC every sheet before marking the style as production generated: no clipping, transparent background, stable identity, stable anchors, no readable text, no logos.
9. Quality QC is mandatory and separate from contract QC. Compare at least these outputs against `anime` and `cyberpunk`: `runner-female/walk-right-sheet.png`, `foodie-male/sit-eat-sheet.png`, `npcs/server-idle-sheet.png`, `fx/payment-dollar-sheet.png`, and one food row. The target style must show style-specific detail, varied poses, coherent lighting/materials, and comparable polish. If it looks like static cutouts, geometric placeholders, or simplified fallback art, do not mark it production complete.
10. Verify app integration after the pack is complete: the style must remain downloadable/selectable from Settings, theater style switching must load the finished animated sheets/food/server/FX, and the style must not affect ledger math, payment state, or stored transaction data. If a finished style is not selectable because of asset status, manifest, cache, or tests, update only the theater-style download/manifest/test surface needed to make it usable in the app.

#### One-Shot Theme Completion Prompt

Use this prompt when asking an AI agent to finish the next unfinished theater theme in one pass:

Short continuation request:

```text
請看 task.md，繼續生成下一個未完成劇場主題的素材並整合進 app，完成後要能直接切換使用。
```

When receiving the short continuation request above, the agent must follow the full Theater Animation Asset Spec, Hard production rule, Production generation workflow, Quality QC, app integration, task update, and verification requirements in this document. The short request is not permission to skip raw image generation, quality QC, tests, or task status updates.

```text
Follow AGENTS.md strictly, especially canonical baseline rules, scope control rules, and execution mode rules.

Read task.md, then complete the next unfinished theater animation production generated pack in one pass. Do not stop after a prototype and do not ask me to continue between character batches. Continue through asset generation, processing, QC, app integration checks, task.md updates, verification, and a clear final report.

Scope:
- Work only on the next unfinished style under `assets/theater/<style>/`, the theater asset processor if needed, theater asset manifest/download/selectability/tests if needed, and `task.md`.
- Do not modify ledger math, transaction logic, IndexedDB/localStorage schema, PWA core, manifest, service worker, or unrelated UI.
- Keep style switching independent from financial records and payment state.

Use the `generate2dsprite` skill. First inspect:
- `assets/theater/<style>/characters/*.png`
- `assets/theater/<style>/stages/*.png`
- existing complete packs such as `anime` and `cyberpunk`

Hard production rule:
- Use `image_gen` for every raw character, food, NPC, and FX sheet.
- Do not use a procedural generation script, static cutout warping, PIL drawing, CSS rendering, SVG drawing, or manually composed shapes as the source for a production pack.
- If a procedural pack is created to keep the app usable, label it as an integrated placeholder and keep the style in production-redo status.

Generate and process the complete production contract:

Characters:
- `runner-female`
- `runner-male`
- `foodie-female`
- `foodie-male`
- `thinker-female`
- `thinker-male`

Actions for every character:
- `idle-sheet.png`
- `walk-right-sheet.png`
- `paying-sheet.png`
- `sit-eat-sheet.png`
- `done-sheet.png`

Raw character sheets go under:
`assets/theater/<style>/raw/generated-animated/<character-gender>/<action>-sheet-raw.png`

Production character sheets and meta go under:
`assets/theater/<style>/animated/<character-gender>/<action>-sheet.png`
`assets/theater/<style>/animated/<character-gender>/pipeline-meta-<action>.json`

Food props:
- Generate one 1x3 row per restaurant type: `bento`, `drink`, `noodle`, `fastFood`, `cafe`.
- Raw rows go under `assets/theater/<style>/raw/generated-props/<restaurantType>-food-row-raw.png`.
- Production props must produce `<restaurantType>-food-0.png`, `<restaurantType>-food-1.png`, `<restaurantType>-food-2.png`, and `pipeline-meta-<restaurantType>.json`.

NPC / FX:
- Generate and process `npcs/server-idle-sheet.png` plus `npcs/pipeline-meta-server-idle.json`.
- Generate and process `fx/payment-dollar-sheet.png` plus `fx/pipeline-meta-payment-dollar.json`.
- Raw sheets go under `assets/theater/<style>/raw/generated-npcs-fx/`.

Prompting rules for every raw generation:
- Solid `#FF00FF` magenta background only.
- Exact grid: 2x2 for character/NPC/FX, 1x3 for food.
- No readable text, no real logos, no brand marks.
- Full body or full prop visible; nothing crosses cell edges.
- Same identity, scale, and silhouette across frames.
- Standing and walking actions use stable bottom/feet anchors.
- Seated/eating/done actions use stable seated/table anchors.
- Match the style's existing static cutouts and stage language.

Processing:
- Use `scripts/process-theater-generated-atlas.py sheet2x2` for character/NPC/FX.
- Use `scripts/process-theater-generated-atlas.py foodrow` for food.
- If a generated raw sheet includes visible grid separators, process with `--cell-inset 14`. If the processor lacks `--cell-inset`, add it as an optional argument with default `0`.

QC before completion:
- Confirm missing asset count is 0 for the full contract.
- Visually inspect representative sheets for every role, food, NPC, and FX.
- Check no clipping, no transparent-background failure, no gridline leftovers, stable identity, stable anchors, no readable text/logos, and readable payment state on small sizes.
- Run quality QC by comparing the target style with `anime` and `cyberpunk` representative sheets. Confirm it has comparable detail density, pose variety, material rendering, and style-specific visual language. Failing quality QC blocks marking the style complete even when all files exist.

App integration:
- Confirm the completed style can be downloaded/selected from Settings.
- Confirm switching to that style uses its production animated sheets, food props, server NPC, and payment FX.
- If component/e2e coverage already exists for selectable theater styles, add or update focused coverage for the completed style.

After completion:
- Update `task.md` to mark the style as production generated pack complete and move "Next style" to the next unfinished style.
- Keep raw generated folders local/untracked unless explicitly asked to include them.
- Run at least:
  `py -m compileall .\scripts\process-theater-generated-atlas.py`
  `npm run build`
- Report completed style, missing count, QC result, tests run, and any raw folders left untracked.
```

Current animation asset status:

- `anime`: production generated pack complete.
- `cyberpunk`: production generated pack complete.
- `gothic-lolita`: production generated pack complete.
- `pixel`: production generated pack complete.
- `arcade`, `retro-16bit`, `storybook`, `chibi`, `painted-fantasy`, `muted-jp-life`, `arcade-fighter-90s`: fallback packs exist; production replacement pending.

Download/cache rule:

- Keep first app load limited to app shell and manifests.
- Static theater packs can stay download-gated by style.
- Animated packs should either be included in the style download after runtime support lands, or added as a second "download animation enhancement" step if size becomes too large.

### P1 - Nearby Favorite Restaurant Recommendation

Status: Todo

Why: This is a valuable discovery feature, but it touches location permissions, Store data shape, and possible Google API usage. Build it in stages.

#### Phase 1 - Store Preference Foundation

Tasks:

- Add fields for favorite status, preference level, Google Maps URL, optional Place ID, optional latitude, and optional longitude.
- Let users mark lunch / dinner stores as favorites.
- Keep manual custom URL behavior working.
- Add tests for preference filtering and backward-compatible default values.

Acceptance:

- Existing stores still render without migration errors.
- Favorite stores can be filtered without needing location permission.

#### Phase 2 - Location Permission And Distance Sorting

Tasks:

- Add a user-triggered "nearby recommendation" action.
- Request browser geolocation only after the user taps the action.
- Calculate distance from current location to stores with coordinates.
- Provide a no-location fallback using rating, preference level, and last-used date.
- Add unit tests for distance and recommendation sorting.

Acceptance:

- Permission denial does not break the app.
- Stores with coordinates can be sorted by useful nearby recommendation score.

#### Phase 3 - Recommendation UI

Tasks:

- Add a "current recommendation" section to Lunch and Dinner views.
- Show recommendation reasons such as distance, rating, favorite level, last-used date, and meal availability.
- Let users open the existing Google Maps / custom link from the recommendation.
- Add Playwright E2E coverage for the recommendation flow with mocked geolocation.

Acceptance:

- Users can see a short ranked list of nearby favorite stores.
- The UI explains why each store is suggested without adding long instructional text.

#### Phase 4 - Google Maps / Places Enhancement

Tasks:

- First support user-pasted Google Maps links as stored metadata.
- Evaluate Google Places API only after confirming API key, billing, quota, privacy, and deployment constraints.
- If Places API is adopted, use it to resolve place details and coordinates from user input.
- Document setup requirements and fallback behavior.

Acceptance:

- The app works without a Google API key.
- API-backed enrichment is optional and does not block manual store management.

### P2 - Store Menu And Frequent Meals

Status: Todo

Why: Speeds up repeated ordering after the accounting and recommendation foundations are stable.

Tasks:

- Add frequently ordered meals under a store.
- Let order forms select a saved meal name and default amount.
- Test store meal selection and order creation.

### P3 - Search And Filtering

Status: Todo

Why: Helps once records grow.

Tasks:

- Filter coworkers by balance state.
- Search transaction history by coworker, store, meal name, and date.
- Filter store list by rating, keyword, availability, and favorite status.

### P4 - Weekly And Monthly Reports

Status: Todo

Why: Useful for review, but lower urgency than data safety and daily ordering workflows.

Tasks:

- Summarize spending by week and month.
- Summarize top stores and unpaid balances.
- Add focused tests for report calculations.

### P5 - PWA Polish

Status: Todo

Why: Improves install quality after core workflows are safer.

Tasks:

- Add iOS splash screen assets.
- Add more PWA icon sizes.
- Test install-related metadata where possible.

### Future - Multi-User Sync

Status: Backlog

Why: This changes architecture and data ownership. Do not start until local-first workflows, backup, and permissions are clear.

Tasks:

- Define account and permission model.
- Choose sync backend.
- Design conflict resolution and audit history.
