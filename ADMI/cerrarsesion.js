var firebaseConfig = {
    apiKey: "AIzaSyD9HTmOwCx8y-oJ0VV-zaoYBgQYLAfkmWU",
    authDomain: "pinones-congre.firebaseapp.com",
    projectId: "pinones-congre",
    storageBucket: "pinones-congre.appspot.com",
    messagingSenderId: "1031984043314",
    appId: "1:1031984043314:web:49b38b2c60d69601d3732b",
    measurementId: "G-SR373KE6RX"
  };

  firebase.initializeApp(firebaseConfig);

  // Agrega un listener al botón de cerrar sesión
  document.getElementById("cerrar-sesion").addEventListener("click", function() {
    firebase.auth().signOut().then(function() {
      // Redirige al usuario a la página de inicio de sesión
      window.location = "/cuenta.html";
    }).catch(function(error) {
      // Muestra un mensaje de error si no se pudo cerrar la sesión
      alert("Error al cerrar la sesión: " + error.message);
    });
  });