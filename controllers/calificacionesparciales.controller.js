const Calificaciones_parciales = require('../models/calificaciones_parciales.model');
const Inscripcion = require('../models/inscripcion.model');
const Matricula = require('../models/matricula.models');
const Estudiante = require('../models/estudiante.model');
const { Op } = require("sequelize");

module.exports.createParcial = async (req, res) => {
  try {
    const {
      id_inscripcion,
      quimestre,
      parcial,
      insumo1,
      insumo2,
      evaluacion,
      comportamiento
    } = req.body;

    // Validaciones mínimas de ejemplo
    if (!id_inscripcion || !quimestre || !parcial) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }
    if (parcial !== "P1" && parcial !== "P2") {
      return res.status(400).json({ message: "Parcial debe ser 'P1' o 'P2'" });
    }

    const newParcial = await Calificaciones_parciales.create({
      ID_inscripcion: id_inscripcion,
      quimestre,
      parcial,
      insumo1,
      insumo2,
      evaluacion,
      comportamiento
    });

    return res.status(201).json(newParcial);
  } catch (error) {
    console.error("Error en createParcial:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports.createParcialBulk = async (req, res) => {
  try {
    const parcialesData = req.body; // Se espera un array
    if (!Array.isArray(parcialesData) || parcialesData.length === 0) {
      return res.status(400).json({ message: "Se requiere un array de parciales para la creación masiva" });
    }
    
    // Construir condiciones OR para buscar registros existentes
    const conditions = parcialesData.map(item => ({
      ID_inscripcion: item.id_inscripcion,
      quimestre: item.quimestre,
      parcial: item.parcial
    }));

    // Consultar los registros existentes con esas claves
    const existingParciales = await Calificaciones_parciales.findAll({
      where: {
        [Op.or]: conditions
      }
    });
    
    // Crear un Set con las claves existentes
    const existingKeys = new Set(existingParciales.map(item => `${item.ID_inscripcion}-${item.quimestre}-${item.parcial}`));

    // Filtrar solo los registros nuevos
    const newRows = parcialesData.filter(item => {
      const key = `${item.id_inscripcion}-${item.quimestre}-${item.parcial}`;
      return !existingKeys.has(key);
    });

    if (newRows.length === 0) {
      return res.status(200).json({ message: "No se han insertado registros, ya existen." });
    }

    // Preparar los registros a crear
    const toCreate = newRows.map(item => ({
      ID_inscripcion: item.id_inscripcion,
      quimestre: item.quimestre,
      parcial: item.parcial,
      insumo1: item.insumo1,
      insumo2: item.insumo2,
      evaluacion: item.evaluacion,
      comportamiento: item.comportamiento
    }));

    const newParciales = await Calificaciones_parciales.bulkCreate(toCreate, { validate: true });
    return res.status(201).json(newParciales);
  } catch (error) {
    console.error("Error en createParcialBulk:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports.updateParcial = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      insumo1,
      insumo2,
      evaluacion,
      comportamiento,
      quimestre,
      parcial
    } = req.body;

    if (parcial && (parcial !== "P1" && parcial !== "P2")) {
      return res.status(400).json({ message: "Parcial debe ser 'P1' o 'P2'" });
    }

    // Se actualizan solo los campos recibidos
    const updateData = {};
    if (insumo1 !== undefined) updateData.insumo1 = insumo1;
    if (insumo2 !== undefined) updateData.insumo2 = insumo2;
    if (evaluacion !== undefined) updateData.evaluacion = evaluacion;
    if (comportamiento !== undefined) updateData.comportamiento = comportamiento;
    if (quimestre !== undefined) updateData.quimestre = quimestre;
    if (parcial !== undefined) updateData.parcial = parcial;

    const [updatedRows] = await Calificaciones_parciales.update(updateData, {
      where: { ID: id }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Parcial no encontrado o sin cambios" });
    }

    const updatedParcial = await Calificaciones_parciales.findByPk(id);
    return res.status(200).json(updatedParcial);
  } catch (error) {
    console.error("Error en updateParcial:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports.getParcial = async (req, res) => {
  try {
    const id = req.params.id;
    const parcial = await Calificaciones_parciales.findByPk(id);
    if (!parcial) {
      return res.status(404).json({ message: "Parcial no encontrado" });
    }
    return res.status(200).json(parcial);
  } catch (error) {
    console.error("Error en getParcial:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports.getParcialesPorAsignacion = async (req, res) => {
  try {
    const { id_asignacion } = req.params;

    const parciales = await Calificaciones_parciales.findAll({
      include: [{
        model: Inscripcion,
        where: { ID_asignacion: id_asignacion },
        include: [{
          model: Matricula,
          attributes: ['nivel'],
          include: [{
            model: Estudiante,
            attributes: ['ID', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido']
          }]
        }]
      }]
    });

    // Transformamos la respuesta para incluir datos del parcial y, opcionalmente, del estudiante
    const result = parciales.map((p) => {
      const est = p.Inscripcion?.Matricula?.Estudiante;
      const nivel = p.Inscripcion?.Matricula?.nivel || "";

      // Construimos el nombre completo (si existe el estudiante)
      const nombreCompleto = est
        ? `${est.primer_apellido} ${est.segundo_apellido ?? ''} ${est.primer_nombre} ${est.segundo_nombre ?? ''}`.trim()
        : "Sin estudiante";

      return {
        // Datos de la calificación parcial
        idParcial: p.ID,
        idInscripcion: p.ID_inscripcion,
        quimestre: p.quimestre,
        parcial: p.parcial,
        insumo1: p.insumo1,
        insumo2: p.insumo2,
        evaluacion: p.evaluacion,
        comportamiento: p.comportamiento,

        // Datos opcionales del estudiante
        idEstudiante: est?.ID ?? null,
        nombreEstudiante: nombreCompleto,
        nivel
      };
    });

    // Ordenar opcionalmente por nombre
    result.sort((a, b) => a.nombreEstudiante.localeCompare(b.nombreEstudiante));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en getParcialesPorAsignacion:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports.deleteParcial = async (req, res) => {
  try {
    const { id } = req.params;
    const parcial = await Calificaciones_parciales.findByPk(id);
    if (!parcial) {
      return res.status(404).json({ message: "Parcial no encontrado" });
    }
    await parcial.destroy();
    return res.status(200).json({ message: "Parcial eliminado correctamente", parcialEliminado: parcial });
  } catch (error) {
    console.error("Error en deleteParcial:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
