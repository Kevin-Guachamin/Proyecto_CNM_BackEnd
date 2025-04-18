const DownlodadController = require('../controllers/downloadFile.controller');
const {DocenteANDReprsentante,docenteSecretaria}=require('../middlewares/protect')


module.exports = (app) => {
    app.get('/download/:folder/:filename',DocenteANDReprsentante,DownlodadController.getFile)
    app.post('/download-zip',docenteSecretaria,DownlodadController.getFilesAsZip)
}