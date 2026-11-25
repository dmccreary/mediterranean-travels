// Where the Empire Withdrew, 1683–1923 - Leaflet.js
// CANVAS_HEIGHT: 690
// Predict-then-reveal map quiz. Fourteen places of the former Ottoman Empire
// are asked in a fixed order. The learner sees each place and a short undated
// description, commits to one of four eras, and only then sees what happened,
// with dates, and the place's marker takes its era color. After place 14 the
// learner replays the four eras; each step shows the places lost by the end
// of that era, cumulatively. The base map has no place names or borders.

// ---------- Eras ----------
const ERAS = [
  { n: 1, years: "1683–1829", color: "#6a3d9a",
    blurb: "From the failed siege of Vienna to the eve of Greek independence: the Habsburgs and Russia take the northern edges, Hungary and Crimea." },
  { n: 2, years: "1830–1878", color: "#1f78b4",
    blurb: "From Greek independence to the Congress of Berlin: Greece and Serbia win states of their own, France takes Algiers, Britain takes over Cyprus." },
  { n: 3, years: "1879–1913", color: "#d95f02",
    blurb: "To the end of the Balkan Wars: Britain occupies Egypt, Italy takes Rhodes, and Greece takes Thessaloniki and Crete. The Arab provinces are still Ottoman." },
  { n: 4, years: "1914–1923", color: "#b2182b",
    blurb: "World War I and after: the Arab Revolt and the British armies take the Hejaz, Iraq, Palestine and Syria. What remains becomes the Republic of Turkey in 1923." }
];

