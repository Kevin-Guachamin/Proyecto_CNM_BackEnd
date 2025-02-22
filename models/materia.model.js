const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/sequelize.config')

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
    }
    
},
{
    tableName:'materias'
}
);
module.exports=Materia