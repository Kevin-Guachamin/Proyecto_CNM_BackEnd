const { changePassword,requestPasswordReset,resetPassword } = require('../controllers/password.controller')
const { validatePasswordChange } = require('../controllers/password.controller')
const { DocenteANDReprsentante}=require('../middlewares/protect')

module.exports=(app)=>{
app.post('/api/change_password', DocenteANDReprsentante, validatePasswordChange, changePassword)
app.post('/api/verificar_email',requestPasswordReset)
app.post('/api/reset_password',validatePasswordChange,resetPassword)
}