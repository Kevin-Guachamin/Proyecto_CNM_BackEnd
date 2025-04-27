const { where } = require('sequelize');
const { Op, Sequelize } = require("sequelize");
const Asignacion = require('../models/asignacion.model');
const Docente = require('../models/docente.model');
const Materia = require('../models/materia.model');
const Periodo_Academico = require('../models/periodo_academico.model');
const Matricula = require('../models/matricula.models')
const Inscripcion = require('../models/inscripcion.model');
const matriculaRoute = require('../routes/matricula.route');
const mapearNivelEstudianteAMateria = (nivelEstudiante) => {
  const mapeoNiveles = {
    "1ro Básico Elemental": ["1ro BE"],
    "2do Básico Elemental": ["2do BE"],
    "1ro Básico Medio": ["1ro BM", "BM"],
    "2do Básico Medio": ["2do BM", "BM"],
    "3ro Básico Medio": ["3ro BM", "BM"],
    "1ro Básico Superior": ["1ro BS", "BS", "BS BCH"],
    "2do Básico Superior": ["2do BS", "BS", "BS BCH"],
    "3ro Básico Superior": ["3ro BS", "BS", "BS BCH"],
    "1ro Bachillerato": ["1ro BCH", "BCH", "BS BCH"],
    "2do Bachillerato": ["2do BCH", "BCH", "BS BCH"],
    "3ro Bachillerato": ["3ro BCH", "BCH", "BS BCH"],

  };

  // Si el nivel del estudiante existe en el mapeo, devolvemos los niveles de materia correspondientes
  return mapeoNiveles[nivelEstudiante] || [];
};

