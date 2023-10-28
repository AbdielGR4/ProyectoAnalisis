const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./config/db.js');

// Importación del userController
const userController = require('./controllers/userController');

app.use(express.static('public'));

// Rutas
const busRoutes = require('./Routes/buses');
const busRouteRoutes = require('./Routes/busRoutes');
const rideRoutes = require('./Routes/rides');
const transactionRoutes = require('./Routes/transactions');
const userRoutes = require('./Routes/users');
const walletRoutes = require('./Routes/wallets');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Uso de rutas
app.use('/api/buses', busRoutes);
app.use('/api/busRoutes', busRouteRoutes);
app.use('/api/rides', rideRoutes)
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallets', walletRoutes)

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
