// Header Component - Reusable header for the application
function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>🚀 TechStart Academy</h1>
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#courses">Courses</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
