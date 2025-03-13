
const bcrypt = require("bcryptjs")
const Docente = require('../models/docente.model')
const crypto = require("crypto")
const {enivarCorreo, detectarProveedorCorreo}=require("../utils/enivarCorreo")

const createDocente = async (req, res) => {
    try {
        const docente = req.body
        const docenteFound = await Docente.findByPk(docente.nroCedula)
        if (docenteFound) {
            return res.status(409).json({ message: "Error el usuario ya existe" })
        }
        const provicional=crypto.randomBytes(8).toString('hex').slice(0, 8);
        docente.contraseña=provicional
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(docente.contraseña, salt);
        docente.contraseña = hashedPassword
        console.log("esta es la contraseña", docente.contraseña)
        const newDocente = await Docente.create(docente)
        const service=detectarProveedorCorreo(docente.email)
        enivarCorreo(docente.email,provicional,service)
        const {contraseña: _, ...result}=newDocente.toJSON()
        res.status(201).json(result)
    } catch (error) {
        console.error("Error al crear docente", error)
        if (error.name === "SequelizeValidationError") {
            // Extraer solo los mensajes de error de validación
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ message: mensajes });
        }
        if (error instanceof TypeError){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        res.status(500).json({message: `Error al crear docente en el servidor:`})
    }
}
const editDocente= async (req, res)=>{
    try {
        const docente = req.body
        const nroCedula= req.params.cedula
        const [updatedRows] = await Docente.update(docente,{where: {nroCedula}})
        if(updatedRows===0){
            return res.status(404).json({message: "Usuario no encontrado"})
        }
        const docenteEdited = await Docente.findByPk(nroCedula)
        const {contraseña: _, ...result}=docenteEdited.toJSON()
        res.status(200).json(result)
    } catch (error) {
        console.error("Error al editar docente", error)
        if (error.name === "SequelizeValidationError") {
            // Extraer solo los mensajes de error de validación
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ message: mensajes });
        }
        if (error instanceof TypeError){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        res.status(500).json({message: `Error al editar docente en el servidor:`})
    }
}
const getDocente = async(req, res)=>{
    
    try {
        const nroCedula= req.params.cedula
        const docente = await Docente.findByPk(nroCedula)
        if(!docente){
            return res.status(404).json({message: "Usuario no encontrado"})
        }
        
        const {contraseña: _, ...result}=docente.toJSON()
        res.status(200).json(result)
    } catch (error) {
        console.error("Error al obtener docente", error)
        res.status(500).json({message: `Error al obtener docente en el servidor:`})
    }
}
const getDocentes = async(req, res)=>{
    try {
        const Docentes= await Docente.findAll()
        if(!Docentes){
            return res.status(404).json({message: "No se encontro ningún usuario"})
        }
        res.status(200).json(Docentes)
    } catch (error) {
        console.error("Error al obtener docentes", error)
        res.status(500).json({message: `Error al obtener docentes en el servidor:`})
    }
}

const eliminarDocente = async(req, res)=>{
    try {
        
        const nroCedula= req.params.cedula
        const docente = await Docente.findByPk(nroCedula)
        if(!docente){
            return res.status(404).json({message: "Usuario no encontrado"})
        }
         await Docente.destroy({where: {nroCedula}})
        const {contraseña: _, ...result}=docente.toJSON()
        res.status(200).json(result)
    } catch (error) {
        console.error("Error al eliminar docente", error)
        res.status(500).json({message: `Error al eliminar docente en el servidor:`})
    }
}
module.exports= {
    createDocente,
    editDocente,
    getDocente,
    getDocentes, 
    eliminarDocente
}