# Cozy Planner Documentation

## Project Overview

Cozy Planner is a small browser-based personal planner built with semantic HTML, CSS, and plain JavaScript. It has no build system, package manager, external framework, or runtime dependency. The browser loads `index.html`, which links `style.css` for presentation and `script.js` for interaction.

The current features are:

- Sidebar navigation for Overview, Notes, and Goals.
- Active and completed task lists, with completion, undo, and editing actions.
- A task count and completed-task count that update from the task data.
- A configurable focus countdown with Start, Pause/Resume, Reset, and duration controls.
- Add and edit dialogs for tasks, notes, and goals.
- Profile settings for the display name, status, and five lowfi color themes.
- Browser storage persistence for notes, goals, and profile preferences.
- A static monthly calendar and a profile panel below New plan in the sidebar.

## Files

| File | Purpose |
| --- | --- |
| [index.html](index.html) | Defines the app structure, accessible controls, lists, and dialog forms. |
| [style.css](style.css) | Defines the color palette, layout, cards, controls, dialog styling, and responsive rules. |
| [script.js](script.js) | Owns task, note, goal, navigation, and focus timer behavior. |
| [REFLECTION.md](REFLECTION.md) | Assignment reflection document; it is not loaded by the planner. |
| [LICENSE](LICENSE) | MIT license for the project. |
| [DOCUMENTATION.md](DOCUMENTATION.md) | This project guide. |

## Running the Project

Open `index.html` in a modern browser. No server or build command is required for the current static app. The browser needs support for HTML `<dialog>` and `localStorage` for the full editing and persistence experience. If browser storage is unavailable, notes and goals still work in memory for the current page session because storage reads and writes are guarded with `try`/`catch`.

## HTML Walkthrough

The HTML uses semantic landmarks and stable element IDs so JavaScript can find the controls it updates.

### Document setup

- `<!DOCTYPE html>` selects modern HTML parsing.
- `<html lang="en">` declares the document language for assistive technology and browsers.
- The UTF-8 meta tag sets the character encoding.
- The viewport meta tag lets the layout adapt to mobile widths.
- `<title>` sets the browser-tab title.
- The stylesheet `<link>` loads `style.css`.
- The script `<script src="script.js">` loads the behavior after the page content has been parsed.

### App shell and sidebar

- `.page-shell` is the overall two-column grid: the sidebar and main content.
- `<aside class="sidebar">` groups the brand, navigation, New plan action, and profile.
- `.brand-mark` displays the decorative initial; `aria-hidden="true"` keeps that decoration out of the accessibility tree.
- The brand label and heading identify the planner.
- `<nav aria-label="Main navigation">` names the navigation landmark.
- Each navigation button has a `data-view` value. JavaScript matches that value to a panel's `data-panel` value.
- `.new-button` opens the task creation dialog.
- `.profile-panel` is placed after New plan so it appears beneath the button in the sidebar.

### Header and Overview

- `<main>` identifies the primary application content.
- `.topbar` contains the greeting, page heading, and displayed date.
- The Overview section starts active. Its `aria-labelledby` connects the region with its heading.
- The Tasks statistic contains `#activeTaskCount`; JavaScript replaces its initial `0` with the number of unfinished tasks.
- The Completed statistic contains `#completedTaskCount`; JavaScript updates it from completed task data.
- The Focus card contains `#focusCountdown`, a numeric duration form, and Start, Pause, and Reset buttons. The number input limits the requested duration to whole minutes from 1 through 180.
- `#overviewTaskList` is the destination for unfinished task rows. `aria-live="polite"` allows assistive technology to announce list updates without interrupting the user.
- `#completedList` is the destination for completed task rows and their Edit and Undo actions.
- The calendar is static markup: weekday labels and September day numbers are written into HTML. Its previous/next buttons currently have no JavaScript handler.

### Notes and Goals

- The Notes panel contains an Add note button and the empty `#notesList` container. JavaScript renders the saved or starter notes into this container.
- The Goals panel contains an Add goal button and the empty `#goalList` list. JavaScript renders the saved or starter goals there.
- Both list containers use `aria-live="polite"` so changes can be announced accessibly.
- The profile button opens a Settings view without adding a Settings sidebar link. `#profileSettingsForm` edits the display name and status and contains five radio choices: Warm, Sage, Rose, Blue hour, and Lilac.
- The color radios share `name="theme"`, so only one palette can be selected. Their values match names used by CSS and JavaScript. The selected theme previews immediately and is saved with the profile.

### Dialog forms

