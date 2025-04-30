import { database } from './firebaseConfig.js';

// ==== Toast Notifications ====
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'error' ? 'times-circle' : 'check-circle'}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Fuerza reflow para activar la animación
  void toast.offsetWidth;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// ==== Confirmación Personalizada ====
function confirmAction(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmModal');
    const messageElement = document.getElementById('confirmMessage');
    const cancelBtn = document.getElementById('confirmCancel');
    const deleteBtn = document.getElementById('confirmDelete');

    messageElement.textContent = message;
    modal.style.display = 'flex';

    const cleanUp = () => {
      modal.style.display = 'none';
      cancelBtn.removeEventListener('click', onCancel);
      deleteBtn.removeEventListener('click', onDelete);
    };

    const onCancel = () => {
      resolve(false);
      cleanUp();
    };

    const onDelete = () => {
      resolve(true);
      cleanUp();
    };

    cancelBtn.addEventListener('click', onCancel);
    deleteBtn.addEventListener('click', onDelete);
  });
}

// Referencia a la colección de usuarios/informes
const usersRef = database.ref('users');

// Variables para filtros
let allUsers = [];
let uniqueGroups = new Set();

// DOM
const informesList = document.getElementById('informesList');
const statsContainer = document.getElementById('summaryStats');
const groupFilter = document.getElementById('groupFilter');
const searchInput = document.getElementById('searchInput');
const roleFilter = document.getElementById('roleFilter');

// Modal edición
const editModal = document.getElementById('editReportModal');
const editForm = document.getElementById('editReportForm');

let currentEditId = null;

// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
  cargarInformes();
  configurarFiltros();
});

/**
 * Lee datos en tiempo real y renderiza
 */
function cargarInformes() {
  showLoading();
  usersRef.on('value', snapshot => {
    const users = snapshot.val() || {};
    allUsers = [];
    uniqueGroups.clear();
    ocultarLoading();

    if (Object.keys(users).length === 0) {
      mostrarEstadoVacio('No se encontraron registros de informes');
      statsContainer.innerHTML = '';
      informesList.innerHTML = '';
      return;
    }

    Object.entries(users).forEach(([id, user]) => {
      user.id = id;
      allUsers.push(user);
      if (user.superintendente) uniqueGroups.add(user.superintendente);
    });

    actualizarFiltros();
    aplicarFiltros();
  }, error => {
    console.error('Error al cargar datos:', error);
    mostrarError('Error al cargar datos: ' + error.message);
    ocultarLoading();
  });
}

/**
 * Configura eventos de filtro
 */
function configurarFiltros() {
  searchInput.addEventListener('input', aplicarFiltros);
  groupFilter.addEventListener('change', aplicarFiltros);
  roleFilter.addEventListener('change', aplicarFiltros);
}

/**
 * Filtra, muestra estadísticas y renderiza informes
 */
function aplicarFiltros() {
  const term = searchInput.value.toLowerCase();
  const group = groupFilter.value;
  const role = roleFilter.value;

  const filtered = allUsers.filter(u => {
    const matchName = u.nombre?.toLowerCase().includes(term);
    const matchGroup = !group || u.superintendente === group;
    const matchRole = !role || u.rol === role;
    return matchName && matchGroup && matchRole;
  });

  mostrarEstadisticas(filtered);
  renderizarInformes(filtered);
}

/**
 * Actualiza opciones de grupo
 */
function actualizarFiltros() {
  groupFilter.innerHTML = '<option value="">Todos los grupos</option>';
  uniqueGroups.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    groupFilter.appendChild(opt);
  });
}

/**
 * Muestra estadísticas
 */
