# Feature Specification: To-Do List Core Functionality

**Feature Branch**: `001-todo-list-core`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "Core funcional de uma aplicação de lista de tarefas — adicionar tarefa, marcar como concluída, remover tarefa e persistência local, com interface responsiva de estética retro-terminal e validação de entrada robusta."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Add a New Task (Priority: P1)

A user types a task description into the input field and submits it. The task appears at the bottom of the list in a pending state, the input field is cleared, and no page reload occurs.

**Why this priority**: Adding tasks is the fundamental action from which all other interactions derive value. Without it, the application cannot function at all.

**Independent Test**: Open the application with an empty list, type any non-empty text into the input field, submit the form, and confirm the task appears in the list. Delivers the core value of capturing a to-do item.

**Acceptance Scenarios**:

1. **Given** the input field is empty, **When** the user types "Buy groceries" and submits the form, **Then** a new item labelled "Buy groceries" appears at the bottom of the task list in a pending state and the input field is cleared.
2. **Given** the task list already has items, **When** the user adds another task, **Then** the new task is appended after existing items and all prior items remain unchanged.
3. **Given** the user submits the form via the Enter key, **When** the input contains valid text, **Then** the behaviour is identical to clicking the submit button.

---

### User Story 2 — Mark a Task as Completed (Priority: P2)

A user clicks the completion toggle on a pending task. The task's visual presentation changes to indicate it is done (e.g., strikethrough text). Clicking the toggle again reverts it to pending.

**Why this priority**: Checking off tasks is the core feedback loop that makes a to-do list useful. Without it, users cannot track progress.

**Independent Test**: Add a task, click its completion toggle, and confirm the task's appearance changes to reflect a completed state. Revert and confirm the pending appearance is restored.

**Acceptance Scenarios**:

1. **Given** a pending task exists, **When** the user clicks its completion toggle, **Then** the task transitions to a completed state with a visually distinct appearance (strikethrough, reduced contrast).
2. **Given** a completed task exists, **When** the user clicks its completion toggle again, **Then** the task reverts to a pending state and its standard appearance is restored.
3. **Given** multiple tasks exist, **When** the user toggles one task, **Then** only that task changes state; all others remain unaffected.

---

### User Story 3 — Remove a Task (Priority: P3)

A user clicks the remove button on any task (pending or completed). The task is permanently deleted from the list and from storage.

**Why this priority**: Removal keeps the list manageable and reflects real-world task management. It depends on task creation being in place.

**Independent Test**: Add a task, click its remove button, and confirm the task no longer appears in the list. Reload the page and confirm it does not reappear.

**Acceptance Scenarios**:

1. **Given** a task exists, **When** the user clicks the remove button, **Then** the task is immediately removed from the visible list.
2. **Given** the last task is removed, **When** the list becomes empty, **Then** the task list area is empty (no ghost items or broken layout).
3. **Given** the page is reloaded after removal, **When** the application initialises, **Then** the removed task does not reappear.

---

### User Story 4 — Input Validation Feedback (Priority: P2)

A user attempts to submit a blank or whitespace-only task, or a task that exceeds the maximum allowed character count. The application displays a clear, inline error message without disrupting the current view, and the task is not added.

**Why this priority**: Prevents corrupt data from entering the list and provides essential usability guidance without intrusive browser dialogs.

**Independent Test**: Submit the form with an empty input; confirm an error message appears inline below or beside the field and no task is added.

**Acceptance Scenarios**:

1. **Given** the input field is empty or contains only spaces, **When** the user submits the form, **Then** an inline error message appears ("Task cannot be empty."), no task is added, and focus remains on the input field.
2. **Given** the input contains more than 120 characters, **When** the user submits the form, **Then** an inline error message appears ("Task cannot exceed 120 characters."), no task is added, and the field retains its current value.
3. **Given** an error message is visible, **When** the user begins typing valid text, **Then** the error message is dismissed immediately.
4. **Given** an error state is shown, **When** the input field has error styling applied, **Then** the styling is thematically consistent with the retro-terminal aesthetic (no harsh red borders that break the palette).

---

