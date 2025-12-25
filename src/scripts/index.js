// src/scripts/index.js
import '../styles/workspace.css';
import { renderProjects } from './dom.js';
import { InvertIsProjAddBtnActive } from './dom.js';
import * as API from './api.js';

const addProjectBtn = document.getElementById('add-project');
let isProjAddBtnActive = true;

export function InvertIsProjAddBtnActive() { isProjAddBtnActive = !isProjAddBtnActive; }

addProjectBtn.addEventListener('click', async () => {
    if (!isProjAddBtnActive) return;

    const title = prompt('Enter project name:');
    if (!title) return;

    await API.addProject({ title, note: '' });
    await renderProjects();
    InvertIsProjAddBtnActive();
});

renderProjects();
