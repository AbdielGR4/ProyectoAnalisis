const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController.js');

// Obtener todas las transacciones
router.get('/', transactionController.getAllTransactions);

// Obtener una transacción específica por ID
router.get('/:transactionId', transactionController.getTransactionById);

// Crear una nueva transacción
router.post('/', transactionController.createTransaction);

// Actualizar una transacción
router.put('/:transactionId', transactionController.updateTransaction);

// Eliminar una transacción
router.delete('/:transactionId', transactionController.deleteTransaction);

module.exports = router;
