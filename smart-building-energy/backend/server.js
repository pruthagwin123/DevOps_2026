const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "..", "public")));
app.use("/frontend", express.static(path.join(__dirname, "..", "frontend")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/energy", require("./routes/energy"));
app.use("/api/buildings", require("./routes/buildings"));
app.use("/api/contact", require("./routes/contact"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

const appPages = [
  "login",
  "register",
  "dashboard",
  "analytics",
  "forecast",
  "buildings",
  "financial",
  "contact",
  "about"
];

appPages.forEach((page) => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", `${page}.html`));
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
