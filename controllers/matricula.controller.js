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
       return res.status(201).json(result)
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
        
        return res.status(500).json({message: `Error al crear matrícula en el servidor:`})
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
        return res.status(200).json(result)
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
        
        return res.status(500).json({message: `Error al editar asignatura en el servidor:`})
    }
}
const getMatricula = async(req, res)=>{
    
    try {
        const id= req.params.id
        const matricula = await Matricula.findByPk(id)
        if(!matricula){
            return res.status(404).json({message: "Matricula no encontrada"})
        }
        
        
        return res.status(200).json(matricula)
    } catch (error) {
        console.error("Error al obtener la matrícula", error)
        return res.status(500).json({message: `Error al obtener la matrícula en el servidor:`})
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
        
        
        return res.status(200).json(matricula)
    } catch (error) {
        console.error("Error al obtener la matrícula", error)
        return res.status(500).json({message: `Error al obtener la matrícula en el servidor:`})
    }
}


/**
 * Obtiene los periodos academicos en los cuales se matriculo un estudiante
 * @async
 * @function getPeriodosMatriculadosByEstudiante 
 * @param {Object} request - Objeto de solicitud Express 
 * @param {number} request.estudiante - ID del estudiante
 * @param {Object} response - Objeto de respuesta Express   
 * @returns {Promise<Object>} Respuesta HTTP con los periodos academicos o mensaje de error
 * 
 * @description Esta función consulta la base de datos para obtener todos los periodos académicos
 * en los que un estudiante específico se ha matriculado, devolviendo solo los IDs de dichos periodos.
 * 
 * @throws {Error} Si ocurre un error durante la consulta a la base de datos
 */
const getPeriodosMatriculadosByEstudiante = async (request, response) => {
    const idEstudiante = request.params.estudiante;

    try {
        
        const periodosMatriculados = await Matricula.findAll({ 
            where: {
                ID_estudiante: idEstudiante 
            },
            attributes: ['ID', 'ID_periodo_academico'] 
        });

        if(!periodosMatriculados || periodosMatriculados.length === 0) {
            return response.status(404).json( {message: "No se encontraron periodos academicos matriculados"} );
        }

        return response.status(200).json(periodosMatriculados);

    } catch (error) {
        console.error("Error al obtener los periodos matriculados del estudiante", error)
        response.status(500).json({message: `Error al obtener al obtener los periodos matriculados en el servidor:`})
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
        
        return res.status(200).json(matricula)
    } catch (error) {
        console.error("Error al eliminar la matrícula", error)
        return res.status(500).json({message: `Error al eliminar la matrícula en el servidor:`})
    }
}
module.exports= {
    createMatricula,
    updateMatricula,
    deleteMatricula,
    getMatricula,
    getMatriculaByEstudiante,
    getPeriodosMatriculadosByEstudiante
}