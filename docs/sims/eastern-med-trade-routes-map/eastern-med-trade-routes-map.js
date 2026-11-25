// Trade Routes of the Eastern Mediterranean - Leaflet.js
// CANVAS_HEIGHT: 706
// Predict-then-reveal map quiz. Sixteen places are always visible; four
// simplified trade routes (Bronze Age, Classical, Hellenistic, Byzantine and
// Venetian) stay hidden until the learner commits an answer to the question
// that reveals them. Routes are straight segments between the listed places,
// with a few unmarked sea waypoints so that each line stays on the water.

// ---------- Places (lat/lon rounded to 0.01 degree) ----------
const PLACES = {
  byzantium:   { name: "Byzantium / Constantinople / Istanbul", label: "Byzantium (Istanbul)", lat: 41.01, lon: 28.98, dir: "right",
                 role: "Controls the Bosphorus, the only sea gate between the Black Sea and the Mediterranean.", day: "Days 1–5" },
  troy:        { name: "Troy (Hisarlik)", label: "Troy", lat: 39.96, lon: 26.24, dir: "left",
                 role: "Overlooks the entrance to the Dardanelles.", day: "Day 6" },
  chersonesos: { name: "Chersonesos (Crimea)", label: "Chersonesos", lat: 44.61, lon: 33.49, dir: "right",
                 role: "Greek colony and Black Sea grain port.", day: null },
  ephesus:     { name: "Ephesus", label: "Ephesus", lat: 37.94, lon: 27.34, dir: "bottom",
                 role: "Harbor city and capital of the Roman province of Asia.", day: "Day 7" },
  sardis:      { name: "Sardis", label: "Sardis", lat: 38.49, lon: 28.04, dir: "right",
                 role: "Capital of Lydia, where the first coins were struck.", day: null },
  rhodes:      { name: "Rhodes", label: "Rhodes", lat: 36.44, lon: 28.22, dir: "bottom",
                 role: "Island trading city on the sea lane between the Aegean and Egypt.", day: "Day 8" },
  uluburun:    { name: "Uluburun shipwreck", label: "Uluburun wreck", lat: 36.13, lon: 29.68, dir: "right",
                 role: "A merchant ship that sank c. 1300 BCE with about 10 tons of copper and 1 ton of tin.", day: null },
  enkomi:      { name: "Enkomi (Cyprus)", label: "Enkomi", lat: 35.17, lon: 33.87, dir: "left",
                 role: "Bronze Age port of Cyprus, the great source of copper.", day: null },
  byblos:      { name: "Byblos", label: "Byblos", lat: 34.12, lon: 35.65, dir: "right",
                 role: "Phoenician port; papyrus traded through it gave the Greeks their word for book, <i>biblos</i>.", day: null },
  alexandria:  { name: "Alexandria", label: "Alexandria", lat: 31.20, lon: 29.92, dir: "right",
                 role: "Hellenistic and Roman port that shipped Egyptian grain.", day: null },
  knossos:     { name: "Knossos", label: "Knossos", lat: 35.30, lon: 25.16, dir: "bottom",
                 role: "Center of the Minoan palace civilization.", day: "Day 9" },
  heraklion:   { name: "Heraklion (Candia)", label: "Heraklion (Candia)", lat: 35.34, lon: 25.13, dir: "top",
                 role: "Venetian harbor fortress, 1211–1669.", day: "Day 9" },
  mycenae:     { name: "Mycenae", label: "Mycenae", lat: 37.73, lon: 22.76, dir: "bottom",
                 role: "Citadel of the Mycenaean Greeks.", day: null },
  corinth:     { name: "Corinth", label: "Corinth", lat: 37.91, lon: 22.88, dir: "left",
                 role: "City on the isthmus between two seas.", day: null },
  piraeus:     { name: "Piraeus (port of Athens)", label: "Piraeus (Athens)", lat: 37.94, lon: 23.64, dir: "right",
                 role: "The harbor that received Athens's grain ships.", day: "Day 10" },
  venice:      { name: "Venice", label: "Venice", lat: 45.44, lon: 12.34, dir: "right",
                 role: "Medieval trading republic that ruled Crete.", day: null }
};

