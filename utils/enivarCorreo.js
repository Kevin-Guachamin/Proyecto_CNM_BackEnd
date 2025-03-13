require('dotenv').config();
const nodemailer=require("nodemailer")
const detectarProveedorCorreo=(email) =>{
    const dominios = {
        'gmail.com': 'gmail',
        'hotmail.com': 'hotmail',
        'outlook.com': 'outlook',
        
    };

    const dominio = email.split('@')[1]; // Extrae el dominio del correo

    return dominios[dominio] || 'Otro';
}
const enivarCorreo = async(email, contrasenaProvisional,service)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: service,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Contraseña provisional',
        text: `Hola, tu cuenta ha sido creada. Tu contraseña provisional es: ${contrasenaProvisional}.\n\nPor favor, cámbiala lo antes posible.`,
    };

    await transporter.sendMail(mailOptions);
}
module.exports={
    enivarCorreo,
    detectarProveedorCorreo
}