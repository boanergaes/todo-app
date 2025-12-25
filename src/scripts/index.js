// index.js
import '../styles/workspace.css';
import { initProjectIntake, renderProjects, renderTasks } from './dom';
import { nextProjId } from './utils';

let isProjAddBtnActive = true;

const body = document.body;
const addProjectBtn = document.getElementById('add-project');
const sideBar = document.getElementById('side-bar');
const sideBarOnBtn = document.getElementById('sidebar-toggle-btn');
const sideBarOffBtn = document.getElementById('aside-off');
const themeBtn = document.getElementById('theme-btn');

export function InvertIsProjAddBtnActive() { isProjAddBtnActive = !isProjAddBtnActive; }

/* Initialize app */
(async function boot() {
  // init storage (no-op for JSON server but kept)
  // when storage.js init is async, we might have initStorage exported; your rewritten storage.js uses initStorageIfEmpty
  // But to keep exact behaviour, we don't await anything here.
  // Render UI
  await renderProjects(1);
  await renderTasks();
})();

/* Add project button */
addProjectBtn.addEventListener('click', () => {
  if (isProjAddBtnActive) {
    initProjectIntake();
    InvertIsProjAddBtnActive();
  }
});

/* Sidebar toggles */
sideBarOnBtn.addEventListener('click', () => {
  if (sideBar.classList.contains('side-bar-off')) sideBar.classList.remove('side-bar-off');
  sideBar.classList.add('side-bar-on');
});

sideBarOffBtn.addEventListener('click', () => {
  if (sideBar.classList.contains('side-bar-on')) sideBar.classList.remove('side-bar-on');
  sideBar.classList.add('side-bar-off');
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 740) {
    if (sideBar.classList.contains('side-bar-off')) sideBar.classList.remove('side-bar-off');
    if (sideBar.classList.contains('side-bar-on')) sideBar.classList.remove('side-bar-on');
  }
});

/* Theme toggle */
if (!sessionStorage.getItem('theme')) sessionStorage.setItem('theme', 'dark');
sessionStorage.getItem('theme') === 'dark' ? body.classList.remove('lightmode') : body.classList.add('lightmode')

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
