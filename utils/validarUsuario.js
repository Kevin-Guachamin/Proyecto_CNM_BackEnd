// Validar usuario
const { validarCedulaEcuatoriana } = require('./utils/validarCedulaEcuatoriana');
const path = require('path'); // Para validacion de rutas a documentos PDF

function validarUsuario(usuario, isUpdate = false) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;

    // Si es una actualización y no hay campos para actualizar
    if (isUpdate && Object.keys(usuario).length === 0) {
        return {
            isValid: false,
            message: 'No hay campos para actualizar'
        };
    }

    // Validación de cédula (requerida solo en creación)
    if (!isUpdate && (!usuario?.nroCedula || usuario.nroCedula.length !== 10 || 
        !/^\d+$/.test(usuario.nroCedula) || !validarCedulaEcuatoriana(usuario.nroCedula))) {
        return {
            isValid: false,
            message: 'Número de cédula no válido'
        };
    }

    // Validación de nombres y apellidos
    if (!isUpdate || usuario.primer_nombre) {
        if (!usuario?.primer_nombre || 
            usuario.primer_nombre.length < 2 || 
            usuario.primer_nombre.length > 50 ||
            !nombreRegex.test(usuario.primer_nombre)) {
            return {
                isValid: false,
                message: 'El primer nombre debe tener entre 2 y 50 caracteres y solo debe contener letras'
            };
        }
    }

    if (!isUpdate || usuario.segundo_nombre) {
        if (!usuario?.segundo_nombre || 
            usuario.segundo_nombre.length < 2 || 
            usuario.segundo_nombre.length > 50 ||
            !nombreRegex.test(usuario.segundo_nombre)) {
            return {
                isValid: false,
                message: 'El segundo nombre debe tener entre 2 y 50 caracteres y solo debe contener letras'
            };
        }
    }

    if (!isUpdate || usuario.primer_apellido) {
        if (!usuario?.primer_apellido || 
            usuario.primer_apellido.length < 2 || 
            usuario.primer_apellido.length > 50 ||
            !nombreRegex.test(usuario.primer_apellido)) {
            return {
                isValid: false,
                message: 'El primer apellido debe tener entre 2 y 50 caracteres y solo debe contener letras'
            };
        }
    }

    if (!isUpdate || usuario.segundo_apellido) {
        if (!usuario?.segundo_apellido || 
            usuario.segundo_apellido.length < 2 || 
            usuario.segundo_apellido.length > 50 ||
            !nombreRegex.test(usuario.segundo_apellido)) {
            return {
                isValid: false,
                message: 'El segundo apellido debe tener entre 2 y 50 caracteres y solo debe contener letras'
            };
        }
    }

    // Validación de números telefónicos
    if (!isUpdate || usuario.celular) {
        if (!usuario?.celular || 
            usuario.celular.length !== 10 || 
            !/^\d+$/.test(usuario.celular)) {
            return {
                isValid: false,
                message: 'El número celular debe tener 10 dígitos'
            };
        }
    }

    if (!isUpdate || usuario.telefono_convencional) {
        if (!usuario?.telefono_convencional || 
            usuario.telefono_convencional.length < 7 || 
            usuario.telefono_convencional.length > 10 || 
            !/^\d+$/.test(usuario.telefono_convencional)) {
            return {
                isValid: false,
                message: 'El número convencional debe tener entre 7 y 10 dígitos'
            };
        }
    }

    if (!isUpdate || usuario.telefono_emergencia) {
        if (!usuario?.telefono_emergencia || 
            usuario.telefono_emergencia.length < 7 || 
            usuario.telefono_emergencia.length > 10 || 
            !/^\d+$/.test(usuario.telefono_emergencia)) {
            return {
                isValid: false,
                message: 'El número de emergencia debe tener entre 7 y 10 dígitos'
            };
        }
    }

    // Validación de email
    if (!isUpdate || usuario.email) {
        if (!usuario?.email || !emailRegex.test(usuario.email)) {
            return {
                isValid: false,
                message: 'Formato de email no válido'
            };
        }
    }

    // Validación de archivos PDF
    if (!isUpdate || usuario.cedula_PDF) {
        if (!usuario?.cedula_PDF || path.extname(usuario.cedula_PDF).toLowerCase() !== '.pdf') {
            return {
                isValid: false,
                message: 'El archivo de cédula debe ser PDF'
            };
        }
    }

    if (!isUpdate || usuario.croquis_PDF) {
        if (!usuario?.croquis_PDF || path.extname(usuario.croquis_PDF).toLowerCase() !== '.pdf') {
            return {
                isValid: false,
                message: 'El archivo de croquis debe ser PDF'
            };
        }
    }

    // Validación de contraseña
    if (!isUpdate || usuario.contraseña) {
        if (!usuario?.contraseña || 
            usuario.contraseña.length < 8 || 
            usuario.contraseña.length > 100) {
            return {
                isValid: false,
                message: 'La contraseña debe tener entre 8 y 100 caracteres'
            };
        }
    }

    // Si todas las validaciones pasan
    return {
        isValid: true,
        message: ''
    };
}

module.exports = { validarUsuario };