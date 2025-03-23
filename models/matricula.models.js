const { sequelize } = require('../config/sequelize.config')
const { DataTypes } = require('sequelize')
const Periodo_Academico = require('./periodo_academico.model')
const Estudiante = require('./estudiante.model')

const Matrícula = sequelize.define('Matricula', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    nivel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "No se permiten nulos" },
            notEmpty: { msg: "No se permiten valores vacíos" },
            len: { args: [2, 50], msg: "Se permiten de 2 a 50 caracteres" }
        }
    }

},
    {
        tableName: "Matrículas"
    })
Estudiante.belongsToMany(Periodo_Academico, { through: Matrícula, foreignKey: {name:"ID_estudiante", allowNull: false}});
Periodo_Academico.belongsToMany(Estudiante, { through: Matrícula, foreignKey: {name: "ID_periodo_academico", allowNull: false} });
module.exports = Matrícula