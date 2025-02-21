const {sequelize}= require('../config/sequelize.config')
const {DataTypes}= require('sequelize')
const Año_Lectivo= require('./año_lectivo.model')
const Estudiante= require('./estudiante.model')

const Matrícula = sequelize.define('Matricula',{
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    nivel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {msg: "No se permiten nulos"},
            notEmpty: {msg: "No se permiten valores vacíos"},
            len: {args: [2,50], msg: "Se permiten de 2 a 50 caracteres"}
        }
    }

},
{
    tableName: "Matrículas"
})
Año_Lectivo.belongsToMany(Estudiante, {through: Matrícula, foreignKey: "nroCedula_estudiante"});
Estudiante.belongsToMany(Año_Lectivo, {through: Matrícula, foreignKey: "ID_año_lectivo"})
module.exports=Matrícula