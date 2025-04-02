const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/sequelize.config')
const { validarCedulaEcuatoriana } = require('../utils/validarCedulaEcuatoriana')

const Estudiante = sequelize.define('Estudiante', {
    nroCedula: {
        type: DataTypes.STRING,
        allowNull: false,
        
        unique: { msg: "La cédula del estudiante ya existe" },
        validate: {
            notNull: { msg: "El número de cédula es requerido" },
            notEmpty: { msg: "El número de cédula no puede estar vacío" },
            len: {
                args: [10, 10],
                msg: "El número de cédula del estudiante debe tener 10 dígitos"
            },
            isNumeric: { msg: "El número de cédula solo debe contener números" },
            isEcuadorianID(value) {
                if (!validarCedulaEcuatoriana(value)) {
                    throw new Error("El número de cédula del estudiante no es válido");
                }
            }
        }
    },
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
    cedula_PDF: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /\.(pdf)$/i, // Asegura que el archivo sea PDF
        }
    },
    genero: {
        type: DataTypes.ENUM('Masculino', 'Femenino'),
        allowNull: false,
        validate: {
            notNull: { msg: "El genero es requerido" },
            notEmpty: { msg: 'El genero no puede ser vacío' }
        }
    },
    anioMatricula: {
        type: DataTypes.INTEGER, // Cambiado a INTEGER
        allowNull: false,
    },
    jornada: {
        type: DataTypes.ENUM('Matutina', 'Vespertina'),
        allowNull: false,
        validate: {
            notNull: { msg: "La jornada es requerida" },
            notEmpty: { msg: 'El genero no puede ser vacío' }
        }
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,  // Solo guarda la fecha sin hora
        allowNull: false,
        validate: {
            notNull: { msg: "La fecha de nacimiento es obligatoria" },
            notEmpty: { msg: "La fecha de nacimiento no puede estar vacía" },
        },
        // Getter: Para cuando recuperas la fecha de la BD
        get() {
            const rawValue = this.getDataValue("fecha_nacimiento");
            if (rawValue) {
                const date = new Date(rawValue + "T00:00:00"); // Asegura que la fecha esté en el inicio del día
                return date.toLocaleDateString("es-ES");
            }
            return null;
        }
       
    },
    grupo_etnico: {
        type: DataTypes.ENUM("Indígena","Mestizo","Afro-descendiente", "Negro", "Blanco"),
        allowNull: false,
        validate: {
            notNull: { msg: "No se permiten valores nulos" }
        }
    },

    especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "La especialidad es requerida" },
            notEmpty: { msg: "La especialidad no puede ser vacío" },
            len: { args: [2, 50], msg: "Debe tener entre 2 y 50 caracteres" }
        }
    },
    nroMatricula: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        validate: {
            notEmpty: { msg: "El número de matrícula no puede estar vacío" },
            notNull: { msg: "El número de matrícula no debe ser nulo" },
            isIn: {
                args: [[1, 2]],  // Solo permite los valores 1 y 2
                msg: "El número de matrícula solo puede ser 1 o 2"
            }
        }
    },
    // nacionalidad: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     validate: {
    //         notNull: { msg: "La nacionalidad es requerida" },
    //         notEmpty: { msg: "La nacionalidad no puede ser vacío" },
    //         len: { args: [2, 50], msg: "Debe tener entre 4 y 50 caracteres" }
    //     }
    // },
    IER: { //instituación de educación regular
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "La IER es requerida" },
            notEmpty: { msg: "La IER no puede ser vacío" },
            len: { args: [2, 50], msg: "Debe tener entre 2 y 50 caracteres" }
        }
    },
    matricula_IER_PDF: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /\.(pdf)$/i, // Asegura que el archivo sea PDF
        }
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "La dirección es requerida" },
            notEmpty: { msg: "La dirección no puede estar vacía" },
            len: { args: [2, 100], msg: "Debe tener entre 2 y 100 caracteres" }
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
            "3ro Bachillerato",
            "Graduado"
        ),
        allowNull: false,
        validate:{
            notEmpty: {msg: "No se permiten valores vacíos"},
            notNull: {msg: "No se permiten valores nulos"},

        }
    }

},
    {
        tableName: "estudiantes"
    }
)

module.exports = Estudiante