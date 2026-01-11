// Simple in-memory store (resets on refresh)
let surveyData = []; // { ward, status }

let wardChart;

// --- LOGIN LOGIC ---

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pwd = document.getElementById("password").value.trim();

    if (pwd === "asha123") {
      // For real app, use proper auth
      window.location.href = "survey.html";
    } else {
      alert("Invalid credentials. Hint: password is asha123 for demo.");
    }
  });
}

// --- LOGOUT ---

function logout() {
  window.location.href = "index.html";
}
window.logout = logout;

// --- SURVEY + ANALYSIS LOGIC ---

const surveyForm = document.getElementById("surveyForm");

if (surveyForm) {
  surveyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSurveySubmit();
  });

  initChart();
}

function handleSurveySubmit() {
  const ward = parseInt(document.getElementById("wardNo").value, 10);
  const childId = document.getElementById("childId").value.trim();
  const ageMonths = parseFloat(document.getElementById("ageMonths").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const muac = parseFloat(document.getElementById("muac").value);
  const illness = document.getElementById("illness").value;
  const immunized = document.getElementById("immunized").value;
  const mealsPerDay = parseFloat(document.getElementById("mealsPerDay").value);
  const dietGroups = parseFloat(document.getElementById("dietGroups").value);

  const status = classifyChild({ ageMonths, weight, height, muac, illness, immunized, mealsPerDay, dietGroups });

  updateChildStatusUI(childId, status);

  // store for ward-level stats
  surveyData.push({ ward, status });
  updateWardChart();
  updateHotspotsTable();

  surveyForm.reset();
}

// Very simple rule-based classification, can be replaced by ML later
function classifyChild(data) {
  const { muac, mealsPerDay, dietGroups, illness, immunized } = data;

  let score = 0;

  // MUAC
  if (muac < 11.5) score += 3;        // severe
  else if (muac < 12.5) score += 2;   // moderate
  else if (muac < 13.5) score += 1;   // mild

  // Meal frequency
  if (mealsPerDay <= 2) score += 2;
  else if (mealsPerDay === 3) score += 1;

  // Diet diversity
  if (dietGroups <= 2) score += 2;
  else if (dietGroups <= 4) score += 1;

  // Illness & immunization
  if (illness === "yes") score += 1;
  if (immunized === "no") score += 1;

  if (score >= 6) return "Severely Malnourished";
  if (score >= 4) return "At Risk";
  if (score >= 2) return "Borderline";
  return "Nourished";
}

function updateChildStatusUI(childId, status) {
  const statusDiv = document.getElementById("childStatus");
  const statusText = document.getElementById("statusText");

  statusDiv.classList.remove("neutral", "good", "risk", "bad");

  let css = "good";
  if (status === "At Risk" || status === "Borderline") css = "risk";
  if (status === "Severely Malnourished") css = "bad";

  statusDiv.classList.add(css);
  statusText.textContent = `Child ${childId} is classified as: ${status}`;
}

// --- CHART + HOTSPOTS ---

function initChart() {
  const ctx = document.getElementById("wardChart").getContext("2d");
  wardChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Nourished",
          backgroundColor: "rgba(34,197,94,0.7)",
          data: []
        },
        {
          label: "At Risk / Malnourished",
          backgroundColor: "rgba(239,68,68,0.7)",
          data: []
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: false }
      },
      scales: {
        x: { title: { display: true, text: "Ward" } },
        y: { title: { display: true, text: "Number of children" }, beginAtZero: true }
      }
    }
  });
}

function updateWardChart() {
  const wardMap = {}; // ward -> { good, bad }

  surveyData.forEach(({ ward, status }) => {
    if (!wardMap[ward]) wardMap[ward] = { good: 0, bad: 0 };
    if (status === "Nourished") wardMap[ward].good += 1;
    else wardMap[ward].bad += 1;
  });

  const labels = Object.keys(wardMap).sort((a, b) => a - b);
  const nourished = labels.map(w => wardMap[w].good);
  const atRisk = labels.map(w => wardMap[w].bad);

  wardChart.data.labels = labels;
  wardChart.data.datasets[0].data = nourished;
  wardChart.data.datasets[1].data = atRisk;
  wardChart.update();
}

function updateHotspotsTable() {
  const body = document.getElementById("hotspotBody");
  body.innerHTML = "";

  const wardStats = {}; // ward -> { total, bad }

  surveyData.forEach(({ ward, status }) => {
    if (!wardStats[ward]) wardStats[ward] = { total: 0, bad: 0 };
    wardStats[ward].total += 1;
    if (status !== "Nourished") wardStats[ward].bad += 1;
  });

  const rows = Object.entries(wardStats).map(([ward, { total, bad }]) => {
    const pct = total ? (bad / total) * 100 : 0;
    return { ward, total, pct };
  });

  rows.sort((a, b) => b.pct - a.pct); // highest risk first

  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.ward}</td>
      <td>${r.total}</td>
      <td>${r.pct.toFixed(1)}%</td>
    `;
    body.appendChild(tr);
  });
}
