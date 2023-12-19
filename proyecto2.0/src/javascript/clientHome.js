function openPanel(panelId) {
  const panels = document.querySelectorAll('.panel');
  panels.forEach(panel => panel.classList.remove('active'));

  const activePanel = document.getElementById(panelId);
  if (activePanel) {
      activePanel.classList.add('active');
  }
}



document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('CerrarSesion');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            fetch('/api/users/logout', {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.href = '/'; 
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

});

document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/users/profile', { 
        method: 'GET',
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener la información del usuario.');
        }
        return response.json();
    })
    .then(userData => {
        document.getElementById('nombre').value = userData.nombre;
        document.getElementById('apellido').value = userData.apellidos;
        document.getElementById('email').value = userData.email;
        if (userData.cedula) {
            document.getElementById('cedula').value = userData.cedula;
        }
    })
    .catch(error => {
        console.error('Error al cargar la información del usuario:', error);
    });

    fetch('/api/users/view-balance', {
        method: 'GET',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(data => {
        document.getElementById('balance').textContent = data.saldo;
      })
      .catch(error => {
        console.error('Error al cargar el saldo del usuario:', error);
      });


      const botonRecarga = document.getElementById('botonRecargaWallet');
    if (botonRecarga) {
        botonRecarga.addEventListener('click', function() {
            recargarWallet().then(() => {
                cargarHistorialTransacciones();
            });
        });
    }

    cargarSaldoWallet();
    cargarHistorialTransacciones();
});


function modificarPerfil() {
    var nombre = document.getElementById('nombre').value;
    var apellidos = document.getElementById('apellido').value;
    var cedula = document.getElementById('cedula').value;
    var email = document.getElementById('email').value;
    
    fetch('/api/users/profileUpdate', { 
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, apellidos, cedula, email }),
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo actualizar el perfil.');
      }
      return response.json();
    })
    .then(data => {
      alert('Perfil actualizado correctamente.');
    })
    .catch(error => {
      console.error('Error al actualizar el perfil:', error);
    });
}

function recargarWallet() {
  const amountToLoadInput = document.getElementById('recarga'); 
  const amountToLoad = amountToLoadInput.value;

  return fetch('/api/users/load-wallet', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amountToLoad: Number(amountToLoad) }),
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text) });
    }
    return response.json();
  })
  .then(data => {
    alert('Wallet recargado correctamente. Saldo actual: ' + data.currentBalance);
    amountToLoadInput.value = ''; 
    cargarSaldoWallet();
  })
  .catch(error => {
    console.error('Error al recargar el wallet:', error);
    alert(error);
  });
}


  
  function cargarSaldoWallet() {
    return fetch('/api/users/view-Balance', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('balance').textContent = data.saldo;
    })
    .catch(error => {
      console.error('Error al cargar el saldo del usuario:', error);
    });
  }
  

  function cargarHistorialTransacciones() {
    fetch('/api/records/mostrarTransac', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error del servidor al intentar obtener las transacciones');
      }
      return response.json();
    })
    .then(transacciones => {
      if (!Array.isArray(transacciones)) {
        throw new Error('La respuesta no es un array');
      }
      const contenedorTransacciones = document.getElementById('historialTransacciones');
      contenedorTransacciones.innerHTML = ''; 
  
      transacciones.forEach(transaccion => {
        const transaccionElemento = document.createElement('div');
        transaccionElemento.classList.add('transaccion');
  
        const fecha = new Date(transaccion.date).toLocaleString(); 
        transaccionElemento.innerHTML = `
          <div class="transaccion-datos">
            <div class="transaccion-fecha">${fecha}</div>
            <div class="transaccion-monto">${transaccion.amount} ₡</div>
          </div>
          <div class="transaccion-descripcion">${transaccion.description}</div>
        `;
  
        contenedorTransacciones.appendChild(transaccionElemento);
      });
    })
    .catch(error => {
      console.error('Error al cargar el historial de transacciones:', error);
    });
  }

  document.addEventListener('DOMContentLoaded', cargarSaldoWallet);
  
  
  