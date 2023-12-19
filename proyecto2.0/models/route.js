const mongoose = require('mongoose');

const rutaSchema = new mongoose.Schema({
    nombreRuta: { type: String, required: true, unique:true},
    provincia: { type: String, required: true },
    canton: { type: String, required: true },
    codigoCTP: { type: String, required: true, unique: true },
    costo: { type: Number, required: true }
  });
  
  const Ruta = mongoose.model('Ruta', rutaSchema);
  
  module.exports = Ruta;
  