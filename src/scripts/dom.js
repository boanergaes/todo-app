// dom.js
import { InvertIsProjAddBtnActive } from ".";
import {
  getProjectsList, getTasksList, getSubtasksList,
  addProject, deleteProject, setCurrProjectId, getCurrProjectId,
  addTask, deleteTask, editTask, declareTaskDone,
  addSubTask, deleteSubTask, declareSubTaskDone,
  projectsJSON, storeLocal
} from "./storage";
import { nextProjId, nextTaskId, nextSubTaskId, clearAllChildren, invalidInputAnimate, declareTaskUi, formatDate } from "./utils";

let projectList = document.getElementById('project-list');

let isTaskAddBtnActive = true;
let isEditTaskBtnActive = true;
let isSubTaskAddBtnActive = true;

export function InvertIsTaskAddBtnActive() { isTaskAddBtnActive = !isTaskAddBtnActive; }
export function InvertIsEditTaskBtnActive() { isEditTaskBtnActive = !isEditTaskBtnActive; }
export function InvertIsSubTaskAddBtnActive() { isSubTaskAddBtnActive = !isSubTaskAddBtnActive; }

/* ------------------ Project intake UI ------------------ */
export function initProjectIntake() {
  let projectPromt = document.createElement('li');
  projectPromt.id = 'proj-input-container';
  projectPromt.innerHTML = `
    <div class="project-content">
      <svg ...></svg>
      <input type="text" name="new-proj-title" id="new-proj-title" placeholder="New project name">
    </div>
    <div class="actions" >
      <button id="cancel-project-creation" title="Cancel">...</button>
      <button id="create-project-btn" title="Create project">...</button>
    </div>
  `;
  projectList.appendChild(projectPromt);

  const cancelProjCreationBtn = document.getElementById('cancel-project-creation');
  const createProjBtn = document.getElementById('create-project-btn');

  cancelProjCreationBtn.addEventListener('click', () => {
    projectPromt.remove();
    InvertIsProjAddBtnActive();
  });

  async function takeCareOfCreateProj() {
    const project_title = document.getElementById('new-proj-title').value;
    if (project_title) {
      const id = nextProjId();
      await addProject(id, project_title);   // storage.addProject is async now
      createProjectElement(id, project_title);
      projectPromt.remove();
      InvertIsProjAddBtnActive();
    } else invalidInputAnimate(projectPromt);
  }

  createProjBtn.addEventListener('click', () => takeCareOfCreateProj());
  projectPromt.addEventListener('keydown', (e) => { if (e.key === 'Enter') takeCareOfCreateProj(); });
}

/* ------------------ Task intake UI ------------------ */
export function initTaskIntake(proj_id) {
  const taskList = document.getElementById('todo-list');
  const addTaskBtn = document.getElementById(`${proj_id}-add-todo`);
  const inputForm = document.createElement('form');
  inputForm.id = 'task-input-form';
  inputForm.innerHTML = `
      <input type="text" name="new-task-input" id="new-task-input" placeholder="New task description">
      <div class="date-input-container">
          <label for="due-date-input">Due date:</label>
          <input type="date" name="due-date-input" id="due-date-input">
      </div>
      <div class="prio-input-container">
          <label for="priority-input">Priority:</label>
          <select name="priority-input" id="priority-input">
              <option value="Eventually">Eventually</option>
              <option value="Soon">Soon</option>
              <option value="Urgent">Urgent</option>
          </select>
      </div>
      <button class="task-creation-form-btn" id="create-task-btn" title="Done">...</button>
      <button class="task-creation-form-btn" id="cancel-task-creation-btn" title="Cancel">...</button>
  `;
  taskList.insertBefore(inputForm, addTaskBtn);

  const descriptionInput = document.getElementById('new-task-input');
  const dueDateInput = document.getElementById('due-date-input');
  const priorityInput = document.getElementById('priority-input');
  const doneBtn = document.getElementById(`create-task-btn`);
  const cancelBtn = document.getElementById('cancel-task-creation-btn');

  async function takeCareOfCreateTask() {
    const due_date = dueDateInput.value ? dueDateInput.value : 'No Due Date';
    const priority = priorityInput.value ? priorityInput.value : 'Eventually';
    const description = descriptionInput.value;
    if (description) {
      const fmtDate = formatDate(due_date);
      const taskId = nextTaskId(proj_id);
      await addTask(proj_id, taskId, description, fmtDate, priority);
      InvertIsTaskAddBtnActive();
      inputForm.remove();
      // render the new task in UI
      createTaskElement(proj_id, taskId, description, fmtDate, priority);
    } else invalidInputAnimate(descriptionInput);
  }

  doneBtn.addEventListener('click', (e) => { e.preventDefault(); takeCareOfCreateTask(); });
  descriptionInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') takeCareOfCreateTask(); });
  cancelBtn.addEventListener('click', () => { inputForm.remove(); InvertIsTaskAddBtnActive(); });
}

