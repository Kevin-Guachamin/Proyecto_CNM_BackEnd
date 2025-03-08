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
            // Extraer solo los mensajes de error de validación
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ message: mensajes });
        }
        if (error instanceof TypeError){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        res.status(500).json({message: `Error al crear la asignación en el servidor:`})
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
            // Extraer solo los mensajes de error de validación
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ message: mensajes });
        }
        if (error instanceof TypeError){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        res.status(500).json({message: `Error al editar la asignación en el servidor:`})
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