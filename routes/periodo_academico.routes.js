const Periodo_AcademicoController= require('../controllers/periodo_academico.controller');

module.exports = (app) => {
    app.post('/periodo_academico/crear', Periodo_AcademicoController.createPeriodo);
    app.put('/periodo_academico/editar/:id', Periodo_AcademicoController.updatePeriodo);
    app.get('/periodo_academico/obtener/:id', Periodo_AcademicoController.getPeriodo);
    app.get('/periodo_academico/obtener', Periodo_AcademicoController.getPeriodos);
    app.get('/periodo_academico/activo', Periodo_AcademicoController.getPeriodoActivo);
    app.delete('/periodo_academico/eliminar/:id', Periodo_AcademicoController.deletePeriodo);
}