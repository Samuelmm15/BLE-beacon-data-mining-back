import express from "express";
import cors from "cors";
import { createConnection } from "typeorm";

import trackerDataRouter from "../routes/trackerData";
import beaconMessageRouter from "../routes/beaconMessage";

createConnection()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.log("Error connecting to the database", error);
  });

const app = express();
const port = 3000;

const corsOptions = {
  origin: `http://localhost:${port}`,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/trackerData", trackerDataRouter);
app.use("/api/beaconMessage", beaconMessageRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
