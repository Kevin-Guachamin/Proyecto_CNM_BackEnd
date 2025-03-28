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
        validate: {
            notNull: { msg: "El paralelo es requerido" },
            notEmpty: { msg: "El paralelo no puede estar vacío" },
            len: { args: [1, 50], msg: "El paralelo tener entre 1 y 50 caracteres" },
        }
    },
    horario: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El horario es requerido" },
            notEmpty: { msg: "El horario no debe ser vacío" },
            len: { args: [2, 50], msg: "El horario debe tener entre 2 y 50 caracteres" }
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
    cupos:{
        type: DataTypes.INTEGER, 
        allowNull: false,
        validate:{
            notEmpty: {msg: "No se permiten valores vacíos"},
            notNull: {msg: "No se permiten valores nulos"},
            isInt: {msg: "Debe ser un número entero"},
            min: { args: 1, msg: "La cantidad mínima debe ser 1" }, // Valor mínimo
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
Asignacion.belongsTo(Materia, { foreignKey: "id_materia", targetKey: "ID" });
  
module.exports = Asignacion;