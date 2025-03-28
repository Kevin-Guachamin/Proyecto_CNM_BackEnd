const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/sequelize.config')

const Materia = sequelize.define('Materia', {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El nombre de la materia es requerido" },
            notEmpty: { msg: "El nombre de la materia no puede estar vacío" },
            len: { args: [2, 50], msg: "El nombre de la materia debe tener entre 2 y 50 caracteres" },
        }
    },
    nivel: {
        type: DataTypes.ENUM(
            "1ro BE",
            "2do BE",
            "1ro BM",
            "2do BM",
            "3ro BM",
            "1ro BS",
            "2do BS",
            "3ro BS",
            "1ro BCH",
            "2do BCH",
            "3ro BCH",
            "BCH",
            "BM",
            "BS",
            "BS BCH",
        ),
        allowNull: false,
        validate:{
            notEmpty: {msg: "No se permiten valores vacíos"},
            notNull: {msg: "No se permiten valores nulos"},

        }
    },
    edadMin: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        validate:{
            notEmpty: {msg: "No se permiten valores vacíos"},
            notNull: {msg: "No se permiten valores nulos"},
            isInt: {msg: "Debe ser un número entero"},
            min: { args: 7, msg: "La edad mínima debe ser al menos 7 años" }, // Valor mínimo
        }
    } 

},
    {
        tableName: 'materias'
    }
);
module.exports = Materia