import express from 'express';
import { getRepository } from 'typeorm';
import { TrackerData } from '../../typeORM/entity/trackerData.entity';

const router = express.Router();

router.get('/', async (req, res) => {
    const trackerDataRepository = getRepository(TrackerData);
    const allTrackerData = await trackerDataRepository.find();
    res.json(allTrackerData);
});

export default router;
