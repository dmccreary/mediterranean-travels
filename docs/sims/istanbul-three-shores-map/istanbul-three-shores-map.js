// Istanbul's Three Shores - Leaflet.js
// CANVAS_HEIGHT: 676
// Predict-then-reveal map quiz. Twelve places are asked in a fixed order. The
// learner chooses one of three shores (the historic peninsula, Galata, or the
// Asian shore) before the place's marker is drawn at its true location. The
// base map has no place-name labels, so the only labels are the three shore
// regions and the three bodies of water.

// ---------- Shores ----------
const SHORES = {
  peninsula: { name: "Historic peninsula", on: "on the historic peninsula", color: "#b85a14",
               sub: "European side, south of the Golden Horn" },
  galata:    { name: "Galata", on: "in Galata, on the European side north of the Golden Horn", color: "#7b3fa0",
               sub: "European side, north of the Golden Horn" },
  asia:      { name: "Asian shore", on: "on the Asian shore", color: "#2e7d32",
               sub: "East of the Bosphorus" }
};
const SHORE_KEYS = ["peninsula", "galata", "asia"];

// ---------- Places (fixed order; coordinates checked against OpenStreetMap) ----------
const PLACES = [
  { name: "Sarayburnu (Seraglio Point)", label: "Sarayburnu", lat: 41.0156, lon: 28.9862, shore: "peninsula", dir: "right",
    info: "The tip of the peninsula, where Greek Byzantium stood and Topkapı Palace stands now." },
  { name: "Hagia Sophia", label: "Hagia Sophia", lat: 41.0086, lon: 28.9802, shore: "peninsula", dir: "right",
    info: "Built 537 as a cathedral; Day 2's chapter." },
  { name: "Column of Constantine (Çemberlitaş)", label: "Column of Constantine", lat: 41.0086, lon: 28.9713, shore: "peninsula", dir: "left",
    info: "Raised for the dedication of Constantinople in 330; still standing on Divan Yolu." },
  { name: "Golden Gate (Yedikule)", label: "Golden Gate", lat: 40.9932, lon: 28.9230, shore: "peninsula", dir: "bottom",
    info: "The ceremonial entrance at the southern end of the Theodosian land walls." },
  { name: "Edirnekapı (Gate of Adrianople)", label: "Edirnekapı", lat: 41.0309, lon: 28.9360, shore: "peninsula", dir: "left",
    info: "A gate of the land walls; Mehmed II rode in near here on May 29, 1453." },
  { name: "Fatih Mosque", label: "Fatih Mosque", lat: 41.0197, lon: 28.9498, shore: "peninsula", dir: "bottom",
    info: "Built by Mehmed II on the site of the Church of the Holy Apostles, where Constantine was buried." },
  { name: "Eminönü ferry piers", label: "Eminönü", lat: 41.0173, lon: 28.9738, shore: "peninsula", dir: "left",
    info: "The balık ekmek boats and the ferries to Asia leave from here." },
  { name: "Galata Tower", label: "Galata Tower", lat: 41.0256, lon: 28.9742, shore: "galata", dir: "right",
    info: "Built by the Genoese in 1348; the sunset view over the Golden Horn." },
  { name: "Rumeli Hisarı", label: "Rumeli Hisarı", lat: 41.0848, lon: 29.0566, shore: "galata", dir: "left",
    info: "Mehmed II's 1452 fortress at the narrows. It stands on the European shore north of Galata; for this quiz, all of the European side north of the Golden Horn counts as Galata." },
  { name: "Kadıköy ferry pier", label: "Kadıköy", lat: 40.9929, lon: 29.0229, shore: "asia", dir: "right",
    info: "Ancient Chalcedon, “the city of the blind.”" },
  { name: "Üsküdar", label: "Üsküdar", lat: 41.0268, lon: 29.0152, shore: "asia", dir: "right",
    info: "Ancient Chrysopolis, where Constantine defeated Licinius in 324." },
  { name: "Maiden's Tower (Kız Kulesi)", label: "Maiden's Tower", lat: 41.0210, lon: 29.0041, shore: "asia", dir: "right",
    info: "A small tower on an islet just off the Asian shore, opposite the peninsula." }
];

