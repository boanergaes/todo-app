// src/scripts/api.js
const API_URL = 'http://localhost:3000';

export async function getProjects() {
    const res = await fetch(`${API_URL}/projects`);
    return await res.json();
}

export async function addProject(project) {
    const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
    });
    return await res.json();
}

export async function updateProject(id, data) {
    const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
}

export async function deleteProject(id) {
    await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
}

// TASKS
export async function getTasks() {
    const res = await fetch(`${API_URL}/tasks`);
    return await res.json();
}

export async function addTask(task) {
    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    return await res.json();
}

export async function updateTask(id, data) {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
}

export async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
}

// SUBTASKS
export async function getSubTasks() {
    const res = await fetch(`${API_URL}/subtasks`);
    return await res.json();
}

export async function addSubTask(subtask) {
    const res = await fetch(`${API_URL}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subtask)
    });
    return await res.json();
}

export async function updateSubTask(id, data) {
    const res = await fetch(`${API_URL}/subtasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
}

export async function deleteSubTask(id) {
    await fetch(`${API_URL}/subtasks/${id}`, { method: 'DELETE' });
}
