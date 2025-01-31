//Inicio de Configuracion
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

// Agrega un controlador de eventos para el evento "submit" del formulario
$("#form-container").validate({
  rules: {
    "nombre-completo": "required",
    rol: {
      required: true
    },
    "numero-horas": {
      required: true,
      digits: true
    },
    cursoBiblicos: {
      required: true,
      digits: true
    },
    superintendente: "required",
    participacion: {
      required: true
    }
  },
  messages: {
    "nombre-completo": "Por favor, ingrese su nombre completo",
    rol: {
      required: "Por favor, ingrese su rol"
    },
    "numero-horas": {
      required: "Por favor, ingrese el número de horas",
      digits: "Por favor, ingrese solo números enteros"
    },
    cursoBiblicos: {
      required: "Por favor, ingrese el número de cursos bíblicos",
      digits: "Por favor, ingrese solo números enteros"
    },
    superintendente: "Por favor, ingrese el nombre de su superintendente",
    participacion: {
      required: "Por favor, seleccione si participó o no"
    }
  },
  highlight: function(element) {
    $(element).addClass("input-error");
  },
  unhighlight: function(element) {
    $(element).removeClass("input-error");
  },
  submitHandler: function(form) {
    // Captura los valores de cada campo del formulario y los almacena en un objeto JavaScript
    var reporte = {
      nombre: $("#nombre-completo").val(),
      rol: $("#rol").val(),
      horas: parseInt($("#hours").val()),
      cursosBiblicos: parseInt($("#bibleCourse").val()),
      participo: $("#participacion").val(),
      superintendente: $("#superintendente").val(),
      notas: $("#notes").val(),
      fechaEnvio: obtenerFechaActual() // Agrega la fecha y hora actual al objeto "reporte"
    };

    // Asegúrate de que se haya seleccionado una opción de participación
    if (!reporte.participo) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, seleccione sí participó o no',
        icon: 'error'
      });
      return false;
    }

    // Función para obtener la fecha y hora actual en formato legible
    function obtenerFechaActual() {
      var fecha = new Date();
      var dia = fecha.getDate();
      var mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, así que se agrega 1 al mes actual.
      var anio = fecha.getFullYear();
      var hora = fecha.getHours();
      var minutos = fecha.getMinutes();
      var segundos = fecha.getSeconds();

      // Formatea la fecha y la hora como desees, por ejemplo: DD/MM/AAAA HH:MM:SS
      var fechaFormateada = dia + '/' + mes + '/' + anio + ' ' + hora + ':' + minutos + ':' + segundos;
      return fechaFormateada;
    }

   // Muestra una alerta de confirmación antes de enviar
   Swal.fire({
    title: '¿Está seguro de que desea enviar el informe?',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar'
}).then((result) => {
    if (result.isConfirmed) {
        // Aquí va tu lógica para enviar los datos (por ejemplo, a Firebase)
        db.push(reporte)
            .then(function() {
                console.log("Datos del formulario guardados en Realtime Database");
                Swal.fire({
                    title: '¡Buen trabajo!',
                    text: 'Informe guardado correctamente',
                    icon: 'success'
                }).then(() => {
                    // Resetea el formulario después de enviarlo
                    document.getElementById('report-form').reset();
                    // Restablece la selección de los botones si es necesario
                    $(".yes, .no").removeClass("selected");
                    // Puedes recargar la página si lo necesitas
                    // location.reload();
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
}
});

// Función para establecer el valor del campo de participación
function setParticipacion(valor) {
  $("#participacion").val(valor ? 'Sí' : 'No');
  $(".yes, .no").removeClass("selected");
  if (valor) {
    $(".yes").addClass("selected");
  } else {
    $(".no").addClass("selected");
  }
}
