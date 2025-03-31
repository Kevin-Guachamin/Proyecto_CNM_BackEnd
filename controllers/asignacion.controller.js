const { where } = require('sequelize');
const Asignacion = require('../models/asignacion.model');
const Docente = require('../models/docente.model');
const Materia = require('../models/materia.model');
const Periodo_Academico = require('../models/periodo_academico.model');

const createAsignacion = async (req, res) => {
  try {
    const asignacion = req.body;
    console.log("Esta es lo que se recibe:", asignacion);

    // Verificar si la asignación ya existe. Cambié la búsqueda para comprobar los parámetros relevantes.
    const asignacionFound = await Asignacion.findOne({
      where: {
        paralelo: asignacion.paralelo,
        horaInicio: asignacion.horaInicio,
        horaFin: asignacion.horaFin,
        dias: asignacion.dias,
        cupos: parseInt(asignacion.cupos, 10),
        id_periodo_academico: asignacion.id_periodo_academico,
        nroCedula_docente: asignacion.nroCedula_docente,
        id_materia: asignacion.id_materia
      }
    });

    if (asignacionFound) {
      return res.status(409).json({ message: "la asignación ya existe" });
    }

    // Crear la asignación si no existe
    const result = await Asignacion.create({
      paralelo: asignacion.paralelo,
      horaInicio: asignacion.horaInicio,
      horaFin: asignacion.horaFin,
      dias: asignacion.dias,
      cupos: parseInt(asignacion.cupos, 10),
      id_periodo_academico: asignacion.id_periodo_academico,
      nroCedula_docente: asignacion.nroCedula_docente,
      id_materia: asignacion.id_materia
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error al crear la asignación", error)
    console.log("ESTE ES EL ERROR", error.name)
    if (error.name === "SequelizeUniqueConstraintError") {
      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "not_unique"

      );
      if (errEncontrado) {
        return res.status(400).json({ message: `${errEncontrado.path} debe ser único` });
      }

    }
    if (error.name === "SequelizeValidationError") {
      console.log("Estos son los errores", error);

      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "notEmpty" ||
        err.validatorKey === "is_null" ||
        err.validatorKey === "isArrayOfValidDays" ||
        err.validatorKey === "validarOrden"
      );

      if (errEncontrado) {
        return res.status(400).json({ message: errEncontrado.message });
      }
    }
    if (error instanceof TypeError) {
      return res.status(400).json({ message: "Debe completar todos los campos" })
    }


    res.status(500).json({ message: `Error al crear asignación en el servidor:` })

  }
}
const updateAsginacion = async (req, res) => {
  try {
    const asignacion = req.body
    console.log("esto es lo que viene", asignacion)
    const id = req.params.id
    const [updatedRows] = await Asignacion.update(asignacion, { where: { id } })
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Asignación no encontrada" })
    }
    const result = await Asignacion.findByPk(id, {
      include: [
        { model: Materia },
        { model: Docente }
      ]
    })
    const asignacionFinal = result.get({ plain: true }); // Convertimos la asignación a un objeto plano

    // Eliminamos las contraseñas de los docentes
    if (asignacionFinal.Docente) {
      delete asignacionFinal.Docente.password;
    }

    // Renombramos Materium a Materia
    if (asignacionFinal.Materium) {
      asignacionFinal.Materia = asignacionFinal.Materium;
      delete asignacionFinal.Materium;
    }

    // Devolvemos la asignación final
    res.status(200).json(asignacionFinal);
  } catch (error) {
    console.error("Error al editar la asignación", error)
    console.log("ESTE ES EL ERROR", error.name)
    if (error.name === "SequelizeUniqueConstraintError") {
      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "not_unique"

      );
      if (errEncontrado) {
        return res.status(400).json({ message: `${errEncontrado.path} debe ser único` });
      }

    }
    if (error.name === "SequelizeValidationError") {
      console.log("Estos son los errores", error);

      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "notEmpty" ||
        err.validatorKey === "is_null" ||
        err.validatorKey === "isArrayOfValidDays" ||
        err.validatorKey === "validarOrden"
      );

      if (errEncontrado) {
        return res.status(400).json({ message: errEncontrado.message });
      }
    }
    if (error instanceof TypeError) {
      return res.status(400).json({ message: "Debe completar todos los campos" })
    }

    res.status(500).json({ message: `Error al editar asignación en el servidor:` })
    console.log("ESTE ES EL ERROR", error.name)
  }
}
const getAsignacion = async (req, res) => {
  try {
    const { id } = req.params;

    const asignacion = await Asignacion.findByPk(id, {
      include: [
        {
          model: Docente,
          attributes: ["primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido"]
        },
        {
          model: Materia,
          attributes: ["nombre"],
          as: "materiaDetalle"
        },
        {
          model: Periodo_Academico,
          attributes: ["descripcion"] // Ajusta si tu tabla periodo_academico tiene otras columnas
        }
      ]
    });

    if (!asignacion) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }

    // 1. Construimos el nombre completo del docente
    const docente = asignacion.Docente
      ? [
        asignacion.Docente.primer_nombre,
        asignacion.Docente.segundo_nombre,
        asignacion.Docente.primer_apellido,
        asignacion.Docente.segundo_apellido
      ]
        .filter(Boolean)
        .join(" ")
      : null;

    // 2. Reconstruimos el "horario" a partir de "dias", "horaInicio" y "horaFin"
    //    Ejemplo: "Lunes, Miércoles 10:00:00 - 12:00:00"
    let horarioStr = null;
    if (asignacion.dias && asignacion.horaInicio && asignacion.horaFin) {
      const diasStr = asignacion.dias.join(", ");
      horarioStr = `${diasStr} ${asignacion.horaInicio} - ${asignacion.horaFin}`;
    }

    // 3. Obtenemos la descripción del periodo desde Periodo_Academico
    const periodoStr = asignacion.Periodo_Academico
      ? asignacion.Periodo_Academico.descripcion
      : null;

    res.status(200).json({
      ID: asignacion.ID,
      paralelo: asignacion.paralelo,
      horario: horarioStr,        // <-- reconstruido
      periodo: periodoStr,        // <-- viene de Periodo_Academico.descripcion
      docente,
      materia: asignacion.materiaDetalle?.nombre || null,
      createdAt: asignacion.createdAt,
      updatedAt: asignacion.updatedAt
    });
  } catch (error) {
    console.error("Error al obtener la asignación", error);
    res.status(500).json({ message: "Error al obtener la asignación en el servidor" });
  }
};

