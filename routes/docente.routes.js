const DocenteController = require('../controllers/docente.controller')

module.exports= (app)=>{
    app.post('/docente',DocenteController.createDocente)
}