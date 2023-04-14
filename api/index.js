"use strict";

const express = require("express");
const db = require("./db.js");

const app = express();

const deviceRoutes = require("./routes/devices");

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/devices", deviceRoutes);

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
