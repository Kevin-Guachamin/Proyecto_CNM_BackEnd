const Periodo_AcademicoController= require('../controllers/periodo_academico.controller');
const {docenteAdministrador} = require('../middlewares/protect')
const {DocenteANDReprsentante} = require('../middlewares/protect')


module.exports = (app) => {
    app.post('/api/periodo_academico/crear',docenteAdministrador ,Periodo_AcademicoController.createPeriodo);
    app.put('/api/periodo_academico/editar/:id', docenteAdministrador,Periodo_AcademicoController.updatePeriodo);
    app.get('/api/periodo_academico/obtener/:id', DocenteANDReprsentante,Periodo_AcademicoController.getPeriodo);
    app.get('/api/periodo_academico/obtener', DocenteANDReprsentante,Periodo_AcademicoController.getPeriodos);
    app.get('/api/periodo_academico/activo', DocenteANDReprsentante,Periodo_AcademicoController.getPeriodoActivo);
    app.delete('/api/periodo_academico/eliminar/:id',docenteAdministrador ,Periodo_AcademicoController.deletePeriodo);
}