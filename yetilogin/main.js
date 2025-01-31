// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

  firebase.initializeApp(firebaseConfig);

  $(document).ready(function() {
    $("#submit-btn").click(function(event) {
      event.preventDefault(); // Detener la recarga automática del formulario

      const email = $('#loginEmail').val();
      const password = $('#loginPassword').val();

      // Validar el formato del correo electrónico
      if (!isValidEmail(email)) {
        // Mostrar mensaje de error con SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Formato de correo incorrecto',
          text: 'Por favor, ingrese un correo electrónico válido.'
        });
        return;
      }

      // Validar la longitud de la contraseña
      if (password.length < 8) {
        // Mostrar mensaje de error con SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Contraseña demasiado corta',
          text: 'La contraseña debe tener al menos 8 caracteres.'
        });
        return;
      }

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Inicio de sesión exitoso:', user);
          
          // Redirigir a otra página después del inicio de sesión
          window.location.href = '/cards.html';
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Error al iniciar sesión:', errorMessage);

          // Mostrar un mensaje de error genérico con SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: 'Tu correo o contraseña son incorrectos. Por favor, intenta de nuevo.'
          });
        });
    });
  });

  // Función para validar el formato del correo electrónico
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }