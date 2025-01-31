  // Espera a que el documento esté listo
  document.addEventListener('DOMContentLoaded', function () {
    // Obtén el elemento select del rol
    var rolSelect = document.getElementById('rol');
    var hoursInput = document.getElementById('hours');

    // Agrega un evento 'change' al select
    rolSelect.addEventListener('change', function () {
      // Obtiene el valor seleccionado
      var selectedValue = rolSelect.value;

      if (selectedValue === 'Publicador') {
        // Deshabilita el campo de horas y establece su valor en 0
        hoursInput.disabled = true;
        hoursInput.value = 0;

        // Cambia el estilo del campo para indicar que está deshabilitado
        hoursInput.style.backgroundColor = '#e0e0e0';
        hoursInput.style.color = '#808080';
      } else {
        // Habilita el campo de horas y restablece su estilo y valor
        hoursInput.disabled = false;
        hoursInput.style.backgroundColor = '#fff';
        hoursInput.style.color = '#000';
        hoursInput.value = ''; // Puedes restablecer el valor si es necesario
      }
    });
  });
