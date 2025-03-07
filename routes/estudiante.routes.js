// Rutas para ESTUDIANTE

const EstudianteController = require('../controllers/estudiante.controller');

module.exports = (app) => {
    app.post('/estudiante/crear', EstudianteController.crearEstudiante);
    app.put('/estudiante/editar/:cedula', EstudianteController.updateEstudiante);
    app.get('/estudiante/obtener/:cedula', EstudianteController.getEstudiante);
    app.get('/estudiante/obtener', EstudianteController.getAllEstudiante);
    app.delete('/estudiante/eliminar/:cedula', EstudianteController.deleteEstudiante);
}