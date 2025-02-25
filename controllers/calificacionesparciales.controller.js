const { Op } = require('sequelize');
const Calificaciones = require('../models/calificaciones.model');

// Helpers para cálculos parciales
const calculateLearningAvg = (notas) => {
  return (parseFloat(notas[0]) + parseFloat(notas[1])) / 2;
};

const calculatePartialFinal = (notas, exam) => {
  const learningAvg = calculateLearningAvg(notas);
  const learningPonderado = learningAvg * 0.7;
  const examPonderado = parseFloat(exam) * 0.3;
  return {
    learningAvg: parseFloat(learningAvg.toFixed(2)),
    learningPonderado: parseFloat(learningPonderado.toFixed(2)),
    examPonderado: parseFloat(examPonderado.toFixed(2)),
    partialFinal: parseFloat((learningPonderado + examPonderado).toFixed(2))
  };
};

const calculateBehavior = (behaviorArray) => {
  const sum = behaviorArray.reduce((acc, val) => acc + val, 0);
  let letter = '';
  if (sum >= 0 && sum <= 4) letter = 'E';
  else if (sum >= 5 && sum <= 6) letter = 'D';
  else if (sum >= 7 && sum <= 8) letter = 'C';
  else if (sum === 9) letter = 'B';
  else if (sum === 10) letter = 'A';
  return { behaviorSum: sum, behaviorLetter: letter };
};

/**
 * CREATE parcial
 * POST /api/parciales
 */
module.exports.createParcial = async (req, res) => {
  try {
    const { id_matricula_asignacion, quimistre, parcial, notasParcial, examenParcial, comportamiento } = req.body;
    if (!id_matricula_asignacion || !quimistre || !parcial || !notasParcial || examenParcial === undefined || !comportamiento) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    if (!Array.isArray(notasParcial) || notasParcial.length !== 2) {
      return res.status(400).json({ message: "notasParcial debe ser un array de 2 números" });
    }
    if (!Array.isArray(comportamiento) || comportamiento.length !== 10) {
      return res.status(400).json({ message: "comportamiento debe ser un array de 10 valores" });
    }
    
    // Cálculos del parcial
    const { learningAvg, learningPonderado, examPonderado, partialFinal } = calculatePartialFinal(notasParcial, examenParcial);
    const { behaviorSum, behaviorLetter } = calculateBehavior(comportamiento);
    
    // Objeto de respuesta con cálculos
    const computed = {
      notasParcial,
      learningAvg,
      learningPonderado,
      examenParcial,
      examPonderado,
      partialFinal,
      comportamiento,
      behaviorSum,
      behaviorLetter
    };
    
    // Se usará "nota1" para parcial 1 y "nota2" para parcial 2;
    // "examen" guardará el exam ponderado y "comportamiento" la letra calculada.
    let createData = {
      id_matricula_asignacion,
      quimistre,  // Para agrupar por quimestre (por ejemplo, "Q1")
      examen: examPonderado,
      comportamiento: behaviorLetter
    };
    if (parseInt(parcial) === 1) {
      createData.nota1 = partialFinal;
    } else if (parseInt(parcial) === 2) {
      createData.nota2 = partialFinal;
    } else {
      return res.status(400).json({ message: "parcial debe ser 1 o 2" });
    }
    
    const newPartial = await Calificaciones.create(createData);
    return res.status(201).json({ dbRecord: newPartial.toJSON(), computed });
    
  } catch (error) {
    console.error("Error en createParcial:", error);
    if (error.name === "SequelizeValidationError") {
      const msgs = error.errors.map(e => e.message);
      return res.status(400).json({ message: msgs });
    }
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * GET parcial por ID
 * GET /api/parciales/:id
 */
module.exports.getParcial = async (req, res) => {
  try {
    const id = req.params.id;
    const partialRecord = await Calificaciones.findByPk(id);
    if (!partialRecord) {
      return res.status(404).json({ message: "Registro parcial no encontrado" });
    }
    return res.status(200).json(partialRecord);
  } catch (error) {
    console.error("Error en getParcial:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * UPDATE parcial por ID
 * PUT /api/parciales/:id
 * Se espera enviar en el body los campos a actualizar (se puede volver a calcular)
 */
module.exports.updateParcial = async (req, res) => {
  try {
    const id = req.params.id;
    const { notasParcial, examenParcial, comportamiento, parcial } = req.body;
    
    if (!notasParcial || !examenParcial || !comportamiento || !parcial) {
      return res.status(400).json({ message: "Faltan datos para actualizar" });
    }
    
    // Recalcular valores
    const { partialFinal } = calculatePartialFinal(notasParcial, examenParcial);
    const { behaviorLetter } = calculateBehavior(comportamiento);
    
    let updateData = {
      examen: parseFloat(examenParcial) * 0.3, // exam ponderado
      comportamiento: behaviorLetter
    };
    if (parseInt(parcial) === 1) {
      updateData.nota1 = partialFinal;
    } else if (parseInt(parcial) === 2) {
      updateData.nota2 = partialFinal;
    } else {
      return res.status(400).json({ message: "parcial debe ser 1 o 2" });
    }
    
    const [updatedRows] = await Calificaciones.update(updateData, { where: { ID: id } });
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Registro parcial no encontrado" });
    }
    const updatedPartial = await Calificaciones.findByPk(id);
    return res.status(200).json(updatedPartial);
    
  } catch (error) {
    console.error("Error en updateParcial:", error);
    if (error.name === "SequelizeValidationError") {
      const msgs = error.errors.map(e => e.message);
      return res.status(400).json({ message: msgs });
    }
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * DELETE parcial por ID
 * DELETE /api/parciales/:id
 */
module.exports.deleteParcial = async (req, res) => {
  try {
    const id = req.params.id;
    const partialRecord = await Calificaciones.findByPk(id);
    if (!partialRecord) {
      return res.status(404).json({ message: "Registro parcial no encontrado" });
    }
    await Calificaciones.destroy({ where: { ID: id } });
    return res.status(200).json({ message: "Registro parcial eliminado", record: partialRecord });
  } catch (error) {
    console.error("Error en deleteParcial:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * GET ALL parciales
 * GET /api/parciales
 * Retorna todos los registros parciales (aquellos que tengan nota1 o nota2 no nula)
 */
module.exports.getAllParciales = async (req, res) => {
  try {
    const parciales = await Calificaciones.findAll({
      where: {
        [Op.or]: [
          { nota1: { [Op.ne]: null } },
          { nota2: { [Op.ne]: null } }
        ]
      }
    });
    return res.status(200).json(parciales);
  } catch (error) {
    console.error("Error en getAllParciales:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
