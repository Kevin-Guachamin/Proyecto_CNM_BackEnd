require('dotenv').config();
const nodemailer=require("nodemailer")

const enivarContrasenia = async(email, contrasenaProvisional)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
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
const enviarRecoverLink= async(email,link)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Recuperar contraseña',
            text: `Hola, para recuprar tu contraseña por favor has click en el siguiente enlace: ${link}.\n\nEste link tiene una expiración de 15 minutos.`,
        };
    
    
        await transporter.sendMail(mailOptions);

}
module.exports={
    enivarContrasenia,
    enviarRecoverLink
}