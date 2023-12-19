document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();


        // Recoger los datos del formulario después de la validación
        const name = document.getElementById('nombre').value;
        const lastname = document.getElementById('apellido').value;
        const Cedulaid = document.getElementById('cedula').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const creditNumber = document.getElementById('tarjetaCredito').value;
        const creditDate = document.getElementById('fechaVencimiento').value;
        const cvv = document.getElementById('cvv').value;
        const terms = document.getElementById('terminos').checked;

        // Validaciones
        let valid = true;


        if (!/^[A-Za-z\s]*$/.test(name)) {
        document.getElementById('errorNombre').textContent = 'El nombre solo puede contener letras y espacios.';
        valid = false;
        } else {
            document.getElementById('errorNombre').textContent = '';
        }
        console.log('Nombre válido:', valid);


        if (!/^[A-Za-z\s]*$/.test(lastname)) {
            document.getElementById('errorApellido').textContent = 'El apellido solo puede contener letras y espacios.';
            valid = false;
        } else {
            document.getElementById('errorApellido').textContent = '';
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            document.getElementById('errorEmail').textContent = 'Debe ser un email válido.';
            valid = false;
        } else {
            document.getElementById('errorEmail').textContent = '';
        }

        if (password.length < 8) {
            document.getElementById('errorPassword').textContent = 'La contraseña debe tener al menos 8 caracteres.';
            valid = false;
        } else {
            document.getElementById('errorPassword').textContent = '';
        }

        if (password !== confirmPassword) {
            document.getElementById('errorConfirmPassword').textContent = 'Las contraseñas no coinciden.';
            valid = false;
        } else {
            document.getElementById('errorConfirmPassword').textContent = '';
        }

        if (!/^\d{16}$/.test(creditNumber)) {
            document.getElementById('errorTarjetaCredito').textContent = 'El número de tarjeta debe tener 16 dígitos.';
            valid = false;
        } else {
            document.getElementById('errorTarjetaCredito').textContent = '';
        }

        if (!/^\d{3}$/.test(cvv)) {
            document.getElementById('errorCvv').textContent = 'El CVV debe tener 3 dígitos.';
            valid = false;
        } else {
            document.getElementById('errorCvv').textContent = '';
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(creditDate)) {
            document.getElementById('errorFechaVencimiento').textContent = 'La fecha de vencimiento debe estar en formato MM/AA.';
            valid = false;
        } else {
            document.getElementById('errorFechaVencimiento').textContent = '';
        }
  
        if (!valid) {
            console.log('Formulario no válido, no se envía');
            return;
        }

                // Crear el objeto con los datos del usuario
                const userData = {
                    nombre: name,
                    apellidos: lastname,
                    cedula: Cedulaid,
                    email: email,
                    password: password,
                    tarjetaCredito: {
                        numero: creditNumber,
                        cvv: cvv,
                        fechaVencimiento: creditDate
                    },
                    terminosYCondicionesAceptados: terms
                };

        // Hacer la solicitud POST al servidor
        fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then(data => {
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = 'Registro exitoso!!';
            successMessage.style.display = 'block';
        
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        })
        .catch((error) => {
            const errorContainer = document.getElementById('error-container');
            errorContainer.textContent = error.message;
            errorContainer.style.display = 'block';
        });       
    });
});
