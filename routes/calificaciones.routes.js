const ParcialesController = require('../controllers/calificacionesparciales.controller');
const QuimestresController = require('../controllers/calificacionesquimestres.controller');
const FinalController = require('../controllers/calificacionesfinales.controller');
const ParcialesControllerBE  = require('../controllers/calificacionesparcialesbe.controller');
const QuimestresControllerBE  = require('../controllers/calificacionesquimestresbe.controller');
const {docenteProfesor} = require('../middlewares/protect');

module.exports = (app) => {
  // Rutas para Parciales
  app.post('/parciales', docenteProfesor,ParcialesController.createParcial);
  app.post('/parciales/bulk', docenteProfesor,ParcialesController.createParcialBulk);
  app.get('/parciales/:id', ParcialesController.getParcial);
  app.get('/parciales/asignacion/:id_asignacion', ParcialesController.getParcialesPorAsignacion);
  app.put('/parciales/:id', docenteProfesor,ParcialesController.updateParcial);
  app.delete('/parciales/:id', docenteProfesor,ParcialesController.deleteParcial);

  // Rutas para Quimestrales
  app.post('/quimestrales', docenteProfesor,QuimestresController.createQuimestral);
  app.post('/quimestrales/bulk', docenteProfesor,QuimestresController.createQuimestralBulk);
  app.get('/quimestrales/:id', QuimestresController.getQuimestral);
  app.get('/quimestrales/asignacion/:id_asignacion', QuimestresController.getQuimestralesPorAsignacion);
  app.put('/quimestrales/:id', docenteProfesor,QuimestresController.updateQuimestral);
  app.delete('/quimestrales/:id', docenteProfesor,QuimestresController.deleteQuimestral); 
  
  // Ruta para el Reporte Final Anual
  app.post('/finales', docenteProfesor,FinalController.createFinal);
  app.post('/finales/bulk', docenteProfesor,FinalController.createFinalBulk);
  app.get('/finales/:id', FinalController.getFinal);
  app.get('/finales/asignacion/:id_asignacion', FinalController.getFinalesPorAsignacion);
  app.put('/finales/:id', docenteProfesor,FinalController.updateFinal);
  app.delete('/finales/:id', docenteProfesor,FinalController.deleteFinal);

  // Rutas para Parciales BE
  app.post('/parciales/be', ParcialesControllerBE.createParcialBE);
  app.post('/parciales/be/bulk', ParcialesControllerBE.createParcialBEBulk);
  app.get('/parciales/be/:id', ParcialesControllerBE.getParcialBE);
  app.get('/parciales/be/asignacion/:id_asignacion', ParcialesControllerBE.getParcialesPorAsignacionBE);
  app.put('/parciales/be/:id', ParcialesControllerBE.updateParcialBE);
  app.delete('/parciales/be/:id', ParcialesControllerBE.deleteParcialBE);

  // Rutas para Quimestrales BE
  app.post('/quimestrales/be', QuimestresControllerBE.createQuimestralBE);
  app.post('/quimestrales/be/bulk', QuimestresControllerBE.createQuimestralBulkBE);
  app.get('/quimestrales/be/:id', QuimestresControllerBE.getQuimestralBE);
  app.get('/quimestrales/be/asignacion/:id_asignacion', QuimestresControllerBE.getQuimestralesPorAsignacionBE);
  app.put('/quimestrales/be/:id', QuimestresControllerBE.updateQuimestralBE);
  app.delete('/quimestrales/be/:id', QuimestresControllerBE.deleteQuimestralBE);
};
