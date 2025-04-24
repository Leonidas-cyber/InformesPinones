// firebaseConfig.js
// Configuración de Firebase
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

// Inicialización única de Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exporta los servicios necesarios
export const auth = firebase.auth();
export const database = firebase.database();  // <- Esta es la exportación que necesitas
