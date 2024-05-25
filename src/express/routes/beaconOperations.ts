import express from "express";
import { getRepository } from "typeorm";
import { Beacon } from "../../typeORM/entity/beacon.entity";
import { ObjectId } from "mongodb";
import { validate } from "class-validator";

const router = express.Router();

// Operación de contar todos los beacons que se encuentran dentro de un área
router.post("/", async (req, res) => {
  const { _southWest, _northEast, time } = req.body;
  const beaconRepository = getRepository(Beacon);

  try {
    const allBeacons = await beaconRepository.find();
    const filteredBeacons = allBeacons.filter(beacon =>
      beacon.location.latitude >= Math.min(_southWest.lat, _northEast.lat) &&
      beacon.location.latitude <= Math.max(_southWest.lat, _northEast.lat) &&
      beacon.location.longitude >= Math.min(_southWest.lng, _northEast.lng) &&
      beacon.location.longitude <= Math.max(_southWest.lng, _northEast.lng) &&
      beacon.time <= time
    );

    console.log(filteredBeacons)
    res.json({ count: filteredBeacons.length });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;