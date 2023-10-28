const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  //usuario al que pertenece la transaccion
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  //tipo de transaccion
  transactionType: {
    type: String,
    enum: ['deposit', 'spend'],
    required: true
  },
  //monto de la transaccion
  amount: {
    type: Number,
    required: true
  },
  //descripcion de la transaccion
  description: {
    type: String,
    required: true
  },
  //referencia al viaje
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: function() { return this.transactionType === 'spend'; }
  },
  //fecha y hora de la transaccion
  date: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
