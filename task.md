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

- Replace fallback animation sheets with production generated sheets one style at a time. Next style: `gothic-lolita`.
- Add richer per-style motion polish for idle, walk, waiting, paying, eating, and done loops.
- Keep style switching independent from ledger math, payment state, and stored transaction data.
- Add component and e2e coverage for every style that becomes selectable.

Acceptance:

- Users can switch theater style from Settings without affecting app theme or financial records.
- Unfinished styles are not selectable until their visuals and tests are ready.
- Every finished style keeps the payment state readable at mobile and desktop sizes.

#### Theater Animation Asset Spec

Goal: future agents should be able to generate new theater animation packs without rediscovering naming, placement, or runtime expectations.

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
      pipeline-meta.json
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
- The runtime sheet playback, seating positions, food states, and payment FX are validated. `anime` and `cyberpunk` are complete production generated packs. Continue replacing fallback packs style by style, starting with `gothic-lolita`.
- Keep sprite identity stable against the existing static cutouts: same role silhouette, hair/costume color language, and gender presentation.
- Use solid `#FF00FF` raw sheet backgrounds so the sprite processor can chroma-key to transparent output.
- Keep frame scale and foot/seat anchor consistent across frames. Use bottom/feet anchors for walking characters and seat anchors for seated sheets.
- Avoid readable text or real brand logos in generated props, backgrounds, NPCs, or FX.
- Export transparent PNG sheets and keep `pipeline-meta.json` near the generated sheets for traceability.

Production generation workflow:

1. Generate one 2x2 raw sheet per action instead of large multi-action atlases. Large 5x4 action atlases failed QC because cell boundaries drifted and frames were clipped.
2. Use this command for each character action sheet:

```powershell
py scripts\process-theater-generated-atlas.py sheet2x2 `
  --input assets\theater\<style>\raw\generated-animated\<character-gender>\<sheet>-raw.png `
  --output assets\theater\<style>\animated\<character-gender>\<sheet>.png `
  --meta assets\theater\<style>\animated\<character-gender>\pipeline-meta-<sheet>.json `
  --style <style> `
  --subject <character-gender>-<action>
```

3. Use this command for each food progression sheet:

```powershell
py scripts\process-theater-generated-atlas.py foodrow `
  --input assets\theater\<style>\raw\generated-props\<restaurantType>-food-row-raw.png `
  --output-dir assets\theater\<style>\props\food `
  --restaurant-type <restaurantType> `
  --style <style> `
  --subject <restaurantType>-food
```

4. Use `sheet2x2` for `npcs/server-idle-sheet.png` and `fx/payment-dollar-sheet.png`.
5. Raw generated files may live under `assets/theater/<style>/raw/` locally, but keep raw experiment folders out of normal PRs unless a review explicitly needs them.
6. QC every sheet before marking the style as production generated: no clipping, transparent background, stable identity, stable anchors, no readable text, no logos.

Current animation asset status:

- `anime`: production generated pack complete.
- `cyberpunk`: production generated pack complete.
- `gothic-lolita`, `pixel`, `arcade`, `retro-16bit`, `storybook`, `chibi`, `painted-fantasy`, `muted-jp-life`, `arcade-fighter-90s`: fallback packs exist; production replacement pending.

Suggested first prototype scope:

- `assets/theater/anime/animated/{character}-{gender}/walk-right-sheet.png` for all 3 characters x 2 genders.
- `assets/theater/anime/animated/{character}-{gender}/paying-sheet.png` for all 3 characters x 2 genders.
- `assets/theater/anime/animated/{character}-{gender}/sit-eat-sheet.png` for all 3 characters x 2 genders.
- `assets/theater/anime/props/food/{restaurantType}-food-{0,1,2}.png` for all 5 restaurant types.
- `assets/theater/anime/npcs/server-idle-sheet.png`.
- `assets/theater/anime/fx/payment-dollar-sheet.png`.

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
