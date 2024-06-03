import express from "express";
import { sendPasswordResetEmail } from "../services/ResetPassword";

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

export default router;