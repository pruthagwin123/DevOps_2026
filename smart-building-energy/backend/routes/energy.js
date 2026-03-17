const express = require("express");
const multer = require("multer");
const { auth } = require("../middleware/auth");
const {
  getReadings,
  createReading,
  getReadingsByBuilding,
  deleteReading,
  uploadCsv,
  getForecast,
  getSchedule,
  getFinancial
} = require("../controllers/energyController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/readings", auth, getReadings);
router.post("/readings", auth, createReading);
router.get("/readings/:buildingId", auth, getReadingsByBuilding);
router.delete("/readings/:id", auth, deleteReading);

router.post("/upload", auth, upload.single("dataset"), uploadCsv);

router.get("/forecast", auth, getForecast);
router.get("/schedule", auth, getSchedule);
router.get("/financial", auth, getFinancial);

module.exports = router;
