// Bloque de click derecho

function disableIE() {
    if (document.all) {
        return false;
    }
  }
  function disableNS(e) {
    if (document.layers || (document.getElementById && !document.all)) {
        if (e.which==2 || e.which==3) {
            return false;
        }
    }
  }
  if (document.layers) {
    document.captureEvents(Event.MOUSEDOWN);
    document.onmousedown = disableNS;
  } 
  else {
    document.onmouseup = disableNS;
    document.oncontextmenu = disableIE;
  }
  document.oncontextmenu=new Function("return false");
 
 //Este script permite deshabilitar:
 // El F5 y F11
 // El Ctrl + F5
 //  Ctrl + U, CTRL+C, CTRL+P
 // El Ctrl + R
 // El Ctrl + [<-] y el Ctrl + [->]
 // El Backspace fuera de los formularios.
 //  
 //Tener en cuenta que utiliza los eventos: 
 // onkeydown y onkeyup 
 
 //begin desabilitar teclas
 
 var controlprecionado = 0;
 var altprecionado = 0;
 function desactivarCrlAlt(teclaactual){
    //alert(teclaactual);
    var desactivar = false;
    //Ctrl + 
    if (controlprecionado==17){
       if (teclaactual==78 || teclaactual==85 ){
          Swal.fire({
             icon: 'error',
             title: 'Oops... lo siento',
             text: 'La combinación CTRL+U no está disponible. Se creativo!!!'
           })
         //alert("Ctrl+N y Ctrl+U deshabilitado");
         desactivar=true;
       }         
       if (teclaactual==82){
          Swal.fire({
             icon: 'error',
             title: 'Oops... lo siento',
             text: 'CTRL+R se encuentra deshabilitada.'
           })
         //alert("Ctrl+R deshabilitado");
         desactivar=true;
       }             
       if (teclaactual==116){
          Swal.fire({
             icon: 'error',
             title: 'Oops... lo siento',
             text: 'CTRL+F5 se encuentra deshabilitada.'
           })
         //alert("Ctrl+F5 deshabilitado");
         desactivar=true;
       }          
       if (teclaactual==114){
          Swal.fire({
             icon: 'error',
             title: 'Oops... lo siento',
             text: 'CTRL+F3 no está disponible..'
           })
         //alert("Ctrl+F3 deshabilitado");
         desactivar=true;
       }
       if (teclaactual==67 ){
          Swal.fire({
             icon: 'error',
             title: 'Oops... lo siento',
             text: 'La combinación CTRL+C no está disponible. Nunca dupliques información.'
           })
         //alert("Ctrl+N y Ctrl+U deshabilitado");
         desactivar=true;
       }
       if (teclaactual==80 ){
          Swal.fire({
             icon: 'error',
             title: 'Oops... lo siento',
             text: 'La combinación CTRL+P no está disponible. Para que quieres imprimir??.'
           })
         //alert("Ctrl+N y Ctrl+U deshabilitado");
         desactivar=true;
       }
       if (teclaactual==88 ){
          Swal.fire({
             icon: 'error',
             title: 'Oops... lo siento',
             text: 'La combinación CTRL+X no está disponible.'
           })
         //alert("Ctrl+N y Ctrl+U deshabilitado");
         desactivar=true;
       }       
 
       if (teclaactual==83 ){
         Swal.fire({
            icon: 'error',
            title: 'Oops... lo siento',
            text: 'La combinación CTRL+S no está disponible.'
          })
        //alert("Ctrl+N y Ctrl+U deshabilitado");
        desactivar=true;
      }     
    }
    //Alt +
    if (altprecionado==18){
       if (teclaactual==37){
         //alert("Alt+ [<-] deshabilitado");
         desactivar=true;
       } 
       if (teclaactual==39){
         //alert("Alt+ [->] deshabilitado");
         desactivar=true;
       }     
 
     //Mayus +
     if (mayusprecionado==16){
       if(teclaactual==83 || teclaactual==85){
         swal.fire({
           icon: 'error',
           title: 'Oops... lo siento',
           text: 'La combinacion no esta disponible.'
         })
         desactivar=true;
       }
     }
    }
    if (teclaactual==17)controlprecionado=teclaactual;
    if (teclaactual==18)altprecionado=teclaactual;
    if (teclaactual==16)mayusprecionado=teclaactual;  
    return desactivar;
 }
  
 
 
 document.onkeyup = function(){ 
    if (window.event && window.event.keyCode==17){
  controlprecionado = 0;
    }
    if (window.event && window.event.keyCode==18){
  altprecionado = 0;
    }  
 }
 
 document.onkeydown = function(){ 
    //116->f5
    //122->f11
    //117->f6
    //114->f3
    //122->f12
    //alert(window.event.keyCode);
    if (window.event && 
          desactivarCrlAlt(window.event.keyCode)){
      return false;
    }
    if (window.event && 
       (window.event.keyCode == 122 || 
        window.event.keyCode == 116 || 
        window.event.keyCode == 114 || 
        window.event.keyCode == 123)){
         Swal.fire({
            icon: 'error',
            title: 'Oops... lo siento',
            text: 'F12 no está disponible. Intenta ser Creativo.'
          });
  window.event.keyCode = 123; 
    }
    if (window.event.keyCode == 123){ 
  return false; 
    } 
    if (window.event && (window.event.keyCode == 8)){
  valor = document.activeElement.value;
  if (valor==undefined) { 
     //Evita Back en página.
     Swal.fire({
       icon: 'error',
       title: 'Oops... lo siento',
       text: 'no hay Retroceso :P'
     })
     //alert("lo siento!, no hay back :P");
     return false; 
  } 
  else{
     if (document.activeElement.getAttribute('type')
           =='select-one')
        { return false; } //Evita Back en select.
     if (document.activeElement.getAttribute('type')
           =='button')
        { return false; } //Evita Back en button.
     if (document.activeElement.getAttribute('type')
           =='radio')
        { return false; } //Evita Back en radio.
     if (document.activeElement.getAttribute('type')
           =='checkbox')
        { return false; } //Evita Back en checkbox.
     if (document.activeElement.getAttribute('type')
           =='file')
        { return false; } //Evita Back en file.
     if (document.activeElement.getAttribute('type')
           =='reset')
        { return false; } //Evita Back en reset.
     if (document.activeElement.getAttribute('type')
           =='submit')
        { return false; } //Evita Back en submit.
     else //Text, textarea o password
  {
  if (document.activeElement.value.length==0){ 
     //No realiza el backspace(largo igual a 0).
     return false; 
  } 
  else{ 
        //Realiza el backspace.
        document.activeElement.value.keyCode = 8; } 
      }
    }
  }
 } 
 //end desabilitar teclas
 