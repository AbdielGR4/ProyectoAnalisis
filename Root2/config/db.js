const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/buses';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(mongoURI, options)
.then(() => console.log("Conexión a MongoDB Realizada"))
.catch((error) => console.log("Error conectando a MongoDB:", error));

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado de MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error en Mongoose:', err);
});

module.exports = mongoose;
