import { InvertIsProjAddBtnActive, isProjAddBtnActive } from ".";
import { projectsJSON, addProject, deleteProject, setCurrProjectId, getCurrProjectId } from "./storage";
import { nextProjId, nextTaskId } from "./utils";

let projectList = document.getElementById('project-list');

let isTaskAddBtnActive = true;

// to make sure the user don't keep touching the add task button before finishing their task adding session.
export function InvertIsTaskAddBtnActive() {
    isTaskAddBtnActive = !isTaskAddBtnActive;
}

function invalidInputAnimate(elem) {
    elem.animate (
        [
            { borderColor: 'var(--thin-border-color)', boxShadow: 'none' },
            { borderColor: 'red', boxShadow: '0 0 20px red' }
        ],
        {
            duration: 160,
            iterations: 2
        }
    )
}

export function initProjectIntake() {
    let projectPromt = document.createElement('li');

    projectPromt.id = 'proj-input-container';
    projectPromt.innerHTML = `
        <div class="project-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-todo-icon lucide-list-todo"><path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><rect x="3" y="4" width="6" height="6" rx="1"/></svg>
            <input type="text" name="new-proj-title" id="new-proj-title" placeholder="New project name">
        </div>

        <div class="actions" >
            <button id="cancel-project-creation" title="Cancel">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <button id="create-project-btn" title="Create project">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
            </button>
        </div>
    `;
    projectList.appendChild(projectPromt);

    // add the event listner here so that it's found only when the element is created
    const cancelProjCreationBtn = document.getElementById('cancel-project-creation');
    const createProjBtn = document.getElementById('create-project-btn');

    cancelProjCreationBtn.addEventListener('click', () => {
        projectPromt.remove();
        InvertIsProjAddBtnActive();
    })

    function takeCareOfCreateProj() {
        const project_title = document.getElementById('new-proj-title').value;
        if (project_title) {
            createProjectElement(nextProjId(), project_title);
            projectPromt.remove();
            InvertIsProjAddBtnActive();
        }
        else invalidInputAnimate(projectPromt);
    }

    createProjBtn.addEventListener('click', () => {
        takeCareOfCreateProj()
    })

    projectPromt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            takeCareOfCreateProj()
        }
    })
}

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
        <button class="task-creation-form-btn" id="create-task-btn" title="Done">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
        </button>

        <button class="task-creation-form-btn" id="cancel-task-creation-btn" title="Cancel">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
    `;
    taskList.insertBefore(inputForm, addTaskBtn);

    const descriptionInput = document.getElementById('new-task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const priorityInput = document.getElementById('priority-input');

    const doneBtn = document.getElementById(`create-task-btn`);
    const cancelBtn = document.getElementById('cancel-task-creation-btn');
    
    doneBtn.addEventListener('click', (e) => {
        const due_date = dueDateInput.value ? dueDateInput : 'No Due Date';
        const priority = priorityInput.value ? priorityInput : 'Eventually';
        const description = descriptionInput.value;
        e.preventDefault();
        if (description) {
            console.log('hello from doneBtn')
            createTaskElement(proj_id, nextTaskId(), description, due_date, priority);
            InvertIsTaskAddBtnActive();
            inputForm.remove();
        } else invalidInputAnimate(descriptionInput);
    })
}

export function createProjectElement(proj_id, proj_title) {
    const newProject = document.createElement('li');
    newProject.id = proj_id;
    newProject.innerHTML = `
        <div class="project-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-todo-icon lucide-list-todo"><path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><rect x="3" y="4" width="6" height="6" rx="1"/></svg>
            <p>${proj_title}</p>
        </div>
        
        <div class="actions">
            <button class="delete-btn delete-project-btn" id="${proj_id}-dlt">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><title>Delete This Project</title></svg>
            </button>
        </div>
    `;
    projectList.appendChild(newProject);
    addProject(proj_id, proj_title);

    // add event listner to the newly created project li's delete btn

    const deleteProjBtn = document.getElementById(`${proj_id}-dlt`);
    deleteProjBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (getCurrProjectId() === proj_id) {
            // so that 'no project is selected' text will be displayed
            sessionStorage.removeItem('currProject');
            renderTasks();
        }
        deleteProject(proj_id);
    })

    newProject.addEventListener('click', (e) => {
        setCurrProjectId(proj_id);
        renderTasks();
    })
}

// ==============================================================================================
export function createTaskElement(proj_id, task_id, description, due_date, priority) {
    const Projects = projectsJSON();
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
            <button id="${task_id}-add-sub-task">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/><title>Add sub tasks</title></svg>
            </button>

            <button id="${task_id}-edit-task" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
            </button>

            <button id="${task_id}-task-delete" title="Delete this task">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
        </div>
    `
    taskList.insertBefore(task, addTaskBtn);
}

export function renderProjects(n) {
    const Projects = projectsJSON();
    
    // if n is 0, it means there are no projects to render
    // problem - the No projects text doesn't appear and disappear when it shoud
    // will figure it out later, the if n===0 has no effect for now
    if (n === 0) {
        projectList.textContent = 'No projects yet!';
    } else {
        for (const proj_id in Projects) {
            const project = Projects[proj_id];
            const title = project['title'];
    
            createProjectElement(proj_id, title);
        }
    }
}

export function renderTasks() {
    const taskList = document.getElementById('todo-list');

    const proj_id = getCurrProjectId();

    if (!proj_id || proj_id === 'null') {
        const tempText = document.createElement('p');
        tempText.id = 'proj-temp-text';
        tempText.textContent = ' No Projects Selected';
        taskList.appendChild(tempText);
        return;
    }

    const rmv = document.getElementById('proj-temp-text');
    if (rmv) rmv.remove();

    const Projects = projectsJSON();
    const proj_title = Projects[proj_id]['title'];
    const project_title_display = document.createElement('div');
    project_title_display.classList.add('project-title-display')
    project_title_display.innerHTML = `
            <div class="project-title-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-todo-icon lucide-list-todo"><path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><rect x="3" y="4" width="6" height="6" rx="1"/></svg>
                <h1 id="project-title">${proj_title}</h1>
            </div>

            <div class="project-info">
                <button id="${proj_id}-notes">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sticky-note-icon lucide-sticky-note"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/><title>Sticky notes</title></svg>
                </button>
            </div>
    `;
    const addTaskBtn = document.createElement('button');
    addTaskBtn.id = `${proj_id}-add-todo`;
    addTaskBtn.title = 'Add task';
    addTaskBtn.classList.add('plus');
    addTaskBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/><title>Add task</title></svg>';

    
    taskList.appendChild(project_title_display)
    taskList.appendChild(addTaskBtn);
    
    // add event listener for notes button ----------
    addTaskBtn.addEventListener('click', () => {
        if (isTaskAddBtnActive) {
            initTaskIntake(proj_id);
            InvertIsTaskAddBtnActive();
        }
    })

    const tasks = Projects[proj_id]['tasks'];

}

