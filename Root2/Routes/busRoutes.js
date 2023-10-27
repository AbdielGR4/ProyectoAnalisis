const express = require('express');
const router = express.Router();
const busRouteController = require('../controllers/busRouteController.js');


// Obtiene todas las rutas de buses
router.get('/', busRouteController.getAllBusRoutes);

// Obtiene una ruta de bus específica por su ID
router.get('/:routeID', busRouteController.getBusRouteById);

// Crea una nueva ruta de bus
router.post('/', busRouteController.createBusRoute);

// Actualiza una ruta de bus
router.put('/:routeID', busRouteController.updateBusRoute);

// Eliminar una ruta de bus
router.delete('/:routeID', busRouteController.deleteBusRoute);

module.exports = router;
