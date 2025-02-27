const {DataTypes}=require('sequelize')
const {sequelize}= require('../config/sequelize.config')
const Matricula_Asignacion=require('./matricula_asignacion.model')

const Calificaciones= sequelize.define("Calificaciones",
    {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        nota1: {
            type: DataTypes.DECIMAL(4, 2), // 4 dígitos en total, 2 después del punto decimal
            allowNull: false, // No puede ser null
            validate: {
                notNull: { msg: "La nota es obligatoria" },
                min: { args: [0], msg: "La nota debe ser como mínimo 0" },
                max: { args: [10], msg: "La nota debe ser como máximo 10" }
            }
        },
        nota2: {
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
        comportamiento: {
          type: DataTypes.JSON,
          allowNull: false,
          validate: {
            isValidBehavior(value) {
              // Si "parcial" tiene valor (P1 o P2), se espera un array de 10 valores binarios.
              if (this.parcial) {
                if (!Array.isArray(value)) {
                  throw new Error("En parciales, comportamiento debe ser un array.");
                }
                if (value.length !== 10) {
                  throw new Error("En parciales, comportamiento debe tener 10 valores.");
                }
                for (const val of value) {
                  if (val !== 0 && val !== 1) {
                    throw new Error("Cada valor en comportamiento debe ser 0 o 1 en parciales.");
                  }
                }
              } else {
                // Si "parcial" es null (registro quimestral), se espera un número.
                if (typeof value !== "number") {
                  throw new Error("En quimestres, comportamiento debe ser un número.");
                }
                // Opcional: validar rango del número, por ejemplo, entre 0 y 10.
                if (value < 0 || value > 10) {
                  throw new Error("En quimestres, comportamiento debe estar entre 0 y 10.");
                }
              }
            }
          }
        },        
        quimistre: {
            type: DataTypes.ENUM("Q1", "Q2"),
            allowNull: true,
        },
        parcial:{
            type: DataTypes.ENUM("P1","P2"),
            allowNull: true
        }
    },
    {tableName: "calificaciones"}
)
Calificaciones.belongsTo(Matricula_Asignacion,{foreignKey: "id_matricula_asignacion", targetKey: "ID"})
Matricula_Asignacion.hasMany(Calificaciones, {foreignKey: "id_matricula_asignacion", sourceKey: "ID"})
module.exports=Calificaciones