const deleteAsignacion = async (req, res) => {
  try {

    const id = req.params.id
    const asignacion = await Asignacion.findByPk(id)
    if (!asignacion) {
      return res.status(404).json({ message: "Asignación no encontrada" })
    }
    await Asignacion.destroy({ where: { id } })

    res.status(200).json(asignacion)
  } catch (error) {
    console.error("Error al eliminar la asignación", error)
    res.status(500).json({ message: `Error al eliminar la asignación en el servidor:` })
  }
}

const obtenerAsignacionesPorDocente = async (req, res) => {
  try {
    const { id_docente } = req.params;

    // Incluye las relaciones necesarias: Docente, Materia y Periodo_Academico
    const asignaciones = await Asignacion.findAll({
      where: { nroCedula_docente: id_docente },
      include: [
        {
          model: Docente,
          attributes: ["primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido"]
        },
        {
          model: Materia,
          attributes: ["nombre"],
          as: "materiaDetalle"
        },
        {
          model: Periodo_Academico,
          attributes: ["descripcion"]
        }
      ]
    });

    // Si no hay asignaciones, retornar un 404
    if (!asignaciones.length) {
      return res.status(404).json({ message: "No hay asignaciones para este docente" });
    }

    // Construye el array de resultados con los campos que necesitas
    const resultado = asignaciones.map(asignacion => {
      // 1. Nombre completo del docente
      const docente = asignacion.Docente
        ? [
          asignacion.Docente.primer_nombre,
          asignacion.Docente.segundo_nombre,
          asignacion.Docente.primer_apellido,
          asignacion.Docente.segundo_apellido
        ]
          .filter(Boolean)
          .join(" ")
        : null;

      // 2. Reconstruir el horario: ej. "Lunes, Miércoles 10:00:00 - 12:00:00"
      let horarioStr = null;
      if (asignacion.horaInicio && asignacion.horaFin && asignacion.dias) {
        const diasStr = asignacion.dias.join(", ");
        horarioStr = `${diasStr} ${asignacion.horaInicio} - ${asignacion.horaFin}`;
      }

      // 3. Tomar la descripción del período académico
      const periodoStr = asignacion.Periodo_Academico
        ? asignacion.Periodo_Academico.descripcion
        : null;

      return {
        ID: asignacion.ID,
        paralelo: asignacion.paralelo,
        horario: horarioStr,                  // Reconstruido
        periodo: periodoStr,                  // Descripción del período
        docente,                              // Nombre completo
        materia: asignacion.materiaDetalle?.nombre || null,
        createdAt: asignacion.createdAt,
        updatedAt: asignacion.updatedAt
      };
    });

    // Retornar el resultado
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener asignaciones", error);
    res.status(500).json({ message: "Error al obtener las asignaciones en el servidor" });
  }
};

