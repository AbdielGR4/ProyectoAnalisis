const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  //fecha del viaje
  date: {
    type: Date,
    required: [true, 'La fecha del viaje es obligatoria'],
    default: Date.now
  },
  //tipo de usuario que estuvo en el viaje
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  //cual bus fue usado
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: [true, 'El autobús es obligatorio']
  },
  //referencia al modelo de busRoute(indica que ruta tomó)
  busRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusRoute',
    required: [true, 'La ruta de autobús es obligatoria']
  },
  //tarifa del viaje
  fare: {
    type: Number,
    required: [true, 'La tarifa es obligatoria']
  },
  //punto de partida del viaje
  startPoint: {
    type: String,
    required: [true, 'El punto de inicio es obligatorio']
  },
  //punto de llegada del viaje
  endPoint: {
    type: String,
    required: [true, 'El punto final es obligatorio']
  },
  //hora del inicio del viaje
  startTime: {
    type: Date,
    required: [true, 'La hora de inicio es obligatoria']
  },
  //hora de finalizacion del viaje
  endTime: {
    type: Date,
    required: [true, 'La hora de finalización es obligatoria']
  },
  //rating del viaje
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  }
});

const Ride = mongoose.model('Ride', RideSchema);

module.exports = Ride;
