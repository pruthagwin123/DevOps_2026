import Header from './components/Header'
import WelcomeMessage from './components/WelcomeMessage'
import CourseCard from './components/CourseCard'
import './App.css'

function App() {
  // Static course data
  const courses = [
    {
      id: 1,
      title: 'React Fundamentals',
      description: 'Learn the basics of React, JSX, and functional components',
      instructor: 'Sarah Johnson',
      level: 'Beginner',
      duration: '4 weeks'
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      description: 'Master hooks, context API, and performance optimization',
      instructor: 'Michael Chen',
      level: 'Intermediate',
      duration: '6 weeks'
    },
    {
      id: 3,
      title: 'React with TypeScript',
      description: 'Build type-safe React applications with TypeScript',
      instructor: 'Emma Williams',
      level: 'Intermediate',
      duration: '5 weeks'
    },
    {
      id: 4,
      title: 'Full Stack React App',
      description: 'Build complete applications with React and Node.js',
      instructor: 'David Martinez',
      level: 'Advanced',
      duration: '8 weeks'
    }
  ]

  return (
    <div className="app">
      <Header />
      <WelcomeMessage />
      
      <main className="main-content">
        <section className="courses-section">
          <h2>Our Popular Courses</h2>
          <div className="courses-grid">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
