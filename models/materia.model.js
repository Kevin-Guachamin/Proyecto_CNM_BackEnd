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
            isOnlyLetters(value) {
                if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
                    throw new Error("El primer nombre solo puede contener letras y espacios");
                }
            }
        }
    },
    nivel: {
        type: DataTypes.ENUM(
            "1ro Básico Elemental",
            "2do Básico Elemental",
            "1ro Básico Medio",
            "2do Básico Medio",
            "3ro Básico Medio",
            "1ro Básico Superior",
            "2do Básico Superior",
            "3ro Básico Superior",
            "1ro Bachillerato",
            "2do Bachillerato",
            "3ro Bachillerato"
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