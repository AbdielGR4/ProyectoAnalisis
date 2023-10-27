const User = require('../models/User.js');
const express = require('express');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un usuario específico por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    // Convertir el valor de termsAndConditions
    try {
        if (req.body.termsAndConditions === 'on') {
            req.body.termsAndConditions = true;
        } else {
            req.body.termsAndConditions = false;
        }
    } catch (error) {
        console.error("Error al convertir termsAndConditions:", error.message);
        res.status(500).json({ message: error.message });
        return;  // No seguir con el resto de la función en caso de error
    }

    // Intentar crear el usuario con los datos modificados
    console.log("Intentando crear un usuario con los siguientes datos:", req.body);

    const newUser = new User(req.body);
    try {
        await newUser.save();
        console.log("Usuario creado exitosamente");
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error al crear usuario:", error.message);
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userID, req.body, { new: true });
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userID);
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
