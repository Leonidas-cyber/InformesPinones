  // Función para actualizar el mes
  function actualizarMes() {
    // Obtiene la fecha actual
    var currentDate = new Date();
  
    // Obtiene el elemento del mes
    var monthElement = document.getElementById('current-month');
  
    // Obtiene el mes anterior (teniendo en cuenta que los meses comienzan desde 0)
    var previousMonth = currentDate.getMonth() - 1;
  
    // Si el mes actual es enero, ajusta el mes anterior a diciembre del año anterior
    if (previousMonth < 0) {
      previousMonth = 11; // diciembre es el mes 11
    }
  
    // Actualiza el contenido del elemento del mes
    monthElement.textContent = obtenerNombreDelMes(previousMonth + 1);
  }

  // Función para obtener el nombre del mes según su número
  function obtenerNombreDelMes(month) {
    var meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[month - 1];
  }

  // Actualiza el mes inicialmente
  actualizarMes();

  // Programa la actualización del mes cada 20 días (en milisegundos)
  setInterval(actualizarMes, 20 * 24 * 60 * 60 * 1000);