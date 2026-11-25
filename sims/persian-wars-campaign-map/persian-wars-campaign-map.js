// Xerxes' Road to Salamis - Leaflet.js
// CANVAS_HEIGHT: 744
// Predict-then-reveal step-through map of the Persian Wars, 498-479 BCE.
// Ten places in date and route order (the specification's eight plus two
// unscored context stops, the Athos canal and Artemisium). At five places the
// learner chooses one of three geographic reasons before the note appears;
// one scored attempt each, mastery 4 of 5. Routes are drawn only up to the
// current step and are simplified sketches, not traced roads or sea lanes.

// ---------- Places (coordinates checked against Wikipedia, November 2026) ----------
const STEPS = [
  { name: "Sardis", lat: 38.488, lon: 28.040, dir: "right",
    date: "498 BCE; again winter 481/480 BCE",
    note: "Ionian rebels and 20 Athenian ships burn the Persian western capital in 498 BCE. In the winter of 481/480 BCE Xerxes gathers his army here.",
    view: "all" },
  { name: "Marathon", lat: 38.118, lon: 23.978, dir: "left", crowd: true,
    date: "490 BCE",
    note: "Darius's expedition, which has already burned Eretria, lands here. About 10,000 Athenians and 1,000 Plataeans win; Herodotus counts 192 Athenian dead and 6,400 Persian.",
    view: [[37.85, 23.50], [38.48, 24.30]],
    q: { text: "Why did the Persians land at Marathon?",
      options: ["It was Athens's own harbor.",
        "Its wide plain suited cavalry and it lay close to Eretria.",
        "No Athenians lived nearby."],
      correct: 1,
      why: "Herodotus says the exiled tyrant Hippias led them there because the plain was the best ground for cavalry in Attica and near Eretria." } },
  { name: "Abydos, on the Hellespont", short: "Abydos", lat: 40.195, lon: 26.405, dir: "right",
    date: "Spring 480 BCE",
    note: "Xerxes' army crosses on two bridges of boats, a few kilometers from Çanakkale, while his fleet sails down the strait beside it.",
    view: [[39.95, 26.05], [40.45, 26.80]],
    q: { text: "Why did Xerxes cross the Hellespont at Abydos?",
      options: ["The strait is among its narrowest there.",
        "The water is shallow enough to wade.",
        "Abydos was a Greek ally."],
      correct: 0,
      why: "The Hellespont is only about 1.2 to 6 km wide, and narrowest near Çanakkale, so a bridge of boats could span it." } },
  { name: "The Athos canal", short: "Athos canal", lat: 40.373, lon: 23.925, dir: "top", extra: true,
    date: "Dug about 483–480 BCE; the fleet sails through in 480 BCE",
    note: "In 492 BCE a Persian fleet was wrecked off Mount Athos. Xerxes had a canal about 2 km long dug across the neck of the peninsula so this fleet could avoid the cape. Archaeologists have traced its line. The army marches along the coast beside the fleet that carries its food.",
    view: [[39.75, 22.80], [41.10, 26.60]] },
  { name: "Thermopylae", lat: 38.797, lon: 22.537, dir: "left",
    date: "August or September 480 BCE",
    note: "Leonidas and his Spartans and allies hold the pass for three days until a local man shows the Persians a mountain path around them.",
    context: "The modern shore lies several kilometers out: river silt has built up the plain since 480 BCE, when the sea came almost to the foot of the cliffs.",
    view: [[38.62, 22.25], [38.98, 22.85]],
    q: { text: "Why did the Greeks try to stop the army at Thermopylae?",
      options: ["It was a walled city.",
        "A narrow pass between mountains and sea let a small force block a large one.",
        "A river there could not be crossed."],
      correct: 1,
      why: "In the pass, only a few men could fight at once, so numbers counted for less." } },
  { name: "Artemisium", lat: 39.05, lon: 23.20, dir: "right", extra: true, approx: true,
    date: "The same days as Thermopylae, 480 BCE",
    note: "While the army is held at the pass, the Greek fleet of about 271 ships fights the Persian fleet for three days in the strait off Cape Artemisium. The pass and the strait guard each other. When news comes that Thermopylae has fallen, the Greek fleet withdraws south to Salamis.",
    view: [[38.55, 22.35], [39.45, 23.70]] },
  { name: "The Acropolis of Athens", short: "Acropolis", lat: 37.9717, lon: 23.7261, dir: "right", crowd: true,
    date: "September 480 BCE",
    note: "The Persians take the abandoned city and burn the temples on the rock.",
    view: [[37.68, 23.30], [38.15, 23.95]],
    q: { text: "Why did the Persians find Athens almost empty?",
      options: ["The Athenians had surrendered and left.",
        "The Athenians had moved their families to Salamis, Aegina, and Troezen and put their trust in the fleet.",
        "A plague had emptied the city."],
      correct: 1,
      why: "Herodotus says the Athenians evacuated the city and manned the ships; only a few defenders held out on the rock." } },
  { name: "The strait of Salamis", short: "Salamis", lat: 37.944, lon: 23.560, dir: "left", approx: true, crowd: true,
    date: "September 480 BCE",
    note: "The Greek fleet of 378 ships, 180 of them Athenian, defeats the Persian fleet in the narrows. Without a fleet to supply it, much of Xerxes' army goes home.",
    view: [[37.89, 23.44], [38.02, 23.70]],
    q: { text: "Why did Themistocles want to fight in the strait?",
      options: ["Open water gave his ships room to maneuver.",
        "In the narrows the larger Persian fleet could not spread out or use its numbers.",
        "The Persians could not see the Greek ships there."],
      correct: 1,
      why: "In the crowded strait the Persian ships fouled each other, and the Greek rams found targets." } },
  { name: "Plataea", lat: 38.219, lon: 23.273, dir: "left", crowd: true,
    date: "August 479 BCE",
    note: "The Greek army, led by the Spartan Pausanias, defeats the Persian army Xerxes left behind under Mardonius, who is killed. No Persian army invades Greece again.",
    view: [[37.78, 22.85], [38.42, 23.95]] },
  { name: "Mycale", lat: 37.691, lon: 27.157, dir: "right", approx: true,
    date: "479 BCE",
    note: "A Greek fleet destroys the Persian forces on the Anatolian shore facing Samos, near Kuşadası. By tradition it was fought on the same day as Plataea.",
    view: "all" }
];

