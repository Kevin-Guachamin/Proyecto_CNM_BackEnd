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
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: "no se permiten valores nulos"},
                notEmpty: {msg: "no puede ser vacío"},
                len: {args: [1,2], msg: "Solo se pueden tener 1 o 2 caracteres" }
            }
        },
        quimistre: {
            type: DataTypes.ENUM("Q1", "Q2"),
            allowNull: true,
            
            
        }
    },
    {tableName: "calificaciones"}
)
Calificaciones.belongsTo(Matricula_Asignacion,{foreignKey: "id_matricula_asignacion", targetKey: "ID"})
Matricula_Asignacion.hasMany(Calificaciones, {foreignKey: "id_matricula_asignacion", sourceKey: "ID"})
module.exports=Calificaciones