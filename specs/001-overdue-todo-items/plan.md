# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-before-specify-hook` | **Date**: 2026-05-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-overdue-todo-items/spec.md`

## Summary

Add a visual overdue indicator to incomplete todo items whose due date is before today's calendar date. Overdue status is computed purely on the frontend using a shared utility function. The indicator applies danger-color text and border treatment via a new `.overdue` CSS class on `.todo-card`, following the existing `.completed` class pattern. No backend changes are required.

## Technical Context

**Language/Version**: JavaScript (ES2020+), Node.js 16+, React 18

**Primary Dependencies**: React, @testing-library/react, Jest

**Storage**: N/A — overdue status is a derived/computed property; no storage changes

**Testing**: Jest + @testing-library/react (frontend unit and integration tests)

**Target Platform**: Browser — desktop-first (Chrome/Firefox/Edge)

**Project Type**: Web application — frontend React + backend Express monorepo

**Performance Goals**: Date comparison is O(1); no performance impact on list rendering

**Constraints**: No backend API changes; danger-color treatment must satisfy WCAG AA contrast in both `[data-theme="dark"]` and default light theme; changes localized to frontend package only

**Scale/Scope**: Single-user; small list scale (&lt;1000 todos)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Scope guard**: PASS — only `TodoCard.js`, `App.css`, and a new `overdueUtils.js` utility are affected. No new routes, entities, authentication, filtering, or bulk features introduced.
- **Architecture guard**: PASS — purely frontend change; backend API contract is untouched; no cross-package interface changes.
- **Test guard**: PASS — failing tests for all overdue states will be written before implementation. Unit coverage for `isOverdue()` logic and integration coverage for `TodoCard` overdue rendering are both planned.
- **UX and accessibility guard**: PASS — danger-color treatment uses `var(--danger-color)` which is defined for both `[data-theme="dark"]` and light mode. WCAG AA contrast is verified for both themes (see research.md). No icon added (accepted tradeoff).
- **Maintainability guard**: PASS — changes are localized; lint and test runs required before merge; follows the existing `.completed` CSS class pattern.

*Post-design re-check: PASS — Phase 1 design introduces no new violations.*

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/           ← Phase 1 output
│   └── overdue-computation.md
└── tasks.md             ← Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
packages/frontend/src/
├── utils/
│   ├── overdueUtils.js              # NEW: isOverdue(todo) helper
│   └── __tests__/
│       └── overdueUtils.test.js     # NEW: unit tests for overdue logic
├── components/
│   ├── TodoCard.js                  # MODIFY: add overdue class computation
│   └── __tests__/
│       └── TodoCard.test.js         # MODIFY: add overdue rendering tests
└── App.css                          # MODIFY: add .todo-card.overdue CSS rules
```

**Structure Decision**: Web application layout (Option 2). The `utils/` directory is new but follows the coding guidelines' intent to extract shared logic into utility modules. The overdue helper is placed there so it can be unit-tested independently of the React component.

## Complexity Tracking

> No constitution violations — this table is left empty intentionally.
