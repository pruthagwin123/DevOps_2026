const ContactMessage = require("../models/ContactMessage");

const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const doc = await ContactMessage.create({ name, email, subject, message });
    return res.status(201).json({ message: "Message submitted successfully", data: doc });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit message", error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};

module.exports = { createMessage, getMessages };
