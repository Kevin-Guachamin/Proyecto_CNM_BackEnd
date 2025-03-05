const AñoLectivoController= require('./controllers/año_lectivo.controller');

module.exports = (app) => {
    app.post('/año_lectivo/crear', AñoLectivoController.createAñoLectivo);
    app.put('/año_lectivo/editar/:id', AñoLectivoController.updateAñoLectivo);
    app.get('/año_lectivo/obtener/:id', AñoLectivoController.getAñoLectivo);
    app.get('/año_lectivo/obtener', AñoLectivoController.getAllAñoLectivo);
    app.delete('/año_lectivo/eliminar/:id', AñoLectivoController.deleteAñoLectivo);
}