// ---------- Unmarked sea waypoints between consecutive places ----------
// Key "from>to". The reverse direction reuses the same chain reversed.
const MARMARA_DARDANELLES = [[40.92, 28.50], [40.77, 27.60], [40.48, 26.85], [40.36, 26.65], [40.15, 26.40], [40.03, 26.20]];
const WAYPOINTS = {
  "byblos>enkomi": [],
  "enkomi>uluburun": [[35.00, 34.20], [34.55, 33.20], [34.60, 32.20], [36.00, 30.50]],
  "uluburun>rhodes": [[36.05, 29.20]],
  "rhodes>knossos": [],
  "knossos>mycenae": [[36.50, 23.50], [37.30, 22.95], [37.55, 22.82]],
  "chersonesos>byzantium": [[41.25, 29.12]],
  "byzantium>troy": MARMARA_DARDANELLES,
  "troy>piraeus": [[39.90, 26.05], [39.60, 25.70], [38.60, 24.75], [38.05, 24.60], [37.60, 24.05], [37.75, 23.70]],
  "troy>rhodes": [[39.90, 26.05], [39.00, 25.65], [37.90, 26.00], [37.20, 26.70], [36.65, 27.45], [36.52, 27.95]],
  "rhodes>alexandria": [],
  "venice>heraklion": [[44.50, 13.30], [42.50, 15.60], [41.30, 18.20], [40.20, 19.00], [39.00, 20.00], [37.60, 20.50], [36.40, 21.60], [36.00, 23.20]],
  "heraklion>byzantium": [[35.60, 25.30], [36.55, 25.65], [37.30, 25.75], [37.75, 25.60], [38.60, 25.40], [39.50, 25.75], [39.95, 26.05]]
    .concat(MARMARA_DARDANELLES.slice().reverse())
};

// ---------- Routes ----------
const ROUTES = {
  A: { era: "Bronze Age, c. 1300 BCE", short: "Bronze Age", color: "#b85a14", dash: null,
       path: ["byblos", "enkomi", "uluburun", "rhodes", "knossos", "mycenae"],
       cargo: "Copper, tin, glass, ivory, ebony" },
  B: { era: "Classical, 5th century BCE", short: "Classical", color: "#2e7d32", dash: null,
       path: ["chersonesos", "byzantium", "troy", "piraeus"],
       cargo: "Black Sea wheat for Athens" },
  C: { era: "Hellenistic, 3rd century BCE", short: "Hellenistic", color: "#7b3fa0", dash: "8 6",
       path: ["byzantium", "troy", "rhodes", "alexandria"],
       cargo: "Grain, wine, and goods passing Rhodes's harbor" },
  D: { era: "Byzantine and Venetian, 13th–15th centuries CE", short: "Byzantine and Venetian", color: "#c62828", dash: null,
       path: ["venice", "heraklion", "byzantium"],
       cargo: "Silk and spices from the Silk Roads; Cretan wine and grain" }
};

// ---------- Questions (fixed order; the first listed choice is correct) ----------
const QUESTIONS = [
  { q: "The Uluburun ship carried about 10 tons of copper. Where did most of that copper probably come from?",
    choices: ["Cyprus", "Crete", "Athens", "Venice"], route: "A",
    why: "Cyprus was the Bronze Age's great copper source, and chemical tests link most of the ingots to it; the Latin word for copper comes from the island's name." },
  { q: "A grain ship leaves Chersonesos for Athens. Which places must it pass?",
    choices: ["The Bosphorus at Byzantium and the Dardanelles at Troy", "Rhodes and Crete", "Corinth and Mycenae", "Cyprus and Byblos"], route: "B",
    why: "The only sea exit from the Black Sea runs through the Bosphorus and then the Dardanelles." },
  { q: "In 405 BCE Sparta destroyed Athens's fleet at Aegospotami on the Dardanelles. Why did Athens surrender the next spring?",
    choices: ["Its grain route was cut", "Sparta had captured the Acropolis", "A plague had begun", "Persia invaded"], route: "B",
    why: "Athens could not feed itself; without a fleet it could not protect the grain ships coming through the strait." },
  { q: "In 220 BCE Rhodes went to war with Byzantium. What was the most likely cause?",
    choices: ["Byzantium began charging tolls on ships in the Bosphorus", "A religious quarrel", "Byzantium attacked Crete", "Rhodes wanted to rule Troy"], route: "C",
    why: "Rhodes lived by free trade, and a toll at the Bosphorus taxed every ship trading with the Black Sea." },
  { q: "Why did Venice want Crete after 1204?",
    choices: ["Its harbors sat on the sea lane between Venice and Constantinople and the Levant", "Crete had the only tin mines", "It controlled the Bosphorus", "It was the closest island to Venice"], route: "D",
    why: "Crete lay midway on Venice's eastern sea lanes, so its harbors protected and supplied Venetian ships; Venice ruled it from 1211 to 1669." }
];

