const express = require("express");
const { auth } = require("../middleware/auth");
const Building = require("../models/Building");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const buildings = await Building.find().sort({ createdAt: -1 });
    return res.json(buildings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch buildings", error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const payload = {
      houseId: req.body.houseId,
      houseType: req.body.houseType,
      facing: req.body.facing,
      region: req.body.region,
      hvacTypes: req.body.hvacTypes || [],
      coverage: req.body.coverage,
      createdBy: req.user._id
    };

    const building = await Building.create(payload);
    return res.status(201).json(building);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add building", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Building.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: "Building not found" });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update building", error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Building.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Building not found" });
    return res.json({ message: "Building deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete building", error: error.message });
  }
});

module.exports = router;
