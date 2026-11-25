// Paul's Journeys and Our Route - Leaflet.js
// CANVAS_HEIGHT: 696
// Predict-then-reveal map quiz. Twelve places Paul visited are asked in a
// fixed order: on which journey does the Book of Acts FIRST bring Paul there?
// Our November 2026 cruise and land route, and three reference markers
// (Tarsus, Damascus, Jerusalem), are visible from the start; the four journey
// routes stay hidden until all twelve places are answered. Then the routes
// appear and can be toggled one at a time or all together. Routes are straight
// lines joining the places Acts names, not the actual roads or sea lanes.

// ---------- Sites (lat, lon rounded to 0.01 degree; checked against Wikipedia) ----------
const SITES = {
  antioch:   { name: "Antioch in Syria (Antakya)", lat: 36.20, lon: 36.16 },
  seleucia:  { name: "Seleucia Pieria", lat: 36.12, lon: 35.93 },
  salamis:   { name: "Salamis, Cyprus", lat: 35.18, lon: 33.90 },
  paphos:    { name: "Paphos, Cyprus", lat: 34.76, lon: 32.41 },
  perga:     { name: "Perga", lat: 36.96, lon: 30.85 },
  pisidian:  { name: "Pisidian Antioch", lat: 38.31, lon: 31.19 },
  iconium:   { name: "Iconium (Konya)", lat: 37.87, lon: 32.48 },
  lystra:    { name: "Lystra", lat: 37.60, lon: 32.34 },
  derbe:     { name: "Derbe", lat: 37.35, lon: 33.36 },
  attalia:   { name: "Attalia (Antalya)", lat: 36.88, lon: 30.70 },
  tarsus:    { name: "Tarsus", lat: 36.92, lon: 34.89 },
  troas:     { name: "Troas (Alexandria Troas)", lat: 39.75, lon: 26.16 },
  neapolis:  { name: "Neapolis (Kavala)", lat: 40.94, lon: 24.41 },
  philippi:  { name: "Philippi", lat: 41.01, lon: 24.29 },
  thess:     { name: "Thessalonica", lat: 40.64, lon: 22.94 },
  berea:     { name: "Berea (Veria)", lat: 40.52, lon: 22.20 },
  athens:    { name: "Athens", lat: 37.97, lon: 23.73 },
  corinth:   { name: "Corinth", lat: 37.91, lon: 22.88 },
  ephesus:   { name: "Ephesus", lat: 37.94, lon: 27.34 },
  caesarea:  { name: "Caesarea", lat: 32.50, lon: 34.89 },
  assos:     { name: "Assos", lat: 39.49, lon: 26.34 },
  mitylene:  { name: "Mitylene, Lesbos", lat: 39.10, lon: 26.55 },
  chios:     { name: "Chios", lat: 38.37, lon: 26.14 },
  samos:     { name: "Samos", lat: 37.69, lon: 26.94 },
  miletus:   { name: "Miletus", lat: 37.53, lon: 27.28 },
  cos:       { name: "Cos", lat: 36.89, lon: 27.29 },
  rhodes:    { name: "Rhodes", lat: 36.44, lon: 28.22 },
  patara:    { name: "Patara", lat: 36.26, lon: 29.32 },
  tyre:      { name: "Tyre", lat: 33.27, lon: 35.20 },
  ptolemais: { name: "Ptolemais (Acre)", lat: 32.92, lon: 35.08 },
  jerusalem: { name: "Jerusalem", lat: 31.78, lon: 35.23 },
  sidon:     { name: "Sidon", lat: 33.56, lon: 35.37 },
  myra:      { name: "Myra", lat: 36.26, lon: 29.98 },
  cnidus:    { name: "Cnidus", lat: 36.69, lon: 27.37 },
  fairhavens:{ name: "Fair Havens, Crete", lat: 34.93, lon: 24.80 },
  malta:     { name: "Malta (St. Paul's Bay)", lat: 35.95, lon: 14.40 },
  syracuse:  { name: "Syracuse", lat: 37.07, lon: 15.29 },
  rhegium:   { name: "Rhegium (Reggio)", lat: 38.11, lon: 15.65 },
  puteoli:   { name: "Puteoli (Pozzuoli)", lat: 40.82, lon: 14.12 },
  rome:      { name: "Rome", lat: 41.90, lon: 12.50 },
  damascus:  { name: "Damascus", lat: 33.51, lon: 36.29 }
};

