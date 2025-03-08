const Inscripción = require('../models/inscripción.model')

const createInscripción = async (req, res) => {
    try {
        const inscripción = req.body
        const inscripciónFound = await Materia.findOne({ where: { inscripción } })
        if (inscripciónFound) {
            return res.status(409).json({ message: "Error la matricula_asignación ya existe" })
        }
        const result = await Inscripción.create(inscripción)
        res.status(201).json(result)
    } catch (error) {
        console.error("Error al crear la matricula-asignación", error)
        if (error.name === "SequelizeValidationError") {
            // Extraer solo los mensajes de error de validación
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ message: mensajes });
        }
        if (error instanceof TypeError){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        res.status(500).json({ message: `Error al crear en el servidor:` })
    }
}
const updateInscripción = async (req, res) => {
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
        console.error("Error al editar la inscripción", error)
        if (error.name === "SequelizeValidationError") {
            // Extraer solo los mensajes de error de validación
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ message: mensajes });
        }
        if (error instanceof TypeError){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        res.status(500).json({ message: `Error al editar la inscripción en el servidor:` })
    }
}
const getInscripción = async (req, res) => {

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

const deleteInscripción = async (req, res) => {
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
    createInscripción,
    updateInscripción,
    deleteInscripción,
    getInscripción
}