// ---------- State ----------
let map, legendDiv;
let routeLayers = {};          // letter -> L.layerGroup (line + arrows)
let revealed = new Set();
let current = 0;               // question index
let answered = false;
let score = 0;
let choiceOrder = [];          // per question, shuffled indices into choices

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function legPoints(fromKey, toKey) {
  const a = PLACES[fromKey], b = PLACES[toKey];
  let mids = WAYPOINTS[fromKey + ">" + toKey];
  if (!mids) {
    const rev = WAYPOINTS[toKey + ">" + fromKey];
    mids = rev ? rev.slice().reverse() : [];
  }
  return [[a.lat, a.lon]].concat(mids, [[b.lat, b.lon]]);
}

// Place one arrowhead about halfway along a leg, pointing in the travel direction.
// Angles are measured in Web Mercator pixels, which keeps them correct at any zoom.
function arrowForLeg(pts, color) {
  const proj = pts.map(p => map.project(L.latLng(p[0], p[1]), 0));
  let total = 0;
  const segLen = [];
  for (let i = 1; i < proj.length; i++) {
    const d = proj[i].distanceTo(proj[i - 1]);
    segLen.push(d);
    total += d;
  }
  let target = total * 0.5, i = 0;
  while (i < segLen.length - 1 && target > segLen[i]) { target -= segLen[i]; i++; }
  const t = segLen[i] > 0 ? target / segLen[i] : 0;
  const p0 = proj[i], p1 = proj[i + 1];
  const mid = L.point(p0.x + (p1.x - p0.x) * t, p0.y + (p1.y - p0.y) * t);
  const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
  const icon = L.divIcon({
    className: "route-arrow",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: '<svg width="16" height="16" viewBox="-8 -8 16 16" style="transform: rotate(' + angle.toFixed(1) +
          'deg)"><path d="M -6 -6 L 7 0 L -6 6 Z" fill="' + color + '" stroke="white" stroke-width="1.5"/></svg>'
  });
  return L.marker(map.unproject(mid, 0), { icon: icon, interactive: false, keyboard: false });
}

function buildRoute(letter) {
  const r = ROUTES[letter];
  const group = L.layerGroup();
  let all = [];
  for (let i = 0; i < r.path.length - 1; i++) {
    const pts = legPoints(r.path[i], r.path[i + 1]);
    all = all.concat(i === 0 ? pts : pts.slice(1));
    group.addLayer(arrowForLeg(pts, r.color));
  }
  const names = r.path.map(k => PLACES[k].label).join(" → ");
  const popup = "<b>Route " + letter + ": " + r.era + "</b><br>" + names +
                "<br><b>Cargo:</b> " + r.cargo + "<br><i>Simplified route, not a single recorded voyage.</i>";
  // A wide transparent line underneath makes the route easy to click.
  group.addLayer(L.polyline(all, { color: r.color, weight: 14, opacity: 0 }).bindPopup(popup));
  group.addLayer(L.polyline(all, { color: r.color, weight: 4, opacity: 0.9, dashArray: r.dash }).bindPopup(popup));
  return group;
}

function addPlaces() {
  Object.keys(PLACES).forEach(key => {
    const p = PLACES[key];
    const onTrip = !!p.day;
    const m = L.circleMarker([p.lat, p.lon], {
      radius: 6, weight: 2, color: "#ffffff",
      fillColor: onTrip ? "#c8963e" : "#12304a", fillOpacity: 1
    }).addTo(map);
    const offsets = { right: [8, 0], left: [-8, 0], top: [0, -8], bottom: [0, 8] };
    m.bindTooltip(p.label, { permanent: true, direction: p.dir, offset: offsets[p.dir], className: "place-label" });
    m.bindPopup("<b>" + p.name + "</b><br>" + p.role + "<br><b>Our trip:</b> " + (p.day ? p.day : "not a stop on our trip"));
  });
}

function updateLegend() {
  let html = '<div class="lt">Simplified routes</div>';
  const letters = Object.keys(ROUTES).filter(l => revealed.has(l));
  if (letters.length === 0) {
    html += '<div>Routes appear as you answer.</div>';
  } else {
    letters.forEach(l => {
      const r = ROUTES[l];
      const bg = r.dash ? "repeating-linear-gradient(90deg," + r.color + " 0 6px, transparent 6px 10px)" : r.color;
      html += '<div><span class="sw" style="background:' + bg + '"></span>' + l + ": " + r.short + "</div>";
    });
  }
  html += '<div><span class="dot" style="background:#c8963e"></span>our trip stop ' +
          '<span class="dot" style="background:#12304a;margin-left:6px"></span>other place</div>';
  legendDiv.innerHTML = html;
}

