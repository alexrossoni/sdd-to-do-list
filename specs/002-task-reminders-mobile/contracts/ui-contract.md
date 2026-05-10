# UI Contract: Task Deadlines, Reminders & Mobile Improvements

**Feature**: `002-task-reminders-mobile`  
**Phase**: 1 — Design & Contracts  
**Date**: 2026-05-10

---

## Overview

This document defines the contract between the application's HTML structure, CSS presentation, and JavaScript behaviour layers. It specifies the DOM elements, `data-*` attribute hooks, CSS classes, and state rules introduced by this feature. All consumers (View and Controller modules) MUST treat these definitions as the authoritative interface.

---

## New & Modified DOM Elements

### 1. Deadline Input Field (`index.html`)

A new optional deadline input is added inside the existing `<form id="js-todo-form">`, below the `.todo-form__row` div.

```html
<div class="todo-form__row todo-form__row--deadline">
  <label class="todo-form__label todo-form__label--inline" for="js-deadline-input">
    deadline (optional)
  </label>
  <input
    class="todo-form__input todo-form__input--deadline"
    id="js-deadline-input"
    type="datetime-local"
    data-js="deadline-input"
    aria-label="Task deadline (optional)"
  />
</div>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `id` | `js-deadline-input` | JS DOM reference via `getElementById` |
| `data-js` | `deadline-input` | JS hook for event binding (View layer) |
| `type` | `datetime-local` | Native browser date/time picker |
| `class` | `todo-form__input--deadline` | CSS styling scoped to this element |

**Behaviour**:
- Value is read by `getDeadlineValue()` in `view.js` on form submit.
- Value is cleared by `clearDeadline()` in `view.js` after a successful add.
- Field is **optional** — empty value means no deadline.

---

### 2. Task List Item (updated `<li>`)

Each `<li>` rendered by `renderTaskItem(task)` in `view.js` gains:

**a) Deadline badge** — shown only when `task.deadline` is not null:

```html
<span class="todo-item__deadline" data-js="deadline-label">
  <!-- e.g. "due: 10/05 17:30" -->
</span>
```

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-js` | `deadline-label` | Identifies the element for future JS access if needed |
| `class` | `todo-item__deadline` | CSS styling for the deadline badge |

**b) Overdue modifier class** — applied to the `<li>` when `isOverdue(task)` is true:

| State | `<li>` classes |
|-------|----------------|
| Pending, no deadline | `todo-item todo-item--pending` |
| Pending, future deadline | `todo-item todo-item--pending` |
| Pending, past deadline (overdue) | `todo-item todo-item--pending todo-item--overdue` |
| Completed | `todo-item todo-item--done` |

> **Rule**: `todo-item--overdue` is NEVER applied when `task.done === true`. A completed task cannot be overdue.

---

## CSS Class Definitions (contract)

The following classes are introduced. Their visual implementation is in `style.css`.

| Class | Applied to | Meaning |
|-------|-----------|---------|
| `.todo-item--overdue` | `<li>` | Task has passed its deadline and is not completed. Visual treatment: distinct border highlight (e.g., amber/red terminal colour), overdue badge or label. |
| `.todo-item__deadline` | `<span>` inside `<li>` | Displays the formatted deadline string. Hidden when `task.deadline` is null. |
| `.todo-form__input--deadline` | `<input>` | Styles the `datetime-local` input to match the retro-terminal aesthetic. |
| `.todo-form__row--deadline` | `<div>` | Layout wrapper for the deadline label + input row. |
| `.todo-form__label--inline` | `<label>` | Modifier for labels rendered inline within a row (rather than above the input). |

---

## JavaScript View API (new and modified functions in `view.js`)

### New functions

| Function | Signature | Returns | Description |
|----------|-----------|---------|-------------|
| `getDeadlineValue` | `() → string` | ISO-like string or `""` | Reads `#js-deadline-input` value. Returns `""` when field is empty. |
| `clearDeadline` | `() → void` | — | Sets `#js-deadline-input` value to `""`. |

### Modified functions

| Function | Change | Reason |
|----------|--------|--------|
| `renderTaskItem(task)` | Adds deadline `<span>` when `task.deadline` is not null; adds `todo-item--overdue` class when `isOverdue(task)` | FR-002, FR-005 |
| `renderTaskList(tasks)` | Unchanged signature; receives pre-sorted array from Controller | Sorting is Controller/Model responsibility |

---

## JavaScript Model API (new functions in `model.js`)

| Function | Signature | Returns | Description |
|----------|-----------|---------|-------------|
| `addTask` | `(tasks: Task[], text: string, deadline: string \| null) → Task[]` | `Task[]` | Extended to accept `deadline`. Stores `deadline` as provided (or `null`). |
| `isOverdue` | `(task: Task) → boolean` | `boolean` | Returns `true` if `task.deadline` is not null, `task.done` is `false`, and `new Date(task.deadline) <= new Date()`. |
| `sortTasksByDeadline` | `(tasks: Task[]) → Task[]` | `Task[]` | Returns new sorted array: ascending by deadline; null-deadline tasks last. |
| `loadTasks` | `() → Task[]` | `Task[]` | **Modified**: normalises missing `deadline` field to `null` on each loaded task for backward compatibility. |

---

## JavaScript Controller API (new behaviour in `controller.js`)

| Responsibility | Implementation | Trigger |
|----------------|----------------|---------|
| Start overdue check loop | `setInterval(handleDeadlineCheck, 30_000)` | Once in `init()` after first render |
| Overdue check | Re-sort + re-render list; dispatch notifications for newly overdue tasks | Every 30 s |
| Request notification permission | `Notification.requestPermission()` | First form submission that includes a non-empty deadline value |
| Dispatch notification | `new Notification(task.text, { body: 'Task is overdue.' })` | When `isOverdue(task)` and task ID not in `notifiedTaskIds` |
| Track notified tasks | Module-level `Set<string> notifiedTaskIds` | Updated on each notification dispatch |

---

## Deadline Display Format

Deadline labels shown in the task list use a short human-readable format derived from the stored `YYYY-MM-DDTHH:MM` string.

| Input value | Displayed label |
|-------------|-----------------|
| `"2026-05-10T17:30"` | `"due: 10/05 17:30"` |
| `null` | (element not rendered) |

Formatting is performed in `view.js` using `Date` object methods (no external library). The locale used is the device's default via `toLocaleDateString` / `toLocaleTimeString` with explicit `{ day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }` options to ensure consistent output.

---

## Mobile Breakpoint Contract

All changes below apply inside `@media (max-width: 768px)`:

| Element | CSS property | Minimum value | Rationale |
|---------|-------------|---------------|-----------|
| `.todo-item__toggle` | `min-height`, `min-width` | `44px` | FR-011 touch target |
| `.todo-item__remove` | `min-height`, `min-width` | `44px` | FR-011 touch target |
| `.todo-form__btn` | `min-height` | `44px` | FR-011 touch target |
| `.todo-item__text` | `font-size` | `1rem` (16 px) | FR-012 readability; prevents iOS Safari auto-zoom |
| `.todo-form__input` | `font-size` | `1rem` (16 px) | Prevents iOS Safari auto-zoom on focus |
| `.todo-item__deadline` | `font-size` | `0.875rem` (14 px) | FR-012 minimum readability |
| `.todo-form__error` | `font-size` | `0.875rem` (14 px) | FR-012 minimum readability |

Desktop layout (> 768 px) must remain **unchanged**.

---

## Backward Compatibility Contract

| Concern | Guarantee |
|---------|-----------|
| Existing localStorage data (no `deadline` field) | `loadTasks()` normalises absent field to `null`; app loads without errors |
| Existing CSS classes | No existing class is renamed or removed |
| Existing `data-js` attributes | No existing attribute value is renamed or removed |
| Existing View/Model function signatures | `addTask` signature extended with optional third arg; callers updated in Controller only |
