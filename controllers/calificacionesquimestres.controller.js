const Calificaciones_quimestrales = require('../models/calificaciones_quimestrales.model');
const Inscripcion = require('../models/inscripcion.model');
const Matricula = require('../models/matricula.models');
const Estudiante = require('../models/estudiante.model');
const { Op } = require('sequelize');

/**
 * CREATE Quimestral (un solo registro)
 * POST /api/quimestrales
 */
module.exports.createQuimestral = async (req, res) => {
  try {
    const { id_inscripcion, quimestre, examen } = req.body;
    if (!id_inscripcion || !quimestre) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    const newRecord = await Calificaciones_quimestrales.create({
      ID_inscripcion: id_inscripcion,
      quimestre,
      examen
    });
    return res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error en createQuimestral:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * CREATE Quimestrales en bloque
 * POST /api/quimestrales/bulk
 */
module.exports.createQuimestralBulk = async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Se requiere un array de registros" });
    }

    // 1. Construir condiciones OR para buscar duplicados
    const conditions = items.map(i => ({
      ID_inscripcion: i.id_inscripcion,
      quimestre: i.quimestre
    }));

    // 2. Buscar registros existentes con esas claves
    const existingRecords = await Calificaciones_quimestrales.findAll({
      where: {
        [Op.or]: conditions
      }
    });

    // 3. Crear un Set con las claves existentes
    const existingKeys = new Set(
      existingRecords.map(r => `${r.ID_inscripcion}-${r.quimestre}`)
    );

    // 4. Filtrar los registros nuevos
    const newRows = items.filter(i => {
      const key = `${i.id_inscripcion}-${i.quimestre}`;
      return !existingKeys.has(key);
    });

    // 5. Si no hay nada nuevo, retornamos 200 con un mensaje
    if (newRows.length === 0) {
      return res.status(200).json({ message: "No se han insertado registros, ya existen." });
    }

    // 6. Preparar payload para bulkCreate
    const payload = newRows.map(i => ({
      ID_inscripcion: i.id_inscripcion,
      quimestre: i.quimestre,
      examen: i.examen
    }));

    // 7. Insertar registros nuevos
    const created = await Calificaciones_quimestrales.bulkCreate(payload, { validate: true });
    return res.status(201).json(created);

  } catch (error) {
    console.error("Error en createQuimestralBulk:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * UPDATE Quimestral
 * PUT /api/quimestrales/:id
 */
module.exports.updateQuimestral = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    const { examen, quimestre } = req.body;
    if (examen !== undefined) updateData.examen = examen;
    if (quimestre !== undefined) updateData.quimestre = quimestre;

    const [updated] = await Calificaciones_quimestrales.update(updateData, { where: { ID: id } });
    if (!updated) return res.status(404).json({ message: "Registro no encontrado" });

    const record = await Calificaciones_quimestrales.findByPk(id);
    return res.status(200).json(record);
  } catch (error) {
    console.error("Error en updateQuimestral:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * GET Quimestral por ID
 * GET /api/quimestrales/:id
 */
module.exports.getQuimestral = async (req, res) => {
  try {
    const record = await Calificaciones_quimestrales.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Registro no encontrado" });
    return res.status(200).json(record);
  } catch (error) {
    console.error("Error en getQuimestral:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * GET /api/quimestrales/asignacion/:id_asignacion
 */
module.exports.getQuimestralesPorAsignacion = async (req, res) => {
  try {
    const { id_asignacion } = req.params;
    const records = await Calificaciones_quimestrales.findAll({
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
    console.error("Error en getQuimestralesPorAsignacion:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * DELETE Quimestral
 * DELETE /api/quimestrales/:id
 */
module.exports.deleteQuimestral = async (req, res) => {
  try {
    const record = await Calificaciones_quimestrales.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Registro no encontrado" });
    await record.destroy();
    return res.status(200).json({ message: "Eliminado correctamente", eliminado: record });
  } catch (error) {
    console.error("Error en deleteQuimestral:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