- `#taskDialog` contains the title and time fields used to create or edit tasks.
- `#noteDialog` contains a note title input and a multi-line note textarea.
- `#goalDialog` contains one goal-text input.
- Each form associates visible `<label>` elements with their inputs using matching `for` and `id` values.
- `required`, `maxlength`, `min`, `max`, and `step` attributes provide browser-side input constraints.
- Cancel buttons use `type="button"` so they close dialogs without submitting. Save buttons use `type="submit"` so the matching form handler processes the values.
- `<dialog>` provides native modal behavior, including focus management and Escape-key dismissal in supporting browsers.

## CSS Walkthrough

The stylesheet is grouped by visual role. Repeated declarations are explained where they are defined and apply to all matching elements.

### Theme and base rules

- `:root` defines reusable color and shadow variables. `--text` and `--muted` control text contrast; `--panel`, `--card`, and `--card-alt` distinguish surfaces; `--line` is the shared border; `--accent` and `--accent-soft` color focus controls; `--shadow` gives the app shell depth.
- `:root[data-theme="sage"]`, `:root[data-theme="rose"]`, `:root[data-theme="blue-hour"]`, and `:root[data-theme="lilac"]` override the shared palette variables. The default `:root` palette is Warm. Components use the same variables across themes rather than duplicating each component's styles.
- `* { box-sizing: border-box; }` makes element dimensions include padding and border.
- `body` removes the browser's default margin, sets the minimum page height, typeface, base font size, background, and text color.
- The shared form-control selector makes buttons, inputs, labels, and related inline elements inherit the surrounding font.

### Shell, sidebar, and dialogs

- `.page-shell` creates the two-column grid, limits its width, centers it, establishes a minimum height, and applies the translucent surface, border, rounded corners, shadow, and clipping.
- `.sidebar` is a vertical flex container with padding and a right divider. Its `margin-top: auto` on `.new-button` places New plan and the profile group toward the bottom.
- `.brand`, `.brand-mark`, `.brand-label`, and `.brand h2` define the logo block's spacing, square mark, small uppercase label, and title.
- `.main-nav ul` removes list markers and lays out navigation buttons with a consistent gap. `.nav-link` provides full-width alignment, hit area, and hover/active surface.
- `.new-button` styles the primary sidebar action.
- `.task-dialog` defines the shared modal surface, border, radius, text, and shadow; its `::backdrop` dims the page. `.note-dialog` gives the longer note editor extra width.
- `.task-form` uses a grid for evenly spaced labels, inputs, and actions. Form inputs and the note textarea share borders, padding, surface, and text color. The textarea gets a writing-height minimum and vertical resizing. `:focus` rules give form fields a visible accent outline.
- `.theme-fieldset`, `.theme-options`, `.theme-option`, and `.theme-swatch` present the five accessible radio choices with colored circular swatches. Each `.swatch-*` rule defines the color shown for one option.
- `.settings-panel`, `.settings-form`, `.settings-actions`, `.settings-back-button`, and `.settings-save-button` format the profile Settings view and its form controls.
- `.task-form-actions`, `.cancel-button`, and `.save-button` align and style the dialog commands.

### Main content and statistics

- `.main-content` provides the main page inset. `.topbar` arranges the heading and date badge on one row.
- `.eyebrow`, heading defaults, and `.date-badge` create the compact header hierarchy.
- `.overview`, `.task-panel`, `.notes-panel`, `.goals-panel`, and `.profile-panel` share a subtle bordered surface and rounded corners.
- `.view-panel` hides inactive views; `.view-panel.active` reveals the selected one.
- `.overview` adds interior spacing. `.section-heading` keeps a section title and its action button aligned.
- `.stat-grid` creates three equal statistic columns. `.stat-card` defines the card surface and vertically centers its content.
- `.focus-card-heading` separates the Focus label and countdown. `font-variant-numeric: tabular-nums` keeps changing digits visually stable.
- `.focus-duration-form` and `.focus-controls` lay out the editable duration and timer actions. Their input and button rules define compact borders, spacing, surfaces, and disabled-state feedback.

### Calendar, tasks, notes, and goals

- `.overview-layout` creates task and calendar columns. `.overview-panel` and `.calendar-panel` share inner-panel styling.
- `.calendar`, `.calendar-header`, and `.calendar-grid` define the calendar frame, month row, seven-column day grid, muted overflow dates, and active-day highlight.
- `.task-list` and `.completed-list` remove list markers and arrange rows with consistent gaps.
- `.task-item` is the active task row. `.task-check` aligns its checkbox and text; the checkbox uses the accent color. `.task-actions` aligns time and Edit controls.
- `.edit-button` and `.undo-button` style task and goal actions. `.completed-item` styles completed rows, and its text is struck through.
- `.note-card` styles each note. `.note-card-heading` aligns the note title and Edit button. `.note-card p` preserves newlines entered in the note body and wraps long words safely.
- `.add-note-button` and `.add-goal-button` share the Add action styling.
- `.goal-list` removes list markers and adds gaps. Its `<li>` rule turns each goal into a flex row, while `.goal-list span` lets long goal text wrap without pushing the Edit action away.
- `.profile-panel`, `.profile-avatar`, `.profile-name`, and `.profile-meta` style the profile placed in the sidebar.
- `.task-panel` and `.mini-task-list` styles are retained in the stylesheet, but the current HTML does not use those classes.

