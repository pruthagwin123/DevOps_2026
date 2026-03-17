const chartStore = {};

const lineChart = (canvasId, labels, datasets, options = {}) => {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  if (chartStore[canvasId]) chartStore[canvasId].destroy();

  chartStore[canvasId] = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      animation: { duration: 600 },
      scales: {
        x: { ticks: { color: "#9cc8d7" }, grid: { color: "rgba(0,212,255,0.12)" } },
        y: { ticks: { color: "#9cc8d7" }, grid: { color: "rgba(0,212,255,0.12)" } }
      },
      plugins: { legend: { labels: { color: "#dff8ff" } } },
      ...options
    }
  });

  return chartStore[canvasId];
};

const barChart = (canvasId, labels, datasets, options = {}) => {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  if (chartStore[canvasId]) chartStore[canvasId].destroy();

  chartStore[canvasId] = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      scales: {
        x: { ticks: { color: "#9cc8d7" }, grid: { color: "rgba(0,212,255,0.10)" } },
        y: { ticks: { color: "#9cc8d7" }, grid: { color: "rgba(0,212,255,0.10)" } }
      },
      plugins: { legend: { labels: { color: "#dff8ff" } } },
      ...options
    }
  });

  return chartStore[canvasId];
};

const areaChart = (canvasId, labels, data, color = "#00ff88") => {
  return lineChart(canvasId, labels, [
    {
      label: "Storage Level",
      data,
      tension: 0.3,
      borderColor: color,
      fill: true,
      backgroundColor: "rgba(0,255,136,0.18)",
      pointRadius: 0
    }
  ]);
};

const gaugeChart = (canvasId, value, max = 2) => {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  if (chartStore[canvasId]) chartStore[canvasId].destroy();

  const safeValue = Math.max(0, Math.min(value, max));
  chartStore[canvasId] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["SDI", "Remaining"],
      datasets: [
        {
          data: [safeValue, max - safeValue],
          backgroundColor: [safeValue > 1 ? "#00ff88" : "#ff4d6d", "rgba(0,212,255,0.14)"],
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      circumference: 180,
      rotation: 270,
      plugins: { legend: { display: false } }
    }
  });

  return chartStore[canvasId];
};
