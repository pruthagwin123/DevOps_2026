const { Course, User } = require("../models");

exports.createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};

exports.getCourses = async (req, res) => {
  const courses = await Course.findAll({ order: [["createdAt", "DESC"]] });
  res.json(courses);
};

exports.getCourseById = async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [{ model: User, through: { attributes: ["enrolledAt", "progress"] } }],
  });

  if (!course) {
    const e = new Error("Course not found");
    e.statusCode = 404;
    throw e;
  }

  res.json(course);
};

exports.updateCourse = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  await course.update(req.body);
  res.json(course);
};

exports.deleteCourse = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  await course.destroy();
  res.status(204).send();
};
