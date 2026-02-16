import { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);

  const stats = [
    { id: 1, label: "Attendance", value: "92%", icon: "📊", color: "#3b82f6" },
    { id: 2, label: "Assignments", value: "18/20", icon: "✅", color: "#10b981" },
    { id: 3, label: "Current GPA", value: "8.5", icon: "⭐", color: "#f59e0b" },
  ];

  useEffect(() => {
    setAnimateStats(true);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your academic performance</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className={`stat-card ${hoveredCard === stat.id ? "hovered" : ""} ${animateStats ? "animate-in" : ""}`}
            style={{
              "--card-color": stat.color,
              animationDelay: `${index * 0.1}s`,
            }}
            onMouseEnter={() => setHoveredCard(stat.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="performance-section">
        <h2>Performance Metrics</h2>
        <div className="metrics-container">
          <div className="metric">
            <div className="metric-bar">
              <div className="metric-progress" style={{ width: "92%" }}></div>
            </div>
            <span className="metric-label">Attendance</span>
          </div>
          <div className="metric">
            <div className="metric-bar">
              <div className="metric-progress" style={{ width: "90%" }}></div>
            </div>
            <span className="metric-label">Assignments</span>
          </div>
          <div className="metric">
            <div className="metric-bar">
              <div className="metric-progress" style={{ width: "85%" }}></div>
            </div>
            <span className="metric-label">GPA Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;