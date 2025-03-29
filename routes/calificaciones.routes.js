const ParcialesController = require('../controllers/calificacionesparciales.controller');
const QuimestresController = require('../controllers/calificacionesquimestres.controller');
const FinalController = require('../controllers/calificacionesfinales.controller');

module.exports = (app) => {
  // Rutas para Parciales
  app.post('/parciales', ParcialesController.createParcial);
  app.post('/parciales/bulk', ParcialesController.createParcialBulk);
  app.get('/parciales/:id', ParcialesController.getParcial);
  app.get('/parciales/asignacion/:id_asignacion', ParcialesController.getParcialesPorAsignacion);
  app.put('/parciales/:id', ParcialesController.updateParcial);
  app.delete('/parciales/:id', ParcialesController.deleteParcial);

 

  // Rutas para Quimestrales
  app.post('/quimestrales', QuimestresController.createQuimestral);
  app.post('/quimestrales/bulk', QuimestresController.createQuimestralBulk);
  app.get('/quimestrales/:id', QuimestresController.getQuimestral);
  app.get('/quimestrales/asignacion/:id_asignacion', QuimestresController.getQuimestralesPorAsignacion);
  app.put('/quimestrales/:id', QuimestresController.updateQuimestral);
  app.delete('/quimestrales/:id', QuimestresController.deleteQuimestral); 
  

  // Ruta para el Reporte Final Anual
  app.post('/finales', FinalController.createFinal);
  app.post('/finales/bulk', FinalController.createFinalBulk);
  app.get('/finales/:id', FinalController.getFinal);
  app.get('/finales/asignacion/:id_asignacion', FinalController.getFinalesPorAsignacion);
  app.put('/finales/:id', FinalController.updateFinal);
  app.delete('/finales/:id', FinalController.deleteFinal);

};
