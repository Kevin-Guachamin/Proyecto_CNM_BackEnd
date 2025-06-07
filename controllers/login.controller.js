const bcrypt = require('bcryptjs');
const Representante = require('../models/representante.model');
const Docente = require('../models/docente.model');
const generateToken = require('../utils/generarToken');

module.exports.login = async (req, res) => {
    const { nroCedula, password } = req.body;

    try {
        let user = null;
        let rol = null;
        let type = null;
        let subRol = null; // <--- DECLARAR AQUI

        // Buscar en la tabla de Representantes
        user = await Representante.findOne({ where: { nroCedula } });
        if (user) {
            rol = 'representante'; 
            type = 'representante';
        }

        // Si no se encontró, buscar en la tabla de Docentes
        if (!user) {
            user = await Docente.findOne({ where: { nroCedula } });
            if (user) {
                // Guardas el rol interno (profesor, coordinador, etc.)
                subRol = user.rol;  
                // Asignas la categoría general
                rol = 'docente';
                type = 'docente';

                // Agregas la propiedad subRol al objeto user
                user.dataValues.subRol = subRol;
            }
        }

        // Si el usuario no existe en ninguna de las tablas
        if (!user) {
            console.log("caigo aca")
            return res.status(401).json({ message: 'Cédula  incorrectos' });
        }

        // Verificar la password
        let isMatch = false;
        if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
            console.log("este es el password", password)
            console.log("esto es lo que se almacena", user.password)
            isMatch = await bcrypt.compare(password, user.password);
        } else{
            isMatch = password === user.password;
        }

        if (!isMatch) {
            console.log("caigo por aca")
            return res.status(401).json({ message: 'contraseña incorrectos' });
        }

        // Excluir la password de la respuesta
        const { password: pwd, ...userWithoutpassword } = user.toJSON();

        // Devolver la info que necesites
        return res.status(200).json({
            ...userWithoutpassword,
            rol,      // "docente" o "representante"
            subRol,   // "profesor", "coordinador", etc.
            type,
            token: generateToken({ id: user.nroCedula, rol, type, subRol })
        });

    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
