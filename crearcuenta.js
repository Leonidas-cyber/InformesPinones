$(document).ready(function() {
  var form = $('#registro-form');
  
  form.validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      email: {
        required: 'El correo electrónico es obligatorio',
        email: 'Por favor, ingrese un correo electrónico válido'
      },
      password: {
        required: 'La contraseña es obligatoria',
        minlength: 'La contraseña debe tener al menos 6 caracteres'
      }
    },
    submitHandler: function(form) {
      enviar(form);
    }
  });
});

// Inicializar Firebase
eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('t 5={8:"9-a-b",c:"0-2.d.3",e:"f://0-2-g-h.7.3",i:"0-2",k:"0-2.n.3",p:"4",q:"1:4:s:j",6:"r-o"};m.l(5);',30,30,'pinones||congre|com|1031984043314|firebaseConfig|measurementId|firebaseio|apiKey|AIzaSyANSEcsrnbzVJ8i6|eOqv|pewPaeImdORg|authDomain|firebaseapp|databaseURL|https|default|rtdb|projectId|49b38b2c60d69601d3732b|storageBucket|initializeApp|firebase|appspot|SR373KE6RX|messagingSenderId|appId|G|web|const'.split('|'),0,{}));

function enviar(form) {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      Swal.fire({
        icon: 'success',
        title: '¡Cuenta registrada con éxito!',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      form[0].resetForm(); // Vaciar los campos del formulario usando el método resetForm()
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}
