/**
 * mobile.js - Controlador de menú móvil y mejoras de UI
 * Versión optimizada y corregida
 */

// Función principal que se ejecuta cuando el DOM está listo
function initMobileFeatures() {
    // 1. Configuración del menú móvil
    setupMobileMenu();
    
    // 2. Configuración de formularios
    setupFormBehavior();
    
    // 3. Mejoras de accesibilidad
    setupAccessibility();
    
    // 4. Controles de contraseña
    setupPasswordToggles();
}

// ==================== FUNCIONES PRINCIPALES ====================

function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileToggle || !navMenu) {
        console.warn('Elementos del menú móvil no encontrados. Funcionalidad desactivada.');
        return;
    }

    // Toggle del menú
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        navMenu.classList.toggle('active');
        console.debug('Menú toggled:', navMenu.classList.contains('active'));
    });

    // Cerrar menú al hacer clic en enlaces
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (!navMenu.classList.contains('active')) return;
        
        const clickedInside = navMenu.contains(event.target) || 
                            mobileToggle.contains(event.target);
        
        if (!clickedInside) {
            navMenu.classList.remove('active');
            console.debug('Menú cerrado por click externo');
        }
    });
}

function setupFormBehavior() {
    const roleSelect = document.getElementById('role');
    if (!roleSelect) return;

    roleSelect.addEventListener('change', function() {
        // Ocultar todos los avisos
        document.querySelectorAll('.role-notice').forEach(el => el.style.display = 'none');
        
        // Mostrar aviso correspondiente
        const notices = {
            'publisher': 'publisherNotice',
            'auxiliary': 'auxiliaryNotice', 
            'regular': 'regularNotice'
        };
        
        const noticeId = notices[this.value];
        if (noticeId) {
            const notice = document.getElementById(noticeId);
            if (notice) notice.style.display = 'block';
        }
        
        // Manejar campo de horas
        const hoursInput = document.getElementById('hours');
        if (hoursInput) {
            hoursInput.disabled = this.value === 'publisher';
            if (this.value === 'publisher') hoursInput.value = '';
        }
    });
    
    // Disparar evento change al cargar para estado inicial
    roleSelect.dispatchEvent(new Event('change'));
}

function setupAccessibility() {
    // Scroll para inputs en iOS
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            setTimeout(() => this.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            }), 300);
        });
    });
    
    // Mejorar focus para elementos interactivos
    document.querySelectorAll('button, a, [tabindex]').forEach(el => {
        el.addEventListener('focus', function() {
            this.style.outline = '2px solid #3949ab';
        });
        el.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

function setupPasswordToggles() {
    document.querySelectorAll('.show-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (!input || !icon) return;
            
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            icon.classList.toggle('fa-eye-slash', isPassword);
            icon.classList.toggle('fa-eye', !isPassword);
        });
    });
}

// ==================== INICIALIZACIÓN ====================

// Manejar ambos casos: DOM cargando o ya cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileFeatures);
} else {
    // DOM ya está listo
    initMobileFeatures();
}

// Opcional: Observador para contenido cargado dinámicamente
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('.mobile-toggle')) {
            initMobileFeatures();
            observer.disconnect();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}