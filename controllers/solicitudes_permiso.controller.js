const Solicitudes = require('../models/solicitudesPermiso.model');
const Docente = require('../models/docente.model');
const { sequelize } = require('../config/sequelize.config')


const createSolicitud = async (req, res) => {
    try {
        const solicitud = req.body;
        const solicitudFound = await Solicitudes.findOne({
            where: {
                nroCedula_docente:solicitud.nroCedula_docente,
                fecha_inicio: solicitud.fecha_inicio,
                fehca_fin:solicitud.fehca_fin,
                motivo: solicitud.motivo
            }
        });
        if (solicitudFound) {
            return res.status(400).json({ message: 'Esta solicitud ya fue echa' });
        }
        const nuevaSolicitud = await Solicitudes.create(solicitud);
        return res.status(201).json(nuevaSolicitud);

    } catch (error) {
       
        console.log('Error al crear solicitud', error);

        if (error.name === "SequelizeValidationError") {
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey ==="is_null" ||
                err.validatorKey ==="isDate"
            );
            if (errEncontrado) {
                return res.status(400).json({ message: errEncontrado.message });
            }
        }

        if (error instanceof TypeError) {
            return res.status(400).json({ message: "Debe completar todos los campos" });
        }

        if (error.name === "SequelizeUniqueConstraintError") {
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "not_unique"
            );
            if (errEncontrado) {
                return res.status(400).json({ message: `${errEncontrado.path} debe ser único` });
            }
        }

        return res.status(500).json({ message: `Error al crear solicitud en el servidor:` });
    }
};

const updateSolicitud= async (req, res) => {
    try {
        const solicitud = req.body
        const id = req.params.id
        const solicitudFound = await Solicitudes.findOne({
            where: {
                nroCedula_docente:solicitud.nroCedula_docente,
                fecha_inicio: solicitud.fecha_inicio,
                fehca_fin:solicitud.fehca_fin,
                motivo: solicitud.motivo
            }
        });
        if (solicitudFound) {
            return res.status(400).json({ message: 'Esta solicitud ya fue echa' });
        }
        const [updatedRows] = await Solicitudes.update(solicitud, { where: { id } })
        if (updatedRows === 0) {
            return res.status(404).json({ message: "solicitud no encontrada" })
        }
        const result = await Solicitudes.findByPk(id)
        return res.status(200).json(result)
    } catch (error) {

        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);

            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey === "is_null" ||
                err.validatorKey ==="is_Date"
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

        return res.status(500).json({ message: `Error al editar solicitud en el servidor:` })

    }
}
const getSolicitud = async (req, res) => {

    try {
        const id = req.params.id
        const solicitud = await Solicitudes.findByPk(id)
        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud no encontrada" })
        }


        return res.status(200).json(solicitud)
    } catch (error) {
        console.error("Error al obtener la solicitud", error)
        return res.status(500).json({ message: `Error al obtener la solicitud en el servidor:` })
    }
}
const getAllSolicitud = async (req, res) => {

    try {
        const solicitudes = await Solicitudes.findAll()
    
        return res.status(200).json(solicitudes)
    } catch (error) {
        console.error("Error al obtener las solicitudes", error)
        return res.status(500).json({ message: `Error al obtener las solicitudes en el servidor:` })
    }
}

const deleteSolicitud = async (req, res) => {
    try {

        const id = req.params.id
        const solicitud = await Solicitudes.findByPk(id)
        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud no encontrada" })
        }
        await Solicitudes.destroy({ where: { id } })

        return res.status(200).json(solicitud)
    } catch (error) {
        console.error("Error al eliminar la solicitud", error)
        return res.status(500).json({ message: `Error al eliminar la solicitud en el servidor:` })
    }
}

module.exports = {
    createSolicitud,
    updateSolicitud,
    deleteSolicitud,
    getSolicitud,
    getAllSolicitud
}