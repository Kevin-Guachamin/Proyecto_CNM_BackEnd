const FechasNotasController = require('../controllers/fechas_notas.controller');
const { docenteVicerrector, docenteSecretaria } = require('../middlewares/protect');
const FechasProcesosController = require('../controllers/fechas_procesos.controller');

module.exports = (app) => {
    // Rutas para fechas de notas
    app.post('/fechas_notas/crear', docenteVicerrector,FechasNotasController.createFechasNotas);
    app.put('/fechas_notas/editar/:id', docenteVicerrector,FechasNotasController.updateFechasNotas);
    app.get('/fechas_notas/obtener/:id', FechasNotasController.getFechasNotas);
    app.get('/fechas_notas/obtener_todo', FechasNotasController.getAllFechasNotas);
    app.delete('/fechas_notas/eliminar/:id', docenteVicerrector,FechasNotasController.deleteFechasNotas);
    app.get('/fechas_notas/fecha_actual', FechasNotasController.fechaActual);

    // Rutas para fechas de procesos
    app.post('/fechas_procesos/crear', docenteSecretaria,FechasProcesosController.createFechasProcesos);
    app.put('/fechas_procesos/editar/:id', docenteSecretaria,FechasProcesosController.updateFechasProcesos);
    app.get('/fechas_procesos/obtener/:id', FechasProcesosController.getFechasProcesos);
    app.get('/fechas_procesos/obtener_todo', FechasProcesosController.getAllFechasProcesos);
    app.get('/fechas_procesos/actualizacion', FechasProcesosController.getFechaProximaActualizacion);
    app.get('/fechas_procesos/fecha_actual', FechasNotasController.fechaActual);
    app.delete('/fechas_procesos/eliminar/:id', docenteSecretaria,FechasProcesosController.deleteFechasProcesos);
}
