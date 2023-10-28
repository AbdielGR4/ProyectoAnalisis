const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  //usuario al que pertenece el monedero
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    //saldo del monedero
    balance: {
        type: Number,
        default: 0
    },
    //Historeal transacciones realizadas
    transactionHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
});

module.exports = mongoose.model('Wallet', WalletSchema);
