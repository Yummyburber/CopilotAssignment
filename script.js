const tasks = [
  { id: 1, title: 'Review project brief', time: '9:00 AM', completed: false },
  { id: 2, title: 'Write weekly reflection', time: '11:30 AM', completed: false },
  { id: 3, title: 'Stretch and reset', time: '3:00 PM', completed: true },
  { id: 4, title: 'Morning walk', time: '7:30 AM', completed: true },
  { id: 5, title: 'Inbox reset', time: '4:00 PM', completed: true }
];

const overviewTaskList = document.getElementById('overviewTaskList');
const completedList = document.getElementById('completedList');
const activeTaskCount = document.getElementById('activeTaskCount');
const completedTaskCount = document.getElementById('completedTaskCount');
const focusCountdown = document.getElementById('focusCountdown');
const focusDurationForm = document.getElementById('focusDurationForm');
const focusDurationInput = document.getElementById('focusDuration');
const focusStartButton = document.getElementById('focusStart');
const focusPauseButton = document.getElementById('focusPause');
const focusResetButton = document.getElementById('focusReset');
const newPlanButton = document.querySelector('.new-button');
const taskDialog = document.getElementById('taskDialog');
const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskTimeInput = document.getElementById('taskTime');
const taskDialogTitle = document.getElementById('taskDialogTitle');
const savePlanButton = taskForm.querySelector('.save-button');
const cancelPlanButton = taskForm.querySelector('.cancel-button');
const notesList = document.getElementById('notesList');
const addNoteButton = document.getElementById('addNoteButton');
const noteDialog = document.getElementById('noteDialog');
const noteForm = document.getElementById('noteForm');
const noteTitleInput = document.getElementById('noteTitle');
const noteBodyInput = document.getElementById('noteBody');
const noteDialogTitle = document.getElementById('noteDialogTitle');
const saveNoteButton = noteForm.querySelector('.save-button');
const cancelNoteButton = noteForm.querySelector('.cancel-button');
const goalList = document.getElementById('goalList');
const addGoalButton = document.getElementById('addGoalButton');
const goalDialog = document.getElementById('goalDialog');
const goalForm = document.getElementById('goalForm');
const goalTextInput = document.getElementById('goalText');
const goalDialogTitle = document.getElementById('goalDialogTitle');
const saveGoalButton = goalForm.querySelector('.save-button');
const cancelGoalButton = goalForm.querySelector('.cancel-button');
const openSettingsButton = document.getElementById('openSettingsButton');
const profileAvatar = document.getElementById('profileAvatar');
const profileNameDisplay = document.getElementById('profileName');
const profileStatusDisplay = document.getElementById('profileStatus');
const profileSettingsForm = document.getElementById('profileSettingsForm');
const profileNameInput = document.getElementById('profileNameInput');
const profileStatusInput = document.getElementById('profileStatusInput');
const themeInputs = profileSettingsForm.querySelectorAll('input[name="theme"]');
const backFromSettingsButton = document.getElementById('backFromSettings');
const navButtons = document.querySelectorAll('.nav-link');
const panels = document.querySelectorAll('.view-panel');
const profileStorageKey = 'cozyPlannerProfile';
const themeNames = ['warm', 'sage', 'rose', 'blue-hour', 'lilac'];
const defaultProfile = { name: 'Ariana', status: 'Focused and calm', theme: 'warm' };
let profile = defaultProfile;
let activeView = 'overview';
let settingsReturnView = 'overview';

try {
  const savedProfile = window.localStorage.getItem(profileStorageKey);
  const parsedProfile = savedProfile ? JSON.parse(savedProfile) : null;

  if (
    parsedProfile
    && typeof parsedProfile.name === 'string'
    && parsedProfile.name.trim()
    && typeof parsedProfile.status === 'string'
  ) {
    profile = {
      name: parsedProfile.name,
      status: parsedProfile.status,
      theme: themeNames.includes(parsedProfile.theme) ? parsedProfile.theme : defaultProfile.theme
    };
  }
} catch {
  profile = defaultProfile;
}

const noteStorageKey = 'cozyPlannerNotes';
const defaultNotes = [
  { id: 1, title: 'Soft reminders', body: 'Keep your pace gentle. You do not need to carry everything at once.' },
  { id: 2, title: 'Things to remember', body: 'Take breaks, hydrate, and protect the parts of your day that feel quiet and grounded.' }
];
let notes = defaultNotes;

