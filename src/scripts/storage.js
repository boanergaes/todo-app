// storage.js
const API_URL = 'http://localhost:3000';

// initStorage: nothing destructive here — JSON Server already serves db.json
export async function initStorage() {
  // no-op for JSON Server; kept for compatibility
  return;
}

/* ---------- Simple fetch wrappers ---------- */
export async function getProjectsList() {
  const res = await fetch(`${API_URL}/projects`);
  return await res.json();
}
export async function getTasksList() {
  const res = await fetch(`${API_URL}/tasks`);
  return await res.json();
}
export async function getSubtasksList() {
  const res = await fetch(`${API_URL}/subtasks`);
  return await res.json();
}

/* ---------- API CRUD helpers ---------- */
export async function addProjectToServer(projectObj) {
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectObj)
  });
  return await res.json();
}

export async function updateProjectOnServer(id, data) {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function deleteProjectFromServer(id) {
  await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
}

export async function addTaskToServer(taskObj) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskObj)
  });
  return await res.json();
}

export async function updateTaskOnServer(id, data) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function deleteTaskFromServer(id) {
  await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
}

export async function addSubtaskToServer(subtaskObj) {
  const res = await fetch(`${API_URL}/subtasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subtaskObj)
  });
  return await res.json();
}

export async function updateSubtaskOnServer(id, data) {
  const res = await fetch(`${API_URL}/subtasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function deleteSubtaskFromServer(id) {
  await fetch(`${API_URL}/subtasks/${id}`, { method: 'DELETE' });
}

/* ---------- Compatibility layer: functions used by dom.js (old names) ----------

// The original app expected a single nested Projects object `projectsJSON()`
// with shape: Projects[proj_id] = { title, note, tasks: { task_id: { ... , sub_tasks: {...} } } }
// We'll assemble that from the three endpoints so dom.js can keep the same logic.
*/

export async function projectsJSON() {
  const [projects, tasks, subtasks] = await Promise.all([
    getProjectsList(),
    getTasksList(),
    getSubtasksList()
  ]);

  const Projects = {};

  // create project shells
  for (const p of projects) {
    Projects[p.id] = {
      title: p.title ?? '',
      note: p.note ?? '',
      tasks: {}
    };
  }

  // attach tasks under their project
  for (const t of tasks) {
    const projId = t.project_id;
    if (!Projects[projId]) {
      // if project missing create a placeholder
      Projects[projId] = { title: 'Untitled', note: '', tasks: {} };
    }
    Projects[projId].tasks[t.id] = {
      description: t.description,
      due_date: t.due_date,
      priority: t.priority,
      task_status: !!t.task_status,
      sub_tasks: {}
    };
  }

  // attach subtasks under their task
  for (const s of subtasks) {
    const taskId = s.task_id;
    // find containing project+task
    for (const projId in Projects) {
      if (Projects[projId].tasks[taskId]) {
        Projects[projId].tasks[taskId].sub_tasks[s.id] = {
          description: s.description,
          sub_task_status: !!s.sub_task_status
        };
        break;
      }
    }
  }

  return Projects;
}

/* ---------- session helpers (same names used in original code) ---------- */
export function getCurrProjectId() {
  return sessionStorage.getItem('currProject') ?? null;
}
export function setCurrProjectId(id) {
  sessionStorage.setItem('currProject', id);
}

/* ---------- High-level operations (match old API) ---------- */

export async function initStorageIfEmpty(initialData = null) {
  // kept for compatibility. Do nothing by default.
  return;
}

export async function addProject(proj_id, proj_title) {
  // Add to server with given id (JSON Server accepts provided id)
  const payload = { id: proj_id, title: proj_title, note: '' };
  return await addProjectToServer(payload);
}

export async function deleteProject(proj_id) {
  // Delete all tasks & subtasks belonging to this project, then delete project
  // Get all tasks for this project
  const tasksRes = await fetch(`${API_URL}/tasks?project_id=${proj_id}`);
  const tasks = await tasksRes.json();

  for (const t of tasks) {
    // delete subtasks of this task
    const subsRes = await fetch(`${API_URL}/subtasks?task_id=${t.id}`);
    const subs = await subsRes.json();
    for (const s of subs) {
      await deleteSubtaskFromServer(s.id);
    }
    // delete the task
    await deleteTaskFromServer(t.id);
  }
  // finally delete project
  await deleteProjectFromServer(proj_id);
}

export async function addTask(proj_id, task_id, description, due_date, priority) {
  const payload = {
    id: task_id,
    project_id: proj_id,
    description,
    due_date,
    priority,
    task_status: false
  };
  return await addTaskToServer(payload);
}

export async function deleteTask(proj_id, task_id) {
  // delete subtasks of this task
  const subsRes = await fetch(`${API_URL}/subtasks?task_id=${task_id}`);
  const subs = await subsRes.json();
  for (const s of subs) {
    await deleteSubtaskFromServer(s.id);
  }
  await deleteTaskFromServer(task_id);
}

export async function editTask(proj_id, task_id, new_description, new_due_date, new_priority) {
  const payload = {
    description: new_description,
    due_date: new_due_date,
    priority: new_priority
  };
  return await updateTaskOnServer(task_id, payload);
}

export async function declareTaskDone(proj_id, task_id, status) {
  return await updateTaskOnServer(task_id, { task_status: !!status });
}

export async function addSubTask(proj_id, task_id, sub_task_id, sub_task_desc) {
  const payload = {
    id: sub_task_id,
    task_id,
    description: sub_task_desc,
    sub_task_status: false
  };
  return await addSubtaskToServer(payload);
}

export async function deleteSubTask(proj_id, task_id, sub_task_id) {
  return await deleteSubtaskFromServer(sub_task_id);
}

export async function declareSubTaskDone(proj_id, task_id, sub_task_id, status) {
  return await updateSubtaskOnServer(sub_task_id, { sub_task_status: !!status });
}

/* ---------- small helper used in dom.js to persist project title/notes updates ---------- */
export async function storeLocal(key, ProjectsObj) {
  // The old code used storeLocal('Projects', Projects). We'll update each project's title/note on the server.
  if (key !== 'Projects') return;
  for (const pid in ProjectsObj) {
    const project = ProjectsObj[pid];
    try {
      await updateProjectOnServer(pid, { title: project.title, note: project.note });
    } catch (err) {
      // ignore per-field errors
      console.error('storeLocal update error', pid, err);
    }
  }
}
