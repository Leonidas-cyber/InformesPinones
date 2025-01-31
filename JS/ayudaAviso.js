document.addEventListener('DOMContentLoaded', function () {
    // Inicializar tooltips con Tippy.js
    tippy('[data-tippy-content]', {
        placement: 'top',
        animation: 'shift-toward',
        // theme: 'retro',
        arrow: true
    });

    // Mostrar alerta inicial
    Swal.fire({
        title: '¿Necesita ayuda para enviar su informe?',
        showCancelButton: true,
        confirmButtonText: 'Necesito ayuda',
        cancelButtonText: 'Tengo la información',
        cancelButtonColor: '#3085d6',
        confirmButtonColor: '#d33',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'indexpasoapaso.html'; // Redirige si se selecciona 'Necesito ayuda'
        } else {
            // No hacer nada o redirigir a otra página si se desea
        }
    });
});

// Función para actualizar la participación
function setParticipacion(value) {
    document.getElementById('participacion').value = value;
}

// Validar formulario antes de enviarlo
function validateForm(event) {
    const participacion = document.getElementById('participacion').value;
    if (participacion === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, seleccione si participó en la predicación durante el mes.'
        });
        event.preventDefault(); // Evitar el envío del formulario
    }
}