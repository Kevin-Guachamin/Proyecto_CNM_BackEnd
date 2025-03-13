const Asignacion = require('../models/asignacion.model')

const createAsignacion = async (req, res) => {
    try {
        const asignacion = req.body
        const asignacionFound = await Asignacion.findOne({where: {asignacion} })
        if (asignacionFound) {
            return res.status(409).json({ message: "Error la asignación ya existe" })
        }
        const result = await Asignacion.create(asignacion)
        res.status(201).json(result)
    } catch (error) {
        console.error("Error al crear la asignación", error)
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);
            
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len"
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
        
        res.status(500).json({message: `Error al crear asignación en el servidor:`})
        console.log("ESTE ES EL ERROR",error.name)
    }
}
const updateAsginacion= async (req, res)=>{
    try {
        const asignacion = req.body
        const id= req.params.id
        const [updatedRows] = await Asignacion.update(asignacion,{where: {id}})
        if(updatedRows===0){
            return res.status(404).json({message: "Asignación no encontrada"})
        }
        const result= await Asignacion.findByPk(id)
        res.status(200).json(result)
    } catch (error) {
        console.error("Error al editar la asignación", error)
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);
            
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len"
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
        
        res.status(500).json({message: `Error al crear asignación en el servidor:`})
        console.log("ESTE ES EL ERROR",error.name)
    }
}
const getAsignacion = async(req, res)=>{
    
    try {
        const id= req.params.id
        const asignacion = await Asignacion.findByPk(id)
        if(!asignacion){
            return res.status(404).json({message: "Asignación no encontrada"})
        }
        
        
        res.status(200).json(asignacion)
    } catch (error) {
        console.error("Error al obtener la asignación", error)
        res.status(500).json({message: `Error al obtener la asignación en el servidor:`})
    }
}

const deleteAsignacion = async(req, res)=>{
    try {
        
        const id= req.params.id
        const asignacion = await Asignacion.findByPk(id)
        if(!asignacion){
            return res.status(404).json({message: "Asignación no encontrada"})
        }
         await Asignacion.destroy({where: {id}})
        
        res.status(200).json(asignacion)
    } catch (error) {
        console.error("Error al eliminar la asignación", error)
        res.status(500).json({message: `Error al eliminar la asignación en el servidor:`})
    }
}
module.exports= {
    createAsignacion,
    updateAsginacion,
    getAsignacion,
    deleteAsignacion
}