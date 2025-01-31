let currentStep = 0;
        const steps = $('.form-step');

        function showStep(step) {
            steps.each(function(index) {
                $(this).toggleClass('active', index === step);
            });
        }

        function validateStep() {
            const currentStepDiv = steps.eq(currentStep);
            const inputs = currentStepDiv.find('input[required], select[required], textarea[required]');
            let valid = true;

            inputs.each(function() {
                if (!$(this).val()) {
                    valid = false;
                    $(this).addClass('invalid');
                    $(this).next('.error-message').show();
                } else {
                    $(this).removeClass('invalid');
                    $(this).next('.error-message').hide();
                }
            });

            return valid;
        }

        function nextStep() {
            if (validateStep()) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            }
        }

        function prevStep() {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        }

        function setParticipacion(value) {
            $("#participacion").val(value ? "Sí" : "No");
            $(".yes").css("background-color", value ? "green" : "");
            $(".no").css("background-color", value ? "" : "red");
        }

        $('#current-month').text(new Date().toLocaleString('es-ES', { month: 'long' }));

        // Inicializar tooltips con Tippy.js
        tippy('[data-tippy-content]', {
            placement: 'top',
            animation: 'shift-toward',
            // theme: 'retro',
            arrow: true
        });