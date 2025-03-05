// Fechas-Notas controlador

const Fechas_notas = require('./models/fechas_notas.model');

// Create
const createFechasNotas = async (request, response) => {
   const fecha = request.body;
   
   // Verificar que haya datos
   if (!fecha || Object.keys(fecha).length === 0) {
     return response.status(400).json({
        message: 'No se proporcionaron datos para fecha'
     });
   }

    try {
        // Verificar si la fecha existe (comprobar si se necesita este bloque)

        // Crear fecha
        const nuevaFecha = await Fechas_notas.create(fecha);
        const result = nuevaFecha.toJSON();

        return response.status(201).json({
            message: 'Fecha creada exitosamente',
            result
        });

    } catch (error) {
        console.log('Error al crear la fecha:', error);
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error al crear la fecha en el servidor' });

    }
}

// Read
const getFechasNotas = async (request, response) => {
    const ID = request.params.id;
   
    if(!ID || ID.trim() === '') {
        return response.status(400).json({
            message: 'El ID de fecha_notas es requerido'
        });
    }

    try {
        const fecha_nota = await Fechas_notas.findByPk(ID);
        if (!fecha_nota) {
            return response.status(404).json({
                message: 'No se encontro la fecha'
            });
        }
        return response.status(200).json(fecha_nota);

    } catch (error) {
        console.log('Error al obtener la fecha:', error);
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error al obtener la fecha en el servidor' });

    }
}

// Read all
const getAllFechasNotas = async (request, response) => {
    try {
        const fechas_notas = await Fechas_notas.findAll();
        if(fechas_notas.length === 0) {
            return response.status(200).json({
                message: 'No se encontraron fechas'
            })
        }
        const result = fechas_notas.map(fecha => {
            return fecha.toJSON();
        });
        return response.status(200).json(result);

    } catch (error) {
        console.log('Error al obtener todas las fechas:', error);
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error al obtener las fechas en el servidor' });

    }
}

// Update
const updateFechasNotas = async (request, response) => {
    const ID = request.params.id;
    const fechaActualizar = request.body;

    if (!ID || ID.trim() === "") {
        return response.status(400).json({
            where: 'El ID de la fecha es requerido'
        });
    }

    try {
        // verificar que la fecha exista
        const fecha = await Fechas_notas.findByPk(ID);
        if (!fecha) {
            return response.status(404).json({
                message: 'La fecha no existe'
            });
        }

        // Verificar que haya datos para actualizar
        if (Object.keys(fechaActualizar).length === 0) {
            return response.status(400).json({
                message: 'No hay datos para actualizar'
            });
        }

        // No permitir l actualizacion de ID
        if (fechaActualizar.id) {
            return response.status(400).json({
                message: 'No se permite la actualizacion del ID'
            });
        }

        // Actualizar fecha
        const [updatedRows] = await Fechas_notas.update(fechaActualizar, { 
            where: { ID } 
        });
        if (updatedRows === 0) {
            return response.status(200).json({
                message: 'No se realizaron cambios en la fecha',
                update: false  
            });
        }
        const updatedFecha = await Fechas_notas.findByPk(ID);
        const result = updatedFecha.toJSON();
        
        return response.status(200).json({
            message: 'Fecha actualizada exitosamente',
            result
        });

    } catch (error) {
        console.log('Error al actualizar la fecha:', error);
        if (error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ message: 'Error al actualizar la fecha en el servidor' });

    }
}

// Delete 
const deleteFechasNotas = async (request, response) => {
    const ID = request.params.id;

    if (!ID || ID.trim() === '') {
        return response.status(400).json({
            message: 'El ID de fecha_notas es requerido'
        });
    }

    try {
        const fecha_nota = await Fechas_notas.findByPk(ID);
        if (!fecha_nota) {
            return response.status(404).json({
                message: 'no se encontro la fecha'
            }); 
        }

        const rowsDeleted = await Fechas_notas.destroy({ where: { ID } });
        if (rowsDeleted > 0) {
            return response.status(200).json({
                message: 'Fecha eliminada exitosamente'
            });
        } else {
            return response.status(404).json({
                message: 'Fecha no encontrada o ya eliminada'
            });
        }
    } catch (error) {
        console.log('Error al eliminar la fecha:', error);
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes });
        }
        return response.status(500).json({ 
            message: 'Error al eliminar la fecha en el servidor'
        });

    } 

}

module.exports = {
    createFechasNotas,
    getFechasNotas,
    getAllFechasNotas,
    updateFechasNotas,
    deleteFechasNotas
};
