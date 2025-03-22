const Inscripcion = require('../models/inscripción.model')

const createInscripcion = async (req, res) => {
    try {
        const inscripción = req.body
        const inscripciónFound = await Materia.findOne({ where: { inscripción } })
        if (inscripciónFound) {
            return res.status(409).json({ message: "Error la matricula_asignación ya existe" })
        }
        const result = await Inscripción.create(inscripción)
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
        const inscripción = req.body
        const id = req.params.id
        const [updatedRows] = await Inscripción.update(inscripción, { where: { id } })
        if (updatedRows === 0) {
            return res.status(404).json({ message: "Inscripción no encontrada" })
        }
        const result = await Inscripción.findByPk(id)
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
        const inscripción = await Inscripción.findByPk(id)
        if (!inscripción) {
            return res.status(404).json({ message: "Inscripción no encontrada" })
        }


        res.status(200).json(inscripción)
    } catch (error) {
        console.error("Error al obtener la inscripción", error)
        res.status(500).json({ message: `Error al obtener la inscripción en el servidor:` })
    }
}

const deleteInscripcion = async (req, res) => {
    try {

        const id = req.params.id
        const inscripción = await Inscripción.findByPk(id)
        if (!inscripción) {
            return res.status(404).json({ message: "Inscripción no encontrada" })
        }
        await Inscripción.destroy({ where: { id } })

        res.status(200).json(inscripción)
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