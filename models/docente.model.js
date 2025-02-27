const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/sequelize.config')
const {validarCedulaEcuatoriana}= require('../utils/validarCedulaEcuatoriana')


const Docente = sequelize.define('Docente', {
    nroCedula: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        
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
        unique: {msg: "El celular ya esta registrado"},
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
        unique: {msg: "El email ya esta registrado"},
        validate: {
            notNull: { msg: "El correo electrónico es requerido" },
            notEmpty: { msg: "El correo electrónico no puede estar vacío" },
            isEmail: { msg: "Debe ser un correo electrónico válido" }
        }
    },
    rol:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: "El rol es requerido"},
            notEmpty: {msg: "El rol no puede ser vacío" },
            len: { args: [2, 50], msg: "El segundo apellido debe tener entre 2 y 50 caracteres" },
            isOnlyLetters(value) {
                if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)) {
                    throw new Error("El primer nombre solo puede contener letras y espacios");
                }
            }
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
        tableName: 'Docentes'
    }
)





module.exports=Docente;