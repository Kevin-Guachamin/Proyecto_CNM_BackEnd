const Inscripcion = require('../models/inscripcion.model')

const createInscripcion = async (req, res) => {
    try {
        const inscripcion = req.body
        const inscripcionFound = await Materia.findOne({ where: { inscripcion } })
        if (inscripcionFound) {
            return res.status(409).json({ message: "Error la matricula_asignación ya existe" })
        }
        const result = await Inscripcion.create(inscripcion)
        res.status(201).json(result)
    } catch (error) {
        console.log('Error al crear el estudiante:', error);
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);
            
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey ==="is_null"
            );
        
            if (errEncontrado) {
                return res.status(400).json({ message: errEncontrado.message });
            }
        }
        if (error instanceof TypeError){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        if (error.name ==="SequelizeUniqueConstraintError"){
            return res.status(400).json({message: error.message})
        }
        
        res.status(500).json({message: `Error al crear inscripción en el servidor:`})
        console.log("ESTE ES EL ERROR",error.name)
    }
}
const updateInscripcion = async (req, res) => {
    try {
        const inscripcion = req.body
        const id = req.params.id
        const [updatedRows] = await Inscripcion.update(inscripcion, { where: { id } })
        if (updatedRows === 0) {
            return res.status(404).json({ message: "Inscripción no encontrada" })
        }
        const result = await Inscripcion.findByPk(id)
        res.status(200).json(result)
    } catch (error) {
        
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);
            
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey ==="is_null"
            );
        
            if (errEncontrado) {
                return res.status(400).json({ message: errEncontrado.message });
            }
        }
        if (error instanceof TypeError){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        if (error.name ==="SequelizeUniqueConstraintError"){
            return res.status(400).json({message: error.message})
        }
        
        res.status(500).json({message: `Error al editar inscripción en el servidor:`})
        
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
        res.status(500).json({ message: `Error al obtener la inscripción en el servidor:` })
    }
}

const deleteInscripcion = async (req, res) => {
    try {

        const id = req.params.id
        const inscripcion = await Inscripcion.findByPk(id)
        if (!inscripcion) {
            return res.status(404).json({ message: "Inscripción no encontrada" })
        }
        await Inscripcion.destroy({ where: { id } })

        res.status(200).json(inscripcion)
    } catch (error) {
        console.error("Error al eliminar la inscripción", error)
        res.status(500).json({ message: `Error al eliminar la inscripción en el servidor:` })
    }
}
module.exports = {
    createInscripcion,
    updateInscripcion,
    deleteInscripcion,
    getInscripcion
}