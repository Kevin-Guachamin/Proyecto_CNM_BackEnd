const bcrypt = require("bcryptjs")
const { validationResult } = require('express-validator');
const Representante = require('../models/representante.model');
const Docente = require('../models/docente.model')

module.exports.changePassword = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    let user
    const { currentPassword, newPassword, type } = req.body;
    if(type==="Docente"){
         user = await Docente.findById(req.user.nroCedula);

    }else if(type==="Representante"){
         user = await Representante.findById(req.user.nroCedula);
    }
    else{
        return res.status(400).json({ msg: "Tipo de usuario no válido" });
    }
   
    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    // Hashear y guardar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: "Contraseña actualizada con éxito" });
  }