// ---------- Journeys, as told in Acts ----------
const JOURNEYS = [
  { key: "first", label: "First", long: "First journey", years: "c. 46–48 CE", acts: "Acts 13–14", color: "#1f78b4",
    path: ["antioch", "seleucia", "salamis", "paphos", "perga", "pisidian", "iconium", "lystra", "derbe",
           "lystra", "iconium", "pisidian", "perga", "attalia", "antioch"] },
  { key: "second", label: "Second", long: "Second journey", years: "c. 49–52 CE", acts: "Acts 15:36–18:22", color: "#d95f02",
    path: ["antioch", "tarsus", "derbe", "lystra", "iconium", "troas", "neapolis", "philippi", "thess", "berea",
           "athens", "corinth", "ephesus", "caesarea", "antioch"] },
  { key: "third", label: "Third", long: "Third journey", years: "c. 52–57 CE", acts: "Acts 18:23–21:17", color: "#6a3d9a",
    path: ["antioch", "iconium", "pisidian", "ephesus", "troas", "philippi", "thess", "corinth", "philippi", "troas",
           "assos", "mitylene", "chios", "samos", "miletus", "cos", "rhodes", "patara", "tyre", "ptolemais",
           "caesarea", "jerusalem"] },
  { key: "rome", label: "Voyage to Rome", long: "Voyage to Rome", years: "c. 59–60 CE", acts: "Acts 27:1–28:16", color: "#b2182b",
    path: ["caesarea", "sidon", "myra", "cnidus", "fairhavens", "malta", "syracuse", "rhegium", "puteoli", "rome"] }
];

// ---------- The twelve places, in fixed order ----------
// j is the index into JOURNEYS of the journey on which Acts FIRST brings Paul there.
const PLACES = [
  { site: "paphos", label: "Paphos", j: 0, dir: "bottom",
    why: "Paul and Barnabas crossed Cyprus to Paphos at the start of the first journey (Acts 13:6)." },
  { site: "iconium", label: "Iconium", j: 0, dir: "top",
    why: "Paul and Barnabas preached in Iconium's synagogue on the first journey (Acts 14:1)." },
  { site: "lystra", label: "Lystra", j: 0, dir: "left",
    why: "Paul was stoned and left for dead at Lystra on the first journey (Acts 14:19); he returned on the second, when Timothy joined him." },
  { site: "troas", label: "Troas", j: 1, dir: "left",
    why: "At Troas, Paul saw the vision of the man of Macedonia (Acts 16:8–9)." },
  { site: "philippi", label: "Philippi", j: 1, dir: "top",
    why: "Lydia became the first convert in Europe at Philippi (Acts 16:12–15)." },
  { site: "athens", label: "Athens", j: 1, dir: "top",
    why: "Paul's only visit to Athens, a short one, came on the second journey (Acts 17:15–34)." },
  { site: "corinth", label: "Corinth", j: 1, dir: "left",
    why: "Paul stayed eighteen months in Corinth on the second journey (Acts 18:11)." },
  { site: "ephesus", label: "Ephesus", j: 1, dir: "right",
    why: "Acts first brings Paul to Ephesus briefly at the end of the second journey (Acts 18:19–21); his long stay came on the third.",
    extra: "Watch for the difference between a first visit and a long stay." },
  { site: "miletus", label: "Miletus", j: 2, dir: "left",
    why: "Paul said farewell to the Ephesian elders at Miletus near the end of the third journey (Acts 20:17)." },
  { site: "rhodes", label: "Rhodes", j: 2, dir: "right",
    why: "Paul's ship stopped at Rhodes on the way to Jerusalem (Acts 21:1)." },
  { site: "fairhavens", label: "Fair Havens, Crete", j: 3, dir: "bottom",
    why: "Paul reached Crete only as a prisoner, on the voyage to Rome (Acts 27:8).",
    extra: "Crete appears in Acts only on the voyage to Rome." },
  { site: "malta", label: "Malta", j: 3, dir: "bottom",
    why: "Paul's ship was wrecked on Malta (Acts 28:1)." }
];

