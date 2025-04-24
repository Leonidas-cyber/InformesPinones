import { auth } from './firebaseConfig.js';

// 1. Configuración inicial del botón de login/logout
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        if (auth.currentUser) {
            loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar Sesión';
            loginBtn.onclick = handleLogout;
            loginBtn.classList.add('logout-btn');
        } else {
            loginBtn.innerHTML = 'Iniciar Sesión';
            loginBtn.onclick = showLoginModal;
            loginBtn.classList.remove('logout-btn');
        }
    }
});

// 2. Función para mostrar el modal de login
function showLoginModal(e) {
    e.preventDefault();
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 3. Función para mostrar mensajes
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `alert alert-${type}`;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// 4. Función para cerrar sesión (globalmente accesible)
window.handleLogout = function() {
    auth.signOut().then(() => {
        showNotification('Sesión cerrada correctamente', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
        showMessage('loginMessage', 'Error al cerrar sesión: ' + error.message, 'danger');
    });
}

// 5. Función auxiliar para mostrar notificaciones
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '10000';
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// 6. Manejo del estado de autenticación (parte modificada)
auth.onAuthStateChanged((user) => {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    const isAdminPage = currentPage === 'adm.html';
    const isReportsPage = currentPage === 'informes.html';
    const isIndexPage = currentPage === 'index.html' || currentPage === '';
    
    const loginBtn = document.querySelector('.login-btn');

    if (user) {
        // Actualizar botón a logout
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar Sesión';
            loginBtn.onclick = handleLogout;
            loginBtn.classList.add('logout-btn');
        }
        
        // Redirección según página (parte modificada)
        if (!isAdminPage && !isReportsPage && !isIndexPage) {
            setTimeout(() => {
                window.location.href = 'adm.html';
            }, window.innerWidth < 768 ? 500 : 0);
        }
    } else {
        // Actualizar botón a login
        if (loginBtn) {
            loginBtn.innerHTML = 'Iniciar Sesión';
            loginBtn.onclick = showLoginModal;
            loginBtn.classList.remove('logout-btn');
        }
        
        // Redirección según página
        if (!isIndexPage) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, window.innerWidth < 768 ? 500 : 0);
        }
    }
});

// 7. Configuración de modales
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const closeModals = document.querySelectorAll('.close-modal');
const showPasswordBtns = document.querySelectorAll('.show-password');
const passwordInputs = document.querySelectorAll('input[type="password"]');
const registerLink = document.getElementById('registerLink');
const resetPasswordLink = document.getElementById('resetPasswordLink');

// Cerrar modales
closeModals.forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        const modal = this.closest('.login-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Cerrar al hacer clic fuera
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('login-modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Mostrar/ocultar contraseña
showPasswordBtns.forEach((btn, index) => {
    btn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        const input = passwordInputs[index];
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Navegación entre modales
if (registerLink) {
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });
}

if (resetPasswordLink) {
    resetPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        forgotPasswordModal.style.display = 'block';
    });
}

// 8. Manejo de formularios
// Formulario de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        const persistence = remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;

        auth.setPersistence(persistence)
            .then(() => auth.signInWithEmailAndPassword(email, password))
            .then(() => {
                showMessage('loginMessage', 'Inicio de sesión exitoso', 'success');
                setTimeout(() => {
                    loginModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    window.location.href = 'adm.html';
                }, 1500);
            })
            .catch((error) => {
                const errorMessages = {
                    'auth/user-not-found': 'No existe una cuenta con este correo.',
                    'auth/wrong-password': 'Contraseña incorrecta.',
                    'auth/invalid-email': 'El correo electrónico no es válido.',
                    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.'
                };
                showMessage('loginMessage', errorMessages[error.code] || 'Error al iniciar sesión. Por favor, intenta nuevamente.', 'danger');
            });
    });
}

// Formulario de registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const uid = document.getElementById('regUID').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                showMessage('registerMessage', 'Registro exitoso. Bienvenido!', 'success');
                setTimeout(() => {
                    registerModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 1500);
            })
            .catch((error) => {
                const errorMessages = {
                    'auth/email-already-in-use': 'Este correo ya está registrado.',
                    'auth/invalid-email': 'El correo electrónico no es válido.',
                    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.'
                };
                showMessage('registerMessage', errorMessages[error.code] || 'Error al registrar. Por favor, intenta nuevamente.', 'danger');
            });
    });
}

// Formulario de recuperación
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;

        auth.sendPasswordResetEmail(email)
            .then(() => {
                showMessage('forgotMessage', 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.', 'success');
                setTimeout(() => {
                    forgotPasswordModal.style.display = 'none';
                    loginModal.style.display = 'block';
                }, 3000);
            })
            .catch((error) => {
                const errorMessages = {
                    'auth/user-not-found': 'No existe una cuenta con este correo.',
                    'auth/invalid-email': 'El correo electrónico no es válido.'
                };
                showMessage('forgotMessage', errorMessages[error.code] || 'Error al enviar el correo. Por favor, intenta nuevamente.', 'danger');
            });
    });
}