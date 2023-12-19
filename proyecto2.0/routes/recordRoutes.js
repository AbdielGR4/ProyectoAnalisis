const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const transactionController = require('../controllers/recordController.js');

// Ruta para crear una nueva transaccion
router.post('/Transaccion', transactionController.createTransaction);

// Ruta que va a mostrar la transaccion
router.get('/mostrarTransac', authenticateToken, transactionController.getUserTransactions);

module.exports = router;
