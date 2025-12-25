// utils.js
import { format } from 'date-fns';

// In-memory counters for ID generation (same behaviour as your original)
let projIdCounter = 10;
let taskIdCounters = {};
let subTaskIdCounters = { };

export function invalidInputAnimate(elem) {
  elem.animate(
    [
      { borderColor: 'var(--thin-border-color)', boxShadow: 'none' },
      { borderColor: 'red', boxShadow: '0 0 20px red' }
    ],
    { duration: 160, iterations: 2 }
  );
}

export function formatDate(date) {
  if (date === 'No Due Date' || !date) return 'No Due Date';
  const new_date = new Date(date);
  return format(new_date, "EEE MMM d yyyy");
}

export function declareTaskUi(id, status) {
  const elem = document.getElementById(`${id}`);
  const checkbox = document.getElementById(`${id}-checkbox`);
  if (!checkbox || !elem) return;
  checkbox.checked = !!status;
  elem.style.textDecoration = status ? 'line-through' : 'none';
}

export function nextProjId() {
  const id = projIdCounter;
  projIdCounter++;
  return 'p_' + id;
}

export function nextTaskId(proj_id) {
  if (!taskIdCounters[proj_id]) taskIdCounters[proj_id] = 1;
  const id = taskIdCounters[proj_id];
  taskIdCounters[proj_id]++;
  return proj_id + '-t_' + id;
}

export function nextSubTaskId(task_id) {
  if (!subTaskIdCounters[task_id]) subTaskIdCounters[task_id] = 1;
  const id = subTaskIdCounters[task_id];
  subTaskIdCounters[task_id]++;
  return task_id + '-st_' + id;
}

export function clearAllChildren(elem) {
  while (elem.firstChild) elem.firstChild.remove();
}
