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

