const infoButton = document.getElementById('info');
const banner = document.getElementById('info-banner');
const closeBannerButton = document.getElementById('close-banner');

infoButton.addEventListener('click', (event) => {
    event.preventDefault();
    banner.style.display = 'block';
});

closeBannerButton.addEventListener('click', () => {
    banner.style.display = 'none';
});

const yesButton = document.querySelector('.answer-buttons .yes');
const noButton = document.querySelector('.answer-buttons .no');

yesButton.addEventListener('click', () => {
    yesButton.style.backgroundColor = '#28a745';
    noButton.style.backgroundColor = '';
});

noButton.addEventListener('click', () => {
    noButton.style.backgroundColor = '#dc3545';
    yesButton.style.backgroundColor = '';
});

  // Ejemplo de función de alerta con SweetAlert y tema oscuro
    function showAlert(message, icon) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        Swal.fire({
            text: message,
            icon: icon,
            background: isDarkMode ? '#1e1e1e' : '#fff',
            color: isDarkMode ? '#fff' : '#000',
            confirmButtonColor: isDarkMode ? '#3085d6' : '#d33',
        });
    }
