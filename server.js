const sequelize=require('./config/sequelize.config');



require('./models/asignacion.model')
require('./models/estudiante.model')
require('./models/inscripción.model')
require('./models/matricula.models')

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

const allCalificaciones= require('./routes/calificaciones.routes')
allCalificaciones(app)

const allRepresentante= require('./routes/representante.routes')
allRepresentante(app)

const allMateria = require('./routes/materia.routes')
allMateria(app)

const allPeriodos= require('./routes/periodo_academico.routes')
allPeriodos(app)
// Llamar a la función para iniciar
startServer();

