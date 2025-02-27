const { DataTypes } = require("sequelize");
const {sequelize}= require('../config/sequelize.config')
const Calificaciones_parciales= require('./calificaciones_parciales.model')
const Calificaciones_quimestrales=require('./calificaciones_quimistrales')
const calificaciones_finales=require('./calificaciones_finales')

const Fechas_notas = sequelize.define("Fechas_notas",
    {
        ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
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
        tableName: "fechas_notas"
    }
)
Calificaciones_parciales.belongsTo(Fechas_notas,{foreignKey: "id_fechas_notas", targetKey: "ID"})
Fechas_notas.hasOne(Calificaciones_parciales, {foreignKey: "id_fechas_notas", sourceKey: "ID"})

Calificaciones_quimestrales.belongsTo(Fechas_notas,{foreignKey: "id_fechas_notas", targetKey: "ID"})
Fechas_notas.hasOne(Calificaciones_quimestrales, {foreignKey: "id_fechas_notas", sourceKey: "ID"})

calificaciones_finales.belongsTo(Fechas_notas,{foreignKey: "id_fechas_notas", targetKey: "ID"})
Fechas_notas.hasOne(calificaciones_finales, {foreignKey: "id_fechas_notas", sourceKey: "ID"})

module.exports=Fechas_notas