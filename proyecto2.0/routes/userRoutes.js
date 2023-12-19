const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateTokenAndAuthorize } = require('../middlewares/authMiddleware');
const userController = require('../controllers/UserController.js');
const driverController = require('../controllers/driverController.js');
const adminController = require('../controllers/adminController');


//Rutas para adminsitradores
router.post('/admin/register', authenticateTokenAndAuthorize(['admin']), adminController.registerAdmin);
router.get('/admins', authenticateTokenAndAuthorize(['admin']),adminController.getAdmins);


// Rutas para usuarios
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas mostrar y modificar usuarios
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profileUpdate', authenticateToken, userController.updateProfile);

//reestablecimiento del password
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password/:token', userController.resetPassword);

//eliminacion de la cuenta
router.delete('/delete-account', authenticateToken, userController.deleteAccount);

//cargar saldo a la cuenta
router.put('/load-wallet', authenticateToken, userController.loadWallet);

//revisa el saldo del del usuario
router.get('/view-balance', authenticateToken, userController.viewBalance);

// Ruta de logout
router.get('/logout', userController.logout);

//ruta de registro choferes
router.post('/register/driver', authenticateTokenAndAuthorize(['admin']), driverController.registerDriver);

//obtencion de todos los choferes
router.get('/getDrivers', authenticateTokenAndAuthorize(['admin']), driverController.getAllDrivers);

//eliminar chofe por id
router.delete('/driver/:id', authenticateTokenAndAuthorize(['admin']), driverController.deleteDriver);

//obtiene el chofer
router.get('/profileDriver', authenticateToken, driverController.getDriverInfo);

//actualiza el chofer
router.put('/updateDriver', authenticateToken, driverController.updateDriverProfile);

module.exports = router;
