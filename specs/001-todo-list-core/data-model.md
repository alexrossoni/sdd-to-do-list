# Data Model: To-Do List Core Functionality

**Feature**: `001-todo-list-core`  
**Phase**: 1 — Design & Contracts  
**Date**: 2026-05-10

---

## Entities

### Task

The atomic unit of user intent. Immutable by reference — each state change produces a new `Task` object within a new array.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `string` | Required; unique within the list; non-empty | Millisecond timestamp at creation: `Date.now().toString()` |
| `text` | `string` | Required; 1–120 characters after trimming | The task description as entered by the user |
| `done` | `boolean` | Required; default `false` | `false` = pending; `true` = completed |
| `createdAt` | `string` | Required; ISO 8601 format | Timestamp of task creation: `new Date().toISOString()` |

**Serialised shape** (as stored in `localStorage`):
```json
{
  "id": "1715385600000",
  "text": "Buy groceries",
  "done": false,
  "createdAt": "2026-05-10T18:00:00.000Z"
}
```

**Validation rules** (enforced by `validateTaskText` in `model.js`):

| Condition | Error message |
|-----------|--------------|
| `text.trim().length === 0` | `"Task cannot be empty."` |
| `text.trim().length > 120` | `"Task cannot exceed 120 characters."` |
| Otherwise | Valid — no error |

---

### Task List

An ordered collection of `Task` objects. The ordering is insertion-order (index 0 = oldest; last index = newest).

| Attribute | Value |
|-----------|-------|
| Type | `Task[]` (JavaScript array) |
| Ordering | Insertion order — oldest at top, newest at bottom |
| Persistence | `localStorage` key: `sdd-todo-tasks` |
| Serialisation | `JSON.stringify(tasks)` / `JSON.parse(value)` |
| Empty state | `[]` — used on first visit and on parse failure |

---

### Application State

A single in-memory snapshot held by the Controller. Updated atomically on every user action; never mutated in place.

| Attribute | Value |
|-----------|-------|
| Shape | `{ tasks: Task[] }` |
| Owner | `controller.js` — one private variable `let state` |
| Hydration | Populated from `loadTasks()` during `init()` |
| Commit | After every mutation: `saveTasks(state.tasks)` |

---

## State Transitions

Each transition is a pure function in `model.js` that accepts the current task array and returns a new one. The Controller stores the result and immediately persists it.

```
┌──────────────────────────────────────────────────────────┐
│                     Application State                     │
│                       tasks: Task[]                       │
└──────┬──────────────────────────────────────────┬─────────┘
       │                                          │
  addTask(tasks, text)                  removeTask(tasks, id)
       │                                          │
       ▼                                          ▼
 tasks with new Task                  tasks without matched id
 appended at end                      (all others unchanged)
                          │
                  toggleTask(tasks, id)
                          │
                          ▼
                 tasks with matched Task's
                 done field flipped (true↔false)
```

### addTask

- **Input**: current `Task[]` + validated `text: string`
- **Output**: new `Task[]` with one item appended
- **New item**: `{ id: Date.now().toString(), text: text.trim(), done: false, createdAt: new Date().toISOString() }`
- **Precondition**: `validateTaskText(text).valid === true` (enforced by Controller before calling)

### toggleTask

- **Input**: current `Task[]` + `id: string`
- **Output**: new `Task[]` where the matched item has `done` flipped; all other items are reference-equal to their originals
- **No-match behaviour**: returns the array unchanged (defensive; Controller always provides a valid id from a rendered item)

### removeTask

- **Input**: current `Task[]` + `id: string`
- **Output**: new `Task[]` without the item matching `id`
- **No-match behaviour**: returns the array unchanged

---

## Persistence Layer

| Aspect | Detail |
|--------|--------|
| Mechanism | `window.localStorage` |
| Key | `sdd-todo-tasks` (constant in `model.js`) |
| Write strategy | Write-on-change — `saveTasks` called after every `addTask`, `toggleTask`, `removeTask` |
| Read strategy | Read-on-init — `loadTasks` called once during `controller.init()` |
| Error handling | `loadTasks` wraps `JSON.parse` in a `try/catch`; returns `[]` on any failure |
| Schema versioning | Not required for v1; key name would change on breaking schema revision |

### loadTasks — failure handling

```
localStorage.getItem('sdd-todo-tasks')
  ├── null (key absent)           → return []
  ├── JSON.parse throws           → return []  (malformed data)
  └── result is not an Array     → return []  (corrupt type)
```
