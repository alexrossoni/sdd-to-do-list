# Quickstart: To-Do List Core Functionality

**Feature**: `001-todo-list-core`  
**Date**: 2026-05-10

---

## Prerequisites

- A modern evergreen browser: Chrome ≥ 90, Firefox ≥ 90, Safari ≥ 14, or Edge ≥ 90
- A local static file server (required for ES Modules to load across files)

No installation, no npm, no build step.

---

## Why a Local Server Is Required

The application uses native ES Modules (`import`/`export`). When HTML files are opened directly from disk via `file://` URLs, browsers block cross-file module imports due to CORS restrictions. A local HTTP server removes this restriction.

---

## Running the Application

### Option A — VS Code Live Server (recommended)

1. Open the project folder in VS Code.
2. Install the **Live Server** extension (ritwickdey.LiveServer) if not already installed.
3. Right-click `index.html` in the Explorer panel → **Open with Live Server**.
4. The browser opens at `http://127.0.0.1:5500` (or similar).

### Option B — Python 3 (no installation needed on most systems)

```bash
cd path/to/sdd-to-do-list
python -m http.server 8080
```

Open `http://localhost:8080` in the browser.

### Option C — Node.js `npx serve`

```bash
cd path/to/sdd-to-do-list
npx serve .
```

Open the URL shown in the terminal output.

---

## Project File Layout

```text
sdd-to-do-list/
├── index.html      # Single HTML entry point
├── style.css       # All styles
└── js/
    ├── model.js        # Model layer — pure functions, localStorage
    ├── view.js         # View layer — DOM reads/writes
    └── controller.js   # Controller layer — orchestrator (entry point)
```

The browser loads `index.html`, which pulls in `js/controller.js` as an ES Module. The controller imports from `model.js` and `view.js`.

---

## Development Workflow

1. Edit source files directly — no compilation or watch step needed.
2. Save the file; the browser (with Live Server or manual reload) reflects the change.
3. Open the browser DevTools Console to observe any runtime errors.
4. Open DevTools → Application → Local Storage → `http://127.0.0.1:5500` to inspect the `sdd-todo-tasks` key and verify persistence.

### Clearing stored data (dev reset)

In the DevTools Console:

```js
localStorage.removeItem('sdd-todo-tasks');
location.reload();
```

Or via DevTools → Application → Local Storage → right-click the key → Delete.

---

## Manual Testing Against Acceptance Scenarios

Refer to `specs/001-todo-list-core/spec.md` (User Scenarios section) for the full given/when/then scenarios. Key smoke tests:

| Test | Steps | Expected |
|------|-------|----------|
| Add task | Type "Buy groceries", press Enter | Item appears at bottom of list; input cleared |
| Validation — empty | Click Add with empty field | Inline error shown; no item added |
| Validation — too long | Paste 121+ characters, click Add | Inline error shown; no item added |
| Complete task | Click toggle on a pending item | Item styled with strikethrough + reduced opacity |
| Undo complete | Click toggle on a completed item | Item reverts to pending appearance |
| Remove task | Click remove button | Item disappears with leave animation |
| Persistence | Add/complete/remove tasks, reload page | List restored to same state |
| Empty state | Remove all tasks | Placeholder text visible in list area |
