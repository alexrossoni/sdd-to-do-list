# Quickstart: Task Deadlines, Reminders & Mobile Improvements

**Feature**: `002-task-reminders-mobile`  
**Branch**: `002-task-reminders-mobile`  
**Date**: 2026-05-10

---

## Prerequisites

- A modern browser: Chrome 89+, Firefox 86+, Edge 89+, or Safari 15.4+
- No build tools, no `npm install`, no server required
- Git (for branching and committing)

---

## Running the Application

```bash
# 1. Clone and enter the repository (if not already done)
git clone <repo-url>
cd sdd-to-do-list

# 2. Switch to the feature branch
git checkout 002-task-reminders-mobile

# 3. Open in browser — any of the following work:
#    a. Double-click index.html in your file explorer
#    b. Drag index.html onto a browser window
#    c. Use VS Code Live Server (right-click index.html → "Open with Live Server")
#    d. Python simple server:
python -m http.server 8080
#    Then visit http://localhost:8080
```

> **Note on Notifications API**: Native browser notifications require a secure context (`https://` or `localhost`). Opening `index.html` via `file://` will prevent notifications in Firefox and Chromium. Use a local server (option c or d above) to test notifications.

---

## Manual Testing Checklist

### Deadline entry

- [ ] Open the app; confirm a "deadline (optional)" datetime input appears below the task text field.
- [ ] Add a task **without** a deadline — confirm it saves and no deadline label appears.
- [ ] Add a task **with** a future deadline — confirm the task appears with a formatted "due: DD/MM HH:MM" label.
- [ ] Add a task with a **past** deadline — confirm it immediately shows the overdue visual state.

### Sorting

- [ ] Add tasks in this order: (A) no deadline, (B) far-future deadline, (C) near-future deadline.
- [ ] Confirm the list order is: C → B → A.

### Overdue alerts

- [ ] Add a task with a deadline 1–2 minutes in the future.
- [ ] Wait for the deadline to pass (do not interact with the page).
- [ ] Within 60 seconds, confirm the task's visual treatment changes (highlight, border, or badge).
- [ ] Mark the overdue task as complete — confirm the overdue visual treatment disappears.

### Notifications (requires `localhost` or `https://`)

- [ ] Set a deadline 1 minute in the future.
- [ ] When prompted, **grant** notification permission.
- [ ] Switch to a different browser tab.
- [ ] Wait for the deadline — confirm a native browser notification appears with the task name.
- [ ] Reload the page and repeat — confirm the notification fires again (in-memory set is reset on reload).

### Notification permission denied

- [ ] Reset notification permission in browser settings (or use a private window).
- [ ] Deny permission when prompted.
- [ ] Confirm the overdue visual alert still appears; no browser notification is dispatched (check browser notification log).

### Mobile responsiveness

- [ ] Open DevTools → device emulation → set viewport to **375 × 667 px**.
- [ ] Confirm all buttons (add, toggle, remove) appear at least 44 px tall and 44 px wide.
- [ ] Confirm all text (task descriptions, deadline labels, error messages) is readable without zoom.
- [ ] Tap each button — confirm only the intended button activates.
- [ ] Switch to a wide viewport (≥ 1024 px) — confirm the desktop layout is unchanged.

### README

- [ ] Read `README.md` — confirm the file tree matches the actual files on disk.

---

## Key Files for This Feature

| File | Changes |
|------|---------|
| `index.html` | Add `datetime-local` input and label inside the form |
| `style.css` | Add `.todo-item--overdue`, `.todo-item__deadline`, mobile media-query block |
| `js/model.js` | Extend `Task` typedef; update `addTask`; add `isOverdue`, `sortTasksByDeadline`; normalise `loadTasks` |
| `js/view.js` | Add `getDeadlineValue`, `clearDeadline`; update `renderTaskItem` |
| `js/controller.js` | Add `setInterval` loop, notification permission request, notification dispatch |
| `README.md` | Update file/directory tree to reflect current project structure |

---

## Debugging Tips

**Overdue detection not triggering**: Open DevTools → Console; look for errors in `controller.js`. Confirm `setInterval` is running by adding a temporary `console.log` inside `handleDeadlineCheck`.

**Notifications not appearing**: Check `Notification.permission` in the DevTools Console (`> Notification.permission`). Ensure you are on `localhost` or `https://`. Check browser notification settings.

**iOS Safari `datetime-local`**: Safari on iOS renders a native date/time picker; the value format is identical (`YYYY-MM-DDTHH:MM`). If the picker does not appear, confirm iOS version ≥ 15.4.

**Existing tasks not loading**: If tasks from a previous session are missing the `deadline` field, `loadTasks()` normalises them to `deadline: null`. Verify the normalisation in the Console by inspecting `state.tasks` after load.