try {
  const savedNotes = window.localStorage.getItem(noteStorageKey);
  const parsedNotes = savedNotes ? JSON.parse(savedNotes) : null;

  if (Array.isArray(parsedNotes) && parsedNotes.every((note) => (
    note && Number.isInteger(note.id) && typeof note.title === 'string' && typeof note.body === 'string'
  ))) {
    notes = parsedNotes;
  }
} catch {
  notes = defaultNotes;
}

const goalStorageKey = 'cozyPlannerGoals';
const defaultGoals = [
  { id: 1, text: 'Build a calmer routine around my workday.' },
  { id: 2, text: 'Finish the planner with a warm, focused layout.' },
  { id: 3, text: 'Keep my priorities realistic and achievable.' }
];
let goals = defaultGoals;

try {
  const savedGoals = window.localStorage.getItem(goalStorageKey);
  const parsedGoals = savedGoals ? JSON.parse(savedGoals) : null;

  if (Array.isArray(parsedGoals) && parsedGoals.every((goal) => (
    goal && Number.isInteger(goal.id) && typeof goal.text === 'string'
  ))) {
    goals = parsedGoals;
  }
} catch {
  goals = defaultGoals;
}

let focusDurationSeconds = Number(focusDurationInput.value) * 60;
let focusRemainingSeconds = focusDurationSeconds;
let focusDeadline = null;
let focusTimerInterval = null;
let focusHasStarted = false;

function renderFocusCountdown() {
  const minutes = Math.floor(focusRemainingSeconds / 60);
  const seconds = focusRemainingSeconds % 60;
  focusCountdown.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateFocusControls() {
  const isRunning = focusDeadline !== null;
  focusStartButton.textContent = focusHasStarted ? 'Resume' : 'Start';
  focusStartButton.disabled = isRunning || focusRemainingSeconds === 0;
  focusPauseButton.disabled = !isRunning;
}

function updateFocusCountdown() {
  if (focusDeadline === null) {
    return;
  }

  focusRemainingSeconds = Math.max(0, Math.ceil((focusDeadline - Date.now()) / 1000));
  renderFocusCountdown();

  if (focusRemainingSeconds === 0) {
    focusDeadline = null;
    clearInterval(focusTimerInterval);
    focusTimerInterval = null;
  }

  updateFocusControls();
}

focusDurationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  clearInterval(focusTimerInterval);
  focusTimerInterval = null;
  focusDeadline = null;
  focusDurationSeconds = Number(focusDurationInput.value) * 60;
  focusRemainingSeconds = focusDurationSeconds;
  focusHasStarted = false;
  renderFocusCountdown();
  updateFocusControls();
});

focusStartButton.addEventListener('click', () => {
  if (focusDeadline !== null || focusRemainingSeconds === 0) {
    return;
  }

  focusHasStarted = true;
  focusDeadline = Date.now() + focusRemainingSeconds * 1000;
  focusTimerInterval = setInterval(updateFocusCountdown, 250);
  updateFocusControls();
});

focusPauseButton.addEventListener('click', () => {
  updateFocusCountdown();

  if (focusDeadline === null) {
    return;
  }

  focusDeadline = null;
  clearInterval(focusTimerInterval);
  focusTimerInterval = null;
  updateFocusControls();
});

focusResetButton.addEventListener('click', () => {
  clearInterval(focusTimerInterval);
  focusTimerInterval = null;
  focusDeadline = null;
  focusRemainingSeconds = focusDurationSeconds;
  focusHasStarted = false;
  renderFocusCountdown();
  updateFocusControls();
});

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function renderNotes() {
  notesList.innerHTML = notes.length
    ? notes.map((note) => `
        <article class="note-card">
          <div class="note-card-heading">
            <h3>${escapeHtml(note.title)}</h3>
            <button type="button" class="edit-button" data-note-id="${note.id}">Edit</button>
          </div>
          <p>${escapeHtml(note.body)}</p>
        </article>
      `).join('')
    : '<p class="empty-notes">No notes yet.</p>';
}

function saveNotes() {
  try {
    window.localStorage.setItem(noteStorageKey, JSON.stringify(notes));
  } catch {
    return;
  }
}

function renderGoals() {
  goalList.innerHTML = goals.map((goal) => `
    <li>
      <span>${escapeHtml(goal.text)}</span>
      <button type="button" class="edit-button" data-goal-id="${goal.id}">Edit</button>
    </li>
  `).join('');
}

