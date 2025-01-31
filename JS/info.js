const toggleInfo = () => {
    const infoIcon = document.getElementById('info-icon');
    const infoContainer = document.getElementById('info-container');
    const closeButton = document.getElementById('close-button');
  
    // Establecer estilos para el contenedor de información
    infoContainer.style.position = 'fixed';
    infoContainer.style.top = '50%';
    infoContainer.style.left = '50%';
    infoContainer.style.transform = 'translate(-50%, -50%)';
    infoContainer.style.display = 'none';
  
    // Ajustar estilos para pantallas más pequeñas
    const adjustForSmallScreens = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
  
      if (screenWidth <= 375 && screenHeight <= 667) {
        infoContainer.style.width = '80%';
        infoContainer.style.height = '65%';
        infoContainer.style.overflow = 'auto';
        closeButton.style.marginTop = '10px';
      } else if (screenWidth <= 748 && screenHeight <= 1024) {
        infoContainer.style.width = '70%';
        infoContainer.style.height = '60%';
        infoContainer.style.overflow = 'auto';
        closeButton.style.marginTop = '15px';
      } else {
        infoContainer.style.width = 'auto';
        infoContainer.style.height = 'auto';
        infoContainer.style.overflow = 'visible';
        closeButton.style.marginTop = '0';
      }
    };
  
    // Mostrar u ocultar el contenedor de información al hacer clic en el icono de información
    infoIcon.addEventListener('click', function () {
      infoContainer.style.display = 'block';
      adjustForSmallScreens(); // Ajustar los estilos al mostrar el contenedor
    });
  
    // Ocultar el contenedor de información al hacer clic en el botón de cerrar
    closeButton.addEventListener('click', function () {
      infoContainer.style.display = 'none';
    });
  
    // Ajustar los estilos al cambiar el tamaño de la ventana
    window.addEventListener('resize', adjustForSmallScreens);
  };
  
  toggleInfo();
  