// ---------- Simplified routes, revealed with the step they lead to ----------
// kind: army (Persian army), fleet (Persian fleet), e490 (Darius's expedition), greek (Greek forces)
const S = i => [STEPS[i].lat, STEPS[i].lon];
const ROUTES = {
  1: [{ kind: "e490", pts: [[37.62, 26.85], [37.12, 25.45], [37.40, 25.27], [37.70, 24.95], [37.93, 24.35],
        [38.16, 24.02], [38.39, 23.79], [38.13, 24.02], S(1)] }],
  2: [{ kind: "army", pts: [S(0), [39.10, 27.40], [39.59, 27.02], [39.96, 26.24], S(2)] }],
  3: [{ kind: "army", pts: [S(2), [40.20, 26.37], [40.86, 26.05], [40.95, 25.00], [40.79, 23.85], [40.40, 23.87]] },
      { kind: "fleet", pts: [S(2), [40.04, 26.17], [40.30, 26.05], [40.75, 25.95], [40.45, 24.65], [40.40, 23.92], S(3)] }],
  4: [{ kind: "army", pts: [[40.40, 23.87], [40.63, 22.95], [39.64, 22.42], [39.10, 22.40], [38.90, 22.43], S(4)] }],
  5: [{ kind: "fleet", pts: [S(3), [40.33, 23.97], [40.00, 23.85], [39.85, 23.65], [40.15, 23.15], [40.58, 22.92],
        [40.15, 22.75], [39.70, 23.15], [39.30, 23.45], [39.12, 23.42], S(5)] }],
  6: [{ kind: "army", pts: [S(4), [38.62, 22.73], [38.45, 23.00], [38.32, 23.32], [38.10, 23.55], S(6)] }],
  7: [{ kind: "fleet", pts: [S(5), [38.95, 23.05], [38.75, 23.28], [38.55, 23.47], [38.465, 23.595], [38.30, 23.82],
        [38.20, 24.08], [37.92, 24.15], [37.62, 24.08], [37.75, 23.72], [37.90, 23.66], [37.93, 23.60], S(7)] }],
  8: [{ kind: "army", pts: [S(6), [38.17, 23.78], [38.33, 23.53], [38.25, 23.33], S(8)] },
      { kind: "greek", pts: [[37.93, 22.99], [38.04, 23.54], [38.17, 23.45], S(8)] }],
  9: [{ kind: "greek", pts: [[37.74, 23.43], [37.55, 23.90], [37.45, 24.60], [37.32, 24.85], [37.30, 25.10], [37.40, 25.27],
        [37.33, 25.40], [37.40, 25.70], [37.48, 26.45], [37.63, 26.88], [37.69, 27.06], S(9)] }]
};

