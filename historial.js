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

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

let selectedFiles = [];
let currentUser = null;
let storageFiles = [];

document.addEventListener('DOMContentLoaded', function () {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const uploadFilesBtn = document.getElementById('uploadFiles');
    const fileListContainer = document.getElementById('fileListContainer');
    const fileList = document.getElementById('fileList');
    const historialAlert = document.getElementById('historialAlert');
    const refreshStorageBtn = document.getElementById('refreshStorage');
    const storageFileList = document.getElementById('storageFileList');
    const storageLoading = document.getElementById('storageLoading');
    const storageEmpty = document.getElementById('storageEmpty');

    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            loadStorageFiles();
        } else {
            window.location.href = '/index.html';
        }
    });

    refreshStorageBtn.addEventListener('click', loadStorageFiles);

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });

    uploadFilesBtn.addEventListener('click', uploadFiles);

    async function loadStorageFiles() {
        try {
            storageLoading.style.display = 'flex';
            storageFileList.innerHTML = '';
            storageEmpty.style.display = 'none';

            const rootRef = storage.ref('informes');
            const result = await listAllRecursive(rootRef);

            storageFiles = [];

            for (const item of result) {
                const metadata = await item.getMetadata();
                storageFiles.push({
                    name: item.name,
                    fullPath: item.fullPath,
                    size: metadata.size,
                    timeCreated: metadata.timeCreated,
                    contentType: metadata.contentType
                });
            }

            if (storageFiles.length === 0) {
                storageEmpty.style.display = 'block';
            } else {
                storageFiles.forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'storage-file-item';

                    const fileInfoDiv = document.createElement('div'); 
                    fileInfoDiv.className = 'storage-file-info';

                    const fileIcon = document.createElement('i');
                    fileIcon.className = 'storage-file-icon fas fa-file-excel';

                    const fileName = document.createElement('span');
                    fileName.className = 'storage-file-name';
                    fileName.textContent = file.name;

                    const filePath = document.createElement('span');
                    filePath.className = 'storage-file-path';
                    filePath.textContent = file.fullPath;

                    const fileSize = document.createElement('span');
                    fileSize.className = 'storage-file-size';
                    fileSize.textContent = formatFileSize(file.size);

                    const fileActions = document.createElement('div');
                    fileActions.className = 'storage-file-actions';

                    const downloadBtn = document.createElement('button');
                    downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
                    downloadBtn.title = 'Descargar';
                    downloadBtn.addEventListener('click', () => downloadFile(file.fullPath, file.name));

                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                    deleteBtn.title = 'Eliminar';
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.addEventListener('click', () => deleteFile(file.fullPath));

                    fileActions.appendChild(downloadBtn);
                    fileActions.appendChild(deleteBtn);

                    fileInfoDiv.appendChild(fileIcon);
                    fileInfoDiv.appendChild(fileName);
                    fileInfoDiv.appendChild(filePath);

                    fileItem.appendChild(fileInfoDiv);
                    fileItem.appendChild(fileSize);
                    fileItem.appendChild(fileActions);

                    storageFileList.appendChild(fileItem);
                });
            }

        } catch (error) {
            console.error('Error al cargar archivos:', error);
            showAlert(`Error al cargar archivos: ${error.message}`, 'error');
        } finally {
            storageLoading.style.display = 'none';
        }
    }

    async function listAllRecursive(ref) {
        const result = await ref.listAll();
        let items = [...result.items];
        for (const folderRef of result.prefixes) {
            const subItems = await listAllRecursive(folderRef);
            items = items.concat(subItems);
        }
        return items;
    }

    async function deleteFile(filePath) {
        try {
            const confirmed = await showDeleteConfirmation(filePath.split('/').pop());
            if (!confirmed) return;

            const fileRef = storage.ref(filePath);
            await fileRef.delete();

            await db.collection('historial').add({
                fecha: firebase.firestore.FieldValue.serverTimestamp(),
                usuario: currentUser.email,
                actividad: 'fileDelete',
                detalles: {
                    nombreArchivo: filePath.split('/').pop(),
                    ruta: filePath
                }
            });

            showAlert('Archivo eliminado correctamente', 'success');
            loadStorageFiles();
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            showAlert(`Error al eliminar archivo: ${error.message}`, 'error');
        }
    }

    function showDeleteConfirmation(fileName) {
        return new Promise((resolve) => {
            const deleteModal = document.getElementById('deleteModal');
            const confirmBtn = document.querySelector('.confirm-delete');
            const cancelBtn = document.querySelector('.cancel-delete');
            const closeBtn = document.querySelector('.close-delete-modal');
            const fileNameConfirm = document.querySelector('.file-name-confirm');

            fileNameConfirm.textContent = fileName;
            deleteModal.classList.add('active');

            const cleanUp = () => {
                deleteModal.classList.remove('active');
                confirmBtn.removeEventListener('click', confirmHandler);
                cancelBtn.removeEventListener('click', cancelHandler);
                closeBtn.removeEventListener('click', cancelHandler);
                deleteModal.removeEventListener('click', outsideClick);
            };

            const confirmHandler = () => {
                cleanUp();
                resolve(true);
            };

            const cancelHandler = () => {
                cleanUp();
                resolve(false);
            };

            const outsideClick = (e) => {
                if (e.target === deleteModal) {
                    cancelHandler();
                }
            };

            confirmBtn.addEventListener('click', confirmHandler);
            cancelBtn.addEventListener('click', cancelHandler);
            closeBtn.addEventListener('click', cancelHandler);
            deleteModal.addEventListener('click', outsideClick);
        });
    }

    function handleFiles(files) {
        selectedFiles = Array.from(files).filter(file => {
            const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            return validTypes.includes(file.type) || file.name.endsWith('.xls') || file.name.endsWith('.xlsx');
        });

        if (selectedFiles.length === 0) {
            fileInfo.textContent = 'No se han seleccionado archivos Excel válidos';
            uploadFilesBtn.disabled = true;
            fileListContainer.style.display = 'none';
            return;
        }

        fileInfo.textContent = `${selectedFiles.length} archivo(s) seleccionado(s)`;
        uploadFilesBtn.disabled = false;

        fileList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';

            const fileName = document.createElement('div');
            fileName.className = 'file-name';
            fileName.textContent = file.name;

            const fileSize = document.createElement('div');
            fileSize.className = 'file-size';
            fileSize.textContent = formatFileSize(file.size);

            const fileActions = document.createElement('div');
            fileActions.className = 'file-actions';

            const removeIcon = document.createElement('i');
            removeIcon.className = 'fas fa-times';
            removeIcon.title = 'Eliminar archivo';
            removeIcon.addEventListener('click', () => removeFile(index));

            fileActions.appendChild(removeIcon);
            fileItem.appendChild(fileName);
            fileItem.appendChild(fileSize);
            fileItem.appendChild(fileActions);

            fileList.appendChild(fileItem);
        });

        fileListContainer.style.display = 'block';
    }

    function removeFile(index) {
        selectedFiles.splice(index, 1);
        handleFiles(selectedFiles);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    }

    async function uploadFiles() {
        if (selectedFiles.length === 0 || !currentUser) return;

        uploadFilesBtn.disabled = true;
        uploadFilesBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo...';

        try {
            const now = new Date();
            const folderName = `informes/${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            for (const file of selectedFiles) {
                const fileRef = storage.ref(`${folderName}/${file.name}`);
                await fileRef.put(file);
            }

            showAlert('Archivo(s) subido(s) correctamente', 'success');
            loadStorageFiles();

        } catch (error) {
            console.error('Error al subir archivo:', error);
            showAlert(`Error al subir archivo: ${error.message}`, 'error');
        } finally {
            uploadFilesBtn.disabled = false;
            uploadFilesBtn.innerHTML = 'Subir Archivos';
        }
    }

    function showAlert(message, type) {
        historialAlert.textContent = message;
        historialAlert.className = `alert ${type}`;
        historialAlert.style.display = 'block';
        setTimeout(() => {
            historialAlert.style.display = 'none';
        }, 4000);
    }

    async function downloadFile(filePath, fileName) {
        try {
            const fileRef = storage.ref(filePath);
            const url = await fileRef.getDownloadURL();
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
            }
            const blob = await response.blob();
            
            const objectUrl = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(objectUrl);
            
        } catch (error) {
            console.error('Error al descargar archivo:', error);
            showAlert(`Error al descargar archivo: ${error.message}`, 'error');
        }
    }
});
