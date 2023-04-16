"use strict";

const express = require("express");
const cors = require("cors");
const app = express();

const deviceRoutes = require("./routes/devices");

const allowedOrigins = ["http://localhost:3000", "http://localhost"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

// Configure CORS
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

// Devices routes
app.use("/devices", deviceRoutes);

module.exports = app;
