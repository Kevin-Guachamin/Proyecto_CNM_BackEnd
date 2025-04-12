const SolicitudController = require('../controllers/solicitudes_permiso.controller')
const {docenteSecretaria,Docente}=require('../middlewares/protect')
module.exports= (app)=>{
    app.post('/solicitud/crear',Docente,SolicitudController.createSolicitud)
    app.put('/solicitud/editar/:id',docenteSecretaria,SolicitudController.updateSolicitud)
    app.get('/solicitud/obtener/:id',Docente,SolicitudController.getSolicitud)
    app.get('/solicitud/obtener',docenteSecretaria,SolicitudController.getAllSolicitud)
    app.delete('/solicutd/eliminar/:id',docenteSecretaria,SolicitudController.deleteSolicitud)}