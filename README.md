# Cozy Planner

A calm, browser-based personal planner made with semantic HTML, CSS, and vanilla JavaScript. It runs locally without a build step, package installation, or external dependencies.

## Run it

Open [index.html](index.html) in a modern browser. The app uses native HTML dialogs and browser `localStorage`.

## Features

- **Overview:** active and completed task lists with live counts, plus a monthly calendar.
- **Tasks:** create tasks with a title and time, edit them, mark them complete, or undo completion.
- **Focus timer:** set a duration from 1 to 180 minutes, then start, pause/resume, or reset the countdown.
- **Notes:** add and edit titled notes, including multi-line text.
- **Goals:** add and edit goals.
- **Profile settings:** change the display name and status, and choose from five lowfi palettes: Warm, Sage, Rose, Blue hour, and Lilac.

## Data and limitations

Notes, goals, and profile settings are saved in this browser using `localStorage`. Tasks and the focus timer are currently held in memory, so they return to their starter state when the page reloads. The calendar is a static September layout; its month buttons are not connected yet.

## Project files

- [index.html](index.html): page structure and forms.
- [style.css](style.css): layout, responsive styles, and color themes.
- [script.js](script.js): task, timer, note, goal, navigation, and profile behavior.
- [DOCUMENTATION.md](DOCUMENTATION.md): detailed walkthrough of the markup, styles, logic, and data flow.
- [REFLECTION.md](REFLECTION.md): project reflection.
- [LICENSE](LICENSE): MIT license.
