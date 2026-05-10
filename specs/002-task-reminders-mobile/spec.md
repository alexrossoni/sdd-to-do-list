# Feature Specification: Task Deadlines, Reminders & Mobile Improvements

**Feature Branch**: `002-task-reminders-mobile`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "Atualizar README com estrutura atualizada do projeto; adicionar funcionalidade de lembretes com data/hora limite, aviso visual na interface, notificação nativa opcional e ordenação por data/hora; melhorar responsividade mobile para botões, ícones e textos."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Add a Task with Deadline (Priority: P1)

When creating a new task, the user optionally sets a deadline date and time. The task is saved with that deadline and immediately appears in the list ordered chronologically by deadline. Tasks without a deadline are listed after tasks that have one.

**Why this priority**: The deadline field is the foundation of the entire reminder system. Without it, no alerts or sorting can function. This story must be in place for all subsequent deadline-related stories to be testable.

**Independent Test**: Open the application, create a task with a future deadline, and confirm the task appears in the list displaying the deadline. Create a second task without a deadline and confirm it appears after the first.

**Acceptance Scenarios**:

1. **Given** the task input form is open, **When** the user fills in the task description and selects a future date/time as the deadline, **Then** the saved task is displayed in the list with its deadline visible.
2. **Given** the task input form is open, **When** the user fills in only the task description (no deadline), **Then** the task is saved and listed without any deadline indicator.
3. **Given** multiple tasks with different deadlines exist, **When** the list is displayed, **Then** tasks are ordered from the earliest deadline to the latest, with deadline-less tasks appearing at the end.
4. **Given** a task with a past date/time is submitted as the deadline, **When** the task is saved, **Then** the task is immediately shown with an overdue visual state.

---

### User Story 2 — In-App Visual Alert for Expiring Tasks (Priority: P1)

The application continuously monitors task deadlines in the background. When a deadline has been reached or passed, the corresponding task receives a distinct visual treatment (e.g., a highlighted border, badge, or banner label) to draw the user's attention without requiring page interaction.

**Why this priority**: Proactive visual feedback is the core value of the reminder system. Users must see which tasks need immediate action without having to remember deadlines themselves.

**Independent Test**: Create a task with a deadline set to 1 minute in the future. Wait for the deadline to pass without interacting with the page, then confirm the task's visual appearance has changed to indicate it is overdue.

**Acceptance Scenarios**:

1. **Given** a task has a deadline set in the future, **When** the current time reaches or passes that deadline, **Then** the task's visual presentation changes to reflect an overdue state (distinct highlight, colour shift, or label) without any user action.
2. **Given** a task is already in an overdue state, **When** the user marks the task as completed, **Then** the overdue visual treatment is removed and the task shows a completed state instead.
3. **Given** multiple tasks have different deadlines, **When** only one deadline has passed, **Then** only that task shows the overdue visual treatment; others remain unaffected.
4. **Given** the page is reloaded while overdue tasks exist, **When** the application initialises, **Then** overdue tasks immediately display their overdue visual state.

---

### User Story 3 — Native Browser Notification on Deadline (Priority: P3)

When the user grants notification permission, the application dispatches a native browser notification at the moment a task's deadline is reached, even if the tab is not in focus.

**Why this priority**: Native notifications extend the reminder system beyond the browser tab, which is a significant usability enhancement. However, it is optional by nature — the app remains fully functional without it — so it is lower priority than in-app alerts.

**Independent Test**: Grant notification permission when prompted. Create a task with a deadline 1 minute ahead. Switch to a different tab. When the deadline passes, confirm a native browser notification appears identifying the task.

**Acceptance Scenarios**:

1. **Given** the application is opened for the first time (or permission has not yet been decided), **When** the user interacts with the deadline feature, **Then** the application requests notification permission from the browser.
2. **Given** the user has granted notification permission, **When** a task's deadline is reached, **Then** a native browser notification is displayed with the task description and a label indicating the task is due.
3. **Given** the user has denied notification permission, **When** a task's deadline is reached, **Then** no native notification is attempted; only the in-app visual alert is shown.
4. **Given** notification permission is granted, **When** multiple tasks share the same deadline, **Then** a notification is sent for each task.

---

### User Story 4 — Mobile-Optimised Interface (Priority: P2)

On small-screen devices, all interactive elements (buttons, icon controls) and body text are appropriately sized for touch interaction and comfortable reading, without breaking the existing layout or visual theme.

**Why this priority**: The application is used on mobile devices and small viewports. Without adequate touch target sizes, users on smartphones experience frustration and accidental taps. This is independent of the deadline feature and can be validated on its own.

**Independent Test**: Open the application on a physical smartphone or a browser emulating a 375 px wide viewport. Confirm every button and icon control can be tapped precisely and that all text is readable without zooming.

**Acceptance Scenarios**:

1. **Given** the application is viewed on a 375 px wide viewport, **When** the page renders, **Then** all interactive elements (add button, complete toggle, remove button) have a tap target of at least 44 × 44 px.
2. **Given** the application is viewed on a small screen, **When** the page renders, **Then** task descriptions, deadline labels, and error messages are readable without the user needing to zoom in.
3. **Given** a user taps interactive elements on mobile, **When** the element is activated, **Then** only the intended element responds — adjacent elements are not accidentally triggered due to inadequate spacing.
4. **Given** the application is displayed on a large-screen desktop viewport, **When** the page renders, **Then** the existing desktop layout and visual theme remain unchanged.

