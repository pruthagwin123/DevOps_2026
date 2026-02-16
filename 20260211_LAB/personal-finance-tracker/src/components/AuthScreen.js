import { useState } from "react";

function AuthScreen({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) {
      return;
    }

    onSignIn({ email });
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>Personal Finance Tracker</h1>
        <p className="muted">
          Sign in to keep your budgets and transactions organized.
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Password
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button className="button primary" type="submit">
            Sign in
          </button>
        </form>
        <div className="auth-hint">
          This demo stores data locally in your browser.
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
