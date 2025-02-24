// Controlador para el rol de REPRESENTANTE

const Representante = require('./models/representante.model');
const { validarCedulaEcuatoriana } = require('./utils/validarCedulaEcuatoriana');
const { hashPassword } = require('./utils/hashPassword');
const path = require('path');

// Create REPRESENTANTE
const crearRepresentante = async (request, response) => {
    const usuario = request.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Validar email


    if(!usuario)
        return response.status(400).json({ message: 'Campos vacios, todos son obligatorios!' });

    // Validacion de cedula
    if(usuario?.nroCedula) { // Compruba si usuario existe (no NULL o UNDEFINED) y si nroCedula tiene un valor truthy
        if(usuario.nroCedula.length < 10)
            return response.status(400).json({ message: 'Numero de cedula debe tener 10 numeros!'});

        if(!/^\d+$/.test(usuario.nroCedula)) // Comprueba que la cadena solo tenga numeros
            return response.status(400).json({ message: 'Numero de cedula solo debe contener numeros!'});

        if(!validarCedulaEcuatoriana(usuario.nroCedula)) // Comprueba si el nroCedula es valido
            return response.status(400).json({ message: 'Numero de cedula no valido!'});
    }
    else {
        return response.status(400).json({ message: 'Numero de cedula no valido!'});
    }

    // Validacion del primer nombre
    if (usuario?.primer_nombre) {
        if(usuario.primer_nombre.length < 2 || usuario.primer_nombre.length > 50 )
            return response.status(400).json({ message: 'El primer nombre debe tener entre 2 y 50 caracteres!'});
        if(!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(usuario.primer_nombre))
            return response.status(400).json({ message: 'El primer nombre solo debe contener letras!'});
    } else {
        return response.status(400).json({ message: 'El primer nombre no es valido!'});
    }

    // Validacion del segundo nombre
    if (usuario?.segundo_nombre) {
        if(usuario.segundo_nombre.length < 2 || usuario.segundo_nombre.length > 50 )
            return response.status(400).json({ message: 'El segundo nombre debe tener entre 2 y 50 caracteres!'});
        if(!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(usuario.segundo_nombre))
            return response.status(400).json({ message: 'El segundo nombre solo debe contener letras!'});
    } else {
        return response.status(400).json({ message: 'El segundo nombre no es valido!'});
    }

    // Validacion primer apellido
    if (usuario?.primer_apellido) {
        if(usuario.primer_apellido.length < 2 || usuario.primer_apellido.length > 50 )
            return response.status(400).json({ message: 'El primer apellido debe tener entre 2 y 50 caracteres!'});
        if(!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(usuario.primer_apellido))
            return response.status(400).json({ message: 'El primer apellido solo debe contener letras!'});
    } else {
        return response.status(400).json({ message: 'El primer apellido no es valido!'});
    }

    // Validacion segundo apellido
    if (usuario?.segundo_apellido) {
        if(usuario.segundo_apellido.length < 2 || usuario.segundo_apellido.length > 50 )
            return response.status(400).json({ message: 'El segundo apellido debe tener entre 2 y 50 caracteres!'});
        if(!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(usuario.segundo_apellido))
            return response.status(400).json({ message: 'El segundo apellido solo debe contener letras!'});
    } else {
        return response.status(400).json({ message: 'El segundo apellido no es valido!'});
    }

    // Validacion del numero celular
    if(usuario?.celular) { 
        if(usuario.celular.length < 10)
            return response.status(400).json({ message: 'Numero celular debe tener 10 numeros!'});

        if(!/^\d+$/.test(usuario.celular)) // Comprueba que la cadena solo tenga numeros
            return response.status(400).json({ message: 'Numero celular solo debe contener numeros!'});
    }
    else {
        return response.status(400).json({ message: 'Numero celular no valido!'});
    }

    // Validacion del email
    if(usuario?.email) {
        if(!emailRegex.test(usuario.email))
            return response.status(400).json({ message: 'Formato de email no valido!'});
    }else {
        return response.status(400).json({ message: 'Email no valido!'});
    }
    
    // Validar extension archivo cedula PDF 
    if (usuario?.cedula_PDF) {
        if(path.extname(usuario.cedula_PDF).toLowerCase() !== '.pdf') // Comprueba que la extension sea PDF
            return response.status(400).json({ message: 'Extension de archivo cedula PDF no valida!'});
    } else {
        return response.status(400).json({ message: 'Ruta de archivo cedula PDF no valida!'})
    }

    // Validar extension archivo croquis PDF
    if (usuario?.croquis_PDF) {
        if(path.extname(usuario.croquis_PDF).toLowerCase() !== '.pdf') // Comprueba que la extension sea PDF
            return response.status(400).json({ message: 'Extension de archivo croquis PDF no valida!'});
    } else {
        return response.status(400).json({ message: 'Ruta de archivo croquis PDF no valida!'})
    }

    // Validar telefono convencional
    if(usuario?.telefono_convencional) { 
        if(usuario.telefono_convencional.length < 7 || usuario.telefono_convencional.length > 10)
            return response.status(400).json({ message: 'Numero convencional debe tener entre 7 y 10 numeros!'});

        if(!/^\d+$/.test(usuario.telefono_convencional)) // Comprueba que la cadena solo tenga numeros
            return response.status(400).json({ message: 'Numero convencional solo debe contener numeros!'});
    }
    else {
        return response.status(400).json({ message: 'Numero convencional no valido!'});
    }


    // Validar telefono de emergencia
    if(usuario?.telefono_emergencia) { 
        if(usuario.telefono_emergencia.length < 7 || usuario.telefono_emergencia.length > 10)
            return response.status(400).json({ message: 'Numero de emergencia debe tener entre 7 y 10 numeros!'});

        if(!/^\d+$/.test(usuario.telefono_emergencia)) // Comprueba que la cadena solo tenga numeros
            return response.status(400).json({ message: 'Numero de emergencia solo debe contener numeros!'});
    }
    else {
        return response.status(400).json({ message: 'Numero de emergencia no valido!'});
    }

    // Validar contrasena
    if(usuario?.contraseña) {
        if(usuario.contraseña.length < 8 || usuario.contraseña.length > 100)
            return response.status(400).json({ message: 'La contrasena debe tener al menos 8 caracteres!'});
    } 
    else {
        return response.status(400).json({ message: 'Contrasena no valida!'});
    }

    try {
        const representanteEncontrado = await Representante.findByPk(usuario.nroCedula);

        if(representanteEncontrado)
            return response.status(409).json({ message: 'El usuario ya existe!' }); // 409 conflict

        const password = usuario.contraseña;
        usuario.contraseña = await hashPassword(password);
        const nuevoRepresentante = await Representante.create(usuario);
        const {contraseña: _, ...result} = nuevoRepresentante.toJSON()
        
        return response.status(200).json({ message: 'Usuario creado exitosamente', result});

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'No hubo respuesta desde el servidor' });
    }
}

