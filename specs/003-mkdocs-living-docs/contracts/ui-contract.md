# UI Contract: MkDocs Documentation Site Navigation

**Feature**: `003-mkdocs-living-docs`  
**Date**: 2026-05-10  
**Source**: [research.md](../research.md) — Decision 3 (Navigation Structure)

---

## Overview

This contract defines the navigation structure, page inventory, and content obligations for the MkDocs documentation site. It is the authoritative reference for what must exist in `docs/` and `mkdocs.yml` for the build to pass and the Constitution to be satisfied.

---

## Site Metadata

```yaml
site_name: SDD To-Do List
site_description: >
  A simple to-do list application built with HTML5, CSS3, and Vanilla JavaScript
  following the MVC pattern, developed as a Sec-Driven Development (SDD) exercise.
theme:
  name: mkdocs
strict: true
```

---

## Navigation Contract

The `nav:` block in `mkdocs.yml` MUST match the following structure exactly. Any deviation that references a non-existent file will cause `mkdocs build` to fail (strict mode).

```yaml
nav:
  - Home: index.md
  - Features:
    - To-Do List Core: features/001-todo-list-core.md
    - Task Reminders & Mobile: features/002-task-reminders-mobile.md
    - MkDocs Living Documentation: features/003-mkdocs-living-docs.md
```

---

## Page Inventory

All pages listed in `nav:` MUST exist as Markdown files at the paths below, relative to `docs/`:

| Nav Label | File Path (relative to `docs/`) | Status |
|-----------|--------------------------------|--------|
| Home | `index.md` | Must be created |
| To-Do List Core | `features/001-todo-list-core.md` | Must be created |
| Task Reminders & Mobile | `features/002-task-reminders-mobile.md` | Must be created |
| MkDocs Living Documentation | `features/003-mkdocs-living-docs.md` | Must be created |

---

## Page Content Obligations

### `docs/index.md`

Must contain (in order):

1. `# SDD To-Do List` — H1 heading matching `site_name`
2. One-paragraph project description (purpose + SDD context)
3. `## Technology Stack` — table or bullet list: HTML5, CSS3, JavaScript ES6+, localStorage
4. `## Architecture` — 2–3 sentence description of the MVC pattern used
5. `## Features` — list with links to each feature page using relative Markdown links:
   - `[To-Do List Core](features/001-todo-list-core.md)`
   - `[Task Reminders & Mobile](features/002-task-reminders-mobile.md)`
   - `[MkDocs Living Documentation](features/003-mkdocs-living-docs.md)`
6. `## Getting Started` — instructions to open `index.html` via a local server

### `docs/features/001-todo-list-core.md`

Must contain:

1. `# To-Do List Core Functionality` — H1
2. `## Overview` — plain-language description of the feature
3. `## Key Behaviours` — bullet list covering: task creation, task completion toggle, task deletion, input validation (empty + max 120 chars), localStorage persistence across sessions
4. `## User Interface` — brief description of the retro-terminal aesthetic and responsive layout
5. No references to features from 002 or later

### `docs/features/002-task-reminders-mobile.md`

Must contain:

1. `# Task Reminders & Mobile Improvements` — H1
2. `## Overview` — plain-language description of the feature
3. `## Key Behaviours` — bullet list covering: optional deadline field (`datetime-local` input), overdue visual treatment (CSS class), browser notifications via Web Notifications API (with permission request), task sorting by deadline, mobile touch targets ≥ 44 × 44 px
4. `## Permissions` — note that browser notification permission must be granted by the user
5. `## Mobile Support` — note on the viewport breakpoint (≤ 768 px)
6. No references to features from 003 or later

### `docs/features/003-mkdocs-living-docs.md`

Must contain:

1. `# MkDocs Living Documentation` — H1
2. `## Overview` — explanation of why living documentation was added (Constitution Principle VI)
3. `## Key Behaviours` — bullet list: local build (`mkdocs build`), GitHub Pages deployment (`mkdocs gh-deploy`), strict mode preventing dead references, per-feature documentation pages
4. `## Commands` — code block showing `mkdocs build` and `mkdocs gh-deploy`
5. `## Adding a New Feature Page` — 3-step guide for future developers

---

## Link Validity Rules

- All inter-page links MUST use **relative paths** resolvable within `docs/`
- External links (e.g., GitHub repo URL) are permitted but not required
- No page may link to `specs/` files — spec artifacts are not part of the built site
- `strict: true` in `mkdocs.yml` enforces these rules at build time

---

## `.gitignore` Contract

The following entry MUST be present in the root `.gitignore`:

```
site/
```

This ensures the MkDocs build output is not committed to the `main` branch.
