import { auth } from './firebaseConfig.js';
// Inicializar Firebase

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
        // Mostrar notificación de cierre de sesión exitoso
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
            window.location.href = 'index.html'; // Redirigir a index.html al cerrar sesión
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
    const currentPage = window.location.pathname.split('/').pop();

    if (user) {
        // Usuario ha iniciado sesión (la redirección ocurre en el formulario de login)
        if (loginBtn) {
            loginBtn.textContent = 'Cerrar Sesión';
            loginBtn.classList.add('logout-btn');
            loginBtn.onclick = function(e) {
                e.preventDefault();
                handleLogout();
            };
        }
        // Si el usuario está logueado y no está en adm.html o Informes.html, redirige a adm.html
        if (currentPage !== 'adm.html' && currentPage !== 'Informes.html') {
            window.location.href = 'adm.html';
        }
    } else {
        // Usuario no está logueado
        if (loginBtn) {
            loginBtn.textContent = 'Iniciar Sesión';
            loginBtn.classList.remove('logout-btn');
            loginBtn.onclick = function() {
                loginModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            };
        }
        // Si no hay usuario logueado y no estamos en index.html, redirige
         if (currentPage !== 'index.html') {
            window.location.href = 'index.html';
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
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
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
                    window.location.href = 'adm.html'; // Redirigir a adm.html al iniciar sesión
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

// Manejar el envío del formulario de registro (sin cambios en la lógica de redirección)
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

// Manejar el envío del formulario de recuperación de contraseña (sin cambios en la lógica de redirección)
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

const ALLOWED_UID = "IPeJrbYsfQcQUrbLiQ4qn0Ud02S2";

// Manejar registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const uid = document.getElementById('regUID').value;
    const registerMessage = document.getElementById('registerMessage');

    if (uid !== ALLOWED_UID) {
        registerMessage.style.display = 'block';
        registerMessage.textContent = "UID de invitación inválido";
        return;
    }

    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        // Guardar datos adicionales en Realtime Database
        await firebase.database().ref('users/' + userCredential.user.uid).set({
            email: email,
            registrationDate: new Date().toISOString(),
            role: 'user'
        });

        Swal.fire('Registro exitoso', 'Ahora puedes iniciar sesión', 'success');
        $('#registerModal').hide();
        document.getElementById('registerForm').reset();
    } catch (error) {
        let errorMessage = "Error en el registro: ";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += "El correo ya está registrado";
                break;
            case 'auth/invalid-email':
                errorMessage += "Correo electrónico inválido";
                break;
            case 'auth/weak-password':
                errorMessage += "La contraseña debe tener al menos 6 caracteres";
                break;
            default:
                errorMessage += error.message;
        }
        registerMessage.style.display = 'block';
        registerMessage.textContent = errorMessage;
    }
});

// Mostrar/ocultar modales
document.getElementById('registerLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('registerModal').style.display = 'block';
});

// Cerrar modal de registro
document.querySelector('#registerModal .close-modal').addEventListener('click', () => {
    document.getElementById('registerModal').style.display = 'none';
});

// Manejar recuperación de contraseña
document.getElementById('resetPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('forgotPasswordModal').style.display = 'block';
});

document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    const forgotMessage = document.getElementById('forgotMessage');

    try {
        await firebase.auth().sendPasswordResetEmail(email);
        Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'Revisa tu bandeja de entrada para restablecer tu contraseña'
        });
        document.getElementById('forgotPasswordModal').style.display = 'none';
    } catch (error) {
        forgotMessage.style.display = 'block';
        forgotMessage.textContent = this.getPasswordResetError(error.code);
    }
});

// Manejador de errores
function getPasswordResetError(code) {
    switch(code) {
        case 'auth/invalid-email':
            return 'El formato del correo es inválido';
        case 'auth/user-not-found':
            return 'No existe una cuenta con este correo';
        default:
            return 'Error al enviar el correo de recuperación';
    }
}

// Enlaces entre modales
document.querySelectorAll('.login-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('forgotPasswordModal').style.display = 'none';
        document.getElementById('loginModal').style.display = 'block';
    });
});

// Cerrar modal de recuperación
document.querySelector('#forgotPasswordModal .close-modal').addEventListener('click', () => {
    document.getElementById('forgotPasswordModal').style.display = 'none';
});