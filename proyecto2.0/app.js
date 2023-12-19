const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {authenticateTokenAndAuthorize } = require('./middlewares/authMiddleware.js');
const routeRoutes = require('./routes/routeRoutes');
const transactionRoutes = require('./routes/recordRoutes.js');



// Middlewares para parsear el body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'src')));

// Rutas de usuarios
app.use('/api/users', userRoutes);
app.use('/api/records', transactionRoutes);

app.get('/admin-only', authenticateTokenAndAuthorize(['admin']), (req, res) => {
  res.send('Esta es una ruta protegida solo para administradores.');
});

//ruta general
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'html', 'index.html'));
});
//ruta de client home
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'html', 'clientHome.html'));
});

//ruta para rutas
app.use('/api/routes', routeRoutes);

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).send('Página no encontrada');
});

// Middlewares para el manejo de los errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Conexión a la base de datos
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/proyecto"

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Conexión al servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
