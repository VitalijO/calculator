const menu = document.querySelector('.settings-wrapper');
const menuBtn = document.querySelector('.burger-menu-icon');

const body = document.body;

if (menu && menuBtn){
    menuBtn.addEventListener('click', ()=>{
        menu.classList.toggle('active');
        menuBtn.classList.toggle('active');
    
    })
}
