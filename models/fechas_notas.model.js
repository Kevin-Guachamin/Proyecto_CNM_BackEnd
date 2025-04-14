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
                notNull: { msg: "La fecha de inicio es obligatoria" },
                notEmpty: { msg: "La fecha de inicio no puede estar vacía" },
            }

        },
        fecha_fin: {
            type: DataTypes.DATEONLY,  // Solo guarda la fecha sin hora
            allowNull: false,
            validate: {
                notNull: { msg: "La fecha fin es obligatoria" },
                notEmpty: { msg: "La fecha fin no puede estar vacía" },
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
            unique: true,
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