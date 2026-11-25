// Walking Venetian Candia - Leaflet.js
// CANVAS_HEIGHT: 656
// Locate-on-the-map quiz. Eight landmarks of Venetian and Ottoman Heraklion are
// asked in a fixed order. The learner clicks the unlabeled street map where the
// landmark stands; a click within 150 m of the reference point is correct.
// Each card allows two attempts and only the first is scored. After card 8 the
// map shows every marker and the line of our own walk on Day 9.

// ---------- Landmarks (fixed order; reference points checked against OpenStreetMap) ----------
const LANDMARKS = [
  { card: "Lions Square: the Morosini Fountain and the Basilica of San Marco",
    ask: "Where would you find the Lions?",
    label: "Morosini Fountain", lat: 35.3392, lon: 25.1333, dir: "left",
    info: "Venetian. Fountain built 1628 by the governor Francesco Morosini; San Marco first built in the 13th century, later a mosque, now an exhibition hall." },
  { card: "The Loggia, meeting hall of the Venetian nobility",
    label: "Loggia", lat: 35.3398, lon: 25.1342, dir: "left",
    info: "Venetian, built in the 1620s; damaged in the Second World War and restored; now part of city hall." },
  { card: "The Church of Agios Titos",
    label: "Agios Titos", lat: 35.3401, lon: 25.1347, dir: "right",
    info: "Byzantine foundation after 961; Catholic under Venice; a mosque under the Ottomans, rebuilt after the 1856 earthquake; an Orthodox church again from 1925. Holds the relic of Titus, returned from Venice in 1966." },
  { card: "The Venetian arsenal, the galley sheds",
    label: "Arsenal", lat: 35.3421, lon: 25.1352, dir: "left",
    info: "Venetian state shipyard: vaulted sheds where galleys were built and stored." },
  { card: "Koules Fortress, the Venetian sea fortress",
    label: "Koules", lat: 35.3446, lon: 25.1369, dir: "right",
    hint: " Look out along the harbor breakwater.",
    info: "Venetian <i>Rocca a Mare</i>, built 1523–1540 at the end of the harbor breakwater; named Koules (“tower”) by the Ottomans." },
  { card: "The Heraklion Archaeological Museum",
    label: "Archaeological Museum", lat: 35.3391, lon: 25.1374, dir: "right",
    info: "Modern museum (1937–1940) of Minoan Crete; where our Day 9 began (Chapter 13)." },
  { card: "The Martinengo Bastion and the grave of Nikos Kazantzakis",
    label: "Martinengo Bastion", lat: 35.3327, lon: 25.1307, dir: "right",
    hint: " The walls ring the town on its landward side.",
    info: "Venetian bastion, the southernmost of seven; Kazantzakis (1883–1957) is buried on top." },
  { card: "The Pantocrator Gate, also called the Chania Gate",
    label: "Pantocrator Gate", lat: 35.3370, lon: 25.1249, dir: "left",
    hint: " The walls ring the town on its landward side.",
    info: "Venetian gate in the western walls, on the road to Chania." }
];

// Our walk on Day 9: museum, Lions, Loggia, Agios Titos, arsenal, Koules (indexes into LANDMARKS)
const WALK = [5, 0, 1, 2, 3, 4];

const WATER_LABELS = [
  { text: "Sea of Crete", lat: 35.3458, lon: 25.1290 },
  { text: "Old harbor", lat: 35.3436, lon: 25.1341 }
];

// The old town inside the walls, plus the harbor breakwater
const START_BOUNDS = [[35.3292, 25.1222], [35.3462, 25.1418]];
const RADIUS_M = 150;
const MASTERY = 6;

const COLOR_TRUE = "#5a1f1a";
const COLOR_OK = "#2e7d32";
const COLOR_MISS = "#c62828";

// ---------- State ----------
let map;
let current = 0;
let tries = 0;          // attempts used on the current card
let resolved = false;   // current card answered (correct or revealed)
let finished = false;
let score = 0;
let firstOk = [];       // true/false per card, first attempt
let cardLayers = [];    // layers drawn for each card (clicks, lines)
let trueMarkers = [];   // reference markers, created once, added on reveal
let walkLayer = null;

