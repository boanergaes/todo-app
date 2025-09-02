import '../styles/workspace.css'
import { initProjectIntake } from './dom';
import {Task} from './factory'

let currProject = 'none';
let isProjAddBtnActive = true;
export function InvertIsProjAddBtnActive() {
    isProjAddBtnActive = !isProjAddBtnActive;
}

const addProjectBtn = document.getElementById('add-project');

addProjectBtn.addEventListener('click', () => {
    if (isProjAddBtnActive) {
        initProjectIntake();
        InvertIsProjAddBtnActive();
    }
});
