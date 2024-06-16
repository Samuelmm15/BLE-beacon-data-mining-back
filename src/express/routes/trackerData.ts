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
      return res.status(404).json({ message: "No documents" });
    }
    res.json(allTrackerData).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Operación de obtención de todos los beacons que se encuentran dentro de un rango de fecha
router.get("/allTrackerDataByDateRange", async (req, res) => {
  const trackerDataRepository = getRepository(TrackerData);

  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let options: { where: { time: any } } = { where: { time: {} } };

    if (startDate && endDate) {
      const start = new Date(startDate as string).toISOString().split(".")[0];
      const end = new Date(endDate as string).toISOString().split(".")[0];

      options.where.time = {
        $gte: start,
        $lte: end,
      };
    }

    const allTrackerDataByDateRange = await trackerDataRepository.find(options);

    if (!allTrackerDataByDateRange) {
      return res.status(404).json({ message: "No documents" });
    }
    res.json(allTrackerDataByDateRange).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Operación de obtención de todos los beacons que se encuentran dentro de una fecha específica en unas horas en concreto
router.get("/allTrackerDataByHourRange", async (req, res) => {
  const trackerDataRepository = getRepository(TrackerData);

  try {
    const date = req.query.date;
    const startHour = req.query.startHour;
    const endHour = req.query.endHour;

    let options: { where: { time?: any } } = { where: {} };

    if (date && startHour && endHour) {
      const start = new Date(`${date as string}T${startHour as string}Z`)
        .toISOString()
        .split(".")[0];
      const end = new Date(`${date as string}T${endHour as string}Z`)
        .toISOString()
        .split(".")[0];

      options.where.time = {
        $gte: start,
        $lte: end,
      };
    }

    const allTrackerDataByHourRange = await trackerDataRepository.find(options);

    if (!allTrackerDataByHourRange) {
      return res.status(404).json({ message: "No documents" });
    }
    res.json(allTrackerDataByHourRange).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Operación de obtención de todos los identificadores de manera única de los beacons
router.get("/ids", async (req, res) => {
  const trackerDataRepository = getRepository(TrackerData);

  try {
    const allTrackers = await trackerDataRepository.find();
    const allIds = allTrackers.map((tracker) => tracker.droneId);
    const uniqueIds = [...new Set(allIds)];

    if (uniqueIds.length === 0) {
      return res.status(404).json({ message: "No documents" });
    }
    res.status(200).json(uniqueIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Operación de obtención de un dato específico del trackerData mediante el identificador del documento (GetDataID)
router.get("/:id", async (req, res) => {
  const trackerDataRepository = getRepository(TrackerData);

  try {
    const { id } = req.params;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const specificDate = req.query.specificDate;
    const startHour = req.query.startHour;
    const endHour = req.query.endHour;

    let options: { where: { droneId: string; time?: any } } = {
      where: { droneId: id },
    };

    if (startDate && endDate) {
      const start = new Date(startDate as string).toISOString().split(".")[0];
      const end = new Date(endDate as string).toISOString().split(".")[0];

      options.where.time = {
        $gte: start,
        $lte: end,
      };
    }

    if (specificDate) {
      const start = new Date(
        `${specificDate as string}T${startHour as string}Z`
      )
        .toISOString()
        .split(".")[0];
      const end = new Date(`${specificDate as string}T${endHour as string}Z`)
        .toISOString()
        .split(".")[0];
      console.log(start);
      console.log(end);

      options.where.time = {
        $gte: start,
        $lte: end,
      };
    }

    const trackers = await trackerDataRepository.find(options);

    if (!trackers.length) {
      return res.status(200).json(trackers);
    }

    res.json(trackers).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(trackerDataByDroneId).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Creación de un nuevo documento en la coelcción trackerData
router.post("/", async (req, res) => {
  const trackerDataRepository = getRepository(TrackerData);

  try {
    const newTrackerData = trackerDataRepository.create(req.body);

    const errors = await validate(newTrackerData);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    await trackerDataRepository.save(newTrackerData);
    res.status(200).json(newTrackerData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
      return res.status(404).json({ message: "Document not found" });
    }

    await trackerDataRepository.delete(id);
    res.json(trackerDataById).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
      return res.status(404).json({ message: "Document not found" });
    }

    trackerDataRepository.merge(trackerDataById, req.body);
    const updatedTrackerData = await trackerDataRepository.save(
      trackerDataById
    );

    res.json(updatedTrackerData).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
