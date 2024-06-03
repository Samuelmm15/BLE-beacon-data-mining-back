import nodemailer from "nodemailer";
import { User } from "../../typeORM/entity/user.entity";
import { ResetPassword } from "../../typeORM/entity/resetPassword.entity";
import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";

export async function sendPasswordResetEmail(email: string) {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Genera un token de restablecimiento de contraseña
  const secret: string = process.env.JWT_SECRET ?? "";
  const payload = { userId: user.email, purpose: "passwordReset" };
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  // Guarda el token en la base de datos
  const resetPasswordRepository = getRepository(ResetPassword);
  const resetPassword = new ResetPassword();
  resetPassword.userId = user._id.toHexString();
  resetPassword.token = token;
  resetPassword.expiresAt = new Date(Date.now() + 3600000); // 1 hora
  await resetPasswordRepository.save(resetPassword);

  // Configura el transporte de correo
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Configura las opciones del correo
  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: "Restablecimiento de contraseña",
    text: `Hola ${user.name},\n\nPara restablecer tu contraseña, por favor haz clic en el siguiente enlace:\n\nhttps://localhost:3000/reset-password/${token}\n\nSi no has solicitado un restablecimiento de contraseña, por favor ignora este correo.\n`,
  };

  // Envía el correo
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
}