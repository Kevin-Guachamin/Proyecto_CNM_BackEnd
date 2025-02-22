require("dotenv").config();
const bcrypt = require("bcryptjs")
const Docente = require('../models/docente.model')

const generateToken = (params) => {
    return jwt.sign(params, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const createDocente = async (req, res) => {
    try {
        const docente = req.body
        const docenteFound = await Docente.findByPk(docente.nroCedula)
        if (docenteFound) {
            return res.status(409).json({ message: "Error el usuario ya existe" })
        }
        if (!docente.contraseña) {
            return res.status(400).json({ message: "Error no existe contraseña" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(docente.contraseña, salt);
        docente.constraseña = hashedPassword
        const newDocente = await Docente.create(docente)
        const {contraseña: _, ...result}=newDocente.toJSON()
        res.status(201).json(result)
    } catch (error) {
        console.error("Error al crear docente", error)
        res.status(500).json({message: "Error al crear docente en el servidor"})
    }
}

module.exports= {
    createDocente
}