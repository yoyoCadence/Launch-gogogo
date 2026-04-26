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

### P0 - Manual Balance Adjustment

Status: Todo

Why: The data model already reserves `adjustment`. Adding UI for it closes a real accounting gap for old balances, discounts, corrections, and ad hoc payments.

Tasks:

- Add an adjustment entry point in Ledger.
- Save `adjustment` transactions with date, coworker, amount, and note.
- Render adjustment records in daily summary and coworker history.
- Cover balance recalculation and UI flow with tests.

Acceptance:

- Positive and negative adjustments update coworker balance correctly.
- Adjustment history is auditable from daily and coworker views.

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
