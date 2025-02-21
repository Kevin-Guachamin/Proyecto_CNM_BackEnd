const { DataTypes } = require('sequelize')
const {sequelize} = require('../config/sequelize.config')
const Perfil = require('./perfil.model')

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
            isAlpha: { msg: "El primer nombre solo puede contener letras" }
        }
    },
    segundo_nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El segundo nombre es requerido" },
            notEmpty: { msg: "El segundo nombre no puede estar vacío" },
            len: { args: [2, 50], msg: "El segundo nombre debe tener entre 2 y 50 caracteres" },
            isAlpha: { msg: "El segundo nombre solo puede contener letras" }
        }
    },
    primer_apellido: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El primer apellido es requerido" },
            notEmpty: { msg: "El primer apellido no puede estar vacío" },
            len: { args: [2, 50], msg: "El primer apellido debe tener entre 2 y 50 caracteres" },
            isAlpha: { msg: "El primer apellido solo puede contener letras" }
        }
    },
    segundo_apellido: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El segundo apellido es requerido" },
            notEmpty: { msg: "El segundo apellido no puede estar vacío" },
            len: { args: [2, 50], msg: "El segundo apellido debe tener entre 2 y 50 caracteres" },
            isAlpha: { msg: "El segundo apellido solo puede contener letras" }
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
    rol:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {msg: "El rol es requerido"},
            notEmpty: {msg: "El rol no puede ser vacío" },
            len: { args: [2, 50], msg: "El segundo apellido debe tener entre 2 y 50 caracteres" },
            isAlpha: { msg: "El rol solo puede contener letras" }
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


function validarCedulaEcuatoriana(cedula) {
    if (!/^\d{10}$/.test(cedula)) return false; // Debe ser numérica y de 10 dígitos

    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) return false; // Provincia inválida

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
        let valor = parseInt(cedula[i]) * coeficientes[i];
        if (valor > 9) valor -= 9;
        suma += valor;
    }

    const digitoVerificador = (10 - (suma % 10)) % 10;
    return digitoVerificador === parseInt(cedula[9]);
}
Docente.belongsToMany(Perfil, { through: 'Docente_Perfil', foreignKey: 'nroCedula' });
Perfil.belongsToMany(Docente, { through: 'Docente_Perfil', foreignKey: 'ID' });

module.exports=Docente;