// Region and water labels (placed on land or water by eye)
const REGION_LABELS = [
  { key: "peninsula", lat: 41.0010, lon: 28.9450 },
  { key: "galata",    lat: 41.0450, lon: 28.9850 },
  { key: "asia",      lat: 41.0120, lon: 29.0520 }
];
const WATER_LABELS = [
  { text: "Bosphorus", lat: 41.0400, lon: 29.0170, rot: -55 },
  { text: "Golden Horn", lat: 41.0300, lon: 28.9600, rot: -32 },
  { text: "Sea of Marmara", lat: 40.9950, lon: 28.9760, rot: 0 }
];

const START_CENTER = [41.0230, 28.9850];   // where the Golden Horn meets the Bosphorus
const START_ZOOM = 12.25;
const MASTERY = 10;

// ---------- State ----------
let map, legendDiv;
let markers = [];      // one circleMarker per place, created once, added on reveal
let current = 0;
let answered = false;
let finished = false;
let score = 0;
let answers = [];      // learner's shore key per place
let widened = false;   // true after the view was widened to show an off-screen place

function shoreButtonHTML(key) {
  const s = SHORES[key];
  return '<span class="sw" style="background:' + s.color + '"></span>' + s.name;
}

function makeMarker(p, i) {
  const s = SHORES[p.shore];
  const m = L.circleMarker([p.lat, p.lon], {
    radius: 7, weight: 2, color: "#ffffff", fillColor: s.color, fillOpacity: 1
  });
  const offsets = { right: [9, 0], left: [-9, 0], top: [0, -9], bottom: [0, 9] };
  m.bindTooltip((i + 1) + ". " + p.label, { permanent: true, direction: p.dir, offset: offsets[p.dir], className: "place-label" });
  m.bindPopup("<b>" + (i + 1) + ". " + p.name + "</b><br>" + p.info +
              '<br><span style="color:' + s.color + ';font-weight:bold">' + s.name + "</span>", { autoPanPadding: [10, 10] });
  return m;
}

function addLabels() {
  REGION_LABELS.forEach(r => {
    const s = SHORES[r.key];
    L.marker([r.lat, r.lon], {
      interactive: false, keyboard: false,
      icon: L.divIcon({ className: "region-label", iconSize: [190, 34], iconAnchor: [95, 17],
        html: '<div style="color:' + s.color + '">' + s.name + "<small>" + s.sub + "</small></div>" })
    }).addTo(map);
  });
  WATER_LABELS.forEach(w => {
    L.marker([w.lat, w.lon], {
      interactive: false, keyboard: false,
      icon: L.divIcon({ className: "water-label", iconSize: [110, 16], iconAnchor: [55, 8],
        html: '<div style="transform: rotate(' + w.rot + 'deg)">' + w.text + "</div>" })
    }).addTo(map);
  });
}

function updateScore() {
  document.getElementById("score").innerHTML = "Shores correct: <b>" + score + " of " + PLACES.length + "</b>";
}

function renderQuestion() {
  const P = PLACES[current];
  answered = false;
  document.getElementById("qnum").innerHTML = "Place <b>" + (current + 1) + " of " + PLACES.length + "</b>";
  document.getElementById("qtext").textContent = P.name + ": which shore?";
  const box = document.getElementById("choices");
  box.innerHTML = "";
  SHORE_KEYS.forEach((key, n) => {
    const b = document.createElement("button");
    b.innerHTML = shoreButtonHTML(key);
    b.dataset.key = key;
    b.title = SHORES[key].sub + " (key " + (n + 1) + ")";
    b.addEventListener("click", () => answer(key));
    box.appendChild(b);
  });
  document.getElementById("feedback").innerHTML = "";
  const next = document.getElementById("next");
  next.disabled = true;
  next.textContent = current < PLACES.length - 1 ? "Next place" : "See result";
  updateScore();
}

