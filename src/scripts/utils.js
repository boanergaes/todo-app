// src/scripts/utils.js
import { format } from 'date-fns';

export function invalidInputAnimate(elem) {
    elem.animate(
        [
            { borderColor: 'var(--thin-border-color)', boxShadow: 'none' },
            { borderColor: 'red', boxShadow: '0 0 20px red' }
        ],
        { duration: 160, iterations: 2 }
    );
}

export function formatDate(date) {
    if (!date || date === 'No Due Date') return 'No Due Date';
    const new_date = new Date(date);
    return format(new_date, "EEE MMM d yyyy");
}

export function declareTaskUi(elemId, status) {
    const elem = document.getElementById(`${elemId}`);
    const checkbox = document.getElementById(`${elemId}-checkbox`);
    if (!checkbox || !elem) return;
    checkbox.checked = status;
    elem.style.textDecoration = status ? 'line-through' : 'none';
}

export function generateId(prefix, counter) {
    return `${prefix}_${counter}`;
}
