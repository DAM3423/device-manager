const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/devices");
const {
  validateDevice,
  validateUUID,
} = require("../middleware/validation/devices");

router.get("/", deviceController.getDevices);
router.get("/:id", validateUUID, deviceController.getDeviceById);
router.post("/", validateDevice, deviceController.createDevice);
router.put("/:id", validateUUID, validateDevice, deviceController.updateDevice);
router.delete("/:id", validateUUID, deviceController.deleteDevice);

module.exports = router;
