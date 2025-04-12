const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize.config')
const Docente=require('./docente.model')

const SolicitudesPermiso = sequelize.define("SolicitudesPermiso", {
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
            isDate: { msg: "Debe ingresar una fecha válida" }
        },
        // Getter: Para cuando recuperas la fecha de la BD
        get() {
            const rawValue = this.getDataValue("fecha_inicio");
            if (rawValue) {
                const date = new Date(rawValue + "T00:00:00"); // Asegura que la fecha esté en el inicio del día
                return date.toLocaleDateString("es-ES");
            }
            return null;
        },

    },
    fecha_fin: {
        type: DataTypes.DATEONLY,  // Solo guarda la fecha sin hora
        allowNull: false,
        validate: {
            notNull: { msg: "La fecha de finalización es obligatoria" },
            notEmpty: { msg: "La fecha de finalización no puede estar vacía" },
            isDate: { msg: "Debe ingresar una fecha válida" }
        },
        // Getter: Para cuando recuperas la fecha de la BD
        get() {
            const rawValue = this.getDataValue("fecha_fin");
            if (rawValue) {
                const date = new Date(rawValue + "T00:00:00"); // Asegura que la fecha esté en el inicio del día
                return date.toLocaleDateString("es-ES");
            }
            return null;
        },

    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El motivo es requerido" },
            notEmpty: { msg: "El motivo no puede ser vacío" },
            len: { args: [2, 50], msg: "El motivo debe tener entre 4 y 50 caracteres" }
        }
    },
    estado: {
        type: DataTypes.ENUM("Pendiente", "Aceptado","Rechazado"),
        allowNull: false,
        defaultValue: "Pendiente",
    },
    fechaSolicitud: {
        type: DataTypes.DATE,  // Solo guarda la fecha sin hora
        allowNull: false,
        validate: {
            notNull: { msg: "La fecha de solicitud es obligatoria" },
            notEmpty: { msg: "La fecha de solicitud no puede estar vacía" },
            isDate: { msg: "Debe ingresar una fecha válida" }
        },
        // Getter: Para cuando recuperas la fecha de la BD
        get() {
            const rawValue = this.getDataValue("fecha_fin");
            if (rawValue) {
                const date = new Date(rawValue + "T00:00:00"); // Asegura que la fecha esté en el inicio del día
                return date.toLocaleDateString("es-ES");
            }
            return null;
        },
    },
},{
    tableName: "SolicitudesPermisos"
})
Docente.hasMany(SolicitudesPermiso, {
    foreignKey: 'nroCedula_docente',
    sourceKey: 'nroCedula'
})
SolicitudesPermiso.belongsTo(Docente, {
    foreignKey: {
        name: 'nroCedula_docente',
        allowNull: false  // Esto evita que se creen estudiantes sin docente
    },
    targetKey: 'nroCedula'
});
module.exports=SolicitudesPermiso