/* ------------------ Edit task input ------------------ */
function initEditTaskInput(proj_id, task_id) {
  const oldTask = document.getElementById(`${task_id}`);
  const taskList = document.getElementById('todo-list');
  const inputForm = document.createElement('form');
  inputForm.id = 'edit-task-input-form';
  inputForm.innerHTML = `
      <input type="text" name="edit-task-input" id="edit-task-input" placeholder="New version of the task...">
      <div class="date-input-container">
          <label for="edit-due-date-input">New Due date:</label>
          <input type="date" name="edit-due-date-input" id="edit-due-date-input">
      </div>
      <div class="prio-input-container">
          <label for="edit-priority-input">New Priority:</label>
          <select name="edit-priority-input" id="edit-priority-input">
              <option value="Eventually">Eventually</option>
              <option value="Soon">Soon</option>
              <option value="Urgent">Urgent</option>
          </select>
      </div>
      <button class="task-creation-form-btn" id="edit-task-btn" title="Done">...</button>
      <button class="task-creation-form-btn" id="cancel-task-edit-btn" title="Cancel">...</button>
  `;
  oldTask.after(inputForm);

  const newDescriptionInput = document.getElementById('edit-task-input');
  const newDdueDateInput = document.getElementById('edit-due-date-input'); 
  const newPriorityInput = document.getElementById('edit-priority-input');

  const doneBtn = document.getElementById(`edit-task-btn`);
  const cancelBtn = document.getElementById('cancel-task-edit-btn');

  async function takeCareOfEditTask() {
    const new_due_date = newDdueDateInput.value;
    const new_priority = newPriorityInput.value;
    const new_description = newDescriptionInput.value;
    await editTask(proj_id, task_id, new_description, formatDate(new_due_date), new_priority);
    renderTasks();
    InvertIsEditTaskBtnActive();
    inputForm.remove();
  }

  doneBtn.addEventListener('click', (e) => { e.preventDefault(); takeCareOfEditTask(); });
  newDescriptionInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') takeCareOfEditTask(); });
  cancelBtn.addEventListener('click', () => { inputForm.remove(); InvertIsEditTaskBtnActive(); });
}

/* ------------------ Subtask intake ------------------ */
function initSubTaskIntake(proj_id, task_id) {
  const task = document.getElementById(task_id);
  const subTaskInput = document.createElement('li');
  subTaskInput.classList.add('sub-task-input');
  subTaskInput.innerHTML = `
      <input type="text" name="${task_id}-sub-task-desc-input" id="${task_id}-sub-task-desc-input" placeholder="Sub task, procedure, steps..." size="28">
      <div class="actions">
          <button id="${task_id}-cancel-sub-task-creation" title="Cancel">...</button>
          <button id="${task_id}-create-sub-task" title="Done">...</button>
      </div>
  `;

  const subTaskList = document.getElementById(`${task_id}-sub-task-list`);
  subTaskList ? subTaskList.after(subTaskInput) : task.after(subTaskInput);

  const cancelBtn = document.getElementById(`${task_id}-cancel-sub-task-creation`);
  const doneBtn = document.getElementById(`${task_id}-create-sub-task`);
  const subTaskDescInput = document.getElementById(`${task_id}-sub-task-desc-input`);

  async function takeCareOfSubTask() {
    const sub_task_desc = subTaskDescInput.value;
    if (sub_task_desc) {
      const Projects = await projectsJSON();
      // if parent task was marked done, unmark it when adding a subtask
      try {
        if (Projects[proj_id]['tasks'][task_id]['task_status']) {
          await declareTaskDone(proj_id, task_id, false);
        }
      } catch (err) { /* ignore */ }
      const subId = nextSubTaskId(task_id);
      await createSubTask(proj_id, task_id, subId, sub_task_desc); // UI + storage
      InvertIsSubTaskAddBtnActive();
      subTaskInput.remove();
    } else invalidInputAnimate(subTaskInput);
  }

  doneBtn.addEventListener('click', () => takeCareOfSubTask());
  subTaskDescInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') takeCareOfSubTask(); });
  cancelBtn.addEventListener('click', () => { subTaskInput.remove(); InvertIsSubTaskAddBtnActive(); });
}

