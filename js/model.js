/** @type {string} */
const STORAGE_KEY = 'sdd-todo-tasks';

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier (Date.now().toString())
 * @property {string} text - Task description (trimmed, 1–120 chars)
 * @property {boolean} done - false = pending, true = completed
 * @property {string} createdAt - ISO 8601 creation timestamp
 * @property {string|null} deadline - Local-time deadline (YYYY-MM-DDTHH:MM) or null
 */

/**
 * Load tasks from localStorage. Returns [] on any error.
 * @returns {Task[]}
 */
export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(task => ({
      ...task,
      deadline: task.deadline !== undefined ? task.deadline : null,
    }));
  } catch {
    return [];
  }
}

/**
 * Persist tasks array to localStorage.
 * @param {Task[]} tasks
 */
export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Validate task text.
 * @param {string} text
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateTaskText(text) {
  if (text.trim().length === 0) {
    return { valid: false, error: 'Task cannot be empty.' };
  }
  if (text.trim().length > 120) {
    return { valid: false, error: 'Task cannot exceed 120 characters.' };
  }
  return { valid: true, error: null };
}

/**
 * Return new array with new Task appended. Does NOT validate.
 * @param {Task[]} tasks
 * @param {string} text
 * @param {string|null} [deadline]
 * @returns {Task[]}
 */
export function addTask(tasks, text, deadline = null) {
  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString(),
    deadline: deadline || null,
  };
  return [...tasks, newTask];
}

/**
 * Return true when the task has a past deadline and is not done.
 * @param {Task} task
 * @returns {boolean}
 */
export function isOverdue(task) {
  return task.deadline !== null && !task.done && new Date(task.deadline) <= new Date();
}

/**
 * Return new array sorted by deadline ascending (null-deadline tasks last);
 * ties broken by createdAt ascending.
 * @param {Task[]} tasks
 * @returns {Task[]}
 */
export function sortTasksByDeadline(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.deadline === null && b.deadline === null) {
      return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0;
    }
    if (a.deadline === null) return 1;
    if (b.deadline === null) return -1;
    if (a.deadline < b.deadline) return -1;
    if (a.deadline > b.deadline) return 1;
    return a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0;
  });
}

/**
 * Return new array without item matching id.
 * @param {Task[]} tasks
 * @param {string} id
 * @returns {Task[]}
 */
export function removeTask(tasks, id) {
  return tasks.filter(task => task.id !== id);
}

/**
 * Return new array with matched item's done field toggled.
 * @param {Task[]} tasks
 * @param {string} id
 * @returns {Task[]}
 */
export function toggleTask(tasks, id) {
  return tasks.map(task =>
    task.id === id ? { ...task, done: !task.done } : task
  );
}
