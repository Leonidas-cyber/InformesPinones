$(document).ready(function() {
    const config = {
        apiKey: "AIzaSyANSEcsrnbzVJ8i6-eOqv-pewPaeImdORg",
        authDomain: "pinones-congre.firebaseapp.com",
        databaseURL: "https://pinones-congre-default-rtdb.firebaseio.com",
        projectId: "pinones-congre",
        storageBucket: "pinones-congre.appspot.com",
        messagingSenderId: "1031984043314",
        appId: "1:1031984043314:web:49b38b2c60d69601d3732b",
        measurementId: "G-SR373KE6RX"
    };    
    firebase.initializeApp(firebaseConfig);

    // Referencia a la base de datos de Firebase
    var db = firebase.database();
    var coleccionInformes = db.ref().child("users");
    
    // Iconos para la edición y eliminación
    const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
    
    // Inicialización de DataTable
    $(document).ready(function() {
      var table = $('#tablaInformes').DataTable({
        responsive: true, // Hace que la tabla sea responsive
        pageLength: 6,
        lengthMenu: [[6, 12, 24, -1], [6, 12, 24, 'Todos']],
        columns: [
          { title: "ID", visible: false },
          { title: "Nombre" },
          { title: "Rol" },
          { title: "Participó" },
          { title: "Cursos Bíblicos" },
          { title: "Horas" },
          { title: "Superintendente" },
          { title: "Notas" },
          { title: "Fecha de Envío" },
          { title: "Acciones", width: "100px" }
        ]
      });
    
      // Escucha eventos de child_added en Firebase para actualizar la tabla
      coleccionInformes.on("child_added", function(datos) {
        var data = datos.val();
        var key = datos.key;
    
        table.row.add([
          key,
          data.nombre,
          data.rol,
          data.participo,
          data.cursosBiblicos,
          data.horas,
          data.superintendente,
          data.notas,
          data.fechaEnvio,
          `<button class='btnEditar btn btn-primary' data-key='${key}' title='Editar'>${iconoEditar}</button>
           <button class='btnBorrar btn btn-danger' data-key='${key}' title='Borrar'>${iconoBorrar}</button>`
        ]).draw();
      });
    
      // Abrir modal de edición al hacer clic en botón de editar
      $('#tablaInformes').on('click', '.btnEditar', function() {
        var key = $(this).data('key');
        cargarDatosEnModal(key);
      });
    
      // Eliminar registro al hacer clic en botón de eliminar
      $('#tablaInformes').on('click', '.btnBorrar', function() {
        var key = $(this).data('key');
        
        Swal.fire({
          title: '¿Está seguro de que desea eliminar este registro?',
          text: "¡Esta acción no se puede revertir!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            db.ref('users/' + key).remove()
              .then(function() {
                Swal.fire(
                  '¡Eliminado!',
                  'El registro ha sido eliminado correctamente.',
                  'success'
                ).then(function() {
                  location.reload(); // Recargar la página después de eliminar
                });
              })
              .catch(function(error) {
                console.error("Error al eliminar el registro: ", error);
                Swal.fire(
                  '¡Error!',
                  'Ocurrió un error al intentar eliminar el registro.',
                  'error'
                );
              });
          }
        });
      });
    
      // Función para cargar los datos en el modal de edición
      function cargarDatosEnModal(key) {
        var usuarioRef = db.ref('users/' + key);
    
        usuarioRef.once('value', function(snapshot) {
          var usuario = snapshot.val();
          $('#edit-nombre-completo').val(usuario.nombre);
          $('#edit-rol').val(usuario.rol);
          $('#edit-hours').val(usuario.horas);
          $('#edit-bibleCourse').val(usuario.cursosBiblicos);
          $('#edit-superintendente').val(usuario.superintendente);
          
          // Selecciona la opción correcta en el campo "Participó"
          $('#edit-participo').val(usuario.participo);
    
          $('#edit-key').val(key); // Guarda la clave del registro para identificarlo en la actualización
        });
    
        $('#editModal').modal('show'); // Muestra el modal de edición
      }
    
      // Envío del formulario del modal de edición
      $('#editForm').submit(function(event) {
        event.preventDefault();
    
        var key = $('#edit-key').val();
        var updates = {
          nombre: $('#edit-nombre-completo').val(),
          rol: $('#edit-rol').val(),
          horas: parseInt($('#edit-hours').val()),
          cursosBiblicos: parseInt($('#edit-bibleCourse').val()),
          superintendente: $('#edit-superintendente').val(),
          participo: $('#edit-participo').val()
          // Otros campos según sea necesario
        };
    
        db.ref('users/' + key).update(updates)
          .then(function() {
            $('#editModal').modal('hide');
            Swal.fire({
              title: '¡Éxito!',
              text: 'Los cambios han sido guardados correctamente.',
              icon: 'success'
            }).then(function() {
              // Recargar la página después de cerrar el mensaje de éxito
              location.reload();
            });
          })
          .catch(function(error) {
            console.error("Error al actualizar los datos: ", error);
            Swal.fire({
              title: '¡Oops!',
              text: 'Ha ocurrido un error al guardar los cambios.',
              icon: 'error'
            });
          });
      });
    
    });
    
    
});