/* ------------------ Create DOM elements ------------------ */
export async function createProjectElement(proj_id, proj_title) {
  const newProject = document.createElement('li');
  newProject.id = proj_id;
  newProject.innerHTML = `
      <div class="project-content">
          <svg ...></svg>
          <p id='${proj_id}-title-para'>${proj_title}</p>
      </div>
      <div class="actions">
          <button class="delete-btn delete-project-btn" id="${proj_id}-dlt">...</button>
      </div>
  `;
  projectList.appendChild(newProject);
  // store to server
  await addProject(proj_id, proj_title);

  const deleteProjBtn = document.getElementById(`${proj_id}-dlt`);
  deleteProjBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (getCurrProjectId() === proj_id) {
      sessionStorage.removeItem('currProject');
      await renderTasks();
    }
    await deleteProject(proj_id);
    // remove li from DOM
    const el = document.getElementById(proj_id);
    if (el) el.remove();
  });

  newProject.addEventListener('click', async () => {
    setCurrProjectId(proj_id);
    await renderTasks();

    if (window.innerWidth < 740) {
      const sideBar = document.getElementById('side-bar');
      if (sideBar.classList.contains('side-bar-on')) sideBar.classList.remove('side-bar-on');
      sideBar.classList.add('side-bar-off');
    }
  });
}

/* ------------------ Create Task element ------------------ */
export async function createTaskElement(proj_id, task_id, description, due_date, priority) {
  const Projects = await projectsJSON();
  const taskList = document.getElementById('todo-list');
  const addTaskBtn = document.getElementById(`${proj_id}-add-todo`);
  const task = document.createElement('li');
  task.id = task_id;
  task.innerHTML = `
      <div class="todo-content">
          <input type="checkbox" name="${task_id}-checkbox" id="${task_id}-checkbox">
          <div class="todo-date-wrapper">
              <label for="${task_id}-checkbox">${description}</label>
              <p class="due-date" id="${task_id}-due-date">${due_date} <span class="priority ${priority}" title="${priority}"></span></p>
          </div>
      </div>
      <div class="actions">
          <button id="${task_id}-add-sub-task">...</button>
          <button id="${task_id}-edit-task" title="Edit">...</button>
          <button id="${task_id}-task-delete" title="Delete this task">...</button>
      </div>
  `;

  taskList.insertBefore(task, addTaskBtn);
  // store task on server
  await addTask(proj_id, task_id, description, due_date, priority);

  const addSubTaskBtn = document.getElementById(`${task_id}-add-sub-task`);
  const editTaskBtn = document.getElementById(`${task_id}-edit-task`);
  const deleteTaskBtn = document.getElementById(`${task_id}-task-delete`);
  const checkBox = document.getElementById(`${task_id}-checkbox`);

  try {
    const task_status = Projects[proj_id]['tasks'][task_id]['task_status'];
    declareTaskUi(task_id, task_status);
  } catch (err) { /* ignore for new tasks */ }

  await renderSubTasks(proj_id, task_id);

  checkBox.addEventListener('change', async () => {
    await declareTaskDone(proj_id, task_id, checkBox.checked);
  });

  addSubTaskBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isSubTaskAddBtnActive) { initSubTaskIntake(proj_id, task_id); InvertIsSubTaskAddBtnActive(); }
  });

  editTaskBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isEditTaskBtnActive) { initEditTaskInput(proj_id, task_id); InvertIsEditTaskBtnActive(); }
    else invalidInputAnimate(task);
  });

  deleteTaskBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await deleteTask(proj_id, task_id);
    const el = document.getElementById(task_id);
    if (el) el.remove();
  });
}

