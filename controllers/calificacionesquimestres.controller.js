const { Op } = require('sequelize');
const Calificaciones = require('../models/calificaciones.model');
const Matricula_Asignacion = require('../models/matricula_asignacion.model');

// Helpers para cálculos parciales (los mismos que usas en parciales)
const calculateLearningAvg = (notas) => {
  return (parseFloat(notas[0]) + parseFloat(notas[1])) / 2;
};

const calculatePartialFinal = (notas, exam) => {
  const learningAvg = calculateLearningAvg(notas);
  const learningPonderado = learningAvg * 0.7;
  const examPonderado = parseFloat(exam) * 0.3;
  return parseFloat((learningPonderado + examPonderado).toFixed(2));
};

const calculateBehavior = (behaviorArray) => {
  const sum = behaviorArray.reduce((acc, val) => acc + val, 0);
  let letter = '';
  if (sum >= 0 && sum <= 4) letter = 'E';
  else if (sum >= 5 && sum <= 6) letter = 'D';
  else if (sum >= 7 && sum <= 8) letter = 'C';
  else if (sum === 9) letter = 'B';
  else if (sum === 10) letter = 'A';
  return letter;
};

// Helpers para el quimestre
// La nota final del quimestre se calcula de la siguiente forma:
//   - Se obtiene la nota final de cada parcial (P1 y P2)
//   - Se calcula su promedio, ponderado al 70%
//   - Se suma el 30% de la nota del examen quimestral (recibida en el request)
const calculateQuimestreFinal = (partial1Final, partial2Final, examenQuimestre) => {
  const avgPartials = (partial1Final + partial2Final) / 2;
  const weightedPartials = avgPartials * 0.7;
  const examWeighted = parseFloat(examenQuimestre) * 0.3;
  return parseFloat((weightedPartials + examWeighted).toFixed(2));
};

/**
 * UPDATE o CREATE registro de Quimestre
 * POST /api/quimestres
 * 
 * Se espera en el body:
 * {
 *   "id_matricula_asignacion": <number>,
 *   "quimistre": "Q1" o "Q2",
 *   "examenQuimestre": <number>
 * }
 * 
 * La lógica es:
 *   1. Buscar los dos parciales (P1 y P2) para ese id_matricula_asignacion y quimistre.
 *   2. Calcular la nota final de cada parcial usando calculatePartialFinal.
 *   3. Calcular la nota final del quimestre combinando (70% promedio de parciales + 30% examen quimestral).
 *   4. Crear (o actualizar) un registro en Calificaciones con:
 *         - quimistre definido (Q1 o Q2)
 *         - parcial: null (para distinguirlo de los parciales)
 *         - nota1: se guarda la nota final del quimestre
 *         - examen: la nota del examen quimestral
 *         - comportamiento: se puede calcular según tu lógica (por ejemplo, podrías combinar el comportamiento de los parciales)
 */
