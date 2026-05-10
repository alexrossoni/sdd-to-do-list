# Tasks: Task Deadlines, Reminders & Mobile Improvements

**Input**: Design documents from `specs/002-task-reminders-mobile/`  
**Prerequisites**: [plan.md](plan.md) · [spec.md](spec.md) · [research.md](research.md) · [data-model.md](data-model.md) · [contracts/ui-contract.md](contracts/ui-contract.md) · [quickstart.md](quickstart.md)

**Branch**: `002-task-reminders-mobile`  
**Tests**: Not requested — manual verification only (quickstart checklist).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelisable with other tasks in the same phase (different files, no unresolved dependency)
- **[Story]**: User story from spec.md (US1–US5)
- Exact file paths included in every task description

---

## Phase 1: Setup

**Purpose**: Confirm working baseline on the feature branch before any changes.

- [ ] T001 Verify `index.html` opens in the browser, existing tasks persist and all actions work, confirming the baseline on branch `002-task-reminders-mobile`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend `js/model.js` with the new data-model functions that every user story depends on. No UI changes yet.

**⚠️ CRITICAL**: All Phases 3–7 depend on this phase. Complete it before moving to any user story.

- [ ] T002 Extend the `Task` JSDoc typedef in `js/model.js` to add `deadline: string|null` (ISO local string or null)
- [ ] T003 Update `loadTasks` in `js/model.js` to normalise tasks missing the `deadline` field to `deadline: null` (backward-compatibility with v1 storage)
- [ ] T004 [P] Update `addTask` in `js/model.js` to accept a third parameter `deadline` (`string|null`) and include it in the returned task object
- [ ] T005 [P] Add pure function `isOverdue(task)` to `js/model.js`: returns `true` when `task.deadline !== null && !task.done && new Date(task.deadline) <= new Date()`
- [ ] T006 [P] Add pure function `sortTasksByDeadline(tasks)` to `js/model.js`: returns new array sorted ascending by deadline, with null-deadline tasks last; ties broken by `createdAt` ascending

**Checkpoint**: `js/model.js` exports `addTask` (3-arg), `isOverdue`, `sortTasksByDeadline`, and `loadTasks` with normalisation. No other files changed.

---

## Phase 3: User Story 1 — Add a Task with Deadline (Priority: P1) 🎯 MVP

**Goal**: Users can enter an optional deadline when creating a task. The task list renders each deadline, is sorted chronologically, and past-deadline tasks are persisted correctly.

**Independent Test**: Open the app, add a task with a future deadline and confirm the deadline label appears and the task sorts before a task without a deadline. Add a task with a past deadline and confirm it saves.

- [ ] T007 [P] [US1] Add a `datetime-local` input with id `js-deadline-input` and `data-js="deadline-input"`, wrapped in `<div class="todo-form__row todo-form__row--deadline">` with a matching `<label>`, inside the form in `index.html`
- [ ] T008 [P] [US1] Add `getDeadlineValue()` and `clearDeadline()` functions to `js/view.js` that read and clear `#js-deadline-input`
- [ ] T009 [P] [US1] Add CSS rules for `.todo-form__row--deadline`, `.todo-form__label--inline`, and `.todo-form__input--deadline` in `style.css` to match the retro-terminal aesthetic
- [ ] T010 [US1] Update `renderTaskItem(task)` in `js/view.js` to append a `<span class="todo-item__deadline" data-js="deadline-label">` with formatted deadline text (`"due: DD/MM HH:MM"`) when `task.deadline` is not null; omit the element when `task.deadline` is null
- [ ] T011 [US1] Update `handleAddTask` in `js/controller.js` to call `getDeadlineValue()`, pass the deadline (or `null` when empty) to `addTask`, and call `clearDeadline()` after a successful add; import `getDeadlineValue` and `clearDeadline` from `view.js`
- [ ] T012 [US1] Apply `sortTasksByDeadline` in `js/controller.js` before every call to `renderTaskList` (in `handleAddTask`, `handleToggleTask`, `handleRemoveTask`, and `init`); import `sortTasksByDeadline` from `model.js`

**Checkpoint**: Tasks with deadlines display their deadline label; list is sorted earliest-first, deadline-less tasks last; tasks without a deadline are unaffected. Reload preserves state.

---

## Phase 4: User Story 2 — In-App Visual Alert for Overdue Tasks (Priority: P1)

**Goal**: A background loop detects tasks whose deadline has passed and applies a distinct visual treatment automatically, without user interaction.

**Independent Test**: Add a task with a deadline 1–2 minutes ahead, wait without interacting; within 60 s of the deadline the task must gain the overdue visual treatment. Completing it removes the treatment.

- [ ] T013 [P] [US2] Add `.todo-item--overdue` CSS rule in `style.css` with a distinct terminal-themed colour (e.g., amber border or background tint) and any overdue badge content; add `.todo-item__deadline` font-size and colour rules
- [ ] T014 [P] [US2] Update `renderTaskItem(task)` in `js/view.js` to add the `todo-item--overdue` modifier class to the `<li>` when `isOverdue(task)` returns true; import `isOverdue` from `model.js`
- [ ] T015 [P] [US2] Add `handleDeadlineCheck()` function in `js/controller.js` that re-sorts and re-renders the task list (calling `sortTasksByDeadline` + `renderTaskList`) to refresh overdue states
- [ ] T016 [US2] Call `setInterval(handleDeadlineCheck, 30_000)` inside `init()` in `js/controller.js` after the first render, storing the interval ID in a module-level variable

**Checkpoint**: Within 30–60 s of a deadline passing, the task gains the overdue visual style without any user interaction. Marking the task complete removes the overdue class immediately on next render.

