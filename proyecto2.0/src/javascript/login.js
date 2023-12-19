document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }
            return response.json();
        })
        .then(data => {
            if (data.token) { 
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userRole', data.rol);
            } else {
                console.error('No se recibió el token en la respuesta');
            }
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';
        
            if (data.rol === 'admin') {
                window.location.href = '../html/adminPanel.html';
            } else if(data.rol === 'driver'){
                window.location.href = '../html/driverHome.html';
            } 
            else {
                window.location.href = '../html/clientHome.html';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Login fallido: ' + error.message);
        });
    });
});