const KINDS = {
  e490:  { label: "Darius's fleet, 490 BCE", color: "#e07b00", dash: "2 6", weight: 3, css: "dotted" },
  army:  { label: "Persian army, 480–479", color: "#b3261e", dash: null, weight: 3 },
  fleet: { label: "Persian fleet, 480", color: "#1f4e9c", dash: "8 6", weight: 3 },
  greek: { label: "Greek forces, 479", color: "#2e7d32", dash: "6 5", weight: 3 }
};

// Small context labels for places on the routes that are not steps
const CONTEXT = {
  1: [["Eretria", 38.395, 23.795, "top", 1], ["Naxos", 37.10, 25.38, "bottom"], ["Delos", 37.40, 25.27, "right"]],
  3: [["Doriskos", 40.86, 26.05, "top"], ["Mount Athos", 40.157, 24.326, "bottom"]],
  4: [["Therme", 40.63, 22.95, "top"]],
  6: [["Thebes", 38.32, 23.32, "top", 1]],
  8: [["Isthmus of Corinth", 37.93, 22.99, "left", 1]],
  9: [["Aegina", 37.74, 23.43, "left", 1], ["Samos", 37.72, 26.80, "top"]]
};

const LABELS = [
  { text: "Aegean Sea", lat: 39.05, lon: 25.15, maxZoom: 8.5 },
  { text: "Hellespont", lat: 40.50, lon: 26.95, minZoom: 6 },
  { text: "Saronic Gulf", lat: 37.72, lon: 23.62, minZoom: 8.5, maxZoom: 9.75 },
  { text: "EUBOEA", lat: 38.62, lon: 23.70, minZoom: 6.5, land: true },
  { text: "ATTICA", lat: 38.08, lon: 23.83, minZoom: 8, land: true },
  { text: "SALAMIS", lat: 37.925, lon: 23.475, minZoom: 9.5, land: true },
  { text: "Malian Gulf", lat: 38.86, lon: 22.68, minZoom: 9 }
];

const ALL_BOUNDS = [[36.95, 22.20], [41.05, 28.25]];
const START_PROMPT = "A Persian king wants revenge on Athens. How will he get there?";
const MASTERY = 4;
const NQ = STEPS.filter(s => s.q).length;
const OFFSETS = { right: [12, 0], left: [-12, 0], top: [0, -12], bottom: [0, 12] };

// ---------- State ----------
let map, markers = [], routeLayers = {}, contextLayers = {}, labelMarkers = [], crowdTips = [];
let current = 0;        // 0..STEPS.length (STEPS.length = summary)
let answers = {};       // step index -> chosen option
let score = 0;

// ---------- Map layers ----------
function numIcon(i, cur) {
  const s = STEPS[i];
  const cls = "num-icon" + (cur ? " cur" : "") + (s.extra ? " extra" : "");
  return L.divIcon({ className: cls, iconSize: [20, 20], iconAnchor: [10, 10], html: "<div>" + (i + 1) + "</div>" });
}

function popupFor(i) {
  const s = STEPS[i];
  return "<b>" + (i + 1) + ". " + s.name + "</b>" + (s.approx ? " (approximate location)" : "") +
    "<br><i>" + s.date + "</i><br>" + s.note;
}

function buildLayers() {
  STEPS.forEach((s, i) => {
    const m = L.marker([s.lat, s.lon], { icon: numIcon(i, false), keyboard: false });
    m.bindTooltip(s.short || s.name, { permanent: true, direction: s.dir, offset: OFFSETS[s.dir], className: "place-label" });
    markers.push(m);
  });
  Object.keys(ROUTES).forEach(k => {
    const g = L.layerGroup();
    ROUTES[k].forEach(r => {
      const K = KINDS[r.kind];
      g.addLayer(L.polyline(r.pts, { color: "#ffffff", weight: K.weight + 3, opacity: 0.6, interactive: false }));
      g.addLayer(L.polyline(r.pts, { color: K.color, weight: K.weight, opacity: 0.95, dashArray: K.dash, interactive: false }));
    });
    routeLayers[k] = g;
  });
  Object.keys(CONTEXT).forEach(k => {
    const g = L.layerGroup();
    CONTEXT[k].forEach(c => {
      const m = L.circleMarker([c[1], c[2]], { radius: 3, weight: 1, color: "#555", fillColor: "#fff", fillOpacity: 1, interactive: false });
      m.bindTooltip(c[0], { permanent: true, direction: c[3], offset: [0, 0], className: "place-label ctx-label" });
      if (c[4]) crowdTips.push(m);
      g.addLayer(m);
    });
    contextLayers[k] = g;
  });
  LABELS.forEach(w => {
    const m = L.marker([w.lat, w.lon], {
      interactive: false, keyboard: false,
      icon: L.divIcon({ className: "water-label" + (w.land ? " land-label" : ""), iconSize: [120, 16], iconAnchor: [60, 8],
        html: "<div>" + w.text + "</div>" })
    });
    labelMarkers.push({ m: m, w: w });
  });
}

