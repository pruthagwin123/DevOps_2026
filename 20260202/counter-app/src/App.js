import React from "react";
import Counter from "./Counter";
import "./App.css";

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-brand">✨ <span>Beautiful Counter</span></div>
        <p className="app-subtitle">A simple, elegant counter — styled for presentation</p>
      </header>

      <main className="app-main">
        <Counter />
      </main>

      <footer className="app-footer">Made with ❤️ — Ready for demo</footer>
    </div>
  );
}

export default App;