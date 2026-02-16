function Onboarding({
  hasAccounts,
  hasCategories,
  hasTransactions,
  onNavigate
}) {
  const steps = [];

  if (!hasAccounts) {
    steps.push({
      id: "accounts",
      title: "Add your first account",
      action: "Go to Accounts"
    });
  }

  if (!hasCategories) {
    steps.push({
      id: "accounts",
      title: "Create income and expense categories",
      action: "Add categories"
    });
  }

  if (!hasTransactions) {
    steps.push({
      id: "transactions",
      title: "Log your first transaction",
      action: "Add transaction"
    });
  }

  if (!steps.length) {
    return null;
  }

  return (
    <div className="card onboarding">
      <h3>Welcome! Let us get you started.</h3>
      <p className="muted">
        Finish the setup steps below to unlock the full dashboard insights.
      </p>
      <div className="onboarding-steps">
        {steps.map((step, index) => (
          <div className="onboarding-step" key={step.title}>
            <div className="pill">Step {index + 1}</div>
            <div className="onboarding-content">
              <div className="list-title">{step.title}</div>
              <button
                className="button"
                type="button"
                onClick={() => onNavigate(step.id)}
              >
                {step.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Onboarding;
