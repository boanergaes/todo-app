import {
  invalidInputAnimate,
  formatDate,
} from "./utils";
import {
  addProject,
  addTask,
  editProject,
  editTask,
  deleteProject,
  deleteTask,
  getAllProjects,
  getCurrProjectId,
  setCurrProjectId,
} from "./storage";

// Inline SVG Library (Feather Icons)
const icons = {
  pencil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
};

/**
 * Render all projects in the sidebar
 */
export async function renderProjects() {
  const projectsContainer = document.getElementById("project-list");
  if (!projectsContainer) return;

  projectsContainer.innerHTML = "";

  const projects = await getAllProjects();
  projects.forEach((proj) => {
    const li = document.createElement("li");
    li.className = "project-item";
    li.id = proj.id;
    
    const contentDiv = document.createElement("div");
    contentDiv.className = "project-content";
    const titleSpan = document.createElement("span");
    titleSpan.textContent = proj.title;
    contentDiv.appendChild(titleSpan);
    li.appendChild(contentDiv);

    li.addEventListener("click", () => {
      setCurrProjectId(proj.id);
      document.querySelectorAll('#project-list li').forEach(n => n.classList.remove('active'));
      li.classList.add('active');
      renderTasks(proj.id);
    });

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.innerHTML = icons.pencil;
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.getElementById(`${proj.id}-edit-form`)) return;
      const editLi = document.createElement('li');
      editLi.id = `${proj.id}-edit-form`;
      editLi.classList.add('inline-form');
      editLi.innerHTML = `
        <div class="project-content">
          <input id="${proj.id}-edit-title" value="${proj.title}" />
        </div>
        <div class="actions">
          <button id="${proj.id}-save" class="icon-btn">${icons.check}</button>
          <button id="${proj.id}-cancel" class="icon-btn">${icons.x}</button>
        </div>
      `;
      li.replaceWith(editLi);
      document.getElementById(`${proj.id}-save`).onclick = async () => {
        const newTitle = document.getElementById(`${proj.id}-edit-title`).value.trim();
        if (!newTitle) return invalidInputAnimate(document.getElementById(`${proj.id}-edit-title`));
        await editProject(proj.id, { title: newTitle });
        await renderProjects();
      };
      document.getElementById(`${proj.id}-cancel`).onclick = () => renderProjects();
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.innerHTML = icons.trash;
    delBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm('Delete project?')) return;
      await deleteProject(proj.id);
      await renderProjects();
      const curr = getCurrProjectId();
      if (curr === proj.id) {
        sessionStorage.removeItem('currProject');
        const todoList = document.getElementById('todo-list');
        if (todoList) todoList.innerHTML = '';
      }
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(delBtn);
    li.appendChild(actionsDiv);
    
    projectsContainer.appendChild(li);
  });

  const addProjectBtn = document.getElementById("add-project");
  if (addProjectBtn) {
    addProjectBtn.onclick = () => {
      if (document.getElementById('new-project-form')) return;
      const formLi = document.createElement('li');
      formLi.id = 'new-project-form';
      formLi.classList.add('inline-form');
      formLi.innerHTML = `
        <div class="project-content">
          <input id="new-project-title" placeholder="Project title" />
        </div>
        <div class="actions">
          <button id="create-project-btn" class="icon-btn">${icons.check}</button>
          <button id="cancel-project-btn" class="icon-btn">${icons.x}</button>
        </div>
      `;
      projectsContainer.prepend(formLi);
      document.getElementById('create-project-btn').onclick = async () => {
        const titleEl = document.getElementById('new-project-title');
        if (!titleEl.value.trim()) return invalidInputAnimate(titleEl);
        await addProject({ title: titleEl.value.trim() });
        await renderProjects();
      };
      document.getElementById('cancel-project-btn').onclick = () => formLi.remove();
    };
  }
}

/**
 * Render tasks for a specific project
 */