module.exports.updateQuimestre = async (req, res) => {
  try {
    const { id_matricula_asignacion, quimistre, examenQuimestre } = req.body;
    if (!id_matricula_asignacion || !quimistre || examenQuimestre === undefined) {
      return res.status(400).json({ message: "Faltan datos requeridos." });
    }

    // Buscamos los parciales para el quimestre (filtrando por id_matricula_asignacion y quimistre)
    const partial1 = await Calificaciones.findOne({
      where: {
        id_matricula_asignacion,
        quimistre,
        parcial: 'P1'
      }
    });
    const partial2 = await Calificaciones.findOne({
      where: {
        id_matricula_asignacion,
        quimistre,
        parcial: 'P2'
      }
    });

    if (!partial1 || !partial2) {
      return res.status(400).json({ message: "No se encontraron ambos parciales (P1 y P2) para este quimestre." });
    }

    // Calcular la nota final de cada parcial
    const partial1Final = calculatePartialFinal(
      [partial1.nota1, partial1.nota2],
      partial1.examen
    );
    const partial2Final = calculatePartialFinal(
      [partial2.nota1, partial2.nota2],
      partial2.examen
    );

    // (Opcional) Calcular un comportamiento combinado si lo necesitas
    const partial1Behavior = calculateBehavior(partial1.comportamiento);
    const partial2Behavior = calculateBehavior(partial2.comportamiento);
    // Puedes definir una lógica para combinar las letras, aquí se podría elegir la mejor o un promedio basado en un mapeo.
    // En este ejemplo, simplemente dejamos el de P1.
    const quimestreBehavior = partial1Behavior; 

    // Calcular la nota final del quimestre
    const quimestreFinal = calculateQuimestreFinal(partial1Final, partial2Final, examenQuimestre);

    // Buscamos si ya existe un registro quimestral para este id_matricula_asignacion y quimistre
    let quimestreRecord = await Calificaciones.findOne({
      where: {
        id_matricula_asignacion,
        quimistre,
        parcial: null  // Indica que es un registro de quimestre
      }
    });

    if (!quimestreRecord) {
      // Crear el registro quimestral
      quimestreRecord = await Calificaciones.create({
        id_matricula_asignacion,
        quimistre,
        parcial: null,
        nota1: quimestreFinal,      // Guardamos la nota final del quimestre en nota1
        examen: examenQuimestre,    // Nota del examen quimestral
        comportamiento: quimestreBehavior
      });
    } else {
      // Actualizar el registro existente
      await quimestreRecord.update({
        nota1: quimestreFinal,
        examen: examenQuimestre,
        comportamiento: quimestreBehavior
      });
    }

    return res.status(200).json({
      record: quimestreRecord.toJSON(),
      details: {
        partial1Final,
        partial2Final,
        examenQuimestre,
        quimestreFinal,
        quimestreBehavior
      }
    });
  } catch (error) {
    console.error("Error en updateQuimestre:", error);
    if (error.name === "SequelizeValidationError") {
      const msgs = error.errors.map(e => e.message);
      return res.status(400).json({ message: msgs });
    }
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * GET registro de Quimestre por ID
 * GET /api/quimestres/:id
 * 
 * Devuelve el registro quimestral (donde parcial es null) y opcionalmente se pueden incluir
 * los datos de los parciales (P1 y P2) que lo componen.
 */
module.exports.getQuimestre = async (req, res) => {
  try {
    const id = req.params.id;
    const quimestreRecord = await Calificaciones.findByPk(id);
    if (!quimestreRecord) {
      return res.status(404).json({ message: "Registro de quimestre no encontrado." });
    }
    if (quimestreRecord.parcial !== null) {
      return res.status(400).json({ message: "El ID proporcionado no corresponde a un registro de quimestre." });
    }
    
    // Opcional: buscar los parciales asociados para mayor detalle
    const partial1 = await Calificaciones.findOne({
      where: {
        id_matricula_asignacion: quimestreRecord.id_matricula_asignacion,
        quimistre: quimestreRecord.quimistre,
        parcial: 'P1'
      }
    });
    const partial2 = await Calificaciones.findOne({
      where: {
        id_matricula_asignacion: quimestreRecord.id_matricula_asignacion,
        quimistre: quimestreRecord.quimistre,
        parcial: 'P2'
      }
    });
    
    let partial1Data = null;
    let partial2Data = null;
    if (partial1) {
      const p1Final = calculatePartialFinal([partial1.nota1, partial1.nota2], partial1.examen);
      partial1Data = {
        ...partial1.toJSON(),
        partialFinal: p1Final
      };
    }
    if (partial2) {
      const p2Final = calculatePartialFinal([partial2.nota1, partial2.nota2], partial2.examen);
      partial2Data = {
        ...partial2.toJSON(),
        partialFinal: p2Final
      };
    }
    
    return res.status(200).json({
      quimestre: quimestreRecord.toJSON(),
      partial1: partial1Data,
      partial2: partial2Data
    });
  } catch (error) {
    console.error("Error en getQuimestre:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * GET ALL quimestres
 * GET /api/quimestres
 * 
 * Devuelve todos los registros quimestrales (donde parcial es null).
 */
module.exports.getAllQuimestres = async (req, res) => {
  try {
    const quimestres = await Calificaciones.findAll({
      where: {
        parcial: null
      }
    });
    return res.status(200).json(quimestres);
  } catch (error) {
    console.error("Error en getAllQuimestres:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * DELETE quimestre por ID
 * DELETE /api/quimestres/:id
 */
module.exports.deleteQuimestre = async (req, res) => {
  try {
    const id = req.params.id;
    const quimestreRecord = await Calificaciones.findByPk(id);
    if (!quimestreRecord) {
      return res.status(404).json({ message: "Registro de quimestre no encontrado." });
    }
    if (quimestreRecord.parcial !== null) {
      return res.status(400).json({ message: "El ID proporcionado no corresponde a un registro de quimestre." });
    }
    await Calificaciones.destroy({ where: { ID: id } });
    return res.status(200).json({
      message: "Registro de quimestre eliminado correctamente.",
      record: quimestreRecord
    });
  } catch (error) {
    console.error("Error en deleteQuimestre:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
