const ParcialesController = require('../controllers/calificacionesparciales.controller');
const QuimestresController = require('../controllers/calificacionesquimestres.controller');
const FinalController = require('../controllers/calificacionesfinales.controller');
const ParcialesControllerBE  = require('../controllers/calificacionesparcialesbe.controller');
const QuimestresControllerBE  = require('../controllers/calificacionesquimestresbe.controller');
const {docenteProfesor} = require('../middlewares/protect');

module.exports = (app) => {
  // Rutas para Parciales
  app.post('/api/parciales', docenteProfesor,ParcialesController.createParcial);
  app.post('/api/parciales/bulk', docenteProfesor,ParcialesController.createParcialBulk);
  app.get('/api/parciales/:id', ParcialesController.getParcial);
  app.get('/api/parciales/asignacion/:id_asignacion', ParcialesController.getParcialesPorAsignacion);
  app.get('/api/parciales/inscripcion/:id_inscripcion', ParcialesController.getParcialPorInscripcion);
  app.put('/api/parciales/:id', docenteProfesor,ParcialesController.updateParcial);
  app.delete('/api/parciales/:id', docenteProfesor,ParcialesController.deleteParcial);

  // Rutas para Quimestrales
  app.post('/api/quimestrales', docenteProfesor,QuimestresController.createQuimestral);
  app.post('/api/quimestrales/bulk', docenteProfesor,QuimestresController.createQuimestralBulk);
  app.get('/api/quimestrales/:id', QuimestresController.getQuimestral);
  app.get('/api/quimestrales/asignacion/:id_asignacion', QuimestresController.getQuimestralesPorAsignacion);
  app.put('/api/quimestrales/:id', docenteProfesor,QuimestresController.updateQuimestral);
  app.delete('/api/quimestrales/:id', docenteProfesor,QuimestresController.deleteQuimestral); 
  
  // Ruta para el Reporte Final Anual
  app.post('/api/finales', docenteProfesor,FinalController.createFinal);
  app.post('/api/finales/bulk', docenteProfesor,FinalController.createFinalBulk);
  app.get('/api/finales/:id', FinalController.getFinal);
  app.get('/api/finales/asignacion/:id_asignacion', FinalController.getFinalesPorAsignacion);
  app.put('/api/finales/:id', docenteProfesor,FinalController.updateFinal);
  app.delete('/api/finales/:id', docenteProfesor,FinalController.deleteFinal);

  // Rutas para Parciales BE
  app.post('/api/parcialesbe',docenteProfesor, ParcialesControllerBE.createParcialBE);
  app.post('/api/parcialesbe/bulk',docenteProfesor, ParcialesControllerBE.createParcialBEBulk);
  app.get('/api/parcialesbe/:id', ParcialesControllerBE.getParcialBE);
  app.get('/api/parcialesbe/asignacion/:id_asignacion', ParcialesControllerBE.getParcialesBEPorAsignacion);
  app.get('/api/parcialesbe/inscripcion/:id_inscripcion', ParcialesControllerBE.getParcialBEPorInscripcion);
  app.put('/api/parcialesbe/:id',docenteProfesor, ParcialesControllerBE.updateParcialBE);
  app.delete('/api/parcialesbe/:id',docenteProfesor, ParcialesControllerBE.deleteParcialBE);

  // Rutas para Quimestrales BE
  app.post('/api/quimestralesbe', docenteProfesor,QuimestresControllerBE.createQuimestralBE);
  app.post('/api/quimestralesbe/bulk', docenteProfesor,QuimestresControllerBE.createQuimestralBulkBE);
  app.get('/api/quimestralesbe/:id', QuimestresControllerBE.getQuimestralBE);
  app.get('/api/quimestralesbe/asignacion/:id_asignacion', QuimestresControllerBE.getQuimestralesPorAsignacionBE);
  app.put('/api/quimestralesbe/:id', docenteProfesor,QuimestresControllerBE.updateQuimestralBE);
  app.delete('/api/quimestralesbe/:id', docenteProfesor,QuimestresControllerBE.deleteQuimestralBE);
};
