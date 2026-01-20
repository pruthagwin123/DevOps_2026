const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || "sqlite",
  storage: process.env.DB_STORAGE || "./database.sqlite",
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
});

module.exports = sequelize;
