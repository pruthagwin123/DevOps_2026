let demandHistory = [];
let solarHistory = [];
let windHistory = [];
let gridHistory = [];
let storageHistory = [];
let labels = [];

const kpiMap = {
  demand: document.getElementById("kpi-demand"),
  solar: document.getElementById("kpi-solar"),
  wind: document.getElementById("kpi-wind"),
  grid: document.getElementById("kpi-grid"),
  storage: document.getElementById("kpi-storage"),
  cost: document.getElementById("kpi-cost")
};

const updateKpis = (latest) => {
  if (!latest) return;
  kpiMap.demand.textContent = `${latest.demandKwh.toFixed(2)} kWh`;
  kpiMap.solar.textContent = `${latest.solarKwh.toFixed(2)} kWh`;
  kpiMap.wind.textContent = `${latest.windKwh.toFixed(2)} kWh`;
  kpiMap.grid.textContent = `${latest.gridImportKwh.toFixed(2)} kWh`;
  kpiMap.storage.textContent = `${latest.storageLevel.toFixed(1)} %`;
  kpiMap.cost.textContent = `$${latest.electricityCost.toFixed(2)}`;
};

const renderDashboardCharts = () => {
  lineChart("realtimeChart", labels, [
    { label: "Demand", data: demandHistory, borderColor: "#00d4ff", tension: 0.35, pointRadius: 0 },
    { label: "Solar", data: solarHistory, borderColor: "#00ff88", tension: 0.35, pointRadius: 0 },
    { label: "Wind", data: windHistory, borderColor: "#ffd166", tension: 0.35, pointRadius: 0 },
    { label: "Grid Import", data: gridHistory, borderColor: "#ff4d6d", tension: 0.35, pointRadius: 0 }
  ]);

  const latestDemand = demandHistory[demandHistory.length - 1] || 1;
  const latestSupply = (solarHistory[solarHistory.length - 1] || 0) + (windHistory[windHistory.length - 1] || 0);
  const sdi = Number((latestSupply / latestDemand).toFixed(2));
  gaugeChart("sdiChart", sdi, 2);
  const sdiEl = document.getElementById("sdi-value");
  sdiEl.textContent = sdi.toFixed(2);
  sdiEl.style.color = sdi > 1 ? "#00ff88" : "#ff4d6d";

  areaChart("storageChart", labels, storageHistory);

  const scheduled = gridHistory.reduce((s, v) => s + v * 0.0941, 0);
  const nonScheduled = gridHistory.reduce((s, v) => s + v * 0.141, 0);
  barChart("costChart", ["Scheduled ($0.0941/kWh)", "Non-Scheduled ($0.141/kWh)"], [
    {
      label: "Electricity Cost",
      data: [Number(scheduled.toFixed(2)), Number(nonScheduled.toFixed(2))],
      backgroundColor: ["rgba(0,255,136,0.6)", "rgba(255,77,109,0.7)"]
    }
  ]);
};

const renderSchedulePanel = (schedule) => {
  document.getElementById("peak-days").textContent = schedule.peakDays.join(", ") || "No peak days";
  document.getElementById("saved-kwh").textContent = `${schedule.estimatedSavedKwh} kWh`;
  document.getElementById("threshold").textContent = `${schedule.threshold} kWh`;
};

const applySavingMode = (enabled) => {
  if (!enabled) return;
  demandHistory = demandHistory.map((v) => Number((v * 0.9).toFixed(2)));
  renderDashboardCharts();
};

const loadDashboardData = async () => {
  const [readingsRes, scheduleRes] = await Promise.all([
    authFetch("/api/energy/readings?limit=24"),
    authFetch("/api/energy/schedule")
  ]);

  const readings = await readingsRes.json();
  const schedule = await scheduleRes.json();

  labels = readings.map((r) => new Date(r.timestamp).getHours().toString().padStart(2, "0") + ":00");
  demandHistory = readings.map((r) => r.demandKwh);
  solarHistory = readings.map((r) => r.solarKwh);
  windHistory = readings.map((r) => r.windKwh);
  gridHistory = readings.map((r) => r.gridImportKwh);
  storageHistory = readings.map((r) => r.storageLevel);

  updateKpis(readings[readings.length - 1]);
  renderDashboardCharts();
  renderSchedulePanel(schedule);
};

const simulateTick = async () => {
  const latestIdx = demandHistory.length - 1;
  if (latestIdx < 0) return;

  const demand = Math.max(8, demandHistory[latestIdx] + (Math.random() - 0.4) * 1.8);
  const solar = Math.max(0, solarHistory[latestIdx] + (Math.random() - 0.5) * 0.8);
  const wind = Math.max(0, windHistory[latestIdx] + (Math.random() - 0.5) * 0.7);
  const grid = Math.max(0, demand - (solar + wind));
  const storage = Math.max(0, Math.min(100, storageHistory[latestIdx] + (solar + wind - demand) * 0.6));

  demandHistory.push(Number(demand.toFixed(2)));
  solarHistory.push(Number(solar.toFixed(2)));
  windHistory.push(Number(wind.toFixed(2)));
  gridHistory.push(Number(grid.toFixed(2)));
  storageHistory.push(Number(storage.toFixed(2)));

  labels.push(new Date().getHours().toString().padStart(2, "0") + ":00");

  if (labels.length > 24) {
    [labels, demandHistory, solarHistory, windHistory, gridHistory, storageHistory].forEach((arr) => arr.shift());
  }

  updateKpis({
    demandKwh: demand,
    solarKwh: solar,
    windKwh: wind,
    gridImportKwh: grid,
    storageLevel: storage,
    electricityCost: grid * 0.0941
  });

  renderDashboardCharts();
};

const initDashboard = async () => {
  requireAuth();
  attachLogout();
  setActiveSidebar();

  try {
    await loadDashboardData();
    setInterval(simulateTick, 5000);
  } catch (error) {
    showToast("Failed to load dashboard data", "error");
  }

  const strategyToggle = document.getElementById("strategy-toggle");
  strategyToggle.addEventListener("change", () => {
    applySavingMode(strategyToggle.checked);
    showToast(strategyToggle.checked ? "Energy saving mode ON (10% demand cut)" : "Energy saving mode OFF");
  });
};

document.addEventListener("DOMContentLoaded", initDashboard);
