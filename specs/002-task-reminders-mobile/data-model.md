# Data Model: Task Deadlines, Reminders & Mobile Improvements

**Feature**: `002-task-reminders-mobile`  
**Phase**: 1 — Design & Contracts  
**Date**: 2026-05-10

---

## Entities

### Task (extended)

Extends the `Task` entity defined in `specs/001-todo-list-core/data-model.md`. A new optional field `deadline` is added. All existing fields are unchanged.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `string` | Required; unique; non-empty | Millisecond timestamp at creation: `Date.now().toString()` |
| `text` | `string` | Required; 1–120 characters after trimming | Task description as entered by the user |
| `done` | `boolean` | Required; default `false` | `false` = pending; `true` = completed |
| `createdAt` | `string` | Required; ISO 8601 format | Timestamp of task creation: `new Date().toISOString()` |
| `deadline` | `string \| null` | Optional; `YYYY-MM-DDTHH:MM` format when present; `null` when no deadline set | Local-time deadline as returned by `<input type="datetime-local">`. Stored verbatim; compared using `new Date(deadline) <= new Date()` |

**Serialised shape** (task with deadline):
```json
{
  "id": "1715385600000",
  "text": "Submit report",
  "done": false,
  "createdAt": "2026-05-10T14:00:00.000Z",
  "deadline": "2026-05-10T17:30"
}
```

**Serialised shape** (task without deadline — backward-compatible with v1 data):
```json
{
  "id": "1715385600001",
  "text": "Buy groceries",
  "done": false,
  "createdAt": "2026-05-10T14:01:00.000Z",
  "deadline": null
}
```

> **Backward compatibility**: Tasks persisted by the previous version do not have a `deadline` field. `loadTasks()` must normalise missing `deadline` to `null` so that all code can rely on the field being present.

**Validation rules** (unchanged from v1, `deadline` is not validated — any value from a valid `datetime-local` input is accepted, including past dates):

| Condition | Error message |
|-----------|---------------|
| `text.trim().length === 0` | `"Task cannot be empty."` |
| `text.trim().length > 120` | `"Task cannot exceed 120 characters."` |
| Otherwise | Valid |

---

### Derived State — Overdue

The overdue state is **not persisted**. It is computed at runtime:

```
isOverdue(task) = task.deadline !== null && !task.done && new Date(task.deadline) <= new Date()
```

| Condition | Overdue? |
|-----------|----------|
| `task.deadline === null` | No |
| `task.done === true` | No (completed tasks are never overdue, regardless of deadline) |
| `new Date(task.deadline) > new Date()` | No (still within deadline) |
| `new Date(task.deadline) <= new Date()` | **Yes** |

---

### Task List (updated ordering)

The task list is now sorted before rendering. The sort is computed by `sortTasksByDeadline` and applied in the Controller before passing to the View.

| Ordering rule | Detail |
|---------------|--------|
| Primary key | `deadline` ascending (earliest first) |
| Null-last | Tasks without a deadline are placed after all tasks that have a deadline |
| Tiebreaker | When two tasks have the same deadline, insertion order (`createdAt` ascending) is preserved |

---

### Reminder Check (in-memory process)

Not a persisted entity. Represents the recurring `setInterval` loop running in `controller.js`.

| Attribute | Value |
|-----------|-------|
| Interval | 30 000 ms (30 seconds) |
| Trigger | `setInterval` started once in `init()` after first render |
| Action | Re-sorts and re-renders the task list; for each newly overdue task not in `notifiedTaskIds`, dispatches a native browser notification (if permitted) and adds the task ID to `notifiedTaskIds` |

---

### Notification Permission State (runtime)

Not persisted. Read directly from `Notification.permission` on each notification attempt.

| State | Value | Behaviour |
|-------|-------|-----------|
| Not yet asked | `'default'` | `Notification.requestPermission()` called when user first submits a task with a deadline |
| Granted | `'granted'` | Native notifications dispatched for newly overdue tasks |
| Denied | `'denied'` | No native notifications attempted; in-app visual alerts only |

---

### Notified Task IDs (in-memory Set)

A `Set<string>` maintained in `controller.js` module scope. Stores the `id` values of tasks for which a native notification has already been dispatched in the current page session.

| Attribute | Value |
|-----------|-------|
| Type | `Set<string>` |
| Scope | Module-level constant in `controller.js` |
| Lifetime | Current page session only (reset on reload) |
| Purpose | Prevent a notification from being dispatched more than once per task per session |

---

## State Transitions

```
Task created (no deadline)
  → pending (no overdue indicator)
  → completed (done=true, no overdue indicator)

Task created (with future deadline)
  → pending (deadline indicator shown; overdue=false)
  → [deadline passes] → pending + overdue (visual alert; notification dispatched once)
  → completed (done=true; overdue indicator removed)

Task created (with past deadline)
  → pending + overdue immediately (visual alert on first render; notification dispatched on first interval check)
  → completed (done=true; overdue indicator removed)
```

---

## localStorage Schema

**Key**: `sdd-todo-tasks`  
**Value**: JSON array of `Task` objects (unchanged from v1; `deadline` field added)

```json
[
  {
    "id": "1715385600000",
    "text": "Submit report",
    "done": false,
    "createdAt": "2026-05-10T14:00:00.000Z",
    "deadline": "2026-05-10T17:30"
  },
  {
    "id": "1715385600001",
    "text": "Buy groceries",
    "done": false,
    "createdAt": "2026-05-10T14:01:00.000Z",
    "deadline": null
  }
]
```
