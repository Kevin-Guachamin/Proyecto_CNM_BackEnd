
const bcrypt = require("bcryptjs")
const Docente = require('../models/docente.model')



const createDocente = async (req, res) => {
    try {
        const docente = req.body
        const docenteFound = await Docente.findByPk(docente.nroCedula)
        if (docenteFound) {
            return res.status(409).json({ message: "Error el usuario ya existe" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(docente.contraseña, salt);
        docente.constraseña = hashedPassword
        const newDocente = await Docente.create(docente)
        const {contraseña: _, ...result}=newDocente.toJSON()
        res.status(201).json(result)
    } catch (error) {
        console.error("Error al crear docente", error)
        if (error.name === "SequelizeValidationError") {
            // Extraer solo los mensajes de error de validación
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ errores: mensajes });
        }
        res.status(500).json({message: `Error al crear docente en el servidor:`})
    }
}

module.exports= {
    createDocente
}