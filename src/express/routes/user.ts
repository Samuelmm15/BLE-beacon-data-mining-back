import express from "express";
import { getRepository } from "typeorm";
import { User } from "../../typeORM/entity/user.entity";
import { ObjectId } from "mongodb";
import { validate } from "class-validator";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Operación de obtención de todos los datos del usuario (GetAllData)
router.get("/", async (req, res) => {
  const userRepository = getRepository(User);

  try {
    const allUsers = await userRepository.find();

    if (!allUsers) {
      return res.status(404).json({ message: "No documents" });
    }
    res.json(allUsers).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Operación de obtención de un dato específico del usuario mediante el identificador del documento (GetDataID)
router.get("/:id", async (req, res) => {
  const userRepository = getRepository(User);

  try {
    const id = new ObjectId(req.params.id);
    const userById = await userRepository.findOne({
      where: { _id: id },
    });

    if (!userById) {
      return res.status(404).json({ message: "No documents" });
    }

    res.json(userById).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

function generateJWT(user: any) {
  const secret: string = process.env.JWT_SECRET ?? "";
  const payload = { userId: user.name };
  const token = jwt.sign(payload, secret);
  return token;
}

// Operación de inicio de sesión de un usuario (Login)
// Inicio de sesión de usuario
router.post("/login", async (req, res) => {
  const userRepository = getRepository(User);

  try {
    const { email, password } = req.body;
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateJWT(user);

    res.status(200).send({ message: "Successful login", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Creación de un nuevo usuario (CreateData)
router.post("/", async (req, res) => {
  const userRepository = getRepository(User);

  try {
    const newUser = userRepository.create(req.body);
    const errors = await validate(newUser);

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    await userRepository.save(newUser);
    res.json(newUser).status(201);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "The email is already associated to an existing user.",
    });
  }
});

// Actualización de un documento del usuario (UpdateData)
router.put("/:id", async (req, res) => {
  const userRepository = getRepository(User);

  try {
    const id = new ObjectId(req.params.id);
    const userById = await userRepository.findOne({
      where: { _id: id },
    });

    if (!userById) {
      return res.status(404).json({ message: "No document" });
    }

    userRepository.merge(userById, req.body);
    const updatedUser = await userRepository.save(userById);

    res.json(updatedUser).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
