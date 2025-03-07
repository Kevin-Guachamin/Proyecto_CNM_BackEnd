const ParcialesController = require('../controllers/calificacionesparciales.controller');
const QuimestresController = require('../controllers/calificacionesquimestres.controller');
const FinalController = require('../controllers/calificacionesfinales.controller');

module.exports = (app) => {
  // Rutas para Parciales
  app.post('/api/parciales', ParcialesController.createParcial);
  app.get('/api/parciales/:id', ParcialesController.getParcial);
  app.put('/api/parciales/:id', ParcialesController.updateParcial);
  app.delete('/api/parciales/:id', ParcialesController.deleteParcial);
 

  // Rutas para Quimestres
  app.post('/api/quimestres', QuimestresController.updateQuimestre);
  app.get('/api/quimestres/:id', QuimestresController.getQuimestre);
  

  // Ruta para el Reporte Final Anual
  app.get('/api/final', FinalController.getFinal);
};
