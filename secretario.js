document.addEventListener('DOMContentLoaded', function() {
    const adminAlert = document.getElementById('adminAlert');
    const secretaryLoginSection = document.getElementById('secretaryLoginSection');
    const secretaryContent = document.getElementById('secretaryContent');
    const driveFoldersList = document.getElementById('driveFoldersList');
    const secretaryLoginForm = document.getElementById('secretaryLoginForm');
    const secretaryLogoutBtn = document.getElementById('secretaryLogoutBtn');
    const userSection = document.getElementById('userSection');

    const allowedSecretaryUids = ['IPeJrbYsfQcQUrbLiQ4qn0Ud02S2', 'uTC7qw2rltgm6eteCYcSo3jsARq2'];
    const driveFolderLinks = [
        { name: 'Carpeta de Ancianos', url: 'https://drive.google.com/drive/folders/1LF_5qFBJYM_z1EV4zL5zXivh1jW5Racb?usp=drive_link' },
        { name: 'Carpeta de Prec.Regulares', url: 'https://drive.google.com/drive/folders/1TiagEoM_zxJOeGoBH7VVia7Zu77wxwD1?usp=drive_link' },
        { name: 'Carpeta de Varones Bautizados', url: 'https://drive.google.com/drive/folders/1aiCZl8dHmccWMr1wD0o41SDkSEyzAquw?usp=drive_link' },
        { name: 'Carpeta de Hermanas Bautizadas', url: 'https://drive.google.com/drive/folders/1fotW8-m5_xgMHFPtt9ch3pyuZhYrDXSr?usp=drive_link' },
        { name: 'Carpeta de Pubs. No Bautizados', url: 'https://drive.google.com/drive/folders/1ge6qDWgQXGfWP5Dx07CVJ-e15BgHW_wl?usp=drive_link' },
        { name: 'Carpeta de Siervos Ministeriales', url: 'https://drive.google.com/drive/folders/1h9JDkj2Y6fro-I70QjDcX_68fhG77c3h?usp=drive_link' },
        { name: 'Carpeta de Publicadores Mudaron', url: 'https://drive.google.com/drive/folders/1_4N26VSPnD77j0txqHs-NhH4k_YT4n3J?usp=drive_link' },
        { name: 'Carpeta de Años Anteriores', url: 'https://drive.google.com/drive/folders/1OfI5YeIb5xkzBpfeYR7COm2wMwwysZA8?usp=drive_link' },
    ];
    
    // Configuración de Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyANSEcsrnbzVJ8i6-eOqv-pewPaeImdORg",
        authDomain: "pinones-congre.firebaseapp.com",
        databaseURL: "https://pinones-congre-default-rtdb.firebaseio.com",
        projectId: "pinones-congre",
        storageBucket: "pinones-congre.appspot.com",
        messagingSenderId: "1031984043314",
        appId: "1:1031984043314:web:49b38b2c60d69601d3732b",
        measurementId: "G-SR373KE6RX"
    };
    
    // Inicializar Firebase solo si no se ha inicializado antes
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Función para mostrar alertas
    function showAlert(message, type) {
        adminAlert.textContent = message;
        adminAlert.className = 'admin-alert';
        adminAlert.classList.add(`alert-${type}`);
        adminAlert.style.display = 'block';
        setTimeout(() => {
            adminAlert.style.display = 'none';
        }, 5000);
    }

    // Función para cerrar sesión del secretario
    function logoutSecretary() {
        secretaryLoginSection.style.display = 'block';
        secretaryContent.style.display = 'none';
        driveFoldersList.innerHTML = '';
    }

    // Función para mostrar carpetas de Drive embebidas
    function displayDriveFolders() {
        driveFolderLinks.forEach(folder => {
            const listItem = document.createElement('li');
            const folderName = document.createElement('h3');
            folderName.textContent = folder.name;
            
            const folderContainer = document.createElement('div');
            folderContainer.className = 'folder-container';
            
            // Extraer el ID de la carpeta de la URL
            const folderId = folder.url.match(/folders\/([^?]+)/)[1];
            
            // Crear iframe para incrustar la carpeta
            const iframe = document.createElement('iframe');
            iframe.src = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
            iframe.frameBorder = '0';
            iframe.width = '100%';
            iframe.height = '400';
            iframe.allow = 'autoplay';
            
            folderContainer.appendChild(folderName);
            folderContainer.appendChild(iframe);
            listItem.appendChild(folderContainer);
            driveFoldersList.appendChild(listItem);
        });
    }

    // Listener para cambios de autenticación
    auth.onAuthStateChanged(user => {
        console.log('Estado de autenticación cambiado:', user);
        
        // Por defecto, ocultar el contenido del secretario
        logoutSecretary();
        
        if (user) {
            console.log('Usuario autenticado:', user.email);
            
            // Actualizar la sección de usuario con la información
            userSection.innerHTML = `
                <div class="user-info">
                    <span>${user.email}</span>
                </div>
            `;

            // Verificar si es secretario pero no mostrar contenido todavía
            const isSecretary = allowedSecretaryUids.includes(user.uid);
            if (isSecretary) {
                console.log('Usuario tiene permisos de secretario');
            } else {
                console.log('Usuario no tiene permisos de secretario');
            }
        } else {
            console.log('No hay usuario autenticado');
            // Restaurar el botón de inicio de sesión cuando no hay usuario
            userSection.innerHTML = '';
        }
    });

    // Manejar el login del secretario
    secretaryLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('secretaryEmail').value;
        const password = document.getElementById('secretaryPassword').value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                if (allowedSecretaryUids.includes(user.uid)) {
                    // Mostrar contenido del secretario
                    secretaryLoginSection.style.display = 'none';
                    secretaryContent.style.display = 'block';
                    showAlert('Bienvenido, Secretario', 'success');
                    
                    // Mostrar las carpetas de Drive embebidas
                    displayDriveFolders();
                } else {
                    showAlert('No tienes permisos para acceder como secretario', 'error');
                    auth.signOut(); // Cerrar sesión si no tiene permisos
                }
            })
            .catch((error) => {
                showAlert('Error al iniciar sesión: ' + error.message, 'error');
            });
    });

    // Manejar el logout del secretario
    secretaryLogoutBtn.addEventListener('click', function() {
        auth.signOut()
            .then(() => {
                logoutSecretary();
                showAlert('Sesión de secretario cerrada correctamente', 'success');
            })
            .catch((error) => {
                showAlert('Error al cerrar sesión: ' + error.message, 'error');
            });
    });

    // Mostrar/ocultar contraseña
    document.querySelectorAll('.show-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
            this.innerHTML = input.type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    });

    // Manejar descargas (ejemplo)
    document.getElementById('downloadPdf').addEventListener('click', function() {
        showAlert('Generando informe PDF...', 'success');
    });

    document.getElementById('downloadExcel').addEventListener('click', function() {
        showAlert('Generando informe Excel...', 'success');
    });
});