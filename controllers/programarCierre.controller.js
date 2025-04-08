
const schedule = require('node-schedule');
const Periodo = require('../models/periodo_academico.model')
const Matricula = require('../models/matricula.models')
const pool = require('../db'); // Si usas mysql2 o similar

async function cerrarPeriodo(periodoId) {
  try {
    const periodo = await Periodo.findByPk(periodoId);
    if (!periodo || periodo.estado === 'Finalizado') return;
    const [inscripcionesValidas] = await sequelize.query(`
      SELECT i.ID
      FROM inscripciones i
      JOIN matriculas m ON i.ID_matricula = m.ID
      JOIN calificaciones_quimestrales cq ON i.ID = cq.ID_inscripcion
      WHERE m.ID_periodo_academico = ?
      GROUP BY i.ID
      HAVING COUNT(DISTINCT cq.quimestre) = 2
    `, {
      replacements: [periodoId]
    });
    
    if (inscripcionesValidas.length === 0) {
      console.warn(`⚠️ No se puede cerrar el periodo ${periodoId}, faltan calificaciones`);
      return;
    }

    console.log(`🕒 Cerrando automáticamente el periodo: ${periodo.descripcion}`);

    const [resultados] = await sequelize.query(`
      SELECT 
        m.ID_estudiante,
        m.ID AS ID_matricula,
        COALESCE(cf.examen_recuperacion, 
          (
            (
              (
                (
                  (cp1.insumo1 + cp1.insumo2) / 2 * 0.7 + cp1.evaluacion * 0.3
                + (cp2.insumo1 + cp2.insumo2) / 2 * 0.7 + cp2.evaluacion * 0.3
                ) / 2
              ) * 0.7 + cq1.examen * 0.3
            + 
              (
                (cp3.insumo1 + cp3.insumo2) / 2 * 0.7 + cp3.evaluacion * 0.3
              + (cp4.insumo1 + cp4.insumo2) / 2 * 0.7 + cp4.evaluacion * 0.3
              ) / 2 * 0.7 + cq2.examen * 0.3
            ) / 2
          )
        ) AS nota_final
      FROM matriculas m
      JOIN inscripciones i ON i.ID_matricula = m.ID
      LEFT JOIN calificaciones_parciales cp1 ON cp1.ID_inscripcion = i.ID AND cp1.quimestre = 'Q1' AND cp1.parcial = 1
      LEFT JOIN calificaciones_parciales cp2 ON cp2.ID_inscripcion = i.ID AND cp2.quimestre = 'Q1' AND cp2.parcial = 2
      LEFT JOIN calificaciones_parciales cp3 ON cp3.ID_inscripcion = i.ID AND cp3.quimestre = 'Q2' AND cp3.parcial = 1
      LEFT JOIN calificaciones_parciales cp4 ON cp4.ID_inscripcion = i.ID AND cp4.quimestre = 'Q2' AND cp4.parcial = 2
      LEFT JOIN calificaciones_quimestrales cq1 ON cq1.ID_inscripcion = i.ID AND cq1.quimestre = 'Q1'
      LEFT JOIN calificaciones_quimestrales cq2 ON cq2.ID_inscripcion = i.ID AND cq2.quimestre = 'Q2'
      LEFT JOIN calificaciones_finales cf ON cf.ID_inscripcion = i.ID
      WHERE m.ID_periodo_academico = ?
      GROUP BY m.ID_estudiante, m.ID
    `, { replacements: [periodoId] });

    // Clasificamos el estado según la nota final
    const actualizaciones = resultados.map(row => {
      const nota = parseFloat(row.nota_final);
      let estado;

      if (nota >= 7) estado = 'Aprobado';
      else if (nota >= 4 && nota < 7 && row.examen_recuperacion >= 7) estado = 'Aprobado';
      else estado = 'Reprobado';

      return {
        ID_estudiante: row.ID_estudiante,
        ID_matricula: row.ID_matricula,
        estado
      };
    });

    // Creamos SQL para bulk update
    const caseSQL = actualizaciones.map(r => `WHEN ${r.ID_matricula} THEN '${r.estado}'`).join('\n');
    const ids = actualizaciones.map(r => r.ID_matricula).join(',');

    const updateQuery = `
      UPDATE matriculas
      SET estado = CASE ID
        ${caseSQL}
      END
      WHERE ID IN (${ids});
    `;

    await sequelize.query(updateQuery);
    // Niveles ordenados para saber cuál sigue
    const niveles = [
      "1ro Básico Elemental",
      "2do Básico Elemental",
      "1ro Básico Medio",
      "2do Básico Medio",
      "3ro Básico Medio",
      "1ro Básico Superior",
      "2do Básico Superior",
      "3ro Básico Superior",
      "1ro Bachillerato",
      "2do Bachillerato",
      "3ro Bachillerato",
      "Graduado"
    ];

    // Traer las matrículas aprobadas del periodo con su estudiante y nivel actual
const [matriculasAprobadas] = await sequelize.query(`
  SELECT e.ID AS estudiante_id, e.nivel
  FROM matriculas m
  JOIN estudiantes e ON m.ID_estudiante = e.ID
  WHERE m.estado = 'Aprobado' AND m.ID_periodo_academico = ?
`, {
  replacements: [periodoId],
});

// Generar los nuevos niveles
const promociones = matriculasAprobadas
  .map(({ estudiante_id, nivel }) => {
    const idx = niveles.indexOf(nivel);
    if (idx >= 0 && idx < niveles.length - 1) {
      return {
        id: estudiante_id,
        nuevoNivel: niveles[idx + 1]
      };
    }
    return null;
  })
  .filter(p => p);

// Ejecutar el bulk update si hay estudiantes por promover
if (promociones.length > 0) {
  const caseNivel = promociones
    .map(p => `WHEN ${p.id} THEN '${p.nuevoNivel}'`)
    .join("\n");
  const ids = promociones.map(p => p.id).join(",");

  const updateNiveles = `
    UPDATE estudiante
    SET nivel = CASE ID
      ${caseNivel}
    END
    WHERE ID IN (${ids});
  `;

  await sequelize.query(updateNiveles);
  console.log(`🎓 Se promovieron ${promociones.length} estudiantes de nivel.`);

} else {
  console.log(`📘 No hay estudiantes para promover.`);
}
}
catch(err){
  console.log("ocurrio un error durante el cierre del periodo: ",err)
}
}

async function reprogramarPeriodosPendientes() {
  const periodos = await Periodo.findAll({
    where: {
      estado: 'Activo',
      fecha_fin: {
        [Op.gt]: new Date()
      }
    }
  });

  for (const periodo of periodos) {
    programarCierrePeriodo(periodo.id, periodo.fecha_fin);
  }
}

function programarCierrePeriodo(periodoId, fechaFin) {
  const fecha = new Date(fechaFin);

  if (fecha <= new Date()) {
    console.log(`⚠️ La fecha ya pasó, cerrando inmediatamente`);
    cerrarPeriodo(periodoId);
    return;
  }

  schedule.scheduleJob(fecha, () => cerrarPeriodo(periodoId));
  console.log(`📅 Tarea programada para cerrar periodo ID ${periodoId} el ${fecha}`);
}

module.exports = {
  programarCierrePeriodo,
  reprogramarPeriodosPendientes
};
