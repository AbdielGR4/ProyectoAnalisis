const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const transactionController = require('../controllers/recordController.js');

// Ruta para crear una nueva transacción
router.post('/Transaccion', transactionController.createTransaction);

router.get('/mostrarTransac', authenticateToken, transactionController.getUserTransactions);

module.exports = router;
