const sequelize=require('./config/sequelize.config');
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
const startServer = async () => {
    try {
        const mensaje = await sequelize.conexion(); // Espera a que la BD se sincronice
        console.log(mensaje);

        // Una vez sincronizada, inicia el servidor
        app.listen(port, () => {
            console.log("Server listening at port", port);
        });
    } catch (error) {
        console.error("Error al sincronizar la base de datos:", error);
    }
};
const allDocente= require('./routes/docente.routes')
allDocente(app)
// Llamar a la función para iniciar
startServer();