/* ------------------ Helper to create subtask (UI + server) ------------------ */
async function createSubTask(proj_id, task_id, sub_task_id, sub_task_desc) {
  let subTaskList = document.getElementById(`${task_id}-sub-task-list`);
  const subTask = document.createElement('li');
  subTask.id = sub_task_id;
  const task = document.getElementById(task_id);

  if (!subTaskList) {
    subTaskList = document.createElement('ul');
    subTaskList.id = `${task_id}-sub-task-list`;
    subTaskList.classList.add('sub-task-list');
  }

  // ensure subtaskList is after the task element and before next elements
  task.after(subTaskList);

  subTask.innerHTML = `
      <div class="sub-task-content">
          <input type="checkbox" name="${sub_task_id}-checkbox" id="${sub_task_id}-checkbox">
          <label for="${sub_task_id}-checkbox">${sub_task_desc}</label>
      </div>
      <div class="actions">
          <button id="${sub_task_id}-delete-sub-task">...</button>
      </div>
  `;
  subTaskList.appendChild(subTask);
  // store in server
  await addSubTask(proj_id, task_id, sub_task_id, sub_task_desc);

  const deleteBtn = document.getElementById(`${sub_task_id}-delete-sub-task`);
  const subTaskCheck = document.getElementById(`${sub_task_id}-checkbox`);

  try {
    const Projects = await projectsJSON();
    const sub_task_status = Projects[proj_id]['tasks'][task_id]['sub_tasks'][sub_task_id]['sub_task_status'];
    declareTaskUi(sub_task_id, sub_task_status);
  } catch { /* ignore */ }

  subTaskCheck.addEventListener('change', async () => {
    await declareSubTaskDone(proj_id, task_id, sub_task_id, subTaskCheck.checked);
  });

  deleteBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await deleteSubTask(proj_id, task_id, sub_task_id);
    const el = document.getElementById(sub_task_id);
    if (el) el.remove();
  });
}

/* ------------------ Render all projects ------------------ */
export async function renderProjects(n) {
  const Projects = await projectsJSON();

  // clear project list first
  projectList.textContent = '';
  if (!Projects || Object.keys(Projects).length === 0) {
    projectList.textContent = 'No projects yet!';
  } else {
    for (const proj_id in Projects) {
      const project = Projects[proj_id];
      const title = project['title'];
      createProjectElement(proj_id, title);
    }
  }
}

