const MatriculaController = require('../controllers/matricula.controller');
const {DocenteANDReprsentante,docenteSecretaria}=require('../middlewares/protect')

module.exports = (app) => {
    app.post('/api/matricula/crear',DocenteANDReprsentante ,MatriculaController.createMatricula);
    app.put('/api/matricula/editar/:id',docenteSecretaria ,MatriculaController.updateMatricula);
    app.get('/api/matricula/obtener/:id',DocenteANDReprsentante ,MatriculaController.getMatricula);
    app.delete('/api/matricula/eliminar/:id',docenteSecretaria ,MatriculaController.deleteMatricula);
    app.get('/api/matricula/estudiante/periodo/:estudiante/:periodo', DocenteANDReprsentante,MatriculaController.getMatriculaByEstudiante);
    app.get('/api/matricula/estudiante/:estudiante', DocenteANDReprsentante,MatriculaController.getPeriodosMatriculadosByEstudiante);
    
}