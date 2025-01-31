 // Función para activar/desactivar el modo oscuro
 function toggleDarkMode() {
    const body = document.body;
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        body.classList.add('dark-mode');
        darkModeToggle.classList.add('active');
    } else {
        body.classList.remove('dark-mode');
        darkModeToggle.classList.remove('active');
    }
}

// Función para guardar el estado del modo oscuro en localStorage
function saveDarkModeState(isDarkMode) {
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
}

// Evento al hacer click en el toggle del modo oscuro
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
    darkModeToggle.classList.toggle('active');

    // Guarda el estado del modo oscuro
    const isDarkMode = body.classList.contains('dark-mode');
    saveDarkModeState(isDarkMode);
});

// Cargar el estado del modo oscuro al cargar la página
toggleDarkMode();