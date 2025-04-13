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
  app.get('/parciales/inscripcion/:id_inscripcion', ParcialesController.getParcialPorInscripcion);
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
  app.post('/parcialesbe', ParcialesControllerBE.createParcialBE);
  app.post('/parcialesbe/bulk', ParcialesControllerBE.createParcialBEBulk);
  app.get('/parcialesbe/:id', ParcialesControllerBE.getParcialBE);
  app.get('/parcialesbe/asignacion/:id_asignacion', ParcialesControllerBE.getParcialesBEPorAsignacion);
  app.get('/parcialesbe/inscripcion/:id_inscripcion', ParcialesControllerBE.getParcialBEPorInscripcion);
  app.put('/parcialesbe/:id', ParcialesControllerBE.updateParcialBE);
  app.delete('/parcialesbe/:id', ParcialesControllerBE.deleteParcialBE);

  // Rutas para Quimestrales BE
  app.post('/quimestralesbe', QuimestresControllerBE.createQuimestralBE);
  app.post('/quimestralesbe/bulk', QuimestresControllerBE.createQuimestralBulkBE);
  app.get('/quimestralesbe/:id', QuimestresControllerBE.getQuimestralBE);
  app.get('/quimestralesbe/asignacion/:id_asignacion', QuimestresControllerBE.getQuimestralesPorAsignacionBE);
  app.put('/quimestralesbe/:id', QuimestresControllerBE.updateQuimestralBE);
  app.delete('/quimestralesbe/:id', QuimestresControllerBE.deleteQuimestralBE);
};