function saveGoals() {
  try {
    window.localStorage.setItem(goalStorageKey, JSON.stringify(goals));
  } catch {
    return;
  }
}

function renderProfile() {
  profileAvatar.textContent = profile.name.trim().charAt(0).toUpperCase() || 'A';
  profileNameDisplay.textContent = profile.name;
  profileStatusDisplay.textContent = profile.status;
  profileStatusDisplay.hidden = !profile.status;
}

function applyTheme(themeName) {
  document.documentElement.dataset.theme = themeName;
}

function saveProfile() {
  try {
    window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
  } catch {
    return;
  }
}

function renderTasks() {
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  activeTaskCount.textContent = activeTasks.length;
  completedTaskCount.textContent = completedTasks.length;

  const taskMarkup = activeTasks
    .map(
      (task) => `
        <li class="task-item">
          <label class="task-check">
            <input type="checkbox" data-task-id="${task.id}" />
            <span>${escapeHtml(task.title)}</span>
          </label>
          <div class="task-actions">
            <time>${escapeHtml(task.time)}</time>
            <button type="button" class="edit-button" data-task-id="${task.id}">Edit</button>
          </div>
        </li>
      `
    )
    .join('');

  overviewTaskList.innerHTML = taskMarkup;

  completedList.innerHTML = completedTasks
    .map(
      (task) => `
        <li class="completed-item">
          <span>${escapeHtml(task.title)}</span>
          <div class="task-actions">
            <button type="button" class="edit-button" data-task-id="${task.id}">Edit</button>
            <button type="button" class="undo-button" data-task-id="${task.id}">Undo</button>
          </div>
        </li>
      `
    )
    .join('');
}

function toggleTask(taskId) {
  const task = tasks.find((item) => item.id === Number(taskId));

  if (!task) {
    return;
  }

  task.completed = !task.completed;
  renderTasks();
}

function setActiveView(viewName) {
  activeView = viewName;

  navButtons.forEach((button) => {
    const isActive = button.dataset.view === viewName;
    button.classList.toggle('active', isActive);
  });

  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === viewName);
  });
}

function openNoteEditor(noteId) {
  const note = noteId === undefined
    ? null
    : notes.find((item) => item.id === Number(noteId));

  if (noteId !== undefined && !note) {
    return;
  }

  noteForm.dataset.noteId = note ? note.id : '';
  noteTitleInput.value = note ? note.title : '';
  noteBodyInput.value = note ? note.body : '';
  noteDialogTitle.textContent = note ? 'Edit note' : 'New note';
  saveNoteButton.textContent = note ? 'Save changes' : 'Add note';
  noteDialog.showModal();
  noteTitleInput.focus();
}

addNoteButton.addEventListener('click', () => {
  openNoteEditor();
});

cancelNoteButton.addEventListener('click', () => {
  noteDialog.close();
});

noteForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = noteTitleInput.value.trim();
  const body = noteBodyInput.value.trim();
  const emptyField = !title ? noteTitleInput : !body ? noteBodyInput : null;

  if (emptyField) {
    emptyField.setCustomValidity('Please fill in this field.');
    emptyField.reportValidity();
    emptyField.setCustomValidity('');
    return;
  }

  const noteId = noteForm.dataset.noteId;
  const note = noteId ? notes.find((item) => item.id === Number(noteId)) : null;

  if (noteId && !note) {
    return;
  }

  if (note) {
    note.title = title;
    note.body = body;
  } else {
    const nextId = notes.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1;
    notes.push({ id: nextId, title, body });
  }

  saveNotes();
  renderNotes();
  noteDialog.close();
});

notesList.addEventListener('click', (event) => {
  const editButton = event.target.closest('.edit-button');

  if (editButton) {
    openNoteEditor(editButton.dataset.noteId);
  }
});

function openGoalEditor(goalId) {
  const goal = goalId === undefined
    ? null
    : goals.find((item) => item.id === Number(goalId));

  if (goalId !== undefined && !goal) {
    return;
  }

  goalForm.dataset.goalId = goal ? goal.id : '';
  goalTextInput.value = goal ? goal.text : '';
  goalDialogTitle.textContent = goal ? 'Edit goal' : 'New goal';
  saveGoalButton.textContent = goal ? 'Save changes' : 'Add goal';
  goalDialog.showModal();
  goalTextInput.focus();
}

addGoalButton.addEventListener('click', () => {
  openGoalEditor();
});

