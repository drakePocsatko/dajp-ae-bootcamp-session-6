---
description: "Task list for: Support for Overdue Todo Items"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-items/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/overdue-computation.md ✅ | quickstart.md ✅

**Tests**: Test tasks are REQUIRED for behavior changes per constitution (Principle III). Write tests first — ensure they FAIL — then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in every task description

---

## Phase 1: Setup (Baseline Verification)

**Purpose**: Confirm test infrastructure is green before any changes are made.

- [X] T001 Verify frontend tests pass from clean baseline by running `npm test --workspace=packages/frontend` and confirming all existing tests pass

**Checkpoint**: Baseline green — safe to begin Foundational work.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the `isOverdue()` utility that ALL three user stories depend on. No user story work can begin until this phase is complete.

**⚠️ CRITICAL**: Write tests first, confirm they FAIL, then implement.

- [X] T002 Write failing unit tests covering all 7 contract cases for `isOverdue()` in `packages/frontend/src/utils/__tests__/overdueUtils.test.js` (completed=true→false, no dueDate→false, empty string→false, invalid date→false, past date→true, today→false, future→false)
- [X] T003 Implement `isOverdue(todo)` using day-level midnight comparison in `packages/frontend/src/utils/overdueUtils.js` to make T002 tests pass

**Checkpoint**: `isOverdue()` is fully tested and green — all user story phases may now proceed.

---

## Phase 3: User Story 1 - Highlight Overdue Todos in List (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with a due date before today display danger-color text and border treatment.

**Independent Test**: Render a `TodoCard` with `completed: 0` and a past due date → card element has `.overdue` class. Render with today or future date → no `.overdue` class.

### Tests for User Story 1 ⚠️

> **NOTE: These tests are REQUIRED for behavior changes. Write them FIRST and ensure they FAIL before implementation.**

- [X] T004 [US1] Write failing tests in `packages/frontend/src/components/__tests__/TodoCard.test.js`: (a) incomplete todo with past due date renders with `.overdue` class; (b) incomplete todo with today's date has no `.overdue` class; (c) incomplete todo with future date has no `.overdue` class; (d) incomplete todo with no due date has no `.overdue` class

### Implementation for User Story 1

- [X] T005 [P] [US1] Add `.todo-card.overdue` CSS rules to `packages/frontend/src/App.css`: `border-color: var(--danger-color)` on `.todo-card.overdue` and `color: var(--danger-color)` on `.todo-card.overdue .todo-due-date`
- [X] T006 [US1] Add overdue class computation to the `TodoCard` view render in `packages/frontend/src/components/TodoCard.js`: import `isOverdue` from `../../utils/overdueUtils` and add `overdue` to the card's `className` when `isOverdue(todo)` returns true (makes T004 tests pass)

**Checkpoint**: User Story 1 fully functional and independently testable. Render `TodoCard` with past/today/future/no dates and confirm overdue class behavior is correct.

---

## Phase 4: User Story 2 - Exclude Completed Todos from Overdue State (Priority: P2)

**Goal**: Completed todos are never shown as overdue, even when their due date is in the past.

**Independent Test**: Render a `TodoCard` with `completed: 1` and a past due date → card element has no `.overdue` class.

### Tests for User Story 2 ⚠️

> **NOTE: These tests are REQUIRED for behavior changes. Write them FIRST and ensure they FAIL before implementation.**

- [X] T007 [US2] Write failing test in `packages/frontend/src/components/__tests__/TodoCard.test.js`: completed todo (`completed: 1`) with a past due date does NOT render with the `.overdue` class

### Implementation for User Story 2

No new implementation files required — the `isOverdue()` function already returns `false` when `todo.completed === 1`, and `TodoCard.js` uses `isOverdue(todo)` for the class decision. T007 tests pass once Phase 3 implementation is complete; this phase documents the explicit acceptance test for US2.

**Checkpoint**: User Story 2 independently verified — completed todos with past due dates never show overdue treatment.

---

## Phase 5: User Story 3 - Keep Overdue Status Accurate After Edits (Priority: P3)

**Goal**: Overdue status re-evaluates correctly after a todo's due date or completion state changes and is saved.

**Independent Test**: Simulate a `todo` prop change (due date moves from past to future) on a rendered `TodoCard` and confirm `.overdue` class is removed after re-render; simulate a date change to a past date on a non-overdue todo and confirm `.overdue` class is added.

### Tests for User Story 3 ⚠️

