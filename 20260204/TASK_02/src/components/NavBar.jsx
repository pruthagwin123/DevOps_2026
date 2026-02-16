import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const getLinkStyle = ({ isActive }) => ({
    color: isActive ? "white" : "#666",
  });

  return (
    <nav>
      <NavLink to="/" style={getLinkStyle}>
        Dashboard
      </NavLink>
      <NavLink to="/courses" style={getLinkStyle}>
        Courses
      </NavLink>
      <NavLink to="/profile" style={getLinkStyle}>
        Profile
      </NavLink>
    </nav>
  );
}

export default NavBar;