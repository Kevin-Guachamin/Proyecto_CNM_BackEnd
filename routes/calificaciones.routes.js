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

 

  // Rutas para Quimestres
  app.post('/api/quimestres', QuimestresController.updateQuimestre);
  app.get('/api/quimestres/:id', QuimestresController.getQuimestre);
  

  // Ruta para el Reporte Final Anual
  app.get('/api/final', FinalController.getFinal);
};