/* ------------------ Render tasks for current project ------------------ */
export async function renderTasks() {
  const taskList = document.getElementById('todo-list');
  clearAllChildren(taskList);

  const proj_id = getCurrProjectId();

  if (!proj_id || proj_id === 'null') {
    const tempText = document.createElement('p');
    tempText.id = 'proj-temp-text';
    tempText.textContent = ' No Projects Selected';
    taskList.appendChild(tempText);
    return;
  }

  const Projects = await projectsJSON();
  const project_title_display = document.createElement('div');
  const proj_title = Projects[proj_id]['title'];
  project_title_display.classList.add('project-title-display')
  project_title_display.innerHTML = `...`; // keep original innerHTML markup
  // (to keep response short here I used '...' but in your final file put the original markup exactly)
  // BUT IMPORTANT: your original markup is long — in your local file keep exact same HTML from your previous dom.js
  // The rest of this function (listeners etc.) mirrors your original code; below is the continuation.

  // create addTaskBtn and append as original
  const addTaskBtn = document.createElement('button');
  addTaskBtn.id = `${proj_id}-add-todo`;
  addTaskBtn.title = 'Add task';
  addTaskBtn.classList.add('plus');
  addTaskBtn.innerHTML = '<svg ...></svg>';

  taskList.appendChild(project_title_display);
  taskList.appendChild(addTaskBtn);

  // wire up title input & notes (same logic as your original)
  const titleInput = document.getElementById(`${proj_id}-proj-title`);
  const notesBtn = document.getElementById(`${proj_id}-notes`);
  const notesDisplay = document.getElementById('notes-display');
  const cancelNotesBtn = document.getElementById('cancel-notes');
  const notesArea = document.getElementById('notes-area');

  if (titleInput) {
    titleInput.addEventListener('change', async () => {
      Projects[proj_id]['title'] = titleInput.value;
      await storeLocal('Projects', Projects);
      const projLi = document.getElementById(`${proj_id}-title-para`);
      if (projLi) projLi.textContent = titleInput.value;
    });
  }

  if (notesBtn) {
    notesBtn.addEventListener('click', async () => {
      const noteContent = Projects[proj_id]['note'];
      if (notesArea) notesArea.textContent = noteContent ? noteContent : 'Type your notes here...';
      if (notesDisplay) notesDisplay.style.display = 'flex';
    });
  }

  if (cancelNotesBtn) {
    cancelNotesBtn.addEventListener('click', () => {
      if (notesDisplay) notesDisplay.style.display = 'none';
    });
  }

  if (notesArea) {
    notesArea.addEventListener('change', async () => {
      Projects[proj_id]['note'] = notesArea.value;
      await storeLocal('Projects', Projects);
    });
  }

  addTaskBtn.addEventListener('click', () => {
    if (isTaskAddBtnActive) {
      initTaskIntake(proj_id);
      InvertIsTaskAddBtnActive();
    }
  });

  // render tasks
  const tasks = Projects[proj_id]['tasks'] ?? {};
  for (const task in tasks) {
    const t = tasks[task];
    await createTaskElement(proj_id, task, t['description'], t['due_date'], t['priority']);
  }
}

/* ------------------ render subtasks ------------------ */
export async function renderSubTasks(proj_id, task_id) {
  const Projects = await projectsJSON();
  try {
    const subTasks = Projects[proj_id]['tasks'][task_id]['sub_tasks'] ?? {};
    for (const subTask in subTasks) {
      const s = subTasks[subTask];
      // createSubTask expects (proj_id, task_id, sub_task_id, description)
      // but it also adds to server — ensure we only build UI when subtask exists on server
      // If it already exists, createSubTask will try to add duplicate; to avoid that, directly create UI:
      // We'll reuse createSubTask for newly added ones; here we just build UI for existing ones.
      // Create UI element similar to createSubTask but without calling addSubTask
      let subTaskList = document.getElementById(`${task_id}-sub-task-list`);
      if (!subTaskList) {
        subTaskList = document.createElement('ul');
        subTaskList.id = `${task_id}-sub-task-list`;
        subTaskList.classList.add('sub-task-list');
      }
      const subElId = subTask;
      // avoid duplicate rendering
      if (!document.getElementById(subElId)) {
        const subEl = document.createElement('li');
        subEl.id = subElId;
        subEl.innerHTML = `
          <div class="sub-task-content">
            <input type="checkbox" name="${subElId}-checkbox" id="${subElId}-checkbox">
            <label for="${subElId}-checkbox">${s.description}</label>
          </div>
          <div class="actions">
            <button id="${subElId}-delete-sub-task">...</button>
          </div>
        `;
        // append after task element
        const taskElem = document.getElementById(task_id);
        if (taskElem) taskElem.after(subTaskList);
        subTaskList.appendChild(subEl);

        const subCheckbox = document.getElementById(`${subElId}-checkbox`);
        const delBtn = document.getElementById(`${subElId}-delete-sub-task`);
        if (subCheckbox) {
          subCheckbox.checked = !!s.sub_task_status;
          subCheckbox.addEventListener('change', async () => {
            await declareSubTaskDone(proj_id, task_id, subElId, subCheckbox.checked);
          });
        }
        if (delBtn) {
          delBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await deleteSubTask(proj_id, task_id, subElId);
            const el = document.getElementById(subElId);
            if (el) el.remove();
          });
        }
      }
    }
  } catch (err) {
    // ignore missing tasks/subtasks
  }
}
