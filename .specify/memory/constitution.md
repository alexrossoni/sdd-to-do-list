<!--
  SYNC IMPACT REPORT
  ==================
  Version change: 1.0.0 → 1.1.0 (MINOR — new principle and documentation tooling added)
  Added sections: Principle VI (Living Documentation with MkDocs)
  Removed sections: none
  Modified sections: Technology Stack (MkDocs row added), Development Workflow (docs step added)
  Templates:
    - .specify/templates/plan-template.md  ✅ updated (MkDocs docs step in project structure)
    - .specify/templates/spec-template.md  ✅ aligned (no structural changes needed)
    - .specify/templates/tasks-template.md ✅ updated (documentation task added to Phase 1 Setup)
  Deferred TODOs: none
-->

# SDD To-Do List Constitution

## Core Principles

### I. Separation of Responsibilities (NON-NEGOTIABLE)

The application MUST follow the MVC (Model-View-Controller) pattern at all times:

- **Model** — manages application state (task data, persistence). MUST NOT touch the DOM or apply styling.
- **View** — handles all DOM reading and writing (rendering, event binding). MUST NOT contain business logic or data transformations.
- **Controller** — orchestrates the flow between Model and View. MUST NOT access the DOM directly; it delegates to View functions.

Any function that mixes these layers MUST be refactored before merging. File or module names MUST reflect their layer (`model.js`, `view.js`, `controller.js` or equivalent namespaces).

### II. Module Pattern & Encapsulation

JavaScript code MUST be organized using ES Modules (`import`/`export`) or, where module bundling is unavailable, IIFE-based namespaces. The requirements are:

- Global scope pollution is PROHIBITED. No variables or functions may be declared at the global `window` level unless required by a third-party integration.
- Each module MUST expose the minimum public API needed by its consumers.
- Cross-module communication MUST go through the Controller; View and Model MUST NOT import each other.

### III. Semantic HTML & Style Decoupling

- HTML MUST use semantically appropriate elements (`<button>`, `<ul>`, `<li>`, `<form>`, `<label>`, `<input>`, etc.). Generic `<div>` or `<span>` elements are permitted only for layout or presentational wrappers.
- CSS classes MUST be used exclusively for styling. JavaScript MUST NOT rely on CSS class names to select elements; instead, use `id` attributes or dedicated `data-*` attributes for JS hooks.
- CSS MUST be structured using a consistent naming convention (BEM recommended). Layout rules, theme rules, and component rules SHOULD be organized in clearly separated comment sections or files.

### IV. Pure Functions & Immutable State Transitions

- State transitions in the Model MUST be implemented as pure functions: given the same input they MUST return the same output with no side effects.
- State MUST NOT be mutated directly; each operation returns a new state snapshot which the Controller then commits.
- Event handlers in the View MUST be thin: they collect user input and invoke a Controller method, performing no logic themselves.

### V. Simplicity & YAGNI

- The stack is HTML5 + CSS3 + JavaScript ES6+, with no external libraries and no build tools.
- Features that are not explicitly required by the current specification MUST NOT be pre-implemented.
- Code complexity MUST be justified. Any abstraction layer introduced MUST serve at least two concrete, present use-cases before it is extracted.

### VI. Living Documentation with MkDocs

The project MUST maintain up-to-date documentation using **MkDocs** as the documentation site generator:

- A `docs/` folder at the repository root is the single source of truth for all human-readable project documentation.
- A `mkdocs.yml` configuration file at the repository root MUST define the site structure.
- Any feature, behaviour change, architectural decision, or configuration update that is merged into `main` MUST be reflected in the corresponding `docs/` page before the change is considered complete. Documentation is part of the **definition of done**.
- Spec artifacts (files under `specs/`) are source-of-truth for planning and remain unchanged; their relevant conclusions MUST be summarised in `docs/` for discoverability.
- The MkDocs site MUST be buildable without errors (`mkdocs build` passes) at all times on the `main` branch.
- No documentation page may reference a feature or API that no longer exists in the codebase (dead references are a bug).

## Technology Stack

| Layer        | Technology         | Notes                                        |
|--------------|--------------------|--------------------------------------------|
| Structure    | HTML5              | Semantic markup, no inline styles            |
| Styling      | CSS3               | BEM naming, no JavaScript style writes       |
| Behaviour    | JavaScript ES6+    | ES Modules; no frameworks, no bundlers       |
| Persistence  | `localStorage`     | JSON-serialized task array                   |
| Deployment   | Static file server | `index.html` opened directly or via CDN     |
| Documentation| MkDocs             | `docs/` folder; `mkdocs.yml` at repo root   |

No external runtime dependencies (npm packages, CDN libraries) are permitted without a formal amendment to this constitution. MkDocs and its Material theme are permitted as **documentation-only** dev dependencies and MUST NOT be included in the application bundle.

## Development Workflow

- **Branching**: feature branches from `main` using the `###-feature-name` convention.
- **Naming**: functions use `camelCase`; CSS classes use `kebab-case` (BEM); files use `kebab-case`.
- **Function length**: functions MUST remain under 30 lines. Functions exceeding this limit MUST be broken down.
- **Comments**: code MUST be self-documenting through clear naming. Comments are reserved for non-obvious decisions or regulatory/security notes.
- **Security**: all user input rendered to the DOM MUST be inserted via `textContent` or equivalent safe APIs. Use of `innerHTML` with unsanitized user data is PROHIBITED (XSS prevention).
- **Accessibility**: interactive elements MUST be keyboard-navigable and MUST carry appropriate ARIA attributes where native semantics are insufficient.
- **Documentation**: every completed feature or behaviour change MUST include a corresponding update to the relevant `docs/` page. Running `mkdocs build` MUST produce zero errors after any commit to `main`.

## Governance

This constitution supersedes all other verbal agreements or ad-hoc practices for this project.
Amendments require:

1. A written description of the change and rationale.
2. Update of this file with an incremented version following semantic versioning:
   - **MAJOR** — a principle is removed or fundamentally redefined.
   - **MINOR** — a new principle or section is added.
   - **PATCH** — wording clarification, typo fix, or non-semantic refinement.
3. Propagation review across all `.specify/templates/*.md` files to ensure alignment.

All code contributions MUST be reviewed against the Core Principles before being accepted.

**Version**: 1.1.0 | **Ratified**: 2026-05-10 | **Last Amended**: 2026-05-10
