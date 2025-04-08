// /cron/cierreUnico.js
const schedule = require('node-schedule');
const Periodo = require('../models/periodo_academico.model')
const Matricula = require('../models/matricula.models')
const pool = require('../db'); // Si usas mysql2 o similar

async function cerrarPeriodo(periodoId) {
  try {
    const periodo = await Periodo.findByPk(periodoId);
    if (!periodo || periodo.estado === 'Finalizado') return;

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

    // Traemos los estudiantes y su nivel actual
    const [estudiantes] = await sequelize.query(`
  SELECT e.ID, e.nivel
  FROM estudiante e
  WHERE e.ID IN (${actualizaciones
        .filter(a => a.estado === "Aprobado")
        .map(a => a.ID_estudiante)
        .join(",")})
`);

    const promociones = estudiantes
      .map(e => {
        const idx = niveles.indexOf(e.nivel);
        if (idx >= 0 && idx < niveles.length - 1) {
          return {
            id: e.ID,
            nuevoNivel: niveles[idx + 1]
          };
        }
        return null;
      })
      .filter(p => p); // Quitamos nulls por si ya estaba en Graduado

    // Generamos SQL para actualización masiva
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
    }

    await periodo.update({ estado: 'Finalizado' });
    console.log(`✅ Periodo ${periodo.descripcion} cerrado con éxito`);
  } catch (err) {
    console.error('❌ Error al cerrar el periodo:', err);
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

module.exports = programarCierrePeriodo;
