// Controlador para ESTUDIANTE
const path = require("path");
const Estudiante = require('../models/estudiante.model');


const crearEstudiante = async (request, res) => {
    const usuario = request.body;

    try {
        // Verificar que el objeto usuario exista y tenga contenido
        if (!usuario || Object.keys(usuario).length === 0) {
            return res.status(400).json({
                message: 'No se proporcionaron datos del usuario'
            });
        }


        // Verificar que el estudiante no exista
        const estudianteEncontrado = await Estudiante.findOne({ nroCedula: usuario.nroCedula });
        if (estudianteEncontrado) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }
        const copiaCedulaPath = request.files.copiaCedula ? request.files.copiaCedula[0].path : null;
        const matriculaIERPath = request.files.matricula_IER ? request.files.matricula_IER[0].path : null;
        usuario.cedula_PDF = copiaCedulaPath
        usuario.matricula_IER_PDF = matriculaIERPath
        const anioActual = parseInt(new Date().getFullYear());
        usuario.anioMatricula = anioActual
        console.log("esta es la objeto", usuario)

        const result = await Estudiante.create(usuario)

        return res.status(201).json(result);

    } catch (error) {
        console.log("este fue el error", error)
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);

            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey === "isEcuadorianID" ||
                err.validatorKey ==="isOnlyLetters" ||
                err.validatorKey ==="isIn" ||
                err.validatorKey ==="is_null"
            );

            if (errEncontrado) {
                return res.status(400).json({ message: errEncontrado.message });
            }
        }
        if (error instanceof TypeError) {
            return res.status(400).json({ message: "Debe completar todos los campos" })
        }
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: error.message })
        }
        res.status(500).json({ message: `Error al crear estudiante en el servidor:` })

    }
}

/**
 * Obtener los estudiantes a cargo de un representante
 */
const getRepresentanteEstudiante = async (request, response) => {
    const nroCedula_representante = request.params.cedula;

    if (!nroCedula_representante || nroCedula_representante.trim() === '') {
        return response.status(400).json({ message: 'El número de cédula del representante es requerido' });
    }

    try {
        const estudiantes = await Estudiante.findAll({
            where: { nroCedula_representante },
            attributes: [
                'nroCedula',
                'primer_nombre',
                'segundo_nombre',
                'primer_apellido',
                'segundo_apellido',
                'jornada', 
                'especialidad'
            ]
        });

        if (estudiantes.length === 0) {
            return response.status(404).json({ message: 'No se encontraron estudiantes para este representante' });
        }

        return response.status(200).json(estudiantes);

    } catch (error) {
        console.log('Error al obtener los estudiantes del representante:', error);
        if (error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error interno del servidor al obtener los estudiantes' });

    }
}

/**
 * Obtener un estudiante por su cédula
 */
const getEstudiante = async (request, response) => {
    const ID = request.params.ID;

    try {
        const estudiante = await Estudiante.findByPk(ID);
        if (!estudiante) {
            return response.status(404).json({ message: 'Estudiante no encontrado' });
        }


        return response.status(200).json(estudiante);

    } catch (error) {
        console.log('Error al obtener el estudiante:', error);
        if (error.name === 'SequelizeValidationError') {
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

        let { page = 1, limit = 1 } = request.query;
        page = parseInt(page)
        limit = parseInt(limit)
        const { count, rows: estudiantes } = await Estudiante.findAndCountAll({
            limit,
            offset: (page - 1) * limit
        })


        if (!estudiantes) {
            return response.status(200).json({ message: 'No se encontró ningún estudiante' });
        }



        return response.status(200).json({
            estudiantes: estudiantes,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalRows: count
        });

    } catch (error) {
        console.log('Error al obtener todos los estudiantes:', error);
        if (error.name === 'SequelizeValidationError') {
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
    const ID = request.params.ID;
    const usuario = request.body;


    try {
        // Verificar que el estudiante existe
        const estudianteExistente = await Estudiante.findByPk(ID);
        if (!estudianteExistente) {
            return response.status(404).json({ message: 'El estudiante no existe' });
        }

        // Actualizar el estudiante
        const [updatedRows] = await Estudiante.update(usuario, {
            where: { ID }
        });

        if (updatedRows === 0) {
            return response.status(400).json({ message: 'No se pudo actualizar el estudiante' });
        }

        // Obtener y retornar el estudiante actualizado
        const estudianteActualizado = await Estudiante.findByPk(ID);


        return response.status(200).json(

            estudianteActualizado
        );

    } catch (error) {
        console.log('Error al actualizar el estudiante:', error);
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);

            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey === "isEcuadorianID" ||
                err.validatorKey ==="isOnlyLetters" ||
                err.validatorKey ==="isIn" ||
                err.validatorKey ==="is_null"
            );

            if (errEncontrado) {
                return response.status(400).json({ message: errEncontrado.message });
            }
        }
        if (error instanceof TypeError) {
            return response.status(400).json({ message: "Debe completar todos los campos" })
        }
        if (error.name === "SequelizeUniqueConstraintError") {
            return response.status(400).json({ message: error.message })
        }

        response.status(500).json({ message: `Error al editar estudiante en el servidor:` })
        console.log("ESTE ES EL ERROR", error.name)
    }
}

/**
 * Eliminar un estudiante
 */
const deleteEstudiante = async (request, response) => {
    const ID = request.params.ID;

    

    try {
        const estudiante = await Estudiante.findByPk(ID);
        if (!estudiante) {
            return response.status(404).json({ message: 'Estudiante no encontrado' });
        }

        const rowsDeleted = await Estudiante.destroy({ where: { ID } });

        if (rowsDeleted > 0) {
            return response.status(200).json({estudiante
            });
        } else {
            return response.status(400).json({
                message: 'No se pudo eliminar el estudiante'
            });
        }
    } catch (error) {
        console.log('Error al eliminar el estudiante:', error);
        if (error.name === 'SequelizeError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({
            message: 'Error al eliminar el estudiante en el servidor'
        });
    }
}

const getFile = async (req, res) => {
    const { folder, filename } = req.params;
    console.log("Folder:", folder); // Verifica el valor de folder
    console.log("Filename:", filename); // Verifica el valor de filename
    const filePath = path.join(__dirname, "..", 'uploads', folder, filename);

    res.download(filePath, filename, (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            res.status(500).json('No se pudo descargar el archivo.');
        }
    });
}

module.exports = {
    crearEstudiante,
    getEstudiante,
    getAllEstudiantes,
    updateEstudiante,
    deleteEstudiante,
    getRepresentanteEstudiante,
    getFile
};