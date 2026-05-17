<!--
SYNC IMPACT REPORT
==================
Version change: N/A (initial constitution) → 1.0.0
Bump rationale: Initial constitution creation — establishes governance baseline for the project.

Modified principles: N/A (first version)

Added sections:
  - Core Principles (5 principles tailored to Vanilla JS MVC To-Do List)
  - Architecture & Code Quality Constraints
  - Spec-Driven Development Workflow
  - Governance

Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ aligned (Constitution Check references generic gates)
  - .specify/templates/spec-template.md — ✅ aligned (no constitution-specific constraints violated)
  - .specify/templates/tasks-template.md — ✅ aligned (task phases match SDD workflow)
  - .specify/templates/commands/*.md — ✅ no agent-specific references found

Follow-up TODOs:
  - None
-->

# SDD To-Do List Constitution

## Core Principles

### I. Strict MVC Separation

Every module belongs to exactly one layer: Model, View, or Controller. Cross-layer imports flow in one direction only: Controller → Model and Controller → View. The View MAY import read-only helpers from the Model (e.g., `isOverdue`) for rendering decisions, but MUST NOT mutate state. The Model MUST NOT import from View or Controller. The Controller orchestrates — it reads from the Model, instructs the View, and holds transient application state.

**Rationale**: Prevents circular dependencies, keeps each layer independently understandable and replaceable.

### II. Immutable Data Flow (NON-NEGOTIABLE)

All Model functions that transform data MUST return new arrays or objects — never mutate the input. Functions like `addTask`, `removeTask`, `toggleTask`, and `sortTasksByDeadline` return fresh arrays. The Controller holds the single source of truth in `state.tasks` and replaces it entirely on each mutation. Persistence (`saveTasks`) is called immediately after every state change.

**Rationale**: Predictable state transitions, trivial debugging, no hidden side effects, easy to add undo/redo later.

### III. Pure Model, Side-Effect-Free Core

Model functions MUST be pure: same input → same output, no DOM access, no network calls, no `localStorage` reads inside transformation functions. Side effects (`loadTasks`, `saveTasks`) are isolated at the boundaries and clearly named. Validation (`validateTaskText`) returns a typed result object `{ valid, error }` — never throws.

**Rationale**: Model logic is independently testable without a browser, DOM, or storage. Enables future migration to Web Workers or server-side rendering.

### IV. Accessibility-First Markup

All interactive elements MUST be native HTML buttons or inputs with explicit `aria-label` attributes. Error messages use `aria-live="polite"` and `role="alert"`. The task list uses `aria-label`. Keyboard navigation MUST work without a mouse. Visual focus states MUST be visible (`outline` or equivalent). Color contrast MUST meet WCAG AA minimums.

**Rationale**: The app is a terminal-styled UI but must remain usable by screen readers and keyboard-only users. Aesthetic choices never override accessibility.

### V. Zero-Dependency Vanilla

The project uses only vanilla HTML5, CSS3, and JavaScript (ES6+ modules). No build tools, no frameworks, no package managers for runtime code. External resources are limited to: (a) a single Google Fonts import for typography, and (b) the browser's native `localStorage` API for persistence. If a capability requires a library, reimplement it in vanilla JS or defer the feature.

**Rationale**: Keeps the project lightweight, instantly runnable (open `index.html` or serve statically), and focused on fundamentals. Eliminates supply-chain risk and build-step complexity.

## Architecture & Code Quality Constraints

### File Organization

- `index.html` — semantic markup, no inline scripts or styles
- `style.css` — all styles, BEM naming convention, CSS custom properties for theming
- `js/model.js` — data types, persistence, validation, transformations (pure functions)
- `js/view.js` — DOM queries, element creation, rendering, event binding
- `js/controller.js` — application state, event handlers, orchestration, initialization

### Naming Conventions

- BEM for CSS: `.block__element--modifier`
- `data-js` attributes on interactive DOM elements for event delegation targets
- JSDoc `@typedef` for data structures (e.g., `Task`)
- Exported functions use `camelCase`, descriptive verb-noun patterns

### Error Handling

- Validation errors display inline via dedicated error elements, never `alert()` or `console.error()` in production
- `loadTasks` catches all exceptions and returns `[]` — the app never crashes on corrupt storage
- Notification permission is requested lazily (only when a deadline is set), not on page load

### Performance

- Event delegation on the list container — no per-item listener registration for toggle/remove
- `setInterval` for deadline checking runs at 30-second cadence, not every frame
- Animations use CSS `@keyframes` with `animationend` listeners for cleanup — no `setTimeout`-based animation timing
- Re-render uses `innerHTML = ''` + full list rebuild — acceptable for the expected task count (< 200); if performance degrades, switch to diff-based updates

## Spec-Driven Development Workflow

### Spec-First Requirement

Every feature begins with a specification in `specs/[###-feature-name]/spec.md` following the spec template. No code is written until the spec is drafted and reviewed.

### Plan Before Tasks

After the spec, an implementation plan (`plan.md`) is created with technical context, Constitution Check gates, and project structure decisions. Only then are tasks generated (`tasks.md`).

### Task-Driven Implementation

Implementation follows the task list sequentially. Each task is a discrete, commitable unit. Tasks within a user story are independently testable.

### Living Documentation

Documentation is generated via MkDocs (`docs/` and `mkdocs.yml`). Feature docs in `docs/features/` mirror the spec structure. The `site/` directory is the built output and is gitignored.

## Governance

This constitution supersedes all other development practices in the project. Any deviation requires documented justification in the relevant `plan.md` Complexity Tracking table. Amendments to this constitution require:

1. A clear rationale for the change
2. Review of impact on existing code and specs
3. Version bump following semantic versioning:
   - **MAJOR**: Removal or redefinition of a principle
   - **MINOR**: Addition of a principle or section, material expansion of guidance
   - **PATCH**: Clarifications, wording improvements, typo fixes
4. Update to the Sync Impact Report at the top of this file

All PRs and code reviews MUST verify compliance with these principles. When in doubt, prefer simplicity and readability over cleverness.

**Version**: 1.0.0 | **Ratified**: 2026-05-10 | **Last Amended**: 2026-05-17
