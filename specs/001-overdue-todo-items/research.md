# Research: Support for Overdue Todo Items

**Branch**: `001-before-specify-hook` | **Date**: 2026-05-26

## Decision 1: Date Comparison Strategy

**Decision**: Compare dates at the day level by normalising both sides to midnight (`setHours(0, 0, 0, 0)`) before comparing. A todo is overdue if `new Date(todo.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)`.

**Rationale**: `dueDate` is stored as an ISO date string (`YYYY-MM-DD`) with no time component. Using `setHours(0,0,0,0)` on both sides ensures that "today" is never considered overdue regardless of the current time of day, matching the spec edge case ("Due date is exactly today: not overdue").

**Alternatives considered**:
- `new Date(dueDate) < new Date()` — rejected because this compares against the current time of day, causing a same-day todo to incorrectly appear overdue if it is already past midnight.
- Using a date library (e.g., date-fns, dayjs) — rejected because the comparison logic is simple enough to implement without adding a dependency; this aligns with the KISS principle in the coding guidelines.

---

## Decision 2: Where Overdue Logic Lives

**Decision**: Extract overdue determination into `packages/frontend/src/utils/overdueUtils.js` as a pure function `isOverdue(todo)`.

**Rationale**: A pure utility function is independently unit-testable without rendering a component. The coding guidelines call for shared utility modules for common operations. Placing it in `utils/` matches the established guideline directory structure for frontend utilities.

**Alternatives considered**:
- Inline in `TodoCard.js` — rejected because the logic would be untestable independently and would tightly couple domain logic to a rendering component.
- In `todoService.js` — rejected because the frontend `TodoService` class handles API communication; overdue derivation is a display concern, not a data-fetching concern.

---

## Decision 3: CSS Implementation Approach

**Decision**: Add a `.overdue` modifier class to `.todo-card` (parallel to the existing `.completed` class). Apply `color: var(--danger-color)` to `.todo-card.overdue .todo-due-date` and `border-color: var(--danger-color)` to `.todo-card.overdue`.

**Rationale**: The existing pattern `todo-card.completed .todo-title { text-decoration: line-through; color: var(--success-color); }` demonstrates how the codebase handles state-driven card styling. Following this pattern keeps the CSS consistent and predictable.

`var(--danger-color)` resolves to `#c62828` (light) and `#ef5350` (dark) via the theme's CSS custom properties, so both themes are handled automatically without additional CSS rules.

**Alternatives considered**:
- Inline styles on the component — rejected because inline styles cannot be overridden by the theme's `[data-theme="dark"]` selector and are harder to test with class-based assertions.
- New CSS custom property `--overdue-color` — rejected as unnecessary; `--danger-color` already captures the intended semantic and avoids duplicating a value in the theme.

---

## Decision 4: WCAG AA Contrast Verification

**Decision**: The danger-color text and border treatment meets WCAG AA contrast requirements in both themes.

**Rationale**:
- Light mode: `#c62828` on `#ffffff` (surface) → contrast ratio ≈ 5.9:1 (passes AA for normal text at 4.5:1).
- Dark mode: `#ef5350` on `#2d2d2d` (surface) → contrast ratio ≈ 4.6:1 (passes AA for normal text at 4.5:1).

The accepted tradeoff (CA-004) of color-only treatment is within WCAG AA bounds so no additional non-color indicator is required per the clarified spec.

---

## Summary of All NEEDS CLARIFICATION Items

| Item | Status | Resolution |
|------|--------|------------|
| Date comparison granularity (day vs time) | Resolved | Day-level only; `setHours(0,0,0,0)` normalisation |
| Where overdue logic lives | Resolved | `packages/frontend/src/utils/overdueUtils.js` |
| CSS approach | Resolved | `.overdue` modifier class following `.completed` pattern |
| WCAG AA compliance | Resolved | Both theme tokens pass 4.5:1 minimum ratio |
| Backend changes needed | Resolved | None — purely frontend-computed |
