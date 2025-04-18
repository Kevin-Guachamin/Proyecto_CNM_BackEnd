const RepresentanteController = require('../controllers/representante.controller');
const upload=require('../middlewares/uploadFiles')
const {docenteSecretaria, DocenteANDReprsentante}=require('../middlewares/protect')


module.exports = (app) => {
    app.post('/representante/crear',docenteSecretaria,upload.uploadRepresentantesFields ,RepresentanteController.crearRepresentante);
    app.put('/representante/editar/:cedula',DocenteANDReprsentante,upload.uploadRepresentantesFields, RepresentanteController.updateRepresentante);
    app.get('/representante/obtener/:cedula',DocenteANDReprsentante, RepresentanteController.getRepresentante);
    app.get('/representante/obtener', DocenteANDReprsentante,RepresentanteController.getAllRepresentantes);
    app.delete('/representante/eliminar/:cedula', docenteSecretaria,RepresentanteController.deleteRepresentante);
}