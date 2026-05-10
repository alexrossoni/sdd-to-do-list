# Data Model: MkDocs Living Documentation

**Feature**: `003-mkdocs-living-docs`  
**Date**: 2026-05-10  
**Source**: [spec.md](spec.md) + [research.md](research.md)

---

## Overview

This feature introduces no application data entities (no changes to `localStorage`, `model.js`, or any JS module). The "data model" for this feature is the **documentation site structure**: the configuration, pages, and navigation that MkDocs uses to build and serve the site.

---

## Entity 1: Site Configuration (`mkdocs.yml`)

**What it represents**: The single source of truth for the MkDocs documentation site. Controls site metadata, theme selection, and navigation structure.

**Location**: Repository root — `mkdocs.yml`

**Fields**:

| Field | Type | Value | Required |
|-------|------|-------|----------|
| `site_name` | string | `"SDD To-Do List"` | Yes |
| `site_description` | string | Short project summary | No |
| `site_url` | string | GitHub Pages URL | No |
| `repo_url` | string | GitHub repository URL | No |
| `repo_name` | string | `"GitHub"` | No |
| `theme.name` | string | `"mkdocs"` (built-in) | Yes |
| `strict` | boolean | `true` | Yes (Constitution VI) |
| `nav` | list | Explicit navigation tree | Yes |

**Validation rules**:
- All file paths referenced in `nav:` MUST resolve to existing `.md` files under `docs/`
- `strict: true` means any warning in the build is treated as a fatal error
- No nav entry may reference a file that does not exist (enforced by strict mode)

**State transitions**: None — static configuration file. Updated when a new feature page is added to `docs/features/`.

---

## Entity 2: Home Page (`docs/index.md`)

**What it represents**: The landing page of the documentation site. Introduces the project, its purpose, technology stack, and links to all feature documentation pages.

**Location**: `docs/index.md`

**Required sections**:

| Section | Description |
|---------|-------------|
| Project title & tagline | Name and one-line description |
| Purpose | What the application does and its educational context (SDD) |
| Technology Stack | HTML5, CSS3, JavaScript ES6+, localStorage |
| MVC Architecture | Brief explanation of the three-layer structure |
| Features | Bulleted list linking to each feature page |
| Getting Started | Link to quickstart or instructions to open index.html |

**Validation rules**:
- All relative links to feature pages MUST be valid paths that MkDocs can resolve
- No reference to unimplemented features
- Language: English (consistent with spec artifacts)

---

## Entity 3: Feature Documentation Page (`docs/features/*.md`)

**What it represents**: A human-readable summary of a single implemented feature, suitable for non-technical stakeholders. Derived from the corresponding `specs/###-feature-name/spec.md`.

**Instances** (one per completed feature):

| File | Feature | Source Spec |
|------|---------|-------------|
| `docs/features/001-todo-list-core.md` | To-Do List Core Functionality | `specs/001-todo-list-core/spec.md` |
| `docs/features/002-task-reminders-mobile.md` | Task Reminders & Mobile Improvements | `specs/002-task-reminders-mobile/spec.md` |
| `docs/features/003-mkdocs-living-docs.md` | MkDocs Living Documentation | `specs/003-mkdocs-living-docs/spec.md` |

**Required sections per page**:

| Section | Description |
|---------|-------------|
| Feature title | Human-readable name (not the branch slug) |
| Overview | One-paragraph plain-language description |
| Key Behaviours | Bulleted list of user-facing capabilities |
| How to Use | Minimal user instructions (where applicable) |
| Technical Notes | Brief mention of implementation approach (optional, for contributor audience) |

**Validation rules**:
- Content MUST accurately reflect only implemented, merged behaviour — no future features
- No dead links to external resources unless stable (GitHub repo URL is stable)
- Language: English

---

## Entity 4: Site Output (`site/`)

**What it represents**: The built HTML/CSS/JS output produced by `mkdocs build` or `mkdocs gh-deploy`. Not committed to `main` branch.

**Location**: `site/` (gitignored)

**Lifecycle**:
- Created by `mkdocs build` or `mkdocs gh-deploy`
- Pushed to `gh-pages` branch by `mkdocs gh-deploy`
- Excluded from `main` branch via `.gitignore`

---

## Entity 5: `.gitignore` Entry

**What it represents**: The rule that excludes the `site/` build output from the `main` branch.

**Change required**: Add `site/` to the root `.gitignore` (or create `.gitignore` if absent).

---

## Relationships

```
mkdocs.yml
  └── nav:
        ├── docs/index.md          (Home)
        └── docs/features/
              ├── 001-todo-list-core.md      ← derived from specs/001-todo-list-core/spec.md
              ├── 002-task-reminders-mobile.md ← derived from specs/002-task-reminders-mobile/spec.md
              └── 003-mkdocs-living-docs.md  ← derived from specs/003-mkdocs-living-docs/spec.md

mkdocs build → site/  (gitignored, not on main)
mkdocs gh-deploy → gh-pages branch → GitHub Pages URL
```

---

## No Changes to Application Source

The following files are **not modified** by this feature:

- `index.html`
- `style.css`
- `js/model.js`
- `js/view.js`
- `js/controller.js`

This feature is documentation-only. Constitution Principle V (YAGNI) and Principle I (MVC) are unaffected.
