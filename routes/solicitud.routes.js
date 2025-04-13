const SolicitudController = require('../controllers/solicitudes_permiso.controller')
const {docenteSecretaria,Docente}=require('../middlewares/protect')
module.exports= (app)=>{
    app.post('/solicitud/crear',Docente,SolicitudController.createSolicitud)
    app.put('/solicitud/editar/:id',docenteSecretaria,SolicitudController.updateSolicitud)
    app.get('/solicitud/obtener/docente',Docente,SolicitudController.getSolicitudesByDocente)
    app.get('/solicitud/ultima/obtener',Docente,SolicitudController.getUltimaSolicitud)
    app.get('/solicitud/obtener',docenteSecretaria,SolicitudController.getAllSolicitud)
    app.delete('/solicitud/eliminar/:id',Docente,SolicitudController.deleteSolicitud)}