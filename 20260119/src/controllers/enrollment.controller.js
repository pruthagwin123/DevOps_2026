const { sequelize, Enrollment, Course, User } = require("../models");

// Enroll user into course (transaction + uniqueness)
exports.enroll = async (req, res) => {
  const { courseId, userId } = req.body;

  const enrollment = await sequelize.transaction(async (t) => {
    const course = await Course.findByPk(courseId, { transaction: t });
    if (!course) {
      const e = new Error("Course not found");
      e.statusCode = 404;
      throw e;
    }

    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      const e = new Error("User not found");
      e.statusCode = 404;
      throw e;
    }

    return await Enrollment.create({ courseId, userId }, { transaction: t });
  });

  res.status(201).json(enrollment);
};

exports.getEnrollments = async (req, res) => {
  const enrollments = await Enrollment.findAll();
  res.json(enrollments);
};

exports.updateEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findByPk(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }
  await enrollment.update(req.body);
  res.json(enrollment);
};

exports.deleteEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findByPk(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ message: "Enrollment not found" });
  }
  await enrollment.destroy();
  res.status(204).send();
};
