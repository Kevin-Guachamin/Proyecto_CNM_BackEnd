const DocenteController = require('../controllers/docente.controller')
const { changePassword } = require('../controllers/password.controller')
const { validatePasswordChange } = require('../controllers/password.controller')
const { Docente, docenteAdministrador } = require('../middlewares/protect')



module.exports = (app) => {
    app.post('/api/docente/crear', docenteAdministrador, DocenteController.createDocente)
    app.put('/api/docente/editar/:cedula', docenteAdministrador, DocenteController.editDocente)
    app.get('/api/docente/obtener/:cedula', DocenteController.getDocente)
    app.get('/api/docente/obtener', Docente, DocenteController.getDocentes)
    app.delete('/api/docente/eliminar/:cedula', docenteAdministrador, DocenteController.eliminarDocente)
}