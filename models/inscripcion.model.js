const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/sequelize.config')
const Matricula= require('./matricula.models')
const Asignacion=require('./asignacion.model')

const Inscripcion= sequelize.define("Inscripcion",
    {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        }
    },
    {
        tableName:"inscripciones"
    }
)
// Asegúrate de que la clave foránea se asocie de forma correcta:
Matricula.belongsToMany(Asignacion, { through: Inscripcion, foreignKey: {name: "ID_matricula", allowNull: false} });
Asignacion.belongsToMany(Matricula, { through: Inscripcion, foreignKey: {name:"ID_asignacion", allowNull: false} });

module.exports=Inscripcion