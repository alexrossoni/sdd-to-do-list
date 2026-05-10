# Feature Specification: MkDocs Living Documentation

**Feature Branch**: `003-mkdocs-living-docs`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: Integrar MkDocs como documentação viva do projeto no estado atual, seguindo o especificado na constitution (Princípio VI). MkDocs já instalado; comandos-chave: `mkdocs new .` e `mkdocs gh-deploy`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scaffolding and Local Build (Priority: P1)

As a developer, I want to scaffold the MkDocs configuration and create all documentation pages so that the documentation site builds locally without errors, reflecting the current project state (features 001 and 002).

**Why this priority**: This is the foundation of the entire feature. Without a buildable documentation site, deployment and discoverability are impossible. It also fulfills the Constitution Principle VI definition of done.

**Independent Test**: Can be fully tested by running `mkdocs new .` followed by `mkdocs build` and confirming the output directory is created with zero errors and warnings.

**Acceptance Scenarios**:

1. **Given** the repository root contains no `mkdocs.yml`, **When** the developer runs `mkdocs new .`, **Then** a `mkdocs.yml` file and a `docs/index.md` are created at the repo root.
2. **Given** `mkdocs.yml` is configured and all docs pages exist, **When** the developer runs `mkdocs build`, **Then** the command exits with code 0 and produces zero errors or warnings.
3. **Given** `docs/index.md` exists, **When** the site is built, **Then** the index page describes the project purpose, stack, and links to all feature pages.
4. **Given** features 001 (Core To-Do List) and 002 (Task Reminders & Mobile) are complete, **When** the site is built, **Then** each feature has a corresponding documentation page under `docs/features/`.
5. **Given** a dead link is introduced in any `docs/` page, **When** `mkdocs build` runs with strict mode enabled, **Then** the build fails and identifies the broken reference.

---

### User Story 2 - GitHub Pages Deployment (Priority: P2)

As a developer, I want to deploy the documentation site to GitHub Pages so that team members and stakeholders can access up-to-date project documentation via a public URL without needing to clone the repository.

**Why this priority**: Deployment makes the documentation useful beyond the local machine. It transforms specs into a discoverable, shareable knowledge base.

**Independent Test**: Can be fully tested by running `mkdocs gh-deploy` and verifying the site is reachable at the GitHub Pages URL.

**Acceptance Scenarios**:

1. **Given** a valid `mkdocs.yml` and built `docs/` content, **When** the developer runs `mkdocs gh-deploy`, **Then** the command pushes the built site to the `gh-pages` branch of the repository.
2. **Given** the `gh-pages` branch is up to date, **When** the developer visits the GitHub Pages URL, **Then** the documentation site loads and all navigation links resolve correctly.
3. **Given** the site has been previously deployed, **When** the developer runs `mkdocs gh-deploy` again after a docs update, **Then** the deployed site reflects the latest content within a reasonable propagation window.

---

### User Story 3 - Feature Documentation Discoverability (Priority: P3)

As a stakeholder or new contributor, I want to browse the documentation site and find summaries of every completed feature so that I can understand what the application does without reading raw spec files.

**Why this priority**: This closes the loop between specs (planning artifacts) and docs (communication artifacts), as required by the Constitution.

**Independent Test**: Can be fully tested by opening the built site and navigating to each feature page, confirming that the content matches the implemented behaviour.

**Acceptance Scenarios**:

1. **Given** the built documentation site, **When** a visitor opens the home page, **Then** a clear navigation menu lists all documented features.
2. **Given** the feature page for 001-todo-list-core, **When** a visitor opens it, **Then** it describes task creation, editing, completion, deletion, and localStorage persistence in plain language.
3. **Given** the feature page for 002-task-reminders-mobile, **When** a visitor opens it, **Then** it describes deadline input, overdue detection, browser notifications, and mobile touch-target improvements.
4. **Given** a feature exists in the codebase, **When** there is no corresponding `docs/` page, **Then** the gap is treated as a documentation bug and tracked.

