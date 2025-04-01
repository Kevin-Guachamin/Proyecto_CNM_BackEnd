const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/sequelize.config')
const Docente = require('./docente.model')
const Periodo_Academico = require('./periodo_academico.model')
const Materia = require('./materia.model')


const Asignacion = sequelize.define("Asignacion", {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    paralelo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
        validate: {
            notNull: { msg: "El paralelo es requerido" },
            len: { args: [0, 50], msg: "El paralelo tener entre 1 y 50 caracteres" },
        }
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notNull: { msg: "La hora de inicio es requerida" },
            notEmpty: { msg: "La hora de inicio no debe estar vacía" },
            is: {
                args: /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
                msg: "La hora de inicio debe estar en formato HH:MM o HH:MM:SS"
            }
        },
        get() {
            const rawValue = this.getDataValue("horaInicio");
            return rawValue ? rawValue.slice(0, 5) : null; // Extrae solo HH:MM
        }
    },
    horaFin: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notNull: { msg: "La hora de fin es requerida" },
            notEmpty: { msg: "La hora de fin no debe estar vacía" },
            is: {
                args: /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
                msg: "La hora de fin debe estar en formato HH:MM o HH:MM:SS"
            },
            validarOrden(value) {
                if (this.horaInicio && value <= this.horaInicio) {
                    throw new Error("La hora de fin debe ser mayor que la hora de inicio");
                }
            }
        },
        get() {
            const rawValue = this.getDataValue("horaFin");
            return rawValue ? rawValue.slice(0, 5) : null; // Extrae solo HH:MM
        }
    },
    dias: {
        type: DataTypes.JSON, // Usa JSON para MySQL
        allowNull: false,
        validate: {
            isArrayOfValidDays(value) {
                const validDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

                // 1. Verifica que sea un array
                if (!Array.isArray(value)) {
                    throw new Error("El campo 'dias' debe ser un array");
                }

                // 2. Verifica que tenga entre 1 y 2 elementos
                if (value.length < 1 || value.length > 2) {
                    throw new Error("Debe seleccionar entre 1 y 2 días");
                }

                // 3. Verifica que cada elemento sea un día válido
                for (const day of value) {
                    if (!validDays.includes(day)) {
                        throw new Error(`"${day}" no es un día válido`);
                    }
                }
            }
        }
    },
    cupos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: "No se permiten valores vacíos" },
            notNull: { msg: "No se permiten valores nulos" },
            isInt: { msg: "Debe ser un número entero" },
            min: { args: 1, msg: "La cantidad mínima debe ser 1" }, // Valor mínimo
        }
    },
    cuposDisponibles: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: "No se permiten valores vacíos" },
            notNull: { msg: "No se permiten valores nulos" },
            isInt: { msg: "Debe ser un número entero" },
            
        }
    }
},
    {
        tableName: "asignaciones"
    })
Docente.belongsToMany(Materia, { through: Asignacion, foreignKey: "nroCedula_docente" })
Materia.belongsToMany(Docente, { through: Asignacion, foreignKey: "id_materia" })
Asignacion.belongsTo(Periodo_Academico, { foreignKey: "id_periodo_academico", targetKey: "ID" })
Periodo_Academico.hasMany(Asignacion, { foreignKey: "id_periodo_academico", sourceKey: "ID" })

// Permite incluir directamente datos de Docente y Materia desde Asignación
Asignacion.belongsTo(Docente, { foreignKey: "nroCedula_docente", targetKey: "nroCedula" });
Asignacion.belongsTo(Materia, {as:"materiaDetalle", foreignKey: "id_materia", targetKey: "ID" });
//no borrar as materiaDetalle se necesita para el getAll de asignacion
// Permite incluir directamente datos de Materia desde Asignación

module.exports = Asignacion;