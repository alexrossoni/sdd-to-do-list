# Tasks: MkDocs Living Documentation

**Input**: Design documents from `specs/003-mkdocs-living-docs/`  
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ui-contract.md ✅ · quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to ([US1], [US2], [US3])
- Exact file paths included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold the MkDocs project and configure the `.gitignore` entry — prerequisites for all user stories.

- [X] T001 Run `mkdocs new .` at the repository root to scaffold `mkdocs.yml` and the initial `docs/index.md` placeholder (if `mkdocs.yml` does not already exist)
- [X] T002 Replace the scaffolded `mkdocs.yml` with the configured version: `site_name: SDD To-Do List`, `theme.name: mkdocs`, `strict: true`, and the explicit `nav:` block defined in `contracts/ui-contract.md`
- [X] T003 [P] Add `site/` entry to `.gitignore` at the repository root to prevent build output from being committed to `main`

**Checkpoint**: `mkdocs.yml` exists at repo root with `strict: true` and the full nav block; `.gitignore` excludes `site/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The `docs/` folder structure must exist before any content page can be created. Because `docs/features/` is confirmed empty and `docs/index.md` is absent, this phase ensures the scaffolded index placeholder is in place and the features subdirectory is ready.

**⚠️ CRITICAL**: No user story content tasks can begin until T001–T003 are complete and `mkdocs.yml` is valid.

- [X] T004 Verify `docs/features/` directory exists at repository root (it should already exist but be empty — create it if absent)

**Checkpoint**: `mkdocs.yml` is configured, `docs/features/` exists — content creation can begin

---

## Phase 3: User Story 1 — Scaffolding and Local Build (Priority: P1) 🎯 MVP

**Goal**: Author all four documentation pages and verify `mkdocs build` passes with zero errors and warnings.

**Independent Test**: Run `mkdocs build` — command exits with code 0 and the `site/` directory is produced. Then run `mkdocs serve` and confirm all four nav links load pages in the browser.

### Implementation for User Story 1

- [X] T005 [US1] Author `docs/index.md`: include H1 heading matching `site_name`, project description with SDD context, Technology Stack section, MVC Architecture section, Features section with relative links to all three feature pages, and Getting Started section (per `contracts/ui-contract.md`)
- [X] T006 [P] [US1] Author `docs/features/001-todo-list-core.md`: include H1, Overview, Key Behaviours (task creation, completion toggle, deletion, input validation ≤ 120 chars, localStorage persistence), and User Interface section describing the retro-terminal aesthetic (per `contracts/ui-contract.md`)
- [X] T007 [P] [US1] Author `docs/features/002-task-reminders-mobile.md`: include H1, Overview, Key Behaviours (deadline `datetime-local` input, overdue CSS class, Web Notifications API, task sorting by deadline), Permissions note, and Mobile Support note for ≤ 768 px breakpoint (per `contracts/ui-contract.md`)
- [X] T008 [P] [US1] Author `docs/features/003-mkdocs-living-docs.md`: include H1, Overview explaining Constitution Principle VI, Key Behaviours (local build, GitHub Pages deployment, strict mode, per-feature pages), Commands code block (`mkdocs build` / `mkdocs gh-deploy`), and Adding a New Feature Page guide (per `contracts/ui-contract.md`)
- [X] T009 [US1] Run `mkdocs build` at repository root and resolve any errors or warnings until the command exits with code 0 and zero warnings (depends on T002, T005, T006, T007, T008)

**Checkpoint**: `mkdocs build` exits code 0; all four pages render via `mkdocs serve`; no dead links; User Story 1 is fully functional and independently verifiable

---

## Phase 4: User Story 2 — GitHub Pages Deployment (Priority: P2)

**Goal**: Publish the built site to GitHub Pages via `mkdocs gh-deploy` so the documentation is publicly accessible.

**Independent Test**: Run `mkdocs gh-deploy` and verify: (a) command completes without errors, (b) `gh-pages` branch is created/updated on `origin`, (c) the GitHub Pages URL loads the site and all nav links resolve.

### Implementation for User Story 2

- [X] T010 [US2] Verify the local git repository has a remote named `origin` pointing to the GitHub repository: `git remote -v` (depends on Phase 3 completion)
- [X] T011 [US2] Run `mkdocs gh-deploy` at the repository root; confirm the command builds the site, pushes to the `gh-pages` branch of `origin`, and prints the GitHub Pages URL on success (depends on T010)
- [X] T012 [US2] Open the printed GitHub Pages URL in a browser (allow 1–5 minutes for propagation) and confirm the home page loads; verify all navigation links in the sidebar resolve to their respective pages

**Checkpoint**: Documentation site is publicly accessible at the GitHub Pages URL; all nav links work on the deployed site; User Story 2 is independently verifiable

---

## Phase 5: User Story 3 — Feature Documentation Discoverability (Priority: P3)

**Goal**: Confirm the deployed site allows any visitor to browse and understand every completed feature without accessing the raw spec files.

**Independent Test**: Open the built or deployed site; navigate to each feature page; confirm content matches implemented behaviour and no page references unimplemented functionality.

### Implementation for User Story 3

- [X] T013 [P] [US3] Review `docs/features/001-todo-list-core.md` content against the implemented `js/model.js`, `js/view.js`, `js/controller.js` and `index.html` — confirm every behaviour listed exists in the codebase and no future feature is referenced
- [X] T014 [P] [US3] Review `docs/features/002-task-reminders-mobile.md` content against the implemented deadline and notification code in `js/model.js`, `js/view.js`, `js/controller.js` and `style.css` — confirm accuracy and no dead references
- [X] T015 [US3] Run `mkdocs build` once more after any content corrections from T013–T014 and confirm zero errors and warnings (depends on T013, T014)

**Checkpoint**: All three feature pages accurately describe only implemented behaviour; no dead references; `mkdocs build` passes; User Story 3 is complete

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation pass using the quickstart checklist and ensuring the full definition of done is met per Constitution Principle VI.

- [X] T016 [P] Run through all items in `specs/003-mkdocs-living-docs/quickstart.md` verification checklist and confirm every checkbox passes
- [X] T017 Confirm `site/` does not appear in `git status` on the `main` branch (i.e., `.gitignore` entry is effective): `git status --short`
- [X] T018 Run `mkdocs gh-deploy` one final time to ensure the deployed site reflects all content corrections made during Phase 5

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)          → no dependencies; start immediately
Phase 2 (Foundational)   → depends on Phase 1
Phase 3 (US1 — Build)    → depends on Phase 2; MVP increment
Phase 4 (US2 — Deploy)   → depends on Phase 3 (site must build cleanly before deploying)
Phase 5 (US3 — Review)   → depends on Phase 4 (reviewing the full delivered state)
Phase 6 (Polish)         → depends on Phase 5
```

