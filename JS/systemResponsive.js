function applyStylesToNavAndFooter(navbar, footer, width, padding) {
    if (navbar && footer) {
        navbar.style.width = width;
        navbar.style.display = 'flex';
        navbar.style.justifyContent = 'space-between';
        navbar.style.alignItems = 'center';
        navbar.style.padding = padding;
        navbar.style.backgroundColor = '#353a40';
        navbar.style.color = '#fff';

        footer.style.width = width;
        footer.style.display = 'flex';
        footer.style.flexDirection = 'row'; // Mantén la dirección del flex para apilar los elementos
        footer.style.justifyContent = 'space-between'; // Centra los elementos verticalmente
        footer.style.backgroundColor = '#353a40';
        footer.style.color = '#fff';
        footer.style.fontSize = '14px';
        footer.style.padding = padding;
    }
}

function applyResponsiveStyles() {
    const width = window.innerWidth;

    const container = document.querySelector('.container');
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('.footer');

    if (width <= 375) { // iPhone 8 and similar sizes
        container.style.width = '80%';
        container.style.marginTop = '45px';
        applyStylesToNavAndFooter(navbar, footer, '92%', '10px 14px');
        footer.style.marginTop = '25px';
        footer.style.flexDirection = 'column';
        footer.style.alignItems = 'center';
    } else if (width <= 430) { // iPhone 14 Pro (430px de ancho)
        container.style.width = '80%';
        container.style.marginTop = '45px';
        applyStylesToNavAndFooter(navbar, footer, '93%', '10px 14px');
        footer.style.marginTop = '25px';
        footer.style.flexDirection = 'column';
        footer.style.alignItems = 'center';
    } else if (width <= 412) { // galaxy s20 ultra (412px de ancho)
            container.style.width = '45%';
            container.style.marginTop = '45px';
            applyStylesToNavAndFooter(navbar, footer, '90%', '10px 14px');
            footer.style.marginTop = '25px';
            footer.style.flexDirection = 'column';
            footer.style.alignItems = 'center';
    } else if (width <= 768) { // iPad Mini (768px de ancho)
        container.style.width = '65%';
        container.style.marginTop = '55px';
        applyStylesToNavAndFooter(navbar, footer, '95%', '10px 18px');
        footer.style.marginTop = '35px';
        footer.style.flexDirection = 'column';
        footer.style.alignItems = 'center';
    } else if (width <= 1024) { // iPad Pro (1024px de ancho)
        container.style.width = '60%';
        container.style.marginTop = '180px';
        applyStylesToNavAndFooter(navbar, footer, '96%', '15px 18px');
        footer.style.marginTop = '260px';
        footer.style.flexDirection = 'column';
        footer.style.alignItems = 'center';
    } else if (width <= 1280) { // Adaptación para resolución de 1280px
        container.style.width = '45%';
        container.style.marginTop = '60px';
        applyStylesToNavAndFooter(navbar, footer, '97%', '10px 20px');
        footer.style.marginTop = '50px';
    } else if (width <= 1920) { // Adaptación para Full HD (1920x1080 píxeles)
        container.style.width = '35%';
        container.style.marginTop = '70px';
        applyStylesToNavAndFooter(navbar, footer, '97%', '10px 20px');
        footer.style.marginTop = '50px';
    } else {
        // Ajusta los estilos para pantallas más grandes si es necesario
        container.style.width = '70%';
        container.style.marginTop = '60px';
        applyStylesToNavAndFooter(navbar, footer, '85%', '10px 20px');
        footer.style.marginTop = '70px';
    }
}

window.addEventListener('resize', applyResponsiveStyles);
document.addEventListener('DOMContentLoaded', applyResponsiveStyles);
