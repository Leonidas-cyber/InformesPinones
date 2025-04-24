import { auth } from './firebaseConfig.js';

// Función para mostrar mensajes
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

// Función para manejar el cierre de sesión
function handleLogout() {
    auth.signOut().then(() => {
        const notification = document.createElement('div');
        notification.textContent = 'Sesión cerrada correctamente';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
            window.location.href = 'index.html';
        }, 1500);
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
        showMessage('loginMessage', 'Error al cerrar sesión: ' + error.message, 'danger');
    });
}

// Manejar el estado de autenticación
auth.onAuthStateChanged((user) => {
    console.log('Estado de autenticación:', user ? 'Usuario logueado' : 'No hay usuario');
    const loginBtn = document.querySelector('.login-btn');
    
    // Detectar página actual
const currentPath = window.location.pathname.toLowerCase(); // Convertir a minúsculas
const isAdminPage = currentPath.includes('adm.html');
const isReportsPage = currentPath.includes('informes.html'); // Ahora en minúsculas
const isIndexPage = currentPath.includes('index.html');
    if (user) {
        // Lógica para usuario logueado
        if (loginBtn) {
            loginBtn.textContent = 'Cerrar Sesión';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                handleLogout();
            };
        }
        
        // Redirigir solo si no está en página permitida
        if (!isAdminPage && !isReportsPage) {
            setTimeout(() => {
                window.location.href = 'adm.html';
            }, window.innerWidth < 768 ? 500 : 0);
        }
    } else {
        // Lógica para usuario no logueado
        if (loginBtn) {
            loginBtn.textContent = 'Iniciar Sesión';
            loginBtn.onclick = () => {
                loginModal.style.display = 'block';
            };
        }
        
        // Redirigir solo si no está en index
        if (!isIndexPage) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, window.innerWidth < 768 ? 500 : 0);
        }
    }
});

// Obtener referencias a los elementos del DOM
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const resetPasswordModal = document.getElementById('resetPasswordModal');
const closeModals = document.querySelectorAll('.close-modal');
const showPasswordBtns = document.querySelectorAll('.show-password');
const passwordInputs = document.querySelectorAll('input[type="password"]');
const registerLink = document.getElementById('registerLink');
const loginLink = document.getElementById('loginLink');
const resetPasswordLink = document.getElementById('resetPasswordLink');
const backToLoginLink = document.getElementById('backToLoginLink');

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

// Cerrar modal al hacer clic fuera del contenido
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

// Cambiar entre modales
if (registerLink) {
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });
}

if (loginLink) {
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
}

if (resetPasswordLink) {
    resetPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        resetPasswordModal.style.display = 'block';
    });
}

if (backToLoginLink) {
    backToLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        resetPasswordModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
}

// Manejar el envío del formulario de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        const persistence = remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;

        auth.setPersistence(persistence)
            .then(() => {
                return auth.signInWithEmailAndPassword(email, password);
            })
            .then(() => {
                showMessage('loginMessage', 'Inicio de sesión exitoso', 'success');
                setTimeout(() => {
                    loginModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    window.location.href = 'adm.html';
                }, 1500);
            })
            .catch((error) => {
                let errorMessage;
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'No existe una cuenta con este correo.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Contraseña incorrecta.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'El correo electrónico no es válido.';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'Esta cuenta ha sido deshabilitada.';
                        break;
                    default:
                        errorMessage = 'Error al iniciar sesión. Por favor, intenta nuevamente.';
                }
                showMessage('loginMessage', errorMessage, 'danger');
            });
    });
}

// Manejar el envío del formulario de registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password !== confirmPassword) {
            showMessage('registerMessage', 'Las contraseñas no coinciden', 'danger');
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                return userCredential.user.updateProfile({
                    displayName: name
                });
            })
            .then(() => {
                showMessage('registerMessage', 'Registro exitoso. Bienvenido!', 'success');
                setTimeout(() => {
                    registerModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 1500);
            })
            .catch((error) => {
                let errorMessage;
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'Este correo ya está registrado.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'El correo electrónico no es válido.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
                        break;
                    default:
                        errorMessage = 'Error al registrar. Por favor, intenta nuevamente.';
                }
                showMessage('registerMessage', errorMessage, 'danger');
            });
    });
}

// Manejar el envío del formulario de recuperación de contraseña
const resetPasswordForm = document.getElementById('resetPasswordForm');
if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('resetEmail').value;

        auth.sendPasswordResetEmail(email)
            .then(() => {
                showMessage('resetMessage', 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.', 'success');
                setTimeout(() => {
                    resetPasswordModal.style.display = 'none';
                    loginModal.style.display = 'block';
                }, 3000);
            })
            .catch((error) => {
                let errorMessage;
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'No existe una cuenta con este correo.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'El correo electrónico no es válido.';
                        break;
                    default:
                        errorMessage = 'Error al enviar el correo. Por favor, intenta nuevamente.';
                }
                showMessage('resetMessage', errorMessage, 'danger');
            });
    });
}

// Cerrar modal de registro
const registerCloseBtn = document.querySelector('#registerModal .close-modal');
if (registerCloseBtn) {
    registerCloseBtn.addEventListener('click', () => {
        document.getElementById('registerModal').style.display = 'none';
    });
}

// Cerrar modal de recuperación
const resetCloseBtn = document.querySelector('#resetPasswordModal .close-modal');
if (resetCloseBtn) {
    resetCloseBtn.addEventListener('click', () => {
        document.getElementById('resetPasswordModal').style.display = 'none';
    });
}

// Enlaces entre modales
document.querySelectorAll('.login-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('resetPasswordModal').style.display = 'none';
        document.getElementById('loginModal').style.display = 'block';
    });
});