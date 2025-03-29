const {DataTypes}=require('sequelize')
const {sequelize}= require('../config/sequelize.config')
const Inscripcion=require('./inscripcion.model');


const Calificaciones_quimestrales= sequelize.define("Calificaciones_quimestrales",
    {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
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
        quimestre: {
            type: DataTypes.ENUM("Q1", "Q2"),
            allowNull: true,
        }
    },
    {tableName: "calificaciones_quimestrales"}
)
Calificaciones_quimestrales.belongsTo(Inscripcion,{foreignKey: {name:"ID_inscripcion", allowNull: false}, targetKey: "ID"})
Inscripcion.hasMany(Calificaciones_quimestrales, {foreignKey: "ID_inscripcion", sourceKey: "ID"})

module.exports=Calificaciones_quimestrales