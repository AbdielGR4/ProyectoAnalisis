const User = require('../models/user'); 
const Transaction = require('../models/record.js'); 

// Controlador para crear una transacción
exports.createTransaction = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { type, amount, description } = req.body; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    let cardBalanceBefore = user.tarjetaCreditoSaldo;
    let walletBalanceBefore = user.saldo;
    let cardBalanceAfter = cardBalanceBefore - amount; 
    let walletBalanceAfter = walletBalanceBefore + amount; 

    // Crea la transacción
    const newTransaction = new Transaction({
      user: userId,
      type,
      amount,
      cardBalanceBefore,
      walletBalanceBefore,
      cardBalanceAfter,
      walletBalanceAfter,
      description,
      date: new Date() 
    });

    user.tarjetaCreditoSaldo = cardBalanceAfter;
    user.saldo = walletBalanceAfter;

    await newTransaction.save();
    await user.save();

    res.status(201).json({ message: 'Transacción realizada con éxito', transaction: newTransaction });
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    res.status(500).json({ message: 'Error al procesar la transacción', error: error.message });
  }
};


// Controlador para obtener las transacciones del usuario
exports.getUserTransactions = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Buscar todas las transacciones asociadas al usuario
      const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
  
      res.json(transactions);
    } catch (error) {
      console.error('Error al obtener las transacciones:', error);
      res.status(500).json({ message: 'Error al recuperar las transacciones', error: error.message });
    }
  };