### User Story Dependencies

- **US1 (P1)**: Depends only on Setup/Foundational — independently testable via `mkdocs build`
- **US2 (P2)**: Depends on US1 — deploying requires a clean build
- **US3 (P3)**: Depends on US2 — discoverability review is most meaningful on the deployed artifact

### Within Each User Story

- **US1**: T005 (index) must be done before T009 (build check). T006, T007, T008 are parallel.
- **US2**: T010 → T011 → T012 are sequential (each depends on prior step).
- **US3**: T013 and T014 are parallel; T015 depends on both.

---

## Parallel Execution Examples

**Phase 3 (US1)** — after T005 is complete:
```
T006 (001-todo-list-core.md)    ─┐
T007 (002-task-reminders.md)    ─┼─ all parallel → then T009 (mkdocs build)
T008 (003-mkdocs-living-docs.md)─┘
```

**Phase 1** — T003 (`.gitignore`) is parallel with T002 (`mkdocs.yml` config).

**Phase 5 (US3)** — T013 and T014 are parallel content reviews.

---

## Implementation Strategy

**MVP scope**: Phases 1–3 (US1). After T009 passes, the documentation site builds locally and Constitution Principle VI is satisfied for the `main` branch. US2 and US3 add deployment and discoverability on top.

**Delivery order**: Sequential by phase — US2 cannot deploy a broken build; US3 review is most effective on the deployed site.

**Suggested first session**: Complete T001 → T004 → T005 → (T006 + T007 + T008 in parallel) → T009. If `mkdocs build` passes, the MVP is done.
