const Calificaciones_quimestrales_be = require('../models/calificaciones_quimestrales_be.model');
const Inscripcion = require('../models/inscripcion.model');
const Matricula = require('../models/matricula.models');
const Estudiante = require('../models/estudiante.model');
const { Op } = require('sequelize');

module.exports.createQuimestralBE = async (req, res) => {
  try {
    const { id_inscripcion, quimestre, examen } = req.body;
    if (!id_inscripcion || !quimestre) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    const nuevo = await Calificaciones_quimestrales_be.create({
      ID_inscripcion: id_inscripcion,
      quimestre,
      examen
    });
    return res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error en createQuimestralBE:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports.createQuimestralBulkBE = async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Se requiere un array de registros" });
    }

    const conditions = items.map(i => ({
      ID_inscripcion: i.id_inscripcion,
      quimestre: i.quimestre
    }));

    const existing = await Calificaciones_quimestrales_be.findAll({
      where: { [Op.or]: conditions }
    });

    const existingKeys = new Set(existing.map(r => `${r.ID_inscripcion}-${r.quimestre}`));

    const nuevos = items.filter(i => {
      const key = `${i.id_inscripcion}-${i.quimestre}`;
      return !existingKeys.has(key);
    });

    if (nuevos.length === 0) {
      return res.status(200).json({ message: "No se han insertado registros, ya existen." });
    }

    const payload = nuevos.map(i => ({
      ID_inscripcion: i.id_inscripcion,
      quimestre: i.quimestre,
      examen: i.examen
    }));

    const creados = await Calificaciones_quimestrales_be.bulkCreate(payload, { validate: true });
    return res.status(201).json(creados);

  } catch (error) {
    console.error("Error en createQuimestralBulkBE:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports.updateQuimestralBE = async (req, res) => {
  try {
    const { id } = req.params;
    const { examen, quimestre } = req.body;
    const updateData = {};
    if (examen !== undefined) updateData.examen = examen;
    if (quimestre !== undefined) updateData.quimestre = quimestre;

    const [updated] = await Calificaciones_quimestrales_be.update(updateData, { where: { ID: id } });
    if (!updated) return res.status(404).json({ message: "Registro no encontrado" });

    const registro = await Calificaciones_quimestrales_be.findByPk(id);
    return res.status(200).json(registro);
  } catch (error) {
    console.error("Error en updateQuimestralBE:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports.getQuimestralBE = async (req, res) => {
  try {
    const registro = await Calificaciones_quimestrales_be.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: "Registro no encontrado" });
    return res.status(200).json(registro);
  } catch (error) {
    console.error("Error en getQuimestralBE:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports.getQuimestralesPorAsignacionBE = async (req, res) => {
  try {
    const { id_asignacion } = req.params;
    const records = await Calificaciones_quimestrales_be.findAll({
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
        ? `${est.primer_apellido} ${est.segundo_apellido || ''} ${est.primer_nombre} ${est.segundo_nombre || ''}`.trim()
        : null;
      return {
        id: r.ID,
        idInscripcion: r.ID_inscripcion,
        quimestre: r.quimestre,
        examen: r.examen,
        idEstudiante: est?.ID || null,
        nombreEstudiante: nombre,
        nivel: r.Inscripcion?.Matricula?.nivel || null
      };
    });

    result.sort((a,b) => (a.nombreEstudiante||'').localeCompare(b.nombreEstudiante));
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en getQuimestralesPorAsignacionBE:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports.deleteQuimestralBE = async (req, res) => {
  try {
    const registro = await Calificaciones_quimestrales_be.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ message: "Registro no encontrado" });
    await registro.destroy();
    return res.status(200).json({ message: "Eliminado correctamente", eliminado: registro });
  } catch (error) {
    console.error("Error en deleteQuimestralBE:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