function mostrarEstadisticas(users) {
  const totalHoras = users.reduce((s, u) => s + (parseFloat(u.horas) || 0), 0);
  const totalCursos = users.reduce((s, u) => s + (parseInt(u.cursosBiblicos) || 0), 0);
  const totalPublic = users.length;
  const totalPrecursor = users.filter(u => ['Precursor Auxiliar', 'Precursor Regular'].includes(u.rol)).length;

  statsContainer.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon"><i class="fas fa-user-friends"></i></div>
      <div class="stat-value">${totalPublic}</div>
      <div class="stat-label">Publicadores</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon"><i class="fas fa-clock"></i></div>
      <div class="stat-value">${totalHoras}</div>
      <div class="stat-label">Horas</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon"><i class="fas fa-book-open"></i></div>
      <div class="stat-value">${totalCursos}</div>
      <div class="stat-label">Cursos</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon"><i class="fas fa-award"></i></div>
      <div class="stat-value">${totalPrecursor}</div>
      <div class="stat-label">Precursores</div>
    </div>
  `;
}

/**
 * Renderiza tarjetas de informes con editar y borrar
 */
function renderizarInformes(users) {
  informesList.innerHTML = '';
  if (!users.length) {
    mostrarEstadoVacio('No hay informes con los filtros aplicados');
    return;
  }
  users.forEach(u => {
    const card = document.createElement('div');
    card.className = 'informe-card';
    const roleClass = u.rol === 'Precursor Regular' ? 'success' : u.rol === 'Precursor Auxiliar' ? 'warning' : 'primary';
    const fecha = u.fechaEnvio || 'Sin fecha';
    const notas = u.notas || 'Sin notas';

    card.innerHTML = `
      <div class="informe-header">
        <h3>${u.nombre || 'Sin nombre'}</h3>
        <div class="informe-subtitle">
          <span>${fecha}</span>
          <span class="badge ${roleClass}">${u.rol || 'Publicador'}</span>
        </div>
      </div>
      <div class="informe-body">
        <div class="informe-stats">
          <div class="stat-item"><span><i class="fas fa-clock"></i> Horas</span><span>${u.horas || 0}</span></div>
          <div class="stat-item"><span><i class="fas fa-book-reader"></i> Cursos</span><span>${u.cursosBiblicos || 0}</span></div>
          <div class="stat-item"><span><i class="fas fa-users"></i> Grupo</span><span>${u.superintendente || 'No asignado'}</span></div>
        </div>
        <div class="notas-section">
          <div><i class="fas fa-sticky-note"></i> Notas</div>
          <div class="notas-content">${notas}</div>
        </div>
        <div class="action-buttons">
          <button class="edit-btn"><i class="fas fa-edit"></i> Editar</button>
          <button class="delete-btn"><i class="fas fa-trash-alt"></i> Borrar</button>
        </div>
      </div>
    `;

    // Editar
    card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(u));
    
    // Borrar (usando confirmación personalizada)
    card.querySelector('.delete-btn').addEventListener('click', async () => {
      const confirmed = await confirmAction('¿Eliminar este informe permanentemente?');
      if (confirmed) {
        try {
          await usersRef.child(u.id).remove();
          showToast('Informe eliminado correctamente', 'success');
          cargarInformes();
        } catch (err) {
          console.error('Error eliminando:', err);
          showToast(`Error al eliminar: ${err.message}`, 'error');
        }
      }
    });

    informesList.appendChild(card);
  });
}

/**
 * Abre modal y carga datos
 */
function openEditModal(data) {
  currentEditId = data.id;
  editModal.style.display = 'block';
  
  // Configurar opciones del grupo
  const groupSelect = editForm['editGroup'];
  groupSelect.innerHTML = `
    <option value="" disabled selected>Seleccione una opción</option>
    <option value="Alfonso.P Grupo 1">Alfonso.P Grupo 1</option>
    <option value="Rafael.G Grupo 2">Rafael.G Grupo 2</option>
    <option value="Alberto.G Grupo 3">Alberto.G Grupo 3</option>
    <option value="Josue.G Grupo 4">Josue.T Grupo 4</option>
    <option value="David.N Grupo 5">David.N Grupo 5</option>
  `;
  
  // Establecer valores (AGREGAMOS EL NOMBRE)
  editForm['editName'].value = data.nombre || '';
  editForm['editHours'].value = data.horas || '';
  editForm['editStudies'].value = data.cursosBiblicos || '';
  groupSelect.value = data.superintendente || '';
  editForm['editRole'].value = data.rol || '';
  editForm['editDate'].value = data.fechaEnvio || '';
  editForm['editObservations'].value = data.notas || '';
}

// Manejo del form (ACTUALIZADO CON EL NOMBRE)
editForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentEditId) return;
  const updates = {
    nombre: editForm['editName'].value, // Nuevo campo
    horas: parseFloat(editForm['editHours'].value),
    cursosBiblicos: parseInt(editForm['editStudies'].value, 10),
    superintendente: editForm['editGroup'].value,
    rol: editForm['editRole'].value,
    fechaEnvio: editForm['editDate'].value,
    notas: editForm['editObservations'].value
  };
  try {
    await usersRef.child(currentEditId).update(updates);
    showToast('Cambios guardados exitosamente', 'success');
    editModal.style.display = 'none';
    currentEditId = null;
    cargarInformes();
  } catch (err) {
    console.error('Error al guardar:', err);
    showToast('Error al guardar: ' + err.message, 'error');
  }
});

// Cerrar modal al cancelar o clic fuera
editModal.querySelector('.close-modal').addEventListener('click', () => {
  editModal.style.display = 'none';
  currentEditId = null;
});
window.addEventListener('click', e => {
  if (e.target === editModal) {
    editModal.style.display = 'none';
    currentEditId = null;
  }
});

// Utilidades de UI
function mostrarError(mensaje) {
  showToast(mensaje, 'error');
}

function mostrarEstadoVacio(mensaje) {
  informesList.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-folder-open"></i>
      <h3>${mensaje}</h3>
      <p>Prueba ajustando los filtros</p>
    </div>
  `;
}

function showLoading() {
  const loader = document.querySelector('.loading-screen');
  if (loader) loader.style.display = 'flex';
}

function ocultarLoading() {
  const loader = document.querySelector('.loading-screen');
  if (loader) loader.style.display = 'none';
}