document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('password-reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const email = emailInput.value;

            fetch('http://localhost:3000/api/users/request-password-reset', { 
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
                            throw new Error('Correo no registrado');
                        } else {
                            throw new Error(error.message || 'Error al enviar el correo electrónico');
                        }
                    });
                }
                return response.json();
            })
            .then(data => {
                alert('Instrucciones de restablecimiento enviadas al email.');
                window.location.href = '/';
            })
            .catch((error) => {
                const errorMessageDiv = document.getElementById('error-message');
                if (errorMessageDiv) {
                    errorMessageDiv.textContent = error.message;
                    errorMessageDiv.style.display = 'block';
                }
            });
        });
    }
});