// Below zoom 8.5 the places around Athens crowd together, so only the current one keeps its name.
const CROWD_ZOOM = 8.5;
function updateTips() {
  const thin = map.getZoom() < CROWD_ZOOM;
  markers.forEach((m, i) => {
    if (!STEPS[i].crowd || !map.hasLayer(m)) return;
    const show = !thin || i === current;
    if (show && !m.isTooltipOpen()) m.openTooltip();
    if (!show && m.isTooltipOpen()) m.closeTooltip();
  });
  crowdTips.forEach(m => {
    if (!m._map) return;
    if (!thin && !m.isTooltipOpen()) m.openTooltip();
    if (thin && m.isTooltipOpen()) m.closeTooltip();
  });
}

function updateLabels() {
  updateTips();
  const z = map.getZoom();
  labelMarkers.forEach(o => {
    const show = z >= (o.w.minZoom || 0) && z <= (o.w.maxZoom || 99);
    if (show && !map.hasLayer(o.m)) o.m.addTo(map);
    if (!show && map.hasLayer(o.m)) map.removeLayer(o.m);
  });
}

function showLayersUpTo(step) {
  const last = Math.min(step, STEPS.length - 1);
  markers.forEach((m, i) => {
    if (i <= last) {
      if (!map.hasLayer(m)) m.addTo(map);
      m.setIcon(numIcon(i, i === step));
      m.setZIndexOffset(i === step ? 1000 : 0);
      m.unbindPopup();
      const locked = STEPS[i].q && answers[i] === undefined;
      if (!locked) m.bindPopup(popupFor(i), { autoPanPadding: [10, 10] });
    } else if (map.hasLayer(m)) map.removeLayer(m);
  });
  Object.keys(routeLayers).forEach(k => {
    const on = Number(k) <= last;
    if (on && !map.hasLayer(routeLayers[k])) routeLayers[k].addTo(map);
    if (!on && map.hasLayer(routeLayers[k])) map.removeLayer(routeLayers[k]);
  });
  Object.keys(contextLayers).forEach(k => {
    const on = Number(k) <= last;
    if (on && !map.hasLayer(contextLayers[k])) contextLayers[k].addTo(map);
    if (!on && map.hasLayer(contextLayers[k])) map.removeLayer(contextLayers[k]);
  });
}

function setView(v) {
  const b = v === "all" ? ALL_BOUNDS : v;
  map.fitBounds(b, { padding: [10, 10], animate: false });
  updateLabels();
}

// ---------- Panel ----------
function updateScore() {
  const n = Object.keys(answers).length;
  document.getElementById("score").innerHTML = "Score: <b>" + score + " of " + NQ + "</b>" +
    (n < NQ ? " (" + n + " answered)" : "");
}

function noteHTML(i) {
  const s = STEPS[i];
  return '<span class="dt">' + s.date + ".</span> " + s.note +
    (s.approx ? ' <span class="ctx">Marker shows the approximate location.</span>' : "");
}