function revealRoute(letter) {
  if (revealed.has(letter)) return;
  revealed.add(letter);
  routeLayers[letter].addTo(map);
  updateLegend();
}

function renderQuestion() {
  const qnum = document.getElementById("qnum");
  const qtext = document.getElementById("qtext");
  const box = document.getElementById("choices");
  const fb = document.getElementById("feedback");
  const next = document.getElementById("next");
  document.getElementById("score").innerHTML = "Correct: <b>" + score + " of " + QUESTIONS.length + "</b>";
  box.innerHTML = "";
  fb.innerHTML = "";
  answered = false;
  next.disabled = true;
  next.textContent = current < QUESTIONS.length - 1 ? "Next question" : "See result";

  const Q = QUESTIONS[current];
  qnum.innerHTML = "Question <b>" + (current + 1) + " of " + QUESTIONS.length + "</b>: predict before the route is drawn";
  qtext.textContent = Q.q;
  choiceOrder[current].forEach(idx => {
    const b = document.createElement("button");
    b.textContent = Q.choices[idx];
    b.dataset.idx = idx;
    b.addEventListener("click", () => answer(idx));
    box.appendChild(b);
  });
}

function answer(idx) {
  if (answered) return;
  answered = true;
  const Q = QUESTIONS[current];
  const correct = idx === 0;
  if (correct) score++;
  document.querySelectorAll("#choices button").forEach(b => {
    const i = Number(b.dataset.idx);
    b.disabled = true;
    if (i === 0) b.classList.add("correct");
    else if (i === idx) b.classList.add("wrong");
  });
  const fb = document.getElementById("feedback");
  fb.innerHTML = (correct ? '<span class="ok">Correct.</span> ' : '<span class="no">Not quite.</span> ') + Q.why +
                 ' <i>Route ' + Q.route + ' is now on the map.</i>';
  document.getElementById("score").innerHTML = "Correct: <b>" + score + " of " + QUESTIONS.length + "</b>";
  revealRoute(Q.route);
  document.getElementById("next").disabled = false;
}

function showResult() {
  document.getElementById("qnum").innerHTML = "<b>All five questions answered</b>";
  document.getElementById("choices").innerHTML = "";
  const pass = score >= 4;
  document.getElementById("qtext").innerHTML = pass
    ? "You scored " + score + " of 5. 4 or more: you can read the sea like a merchant."
    : "You scored " + score + " of 5. Fewer than 4: reread “Trade Routes: The Thread Through Every Era” and try again.";
  document.getElementById("feedback").innerHTML =
    "All four routes are now visible. Look for the Bosphorus and the Dardanelles: they sit on routes from three different eras. " +
    "Then notice where Rhodes and Crete fall, at the points where routes cross. Click any place or route to read its infobox.";
  const next = document.getElementById("next");
  next.disabled = true;
  next.textContent = "Done";
}

function restart() {
  Object.keys(routeLayers).forEach(l => map.removeLayer(routeLayers[l]));
  revealed.clear();
  map.closePopup();
  score = 0;
  current = 0;
  choiceOrder = QUESTIONS.map(Q => shuffle(Q.choices.map((_, i) => i)));
  updateLegend();
  fitAll();
  renderQuestion();
}

function fitAll() {
  const b = L.latLngBounds(Object.values(PLACES).map(p => [p.lat, p.lon]));
  map.fitBounds(b, { paddingTopLeft: [10, 14], paddingBottomRight: [30, 34] });
}

document.addEventListener("DOMContentLoaded", function () {
  map = L.map("map", {
    scrollWheelZoom: false,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    minZoom: 3,
    maxZoom: 9,
    worldCopyJump: false
  });
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 10,
    attribution: "Tiles &copy; Esri, GEBCO, NOAA, National Geographic"
  }).addTo(map);
  fitAll();

  Object.keys(ROUTES).forEach(l => { routeLayers[l] = buildRoute(l); });
  addPlaces();

  const Legend = L.Control.extend({
    options: { position: "bottomleft" },
    onAdd: function () {
      legendDiv = L.DomUtil.create("div", "legend");
      L.DomEvent.disableClickPropagation(legendDiv);
      return legendDiv;
    }
  });
  map.addControl(new Legend());

  document.getElementById("next").addEventListener("click", () => {
    if (!answered) return;
    if (current < QUESTIONS.length - 1) { current++; renderQuestion(); }
    else showResult();
  });
  document.getElementById("restart").addEventListener("click", restart);

  window.addEventListener("resize", () => map.invalidateSize());
  restart();
});
