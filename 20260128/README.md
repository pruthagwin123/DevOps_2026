# React Dashboard Project - Complete Example

This is a fully functional React dashboard project that demonstrates all concepts from the assignment.

## 📁 Project Structure

```
startup-dashboard/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx            # React app entry point
│   ├── App.jsx             # Main App component
│   ├── App.css             # Global styles
│   ├── index.css           # Base styles
│   └── components/
│       ├── Header.jsx      # Header component
│       ├── WelcomeMessage.jsx  # Welcome section
│       └── CourseCard.jsx   # Reusable course card
```

## 🚀 Setup Instructions

### Using Vite (Recommended)
```bash
# 1. Navigate to project directory
cd c:\Devops2026\20260128

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:3000
```

### Alternative: Using Create React App
```bash
npx create-react-app startup-dashboard
cd startup-dashboard
npm start
```

## 📋 Assignment Answers Map

| Question | File | Key Code |
|----------|------|----------|
| Q1: Setup | vite.config.js, package.json | Vite configuration for fast builds |
| Q2: package.json | package.json | Contains dependencies, scripts, metadata |
| Q3: Functional Component | src/components/*.jsx | All components are functional components |
| Q4: Component Rendering | src/App.jsx | Shows how components are composed and rendered |
| Q5: Reusable Components | CourseCard.jsx | Used 4 times in App.jsx with different props |

## 🔑 Key Concepts Demonstrated

### 1. **Functional Components** (Q3)
```jsx
function WelcomeMessage() {
  return <h1>Welcome!</h1>
}
```

### 2. **Props and Reusability** (Q3, Q5)
```jsx
// Reusable CourseCard - used 4 times with different data
<CourseCard key={course.id} course={course} />
```

### 3. **Component Composition** (Q4)
```jsx
// App.jsx composes Header, WelcomeMessage, and CourseCard
<Header />
<WelcomeMessage />
<CourseCard course={course} />
```

### 4. **JSX Rendering**
- HTML-like syntax in JavaScript
- Dynamic content with `{}`
- Conditional rendering with `.map()`

## 💻 Running the Project

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Features

✅ Static welcome message  
✅ Static course information  
✅ Reusable course card component  
✅ Responsive grid layout  
✅ Professional styling  
✅ Navigation header  
✅ Call-to-action buttons  

## 📚 Learning Outcomes

After completing this project, you'll understand:

1. ✓ How to set up React projects with Vite
2. ✓ Role of package.json in managing dependencies
3. ✓ Creating functional components with JSX
4. ✓ Composing components in App.jsx
5. ✓ Benefits of component reusability
6. ✓ Props for passing data to components
7. ✓ CSS styling and responsive design
8. ✓ Component organization best practices

## 🔧 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool (ultra-fast)
- **CSS3** - Styling with flexbox and grid
- **JSX** - JavaScript XML syntax

## 📝 Next Steps

To extend this project:

1. Add React Router for navigation
2. Implement useState hook for dynamic data
3. Add form handling for enrollment
4. Connect to a backend API
5. Add filtering/search functionality
6. Implement dark mode toggle
