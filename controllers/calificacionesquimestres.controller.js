const Calificaciones_quimestrales = require('../models/calificaciones_quimistrales');



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
    const { id_matricula_asignacion, notaParcial1, notaParcial2, examen, comportamiento_quimestral, quimestre } = req.body;


    // Buscamos si ya existe un registro quimestral para este id_matricula_asignacion y quimistre
    let quimestreRecord = await Calificaciones_quimestrales.findOne({
      where: {
        id_matricula_asignacion,
        quimestre
      }
    });

    if (!quimestreRecord) {
      // Crear el registro quimestral
      quimestreRecord = await Calificaciones_quimestrales.create({
        id_matricula_asignacion,
        quimestre,
        notaParcial1,
        notaParcial2,
        examen,
        comportamiento_quimestral
      });
    } else {
      // Actualizar el registro existente
      await quimestreRecord.update({
        id_matricula_asignacion,
        quimistre,
        notaParcial1,
        notaParcial2,
        examen,
        comportamiento_quimestral
      });
    }

    return res.status(200).json({
      quimestreRecord,
    });
  } catch (error) {
    console.error("Error en updateQuimestre:", error);
    if (error.name === "SequelizeValidationError") {
      console.log("Estos son los errores", error);

      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "notEmpty" ||
        err.validatorKey === "isNumeric" ||
        err.validatorKey === "len"
      );

      if (errEncontrado) {
        return res.status(400).json({ message: errEncontrado.message });
      }
    }
    if (error instanceof TypeError) {
      return res.status(400).json({ message: "Debe completar todos los campos" })
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: error.message })
    }

    res.status(500).json({ message: `Error en el servidor:` })
    console.log("ESTE ES EL ERROR", error.name)
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
    const quimestreRecord = await Calificaciones_quimestrales.findByPk(id);
    if (!quimestreRecord) {
      return res.status(404).json({ message: "Registro de quimestre no encontrado." });
    }
    if (quimestreRecord.parcial !== null) {
      return res.status(400).json({ message: "El ID proporcionado no corresponde a un registro de quimestre." });
    }



    return res.status(200).json({
      quimestreRecord,
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
    const quimestres = await Calificaciones_quimestrales.findAll({
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
    const quimestreRecord = await Calificaciones_quimestrales.findByPk(id);
    if (!quimestreRecord) {
      return res.status(404).json({ message: "Registro de quimestre no encontrado." });
    }
    if (quimestreRecord.parcial !== null) {
      return res.status(400).json({ message: "El ID proporcionado no corresponde a un registro de quimestre." });
    }
    await Calificaciones_quimestrales.destroy({ where: { ID: id } });
    return res.status(200).json({
      message: "Registro de quimestre eliminado correctamente.",
      record: quimestreRecord
    });
  } catch (error) {
    console.error("Error en deleteQuimestre:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
