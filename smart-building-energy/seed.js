require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./backend/config/db");
const User = require("./backend/models/User");
const Building = require("./backend/models/Building");
const EnergyReading = require("./backend/models/EnergyReading");
const ContactMessage = require("./backend/models/ContactMessage");

const START_DATE = new Date("2019-01-01T00:00:00.000Z");
const HOURS_IN_YEAR = 365 * 24;

const createEnergyPattern = (hourIndex) => {
  const timestamp = new Date(START_DATE);
  timestamp.setHours(START_DATE.getHours() + hourIndex);

  const month = timestamp.getUTCMonth();
  const hour = timestamp.getUTCHours();

  const seasonalFactor = 1 + Math.sin(((month + 1) / 12) * Math.PI * 2) * 0.22;
  const daytime = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));

  const demandKwh = 14 + daytime * 7 + seasonalFactor * 4 + (Math.random() - 0.5) * 2.2;
  const solarKwh = Math.max(0, daytime * (6.8 + Math.random() * 1.7) * (1 - month / 22));
  const windKwh = Math.max(0.4, 2.4 + Math.sin(hour / 4) * 1.5 + Math.random() * 1.2);

  const gridImportKwh = Math.max(0, demandKwh - solarKwh - windKwh);
  const isScheduled = demandKwh <= 22.1918;
  const tariff = isScheduled ? 0.0941 : 0.141;

  const storageKwh = Math.max(0, Math.min(40.5, 18 + (solarKwh + windKwh - demandKwh) * 0.9 + Math.random() * 1.8));

  return {
    timestamp,
    demandKwh: Number(demandKwh.toFixed(3)),
    solarKwh: Number(solarKwh.toFixed(3)),
    windKwh: Number(windKwh.toFixed(3)),
    gridImportKwh: Number(gridImportKwh.toFixed(3)),
    storageLevel: Number(((storageKwh / 40.5) * 100).toFixed(2)),
    electricityCost: Number((gridImportKwh * tariff).toFixed(4)),
    isScheduled
  };
};

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Building.deleteMany({}),
      EnergyReading.deleteMany({}),
      ContactMessage.deleteMany({})
    ]);

    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@sbes.local",
        password: await bcrypt.hash("Admin@123", 10),
        role: "admin"
      },
      {
        name: "Demo User",
        email: "user@sbes.local",
        password: await bcrypt.hash("User@1234", 10),
        role: "user"
      }
    ]);

    const createdBy = users[0]._id;

    const buildings = await Building.insertMany([
      { houseId: "H001", houseType: "Detached", facing: "South", region: "Region-1", hvacTypes: ["Heat Pump", "Radiant Floor"], coverage: "Urban", createdBy },
      { houseId: "H002", houseType: "Semi-Detached", facing: "South-East", region: "Region-2", hvacTypes: ["Split AC", "Gas Furnace"], coverage: "Suburban", createdBy },
      { houseId: "H003", houseType: "Townhouse", facing: "East", region: "Region-3", hvacTypes: ["VRF", "ERV"], coverage: "Urban", createdBy },
      { houseId: "H004", houseType: "Apartment", facing: "West", region: "Region-4", hvacTypes: ["Fan Coil", "Chiller"], coverage: "Dense", createdBy },
      { houseId: "H005", houseType: "Villa", facing: "South-West", region: "Region-5", hvacTypes: ["Geothermal", "Smart Ventilation"], coverage: "Rural", createdBy }
    ]);

    const readings = [];
    for (let i = 0; i < HOURS_IN_YEAR; i += 1) {
      const pattern = createEnergyPattern(i);
      const building = buildings[i % buildings.length];
      readings.push({
        buildingId: building._id,
        ...pattern
      });
    }

    await EnergyReading.insertMany(readings, { ordered: false });

    console.log("Seed complete:");
    console.log("Users: 2 (admin + regular)");
    console.log("Buildings: 5");
    console.log(`Energy readings: ${readings.length}`);
    console.log("Admin login: admin@sbes.local / Admin@123");
    console.log("User login: user@sbes.local / User@1234");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
