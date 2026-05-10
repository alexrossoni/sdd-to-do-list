# Research: To-Do List Core Functionality

**Feature**: `001-todo-list-core`  
**Phase**: 0 — Outline & Research  
**Date**: 2026-05-10

This document resolves all open questions identified during Technical Context filling. Each entry states the decision, its rationale, and the alternatives considered.

---

## R-001: Font Loading — JetBrains Mono vs. Constitution's "No CDN Libraries" Rule

**Question**: The spec says JetBrains Mono should be loaded from a CDN. The constitution prohibits "external runtime dependencies (npm packages, CDN libraries)". Does a font CDN count as a prohibited CDN library?

**Decision**: Load JetBrains Mono via Google Fonts CDN `@import` in the CSS file. This is permitted.

**Rationale**: The constitution's prohibition targets JavaScript runtime libraries — code that executes in the browser and could introduce supply-chain risk, versioning conflicts, or broken functionality. The phrase "CDN libraries" in context means JS libraries (equivalent to npm packages delivered via CDN). A web font served from a CDN is a passive asset; it does not execute, has no API surface, and cannot affect application logic. Its failure mode is graceful: the CSS `font-family` fallback (`Courier New`) activates automatically. This interpretation is consistent with YAGNI — self-hosting JetBrains Mono would add build complexity (font file management, CORS headers, local file serving) with no functional benefit for this project.

**Implementation note**: The `@import` URL will use `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap`. The CSS `font-family` rule MUST always include `'Courier New', monospace` as fallbacks immediately after `'JetBrains Mono'`.

**Alternatives considered**:
- Self-host the font files (WOFF2) — Rejected: adds file management overhead and requires a local or CDN static server; unnecessary complexity for a single-page MVP.
- Use only `Courier New` — Rejected: the retro-terminal aesthetic is a stated user requirement; JetBrains Mono is the designated font; this would not meet FR-010.
- Use `@font-face` with a different CDN (Bunny Fonts) — Considered as a privacy-preserving alternative to Google Fonts; deferred. Google Fonts is the simplest path; this can be revisited without a spec amendment.

---

## R-002: ES Module Loading Without a Bundler

**Question**: The constitution mandates ES Modules (`import`/`export`). The project has no bundler. How should modules be loaded in the browser?

**Decision**: Use native ES Modules via `<script type="module" src="js/controller.js">` in `index.html`. Inter-module imports use relative paths (e.g., `import { loadTasks } from './model.js'`).

**Rationale**: All target browsers (Chrome ≥ 90, Firefox ≥ 90, Safari ≥ 14, Edge ≥ 90) fully support native ES Modules. No transpilation or bundling is needed. The `type="module"` attribute also implicitly defers script execution until the DOM is parsed, removing any need for `DOMContentLoaded` event wrapping in the controller.

**Implementation notes**:
- `index.html` will have a single script tag: `<script type="module" src="js/controller.js"></script>`.
- `js/controller.js` imports from `./model.js` and `./view.js`.
- `js/model.js` and `js/view.js` do not import each other (constitution mandate).
- The existing `app.js` at the project root will be deleted; the corresponding `<script src="app.js">` tag in `index.html` will be replaced.
- When opening the file directly via `file://` protocol, CORS restrictions prevent ES Module imports in some browsers. A local static file server (`python -m http.server` or VS Code Live Server) MUST be used for development. This is documented in quickstart.md.

**Alternatives considered**:
- IIFE-based namespaces — constitution explicitly offers this as a fallback "where module bundling is unavailable"; since native ES Modules are available in all target browsers, IIFE is unnecessary.
- A bundler (Vite, Rollup, esbuild) — Rejected: constitution prohibits build tools; this is a zero-build-tool project.

---

## R-003: Task ID Generation Strategy

**Question**: What strategy should be used to generate unique `id` values for new tasks?

**Decision**: `Date.now().toString()` — a decimal string of the Unix timestamp in milliseconds at creation time.

**Rationale**: In a single-user, single-tab application where tasks are added through UI interaction (requiring at minimum one keypress and one click), two tasks cannot be created at the exact same millisecond through normal usage. The resulting IDs are short, readable, and trivially serialisable. UUID generation (crypto.randomUUID) is a valid and slightly more robust alternative, but adds complexity without a real-world benefit for this scope.

**Implementation note**: Generated in `addTask(tasks, text)` in `model.js` as `id: Date.now().toString()`.

