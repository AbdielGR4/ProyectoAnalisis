const BusRoute = require('../models/BusRoute.js');

// Obtener todas las rutas de buses
exports.getAllBusRoutes = async (req, res) => {
    try {
        const busRoutes = await BusRoute.find();
        res.status(200).json(busRoutes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una ruta de bus específica por ID
exports.getBusRouteById = async (req, res) => {
    try {
        const busRoute = await BusRoute.findById(req.params.routeID);
        if (busRoute) {
            res.status(200).json(busRoute);
        } else {
            res.status(404).json({ message: 'Bus Route not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva ruta de bus
exports.createBusRoute = async (req, res) => {
    const newBusRoute = new BusRoute(req.body);
    try {
        await newBusRoute.save();
        res.status(201).json(newBusRoute);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar una ruta de bus
exports.updateBusRoute = async (req, res) => {
    try {
        const updatedBusRoute = await BusRoute.findByIdAndUpdate(req.params.routeID, req.body, { new: true });
        if (updatedBusRoute) {
            res.status(200).json(updatedBusRoute);
        } else {
            res.status(404).json({ message: 'Bus Route not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una ruta de bus
exports.deleteBusRoute = async (req, res) => {
    try {
        await BusRoute.findByIdAndDelete(req.params.routeID);
        res.status(200).json({ message: 'Bus Route deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