// Reference markers: shown from the start, not scored.
const REFS = [
  { site: "tarsus", label: "Tarsus", dir: "top", info: "Paul's birthplace, according to Acts (Acts 22:3). His letters never mention it." },
  { site: "damascus", label: "Damascus", dir: "right", info: "Paul's call, about 33–36 CE. Acts tells of a light on the road; Paul says God \"was pleased to reveal his Son to me\" (Galatians 1:16)." },
  { site: "jerusalem", label: "Jerusalem", dir: "left", info: "Where Paul was arrested, about 57 CE, at the end of the third journey (Acts 21)." }
];

// Our cruise and land route, November 11–23, 2026 (Chapter 2). Stops are
// labeled; the extra points are unmarked sea waypoints that keep the line on the water.
const OUR_STOPS = [
  { name: "Istanbul", lat: 41.01, lon: 28.98, dir: "top", day: "Days 1–5" },
  { name: "Çanakkale", lat: 40.15, lon: 26.41, dir: "top", day: "Day 6" },
  { name: "Kuşadası", lat: 37.86, lon: 27.26, dir: "bottom", day: "Day 7, for Ephesus" },
  { name: "Heraklion", lat: 35.34, lon: 25.13, dir: "top", day: "Day 9" },
  { name: "Piraeus", lat: 37.94, lon: 23.64, dir: null, day: "Day 10, the port of Athens" },
  { name: "Delphi", lat: 38.48, lon: 22.50, dir: "top", day: "Days 11–13" }
];
const OUR_PATH = [
  [41.01, 28.98], [40.92, 28.50], [40.77, 27.60], [40.48, 26.85], [40.36, 26.65], [40.15, 26.41],
  [40.03, 26.20], [39.90, 26.05], [39.60, 25.70], [38.90, 25.60], [38.20, 25.75], [38.00, 26.50], [37.92, 27.05], [37.86, 27.26],
  [37.65, 27.05], [37.25, 27.10], [36.95, 27.40], [36.65, 27.60], [36.55, 28.00], [36.44, 28.22],
  [36.10, 27.40], [35.60, 26.50], [35.45, 25.60], [35.34, 25.13],
  [35.90, 25.00], [36.40, 24.00], [37.20, 23.85], [37.60, 23.75], [37.94, 23.64],
  [37.97, 23.73], [38.48, 22.50], [37.97, 23.73]
];

const MASTERY = 10;
const QUESTION = "On which journey did Acts first bring Paul to each of these places?";
const SHARED = "Paul and our trip share <b>Athens</b>, <b>Rhodes</b>, and the region of <b>Ephesus</b> (our port, Kuşadası). " +
  "Acts never brings him to Istanbul (Byzantium), Heraklion, or Delphi, and on Crete he only sheltered at Fair Havens, as a prisoner.";

// ---------- State ----------
let map;
let markers = [];
let routeLayers = [];
let routeOn = [false, false, false, false];
let ourLayer;
let current = 0;
let answered = false;
let finished = false;
let score = 0;
let answers = [];
let legendDiv;

const OFFSETS = { right: [8, 0], left: [-8, 0], top: [0, -8], bottom: [0, 8] };

function journeysThrough(site) {
  const out = [];
  JOURNEYS.forEach((J, k) => { if (J.path.includes(site)) out.push(k); });
  return out;
}

function choiceHTML(J, k) {
  return '<span class="sw" style="background:' + J.color + '"></span>' + J.label +
    "<small>" + J.years + " · key " + (k + 1) + "</small>";
}

function makeMarker(p, i) {
  const S = SITES[p.site];
  const m = L.circleMarker([S.lat, S.lon], { radius: 6, weight: 2, color: "#5a6670", fillColor: "#ffffff", fillOpacity: 1 });
  m.bindTooltip(String(i + 1), { permanent: true, direction: p.dir, offset: OFFSETS[p.dir], className: "place-label" });
  return m;
}

function popupFor(i) {
  const p = PLACES[i], S = SITES[p.site], J = JOURNEYS[p.j];
  let h = "<b>" + (i + 1) + ". " + S.name + "</b><br>" +
    '<span style="color:' + J.color + ';font-weight:bold">First brought here: ' + J.long + " (" + J.years + ")</span><br>" + p.why;
  if (finished) {
    const ks = journeysThrough(p.site);
    h += "<br><br><b>Journeys through here:</b> " + ks.map(k =>
      '<span style="color:' + JOURNEYS[k].color + ';font-weight:bold">' + JOURNEYS[k].long + "</span>" +
      (k === p.j ? " (first visit)" : "")).join(", ") + ".";
  }
  return h;
}

