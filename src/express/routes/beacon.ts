import express from "express";
import { getRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { Beacon } from "../../typeORM/entity/beacon.entity";
import { BeaconMessage } from "../../typeORM/entity/beaconMessage.entity";
import { validate } from "class-validator";

const router = express.Router();

// Operación de obtención de todos los beacons (GetAllBeacons)
router.get("/", async (req, res) => {
  const beaconRepository = getRepository(Beacon);

  try {
    const allBeacons = await beaconRepository.find();

    if (allBeacons.length === 0) {
      return res.status(404).json({ message: "No hay documentos" });
    }
    res.json(allBeacons).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Operación de obtención de un beacon específico mediante el identificador del documento (GetBeaconID)
router.get("/:id", async (req, res) => {
  const beaconRepository = getRepository(Beacon);

  try {
    const id = new ObjectId(req.params.id);
    const beaconById = await beaconRepository.findOne({
      where: { _id: id },
    });

    if (!beaconById) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    res.json(beaconById).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Operación de creación de un nuevo beacon (CreateBeacon)
router.post("/", async (req, res) => {
  const beaconRepository = getRepository(Beacon);

  try {
    const newBeacon = beaconRepository.create(req.body);
    const errors = await validate(newBeacon);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const result = await beaconRepository.save(newBeacon);
    res.json(result).status(201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Operación de actualización de un beacon (UpdateBeacon)
router.put("/:id", async (req, res) => {
  const beaconRepository = getRepository(Beacon);
  const messageRepository = getRepository(BeaconMessage);

  try {
    const id = new ObjectId(req.params.id);
    const beacon = await beaconRepository.findOne({ where: { _id: id } });

    if (!beacon) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    // Fusionar los datos del cuerpo de la solicitud con el beacon existente
    beaconRepository.merge(beacon, req.body);

    // Buscar los mensajes por sus identificadores y asociarlos al beacon
    const messages = await Promise.all(
      req.body.messages.map(async (messageId: string) => {
        const idMessage = new ObjectId(messageId);
        const message = await messageRepository.findOne({
          where: { _id: idMessage },
        });
        if (!message) {
          throw new Error(`Mensaje no encontrado: ${messageId}`);
        }
        return message._id; // Guardar solo el identificador del mensaje
      })
    );

    beacon.messages = messages;

    const errors = await validate(beacon);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    // Guardar el beacon con los mensajes actualizados
    const result = await beaconRepository.update(id, beacon);
    res.json(result).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Operación de eliminación de un beacon (DeleteBeacon)
router.delete("/:id", async (req, res) => {
  const beaconRepository = getRepository(Beacon);

  try {
    const id = new ObjectId(req.params.id);
    const beaconById = await beaconRepository.findOne({
      where: { _id: id },
    });

    if (!beaconById) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    await beaconRepository.delete(id);
    res.json(beaconById).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
