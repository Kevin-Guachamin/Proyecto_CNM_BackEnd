const InscripcionController = require('../controllers/inscripcion.controller');
const {DocenteANDReprsentante, docenteSecretaria}=require('../middlewares/protect')

module.exports = function(app) {
    app.post('/inscripcion/crear', DocenteANDReprsentante,InscripcionController.createInscripcion)
    app.put('/inscripcion/editar/:id',docenteSecretaria ,InscripcionController.updateInscripcion)
    app.get('/inscripcion/obtener/:id', DocenteANDReprsentante,InscripcionController.getInscripcion)
    app.delete('/inscripcion/eliminar/:id',docenteSecretaria ,InscripcionController.deleteInscripcion)
    app.get('/inscripcion/asignacion/:id_asignacion', DocenteANDReprsentante,InscripcionController.getEstudiantesPorAsignacion)
}