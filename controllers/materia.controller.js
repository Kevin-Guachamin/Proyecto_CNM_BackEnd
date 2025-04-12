
const Materia = require('../models/materia.model')

const createMateria = async (req, res) => {
    try {
        const materia = req.body
        const materiaFound = await Materia.findOne({where: {nombre: materia.nombre, nivel: materia.nivel} })
        if (materiaFound) {
            return res.status(409).json({ message: "La asignatura ya existe" })
        }
        const result = await Materia.create(materia)
        return res.status(201).json(result)
    } catch (error) {
        console.log('Error al crear el estudiante:', error);
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
        
        return res.status(500).json({message: `Error al crear asignatura en el servidor:`})
       
    }
}
const updateMateria= async (req, res)=>{
    try {
        const materia = req.body
        const id= req.params.id
        const [updatedRows] = await Materia.update(materia,{where: {id}})
        if(updatedRows===0){
            return res.status(404).json({message: "Asignatura no encontrada"})
        }
        const result= await Materia.findByPk(id)
        return res.status(200).json(result)
    } catch (error) {
        
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
        
        return res.status(500).json({message: `Error al editar asignatura en el servidor:`})
        
    }
}
const getMateria = async(req, res)=>{
    
    try {
        const id= req.params.id
        const materia = await Materia.findByPk(id)
        if(!materia){
            return res.status(404).json({message: "Materia no encontrado"})
        }
        
        
        return res.status(200).json(materia)
    } catch (error) {
        console.error("Error al obtener materia", error)
        return res.status(500).json({message: `Error al obtener materia en el servidor:`})
    }
}
const getMaterias = async(req, res)=>{
    try {
        const Materias= await Materia.findAll()
        if(!Materias){
            return res.status(404).json({message: "No se encontro ningún registro"})
        }
        return res.status(200).json(Materias)
    } catch (error) {
        console.error("Error al obtener materias", error)
        return res.status(500).json({message: `Error al obtener materias en el servidor:`})
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
        
        return res.status(200).json(materia)
    } catch (error) {
        console.error("Error al eliminar materia", error)
        return res.status(500).json({message: `Error al eliminar materia en el servidor:`})
    }
}
module.exports= {
    createMateria,
    updateMateria,
    getMateria,
    getMaterias,
    deleteMateria
}