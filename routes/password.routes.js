const { changePassword,requestPasswordReset,resetPassword } = require('../controllers/password.controller')
const { validatePasswordChange } = require('../controllers/password.controller')
const { DocenteANDReprsentante}=require('../middlewares/protect')

module.exports=(app)=>{
app.post('/change_password', DocenteANDReprsentante, validatePasswordChange, changePassword)
app.post('/verificar_email',requestPasswordReset)
app.post('/reset_password',validatePasswordChange,resetPassword)
}