const mongoose = require("mongoose");

const energyReadingSchema = new mongoose.Schema(
  {
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: "Building", required: true },
    timestamp: { type: Date, required: true },
    demandKwh: { type: Number, required: true, min: 0 },
    solarKwh: { type: Number, default: 0, min: 0 },
    windKwh: { type: Number, default: 0, min: 0 },
    gridImportKwh: { type: Number, default: 0, min: 0 },
    storageLevel: { type: Number, min: 0, max: 100, default: 50 },
    electricityCost: { type: Number, default: 0, min: 0 },
    isScheduled: { type: Boolean, default: true }
  },
  { timestamps: false }
);

energyReadingSchema.index({ buildingId: 1, timestamp: -1 });

module.exports = mongoose.model("EnergyReading", energyReadingSchema);
