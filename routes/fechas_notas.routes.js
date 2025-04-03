const FechasNotasController = require('../controllers/fechas_notas.controller');
const { docenteVicerrector } = require('../middlewares/protect');

module.exports = (app) => {
    app.post('/fechas_notas/crear', docenteVicerrector,FechasNotasController.createFechasNotas);
    app.put('/fechas_notas/editar/:id', docenteVicerrector,FechasNotasController.updateFechasNotas);
    app.get('/fechas_notas/obtener/:id', FechasNotasController.getFechasNotas);
    app.get('/fechas_notas/obtener_todo', FechasNotasController.getAllFechasNotas);
    app.delete('/fechas_notas/eliminar/:id', docenteVicerrector,FechasNotasController.deleteFechasNotas);
    app.get('/fechas_notas/fecha_actual', FechasNotasController.fechaActual);
}