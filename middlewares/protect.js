require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Representante, Docente } = require("../models");

module.exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extraer el token
      token = req.headers.authorization.split(" ")[1];
      // Verificar el token con el JWT_SECRET definido en el .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user;
      // Solo se consideran los roles "representante" y "docente"
      if (decoded.rol === "representante") {
        user = await Representante.findByPk(decoded.id, { attributes: { exclude: ["password"] } });
      } else if (decoded.rol === "docente") {
        user = await Docente.findByPk(decoded.id, { attributes: { exclude: ["password"] } });
      } else {
        return res.status(401).json({ message: "Usuario no autorizado" });
      }

      if (!user) {
        return res.status(401).json({ message: "Usuario no autorizado" });
      }

      // Asignar la información extraída del token
      req.user = user;
      req.user.rol = decoded.rol; // "representante" o "docente"
      // Si es docente, extraer el subRol (ej.: "profesor", "vicerrector", "secretaria", "administrador", etc.)
      if (decoded.rol === "docente") {
        req.user.subRol = decoded.subRol;
      }

      return next();
    } catch (error) {
      console.error("Error en el middleware protect:", error);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }

  return res.status(401).json({ message: "No autorizado, token no encontrado" });
};

// Middleware para restringir el acceso solo a Representantes
module.exports.representante = (req, res, next) => {
  if (req.user && req.user.rol === "representante") {
    return next();
  }
  return res.status(403).json({ message: "No autorizado, solo representantes" });
};

// Middleware para restringir el acceso solo a Docentes
module.exports.docente = (req, res, next) => {
  if (req.user && req.user.rol === "docente") {
    return next();
  }
  return res.status(403).json({ message: "No autorizado, solo docentes" });
};

// Middleware específico para docentes con subrol "administrador"
module.exports.docenteAdministrador = (req, res, next) => {
  if (req.user && req.user.rol === "docente" && req.user.subRol === "administrador") {
    return next();
  }
  return res.status(403).json({ message: "No autorizado, se requiere ser docente con subrol administrador" });
};
