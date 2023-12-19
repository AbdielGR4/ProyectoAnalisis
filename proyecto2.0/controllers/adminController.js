const bcrypt = require('bcrypt');
const { User, Admin } = require('../models/user'); 
const jwt = require('jsonwebtoken');

// Función para registrar un nuevo administrador
exports.registerAdmin = async (req, res) => {
  try {
    // Verifica si el usuario que hace la solicitud es un admin
    // Esta verificación ya debería estar hecha por el middleware, pero es una doble comprobación
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Crear un nuevo administrador
    const newAdmin = new Admin({
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      email: req.body.email,
      password: hashedPassword,
      rol: 'admin' // El rol es siempre 'admin'
    });

    // Guardar el administrador en la base de datos
    await newAdmin.save();

    res.status(201).json({ message: 'Administrador registrado con éxito' });
  } catch (error) {
    console.error("Error al registrar el administrador:", error);
    if (error.code === 11000) {
      // Manejar duplicación de correo electrónico
      res.status(409).json({ message: 'El correo electrónico ya está registrado' });
    } else {
      res.status(500).json({ message: 'Error al registrar el administrador', error: error.message });
    }
  }
};

exports.getAdmins = async (req, res) => {
    try {
      // Buscar todos los administradores en la base de datos
      const admins = await Admin.find({ rol: 'admin' }).select('-password'); // Excluye la contraseña para la seguridad
      res.json(admins);
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      res.status(500).json({ message: 'Error al obtener los administradores', error: error.message });
    }
  };

