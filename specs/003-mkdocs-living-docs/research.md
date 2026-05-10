# Research: MkDocs Living Documentation

**Feature**: `003-mkdocs-living-docs`  
**Date**: 2026-05-10  
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## Decision 1: MkDocs Theme Selection

**Decision**: Use the built-in `mkdocs` theme (default).

**Rationale**: MkDocs Material theme is **not installed** in the current environment (`pip show mkdocs-material` exits with code 1). The built-in `mkdocs` theme ships with MkDocs 1.6.1 and requires zero additional installation. The Constitution permits MkDocs and its Material theme as documentation-only dev dependencies, but also requires YAGNI (Principle V) — adding Material requires a `pip install` step and adds a dependency that is not strictly necessary for compliance with Principle VI. The built-in theme is fully functional and produces a navigable, searchable documentation site.

**Alternatives considered**:
- `material` theme: Richer UI, search, dark mode — rejected because it is not installed and adding it is not required by any functional requirement.
- `readthedocs` theme: Also not installed by default in MkDocs 1.6.1 — rejected for the same reason.

---

## Decision 2: Strict Mode Configuration

**Decision**: Enable strict mode via `strict: true` in `mkdocs.yml`.

**Rationale**: The Constitution (Principle VI) states "No documentation page may reference a feature or API that no longer exists in the codebase (dead references are a bug)." The spec (FR-008) reinforces this. MkDocs strict mode (`strict: true`) promotes all warnings to errors, causing `mkdocs build` to fail on broken links, missing pages, or invalid nav entries. This mechanically enforces the Constitution constraint without manual review.

**Alternatives considered**:
- `--strict` flag at CLI level only: Rejected because it would require all developers to remember the flag; `strict: true` in `mkdocs.yml` is self-documenting and enforced automatically.
- No strict mode: Rejected — it allows dead links to pass silently, violating Constitution Principle VI.

---

## Decision 3: Navigation Structure

**Decision**: Use an explicit `nav:` block in `mkdocs.yml` with a top-level "Features" section.

**Rationale**: MkDocs auto-generates navigation from the `docs/` folder structure when `nav:` is omitted, but explicit `nav:` is preferred here because: (a) it makes the intended site structure self-documenting in `mkdocs.yml`, (b) it gives full control over labels shown in the nav sidebar, and (c) strict mode will fail the build if a nav entry references a non-existent file, providing an automatic safety net for dead pages.

**Navigation map**:
```yaml
nav:
  - Home: index.md
  - Features:
    - To-Do List Core: features/001-todo-list-core.md
    - Task Reminders & Mobile: features/002-task-reminders-mobile.md
    - MkDocs Living Documentation: features/003-mkdocs-living-docs.md
```

**Alternatives considered**:
- Auto-navigation (no `nav:` key): Rejected — file order depends on filesystem sorting and labels are raw filenames, reducing readability.
- Flat navigation (all pages at root level): Rejected — violates the folder structure already established in `docs/features/`.

---

## Decision 4: `mkdocs gh-deploy` Requirements

**Decision**: Use `mkdocs gh-deploy` with default settings (pushes to `gh-pages` branch on `origin`).

**Rationale**: `mkdocs gh-deploy` builds the site and force-pushes the `site/` output to the `gh-pages` branch of the `origin` remote. This is MkDocs' native deployment mechanism and the only one required by the spec. The command:
1. Builds the site internally (no need to run `mkdocs build` separately before deploying).
2. Creates the `gh-pages` branch if it does not exist.
3. Requires the local repo to have a git remote named `origin` pointing to GitHub.
4. Does **not** require GitHub Actions or CI — it runs locally.

**Prerequisites confirmed**:
- MkDocs 1.6.1 is installed ✅
- Git is present (HAS_GIT: true from setup script) ✅
- `origin` remote must be set and point to GitHub — this is a developer environment precondition, documented in quickstart.md
- GitHub Pages must be enabled for the repository and configured to serve from `gh-pages` branch

**Alternatives considered**:
- GitHub Actions CI/CD pipeline: Rejected — out of scope per spec Assumption 6 ("A single `gh-pages` branch strategy is used for deployment; no CI/CD pipeline integration is in scope").
- Manual `mkdocs build` + manual push: Rejected — more error-prone and not the documented command.

---

## Decision 5: `docs/index.md` Source of Content

**Decision**: Author `docs/index.md` directly, deriving content from `README.md` and the existing specs.

**Rationale**: The existing `README.md` is in Portuguese and focused on the repository structure. The `docs/index.md` should be English (consistent with spec artifacts) and oriented toward explaining the project to visitors of the documentation site. Content is derived from the existing README and spec summaries — no new information is invented.

**Alternatives considered**:
- Symlink `README.md` → `docs/index.md`: Rejected — MkDocs supports this via `docs_dir` config but it would publish the Portuguese, code-centric README as the site home, reducing discoverability for stakeholders.
- Use `README.md` as `docs_dir` root: Rejected — incompatible with the `docs/` folder structure established by the Constitution.

---

## Decision 6: `site/` Output Directory Handling

**Decision**: Add `site/` to `.gitignore` so the build output is not committed to `main`.

**Rationale**: `mkdocs gh-deploy` handles pushing to `gh-pages` separately. Committing `site/` to `main` would pollute the source branch with generated files. Standard MkDocs practice is to exclude `site/` from source control on the main branch.

**Alternatives considered**:
- Committing `site/` to `main`: Rejected — generates large diffs of auto-generated HTML/CSS/JS on every docs change.

---

## Summary of Resolved Unknowns

| Unknown | Resolution |
|---------|------------|
| Theme | Built-in `mkdocs` (Material not installed) |
| Strict mode | `strict: true` in `mkdocs.yml` |
| Navigation | Explicit `nav:` block, "Features" section |
| Deployment | `mkdocs gh-deploy` with default `origin`/`gh-pages` |
| Index content | Authored from README + spec summaries |
| `site/` dir | Added to `.gitignore` |
