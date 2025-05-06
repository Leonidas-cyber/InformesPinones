// Inicio de Configuración de Firebase (misma configuración)
const firebaseConfig = {
    apiKey: "AIzaSyD9HTmOwCx8y-oJ0VV-zaoYBgQYLAfkmWU",
    authDomain: "pinones-congre.firebaseapp.com",
    databaseURL: "https://pinones-congre-default-rtdb.firebaseio.com/",
    projectId: "pinones-congre",
    storageBucket: "pinones-congre.appspot.com",
    messagingSenderId: "1031984043314",
    appId: "1:1031984043314:web:49b38b2c60d69601d3732b",
    measurementId: "G-SR373KE6RX"
  };
  
  // Inicializa Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Obtiene una referencia a la base de datos de Realtime
  var db = firebase.database().ref("users");
  
  // Función para mostrar/ocultar avisos según el rol seleccionado
  function toggleRoleNotices() {
    const role = document.getElementById('role').value;
    
    // Oculta todos los avisos primero
    document.getElementById('publisherNotice').style.display = 'none';
    document.getElementById('auxiliaryNotice').style.display = 'none';
    document.getElementById('regularNotice').style.display = 'none';
    
    // Muestra el aviso correspondiente al rol seleccionado
    if (role === 'publisher') {
      document.getElementById('publisherNotice').style.display = 'block';
      document.getElementById('hours').disabled = false; // Habilitar horas para editarlas
    } else if (role === 'auxiliary') {
      document.getElementById('auxiliaryNotice').style.display = 'block';
      document.getElementById('hours').disabled = false;
    } else if (role === 'regular') {
      document.getElementById('regularNotice').style.display = 'block';
      document.getElementById('hours').disabled = false;
    }
  }
  
  // Función para obtener la fecha y hora actual en formato legible
  function obtenerFechaActual() {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    var segundos = fecha.getSeconds();
  
    // Formatea la fecha y la hora como DD/MM/AAAA HH:MM:SS
    var fechaFormateada = dia + '/' + mes + '/' + anio + ' ' + hora + ':' + minutos + ':' + segundos;
    return fechaFormateada;
  }
  
  // Evento cuando el DOM está completamente cargado
  document.addEventListener('DOMContentLoaded', function() {
    // Configura el evento change para el selector de rol
    document.getElementById('role').addEventListener('change', toggleRoleNotices);
    
    // Configura el envío del formulario
    document.getElementById('serviceForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Captura los valores del formulario
      const fullName = document.getElementById('fullName').value;
      const role = document.getElementById('role').value;
      const hours = parseInt(document.getElementById('hours').value) || 0;
      const bibleCourses = parseInt(document.getElementById('bibleCourses').value) || 0;
      const participated = document.querySelector('input[name="participated"]:checked')?.value;
      const superintendent = document.getElementById('superintendent').value;
      const notes = document.getElementById('notes').value;
      
      // Validación básica
      if (!fullName || !role || isNaN(bibleCourses) || !participated || !superintendent) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor complete todos los campos requeridos',
          icon: 'error'
        });
        return;
      }
      
      // Validación específica por rol
      if ((role === 'auxiliary' || role === 'regular') && (isNaN(hours) || hours <= 0)) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor ingrese un número válido de horas',
          icon: 'error'
        });
        return;
      }
      
      // Validación de participación
      if (!participated) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor indique si participó o no',
          icon: 'error'
        });
        return;
      }
      
      // Crear objeto con los datos del informe
      const reporte = {
        nombre: fullName,
        rol: role,
        horas: hours,
        cursosBiblicos: bibleCourses,
        participo: participated === 'yes' ? 'Sí' : 'No',
        superintendente: superintendent,
        notas: notes,
        fechaEnvio: obtenerFechaActual()
      };
      
      // Mostrar confirmación antes de enviar
      Swal.fire({
        title: '¿Está seguro de que desea enviar el informe?',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Enviar datos a Firebase
          db.push(reporte)
            .then(function() {
              console.log("Datos del formulario guardados en Realtime Database");
              Swal.fire({
                title: '¡Buen trabajo!',
                text: 'Informe guardado correctamente',
                icon: 'success'
              }).then(() => {
                // Resetea el formulario después de enviarlo
                document.getElementById('serviceForm').reset();
                // Oculta todos los avisos de rol
                document.getElementById('publisherNotice').style.display = 'none';
                document.getElementById('auxiliaryNotice').style.display = 'none';
                document.getElementById('regularNotice').style.display = 'none';
              });
            })
            .catch(function(error) {
              console.error("Error al escribir los datos en Realtime Database: ", error);
              Swal.fire({
                title: '¡Oops!',
                text: 'Los datos no fueron guardados',
                icon: 'error'
              });
            });
        }
      });
    });
    
    // Inicialmente oculta todos los avisos de rol
    toggleRoleNotices();
  });