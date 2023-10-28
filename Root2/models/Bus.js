const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  busID: {
    type: String,
    required: [true, 'El ID del autobús es obligatorio'],
    unique: true
  },
  capacity: {
    type: Number,
    required: [true, 'La capacidad del autobús es obligatoria']
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  driverAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El chofer asignado es obligatorio']
  },
  active: {
    type: Boolean,
    default: true
  },
  lastMaintenanceDate: {
    type: Date
  },
  maintenanceHistory: [{
    date: {
      type: Date,
      required: true
    },
    details: {
      type: String,
      required: true
    }
  }]
});

const Bus = mongoose.model('Bus', BusSchema);

module.exports = Bus;