// Marker states: "open" (unanswered), "current", "answered" (colored by its correct journey)
function setMarker(i, state) {
  const p = PLACES[i], m = markers[i], J = JOURNEYS[p.j];
  const tip = m.getTooltip();
  if (state === "open") {
    m.setStyle({ radius: 6, weight: 2, color: "#5a6670", fillColor: "#ffffff" });
    tip.setContent(String(i + 1));
  } else if (state === "current") {
    m.setStyle({ radius: 9, weight: 3, color: "#12304a", fillColor: "#ffe066" });
    tip.setContent((i + 1) + ". " + p.label);
    m.bringToFront();
  } else {
    m.setStyle({ radius: 7, weight: 2, color: "#ffffff", fillColor: J.color });
    tip.setContent((i + 1) + ". " + p.label);
  }
  const el = tip.getElement ? tip.getElement() : null;
  if (el) el.classList.toggle("cur", state === "current");
  m.unbindPopup();
  if (state === "answered") m.bindPopup(popupFor(i), { autoPanPadding: [10, 10] });
}

function addRefs() {
  REFS.forEach(r => {
    const S = SITES[r.site];
    const m = L.marker([S.lat, S.lon], {
      keyboard: false,
      icon: L.divIcon({ className: "ref-icon", iconSize: [15, 15], iconAnchor: [7, 7], html: "<div></div>" })
    }).addTo(map);
    m.bindTooltip(r.label, { permanent: true, direction: r.dir, offset: OFFSETS[r.dir], className: "ref-label" });
    m.bindPopup("<b>" + S.name + "</b> (reference, not scored)<br>" + r.info);
  });
}

function addOurRoute() {
  ourLayer = L.layerGroup();
  ourLayer.addLayer(L.polyline(OUR_PATH, { color: "#ffffff", weight: 6, opacity: 0.7, interactive: false }));
  ourLayer.addLayer(L.polyline(OUR_PATH, { color: "#b07d00", weight: 3, opacity: 0.95, dashArray: "7 6" })
    .bindPopup("<b>Our route, November 11–23, 2026</b><br>Istanbul → Çanakkale → Kuşadası → Rhodes → Heraklion → Piraeus → Athens → Delphi → Athens."));
  OUR_STOPS.forEach(s => {
    const m = L.marker([s.lat, s.lon], {
      keyboard: false,
      icon: L.divIcon({ className: "ours-icon", iconSize: [13, 13], iconAnchor: [6, 6], html: "<div></div>" })
    });
    if (s.dir) m.bindTooltip(s.name, { permanent: true, direction: s.dir, offset: OFFSETS[s.dir], className: "ours-label" });
    m.bindPopup("<b>" + s.name + "</b> (our route, " + s.day + ")");
    ourLayer.addLayer(m);
  });
  ourLayer.addTo(map);
}

function buildRoutes() {
  routeLayers = JOURNEYS.map(J => {
    const pts = J.path.map(k => [SITES[k].lat, SITES[k].lon]);
    const g = L.layerGroup();
    const pop = "<b>" + J.long + "</b>, " + J.years + " (" + J.acts + ")<br>" +
      J.path.map(k => SITES[k].name.replace(/ \(.*\)/, "")).join(" → ");
    g.addLayer(L.polyline(pts, { color: J.color, weight: 12, opacity: 0 }).bindPopup(pop));
    g.addLayer(L.polyline(pts, { color: J.color, weight: 3, opacity: 0.85, interactive: false }));
    return g;
  });
}

// Start and end labels for the routes, shown with the routes after the reveal
let anchorLayer;
function buildAnchors() {
  anchorLayer = L.layerGroup();
  [["antioch", "Antioch (start)", "bottom"], ["rome", "Rome", "right"]].forEach(a => {
    const S = SITES[a[0]];
    const m = L.circleMarker([S.lat, S.lon], { radius: 4, weight: 2, color: "#fff", fillColor: "#12304a", fillOpacity: 1 });
    m.bindTooltip(a[1], { permanent: true, direction: a[2], offset: OFFSETS[a[2]], className: "ref-label" });
    m.bindPopup("<b>" + S.name + "</b><br>" + (a[0] === "rome" ? "End of the voyage: two years of house arrest in Rome (Acts 28:30)."
      : "The three journeys began from Antioch in Syria, where the community sent Paul and Barnabas out (Acts 13:1–3)."));
    anchorLayer.addLayer(m);
  });
}

