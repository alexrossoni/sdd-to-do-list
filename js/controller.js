import {
  loadTasks,
  saveTasks,
  validateTaskText,
  addTask,
  removeTask,
  toggleTask,
  sortTasksByDeadline,
  isOverdue,
} from './model.js';

import {
  renderTaskList,
  getInputValue,
  clearInput,
  showInputError,
  clearInputError,
  bindFormSubmit,
  bindToggleTask,
  bindRemoveTask,
  bindInputChange,
  getTaskElement,
  animateRemoval,
  getDeadlineValue,
  clearDeadline,
} from './view.js';

let state = { tasks: [] };
let deadlineIntervalId = null;
const notifiedTaskIds = new Set();

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function handleDeadlineCheck() {
  const sorted = sortTasksByDeadline(state.tasks);
  renderTaskList(sorted);
  sorted.filter(isOverdue).forEach(task => {
    if (!notifiedTaskIds.has(task.id) && Notification.permission === 'granted') {
      new Notification(task.text, { body: 'Task is overdue.' });
      notifiedTaskIds.add(task.id);
    }
  });
}

function handleAddTask() {
  const text = getInputValue();
  const validation = validateTaskText(text);
  if (!validation.valid) {
    showInputError(validation.error);
    document.getElementById('js-task-input').focus();
    return;
  }
  const deadline = getDeadlineValue();
  if (deadline) {
    requestNotificationPermission();
  }
  state.tasks = addTask(state.tasks, text, deadline);
  saveTasks(state.tasks);
  renderTaskList(sortTasksByDeadline(state.tasks));
  clearInput();
  clearDeadline();
  clearInputError();
}

function handleToggleTask(id) {
  state.tasks = toggleTask(state.tasks, id);
  saveTasks(state.tasks);
  renderTaskList(sortTasksByDeadline(state.tasks));
}

function handleRemoveTask(id) {
  const li = getTaskElement(id);
  if (li) {
    animateRemoval(li, () => {
      state.tasks = removeTask(state.tasks, id);
      saveTasks(state.tasks);
      renderTaskList(sortTasksByDeadline(state.tasks));
    });
  } else {
    state.tasks = removeTask(state.tasks, id);
    saveTasks(state.tasks);
    renderTaskList(sortTasksByDeadline(state.tasks));
  }
}

function handleInputChange() {
  clearInputError();
}

function init() {
  state.tasks = loadTasks();
  bindFormSubmit(handleAddTask);
  bindToggleTask(handleToggleTask);
  bindRemoveTask(handleRemoveTask);
  bindInputChange(handleInputChange);
  renderTaskList(sortTasksByDeadline(state.tasks));
  deadlineIntervalId = setInterval(handleDeadlineCheck, 30_000);
}

init();
