---
description: "Task list for 001-todo-list-core implementation"
---

# Tasks: To-Do List Core Functionality

**Input**: Design documents from `specs/001-todo-list-core/`  
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ui-contract.md ✅  
**Tests**: Not requested — manual browser testing against quickstart.md scenarios  
**Branch**: `001-todo-list-core`

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Parallelisable — touches different files, no dependency on incomplete sibling tasks
- **[US#]**: User story label (maps to spec.md priorities)
- All paths are relative to the repository root

---

## Phase 1: Setup

**Purpose**: Replace empty stubs with the correct file structure; wire the ES Module entry point.

- [x] T001 Create `js/` directory; create `js/model.js`, `js/view.js`, `js/controller.js` as empty ES module stubs (each file exports an empty object or named placeholder so imports resolve)
- [x] T002 Replace `index.html` stub with full semantic HTML shell per `contracts/ui-contract.md` §1 — `<main>`, `<header>`, `<form>`, `<ul>` with all BEM classes, `id` hooks, `data-js` attributes, and ARIA attributes; replace `<script src="app.js">` with `<script type="module" src="js/controller.js">`
- [x] T003 [P] Delete `app.js` from the project root (stub is superseded by `js/controller.js`)

**Checkpoint**: Opening the app in a local server should show the HTML shell with no JS errors in the console.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared constants, DOM ref helpers, and controller skeleton that every user story depends on. No user story work begins until this phase is complete.

- [x] T004 Define `const STORAGE_KEY = 'sdd-todo-tasks'` and a `@typedef {Object} Task` JSDoc block (fields: `id`, `text`, `done`, `createdAt`) at the top of `js/model.js`
- [x] T005 [P] Add private DOM getter helpers in `js/view.js` — use `getElementById` / `querySelector` to resolve `#js-todo-form`, `#js-task-input`, `#js-input-error`, `#js-todo-list`; assign to module-scoped `const` references used by all view functions
- [x] T006 Add `import` statements at top of `js/controller.js` for all public symbols from `./model.js` and `./view.js`; define `let state = { tasks: [] }`; write `function init() {}` stub and call `init()` at module bottom

**Checkpoint**: Browser console shows no import errors; `init()` runs on page load (add a temporary `console.log` to verify, then remove).

---

## Phase 3: User Story 1 — Add a New Task (Priority: P1) 🎯 MVP

**Goal**: A user can type a task and submit it; the item appears in the list immediately and the input is cleared.

**Independent Test**: Open the app, type "Buy groceries", press Enter → item appears in the list and the input field is empty.

- [x] T007 [P] [US1] Implement `export function addTask(tasks, text)` in `js/model.js` — returns new `Task[]` with one item appended: `{ id: Date.now().toString(), text: text.trim(), done: false, createdAt: new Date().toISOString() }`
- [x] T008 [P] [US1] Implement `export function getInputValue()` and `export function clearInput()` in `js/view.js` — read and clear `#js-task-input` value
- [x] T009 [US1] Implement `export function renderTaskItem(task)` in `js/view.js` — creates `<li>` with `data-task-id`, `data-js="todo-item"`, and correct BEM classes; creates toggle `<button>`, text `<span>` (assigned via `textContent` only), remove `<button>` per `contracts/ui-contract.md` §1; applies `todo-item--pending` modifier
- [x] T010 [US1] Implement `export function renderTaskList(tasks)` in `js/view.js` — clears `#js-todo-list` and either renders all items via `renderTaskItem` or inserts `<p class="todo-list__empty">&gt; no tasks. type above and press enter.</p>` when `tasks.length === 0`
- [x] T011 [US1] Implement `export function bindFormSubmit(handler)` in `js/view.js` — attaches `submit` listener to `#js-todo-form`, calls `event.preventDefault()`, then invokes `handler`
- [x] T012 [US1] Implement `handleAddTask()` in `js/controller.js` — reads input via `getInputValue()`, calls `addTask(state.tasks, text)`, updates `state.tasks`, calls `renderTaskList(state.tasks)` and `clearInput()`; wire `bindFormSubmit(handleAddTask)` inside `init()` and call `renderTaskList(state.tasks)` in `init()`

**Checkpoint**: Add multiple tasks — each appears at the bottom of the list; input clears after each submit; the list is fully re-rendered on every add.

---

## Phase 4: User Story 4 — Input Validation Feedback (Priority: P2)

**Goal**: Submitting empty or over-length input shows an inline error message; no task is added; typing clears the error.

**Independent Test**: Submit form with empty input → inline error appears, no new item added. Start typing → error disappears.

- [x] T013 [P] [US4] Implement `export function validateTaskText(text)` in `js/model.js` — returns `{ valid: false, error: "Task cannot be empty." }` if `text.trim().length === 0`; `{ valid: false, error: "Task cannot exceed 120 characters." }` if `text.trim().length > 120`; otherwise `{ valid: true, error: null }`
- [x] T014 [P] [US4] Implement `export function showInputError(message)` and `export function clearInputError()` in `js/view.js` — `showInputError` sets `#js-input-error` `textContent` and adds class `todo-form__input--error` to `#js-task-input`; `clearInputError` clears the span and removes the class
- [x] T015 [US4] Implement `export function bindInputChange(handler)` in `js/view.js` — attaches `input` event listener to `#js-task-input` that invokes `handler`
- [x] T016 [US4] Implement `handleInputChange()` in `js/controller.js` (calls `clearInputError()`); integrate `validateTaskText` into `handleAddTask()` — on invalid result call `showInputError(error)` and return early, keeping focus on input; on valid result proceed to add; wire `bindInputChange(handleInputChange)` inside `init()`
- [x] T017 [P] [US4] Add `.todo-form__input--error` modifier styles (theme-consistent error border/colour) and `.todo-form__error` visibility styles (hidden when empty, visible when non-empty) in `style.css`

**Checkpoint**: Empty submit → inline error, no item added; 121-char paste + submit → length error; start typing → error clears.

---

## Phase 5: User Story 2 — Mark a Task as Completed (Priority: P2)

**Goal**: Clicking a task's toggle switches it between pending and completed; the visual changes immediately; only that task is affected.

**Independent Test**: Add a task, click its toggle → strikethrough + reduced opacity. Click again → reverts to normal.

- [x] T018 [P] [US2] Implement `export function toggleTask(tasks, id)` in `js/model.js` — returns new `Task[]` where the item matching `id` has its `done` field flipped; all other items unchanged
- [x] T019 [P] [US2] Implement `export function bindToggleTask(handler)` in `js/view.js` — attaches delegated `click` listener on `#js-todo-list`; on click, checks `event.target.closest('[data-js="toggle-btn"]')`, reads `data-task-id` from the parent `<li>`, invokes `handler(id)`
- [x] T020 [US2] Implement `handleToggleTask(id)` in `js/controller.js` — calls `toggleTask(state.tasks, id)`, updates `state.tasks`, calls `renderTaskList(state.tasks)`; wire `bindToggleTask(handleToggleTask)` inside `init()`; update `renderTaskItem` in `js/view.js` to apply `todo-item--done` (instead of `todo-item--pending`) and set correct `aria-label` on toggle button when `task.done === true`
- [x] T021 [P] [US2] Add `.todo-item--done` CSS modifier in `style.css` — applies `text-decoration: line-through` and reduced `opacity` on `.todo-item__text`

**Checkpoint**: Toggle a pending item → done styling; toggle again → pending styling; other items unaffected.

---

## Phase 6: User Story 3 — Remove a Task (Priority: P3)

**Goal**: Clicking remove permanently deletes the task; the list updates immediately; the task does not reappear on reload.

**Independent Test**: Add a task, click remove → task gone; reload → task still gone.

- [x] T022 [P] [US3] Implement `export function removeTask(tasks, id)` in `js/model.js` — returns new `Task[]` filtered to exclude the item matching `id`
- [x] T023 [P] [US3] Implement `export function bindRemoveTask(handler)` in `js/view.js` — attaches delegated `click` listener on `#js-todo-list`; on click checks `event.target.closest('[data-js="remove-btn"]')`, reads `data-task-id` from parent `<li>`, invokes `handler(id)`
- [x] T024 [US3] Implement `handleRemoveTask(id)` in `js/controller.js` — calls `removeTask(state.tasks, id)`, updates `state.tasks`, calls `renderTaskList(state.tasks)`; wire `bindRemoveTask(handleRemoveTask)` inside `init()`

**Checkpoint**: Remove all tasks one by one → empty state placeholder appears; reload confirms tasks do not reappear.

---

## Phase 7: User Story 5 — Persistence Across Sessions (Priority: P3)

**Goal**: All task state is saved to `localStorage` automatically; reloading the page restores the exact same list.

**Independent Test**: Add 3 tasks, complete 1, remove 1, reload → 2 tasks remain with correct completion states.

- [x] T025 [P] [US5] Implement `export function loadTasks()` in `js/model.js` — reads `localStorage.getItem(STORAGE_KEY)`; if null returns `[]`; wraps `JSON.parse` in `try/catch`, returns `[]` on any error; validates result is an `Array`, returns `[]` if not
- [x] T026 [P] [US5] Implement `export function saveTasks(tasks)` in `js/model.js` — calls `localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))`
- [x] T027 [US5] Wire persistence in `js/controller.js` — in `init()` replace `state.tasks = []` with `state.tasks = loadTasks()`; add `saveTasks(state.tasks)` call after every `state.tasks` mutation in `handleAddTask`, `handleToggleTask`, and `handleRemoveTask`

**Checkpoint**: Add/complete/remove tasks, close and reopen tab → all state is preserved exactly.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Full visual theme, responsive layout, microanimations, and accessibility hardening.

- [x] T028 Add Google Fonts `@import` for JetBrains Mono at the top of `style.css`; define CSS custom properties (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-error`, `--font-mono`, `--radius`, `--transition-speed`) with dark terminal palette values; apply `font-family: var(--font-mono)` and `background-color: var(--color-bg)` to `body`
- [x] T029 [P] Add `.todo-app` layout styles in `style.css` — `max-width: 640px`, horizontally centred (`margin-inline: auto`), vertical padding, `min-height: 100vh`; add responsive adjustments so layout is correct at 320 px viewport width (no horizontal scroll)
- [x] T030 [P] Add `.todo-form`, `.todo-form__label`, `.todo-form__row`, `.todo-form__input`, `.todo-form__btn` BEM component styles in `style.css` — flex row, input takes remaining space, terminal-style border, monospaced placeholder, hover/focus states using CSS custom properties
- [x] T031 [P] Add `.todo-list`, `.todo-item`, `.todo-item--pending`, `.todo-item__toggle`, `.todo-item__text`, `.todo-item__remove` BEM component styles in `style.css` — list-style none, flex row, border separator, toggle and remove buttons minimal with visible hover/focus states
- [x] T032 [P] Add `.todo-list__empty` styles in `style.css` — muted foreground colour, monospaced, left-aligned, consistent padding matching list items
- [x] T033 Add CSS `@keyframes todo-enter` (fade + slide-in from top, 200 ms ease-out) and `@keyframes todo-leave` (fade + slide-out to right, 200 ms ease-in) in `style.css`; in `js/view.js`, add `todo-item--entering` class to new `<li>` in `renderTaskItem` and remove it on `animationend` (`{ once: true }`); add `export function animateRemoval(li, callback)` that adds `todo-item--leaving`, waits for `animationend`, then calls `callback`; update `handleRemoveTask` in `js/controller.js` to call `animateRemoval(getTaskElement(id), () => { ... })` instead of calling `removeTask` directly — add `export function getTaskElement(id)` in `js/view.js` that returns `document.querySelector('[data-task-id="' + id + '"]')`
- [x] T034 [P] Verify all ARIA attributes per `contracts/ui-contract.md` §5 are present in `index.html` and `js/view.js` — `aria-describedby`, `aria-live="polite"`, `role="alert"` on error span, correct `aria-label` values on all buttons; manually test full keyboard navigation (Tab → Enter/Space) with no focus traps

**Checkpoint**: Visual match to retro-terminal aesthetic; all interactions animate smoothly; no horizontal scroll at 320 px; full keyboard navigation works.

---

## Dependency Graph

```
Phase 1 (Setup)
    └── Phase 2 (Foundational)
            └── Phase 3 (US1 — Add Task) 🎯 MVP
                    ├── Phase 4 (US4 — Validation)    ┐
                    ├── Phase 5 (US2 — Complete Task)  ├─ parallel after Phase 3
                    └── Phase 6 (US3 — Remove Task)   ┘
                                 └── Phase 7 (US5 — Persistence)
                                             └── Phase 8 (Polish) ── can start CSS tasks from Phase 1
```

**Cross-cutting note**: Phase 8 CSS tasks (T028–T032, T034) are independent of Phases 4–7 and can be worked in parallel with any phase once T002 is complete. T033 (animations) depends on Phase 6 (remove flow).

---

## Parallel Execution Examples

### After Phase 2 is complete — start Phase 3, and CSS polish in parallel

| Worker A | Worker B |
|----------|----------|
| T007 `addTask()` in model.js | T028 CSS variables + font import |
| T008 `getInputValue/clearInput` in view.js | T029 Layout styles |
| T009 `renderTaskItem` in view.js | T030 Form component styles |
| T010 `renderTaskList` in view.js | T031 List + item component styles |
| T011 `bindFormSubmit` in view.js | T032 Empty state styles |
| T012 `handleAddTask` in controller.js | — |

### After Phase 3 is complete — Phases 4, 5, and 6 in parallel

| Worker A | Worker B | Worker C |
|----------|----------|----------|
| T013 `validateTaskText` | T018 `toggleTask` | T022 `removeTask` |
| T014 `showInputError/clearInputError` | T019 `bindToggleTask` | T023 `bindRemoveTask` |
| T015 `bindInputChange` | T020 `handleToggleTask` + wire | T024 `handleRemoveTask` + wire |
| T016 `handleInputChange` + integrate | T021 `--done` CSS modifier | — |
| T017 `--error` CSS styles | — | — |

---

## Implementation Strategy

**MVP scope (Phase 1–3)**: Completing Phases 1, 2, and 3 delivers a fully functional "add task" flow with no persistence and no validation. This is the independently demonstrable P1 story.

**Increment 2 (Phase 4)**: Add validation on top of the working add flow. No new model entities needed.

**Increment 3 (Phase 5–6)**: Add complete and remove. Both can be implemented in parallel — they touch the same files but in separate functions.

**Increment 4 (Phase 7)**: Wire persistence last — `loadTasks` and `saveTasks` slot into existing controller handlers with minimal changes.

**Polish (Phase 8)**: CSS theming can be applied at any point after T002 without breaking functionality. Microanimations (T033) are the final touch and depend on the remove flow (Phase 6).

---

## Summary

| Phase | User Story | Tasks | Parallelisable |
|-------|------------|-------|----------------|
| 1 — Setup | — | T001–T003 | T003 |
| 2 — Foundational | — | T004–T006 | T005 |
| 3 — Add Task | US1 (P1) | T007–T012 | T007, T008 |
| 4 — Validation | US4 (P2) | T013–T017 | T013, T014, T017 |
| 5 — Complete Task | US2 (P2) | T018–T021 | T018, T019, T021 |
| 6 — Remove Task | US3 (P3) | T022–T024 | T022, T023 |
| 7 — Persistence | US5 (P3) | T025–T027 | T025, T026 |
| 8 — Polish | — | T028–T034 | T029–T032, T034 |
| **Total** | | **34 tasks** | **15 parallelisable** |

**Suggested MVP**: Complete Phases 1–3 (tasks T001–T012) — 12 tasks, independently testable, delivers the core add-task interaction.
