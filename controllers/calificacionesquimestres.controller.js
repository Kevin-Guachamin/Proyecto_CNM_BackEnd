// controllers/quimestres.controller.js
const { Op } = require('sequelize');
const Calificaciones = require('../models/calificaciones.model');

// Helpers para quimestre
const letterToNumber = (letter) => {
  const mapping = { A: 10, B: 9, C: 8, D: 7, E: 6 };
  return mapping[letter] || 0;
};

const numberToLetter = (num) => {
  const rounded = Math.ceil(num);
  if (rounded >= 10) return 'A';
  if (rounded === 9) return 'B';
  if (rounded === 8) return 'C';
  if (rounded === 7) return 'D';
  return 'E';
};

const calculateQuimestreFinal = (partial1Final, partial2Final, examQuimestre) => {
  const avgPartials = (partial1Final + partial2Final) / 2;
  const weightedPartials = avgPartials * 0.7;
  const examWeighted = parseFloat(examQuimestre) * 0.3;
  return parseFloat((weightedPartials + examWeighted).toFixed(2));
};

const calculateQuimestreBehavior = (letter1, letter2) => {
  const num1 = letterToNumber(letter1);
  const num2 = letterToNumber(letter2);
  const avg = (num1 + num2) / 2;
  return numberToLetter(avg);
};

/**
 * UPDATE o CREATE registro de Quimestre
 * POST /api/quimestres
 * 
 * Request body:
 * {
 *    "id_matricula_asignacion": <number>,
 *    "quimistre": "Q1" o "Q2",
 *    "examenQuimestre": <number>
 * }
 * 
 * Este endpoint solo permite agregar la nota del examen quimestral. Se recuperan los dos parciales previamente registrados para el quimestre indicado (por ejemplo, 
 * se identifica uno con valor en "nota1" y otro en "nota2"). Con estos se calcula:
 *  - La nota final del quimestre: (promedio de los parciales ponderado al 70% + examen quimestral ponderado al 30%)
 *  - El comportamiento final del quimestre, promediando los comportamientos de cada parcial.
 * 
 * Cuando se haga el GET, se devolverá toda la información calculada.
 */
module.exports.updateQuimestre = async (req, res) => {
  try {
    const { id_matricula_asignacion, quimistre, examenQuimestre } = req.body;
    if (!id_matricula_asignacion || !quimistre || examenQuimestre === undefined) {
      return res.status(400).json({ message: "Faltan datos requeridos." });
    }
    
    // Recuperar parcial 1 (con nota1) para este quimestre
    const partial1 = await Calificaciones.findOne({
      where: {
        id_matricula_asignacion,
        quimistre,
        nota1: { [Op.ne]: null }
      }
    });
    // Recuperar parcial 2 (con nota2) para este quimestre
    const partial2 = await Calificaciones.findOne({
      where: {
        id_matricula_asignacion,
        quimistre,
        nota2: { [Op.ne]: null }
      }
    });
    
    if (!partial1 || !partial2) {
      return res.status(400).json({ message: "No se encontraron ambos parciales para este quimestre." });
    }
    
    // Se asume que los registros parciales ya tienen guardada la nota final en nota1 y nota2 respectivamente.
    const partial1Final = parseFloat(partial1.nota1);
    const partial2Final = parseFloat(partial2.nota2);
    
    // Calcular nota final del quimestre con la nota de examen ingresada
    const quimestreFinal = calculateQuimestreFinal(partial1Final, partial2Final, examenQuimestre);
    // Calcular comportamiento final promediando los comportamientos (que están guardados como letras en cada parcial)
    const quimestreBehavior = calculateQuimestreBehavior(partial1.comportamiento, partial2.comportamiento);
    
    // Se utiliza un registro en Calificaciones para almacenar el quimestre final.
    // Se asume que este registro se identifica por tener NULL en nota1 y nota2 (o alguna otra convención).
    let quimestreRecord = await Calificaciones.findOne({
      where: { id_matricula_asignacion, quimistre, nota1: null, nota2: null }
    });
    if (!quimestreRecord) {
      quimestreRecord = await Calificaciones.create({
        id_matricula_asignacion,
        quimistre,
        nota1: quimestreFinal,  // Guardamos la nota final del quimestre en nota1
        examen: examenQuimestre,
        comportamiento: quimestreBehavior
      });
    } else {
      await Calificaciones.update({
        nota1: quimestreFinal,
        examen: examenQuimestre,
        comportamiento: quimestreBehavior
      }, { where: { ID: quimestreRecord.ID } });
      quimestreRecord = await Calificaciones.findByPk(quimestreRecord.ID);
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
 * Al llamar este endpoint se devuelve toda la información calculada:
 * los valores de los parciales (nota final de cada uno, examen de parcial, comportamiento, etc.),
 * la nota del examen quimestral, la nota final del quimestre y el comportamiento final.
 */
module.exports.getQuimestre = async (req, res) => {
  try {
    const id = req.params.id;
    const quimestreRecord = await Calificaciones.findByPk(id);
    if (!quimestreRecord) {
      return res.status(404).json({ message: "Registro de quimestre no encontrado." });
    }
    return res.status(200).json(quimestreRecord);
  } catch (error) {
    console.error("Error en getQuimestre:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
/**
 * GET ALL quimestres
 * GET /api/quimestres
 * 
 * Este endpoint retorna todos los registros que se consideran de quimestre final.
 * Se asume que estos registros tienen: 
 *   - "quimistre" definido ("Q1" o "Q2")
 *   - "nota2" es null (ya que en el registro de quimestre solo se usa nota1 para guardar el resultado final)
 *   - Además, se espera que tengan valor en "examen" (la nota del examen quimestral) y "comportamiento" (el comportamiento final)
 */
module.exports.getAllQuimestres = async (req, res) => {
    try {
      const quimestres = await Calificaciones.findAll({
        where: {
          quimistre: { [Op.in]: ['Q1', 'Q2'] },
          nota2: null, // Indicativo de que es un registro de quimestre final
          examen: { [Op.ne]: null } // Aseguramos que tiene nota del examen quimestral
        }
      });
      return res.status(200).json(quimestres);
    } catch (error) {
      console.error("Error en getAllQuimestres:", error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
  };
  