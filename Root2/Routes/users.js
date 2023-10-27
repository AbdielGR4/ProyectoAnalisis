const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Obtener un usuario específico por ID
router.get('/:userId', userController.getUserById);

// Crear un nuevo usuario
router.post('/register', userController.createUser);

// Actualizar un usuario
router.put('/:userId', userController.updateUser);

// Eliminar un usuario
router.delete('/:userId', userController.deleteUser);

module.exports = router;
