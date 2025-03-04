const FechasNotasController = require('./controllers/fechas_notas.controller');

module.exports = (app) => {
    app.post('/fechas_notas/crear', FechasNotasController.createFechasNotas);
    app.put('/fechas_notas/editar/:id', FechasNotasController.updateFechasNotas);
    app.get('/fechas_notas/obtener/:id', FechasNotasController.getFechasNotas);
    app.get('/fechas_notas/obtener', FechasNotasController.getAllFechasNotas);
    app.delete('/fechas_notas/eliminar/:id', FechasNotasController.deleteFechasNotas);
}