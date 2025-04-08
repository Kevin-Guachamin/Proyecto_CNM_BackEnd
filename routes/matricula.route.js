const MatriculaController = require('../controllers/matricula.controller');

module.exports = (app) => {
    app.post('/matricula/crear', MatriculaController.createMatricula);
    app.put('/matricula/editar/:id', MatriculaController.updateMatricula);
    app.get('/matricula/obtener/:id', MatriculaController.getMatricula);
    app.delete('/matricula/eliminar/:id', MatriculaController.deleteMatricula);
    app.get('/matricula/estudiante/periodo/:estudiante/:periodo', MatriculaController.getMatriculaByEstudiante);
    
}