const createAsignacion = async (req, res) => {
  try {
    const asignacion = req.body;
    console.log("Esta es lo que se recibe:", asignacion);

    // Verificar si la asignación ya existe. Cambié la búsqueda para comprobar los parámetros relevantes.

    const asignacionesDocente = await Asignacion.findAll({
      where: {
        nroCedula_docente: asignacion.nroCedula_docente,
        ID_periodo_academico: asignacion.ID_periodo_academico
      }
    });


    function tienenDiasSolapados(dias1, dias2) {
      console.log("estos son los días", dias1, dias2)
      return dias1.some(dia => dias2.includes(dia));
    }

    function tienenHorariosSolapados(horaInicioA, horaFinA, horaInicioB, horaFinB) {
      console.log("estas son las horas", horaInicioA, horaFinA, horaInicioB, horaFinB)
      return horaInicioA < horaFinB && horaFinA > horaInicioB;
    }

    // Primero, verifica si hay conflicto de días + horarios
    const conflicto = asignacionesDocente.some(asig => {
      const hayDiasSolapados = tienenDiasSolapados(asig.dias, asignacion.dias);
      const hayHorarioSolapado = tienenHorariosSolapados(
        asignacion.horaInicio,
        asignacion.horaFin,
        asig.horaInicio,
        asig.horaFin
      );

      return hayDiasSolapados && hayHorarioSolapado;
    });

    if (conflicto) {
      return res.status(400).json({
        message: "El docente ya tiene una asignación con cruce de horario en los días seleccionados para este período."
      });
    }




    // Crear la asignación si no existe
    const result1 = await Asignacion.create({
      paralelo: asignacion.paralelo,
      horaInicio: asignacion.horaInicio,
      horaFin: asignacion.horaFin,
      dias: asignacion.dias,
      cupos: parseInt(asignacion.cupos, 10),
      ID_periodo_academico: asignacion.ID_periodo_academico,
      nroCedula_docente: asignacion.nroCedula_docente,
      ID_materia: asignacion.ID_materia,

    })
    const result = await Asignacion.findByPk(result1.ID, {
      include: [
        {
          model: Docente,
        },
        {
          model: Materia,
          as: "materiaDetalle"
        }
      ]
    })
    const asignacionFinal = result.get({ plain: true }); // Convertimos la asignación a un objeto plano

    // Eliminamos las contraseñas de los docentes
    if (asignacionFinal.Docente) {
      delete asignacionFinal.Docente.password;
    }

    // Renombramos Materium a Materia
    if (asignacionFinal.materiaDetalle) {
      asignacionFinal.Materia = asignacionFinal.materiaDetalle;
      delete asignacionFinal.materiaDetalle;
    }

    // Devolvemos la asignación final
    return res.status(200).json(asignacionFinal);




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
        err.validatorKey === "validarOrden" ||
        err.validatorKey === "min"
      );

      if (errEncontrado) {
        return res.status(400).json({ message: errEncontrado.message });
      }
    }



    return res.status(500).json({ message: `Error al crear asignación en el servidor:` })

  }
}
const updateAsginacion = async (req, res) => {
  try {
    const asignacion = req.body
    const asignacionesDocente = await Asignacion.findAll({
      where: {
        nroCedula_docente: asignacion.nroCedula_docente,
        ID_periodo_academico: asignacion.ID_periodo_academico,
        ID: {
          [Op.not]: asignacion.ID  // 👈 Excluye la asignación actual
        }
      }
    });
    console.log("me encontre a mi mismo", asignacionesDocente)

    function tienenDiasSolapados(dias1, dias2) {
      return dias1.some(dia => dias2.includes(dia));
    }

    function tienenHorariosSolapados(horaInicioA, horaFinA, horaInicioB, horaFinB) {
      return horaInicioA < horaFinB && horaFinA > horaInicioB;
    }

    // Primero, verifica si hay conflicto de días + horarios
    const conflicto = asignacionesDocente.some(asig => {
      const hayDiasSolapados = tienenDiasSolapados(asig.dias, asignacion.dias);
      const hayHorarioSolapado = tienenHorariosSolapados(
        asignacion.horaInicio,
        asignacion.horaFin,
        asig.horaInicio,
        asig.horaFin
      );

      return hayDiasSolapados && hayHorarioSolapado;
    });

    if (conflicto) {
      return res.status(400).json({
        message: "El docente ya tiene una asignación con cruce de horario en los días seleccionados para este período."
      });
    }

    console.log("esto es lo que viene", asignacion)
    const id = req.params.id
    const [updatedRows] = await Asignacion.update(asignacion, { where: { id } })
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Asignación no encontrada" })
    }
    const result = await Asignacion.findByPk(id, {
      include: [
        { model: Materia, as: "materiaDetalle" },
        { model: Docente }
      ]
    })
    const asignacionFinal = result.get({ plain: true }); // Convertimos la asignación a un objeto plano

    // Eliminamos las contraseñas de los docentes
    if (asignacionFinal.Docente) {
      delete asignacionFinal.Docente.password;
    }

    // Renombramos Materium a Materia
    if (asignacionFinal.materiaDetalle) {
      asignacionFinal.Materia = asignacionFinal.materiaDetalle;
      delete asignacionFinal.materiaDetalle;
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
        err.validatorKey === "validarOrden" ||
        err.validatorKey === "min"
      );

      if (errEncontrado) {
        return res.status(400).json({ message: errEncontrado.message });
      }
    }

    return res.status(500).json({ message: `Error al editar asignación en el servidor:` })

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
          attributes: ["nombre", "nivel"],
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

    return res.status(200).json({
      ID: asignacion.ID,
      paralelo: asignacion.paralelo,
      horario: horarioStr,        // <-- reconstruido
      periodo: periodoStr,        // <-- viene de Periodo_Academico.descripcion
      docente,
      materia: asignacion.materiaDetalle?.nombre,
      nivel: asignacion.materiaDetalle?.nivel,
      createdAt: asignacion.createdAt,
      updatedAt: asignacion.updatedAt
    });
  } catch (error) {
    console.error("Error al obtener la asignación", error);
    return res.status(500).json({ message: "Error al obtener la asignación en el servidor" });
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

    return res.status(200).json(asignacion)
  } catch (error) {
    console.error("Error al eliminar la asignación", error)
    return res.status(500).json({ message: `Error al eliminar la asignación en el servidor:` })
  }
}

const getAsignacionesPorDocente = async (req, res) => {
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
          attributes: ["nombre", "nivel"],
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
        materia: asignacion.materiaDetalle?.nombre,
        nivel: asignacion.materiaDetalle?.nivel,
        createdAt: asignacion.createdAt,
        updatedAt: asignacion.updatedAt
      };
    });

    // Retornar el resultado
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener asignaciones", error);
    return res.status(500).json({ message: "Error al obtener las asignaciones en el servidor" });
  }
};

