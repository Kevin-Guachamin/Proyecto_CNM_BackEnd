// Controlador para el rol de REPRESENTANTE

const Representante = require('./models/representante.model');
const { hashPassword } = require('./utils/hashPassword');
const { validarUsuario } = require('./utils/validarUsuario');


// Create REPRESENTANTE
const crearRepresentante = async (request, response) => {
    const usuario = request.body;

    try {
        // Verificar si el representante existe
        const representanteEncontrado = await Representante.findByPk(usuario.nroCedula);
        if(representanteEncontrado) {
            return response.status(409).json({ message: 'El usuario ya existe!' }); // 409 conflict
        }
        
        // Validar todos los campos del usuario (isUpdate = false para creación)
        const validationResult = validarUsuario(usuario, false);
        if (!validationResult.isValid) {
            return response.status(400).json({ message: validationResult.message });
        }

        // Hash de la contraseña
        const password = usuario.contraseña;
        usuario.contraseña = await hashPassword(password);
        
        const nuevoRepresentante = await Representante.create(usuario);
        const {contraseña: _, ...result} = nuevoRepresentante.toJSON();
        
        return response.status(200).json({ 
            message: 'Usuario creado exitosamente', 
            result
        });

    } catch (error) {
        console.log('Error al crear el representante:', error);
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error al crear el representante en el servidor' });
    }
}

// Read REPRESENTANTE
const getRepresentante = async (request, response) => {
    const nroCedula = request.params.cedula;
    try {
        const representante = await Representante.findByPk(nroCedula);
        if(!representante)
            return response.status(404).json({ message: 'Usuario no encontrado'});

        const {contraseña: _, ...result} = representante.toJSON(); // Omite la contrasena
        return response.status(200).json(result);

    } catch (error) {
        console.log('Error al obtener el representante');
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes});
        }

        return response.status(500).json({ message: 'Error al obtener el representante en el servidor'});
    }
}

// Read todos los representantes
const getAllRepresentantes = async (request, response) => {
    try {
        const allRepresentantes = await Representante.findAll();

        if(allRepresentantes.length === 0)
            return response.status(404).json({ message: 'No se encontro ningun representante!'});

        const result = allRepresentantes.map(representante => {
            const {contraseña: _, ...rest} = representante.toJSON();
            return rest;
        });
               
        return response.status(200).json(result);

    } catch (error) {
        console.log('Error al obtener todos los representantes');
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes});
        }

        return response.status(500).json({ message: 'Error al obtener los representantes en el servidor'});
    }
}

// Update REPRESENTANTE
const updateRepresentante = async (request, response) => {
    const nroCedula = request.params.cedula;
    const usuario = request.body;

    try {
        // Verificar si el representante existe
        const representanteExistente = await Representante.findByPk(nroCedula);
        if (!representanteExistente) {
            return response.status(404).json({ message: 'Usuario no encontrado!' });
        }

        // Verificar que haya datos para actualizar
        if (Object.keys(usuario).length === 0) {
            return response.status(400).json({ message: 'No hay datos para actualizar' });
        }

        // Validar los campos que se van a actualizar
        const validationResult = validarUsuario(usuario, true);
        if (!validationResult.isValid) {
            return response.status(400).json({ message: validationResult.message });
        }

        // Si se está actualizando la contraseña, hashearla
        if (usuario.contraseña) {
            usuario.contraseña = await hashPassword(usuario.contraseña);
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
        const { contraseña: _, ...result } = representanteActualizado.toJSON();

        return response.status(200).json({ 
            message: 'Usuario actualizado exitosamente',
            result 
        });

    } catch (error) {
        console.log('Error al actualizar el representante:', error);
        if (error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error al actualizar el representante en el servidor' });
    }
}

// Delete REPRESENTANTE
const deleteRepresentante = async (request, response) => {
    const nroCedula = request.params.cedula;

    try {
        const representante = await Representante.findByPk(nroCedula);
        
        if(!representante)
            return response.status(404).json({ message: 'Usuario no encontrado'});

        const rowsDeleted = await Representante.destroy({ where: {nroCedula} });
        
        if(rowsDeleted > 0) {
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
        if(error.name === 'SequelizeError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes});
        }
        return response.status(500).json({ 
            message: 'Error al eliminar el representante en el servidor'
        });
    }
}

module.exports = {
    crearRepresentante,
    getRepresentante,
    getAllRepresentantes,
    updateRepresentante,
    deleteRepresentante
}