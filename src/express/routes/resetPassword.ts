import express from "express";
import { sendPasswordResetEmail } from "../services/ResetPassword";
import { validateResetPasswordToken } from "../services/ValidateResetPasswordToken";
import { getRepository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../../typeORM/entity/user.entity";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    await sendPasswordResetEmail(email);
    res.status(200).send("Password reset email sent");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

router.post("/validate", async (req, res) => {
  const { token, actualTime } = req.body;
  try {
    const isValid = await validateResetPasswordToken(token, actualTime);
    res.status(200).send(isValid);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

router.post("/reset", async (req, res) => {
  const { email, password } = req.body;
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;

    await userRepository.save(user);
    res.status(200).json({ message: "Password reset" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
