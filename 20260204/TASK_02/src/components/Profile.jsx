import { useState } from "react";
import "./Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Rahul Kumar",
    email: "rahul@student.edu",
    department: "Computer Science",
    rollNumber: "CS21001",
    semester: "5th",
    phone: "+91 98765 43210",
  });

  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>RK</span>
        </div>
        <div className="profile-intro">
          <h1>{profileData.name}</h1>
          <p>{profileData.department}</p>
        </div>
      </div>

      <div className="profile-content">
        <button
          className={`edit-btn ${isEditing ? "cancel" : ""}`}
          onClick={() => {
            setIsEditing(!isEditing);
            setEditData(profileData);
          }}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>

        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={editData.department}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                value={editData.rollNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Semester</label>
              <input
                type="text"
                name="semester"
                value={editData.semester}
                onChange={handleChange}
              />
            </div>
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        ) : (
          <div className="profile-details">
            <div className="detail-card">
              <span className="detail-icon">👤</span>
              <div>
                <p className="detail-label">Full Name</p>
                <p className="detail-value">{profileData.name}</p>
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-icon">📧</span>
              <div>
                <p className="detail-label">Email Address</p>
                <p className="detail-value">{profileData.email}</p>
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-icon">📱</span>
              <div>
                <p className="detail-label">Phone</p>
                <p className="detail-value">{profileData.phone}</p>
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-icon">🏢</span>
              <div>
                <p className="detail-label">Department</p>
                <p className="detail-value">{profileData.department}</p>
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-icon">🎓</span>
              <div>
                <p className="detail-label">Roll Number</p>
                <p className="detail-value">{profileData.rollNumber}</p>
              </div>
            </div>
            <div className="detail-card">
              <span className="detail-icon">📚</span>
              <div>
                <p className="detail-label">Semester</p>
                <p className="detail-value">{profileData.semester}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;