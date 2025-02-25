// controllers/final.controller.js
const Calificaciones = require('../models/calificaciones.model');

const letterToNumber = (letter) => {
  const mapping = { A: 10, B: 9, C: 8, D: 7, E: 6 };
  return mapping[letter] || 0;
};

const numberToLetter = (num) => {
  const rounded = Math.ceil(num);
  if (rounded >= 10) return 'A';
  if (rounded === 9) return 'B';
  if (rounded === 8) return 'C';
  if (rounded === 7) return 'D';
  return 'E';
};

const calculateAnnualAverage = (q1Final, q2Final) => {
  return parseFloat(((q1Final + q2Final) / 2).toFixed(2));
};

const calculateFinalBehavior = (letter1, letter2) => {
  const num1 = letterToNumber(letter1);
  const num2 = letterToNumber(letter2);
  const avg = (num1 + num2) / 2;
  return numberToLetter(avg);
};

/**
 * GET reporte final anual
 * GET /api/final?id_matricula_asignacion=<number>
 * Opcionalmente, en el body se puede enviar "supletorio" para actualizar la nota final si corresponde.
 */
module.exports.getFinalReport = async (req, res) => {
  try {
    const { id_matricula_asignacion } = req.query;
    if (!id_matricula_asignacion) {
      return res.status(400).json({ message: "Se requiere id_matricula_asignacion" });
    }
    
    // Recuperar registros de quimestre para Q1 y Q2
    const q1 = await Calificaciones.findOne({ where: { id_matricula_asignacion, quimistre: "Q1" } });
    const q2 = await Calificaciones.findOne({ where: { id_matricula_asignacion, quimistre: "Q2" } });
    if (!q1 || !q2) {
      return res.status(400).json({ message: "No se encontraron registros de ambos quimestres." });
    }
    
    const q1Final = parseFloat(q1.nota1); // se supone que la nota final del quimestre se guarda en nota1
    const q2Final = parseFloat(q2.nota1);
    const annualAverage = calculateAnnualAverage(q1Final, q2Final);
    const finalBehavior = calculateFinalBehavior(q1.comportamiento, q2.comportamiento);
    
    let supletorioRequired = false;
    let supletorioApproved = false;
    let finalGrade = annualAverage;
    // Si el promedio anual es menor a 7 (y mayor o igual a 4.1), se permite el examen supletorio.
    if (annualAverage < 7 && annualAverage >= 4.1) {
      supletorioRequired = true;
      const { supletorio } = req.body; // Nota de examen supletorio enviada por el docente
      if (supletorio !== undefined && parseFloat(supletorio) >= 7) {
        supletorioApproved = true;
        finalGrade = parseFloat(supletorio);
      }
    }
    
    return res.status(200).json({
      q1Final,
      q2Final,
      annualAverage,
      finalBehavior,
      supletorioRequired,
      supletorioApproved,
      finalGrade
    });
    
  } catch (error) {
    console.error("Error en getFinalReport:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
