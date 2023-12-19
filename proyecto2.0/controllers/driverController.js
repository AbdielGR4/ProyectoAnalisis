const { User, Admin, Driver } = require('../models/user');
const Ruta = require('../models/route');

require('dotenv').config();
const bcrypt = require('bcrypt');


//registro de choferes
exports.registerDriver = async (req, res) => {
    try {
      const ruta = await Ruta.findById(req.body.rutaAsignada);
      if (!ruta) {
        return res.status(400).json({ message: 'Ruta asignada no existe' });
      }
  
      // Hashea la contraseña
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      const newDriver = new Driver({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        password: hashedPassword,
        rutaAsignada: req.body.rutaAsignada,
        wallet: 0, 
        rol: 'chofer' 
      });
  
      // Guarda el chofer en la base de datos
      await newDriver.save();
  
      res.status(201).json({ message: 'Chofer registrado con éxito' });
    } catch (error) {
      console.error('Error al registrar el chofer:', error);
      if (error.code === 11000) {
        res.status(409).json({ message: 'El email o el código CTP ya está registrado' });
      } else {
        res.status(500).json({ message: 'Error al registrar el chofer', error: error.message });
      }
    }
  };
  
  exports.getAllDrivers = async (req, res) => {
    try {
      const drivers = await Driver.find().populate('rutaAsignada');
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los choferes', error: error.message });
    }
  };
  
  exports.deleteDriver = async (req, res) => {
    try {
        const driverId = req.params.id;
        const driver = await Driver.findByIdAndDelete(driverId);
  
        if (!driver) {
            return res.status(404).json({ message: "Chofer no encontrado" });
        }
  
        res.status(200).json({ message: "Chofer eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el chofer", error: error.message });
    }
  };
  
  //obtiene la informacion del chofer
  exports.getDriverInfo = async (req, res) => {
    try {
      const driverId = req.params.driverId || req.user.userId;
  
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

  exports.updateDriverProfile = async (req, res) => {
    try {

      const driverId = req.user.userId; 
      const { nombre, apellidos, email} = req.body;
  
  
      const updateData = {
        ...(nombre && { nombre }),
        ...(apellidos && { apellidos }),
        ...(email && { email }),
      };
      const updatedDriver = await Driver.findByIdAndUpdate(driverId, updateData, { new: true });
      res.status(200).json({ message: 'Perfil actualizado con éxito', driver: updatedDriver });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
  };