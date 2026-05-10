# UI Contract: To-Do List Core Functionality

**Feature**: `001-todo-list-core`  
**Phase**: 1 — Design & Contracts  
**Date**: 2026-05-10  
**Type**: Web Application UI Contract — DOM Structure, CSS State Machine, Module Public API

This document defines the contract between the HTML document, the CSS stylesheet, and the three JavaScript modules. Any implementation that satisfies this contract is conformant.

---

## 1. DOM Structure Contract

The document MUST contain the following element hierarchy. Attributes marked `[JS hook]` are the only selectors permitted in JavaScript; CSS class names MUST NOT appear in JS selector calls.

```html
<main class="todo-app">

  <header class="todo-app__header">
    <h1 class="todo-app__title">_todo</h1>
  </header>

  <form class="todo-form" id="js-todo-form" novalidate>
    <label class="todo-form__label" for="js-task-input">
      new task
    </label>
    <div class="todo-form__row">
      <input
        class="todo-form__input"
        id="js-task-input"              <!-- [JS hook] -->
        type="text"
        autocomplete="off"
        maxlength="120"
        aria-describedby="js-input-error"
        placeholder="> type here..."
      />
      <button
        class="todo-form__btn"
        type="submit"
        data-js="submit-btn"           <!-- [JS hook] -->
        aria-label="Add task"
      >
        add
      </button>
    </div>
    <span
      class="todo-form__error"
      id="js-input-error"              <!-- [JS hook] -->
      aria-live="polite"
      role="alert"
    ></span>
  </form>

  <ul
    class="todo-list"
    id="js-todo-list"                  <!-- [JS hook] -->
    aria-label="Task list"
  >
    <!-- Populated dynamically by view.js -->
    <!-- When empty, contains: -->
    <p class="todo-list__empty">&gt; no tasks. type above and press enter.</p>
  </ul>

</main>
```

### Task Item Structure (rendered by `view.js#renderTaskItem`)

Each `<li>` inside `#js-todo-list` MUST follow this structure:

```html
<li
  class="todo-item todo-item--pending"   <!-- or todo-item--done -->
  data-task-id="[id]"                    <!-- [JS hook] — unique task id -->
  data-js="todo-item"                    <!-- [JS hook] -->
>
  <button
    class="todo-item__toggle"
    data-js="toggle-btn"                 <!-- [JS hook] -->
    aria-label="Mark as complete"        <!-- or "Mark as pending" when done -->
    type="button"
  ></button>

  <span
    class="todo-item__text"
    data-js="task-text"                  <!-- [JS hook] -->
  >
    <!-- task.text assigned via textContent ONLY — never innerHTML -->
  </span>

  <button
    class="todo-item__remove"
    data-js="remove-btn"                 <!-- [JS hook] -->
    aria-label="Remove task"
    type="button"
  ></button>
</li>
```

---

## 2. CSS State Machine Contract

The following classes represent all states a component can be in. The stylesheet MUST define each class; JavaScript MUST only apply/remove the listed modifier classes.

### Input Form States

| State | Classes on `#js-task-input` | Classes on `#js-input-error` |
|-------|-----------------------------|------------------------------|
| Idle | `.todo-form__input` | `.todo-form__error` (empty content, visually hidden) |
| Error | `.todo-form__input` + `.todo-form__input--error` | `.todo-form__error` (non-empty content, visible) |

**Transition rules**:
- Idle → Error: on failed form submit validation
- Error → Idle: on any `input` event on `#js-task-input` (live clearing)

### Task Item States

| State | Classes on `<li>` | `aria-label` on toggle button |
|-------|-------------------|-------------------------------|
| Pending | `.todo-item .todo-item--pending` | `"Mark as complete"` |
| Completed | `.todo-item .todo-item--done` | `"Mark as pending"` |
| Entering | `.todo-item .todo-item--pending .todo-item--entering` | (same as pending) |
| Leaving | `.todo-item [--pending or --done] .todo-item--leaving` | (transitional; element removed after animation) |

**Transition rules**:
- → Entering: class applied by `renderTaskItem` at insertion time; removed on `animationend`
- Pending ↔ Completed: `--pending` replaced by `--done` (or vice versa) by `renderTaskList` after toggle
- → Leaving: class applied by `removeWithAnimation` in `view.js`; element removed from DOM on `animationend`

---

## 3. Module Public API Contract

### `model.js` — Exported Functions

```js
// Load tasks from localStorage; returns [] on any error
export function loadTasks(): Task[]

// Persist tasks array to localStorage
export function saveTasks(tasks: Task[]): void

// Validate task text; returns validation result
export function validateTaskText(text: string): { valid: boolean, error: string | null }

// Return new array with new Task appended; does NOT validate
export function addTask(tasks: Task[], text: string): Task[]

// Return new array without item matching id
export function removeTask(tasks: Task[], id: string): Task[]

// Return new array with matched item's done field toggled
export function toggleTask(tasks: Task[], id: string): Task[]
```

**Task type**:
```js
{
  id: string,        // Date.now().toString() at creation
  text: string,      // trimmed user input
  done: boolean,     // false = pending
  createdAt: string  // new Date().toISOString() at creation
}
```

### `view.js` — Exported Functions

```js
// Clear #js-todo-list and re-render all tasks (or empty state)
export function renderTaskList(tasks: Task[]): void

// Create and return an <li> element for a task (does NOT insert)
export function renderTaskItem(task: Task): HTMLElement

// Show inline error: populate #js-input-error, add --error to input
export function showInputError(message: string): void

// Hide inline error: clear #js-input-error, remove --error from input
export function clearInputError(): void

// Set #js-task-input value to ""
export function clearInput(): void

// Return current #js-task-input value
export function getInputValue(): string

// Attach submit handler to #js-todo-form
export function bindFormSubmit(handler: () => void): void

// Attach delegated click handler for [data-js="toggle-btn"] on #js-todo-list
export function bindToggleTask(handler: (id: string) => void): void

// Attach delegated click handler for [data-js="remove-btn"] on #js-todo-list
export function bindRemoveTask(handler: (id: string) => void): void

// Attach input event to #js-task-input for live error clearing
export function bindInputChange(handler: () => void): void
```

### `controller.js` — Entry Point (not exported; called via module load)

```js
// Initialise application: load → render → bind
function init(): void

// Read input → validate → on success: add + save + render + clear; on fail: show error
function handleAddTask(): void

// Toggle task in model → save → re-render
function handleToggleTask(id: string): void

// Remove task in model → save → re-render
function handleRemoveTask(id: string): void

// Clear any visible input error
function handleInputChange(): void
```

**Invariants**:
- `controller.js` MUST NOT call `document`, `querySelector`, `getElementById`, or any DOM API directly.
- `controller.js` MUST NOT call `localStorage` directly.
- All DOM access goes through `view.js`; all storage access goes through `model.js`.

---

## 4. localStorage Contract

| Attribute | Value |
|-----------|-------|
| Key | `sdd-todo-tasks` |
| Value type | `string` — JSON-serialised `Task[]` |
| Written by | `model.saveTasks()` only |
| Read by | `model.loadTasks()` only |
| On absence | Returns `[]` |
| On parse failure | Returns `[]` (no exception propagated to caller) |

---

## 5. Accessibility Contract

| Element | Required attribute | Value |
|---------|--------------------|-------|
| `<input>` | `aria-describedby` | `"js-input-error"` |
| `<span#js-input-error>` | `aria-live` | `"polite"` |
| `<span#js-input-error>` | `role` | `"alert"` |
| Toggle button (pending) | `aria-label` | `"Mark as complete"` |
| Toggle button (done) | `aria-label` | `"Mark as pending"` |
| Remove button | `aria-label` | `"Remove task"` |
| `<ul>` | `aria-label` | `"Task list"` |
| Submit button | `aria-label` | `"Add task"` |

All interactive controls MUST be reachable and operable via keyboard (Tab to focus, Enter/Space to activate). No custom focus management is needed beyond the native tab order.
