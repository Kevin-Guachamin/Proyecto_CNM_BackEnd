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
// Asegúrate de que la clave foránea se asocie de forma correcta:
Matricula.belongsToMany(Asignacion, { through: Inscripción, foreignKey: "id_matricula" });
Asignacion.belongsToMany(Matricula, { through: Inscripción, foreignKey: "id_asignacion" });

module.exports=Inscripción