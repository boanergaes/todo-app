// src/scripts/dom.js
import { formatDate, invalidInputAnimate, declareTaskUi } from './utils.js';
import * as API from './api.js';

let isTaskAddBtnActive = true;
let isEditTaskBtnActive = true;
let isSubTaskAddBtnActive = true;

export function InvertIsTaskAddBtnActive() { isTaskAddBtnActive = !isTaskAddBtnActive; }
export function InvertIsEditTaskBtnActive() { isEditTaskBtnActive = !isEditTaskBtnActive; }
export function InvertIsSubTaskAddBtnActive() { isSubTaskAddBtnActive = !isSubTaskAddBtnActive; }

const projectList = document.getElementById('project-list');
const taskList = document.getElementById('todo-list');

export async function renderProjects() {
    projectList.innerHTML = '';
    const projects = await API.getProjects();
    if (projects.length === 0) {
        projectList.textContent = 'No projects yet!';
        return;
    }
    projects.forEach(proj => createProjectElement(proj.id, proj.title, proj.note));
}

export async function createProjectElement(id, title, note) {
    const newProject = document.createElement('li');
    newProject.id = id;
    newProject.innerHTML = `
        <div class="project-content">
            <p>${title}</p>
        </div>
        <div class="actions">
            <button class="delete-project-btn">Delete</button>
        </div>
    `;
    projectList.appendChild(newProject);

    const deleteBtn = newProject.querySelector('.delete-project-btn');
    deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await API.deleteProject(id);
        renderProjects();
        taskList.innerHTML = '';
    });

    newProject.addEventListener('click', async () => {
        await renderTasks(id);
    });
}

export async function renderTasks(projId) {
    taskList.innerHTML = '';
    const tasks = await API.getTasks();
    const filteredTasks = tasks.filter(t => t.projectId === projId);
    filteredTasks.forEach(t => createTaskElement(t));
}

export async function createTaskElement(task) {
    const taskElem = document.createElement('li');
    taskElem.id = task.id;
    taskElem.innerHTML = `
        <div>
            <input type="checkbox" id="${task.id}-checkbox">
            <label>${task.description} (${task.due_date || 'No Due Date'})</label>
        </div>
        <button class="delete-task-btn">Delete</button>
    `;
    taskList.appendChild(taskElem);

    const checkbox = document.getElementById(`${task.id}-checkbox`);
    checkbox.checked = task.task_status;
    checkbox.addEventListener('change', async () => {
        await API.updateTask(task.id, { task_status: checkbox.checked });
        declareTaskUi(task.id, checkbox.checked);
    });

    const deleteBtn = taskElem.querySelector('.delete-task-btn');
    deleteBtn.addEventListener('click', async () => {
        await API.deleteTask(task.id);
        renderTasks(task.projectId);
    });
}
