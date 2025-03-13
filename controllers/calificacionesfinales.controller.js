const Calificaciones_finales = require('../models/calificaciones_finales');



module.exports.updateFinal = async (req, res) => {
  try {
    const { id_matricula_asignacion, nota_final_Q1, nota_final_Q2, examen_recuperacion, comportamiento_final } = req.body;


    // Buscamos si ya existe un registro quimestral para este id_matricula_asignacion y quimistre
    let finalRecord = await Calificaciones_finales.findOne({
      where: {
        id_matricula_asignacion,

      }
    });

    if (!finalRecord) {
      // Crear el registro quimestral
      finalRecord = await Calificaciones_finales.create({
        id_matricula_asignacion,
        nota_final_Q1,
        nota_final_Q2,
        examen_recuperacion,
        comportamiento_final
      });
    } else {
      // Actualizar el registro existente
      await finalRecord.update({
        id_matricula_asignacion,
        nota_final_Q1,
        nota_final_Q2,
        examen_recuperacion,
        comportamiento_final
      });
    }

    return res.status(200).json({
      finalRecord,
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

    res.status(500).json({ message: `Error al crear o editar en el servidor:` })
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
module.exports.getFinal = async (req, res) => {
  try {
    const id = req.params.id;
    const finalRecord = await Calificaciones_finales.findByPk(id);
    if (!finalRecord) {
      return res.status(404).json({ message: "Registro de quimestre no encontrado." });
    }
    if (finalRecord.parcial !== null) {
      return res.status(400).json({ message: "El ID proporcionado no corresponde a un registro de quimestre." });
    }



    return res.status(200).json({
      finalRecord,
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

/**
 * DELETE quimestre por ID
 * DELETE /api/quimestres/:id
 */
module.exports.deleteFinal = async (req, res) => {
  try {
    const id = req.params.id;
    const finalRecord = await Calificaciones_finales.findByPk(id);
    if (!finalRecord) {
      return res.status(404).json({ message: "Registro de quimestre no encontrado." });
    }
    if (finalRecord.parcial !== null) {
      return res.status(400).json({ message: "El ID proporcionado no corresponde a un registro de quimestre." });
    }
    await Calificaciones_finales.destroy({ where: { ID: id } });
    return res.status(200).json({
      message: "Registro eliminado correctamente.",
      record: finalRecord
    });
  } catch (error) {
    console.error("Error en delete:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

