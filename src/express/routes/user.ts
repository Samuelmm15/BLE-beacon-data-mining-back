import express from "express";
import { getRepository } from "typeorm";
import { User } from "../../typeORM/entity/user.entity";
import { ObjectId } from "mongodb";
import { validate } from "class-validator";

const router = express.Router();

// Operación de obtención de todos los datos del usuario (GetAllData)
router.get("/", async (req, res) => {
  const userRepository = getRepository(User);

  try {
    const allUsers = await userRepository.find();

    if (!allUsers) {
      return res.status(404).json({ message: "No hay documentos" });
    }
    res.json(allUsers).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
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
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    res.json(userById).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Operación de obtención de un dato específico del usuario mediante el correo electrónico (GetDataEmail)
router.get("/email/:email", async (req, res) => {
  const userRepository = getRepository(User);

  try {
    const email = req.params.email;
    const userByEmail = await userRepository.findOne({
      where: { email: email },
    });

    if (!userByEmail) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    res.json(userByEmail).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
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
    res
      .status(500)
      .json({
        message: "El correo ya se encuentra asociado a un usuario existente",
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
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    userRepository.merge(userById, req.body);
    const updatedUser = await userRepository.save(userById);

    res.json(updatedUser).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
