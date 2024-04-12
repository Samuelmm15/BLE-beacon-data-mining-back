import express from "express";
import { getRepository } from "typeorm";
import { TrackerData } from "../../typeORM/entity/trackerData.entity";
import { ObjectId } from "mongodb";
import { validate } from "class-validator";

const router = express.Router();

// Operación de obtención de todos los datos del trackerData (GetAllData)
router.get("/", async (req, res) => {
  const trackerDataRepository = getRepository(TrackerData);

  try {
    const allTrackerData = await trackerDataRepository.find();

    if (!allTrackerData) {
      return res.status(404).json({ message: "No hay documentos" });
    }
    res.json(allTrackerData).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Operación de obtención de un dato específico del trackerData mediante el identificador del documento (GetDataID)
router.get("/:id", async (req, res) => {
  const trackerDataRepository = getRepository(TrackerData);

  try {
    const id = new ObjectId(req.params.id);
    const trackerDataById = await trackerDataRepository.findOne({ where: { _id: id } });

    if (!trackerDataById) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    res.json(trackerDataById).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Obtención de los datos del Tracker a partir del identificador del dron
router.get("/drone/:droneId", async (req, res) => {
  const trackerDataRepository = getRepository(TrackerData);

  try {
    const droneId = req.params.droneId;
    const trackerDataByDroneId = await trackerDataRepository.find({
      where: { droneId: droneId },
    });

    if (!trackerDataByDroneId) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    res.json(trackerDataByDroneId).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Creación de un nuevo documento en la coelcción trackerData
router.post("/", async (req, res) => {
  const trackerDataRepository = getRepository(TrackerData);

  try {
    const newTrackerData = trackerDataRepository.create(req.body);

    const errors = await validate(newTrackerData);
    if (errors.length > 0) {
      return res.status(400).json({ message: "RSSI fuera de rango", errors });
    }

    await trackerDataRepository.save(newTrackerData);
    res.status(200).json(newTrackerData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Eliminación de un documento de la colección trackerData
router.delete("/:id", async (req, res) => {
  const trackerDataRepository = getRepository(TrackerData);

  try {
    const id = new ObjectId(req.params.id);
    const trackerDataById = await trackerDataRepository.findOne({
      where: { _id: id },
    });

    if (!trackerDataById) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    await trackerDataRepository.delete(id);
    res.json(trackerDataById).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Actualización de un documento de la colección trackerData
router.put("/:id", async (req, res) => {
  const trackerDataRepository = getRepository(TrackerData);

  try {
    const id = new ObjectId(req.params.id);
    const trackerDataById = await trackerDataRepository.findOne({
      where: { _id: id },
    });

    if (!trackerDataById) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    trackerDataRepository.merge(trackerDataById, req.body);
    const updatedTrackerData = await trackerDataRepository.save(trackerDataById);

    res.json(updatedTrackerData).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router; 
