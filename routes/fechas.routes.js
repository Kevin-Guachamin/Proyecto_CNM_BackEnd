const FechasNotasController = require('../controllers/fechas_notas.controller');
const { docenteVicerrector, docenteSecretaria } = require('../middlewares/protect');
const FechasProcesosController = require('../controllers/fechas_procesos.controller');

module.exports = (app) => {
    // Rutas para fechas de notas
    app.post('/api/fechas_notas/crear', docenteVicerrector,FechasNotasController.createFechasNotas);
    app.put('/api/fechas_notas/editar/:id', docenteVicerrector,FechasNotasController.updateFechasNotas);
    app.get('/api/fechas_notas/obtener/:id', FechasNotasController.getFechasNotas);
    app.get('/api/fechas_notas/obtener_todo', FechasNotasController.getAllFechasNotas);
    app.delete('/api/fechas_notas/eliminar/:id', docenteVicerrector,FechasNotasController.deleteFechasNotas);
    app.get('/api/fechas_notas/fecha_actual', FechasNotasController.fechaActual);

    // Rutas para fechas de procesos
    app.post('/api/fechas_procesos/crear', docenteSecretaria,FechasProcesosController.createFechasProcesos);
    app.put('/api/fechas_procesos/editar/:id', docenteSecretaria,FechasProcesosController.updateFechasProcesos);
    app.get('/api/fechas_procesos/obtener/:id', FechasProcesosController.getFechasProcesos);
    app.get('/api/fechas_procesos/obtener_todo', FechasProcesosController.getAllFechasProcesos);
    app.get('/api/fechas_procesos/actualizacion', FechasProcesosController.getFechaProximaActualizacion);
    app.get('/api/fechas_procesos/fecha_actual', FechasProcesosController.getFechaActualIso);
    app.delete('/api/fechas_procesos/eliminar/:id', docenteSecretaria,FechasProcesosController.deleteFechasProcesos);
}
