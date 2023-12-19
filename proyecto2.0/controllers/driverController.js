const { User, Admin, Driver } = require('../models/user');
const Ruta = require('../models/route');

require('dotenv').config();
const bcrypt = require('bcrypt');


//registro de choferes
exports.registerDriver = async (req, res) => {
    try {
      // Verifica si existe la ruta asignada
      const ruta = await Ruta.findById(req.body.rutaAsignada);
      if (!ruta) {
        return res.status(400).json({ message: 'Ruta asignada no existe' });
      }
  
      // Hashea la contraseña
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      // Crea el nuevo chofer con la ruta asignada
      const newDriver = new Driver({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        password: hashedPassword,
        rutaAsignada: req.body.rutaAsignada,
        wallet: 0, // Puedes omitir esta línea si quieres usar el valor por defecto del esquema
        rol: 'chofer' // Puedes omitir esta línea si quieres usar el valor por defecto del esquema
      });
  
      // Guarda el chofer en la base de datos
      await newDriver.save();
  
      res.status(201).json({ message: 'Chofer registrado con éxito' });
    } catch (error) {
      console.error('Error al registrar el chofer:', error);
      if (error.code === 11000) {
        // Error de duplicación (email o código CTP)
        res.status(409).json({ message: 'El email o el código CTP ya está registrado' });
      } else {
        res.status(500).json({ message: 'Error al registrar el chofer', error: error.message });
      }
    }
  };
  
  // Controlador para obtener todos los choferes
  exports.getAllDrivers = async (req, res) => {
    try {
      const drivers = await Driver.find().populate('rutaAsignada');
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los choferes', error: error.message });
    }
  };
  
  //controlador para eliminar por id el chofer
  exports.deleteDriver = async (req, res) => {
    try {
        const driverId = req.params.id;
        const driver = await Driver.findByIdAndDelete(driverId);
  
        if (!driver) {
            return res.status(404).json({ message: "Chofer no encontrado" });
        }
  
        // El chofer fue eliminado exitosamente
        res.status(200).json({ message: "Chofer eliminado con éxito" });
    } catch (error) {
        // Manejo de errores, por ejemplo, si el ID no es válido
        res.status(500).json({ message: "Error al eliminar el chofer", error: error.message });
    }
  };
  
  //obtiene la informacion del chofer
  exports.getDriverInfo = async (req, res) => {
    try {
      // Obtener el ID del chofer desde el parámetro de la URL o de la información del usuario autenticado
      const driverId = req.params.driverId || req.user.userId;
  
      // Buscar la información del chofer en la base de datos
      const driver = await Driver.findById(driverId)
        .populate('rutaAsignada') 
        .select('-password');
  
      if (!driver) {
        return res.status(404).json({ message: 'Chofer no encontrado' });
      }
  
      res.json(driver);
    } catch (error) {
      console.error('Error al obtener la información del chofer:', error);
      res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
  };


  //actualiza la informacion
  exports.updateDriverProfile = async (req, res) => {
    try {

      const driverId = req.user.userId; // Asegúrate de que esto coincida con cómo obtienes el ID del chofer autenticado
      const { nombre, apellidos, email} = req.body;
  
  
      const updateData = {
        ...(nombre && { nombre }),
        ...(apellidos && { apellidos }),
        ...(email && { email }),
      };
      // Actualizar el documento del chofer en la base de datos
      const updatedDriver = await Driver.findByIdAndUpdate(driverId, updateData, { new: true });
      res.status(200).json({ message: 'Perfil actualizado con éxito', driver: updatedDriver });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
  };