function setRoute(k, on) {
  routeOn[k] = on;
  if (on) routeLayers[k].addTo(map); else map.removeLayer(routeLayers[k]);
  if (routeOn.some(v => v)) anchorLayer.addTo(map); else map.removeLayer(anchorLayer);
  markers.forEach(m => m.bringToFront());
}

function updateLegend() {
  let h = '<div class="lt">Map key</div>' +
    '<div><span class="ln" style="border-top:3px dashed #b07d00"></span>Our route, Nov. 2026</div>' +
    '<div><span class="dot" style="background:#fff"></span>Place to classify</div>' +
    '<div><span class="dia"></span>Reference (not scored)</div>';
  legendDiv.innerHTML = h;
}

function updateScore() {
  document.getElementById("score").innerHTML = "Correct: <b>" + score + " of " + PLACES.length + "</b>";
}

function renderQuestion() {
  const P = PLACES[current];
  answered = false;
  document.getElementById("qnum").innerHTML = "Place <b>" + (current + 1) + " of " + PLACES.length + "</b>";
  document.getElementById("qtext").textContent = (current + 1) + ". " + SITES[P.site].name + ": " + QUESTION;
  const box = document.getElementById("choices");
  box.className = "";
  box.innerHTML = "";
  JOURNEYS.forEach((J, k) => {
    const b = document.createElement("button");
    b.innerHTML = choiceHTML(J, k);
    b.dataset.k = k;
    b.title = J.long + ", " + J.years + " (key " + (k + 1) + ")";
    b.addEventListener("click", () => answer(k));
    box.appendChild(b);
  });
  document.getElementById("feedback").innerHTML = '<span class="ctx">The yellow dot marks the place. The journey routes stay hidden until all twelve are answered. Choose the journey on which Acts first brings Paul there, not the one on which he stayed longest.</span>';
  const next = document.getElementById("next");
  next.classList.remove("hidden");
  next.disabled = true;
  next.textContent = current < PLACES.length - 1 ? "Next place" : "Reveal the journeys";
  document.getElementById("restart").classList.add("hidden");
  document.getElementById("hint").textContent = "Keys 1 to 4 choose a journey; Enter goes on.";
  setMarker(current, "current");
  updateScore();
}

function answer(k) {
  if (answered || finished) return;
  answered = true;
  const P = PLACES[current];
  const correct = k === P.j;
  answers[current] = k;
  if (correct) score++;
  document.querySelectorAll("#choices button").forEach(b => {
    b.disabled = true;
    if (Number(b.dataset.k) === P.j) b.classList.add("correct");
    else if (Number(b.dataset.k) === k) b.classList.add("wrong");
  });
  let h = correct ? '<span class="ok">Correct:</span> ' + P.why
                  : '<span class="no">Not quite.</span> ' + P.why;
  if (!correct && P.extra) h += ' <span class="extra">' + P.extra + "</span>";
  document.getElementById("feedback").innerHTML = h;
  setMarker(current, "answered");
  updateScore();
  document.getElementById("next").disabled = false;
}

