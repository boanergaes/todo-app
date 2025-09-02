import { Project } from "./factory"

let Projects = {

}

export function storeProject(proj_id, title) {
    const newProj = new Project(proj_id, title);
    Projects[proj_id] = newProj;
    const ProjectsString = JSON.stringify(Projects);

    let localProjects = localStorage.getItem('Projects');
    
    if (!localProjects) {
        localStorage.setItem('Projects', ProjectsString);
    } else {

        Projects[proj_id] = newProj;
        ProjectsString = JSON.stringify(Projects);
        localProjects
    }
}
