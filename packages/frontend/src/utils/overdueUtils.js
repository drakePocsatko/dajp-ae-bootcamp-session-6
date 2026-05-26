/**
 * Returns true when a todo is incomplete and its due date is before today's calendar date.
 * Uses day-level midnight normalisation so that today's due date is never considered overdue.
 *
 * @param {Object} todo
 * @param {number} todo.completed - 0 = incomplete, 1 = complete
 * @param {string|null|undefined} todo.dueDate - ISO date string (YYYY-MM-DD) or null/undefined
 * @returns {boolean}
 */
export function isOverdue(todo) {
  if (todo.completed === 1) return false;
  if (!todo.dueDate) return false;

  const dueDate = new Date(todo.dueDate);
  if (isNaN(dueDate.getTime())) return false;

  const today = new Date();
  return dueDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
}
