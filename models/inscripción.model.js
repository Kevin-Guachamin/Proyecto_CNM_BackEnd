const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/sequelize.config')
const Matricula= require('./matricula.models')
const Asignacion=require('./asignacion.model')

const Inscripción= sequelize.define("Inscripción",
    {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        }
    },
    {
        tableName:"inscripción"
    }
)
Asignacion.belongsToMany(Matricula, {through: Inscripción, foreignKey: "id_matricula"})
Matricula.belongsToMany(Asignacion,{through: Inscripción,foreignKey: "id_asignacion"})

module.exports=Inscripción