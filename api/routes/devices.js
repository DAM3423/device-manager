const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/devices");
const { validateDevice } = require("../middleware/devices");

router.get("/", deviceController.getAllDevices);
router.get("/:id", deviceController.getDeviceById);
router.post("/", validateDevice, deviceController.createDevice);
router.put("/:id", validateDevice, deviceController.updateDevice);
router.delete("/:id", deviceController.deleteDevice);

module.exports = router;
