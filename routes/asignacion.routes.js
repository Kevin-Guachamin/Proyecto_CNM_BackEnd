const AsignacionController = require('../controllers/asignacion.controller');

module.exports = (app) => {
    app.post('/asignacion/crear', AsignacionController.createAsignacion);
    app.put('/asignacion/editar/:id', AsignacionController.updateAsginacion);
    app.get('/asignacion/obtener/:id', AsignacionController.getAsignacion);
    app.delete('/asignacion/eliminar/:id', AsignacionController.deleteAsignacion);
    app.get('/asignacion/docente/:id_docente', AsignacionController.obtenerAsignacionesPorDocente);
    app.get('/asignacion/nivel/:nivel',AsignacionController.obtenerAsignacionesPorNivel)
}
