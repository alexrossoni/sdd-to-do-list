# Research: Task Deadlines, Reminders & Mobile Improvements

**Feature**: `002-task-reminders-mobile`  
**Phase**: 0 — Outline & Research  
**Date**: 2026-05-10

---

## Research Item 1 — `<input type="datetime-local">` Cross-Browser Support and Value Handling

**Decision**: Use the native HTML5 `<input type="datetime-local">` element for deadline entry.

**Rationale**:
- All target browsers (Chrome 89+, Firefox 86+, Edge 89+, Safari 15.4+) fully support `datetime-local` inputs with native pickers. No polyfill is needed.
- The value returned is a string in the format `YYYY-MM-DDTHH:MM` (no seconds, no timezone offset). Passing this string directly to `new Date()` produces a `Date` object in the **local timezone** of the device, which is the desired behaviour — deadlines are in the user's local time.
- No normalization suffix is needed for comparison: `new Date('2026-05-10T14:30') <= new Date()` works correctly in all target engines.
- The `min` attribute can be set dynamically to `new Date().toISOString().slice(0, 16)` on form focus to discourage (but not block) past-deadline entry; past deadlines are accepted and immediately flagged as overdue per FR-001 and spec edge case 1.

**Alternatives considered**:
- Custom date/time picker library — rejected (violates Constitution V: no external libraries).
- Two separate `<input type="date">` and `<input type="time">` fields — rejected (requires manual concatenation logic; higher implementation complexity with no user benefit).

---

## Research Item 2 — Periodic Overdue Check with `setInterval`

**Decision**: Use `setInterval(checkOverdue, 30_000)` (30-second interval) started in `controller.js` after initial render.

**Rationale**:
- 30 seconds is well within the 60-second requirement from SC-002 and SC-004.
- `setInterval` is universally supported and requires no external dependency.
- The interval ID is stored in the controller module scope (`let intervalId`) to allow cleanup if needed; however, for this single-page, no-navigation app, cancellation is not required in v1.
- Tabs that are backgrounded: browsers throttle `setInterval` to ~1 second minimum when a tab is hidden (Chrome/Edge) or 1 minute in aggressive battery-saving scenarios. Since the spec only requires in-tab visual alerts and notifies within 60 s, this is acceptable.

**Alternatives considered**:
- `Page Visibility API` to pause/resume the interval — rejected (YAGNI; adds complexity without clear user benefit at this scope).
- `requestAnimationFrame` polling — rejected (tied to frame rate; not appropriate for low-frequency time comparisons).
- Service Worker background sync — rejected (no HTTPS requirement, overkill, violates simplicity principle).

---

## Research Item 3 — Web Notifications API Permission Flow

**Decision**: Request permission lazily on the user's first submission of a task with a deadline. Track notified task IDs in an in-memory `Set<string>` to prevent duplicate notifications within a session.

**Rationale**:
- `Notification.permission` has three states: `'default'` (not yet asked), `'granted'`, `'denied'`. Checking this property before any API call covers all cases.
- `Notification.requestPermission()` returns a `Promise<string>` in all modern browsers. The legacy callback form is deprecated; the Promise form is used.
- Requesting permission on the first deliberate deadline interaction (form submit with a deadline value) is the least intrusive moment — the user has demonstrated intent. This satisfies FR-008 and the spec assumption about lazy permission request.
- An in-memory `Set` (`notifiedTaskIds`) in `controller.js` tracks which task IDs have already triggered a notification in the current session. It resets on page reload, which is acceptable: if the deadline is still overdue after reload, the overdue **visual** alert appears immediately; a new notification fires only once per session per task — preventing notification spam across multiple deadline-crossing intervals within the same session.
- `'Notification' in window` guard handles browsers or contexts (e.g., `file://` in Firefox, private mode in Safari) where the API is unavailable.

**Alternatives considered**:
- Persisting notified IDs in `localStorage` — rejected (would prevent the user from receiving any notification for a recurring reminder; in-memory reset is intentional).
- Service Worker push notifications — rejected (requires HTTPS, server-side infrastructure, violates Constitution V).

---

## Research Item 4 — Null-Last Chronological Sort

**Decision**: Implement `sortTasksByDeadline(tasks)` as a pure function in `model.js` that sorts tasks ascending by deadline, with `null`-deadline tasks always placed after tasks that have a deadline.

**Rationale**:
- Sort comparator: if both tasks lack a deadline, return 0 (preserve insertion order between them). If only `a` lacks a deadline, return `+1` (push `a` after `b`). If only `b` lacks a deadline, return `-1`. Otherwise, compare `new Date(a.deadline) - new Date(b.deadline)`.
- This is a pure function: it operates on the input array and returns a new sorted copy (`[...tasks].sort(...)`), satisfying Constitution IV.
- Sorting is applied in `controller.js` before calling `renderTaskList` — the Model computes the sorted array; the View renders it.

**Alternatives considered**:
- Sorting in `view.js` — rejected (business logic in the View violates Constitution I).
- Maintaining a separately sorted index — rejected (unnecessary complexity for the expected task count).

---

## Research Item 5 — Mobile Touch Target Sizing (CSS)

**Decision**: Inside a `@media (max-width: 768px)` block in `style.css`, set `min-height: 44px; min-width: 44px` on `.todo-item__toggle` and `.todo-item__remove`, increase `.todo-item__text` `font-size` to at least `1rem`, and increase `.todo-form__btn` to `min-height: 44px`.

**Rationale**:
- 44 × 44 px is the WCAG 2.5.5 (AAA) and Apple HIG minimum touch target. FR-011 and SC-003 require this.
- `min-height`/`min-width` rather than fixed `height`/`width` preserves flexibility when text wraps.
- The `768px` breakpoint matches the existing project's implied mobile threshold (no explicit breakpoint currently exists in `style.css` — this feature introduces the first one).
- The existing retro-terminal aesthetic is preserved by adjusting sizes, not colours or font families.
- `font-size: 1rem` (16 px at browser default) satisfies FR-012 (≥ 14 px) with a comfortable margin and prevents iOS Safari's auto-zoom behaviour on form inputs (which triggers at < 16 px).

**Alternatives considered**:
- `padding` enlargement only — rejected (does not guarantee the 44 px minimum for icon-only buttons without explicit `min-height`).
- Separate mobile stylesheet — rejected (single `style.css` with media queries is simpler and consistent with the current project structure).

---

## Summary of Decisions

| Topic | Decision |
|-------|----------|
| Deadline input | `<input type="datetime-local">` — native, no library |
| Value storage | ISO-like local string (`YYYY-MM-DDTHH:MM`); compare with `new Date()` |
| Overdue poll | `setInterval` at 30 s in `controller.js` |
| Notifications | Lazy permission request; `Notification.requestPermission()` Promise form; in-memory `Set` for dedup |
| Sort | Pure `sortTasksByDeadline` in `model.js`; null-last ascending |
| Mobile targets | `min-height/width: 44px` + `font-size: 1rem` in `@media (max-width: 768px)` |
