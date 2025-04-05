const DocenteController = require('../controllers/docente.controller')
const {changePassword}=require('../controllers/change_password.controller')
const {validatePasswordChange}=require('../controllers/change_password.controller')
const {Docente}=require('../middlewares/protect')


module.exports= (app)=>{
    app.post('/docente/crear',DocenteController.createDocente)
    app.put('/docente/editar/:cedula',DocenteController.editDocente)
    app.get('/docente/obtener/:cedula',DocenteController.getDocente)
    app.get('/docente/obtener',DocenteController.getDocentes)
    app.delete('/docente/eliminar/:cedula',DocenteController.eliminarDocente)
    app.post('/docente/password',Docente,validatePasswordChange,changePassword)
}