# Quickstart: MkDocs Living Documentation

**Feature**: `003-mkdocs-living-docs`  
**Date**: 2026-05-10  
**Audience**: Developer implementing or maintaining the documentation site

---

## Prerequisites

| Requirement | Check |
|-------------|-------|
| MkDocs 1.6.1+ installed | `mkdocs --version` |
| Git installed and repo has an `origin` remote pointing to GitHub | `git remote -v` |
| GitHub Pages enabled for the repository, serving from `gh-pages` branch | Repository Settings → Pages |

---

## Step 1 — Scaffold (first-time only)

If `mkdocs.yml` does not yet exist at the repository root:

```bash
mkdocs new .
```

This creates:
- `mkdocs.yml` — default configuration (will be replaced with the configured version)
- `docs/index.md` — placeholder home page (will be replaced with authored content)

> **Note**: If `mkdocs.yml` already exists, skip this step. The command will error if `mkdocs.yml` is present.

---

## Step 2 — Configure `mkdocs.yml`

Replace the generated `mkdocs.yml` with:

```yaml
site_name: SDD To-Do List
site_description: >
  A simple to-do list application built with HTML5, CSS3, and Vanilla JavaScript
  following the MVC pattern, developed as a Sec-Driven Development (SDD) exercise.
theme:
  name: mkdocs
strict: true

nav:
  - Home: index.md
  - Features:
    - To-Do List Core: features/001-todo-list-core.md
    - Task Reminders & Mobile: features/002-task-reminders-mobile.md
    - MkDocs Living Documentation: features/003-mkdocs-living-docs.md
```

---

## Step 3 — Create Documentation Pages

Create the following files (content spec in [contracts/ui-contract.md](contracts/ui-contract.md)):

```
docs/
├── index.md
└── features/
    ├── 001-todo-list-core.md
    ├── 002-task-reminders-mobile.md
    └── 003-mkdocs-living-docs.md
```

> The `docs/features/` directory already exists in the repository (empty).

---

## Step 4 — Add `site/` to `.gitignore`

Ensure the root `.gitignore` contains:

```
site/
```

This prevents the build output from being committed to `main`.

---

## Step 5 — Build Locally

```bash
mkdocs build
```

Expected output: zero errors, zero warnings. A `site/` directory is created.

To verify the site locally:

```bash
mkdocs serve
```

Then open `http://127.0.0.1:8000` in a browser.

---

## Step 6 — Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

This command:
1. Builds the site internally
2. Force-pushes the output to the `gh-pages` branch of `origin`
3. Prints the GitHub Pages URL on success

Wait 1–5 minutes for GitHub Pages to propagate, then visit the printed URL.

---

## Adding a New Feature Page (ongoing)

When a new feature is merged into `main`:

1. Create `docs/features/###-feature-name.md` with the standard sections (Overview, Key Behaviours, etc.).
2. Add an entry to the `nav:` block in `mkdocs.yml` under the `Features:` section.
3. Run `mkdocs build` — confirm zero errors.
4. Run `mkdocs gh-deploy` to publish.

---

## Verification Checklist

- [ ] `mkdocs build` exits with code 0 and zero warnings
- [ ] All four nav pages render in the local `mkdocs serve` preview
- [ ] `mkdocs gh-deploy` completes without errors
- [ ] GitHub Pages URL loads the documentation site
- [ ] Navigation links resolve on the deployed site
- [ ] `site/` is absent from the `main` branch (check `.gitignore`)
