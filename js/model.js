/** @type {string} */
const STORAGE_KEY = 'sdd-todo-tasks';

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier (Date.now().toString())
 * @property {string} text - Task description (trimmed, 1–120 chars)
 * @property {boolean} done - false = pending, true = completed
 * @property {string} createdAt - ISO 8601 creation timestamp
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
    return parsed;
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
 * @returns {Task[]}
 */
export function addTask(tasks, text) {
  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };
  return [...tasks, newTask];
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
