function openPanel(panelId) {
    // Oculta todos los paneles
    var panels = document.querySelectorAll('.panel-content');
    for (var i = 0; i < panels.length; i++) {
        panels[i].style.display = 'none';
    }

    // Quita la clase 'active' de todos los links del menú lateral
    var links = document.querySelectorAll('.sidebar-menu li a');
    for (var j = 0; j < links.length; j++) {
        links[j].classList.remove('active');
    }

    // Muestra el panel seleccionado y añade la clase 'active' al link correspondiente
    document.getElementById(panelId).style.display = 'block';
    var activeLink = document.querySelector(`.sidebar-menu li a[href="javascript:void(0);"][onclick="openPanel('${panelId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Agrega los event listeners después de que el DOM se haya cargado
document.addEventListener('DOMContentLoaded', function() {
    var links = document.querySelectorAll('.sidebar-menu li a');
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function(event) {
            var panelId = this.getAttribute('onclick').split("'")[1];
            openPanel(panelId);

            if (panelId === 'profile') {
                cargarPerfilChofer();
            } else if (panelId === 'editProfile') {
                cargarDatosEdicion();
            } else if (panelId === 'signOut') {
                signOut();
            }
        });
    }

    // Event listener para el formulario de edición
    const form = document.querySelector('#editProfile form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        actualizarPerfilChofer(); 
    });

    // Abrir el primer panel por defecto y cargar los datos del perfil
    openPanel('profile');
    cargarPerfilChofer();
});


function cargarPerfilChofer() {
    fetch('http://localhost:3000/api/users/profileDriver', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Problema al cargar el perfil del chofer');
        }
        return response.json();
    })
    .then(chofer => {
        document.getElementById('nombre').textContent = chofer.nombre || 'No disponible';
        document.getElementById('apellido').textContent = chofer.apellidos || 'No disponible';
        document.getElementById('email').textContent = chofer.email || 'No disponible';
        document.getElementById('ruta').textContent = chofer.rutaAsignada ? chofer.rutaAsignada.nombreRuta : 'Sin asignar';
        document.getElementById('wallet').textContent = chofer.wallet.toString();
        document.getElementById('rol').textContent = chofer.rol || 'No disponible';
        console.log(chofer)
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al cargar el perfil: ' + error.message);
    });
}

function cargarDatosEdicion() {
    fetch('http://localhost:3000/api/users/profileDriver', {
        method: 'GET',
        credentials: 'include' 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Problema al cargar el perfil del chofer para edición');
        }
        return response.json();
    })
    .then(chofer => {
        document.getElementById('inputNombre').value = chofer.nombre || '';
        document.getElementById('inputApellido').value = chofer.apellidos || '';
        document.getElementById('inputEmail').value = chofer.email || '';
    })
    .catch(error => {
        console.error('Error al cargar datos para edición:', error);
        alert('Error al cargar el perfil para edición: ' + error.message);
    });
}

function actualizarPerfilChofer() {

     // Intenta obtener los elementos del formulario
     const nombreElement = document.getElementById('inputNombre');
     const apellidosElement = document.getElementById('inputApellido');
     const emailElement = document.getElementById('inputEmail');
 
     // Verifica que cada elemento exista antes de intentar usar su valor
     if (!nombreElement || !apellidosElement || !emailElement) {
         console.error('Uno o más elementos del formulario no se encuentran.');
         return; 
     }

    console.log('Actualizando perfil del chofer');
    const nombre = document.getElementById('inputNombre').value;
    const apellidos = document.getElementById('inputApellido').value;
    const email = document.getElementById('inputEmail').value;

    const updateData = { nombre, apellidos, email };

    fetch('http://localhost:3000/api/users/updateDriver', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Problema al actualizar el perfil');
        }
        return response.json();
    })
    .then(data => {
        alert('Perfil actualizado con éxito');
        cargarPerfilChofer();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el perfil: ' + error.message);
    });
}

// Función para manejar el cierre de sesión
function signOut() {
    localStorage.removeItem('userSessionToken');
    window.location.href = '/'; 
}

document.getElementById('signOutButton').addEventListener('click', signOut);


document.getElementById('btnActualizar').addEventListener('click', actualizarPerfilChofer);




