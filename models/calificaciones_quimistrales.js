const {DataTypes}=require('sequelize')
const {sequelize}= require('../config/sequelize.config')
const Inscripción=require('./inscripción.model');


const Calificaciones_quimestrales= sequelize.define("Calificaciones_quimestrales",
    {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        notaParcial1: {
            type: DataTypes.DECIMAL(4, 2), // 4 dígitos en total, 2 después del punto decimal
            allowNull: false, // No puede ser null
            validate: {
                notNull: { msg: "La nota es obligatoria" },
                min: { args: [0], msg: "La nota debe ser como mínimo 0" },
                max: { args: [10], msg: "La nota debe ser como máximo 10" }
            }
        },
        notaParcial2: {
            type: DataTypes.DECIMAL(4, 2), // 4 dígitos en total, 2 después del punto decimal
            allowNull: false, // No puede ser null
            validate: {
                notNull: { msg: "La nota es obligatoria" },
                min: { args: [0], msg: "La nota debe ser como mínimo 0" },
                max: { args: [10], msg: "La nota debe ser como máximo 10" }
            }
        },
        examen: {
            type: DataTypes.DECIMAL(4, 2), // 4 dígitos en total, 2 después del punto decimal
            allowNull: false, // No puede ser null
            validate: {
                notNull: { msg: "La nota es obligatoria" },
                min: { args: [0], msg: "La nota debe ser como mínimo 0" },
                max: { args: [10], msg: "La nota debe ser como máximo 10" }
            }
        },
        comportamiento_quimestral: {
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
        quimistre: {
            type: DataTypes.ENUM("Q1", "Q2"),
            allowNull: true,
        }
    },
    {tableName: "calificaciones_quimestrales"}
)
Calificaciones_quimestrales.belongsTo(Inscripción,{foreignKey: "id_inscripción", targetKey: "ID"})
Inscripción.hasMany(Calificaciones_quimestrales, {foreignKey: "id_inscripción", sourceKey: "ID"})

module.exports=Calificaciones_quimestrales