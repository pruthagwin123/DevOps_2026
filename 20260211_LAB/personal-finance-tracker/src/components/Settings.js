import { useEffect, useState } from "react";

function Settings({ user, onUpdateUser, onResetDemo }) {
  const [formState, setFormState] = useState({
    name: user.name || "",
    currency: user.currency || "INR",
    theme: user.theme || "sunrise"
  });

  useEffect(() => {
    setFormState({
      name: user.name || "",
      currency: user.currency || "INR",
      theme: user.theme || "sunrise"
    });
  }, [user]);

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateUser(formState);
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Settings</h2>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>Profile</h3>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Display name
              <input
                className="input"
                type="text"
                value={formState.name}
                onChange={handleChange("name")}
              />
            </label>
            <label>
              Currency
              <select
                className="input"
                value={formState.currency}
                onChange={handleChange("currency")}
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </label>
            <label>
              Theme
              <select
                className="input"
                value={formState.theme}
                onChange={handleChange("theme")}
              >
                <option value="sunrise">Sunrise</option>
                <option value="ocean">Ocean</option>
              </select>
            </label>
            <button className="button primary" type="submit">
              Save settings
            </button>
          </form>
        </div>
        <div className="card">
          <h3>Demo data</h3>
          <p className="muted">
            Reset the dashboard to the default demo data. This replaces your
            current local data.
          </p>
          <button
            className="button"
            type="button"
            onClick={onResetDemo}
          >
            Reset demo data
          </button>
        </div>
      </div>
    </section>
  );
}

export default Settings;