// ---------- Places (fixed order; coordinates are standard city-center values) ----------
// era is 1-based. ctx is shown before the answer (no dates of loss); what and why after it.
const PLACES = [
  { name: "Buda", label: "Buda", lat: 47.50, lon: 19.04, era: 1, dir: "right",
    ctx: "Buda, the royal city of Hungary, today part of Budapest.",
    what: "Taken by Habsburg forces in 1686; Hungary ceded at Karlowitz in 1699.",
    why: "Hungary was the first large, permanent loss, a generation after the failed siege of Vienna." },
  { name: "Bakhchysarai", label: "Bakhchysarai", lat: 44.75, lon: 33.88, era: 1, dir: "right",
    ctx: "Bakhchysarai, capital of the Crimean Khanate, a Muslim Tatar state that owed allegiance to the sultan.",
    what: "Made independent of the sultan in 1774 (Treaty of Küçük Kaynarca); annexed by Russia in 1783.",
    why: "Crimea went to Russia long before any Balkan nation became independent." },
  { name: "Athens", label: "Athens", lat: 37.97, lon: 23.73, era: 2, dir: "left",
    ctx: "Athens, the city of the Acropolis, in the heart of the Greek revolt that began in 1821.",
    what: "Greece recognized as independent in 1830; the Ottoman garrison left the Acropolis in 1833.",
    why: "The revolt began in 1821, but recognition came in 1830: Greece was the first Christian people of the empire to win full independence." },
  { name: "Algiers", label: "Algiers", lat: 36.75, lon: 3.06, era: 2, dir: "right",
    ctx: "Algiers, capital of a self-governing North African province that still recognized the sultan.",
    what: "Conquered by France in 1830.",
    why: "Algiers passed to another empire, France, not to independence." },
  { name: "Belgrade", label: "Belgrade", lat: 44.82, lon: 20.46, era: 2, dir: "right",
    ctx: "Belgrade, the fortress city where the Sava meets the Danube.",
    what: "Serbia self-governing from 1830; the last Ottoman garrison left in 1867; independence recognized in 1878.",
    why: "Serbia left in stages over half a century, completed at the Congress of Berlin. All three dates fall in Era 2." },
  { name: "Nicosia, Cyprus", label: "Nicosia", lat: 35.17, lon: 33.36, era: 2, dir: "top",
    ctx: "Nicosia, the capital of Cyprus, Ottoman since 1571.",
    what: "Placed under British administration by the Cyprus Convention of 1878.",
    why: "Britain took over Cyprus in the year of the Congress of Berlin. The island stayed nominally Ottoman until Britain annexed it in 1914, but Ottoman rule ended in 1878." },
  { name: "Cairo", label: "Cairo", lat: 30.04, lon: 31.24, era: 3, dir: "left",
    ctx: "Cairo, capital of Egypt, conquered by Selim I in 1517 and later ruled by its own khedives.",
    what: "Occupied by Britain in 1882.",
    why: "Egypt had long run its own affairs; British troops made the break final in 1882. Egypt stayed nominally Ottoman until Britain declared a protectorate in 1914." },
  { name: "Heraklion, Crete", label: "Heraklion", lat: 35.34, lon: 25.13, era: 3, dir: "bottom",
    ctx: "Heraklion (Candia) on Crete, Ottoman since a siege that ended in 1669.",
    what: "Autonomous Cretan State from 1898; united with Greece in 1913.",
    why: "Crete is scored by its first departure from direct Ottoman rule, 1898: it left as an autonomous state first and joined Greece fifteen years later. Both dates fall in Era 3." },
  { name: "Rhodes", label: "Rhodes", lat: 36.44, lon: 28.22, era: 3, dir: "top",
    ctx: "Rhodes, the island of the Knights, Ottoman since 1522.",
    what: "Taken by Italy in 1912, in the Italo-Turkish War.",
    why: "Rhodes went to Italy, not Greece, and was handed to Greece only in 1947, with formal union in 1948." },
  { name: "Thessaloniki", label: "Thessaloniki", lat: 40.64, lon: 22.94, era: 3, dir: "left",
    ctx: "Thessaloniki, the great port of Ottoman Macedonia and Mustafa Kemal's birthplace.",
    what: "Taken by Greece in 1912, in the First Balkan War.",
    why: "Atatürk's birthplace became Greek when he was 31." },
  { name: "Mecca", label: "Mecca", lat: 21.42, lon: 39.83, era: 4, dir: "right",
    ctx: "Mecca, the holiest city of Islam, in the Hejaz; the sultans guarded it from 1517.",
    what: "The Arab Revolt began in 1916; the Hejaz became an independent kingdom.",
    why: "The Arab provinces stayed Ottoman until World War I. The Ottoman garrison of Medina held out until January 1919." },
  { name: "Baghdad", label: "Baghdad", lat: 33.31, lon: 44.36, era: 4, dir: "right",
    ctx: "Baghdad on the Tigris, the old capital of the Abbasid caliphs.",
    what: "Taken by Britain in March 1917.",
    why: "Mesopotamia, first conquered by Süleyman in 1534, fell only in the war." },
  { name: "Jerusalem", label: "Jerusalem", lat: 31.78, lon: 35.22, era: 4, dir: "left",
    ctx: "Jerusalem, holy to Jews, Christians and Muslims.",
    what: "Taken by Britain in December 1917.",
    why: "Jerusalem had been Ottoman since 1517 and fell four centuries later, in December 1917." },
  { name: "Damascus", label: "Damascus", lat: 33.51, lon: 36.29, era: 4, dir: "left",
    ctx: "Damascus, the Syrian city where the pilgrim caravan to Mecca gathered each year.",
    what: "Taken by British and Arab forces on October 1, 1918.",
    why: "Syria was among the very last provinces lost, in the final weeks of the war." }
];

// Reference places: shown, not scored.
const REFS = [
  { name: "Istanbul", lat: 41.01, lon: 28.98, dir: "top", info: "Ottoman capital until 1922; Turkish ever since." },
  { name: "Ankara", lat: 39.93, lon: 32.86, dir: "right", info: "Capital of the Republic of Turkey from 1923." }
];

const MASTERY = 10;
const QUESTION = "In which era did this place leave Ottoman rule?";

// ---------- State ----------
let map;
let markers = [];
let current = 0;
let answered = false;
let finished = false;
let score = 0;
let answers = [];
let replayStep = 0;   // 0 = no replay yet; 1..4 = showing places lost by end of that era

const OFFSETS = { right: [8, 0], left: [-8, 0], top: [0, -8], bottom: [0, 8] };

function eraButtonHTML(e) {
  return '<span class="sw" style="background:' + e.color + '"></span>Era ' + e.n + "<small>" + e.years + "</small>";
}

function makeMarker(p, i) {
  const m = L.circleMarker([p.lat, p.lon], { radius: 6, weight: 2, color: "#5a6670", fillColor: "#ffffff", fillOpacity: 1 });
  m.bindTooltip(String(i + 1), { permanent: true, direction: p.dir, offset: OFFSETS[p.dir], className: "place-label" });
  return m;
}

