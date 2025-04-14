const AsignacionController = require('../controllers/asignacion.controller');
const {Docente,DocenteANDReprsentante,docenteVicerrector,docenteSecretaria}=require('../middlewares/protect')
module.exports = (app) => {
    app.post('/asignacion/crear',Docente, AsignacionController.createAsignacion);
    app.put('/asignacion/editar/:id',Docente ,AsignacionController.updateAsginacion);
    app.get('/asignacion/obtener/:id',DocenteANDReprsentante ,AsignacionController.getAsignacion);
    app.delete('/asignacion/eliminar/:id',Docente ,AsignacionController.deleteAsignacion);
    app.get('/asignacion/docente/:id_docente', DocenteANDReprsentante,AsignacionController.getAsignacionesPorDocente);
    app.get('/asignacion/nivel/:nivel/:periodo',docenteVicerrector,AsignacionController.getAsignacionesPorNivel)
    app.get('/asignacion/obtener/periodo/:periodo',docenteVicerrector && docenteSecretaria,AsignacionController.getAsignaciones);
    app.get('/asignacion/obtener/materias/:periodo/:nivel/:materia/:jornada', DocenteANDReprsentante,AsignacionController.getAsignacionesPorAsignatura);
}
