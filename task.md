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
- Wire finished raster styles into Settings so each restaurant type can show a matching generated stage; current runtime uses the female character set until gender selection is added.

Style backlog:

- Technology / cyberpunk / sci-fi UI: neon rim light, dark high-contrast surfaces, scan-line accents, holographic payment pulse, status-HUD feel.
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

- Add a coworker character gender selector and switch runtime assets between female and male variants.
- Add richer per-style motion polish for idle, walk, waiting, paying, and eating loops.
- Keep style switching independent from ledger math, payment state, and stored transaction data.
- Add component and e2e coverage for every style that becomes selectable.

Acceptance:

- Users can switch theater style from Settings without affecting app theme or financial records.
- Unfinished styles are not selectable until their visuals and tests are ready.
- Every finished style keeps the payment state readable at mobile and desktop sizes.

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
