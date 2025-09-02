export class SubTask {
    sub_task_status = false;

    constructor(sub_task_id, parent_task_id, description) {
        this.sub_task_id = sub_task_id;
        this.parent_task_id = parent_task_id;
        this.description = description;
    }

    checkSubTask() {
        this.sub_task_status = true;
    }
    unchekSubTask() {
        this.sub_task_status = false;
    }
}

export class Task {
    task_status = false;
    subTasks = {};

    constructor(task_id, parent_proj_id, task_description, due_date = 'none', priority = 'soon') {
        this.task_id = task_id;
        this.parent_proj_id = parent_proj_id;
        this.task_description = task_description;
        this.due_date = due_date;
        this.priority = priority;
    }

    setTaskDescription(task_desc) {
        this.task_description = task_desc;
    }

    setDueDate(due_date) {
        this.due_date = due_date;
    }

    setPriority(prio) {
        this.priority = prio;
    }

    checkTask() {
        this.task_status = true;
    }

    uncheckTask() {
        this.task_status = false;
    }

    addSubTask(sub_task_id, description) {
        const new_sub_task = new SubTask(sub_task_id, this.task_id, description);
        this.subTasks.push(new_sub_task);
    }

    deleteSubTask(sub_task_id) {
        delete this.subTasks[sub_task_id];
    }
}

export class Project {
    Tasks = {};

    constructor(project_id, title) {
        this.project_id = project_id;
        this.title = title;
    }

    deleteTask(task_id) {
        delete Tasks[task_id];
    }
}


