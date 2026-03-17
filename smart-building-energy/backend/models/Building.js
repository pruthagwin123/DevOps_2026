const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema(
  {
    houseId: { type: String, required: true, unique: true, trim: true },
    houseType: { type: String, required: true, trim: true },
    facing: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    hvacTypes: [{ type: String, trim: true }],
    coverage: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Building", buildingSchema);
