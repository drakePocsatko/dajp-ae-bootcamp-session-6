<!--
Sync Impact Report
- Version change: N/A (template) -> 1.0.0
- Modified principles:
	- Template Principle 1 -> I. Scope and Simplicity First
	- Template Principle 2 -> II. Monorepo Boundary Integrity
	- Template Principle 3 -> III. Test-First and Coverage Discipline (NON-NEGOTIABLE)
	- Template Principle 4 -> IV. Accessibility and UX Consistency
	- Template Principle 5 -> V. Maintainable Code and Reviewable Changes
- Added sections:
	- Technical Standards and Constraints
	- Delivery Workflow and Quality Gates
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ .specify/templates/plan-template.md
	- ✅ .specify/templates/spec-template.md
	- ✅ .specify/templates/tasks-template.md
	- ⚠ pending: .specify/templates/commands/*.md (directory not present)
- Follow-up TODOs:
	- None
-->

# Todo App Bootcamp Constitution

## Core Principles

### I. Scope and Simplicity First
All work MUST preserve the project's defined scope: single-user todo management with
create, view, edit, complete, and delete flows, including delete confirmation and
backend persistence. Out-of-scope capabilities such as authentication, collaboration,
advanced filtering, and bulk operations MUST NOT be introduced without a formally
approved amendment to this constitution. Rationale: protecting scope prevents
accidental complexity and keeps delivery aligned with training goals.

### II. Monorepo Boundary Integrity
The application MUST retain clear separation between frontend and backend packages:
React UI concerns in frontend components and services, and Express API concerns in
backend services and app layers. Changes that affect persistence behavior MUST flow
through explicit service/API boundaries and remain compatible with existing persistence
expectations. Rationale: strict boundaries maintain predictable architecture and enable
independent testing across packages.

### III. Test-First and Coverage Discipline (NON-NEGOTIABLE)
Behavioral changes MUST begin with failing tests that describe expected outcomes,
followed by implementation and refactoring while tests stay green. Unit and
integration tests are both required when a change crosses module or package
boundaries. Repository-wide coverage MUST remain at or above 80%, and critical todo
workflows MUST be tested end to end at the unit and integration layers. Rationale:
test-first delivery reduces regressions and creates reliable change evidence.

### IV. Accessibility and UX Consistency
UI work MUST follow the documented design system: Halloween-inspired palette,
single-column layout, theme toggle behavior, and responsive spacing expectations.
All interactive controls MUST be keyboard accessible, include descriptive labels,
and satisfy WCAG AA contrast expectations in both light and dark modes. Rationale:
consistent and accessible UI is a core product requirement, not optional polish.

### V. Maintainable Code and Reviewable Changes
Code MUST follow repository coding standards: consistent formatting, naming
conventions, single-responsibility modules, organized imports, and clear error
handling. Commits MUST be atomic and explain intent, and pull requests MUST include
tests and rationale for non-trivial design decisions. Rationale: maintainable code and
small, reviewable changes improve team velocity and quality over time.

## Technical Standards and Constraints

- Language and runtime MUST remain JavaScript/Node.js across frontend and backend.
- Frontend MUST use React and backend MUST use Express unless amended.
- Data persistence MUST continue through the existing backend API mechanism.
- The app is desktop-focused; mobile-specific optimization is optional and must not
	degrade desktop usability.
- No database or storage model expansion beyond basic todo storage is allowed without
	approved specification updates.

## Delivery Workflow and Quality Gates

- Every feature spec MUST include prioritized, independently testable user stories.
- Every implementation plan MUST pass a constitution check before research and design
	begin, and must be re-checked after design.
- Task plans MUST include explicit test tasks before implementation tasks for each user
	story that changes behavior.
- Before merge, contributors MUST run linting and tests for affected packages and
	document outcomes in the pull request.
- Reviews MUST block merge when any constitutional requirement is unmet or unverified.

## Governance

This constitution is the highest-priority governance document for this repository.
When lower-level templates or instructions conflict with this document, this document
controls until dependent artifacts are updated.

Amendments MUST:
- describe the proposed change and rationale,
- identify impacted templates, workflows, and docs,
- include a migration plan for in-flight work when required,
- be approved through repository review before adoption.

Versioning policy follows semantic versioning for governance:
- MAJOR for incompatible principle removal or redefinition,
- MINOR for new principles/sections or materially expanded guidance,
- PATCH for clarifications that do not change required behavior.

Compliance review expectations:
- each plan and tasks artifact MUST show explicit constitutional alignment,
- pull request reviewers MUST verify evidence for testing and scope compliance,
- unresolved constitutional violations MUST be tracked and resolved before release.

**Version**: 1.0.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-05-26
