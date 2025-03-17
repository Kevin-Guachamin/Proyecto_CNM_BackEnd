const RepresentanteController = require('../controllers/representante.controller');
const upload=require('../middlewares/uploadFiles')


module.exports = (app) => {
    app.post('/representante/crear',upload.uploadRepresentantesFields ,RepresentanteController.crearRepresentante);
    app.put('/representante/editar/:cedula',upload.uploadRepresentantesFields, RepresentanteController.updateRepresentante);
    app.get('/representante/obtener/:cedula', RepresentanteController.getRepresentante);
    app.get('/representante/obtener', RepresentanteController.getAllRepresentantes);
    app.delete('/representante/eliminar/:cedula', RepresentanteController.deleteRepresentante);
}