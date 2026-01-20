const sequelize = require("../../config/db");
const User = require("./user");
const Course = require("./course");
const Enrollment = require("./enrollment");

// Define associations
User.hasMany(Enrollment, { foreignKey: "userId" });
Course.hasMany(Enrollment, { foreignKey: "courseId" });

Enrollment.belongsTo(User, { foreignKey: "userId" });
Enrollment.belongsTo(Course, { foreignKey: "courseId" });

User.belongsToMany(Course, { through: Enrollment, foreignKey: "userId" });
Course.belongsToMany(User, { through: Enrollment, foreignKey: "courseId" });

module.exports = {
  sequelize,
  User,
  Course,
  Enrollment,
};
