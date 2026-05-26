# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-before-specify-hook`

**Created**: 2026-05-26

**Status**: Draft

**Input**: User description: "Support for overdue todo items so users can clearly identify incomplete tasks past due date and prioritize work"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Highlight Overdue Todos in List (Priority: P1)

As a user viewing my todo list, I can immediately see which incomplete todos are overdue through a clear visual indicator.

**Why this priority**: This is the core value of the feature and directly enables faster prioritization.

**Independent Test**: Can be fully tested by loading a list containing incomplete todos with past due dates and confirming they are visually distinct from non-overdue items.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date before today, **When** the todo list is displayed, **Then** that todo is shown with the overdue visual treatment.
2. **Given** an incomplete todo with a due date today or later, **When** the todo list is displayed, **Then** that todo is not shown as overdue.

---

### User Story 2 - Exclude Completed Todos from Overdue State (Priority: P2)

As a user, I do not see completed tasks flagged as overdue even if their due date is in the past.

**Why this priority**: Completed work should not compete for attention with actionable overdue work.

**Independent Test**: Can be fully tested by marking a previously overdue todo as complete and verifying the overdue indicator is removed.

**Acceptance Scenarios**:

1. **Given** a todo with a past due date that is marked complete, **When** the todo list is displayed, **Then** it is not marked overdue.

---

### User Story 3 - Keep Overdue Status Accurate After Edits (Priority: P3)

As a user, overdue status updates correctly when I change a todo due date or completion status.

**Why this priority**: Accuracy over time ensures users trust the visual signal when task details change.

**Independent Test**: Can be fully tested by editing due dates and completion status for an existing todo and confirming overdue state updates immediately after save.

**Acceptance Scenarios**:

1. **Given** an overdue incomplete todo, **When** I change its due date to today or a future date and save, **Then** it is no longer shown as overdue.
2. **Given** a non-overdue todo, **When** I change its due date to a past date and keep it incomplete, **Then** it is shown as overdue.

### Edge Cases

- Todo has no due date: it is never treated as overdue.
- Due date is exactly today: it is not overdue.
- System date changes between sessions: overdue status reflects the current date when list data is rendered.
- Invalid or missing due-date value in stored data: item remains visible and is treated as non-overdue while preserving existing error-handling behavior.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine overdue status using todo completion state and due date relative to the current calendar date.
- **FR-002**: System MUST display a danger-color text/border treatment (design system danger color: `#c62828` in light mode, `#ef5350` in dark mode) on todos that are both incomplete and past due.
- **FR-003**: System MUST NOT display overdue indicators for completed todos.
- **FR-004**: System MUST NOT display overdue indicators for todos without a due date.
- **FR-005**: System MUST update overdue status after a todo edit is saved or a completion toggle is applied; live in-form updates are not required.
- **FR-006**: System MUST keep overdue status consistent after data refresh so users see the same overdue determination for the same date.
- **FR-007**: Users MUST be able to distinguish overdue, completed, and regular todo visual states without ambiguity.
- **FR-008**: System MUST preserve all existing todo capabilities (create, view, edit, complete, delete) while adding overdue indicators.
- **FR-009**: System MUST NOT reorder todo items based on overdue status; existing creation-date ordering is preserved.

### Constitution Alignment *(mandatory)*

- **CA-001 Scope**: Change is limited to visual overdue identification and status determination for existing todo flows; no authentication, collaboration, search, filtering, or bulk features are introduced.
- **CA-002 Architecture**: Frontend todo rendering and todo service logic are affected; backend API contract remains compatible and no new cross-package boundary is introduced.
- **CA-003 Testing**: Unit tests will cover overdue determination rules and visual states; integration tests will validate list behavior for mixed overdue/non-overdue/completed todos using failing-first test workflow.
- **CA-004 Accessibility and UX**: Overdue indicators use the design system danger color (`#c62828` light / `#ef5350` dark) applied as text/border treatment. Color-only communication is an accepted tradeoff for this feature; contrast must meet WCAG AA in both themes. No icon or badge is added.
- **CA-005 Maintainability**: Changes remain localized to todo display and state derivation paths with lint/test checks required before merge.

### Key Entities *(include if feature involves data)*

- **Todo Item**: Represents a task with title, optional due date, completion status, and creation metadata.
- **Overdue Status (Derived)**: A computed state indicating whether a todo is incomplete and has a due date before the current date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In usability checks, users correctly identify overdue tasks within 10 seconds for lists containing at least 20 mixed-status todos.
- **SC-002**: At least 95% of tested overdue/non-overdue/completed combinations display the correct visual state in acceptance testing.
- **SC-003**: 100% of regression tests for existing todo create/view/edit/complete/delete workflows continue to pass after introducing overdue indicators.
- **SC-004**: At least 90% of pilot users report that overdue tasks are easy to distinguish from other tasks.

## Clarifications

### Session 2026-05-26

- Q: What visual treatment should be applied to an overdue todo item? → A: Danger-color text/border only (red `#c62828` light mode / `#ef5350` dark mode from the design system).
- Q: Should overdue todo items stay in their current list position or be sorted to the top? → A: Stay in current creation-date position; no reordering based on overdue status.
- Q: When editing a todo's due date, should the overdue indicator update live or only after saving? → A: On save only; no live in-form overdue updates required.

## Assumptions

- Overdue evaluation is based on the user-facing current calendar date in the application runtime environment.
- Time-of-day granularity is not required; only date-level comparison is required for overdue determination.
- Existing due-date input and storage formats remain unchanged.
- Existing theme and component styling system is reused for overdue visual treatment.
- Desktop-focused experience remains the primary target for this feature.
