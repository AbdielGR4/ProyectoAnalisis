const mongoose = require('mongoose');
const Transaction = require('./Transaction');
const Wallet = require('./wallet');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose; // Importa Schema desde mongoose

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Por favor, introduce un correo electrónico válido'
    ]
  },
  creditCardInfo: {
    cardNumber: {
      type: String,
      required: [true, 'El número de tarjeta es obligatorio']
    },
    expirationDate: {
      type: String,
      required: [true, 'La fecha de vencimiento es obligatoria']
    },
    cvv: {
      type: Number,
      required: [true, 'El CVV es obligatorio']
    }
  },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet'
  },
  termsAndConditions: {
    type: Boolean,
    required: [true, 'Debes aceptar los términos y condiciones para registrarte']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false 
  },
  role: {
    type: String,
    enum: ['cliente', 'chofer', 'administrador'],
    default: 'cliente',
    required: true
  },
  driverDetails: {
    licenseNumber: {
      type: String,
      required: function() { return this.role === 'chofer'; }
    },
    vehicleInformation: {
      type: String,
      required: function() { return this.role === 'chofer'; }
    },
    incomeReports: [String],
    rejectedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    stops: [String]
  },
  adminDetails: {
    specialPermissions: [String],
    managedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },

});


async function registerUser(userData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = new User(userData);
    await user.save({ session });

    // Después de guardar el usuario, crea el monedero
    const wallet = new Wallet({
        user: user._id,
        balance: 0,
        transactionHistory: []
    });

    await wallet.save({ session });

    // Asocia el monedero al usuario
    user.wallet = wallet._id;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}


UserSchema.methods.addToWallet = function(amount) {
  return new Promise(async (resolve, reject) => {
    try {
      // Agrega saldo al wallet
      this.wallet.balance += amount;

      // Crear la transacción
      const transaction = new Transaction({
        user: this._id,
        transactionType: 'deposit',
        amount: amount,
        description: `Depósito de $${amount}`
      });

      await transaction.save();

      // Guarda la transacción para el historial
      this.wallet.transactionHistory.push(transaction);

      // Guardar el usuario actualizado
      await this.save();

      resolve(this);
    } catch (error) {
      reject(error);
    }
  });
};


// Encripta el password del usuario
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Encriptar la información de la tarjeta
  if (this.isModified('creditCardInfo.cardNumber')) {
    const saltCard = await bcrypt.genSalt(10);
    this.creditCardInfo.cardNumber = await bcrypt.hash(this.creditCardInfo.cardNumber, saltCard);
  }

  if (this.isModified('creditCardInfo.expirationDate')) {
    const saltExpDate = await bcrypt.genSalt(10);
    this.creditCardInfo.expirationDate = await bcrypt.hash(this.creditCardInfo.expirationDate, saltExpDate);
  }

  if (this.isModified('creditCardInfo.cvv')) {
    const saltCvv = await bcrypt.genSalt(10);
    this.creditCardInfo.cvv = await bcrypt.hash(this.creditCardInfo.cvv.toString(), saltCvv);
  }

  next();
});

module.exports = mongoose.model('User', UserSchema);