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

    const loginForm = document.querySelector('#login-form');

    $(document).ready(function() {
        $("#login-form").validate({
          rules: {
            email: {
              required: true,
              email: true
            },
            password: {
              required: true
            }
          },
          messages: {
            email: {
              required: "Por favor ingrese su correo electrónico.",
              email: "Por favor ingrese un correo electrónico válido."
            },
            password: {
              required: "Por favor ingrese su contraseña.",
              minlength: 'La contraseña debe tener al menos 6 caracteres'
            }
          },
          submitHandler: function(form) {
            // Obtener los valores de los campos de correo electrónico y contraseña
            const email = loginForm['email'].value;
            const password = loginForm['password'].value;
      
            // Iniciar sesión con Firebase
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
              // Acceso exitoso, mostrar una alerta de Sweet Alert
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Inicio de Sesión Exitoso',
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {
                // Después de que el usuario haga clic en el botón de confirmación o después de que se cierre automáticamente, redirigir a la nueva página
                window.location.href = 'cards.html';
              });
            })
              .catch((error) => {
                // Error de inicio de sesión, mostrar un mensaje de error
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(`Error: ${errorCode} - ${errorMessage}`);
                Swal.fire(
                  'Oops...',
                  'email o contraseña incorrectos...vuelta a intentar',
                  'error'
                )
              });
          }
        });
      });
      