### User Story 5 — Persistence Across Sessions (Priority: P3)

A user adds, completes, and removes tasks, then reloads or reopens the browser tab. The application restores the exact task list (including each task's text and completion state) as it was before the page was closed.

**Why this priority**: Without persistence, every reload starts from scratch, making the application impractical. This story has a hard dependency on Stories 1, 2, and 3.

**Independent Test**: Add three tasks, complete one, remove one, reload the page, and confirm the remaining two tasks appear with the correct completion states.

**Acceptance Scenarios**:

1. **Given** the user has added tasks with various completion states, **When** the page is reloaded, **Then** all tasks appear with their original text and completion state intact.
2. **Given** the stored data is absent (e.g., first visit, cleared storage), **When** the application initialises, **Then** the task list is empty and no errors occur.
3. **Given** tasks are stored and the user adds a new task, **When** the page is reloaded without explicit save, **Then** the new task is also present (save is automatic on every state change).

---

### Edge Cases

- What happens when the stored data is malformed or cannot be parsed? The application MUST start with an empty list rather than crashing.
- What happens when the user pastes a very long string into the input field? Validation MUST catch the length violation on submit.
- What happens when the user presses Escape while the input has focus? The field content SHOULD be cleared as a convenience affordance (not mandatory for MVP).
- What happens if the task list grows very long? The layout MUST remain navigable without breaking; the list area SHOULD scroll independently.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow users to add a new task by submitting non-empty, non-whitespace-only text of at most 120 characters.
- **FR-002**: The system MUST display an inline validation message (not a browser `alert`) when the user attempts to submit an invalid task, and MUST NOT add the task to the list.
- **FR-003**: The input field MUST receive a visible error state class when validation fails, and the error class MUST be removed as soon as the user resumes typing.
- **FR-004**: Each task in the list MUST have a toggle control that switches its state between pending and completed.
- **FR-005**: Completed tasks MUST be visually distinguishable from pending tasks (e.g., strikethrough text, reduced opacity).
- **FR-006**: Each task in the list MUST have a remove control that permanently deletes it from the list and from storage.
- **FR-007**: The system MUST automatically save the full task list to local browser storage after every state change (add, toggle, remove) without requiring a manual save action from the user.
- **FR-008**: On initialisation, the system MUST restore the task list from local storage; if storage is empty or invalid, the system MUST start with an empty list.
- **FR-009**: The interface MUST adapt to both mobile (portrait, ≥ 320 px) and desktop (≥ 1024 px) viewports without horizontal scrolling or broken layout.
- **FR-010**: The visual design MUST apply a dark colour palette, monospaced typography, and simple border treatments consistent with a retro command-line terminal aesthetic, with no excessive box shadows.
- **FR-011**: Interactive transitions (adding, completing, removing tasks) MUST include subtle, non-distracting microanimations.
- **FR-012**: All interactive controls (input, buttons) MUST be keyboard-navigable and carry appropriate accessible labels.
- **FR-013**: All user-supplied text rendered to the screen MUST be treated as plain text to prevent script injection.

### Semantic HTML Structure

The document MUST use the following semantic element hierarchy:

| Element | Role | Identifier strategy |
|---------|------|---------------------|
| `<main>` | Application root container | `class` only |
| `<header>` | Application title area | `class` only |
| `<h1>` | Application title | `class` only |
| `<form>` | Task input form | `id="js-todo-form"` (JS hook) |
| `<label>` | Input field label, associated via `for` | `class` only |
| `<input type="text">` | Task text entry | `id="js-task-input"` (JS hook); `aria-describedby` pointing to error span |
| `<span>` | Inline error message area | `id="js-input-error"`; `aria-live="polite"` |
| `<button type="submit">` | Form submit action | `data-js="submit-btn"` |
| `<ul>` | Task list | `id="js-todo-list"` (JS hook) |
| `<li>` | Individual task item | `data-task-id="[id]"`; `data-js="todo-item"` |
| `<button>` (inside `<li>`) | Completion toggle | `data-js="toggle-btn"`; `aria-label` |
| `<span>` (inside `<li>`) | Task text display | `data-js="task-text"` |
| `<button>` (inside `<li>`) | Remove action | `data-js="remove-btn"`; `aria-label` |

**Rule**: JavaScript selectors MUST target `id` or `data-js` / `data-task-id` attributes exclusively. CSS class names MUST NOT be used as JS selectors.

### CSS Component States (BEM)

The stylesheet MUST define the following classes and state modifiers:

| Class | Description |
|-------|-------------|
| `.todo-app` | Root layout container; centres content, sets max-width |
| `.todo-app__header` | Title area wrapper |
| `.todo-app__title` | Application heading typography |
| `.todo-form` | Form layout (flex row) |
| `.todo-form__input` | Text field base styles (dark bg, monospaced font, simple border) |
| `.todo-form__input--error` | Modifier applied when validation fails (error-state border/colour) |
| `.todo-form__error` | Inline error message; hidden by default, visible when non-empty |
| `.todo-form__btn` | Submit button base styles |
| `.todo-list` | List container; removes default list styling, sets scroll area |
| `.todo-item` | Individual task item base (flex row, border separator) |
| `.todo-item--pending` | Modifier for pending state (standard text colour) |
| `.todo-item--done` | Modifier for completed state (strikethrough text, reduced opacity) |
| `.todo-item__toggle` | Completion toggle button; styled as checkbox-like icon |
| `.todo-item__text` | Task text span (truncation for long text on small viewports) |
| `.todo-item__remove` | Remove button; minimal style, revealed clearly on hover/focus |
| `.todo-item--entering` | Microanimation modifier applied on item insertion (fade/slide in) |
| `.todo-item--leaving` | Microanimation modifier applied on item removal (fade/slide out) |

### JavaScript Function Contracts

The codebase MUST be split into three modules following the MVC pattern mandated by the project constitution: `model.js`, `view.js`, and `controller.js` (or equivalent namespacing). The `controller.js` serves as the entry point and orchestrator.

#### Model — `model.js`

All functions are pure (no DOM access, no side effects beyond explicit `localStorage` calls).

| Function | Inputs | Output | Side Effects |
|----------|--------|--------|--------------|
| `loadTasks()` | *(none)* | `Task[]` — array of task objects from storage, or `[]` if absent/invalid | Reads from `localStorage` |
| `saveTasks(tasks)` | `tasks: Task[]` | `void` | Writes serialised array to `localStorage` |
| `addTask(tasks, text)` | `tasks: Task[]`, `text: string` | New `Task[]` with one appended task | None |
| `removeTask(tasks, id)` | `tasks: Task[]`, `id: string` | New `Task[]` without the item matching `id` | None |
| `toggleTask(tasks, id)` | `tasks: Task[]`, `id: string` | New `Task[]` with the matching item's `done` field flipped | None |
| `validateTaskText(text)` | `text: string` | `{ valid: boolean, error: string \| null }` | None |

**Task object shape**:
```
{
  id: string,       // unique identifier (timestamp-based or UUID)
  text: string,     // sanitised task description
  done: boolean,    // false = pending, true = completed
  createdAt: string // ISO 8601 date string
}
```

**Validation rules** enforced by `validateTaskText`:
- `text.trim().length === 0` → `{ valid: false, error: "Task cannot be empty." }`
- `text.trim().length > 120` → `{ valid: false, error: "Task cannot exceed 120 characters." }`
- Otherwise → `{ valid: true, error: null }`

#### View — `view.js`

All functions read from or write to the DOM only. No business logic or data transformation.

| Function | Inputs | Output | Side Effects |
|----------|--------|--------|--------------|
| `renderTaskList(tasks)` | `tasks: Task[]` | `void` | Clears `#js-todo-list` and re-renders all task items |
| `renderTaskItem(task)` | `task: Task` | `HTMLElement` (`<li>`) | None (returns element; does not insert) |
| `showInputError(message)` | `message: string` | `void` | Populates `#js-input-error`, adds `--error` modifier to input |
| `clearInputError()` | *(none)* | `void` | Clears `#js-input-error`, removes `--error` modifier from input |
| `clearInput()` | *(none)* | `void` | Sets `#js-task-input` value to `""` |
| `getInputValue()` | *(none)* | `string` | Reads `#js-task-input` current value |
| `bindFormSubmit(handler)` | `handler: Function` | `void` | Attaches `submit` event listener to `#js-todo-form` |
| `bindToggleTask(handler)` | `handler: Function(id)` | `void` | Attaches delegated `click` listener on `#js-todo-list` for `[data-js="toggle-btn"]` |
| `bindRemoveTask(handler)` | `handler: Function(id)` | `void` | Attaches delegated `click` listener on `#js-todo-list` for `[data-js="remove-btn"]` |
| `bindInputChange(handler)` | `handler: Function` | `void` | Attaches `input` event to `#js-task-input` for live error clearing |

**Security constraint**: `renderTaskItem` MUST assign task text via `element.textContent`, never `innerHTML`.

#### Controller — `controller.js`

Orchestrates Model and View. MUST NOT access the DOM directly; MUST NOT call `localStorage` directly.

| Function | Inputs | Output | Side Effects |
|----------|--------|--------|--------------|
| `init()` | *(none)* | `void` | Loads tasks via Model, renders via View, binds all event handlers |
| `handleAddTask()` | *(none)* | `void` | Reads input via View → validates via Model → on success: updates state, saves, re-renders, clears input; on failure: shows error via View |
| `handleToggleTask(id)` | `id: string` | `void` | Toggles task in Model, saves, re-renders via View |
| `handleRemoveTask(id)` | `id: string` | `void` | Removes task in Model, saves, re-renders via View |
| `handleInputChange()` | *(none)* | `void` | Clears any visible error via View |

### Key Entities

- **Task**: The atomic unit of user intent. Attributes: unique identifier, text description (≤ 120 chars), completion state (boolean), creation timestamp. Tasks are immutable by reference — each state change produces a new array.
- **Task List**: An ordered collection of Tasks. Order is determined by insertion sequence (newest at bottom). The list is serialised as a JSON array for storage.
- **Application State**: A single in-memory snapshot of the current Task List, held by the Controller and updated atomically on each user action.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add a new task in under 5 seconds from typing the first character to seeing it appear in the list.
- **SC-002**: All core interactions (add, complete, remove) remain fully functional when the viewport is 320 px wide (smallest common mobile screen).
- **SC-003**: After any state-changing interaction, reloading the page restores the list to the exact same state 100% of the time.
- **SC-004**: Submitting an invalid task never produces a browser `alert()` dialog; all error feedback is contained within the page layout.
- **SC-005**: Every interactive control is reachable and operable using only the keyboard (Tab, Enter, Space), with no focus traps.
- **SC-006**: The application loads and becomes interactive in under 2 seconds on a standard broadband connection.
- **SC-007**: Microanimations on list item interactions complete in under 300 ms and do not block user input.

---

## Assumptions

- The application targets modern evergreen browsers (Chrome, Firefox, Safari, Edge) that fully support ES6 Modules and the `localStorage` API. Internet Explorer is out of scope.
- A maximum task text length of **120 characters** has been chosen as a balance between expressiveness and list readability on small viewports. This value may be revisited via a spec amendment if user testing suggests otherwise.
- Task ordering is insertion-order (oldest at top, newest at bottom). No sorting, filtering, or drag-to-reorder is in scope for this core specification.
- No user authentication or multi-device synchronisation is in scope; storage is local to the browser.
- The retro-terminal colour palette will use a dark background (near-black) with a muted green, amber, or off-white foreground, consistent with classic terminal aesthetics. Exact hex values are a design decision deferred to the plan phase.
- The `JetBrains Mono` font will be loaded via a CDN `@font-face` declaration (or equivalent self-hosted approach consistent with the no-external-runtime-dependency rule); `Courier New` is the mandatory CSS fallback. This font-loading mechanism is a deployment detail, not a functional requirement.
- Microanimations will be implemented using CSS transitions or `@keyframes`; JavaScript animation libraries are prohibited by the constitution.
- The `id` generation strategy for new tasks will use `Date.now().toString()` as a simple unique key, which is sufficient for a single-user local application.
