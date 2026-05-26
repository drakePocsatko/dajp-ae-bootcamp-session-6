# Contract: Overdue Computation

**Feature**: Support for Overdue Todo Items  
**Type**: Frontend utility contract  
**Location**: `packages/frontend/src/utils/overdueUtils.js`

> This feature makes no changes to the backend REST API. The only contract introduced is the `isOverdue` computation function used by the frontend rendering layer.

---

## Function Signature

```js
/**
 * Determines whether a todo item is overdue.
 * A todo is overdue when it is incomplete, has a due date set,
 * and that due date is before today's calendar date.
 *
 * @param {Object} todo - The todo item object
 * @param {number} todo.completed - 0 = incomplete, 1 = complete
 * @param {string|null|undefined} todo.dueDate - ISO date string (YYYY-MM-DD) or null/undefined
 * @returns {boolean} true if the todo is overdue, false otherwise
 */
export function isOverdue(todo)
```

---

## Behaviour Specification

| Input | Expected return |
|-------|----------------|
| `{ completed: 1, dueDate: '2020-01-01' }` | `false` — completed todos are never overdue |
| `{ completed: 0, dueDate: null }` | `false` — no due date set |
| `{ completed: 0, dueDate: undefined }` | `false` — no due date set |
| `{ completed: 0, dueDate: '' }` | `false` — empty string treated as no due date |
| `{ completed: 0, dueDate: 'invalid-date' }` | `false` — invalid date treated as no due date |
| `{ completed: 0, dueDate: <past date> }` | `true` — incomplete and past due |
| `{ completed: 0, dueDate: <today's date> }` | `false` — today is not overdue |
| `{ completed: 0, dueDate: <future date> }` | `false` — not yet due |

### Date Comparison Rule

```
today = new Date() with time set to midnight (00:00:00.000)
dueDateMs = new Date(todo.dueDate) with time set to midnight

isOverdue = todo.completed !== 1
            && dueDate is a valid, non-empty value
            && new Date(todo.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)
```

---

## CSS Contract: `.overdue` Class

Applied to `.todo-card` when `isOverdue(todo)` returns `true`.

| Selector | Property | Value |
|----------|----------|-------|
| `.todo-card.overdue` | `border-color` | `var(--danger-color)` |
| `.todo-card.overdue .todo-due-date` | `color` | `var(--danger-color)` |

Theme token values:
- Light mode: `--danger-color: #c62828`
- Dark mode (`[data-theme="dark"]`): `--danger-color: #ef5350`

---

## Unchanged Backend API

The existing REST API endpoints are not modified by this feature:

| Method | Path | Status |
|--------|------|--------|
| `GET` | `/api/todos` | Unchanged |
| `POST` | `/api/todos` | Unchanged |
| `PATCH` | `/api/todos/:id` | Unchanged |
| `DELETE` | `/api/todos/:id` | Unchanged |
