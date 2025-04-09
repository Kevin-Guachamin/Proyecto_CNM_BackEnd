const RepresentanteController = require('../controllers/representante.controller');
const upload=require('../middlewares/uploadFiles')
const {changePassword}=require('../controllers/change_password.controller')
const {validatePasswordChange}=require('../controllers/change_password.controller')
const {Representante,docenteSecretaria, DocenteANDReprsentante}=require('../middlewares/protect')


module.exports = (app) => {
    app.post('/representante/crear',docenteSecretaria,upload.uploadRepresentantesFields ,RepresentanteController.crearRepresentante);
    app.put('/representante/editar/:cedula',DocenteANDReprsentante,upload.uploadRepresentantesFields, RepresentanteController.updateRepresentante);
    app.get('/representante/obtener/:cedula',DocenteANDReprsentante, RepresentanteController.getRepresentante);
    app.get('/representante/obtener', DocenteANDReprsentante,mRepresentanteController.getAllRepresentantes);
    app.delete('/representante/eliminar/:cedula', docenteSecretaria,RepresentanteController.deleteRepresentante);
    app.get('/representante/download/:folder/:filename',DocenteANDReprsentante,RepresentanteController.getFile)
    app.post('/representante/password/',Representante,validatePasswordChange,changePassword)
}