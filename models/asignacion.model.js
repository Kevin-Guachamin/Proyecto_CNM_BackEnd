const {DataTypes}= require('sequelize')
const sequelize= require('../config/sequelize.config')
const Docente= require('./docente.model')
const Año_Lectivo = require('./año_lectivo.model')
const Materia = require('./materia.model')


const Asignación = sequelize.define("Asignación",{
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
    }

},
{
    tableName: "asignaciones"
})
Docente.belongsToMany(Materia,{through: Asignación, foreignKey: "nroCedula_docente"})
Materia.belongsToMany(Docente,{through: Asignación, foreignKey: "id_materia"})
Asignación.belongsTo(Año_Lectivo,{foreignKey: "id_año_lectivo", targetKey: "ID"})
Año_Lectivo.hasMany(Asignación, {foreignKey: "id_año_lectivo", sourceKey: "ID"})



module.exports=Asignación;