document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    localStorage.setItem('resetToken', token);
});

document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('new-password-form');
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        const errorMessageDiv = document.getElementById('error-message');

        // Verificar si las contraseñas coinciden
        if (newPassword !== confirmNewPassword) {
            errorMessageDiv.textContent = 'Las contraseñas no coinciden.';
            errorMessageDiv.style.display = 'block';
            return; 
        }

        errorMessageDiv.style.display = 'none';
        
        const token = localStorage.getItem('resetToken'); 

        fetch('http://localhost:3000/api/users/reset-password/' + token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cambiar la contraseña.');
            }
            return response.json();
        })
        .then(data => {
            alert('Contraseña cambiada con éxito.');
            window.location.href = '../html/login.html'; 
        })
        .catch((error) => {
            errorMessageDiv.textContent = error.message;
            errorMessageDiv.style.display = 'block';
        });
    });
});
