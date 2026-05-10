import { isOverdue } from './model.js';

// Private DOM references
const formEl = document.getElementById('js-todo-form');
const inputEl = document.getElementById('js-task-input');
const errorEl = document.getElementById('js-input-error');
const listEl = document.getElementById('js-todo-list');
const deadlineInputEl = document.getElementById('js-deadline-input');

/**
 * Return current #js-task-input value.
 * @returns {string}
 */
export function getInputValue() {
  return inputEl.value;
}

/**
 * Set #js-task-input value to "".
 */
export function clearInput() {
  inputEl.value = '';
}

/**
 * Return current #js-deadline-input value, or null if empty.
 * @returns {string|null}
 */
export function getDeadlineValue() {
  return deadlineInputEl.value || null;
}

/**
 * Clear #js-deadline-input.
 */
export function clearDeadline() {
  deadlineInputEl.value = '';
}

/**
 * Show inline error: populate #js-input-error, add --error class to input.
 * @param {string} message
 */
export function showInputError(message) {
  errorEl.textContent = message;
  inputEl.classList.add('todo-form__input--error');
}

/**
 * Hide inline error: clear #js-input-error, remove --error class from input.
 */
export function clearInputError() {
  errorEl.textContent = '';
  inputEl.classList.remove('todo-form__input--error');
}

/**
 * Create and return an <li> element for a task. Does NOT insert into DOM.
 * @param {import('./model.js').Task} task
 * @returns {HTMLLIElement}
 */
export function renderTaskItem(task) {
  const overdueClass = isOverdue(task) ? ' todo-item--overdue' : '';
  const li = document.createElement('li');
  li.className = `todo-item ${task.done ? 'todo-item--done' : 'todo-item--pending'} todo-item--entering${overdueClass}`;
  li.dataset.taskId = task.id;
  li.dataset.js = 'todo-item';

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'todo-item__toggle';
  toggleBtn.dataset.js = 'toggle-btn';
  toggleBtn.type = 'button';
  toggleBtn.setAttribute('aria-label', task.done ? 'Mark as pending' : 'Mark as complete');

  const textSpan = document.createElement('span');
  textSpan.className = 'todo-item__text';
  textSpan.dataset.js = 'task-text';
  textSpan.textContent = task.text;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'todo-item__remove';
  removeBtn.dataset.js = 'remove-btn';
  removeBtn.type = 'button';
  removeBtn.setAttribute('aria-label', 'Remove task');

  li.appendChild(toggleBtn);
  li.appendChild(textSpan);

  if (task.deadline !== null) {
    const [datePart, timePart] = task.deadline.split('T');
    const [, month, day] = datePart.split('-');
    const deadlineSpan = document.createElement('span');
    deadlineSpan.className = 'todo-item__deadline';
    deadlineSpan.dataset.js = 'deadline-label';
    deadlineSpan.textContent = `due: ${day}/${month} ${timePart}`;
    li.appendChild(deadlineSpan);
  }

  li.appendChild(removeBtn);

  li.addEventListener('animationend', () => {
    li.classList.remove('todo-item--entering');
  }, { once: true });

  return li;
}

/**
 * Clear #js-todo-list and re-render all tasks (or empty state).
 * @param {import('./model.js').Task[]} tasks
 */
export function renderTaskList(tasks) {
  listEl.innerHTML = '';
  if (tasks.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'todo-list__empty';
    empty.textContent = '> no tasks. type above and press enter.';
    listEl.appendChild(empty);
  } else {
    tasks.forEach(task => listEl.appendChild(renderTaskItem(task)));
  }
}

/**
 * Attach submit handler to #js-todo-form.
 * @param {() => void} handler
 */
export function bindFormSubmit(handler) {
  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    handler();
  });
}

/**
 * Attach delegated click handler for toggle-btn on #js-todo-list.
 * @param {(id: string) => void} handler
 */
export function bindToggleTask(handler) {
  listEl.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-js="toggle-btn"]');
    if (!btn) return;
    const li = btn.closest('[data-task-id]');
    if (!li) return;
    handler(li.dataset.taskId);
  });
}

/**
 * Attach delegated click handler for remove-btn on #js-todo-list.
 * @param {(id: string) => void} handler
 */
export function bindRemoveTask(handler) {
  listEl.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-js="remove-btn"]');
    if (!btn) return;
    const li = btn.closest('[data-task-id]');
    if (!li) return;
    handler(li.dataset.taskId);
  });
}

/**
 * Attach input event to #js-task-input for live error clearing.
 * @param {() => void} handler
 */
export function bindInputChange(handler) {
  inputEl.addEventListener('input', handler);
}

/**
 * Return the <li> element for a given task id.
 * @param {string} id
 * @returns {HTMLElement | null}
 */
export function getTaskElement(id) {
  return document.querySelector('[data-task-id="' + id + '"]');
}

/**
 * Animate removal: add --leaving class, call callback on animationend.
 * @param {HTMLElement} li
 * @param {() => void} callback
 */
export function animateRemoval(li, callback) {
  li.addEventListener('animationend', () => {
    callback();
  }, { once: true });
  li.classList.add('todo-item--leaving');
}
