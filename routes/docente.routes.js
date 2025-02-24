const DocenteController = require('../controllers/docente.controller')

module.exports= (app)=>{
    app.post('/docente/crear',DocenteController.createDocente)
    app.put('/docente/editar/:cedula',DocenteController.editDocente)
    app.get('/docente/obtener/:cedula',DocenteController.getDocente)
}