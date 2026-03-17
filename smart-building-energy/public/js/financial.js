const getScenarioLabel = (scenario) =>
  scenario === "with_wind" ? "Solar PV + Wind Turbine + Storage" : "Solar PV + Storage";

const renderFinancial = async () => {
  const scenario = document.getElementById("scenario").value;
  const discountRate = document.getElementById("discountRate").value;
  const om = document.getElementById("om").value;
  const tariff = document.getElementById("tariff").value;

  const query = new URLSearchParams({ scenario, discountRate, om, tariff });
  const res = await authFetch(`/api/energy/financial?${query.toString()}`);
  const payload = await res.json();

  document.getElementById("scenario-title").textContent = getScenarioLabel(payload.scenario);
  document.getElementById("breakeven").textContent = `${payload.breakevenYear} years`;
  document.getElementById("capex").textContent = `$${payload.capex.toLocaleString()}`;

  lineChart(
    "npvChart",
    payload.cashflow.map((p) => p.year),
    [
      {
        label: "NPV",
        data: payload.cashflow.map((p) => p.npv),
        borderColor: "#00ff88",
        pointRadius: 0,
        tension: 0.25
      }
    ],
    {
      scales: {
        y: { ticks: { color: "#9cc8d7" }, grid: { color: "rgba(0,212,255,0.12)" } },
        x: { ticks: { color: "#9cc8d7" }, grid: { color: "rgba(0,212,255,0.12)" } }
      }
    }
  );

  const t9 = document.getElementById("table9");
  t9.innerHTML = `<tr><td>Scheduled Tariff</td><td>${payload.table9.scheduledTariff}</td></tr>
                  <tr><td>Non-Scheduled Tariff</td><td>${payload.table9.nonScheduledTariff}</td></tr>
                  <tr><td>Cost Reduction</td><td>${(payload.table9.reductionRate * 100).toFixed(2)}%</td></tr>`;

  const t10 = document.getElementById("table10");
  t10.innerHTML = `<tr><td>Grid Reduction</td><td>${(payload.table10.gridReduction * 100).toFixed(2)}%</td></tr>
                   <tr><td>System Efficiency</td><td>${(payload.table10.systemEfficiency * 100).toFixed(2)}%</td></tr>
                   <tr><td>Storage Capacity</td><td>40.5 kWh</td></tr>`;
};

const initFinancial = async () => {
  requireAuth();
  attachLogout();
  setActiveSidebar();

  ["scenario", "discountRate", "om", "tariff"].forEach((id) => {
    document.getElementById(id).addEventListener("change", renderFinancial);
    document.getElementById(id).addEventListener("input", renderFinancial);
  });

  await renderFinancial();
};

document.addEventListener("DOMContentLoaded", initFinancial);