function render() {
  map.closePopup();
  const qtext = document.getElementById("qtext");
  const box = document.getElementById("choices");
  const fb = document.getElementById("feedback");
  const next = document.getElementById("next");
  const back = document.getElementById("back");
  box.innerHTML = "";
  back.disabled = current === 0;

  if (current === STEPS.length) { renderSummary(); return; }

  const s = STEPS[current];
  showLayersUpTo(current);
  setView(s.view);
  document.getElementById("qnum").innerHTML = "Place <b>" + (current + 1) + " of " + STEPS.length + "</b>" +
    (s.extra ? " (context stop, not scored)" : "");
  next.textContent = current < STEPS.length - 1 ? "Next place" : "See the whole route";
  next.disabled = false;

  if (!s.q) {
    qtext.innerHTML = (current + 1) + ". " + s.name + (current === 0 ? '<br><small>' + START_PROMPT + "</small>" : "");
    fb.innerHTML = noteHTML(current);
    updateScore();
    return;
  }

  qtext.innerHTML = (current + 1) + ". " + s.name + ": " + s.q.text;
  const done = answers[current] !== undefined;
  s.q.options.forEach((o, k) => {
    const b = document.createElement("button");
    b.textContent = "(" + "abc"[k] + ") " + o;
    b.dataset.k = k;
    b.addEventListener("click", () => answer(k));
    if (done) {
      b.disabled = true;
      if (k === s.q.correct) b.classList.add("correct");
      else if (k === answers[current]) b.classList.add("wrong");
    }
    box.appendChild(b);
  });
  if (done) {
    fb.innerHTML = feedbackHTML(current);
  } else {
    fb.innerHTML = '<span class="ctx">Look at the map, then choose. One try counts for the score; the note appears after you answer.' +
      (s.context ? " " + s.context : "") + "</span>";
    next.disabled = true;
  }
  updateScore();
}

function feedbackHTML(i) {
  const s = STEPS[i];
  const ok = answers[i] === s.q.correct;
  return (ok ? '<span class="ok">Correct.</span> ' : '<span class="no">Not quite.</span> ') + s.q.why +
    "<br>" + noteHTML(i);
}

function answer(k) {
  const s = STEPS[current];
  if (!s || !s.q || answers[current] !== undefined) return;
  answers[current] = k;
  if (k === s.q.correct) score++;
  // unlock this marker's popup now that the note is shown
  showLayersUpTo(current);
  render();
}

function renderSummary() {
  showLayersUpTo(STEPS.length);
  setView("all");
  const pass = score >= MASTERY;
  document.getElementById("qnum").innerHTML = "<b>The whole route, Sardis to Mycale</b>";
  document.getElementById("qtext").innerHTML = "Your score: " + score + " of " + NQ + ". Mastery is " + MASTERY + ".";
  document.getElementById("feedback").innerHTML = (pass
    ? '<span class="ok">You can read the Persian Wars as a war of narrow places.</span> '
    : '<span class="no">Look again at Thermopylae and Salamis: what did the ground and the water do to the Persians\' numbers?</span> ') +
    "The Greeks chose a pass and two straits, Thermopylae, Artemisium and Salamis, where a smaller force could face a larger one. " +
    "The red army line and the blue fleet line run side by side: once the fleet lost at Salamis, the army could not be fed. Click any numbered marker to read its note again.";
  const next = document.getElementById("next");
  next.textContent = "Done";
  next.disabled = true;
  updateScore();
}

function go(d) {
  const n = current + d;
  if (n < 0 || n > STEPS.length) return;
  if (d > 0 && STEPS[current] && STEPS[current].q && answers[current] === undefined) return;
  current = n;
  render();
}

function restart() {
  answers = {};
  score = 0;
  current = 0;
  render();
}

document.addEventListener("DOMContentLoaded", function () {
  map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: false,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    minZoom: 5,
    maxZoom: 11
  });
  // The ocean base map shows relief and sea depths without modern place names.
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 11,
    maxNativeZoom: 10,
    attribution: "Tiles &copy; Esri, GEBCO, NOAA, National Geographic"
  }).addTo(map);
  L.control.zoom({ position: "topright" }).addTo(map);
  L.control.scale({ position: "bottomright", imperial: false, maxWidth: 90 }).addTo(map);
  map.fitBounds(ALL_BOUNDS, { padding: [10, 10], animate: false });

  document.getElementById("key").innerHTML = Object.values(KINDS).map(K =>
    '<span><span class="ln" style="border-top:3px ' + (K.css || (K.dash ? "dashed" : "solid")) + " " + K.color + '"></span>' + K.label + "</span>").join("") +
    '<span class="note">Routes simplified</span>';

  buildLayers();
  map.on("zoomend", updateLabels);
  updateLabels();

  document.getElementById("next").addEventListener("click", () => go(1));
  document.getElementById("back").addEventListener("click", () => go(-1));
  document.getElementById("restart").addEventListener("click", restart);
  document.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (["a", "b", "c"].includes(k)) answer("abc".indexOf(k));
    else if (["1", "2", "3"].includes(k)) answer(Number(k) - 1);
    else if (e.key === "Enter") go(1);
  });
  window.addEventListener("resize", () => map.invalidateSize());
  restart();
});
