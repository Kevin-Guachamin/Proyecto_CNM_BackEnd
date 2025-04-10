const Matricula = require('../models/matricula.models')

const createMatricula = async (req, res) => {
    try {
        const matricula = req.body
        console.log("este es el nivel",matricula)
        const matriculaFound = await Matricula.findOne({where: {nivel: matricula.nivel, estado: matricula.estado, ID_estudiante: matricula.ID_estudiante, ID_periodo_academico: matricula.ID_periodo_academico} })
        if (matriculaFound) {
            return res.status(409).json({ message: "Error la matrícula ya existe" })
        }
        const result = await Matricula.create({
            nivel: matricula.nivel, estado: matricula.estado, ID_estudiante: matricula.ID_estudiante, ID_periodo_academico: matricula.ID_periodo_academico
        })
        res.status(201).json(result)
    } catch (error) {
        console.error("Error al crear la matrícula", error)
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
        if (error.name === "SequelizeUniqueConstraintError") {
            const errEncontrado = error.errors.find(err =>
              err.validatorKey === "not_unique" 
              
            );
            if (errEncontrado) {
              return res.status(400).json({ message: `${errEncontrado.path} debe ser único` });
            }
      
          }
        
        res.status(500).json({message: `Error al crear matrícula en el servidor:`})
    }
}
const updateMatricula= async (req, res)=>{
    try {
        const matricula = req.body
        const id= req.params.id
        const [updatedRows] = await Matricula.update(matricula,{where: {id}})
        if(updatedRows===0){
            return res.status(404).json({message: "Matrícula no encontrada"})
        }
        const result= await Matricula.findByPk(id)
        res.status(200).json(result)
    } catch (error) {
        console.error("Error al editar la matrícula", error)
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
        if (error.name === "SequelizeUniqueConstraintError") {
            const errEncontrado = error.errors.find(err =>
              err.validatorKey === "not_unique" 
              
            );
            if (errEncontrado) {
              return res.status(400).json({ message: `${errEncontrado.path} debe ser único` });
            }
      
          }
        
        res.status(500).json({message: `Error al editar asignatura en el servidor:`})
    }
}
const getMatricula = async(req, res)=>{
    
    try {
        const id= req.params.id
        const matricula = await Matricula.findByPk(id)
        if(!matricula){
            return res.status(404).json({message: "Matricula no encontrada"})
        }
        
        
        res.status(200).json(matricula)
    } catch (error) {
        console.error("Error al obtener la matrícula", error)
        res.status(500).json({message: `Error al obtener la matrícula en el servidor:`})
    }
}
const getMatriculaByEstudiante = async(req, res)=>{
    
    try {
        const estudiante= req.params.estudiante
        const periodo=req.params.periodo
        const matricula = await Matricula.findOne({where:{
            ID_estudiante: estudiante,
            ID_periodo_academico: periodo
        }})
        
        
        res.status(200).json(matricula)
    } catch (error) {
        console.error("Error al obtener la matrícula", error)
        res.status(500).json({message: `Error al obtener la matrícula en el servidor:`})
    }
}

const deleteMatricula = async(req, res)=>{
    try {
        
        const id= req.params.id
        const matricula = await Matricula.findByPk(id)
        if(!matricula){
            return res.status(404).json({message: "Asignación no encontrada"})
        }
         await Matricula.destroy({where: {id}})
        
        res.status(200).json(matricula)
    } catch (error) {
        console.error("Error al eliminar la matrícula", error)
        res.status(500).json({message: `Error al eliminar la matrícula en el servidor:`})
    }
}
module.exports= {
    createMatricula,
    updateMatricula,
    deleteMatricula,
    getMatricula,
    getMatriculaByEstudiante
}