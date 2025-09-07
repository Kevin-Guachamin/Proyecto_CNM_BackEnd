require('dotenv').config();
const nodemailer = require("nodemailer");

const createTransporter = () => {
    return nodemailer.createTransport({

        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

const enviarContrasenia = async (email, contrasenaProvisional) => {
    try {
        const transporter = createTransporter();
        try {
            await transporter.verify();
            console.log("Conexión SMTP con Gmail establecida correctamente ✅");
        } catch (err) {
            console.error("❌ Error al conectar con Gmail:", err);
        }
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Contraseña provisional',
            text: `Hola, tu cuenta ha sido creada. 
Tu contraseña provisional es: ${contrasenaProvisional}.
            
Por favor, cámbiala lo antes posible.`,
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        // relanzamos el error para que lo maneje la función que la llama
        throw new Error(`Error al enviar correo de contraseña provisional: ${error.message}`);
    }
};

const enviarRecoverLink = async (email, link) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Recuperar contraseña',
            text: `Hola, para recuperar tu contraseña haz click en el siguiente enlace: ${link}.
            
Este link tiene una expiración de 15 minutos.`,
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        throw new Error(`Error al enviar correo de recuperación: ${error.message}`);
    }
};

module.exports = {
    enviarContrasenia,
    enviarRecoverLink
};