---

### Edge Cases

- What happens when `mkdocs new .` is run in a repository that already has a `docs/` folder with content? — Existing files must not be overwritten; only `mkdocs.yml` and `docs/index.md` are created if absent.
- How does the system handle a `docs/` page that references a feature not yet implemented? — Dead references MUST cause `mkdocs build` to fail in strict mode.
- What if `mkdocs gh-deploy` fails due to missing GitHub permissions? — The error message from MkDocs is surfaced to the developer; no silent failures.
- What if the `docs/` folder already has partial content before scaffolding? — Only missing files are created; existing content is preserved.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository root MUST contain a `mkdocs.yml` file that defines the site name, navigation structure, and theme for the documentation site.
- **FR-002**: The `docs/` folder MUST contain an `index.md` page that introduces the project, describes its purpose, and links to all feature documentation pages.
- **FR-003**: The `docs/features/` folder MUST contain one Markdown page per completed feature: `001-todo-list-core.md` and `002-task-reminders-mobile.md`.
- **FR-004**: Each feature page MUST summarise the feature's purpose, key behaviours, and user-facing interactions in plain language accessible to non-technical stakeholders.
- **FR-005**: The `mkdocs.yml` navigation MUST include entries for the index page and each feature page, organized under a "Features" section.
- **FR-006**: Running `mkdocs build` at the repository root MUST complete with zero errors and zero warnings.
- **FR-007**: Running `mkdocs gh-deploy` MUST publish the built site to the `gh-pages` branch of the remote repository.
- **FR-008**: No documentation page MAY contain a reference (link or description) to a feature or API that does not exist in the codebase.
- **FR-009**: The documentation site MUST be re-deployable by any developer with repository write access using only `mkdocs gh-deploy`, without additional tooling.
- **FR-010**: A `docs/features/003-mkdocs-living-docs.md` page MUST be created documenting this feature itself, so the documentation setup is self-referencing.

### Key Entities

- **`mkdocs.yml`**: Root-level configuration file that controls site metadata, theme, and navigation structure. Single source of truth for MkDocs settings.
- **`docs/index.md`**: Project home page — describes purpose, current feature set, and links to feature pages.
- **`docs/features/*.md`**: One file per completed feature; summarises behaviour and user interactions for each feature.
- **Feature Documentation Page**: A Markdown file in `docs/features/` that captures the user-facing description of a specific feature, derived from the corresponding spec.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `mkdocs build` completes with zero errors and zero warnings after scaffolding and content creation.
- **SC-002**: The deployed GitHub Pages site is reachable via the repository's GitHub Pages URL with all navigation links resolving.
- **SC-003**: Both existing features (001 and 002) have corresponding documentation pages that accurately describe their implemented behaviour.
- **SC-004**: A new developer can build and deploy the documentation site using only the two documented commands (`mkdocs new .` if needed, then `mkdocs gh-deploy`) without additional setup steps.
- **SC-005**: No dead references exist in the documentation at the time of initial deployment (zero broken internal links reported by `mkdocs build`).
- **SC-DOC**: `docs/features/003-mkdocs-living-docs.md` exists and `mkdocs build` passes with zero errors (required by Constitution Principle VI).

## Assumptions

- MkDocs is already installed in the developer's environment and available on the system `PATH`; no installation step is required as part of this feature.
- The repository is hosted on GitHub and GitHub Pages is available for the repository (public or with Pages enabled for private repos).
- The default MkDocs theme (`mkdocs` built-in) or the Material theme is acceptable; no custom theme design is required.
- Spec artifacts under `specs/` are planning documents and remain unchanged; this feature summarises their outcomes in `docs/` rather than replacing them.
- The `docs/features/` directory already exists in the repository but is empty, so no migration of existing content is required.
- A single `gh-pages` branch strategy is used for deployment (MkDocs default); no CI/CD pipeline integration is in scope for this feature.
- Content for feature documentation pages is derived from existing spec files and the current codebase state, not authored from scratch.
