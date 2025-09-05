import { projectsJSON, storeLocal } from "./storage";

export function invalidInputAnimate(elem) {
    elem.animate (
        [
            { borderColor: 'var(--thin-border-color)', boxShadow: 'none' },
            { borderColor: 'red', boxShadow: '0 0 20px red' }
        ],
        {
            duration: 160,
            iterations: 2
        }
    )
}

export function declareTaskUi(id, status) {
    const elem = document.getElementById(`${id}`);
    const checkbox = document.getElementById(`${id}-checkbox`);
    checkbox.checked = status;
    elem.style.textDecoration = status ? 'line-through' : 'none';
}

export function nextProjId() {
    // the default projets have ids 1 - 4
    // the new project's ids start at 10 and increases indefinitly even if projects are deleted
    // there is no id reusing
    // project ids have 'p_1' format

    const validProjId = localStorage.getItem('validProjId');
    if (!validProjId) {
        localStorage.setItem('validProjId', '11');
        return 'p_10';
    }
    const int = parseInt(validProjId);
    localStorage.setItem('validProjId', int + 1);
    return 'p_' + (int);
}

export function nextTaskId(proj_id) {
    // task ids have 'p_1-t_2' format where p_1 is project id and t_2 is the task id
    //valid task ids are tracked by incrementing them for each project separately

    const validTaskIds = localStorage.getItem('validTaskIds');

    if (!validTaskIds) {
        const idmap = {
            // return 1 and store 2
            [`${proj_id}`]: 2
        }
        // localStorage.setItem('validTaskIds', JSON.stringify(idmap));
        storeLocal('validTaskIds', idmap);
        return proj_id + '-t_' + 1;
    }

    let parsedTaskIds = JSON.parse(validTaskIds);

    if (!parsedTaskIds[proj_id]) {
        // return 1 and store 2
        parsedTaskIds[proj_id] = 2
        storeLocal('validTaskIds', parsedTaskIds);
        return proj_id + '-t_' + 1
    }

    const newid = parsedTaskIds[proj_id];
    parsedTaskIds[proj_id] = newid + 1;
    storeLocal('validTaskIds', parsedTaskIds);
    return proj_id + '-t_' + newid;
}

export function nextSubTaskId(task_id) {
    // sub-task ids have 'p_1-t_2-st_3' format where p_1 is project id and t_2 is the task id and st_3 is the sub-task id
    //valid sub-task ids are tracked by incrementing them for each task separately

    const validSubTaskIds = localStorage.getItem('validSubTaskIds');

    if (!validSubTaskIds) {
        const idmap = {
            // return 1 and store 2
            [`${task_id}`]: 2
        }
        storeLocal('validSubTaskIds', idmap);
        return task_id + '-st_' + 1;
    }

    let parsedSubTaskIds = JSON.parse(validSubTaskIds);

    if (!parsedSubTaskIds[task_id]) {
        // return 1 and store 2
        parsedSubTaskIds[task_id] = 2
        storeLocal('validSubTaskIds', parsedSubTaskIds);
        return task_id + '-st_' + 1
    }

    const newid = parsedSubTaskIds[task_id];
    parsedSubTaskIds[task_id] = newid + 1;
    storeLocal('validSubTaskIds', parsedSubTaskIds);
    return task_id + '-st_' + newid;
}

export function clearAllChildren(elem) {
    while (elem.firstChild) {
        elem.firstChild.remove();
    }
}