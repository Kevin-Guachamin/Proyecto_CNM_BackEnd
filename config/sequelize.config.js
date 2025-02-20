require('dotenv').config();
const { Sequelize } = require('sequelize')
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;
const hostName = 'localhost'

// Conectar a la base de datos específica y sincronizar modelos
const sequelize = new Sequelize(db_name, username, password, {
    host: hostName,
    dialect: 'mysql'
});
const main =async()=>{
    try {
        await sequelize.sync()
        console.log('Base de datos sincronizada');
    } catch (error) {
        console.log('Error al sincronizar la BDD', error);
    }
}
main()

