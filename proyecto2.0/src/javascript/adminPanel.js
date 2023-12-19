function openPanel(panelId) {
    // Ocultar todos los paneles
    var panels = document.querySelectorAll('.panel-content');
    for (var i = 0; i < panels.length; i++) {
        panels[i].style.display = 'none';
    }
  
    // Quitar la clase 'active' de todos los elementos de la barra lateral
    var links = document.querySelectorAll('.sidebar-menu li a');
    for (var j = 0; j < links.length; j++) {
        links[j].classList.remove('active');
    }
  
    // Mostrar el panel seleccionado
    document.getElementById(panelId).style.display = 'block';
  
    // Añadir la clase 'active' al elemento de la barra lateral que fue clickeado
    event.currentTarget.classList.add('active');
}

// Función para manejar el envío del formulario
document.getElementById('registroChoferes').addEventListener('submit', function(event) {
    event.preventDefault();
    // Aquí iría la lógica para procesar el formulario, como una petición AJAX.
    alert('Los datos del chofer se han enviado correctamente.');
});


//registro de administrador
document.addEventListener('DOMContentLoaded', function() {
    const adminRegistrationForm = document.getElementById('registroAdministradores');

    if (adminRegistrationForm) {
        adminRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombreAdmin').value;
            const apellidos = document.getElementById('apellidoAdmin').value;
            const email = document.getElementById('emailAdmin').value;
            const password = document.getElementById('passwordAdmin').value;

            const adminData = {
                nombre: nombre,
                apellidos: apellidos,
                email: email,
                password: password
            };

            fetch('/api/users/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData),
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        if (error.message.includes('correo electrónico ya está registrado')) {
                            throw new Error('Este correo ya está registrado');
                        }
                        throw new Error(error.message || 'Error al registrar el administrador');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert('Administrador registrado con éxito');
                limpiarFormulario(); 
            })
            .catch(error => {
                alert(error.message);
            });
        });
    }

    function limpiarFormulario() {
        document.getElementById('nombreAdmin').value = '';
        document.getElementById('apellidoAdmin').value = '';
        document.getElementById('emailAdmin').value = '';
        document.getElementById('passwordAdmin').value = '';
    }
});

//muestra todos los administradores
document.addEventListener('DOMContentLoaded', function() {
    cargarAdministradores();
});

function cargarAdministradores() {
    fetch('/api/users/admins', { // Asegúrate de que esta sea la URL correcta
        credentials: 'include' // para enviar la cookie de autenticación
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Problema al cargar la lista de administradores');
        }
        return response.json();
    })
    .then(admins => {
        const listaAdmins = document.querySelector('.administradores-lista tbody');
        // Limpia la lista actual
        listaAdmins.innerHTML = '';
        // Crea las filas de la tabla para cada administrador
        admins.forEach(admin => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${admin.nombre}</td>
                <td>${admin.apellidos}</td>
                <td>${admin.email}</td>
                <td>
                    <button class="btn btn-eliminar">Eliminar</button>
                    <button class="btn btn-actualizar">Actualizar</button>
                    <button class="btn btn-banear">Banear</button>
                </td>
            `;
            listaAdmins.appendChild(fila);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar los administradores: ' + error.message);
    });
}

function cargarChoferes() {
    fetch('/api/users/getDrivers', { // Asegúrate de que esta sea la URL correcta
        credentials: 'include' // para enviar la cookie de autenticación si es necesario
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Problema al cargar la lista de choferes');
        }
        return response.json();
    })
    .then(choferes => {
        const listaChoferes = document.querySelector('.choferes-lista tbody');
        // Limpia la lista actual
        listaChoferes.innerHTML = '';
        // Crea las filas de la tabla para cada chofer
        choferes.forEach(chofer => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${chofer.nombre}</td>
                <td>${chofer.apellidos}</td>
                <td>${chofer.email}</td>
                <td>${chofer.rutaAsignada ? chofer.rutaAsignada.nombreRuta : 'Sin asignar'}</td>
                <td>
                    <button class="btn btn-eliminar" data-id="${chofer._id}">Eliminar</button>
                    <button class="btn btn-actualizar" data-id="${chofer._id}">Actualizar</button>
                    <button class="btn btn-banear" data-id="${chofer._id}">Banear</button>
                </td>
            `;
            listaChoferes.appendChild(fila);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar los choferes: ' + error.message);
    });
}

// Llamar a cargarChoferes cuando el documento se carga
document.addEventListener('DOMContentLoaded', function() {
    cargarChoferes();
});


// Carga todas las rutas al cargar el documento
document.addEventListener('DOMContentLoaded', function() {
    cargarRutas();
});

