function applyStylesToNavAndFooter(navbar, footer, width, padding) {
    if (navbar && footer) {
        const commonStyles = {
            width: width,
            padding: padding,
            backgroundColor: '#353a40',
            color: '#fff'
        };

        Object.assign(navbar.style, commonStyles);
        Object.assign(footer.style, commonStyles);
    }
}

function applyResponsiveStyles() {
    const width = window.innerWidth;

    const container = document.querySelector('.container');
    const form = document.querySelector('form');
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('.footer');

    const centerContainerAndForm = () => {
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.margin = '0 auto';
    };

    if (width <= 375) { // iPhone 8 and similar sizes
        container.style.width = '80%';
        container.style.marginTop = '45px';
        form.style.margin = '0 auto';
        form.style.marginTop = '25px';
        applyStylesToNavAndFooter(navbar, footer, '92%', '10px 14px');
        Object.assign(footer.style, {
            marginTop: '25px',
            flexDirection: 'column',
            alignItems: 'center'
        });
    } else if (width <= 430) { // iPhone 14 Pro (430px de ancho)
        container.style.width = '80%';
        container.style.marginTop = '45px';
        form.style.margin = '0 auto';
        form.style.marginTop = '25px';
        applyStylesToNavAndFooter(navbar, footer, '93%', '10px 14px');
        Object.assign(footer.style, {
            marginTop: '25px',
            flexDirection: 'column',
            alignItems: 'center'
        });
    } else if (width <= 412) { // galaxy s20 ultra (412px de ancho)
        container.style.width = '45%';
        container.style.marginTop = '45px';
        form.style.margin = '0 auto';
        form.style.marginTop = '25px';
        applyStylesToNavAndFooter(navbar, footer, '90%', '10px 14px');
        Object.assign(footer.style, {
            marginTop: '25px',
            flexDirection: 'column',
            alignItems: 'center'
        });
    } else if (width <= 768) { // iPad Mini (768px de ancho)
        container.style.width = '65%';
        container.style.marginTop = '55px';
        form.style.margin = '0 auto';
        form.style.marginTop = '25px';
        applyStylesToNavAndFooter(navbar, footer, '95%', '10px 18px');
        Object.assign(footer.style, {
            marginTop: '35px',
            flexDirection: 'column',
            alignItems: 'center'
        });
    } else if (width <= 1024) { // iPad Pro (1024px de ancho)
        container.style.width = '60%';
        container.style.marginTop = '180px';
        form.style.margin = '0 auto';
        form.style.marginTop = '25px';
        applyStylesToNavAndFooter(navbar, footer, '96%', '15px 18px');
        Object.assign(footer.style, {
            marginTop: '260px',
            flexDirection: 'column',
            alignItems: 'center'
        });
    } else if (width <= 1280) { // Adaptación para resolución de 1280px
        container.style.width = '45%';
        container.style.marginTop = '60px';
        form.style.margin = '0 auto';
        form.style.marginTop = '25px';
        applyStylesToNavAndFooter(navbar, footer, '97%', '10px 20px');
        footer.style.marginTop = '50px';
    } else if (width <= 1920) { // Adaptación para Full HD (1920x1080 píxeles)
        container.style.width = '35%';
        container.style.marginTop = '70px';
        form.style.margin = '0 auto';
        form.style.marginTop = '25px';
        applyStylesToNavAndFooter(navbar, footer, '97%', '10px 20px');
        footer.style.marginTop = '50px';
    } else {
        // Ajusta los estilos para pantallas más grandes si es necesario
        container.style.width = '70%';
        container.style.marginTop = '60px';
        form.style.margin = '0 auto';
        form.style.marginTop = '25px';
        applyStylesToNavAndFooter(navbar, footer, '85%', '10px 20px');
        footer.style.marginTop = '70px';
    }

    centerContainerAndForm();
}

window.addEventListener('resize', applyResponsiveStyles);
document.addEventListener('DOMContentLoaded', applyResponsiveStyles);