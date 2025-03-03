const MateriaController = require('../controllers/materia.controller')

module.exports= (app)=>{
    app.post('/materia/crear',MateriaController.createMateria)
    app.put('/materia/editar/:id',MateriaController.updateMateria)
    app.get('/materia/obtener/:id',MateriaController.getMateria)
    app.get('/materia/obtener',MateriaController.getMaterias)
    app.delete('/materia/eliminar/:id',MateriaController.deleteMateria)
}