const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateTokenAndAuthorize } = require('../middlewares/authMiddleware');
const routeController = require('../controllers/routeController.js');

// Ruta para crear una nueva ruta
router.post('/create', routeController.createRoute);

// Ruta para obtener todas las rutas
router.get('/routes', routeController.getAllRoutes);

// Rutas para obtener rutas disponibles
router.get('/available-routes', authenticateTokenAndAuthorize(['admin']), routeController.getAvailableRoutes);


module.exports = router;
