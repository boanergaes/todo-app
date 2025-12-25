// src/scripts/index.js
import '../styles/workspace.css';
import { renderProjects, InvertIsProjAddBtnActive } from './dom.js';
import * as API from './api.js';

const addProjectBtn = document.getElementById('add-project');
const themeBtn = document.getElementById('theme-btn');
const body = document.body;
let isProjAddBtnActive = true;

addProjectBtn.addEventListener('click', async () => {
    if (!isProjAddBtnActive) return;

    const title = prompt('Enter project name:');
    if (!title) return;

    await API.addProject({ title, note: '' });
    await renderProjects();
    InvertIsProjAddBtnActive();
});

(async () => {
    await renderProjects();
})();

// theme toggle
if (!sessionStorage.getItem('theme')) sessionStorage.setItem('theme', 'dark');
sessionStorage.getItem('theme') === 'dark' ? body.classList.remove('lightmode') : body.classList.add('lightmode');

themeBtn.addEventListener('click', () => {
    const theme = sessionStorage.getItem('theme');

    if (theme === 'dark') {
        sessionStorage.setItem('theme', 'light');
        body.classList.add('lightmode');
    } else {
        sessionStorage.setItem('theme', 'dark');
        body.classList.remove('lightmode');
    }
});
