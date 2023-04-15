"use strict";

const express = require("express");
const cors = require("cors");
const app = express();

const deviceRoutes = require("./routes/devices");

app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/devices", deviceRoutes);

module.exports = app;
