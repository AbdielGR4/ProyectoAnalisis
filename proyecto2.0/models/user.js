const mongoose = require('mongoose');


//esquema para Clientes
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  cedula: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  rol: { type: String, enum: ['cliente', 'chofer', 'admin'], default: 'cliente' },
  saldo: { type: Number, default: 0 },
  tarjetaCredito: { type: String, required: true },
  tarjetaCreditoSaldo: { type: Number, default: 12000 },
  terminosYCondicionesAceptados: { type: Boolean, default: false },
  tarjetaCredito: { type: String, required: true },
  iv: { type: String, required: true },
});

// Esquema para Administradores
const adminSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, default: 'admin' },
});

//esquema para choferes
const driverSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rutaAsignada: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ruta'
  },
  wallet: { type: Number, default: 0 },
  rol: { type: String, default: 'driver' }
});

const Driver = mongoose.model('Driver', driverSchema);
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);

module.exports = { User, Admin, Driver };