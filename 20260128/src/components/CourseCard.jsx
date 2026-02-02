// CourseCard Component - Reusable component for displaying course information
// This demonstrates component reusability - used 4 times in App.jsx with different data

function CourseCard({ course }) {
  return (
    <article className="course-card">
      <div className="course-header">
        <h3>{course.title}</h3>
        <span className={`level-badge level-${course.level.toLowerCase()}`}>
          {course.level}
        </span>
      </div>
      
      <p className="course-description">{course.description}</p>
      
      <div className="course-meta">
        <div className="meta-item">
          <span className="meta-label">👨‍🏫 Instructor:</span>
          <span className="meta-value">{course.instructor}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">⏱️ Duration:</span>
          <span className="meta-value">{course.duration}</span>
        </div>
      </div>
      
      <button className="enroll-button">Enroll Now</button>
    </article>
  )
}

export default CourseCard
