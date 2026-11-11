// Viking Cruise Map MicroSim - Leaflet.js
// CANVAS_HEIGHT: 640
// Interactive port-by-port map of the Viking Star "Ancient Mediterranean
// Treasures" cruise, Istanbul to Athens, November 14-21, 2026.
// Click a numbered pin, a numbered dot, or use Previous/Next (or the arrow keys)
// to step through the ports. Each leg of the sea route is highlighted as you go.

// ---------- Cruise data ----------
// "leg" is the approximate sea track sailed to reach this stop from the previous one.
const stops = [
  {
    name: "Istanbul", country: "Turkey", coords: [41.0256, 28.9830], zoom: 12,
    dates: "Sat Nov 14 – Sun Nov 15", days: "Cruise days 1–2",
    arrive: "Embark Saturday", depart: "Sunday 6:00 PM",
    intro: "The cruise begins with an overnight in the city that straddles Europe and Asia, giving you most of two days before the ship sails down the Sea of Marmara.",
    sights: [
      ["Hagia Sophia", "the 6th-century domed basilica turned mosque, the city's defining monument."],
      ["Blue Mosque", "six minarets and an interior covered in blue Iznik tiles, right across the square."],
      ["Topkapi Palace", "seat of the Ottoman sultans, with the treasury and harem."],
      ["Grand Bazaar and Spice Bazaar", "covered markets for carpets, ceramics, spices and Turkish delight."],
      ["Basilica Cistern", "an atmospheric underground Byzantine reservoir with Medusa-head columns."],
      ["Bosphorus cruise", "the best way to see the palaces and waterfront mansions on both continents."]
    ],
    tip: "The main sights cluster in Sultanahmet, a short tram ride from the Galataport cruise terminal."
  },
  {
    name: "Çanakkale (Troy)", country: "Turkey", coords: [40.1553, 26.4062], zoom: 10,
    dates: "Mon Nov 16", days: "Cruise day 3",
    arrive: "9:00 AM", depart: "4:00 PM",
    intro: "A port on the Dardanelles, the narrow strait between the Aegean and the Sea of Marmara. It is the gateway to both ancient Troy and the Gallipoli battlefields.",
    sights: [
      ["Troy (Truva)", "layered ruins of the ancient city, with walls, ramparts and a wooden horse replica."],
      ["Troy Museum", "an excellent modern museum next to the site."],
      ["Gallipoli Peninsula", "WWI battlefields, memorials and cemeteries, including ANZAC Cove."],
      ["Çanakkale waterfront", "the Trojan horse prop from the 2004 film, and an easy town stroll."]
    ],
    tip: "Troy and Gallipoli are in opposite directions, so there is probably time for only one.",
    leg: [[40.97,28.70],[40.80,28.00],[40.62,27.30],[40.45,26.80],[40.40,26.68],[40.27,26.52]]
  },
  {
    name: "Kusadasi (Ephesus)", country: "Turkey", coords: [37.8620, 27.2560], zoom: 10,
    dates: "Tue Nov 17", days: "Cruise day 4",
    arrive: "7:00 AM", depart: "6:00 PM",
    intro: "A resort town on the Aegean coast and the port for Ephesus, one of the best-preserved Greco-Roman cities anywhere.",
    sights: [
      ["Ephesus", "the Library of Celsus, the Great Theatre, Curetes Street and the Temple of Hadrian."],
      ["Terrace Houses", "wealthy Roman homes with mosaics and frescoes; worth the extra ticket."],
      ["House of the Virgin Mary", "a pilgrimage site in the hills above Ephesus."],
      ["Temple of Artemis", "one remaining column of the ancient wonder; a quick stop in Selçuk."],
      ["Ephesus Archaeological Museum", "artifacts from the site, also in Selçuk."]
    ],
    tip: "The Ephesus excursion is the most popular of the cruise and tends to fill up, so book early.",
    leg: [[40.02,26.17],[39.85,25.92],[39.40,25.72],[38.90,25.70],[38.40,25.75],[38.10,26.00],[38.00,26.60],[37.92,27.00]]
  },
  {
    name: "Rhodes", country: "Greece", coords: [36.4510, 28.2278], zoom: 10,
    dates: "Wed Nov 18", days: "Cruise day 5",
    arrive: "7:00 AM", depart: "6:00 PM",
    intro: "The largest of the Dodecanese islands. The ship docks beside one of the best-preserved medieval walled towns in Europe.",
    sights: [
      ["Medieval Old Town (UNESCO)", "walkable from the port; the Street of the Knights and the Palace of the Grand Master."],
      ["Archaeological Museum", "housed in the Knights' Hospital."],
      ["Acropolis of Lindos", "a hilltop ancient acropolis with sea views, about an hour's drive away."],
      ["Mandraki Harbor", "legendary site of the Colossus, with deer statues marking the entrance."],
      ["Jewish Quarter", "a quieter corner of the Old Town with a synagogue and square."]
    ],
    tip: "Lindos is the best day trip on the island; the Old Town is easy to do on your own afterward.",
    leg: [[37.70,27.02],[37.40,26.85],[37.00,26.75],[36.62,26.85],[36.50,27.20],[36.50,27.60],[36.50,28.00]]
  },
  {
    name: "Heraklion, Crete", country: "Greece", coords: [35.3447, 25.1442], zoom: 10,
    dates: "Thu Nov 19", days: "Cruise day 6",
    arrive: "7:00 AM", depart: "6:00 PM",
    intro: "The capital of Crete and the gateway to the Minoan civilization, Europe's oldest, which flourished here some 3,500 years ago.",
    sights: [
      ["Knossos Palace", "the Minoan palace about 5 miles from the port; the most important site on the island."],
      ["Heraklion Archaeological Museum", "the world's finest Minoan collection, including the frescoes and the Phaistos Disc."],
      ["Koules fortress", "the Venetian fort guarding the old harbor, within walking distance."],
      ["Old city center", "the Venetian Loggia, Morosini Fountain and Agios Titos Church."]
    ],
    tip: "Visit the museum before or after Knossos; it gives the ruins their context.",
    leg: [[36.40,27.88],[36.30,27.60],[36.02,27.00],[35.62,26.30],[35.47,25.60]]
  },
  {
    name: "Athens (Piraeus)", country: "Greece", coords: [37.9420, 23.6365], zoom: 11,
    dates: "Fri Nov 20 – Sat Nov 21", days: "Cruise days 7–8",
    arrive: "Friday 7:00 AM", depart: "Disembark Saturday",
    intro: "The voyage ends with a full day and a final night aboard in Piraeus, the port of Athens, before disembarking on Saturday morning.",
    sights: [
      ["Acropolis and Parthenon", "the 5th-century BC temple complex above the city."],
      ["Acropolis Museum", "the Parthenon sculptures in a striking modern building at the foot of the hill."],
      ["Ancient Agora", "the civic heart of classical Athens, with the well-preserved Temple of Hephaestus."],
      ["Plaka", "the old quarter below the Acropolis, good for wandering and tavernas."],
      ["National Archaeological Museum", "Greece's largest collection of antiquities."],
      ["Syntagma Square", "the changing of the guard in front of Parliament."]
    ],
    tip: "Central Athens is about 30 minutes from the Piraeus cruise terminal by taxi or metro.",
    leg: [[35.55,25.05],[36.00,24.60],[36.50,24.20],[37.00,24.00],[37.50,23.85],[37.80,23.68]]
  }
];

