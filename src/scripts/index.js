import '../styles/workspace.css'
import { initProjectIntake, renderProjects, renderTasks } from './dom';
import {Task} from './factory'
import { getCurrProjectId, initStorage, projectsJSON, setCurrProjectId } from './storage';
import { nextProjId } from './utils';

let isProjAddBtnActive = true;

const body = document.body;
const addProjectBtn = document.getElementById('add-project');
const sideBar = document.getElementById('side-bar');
const sideBarOnBtn = document.getElementById('sidebar-toggle-btn');
const sideBarOffBtn = document.getElementById('aside-off');
const themeBtn = document.getElementById('theme-btn');

// bellow are the function definitions

// to make sure the user don't keep touching the add project button before finishing their project adding session.
export function InvertIsProjAddBtnActive() {
    isProjAddBtnActive = !isProjAddBtnActive;
}

// bellow are the Function calls and Event Listeners

initStorage() // this does nothing if localStorage is already initialized

renderProjects(1);

renderTasks();

addProjectBtn.addEventListener('click', () => {
    if (isProjAddBtnActive) {
        initProjectIntake();
        InvertIsProjAddBtnActive();
    }
});

// === ui and toggles === //

// toggle sidebar

sideBarOnBtn.addEventListener('click', () => {
    if (sideBar.classList.contains('side-bar-off')) sideBar.classList.remove('side-bar-off');
    sideBar.classList.add('side-bar-on');
})

sideBarOffBtn.addEventListener('click', () => {
    if (sideBar.classList.contains('side-bar-on')) sideBar.classList.remove('side-bar-on');
    sideBar.classList.add('side-bar-off');
})

// it should have no animation if window size >= 740px
window.addEventListener('resize', () => {
    if (window.innerWidth >= 740) {
        if (sideBar.classList.contains('side-bar-off')) sideBar.classList.remove('side-bar-off');
        if (sideBar.classList.contains('side-bar-on')) sideBar.classList.remove('side-bar-on');
    }
})

// theme toggle

if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');
localStorage.getItem('theme') === 'dark' ? body.classList.remove('lightmode') : body.classList.add('lightmode')

themeBtn.addEventListener('click', () => {
    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
        localStorage.setItem('theme', 'light');
        body.classList.add('lightmode');
    } else {
        localStorage.setItem('theme', 'dark');
        body.classList.remove('lightmode');
    }
})