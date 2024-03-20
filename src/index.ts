import {createConnection} from "typeorm";
import { TrackerData } from "./entity/trackerData.entity";
import { BeaconMessage } from "./entity/beaconMessage.entity";
import { Beacon } from "./entity/beacon.entity";

createConnection().then(async connection => {
    // Prueba de inserción de un nuevo documento TrackerData
    console.log("Inserting a new TrackerData into the database...");
    const trackerData = new TrackerData();
    trackerData.droneId = "3";
    trackerData.time = new Date();
    trackerData.location = {
        latitude: 37.7749,
        longitude: 122.4194,
        altitude: 0,
        bearing: 0,
        speed: 0
    };
    await connection.manager.save(trackerData);
    console.log("Saved a new TrackerData with id: " + trackerData.id);
    console.log("Loading TrackerData from the database...");
    const trackerDataRepository = connection.getRepository(TrackerData);
    const trackerDatas = await trackerDataRepository.find();
    console.log("Loaded TrackerDatas: ", trackerDatas);

    // Prueba de inserción de un nuevo documento beaconMessage
    console.log("Inserting a new BeaconMessage into the database...");
    const beaconMessage = new BeaconMessage();
    beaconMessage.message = "Hola";
    await connection.manager.save(beaconMessage);
    console.log("Saved a new BeaconMessage with id: " + beaconMessage.id);
    console.log("Loading BeaconMessage from the database...");
    const beaconMessageRepository = connection.getRepository(BeaconMessage);
    const beaconMessages = await beaconMessageRepository.find();
    console.log("Loaded BeaconMessages: ", beaconMessages);

    console.log("Inserting a new BeaconMessage into the database...");
    const beaconMessage2 = new BeaconMessage();
    beaconMessage2.message = "Adiós";
    await connection.manager.save(beaconMessage2);
    console.log("Saved a new BeaconMessage with id: " + beaconMessage2.id);
    console.log("Loading BeaconMessage from the database...");
    const beaconMessageRepository2 = connection.getRepository(BeaconMessage);
    const beaconMessages2 = await beaconMessageRepository2.find();
    console.log("Loaded BeaconMessages: ", beaconMessages2);

    // Prueba de inserción de un nuevo documento Beacon
    console.log("Inserting a new Beacon into the database...");
    const beacon = new Beacon();
    beacon.beaconId = "2"; 
    beacon.messages = [beaconMessage];
    beacon.messages = [beaconMessage2];
    await connection.manager.save(beacon);
    console.log("Saved a new Beacon with id: " + beacon.id);
    console.log("Loading Beacon from the database...");
    const beaconRepository = connection.getRepository(Beacon);
    const beacons = await beaconRepository.find();

}).catch(error => console.log("Error: ", error));