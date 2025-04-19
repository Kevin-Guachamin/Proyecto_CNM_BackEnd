const MateriaController = require('../controllers/materia.controller')
const {docenteAdministrador,Docente}=require('../middlewares/protect')
module.exports= (app)=>{
    app.post('/materia/crear',docenteAdministrador,MateriaController.createMateria)
    app.put('/materia/editar/:id',docenteAdministrador,MateriaController.updateMateria)
    app.get('/materia/obtener/:id',Docente,MateriaController.getMateria)
    app.get('/materia/obtener',Docente,MateriaController.getMaterias)
    app.delete('/materia/eliminar/:id',docenteAdministrador,MateriaController.deleteMateria)
    app.get('/materia/individual',Docente,MateriaController.getMateriasIndividuales)
}