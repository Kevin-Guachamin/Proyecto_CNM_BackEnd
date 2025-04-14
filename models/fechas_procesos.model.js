const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelize.config");

const Fechas_procesos = sequelize.define("Fechas_procesos", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: { msg: "La fecha de inicio es obligatoria" },
      notEmpty: { msg: "La fecha de inicio no puede estar vacía" },
    }
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: { msg: "La fecha fin es obligatoria" },
      notEmpty: { msg: "La fecha fin no puede estar vacía" },
    }
  },
  proceso: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "El nombre del proceso no puede estar vacío" }
    }
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: "fechas_procesos",
});

module.exports = Fechas_procesos;