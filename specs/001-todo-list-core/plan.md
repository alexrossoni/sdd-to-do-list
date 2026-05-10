# Implementation Plan: To-Do List Core Functionality

**Branch**: `001-todo-list-core` | **Date**: 2026-05-10 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/001-todo-list-core/spec.md`

## Summary

Build the core to-do list application: a single-page static web app that lets users add, complete, and remove tasks, with automatic `localStorage` persistence across sessions. The implementation uses a strict MVC pattern across three ES Module files (`model.js`, `view.js`, `controller.js`) with no external runtime dependencies. The visual theme is a retro command-line terminal aesthetic — dark palette, monospaced typography, simple borders, and subtle CSS microanimations.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES6+ (ES Modules, native browser)  
**Primary Dependencies**: None — vanilla stack; no npm, no bundler, no CDN JS libraries  
**Storage**: `localStorage` — JSON-serialised task array under key `sdd-todo-tasks`  
**Testing**: Manual browser testing against acceptance scenarios (no test runner in stack per constitution)  
**Target Platform**: Modern evergreen browsers (Chrome ≥ 90, Firefox ≥ 90, Safari ≥ 14, Edge ≥ 90); mobile and desktop  
**Project Type**: Static web application (single HTML page, no server-side logic)  
**Performance Goals**: Page interactive in < 2 s (SC-006); microanimations complete in < 300 ms (SC-007)  
**Constraints**: Fully offline-capable; no build tools; no npm packages; no CDN JS libraries; all user text via `textContent` (XSS prevention)  
**Scale/Scope**: Single-user, local browser only; no server, no auth, no sync

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. MVC Separation** | ✅ PASS | Spec defines strict layer contracts: `model.js` (pure functions, no DOM), `view.js` (DOM only, no logic), `controller.js` (orchestrator, no direct DOM/storage access) |
| **II. Module Pattern & Encapsulation** | ✅ PASS | ES Modules (`import`/`export`) mandated; no global scope variables; Model and View do not import each other; cross-layer calls go through Controller |
| **III. Semantic HTML & Style Decoupling** | ✅ PASS | Spec defines full semantic element table; JS selectors use `id` and `data-js`/`data-task-id` exclusively; BEM class inventory defined; no inline styles |
| **IV. Pure Functions & Immutable State** | ✅ PASS | All Model functions are pure and return new arrays; state is not mutated in place; View event handlers are thin (collect input → call Controller method) |
| **V. Simplicity & YAGNI** | ✅ PASS | No sorting, filtering, drag-to-reorder, auth, or sync; no abstraction layers beyond the mandated MVC split; tech stack is HTML5 + CSS3 + ES6+ with no additions |

**Pre-design gate result: ALL PASS — proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-list-core/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contract.md  # Phase 1 output — DOM/component interface contract
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
index.html               # Entry point; loads controller.js as ES module
style.css                # All styles (reset, layout, BEM components, theme, animations)
js/
├── model.js             # Model layer — pure functions, localStorage I/O
├── view.js              # View layer — DOM reads/writes, event bindings
└── controller.js        # Controller layer — orchestrator, application entry point
```

**Structure Decision**: Flat static site — no `src/` indirection, no build output directory. The `js/` directory holds the three MVC modules. `index.html` is the sole entry point, loading `js/controller.js` via `<script type="module">`. The existing `app.js` stub at root will be removed; its `<script>` tag in `index.html` will be replaced by the module script tag.

## Complexity Tracking

> No constitution violations identified. Table omitted.

## Post-Design Constitution Check

*Re-evaluated after Phase 1 design artifacts were generated.*

| Principle | Confirming artifact | Result |
|-----------|---------------------|--------|
| **I. MVC Separation** | `ui-contract.md` §3 invariants; `model.js` has no DOM calls; `view.js` has no storage calls; `controller.js` accesses neither DOM nor storage directly | ✅ PASS |
| **II. Encapsulation** | `STORAGE_KEY` constant private to `model.js`; `model.js` and `view.js` do not import each other; no global-scope variables | ✅ PASS |
| **III. Semantic HTML & Style Decoupling** | Full semantic element table in `ui-contract.md` §1; JS selectors use only `id` and `data-js`/`data-task-id`; BEM class inventory in spec enforced | ✅ PASS |
| **IV. Pure Functions & Immutable State** | `addTask`, `toggleTask`, `removeTask` return new arrays with no side effects; `saveTasks` is isolated; View handlers are thin | ✅ PASS |
| **V. Simplicity & YAGNI** | No external JS libraries; no pre-built features; `renderTaskList` empty-state handling is a concrete, present single use case | ✅ PASS |

**Post-design gate result: ALL PASS — ready for `/speckit.tasks`.**
