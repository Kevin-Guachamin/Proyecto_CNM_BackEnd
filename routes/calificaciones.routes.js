const ParcialesController = require('../controllers/calificacionesparciales.controller');
const QuimestresController = require('../controllers/calificacionesquimestres.controller');
const FinalController = require('../controllers/calificacionesfinales.controller');

module.exports = (app) => {
  // Rutas para Parciales
  app.post('/api/parciales', ParcialesController.createParcial);
  app.get('/api/parciales/:id', ParcialesController.getParcial);
  app.put('/api/parciales/:id', ParcialesController.updateParcial);
  app.delete('/api/parciales/:id', ParcialesController.deleteParcial);
  app.get('/api/parciales', ParcialesController.getAllParciales);

  // Rutas para Quimestres
  app.post('/api/quimestres', QuimestresController.createQuimestre);
  app.put('/api/quimestres/:id', QuimestresController.updateQuimestre);
  app.get('/api/quimestres/:id', QuimestresController.getQuimestre);
  app.get('/api/quimestres', QuimestresController.getAllQuimestres);

  // Ruta para el Reporte Final Anual
  app.get('/api/final', FinalController.getFinalReport);
};
