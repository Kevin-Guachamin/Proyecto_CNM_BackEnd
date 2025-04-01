const Fechas_notas = require('../models/fechas_notas.model');

// Create: Crea un nuevo registro de fecha
const createFechasNotas = async (request, response) => {
  const fecha = request.body;

  // Verificar que se hayan enviado datos
  if (!fecha || Object.keys(fecha).length === 0) {
    return response.status(400).json({
      message: 'No se proporcionaron datos para fecha'
    });
  }

  try {
    // Se crea el registro (debe incluir fecha_inicio, fecha_fin y descripcion)
    const nuevaFecha = await Fechas_notas.create(fecha);
    const result = nuevaFecha.toJSON();

    return response.status(201).json({
      message: 'Fecha creada exitosamente',
      result
    });
  } catch (error) {
    console.log('Error al crear la fecha:', error);
    if (error.name === "SequelizeValidationError") {
      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "notEmpty" ||
        err.validatorKey === "isNumeric" ||
        err.validatorKey === "len" ||
        err.validatorKey === "is_null" ||
        err.validatorKey === "isDate"
      );
      if (errEncontrado) {
        return response.status(400).json({ message: errEncontrado.message });
      }
    }
    if (error instanceof TypeError) {
      return response.status(400).json({ message: "Debe completar todos los campos" });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "not_unique"
      );
      if (errEncontrado) {
        return response.status(400).json({ message: `${errEncontrado.path} debe ser único` });
      }
    }
    return response.status(500).json({ message: "Error al crear fecha en el servidor" });
  }
};

// Read: Obtiene un registro de fecha por su ID
const getFechasNotas = async (request, response) => {
  const ID = request.params.id;

  if (!ID || ID.trim() === '') {
    return response.status(400).json({
      message: 'El ID de fecha_notas es requerido'
    });
  }

  try {
    const fecha_nota = await Fechas_notas.findByPk(ID);
    if (!fecha_nota) {
      return response.status(404).json({
        message: 'No se encontró la fecha'
      });
    }
    return response.status(200).json(fecha_nota);
  } catch (error) {
    console.log("Error al obtener la fecha:", error);
    if (error.name === "SequelizeValidationError") {
      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "notEmpty" ||
        err.validatorKey === "isNumeric" ||
        err.validatorKey === "len" ||
        err.validatorKey === "is_null" ||
        err.validatorKey === "isDate"
      );
      if (errEncontrado) {
        return response.status(400).json({ message: errEncontrado.message });
      }
    }
    if (error instanceof TypeError) {
      return response.status(400).json({ message: "Debe completar todos los campos" });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return response.status(400).json({ message: error.message });
    }
    return response.status(500).json({ message: "Error al obtener la fecha en el servidor" });
  }
};

// Read All: Obtiene todos los registros de fechas
const getAllFechasNotas = async (request, response) => {
  try {
    const fechas = await Fechas_notas.findAll();
    return response.status(200).json(fechas);
  } catch (error) {
    console.log("Error al obtener todas las fechas:", error);
    return response.status(500).json({ message: "Error al obtener las fechas en el servidor" });
  }
};

// Update: Actualiza un registro de fecha según su ID
const updateFechasNotas = async (request, response) => {
  const ID = request.params.id;
  const fechaActualizar = request.body;

  if (!ID || ID.trim() === "") {
    return response.status(400).json({
      message: 'El ID de la fecha es requerido'
    });
  }

  try {
    // Verificar que la fecha exista
    const fecha = await Fechas_notas.findByPk(ID);
    if (!fecha) {
      return response.status(404).json({
        message: 'La fecha no existe'
      });
    }

    // Verificar que se hayan enviado datos para actualizar
    if (Object.keys(fechaActualizar).length === 0) {
      return response.status(400).json({
        message: 'No hay datos para actualizar'
      });
    }

    // No permitir la actualización del ID
    if (fechaActualizar.ID) {
      return response.status(400).json({
        message: 'No se permite la actualización del ID'
      });
    }

    const [updatedRows] = await Fechas_notas.update(fechaActualizar, { where: { ID } });
    if (updatedRows === 0) {
      return response.status(200).json({
        message: 'No se realizaron cambios en la fecha',
        update: false  
      });
    }
    const updatedFecha = await Fechas_notas.findByPk(ID);
    const result = updatedFecha.toJSON();

    return response.status(200).json({
      message: 'Fecha actualizada exitosamente',
      result
    });
  } catch (error) {
    console.log('Error al actualizar la fecha:', error);
    if (error.name === 'SequelizeValidationError') {
      const mensajes = error.errors.map(err => err.message);
      return response.status(400).json({ message: mensajes });
    }
    if (error instanceof TypeError) {
      return response.status(400).json({ message: "Debe completar todos los campos" });
    }
    return response.status(500).json({ message: 'Error al actualizar la fecha en el servidor' });
  }
};

// Delete: Elimina un registro de fecha según su ID
const deleteFechasNotas = async (request, response) => {
  const ID = request.params.id;

  if (!ID || ID.trim() === '') {
    return response.status(400).json({
      message: 'El ID de fecha_notas es requerido'
    });
  }

  try {
    const fecha_nota = await Fechas_notas.findByPk(ID);
    if (!fecha_nota) {
      return response.status(404).json({
        message: 'No se encontró la fecha'
      });
    }

    const rowsDeleted = await Fechas_notas.destroy({ where: { ID } });
    if (rowsDeleted > 0) {
      return response.status(200).json({
        message: 'Fecha eliminada exitosamente'
      });
    } else {
      return response.status(404).json({
        message: 'Fecha no encontrada o ya eliminada'
      });
    }
  } catch (error) {
    console.log('Error al eliminar la fecha:', error);
    if (error.name === 'SequelizeValidationError') {
      const mensajes = error.errors.map(err => err.message);
      return response.status(400).json({ message: mensajes });
    }
    return response.status(500).json({ message: 'Error al eliminar la fecha en el servidor' });
  }
};

module.exports = {
  createFechasNotas,
  getFechasNotas,
  getAllFechasNotas,
  updateFechasNotas,
  deleteFechasNotas
};
