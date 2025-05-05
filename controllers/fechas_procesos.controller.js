const { Op } = require('sequelize')
const Fechas_procesos = require('../models/fechas_procesos.model');

// Crear nueva fecha de proceso
const createFechasProcesos = async (req, res) => {
    const datos = req.body;

    if (!datos || Object.keys(datos).length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron datos para la fecha del proceso.' });
    }

    if (new Date(datos.fecha_inicio) > new Date(datos.fecha_fin)) {
        return res.status(400).json({ message: 'La fecha de inicio no puede ser mayor que la fecha de fin.' });
    }

    try {
        const nuevaFecha = await Fechas_procesos.create(datos);
        return res.status(201).json({
            message: 'Fecha de proceso creada exitosamente.',
            result: nuevaFecha.toJSON()
        });
    } catch (error) {
        console.log('Error al crear la fecha del proceso:', error);

        if (error.name === "SequelizeValidationError") {
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ message: mensajes });
        }

        return res.status(500).json({ message: 'Error en el servidor al crear la fecha del proceso.' });
    }
};

// Obtener fecha de proceso por ID
const getFechasProcesos = async (req, res) => {
    const ID = req.params.id;

    if (!ID || ID.trim() === '') {
        return res.status(400).json({ message: 'El ID es requerido.' });
    }

    try {
        const fecha = await Fechas_procesos.findByPk(ID);
        if (!fecha) {
            return res.status(404).json({ message: 'No se encontró la fecha del proceso.' });
        }
        return res.status(200).json(fecha);
    } catch (error) {
        console.log('Error al obtener la fecha:', error);
        return res.status(500).json({ message: 'Error en el servidor al obtener la fecha del proceso.' });
    }
};

// Obtener todas las fechas de procesos
const getAllFechasProcesos = async (req, res) => {
    try {
        const fechas = await Fechas_procesos.findAll();
        return res.status(200).json(fechas);
    } catch (error) {
        console.log('Error al obtener todas las fechas:', error);
        return res.status(500).json({ message: 'Error en el servidor al obtener las fechas.' });
    }
};

// Actualizar fecha de proceso por ID
const updateFechasProcesos = async (req, res) => {
    const ID = req.params.id;
    const datosActualizar = req.body;

    if (!ID || ID.trim() === "") {
        return res.status(400).json({ message: 'El ID es requerido.' });
    }

    if (new Date(datosActualizar.fecha_inicio) > new Date(datosActualizar.fecha_fin)) {
        return res.status(400).json({ message: 'La fecha de inicio no puede ser mayor que la fecha de fin.' });
    }

    try {
        const fecha = await Fechas_procesos.findByPk(ID);
        if (!fecha) {
            return res.status(404).json({ message: 'La fecha del proceso no existe.' });
        }

        if (Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({ message: 'No hay datos para actualizar.' });
        }

        if (datosActualizar.ID) {
            return res.status(400).json({ message: 'No se puede actualizar el ID.' });
        }

        await Fechas_procesos.update(datosActualizar, { where: { ID } });
        const actualizada = await Fechas_procesos.findByPk(ID);

        return res.status(200).json({
            message: 'Fecha de proceso actualizada exitosamente.',
            result: actualizada.toJSON()
        });
    } catch (error) {
        console.log('Error al actualizar la fecha del proceso:', error);
        if (error.name === "SequelizeValidationError") {
            const mensajes = error.errors.map(err => err.message);
            return res.status(400).json({ message: mensajes });
        }
        return res.status(500).json({ message: 'Error en el servidor al actualizar la fecha del proceso.' });
    }
};

// Eliminar fecha de proceso por ID
const deleteFechasProcesos = async (req, res) => {
    const ID = req.params.id;

    if (!ID || ID.trim() === '') {
        return res.status(400).json({ message: 'El ID es requerido.' });
    }

    try {
        const fecha = await Fechas_procesos.findByPk(ID);
        if (!fecha) {
            return res.status(404).json({ message: 'La fecha del proceso no existe.' });
        }

        await Fechas_procesos.destroy({ where: { ID } });

        return res.status(200).json({ message: 'Fecha del proceso eliminada exitosamente.' });
    } catch (error) {
        console.log('Error al eliminar la fecha del proceso:', error);
        return res.status(500).json({ message: 'Error en el servidor al eliminar la fecha del proceso.' });
    }
};

// Obtener fecha actual del servidor
const fechaActual = (req, res) => {
    try {
        const fecha = new Date();
        const fechaFormateada = fecha.toLocaleDateString("es-ES", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        return res.status(200).json({
            message: 'Fecha actual obtenida exitosamente.',
            fechaActual: fechaFormateada
        });
    } catch (error) {
        console.log('Error al obtener la fecha actual:', error);
        return res.status(500).json({ message: 'Error al obtener la fecha actual del servidor.' });
    }
};

// Obtener la fecha mas proxima para un proceso
const getFechaProximaActualizacion = async (req, res) => {
	try {
		const proceso = await Fechas_procesos.findOne({
			where: {
				// Se asume que el proceso se llama 'Actualizacion de datos' en la BD
				// Si es que se va a llamar de otra forma, cambiar la consulta
				proceso: 'Actualizacion de datos',
				fecha_inicio: {
					[Op.gte]: new Date(), // procesos que inician hoy o despues
				},
			},
			order: [['fecha_inicio', 'ASC']], // el mas proximo primero
		});

		if (!proceso) {
			return res.status(404).json({ message: 'No hay procesos de actualizacion proximos'});
		}

		const ID = proceso.ID;
		const procesoString = proceso.proceso;

		// Fechas del proceso formateadas
		const fechaInicioProceso = new Date(proceso.fecha_inicio).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
		const fechaFinProceso = new Date(proceso.fecha_fin).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});

		return res.status(200).json({
			ID,
			procesoString,
			fechaInicioProceso,
			fechaFinProceso
		});
	} catch (error) {
		console.log('Error al obtener el proceso', erro);
		return res.status(500).json({ message: 'Error al obtener la fecha de actualizacion mas proxima en el servidor'});
	}	
};

module.exports = {
    createFechasProcesos,
    getFechasProcesos,
    getAllFechasProcesos,
    updateFechasProcesos,
    deleteFechasProcesos,
    fechaActual,
    getFechaProximaActualizacion
};