// ---------- Geometry ----------
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function fmtM(d) { return Math.round(d).toLocaleString("en-US"); }

// ---------- Markers ----------
function makeTrueMarker(p, i) {
  const m = L.circleMarker([p.lat, p.lon], {
    radius: 7, weight: 2, color: "#ffffff", fillColor: COLOR_TRUE, fillOpacity: 1, bubblingMouseEvents: false
  });
  const offsets = { right: [9, 0], left: [-9, 0], top: [0, -9], bottom: [0, 9] };
  m.bindTooltip((i + 1) + ". " + p.label, { permanent: true, direction: p.dir, offset: offsets[p.dir], className: "place-label" });
  m.bindPopup("<b>" + (i + 1) + ". " + p.card + "</b><br>" + p.info, { autoPanPadding: [12, 12] });
  return m;
}

function drawClick(latlng, ok) {
  const c = L.circleMarker(latlng, {
    radius: 5, weight: 2, color: ok ? COLOR_OK : COLOR_MISS, fillColor: "#fff", fillOpacity: 1,
    interactive: false
  }).addTo(map);
  cardLayers[current].push(c);
}

function drawDistanceLine(latlng, p, d) {
  const ln = L.polyline([latlng, [p.lat, p.lon]], {
    color: "#555", weight: 2, dashArray: "4 4", interactive: false
  }).addTo(map);
  if (d >= 40) {
    ln.bindTooltip(fmtM(d) + " m", { permanent: true, direction: "center", className: "dist-label" });
  }
  cardLayers[current].push(ln);
}

// ---------- Quiz ----------
function updateScore() {
  document.getElementById("score").innerHTML = "First-attempt score: <b>" + score + " of " + LANDMARKS.length + "</b>";
}

function renderCard() {
  const P = LANDMARKS[current];
  tries = 0;
  resolved = false;
  cardLayers[current] = [];
  document.getElementById("qnum").innerHTML = "Card <b>" + (current + 1) + " of " + LANDMARKS.length + "</b>";
  document.getElementById("qtext").innerHTML = P.card + "<br><small>" +
    (P.ask || "Click the map where it stands.") + " Two tries; the first one counts.</small>";
  document.getElementById("feedback").innerHTML = "";
  const next = document.getElementById("next");
  next.disabled = true;
  next.textContent = current < LANDMARKS.length - 1 ? "Next card" : "See result";
  updateScore();
}

function reveal(latlng, d) {
  const P = LANDMARKS[current];
  resolved = true;
  drawDistanceLine(latlng, P, d);
  const m = trueMarkers[current];
  m.addTo(map);
  m.openPopup();
  document.getElementById("next").disabled = false;
}

function onMapClick(e) {
  if (resolved || finished) return;
  const P = LANDMARKS[current];
  const d = haversine(e.latlng.lat, e.latlng.lng, P.lat, P.lon);
  const ok = d <= RADIUS_M;
  tries++;
  if (tries === 1) firstOk[current] = ok;
  if (ok && tries === 1) score++;
  drawClick(e.latlng, ok);
  const fb = document.getElementById("feedback");
  if (ok) {
    fb.innerHTML = '<span class="ok">Correct: ' + fmtM(d) + " m away.</span> " + P.info +
      (tries === 2 ? " (Second try, so it does not add to the score.)" : "");
    reveal(e.latlng, d);
  } else if (tries === 1) {
    fb.innerHTML = '<span class="no">Not quite: ' + fmtM(d) + " m away. Try again.</span>" + (P.hint || "");
  } else {
    fb.innerHTML = '<span class="here">Here it is.</span> You were ' + fmtM(d) + " m away. " + P.info;
    reveal(e.latlng, d);
  }
  updateScore();
}