// Marker states: "open" (unanswered), "current", "revealed" (era color), "ottoman" (still Ottoman in replay)
function setMarker(i, state) {
  const p = PLACES[i], m = markers[i], e = ERAS[p.era - 1];
  const tip = m.getTooltip();
  if (state === "open") {
    m.setStyle({ radius: 6, weight: 2, color: "#5a6670", fillColor: "#ffffff" });
    tip.setContent(String(i + 1));
    tip.getElement && tip.getElement() && tip.getElement().classList.remove("cur");
  } else if (state === "current") {
    m.setStyle({ radius: 9, weight: 3, color: "#12304a", fillColor: "#ffe066" });
    tip.setContent((i + 1) + ". " + p.label);
    m.bringToFront();
  } else if (state === "revealed") {
    m.setStyle({ radius: 7, weight: 2, color: "#ffffff", fillColor: e.color });
    tip.setContent((i + 1) + ". " + p.label);
  } else if (state === "ottoman") {
    m.setStyle({ radius: 6, weight: 2, color: "#5a6670", fillColor: "#ffffff" });
    tip.setContent((i + 1) + ". " + p.label);
  }
  const el = tip.getElement ? tip.getElement() : null;
  if (el) el.classList.toggle("cur", state === "current");
  m.unbindPopup();
  if (state === "revealed" || (state === "ottoman" && finished)) {
    m.bindPopup("<b>" + (i + 1) + ". " + p.name + "</b><br>" + p.what + "<br>" +
      '<span style="color:' + e.color + ';font-weight:bold">Era ' + e.n + " (" + e.years + ")</span>", { autoPanPadding: [10, 10] });
  }
}

function addRefs() {
  REFS.forEach(r => {
    const m = L.marker([r.lat, r.lon], {
      keyboard: false,
      icon: L.divIcon({ className: "ref-icon", iconSize: [15, 15], iconAnchor: [7, 7], html: "<div></div>" })
    }).addTo(map);
    m.bindTooltip(r.name, { permanent: true, direction: r.dir, offset: { top: [0, -6], bottom: [0, 6], right: [6, 0], left: [-6, 0] }[r.dir], className: "ref-label" });
    m.bindPopup("<b>" + r.name + "</b> (reference, not scored)<br>" + r.info);
  });
}

function updateScore() {
  document.getElementById("score").innerHTML = "Correct: <b>" + score + " of " + PLACES.length + "</b>";
}

function renderQuestion() {
  const P = PLACES[current];
  answered = false;
  document.getElementById("qnum").innerHTML = "Place <b>" + (current + 1) + " of " + PLACES.length + "</b>";
  document.getElementById("qtext").textContent = P.name + ": " + QUESTION;
  const box = document.getElementById("choices");
  box.innerHTML = "";
  ERAS.forEach(e => {
    const b = document.createElement("button");
    b.innerHTML = eraButtonHTML(e);
    b.dataset.era = e.n;
    b.title = "Era " + e.n + ", " + e.years + " (key " + e.n + ")";
    b.addEventListener("click", () => answer(e.n));
    box.appendChild(b);
  });
  document.getElementById("feedback").innerHTML = '<span class="ctx">' + P.ctx + "</span>";
  const next = document.getElementById("next");
  next.disabled = true;
  next.textContent = current < PLACES.length - 1 ? "Next place" : "See result";
  setMarker(current, "current");
  updateScore();
}

function answer(n) {
  if (answered || finished) return;
  answered = true;
  const P = PLACES[current];
  const E = ERAS[P.era - 1];
  const correct = n === P.era;
  answers[current] = n;
  if (correct) score++;
  document.querySelectorAll("#choices button").forEach(b => {
    b.disabled = true;
    if (Number(b.dataset.era) === P.era) b.classList.add("correct");
    else if (Number(b.dataset.era) === n) b.classList.add("wrong");
  });
  const head = correct
    ? '<span class="ok">Correct:</span> '
    : '<span class="no">This place left in Era ' + E.n + " (" + E.years + "):</span> ";
  document.getElementById("feedback").innerHTML = head + P.why + " <i>" + P.what + "</i>";
  setMarker(current, "revealed");
  updateScore();
  document.getElementById("next").disabled = false;
}

