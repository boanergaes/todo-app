// src/scripts/index.js
import '../styles/workspace.css';
import { initApp } from "./dom.js";

window.addEventListener("DOMContentLoaded", () => {
  // Initialize the core app logic (rendering projects/tasks)
  initApp();

  // --- Theme Toggle Logic ---
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      // Toggle the lightmode class on the body
      document.body.classList.toggle('lightmode');
      
      // Optional: Store preference in localStorage
      const isLight = document.body.classList.contains('lightmode');
      localStorage.setItem('theme-preference', isLight ? 'light' : 'dark');
    });

    // Check for saved preference on load
    if (localStorage.getItem('theme-preference') === 'light') {
      document.body.classList.add('lightmode');
    }
  }

  // --- Sidebar Mobile Toggle Logic ---
  const aside = document.querySelector('aside');
  const sidebarOpenBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarCloseBtn = document.getElementById('aside-off');

  if (sidebarOpenBtn && aside) {
    sidebarOpenBtn.addEventListener('click', () => {
      // These classes match the layout logic mentioned in your CSS
      aside.classList.add('side-bar-on');
      aside.classList.remove('side-bar-off');
    });
  }

  if (sidebarCloseBtn && aside) {
    sidebarCloseBtn.addEventListener('click', () => {
      aside.classList.add('side-bar-off');
      aside.classList.remove('side-bar-on');
    });
  }
});