const Calificaciones = require('../models/calificaciones.model');

// Función para calcular la nota final de un parcial
function calculatePartialFinal(notas, examen) {
  const average = (parseFloat(notas[0]) + parseFloat(notas[1])) / 2;
  const learningPonderado = average * 0.7;
  const examPonderado = parseFloat(examen) * 0.3;
  return parseFloat((learningPonderado + examPonderado).toFixed(2));
}

// Función para calcular la nota final del quimestre
function calculateQuimestreFinal(partial1Final, partial2Final, examenQuimestre) {
  const promedioParciales = (partial1Final + partial2Final) / 2;
  return parseFloat(((promedioParciales * 0.7) + (examenQuimestre * 0.3)).toFixed(2));
}

/**
 * Calcula el comportamiento quimestral como un NÚMERO.
 * 1. Suma el array de comportamiento de P1 y de P2 (cada uno puede ir de 0 a 10).
 * 2. Promedia las sumas.
 * 3. Redondea hacia arriba (Math.ceil).
 * 4. Retorna ese número (entre 0 y 10).
 */
function calculateQuimestreBehaviorNumber(behaviorArray1, behaviorArray2) {
  const sum1 = behaviorArray1.reduce((acc, val) => acc + val, 0); // máx 10
  const sum2 = behaviorArray2.reduce((acc, val) => acc + val, 0); // máx 10
  const average = (sum1 + sum2) / 2; // promedio entre 0 y 10
  const rounded = Math.ceil(average); // redondea hacia arriba
  return rounded; // Ej: 7, 8, 9, etc.
}

/**
 * Convierte un número (0 a 10) en la letra correspondiente:
 * 0-4 => E, 5-6 => D, 7-8 => C, 9 => B, 10 => A
 */
function convertBehaviorNumberToLetter(num) {
  if (num >= 0 && num <= 4) return 'E';
  if (num >= 5 && num <= 6) return 'D';
  if (num >= 7 && num <= 8) return 'C';
  if (num === 9) return 'B';
  if (num === 10) return 'A';
  return '';
}
// Calcula los campos "al vuelo" para mostrar en GET
function getQuimestreCalculatedFields(record) {
  const nota1 = parseFloat(record.nota1);
  const nota2 = parseFloat(record.nota2);
  const examen = parseFloat(record.examen);
  const comportamientoNum = parseFloat(record.comportamiento) || 0;

  const promedioParciales = (nota1 + nota2) / 2;
  const promedioPonderado = parseFloat((promedioParciales * 0.7).toFixed(2));
  const examenPonderado = parseFloat((examen * 0.3).toFixed(2));
  const notaFinalQuimestre = parseFloat((promedioPonderado + examenPonderado).toFixed(2));

  const comportamientoLetter = convertBehaviorNumberToLetter(comportamientoNum);

  return {
    promedioParciales,
    promedioPonderado,
    examenPonderado,
    notaFinalQuimestre,
    comportamientoLetter
  };
}
/**
 * CREATE Quimestre
 * POST /api/quimestres
 *
 * Body esperado:
 * {
 *   "id_matricula_asignacion": <number>,
 *   "quimistre": "Q1" o "Q2",
 *   "examenQuimestre": <number>
 * }
 */