const getAsignacionesPorNivel = async (req, res) => {
  try {
    const nivel = req.params.nivel;
    const ID = req.params.periodo
    console.log("estos fueron los parametros", nivel, ID)
    const asignaciones = await Asignacion.findAll({
      where: {
        ID_periodo_academico: ID

      },
      include: [
        {
          model: Materia,
          where: {
            nivel: nivel,
            tipo: { [Op.ne]: "individual" }
          },
          as: "materiaDetalle"

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
      if (asignacionPlain.materiaDetalle) {
        asignacionPlain.Materia = asignacionPlain.materiaDetalle;
        delete asignacionPlain.materiaDetalle;
      }
      return asignacionPlain;
    });

    return res.json(asignacionesFinal);
  } catch (error) {
    console.error("Error al obtener asignaciones por nivel:", error);
    return res.status(500).json({ message: "Error al obtener asignaciones en el servidor" });
  }
}
const getAsignaciones = async (req, res) => {
  try {
    const periodo = req.params.periodo
    let { page = 1, limit = 13 } = req.query;
    console.log("este es el limite que recibo", limit)
    page = parseInt(page)
    limit = parseInt(limit)
    const { count, rows: asignaciones } = await Asignacion.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      where: {
        ID_periodo_academico: periodo,

      },
      include: [

        {
          model: Materia,
          where: {
            tipo: { [Op.ne]: "individual" }
          },
          as: "materiaDetalle"
        },
        { model: Docente },
        {
          model: Periodo_Academico,
          attributes: ["descripcion"]
        }
      ],
      order: [
        [
          Sequelize.literal(`FIELD(materiaDetalle.nivel, 
                  '1ro BE', '2do BE', 
                  '1ro BM', '2do BM', '3ro BM', 
                  '1ro BS', '2do BS', '3ro BS', 
                  '1ro BCH', '2do BCH', '3ro BCH', 
                  'BCH', 'BM', 'BS', 'BS BCH')`),
          'ASC'
        ]
      ]
    })

    const asignacionesFinal = asignaciones.map((asignacion) => {
      const asignacionPlain = asignacion.get({ plain: true }); // Convertimos el resultado a un objeto plano
      // Eliminamos las contraseñas de los docentes
      if (asignacionPlain.Docente) {
        delete asignacionPlain.Docente.password;
      }
      // Renombramos Materium a Materia
      if (asignacionPlain.materiaDetalle) {
        asignacionPlain.Materia = asignacionPlain.materiaDetalle;
        delete asignacionPlain.materiaDetalle;
      }
      return asignacionPlain;
    });
    return res.status(200).json({
      data: asignacionesFinal,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRows: count
    });

  } catch (error) {
    console.error("Error al obtener asignaciones", error)
    return res.status(500).json({ message: `Error al obtener asignaciones en el servidor:` })
  }
}
const getAsignacionesPorPeriodo = async (req, res) => {
  try {
    const periodo = req.params.periodo;

    const asignaciones = await Asignacion.findAll({
      where: {
        ID_periodo_academico: periodo,
      },
      include: [
        {
          model: Materia,
          where: {
            tipo: { [Op.ne]: "individual" }
          },
          as: "materiaDetalle"
        },
        { model: Docente },
        {
          model: Periodo_Academico,
          attributes: ["descripcion"]
        }
      ],
      order: [
        [
          Sequelize.literal(`FIELD(materiaDetalle.nivel, 
            '1ro BE', '2do BE', 
            '1ro BM', '2do BM', '3ro BM', 
            '1ro BS', '2do BS', '3ro BS', 
            '1ro BCH', '2do BCH', '3ro BCH', 
            'BCH', 'BM', 'BS', 'BS BCH')`),
          'ASC'
        ]
      ]
    });

    const asignacionesFinal = asignaciones.map((asignacion) => {
      const asignacionPlain = asignacion.get({ plain: true });
      if (asignacionPlain.Docente) {
        delete asignacionPlain.Docente.password;
      }
      if (asignacionPlain.materiaDetalle) {
        asignacionPlain.Materia = asignacionPlain.materiaDetalle;
        delete asignacionPlain.materiaDetalle;
      }
      return asignacionPlain;
    });

    return res.status(200).json({
      data: asignacionesFinal,
      total: asignacionesFinal.length
    });

  } catch (error) {
    console.error("Error al obtener asignaciones", error);
    return res.status(500).json({ message: `Error al obtener asignaciones en el servidor:` });
  }
}

