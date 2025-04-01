const { DataTypes } = require("sequelize");
const { sequelize } = require('../config/sequelize.config')

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
            get() {
                const rawValue = this.getDataValue("fecha_inicio");
                if (rawValue) {
                    const date = new Date(rawValue + "T00:00:00"); // Asegura que la fecha esté en el inicio del día
                    return date.toLocaleDateString("es-ES");
                }
                return null;
            }

        },
        fecha_fin: {
            type: DataTypes.DATEONLY,  // Solo guarda la fecha sin hora
            allowNull: false,
            validate: {
                notNull: { msg: "La fecha de nacimiento es obligatoria" },
                notEmpty: { msg: "La fecha de nacimiento no puede estar vacía" },
            },
            get() {
                const rawValue = this.getDataValue("fecha_fin");
                if (rawValue) {
                    const date = new Date(rawValue + "T00:00:00"); // Asegura que la fecha esté en el inicio del día
                    return date.toLocaleDateString("es-ES");
                }
                return null;
            }

        },
        descripcion: {
            type: DataTypes.ENUM,
            values: [
                "parcial1_quim1",
                "parcial2_quim1",
                "quimestre1",
                "parcial1_quim2",
                "parcial2_quim2",
                "quimestre2",
                "nota_final"
            ],
            allowNull: false,
            validate: {
                notNull: { msg: "La descripción es obligatoria" },
                notEmpty: { msg: "La descripción no puede estar vacía" },
            },
        },
    },
    {
        tableName: "fechas_notas"
    }
)


module.exports = Fechas_notas