// Historial.js - Funcionalidad para la página de historial
// Congregación Arrayanes

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const dateRangeSelect = document.getElementById('dateRange');
    const customDateRange = document.getElementById('customDateRange');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const activityTypeSelect = document.getElementById('activityType');
    const userFilterInput = document.getElementById('userFilter');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const exportBtn = document.getElementById('exportHistorial');
    const entriesPerPageSelect = document.getElementById('entriesPerPage');
    const historialTableBody = document.getElementById('historialTableBody');
    const noResultsDiv = document.getElementById('noResults');
    const loadingDiv = document.getElementById('historialLoading');
    const resultCountSpan = document.getElementById('resultCount');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbersDiv = document.getElementById('pageNumbers');
    const activityDetailModal = document.getElementById('activityDetailModal');
    const activityModalBody = document.getElementById('activityModalBody');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const historialAlert = document.getElementById('historialAlert');

    // Configuración Firebase (asume que ya está inicializado en script.js)
    let db;
    let currentUser = null;
    let isAdmin = false;

    // Variables de estado para la paginación y filtrado
    let currentPage = 1;
    let totalPages = 1;
    let itemsPerPage = 25;
    let sortField = 'fecha';
    let sortDirection = 'desc';
    let currentFilters = {
        dateRange: 'last30',
        startDate: null,
        endDate: null,
        activityType: 'all',
        userFilter: ''
    };

    // Datos de historial (simularemos datos para la demostración)
    let historialData = [];

    // Inicialización
    function init() {
        // Mostrar pantalla de carga
        document.querySelector('.loading-screen').style.display = 'flex';
        
        // Configurar eventos
        setupEventListeners();
        
        // Establecer fecha actual en inputs de fecha
        const today = new Date();
        endDateInput.valueAsDate = today;
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        startDateInput.valueAsDate = thirtyDaysAgo;
        
        // Cargar firebase
        initializeFirebase();
    }

    // Inicializar Firebase y verificar autenticación
    function initializeFirebase() {
        try {
            // Asumiendo que firebase ya está inicializado en script.js
            if (firebase.apps.length) {
                db = firebase.firestore();
                
                // Verificar autenticación actual
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        currentUser = user;
                        checkUserRole(user.uid);
                    } else {
                        showAlert('Debes iniciar sesión para acceder al historial', 'error');
                        setTimeout(() => {
                            window.location.href = './administracion.html';
                        }, 3000);
                    }
                });
            } else {
                console.error('Firebase no está inicializado');
                showAlert('Error al conectar con la base de datos', 'error');
            }
        } catch (error) {
            console.error('Error al inicializar Firebase:', error);
            showAlert('Error al conectar con la base de datos', 'error');
        } finally {
            // Ocultar pantalla de carga después de 1.5 segundos (para demo)
            setTimeout(() => {
                document.querySelector('.loading-screen').style.display = 'none';
                // Para la demostración, cargar datos simulados
                loadDemoData();
            }, 1500);
        }
    }

    // Verificar rol de usuario
    function checkUserRole(uid) {
        // Aquí se consultaría a la base de datos para verificar si el usuario es admin o secretario
        // Para la demo, asumiremos que el usuario tiene acceso
        isAdmin = true; // Simulado para la demo
        loadHistorialData();
    }

    // Cargar datos del historial
    function loadHistorialData() {
        showLoading(true);
        
        // Aquí iría la lógica para cargar datos reales de Firebase
        // Para la demo, usaremos datos simulados
        setTimeout(() => {
            applyFilters();
        }, 1000);
    }

    // Cargar datos de demostración
    function loadDemoData() {
        // Datos simulados para la demostración
        const activities = [
            'Inicio de sesión', 
            'Envío de informe', 
            'Descarga de informe', 
            'Modificación de datos',
            'Registro de publicador',
            'Actualización de dirección',
            'Cambio de privilegio',
            'Publicación de anuncio'
        ];
        
        const users = [
            'secretario@arrayanes.org',
            'anciano1@arrayanes.org',
            'anciano2@arrayanes.org',
            'coordinador@arrayanes.org',
            'publicador1@arrayanes.org'
        ];
        
        const details = [
            'Sesión iniciada correctamente',
            'Informe mensual enviado',
            'Descarga de informe en formato PDF',
            'Actualización de información personal',
            'Registro de nuevo publicador',
            'Cambio de dirección registrado',
            'Actualización de privilegio de servicio',
            'Anuncio publicado en cartelera digital'
        ];
        
        // Generar 100 registros aleatorios para demostración
        historialData = [];
        const now = new Date();
        
        for (let i = 0; i < 100; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() - Math.floor(Math.random() * 180)); // Hasta 6 meses atrás
            date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
            
            const activityIndex = Math.floor(Math.random() * activities.length);
            const userIndex = Math.floor(Math.random() * users.length);
            
            historialData.push({
                id: 'record-' + i,
                fecha: date,
                usuario: users[userIndex],
                actividad: activities[activityIndex],
                detalles: details[activityIndex],
                tipoActividad: mapActivityToType(activities[activityIndex]),
                datosCompletos: {
                    fecha: date,
                    usuario: users[userIndex],
                    actividad: activities[activityIndex],
                    detalles: details[activityIndex],
                    ip: '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
                    dispositivo: Math.random() > 0.5 ? 'Desktop - Chrome' : 'Mobile - Safari',
                    ubicacion: 'Buenos Aires, Argentina',
                    duracion: Math.floor(Math.random() * 120) + ' minutos'
                }
            });
        }
        
        // Ordenar por fecha (más reciente primero)
        historialData.sort((a, b) => b.fecha - a.fecha);
        
        // Aplicar filtros iniciales
        applyFilters();
    }
    
    // Mapear actividad a tipo para filtrado
    function mapActivityToType(activity) {
        if (activity.includes('sesión')) return 'login';
        if (activity.includes('informe')) return 'report';
        if (activity.includes('Descarga')) return 'download';
        if (activity.includes('Modificación') || activity.includes('Actualización') || 
            activity.includes('Cambio') || activity.includes('Registro')) return 'dataChange';
        if (activity.includes('Publicación') || activity.includes('Anuncio')) return 'publication';
        return 'other';
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Cambio en select de rango de fechas
        dateRangeSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDateRange.style.display = 'flex';
            } else {
                customDateRange.style.display = 'none';
                setDateRangeFromPreset(this.value);
            }
        });
        
        // Botón aplicar filtros
        applyFiltersBtn.addEventListener('click', function() {
            currentPage = 1;
            updateFiltersFromInputs();
            applyFilters();
        });
        
        // Botón restablecer filtros
        resetFiltersBtn.addEventListener('click', function() {
            resetFilters();
        });
        
        // Botón exportar
        exportBtn.addEventListener('click', function() {
            exportHistorial();
        });
        
        // Cambio en entradas por página
        entriesPerPageSelect.addEventListener('change', function() {
            itemsPerPage = parseInt(this.value);
            currentPage = 1;
            applyFilters();
        });
        
        // Botones de paginación
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderHistorialTable();
                updatePagination();
            }
        });
        
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                renderHistorialTable();
                updatePagination();
            }
        });
        
        // Encabezados de tabla ordenables
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', function() {
                const field = this.getAttribute('data-sort');
                if (sortField === field) {
                    // Cambiar dirección si ya estamos ordenando por este campo
                    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    // Nuevo campo de ordenamiento, establecer dirección por defecto
                    sortField = field;
                    sortDirection = 'asc';
                }
                
                // Actualizar UI de ordenamiento
                updateSortUI();
                
                // Reordenar y renderizar datos
                applyFilters();
            });
        });
        
        // Cerrar modales
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                activityDetailModal.classList.remove('active');
            });
        });
        
        // Clic fuera del modal para cerrar
        activityDetailModal.addEventListener('click', function(e) {
            if (e.target === activityDetailModal) {
                activityDetailModal.classList.remove('active');
            }
        });
    }
    
    // Actualizar UI para mostrar el campo de ordenamiento actual
    function updateSortUI() {
        // Limpiar clases de ordenamiento previas
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('sorting-asc', 'sorting-desc');
        });
        
        // Aplicar clase de ordenamiento al encabezado actual
        const currentHeader = document.querySelector(`.sortable[data-sort="${sortField}"]`);
        if (currentHeader) {
            currentHeader.classList.add(sortDirection === 'asc' ? 'sorting-asc' : 'sorting-desc');
        }
    }
    
    // Establecer rango de fechas desde preajuste
    function setDateRangeFromPreset(preset) {
        const today = new Date();
        let startDate = new Date();
        
        switch(preset) {
            case 'last7':
                startDate.setDate(today.getDate() - 7);
                break;
            case 'last30':
                startDate.setDate(today.getDate() - 30);
                break;
            case 'last90':
                startDate.setDate(today.getDate() - 90);
                break;
            case 'last180':
                startDate.setDate(today.getDate() - 180);
                break;
            case 'last365':
                startDate.setDate(today.getDate() - 365);
                break;
            default:
                startDate.setDate(today.getDate() - 30);
        }
        
        startDateInput.valueAsDate = startDate;
        endDateInput.valueAsDate = today;
    }
    
    // Actualizar filtros desde controles de entrada
    function updateFiltersFromInputs() {
        currentFilters.dateRange = dateRangeSelect.value;
        currentFilters.startDate = startDateInput.valueAsDate;
        currentFilters.endDate = endDateInput.valueAsDate;
        currentFilters.activityType = activityTypeSelect.value;
        currentFilters.userFilter = userFilterInput.value.trim().toLowerCase();
    }
    
    // Aplicar filtros a los datos
    function applyFilters() {
        showLoading(true);
        
        // Filtrar datos según criterios actuales
        let filteredData = [...historialData];
        
        // Filtrar por fecha
        if (currentFilters.startDate && currentFilters.endDate) {
            // Ajustar la fecha final para incluir todo el día
            let endDate = new Date(currentFilters.endDate);
            endDate.setHours(23, 59, 59, 999);
            
            filteredData = filteredData.filter(item => 
                item.fecha >= currentFilters.startDate && item.fecha <= endDate
            );
        }
        
        // Filtrar por tipo de actividad
        if (currentFilters.activityType !== 'all') {
            filteredData = filteredData.filter(item => 
                item.tipoActividad === currentFilters.activityType
            );
        }
        
        // Filtrar por usuario
        if (currentFilters.userFilter) {
            filteredData = filteredData.filter(item => 
                item.usuario.toLowerCase().includes(currentFilters.userFilter)
            );
        }
        
        // Ordenar datos
        filteredData.sort((a, b) => {
            let valA, valB;
            
            // Manejar diferentes tipos de campos
            if (sortField === 'fecha') {
                valA = a.fecha.getTime();
                valB = b.fecha.getTime();
            } else {
                valA = a[sortField];
                valB = b[sortField];
                
                // Ordenamiento sensible a cadenas
                if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }
            }
            
            // Aplicar dirección de ordenamiento
            if (sortDirection === 'asc') {
                return valA > valB ? 1 : -1;
            } else {
                return valA < valB ? 1 : -1;
            }
        });
        
        // Actualizar datos filtrados y renderizar
        calculatePagination(filteredData.length);
        renderHistorialTable(filteredData);
        updateResultCount(filteredData.length);
        
        // Ocultar carga
        setTimeout(() => {
            showLoading(false);
        }, 500);
    }
    
    // Calcular paginación
    function calculatePagination(totalItems) {
        totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        updatePagination();
    }
    
    // Actualizar UI de paginación
    function updatePagination() {
        // Actualizar estado de botones
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
        
        // Generar números de página
        pageNumbersDiv.innerHTML = '';
        
        // Determinar qué páginas mostrar (máximo 5)
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Agregar primera página y ellipsis si es necesario
        if (startPage > 1) {
            addPageNumber(1);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'page-ellipsis';
                pageNumbersDiv.appendChild(ellipsis);
            }
        }
        
        // Agregar páginas de rango calculado
        for (let i = startPage; i <= endPage; i++) {
            addPageNumber(i);
        }
        
        // Agregar última página y ellipsis si es necesario
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'page-ellipsis';
                pageNumbersDiv.appendChild(ellipsis);
            }
            addPageNumber(totalPages);
        }
    }
    
    // Agregar botón de número de página
    function addPageNumber(pageNum) {
        const pageBtn = document.createElement('div');
        pageBtn.className = 'page-number' + (pageNum === currentPage ? ' active' : '');
        pageBtn.textContent = pageNum;
        pageBtn.addEventListener('click', function() {
            if (pageNum !== currentPage) {
                currentPage = pageNum;
                renderHistorialTable();
                updatePagination();
            }
        });
        pageNumbersDiv.appendChild(pageBtn);
    }
    
    // Renderizar tabla de historial
    function renderHistorialTable(data = historialData) {
        historialTableBody.innerHTML = '';
        
        // Si no hay datos
        if (data.length === 0) {
            noResultsDiv.style.display = 'flex';
            return;
        }
        
        noResultsDiv.style.display = 'none';
        
        // Calcular índices de inicio y fin para la página actual
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, data.length);
        
        // Renderizar filas para la página actual
        for (let i = startIndex; i < endIndex; i++) {
            const item = data[i];
            const row = document.createElement('tr');
            
            // Formatear fecha
            const fechaFormateada = formatDate(item.fecha);
            
            row.innerHTML = `
                <td>${fechaFormateada}</td>
                <td>${item.usuario}</td>
                <td>${item.actividad}</td>
                <td>${item.detalles}</td>
                <td>
                    <button class="btn-detail" data-id="${item.id}">
                        <i class="fas fa-eye"></i> Ver detalles
                    </button>
                </td>
            `;
            
            historialTableBody.appendChild(row);
            
            // Agregar evento para ver detalles
            row.querySelector('.btn-detail').addEventListener('click', function() {
                showActivityDetails(item);
            });
        }
    }
    
    // Formatear fecha
    function formatDate(date) {
        return date.toLocaleString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Mostrar detalles de actividad
    function showActivityDetails(item) {
        // Llenar contenido del modal
        activityModalBody.innerHTML = `
            <div class="activity-detail-item">
                <h4>Fecha y Hora</h4>
                <div class="activity-detail-content">${formatDate(item.datosCompletos.fecha)}</div>
            </div>
            <div class="activity-detail-item">
                <h4>Usuario</h4>
                <div class="activity-detail-content">${item.datosCompletos.usuario}</div>
            </div>
            <div class="activity-detail-item">
                <h4>Actividad</h4>
                <div class="activity-detail-content">${item.datosCompletos.actividad}</div>
            </div>
            <div class="activity-detail-item">
                <h4>Detalles</h4>
                <div class="activity-detail-content">${item.datosCompletos.detalles}</div>
            </div>
            <div class="activity-detail-item">
                <h4>Dirección IP</h4>
                <div class="activity-detail-content">${item.datosCompletos.ip}</div>
            </div>
            <div class="activity-detail-item">
                <h4>Dispositivo</h4>
                <div class="activity-detail-content">${item.datosCompletos.dispositivo}</div>
            </div>
            <div class="activity-detail-item">
                <h4>Ubicación</h4>
                <div class="activity-detail-content">${item.datosCompletos.ubicacion}</div>
            </div>
            <div class="activity-detail-item">
                <h4>Duración</h4>
                <div class="activity-detail-content">${item.datosCompletos.duracion}</div>
            </div>
        `;
        
        // Mostrar modal
        activityDetailModal.classList.add('active');
    }
    
    // Actualizar contador de resultados
    function updateResultCount(count) {
        resultCountSpan.textContent = `(${count})`;
    }
    
    // Mostrar/ocultar indicador de carga
    function showLoading(show) {
        if (show) {
            loadingDiv.style.display = 'flex';
            historialTableBody.style.opacity = '0.5';
        } else {
            loadingDiv.style.display = 'none';
            historialTableBody.style.opacity = '1';
        }
    }
    
    // Restablecer filtros
    function resetFilters() {
        // Restablecer controles
        dateRangeSelect.value = 'last30';
        customDateRange.style.display = 'none';
        setDateRangeFromPreset('last30');
        activityTypeSelect.value = 'all';
        userFilterInput.value = '';
        
        // Restablecer variables de estado
        currentPage = 1;
        sortField = 'fecha';
        sortDirection = 'desc';
        currentFilters = {
            dateRange: 'last30',
            startDate: startDateInput.valueAsDate,
            endDate: endDateInput.valueAsDate,
            activityType: 'all',
            userFilter: ''
        };
        
        // Actualizar UI de ordenamiento
        updateSortUI();
        
        // Volver a aplicar filtros
        applyFilters();
    }
    
    // Exportar historial
    function exportHistorial() {
        showAlert('Preparando descarga...', 'info');
        
        // Simular delay de procesamiento
        setTimeout(() => {
            // Lógica para exportar los datos (demo)
            const now = new Date();
            const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
            const filename = `historial_arrayanes_${timestamp}.csv`;
            
            // En un caso real, se generaría realmente el archivo
            showAlert(`El archivo ${filename} se ha descargado correctamente`, 'success');
        }, 1500);
    }
    
    // Mostrar alerta
    function showAlert(message, type = 'info') {
        historialAlert.className = 'admin-alert';
        historialAlert.classList.add(`alert-${type}`);
        historialAlert.innerHTML = `
            <div class="alert-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="alert-message">${message}</div>
        `;
        historialAlert.style.display = 'flex';
        
        // Auto-ocultar después de unos segundos
        setTimeout(() => {
            historialAlert.style.display = 'none';
        }, 5000);
    }
    
    // Iniciar
    init();
});