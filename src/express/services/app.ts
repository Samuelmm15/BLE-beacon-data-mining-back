import express from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import https from 'https';
import fs from 'fs';

import trackerDataRouter from "../routes/trackerData";
import beaconMessageRouter from "../routes/beaconMessage";
import beaconRouter from "../routes/beacon";
import UserRouter from "../routes/user";

createConnection()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.log("Error connecting to the database", error);
  });

const app = express();
const reactPort = 3001;
const port = 3000;

const corsOptions = {
  origin: `https://localhost:${reactPort}`,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/trackerData", trackerDataRouter);
app.use("/api/beaconMessage", beaconMessageRouter);
app.use("/api/beacon", beaconRouter);
app.use("/api/user", UserRouter);

const options = {
  key: fs.readFileSync('clave.pem'),
  cert: fs.readFileSync('certificado.pem')
};

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