---

### User Story 5 — Updated README Documentation (Priority: P3)

The project's README file reflects the current directory structure and all source files accurately, so that new contributors or evaluators can understand the project at a glance.

**Why this priority**: Documentation accuracy is important but does not affect application functionality. It is addressed last as it depends on the final project structure being stable.

**Independent Test**: Read the README, then inspect the actual project directory. Confirm every file and directory listed in the README exists and every existing file/directory is represented.

**Acceptance Scenarios**:

1. **Given** the README lists the project structure, **When** a reader opens the repository, **Then** the file tree in the README matches the actual files on disk (`index.html`, `style.css`, `js/controller.js`, `js/model.js`, `js/view.js`, `README.md`, and the `specs/` directory).
2. **Given** the README describes the application, **When** a reader follows the "Como executar" instructions, **Then** they are able to run the application successfully.

---

### Edge Cases

- What happens when the user sets a deadline in the past while creating a task? The task must be saved and immediately displayed as overdue.
- What happens when the browser tab is closed and reopened after a deadline has passed? On initialisation, the application must detect the overdue state from persisted data and apply the overdue visual treatment instantly.
- What happens when the user's system clock changes (e.g., daylight-saving adjustment)? The application must evaluate deadlines against the current device time at each periodic check, accepting any time drift as-is.
- What happens if the user denies notification permission mid-session (via browser settings)? The next notification attempt will fail silently; only in-app alerts must be shown.
- What happens when a task with no deadline is added and tasks with deadlines exist? The deadline-less task is appended after all tasks that have deadlines.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When creating a task, users MUST be able to optionally set a deadline date and time.
- **FR-002**: Tasks that have a deadline MUST be displayed with their deadline date/time visible in the task list.
- **FR-003**: The task list MUST be sorted in ascending chronological order by deadline; tasks without a deadline MUST appear after all tasks with a deadline.
- **FR-004**: The application MUST periodically check all task deadlines against the current device time at an interval no greater than 60 seconds.
- **FR-005**: Tasks whose deadline has been reached or passed MUST receive a distinct visual treatment (e.g., highlighted border, colour change, overdue badge or label) to differentiate them from tasks within their deadline.
- **FR-006**: The overdue visual treatment MUST be applied automatically without requiring any user interaction.
- **FR-007**: When a task with an overdue indicator is marked as completed, the overdue visual treatment MUST be removed.
- **FR-008**: The application MUST request browser notification permission when the user engages with the deadline feature for the first time (if not previously granted or denied).
- **FR-009**: When notification permission is granted and a task's deadline is reached, the application MUST dispatch a native browser notification containing the task description and a "due now" label.
- **FR-010**: When notification permission has been denied, the application MUST NOT attempt to dispatch native notifications; only in-app alerts apply.
- **FR-011**: On viewports 768 px wide or narrower, all interactive elements MUST have a touch target area of at least 44 × 44 px.
- **FR-012**: On viewports 768 px wide or narrower, all text content MUST be rendered at a minimum font size sufficient for comfortable reading without zoom (at least 14 px equivalent).
- **FR-013**: The README MUST contain an accurate file/directory tree that matches the current project structure.
- **FR-014**: Deadline values MUST be persisted alongside the task description and completion state in local storage so that overdue detection survives a page reload.

### Key Entities

- **Task**: Represents a single to-do item. Attributes: unique identifier, description text, completion state (pending/completed), optional deadline (date and time), overdue state (derived from deadline vs. current time).
- **Reminder Check**: A recurring in-memory process that compares the current time against each task's deadline and triggers visual updates and optional notifications.
- **Notification Permission State**: A persistent record of whether the user has granted, denied, or not yet responded to the browser notification permission request.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can create a task with a deadline in under 30 seconds from opening the form.
- **SC-002**: Overdue visual indicators appear on expired tasks within 60 seconds of the deadline passing, without any user interaction.
- **SC-003**: On a 375 px wide viewport, all interactive controls are tappable without accidental activation of adjacent elements.
- **SC-004**: Native browser notifications are dispatched within 60 seconds of the deadline passing when permission has been granted.
- **SC-005**: The task list consistently presents tasks ordered by deadline on every screen size and after every page reload.
- **SC-006**: 100% of files present in the project directory are listed in the README file tree and vice versa.

---

## Assumptions

- The application runs entirely in the browser with no server component; all deadline checks are client-side only.
- Browser support targets modern evergreen browsers (Chrome, Firefox, Edge, Safari) that implement the Web Notifications API and `setInterval`.
- The "approaching deadline" warning threshold (e.g., 15 minutes before expiry) is not required for the initial implementation; only the overdue state (deadline already passed) triggers an alert.
- The user's device clock is the authoritative time source; no NTP synchronisation or server-side time validation is performed.
- Notification permission is requested lazily (on first deadline interaction), not on application startup, to avoid immediate intrusive permission prompts.
- The existing retro-terminal visual theme must be preserved; all new visual elements (overdue badges, deadline labels) must be styled consistently with that aesthetic.
- Accessibility (screen-reader support, ARIA roles) for new elements is out of scope for this iteration but must not regress existing behaviour.
- The `specs/` directory is intentionally excluded from the README file tree, as it is a development-only artefact.
