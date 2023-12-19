document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('password-reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const email = emailInput.value;

            fetch('http://localhost:3000/api/users/request-password-reset', { // Asegúrate de que la URL sea correcta
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        if (error.message === 'Correo no registrado') {
                            // Si el correo no está registrado
                            throw new Error('Correo no registrado');
                        } else {
                            // Otro tipo de error
                            throw new Error(error.message || 'Error al enviar el correo electrónico');
                        }
                    });
                }
                return response.json();
            })
            .then(data => {
                // Mensaje de éxito y redirección
                alert('Instrucciones de restablecimiento enviadas al email.');
                window.location.href = '/';
            })
            .catch((error) => {
                // Manejo del error mostrando el mensaje en el HTML
                const errorMessageDiv = document.getElementById('error-message');
                if (errorMessageDiv) {
                    errorMessageDiv.textContent = error.message;
                    errorMessageDiv.style.display = 'block';
                }
            });
        });
    }
});
