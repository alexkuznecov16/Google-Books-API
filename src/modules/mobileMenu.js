const menu = document.querySelector('.mobile-menu');

document.querySelector('.fa-bars').addEventListener('click', () => {
    menu.classList.add('animation-mobile');
    document.body.classList.add('active');
    menu.classList.add('d-flex');
    menu.classList.remove('right100');
});

document.querySelector('.fa-xmark').addEventListener('click', () => {
    console.log('Hello');
    menu.classList.remove('animation-mobile');
    document.body.classList.remove('active');
    menu.classList.remove('d-flex');
    menu.classList.add('right100');
});
