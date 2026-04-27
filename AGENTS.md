# AGENTS.md

This file is the shared collaboration contract for Codex, Claude Code, and human contributors working on Launch-GoGoGo.


## 1. Architecture Philosophy

Contributors should preserve these principles:

- Keep the Vanilla JS architecture unless explicitly directed otherwise.
- New modules should be loosely coupled and easy to remove or evolve.
- Follow PWA first, hybrid ready.
- Build the parent architecture first, then add large features.
- Keep future 3D systems isolated from current core progression logic.

## 2. High-Risk Change Rules


Avoid modifying:

- data structure without clear reason
- storage logic (IndexedDB / localStorage)
- PWA core (service worker, manifest)

Always explain before changing:
- data schema
- transaction logic

## 3. Scope Control Rules

Agents must strictly limit changes to the requested scope.

Do NOT:

- Refactor unrelated files "while you are here"
- Rename or restructure directories outside the task scope
- Modify styling, formatting, or naming conventions globally without instruction

If improvement is detected outside scope:

- Propose it instead of implementing it

## 4. Current Technical State (updated 2026-04-27)

### Transaction types
| type | balance effect | has editor UI |
|------|---------------|---------------|
| `topup` | +amount | yes |
| `payment` | +amount | yes (收款，distinct from topup) |
| `mealOrder` | -amount if prepaidBalance or unpaid | yes |
| `adjustment` | +amount (can be negative) | no — import only |

### Test coverage
- Unit tests: `tests/unit/app-core.test.js` (13 tests)
- Component tests: `tests/component/app-ui.test.js` (8 tests)
- E2E tests: `tests/e2e/` (Playwright, Chromium + Pixel 7, port 4173)
- Run unit + component: `npm test`

### Service worker
- Current cache version: `launch-gogogo-pwa-v4`
- Bump version string when deploying changes to cached assets

### Main branch features (as of 2026-04-27)
- Coworker groups and avatar upload
- Optional meal name (blank saves as「未指定餐點」)
- Payment collection (`payment` type, coworker card button)
- Bug fixes: adjustment rendering in Ledger/history, SW pre-cache for app-core.js

