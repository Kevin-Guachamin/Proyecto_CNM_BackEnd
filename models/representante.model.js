const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/sequelize.config')
const {validarCedulaEcuatoriana}= require('../utils/validarCedulaEcuatoriana')
const Estudiante = require('./estudiante.model')

const Representante = sequelize.define('Representante', {
    nroCedula: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: {msg: "la cedula ya existe"},
        validate: {
            notNull: { msg: "El número de cédula es requerido" },
            notEmpty: { msg: "El número de cédula no puede estar vacío" },
            len: {
                args: [10, 10],
                msg: "El número de cédula debe tener 10 dígitos"
            },
            isNumeric: { msg: "El número de cédula solo debe contener números" },
            isEcuadorianID(value) {
                if (!validarCedulaEcuatoriana(value)) {
                    throw new Error("El número de cédula no es válido");
                }
            }
        }
    },
    primer_nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El primer nombre es requerido" },
            notEmpty: { msg: "El primer nombre no puede estar vacío" },
            len: { args: [2, 50], msg: "El primer nombre debe tener entre 2 y 50 caracteres" },
            isOnlyLetters(value) {
                if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
                    throw new Error("El primer nombre solo puede contener letras y espacios");
                }
            }
        }
    },
    segundo_nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El segundo nombre es requerido" },
            notEmpty: { msg: "El segundo nombre no puede estar vacío" },
            len: { args: [2, 50], msg: "El segundo nombre debe tener entre 2 y 50 caracteres" },
            isOnlyLetters(value) {
                if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
                    throw new Error("El primer nombre solo puede contener letras y espacios");
                }
            }
        }
    },
    primer_apellido: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El primer apellido es requerido" },
            notEmpty: { msg: "El primer apellido no puede estar vacío" },
            len: { args: [2, 50], msg: "El primer apellido debe tener entre 2 y 50 caracteres" },
            isOnlyLetters(value) {
                if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
                    throw new Error("El primer nombre solo puede contener letras y espacios");
                }
            }
        }
    },
    segundo_apellido: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El segundo apellido es requerido" },
            notEmpty: { msg: "El segundo apellido no puede estar vacío" },
            len: { args: [2, 50], msg: "El segundo apellido debe tener entre 2 y 50 caracteres" },
            isOnlyLetters(value) {
                if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
                    throw new Error("El primer nombre solo puede contener letras y espacios");
                }
            }
        }
    },
    celular: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El celular es requerido" },
            notEmpty: { msg: "El celular no puede estar vacío" },
            isNumeric: { msg: "El celular solo puede contener números" },
            len: { args: [10, 10], msg: "El celular debe tener exactamente 10 dígitos" }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Evita correos duplicados
        validate: {
            notNull: { msg: "El correo electrónico es requerido" },
            notEmpty: { msg: "El correo electrónico no puede estar vacío" },
            isEmail: { msg: "Debe ser un correo electrónico válido" }
        }
    },
    cedula_PDF: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /\.(pdf)$/i, // Asegura que el archivo sea PDF
        }
    },
    croquis_PDF: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /\.(pdf)$/i, // Asegura que el archivo sea PDF
        }
    },
    convencional: {
        type: DataTypes.STRING,
        allowNull: false,  // No permite NULL
        defaultValue: "",  // Establece el valor vacío por defecto
        validate: {
            isNumeric: { msg: "Solo se permiten números" },  // Solo números
            len: { args: [7, 10], msg: "La longitud puede ser entre 7 y 8" }      // Longitud entre 7 y 10
        }
    },
    emergencia: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El celular emergencia es requerido" },
            notEmpty: { msg: "El celular emergencia no puede estar vacío" },
            isNumeric: { msg: "El celular solo puede contener números" },
            len: { args: [7, 10], msg: "El celular debe tener entre 7 y 10 dígitos" }
        }
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "La contraseña es requerida" },
            notEmpty: { msg: "La contraseña no puede estar vacía" },
            len: { args: [8, 100], msg: "La contraseña debe tener al menos 8 caracteres" }
        }
    }
},
    {
        tableName: 'Representantes'
    }
)

Representante.hasMany(Estudiante, {
    foreignKey: 'nroCedula_representante',
    sourceKey: 'nroCedula'
})
Estudiante.belongsTo(Representante, {
    foreignKey: 'nroCedula_representante',
    targetKey: 'nroCedula'
})
module.exports = Representante