**Alternatives considered**:
- `crypto.randomUUID()` — Available in all target browsers; collision-proof; slightly longer string. Considered acceptable. Deferred in favour of `Date.now()` per YAGNI: the simpler option solves the problem fully.
- Sequential integer counter — Requires persisting the counter separately or scanning the array for `Math.max`; more complex than timestamp.
- `Math.random().toString(36)` — Collision probability non-zero and not time-ordered; rejected.

---

## R-004: localStorage Key Name

**Question**: What key name should the application use when reading/writing to `localStorage`?

**Decision**: `sdd-todo-tasks`

**Rationale**: The prefix `sdd` (matching the repository name `sdd-to-do-list`) namespaces the key to avoid collisions with other applications running on the same origin (e.g., `localhost`). The suffix `tasks` is self-descriptive. The key is a single, stable string — no versioning suffix needed at this stage; a future spec amendment would handle migration if the schema changes.

**Implementation note**: The key is defined as a single constant at the top of `model.js`:
```js
const STORAGE_KEY = 'sdd-todo-tasks';
```
All `loadTasks` and `saveTasks` functions reference this constant.

---

## R-005: CSS Microanimation Pattern for Enter and Leave

**Question**: The spec defines `.todo-item--entering` and `.todo-item--leaving` modifier classes for list item animations. What is the correct implementation pattern to apply and then remove these classes, especially for "leave" animations where the item must remain in the DOM until the animation completes?

**Decision**: Use CSS `@keyframes` for both enter and leave animations. JavaScript applies/removes the modifier class, and for leave animations, waits for the `animationend` DOM event before removing the element.

**Rationale**: CSS `@keyframes` animations provide declarative, GPU-compositable motion. The `animationend` event is the standard mechanism for sequencing DOM removal after a CSS animation completes, without relying on `setTimeout` (which would require duplicating the duration in JS).

**Implementation pattern** in `view.js`:
```js
// Enter: apply class on insertion, remove after animation
li.classList.add('todo-item--entering');
li.addEventListener('animationend', () => {
  li.classList.remove('todo-item--entering');
}, { once: true });

// Leave: apply class, wait for animation, then remove DOM node
function removeWithAnimation(li) {
  li.classList.add('todo-item--leaving');
  li.addEventListener('animationend', () => li.remove(), { once: true });
}
```

**Animation specs** (to be implemented in CSS):
- Enter: fade + slide-in from top, 200 ms, `ease-out`
- Leave: fade + slide-out to right, 200 ms, `ease-in`
- Toggle (done state): CSS `transition` on `opacity` and `text-decoration`, 150 ms — no class needed, driven by `--done` modifier

**Alternatives considered**:
- `setTimeout` matching animation duration — Fragile (duration duplicated in JS); rejected.
- Web Animations API (`element.animate()`) — More programmatic control; not needed for these simple animations; rejected per YAGNI.
- CSS `transition` only — Transitions require a change between two defined states and cannot animate insertion/removal naturally; `@keyframes` is more appropriate for enter/leave.

---

## R-006: Empty Task List Visual State (Design Decision)

**Question**: The spec does not specify what to render when the task list has zero items. The clarification session raised this as Question 1 but was not answered before proceeding to planning.

**Decision**: Render a `<p>` placeholder element with a prompt text inside `<ul id="js-todo-list">` when the list is empty. Remove it when the first task is added.

**Rationale**: An empty `<ul>` with no content creates an awkward visual gap between the form and the page edge, particularly on large viewports. A placeholder message is consistent with the retro-terminal aesthetic (it echoes a terminal "waiting for input" prompt) and guides first-time users. Two View functions handle this: `showEmptyState()` and `hideEmptyState()`, both called from `renderTaskList()`. This adds minimal complexity (one HTML element rendered conditionally in JS, one CSS rule).

**Placeholder text**: `"> no tasks. type above and press enter."` — lowercase, terminal-style prompt prefix, consistent with the retro theme.

**Implementation note**: The `<p>` element is created and inserted by `renderTaskList` in `view.js` when `tasks.length === 0`; it is not present in `index.html` (rendered dynamically). It carries the class `.todo-list__empty`.

**Alternatives considered**:
- Leave `<ul>` visually empty — Creates layout gap; poor first-run UX; rejected.
- Hide the `<ul>` entirely with a CSS class — Cleaner for some layouts but doesn't communicate "empty, not broken" to the user; rejected.
- Define the `<p>` in static HTML and toggle visibility — Would pollute the HTML with a JS-dependent element; rejected per Principle III (semantic HTML should not rely on JS-managed presence for layout).
