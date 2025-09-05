
const sideBar = document.getElementById('side-bar');
const sideBarOnBtn = document.getElementById('sidebar-toggle-btn');
const sideBarOffBtn = document.getElementById('aside-off');

sideBarOnBtn.addEventListener('click', () => {
    sideBar.animate(
        [
            {transform: 'translateX(-500)'},
            {transform: 'translateY(0)'}
        ],
        {
            duration: 400,
            easing: 'ease-in',
            direction: 'forwards',           
        }
    )
})