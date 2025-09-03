import { projectsJSON, storeLocal } from "./storage";

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