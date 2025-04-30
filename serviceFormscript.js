// serviceFormscript.js
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
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Verificar que el script se carga
console.log('[serviceFormscript] Script cargado');

// Obtener el formulario y validar existencia
const serviceForm = document.getElementById('serviceForm');
if (!serviceForm) {
  console.error('[serviceFormscript] Formulario #serviceForm no encontrado');
} else {
  // Manejar cambio de rol para mostrar avisos
  const roleSelect = document.getElementById('role');
  const hoursInput = document.getElementById('hours');
  if (roleSelect && hoursInput) {
    roleSelect.addEventListener('change', () => {
      document.querySelectorAll('.role-notice').forEach(n => n.style.display = 'none');
      const noticeEl = document.getElementById(roleSelect.value + 'Notice');
      if (noticeEl) noticeEl.style.display = 'block';
      if (roleSelect.value === 'publisher') {
        hoursInput.disabled = true;
        hoursInput.value = '';
      } else {
        hoursInput.disabled = false;
      }
    });
  }

  // Enlazar evento submit
  serviceForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Recoger datos con FormData
    const fd = new FormData(serviceForm);
    const rawData = {};
    fd.forEach((value, key) => rawData[key] = value);
    console.log('[serviceFormscript] Datos crudos (FormData):', rawData);

    // Validación básica HTML5
    if (!serviceForm.checkValidity()) {
      console.warn('[serviceFormscript] Validación fallida HTML5');
      const invalidEls = Array.from(serviceForm.querySelectorAll(':invalid'));
      const errors = [...new Set(invalidEls.map(el => {
        const lbl = serviceForm.querySelector(`label[for=\"${el.id}\"]`);
        return lbl ? lbl.textContent.replace(':','').trim() : el.name || el.id;
      }))];
      Swal.fire({
        title: 'Campos incompletos',
        html: `Por favor complete:<br><ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>`,
        icon: 'error'
      });
      return;
    }

    // Validación condicional precursores
    const role = rawData['role'];
    const hoursVal = parseInt(rawData['hours']) || 0;
    if (['auxiliary', 'regular'].includes(role) && hoursVal <= 0) {
      console.warn('[serviceFormscript] Validación adicional: horas precursores <= 0');
      Swal.fire({
        title: 'Validación adicional',
        html: '<ul><li>Horas de servicio (deben ser mayores a 0)</li></ul>',
        icon: 'error'
      });
      return;
    }

    // Construir objeto final con la estructura deseada
    const formData = {
      nombre: (rawData['fullName'] || '').trim(),
      rol: role === 'regular' ? 'Precursor Regular' : 
           role === 'auxiliary' ? 'Precursor Auxiliar' : 'Publicador',
      horas: hoursVal,
      cursosBiblicos: parseInt(rawData['bibleCourses']) || 0,
      participo: rawData['participated'] === 'yes' ? 'Sí' : 'No',
      superintendente: (rawData['superintendent'] || '').trim(),
      notas: (rawData['notes'] || '').trim(),
      fechaEnvio: new Date().toLocaleString('es-ES') // Formato "31/3/2025 20:56:58"
    };
    console.log('[serviceFormscript] Datos procesados:', formData);

    // Generar un ID único o usar uno existente si lo tienes
    // En este ejemplo uso un ID aleatorio similar al que mostraste
    const userId = generateRandomId(); // Función que definiremos abajo
    
    // Guardar en Firebase bajo la estructura users/userId
    database.ref(`users/${userId}`).set(formData)
      .then(() => {
        console.log('[serviceFormscript] Envío a Firebase exitoso');
        Swal.fire({
          title: '¡Excelente trabajo!',
          text: 'Informe enviado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        .then(() => {
          serviceForm.reset();
          document.querySelectorAll('.role-notice').forEach(n => n.style.display = 'none');
        });
      })
      .catch(err => {
        console.error('[serviceFormscript] Error al enviar:', err);
        Swal.fire({
          title: 'Error',
          text: 'Error al enviar el informe: ' + err.message,
          icon: 'error'
        });
      });
  });
}

// Función para generar un ID aleatorio similar al ejemplo (OMjGyRBKx2CsDtRzNjm)
function generateRandomId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}