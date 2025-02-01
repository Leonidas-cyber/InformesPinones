document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const leftMenu = document.querySelector('.left-menu');
    const overlay = document.querySelector('.overlay');

    // Abrir/cerrar el menú lateral
    menuToggle.addEventListener('click', () => {
        leftMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // Cerrar el menú al hacer clic fuera de él
    overlay.addEventListener('click', () => {
        leftMenu.classList.remove('active');
        overlay.classList.remove('active');
    });
});