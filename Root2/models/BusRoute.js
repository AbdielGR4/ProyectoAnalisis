const mongoose = require('mongoose');

const BusRouteSchema = new mongoose.Schema({
  //nombre de la ruta
  routeName: {
    type: String,
    required: [true, 'El nombre de la ruta es obligatorio'],
    unique: true
  },
  // descripcion de la ruta
  routeDescription: {
    type: String,
    required: [true, 'La descripción de la ruta es obligatoria']
  },
  //las paradas que realiza la ruta
  stops: [{
    stopName: {
      type: String,
      required: true
    },
    stopDescription: {
      type: String
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      long: {
        type: Number,
        required: true
      }
    }
  }],
  //los buses asignados a esta ruta
  busesAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  }],
  //verificacion del estado de la ruta(activa o inactiva)
  active: {
    type: Boolean,
    default: true
  },
  //horarios
  schedule: {
    weekdays: {
      type: String,
      required: true
    },
    weekends: {
      type: String
    }
  }
});

const BusRoute = mongoose.model('BusRoute', BusRouteSchema);

module.exports = BusRoute;
