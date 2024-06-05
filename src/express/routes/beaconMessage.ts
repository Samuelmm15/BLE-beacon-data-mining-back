import express from "express";
import { getRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { BeaconMessage } from "../../typeORM/entity/beaconMessage.entity";
import { validate } from "class-validator";

const router = express.Router();

// Operación de obtención de todos los mensajes del beacon (GetAllMessages)
router.get("/", async (req, res) => {
  const beaconMessageRepository = getRepository(BeaconMessage);

  try {
    const allBeaconMessages = await beaconMessageRepository.find();

    if (allBeaconMessages.length === 0) {
      return res.status(404).json({ message: "No documents" });
    }
    res.json(allBeaconMessages).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Operación de obtención de un mensaje específico del beacon mediante el identificador del documento (GetMessageID)
router.get("/:id", async (req, res) => {
  const beaconMessageRepository = getRepository(BeaconMessage);

  try {
    const id = new ObjectId(req.params.id);
    const beaconMessageById = await beaconMessageRepository.findOne({
      where: { _id: id },
    });

    if (!beaconMessageById) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(beaconMessageById).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Operación de creación de un nuevo mensaje del beacon (CreateMessage)
router.post("/", async (req, res) => {
  const beaconMessageRepository = getRepository(BeaconMessage);

  try {
    const newBeaconMessage = beaconMessageRepository.create(req.body);
    const errors = await validate(newBeaconMessage);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const result = await beaconMessageRepository.save(newBeaconMessage);
    res.json(result).status(201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Operación de actualización de un mensaje del beacon (UpdateMessage)
router.put("/:id", async (req, res) => {
  const beaconMessageRepository = getRepository(BeaconMessage);

  try {
    const id = new ObjectId(req.params.id);
    const beaconMessageById = await beaconMessageRepository.findOne({
      where: { _id: id },
    });

    if (!beaconMessageById) {
      return res.status(404).json({ message: "Document not found" });
    }

    beaconMessageRepository.merge(beaconMessageById, req.body);
    const result = await beaconMessageRepository.save(beaconMessageById);
    res.json(result).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Operación de eliminación de un mensaje del beacon (DeleteMessage)
router.delete("/:id", async (req, res) => {
  const beaconMessageRepository = getRepository(BeaconMessage);

  try {
    const id = new ObjectId(req.params.id);
    const beaconMessageById = await beaconMessageRepository.findOne({
      where: { _id: id },
    });

    if (!beaconMessageById) {
      return res.status(404).json({ message: "Document not found" });
    }

    await beaconMessageRepository.delete(id);
    res.json(beaconMessageById).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
