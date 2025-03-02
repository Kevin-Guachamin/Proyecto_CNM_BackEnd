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
    Promedio: parseFloat(learningAvg.toFixed(2)),
    PromedioPonderado: parseFloat(learningPonderado.toFixed(2)),
    ExamenPonderado: parseFloat(examPonderado.toFixed(2)),
    NotaFinalParcial: parseFloat((learningPonderado + examPonderado).toFixed(2))
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
  return { PromedioComportamiento: sum, NotaComportamientoParcial: letter };
};

/**
 * CREATE parcial
 * POST /api/parciales
 * 
 * Se espera recibir en el body:
 * {
 *   "id_matricula_asignacion": 1,
 *   "quimistre": "Q1",
 *   "parcial": "P1",  // o "P2"
 *   "notasParcial": [7, 8],
 *   "examenParcial": 7.5,
 *   "comportamiento": [1,1,1,1,1,1,1,1,1,1]
 * }
 * 
 * Se guardan las dos notas y el examen sin ponderar, y el array de comportamiento.
 * Los cálculos (nota final, ponderaciones y conversión de comportamiento a letra)
 * se realizan "on the fly" al mostrar los datos.
 */
module.exports.createParcial = async (req, res) => {
  try {
    const { id_matricula_asignacion, quimistre, parcial, notasParcial, examenParcial, comportamiento } = req.body;
    
    // Validar datos requeridos
    if (!id_matricula_asignacion || !quimistre || !parcial || !notasParcial || examenParcial === undefined || !comportamiento) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    if (!Array.isArray(notasParcial) || notasParcial.length !== 2) {
      return res.status(400).json({ message: "notasParcial debe ser un array de 2 números" });
    }
    if (!Array.isArray(comportamiento) || comportamiento.length !== 10) {
      return res.status(400).json({ message: "comportamiento debe ser un array de 10 valores" });
    }
    if (parcial !== "P1" && parcial !== "P2") {
      return res.status(400).json({ message: "parcial debe ser 'P1' o 'P2'" });
    }
    
    
    // Preparar el objeto para crear: 
    // Se guardan las notas tal cual: nota1 = primer elemento, nota2 = segundo.
    const createData = {
      id_matricula_asignacion,
      quimistre,
      parcial,
      insumo1: parseFloat(notasParcial[0]),
      insumo2: parseFloat(notasParcial[1]),
      evaluacion: parseFloat(examenParcial),
      comportamiento
    };
    
    const newPartial = await Calificaciones.create(createData);
    
    // Respuesta sin los valores computados
    return res.status(201).json(newPartial);
    
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
 * Devuelve el registro almacenado junto con los cálculos basados en las notas y comportamiento.
 */
module.exports.getParcial = async (req, res) => {
  try {
    const id = req.params.id;
    const partialRecord = await Calificaciones.findByPk(id);
    if (!partialRecord) {
      return res.status(404).json({ message: "Registro parcial no encontrado" });
    }
    
    // Obtener los valores raw
    const rawNotas = [parseFloat(partialRecord.nota1), parseFloat(partialRecord.nota2)];
    const rawExamen = parseFloat(partialRecord.examen);
    
    // Calcular valores computados
    const computedPartial = calculatePartialFinal(rawNotas, rawExamen);
    const computedBehavior = calculateBehavior(partialRecord.comportamiento);
    
    return res.status(200).json({
      ...partialRecord.toJSON(),
      computed: {
        ...computedPartial,
        ...computedBehavior
      }
    });
  } catch (error) {
    console.error("Error en getParcial:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * GET ALL parciales
 * GET /api/parciales
 * Devuelve todos los registros y en cada uno se agregan los datos calculados.
 */
module.exports.getAllParciales = async (req, res) => {
  try {
    const parciales = await Calificaciones.findAll();
    const results = parciales.map(record => {
      const rec = record.toJSON();
      const rawNotas = [parseFloat(rec.nota1), parseFloat(rec.nota2)];
      const rawExamen = parseFloat(rec.examen);
      const computedPartial = calculatePartialFinal(rawNotas, rawExamen);
      const computedBehavior = calculateBehavior(rec.comportamiento);
      return {
        ...rec,
        computed: {
          ...computedPartial,
          ...computedBehavior
        }
      };
    });
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error en getAllParciales:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * UPDATE parcial por ID
 * PUT /api/parciales/:id
 * Se reciben los datos crudos para recalcular el parcial y se actualizan en la base.
 */
module.exports.updateParcial = async (req, res) => {
  try {
    const id = req.params.id;
    const { notasParcial, examenParcial, comportamiento, parcial } = req.body;
    
    if (!notasParcial || !examenParcial || !comportamiento || !parcial) {
      return res.status(400).json({ message: "Faltan datos para actualizar" });
    }
    if (!Array.isArray(notasParcial) || notasParcial.length !== 2) {
      return res.status(400).json({ message: "notasParcial debe ser un array de 2 números" });
    }
    if (!Array.isArray(comportamiento) || comportamiento.length !== 10) {
      return res.status(400).json({ message: "comportamiento debe ser un array de 10 valores" });
    }
    if (parcial !== "P1" && parcial !== "P2") {
      return res.status(400).json({ message: "parcial debe ser 'P1' o 'P2'" });
    }
    
    // Preparar objeto con los datos actualizados (guardando las notas tal cual)
    const updateData = {
      parcial,
      insumo1: parseFloat(notasParcial[0]),
      insumo2: parseFloat(notasParcial[1]),
      evaluacion: parseFloat(examenParcial),
      comportamiento
    };
    
    const [updatedRows] = await Calificaciones.update(updateData, { where: { ID: id } });
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Registro parcial no encontrado" });
    }
    const updatedPartial = await Calificaciones.findByPk(id);
    const rawNotas = [parseFloat(updatedPartial.nota1), parseFloat(updatedPartial.nota2)];
    const rawExamen = parseFloat(updatedPartial.examen);
    const newComputedPartial = calculatePartialFinal(rawNotas, rawExamen);
    const newComputedBehavior = calculateBehavior(updatedPartial.comportamiento);
    
    return res.status(200).json({
      ...updatedPartial.toJSON(),
      computed: {
        ...newComputedPartial,
        ...newComputedBehavior
      }
    });
    
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
