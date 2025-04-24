document.addEventListener('DOMContentLoaded', function() {
    // ==================== ELEMENTOS DEL DOM ====================
    const elements = {
        adminAlert: document.getElementById('adminAlert'),
        secretaryLoginSection: document.getElementById('secretaryLoginSection'),
        secretaryContent: document.getElementById('secretaryContent'),
        driveFoldersList: document.getElementById('driveFoldersList'),
        secretaryLoginForm: document.getElementById('secretaryLoginForm'),
        secretaryLogoutBtn: document.getElementById('secretaryLogoutBtn'),
        userSection: document.getElementById('userSection'),
        downloadPdf: document.getElementById('downloadPdf'),
        downloadExcel: document.getElementById('downloadExcel')
    };

    // ==================== VALIDACIÓN INICIAL ====================
    if (!elements.driveFoldersList || !elements.secretaryLoginForm || !elements.userSection) {
        console.error("Elementos críticos faltantes:", {
            driveFoldersList: !!elements.driveFoldersList,
            secretaryLoginForm: !!elements.secretaryLoginForm,
            userSection: !!elements.userSection
        });
        return;
    }

    // ==================== CONFIGURACIÓN ====================
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

    // ==================== FIREBASE ====================
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

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const auth = firebase.auth();
    const db = firebase.firestore();

    // ==================== FUNCIONES ====================
    function showAlert(message, type) {
        if (elements.adminAlert) {
            elements.adminAlert.textContent = message;
            elements.adminAlert.className = `admin-alert alert-${type}`;
            elements.adminAlert.style.display = 'block';
            setTimeout(() => elements.adminAlert.style.display = 'none', 5000);
        }
    }

    function logoutSecretary() {
        if (elements.secretaryLoginSection) elements.secretaryLoginSection.style.display = 'block';
        if (elements.secretaryContent) elements.secretaryContent.style.display = 'none';
        if (elements.driveFoldersList) elements.driveFoldersList.innerHTML = '';
    }

    function displayDriveFolders() {
        elements.driveFoldersList.innerHTML = ''; // Limpiar lista primero
        
        driveFolderLinks.forEach(folder => {
            try {
                const folderId = folder.url.match(/folders\/([^?]+)/)[1];
                const listItem = document.createElement('li');
                
                listItem.innerHTML = `
                    <div class="folder-container">
                        <h3>${folder.name}</h3>
                        <iframe src="https://drive.google.com/embeddedfolderview?id=${folderId}#list"
                                frameborder="0"
                                width="100%"
                                height="400"
                                allow="autoplay">
                        </iframe>
                    </div>
                `;
                
                elements.driveFoldersList.appendChild(listItem);
            } catch (error) {
                console.error(`Error procesando carpeta ${folder.name}:`, error);
            }
        });
    }

    // ==================== EVENTOS ====================
    auth.onAuthStateChanged(user => {
        logoutSecretary();
        
        if (user) {
            // Actualizar sección de usuario
            elements.userSection.innerHTML = user.email 
                ? `<div class="user-info"><span>${user.email}</span></div>`
                : '';
            
            // Verificar permisos
            if (allowedSecretaryUids.includes(user.uid)) {
                console.log('Usuario autorizado como secretario');
            }
        } else {
            elements.userSection.innerHTML = '';
        }
    });

    elements.secretaryLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('secretaryEmail')?.value;
        const password = document.getElementById('secretaryPassword')?.value;
        
        if (!email || !password) {
            showAlert('Complete todos los campos', 'error');
            return;
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;
                
                if (allowedSecretaryUids.includes(user.uid)) {
                    elements.secretaryLoginSection.style.display = 'none';
                    elements.secretaryContent.style.display = 'block';
                    displayDriveFolders();
                    showAlert('Bienvenido, Secretario', 'success');
                } else {
                    showAlert('Acceso no autorizado', 'error');
                    auth.signOut();
                }
            })
            .catch(error => showAlert(`Error: ${error.message}`, 'error'));
    });

    elements.secretaryLogoutBtn?.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                logoutSecretary();
                showAlert('Sesión cerrada', 'success');
            })
            .catch(error => showAlert(`Error: ${error.message}`, 'error'));
    });

    // ==================== MISCELÁNEOS ====================
    document.querySelectorAll('.show-password').forEach(button => {
        button?.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input) {
                input.type = input.type === 'password' ? 'text' : 'password';
                this.innerHTML = input.type === 'password' 
                    ? '<i class="fas fa-eye"></i>' 
                    : '<i class="fas fa-eye-slash"></i>';
            }
        });
    });

    elements.downloadPdf?.addEventListener('click', () => showAlert('Generando PDF...', 'info'));
    elements.downloadExcel?.addEventListener('click', () => showAlert('Generando Excel...', 'info'));
});