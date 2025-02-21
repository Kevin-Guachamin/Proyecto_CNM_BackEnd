const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize.config')
const Matricula= require('./matricula.models')
const Asignacion=require('./asignacion.model')

const Matricula_Asignacion= sequelize.define("Matricula_Asignacion",
    {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        }
    },
    {
        tableName:"matricula_asignaciones"
    }
)
Asignacion.belongsToMany(Matricula, {through: Matricula_Asignacion, foreignKey: "id_matricula"})
Matricula.belongsToMany(Asignacion,{through: Matricula_Asignacion,foreignKey: "id_asignacion"})

module.exports=Matricula_Asignacion