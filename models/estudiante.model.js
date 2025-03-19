const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/sequelize.config')
const { validarCedulaEcuatoriana } = require('../utils/validarCedulaEcuatoriana')

const Estudiante = sequelize.define('Estudiante', {
    nroCedula: {
        type: DataTypes.STRING,
        allowNull: false,
        
        unique: { msg: "la cedula ya existe" },
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
            return rawValue ? new Date(rawValue).toLocaleDateString("es-ES") : null;
        },
        // Setter: Para cuando envías la fecha a la BD
        set(value) {
            const [day, month, year] = value.split("/"); // Separar DD, MM, YYYY
            const formattedDate = `${year}-${month}-${day}`; // Convertir a YYYY-MM-DD
            this.setDataValue("fecha_nacimiento", formattedDate); // Guardar en la BD
        }
    },
    grupo_etnico: {
        type: DataTypes.ENUM("Ingígena","Meztizo","Afroecuatoriano"),
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

},
    {
        tableName: "estudiantes"
    }
)

module.exports = Estudiante