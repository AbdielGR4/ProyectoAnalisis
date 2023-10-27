const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController.js');

// Obtener todos los monederos (wallets)
router.get('/', walletController.getAllWallets);

// Obtener un monedero específico por ID de usuario
router.get('/:userID', walletController.getWalletById);

// Crear un nuevo monedero
router.post('/', walletController.createWallet);

// Actualizar un monedero
router.put('/:userID', walletController.updateWallet);

// Eliminar un monedero
router.delete('/:userID', walletController.deleteWallet);

module.exports = router;
