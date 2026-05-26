# Quickstart: Support for Overdue Todo Items

**Branch**: `001-before-specify-hook` | **Date**: 2026-05-26

## Prerequisites

```bash
# From repository root
npm install
```

## Running the Application

```bash
# Start both frontend and backend
npm run start
```

Frontend: http://localhost:3000  
Backend: http://localhost:3001

---

## Manual Verification Checklist

### 1. Overdue item shows danger-color treatment

1. Open the app at http://localhost:3000.
2. Add a new todo with a title and a due date **in the past** (e.g., yesterday or any earlier date).
3. Leave the todo incomplete.
4. **Expected**: The due date text and card border are displayed in red (danger color).

### 2. Today's due date is NOT overdue

1. Add a todo with today's date as the due date.
2. Leave it incomplete.
3. **Expected**: No red overdue treatment — card appears as a normal incomplete todo.

### 3. Future due date is NOT overdue

1. Add a todo with a due date at least one day in the future.
2. Leave it incomplete.
3. **Expected**: No red overdue treatment.

### 4. Completed overdue todo is NOT marked overdue

1. Add a todo with a past due date.
2. Confirm the overdue treatment is visible (red).
3. Check the checkbox to mark it complete.
4. **Expected**: The overdue red treatment disappears; the card shows the completed (strike-through) style instead.

### 5. Editing a due date clears overdue after save

1. Add a todo with a past due date (shows as overdue).
2. Click Edit.
3. Change the due date to today or a future date.
4. Click Save.
5. **Expected**: The overdue treatment is removed immediately after save.

### 6. Dark mode

1. Toggle to dark mode (moon icon in the header).
2. Repeat step 1 from verification #1.
3. **Expected**: The overdue treatment uses the dark-mode danger color (`#ef5350`, a lighter red).

---

## Running Tests

```bash
# All packages
npm test

# Frontend only
npm test --workspace=packages/frontend

# With coverage report
npm test --workspace=packages/frontend -- --coverage
```

### Key test files to inspect

| File | What it covers |
|------|---------------|
| `packages/frontend/src/utils/__tests__/overdueUtils.test.js` | Unit tests for `isOverdue()` logic including all state-matrix combinations |
| `packages/frontend/src/components/__tests__/TodoCard.test.js` | Integration tests for overdue class rendering, completed-overdue exclusion, and post-edit state |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Overdue color not appearing | CSS `.overdue` class not added to `.todo-card` | Check `TodoCard.js` class computation |
| Overdue color wrong in dark mode | `--danger-color` not set in `[data-theme="dark"]` | Check `packages/frontend/src/styles/theme.css` |
| Today's todos showing as overdue | Off-by-one in date comparison | Verify `setHours(0,0,0,0)` is applied to both sides in `overdueUtils.js` |
| Overdue state not clearing after edit | State not re-evaluated after save | Confirm `todo` prop is refreshed from parent after `onEdit` resolves |
