require("dotenv").config();
const jwt = require("jsonwebtoken");
const Representante = require("../models/representante.model");
const Docente = require("../models/docente.model");

module.exports.docenteVicerrector = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extraer el token
      token = req.headers.authorization.split(" ")[1];
      console.log("Token recibido:", token);
      // Verificar el token con el JWT_SECRET definido en el .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      // Verificar que el rol sea docente y el subRol sea Vicerrector
      if (decoded.rol !== "docente" || decoded.subRol !== "Vicerrector") {
        return res.status(403).json({ message: "No autorizado, se requiere ser docente con subrol Vicerrector" });
      }

      // Buscar el docente por su ID
      const user = await Docente.findOne({ where: { nroCedula: decoded.id }, attributes: { exclude: ["password"] } });
      if (!user) {
        return res.status(401).json({ message: "Usuario no autorizado" });
      }

      // Asignar la información extraída del token al objeto req.user
      req.user = user;
      req.user.rol = decoded.rol;
      req.user.subRol = decoded.subRol;

      return next();
    } catch (error) {
      console.error("Error en el middleware docenteVicerrector:", error);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }

  return res.status(401).json({ message: "No autorizado, token no encontrado" });
};

module.exports.docenteAdministrador = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extraer el token
      token = req.headers.authorization.split(" ")[1];
      console.log("Token recibido:", token);
      // Verificar el token con el JWT_SECRET definido en el .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      // Verificar que el rol sea docente y el subRol sea Administrador
      if (decoded.rol !== "docente" || decoded.subRol !== "Administrador") {
        return res.status(403).json({ message: "No autorizado, se requiere ser docente con subrol Administrador" });
      }

      // Buscar el docente por su ID
      const user = await Docente.findOne({ where: { nroCedula: decoded.id }, attributes: { exclude: ["password"] } });
      if (!user) {
        return res.status(401).json({ message: "Usuario no autorizado" });
      }

      // Asignar la información extraída del token al objeto req.user
      req.user = user;
      req.user.rol = decoded.rol;
      req.user.subRol = decoded.subRol;

      return next();
    } catch (error) {
      console.error("Error en el middleware docenteAdministrador:", error);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }

  return res.status(401).json({ message: "No autorizado, token no encontrado" });
}

module.exports.docenteProfesor = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extraer el token
      token = req.headers.authorization.split(" ")[1];
      console.log("Token recibido:", token);
      // Verificar el token con el JWT_SECRET definido en el .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      // Verificar que el rol sea docente y el subRol sea Profesor
      if (decoded.rol !== "docente" || decoded.subRol !== "Profesor") {
        return res.status(403).json({ message: "No autorizado, se requiere ser docente con subrol Profesor" });
      }

      // Buscar el docente por su ID
      const user = await Docente.findOne({ where: { nroCedula: decoded.id }, attributes: { exclude: ["password"] } });
      if (!user) {
        return res.status(401).json({ message: "Usuario no autorizado" });
      }

      // Asignar la información extraída del token al objeto req.user
      req.user = user;
      req.user.rol = decoded.rol;
      req.user.subRol = decoded.subRol;

      return next();
    } catch (error) {
      console.error("Error en el middleware docenteProfesor:", error);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }

  return res.status(401).json({ message: "No autorizado, token no encontrado" });
}

module.exports.docenteSecretaria = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extraer el token
      token = req.headers.authorization.split(" ")[1];
      console.log("Token recibido:", token);
      // Verificar el token con el JWT_SECRET definido en el .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      // Verificar que el rol sea docente y el subRol sea Secretaria
      if (decoded.rol !== "docente" || decoded.subRol !== "Secretaria") {
        return res.status(403).json({ message: "No autorizado, se requiere ser docente con subrol Secretaria" });
      }

      // Buscar el docente por su ID
      const user = await Docente.findOne({ where: { nroCedula: decoded.id }, attributes: { exclude: ["password"] } });
      if (!user) {
        return res.status(401).json({ message: "Usuario no autorizado" });
      }

      // Asignar la información extraída del token al objeto req.user
      req.user = user;
      req.user.rol = decoded.rol;
      req.user.subRol = decoded.subRol;

      return next();
    } catch (error) {
      console.error("Error en el middleware docenteSecretaria:", error);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }

  return res.status(401).json({ message: "No autorizado, token no encontrado" });
}

module.exports.Representante = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extraer el token
      token = req.headers.authorization.split(" ")[1];
      console.log("Token recibido:", token);
      // Verificar el token con el JWT_SECRET definido en el .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      // Verificar que el rol sea representante
      if (decoded.rol !== "representante") {
        return res.status(403).json({ message: "No autorizado, se requiere ser representante" });
      }

      // Buscar el representante por su ID
      const user = await Representante.findOne({ where: { nroCedula: decoded.id }, attributes: { exclude: ["password"] } });
      if (!user) {
        return res.status(401).json({ message: "Usuario no autorizado" });
      }

      // Asignar la información extraída del token al objeto req.user
      req.user = user;
      req.user.rol = decoded.rol;

      return next();
    } catch (error) {
      console.error("Error en el middleware representante:", error);
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }

  return res.status(401).json({ message: "No autorizado, token no encontrado" });
}