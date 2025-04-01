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
     
},
    {
        tableName: "Matriculas"
    })
Estudiante.belongsToMany(Periodo_Academico, { through: Matrícula, foreignKey: {name:"ID_estudiante", allowNull: false}, unique: false });
Periodo_Academico.belongsToMany(Estudiante, { through: Matrícula, foreignKey: {name: "ID_periodo_academico", allowNull: false} ,unique: false });

// ✅ NUEVA relación necesaria para los include
Matrícula.belongsTo(Estudiante, { foreignKey: 'ID_estudiante' });

module.exports = Matrícula