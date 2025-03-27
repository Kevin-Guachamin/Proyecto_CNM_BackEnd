const Estudiante = require('../models/estudiante.model');
const Matricula = require('../models/matricula.models');
const Asignacion = require('../models/asignacion.model');
const Inscripcion = require('../models/inscripcion.model');
const Materia = require('../models/materia.model');

const getEstudiantesPorAsignacion = async (req, res) => {
    const { id_asignacion } = req.params;
  
    try {
      const inscripciones = await Inscripcion.findAll({
        where: { ID_asignacion: id_asignacion },
        include: [{
          model: Matricula,
          attributes: ['nivel'],
          include: [{
            model: Estudiante,
            // Ajusta el nombre del PK real de tu modelo Estudiante (puede ser 'ID', 'id', etc.)
            attributes: ['ID', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido']
          }]
        }]
      });
  
      const estudiantes = inscripciones
        .map((insc) => {
          const est = insc.Matricula?.Estudiante;
          if (!est) return null;
  
          const nivel = insc.Matricula?.nivel || "";
          const nombreCompleto = [
            est.primer_apellido,
            est.segundo_apellido ?? '',
            est.primer_nombre,
            est.segundo_nombre ?? ''
          ].join(' ');
  
          return {
            // ID de la inscripción (clave para calificaciones)
            idInscripcion: insc.ID, 
            // ID del estudiante (por si lo necesitas también)
            idEstudiante: est.ID, 
            nombreCompleto,
            nivel
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto))
        .map((est, index) => ({
          nro: index + 1,
          idInscripcion: est.idInscripcion,
          idEstudiante: est.idEstudiante,
          nombre: est.nombreCompleto,
          nivel: est.nivel
        }));
  
      res.status(200).json(estudiantes);
    } catch (error) {
      console.error("Error al obtener estudiantes por asignación", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };  

const createInscripcion = async (req, res) => {
    try {
        const inscripcion = req.body
        const inscripcionFound = await Materia.findOne({ where: { inscripcion } })
        if (inscripcionFound) {
            return res.status(409).json({ message: "Error la matricula_asignación ya existe" })
        }
        const result = await Inscripcion.create(inscripcion)
        res.status(201).json(result)
    } catch (error) {
        console.log('Error al crear el estudiante:', error);
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);
            
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey ==="is_null"
            );
        
            if (errEncontrado) {
                return res.status(400).json({ message: errEncontrado.message });
            }
        }
        if (error instanceof TypeError){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        if (error.name ==="SequelizeUniqueConstraintError"){
            return res.status(400).json({message: error.message})
        }
        
        res.status(500).json({message: `Error al crear inscripción en el servidor:`})
        console.log("ESTE ES EL ERROR",error.name)
    }
}
const updateInscripcion = async (req, res) => {
    try {
        const inscripcion = req.body
        const id = req.params.id
        const [updatedRows] = await Inscripcion.update(inscripcion, { where: { id } })
        if (updatedRows === 0) {
            return res.status(404).json({ message: "Inscripción no encontrada" })
        }
        const result = await Inscripcion.findByPk(id)
        res.status(200).json(result)
    } catch (error) {
        
        if (error.name === "SequelizeValidationError") {
            console.log("Estos son los errores", error);
            
            const errEncontrado = error.errors.find(err =>
                err.validatorKey === "notEmpty" ||
                err.validatorKey === "isNumeric" ||
                err.validatorKey === "len" ||
                err.validatorKey ==="is_null"
            );
        
            if (errEncontrado) {
                return res.status(400).json({ message: errEncontrado.message });
            }
        }
        if (error instanceof TypeError){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        if (error.name ==="SequelizeUniqueConstraintError"){
            return res.status(400).json({message: error.message})
        }
        
        res.status(500).json({message: `Error al editar inscripción en el servidor:`})
        
    }
}
const getInscripcion = async (req, res) => {

    try {
        const id = req.params.id
        const inscripcion = await Inscripcion.findByPk(id)
        if (!inscripcion) {
            return res.status(404).json({ message: "Inscripción no encontrada" })
        }


        res.status(200).json(inscripcion)
    } catch (error) {
        console.error("Error al obtener la inscripción", error)
        res.status(500).json({ message: `Error al obtener la inscripción en el servidor:` })
    }
}

const deleteInscripcion = async (req, res) => {
    try {

        const id = req.params.id
        const inscripcion = await Inscripcion.findByPk(id)
        if (!inscripcion) {
            return res.status(404).json({ message: "Inscripción no encontrada" })
        }
        await Inscripcion.destroy({ where: { id } })

        res.status(200).json(inscripcion)
    } catch (error) {
        console.error("Error al eliminar la inscripción", error)
        res.status(500).json({ message: `Error al eliminar la inscripción en el servidor:` })
    }
}
module.exports = {
    createInscripcion,
    updateInscripcion,
    deleteInscripcion,
    getInscripcion,
    getEstudiantesPorAsignacion
}