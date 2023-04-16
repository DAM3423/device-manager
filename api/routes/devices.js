const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/devices");
const {
  validateDevice,
  validateUUID,
  validatePagination,
} = require("../middleware/validation/devices");

router.post("/index", validatePagination, deviceController.getDevices);
router.get("/show/:id", validateUUID, deviceController.getDeviceById);
router.post("/create", validateDevice, deviceController.createDevice);
router.put("/update/:id", validateUUID, validateDevice, deviceController.updateDevice);
router.delete("/delete/:id", validateUUID, deviceController.deleteDevice);

module.exports = router;
