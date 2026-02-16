import { useState } from "react";
import "./Courses.css";

function Courses() {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [filter, setFilter] = useState("all");

  const coursesData = [
    {
      id: 1,
      name: "Data Structures",
      instructor: "Dr. Amit Singh",
      progress: 85,
      status: "In Progress",
      color: "#3b82f6",
      icon: "🔧",
    },
    {
      id: 2,
      name: "Web Technologies",
      instructor: "Prof. Sarah",
      progress: 92,
      status: "In Progress",
      color: "#10b981",
      icon: "🌐",
    },
    {
      id: 3,
      name: "Database Management",
      instructor: "Dr. Rajesh Kumar",
      progress: 78,
      status: "In Progress",
      color: "#f59e0b",
      icon: "🗄️",
    },
    {
      id: 4,
      name: "Software Engineering",
      instructor: "Prof. Vikram",
      progress: 88,
      status: "Completed",
      color: "#ec4899",
      icon: "⚙️",
    },
  ];

  const filteredCourses =
    filter === "all" ? coursesData : coursesData.filter((c) => c.status === filter);

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>My Courses</h1>
        <p>Manage and track your enrolled courses</p>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Courses
        </button>
        <button
          className={`filter-btn ${filter === "In Progress" ? "active" : ""}`}
          onClick={() => setFilter("In Progress")}
        >
          In Progress
        </button>
        <button
          className={`filter-btn ${filter === "Completed" ? "active" : ""}`}
          onClick={() => setFilter("Completed")}
        >
          Completed
        </button>
      </div>

      <div className="courses-grid">
        {filteredCourses.map((course, index) => (
          <div
            key={course.id}
            className={`course-card ${expandedCourse === course.id ? "expanded" : ""} animate-in`}
            style={{
              "--course-color": course.color,
              animationDelay: `${index * 0.1}s`,
            }}
            onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
          >
            <div className="course-icon">{course.icon}</div>
            <h3>{course.name}</h3>
            <p className="instructor">by {course.instructor}</p>

            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
              </div>
              <span className="progress-text">{course.progress}%</span>
            </div>

            <span className={`status-badge ${course.status.toLowerCase().replace(" ", "-")}`}>
              {course.status}
            </span>

            {expandedCourse === course.id && (
              <div className="course-details">
                <p>📚 Continue learning and complete all assignments</p>
                <button className="course-btn">Go to Course</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;