// Controlador para el rol de REPRESENTANTE

const Representante = require('.models/representante.model');
const { validarCedulaEcuatoriana } = require('.utils/validarCedulaEcuatoriana');

// Create REPRESENTANTE
const crearRepresentante = async (request, response) => {
    const usuario = request.body;

    if(!usuario)
        return response.status(400).json({ message: 'Campos vacios, todos son obligatorios!' });

    // Validacion de cedula
    if(usuario?.nroCedula) { // Compruba si usuario existe (no NULL o UNDEFINED) y si nroCedula tiene un valor truthy
        if(usuario.nroCedula.length < 10)
            return response.status(400).json({ message: 'Numero de cedula debe tener 10 numeros!'});

        if(!/^\d+$/.test(usuario.nroCedula)) // Comprueba que la cadena solo tenga numeros
            return response.status(400).json({ message: 'Numero de cedula solo debe contener numeros!'});

        if(validarCedulaEcuatoriana(usuario.nroCedula)) // Comprueba si el nroCedula es valido
            return response.status(400).json({ message: 'Numero de cedula no valido!'});
    }
    else {
        return response.status(400).json({ message: 'Numero de cedula no valido!'});
    }

    // Validacion del primer nombre
    if (usuario?.primer_nombre) {
        if(usuario.primer_nombre.length >= 2 && usuario.primer_nombre.length <= 50 )
            return response.status(400).json({ message: 'El primer nombre debe tener entre 2 y 50 caracteres!'});
        if(!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(usuario.primer_nombre))
            return response.status(400).json({ message: 'El primer nombre solo debe contener letras!'});
    } else {
        return response.status(400).json({ message: 'El primer nombre no es valido!'});
    }

    // Validacion del segundo nombre
    if (usuario?.segundo_nombre) {
        if(usuario.segundo_nombre.length >= 2 && usuario.segundo_nombre.length <= 50 )
            return response.status(400).json({ message: 'El segundo nombre debe tener entre 2 y 50 caracteres!'});
        if(!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(usuario.primer_nombre))
            return response.status(400).json({ message: 'El segundo nombre solo debe contener letras!'});
    } else {
        return response.status(400).json({ message: 'El segundo nombre no es valido!'});
    }

    // Validacion primer apellido
    if (usuario?.primer_apellido) {
        if(usuario.primer_apellido.length >= 2 && usuario.primer_apellido.length <= 50 )
            return response.status(400).json({ message: 'El primer apellido debe tener entre 2 y 50 caracteres!'});
        if(!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(usuario.primer_nombre))
            return response.status(400).json({ message: 'El primer apellido solo debe contener letras!'});
    } else {
        return response.status(400).json({ message: 'El primer apellido no es valido!'});
    }

    // Validacion segundo apellido
    if (usuario?.segundo_apellido) {
        if(usuario.segundo_apellido.length >= 2 && usuario.segundo_apellido.length <= 50 )
            return response.status(400).json({ message: 'El segundo apellido debe tener entre 2 y 50 caracteres!'});
        if(!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(usuario.primer_nombre))
            return response.status(400).json({ message: 'El segundo apellido solo debe contener letras!'});
    } else {
        return response.status(400).json({ message: 'El segundo apellido no es valido!'});
    }

    // Validacion del numero celular
    if(usuario?.celular) { 
        if(usuario.celular.length < 10)
            return response.status(400).json({ message: 'Numero celular debe tener 10 numeros!'});

        if(!/^\d+$/.test(usuario.nroCedula)) // Comprueba que la cadena solo tenga numeros
            return response.status(400).json({ message: 'Numero celular solo debe contener numeros!'});
    }
    else {
        return response.status(400).json({ message: 'Numero celular no valido!'});
    }

    // Validacion del email
    
    try {
        const representanteEncontrado = await Representante.findOne({ 
            where: { nroCedula: usuario.nroCedula }
        });

        if(representanteEncontrado)
            return response.status(409).json({ message: 'El usuario ya existe!' }); // 409 conflict

        const nuevoRepresentante = await Representante.create(usuario);
        return response.status(200).json({ message: 'Usuario creado exitosamente', nuevoRepresentante});

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'No hubo respuesta desde el servidor' });
    }
}
// Read REPRESENTANTE

// Update REPRESENTANTE

// Delete REPRESENTANTE