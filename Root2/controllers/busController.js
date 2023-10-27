const Bus = require('../models/Bus.js');

// Obtener todos los buses
exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find();
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un bus específico por ID
exports.getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.busID);
        if (bus) {
            res.status(200).json(bus);
        } else {
            res.status(404).json({ message: 'Bus not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo bus
exports.createBus = async (req, res) => {
    const newBus = new Bus(req.body);
    try {
        await newBus.save();
        res.status(201).json(newBus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un bus
exports.updateBus = async (req, res) => {
    try {
        const updatedBus = await Bus.findByIdAndUpdate(req.params.busID, req.body, { new: true });
        if (updatedBus) {
            res.status(200).json(updatedBus);
        } else {
            res.status(404).json({ message: 'Bus not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un bus
exports.deleteBus = async (req, res) => {
    try {
        await Bus.findByIdAndDelete(req.params.busID);
        res.status(200).json({ message: 'Bus deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
