const DownlodadController = require('../controllers/downloadFile.controller');
const {DocenteANDReprsentante,docenteSecretaria}=require('../middlewares/protect')


module.exports = (app) => {
    app.get('/api/download/:folder/:filename',DocenteANDReprsentante,DownlodadController.getFile)
    app.post('/api/download-zip',docenteSecretaria,DownlodadController.getFilesAsZip)
}