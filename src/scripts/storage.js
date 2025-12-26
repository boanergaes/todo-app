// src/scripts/storage.js
import axios from "axios";

const BASE = "http://localhost:3000";
const API_PROJECTS = `${BASE}/projects`;

// Local in-memory cache (array of project objects)
let projects = [];
let currProjectId = null;

// Fetch all projects from JSON Server
export async function getAllProjects() {
  try {
    const res = await axios.get(API_PROJECTS);
    projects = res.data || [];
    return projects;
  } catch (err) {
    console.error("Error fetching projects:", err);
    return [];
  }
}

// Add new project (client assigns an id with p_<timestamp>)
export async function addProject(project) {
  try {
    const id = `p_${Date.now()}`;
    const newProject = { id, title: project.title, note: project.note || "", tasks: project.tasks || {} };
    const res = await axios.post(API_PROJECTS, newProject);
    projects.push(res.data);
    return res.data;
  } catch (err) {
    console.error("Error adding project:", err);
  }
}

// Add task to a project (task stored under project.tasks as key)
export async function addTask(projectId, task) {
  try {
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error("Project not found");
    if (!project.tasks) project.tasks = {};

    const taskId = `${projectId}-t_${Date.now()}`;
    const newTask = {
      id: taskId,
      description: task.description || "",
      due_date: task.due_date || "No Due Date",
      priority: task.priority || "Eventually",
      task_status: task.task_status || false,
      sub_tasks: task.sub_tasks || {}
    };

    project.tasks[taskId] = newTask;
    await axios.put(`${API_PROJECTS}/${projectId}`, project);
    return newTask;
  } catch (err) {
    console.error("Error adding task:", err);
  }
}

// Edit project (partial update)
export async function editProject(projectId, updated) {
  try {
    const idx = projects.findIndex((p) => p.id === projectId);
    if (idx === -1) throw new Error("Project not found");
    projects[idx] = { ...projects[idx], ...updated };
    await axios.put(`${API_PROJECTS}/${projectId}`, projects[idx]);
    return projects[idx];
  } catch (err) {
    console.error("Error editing project:", err);
  }
}

// Edit task
export async function editTask(projectId, taskId, updatedTask) {
  try {
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.tasks || !project.tasks[taskId]) throw new Error("Task not found");
    project.tasks[taskId] = { ...project.tasks[taskId], ...updatedTask };
    await axios.put(`${API_PROJECTS}/${projectId}`, project);
    return project.tasks[taskId];
  } catch (err) {
    console.error("Error editing task:", err);
  }
}

// Delete project
export async function deleteProject(projectId) {
  try {
    await axios.delete(`${API_PROJECTS}/${projectId}`);
    projects = projects.filter((p) => p.id !== projectId);
  } catch (err) {
    console.error("Error deleting project:", err);
  }
}

// Delete task
export async function deleteTask(projectId, taskId) {
  try {
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.tasks) return;
    delete project.tasks[taskId];
    await axios.put(`${API_PROJECTS}/${projectId}`, project);
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

// Current project ID getter/setter (persist in sessionStorage)
export function getCurrProjectId() {
  const id = sessionStorage.getItem("currProject");
  return id || currProjectId;
}

export function setCurrProjectId(id) {
  currProjectId = id;
  sessionStorage.setItem("currProject", id);
}
