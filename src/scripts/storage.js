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
    projects: {},
    validTaskIds: {},
    validSubTaskIds: {},
    validProjId: '11'
};

let projects = defaultProjects;

export async function saveData() {
    try {
        await fetch(`${baseURL}/data`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (err) {
        console.error('Failed to save data', err);
        throw err;
    }
}

export async function initStorage() {
    try {
        const res = await fetch(`${baseURL}/data`);
        const d = await res.json();
        data = d;
        projects = data.projects.reduce((acc, p) => {
            acc[p.id] = p;
            return acc;
        }, {});
    } catch (err) {
        data = {
            projects: Object.values(defaultProjects),
            validTaskIds: {},
            validSubTaskIds: {},
            validProjId: '11'
        };
        projects = defaultProjects;
    }
}

export function projectsJSON() {
    return projects;
}

export async function storeLocal(key, toBestored) {
    data[key] = toBestored;
    try {
        await saveData();
    } catch (err) {
        console.error('Failed to save to server', err);
        throw err;
    }
}

// the following two functions are for setting and getting which project is open on the main page view
export function getCurrProjectId() {
    let currProjectId = sessionStorage.getItem('currProject');
    return currProjectId;
}

export function setCurrProjectId(id) {
    sessionStorage.setItem('currProject', id);
}

export function getValidTaskIds() {
    return data.validTaskIds;
}

export function getValidSubTaskIds() {
    return data.validSubTaskIds;
}

export function getValidProjId() {
    return data.validProjId;
}

export const getProjects = projectsJSON;

export { data };

export async function addProject(proj_id, title) {
    let Projects = projectsJSON();

    if (!Projects[proj_id]) {
        const newProject = {
            id: proj_id,
            title: title,
            note: '',
            tasks: {}
        };
        Projects[proj_id] = newProject;
                // update in-memory data and persist whole `data` to server
                data.projects = Object.values(Projects);
                try {
                    await saveData();
                } catch (err) {
                    console.error('Failed to add project', err);
                    throw err;
                }
    }
}

export async function deleteProject(proj_id) {
    // remove the element from DOM
    const Projects = projectsJSON();
    const validTaskIds = data.validTaskIds;
    const deletedProj = document.getElementById(proj_id);

    deletedProj.remove();

    // remove it from storage
    delete Projects[proj_id];
        // update in-memory data and persist
        data.projects = Object.values(Projects);
        try {
            await saveData();
        } catch (err) {
            console.error('Failed to delete project', err);
            throw err;
        }

    // remove its task id tracker
    delete validTaskIds[proj_id];
    await storeLocal('validTaskIds', validTaskIds);

    // incase all projects are deleted -- will figure it out later
    // if (Object.keys(Projects).length == 0) renderProjects(0);
}

export async function addTask(proj_id, task_id, description, due_date, priority) {
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
                // persist full data object
                data.projects = Object.values(Projects);
                try {
                    await saveData();
                } catch (err) {
                    console.error('Failed to add task', err);
                    throw err;
                }
    }
}

export async function deleteTask(proj_id, task_id) {
    const Projects = projectsJSON();
    const validSubTaskIds = data.validSubTaskIds;
    const deleteTask = document.getElementById(task_id);
    const subTaskList = document.getElementById(`${task_id}-sub-task-list`);

    deleteTask.remove();
    if (subTaskList) subTaskList.remove();

    delete Projects[proj_id]['tasks'][task_id];
        // persist full data object
        data.projects = Object.values(Projects);
        try {
            await saveData();
        } catch (err) {
            console.error('Failed to delete task', err);
            throw err;
        }

    // delete it's subtask tracker
    delete validSubTaskIds[task_id];
    await storeLocal('validSubTaskIds', validSubTaskIds);
}

export async function editTask(proj_id, task_id, new_description, new_due_date, new_priority) {
    const Projects = projectsJSON();
    const task = Projects[proj_id]['tasks'][task_id];

    const final_description = new_description ? new_description : task['description'];
    const final_due_date = new_due_date ? new_due_date : task['due_date'];
    const final_priority = new_priority ? new_priority : task['priority'];

    Projects[proj_id]['tasks'][task_id]['description'] = final_description;
    Projects[proj_id]['tasks'][task_id]['due_date'] = final_due_date;
    Projects[proj_id]['tasks'][task_id]['priority'] = final_priority;

        // persist full data object
        data.projects = Object.values(Projects);
        try {
            await saveData();
        } catch (err) {
            console.error('Failed to edit task', err);
            throw err;
        }
}

export async function declareTaskDone(proj_id, task_id, task_done) {
    // update storage
    const Projects = projectsJSON();
    Projects[proj_id]['tasks'][task_id]['task_status'] = task_done;
        // persist full data object
        data.projects = Object.values(Projects);
        try {
            await saveData();
        } catch (err) {
            console.error('Failed to update task status', err);
            throw err;
        }

    //update ui
    declareTaskUi(task_id, task_done);

    // declare all subtasks done if task done
    if (task_done) {
        const subTasks = Projects[proj_id]['tasks'][task_id]['sub_tasks'];
        for (const st in subTasks) {
            await declareSubTaskDone(proj_id, task_id, st, task_done, true);
        }
    }
}

export async function addSubTask(proj_id, task_id, sub_task_id, sub_task_desc) {
    const Projects = projectsJSON();

    if (!Projects[proj_id]['tasks'][task_id]['sub_tasks'][sub_task_id]) {
        const newSubTask = {
            description: sub_task_desc,
            sub_task_status: false
        }
        Projects[proj_id]['tasks'][task_id]['sub_tasks'][sub_task_id] = newSubTask;
                // persist full data object
                data.projects = Object.values(Projects);
                try {
                    await saveData();
                } catch (err) {
                    console.error('Failed to add subtask', err);
                    throw err;
                }
    }
}

export async function deleteSubTask(proj_id, task_id, sub_task_id) {
    const Projects = projectsJSON();

    const deleteSubTask = document.getElementById(sub_task_id);
    deleteSubTask.remove();

    delete Projects[proj_id]['tasks'][task_id]['sub_tasks'][sub_task_id];
        // persist full data object
        data.projects = Object.values(Projects);
        try {
            await saveData();
        } catch (err) {
            console.error('Failed to delete subtask', err);
            throw err;
        }
}

export async function declareSubTaskDone(proj_id, task_id, sub_task_id, sub_task_done, passTaskDeclare) {
    const Projects = projectsJSON();
    Projects[proj_id]['tasks'][task_id]['sub_tasks'][sub_task_id]['sub_task_status'] = sub_task_done;
        // persist full data object
        data.projects = Object.values(Projects);
        try {
            await saveData();
        } catch (err) {
            console.error('Failed to update subtask status', err);
            throw err;
        }

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
