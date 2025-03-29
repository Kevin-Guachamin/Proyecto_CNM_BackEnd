const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/sequelize.config')
const Inscripcion = require('./inscripcion.model')

const calificaciones_finales = sequelize.define("Calificaciones_finales",
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    examen_recuperacion: {
      type: DataTypes.DECIMAL(4, 2), // 4 dígitos en total, 2 después del punto decimal
      allowNull: true, // No puede ser null
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: "La nota debe ser como mínimo 0" },
        max: { args: [10], msg: "La nota debe ser como máximo 10" }
      }
    },
  },
  { tableName: "calificaciones_finales" }
)
calificaciones_finales.belongsTo(Inscripcion, {foreignKey: {name:"ID_inscripcion", allowNull: false}, targetKey: "ID"})
Inscripcion.hasMany(calificaciones_finales, { foreignKey: "ID_inscripcion", sourceKey: "ID" })

module.exports = calificaciones_finales