### Responsive rules

- At widths below 980px, the sidebar narrows to 200px and the main column takes the remaining width.
- At widths below 760px, the shell becomes a single column, its outer margin and width adapt for mobile, the sidebar divider moves to the bottom, and task rows stack vertically.

## JavaScript Logic Walkthrough

### Data and DOM references

Each `const` below stores a reference to an element or collection from `index.html`; later handlers use those references rather than searching the document on every interaction.

| JavaScript binding | Element or job |
| --- | --- |
| `overviewTaskList`, `completedList` | Active and completed task list containers. |
| `activeTaskCount`, `completedTaskCount` | Overview count values. |
| `focusCountdown`, `focusDurationForm`, `focusDurationInput`, `focusStartButton`, `focusPauseButton`, `focusResetButton` | Countdown display, editable duration, and timer controls. |
| `newPlanButton`, `taskDialog`, `taskForm`, `taskTitleInput`, `taskTimeInput`, `taskDialogTitle`, `savePlanButton`, `cancelPlanButton` | Task editor launch, dialog, fields, and actions. |
| `notesList`, `addNoteButton`, `noteDialog`, `noteForm`, `noteTitleInput`, `noteBodyInput`, `noteDialogTitle`, `saveNoteButton`, `cancelNoteButton` | Notes list and note editor controls. |
| `goalList`, `addGoalButton`, `goalDialog`, `goalForm`, `goalTextInput`, `goalDialogTitle`, `saveGoalButton`, `cancelGoalButton` | Goals list and goal editor controls. |
| `openSettingsButton`, `profileNameDisplay`, `profileStatusDisplay`, `profileAvatar`, `profileSettingsForm`, `themeInputs`, `backFromSettingsButton` | Profile settings navigation, sidebar profile display, editable values, and theme choices. |
| `navButtons`, `panels` | Collections used to switch the visible page section. |

- `tasks` is an in-memory array. Each task object has a numeric `id`, a `title`, a display `time`, and a Boolean `completed` value. The seed data contains two active tasks and three completed tasks.
- The `document.getElementById` and `document.querySelector` constants bind the script to HTML lists, counters, dialog forms, buttons, and fields. Keeping these references at the top makes the script-to-markup contract visible.
- `navButtons` and `panels` collect all view buttons and content panels so one navigation handler can control them.
- The default note array contains objects shaped as `{ id, title, body }`. The default goal array contains `{ id, text }` objects.
- `noteStorageKey` and `goalStorageKey` name separate `localStorage` entries: `cozyPlannerNotes` and `cozyPlannerGoals`.
- `profile` stores the display name, status, and theme. `themeNames` is the allow-list of supported themes. `activeView` and `settingsReturnView` track current navigation and where Back should return.
- `profileStorageKey` names the profile entry `cozyPlannerProfile`, whose object contains `name`, `status`, and `theme`.

### Loading and saving notes and goals

- Each data set begins with its default array.
- A `try` block reads the matching storage key and parses its JSON string. A missing key leaves the defaults in place.
- The parsed value is used only if it is an array and every element has the expected data types and an integer ID. Invalid or malformed data is ignored.
- `catch` restores the default array if browser storage access or JSON parsing fails.
- `saveNotes()` and `saveGoals()` serialize the current arrays with `JSON.stringify` and write them to their matching keys. Their `try`/`catch` blocks allow the current page to keep working when browser storage is disabled.
- Notes and goals persist across reloads in the same browser storage context. Tasks and the Focus timer are not saved and return to their initial values after reloading.
- Profile loading validates the saved name and status and accepts only a theme in `themeNames`; otherwise it uses the Warm default. `saveProfile()` serializes the profile under `cozyPlannerProfile`.

### Profile settings and themes

- Clicking `#openSettingsButton` fills the Settings form with the current profile and remembers the current page in `settingsReturnView` before showing Settings.
- `applyTheme(themeName)` sets `data-theme` on the document root. CSS attribute selectors override the shared palette variables based on that theme name.
- Changing a theme radio previews it immediately. The change is not committed to storage until Save profile is submitted.
- Saving validates the display name, reads the selected radio, saves the updated name/status/theme object, applies the chosen theme, updates the sidebar profile, and returns to the prior page.
- Back returns without saving and reapplies the saved `profile.theme`, discarding any unsaved color preview. Startup applies the saved theme before rendering the profile.

### Focus countdown