module.exports.createQuimestre = async (req, res) => {
  try {
    const { id_matricula_asignacion, quimistre, examenQuimestre } = req.body;
    if (!id_matricula_asignacion || !quimistre || examenQuimestre === undefined) {
      return res.status(400).json({ message: "Faltan datos requeridos." });
    }
    
    // Verificar que no exista ya un registro quimestral para este id_matricula_asignacion y quimistre
    const existingRecord = await Calificaciones.findOne({
      where: { id_matricula_asignacion, quimistre, parcial: null }
    });
    if (existingRecord) {
      return res.status(400).json({ message: "Ya existe un registro quimestral para este estudiante y quimestre." });
    }
    
    // Recuperar los parciales P1 y P2
    const parcial1 = await Calificaciones.findOne({
      where: { id_matricula_asignacion, quimistre, parcial: 'P1' }
    });
    const parcial2 = await Calificaciones.findOne({
      where: { id_matricula_asignacion, quimistre, parcial: 'P2' }
    });
    
    if (!parcial1 || !parcial2) {
      return res.status(400).json({ message: "No se encontraron ambos parciales (P1 y P2) para este quimestre." });
    }
    
    // 1. Calcular la nota final de cada parcial
    const partial1Final = calculatePartialFinal([parcial1.nota1, parcial1.nota2], parcial1.examen);
    const partial2Final = calculatePartialFinal([parcial2.nota1, parcial2.nota2], parcial2.examen);
    
    // 2. Calcular la nota final del quimestre (al vuelo)
    const quimestreFinal = calculateQuimestreFinal(partial1Final, partial2Final, parseFloat(examenQuimestre));
    
    // 3. Calcular el comportamiento quimestral como número
    const quimestreBehaviorNumber = calculateQuimestreBehaviorNumber(parcial1.comportamiento, parcial2.comportamiento);
    
    // 4. Crear el registro de quimestre (con parcial en null)
    const quimestreRecord = await Calificaciones.create({
      id_matricula_asignacion,
      quimistre,
      parcial: null,
      nota1: partial1Final,   // nota final de P1
      nota2: partial2Final,   // nota final de P2
      examen: parseFloat(examenQuimestre),
      comportamiento: quimestreBehaviorNumber  // Guardamos el número (ej: 8)
    });
    
    return res.status(201).json({
      message: "Registro quimestral creado exitosamente.",
      record: quimestreRecord.toJSON()
    });
    
  } catch (error) {
    console.error("Error en createQuimestre:", error);
    if (error.name === "SequelizeValidationError") {
      const msgs = error.errors.map(e => e.message);
      return res.status(400).json({ message: msgs });
    }
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * UPDATE Quimestre
 * PUT /api/quimestres/:id
 *
 * Body esperado:
 * {
 *   "examenQuimestre": <number>
 * }
 */
module.exports.updateQuimestre = async (req, res) => {
  try {
    const id = req.params.id;
    const { examenQuimestre } = req.body;
    
    if (examenQuimestre === undefined) {
      return res.status(400).json({ message: "Faltan datos para actualizar." });
    }
    
    // Buscar el registro quimestral (donde parcial es null)
    const quimestreRecord = await Calificaciones.findByPk(id);
    if (!quimestreRecord || quimestreRecord.parcial !== null) {
      return res.status(404).json({ message: "Registro quimestral no encontrado." });
    }
    
    // Recuperar los parciales (P1, P2) asociados a este quimestre
    const { id_matricula_asignacion, quimistre } = quimestreRecord;
    const parcial1 = await Calificaciones.findOne({
      where: { id_matricula_asignacion, quimistre, parcial: 'P1' }
    });
    const parcial2 = await Calificaciones.findOne({
      where: { id_matricula_asignacion, quimistre, parcial: 'P2' }
    });
    
    if (!parcial1 || !parcial2) {
      return res.status(400).json({ message: "No se encontraron ambos parciales para recalcular el quimestre." });
    }
    
    // 1. Calcular la nota final de cada parcial
    const partial1Final = calculatePartialFinal([parcial1.nota1, parcial1.nota2], parcial1.examen);
    const partial2Final = calculatePartialFinal([parcial2.nota1, parcial2.nota2], parcial2.examen);
    
    // 2. Recalcular la nota final del quimestre
    const quimestreFinal = calculateQuimestreFinal(partial1Final, partial2Final, parseFloat(examenQuimestre));
    
    // 3. Recalcular el comportamiento quimestral como número
    const quimestreBehaviorNumber = calculateQuimestreBehaviorNumber(parcial1.comportamiento, parcial2.comportamiento);
    
    // 4. Actualizar el registro
    await quimestreRecord.update({
      nota1: partial1Final,
      nota2: partial2Final,
      examen: parseFloat(examenQuimestre),
      comportamiento: quimestreBehaviorNumber
    });
    
    return res.status(200).json({
      message: "Registro quimestral actualizado exitosamente.",
      record: quimestreRecord.toJSON()
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
 * GET Quimestre por ID
 * GET /api/quimestres/:id
 */
module.exports.getQuimestre = async (req, res) => {
  try {
    const id = req.params.id;
    const quimestreRecord = await Calificaciones.findByPk(id);
    if (!quimestreRecord || quimestreRecord.parcial !== null) {
      return res.status(404).json({ message: "Registro quimestral no encontrado." });
    }

    const calculated = getQuimestreCalculatedFields(quimestreRecord);
    return res.status(200).json({
      ...quimestreRecord.toJSON(),
      calculated
    });
  } catch (error) {
    console.error("Error en getQuimestre:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * GET All Quimestres
 * GET /api/quimestres
 */
module.exports.getAllQuimestres = async (req, res) => {
  try {
    const quimestres = await Calificaciones.findAll({
      where: { parcial: null }
    });
    const results = quimestres.map(record => {
      const base = record.toJSON();
      const calculated = getQuimestreCalculatedFields(base);
      return {
        ...base,
        calculated
      };
    });
    return res.status(200).json(results);
  } catch (error) {
    console.error("Error en getAllQuimestres:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
/**
 * DELETE Quimestre por ID
 * DELETE /api/quimestres/:id
 */
module.exports.deleteQuimestre = async (req, res) => {
  try {
    const id = req.params.id;
    const quimestreRecord = await Calificaciones.findByPk(id);
    if (!quimestreRecord || quimestreRecord.parcial !== null) {
      return res.status(404).json({ message: "Registro quimestral no encontrado." });
    }
    await Calificaciones.destroy({ where: { ID: id } });
    return res.status(200).json({
      message: "Registro quimestral eliminado exitosamente.",
      record: quimestreRecord
    });
  } catch (error) {
    console.error("Error en deleteQuimestre:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

