const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/sequelize.config')

const Perfil = sequelize.define('Perfil', {
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
            notNull: { msg: "El nombre del perfil es requerido" },
            notEmpty: { msg: "El nombre del perfil no puede estar vacío" },
            len: { args: [2, 50], msg: "El perfil debe tener entre 2 y 50 caracteres" },
            isOnlyLetters(value) {
                if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
                    throw new Error("El primer nombre solo puede contener letras y espacios");
                }
            }
        }
    },
},
{
    tableName:'perfiles'
}
);
module.exports=Perfil