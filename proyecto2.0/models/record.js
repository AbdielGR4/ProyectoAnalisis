const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['recarga', 'compra', 'transferencia', 'retiro'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  cardBalanceBefore: {
    type: Number,
    required: true
  },
  walletBalanceBefore: {
    type: Number,
    required: true
  },
  cardBalanceAfter: {
    type: Number,
    required: true
  },
  walletBalanceAfter: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
