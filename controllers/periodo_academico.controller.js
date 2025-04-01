const Periodo = require('../models/periodo_academico.model');


const createPeriodo = async (req, res) => {
    try {
        console.log(req.body)
        const periodo_academico = req.body
        const periodo_academicoFound = await Periodo.findOne({where: {descripcion: periodo_academico.descripcion} })
        if (periodo_academicoFound) {
            return res.status(409).json({ message: "Error la periodo ya existe" })
        }
        console.log("este es el periodo a crear", periodo_academico)
        const result = await Periodo.create(periodo_academico)
        
        res.status(201).json(result)
    } catch (error) {
        console.error("Error al crear periodo", error)
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);
            
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
        res.status(500).json({message: `Error al crear periodo en el servidor`})
    }
}
const updatePeriodo= async (req, res)=>{
    try {
        const periodo = req.body
        const id= req.params.id
        const [updatedRows] = await Periodo.update(periodo,{where: {id}})
        if(updatedRows===0){
            return res.status(404).json({message: "Periodo no encontrada"})
        }
        const result= await Periodo.findByPk(id)
        console.log("ESto se envia da la base al actualizar",result)
        res.status(200).json(result)
    } catch (error) {
        console.error("Error al editar periodo", error)
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);
            
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
        res.status(500).json({message: `Error al editar periodo en el servidor`})
    }
}
const getPeriodo = async(req, res)=>{
    
    try {
        const id= req.params.id
        const periodo = await Periodo.findByPk(id)
        if(!periodo){
            return res.status(404).json({message: "Periodo no encontrado"})
        }
        
        
        res.status(200).json(periodo)
    } catch (error) {
        console.error("Error al obtener periodo", error)
        res.status(500).json({message: `Error al obtener periodo en el servidor`})
    }
}
const getPeriodoActivo = async(req, res)=>{
    
    try {
        
        const periodo = await Periodo.findOne({where:{estado:"activo"}})
        if(!periodo){
            return res.status(404).json({message: "Periodo no encontrado"})
        }
        
        
        res.status(200).json(periodo)
    } catch (error) {
        console.error("Error al obtener periodo", error)
        res.status(500).json({message: `Error al obtener periodo en el servidor`})
    }
}
const getPeriodos = async(req, res)=>{
    try {
        const periodos= await Periodo.findAll()
        if(!periodos){
            return res.status(404).json({message: "No se encontro ningún registro"})
        }
        res.status(200).json(periodos)
        
    } catch (error) {
        console.error("Error al obtener periodos", error)
        res.status(500).json({message: `Error al obtener periodos en el servidor:`})
    }
}


const deletePeriodo = async(req, res)=>{
    try {
        
        const id= req.params.id
        const periodo = await Periodo.findByPk(id)
        if(!periodo){
            return res.status(404).json({message: "Periodo no encontrada"})
        }
         await Periodo.destroy({where: {id}})
        
        res.status(200).json(periodo)
    } catch (error) {
        console.error("Error al eliminar periodo", error)
        res.status(500).json({message: `Error al eliminar periodo en el servidor:`})
    }
}
module.exports= {
    createPeriodo,
    updatePeriodo,
    getPeriodo,
    getPeriodos,
    deletePeriodo,
    getPeriodoActivo
}