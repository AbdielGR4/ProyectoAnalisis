const { User, Admin, Driver } = require('../models/user');
const Ruta = require('../models/route');
const Transaction = require('../models/record'); 

// ... resto de tu código ...


require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; 
const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex'); 
const iv = crypto.randomBytes(16); 
const transporter = require('../mailer.js');


//registro de clientes
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {

      const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
      let encryptedData = cipher.update(JSON.stringify(req.body.tarjetaCredito), 'utf-8', 'hex');
      encryptedData += cipher.final('hex');

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      const newUser = new User({
        ...req.body,
        password: hashedPassword,
        tarjetaCredito: encryptedData,
        iv: iv.toString('hex') 
      });
  
      await newUser.save();
  
      const token = jwt.sign({ userId: newUser._id, rol: newUser.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({ message: 'Usuario registrado con éxito', token });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      if (error.code === 11000) {
        res.status(409).json({ message: 'El email ya está registrado' });
      } else {
        res.status(400).json({ message: 'Error al registrar el usuario', error: error.message });
      }
    }
};

//login de los clientes
exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    let isAdmin = false;
    let isDriver = false;

    if (!user) {
      user = await Admin.findOne({ email: req.body.email });
      if (user) {
        isAdmin = true;
      } else {
        user = await Driver.findOne({ email: req.body.email });
        if (user) {
          isDriver = true;
        } else {
          return res.status(401).json({ message: 'Email no registrado' });
        }
      }
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const tokenPayload = {
      userId: user._id,
      rol: isAdmin ? 'admin' : (isDriver ? 'driver' : 'user')
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 
    });

    res.json({ message: 'Inicio de sesión exitoso', token, rol: tokenPayload.rol });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};


  // muestra el perfil del cliente
exports.getProfile = async (req, res) => {
  try {
    const userDoc = await User.findById(req.user.userId).select('-password');
    if (!userDoc) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = userDoc.toObject();

    if (user.tarjetaCredito && user.iv) {
      const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(user.iv, 'hex'));
      let decryptedData = decipher.update(user.tarjetaCredito, 'hex', 'utf-8');
      decryptedData += decipher.final('utf8');
      user.tarjetaCredito = JSON.parse(decryptedData);
    }

    delete user.iv;

    res.json(user);
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res.status(500).json({ message: 'Error al obtener los datos del usuario', error: error.message });
  }
}

// permite hacer cambios al profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user.userId;
    
    delete updates.password;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: 'Error al actualizar los datos del usuario', error: error.message });
  }
}

//solicita el reestablecimiento de la contraseña
exports.requestPasswordReset = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.passwordResetToken = token;
  user.passwordResetExpires = Date.now() + 3600000; // 1 hora

  await user.save();

  const mailOptions = {
    from: 'abdygaro2@gmail.com',
    to: user.email,
    subject: 'Enlace de Restablecimiento de Contraseña',
    text: `Puedes restablecer tu contraseña haciendo clic en el siguiente enlace:
    http://localhost:3000/html/newPass.html?token=${token}`
  };

  if (!user) {
    return res.status(404).json({ message: 'Correo no registrado' });
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al enviar el correo electrónico' });
    } else {
      console.log('Email enviado: ' + info.response);
      res.status(200).json({ message: 'Instrucciones de restablecimiento enviadas al email.' });
    }
  });
};

//reestablece la contrseña
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body; 

  if (!password) {
    return res.status(400).json({ message: 'La contraseña es requerida.' });
  }

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ message: 'Error al restablecer la contraseña', error: error.message });
  }
};

//elimna la cuenta
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json({ message: 'Cuenta eliminada con éxito.' });
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
    res.status(500).json({ message: 'Error al eliminar la cuenta', error: error.message });
  }
};

//recarga salgo
exports.loadWallet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amountToLoad } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (user.tarjetaCreditoSaldo < amountToLoad) {
      return res.status(400).json({ message: 'No tiene suficiente saldo.' });
    }

    // Capturar los saldos antes de realizar los cambios
    const cardBalanceBefore = user.tarjetaCreditoSaldo;
    const walletBalanceBefore = user.saldo;

    // Realizar la actualización de saldos
    user.tarjetaCreditoSaldo -= amountToLoad;
    user.saldo += amountToLoad;

    await user.save();

    // Crear y guardar la transacción
    const newTransaction = new Transaction({
      user: userId,
      type: 'recarga',
      amount: amountToLoad,
      cardBalanceBefore,
      walletBalanceBefore,
      cardBalanceAfter: user.tarjetaCreditoSaldo,
      walletBalanceAfter: user.saldo,
      description: 'Recarga de wallet'
    });

    await newTransaction.save();

    // Enviar respuesta
    res.status(200).json({ 
      message: 'La recarga fue exitosa', 
      currentBalance: user.saldo,
      currentCardBalance: user.tarjetaCreditoSaldo
    });
  } catch (error) {
    console.error("Error cargando el balance:", error);
    res.status(500).json({ message: 'Error cargando el balance', error: error.message });
  }
};

//revisa el saldo
exports.viewBalance = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('saldo');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ saldo: user.saldo });
  } catch (error) {
    console.error("Error viewing balance:", error);
    res.status(500).json({ message: 'Error retrieving balance', error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('authToken'); 
  res.json({ message: 'Has cerrado sesión exitosamente.' });
};


