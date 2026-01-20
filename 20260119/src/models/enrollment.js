const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Enrollment = sequelize.define("Enrollment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  enrolledAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Enrollment;
