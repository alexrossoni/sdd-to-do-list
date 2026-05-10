# Implementation Plan: Task Deadlines, Reminders & Mobile Improvements

**Branch**: `002-task-reminders-mobile` | **Date**: 2026-05-10 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/002-task-reminders-mobile/spec.md`

## Summary

Extend the existing vanilla-JS MVC to-do application with: (1) an optional per-task deadline field (`datetime-local` input) stored in `localStorage`; (2) a `setInterval`-based overdue detection loop in `controller.js` that applies in-app visual treatment and optionally dispatches Web Notifications API browser notifications; (3) CSS media-query improvements that bring all interactive elements to ≥ 44 × 44 px touch targets on viewports ≤ 768 px; (4) an updated README reflecting the current file structure. All changes are confined to the four existing source files and `README.md` — no new files or directories are added to the source tree.

## Technical Context

**Language/Version**: JavaScript ES6+ (ES Modules), HTML5, CSS3  
**Primary Dependencies**: None — browser-native APIs only (`setInterval`, Web Notifications API, `localStorage`, `<input type="datetime-local">`)  
**Storage**: `localStorage` — JSON-serialized `Task[]`, key `sdd-todo-tasks`  
**Testing**: Manual — no automated test framework; verification via DevTools and quickstart checklist  
**Target Platform**: Modern evergreen browsers (Chrome 89+, Firefox 86+, Edge 89+, Safari 15.4+); static file or `localhost`  
**Project Type**: Single-page static web application (vanilla stack, no build step)  
**Performance Goals**: Overdue visual alerts within 60 s of deadline passing; form interaction < 1 s  
**Constraints**: No external libraries; no build tools; MVC pattern (Constitution I); all functions ≤ 30 lines (Constitution V); no `innerHTML` with user data (XSS — Constitution / Development Workflow)  
**Scale/Scope**: Single-user personal to-do app; no backend; no multi-tab sync

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Pre-Design | Post-Design | Notes |
|-----------|-----------|-------------|-------|
| I. MVC Separation | ✅ PASS | ✅ PASS | `isOverdue`, `sortTasksByDeadline`, extended `addTask`/`loadTasks` → `model.js`; deadline DOM rendering → `view.js`; `setInterval`, notification dispatch → `controller.js` |
| II. Module Encapsulation | ✅ PASS | ✅ PASS | `notifiedTaskIds` Set scoped to `controller.js` module; no globals; View and Model still do not import each other |
| III. Semantic HTML & Style Decoupling | ✅ PASS | ✅ PASS | `datetime-local` is a semantic native input; overdue state applied via CSS class; JS uses `data-js` and `id` attributes, not class names |
| IV. Pure Functions | ✅ PASS | ✅ PASS | `isOverdue`, `sortTasksByDeadline`, `addTask` are all pure (no side effects, same input → same output, return new arrays/values) |
| V. Simplicity / YAGNI | ✅ PASS | ✅ PASS | No pre-deadline warnings; no snooze; no recurring tasks; no multi-tab sync; no abstraction layers beyond what two callers require |

**No violations. Complexity Tracking section not required.**

## Project Structure

### Documentation (this feature)

```text
specs/002-task-reminders-mobile/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contract.md   # Phase 1 output
└── tasks.md             # Phase 2 output (speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
index.html        # Add datetime-local input + label inside existing form
style.css         # Add .todo-item--overdue, .todo-item__deadline, mobile media-query block
js/
├── model.js      # Extend Task typedef; update addTask + loadTasks; add isOverdue, sortTasksByDeadline
├── view.js       # Add getDeadlineValue, clearDeadline; update renderTaskItem
└── controller.js # Add setInterval loop, notification permission request, notification dispatch
README.md         # Update file/directory tree to reflect actual project structure
```

**Structure Decision**: Single flat project (no `src/`, `backend/`, or `frontend/` directories). Source files live at the repository root and in `js/`. This is the existing structure; no new directories are introduced. The `specs/` directory is a development-only artefact and is not listed in the README.
