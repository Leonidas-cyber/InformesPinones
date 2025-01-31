  // Espera a que el documento esté listo
  document.addEventListener('DOMContentLoaded', function () {
    // Obtén el elemento select del rol
    var rolSelect = document.getElementById('rol');

    // Agrega un evento 'change' al select
    rolSelect.addEventListener('change', function () {
        // Obtiene el valor seleccionado
        var selectedValue = rolSelect.value;

        // Verifica si se seleccionó "Publicador"
        if (selectedValue === 'Publicador') {
            // Muestra el SweetAlert con formato HTML
            Swal.fire({
                title: 'Aviso',
                icon: 'warning',
                html: 'Has seleccionado la opción <strong>"Publicador"</strong>.<br><br>' +
                '<strong>1) Deberá indicar si participó de alguna manera en el ministerio durante el mes en la casilla.</strong><br>' +
                '<strong>2) El número de cursos bíblicos que dirigió; los demás campos se encuentran deshabilitados.</strong>',
                confirmButtonText: 'Aceptar'
            });
        }
    });
});