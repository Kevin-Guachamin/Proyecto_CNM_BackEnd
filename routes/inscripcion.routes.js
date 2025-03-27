const InscripcionController = require('../controllers/inscripcion.controller');

module.exports = function(app) {
    app.post('/inscripcion/crear', InscripcionController.createInscripcion)
    app.put('/inscripcion/editar/:id', InscripcionController.updateInscripcion)
    app.get('/inscripcion/obtener/:id', InscripcionController.getInscripcion)
    app.delete('/inscripcion/eliminar/:id', InscripcionController.deleteInscripcion)
    app.get('/inscripcion/asignacion/:id_asignacion', InscripcionController.getEstudiantesPorAsignacion)
}