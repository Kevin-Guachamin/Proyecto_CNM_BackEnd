
const Materia = require('../models/docente.model')

const createMateria = async (req, res) => {
    try {
        const materia = req.body
        const materiaFound = await Materia.findOne({where: {nombre: materia.nombre} })
        if (materiaFound) {
            return res.status(409).json({ message: "Error la materia ya existe" })
        }
        const result = await Materia.create(docente)
        res.status(201).json(result)
    } catch (error) {
        console.error("Error al crear materia", error)
        if (error.name === "SequelizeValidationError") {
            // Extraer solo los mensajes de error de validación
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ message: mensajes });
        }
        res.status(500).json({message: `Error al crear materia en el servidor:`})
    }
}
const updateMateria= async (req, res)=>{
    try {
        const materia = req.body
        const id= req.params.id
        const [updatedRows] = await Materia.update(materia,{where: {id}})
        if(updatedRows===0){
            return res.status(404).json({message: "Materia no encontrada"})
        }
        const result= await Materia.findByPk(id)
        res.status(200).json(result)
    } catch (error) {
        console.error("Error al editar materia", error)
        if (error.name === "SequelizeValidationError") {
            // Extraer solo los mensajes de error de validación
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ message: mensajes });
        }
        res.status(500).json({message: `Error al editar materia en el servidor:`})
    }
}
const getMateria = async(req, res)=>{
    
    try {
        const id= req.params.id
        const materia = await Materia.findByPk(id)
        if(!materia){
            return res.status(404).json({message: "Materia no encontrado"})
        }
        
        
        res.status(200).json(materia)
    } catch (error) {
        console.error("Error al obtener materia", error)
        res.status(500).json({message: `Error al obtener materia en el servidor:`})
    }
}
const getMaterias = async(req, res)=>{
    try {
        const Materias= await Materia.findAll()
        if(!Materias){
            return res.status(404).json({message: "No se encontro ningún registro"})
        }
        res.status(200).json(Materias)
    } catch (error) {
        console.error("Error al obtener materias", error)
        res.status(500).json({message: `Error al obtener materias en el servidor:`})
    }
}

const deleteMateria = async(req, res)=>{
    try {
        
        const id= req.params.id
        const materia = await Materia.findByPk(id)
        if(!materia){
            return res.status(404).json({message: "Materia no encontrada"})
        }
         await Materia.destroy({where: {id}})
        
        res.status(200).json(materia)
    } catch (error) {
        console.error("Error al eliminar materia", error)
        res.status(500).json({message: `Error al eliminar materia en el servidor:`})
    }
}
module.exports= {
    createMateria,
    updateMateria,
    getMateria,
    getMaterias,
    deleteMateria
}