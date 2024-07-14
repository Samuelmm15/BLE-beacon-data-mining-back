import express from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import https from "https";
import fs from "fs";

import trackerDataRouter from "../routes/trackerData";
import beaconMessageRouter from "../routes/beaconMessage";
import beaconRouter from "../routes/beacon";
import UserRouter from "../routes/user";
import beaconOperationsRouter from "../routes/beaconOperations";
import ResetPasswordRouter from "../routes/resetPassword";
import helmet from "helmet";

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

// Uso de Helmet para configurar una política de CSP más segura
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"], 
      fontSrc: ["'self'", "https://fonts.gstatic.com"], 
      imgSrc: ["'self'", "data:"], 
      connectSrc: ["'self'", "https://localhost:3000"], 
      frameAncestors: ["'self'"], 
      formAction: ["'self'"],
    },
  })
);

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/trackerData", trackerDataRouter);
app.use("/api/beaconMessage", beaconMessageRouter);
app.use("/api/beacon", beaconRouter);
app.use("/api/user", UserRouter);
app.use("/api/beaconOperations", beaconOperationsRouter);
app.use("/api/resetPassword", ResetPasswordRouter);

const options = {
  key: fs.readFileSync("clave.pem"),
  cert: fs.readFileSync("certificado.pem"),
};

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
