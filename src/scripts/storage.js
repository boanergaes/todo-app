import { renderProjects, renderTasks } from "./dom";
import { declareTaskUi } from "./utils";

const baseURL = 'http://localhost:3000';

let defaultProjects = {
    p_1: {
        title: 'Every day tasks',
        note: 'These are tasks I must do daily!',
        tasks: {},
    },

    p_2: {
        title: 'Work stuff',
        note: 'These are my tasks that are Work related.',
        tasks: {},
    },

    p_3: {
        title: 'Education',
        note: 'My Educational tasks like home works, studies, and exams.',
        tasks: {},
    },

    p_4: {
        title: 'Bucket List',
        note: 'I want to experience these things before my day comes!',
        tasks: {},
    },
}

let data = {
    projects: defaultProjects,
    validTaskIds: {},
    validSubTaskIds: {}
};

export function initStorage() {
    // Load data from server
    fetch(`${baseURL}/projects`).then(res => res.json()).then(projects => {
        data.projects = projects;
    }).catch(() => {
        // If server not ready, use default
    });

    fetch(`${baseURL}/validTaskIds`).then(res => res.json()).then(validTaskIds => {
        data.validTaskIds = validTaskIds;
    }).catch(() => {});

    fetch(`${baseURL}/validSubTaskIds`).then(res => res.json()).then(validSubTaskIds => {
        data.validSubTaskIds = validSubTaskIds;
    }).catch(() => {});
}

export function projectsJSON() {
    return data.projects;
}

export function storeLocal(key, toBestored) {
    data[key] = toBestored;
    fetch(`${baseURL}/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toBestored)
    }).catch(err => console.error('Failed to save to server', err));
}

// the following two functions are for setting and getting which project is open on the main page view
export function getCurrProjectId() {
    let currProjectId = sessionStorage.getItem('currProject');
    return currProjectId;
}

export function setCurrProjectId(id) {
    sessionStorage.setItem('currProject', id);
}

export function addProject(proj_id, title) {
    let Projects = projectsJSON();

    if (!Projects[proj_id]) {
        Projects[proj_id] = {
            title: title,
            note: '',
            tasks: {}
        }

        storeLocal('projects', Projects);
    }
}

export function deleteProject(proj_id) {
    // remove the element from DOM
    const Projects = projectsJSON();
    const validTaskIds = data.validTaskIds;
    const deletedProj = document.getElementById(proj_id);

    deletedProj.remove();

    // remove it from storage
    delete Projects[proj_id];
    storeLocal('projects', Projects);

    // remove its task id tracker
    delete validTaskIds[proj_id];
    storeLocal('validTaskIds', validTaskIds);

    // incase all projects are deleted -- will figure it out later
    // if (Object.keys(Projects).length == 0) renderProjects(0);
}

export function addTask(proj_id, task_id, description, due_date, priority) {
    let Projects = projectsJSON();

    if (!Projects[proj_id]['tasks'][task_id]) {
        const newTask = {
            description: description,
            due_date: due_date,
            priority: priority,
            task_status: false,
            sub_tasks:{}
        }
        Projects[proj_id]['tasks'][task_id] = newTask;
        storeLocal('projects', Projects);
    }
}

export function deleteTask(proj_id, task_id) {
    const Projects = projectsJSON();
    const validSubTaskIds = data.validSubTaskIds;
    const deleteTask = document.getElementById(task_id);
    const subTaskList = document.getElementById(`${task_id}-sub-task-list`);

    deleteTask.remove();
    if (subTaskList) subTaskList.remove();

    delete Projects[proj_id]['tasks'][task_id];
    storeLocal('projects', Projects);

    // delete it's subtask tracker
    delete validSubTaskIds[task_id];
    storeLocal('validSubTaskIds', validSubTaskIds);
}

export function editTask(proj_id, task_id, new_description, new_due_date, new_priority) {
    const Projects = projectsJSON();
    const task = Projects[proj_id]['tasks'][task_id];

    const final_description = new_description ? new_description : task['description'];
    const final_due_date = new_due_date ? new_due_date : task['due_date'];
    const final_priority = new_priority ? new_priority : task['priority'];

    Projects[proj_id]['tasks'][task_id]['description'] = final_description;
    Projects[proj_id]['tasks'][task_id]['due_date'] = final_due_date;
    Projects[proj_id]['tasks'][task_id]['priority'] = final_priority;

    storeLocal('projects', Projects);
}

export function declareTaskDone(proj_id, task_id, task_done) {
    // update storage
    const Projects = projectsJSON();
    Projects[proj_id]['tasks'][task_id]['task_status'] = task_done;
    storeLocal('projects', Projects)

    //update ui
    declareTaskUi(task_id, task_done);

    // declare all subtasks done if task done
    if (task_done) {
        const subTasks = Projects[proj_id]['tasks'][task_id]['sub_tasks'];
        for (const st in subTasks) {
            declareSubTaskDone(proj_id, task_id, st, task_done, true);
        }
    }
}

export function addSubTask(proj_id, task_id, sub_task_id, sub_task_desc) {
    const Projects = projectsJSON();

    if (!Projects[proj_id]['tasks'][task_id]['sub_tasks'][sub_task_id]) {
        const newSubTask = {
            description: sub_task_desc,
            sub_task_status: false
        }
        Projects[proj_id]['tasks'][task_id]['sub_tasks'][sub_task_id] = newSubTask;
        storeLocal('projects', Projects);
    }
}

export function deleteSubTask(proj_id, task_id, sub_task_id) {
    const Projects = projectsJSON();

    const deleteSubTask = document.getElementById(sub_task_id);
    deleteSubTask.remove();

    delete Projects[proj_id]['tasks'][task_id]['sub_tasks'][sub_task_id];
    storeLocal('projects', Projects);
}

export function declareSubTaskDone(proj_id, task_id, sub_task_id, sub_task_done, passTaskDeclare) {
    const Projects = projectsJSON();
    Projects[proj_id]['tasks'][task_id]['sub_tasks'][sub_task_id]['sub_task_status'] = sub_task_done;
    storeLocal('projects', Projects);

    declareTaskUi(sub_task_id, sub_task_done);

    // to prevent stack overflow if called by declareTaskDone()
    if (!passTaskDeclare) {
        if (allSubTasksDone(proj_id, task_id)) {
            declareTaskDone(proj_id, task_id, true);
        } else {
            declareTaskDone(proj_id, task_id, false);
        }
    }
}

function allSubTasksDone(proj_id, task_id) {
    const Projects = projectsJSON();
    const subTasks = Projects[proj_id]['tasks'][task_id]['sub_tasks'];
    for (const st in subTasks) {
        if (!subTasks[st]['sub_task_status']) return false;
    }
    return true;
}