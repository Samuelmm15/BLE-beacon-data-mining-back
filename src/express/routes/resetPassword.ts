import express from "express";
import { sendPasswordResetEmail } from "../services/ResetPassword";
import { validateResetPasswordToken } from "../services/ValidateResetPasswordToken";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    await sendPasswordResetEmail(email);
    res.status(200).send("Correo de restablecimiento de contraseña enviado");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

router.post("/validate", async (req, res) => {
  const {token, actualTime} = req.body;
  try {
    const isValid = await validateResetPasswordToken(token, actualTime);
    res.status(200).send(isValid);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

export default router;
