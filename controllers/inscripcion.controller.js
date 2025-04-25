const Estudiante = require('../models/estudiante.model');
const Matricula = require('../models/matricula.models');
const Asignacion = require('../models/asignacion.model');
const Inscripcion = require('../models/inscripcion.model');
const Materia = require('../models/materia.model');
const Docente = require('../models/docente.model')
const { sequelize } = require('../config/sequelize.config');


const tienenDiasSolapados = (dias1, dias2) => {
    return dias1.some(dia => dias2.includes(dia));
}

const tienenHorariosSolapados = (horaInicioA, horaFinA, horaInicioB, horaFinB) => {
    return horaInicioA < horaFinB && horaFinA > horaInicioB;
}
const getEstudiantesPorAsignacion = async (req, res) => {
    const { id_asignacion } = req.params;

    try {
        const inscripciones = await Inscripcion.findAll({
            where: { ID_asignacion: id_asignacion },
            include: [{
                model: Matricula,
                attributes: ['nivel'],
                include: [{
                    model: Estudiante,
                    // Ajusta el nombre del PK real de tu modelo Estudiante (puede ser 'ID', 'id', etc.)
                    attributes: ['ID', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido']
                }]
            }]
        });

        const estudiantes = inscripciones
            .map((insc) => {
                const est = insc.Matricula?.Estudiante;
                if (!est) return null;

                const nivel = insc.Matricula?.nivel || "";
                const nombreCompleto = [
                    est.primer_apellido,
                    est.segundo_apellido ?? '',
                    est.primer_nombre,
                    est.segundo_nombre ?? ''
                ].join(' ');

                return {
                    // ID de la inscripción (clave para calificaciones)
                    idInscripcion: insc.ID,
                    // ID del estudiante (por si lo necesitas también)
                    idEstudiante: est.ID,
                    nombreCompleto,
                    nivel
                };
            })
            .filter(Boolean)
            .sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto))
            .map((est, index) => ({
                nro: index + 1,
                idInscripcion: est.idInscripcion,
                idEstudiante: est.idEstudiante,
                nombre: est.nombreCompleto,
                nivel: est.nivel
            }));

        return res.status(200).json(estudiantes);
    } catch (error) {
        console.error("Error al obtener estudiantes por asignación", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

const createInscripcion = async (req, res) => {
    const t = await sequelize.transaction();
    try {

        const inscripcion = req.body;
        console.log("esto se recibió del front", inscripcion)
        // Verificar si ya está inscrito en esta asignación
        const inscripcionFounded = await Inscripcion.findOne({
            where: {
                ID_asignacion: inscripcion.ID_asignacion,
                ID_matricula: inscripcion.ID_matricula
            },
            transaction: t
        });
        if (inscripcionFounded) {
            await t.rollback();
            return res.status(400).json({ message: 'El estudiante ya está inscrito en esta materia' });
        }

        // Buscar asignación con lock
        const asignacionActual = await Asignacion.findByPk(inscripcion.ID_asignacion, {
            include: [
                {
                    model: Materia,
                    as: "materiaDetalle"
                }
            ],
            lock: t.LOCK.UPDATE,
            transaction: t
        });

        if (!asignacionActual) {
            await t.rollback();
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }

        if (asignacionActual.cuposDisponibles <= 0) {
            await t.rollback();
            return res.status(400).json({ message: 'No hay cupos disponibles en esta asignación' });
        }

        // Verificar si ya está inscrito en la misma materia (otro docente)
        const yaInscrito = await Inscripcion.findOne({
            where: {
                ID_matricula: inscripcion.ID_matricula
            },
            include: {
                model: Asignacion,
                where: {
                    ID_materia: asignacionActual.ID_materia
                }
            },
            transaction: t
        });

        if (yaInscrito) {
            await t.rollback();
            return res.status(400).json({ message: 'El estudiante ya está inscrito en esta materia con otro profesor' });
        }
        const inscripciones = await Inscripcion.findAll({
            where: {
                ID_matricula: inscripcion.ID_matricula
            },
            include:
                [{
                    model: Asignacion,

                }]

        })

        const asignaciones = inscripciones.map((inscripcion) => {
            const inscripcionPlain = inscripcion.get({ plain: true }); // Convertimos la inscripción a un objeto plano



            return inscripcionPlain.Asignacion;
        });

        const conflicto = asignaciones.some(asig => {
            const hayDiasSolapados = tienenDiasSolapados(asig.dias, asignacionActual.dias);
            const hayHorarioSolapado = tienenHorariosSolapados(
                asignacionActual.horaInicio,
                asignacionActual.horaFin,
                asig.horaInicio,
                asig.horaFin
            );

            return hayDiasSolapados && hayHorarioSolapado;
        });

        if (conflicto) {
            return res.status(400).json({ message: "Inscripción no válida por cruze de horarios" })
        }

        // Crear inscripción
        const nuevaInscripcion = await Inscripcion.create(inscripcion, { transaction: t });

        // Restar cupo
        asignacionActual.cuposDisponibles -= 1;
        await asignacionActual.save({ transaction: t });

        await t.commit();
        return res.status(201).json(nuevaInscripcion);

    } catch (error) {
        await t.rollback();
        console.log('Error al crear inscripcion:', error);

        if (error.name === "SequelizeValidationError") {
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey === "is_null"
            );
            if (errEncontrado) {
                return res.status(400).json({ message: errEncontrado.message });
            }
        }


        if (error.name === "SequelizeUniqueConstraintError") {
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "not_unique"
            );
            if (errEncontrado) {
                return res.status(400).json({ message: `${errEncontrado.path} debe ser único` });
            }
        }

        return res.status(500).json({ message: `Error al crear inscripción en el servidor:` });
    }
};

