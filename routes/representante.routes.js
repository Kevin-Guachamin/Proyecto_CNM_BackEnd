const RepresentanteController = require('../controllers/representante.controller');
const upload=require('../middlewares/uploadFiles')
const {docenteSecretaria, DocenteANDReprsentante}=require('../middlewares/protect')


module.exports = (app) => {
    app.post('/api/representante/crear',docenteSecretaria,upload.uploadRepresentantesFields ,RepresentanteController.crearRepresentante);
    app.put('/api/representante/editar/:cedula',DocenteANDReprsentante,upload.uploadRepresentantesFields, RepresentanteController.updateRepresentante);
    app.get('/api/representante/obtener/:cedula',DocenteANDReprsentante, RepresentanteController.getRepresentante);
    app.get('/api/representante/obtener', DocenteANDReprsentante,RepresentanteController.getAllRepresentantes);
    app.delete('/api/representante/eliminar/:cedula', docenteSecretaria,RepresentanteController.deleteRepresentante);
}