const obtenerAsignacionesPorNivel = async (req, res) => {
  try {
    const nivel = req.params.nivel;
    const ID = req.params.periodo
    console.log("estos fueron los parametros", nivel, ID)
    const asignaciones = await Asignacion.findAll({
      where: {
        id_periodo_academico: ID,
        paralelo: { [Op.ne]: "Individual" }
      },
      include: [
        {
          model: Materia,
          where: { nivel },

        },
        {
          model: Docente
        },

      ]
    })

    const asignacionesFinal = asignaciones.map((asignacion) => {
      const asignacionPlain = asignacion.get({ plain: true }); // Convertimos el resultado a un objeto plano
      // Eliminamos las contraseñas de los docentes
      if (asignacionPlain.Docente) {
        delete asignacionPlain.Docente.password;
      }
      // Renombramos Materium a Materia
      if (asignacionPlain.Materium) {
        asignacionPlain.Materia = asignacionPlain.Materium;
        delete asignacionPlain.Materium;
      }
      return asignacionPlain;
    });
    console.log("estas fueron las asignaciones finales", asignacionesFinal)
    return res.json(asignacionesFinal);
  } catch (error) {
    console.error("Error al obtener asignaciones por nivel:", error);
    return res.status(500).json({ message: "Error al obtener asignaciones en el servidor" });
  }
}
const getAsignaciones = async (req, res) => {
  try {
    const periodo = req.params.periodo
    console.log("este es el periodo", periodo)
    const asignaciones = await Asignacion.findAll({
      where: {
        id_periodo_academico: periodo,
        paralelo: { [Op.ne]: "Individual" }
      },
      include: [

        { model: Materia },
        { model: Docente },
      ]
    })
    const asignacionesFinal = asignaciones.map((asignacion) => {
      const asignacionPlain = asignacion.get({ plain: true }); // Convertimos el resultado a un objeto plano
      // Eliminamos las contraseñas de los docentes
      if (asignacionPlain.Docente) {
        delete asignacionPlain.Docente.password;
      }
      // Renombramos Materium a Materia
      if (asignacionPlain.Materium) {
        asignacionPlain.Materia = asignacionPlain.Materium;
        delete asignacionPlain.Materium;
      }
      return asignacionPlain;
    });
    res.status(200).json(asignacionesFinal)
  } catch (error) {
    console.error("Error al obtener docentes", error)
    res.status(500).json({ message: `Error al obtener docentes en el servidor:` })
  }
}

module.exports = {
  createAsignacion,
  updateAsginacion,
  getAsignacion,
  deleteAsignacion,
  obtenerAsignacionesPorDocente,
  obtenerAsignacionesPorNivel,
  getAsignaciones
}