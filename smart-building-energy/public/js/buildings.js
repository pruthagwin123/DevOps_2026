const sampleBuildings = [
  { houseId: "H001", houseType: "Detached", facing: "South", region: "Zone-A", hvacTypes: ["Heat Pump", "Radiant"], coverage: "Urban" },
  { houseId: "H002", houseType: "Semi-Detached", facing: "South-East", region: "Zone-B", hvacTypes: ["Furnace", "Split AC"], coverage: "Suburban" },
  { houseId: "H003", houseType: "Townhouse", facing: "East", region: "Zone-C", hvacTypes: ["VRF", "Ventilation"], coverage: "Urban" },
  { houseId: "H004", houseType: "Apartment", facing: "West", region: "Zone-D", hvacTypes: ["Fan Coil", "Chiller"], coverage: "Dense" },
  { houseId: "H005", houseType: "Villa", facing: "South-West", region: "Zone-E", hvacTypes: ["Geothermal", "ERV"], coverage: "Rural" }
];

const chartForBuilding = (canvasId) => {
  const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const data = labels.map((_, i) => Number((13 + Math.sin(i / 3) * 4 + Math.random() * 2).toFixed(2)));
  lineChart(canvasId, labels, [{ label: "Energy Consumption", data, borderColor: "#00d4ff", tension: 0.3, pointRadius: 0 }]);
};

const buildingCard = (b) => {
  const id = `chart-${b._id || b.houseId}`;
  return `
    <div class="card">
      <h3>${b.houseId} - ${b.houseType}</h3>
      <p class="muted">Facing: ${b.facing}</p>
      <p class="muted">Region: ${b.region}</p>
      <p class="muted">HVAC: ${(b.hvacTypes || []).join(", ")}</p>
      <p class="muted">Coverage: ${b.coverage}</p>
      <div style="height:160px"><canvas id="${id}"></canvas></div>
      <div class="inline" style="margin-top:8px">
        <button class="btn btn-secondary" data-edit="${b._id}">Edit</button>
        <button class="btn" style="background:#ff4d6d;color:#fff" data-delete="${b._id}">Delete</button>
      </div>
    </div>
  `;
};

const loadBuildings = async () => {
  const res = await authFetch("/api/buildings");
  const buildings = await res.json();
  const wrap = document.getElementById("building-list");
  wrap.innerHTML = buildings.map(buildingCard).join("");

  buildings.forEach((b) => chartForBuilding(`chart-${b._id || b.houseId}`));

  document.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await authFetch(`/api/buildings/${btn.dataset.delete}`, { method: "DELETE" });
      showToast("Building deleted");
      loadBuildings();
    });
  });

  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const building = buildings.find((b) => b._id === btn.dataset.edit);
      if (!building) return;
      document.getElementById("building-id").value = building._id;
      document.getElementById("houseId").value = building.houseId;
      document.getElementById("houseType").value = building.houseType;
      document.getElementById("facing").value = building.facing;
      document.getElementById("region").value = building.region;
      document.getElementById("hvacTypes").value = (building.hvacTypes || []).join(", ");
      document.getElementById("coverage").value = building.coverage;
    });
  });
};

const saveBuilding = async (event) => {
  event.preventDefault();
  const id = document.getElementById("building-id").value;
  const payload = {
    houseId: document.getElementById("houseId").value,
    houseType: document.getElementById("houseType").value,
    facing: document.getElementById("facing").value,
    region: document.getElementById("region").value,
    hvacTypes: document.getElementById("hvacTypes").value.split(",").map((v) => v.trim()).filter(Boolean),
    coverage: document.getElementById("coverage").value
  };

  const method = id ? "PUT" : "POST";
  const endpoint = id ? `/api/buildings/${id}` : "/api/buildings";
  const res = await authFetch(endpoint, { method, body: JSON.stringify(payload) });
  if (!res.ok) {
    const err = await res.json();
    return showToast(err.message || "Failed to save", "error");
  }

  showToast(id ? "Building updated" : "Building added");
  event.target.reset();
  document.getElementById("building-id").value = "";
  loadBuildings();
};

const seedDefaults = async () => {
  const res = await authFetch("/api/buildings");
  const current = await res.json();
  if (current.length) return;

  for (const b of sampleBuildings) {
    await authFetch("/api/buildings", { method: "POST", body: JSON.stringify(b) });
  }
  showToast("Default building dataset loaded");
};

const initBuildings = async () => {
  requireAuth();
  attachLogout();
  setActiveSidebar();
  await seedDefaults();
  await loadBuildings();

  document.getElementById("building-form").addEventListener("submit", saveBuilding);
};

document.addEventListener("DOMContentLoaded", initBuildings);
