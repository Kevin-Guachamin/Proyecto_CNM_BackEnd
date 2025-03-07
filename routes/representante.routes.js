const RepresentanteController = require('../controllers/representante.controller');

module.exports = (app) => {
    app.post('/representante/crear', RepresentanteController.crearRepresentante);
    app.put('/representante/editar/:cedula', RepresentanteController.updateRepresentante);
    app.get('/representante/obtener/:cedula', RepresentanteController.getRepresentante);
    app.get('/representante/obtener', RepresentanteController.getAllRepresentantes);
    app.delete('/representante/eliminar/:cedula', RepresentanteController.deleteRepresentante);
}