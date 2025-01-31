eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('m 5={6:"7-8-9",a:"2-0.b.4",c:"2-0",e:"2-0.g.4",h:"3",i:"1:3:j:k",l:"f-d"};',23,23,'congre||pinones|1031984043314|com|firebaseConfig|apiKey|AIzaSyD9HTmOwCx8y|oJ0VV|zaoYBgQYLAfkmWU|authDomain|firebaseapp|projectId|SR373KE6RX|storageBucket|G|appspot|messagingSenderId|appId|web|49b38b2c60d69601d3732b|measurementId|const'.split('|'),0,{}))

  firebase.initializeApp(firebaseConfig);

   // Verifica si el usuario ha iniciado sesión
   firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Si el usuario ha iniciado sesión, muestra su correo electrónico
      document.getElementById("usuario").innerHTML = user.email;
    }
  });
    
    function cerrarSesion() {
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location.href = "/yetilogin/indexyeti.html"; // Redirigir a la página de inicio de sesión
      }).catch(function(error) {
        // An error happened.
        console.log(error);
      });
    }
    

