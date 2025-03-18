// Controlador para ESTUDIANTE
const path = require("path");
const Estudiante = require('../models/estudiante.model');

const crearEstudiante = async (request, response) => {
    const usuario = request.body;
    
    try {
        // Verificar que el objeto usuario exista y tenga contenido
        if (!usuario || Object.keys(usuario).length === 0) {
            return response.status(400).json({ 
                message: 'No se proporcionaron datos del usuario' 
            });
        }

       
        // Verificar que el estudiante no exista
        const estudianteEncontrado = await Estudiante.findByPk(usuario.nroCedula);
        if(estudianteEncontrado) {
            return response.status(409).json({ message: 'El usuario ya existe' });
        }
        const copiaCedulaPath = request.files.copiaCedula ? request.files.copiaCedula[0].path : null;
        const matriculaIERPath= request.files.matricula_IER ? request.files.matricula_IER[0].path : null;
        usuario.cedula_PDF=copiaCedulaPath
        usuario.matricula_IER_PDF=matriculaIERPath
        const anioActual = new Date().getFullYear();
        usuario.anioMatricula=anioActual
        const result = await Estudiante.create(usuario)

        return response.status(201).json(result);

    } catch (error) {
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
        res.status(500).json({message: `Error al crear estudiante en el servidor:`})
        
    }
}

/**
 * Obtener un estudiante por su cédula
 */
const getEstudiante = async (request, response) => {
    const nroCedula = request.params.cedula;

    if (!nroCedula || nroCedula.trim() === '') {
        return response.status(400).json({ message: 'El número de cédula es requerido' });
    }

    try {
        const estudiante = await Estudiante.findByPk(nroCedula);
        if(!estudiante) {
            return response.status(404).json({ message: 'Estudiante no encontrado' });
        } 

        const {contraseña: _, ...result} = estudiante.toJSON();
        return response.status(200).json(result);

    } catch (error) {
        console.log('Error al obtener el estudiante:', error);
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error al obtener el estudiante en el servidor' });
    }
}

/**
 * Obtener todos los estudiantes
 */
const getAllEstudiantes = async (request, response) => {
    try {
        console.log("Hice la consulta")
        let {page=1, limit=15}=request.query;
        page=parseInt(page)
        limit=parseInt(limit)
        const {count, rows: estudiantes}= await Estudiante.findAndCountAll({
            limit,
            offset: (page-1)*limit
        })
        

        if(!estudiantes) {
            return response.status(200).json({ message: 'No se encontró ningún estudiante' });
        }

        

        return response.status(200).json({
            estudiantes: estudiantes,
            totalPages: Math.ceil(count/limit),
            currentPage: page,
            totalRows: count
        });
        
    } catch (error) {
        console.log('Error al obtener todos los estudiantes:', error);
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error al obtener los estudiantes en el servidor' });
    }
}

/**
 * Actualizar un estudiante
 */
const updateEstudiante = async (request, response) => {
    const nroCedula = request.params.cedula;
    const usuario = request.body;

    if (!nroCedula || nroCedula.trim() === '') {
        return response.status(400).json({ 
            message: 'El número de cédula es requerido'
        });
    }

    try {
        // Verificar que el estudiante existe
        const estudianteExistente = await Estudiante.findByPk(nroCedula);
        if(!estudianteExistente) {
            return response.status(404).json({ message: 'El estudiante no existe' });
        }

        // Verificar que haya datos para actualizar
        if(Object.keys(usuario).length === 0) {
            return response.status(400).json({ message: 'No hay datos para actualizar' });
        }

        // Si se está actualizando la contraseña, hashearla
        if (usuario.contraseña) {
            usuario.contraseña = await bcrypt.hash(usuario.contraseña, salt);
        }
        
        // Actualizar el estudiante
        const [updatedRows] = await Estudiante.update(usuario, {
            where: { nroCedula }
        });

        if(updatedRows === 0) {
            return response.status(400).json({ message: 'No se pudo actualizar el estudiante' });
        }

        // Obtener y retornar el estudiante actualizado
        const estudianteActualizado = await Estudiante.findByPk(nroCedula);
        const {contraseña: _, ...result} = estudianteActualizado.toJSON();
        
        return response.status(200).json({
            message: 'Estudiante actualizado exitosamente',
            result
        });

    } catch (error) {
        console.log('Error al actualizar el estudiante:', error);
        if (error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        if (error instanceof TypeError){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        return response.status(500).json({ message: 'Error al actualizar el estudiante en el servidor' });
    }
}

/**
 * Eliminar un estudiante
 */
const deleteEstudiante = async (request, response) => {
    const nroCedula = request.params.cedula;

    if (!nroCedula || nroCedula.trim() === '') {
        return response.status(400).json({ 
            message: 'El número de cédula es requerido'
        });
    }

    try {
        const estudiante = await Estudiante.findByPk(nroCedula);
        if(!estudiante) {
            return response.status(404).json({ message: 'Estudiante no encontrado' });
        }

        const rowsDeleted = await Estudiante.destroy({ where: { nroCedula } });

        if(rowsDeleted > 0) {
            return response.status(200).json({
                message: 'Estudiante eliminado exitosamente',
                nroCedula
            });
        } else {
            return response.status(400).json({
                message: 'No se pudo eliminar el estudiante'
            });
        }
    } catch (error) {
        console.log('Error al eliminar el estudiante:', error);
        if(error.name === 'SequelizeError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ 
            message: 'Error al eliminar el estudiante en el servidor'
        });
    }
}

module.exports = {
    crearEstudiante,
    getEstudiante,
    getAllEstudiantes,
    updateEstudiante,
    deleteEstudiante
};