const Ride = require('../models/Ride.js');

// Obtener todos los viajes
exports.getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find();
        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un viaje específico por ID
exports.getRideById = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.rideID);
        if (ride) {
            res.status(200).json(ride);
        } else {
            res.status(404).json({ message: 'Ride not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo viaje
exports.createRide = async (req, res) => {
    const newRide = new Ride(req.body);
    try {
        await newRide.save();
        res.status(201).json(newRide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un viaje
exports.updateRide = async (req, res) => {
    try {
        const updatedRide = await Ride.findByIdAndUpdate(req.params.rideID, req.body, { new: true });
        if (updatedRide) {
            res.status(200).json(updatedRide);
        } else {
            res.status(404).json({ message: 'Ride not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un viaje
exports.deleteRide = async (req, res) => {
    try {
        await Ride.findByIdAndDelete(req.params.rideID);
        res.status(200).json({ message: 'Ride deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