// ---------- Map ----------
const map = L.map("map", { zoomControl: true });
// Base maps that need no API key. Use the layer switcher (top right) if one fails to load.
const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/";
const baseMaps = {
  "Street map": L.tileLayer(esri + "World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18,
    attribution: "Tiles &copy; Esri"
  }),
  "Satellite": L.tileLayer(esri + "World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 18,
    attribution: "Tiles &copy; Esri, Maxar, Earthstar Geographics"
  }),
  "OpenStreetMap": L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
};
baseMaps["Street map"].addTo(map);
L.control.layers(baseMaps, null, { collapsed: false }).addTo(map);

// Build each leg as a full path: previous port -> waypoints -> this port.
const legPaths = stops.map((s, i) =>
  i === 0 ? null : [stops[i - 1].coords, ...s.leg, s.coords]
);

const legLines = legPaths.map(p =>
  p ? L.polyline(p, { color: "#1f6f8b", weight: 3, opacity: 0.7, dashArray: "7 7" }).addTo(map) : null
);

const allPoints = legPaths.filter(Boolean).flat();
const routeBounds = L.latLngBounds(allPoints).pad(0.08);

function pinIcon(n, active) {
  return L.divIcon({
    className: "",
    html: '<div class="pin' + (active ? " active" : "") + '">' + n + "</div>",
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

const markers = stops.map((s, i) =>
  L.marker(s.coords, { icon: pinIcon(i + 1, false), zIndexOffset: 100 })
    .bindTooltip(s.name, { direction: "top", offset: [0, -14] })
    .on("click", () => show(i, true))
    .addTo(map)
);

// ---------- Panel ----------
const detail = document.getElementById("detail");
const dots = document.getElementById("dots");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
let current = 0;

stops.forEach((s, i) => {
  const b = document.createElement("button");
  b.textContent = i + 1;
  b.title = s.name;
  b.addEventListener("click", () => show(i, true));
  dots.appendChild(b);
});

function esc(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function show(i, fly) {
  current = i;
  const s = stops[i];
  detail.innerHTML =
    '<div class="stopnum">Port ' + (i + 1) + " of " + stops.length + " · " + esc(s.days) + "</div>" +
    "<h2>" + esc(s.name) + "</h2>" +
    '<div class="country">' + esc(s.country) + "</div>" +
    '<dl class="facts">' +
      "<dt>Date</dt><dd>" + esc(s.dates) + "</dd>" +
      "<dt>Arrive</dt><dd>" + esc(s.arrive) + "</dd>" +
      "<dt>Depart</dt><dd>" + esc(s.depart) + "</dd>" +
    "</dl>" +
    "<p>" + esc(s.intro) + "</p>" +
    "<h3>Key things to see</h3><ul>" +
    s.sights.map(x => "<li><b>" + esc(x[0]) + ":</b> " + esc(x[1]) + "</li>").join("") +
    "</ul>" +
    '<div class="tip">' + esc(s.tip) + "</div>";
  detail.scrollTop = 0;

  markers.forEach((m, j) => {
    m.setIcon(pinIcon(j + 1, j === i));
    m.setZIndexOffset(j === i ? 1000 : 100);
  });
  legLines.forEach((l, j) => {
    if (!l) return;
    // Sailed legs solid, the leg arriving at this port highlighted, future legs dashed.
    if (j === i) l.setStyle({ color: "#c8963e", weight: 5, opacity: 1, dashArray: null });
    else if (j < i) l.setStyle({ color: "#12304a", weight: 3, opacity: 0.8, dashArray: null });
    else l.setStyle({ color: "#1f6f8b", weight: 3, opacity: 0.7, dashArray: "7 7" });
  });
  [...dots.children].forEach((d, j) => d.classList.toggle("active", j === i));
  prevBtn.disabled = i === 0;
  nextBtn.disabled = i === stops.length - 1;

  if (fly) map.flyTo(s.coords, s.zoom, { duration: 1.4 });
}

prevBtn.addEventListener("click", () => { if (current > 0) show(current - 1, true); });
nextBtn.addEventListener("click", () => { if (current < stops.length - 1) show(current + 1, true); });
document.getElementById("overview").addEventListener("click", () => map.flyToBounds(routeBounds, { duration: 1.2 }));
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") nextBtn.click();
  if (e.key === "ArrowLeft") prevBtn.click();
});

// Start with the whole route in view and Istanbul selected.
map.fitBounds(routeBounds);
show(0, false);
