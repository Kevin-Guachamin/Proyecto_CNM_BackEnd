const MatriculaController = require('../controllers/matricula.controller');
const {DocenteANDReprsentante,docenteSecretaria}=require('../middlewares/protect')

module.exports = (app) => {
    app.post('/matricula/crear',DocenteANDReprsentante ,MatriculaController.createMatricula);
    app.put('/matricula/editar/:id',docenteSecretaria ,MatriculaController.updateMatricula);
    app.get('/matricula/obtener/:id',DocenteANDReprsentante ,MatriculaController.getMatricula);
    app.delete('/matricula/eliminar/:id',docenteSecretaria ,MatriculaController.deleteMatricula);
    app.get('/matricula/estudiante/periodo/:estudiante/:periodo', DocenteANDReprsentante,MatriculaController.getMatriculaByEstudiante);
    app.get('/matricula/estudiante/:estudiante', DocenteANDReprsentante,MatriculaController.getPeriodosMatriculadosByEstudiante);
    
}