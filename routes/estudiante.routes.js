// Rutas para ESTUDIANTE
const upload=require('../middlewares/uploadFiles')
const EstudianteController = require('../controllers/estudiante.controller');
const {docenteSecretaria, DocenteANDReprsentante}=require('../middlewares/protect')
module.exports = (app) => {
    app.post('/estudiante/crear',docenteSecretaria ,upload.uploadEstudiantesFields,EstudianteController.crearEstudiante);
    app.put('/estudiante/editar/:ID',DocenteANDReprsentante,upload.uploadEstudiantesFields, EstudianteController.updateEstudiante);
    app.get('/estudiante/obtener/:cedula',DocenteANDReprsentante,EstudianteController.getEstudianteByCedula)
    //app.get('/estudiante/obtener/:ID', EstudianteController.getEstudiante);
    app.get('/estudiante/obtener',DocenteANDReprsentante, EstudianteController.getAllEstudiantes);
    app.delete('/estudiante/eliminar/:ID', docenteSecretaria,EstudianteController.deleteEstudiante);
    app.get('/api/representantes/:cedula/estudiantes',DocenteANDReprsentante ,EstudianteController.getRepresentanteEstudiante);
    app.get('/estudiante/nivel/:nivel',docenteSecretaria,EstudianteController.getEstudiantesByNivel)
    
}