const getAsignacionesPorAsignatura = async (req, res) => {
  try {

    const ID = req.params.periodo
    const asignatura = req.params.materia
    const nivelEstudiante = req.params.nivel
    const jornada = req.params.jornada
    let inicio
    let fin
    if (jornada === "Matutina") {
      inicio = "07:00:00"
      fin = "12:15:00"
    }
    if (jornada === "Vespertina") {
      inicio = "14:30:00"
      fin = "19:00:00"
    }

    const nivelesMateria = mapearNivelEstudianteAMateria(nivelEstudiante);

    const asignaciones = await Asignacion.findAll({
      where: {
        ID_periodo_academico: ID,
        horaInicio: { [Op.gte]: inicio },
        horaFin: { [Op.lte]: fin }
      },
      include: [
        {
          model: Materia,
          where: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("nombre")), "LIKE", `%${asignatura.toLowerCase()}%`),
            ],
            nivel: {
              [Op.in]: [nivelesMateria]  // Cambiado para usar IN con un arreglo
            }
          },
          as: "materiaDetalle"
        },
        {
          model: Docente
        },
      ]
    });

    const asignacionesFinal = asignaciones.map((asignacion) => {
      const asignacionPlain = asignacion.get({ plain: true }); // Convertimos el resultado a un objeto plano
      // Eliminamos las contraseñas de los docentes
      if (asignacionPlain.Docente) {
        delete asignacionPlain.Docente.password;
      }
      // Renombramos Materium a Materia
      if (asignacionPlain.materiaDetalle) {
        asignacionPlain.Materia = asignacionPlain.materiaDetalle;
        delete asignacionPlain.materiaDetalle;
      }
      return asignacionPlain;
    });

    return res.json(asignacionesFinal);
  } catch (error) {
    console.error("Error al obtener asignaciones por nivel:", error);
    return res.status(500).json({ message: "Error al obtener asignaciones en el servidor" });
  }
}
const getAsignacionesSinMatriculaPorDocente = async (req, res) => {

  try {
    const docente = req.params.docente
    const periodo = req.params.periodo
    console.log("estos son el preiodo y el docente",docente,periodo)
    const asignaciones = await Asignacion.findAll({
      where: {
        nroCedula_docente: docente,
        '$Matriculas.id$': {
          [Op.is]: null, // <- filtramos donde no hay relación
        },
        ID_periodo_academico: periodo
      },
      include:
        [{
          model: Matricula,
          through: { attributes: [] },
          required: false, // <- muy importante: permite LEFT JOIN
        },
        {
          model: Materia,
          as: "materiaDetalle",
          where: {
            tipo: "individual"
          }
        }
        ]

    })
    console.log("estas son las asignaciones",asignaciones)
    // Aplanamos los datos de las inscripciones
    const asignacionesFinal = asignaciones.map((asignacion) => {
      const asignacionPlain = asignacion.get({ plain: true }); // Convertimos el resultado a un objeto plano
      // Eliminamos las contraseñas de los docentes
     
      // Renombramos Materium a Materia
      if (asignacionPlain.materiaDetalle) {
        asignacionPlain.Materia = asignacionPlain.materiaDetalle;
        delete asignacionPlain.materiaDetalle;
      }
      return asignacionPlain;
    });

    return res.status(200).json(asignacionesFinal)
  } catch (error) {
    console.error("Error al obtener las asignaciones", error)
    return res.status(500).json({ message: `Error al obtener las asignaciones en el servidor:` })
  }
}
const getAsignacionesSinMatricula = async (req, res) => {

  try {

    
    
    const  asignaciones  = await Asignacion.findAll({
     
      where: {
        '$Matriculas.id$': {
          [Op.is]: null, // <- filtramos donde no hay relación
        },

      },
      include:
        [{
          model: Matricula,
          through: { attributes: [] },
          required: false, // <- muy importante: permite LEFT JOIN
        },
        {
          model: Materia,
          as: "materiaDetalle"
        },
        {
          model: Docente,
          attributes: ["primer_nombre", "primer_apellido"]
        }
        ]

    })
    // Aplanamos los datos de las inscripciones
    const asignacionesFinal = asignaciones.map((asignacion) => {
      const asignacionPlain = asignacion.get({ plain: true }); // Convertimos el resultado a un objeto plano
      // Eliminamos las contraseñas de los docentes
     
      // Renombramos Materium a Materia
      if (asignacionPlain.materiaDetalle) {
        asignacionPlain.Materia = asignacionPlain.materiaDetalle;
        delete asignacionPlain.materiaDetalle;
      }
      return asignacionPlain;
    });
    return res.status(200).json(
       asignacionesFinal
    );


  } catch (error) {
    console.error("Error al obtener las asignaciones", error)
    return res.status(500).json({ message: `Error al obtener las asignaciones en el servidor:` })
  }
}

module.exports = {
  createAsignacion,
  updateAsginacion,
  getAsignacion,
  deleteAsignacion,
  getAsignacionesPorDocente,
  getAsignacionesPorNivel,
  getAsignaciones,
  getAsignacionesPorPeriodo,
  getAsignacionesPorAsignatura,
  getAsignacionesSinMatriculaPorDocente,
  getAsignacionesSinMatricula
}