cancelGoalButton.addEventListener('click', () => {
  goalDialog.close();
});

goalForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = goalTextInput.value.trim();

  if (!text) {
    goalTextInput.setCustomValidity('Please enter a goal.');
    goalTextInput.reportValidity();
    goalTextInput.setCustomValidity('');
    return;
  }

  const goalId = goalForm.dataset.goalId;
  const goal = goalId ? goals.find((item) => item.id === Number(goalId)) : null;

  if (goalId && !goal) {
    return;
  }

  if (goal) {
    goal.text = text;
  } else {
    const nextId = goals.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1;
    goals.push({ id: nextId, text });
  }

  saveGoals();
  renderGoals();
  goalDialog.close();
});

goalList.addEventListener('click', (event) => {
  const editButton = event.target.closest('.edit-button');

  if (editButton) {
    openGoalEditor(editButton.dataset.goalId);
  }
});

openSettingsButton.addEventListener('click', () => {
  if (activeView !== 'settings') {
    settingsReturnView = activeView;
  }

  profileNameInput.value = profile.name;
  profileStatusInput.value = profile.status;
  themeInputs.forEach((input) => {
    input.checked = input.value === profile.theme;
  });
  setActiveView('settings');
  profileNameInput.focus();
});

themeInputs.forEach((input) => {
  input.addEventListener('change', () => {
    applyTheme(input.value);
  });
});

backFromSettingsButton.addEventListener('click', () => {
  applyTheme(profile.theme);
  setActiveView(settingsReturnView);
});

profileSettingsForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = profileNameInput.value.trim();

  if (!name) {
    profileNameInput.setCustomValidity('Please enter a display name.');
    profileNameInput.reportValidity();
    profileNameInput.setCustomValidity('');
    return;
  }

  const selectedTheme = profileSettingsForm.querySelector('input[name="theme"]:checked')?.value;
  profile = {
    name,
    status: profileStatusInput.value.trim(),
    theme: themeNames.includes(selectedTheme) ? selectedTheme : profile.theme
  };
  saveProfile();
  applyTheme(profile.theme);
  renderProfile();
  setActiveView(settingsReturnView);
});

function openTaskEditor(taskId) {
  const task = taskId === undefined
    ? null
    : tasks.find((item) => item.id === Number(taskId));

  if (taskId !== undefined && !task) {
    return;
  }

  taskForm.dataset.taskId = task ? task.id : '';
  taskTitleInput.value = task ? task.title : '';
  taskTimeInput.value = task ? task.time : 'Anytime';
  taskDialogTitle.textContent = task ? 'Edit plan' : 'New plan';
  savePlanButton.textContent = task ? 'Save changes' : 'Create plan';
  taskDialog.showModal();
  taskTitleInput.focus();
}

newPlanButton.addEventListener('click', () => {
  openTaskEditor();
});

cancelPlanButton.addEventListener('click', () => {
  taskDialog.close();
});

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const time = taskTimeInput.value.trim() || 'Anytime';

  if (!title) {
    taskTitleInput.setCustomValidity('Add a task name before saving.');
    taskTitleInput.reportValidity();
    taskTitleInput.setCustomValidity('');
    return;
  }

  const taskId = taskForm.dataset.taskId;
  const task = taskId ? tasks.find((item) => item.id === Number(taskId)) : null;

  if (taskId && !task) {
    return;
  }

  if (task) {
    task.title = title;
    task.time = time;
  } else {
    const nextId = Math.max(...tasks.map((item) => item.id)) + 1;
    tasks.push({ id: nextId, title, time, completed: false });
  }

  taskDialog.close();
  renderTasks();
});

overviewTaskList.addEventListener('click', (event) => {
  const editButton = event.target.closest('.edit-button');

  if (editButton) {
    openTaskEditor(editButton.dataset.taskId);
  }
});

overviewTaskList.addEventListener('change', (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');

  if (!checkbox) {
    return;
  }

  toggleTask(checkbox.dataset.taskId);
});

completedList.addEventListener('click', (event) => {
  const editButton = event.target.closest('.edit-button');

  if (editButton) {
    openTaskEditor(editButton.dataset.taskId);
    return;
  }

  const button = event.target.closest('.undo-button');

  if (!button) {
    return;
  }

  toggleTask(button.dataset.taskId);
});

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveView(button.dataset.view);
  });
});

applyTheme(profile.theme);
renderProfile();
renderNotes();
renderGoals();
renderTasks();
setActiveView('overview');
