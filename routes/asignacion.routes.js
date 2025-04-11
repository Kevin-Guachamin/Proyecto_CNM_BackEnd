const AsignacionController = require('../controllers/asignacion.controller');
const {Docente,DocenteANDReprsentante}=require('../middlewares/protect')
module.exports = (app) => {
    app.post('/asignacion/crear',Docente, AsignacionController.createAsignacion);
    app.put('/asignacion/editar/:id',Docente ,AsignacionController.updateAsginacion);
    app.get('/asignacion/obtener/:id',DocenteANDReprsentante ,AsignacionController.getAsignacion);
    app.delete('/asignacion/eliminar/:id',Docente ,AsignacionController.deleteAsignacion);
    app.get('/asignacion/docente/:id_docente', DocenteANDReprsentante,AsignacionController.getAsignacionesPorDocente);
    app.get('/asignacion/nivel/:nivel/:periodo',DocenteANDReprsentante,AsignacionController.getAsignacionesPorNivel)
    app.get('/asignacion/obtener/periodo/:periodo',DocenteANDReprsentante ,AsignacionController.getAsignaciones);
    app.get('/asignacion/obtener/materias/:periodo/:nivel/:materia/:jornada', DocenteANDReprsentante,AsignacionController.getAsignacionesPorAsignatura);
}
