require('./config/sequelize.config');
require('./models/docente.model')
require('./models/perfil.model')
require('./models/año_lectivo.model')
require('./models/asignacion.model')
require('./models/calificaciones.model')
require('./models/estudiante.model')
require('./models/materia.model')
require('./models/matricula_asignacion.model')
require('./models/matricula.models')
require('./models/representante.model')
const express = require('express')
const cors= require('cors')

const app= express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

const port=8000;

app.listen(port, () => {
    console.log("Server listening at port", port);
    })
