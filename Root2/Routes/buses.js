const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController.js');


// Obtiene todos los buses
router.get('/', busController.getAllBuses);

// Obtiene un bus específico por ID
router.get('/:busID', busController.getBusById);

// Crea un nuevo bus
router.post('/', busController.createBus);

// Actualiza un bus
router.put('/:busID', busController.updateBus);

// Elimina un bus
router.delete('/:busID', busController.deleteBus);




module.exports = router;