// Read REPRESENTANTE
const getRepresentante = async (request, response) => {
    const nroCedula = request.params.cedula;
    try {
        const representante = await Representante.findByPk(nroCedula);
        if(!representante)
            return response.status(404).json({ message: 'Usuario no encontrado'});

        const {contraseña: _, ...result} = representante.toJSON(); // Omite la contrasena
        return response.status(200).json(result);

    } catch (error) {
        console.log('Error al obtener el representante');
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes});
        }

        return response.status(500).json({ message: 'Error al obtener el representante en el servidor'});
    }
}

// Read todos los representantes
const getAllRepresentantes = async (request, response) => {
    try {
        const allRepresentantes = await Representante.findAll();

        if(allRepresentantes.length === 0)
            return response.status(404).json({ message: 'No se encontro ningun representante!'});

        const result = allRepresentantes.map(representante => {
            const {contraseña: _, ...rest} = representante.toJSON();
            return rest;
        });
               
        return response.status(200).json(result);

    } catch (error) {
        console.log('Error al obtener todos los representantes');
        if(error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(err => err.message);
            return response.status(400).json({ message: mensajes});
        }

        return response.status(500).json({ message: 'Error al obtener los representantes en el servidor'});
    }
}

// Update REPRESENTANTE

// Delete REPRESENTANTE