// Función para simular carga y mostrar contenido principal
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.querySelector('.loading-screen');
    const mainContent = document.querySelector('.main-content');
    
    if (!loadingScreen || !mainContent) return;
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        setTimeout(() => {
            mainContent.classList.add('visible');
            loadingScreen.style.display = 'none';
        }, 300);
    }, 1500); // Reducido a 1.5s para mejor UX
});

// Toggle para el modo oscuro (con almacenamiento local)
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

if (darkModeToggle && body) {
    // Cargar preferencia guardada
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        
        // Guardar preferencia
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        updateDarkModeIcon(isDarkMode);
    });
}

function updateDarkModeIcon(isDarkMode) {
    const icon = darkModeToggle.querySelector('i');
    const text = darkModeToggle.querySelector('span');
    
    if (isDarkMode) {
        icon?.classList.replace('fa-moon', 'fa-sun');
        text && (text.textContent = 'Modo Claro');
    } else {
        icon?.classList.replace('fa-sun', 'fa-moon');
        text && (text.textContent = 'Modo Oscuro');
    }
}

// Toggle para menú móvil mejorado
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.setAttribute(
            'aria-expanded', 
            navMenu.classList.contains('active')
        );
    });
}

/*
// Manejo de cambios en el rol seleccionado (versión optimizada)
const roleSelect = document.getElementById('role');
const hoursInput = document.getElementById('hours');
const notices = {
    publisher: document.getElementById('publisherNotice'),
    auxiliary: document.getElementById('auxiliaryNotice'),
    regular: document.getElementById('regularNotice')
};

if (roleSelect && hoursInput) {
    roleSelect.addEventListener('change', function() {
        // Ocultar todos los avisos
        Object.values(notices).forEach(notice => {
            notice && (notice.style.display = 'none');
        });
        
        // Configuración según rol
        const config = {
            publisher: { disabled: true, required: false, clearValue: true },
            auxiliary: { disabled: false, required: true },
            regular: { disabled: false, required: true }
        };
        
        const currentConfig = config[this.value] || {};
        
        hoursInput.disabled = currentConfig.disabled || false;
        hoursInput.required = currentConfig.required || false;
        if (currentConfig.clearValue) hoursInput.value = '';
        
        // Mostrar aviso correspondiente
        notices[this.value] && (notices[this.value].style.display = 'block');
    });
}

// Validación del formulario mejorada
const serviceForm = document.getElementById('serviceForm');

if (serviceForm) {
    serviceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Aquí podrías añadir lógica para enviar datos a Firebase si fuera necesario
            // Pero actualmente este formulario no lo requiere
            
            showToast('¡Formulario enviado correctamente!', 'success');
            resetForm();
        } catch (error) {
            showToast('Error al enviar el formulario', 'error');
            console.error('Error:', error);
        }
    });
}

// Funciones auxiliares
function showToast(message, type) {
    Swal.fire({
        icon: type,
        title: message,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
    });
}


function resetForm() {
    serviceForm.reset();
    Object.values(notices).forEach(notice => {
        notice && (notice.style.display = 'none');
    });
    hoursInput.disabled = false;
}*/