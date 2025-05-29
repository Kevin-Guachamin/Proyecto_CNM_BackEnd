const MateriaController = require('../controllers/materia.controller')
const {docenteAdministrador,Docente}=require('../middlewares/protect')
module.exports= (app)=>{
    app.post('/api/materia/crear',docenteAdministrador,MateriaController.createMateria)
    app.put('/api/materia/editar/:id',docenteAdministrador,MateriaController.updateMateria)
    app.get('/api/materia/obtener/:id',Docente,MateriaController.getMateria)
    app.get('/api/materia/obtener',Docente,MateriaController.getMaterias)
    app.delete('/api/materia/eliminar/:id',docenteAdministrador,MateriaController.deleteMateria)
    app.get('/api/materia/individual',Docente,MateriaController.getMateriasIndividuales)
}