export async function renderTasks(projectId) {
  const tasksContainer = document.getElementById("todo-list");
  if (!tasksContainer) return;
  tasksContainer.innerHTML = "";

  const projects = await getAllProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project || !project.tasks) return;

  for (const taskId in project.tasks) {
    const task = project.tasks[taskId];
    const li = document.createElement("li");
    li.className = "task-item";
    li.id = taskId;
    li.innerHTML = `
      <div class="todo-content">
        <input type="checkbox" class="task-checkbox" id="${taskId}-checkbox" ${task.task_status ? 'checked' : ''} />
        <label for="${taskId}-checkbox" class="task-desc">${task.description}</label>
        <span class="priority ${task.priority}"></span>
        <p class="due-date">${formatDate(task.due_date)}</p>
      </div>
      <div class="actions">
        <button class="edit-task icon-btn">${icons.pencil}</button>
        <button class="delete-task icon-btn">${icons.trash}</button>
      </div>
    `;

    const checkbox = li.querySelector('.task-checkbox');
    const descEl = li.querySelector('.task-desc');
    const setUi = (done) => {
      descEl.style.textDecoration = done ? 'line-through' : 'none';
      descEl.style.opacity = done ? 0.6 : 1;
    };
    setUi(task.task_status);

    checkbox.addEventListener('change', async () => {
      await editTask(projectId, taskId, { task_status: checkbox.checked });
      setUi(checkbox.checked);
    });

    li.querySelector(".delete-task").onclick = async () => {
      await deleteTask(projectId, taskId);
      await renderTasks(projectId);
    };

    li.querySelector('.edit-task').onclick = () => {
      if (document.getElementById(`${taskId}-edit-form`)) return;
      const editLi = document.createElement('li');
      editLi.id = `${taskId}-edit-form`;
      editLi.classList.add('inline-form');
      editLi.innerHTML = `
        <div class="todo-content">
          <input id="${taskId}-edit-desc" value="${task.description}" />
          <input id="${taskId}-edit-date" type="date" value="${task.due_date === 'No Due Date' ? '' : task.due_date}" />
          <select id="${taskId}-edit-pri">
            <option value="Eventually">Eventually</option>
            <option value="Soon">Soon</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div class="actions">
          <button id="${taskId}-save" class="icon-btn">${icons.check}</button>
          <button id="${taskId}-cancel" class="icon-btn">${icons.x}</button>
        </div>
      `;
      li.replaceWith(editLi);
      document.getElementById(`${taskId}-edit-pri`).value = task.priority || 'Eventually';
      document.getElementById(`${taskId}-save`).onclick = async () => {
        const newDesc = document.getElementById(`${taskId}-edit-desc`).value.trim();
        if (!newDesc) return invalidInputAnimate(document.getElementById(`${taskId}-edit-desc`));
        await editTask(projectId, taskId, { 
          description: newDesc, 
          due_date: document.getElementById(`${taskId}-edit-date`).value || 'No Due Date', 
          priority: document.getElementById(`${taskId}-edit-pri`).value 
        });
        await renderTasks(projectId);
      };
      document.getElementById(`${taskId}-cancel`).onclick = () => renderTasks(projectId);
    };

    tasksContainer.appendChild(li);
  }

  let addTaskBtn = document.createElement("button");
  addTaskBtn.className = "plus icon-btn";
  addTaskBtn.innerHTML = icons.plus;
  tasksContainer.appendChild(addTaskBtn);

  addTaskBtn.onclick = () => {
    if (document.getElementById(`${projectId}-new-task-form`)) return;
    const formLi = document.createElement('li');
    formLi.id = `${projectId}-new-task-form`;
    formLi.classList.add('inline-form');
    formLi.innerHTML = `
      <div class="todo-content">
        <input id="${projectId}-task-desc" placeholder="Task description" />
        <input id="${projectId}-task-date" type="date" />
        <select id="${projectId}-task-pri">
          <option value="Eventually">Eventually</option>
          <option value="Soon">Soon</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>
      <div class="actions">
        <button id="${projectId}-create-task-btn" class="icon-btn">${icons.check}</button>
        <button id="${projectId}-cancel-task-btn" class="icon-btn">${icons.x}</button>
      </div>
    `;
    tasksContainer.insertBefore(formLi, addTaskBtn);

    document.getElementById(`${projectId}-create-task-btn`).onclick = async () => {
      const desc = document.getElementById(`${projectId}-task-desc`).value.trim();
      if (!desc) return invalidInputAnimate(document.getElementById(`${projectId}-task-desc`));
      await addTask(projectId, { 
        description: desc, 
        due_date: document.getElementById(`${projectId}-task-date`).value || 'No Due Date', 
        priority: document.getElementById(`${projectId}-task-pri`).value 
      });
      await renderTasks(projectId);
    };
    document.getElementById(`${projectId}-cancel-task-btn`).onclick = () => formLi.remove();
  };
}

export async function initApp() {
  await renderProjects();
  const projects = await getAllProjects();
  if (projects.length > 0) {
    const curr = getCurrProjectId() || projects[0].id;
    setCurrProjectId(curr);
    await renderTasks(curr);
  }
}