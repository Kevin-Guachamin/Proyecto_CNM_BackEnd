const SolicitudController = require('../controllers/solicitudes_permiso.controller')
const {docenteVicerrector,Docente}=require('../middlewares/protect')
module.exports= (app)=>{
    app.post('/api/solicitud/crear',Docente,SolicitudController.createSolicitud)
    app.put('/api/solicitud/editar/:id',docenteVicerrector,SolicitudController.updateSolicitud)
    app.get('/api/solicitud/obtener/docente',Docente,SolicitudController.getSolicitudesByDocente)
    app.get('/api/solicitud/ultima/obtener',Docente,SolicitudController.getUltimaSolicitud)
    app.get('/api/solicitud/obtener',docenteVicerrector,SolicitudController.getAllSolicitud)
    app.delete('/api/solicitud/eliminar/:id',Docente,SolicitudController.deleteSolicitud)}