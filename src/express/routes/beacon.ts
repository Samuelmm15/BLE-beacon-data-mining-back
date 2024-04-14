import express from 'express';
import { getRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Beacon } from '../../typeORM/entity/beacon.entity';
import { validate } from 'class-validator';

const router = express.Router();

// Operación de obtención de todos los beacons (GetAllBeacons)
router.get('/', async (req, res) => {
  const beaconRepository = getRepository(Beacon);

  try {
    const allBeacons = await beaconRepository.find();

    if (allBeacons.length === 0) {
      return res.status(404).json({ message: 'No hay documentos' });
    }
    res.json(allBeacons).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Operación de creación de un nuevo beacon (CreateBeacon)
router.post('/', async (req, res) => {
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
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Operación de actualización de un beacon (UpdateBeacon)

export default router;