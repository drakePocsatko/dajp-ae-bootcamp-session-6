# Data Model: Support for Overdue Todo Items

**Branch**: `001-before-specify-hook` | **Date**: 2026-05-26

## Existing Entity: Todo Item

No changes to the stored data model. All fields are pre-existing.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | integer | Yes | Auto-assigned by backend |
| `title` | string | Yes | Max 255 characters |
| `dueDate` | string (ISO date `YYYY-MM-DD`) | No | `null` when not set |
| `completed` | integer (0 or 1) | Yes | `0` = incomplete, `1` = complete |
| `createdAt` | string (ISO datetime) | Yes | Set on creation; drives list ordering |

**Storage location**: Backend in-memory store via `packages/backend/src/services/todoService.js`. No schema changes.

---

## Derived Property: Overdue Status

This is a **computed, non-stored** property derived entirely on the frontend at render time.

| Property | Type | Source |
|----------|------|--------|
| `isOverdue` | boolean | Computed by `isOverdue(todo)` in `packages/frontend/src/utils/overdueUtils.js` |

### Computation Rule

```
isOverdue(todo) → boolean

true  when:  todo.completed !== 1
             AND todo.dueDate is not null/undefined/empty
             AND date(todo.dueDate) < date(today)   // day-level comparison

false otherwise (no due date, completed, or due today or in the future)
```

### State Matrix

| `completed` | `dueDate` | `dueDate` vs today | `isOverdue` |
|-------------|-----------|---------------------|-------------|
| 1 (complete) | any | any | **false** |
| 0 (incomplete) | null | — | **false** |
| 0 (incomplete) | set | in the past | **true** |
| 0 (incomplete) | set | today | **false** |
| 0 (incomplete) | set | in the future | **false** |

---

## Visual State Summary

Three mutually exclusive visual states exist per card. They are applied in priority order:

| Priority | Class applied to `.todo-card` | When |
|----------|-------------------------------|------|
| 1 | `.completed` | `todo.completed === 1` |
| 2 | `.overdue` | `isOverdue(todo) === true` (implies `completed !== 1`) |
| 3 | *(neither)* | Incomplete with no due date, or due date is today or future |

A completed todo is never simultaneously `.overdue`. Completed takes precedence in the class calculation.

---

## Validation Rules

| Rule | Description |
|------|-------------|
| Invalid `dueDate` value | If `new Date(dueDate)` produces `NaN`, treat as no due date → not overdue |
| Missing `dueDate` field | Treat same as `null` → not overdue |
| Timezone | Use client's local date (via `new Date()`) for "today"; no server timezone dependency |
