const db = require("../db");

const getAllDevices = async (req, res) => {
  const devices = await db.getAllDevices();
  res.json(devices);
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
  const { model, brand, release_date, os, is_new } = req.body;
  const device = await db.createDevice({
    model,
    brand,
    release_date,
    os,
    is_new,
  });
  res.status(201).json(device);
};

const updateDevice = async (req, res) => {
  const { model, brand, release_date, os, is_new } = req.body;
  const device = await db.updateDevice(req.params.id, {
    model,
    brand,
    release_date,
    os,
    is_new,
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
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
};