> **NOTE: These tests are REQUIRED for behavior changes. Write them FIRST and ensure they FAIL before implementation.**

- [X] T008 [US3] Write failing tests in `packages/frontend/src/components/__tests__/TodoCard.test.js`: (a) re-render `TodoCard` with updated `todo` prop where due date changes from past to future → `.overdue` class removed; (b) re-render with due date changing from future to past on incomplete todo → `.overdue` class added; (c) re-render with `completed` toggled to `1` on an overdue todo → `.overdue` class removed

### Implementation for User Story 3

No new implementation files required — overdue status is derived from `todo` props at render time, so React's re-render on prop change automatically handles all US3 scenarios. T008 tests verify the correct prop-driven behavior is already satisfied by the Phase 3 implementation.

**Checkpoint**: All three user stories fully functional and independently verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates, WCAG validation, and regression verification.

- [X] T009 [P] Run `npm test --workspace=packages/frontend -- --coverage` and verify overall coverage remains ≥80%; address any gaps in `packages/frontend/src/utils/__tests__/overdueUtils.test.js` or `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [X] T010 [P] Run linting in the frontend package with `npm run lint --workspace=packages/frontend` (or ESLint directly) and resolve all warnings and errors
- [ ] T011 Validate WCAG AA contrast and theme behavior manually in both light and dark modes per the quickstart.md verification checklist (scenarios 1–6)
- [X] T012 Run the full test suite at the repository root (`npm test`) to confirm no regressions in the backend package or other frontend tests
- [ ] T013 Run quickstart.md validation: start the app (`npm run start`) and manually execute all 6 verification scenarios end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — confirms baseline green.
- **Foundational (Phase 2)**: Depends on Phase 1 completion — **BLOCKS all user story phases**.
- **User Story 1 (Phase 3)**: Depends on Phase 2 — first and only phase with new implementation code.
- **User Story 2 (Phase 4)**: Depends on Phase 3 being complete (same implementation files). Tests can be written in parallel with Phase 3 tests but implementation validation requires Phase 3 done.
- **User Story 3 (Phase 5)**: Same dependency as US2 — test-only phase requiring Phase 3 implementation.
- **Polish (Phase 6)**: Depends on all desired user stories being implemented and tested.

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational only — new `isOverdue()` utility + CSS + `TodoCard.js` changes.
- **US2 (P2)**: Depends on US1 implementation — exclusively test/acceptance coverage, no new code.
- **US3 (P3)**: Depends on US1 implementation — exclusively test/acceptance coverage, no new code.

### Within Each Phase

- Tests MUST be written and confirmed failing before implementation tasks in that phase.
- T005 (CSS) and T004 (tests) in Phase 3 can be done in parallel — different files, no dependency.
- T009 (coverage) and T010 (lint) in Phase 6 can be done in parallel — independent checks.

---

## Parallel Opportunities

### Phase 3 — User Story 1

```
# These two tasks can be worked in parallel (different files):
T004: Write failing TodoCard overdue tests  →  packages/frontend/src/components/__tests__/TodoCard.test.js
T005: Add .overdue CSS rules               →  packages/frontend/src/App.css

# T006 depends on T003 (isOverdue utility), T004 (tests exist), T005 (CSS exists):
T006: Update TodoCard.js class computation →  packages/frontend/src/components/TodoCard.js
```

### Phase 6 — Polish

```
# These two tasks can be worked in parallel (independent tools):
T009: Coverage report check
T010: Lint check
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (baseline verification)
2. Complete Phase 2: Foundational — `isOverdue()` utility with tests
3. Complete Phase 3: User Story 1 — CSS + TodoCard changes with tests
4. **STOP and VALIDATE**: Render list with mixed past/today/future/completed todos; confirm overdue class behavior matches contract
5. Run Phase 6 quality gates
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → `isOverdue()` utility ready
2. User Story 1 → Overdue visual treatment in list → **MVP: fully demoable**
3. User Story 2 → Explicit verified exclusion of completed todos
4. User Story 3 → Verified post-edit/post-toggle accuracy
5. Each story adds verified coverage without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps each task to a specific user story for traceability
- US2 and US3 are test-only phases — the implementation from US1 + Foundational already satisfies them
- `isOverdue()` is a pure function — no mocking needed, just deterministic inputs/outputs
- `TodoCard` overdue class is props-driven — no internal state to manage; all US3 re-render behavior is automatic
- Commit after each phase checkpoint to create clean rollback points
