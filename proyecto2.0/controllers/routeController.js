const Ruta = require('../models/route');
const {Driver} = require('../models/user');

// Controlador para crear una nueva ruta
exports.createRoute = async (req, res) => {
  try {
    const { nombreRuta, provincia, canton, codigoCTP, costo } = req.body;

    // Crear una nueva ruta
    const newRoute = new Ruta({
      nombreRuta,
      provincia,
      canton,
      codigoCTP,
      costo
    });

    // Guardar la ruta en la base de datos
    await newRoute.save();
    res.status(201).json({ message: 'Ruta creada con éxito', route: newRoute });
  } catch (error) {
    console.error("Error al crear la ruta:", error);
    res.status(500).json({ message: 'Error al crear la ruta', error: error.message });
  }
};

// Controlador para obtener todas las rutas
exports.getAllRoutes = async (req, res) => {
  try {
    // Obtener todas las rutas de la base de datos
    const routes = await Ruta.find({});
    res.status(200).json(routes);
  } catch (error) {
    console.error("Error al obtener las rutas:", error);
    res.status(500).json({ message: 'Error al obtener las rutas', error: error.message });
  }
};

exports.getAvailableRoutes = async (req, res) => {
  try {
    // Encuentra todas las rutas que no están asignadas a un chofer
    const choferes = await Driver.find().select('rutaAsignada -_id');

    const rutasAsignadas = choferes.map(chofer => chofer.rutaAsignada);
    
    const availableRoutes = await Ruta.find({ _id: { $nin: rutasAsignadas } });
    
    res.json(availableRoutes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las rutas disponibles', error: error.message });
  }
};
