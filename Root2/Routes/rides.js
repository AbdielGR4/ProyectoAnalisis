const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController.js');

// Definir tus endpoints y asociarlos con sus respectivos controladores

// Obtener todos los viajes (rides)
router.get('/', rideController.getAllRides);

// Obtener un viaje específico por ID
router.get('/:rideId', rideController.getRideById);

// Crear un nuevo viaje
router.post('/', rideController.createRide);

// Actualizar un viaje
router.put('/:rideId', rideController.updateRide);

// Eliminar un viaje
router.delete('/:rideId', rideController.deleteRide);

module.exports = router;
