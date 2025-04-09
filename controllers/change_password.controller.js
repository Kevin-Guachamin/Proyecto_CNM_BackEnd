const bcrypt = require("bcryptjs")
const { validationResult } = require('express-validator');
const Representante = require('../models/representante.model');
const Docente = require('../models/docente.model');

const { check } = require('express-validator');

module.exports.validatePasswordChange = [
  check('newPassword')
    .isLength({ min: 8 }).withMessage('Debe tener al menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('Debe contener al menos una letra mayúscula')
    .matches(/[0-9]/).withMessage('Debe contener al menos un número')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Debe contener al menos un carácter especial'),
];
module.exports.changePassword = async(req,res)=>{
    
    try {
        
        const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({  message: errors.array()[0].msg });
    let user
    const { currentPassword, newPassword, type } = req.body;
    
    if(type==="docente"){
         user = await Docente.findByPk(req.user.nroCedula);

    }else if(type==="representante"){
        user = await Representante.findByPk(req.user.nroCedula);
    }
    else{
        return res.status(400).json({ message: "Tipo de usuario no válido" });
    }
    
    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña actual incorrecta" });

    // Hashear y guardar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
        console.log("este es el error",error)
        return res.status(400).json({mesage: "error en el servidor"})
    }
    
  }
