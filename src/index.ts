import {createConnection} from "typeorm";
import { TrackerData } from "./entity/trackerData.entity";
import { BeaconMessage } from "./entity/beaconMessage.entity";
import { Beacon } from "./entity/beacon.entity";
import { validateOrReject } from "class-validator";

createConnection().then(async connection => {
    // Prueba de inserción de un nuevo beacon
    // const beacon = new Beacon();
    // beacon.beaconId = "beacon1";
    // beacon.location = {
    //     latitude: 0,
    //     longitude: 0,
    //     altitude: 0,
    //     bearing: 0,
    //     speed: 0
    // };
    // await connection.manager.save(beacon);
    // console.log("Beacon saved: ", beacon);

    // Prueba de un nuevo TrackerData
    const trackerData = new TrackerData();
    trackerData.droneId = "drone4";
    trackerData.time = new Date();
    trackerData.location = {
        latitude: 0,
        longitude: 0,
        altitude: 0,
        bearing: 0,
        speed: 0
    };
    trackerData.rssi = 3;
    await connection.manager.save(trackerData);
    console.log("TrackerData saved: ", trackerData);

    // Prueba de un segundo TrackerData
    const trackerData2 = new TrackerData();
    trackerData2.droneId = "drone5";
    trackerData2.time = new Date();
    trackerData2.location = {
        latitude: 0,
        longitude: 0,
        altitude: 0,
        bearing: 0,
        speed: 0
    };
    trackerData2.rssi = 6;
    try {
        await validateOrReject(trackerData2);
        // Si la validación es exitosa, guarda la entidad
        await connection.manager.save(trackerData2);
        console.log("TrackerData2 saved: ", trackerData2);
    } catch (errors) {
        console.log('Se han detectado errores de validación:', errors);
    }

}).catch(error => console.log("Error: ", error));