function showResult() {
  finished = true;
  map.closePopup();
  const pass = score >= MASTERY;
  document.getElementById("qnum").innerHTML = "<b>All fourteen places answered</b>";
  document.getElementById("qtext").textContent = "You scored " + score + " of 14. " + (pass
    ? "You can see the shape of the retreat: Europe's edges first, the Arab lands last."
    : "Look again at the Arab cities and at Rhodes: which ones stayed Ottoman until the very end?");
  const box = document.getElementById("choices");
  box.innerHTML = "";
  ERAS.forEach(e => {
    const b = document.createElement("button");
    b.className = "step";
    b.innerHTML = '<span class="sw" style="background:' + e.color + '"></span>By ' + e.years.slice(-4) + "<small>end of Era " + e.n + "</small>";
    b.dataset.era = e.n;
    b.title = "Show the places lost by the end of Era " + e.n + " (key " + e.n + ")";
    b.addEventListener("click", () => replay(e.n));
    box.appendChild(b);
  });
  const next = document.getElementById("next");
  next.textContent = "Replay next era";
  next.disabled = false;
  replay(1);
  fitAll();
}

// Show the places lost by the end of era k, cumulatively.
function replay(k) {
  replayStep = k;
  PLACES.forEach((p, i) => setMarker(i, p.era <= k ? "revealed" : "ottoman"));
  document.querySelectorAll("#choices button.step").forEach(b => b.classList.toggle("on", Number(b.dataset.era) === k));
  const lost = PLACES.filter(p => p.era <= k).length;
  const E = ERAS[k - 1];
  document.getElementById("feedback").innerHTML = "<b>Era " + E.n + ", " + E.years + ":</b> " + E.blurb +
    " Lost by " + E.years.slice(-4) + ": <b>" + lost + " of 14</b>; white dots were still Ottoman. Click any dot to read about it.";
  const next = document.getElementById("next");
  next.disabled = k >= 4;
}

function fitAll() {
  const pts = PLACES.map(p => [p.lat, p.lon]).concat(REFS.map(r => [r.lat, r.lon]));
  map.fitBounds(L.latLngBounds(pts), { paddingTopLeft: [24, 18], paddingBottomRight: [40, 18], animate: false });
}

function restart() {
  map.closePopup();
  current = 0;
  score = 0;
  answers = [];
  finished = false;
  replayStep = 0;
  PLACES.forEach((p, i) => setMarker(i, "open"));
  fitAll();
  renderQuestion();
}

function nextPlace() {
  if (finished) { if (replayStep > 0 && replayStep < 4) replay(replayStep + 1); return; }
  if (!answered) return;
  map.closePopup();
  if (current < PLACES.length - 1) { current++; renderQuestion(); }
  else showResult();
}

document.addEventListener("DOMContentLoaded", function () {
  map = L.map("map", {
    scrollWheelZoom: false,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    minZoom: 3,
    maxZoom: 8,
    worldCopyJump: false
  });
  // The ocean base map has relief and sea depths but no place names or modern borders,
  // so it neither gives away the answers nor draws today's frontiers onto the past.
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 10,
    attribution: "Tiles &copy; Esri, GEBCO, NOAA, National Geographic"
  }).addTo(map);
  L.control.scale({ position: "bottomright", imperial: false, maxWidth: 90 }).addTo(map);
  fitAll();

  markers = PLACES.map((p, i) => makeMarker(p, i).addTo(map));
  addRefs();

  const Legend = L.Control.extend({
    options: { position: "bottomleft" },
    onAdd: function () {
      const d = L.DomUtil.create("div", "legend");
      d.innerHTML = '<div class="lt">Left Ottoman rule in</div>' +
        ERAS.map(e => '<div><span class="dot" style="background:' + e.color + '"></span>Era ' + e.n + ": " + e.years + "</div>").join("") +
        '<div><span class="dot" style="background:#fff"></span>Not yet answered / still Ottoman</div>' +
        '<div><span class="sq"></span>Reference city (not scored)</div>';
      L.DomEvent.disableClickPropagation(d);
      return d;
    }
  });
  map.addControl(new Legend());

  document.getElementById("next").addEventListener("click", nextPlace);
  document.getElementById("restart").addEventListener("click", restart);
  document.addEventListener("keydown", e => {
    if (["1", "2", "3", "4"].includes(e.key)) {
      if (finished) replay(Number(e.key)); else answer(Number(e.key));
    } else if (e.key === "Enter") nextPlace();
  });
  window.addEventListener("resize", () => { map.invalidateSize(); });
  restart();
});
