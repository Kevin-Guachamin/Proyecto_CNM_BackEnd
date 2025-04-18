// controllers/estudianteController.js
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const getFile = async (req, res) => {
    const { folder, filename } = req.params;
    const filePath = path.join(__dirname, "..",'uploads', folder, filename);

    return res.download(filePath, filename, (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
            return res.status(500).json({message: 'No se pudo descargar el archivo.'});
        }
    });
}

const getFilesAsZip = async (req, res) => {
    try {
        const { files } = req.body; // array de objetos { folder: 'Estudiantes', filename: 'ProyectoCNM.pdf' }

        if (!files || !Array.isArray(files) || files.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron archivos.' });
        }

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=archivos.zip');

        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.on('error', (err) => {
            console.error('Error al crear el ZIP:', err);
            return res.status(500).send({ message: 'Error al crear el ZIP.' });
        });

        archive.pipe(res);

        for (const file of files) {
            const filePath = path.join(__dirname, '..', 'uploads', file.folder, file.filename);

            if (fs.existsSync(filePath)) {
                archive.file(filePath, { name: file.filename }); // Agrega el archivo al zip
            } else {
                console.warn(`Archivo no encontrado: ${filePath}`);
                // Puedes agregar algo como un placeholder.txt si deseas reportar archivos faltantes
                archive.append(`Archivo no encontrado: ${file.filename}`, { name: `${file.filename}_NO_ENCONTRADO.txt` });
            }
        }

        await archive.finalize(); // Espera a que finalice el zip
    } catch (error) {
        console.error('Error general al procesar el ZIP:', error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error al procesar los archivos para el ZIP.' });
        }
    }
};


module.exports = { getFile, getFilesAsZip };