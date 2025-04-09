const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize.config');
const Inscripcion = require('./inscripcion.model');

const Calificaciones_parciales_be = sequelize.define("Calificaciones_parciales_basico", {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  insumo1: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    validate: {
      notNull: { msg: "La nota es obligatoria" },
      min: { args: [0], msg: "Mínimo 0" },
      max: { args: [10], msg: "Máximo 10" }
    }
  },
  insumo2: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    validate: {
      notNull: { msg: "La nota es obligatoria" },
      min: { args: [0], msg: "Mínimo 0" },
      max: { args: [10], msg: "Máximo 10" }
    }
  },
  evaluacion: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    validate: {
      notNull: { msg: "La nota es obligatoria" },
      min: { args: [0], msg: "Mínimo 0" },
      max: { args: [10], msg: "Máximo 10" }
    }
  },
  mejoramiento: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    validate: {
        min: { args: [0], msg: "Mínimo 0" },
        max: { args: [10], msg: "Máximo 10" }
    }
  },
  quimestre: {
    type: DataTypes.ENUM("Q1", "Q2"),
    allowNull: true
  },
  parcial: {
    type: DataTypes.ENUM("P1", "P2"),
    allowNull: true
  }
}, {
  tableName: "calificaciones_parciales_be"
});

Calificaciones_parciales_be.belongsTo(Inscripcion, { foreignKey: { name: "ID_inscripcion", allowNull: false }, targetKey: "ID" });
Inscripcion.hasMany(Calificaciones_parciales_be, { foreignKey: "ID_inscripcion", sourceKey: "ID" });

module.exports = Calificaciones_parciales_be;