const updateInscripcion = async (req, res) => {
    try {
        const inscripcion = req.body
        const id = req.params.id
        const [updatedRows] = await Inscripcion.update(inscripcion, { where: { id } })
        if (updatedRows === 0) {
            return res.status(404).json({ message: "Inscripción no encontrada" })
        }
        const result = await Inscripcion.findByPk(id)
        return res.status(200).json(result)
    } catch (error) {

        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);

            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey === "is_null"
            );

            if (errEncontrado) {
                return res.status(400).json({ message: errEncontrado.message });
            }
        }

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: error.message })
        }

        return res.status(500).json({ message: `Error al editar inscripción en el servidor:` })

    }
}
const getInscripcion = async (req, res) => {

    try {
        const id = req.params.id
        const inscripcion = await Inscripcion.findByPk(id)
        if (!inscripcion) {
            return res.status(404).json({ message: "Inscripción no encontrada" })
        }


        res.status(200).json(inscripcion)
    } catch (error) {
        console.error("Error al obtener la inscripción", error)
        return res.status(500).json({ message: `Error al obtener la inscripción en el servidor:` })
    }
}

const deleteInscripcion = async (req, res) => {
    try {
        console.log("si me ejecuto")
        const id = req.params.id
        const inscripcion = await Inscripcion.findByPk(id)
        if (!inscripcion) {
            return res.status(404).json({ message: "Inscripción no encontrada" })
        }
        await Inscripcion.destroy({ where: { id } })

        return res.status(200).json(inscripcion)
    } catch (error) {
        console.error("Error al eliminar la inscripción", error)
        return res.status(500).json({ message: `Error al eliminar la inscripción en el servidor:` })
    }
}
const getInscripcionesByMatricula = async (req, res) => {

    try {
        const matricula = req.params.matricula

        if (!matricula || matricula === "undefined" || matricula.trim() === "") {

            return res.status(400).json({ message: "No se seleccionó estudiante" });
        }
        console.log("este es el id", matricula)
        const inscripciones = await Inscripcion.findAll({
            where: {
                ID_matricula: matricula
            },
            include:
                [{
                    model: Asignacion,
                    include: [{
                        model: Materia,
                        as: "materiaDetalle",


                    }]
                }]

        })

        // Aplanamos los datos de las inscripciones
        const inscripcionesFinal = inscripciones.map((inscripcion) => {
            const inscripcionPlain = inscripcion.get({ plain: true }); // Convertimos la inscripción a un objeto plano

            // Aplanamos las asignaciones dentro de la inscripción
            if (inscripcionPlain.Asignacion) {
                // Ya estamos trabajando con un objeto plano, no necesitamos llamar a get
                const asignacionPlain = inscripcionPlain.Asignacion;

                // Renombramos "materiaDetalle" a "Materia" si existe
                if (asignacionPlain.materiaDetalle) {
                    asignacionPlain.Materia = asignacionPlain.materiaDetalle;
                    delete asignacionPlain.materiaDetalle; // Eliminamos la propiedad materiaDetalle
                }

                inscripcionPlain.Asignacion = asignacionPlain;
            }

            return inscripcionPlain;
        });

        console.log("estas son las inscripciones", inscripcionesFinal)

        return res.status(200).json(inscripcionesFinal)
    } catch (error) {
        console.error("Error al obtener la inscripción", error)
        return res.status(500).json({ message: `Error al obtener la inscripción en el servidor:` })
    }
}
const getInscripcionesIndividualesDocente = async (req, res) => {
    try {
        console.log("estoy aca")
        const docente = req.params.docente
        console.log("este es docente",docente)
        const periodo = req.params.periodo
        let { page, limit } = req.query;
        console.log("esto es todo",docente,periodo,page, limit)
        page = parseInt(page)
        limit = parseInt(limit)
        console.log("este es el periodfgggo", periodo)
        const { count, rows: inscripciones }= await Inscripcion.findAndCountAll({
            limit,
            offset: (page - 1) * limit,
            include: [
                {
                    model: Asignacion,
                    include: [{
                        model: Materia,
                        as: "materiaDetalle",
                        where:{
                            tipo: "individual"
                        }
                    },
                    {
                        model: Docente,
                        attributes: ["primer_nombre", "primer_apellido"]
                    }

                    ],
                    where: {
                        nroCedula_docente: docente
                    }
                },
                {
                    model: Matricula,
                    where: {
                        ID_periodo_academico: periodo
                    },
                    include: [{
                        model: Estudiante,
                    }]
                }
            ]
        })
        console.log("estas son las inscripciones",inscripciones)
        const inscripcionesFinal = inscripciones.map((inscripcion) => {
            const inscripcionPlain = inscripcion.get({ plain: true }); // Convertimos la inscripción a un objeto plano

            // Aplanamos las asignaciones dentro de la inscripción
            if (inscripcionPlain.Asignacion) {
                // Ya estamos trabajando con un objeto plano, no necesitamos llamar a get
                const asignacionPlain = inscripcionPlain.Asignacion;

                // Renombramos "materiaDetalle" a "Materia" si existe
                if (asignacionPlain.materiaDetalle) {
                    asignacionPlain.Materia = asignacionPlain.materiaDetalle;
                    delete asignacionPlain.materiaDetalle; // Eliminamos la propiedad materiaDetalle
                }

                inscripcionPlain.Asignacion = asignacionPlain;
            }

            return inscripcionPlain;
        });
        return res.status(200).json({
                data: inscripcionesFinal,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                totalRows: count
            });
    } catch (error) {
        console.error("Error al obtener las inscripciones", error)
        return res.status(500).json({ message: `Error al obtener las inscripciones en el servidor:` })
    }
}
const getInscripcionesIndividualesByNivel = async (req, res) => {
    try {
        const nivel = req.params.nivel
        const periodo = req.params.periodo
        let { page, limit } = req.query;
        page = parseInt(page)
        limit = parseInt(limit)
        console.log("este es el periodo", periodo)
        const { count, rows: inscripciones }= await Inscripcion.findAndCountAll({
            include: [
                {
                    model: Asignacion,
                    include: [{
                        model: Materia,
                        as: "materiaDetalle",
                        where: {
                            nivel: nivel,
                            tipo:"individual"
                        }
                    },
                    {
                        model: Docente,
                        attributes: ["primer_nombre", "primer_apellido"]
                    }
                    ]
                },
                {
                    model: Matricula,
                    where: {
                        ID_periodo_academico: periodo
                    },
                    include: [{
                        model: Estudiante,
                    }]
                }
            ]
        })
        
        const inscripcionesFinal = inscripciones.map((inscripcion) => {
            const inscripcionPlain = inscripcion.get({ plain: true }); // Convertimos la inscripción a un objeto plano

            // Aplanamos las asignaciones dentro de la inscripción
            if (inscripcionPlain.Asignacion) {
                // Ya estamos trabajando con un objeto plano, no necesitamos llamar a get
                const asignacionPlain = inscripcionPlain.Asignacion;

                // Renombramos "materiaDetalle" a "Materia" si existe
                if (asignacionPlain.materiaDetalle) {
                    asignacionPlain.Materia = asignacionPlain.materiaDetalle;
                    delete asignacionPlain.materiaDetalle; // Eliminamos la propiedad materiaDetalle
                }

                inscripcionPlain.Asignacion = asignacionPlain;
            }

            return inscripcionPlain;
        });
        return res.status(200).json({
            data: inscripcionesFinal,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalRows: count
        });
    } catch (error) {
        console.error("Error al obtener las inscripciones", error)
        return res.status(500).json({ message: `Error al obtener las inscripciones en el servidor:` })
    }
}



module.exports = {
    createInscripcion,
    updateInscripcion,
    deleteInscripcion,
    getInscripcion,
    getEstudiantesPorAsignacion,
    getInscripcionesByMatricula,
    getInscripcionesIndividualesDocente,
    getInscripcionesIndividualesByNivel

}