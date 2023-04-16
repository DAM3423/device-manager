const db = require("../db");

const getDevices = async (req, res) => {
  const devices = await db.getDevices(
    parseInt(req.body.page),
    parseInt(req.body.itemsPerPage),
    req.body.sortBy,
    req.body.sortDesc,
    req.body.search
  );

  res.json({
    items: devices.rows,
    total_items: devices.count,
  });
};

const getDeviceById = async (req, res) => {
  const device = await db.getDeviceById(req.params.id);
  if (device) {
    res.json(device);
  } else {
    res.status(404).json({ message: "Device not found" });
  }
};

const createDevice = async (req, res) => {
  const { model, brand, release_date, os, is_new, received_datetime } =
    req.body;

  const device = await db.createDevice({
    model,
    brand,
    release_date,
    os,
    is_new,
    received_datetime,
  });
  res.status(201).json(device);
};

const updateDevice = async (req, res) => {
  const { model, brand, release_date, os, is_new, received_datetime } =
    req.body;
  const device = await db.updateDevice(req.params.id, {
    model,
    brand,
    release_date,
    os,
    is_new,
    received_datetime,
  });
  if (device) {
    res.json(device);
  } else {
    res.status(404).json({ message: "Device not found" });
  }
};

const deleteDevice = async (req, res) => {
  const result = await db.deleteDevice(req.params.id);
  if (result) {
    res.json({ message: "Device deleted successfully" });
  } else {
    res.status(404).json({ message: "Device not found" });
  }
};

module.exports = {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
};
