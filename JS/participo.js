function setParticipacion(participo) {
    var yesButton = document.querySelector('.yes');
    var noButton = document.querySelector('.no');
    var hiddenInput = document.getElementById('participacion');

    if (participo) {
        yesButton.classList.add('selected');
        noButton.classList.remove('selected');
        hiddenInput.value = 'Sí';
    } else {
        yesButton.classList.remove('selected');
        noButton.classList.add('selected');
        hiddenInput.value = 'No';
    }
}