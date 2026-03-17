const modelRows = [
  { model: "LSTM", rmse: 0.147, mse: 0.02185, mape: "5.41%", r2: 0.89 },
  { model: "DWT-LSTM", rmse: 0.06715, mse: 0.010543, mape: "3.63%", r2: 0.99 }
];

const fillPerformanceTable = () => {
  const body = document.getElementById("model-table-body");
  body.innerHTML = "";
  modelRows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.model}</td><td>${row.rmse}</td><td>${row.mse}</td><td>${row.mape}</td><td>${row.r2}</td>`;
    body.appendChild(tr);
  });
};

const loadForecast = async () => {
  const type = document.getElementById("forecast-type").value;
  const horizon = document.getElementById("horizon").value;
  const temperature = document.getElementById("temperature").value;
  const cloudCover = document.getElementById("cloudCover").value;
  const windSpeed = document.getElementById("windSpeed").value;

  const query = new URLSearchParams({ type, horizon, temperature, cloudCover, windSpeed });
  const res = await authFetch(`/api/energy/forecast?${query.toString()}`);
  const payload = await res.json();

  const labels = payload.forecast.map((f, i) => (horizon === "hourly" ? i + 1 : new Date(f.timestamp).toLocaleDateString()));
  lineChart("forecastChart", labels, [
    {
      label: "Observed",
      data: payload.forecast.map((f) => f.observed),
      borderColor: "#ffd166",
      pointRadius: 0,
      tension: 0.25
    },
    {
      label: "LSTM",
      data: payload.forecast.map((f) => f.lstm),
      borderColor: "#00d4ff",
      pointRadius: 0,
      tension: 0.25
    },
    {
      label: "DWT-LSTM",
      data: payload.forecast.map((f) => f.dwtLstm),
      borderColor: "#00ff88",
      pointRadius: 0,
      tension: 0.25
    }
  ]);
};

const initForecast = async () => {
  requireAuth();
  attachLogout();
  setActiveSidebar();
  fillPerformanceTable();

  const controls = ["forecast-type", "horizon", "temperature", "cloudCover", "windSpeed"];
  controls.forEach((id) => {
    document.getElementById(id).addEventListener("input", loadForecast);
    document.getElementById(id).addEventListener("change", loadForecast);
  });

  await loadForecast();
};

document.addEventListener("DOMContentLoaded", initForecast);
