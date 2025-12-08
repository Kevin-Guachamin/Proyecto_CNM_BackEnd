
const Materia = require('../models/materia.model')
const { Op, Sequelize, where } = require("sequelize");
const createMateria = async (req, res) => {
  try {
    const materia = req.body
    const materiaFound = await Materia.findOne({ where: { nombre: materia.nombre, nivel: materia.nivel } })
    if (materiaFound) {
      return res.status(409).json({ message: "La asignatura ya existe" })
    }
    const result = await Materia.create(materia)
    return res.status(201).json(result)
  } catch (error) {
    console.log('Error al crear el estudiante:', error);
    if (error.name === "SequelizeValidationError") {
      console.log("Estos son los errores", error);

      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "notEmpty" ||
        err.validatorKey === "isNumeric" ||
        err.validatorKey === "len" ||
        err.validatorKey === "is_null"
      );

      if (errEncontrado) {
        return res.status(400).json({ message: errEncontrado.message });
      }
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "not_unique"

      );
      if (errEncontrado) {
        return res.status(400).json({ message: `${errEncontrado.path} debe ser único` });
      }

    }

    return res.status(500).json({ message: `Error al crear asignatura en el servidor:` })

  }
}
const updateMateria = async (req, res) => {
  try {
    const materia = req.body
    const id = req.params.id
    const [updatedRows] = await Materia.update(materia, { where: { id } })
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Asignatura no encontrada" })
    }
    const result = await Materia.findByPk(id)
    return res.status(200).json(result)
  } catch (error) {

    if (error.name === "SequelizeValidationError") {
      console.log("Estos son los errores", error);

      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "notEmpty" ||
        err.validatorKey === "isNumeric" ||
        err.validatorKey === "len" ||
        err.validatorKey === "is_null"
      );

      if (errEncontrado) {
        return res.status(400).json({ message: errEncontrado.message });
      }
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      const errEncontrado = error.errors.find(err =>
        err.validatorKey === "not_unique"

      );
      if (errEncontrado) {
        return res.status(400).json({ message: `${errEncontrado.path} debe ser único` });
      }

    }

    return res.status(500).json({ message: `Error al editar asignatura en el servidor:` })

  }
}
const getMateria = async (req, res) => {

  try {
    const id = req.params.id
    const materia = await Materia.findByPk(id)
    if (!materia) {
      return res.status(404).json({ message: "Materia no encontrado" })
    }


    return res.status(200).json(materia)
  } catch (error) {
    console.error("Error al obtener materia", error)
    return res.status(500).json({ message: `Error al obtener materia en el servidor:` })
  }
}
const getMaterias = async (req, res) => {
  try {
    let { page, limit, search = "" } = req.query;

    // Normalizar datos
    page = page ? parseInt(page) : null;
    limit = limit ? parseInt(limit) : null;
    search = search.trim().toLowerCase();

    // Declaración correcta
    let where = {};

    // Filtro de búsqueda
    if (search !== "") {
      where = {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("LOWER", Sequelize.col("nombre")),
            {
              [Op.like]: `%${search}%`
            }
          )
        ]
      };
    }

    // Orden estándar que usas en ambos sitios
    const orderConfig = [
      [
        Sequelize.literal(`FIELD(nivel, 
            '1ro BE', '2do BE', 
            '1ro BM', '2do BM', '3ro BM', 
            '1ro BS', '2do BS', '3ro BS', 
            '1ro BCH', '2do BCH', '3ro BCH', 
            'BCH', 'BM', 'BS', 'BS BCH')`),
        'ASC'
      ]
    ];

    // Con paginación
    if (page && limit) {

      const { count, rows: materias } = await Materia.findAndCountAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order: orderConfig
      });

      return res.status(200).json({
        data: materias,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalRows: count
      });
    }

    // Sin paginación
    const materias = await Materia.findAll({
      where,
      order: orderConfig
    });

    return res.status(200).json(materias);

  } catch (error) {
    console.error("Error al obtener materias", error);
    return res.status(500).json({ message: `Error al obtener materias en el servidor:` });
  }
};


const getMateriasIndividuales = async (req, res) => {
  try {
    let { page, limit } = req.query;
    if (page && limit) {
      page = parseInt(page)
      limit = parseInt(limit)
      const { count, rows: materias } = await Materia.findAndCountAll({
        limit,
        offset: (page - 1) * limit,
        where: {
          tipo: "individual"
        },
        order: [
          [
            Sequelize.literal(`FIELD(nivel, 
                        '1ro BE', '2do BE', 
                        '1ro BM', '2do BM', '3ro BM', 
                        '1ro BS', '2do BS', '3ro BS', 
                        '1ro BCH', '2do BCH', '3ro BCH', 
                        'BCH', 'BM', 'BS', 'BS BCH')`),
            'ASC'
          ]
        ]
      })
      console.log("esto se envia", materias)

      return res.status(200).json({
        data: materias,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalRows: count
      });
    }
    const materias = await Materia.findAll({
      where: {
        tipo: "individual"
      },
      order: [
        [
          Sequelize.literal(`FIELD(nivel, 
                    '1ro BE', '2do BE', 
                    '1ro BM', '2do BM', '3ro BM', 
                    '1ro BS', '2do BS', '3ro BS', 
                    '1ro BCH', '2do BCH', '3ro BCH', 
                    'BCH', 'BM', 'BS', 'BS BCH')`),
          'ASC'
        ]
      ]
    })
    return res.status(200).json(materias)

  } catch (error) {
    console.error("Error al obtener materias", error)
    return res.status(500).json({ message: `Error al obtener materias en el servidor:` })
  }
}
const deleteMateria = async (req, res) => {
  try {

    const id = req.params.id
    const materia = await Materia.findByPk(id)
    if (!materia) {
      return res.status(404).json({ message: "Materia no encontrada" })
    }
    await Materia.destroy({ where: { id } })

    return res.status(200).json(materia)
  } catch (error) {
    console.error("Error al eliminar materia", error)
    return res.status(500).json({ message: `Error al eliminar materia en el servidor:` })
  }
}
module.exports = {
  createMateria,
  updateMateria,
  getMateria,
  getMaterias,
  deleteMateria,
  getMateriasIndividuales
}