// firebase-config.js
var firebaseConfig = {
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
  firebase.initializeApp(firebaseConfig);
  
  document.getElementById("reset-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Detener el envío del formulario

    // Obtener el correo electrónico ingresado por el usuario
    var emailAddress = document.getElementById("email").value;

    // Enviar el correo electrónico de restablecimiento de contraseña
    firebase.auth().sendPasswordResetEmail(emailAddress)
        .then(function() {
            // Mostrar una alerta de éxito con swal alert
            Swal.fire({
                title: "¡Correo enviado!",
                text: "Se ha enviado un correo electrónico de restablecimiento de contraseña a " + emailAddress + ". Revise su bandeja de spam si no lo encuentra en su bandeja de entrada.",
                icon: "success"
            });
        })
        .catch(function(error) {
            // Mostrar una alerta de error con swal alert
            Swal.fire({
                title: "¡Error!",
                text: "Ha ocurrido un error: " + error.message,
                icon: "error"
            });
        });
});