---

## Phase 5: User Story 4 — Mobile-Optimised Interface (Priority: P2)

**Goal**: All interactive elements meet the 44 × 44 px minimum touch target and all text is readable without zoom on viewports ≤ 768 px. Desktop layout unchanged.

**Independent Test**: DevTools device emulation at 375 × 667 px — every button is ≥ 44 px tall/wide and all text is legible without zoom. Switch to 1280 px wide — desktop layout is unchanged.

- [ ] T017 [US4] Add a `@media (max-width: 768px)` block in `style.css` setting: `.todo-item__toggle`, `.todo-item__remove`, `.todo-form__btn` to `min-height: 44px; min-width: 44px`; `.todo-item__text`, `.todo-form__input` to `font-size: 1rem`; `.todo-item__deadline`, `.todo-form__error` to `font-size: 0.875rem`; adequate `gap` or `padding` between list-item controls

**Checkpoint**: 375 px emulation shows all touch targets ≥ 44 px and all text ≥ 14 px. Wide viewport layout is unchanged.

---

## Phase 6: User Story 3 — Native Browser Notification on Deadline (Priority: P3)

**Goal**: When the user grants notification permission, a native browser notification is dispatched once per task per session when its deadline is reached.

**Independent Test**: On `localhost`, grant permission, set a 1-minute deadline, switch tabs; native notification appears within 60 s. Deny permission: overdue visual appears but no native notification.

- [ ] T018 [US3] In `js/controller.js`, add a module-level `const notifiedTaskIds = new Set()` and a `requestNotificationPermission()` helper that calls `Notification.requestPermission()` only when `'Notification' in window && Notification.permission === 'default'`; call it from `handleAddTask` when the user submits a task with a non-empty deadline value
- [ ] T019 [US3] In `handleDeadlineCheck` in `js/controller.js`, after re-rendering, iterate overdue tasks: for each task not in `notifiedTaskIds` and when `Notification.permission === 'granted'`, dispatch `new Notification(task.text, { body: 'Task is overdue.' })` and add the task `id` to `notifiedTaskIds`

**Checkpoint**: On `localhost`: notification fires once per task per session when overdue. On reload, notification fires again for still-overdue tasks. When permission is denied, no notification attempt is made.

---

## Phase 7: User Story 5 — Updated README (Priority: P3)

**Goal**: The README file tree exactly matches the actual project files, and the run instructions are correct.

**Independent Test**: Compare the README tree against the filesystem; every listed file exists and every existing file is listed.

- [ ] T020 [US5] Update `README.md`: rewrite the project structure tree to list `index.html`, `style.css`, `js/` (with `controller.js`, `model.js`, `view.js`), and `README.md`; verify "Como executar" instructions remain accurate; exclude `specs/` (dev artefact)

**Checkpoint**: README tree matches actual disk structure exactly.

---

## Final Phase: Polish & Cross-Cutting Concerns

- [ ] T021 Walk through every item in the [quickstart.md](quickstart.md) manual testing checklist end-to-end across all five user stories; record and fix any defect before merging

---

## Dependencies

```
Phase 1 (T001)
    └── Phase 2 (T002–T006)
            ├── Phase 3 (T007–T012)  [US1 P1]
            │       └── Phase 4 (T013–T016)  [US2 P1]
            │               └── Phase 6 (T018–T019)  [US3 P3]  ← T019 extends handleDeadlineCheck (T015)
            ├── Phase 5 (T017)  [US4 P2]  ← independent of Phases 4 and 6
            └── Phase 7 (T020)  [US5 P3]  ← independent of all phases
Phase 3–7 → Final Phase (T021)
```

## Parallel Execution Opportunities

### Phase 2 (after T002–T003 complete)
```
T004 [addTask update]  ──┐
T005 [isOverdue]        ─┤─ parallel (separate functions, same file — sequence within file)
T006 [sortByDeadline]  ──┘
```
> These functions are independent of each other but all live in `model.js`. Implement T004 first (addTask), then T005 and T006 can be written in parallel as they are pure functions with no shared state.

### Phase 3 (after Phase 2)
```
T007 [index.html]  ──┐
T008 [view.js new] ──┤─ parallel (different files)
T009 [style.css]   ──┘
    ↓
T010 [view.js renderTaskItem]  ← after T008 (same file)
    ↓
T011 [controller.js handleAddTask]  ← after T008 + Phase 2
    ↓
T012 [controller.js sort]  ← after T011 (same file)
```

### Phase 4 (after Phase 3)
```
T013 [style.css overdue]  ──┐
T014 [view.js overdue]    ──┤─ parallel (different files)
T015 [controller.js fn]   ──┘
    ↓
T016 [controller.js interval]  ← after T015 (same file)
```

### Phases 5 and 7 (independent of Phase 4)
```
T017 [style.css mobile]  ──┐
T020 [README]            ──┘  ← fully independent, can be done any time after Phase 2
```

## Implementation Strategy

| Increment | Phases | Delivers |
|-----------|--------|---------|
| **MVP** | 1 + 2 + 3 | Deadline entry, display, and chronological sorting — fully usable |
| **Increment 2** | + 4 | Automatic overdue visual alerts — core reminder value |
| **Increment 3** | + 5 | Mobile-ready touch targets — usable on smartphones |
| **Increment 4** | + 6 | Optional native browser notifications |
| **Complete** | + 7 + Final | Updated README + end-to-end verification |

**Suggested MVP scope**: Phases 1–3 (Tasks T001–T012). Delivers a fully functional deadline-aware to-do list that persists and sorts tasks by deadline.
