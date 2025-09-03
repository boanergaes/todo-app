import { renderProjects } from "./dom";
import { Project } from "./factory"

let localProjects = localStorage.getItem('Projects');

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

export function projectsJSON() {
    return JSON.parse(localStorage.getItem('Projects'))
}

export function storeLocal(key, toBestored) {
    localStorage.setItem(key, JSON.stringify(toBestored))
}

// the following two functions are for setting and getting which project is open on the main page view
export function getCurrProjectId() {
    let currProjectId = sessionStorage.getItem('currProject');
    return currProjectId;
}

export function setCurrProjectId(id) {
    sessionStorage.setItem('currProject', id);
}

export function initStorage() {
    if (!localProjects) {
        const stringLocalProjects = JSON.stringify(defaultProjects);
        localStorage.setItem('Projects', stringLocalProjects);
    }
}

export function addProject(proj_id, title) {
    let Projects = projectsJSON();

    Projects[proj_id] = {
        title: title,
        note: '',
        tasks: {}
    }

    storeLocal('Projects', Projects);
}

export function deleteProject(proj_id) {
    // remove the element from DOM
    const deletedProj = document.getElementById(proj_id);
    deletedProj.remove();

    // remove it from local storage
    let Projects = projectsJSON();
    delete Projects[proj_id];
    storeLocal('Projects', Projects);

    // incase all projects are deleted -- will figure it out later
    // if (Object.keys(Projects).length == 0) renderProjects(0);
}
