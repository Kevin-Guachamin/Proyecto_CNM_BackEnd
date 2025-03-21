const LoginController = require('../controllers/login.controller');

module.exports = function(app) {
    app.post('/login', LoginController.login);    
}

