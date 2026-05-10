import {
  loadTasks,
  saveTasks,
  validateTaskText,
  addTask,
  removeTask,
  toggleTask,
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
} from './view.js';

let state = { tasks: [] };

function handleAddTask() {
  const text = getInputValue();
  const validation = validateTaskText(text);
  if (!validation.valid) {
    showInputError(validation.error);
    document.getElementById('js-task-input').focus();
    return;
  }
  state.tasks = addTask(state.tasks, text);
  saveTasks(state.tasks);
  renderTaskList(state.tasks);
  clearInput();
}

function handleToggleTask(id) {
  state.tasks = toggleTask(state.tasks, id);
  saveTasks(state.tasks);
  renderTaskList(state.tasks);
}

function handleRemoveTask(id) {
  const li = getTaskElement(id);
  if (li) {
    animateRemoval(li, () => {
      state.tasks = removeTask(state.tasks, id);
      saveTasks(state.tasks);
      renderTaskList(state.tasks);
    });
  } else {
    state.tasks = removeTask(state.tasks, id);
    saveTasks(state.tasks);
    renderTaskList(state.tasks);
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
  renderTaskList(state.tasks);
}

init();
