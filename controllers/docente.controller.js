
const bcrypt = require("bcryptjs")
const Docente = require('../models/docente.model')
const crypto = require("crypto")
const {enivarCorreo}=require("../utils/enivarCorreo")

const createDocente = async (req, res) => {
    try {
        const docente = req.body
        const docenteFound = await Docente.findByPk(docente.nroCedula)
        if (docenteFound) {
            return res.status(409).json({ message: "La cédula ya existe" })
        }
        const provicional=crypto.randomBytes(8).toString('hex').slice(0, 8);
        docente.password=provicional
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(docente.password, salt);
        docente.password = hashedPassword
        console.log("esta es la password", docente.password)
        const newDocente = await Docente.create(docente)
        enivarCorreo(docente.email,provicional)
        const {password: _, ...result}=newDocente.toJSON()
        return res.status(201).json(result)
    } catch (error) {
        console.log("ESTE ES EL ERROR",error)
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);
            
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey ==="is"||
                err.validatorKey === "isEmail" ||
                err.validatorKey ==="isOnlyLetters" ||
                err.validatorKey ==="is_null"
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
        
        return res.status(500).json({message: `Error al crear docente en el servidor:`})
        
    }
}
const editDocente= async (req, res)=>{
    try {
        const docente = req.body
        const nroCedula= req.params.cedula
        // Si se está actualizando la password, hashearla
        if (docente.password) {
            docente.password = await bcrypt.hash(docente.password, salt);
        }

        const [updatedRows] = await Docente.update(docente,{where: {nroCedula}})
        if(updatedRows===0){
            return res.status(404).json({message: "Usuario no encontrado"})
        }
        const docenteEdited = await Docente.findByPk(nroCedula)
        const {password: _, ...result}=docenteEdited.toJSON()
        return res.status(200).json(result)
    } catch (error) {
        console.error("Error al editar docente", error)
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);
            
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey === "isEmail" ||
                err.validatorKey ==="isOnlyLetters" ||
                err.validatorKey ==="is" ||
                err.validatorKey ==="is_null"
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
        
        return res.status(500).json({message: `Error al editar docente en el servidor:`})
       
    }
}
const getDocente = async(req, res)=>{
    
    try {
        const nroCedula= req.params.cedula
        const docente = await Docente.findByPk(nroCedula)
        if(!docente){
            return res.status(404).json({message: "Usuario no encontrado"})
        }
        
        const {password: _, ...result}=docente.toJSON()
        return res.status(200).json(result)
    } catch (error) {
        console.error("Error al obtener docente", error)
        return res.status(500).json({message: `Error al obtener docente en el servidor:`})
    }
}
const getDocentes = async(req, res)=>{
    try {
        const Docentes= await Docente.findAll()
        
        return res.status(200).json(Docentes)
    } catch (error) {
        console.log("el error es aquí")
        console.error("Error al obtener docentes", error)
        return res.status(500).json({message: `Error al obtener docentes en el servidor:`})
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
        const {password: _, ...result}=docente.toJSON()
        return res.status(200).json(result)
    } catch (error) {
        console.error("Error al eliminar docente", error)
        return res.status(500).json({message: `Error al eliminar docente en el servidor:`})
    }
}
module.exports= {
    createDocente,
    editDocente,
    getDocente,
    getDocentes, 
    eliminarDocente
}