function answer(key) {
  if (answered || finished) return;
  answered = true;
  const P = PLACES[current];
  const correct = key === P.shore;
  answers[current] = key;
  if (correct) score++;
  document.querySelectorAll("#choices button").forEach(b => {
    b.disabled = true;
    if (b.dataset.key === P.shore) b.classList.add("correct");
    else if (b.dataset.key === key) b.classList.add("wrong");
  });
  let html = correct
    ? '<span class="ok">Right: ' + P.name + " is " + SHORES[P.shore].on + ".</span> "
    : '<span class="no">Not quite: ' + P.name + " is " + SHORES[P.shore].on + ".</span> ";
  html += P.info;
  if (!correct && current === 7) html += " The Golden Horn separates Galata from the old city, but both are in Europe.";
  document.getElementById("feedback").innerHTML = html;
  updateScore();

  const m = markers[current];
  m.addTo(map);
  // If the place is off screen (Rumeli Hisarı), widen the view to show it with the Golden Horn.
  if (!map.getBounds().pad(-0.08).contains(m.getLatLng())) {
    const b = L.latLngBounds([[P.lat, P.lon], [PLACES[0].lat, PLACES[0].lon], [PLACES[7].lat, PLACES[7].lon]]);
    map.fitBounds(b, { paddingTopLeft: [60, 190], paddingBottomRight: [60, 20], animate: false });
    widened = true;
  }
  m.openPopup();
  document.getElementById("next").disabled = false;
}

function showResult() {
  finished = true;
  map.closePopup();
  document.getElementById("qnum").innerHTML = "<b>All twelve places answered</b>";
  document.getElementById("choices").innerHTML = "";
  const pass = score >= MASTERY;
  document.getElementById("qtext").innerHTML = "You scored " + score + " of 12. " + (pass
    ? "10 or more: you know your way around."
    : "Fewer than 10: look again at where the Golden Horn meets the Bosphorus, then try again.");
  document.getElementById("feedback").innerHTML =
    "Every place is now on the map. Places 1 to 7, everything Byzantine and early Ottoman, sit on the historic peninsula. " +
    "The Genoese tower and the Asian-side towns sit across the water from it. Click any dot to read about it, and drag to pan.";
  const next = document.getElementById("next");
  next.disabled = true;
  next.textContent = "Done";
  fitAll();
}

function fitAll() {
  const b = L.latLngBounds(PLACES.map(p => [p.lat, p.lon]));
  map.fitBounds(b, { paddingTopLeft: [70, 24], paddingBottomRight: [70, 24] });
}

function restart() {
  markers.forEach(m => map.removeLayer(m));
  map.closePopup();
  current = 0;
  score = 0;
  answers = [];
  finished = false;
  widened = false;
  map.setView(START_CENTER, START_ZOOM, { animate: false });
  renderQuestion();
}

function nextPlace() {
  if (!answered || finished) return;
  map.closePopup();
  if (widened) { map.setView(START_CENTER, START_ZOOM, { animate: false }); widened = false; }
  if (current < PLACES.length - 1) { current++; renderQuestion(); }
  else showResult();
}

document.addEventListener("DOMContentLoaded", function () {
  map = L.map("map", {
    scrollWheelZoom: false,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    minZoom: 11,
    maxZoom: 16
  });
  // Satellite imagery has no place names, so the map does not give the answers away.
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 17,
    attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics"
  }).addTo(map);
  map.setView(START_CENTER, START_ZOOM);
  // Drop the region subtitles when zoomed out, so the labels do not cover the places.
  map.on("zoomend", () => map.getContainer().classList.toggle("far", map.getZoom() < 12.2));

  addLabels();
  markers = PLACES.map((p, i) => makeMarker(p, i));

  const Legend = L.Control.extend({
    options: { position: "topright" },
    onAdd: function () {
      legendDiv = L.DomUtil.create("div", "legend");
      legendDiv.innerHTML = SHORE_KEYS.map(k =>
        '<div><span class="dot" style="background:' + SHORES[k].color + '"></span>' + SHORES[k].name + "</div>").join("");
      L.DomEvent.disableClickPropagation(legendDiv);
      return legendDiv;
    }
  });
  map.addControl(new Legend());

  document.getElementById("next").addEventListener("click", nextPlace);
  document.getElementById("restart").addEventListener("click", restart);
  document.addEventListener("keydown", e => {
    if (e.key === "1" || e.key === "2" || e.key === "3") answer(SHORE_KEYS[Number(e.key) - 1]);
    else if (e.key === "Enter") nextPlace();
  });
  window.addEventListener("resize", () => map.invalidateSize());
  restart();
});