- `focusDurationSeconds` stores the configured duration in seconds; it starts from the HTML input's 25-minute default.
- `focusRemainingSeconds` stores the visible remaining time. `focusDeadline` stores the target timestamp while running. `focusTimerInterval` stores the interval handle so it can be cleared. `focusHasStarted` distinguishes Start from Resume.
- `renderFocusCountdown()` divides seconds into minutes and seconds, pads each part to two digits, and writes the result as `MM:SS`.
- `updateFocusControls()` disables Start while running or at zero, disables Pause while stopped, and changes the Start label to Resume after a timer has begun.
- `updateFocusCountdown()` computes the remaining seconds from `focusDeadline - Date.now()` rather than subtracting one on each interval. Rounding up avoids displaying zero before the deadline. At zero it clears the interval and updates the controls.
- Submitting `focusDurationForm` prevents page navigation, stops an existing interval, converts the entered minutes to seconds, resets the remaining time, and refreshes the display and controls.
- Start sets a deadline based on the remaining seconds and runs updates every 250 milliseconds. The deadline-based calculation stays accurate if interval callbacks are delayed.
- Pause first synchronizes the remaining time, then clears the deadline and interval while keeping the remainder for Resume.
- Reset stops the timer, restores the configured duration, resets the Start label state, and redraws the display.

### Safe rendering and list rendering

- `escapeHtml(value)` replaces ampersand, angle brackets, double quotes, and apostrophes with HTML entities. User-provided notes, goals, task titles, and times are escaped before interpolation into `innerHTML`.
- `renderNotes()` turns the notes array into note cards. Each card includes the escaped title and body and an Edit button carrying the note ID in `data-note-id`. If the array is empty, it displays an empty-state message.
- `renderGoals()` turns the goals array into list items with escaped text and Edit buttons carrying `data-goal-id`.
- `renderTasks()` filters tasks into active and completed arrays. It writes both counts, renders active checkboxes and edit controls, and renders completed tasks with Edit and Undo buttons.
- `toggleTask(taskId)` finds a task by numeric ID, flips `completed`, and calls `renderTasks()` so both lists and counters stay in sync.
- `setActiveView(viewName)` toggles the `active` CSS class on the matching navigation button and panel. CSS uses that class to show one view at a time.

### Add and edit dialogs

All three editors use the same pattern: an empty form `data-*` ID means create mode; a populated ID means edit mode. When a form submits, JavaScript either updates the object found by that ID or appends a new object with the next available ID.

- `openNoteEditor(noteId)` finds an existing note when an ID is provided, fills the title and body fields, updates the dialog heading and save-button label, opens the dialog, and focuses the title field. With no ID it opens a blank creation form.
- The Add note button opens the blank form. Cancel closes it. The submit handler prevents navigation, trims both values, rejects empty input, updates or creates the note, saves it, redraws the note list, and closes the dialog.
- The `notesList` click handler uses event delegation: it listens on the list container and checks whether the clicked target is an Edit button. The button's `data-note-id` identifies which note to edit.
- `openGoalEditor(goalId)` follows the same flow for a single goal text field. Its submit handler trims and validates the value, updates or creates the goal, saves it, redraws the list, and closes the dialog. The `goalList` click handler delegates Edit clicks.
- `openTaskEditor(taskId)` fills the task title and time or prepares a blank form. The task submit handler validates the title, defaults an empty time to `Anytime`, updates or adds the task, closes the dialog, and redraws task lists and counts.
- Task checkboxes use a delegated `change` handler on `overviewTaskList`; the task ID is carried in `data-task-id`.
- Active and completed task Edit buttons are handled by delegated click handlers. Completed-list clicks also detect Undo and call `toggleTask()`.
- Each sidebar navigation button calls `setActiveView()` with its `data-view` value.

### Startup order

At the end of `script.js`, `renderNotes()`, `renderGoals()`, and `renderTasks()` populate the page from current data. `setActiveView('overview')` displays the initial Overview panel. Event handlers have already been registered before this first render.

## Data and Current Limitations

| Feature | Data location | Reload behavior |
| --- | --- | --- |
| Tasks | JavaScript `tasks` array | Returns to the built-in sample tasks. |
| Focus timer | JavaScript timer variables | Resets to the 25-minute default. |
| Notes | `localStorage` key `cozyPlannerNotes` | User changes persist. |
| Goals | `localStorage` key `cozyPlannerGoals` | User changes persist. |
| Profile | `localStorage` key `cozyPlannerProfile` | Display name, status, and theme persist. |
| Calendar | Hard-coded HTML | Displays the static September layout; month arrows are not connected. |
| Header date | Hard-coded HTML | Remains fixed until edited in the HTML. |

There are currently no delete actions for notes or goals. Notes and goals are editable and can be added, but only the stored arrays are changed by those controls. The project has no automated test suite; functionality has been exercised in the browser, and `node --check script.js` checks JavaScript syntax.