function showResult() {
  finished = true;
  map.closePopup();
  PLACES.forEach((p, i) => setMarker(i, "answered"));   // rebinds popups with the journey lists
  const pass = score >= MASTERY;
  document.getElementById("qnum").innerHTML = "<b>All twelve places answered</b>";
  document.getElementById("qtext").textContent = "You placed " + score + " of 12. Mastery is 10." +
    (pass ? " Now compare the four journeys." : " Look at the routes, then try again.");
  const box = document.getElementById("choices");
  box.className = "five";
  box.innerHTML = "";
  JOURNEYS.forEach((J, k) => {
    const b = document.createElement("button");
    b.className = "toggle";
    b.innerHTML = '<span class="sw" style="background:' + J.color + '"></span>' + J.label + "<small>show / hide</small>";
    b.dataset.k = k;
    b.title = "Show or hide the " + J.long + " (key " + (k + 1) + ")";
    b.addEventListener("click", () => toggleRoute(k));
    box.appendChild(b);
  });
  const all = document.createElement("button");
  all.id = "allbtn";
  all.className = "toggle";
  all.innerHTML = "All<small>key 5</small>";
  all.title = "Show all four journeys, or hide them all (key 5)";
  all.addEventListener("click", toggleAll);
  box.appendChild(all);
  JOURNEYS.forEach((J, k) => setRoute(k, true));
  syncToggles();
  document.getElementById("feedback").innerHTML = SHARED +
    " Lines join the places Acts names, not the actual roads. Click a route or a colored dot to read it; Ephesus, Troas, Philippi, Corinth and Lystra lie on more than one journey.";
  document.getElementById("next").classList.add("hidden");
  const again = document.getElementById("restart");
  again.classList.remove("hidden");
  document.getElementById("hint").textContent = pass ? "Mastered. Try again to replay." : "Try again clears your answers and hides the routes.";
  updateLegend();
  fitAll();
}

function toggleRoute(k) { setRoute(k, !routeOn[k]); syncToggles(); }
function toggleAll() {
  const anyOff = routeOn.some(v => !v);
  JOURNEYS.forEach((J, k) => setRoute(k, anyOff));
  syncToggles();
}
function syncToggles() {
  document.querySelectorAll("#choices button.toggle[data-k]").forEach(b => b.classList.toggle("on", routeOn[Number(b.dataset.k)]));
  const all = document.getElementById("allbtn");
  if (all) all.classList.toggle("on", routeOn.every(v => v));
}

function fitAll() {
  const pts = Object.values(SITES).map(s => [s.lat, s.lon]).concat(OUR_STOPS.map(s => [s.lat, s.lon]));
  map.fitBounds(L.latLngBounds(pts), { paddingTopLeft: [14, 14], paddingBottomRight: [70, 12], animate: false });
}

function restart() {
  map.closePopup();
  current = 0;
  score = 0;
  answers = [];
  finished = false;
  JOURNEYS.forEach((J, k) => { if (routeOn[k]) setRoute(k, false); });
  PLACES.forEach((p, i) => setMarker(i, "open"));
  updateLegend();
  fitAll();
  renderQuestion();
}

function nextPlace() {
  if (finished || !answered) return;
  map.closePopup();
  if (current < PLACES.length - 1) { current++; renderQuestion(); }
  else showResult();
}

document.addEventListener("DOMContentLoaded", function () {
  map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: false,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    minZoom: 3,
    maxZoom: 9,
    worldCopyJump: false
  });
  // The ocean base map has relief and sea depths but no place names or modern borders.
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 10,
    attribution: "Tiles &copy; Esri, GEBCO, NOAA, National Geographic"
  }).addTo(map);
  L.control.zoom({ position: "topright" }).addTo(map);
  L.control.scale({ position: "bottomleft", imperial: false, maxWidth: 90 }).addTo(map);
  fitAll();

  addOurRoute();
  buildRoutes();
  buildAnchors();
  addRefs();
  markers = PLACES.map((p, i) => makeMarker(p, i).addTo(map));

  const Legend = L.Control.extend({
    options: { position: "bottomleft" },
    onAdd: function () {
      legendDiv = L.DomUtil.create("div", "legend");
      L.DomEvent.disableClickPropagation(legendDiv);
      return legendDiv;
    }
  });
  map.addControl(new Legend());

  document.getElementById("next").addEventListener("click", nextPlace);
  document.getElementById("restart").addEventListener("click", restart);
  document.getElementById("ours").addEventListener("change", e => {
    if (e.target.checked) ourLayer.addTo(map); else map.removeLayer(ourLayer);
    markers.forEach(m => m.bringToFront());
  });
  document.addEventListener("keydown", e => {
    if (["1", "2", "3", "4"].includes(e.key)) {
      if (finished) toggleRoute(Number(e.key) - 1); else answer(Number(e.key) - 1);
    } else if (e.key === "5" && finished) toggleAll();
    else if (e.key === "Enter") nextPlace();
  });
  window.addEventListener("resize", () => { map.invalidateSize(); });
  restart();
});
