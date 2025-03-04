const AñoLectivo = require('./models/año_lectivo.model');

// crear una año lectivo
const createAñoLectivo = async (request, response) => {
    const añoLectivo = request.body;

    // Verificar que haya datos
    if(!añoLectivo || Object.keys(añoLectivo).length === 0 ) {
        return response.status(400).json({ 
            message: 'No se proporcionaron datos para año lectivo'
        });
    }

    // Verificar que el año lectivo no exista
        // Comprobar si el id del ano lectivo es asi: 20242025 
    
}

// Read año lectivo
const getAñoLectivo = async (request, response) => {
    const idAñoLectivo = request.params.id;
    
    // verificar que haya el id del año lectivo
    if (!idAñoLectivo || idAñoLectivo.trim() === '') {
        return response.status(400).json({
            message: 'El id del año lectivo es requerido'
        });
    }

    try {
        const añoLectivo = await AñoLectivo.findByPk(idAñoLectivo);
        if (!añoLectivo) {
            return response.status(404).json({
                message: 'No se encontro el año lectivo'
            });
        }

        return response.status(200).json(añoLectivo);

    } catch (error) {
        console.log('Error al obtener el año lectivo:', error);
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error al obtener el año lectivo en el servidor' });
    }
}

// Read todos los años lectivos
const getAllAñoLectivo = async (request, response) => {
   try {
    const allAñosLectivos = await AñoLectivo.findAll();
    if(allAñosLectivos.length === 0) {
        return response.status(200).json({
            message: 'No se encontro ningun año lectivo'
        });
    }
    const result = allAñosLectivos.map(añosLectivo => {
        return añosLectivo.toJSON();
    });

    return response.status(200).json(result);

   } catch (error) {
        console.log('Error al obtener todos los años lectivos:', error);
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error al obtener los años lectivos en el servidor' });
   }     
}

// Update año lectivo
const updateAñoLectivo = async (request, response) => {
   const ID = request.params.id;
   const añoLectivoActualizar = request.body;

   if(!ID || ID.trim() === '' ) {
    return response.status(400).json({
        message: 'El id del año lectivo es requerido'
    });
   }

   try {
    // Verificar que el año lectivo exista
    const añoLectivoExistente = await AñoLectivo.findByPk(ID);
    if (!añoLectivoExistente) {
        return response.status(404).json({
            message: 'El año lectivo no existe'
        });
    }

    // Verificar que haya datos para actualizar
    if (Object.keys(añoLectivoActualizar).length === 0) {
        return response.status(400).json({
            message: 'No hay datos para actualizar'
        });
    }

    // No permitir la actualizacion de ID
    if (añoLectivoActualizar.id) {
        return response.status(400).json({
            message: 'No se permite la actualizacion del ID'
        });
    }

    // Actualizar año lectivo
    const [updatedRows] = await AñoLectivo.update(añoLectivoActualizar, {
        where: { ID }
    });

    if (updatedRows === 0) {
        return response.status(200).json({
            message: 'No se realizaron cambios en el anio lectivo'
        });
    }

    const updatedAñoLectivo = await AñoLectivo.findByPk(ID);
    const result = updatedAñoLectivo.toJSON();

    return response.status(200).json({
        message: 'Año lectivo actualizado exitosamente',
        result
    });

   } catch (error) {
        console.log('Error al actualizar el año lectivo:', error);
        if (error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error al actualizar el año lectivo en el servidor' });

   }
}

// Delete año lectivo
const deleteAñoLectivo = async (request, response) => {
   const ID = request.params.id;
   
   if (!ID || ID.trim() === '') {
    return response.status(400).json({
        message: 'El ID del año lectivo es requerido'
    }); 
   }

   try {
    const añosLectivo = await AñoLectivo.findByPk(ID);
    if (!añosLectivo) {
        return response.status(404).json({
            message: 'Año lectivo no encontrado'
        });
    }
    
    const rowsDeleted = await AñoLectivo.destroy({ where: { ID }});

    if(rowsDeleted > 0) {
        return response.status(200).json({
            message: 'Año lectivo eliminado exitosamente'
        });
    } else {
        return response.status(400).json({
            message: 'No se pudo eliminar el año lectivo '
        });
    }
   } catch (error) {
        console.log('Error al eliminar el año lectivo:', error);
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ 
            message: 'Error al eliminar el año lectivo en el servidor'
        });

   }
}