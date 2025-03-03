const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/sequelize.config')
const Inscripción = require('./inscripción.model')

const calificaciones_finales = sequelize.define("Calificaciones_parciales",
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    nota_final_Q1: {
      type: DataTypes.DECIMAL(4, 2), // 4 dígitos en total, 2 después del punto decimal
      allowNull: false, // No puede ser null
      validate: {
        notNull: { msg: "La nota es obligatoria" },
        min: { args: [0], msg: "La nota debe ser como mínimo 0" },
        max: { args: [10], msg: "La nota debe ser como máximo 10" }
      }
    },
    nota_final_Q2: {
      type: DataTypes.DECIMAL(4, 2), // 4 dígitos en total, 2 después del punto decimal
      allowNull: false, // No puede ser null
      validate: {
        notNull: { msg: "La nota es obligatoria" },
        min: { args: [0], msg: "La nota debe ser como mínimo 0" },
        max: { args: [10], msg: "La nota debe ser como máximo 10" }
      }
    },
    examen_recuperacion: {
      type: DataTypes.DECIMAL(4, 2), // 4 dígitos en total, 2 después del punto decimal
      allowNull: false, // No puede ser null
      defaultValue: 0,
      validate: {
        notNull: { msg: "La nota es obligatoria" },
        min: { args: [0], msg: "La nota debe ser como mínimo 0" },
        max: { args: [10], msg: "La nota debe ser como máximo 10" }
      }
    },
    comportamiento_final: {
      type: DataTypes.JSON, // Para MySQL
      allowNull: false,
      validate: {
        isArrayOfBinaryValues(value) {
          // 1. Verifica que sea un array
          if (!Array.isArray(value)) {
            throw new Error("comportamiento debe ser un array");
          }

          // 2. Verifica que tenga 10 elementos
          if (value.length !== 10) {
            throw new Error("comportamiento debe tener 10 valores");
          }

          // 3. Verifica que cada valor sea 0 o 1
          for (const val of value) {
            if (val !== 0 && val !== 1) {
              throw new Error("Cada valor en comportamiento debe ser 0 o 1");
            }
          }
        }
      }
    },

  },
  { tableName: "calificaciones_finales" }
)
calificaciones_finales.belongsTo(Inscripción, { foreignKey: "id_inscripción", targetKey: "ID" })
Inscripción.hasMany(calificaciones_finales, { foreignKey: "id_inscriptción", sourceKey: "ID" })

module.exports = calificaciones_finales