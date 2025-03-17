// Rutas para ESTUDIANTE
const upload=require('../middlewares/uploadFiles')
const EstudianteController = require('../controllers/estudiante.controller');

module.exports = (app) => {
    app.post('/estudiante/crear', upload.uploadEstudiantesFields,EstudianteController.crearEstudiante);
    app.put('/estudiante/editar/:cedula',upload.uploadEstudiantesFields, EstudianteController.updateEstudiante);
    app.get('/estudiante/obtener/:cedula', EstudianteController.getEstudiante);
    app.get('/estudiante/obtener', EstudianteController.getAllEstudiantes);
    app.delete('/estudiante/eliminar/:cedula', EstudianteController.deleteEstudiante);
}