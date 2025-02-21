const {DataTypes}= require('sequelize')
const sequelize= require('../config/sequelize.config')

const Año_Lectivo = sequelize.define('Año_Lectivo',{
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "La descripción del año lectivo es requerida"},
            notEmpty: {msg: "La descripción del año lectivo no puede ser vacía"},
            len: { args: [2, 50], msg: "La descripción debe tener entre 2 y 50 caracteres"},
            
        }
    },
    estado: {
        type: DataTypes.ENUM("En curso", "Finalizado"),
        allowNull: false,
        defaultValue: "En curso",
    }
},
{
    tableName: 'años_lectivos'
}
)
module.exports=Año_Lectivo;