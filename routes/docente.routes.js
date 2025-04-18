const DocenteController = require('../controllers/docente.controller')
const { changePassword } = require('../controllers/password.controller')
const { validatePasswordChange } = require('../controllers/password.controller')
const { Docente, docenteAdministrador } = require('../middlewares/protect')



module.exports = (app) => {
    app.post('/docente/crear', docenteAdministrador, DocenteController.createDocente)
    app.put('/docente/editar/:cedula', docenteAdministrador, DocenteController.editDocente)
    app.get('/docente/obtener/:cedula', DocenteController.getDocente)
    app.get('/docente/obtener', Docente, DocenteController.getDocentes)
    app.delete('/docente/eliminar/:cedula', docenteAdministrador, DocenteController.eliminarDocente)
}