function cargarRutas() {
    fetch('/api/routes/routes', { // Asegúrate de que esta sea la URL correcta
        credentials: 'include' // para enviar la cookie de autenticación
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Problema al cargar la lista de rutas');
        }
        return response.json();
    })
    .then(rutas => {
        const listaRutas = document.querySelector('.rutas-lista tbody'); // Asegúrate de que este es el selector correcto de tu tabla
        // Limpia la lista actual
        listaRutas.innerHTML = '';
        // Crea las filas de la tabla para cada ruta
        rutas.forEach(ruta => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${ruta.nombreRuta}</td>
                <td>${ruta.provincia}</td>
                <td>${ruta.canton}</td>
                <td>${ruta.codigoCTP}</td>
                <td>${ruta.costo.toFixed(2)}</td>
                <td>
                    <button class="btn btn-eliminar">Eliminar</button>
                    <button class="btn btn-actualizar">Actualizar</button>
                </td>
            `;
            listaRutas.appendChild(fila);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar las rutas: ' + error.message);
    });
}


//agregar un registro de ruta
document.addEventListener('DOMContentLoaded', function() {
    const createRouteForm = document.getElementById('createRouteForm');
  
    createRouteForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      const nombreRuta = document.getElementById('nombreRuta').value;
      const provincia = document.getElementById('provincia').value;
      const canton = document.getElementById('canton').value;
      const codigoCTP = document.getElementById('codigoCTP').value;
      const costo = document.getElementById('costo').value;
      if (!costo || isNaN(costo) || Number(costo) < 0) {
        alert('Por favor, introduce un costo válido (mayor a 0).');
        return; // Detiene el envío del formulario
    }
      const routeData = {
        nombreRuta: nombreRuta,
        provincia: provincia,
        canton: canton,
        codigoCTP: codigoCTP,
        costo: costo
      };
  
      fetch('/api/routes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(routeData)
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw new Error(error.message || 'Error al crear la ruta');
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.message === 'Ruta creada con éxito') {
          alert('Ruta creada con éxito');
          createRouteForm.reset(); // Limpia el formulario después de un registro exitoso
        } else if (data.message.includes('ya existe')) {
          alert('Ya existe una ruta con ese nombre');
        } else {
          alert(data.message); // Otros mensajes de error
        }
      })
      .catch(error => {
        alert(error.message); // Muestra un mensaje de error si la promesa falla
      });
    });
  });
  
//carga rutas disponibles para choferes
document.addEventListener('DOMContentLoaded', function() {
    cargarRutasDisponibles();
});

function cargarRutasDisponibles() {
    fetch('/api/routes/available-routes', { // Asegúrate de que esta sea la URL correcta
        credentials: 'include' // para enviar la cookie de autenticación si es necesario
    })
    .then(response => response.json())
    .then(rutas => {
        const selectRutas = document.getElementById('rutaAsignada');
        selectRutas.innerHTML = ''; // Limpia las rutas existentes

        if (rutas.length === 0) {
            // No hay rutas disponibles, agrega la opción 'sin asignar'
            const option = document.createElement('option');
            option.value = ''; // Puedes decidir qué valor usar aquí
            option.textContent = 'Sin asignar';
            selectRutas.appendChild(option);
        } else {
            // Hay rutas disponibles, llena el dropdown con ellas
            rutas.forEach(ruta => {
                const option = document.createElement('option');
                option.value = ruta._id;
                option.textContent = ruta.nombreRuta;
                selectRutas.appendChild(option);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar las rutas: ' + error.message);
    });
}


//registro del chofer
document.addEventListener('DOMContentLoaded', function() {
    const registroChoferesForm = document.getElementById('registroChoferes');

    registroChoferesForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Recolectar datos del formulario
        const choferData = {
            nombre: document.getElementById('nombre').value,
            apellidos: document.getElementById('apellido').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            rutaAsignada: document.getElementById('rutaAsignada').value
        };

        // Enviar solicitud de registro al servidor
        fetch('/api/users/register/driver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(choferData),
            credentials: 'include' // Asegúrate de enviar las cookies de sesión si es necesario
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Error al registrar el chofer');
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Chofer registrado con éxito');
            registroChoferesForm.reset(); // Limpia el formulario después de un registro exitoso
            cargarRutasDisponibles();
        })
        .catch(error => {
            alert(error.message);
        });
    });
});

//botón eliminar para choferes
// Añade un escuchador de eventos a la tabla de choferes
document.querySelector('.choferes-lista').addEventListener('click', function(e) {
    // Comprueba si se ha hecho clic en un botón de eliminar
    if (e.target.classList.contains('btn-eliminar')) {
        const choferId = e.target.getAttribute('data-id');
        if (confirm('¿Estás seguro de que quieres eliminar este chofer?')) {
            fetch(`/api/users/driver/${choferId}`, { // La URL del endpoint para eliminar choferes
                method: 'DELETE',
                credentials: 'include' // Asegúrate de enviar las credenciales si es necesario
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Problema al eliminar el chofer');
                }
                return response.json();
            })
            .then(() => {
                // Elimina la fila del chofer del DOM
                e.target.closest('tr').remove();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar el chofer: ' + error.message);
            });
        }
    }
});

function signOut() {
    localStorage.removeItem('userSessionToken');
    window.location.href = '/'; 
}

document.getElementById('signOutButton').addEventListener('click', signOut);

