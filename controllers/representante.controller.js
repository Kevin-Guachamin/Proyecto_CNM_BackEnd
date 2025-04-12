const path = require("path");
const Representante = require('../models/representante.model');
const crypto = require("crypto")
const {enivarCorreo}=require("../utils/enivarCorreo")
const bcrypt = require("bcryptjs")
// Create REPRESENTANTE
const crearRepresentante = async (request, response) => {
    const usuario = request.body;

    try {
        // Verificar si el representante existe
        const representanteEncontrado = await Representante.findByPk(usuario.nroCedula);
        if (representanteEncontrado) {
            return response.status(409).json({ message: 'El representante ya existe!' }); // 409 conflict
        }
        const provicional = crypto.randomBytes(8).toString('hex').slice(0, 8);
        usuario.password = provicional
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuario.password, salt);
        usuario.password=hashedPassword
        const copiaCedulaPath = request.files.copiaCedula ? request.files.copiaCedula[0].path : null;
        const croquisPath = request.files.croquis ? request.files.croquis[0].path : null;
        console.log("Estos son los paths: ",copiaCedulaPath, croquisPath)

        usuario.cedula_PDF = copiaCedulaPath
        usuario.croquis_PDF = croquisPath

        const nuevoRepresentante = await Representante.create(usuario);
        enivarCorreo(nuevoRepresentante.email,provicional)
        const { password: _, ...result } = nuevoRepresentante.toJSON();
        

        return response.status(201).json(result);

    } catch (error) {
        console.log('Error al crear el representante:', error);
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);

            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey === "isEmail" ||
                err.validatorKey === "is" ||
                err.validatorKey ==="isOnlyLetters" ||
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
            const errEncontrado = error.errors.find(err =>
              err.validatorKey === "not_unique" 
              
            );
            if (errEncontrado) {
              return response.status(400).json({ message: `${errEncontrado.path} debe ser único` });
            }
      
          }
        return response.status(500).json({ message: 'Error al crear el representante en el servidor' });
    }
}

// Read REPRESENTANTE
const getRepresentante = async (request, response) => {
    const nroCedula = request.params.cedula;
    try {
        const representante = await Representante.findOne({
            where: { nroCedula }
        });
        if (!representante)
            return response.status(404).json({ message: 'Usuario no encontrado' });

        const { password: _, ...result } = representante.toJSON(); // Omite la contrasena
        return response.status(200).json(result);

    } catch (error) {
        console.log('Error al obtener el representante');
        if (error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }

        return response.status(500).json({ message: 'Error al obtener el representante en el servidor' });
    }
}

// Read todos los representantes
const getAllRepresentantes = async (request, response) => {
    try {
        let { page = 1, limit = 1 } = request.query;
        page = parseInt(page)
        limit = parseInt(limit)
        const { count, rows: representantes } = await Representante.findAndCountAll({
            limit,
            offset: (page - 1) * limit
        })

        const result = representantes.map(representante => {
            const { password: _, ...rest } = representante.toJSON();
            return rest;
        });

        return response.status(200).json({
            representantes: result,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalRows: count
        });

    } catch (error) {
        console.log('Error al obtener todos los representantes', error);
        if (error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }

        return response.status(500).json({ message: 'Error al obtener los representantes en el servidor' });
    }
}

// Update REPRESENTANTE
const updateRepresentante = async (request, response) => {
    const nroCedula = request.params.cedula;
    const usuario = request.body;

    try {
        // Verificar que el objeto usuario exista y tenga contenido
        if (!usuario || Object.keys(usuario).length === 0) {
            return response.status(400).json({
                message: 'No se proporcionaron datos del usuario'
            });
        }

        // Verificar si el representante existe
        const representanteExistente = await Representante.findByPk(nroCedula);
        if (!representanteExistente) {
            return response.status(404).json({ message: 'Usuario no encontrado!' });
        }

        // Si se está actualizando la password, hashearla
        if (usuario.password) {
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }

        // Actualizar el representante
        const [updatedRows] = await Representante.update(usuario, {
            where: { nroCedula }
        });

        if (updatedRows === 0) {
            return response.status(400).json({ message: 'No se pudo actualizar el usuario!' });
        }

        // Obtener y retornar el representante actualizado
        const representanteActualizado = await Representante.findByPk(nroCedula);
        const { password: _, ...result } = representanteActualizado.toJSON();

        return response.status(200).json(result);

    } catch (error) {
        console.log('Error al actualizar el representante:', error);
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);

            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey === "isEmail" ||
                err.validatorKey ==="isOnlyLetters" ||
                err.validatorKey==="is" ||
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
            const errEncontrado = error.errors.find(err =>
              err.validatorKey === "not_unique" 
              
            );
            if (errEncontrado) {
              return response.status(400).json({ message: `${errEncontrado.path} debe ser único` });
            }
      
          }
        return response.status(500).json({ message: 'Error al actualizar el representante en el servidor' });
    }
}

// Delete REPRESENTANTE
const deleteRepresentante = async (request, response) => {
    const nroCedula = request.params.cedula;

    try {
        const representante = await Representante.findByPk(nroCedula);

        if (!representante)
            return response.status(404).json({ message: 'Usuario no encontrado' });

        const rowsDeleted = await Representante.destroy({ where: { nroCedula } });

        if (rowsDeleted > 0) {
            return response.status(200).json({
                message: 'Usuario eliminado exitosamente',
                cedula: nroCedula
            });
        } else {
            return response.status(400).json({
                message: 'No se pudo eliminar el usuario'
            });
        }

    } catch (error) {
        console.log('Error al eliminar el representante:', error);

        return response.status(500).json({
            message: 'Error al eliminar el representante en el servidor'
        });
    }
}
const getFile = async (req, res) => {
    const { folder, filename } = req.params;
    const filePath = path.join(__dirname, "..",'uploads', folder, filename);

    return res.download(filePath, filename, (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            return res.status(500).json({message: 'No se pudo descargar el archivo.'});
        }
    });
}

module.exports = {
    crearRepresentante,
    getRepresentante,
    getAllRepresentantes,
    updateRepresentante,
    deleteRepresentante,
    getFile
}