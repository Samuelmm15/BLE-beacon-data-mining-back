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
    //! Contar el número de beacons que se encuentran dentro del área
    const filteredBeacons = allBeacons.filter(
      (beacon) =>
        beacon.location.latitude >= Math.min(_southWest.lat, _northEast.lat) &&
        beacon.location.latitude <= Math.max(_southWest.lat, _northEast.lat) &&
        beacon.location.longitude >= Math.min(_southWest.lng, _northEast.lng) &&
        beacon.location.longitude <= Math.max(_southWest.lng, _northEast.lng) &&
        beacon.time === time
    );

    //! Cálculo del promedio de la velocidad de los beacons
    const totalSpeed = filteredBeacons.reduce(
      (total, beacon) => total + parseFloat(beacon.location.speed),
      0
    );
    const averageSpeed =
      filteredBeacons.length > 0 ? totalSpeed / filteredBeacons.length : 0;

    //! Cálculo del bearing dominante del área seleccionada
    // Define the number of bins and create an array to hold the count for each bin
    const numBins = 36; // For bins of 10 degrees each
    const bins = new Array(numBins).fill(0);

    // Increment the count for the appropriate bin for each beacon
    for (const beacon of filteredBeacons) {
      const bin = Math.floor(
        parseFloat(beacon.location.bearing) / (360 / numBins)
      );
      bins[bin]++;
    }

    // Find the bin with the highest count
    const maxBinIndex = bins.reduce(
      (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
      0
    );
    const dominantBearing = maxBinIndex * (360 / numBins);

    // Prepare data for radar chart
    const labels = Array.from(
      { length: numBins },
      (_, i) => `B${i * (360 / numBins)}`
    );
    const data = labels.map((label, i) => ({ name: label, star: bins[i] }));

    res.json({
      beacons: filteredBeacons.length,
      averageSpeed: averageSpeed,
      radarChartData: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
