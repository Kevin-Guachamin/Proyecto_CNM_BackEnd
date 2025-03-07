const {DataTypes}= require('sequelize')
const {sequelize}= require('../config/sequelize.config')

const Periodo_Academico = sequelize.define('Periodo_Academico',{
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
            notNull: { msg: "La descripción del periodo es requerida"},
            notEmpty: {msg: "La descripción del periodo no puede ser vacía"},
            len: { args: [2, 50], msg: "La descripción debe tener entre 2 y 50 caracteres"},
            
        }
    },
    estado: {
        type: DataTypes.ENUM("En curso", "Finalizado"),
        allowNull: false,
        defaultValue: "En curso",
    },
    fecha_inicio: {
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
    fecha_fin: {
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
    }
},
{
    tableName: 'periodos_academicos'
}
)
module.exports=Periodo_Academico;