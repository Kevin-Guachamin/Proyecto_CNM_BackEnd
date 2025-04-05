const RepresentanteController = require('../controllers/representante.controller');
const upload=require('../middlewares/uploadFiles')
const {changePassword}=require('../controllers/change_password.controller')
const {validatePasswordChange}=require('../controllers/change_password.controller')
const {Representante}=require('../middlewares/protect')


module.exports = (app) => {
    app.post('/representante/crear',upload.uploadRepresentantesFields ,RepresentanteController.crearRepresentante);
    app.put('/representante/editar/:cedula',upload.uploadRepresentantesFields, RepresentanteController.updateRepresentante);
    app.get('/representante/obtener/:cedula', RepresentanteController.getRepresentante);
    app.get('/representante/obtener', RepresentanteController.getAllRepresentantes);
    app.delete('/representante/eliminar/:cedula', RepresentanteController.deleteRepresentante);
    app.get('/representante/download/:folder/:filename',RepresentanteController.getFile)
    app.post('/representante/password/',Representante,validatePasswordChange,changePassword)
}