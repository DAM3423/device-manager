"use strict";

const express = require("express");
const db = require("./db.js");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// GET all devices
app.get('/devices', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM devices');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving devices');
  }
});

// GET a device by ID
app.get('/devices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM devices WHERE id = $1', [id]);
    if (rows.length === 0) {
      res.status(404).send('Device not found');
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving device');
  }
});

// CREATE a new device
app.post('/devices', async (req, res) => {
  const { model, brand, release_date, os, is_new, received_datetime } = req.body;
  try {
    await db.query(
      'INSERT INTO devices (model, brand, release_date, os, is_new, received_datetime) VALUES ($1, $2, $3, $4, $5, $6)',
      [model, brand, release_date, os, is_new, received_datetime]
    );
    res.send('Device created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating device');
  }
});

// UPDATE a device by ID
app.put('/devices/:id', async (req, res) => {
  const { id } = req.params;
  const { model, brand, release_date, os, is_new, received_datetime } = req.body;
  try {
    const result = await db.query(
      'UPDATE devices SET model = $1, brand = $2, release_date = $3, os = $4, is_new = $5, received_datetime = $6 WHERE id = $7',
      [model, brand, release_date, os, is_new, received_datetime, id]
    );
    if (result.rowCount === 0) {
      res.status(404).send('Device not found');
    } else {
      res.send('Device updated');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating device');
  }
});

// DELETE a device by ID
app.delete('/devices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM devices WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).send('Device not found');
    } else {
      res.send('Device deleted');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting device');
  }
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});