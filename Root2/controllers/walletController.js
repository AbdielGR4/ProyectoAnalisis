const Wallet = require('../models/wallet.js');

// Obtener todos los monederos
exports.getAllWallets = async (req, res) => {
    try {
        const wallets = await Wallet.find();
        res.status(200).json(wallets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un monedero específico por ID
exports.getWalletById = async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.walletID);
        if (wallet) {
            res.status(200).json(wallet);
        } else {
            res.status(404).json({ message: 'Wallet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo monedero
exports.createWallet = async (req, res) => {
    const newWallet = new Wallet(req.body);
    try {
        await newWallet.save();
        res.status(201).json(newWallet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un monedero
exports.updateWallet = async (req, res) => {
    try {
        const updatedWallet = await Wallet.findByIdAndUpdate(req.params.walletID, req.body, { new: true });
        if (updatedWallet) {
            res.status(200).json(updatedWallet);
        } else {
            res.status(404).json({ message: 'Wallet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un monedero
exports.deleteWallet = async (req, res) => {
    try {
        await Wallet.findByIdAndDelete(req.params.walletID);
        res.status(200).json({ message: 'Wallet deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
