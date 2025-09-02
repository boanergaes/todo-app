import { InvertIsProjAddBtnActive, isProjAddBtnActive } from ".";

let projectList = document.getElementById('project-list');

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
        document.getElementById('proj-input-container').remove();
        InvertIsProjAddBtnActive();
    })

    createProjBtn.addEventListener('click', () => {
        const project_title = document.getElementById('new-proj-title').value;
        if (project_title) {
            createProject('1', project_title);
            document.getElementById('proj-input-container').remove();
            InvertIsProjAddBtnActive();
        }
        else {
            projectPromt.animate (
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
    })
}

export function createProject(proj_id, proj_title) {
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
    storeProject(proj_id, proj_title);
}