const multer = require("multer");

// Función para crear la configuración de multer
const createMulterConfig = (folderName) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folderName}`); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
      // Guardar solo con el nombre original
      cb(null, file.originalname);
    },
  });
};

// Configuración común para los archivos PDF
const createUpload = (folderName) => {
  return multer({
    storage: createMulterConfig(folderName),
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Solo se permiten archivos PDF"), false);
      }
      cb(null, true); // Aceptar el archivo
      console.log("Se acepto el archivo")
    },
  });
};

// Crear las configuraciones para Representantes y Estudiantes
const uploadRepresentantes = createUpload("Representantes");
const uploadEstudiantes = createUpload("Estudiantes");

// Campos específicos para cada tipo de archivo
const uploadRepresentantesFields = uploadRepresentantes.fields([
  { name: "copiaCedula", maxCount: 1 },
  { name: "croquis", maxCount: 1 },
]);

const uploadEstudiantesFields = uploadEstudiantes.fields([
  { name: "copiaCedula", maxCount: 1 },
  { name: "matricula_IER", maxCount: 1 },
]);

module.exports = { uploadEstudiantesFields, uploadRepresentantesFields };