function showResult() {
  finished = true;
  map.closePopup();
  map.getContainer().classList.add("done");
  trueMarkers.forEach(m => m.addTo(map));
  const pts = WALK.map(i => [LANDMARKS[i].lat, LANDMARKS[i].lon]);
  walkLayer = L.polyline(pts, { color: "#1565c0", weight: 4, opacity: 0.85, dashArray: "8 6", interactive: false }).addTo(map);
  const pass = score >= MASTERY;
  document.getElementById("qnum").innerHTML = "<b>All eight cards answered</b>";
  document.getElementById("qtext").innerHTML = "First-attempt score: " + score + " of 8. " +
    (pass ? "You could walk Venetian Candia without a map." : "Try again, starting from the Lions.");
  document.getElementById("feedback").innerHTML =
    "The blue dashed line joins the stops of our walk on Day 9: museum, Lions, Loggia, Agios Titos, arsenal, Koules. " +
    "Cards 1 to 5 lie on one short downhill route to the sea, less than a kilometer from the Lions to the Koules, " +
    "while the walls (cards 7 and 8) ring the town's upper edge. Click any marker to read about it again.";
  const next = document.getElementById("next");
  next.disabled = true;
  next.textContent = "Done";
  map.fitBounds(START_BOUNDS, { padding: [6, 6] });
}

function restart() {
  cardLayers.forEach(arr => (arr || []).forEach(l => map.removeLayer(l)));
  trueMarkers.forEach(m => map.removeLayer(m));
  if (walkLayer) { map.removeLayer(walkLayer); walkLayer = null; }
  map.closePopup();
  map.getContainer().classList.remove("done");
  cardLayers = [];
  current = 0;
  score = 0;
  firstOk = [];
  finished = false;
  map.fitBounds(START_BOUNDS, { padding: [6, 6], animate: false });
  renderCard();
}

function nextCard() {
  if (!resolved || finished) return;
  map.closePopup();
  if (current < LANDMARKS.length - 1) { current++; renderCard(); }
  else showResult();
}

function addWaterLabels() {
  WATER_LABELS.forEach(w => {
    L.marker([w.lat, w.lon], {
      interactive: false, keyboard: false,
      icon: L.divIcon({ className: "water-label", iconSize: [110, 16], iconAnchor: [55, 8],
        html: "<div>" + w.text + "</div>" })
    }).addTo(map);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  map = L.map("map", {
    scrollWheelZoom: false,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    minZoom: 13,
    maxZoom: 18
  });
  // Esri's light gray street base has no place-name labels, so the base map does not give the answers away.
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18,
    maxNativeZoom: 16,
    attribution: "Base map &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors"
  }).addTo(map);
  map.fitBounds(START_BOUNDS, { padding: [6, 6] });

  addWaterLabels();
  trueMarkers = LANDMARKS.map((p, i) => makeTrueMarker(p, i));

  const Legend = L.Control.extend({
    options: { position: "topright" },
    onAdd: function () {
      const div = L.DomUtil.create("div", "legend");
      div.innerHTML =
        '<div><span class="dot" style="background:' + COLOR_TRUE + '"></span>Landmark</div>' +
        '<div><span class="dot" style="background:#fff;box-shadow:0 0 0 2px ' + COLOR_OK + '"></span>Your click, within 150 m</div>' +
        '<div><span class="dot" style="background:#fff;box-shadow:0 0 0 2px ' + COLOR_MISS + '"></span>Your click, a miss</div>' +
        '<div><span class="ln"></span>Our walk (after card 8)</div>';
      L.DomEvent.disableClickPropagation(div);
      return div;
    }
  });
  map.addControl(new Legend());
  // A scale bar helps judge the 150 m target.
  L.control.scale({ position: "bottomleft", maxWidth: 120 }).addTo(map);

  map.on("click", onMapClick);
  document.getElementById("next").addEventListener("click", nextCard);
  document.getElementById("restart").addEventListener("click", restart);
  document.addEventListener("keydown", e => { if (e.key === "Enter") nextCard(); });
  window.addEventListener("resize", () => map.invalidateSize());
  restart();
});
