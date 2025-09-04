import '../styles/workspace.css'
import { initProjectIntake, renderProjects, renderTasks } from './dom';
import {Task} from './factory'
import { getCurrProjectId, initStorage, projectsJSON, setCurrProjectId } from './storage';
import { nextProjId } from './utils';

let isProjAddBtnActive = true;

const addProjectBtn = document.getElementById('add-project');

// bellow are the function definitions

// to make sure the user don't keep touching the add project button before finishing their project adding session.
export function InvertIsProjAddBtnActive() {
    isProjAddBtnActive = !isProjAddBtnActive;
}

// bellow are the Function calls and Event Listeners

initStorage() // this does nothing if localStorage is already initialized

renderProjects(1);

renderTasks();

// console.log(localStorage.getItem('Project'))

addProjectBtn.addEventListener('click', () => {
    if (isProjAddBtnActive) {
        initProjectIntake();
        InvertIsProjAddBtnActive();
    }
});
