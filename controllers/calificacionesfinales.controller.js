const CalificacionesFinales = require('../models/calificaciones_finales.model');
const Inscripcion = require('../models/inscripcion.model');
const Matricula = require('../models/matricula.models');
const Estudiante = require('../models/estudiante.model');
const { Op } = require('sequelize');

module.exports.createFinal = async (req, res) => {
  try {
    const { id_inscripcion, examen_recuperacion } = req.body;
    if (!id_inscripcion) {
      return res.status(400).json({ message: "Falta id_inscripcion" });
    }
    const nuevo = await CalificacionesFinales.create({
      ID_inscripcion: id_inscripcion,
      examen_recuperacion
    });
    return res.status(201).json(nuevo);
  } catch (error) {
    console.error("createFinal error:", error);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

module.exports.createFinalBulk = async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Array requerido" });
    }

    // 1. Construir condiciones OR
    const conditions = items.map(i => ({
      ID_inscripcion: i.id_inscripcion
    }));

    // 2. Buscar registros existentes
    const existing = await CalificacionesFinales.findAll({
      where: {
        [Op.or]: conditions
      }
    });

    // 3. Crear un Set con las claves existentes
    const existingKeys = new Set(
      existing.map(e => e.ID_inscripcion)
    );

    // 4. Filtrar registros nuevos
    const newRows = items.filter(i => !existingKeys.has(i.id_inscripcion));

    // 5. Si no hay nada nuevo
    if (newRows.length === 0) {
      return res.status(200).json({ message: "No se han insertado registros, ya existen." });
    }

    // 6. Preparar payload
    const payload = newRows.map(i => ({
      ID_inscripcion: i.id_inscripcion,
      examen_recuperacion: i.examen_recuperacion
    }));

    // 7. Insertar registros nuevos
    const created = await CalificacionesFinales.bulkCreate(payload, { validate: true });
    return res.status(201).json(created);

  } catch (error) {
    console.error("createFinalBulk error:", error);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

module.exports.updateFinal = async (req, res) => {
  try {
    const { id } = req.params;
    const { examen_recuperacion } = req.body;
    const [updated] = await CalificacionesFinales.update(
      { examen_recuperacion },
      { where: { ID: id } }
    );
    if (!updated) return res.status(404).json({ message: "No encontrado" });
    const record = await CalificacionesFinales.findByPk(id);
    return res.status(200).json(record);
  } catch (error) {
    console.error("updateFinal error:", error);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

module.exports.getFinal = async (req, res) => {
  try {
    const record = await CalificacionesFinales.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "No encontrado" });
    return res.status(200).json(record);
  } catch (error) {
    console.error("getFinal error:", error);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

module.exports.getFinalesPorAsignacion = async (req, res) => {
  try {
    const { id_asignacion } = req.params;
    const records = await CalificacionesFinales.findAll({
      include: [{
        model: Inscripcion,
        where: { ID_asignacion: id_asignacion },
        include: [{
          model: Matricula,
          attributes: ['nivel'],
          include: [{ model: Estudiante, attributes: ['ID','primer_nombre','segundo_nombre','primer_apellido','segundo_apellido'] }]
        }]
      }]
    });

    const result = records.map(r => {
      const est = r.Inscripcion?.Matricula?.Estudiante;
      const nombre = est
        ? `${est.primer_apellido} ${est.segundo_apellido||''} ${est.primer_nombre} ${est.segundo_nombre||''}`.trim()
        : null;
      return {
        id: r.ID,
        idInscripcion: r.ID_inscripcion,
        examen_recuperacion: r.examen_recuperacion,
        idEstudiante: est?.ID || null,
        nombreEstudiante: nombre,
        nivel: r.Inscripcion?.Matricula?.nivel || null
      };
    });

    result.sort((a,b) => (a.nombreEstudiante||'').localeCompare(b.nombreEstudiante));
    return res.status(200).json(result);
  } catch (error) {
    console.error("getFinalesPorAsignacion error:", error);
    return res.status(500).json({ message: "Error en servidor" });
  }
};

module.exports.deleteFinal = async (req, res) => {
  try {
    const record = await CalificacionesFinales.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "No encontrado" });
    await record.destroy();
    return res.status(200).json({ message: "Eliminado correctamente", eliminado: record });
  } catch (error) {
    console.error("deleteFinal error:", error);
    return res.status(500).json({ message: "Error en servidor" });
  }
};
