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
    periodo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El periodo es requerido" },
            notEmpty: { msg: "El periodo no debe ser vacío" },
            len: { args: [2, 50], msg: "El periodo debe tener entre 2 y 50 caracteres" }
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
Asignacion.belongsTo(Materia, { foreignKey: "id_materia", targetKey: "ID", as: "materiaDetalle" });
  
module.exports = Asignacion;