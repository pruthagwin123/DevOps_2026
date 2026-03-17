const express = require("express");
const { createMessage, getMessages } = require("../controllers/contactController");
const { auth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", createMessage);
router.get("/", auth, requireAdmin, getMessages);

module.exports = router;
