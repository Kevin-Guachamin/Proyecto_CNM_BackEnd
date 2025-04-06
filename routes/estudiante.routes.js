// Rutas para ESTUDIANTE
const upload=require('../middlewares/uploadFiles')
const EstudianteController = require('../controllers/estudiante.controller');

module.exports = (app) => {
    app.post('/estudiante/crear', upload.uploadEstudiantesFields,EstudianteController.crearEstudiante);
    app.put('/estudiante/editar/:ID',upload.uploadEstudiantesFields, EstudianteController.updateEstudiante);
    app.get('/estudiante/obtener/:cedula',EstudianteController.getEstudianteByCedula)
    //app.get('/estudiante/obtener/:ID', EstudianteController.getEstudiante);
    app.get('/estudiante/obtener', EstudianteController.getAllEstudiantes);
    app.delete('/estudiante/eliminar/:ID', EstudianteController.deleteEstudiante);
    app.get('/api/representantes/:cedula/estudiantes', EstudianteController.getRepresentanteEstudiante);
    app.get('/estudiante/download/:folder/:filename',EstudianteController.getFile)
    
}