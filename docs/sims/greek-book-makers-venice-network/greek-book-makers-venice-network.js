// Who Made a Greek Book in Venice? - vis-network
// CANVAS_HEIGHT: 626
// Attribution quiz on a growing network. Ten people of Greek and humanist
// printing in Venice around 1500 start as unconnected boxes. Ten contribution
// cards come in a fixed order; the learner chooses who did each job. Only the
// first choice is scored. A correct answer draws that card's link and shows the
// person's role, so the team behind the Aldine Press, and a rival Cretan press
// beside it, appears one link at a time. A last question asks how many of the
// ten were born on Crete.

// ---------- People ----------
const PEOPLE = [
  { id: "aldus", name: "Aldus Manutius", short: "Aldus", dates: "about 1450–1515", role: "publisher", x: -20, y: 15, group: "aldine" },
  { id: "musurus", name: "Marcus Musurus", short: "Musurus", dates: "about 1470–1517", role: "editor", x: -100, y: -130, group: "aldine", crete: true },
  { id: "lascaris", name: "Janus Lascaris", short: "Lascaris", dates: "about 1445–1535", role: "teacher", x: -330, y: -140, group: "aldine" },
  { id: "torresani", name: "Andrea Torresani", short: "Torresani", dates: "1451–1529", role: "financier", x: -270, y: 150, group: "aldine" },
  { id: "griffo", name: "Francesco Griffo", short: "Griffo", dates: "about 1450–1518", role: "punchcutter", x: -340, y: 10, group: "aldine" },
  { id: "kallierges", name: "Zacharias Kallierges", short: "Kallierges", dates: "active about 1499–1523", role: "printer", x: 365, y: -75, group: "rival", crete: true },
  { id: "vlastos", name: "Nikolaos Vlastos", short: "Vlastos", dates: "active about 1499", role: "financier", x: 355, y: 110, group: "rival", crete: true },
  { id: "erasmus", name: "Erasmus", short: "Erasmus", dates: "about 1466–1536", role: "author", x: 20, y: 165, group: "aldine" },
  { id: "bembo", name: "Pietro Bembo", short: "Bembo", dates: "1470–1547", role: "editor", x: 190, y: 65, group: "aldine" },
  { id: "leo", name: "Pope Leo X", short: "Leo X", dates: "1475–1521", role: "patron", x: 150, y: -148, group: "aldine" }
];
const BY_ID = {};
PEOPLE.forEach(p => { BY_ID[p.id] = p; });

// ---------- Cards (fixed order) ----------
const CARDS = [
  { text: "Compared manuscripts and corrected the Greek text for the first printed Plato, 1513, and wrote a Greek poem to open it.",
    who: "musurus", reason: "The Cretan editor did the scholarly work; the printer did not.",
    link: { from: "musurus", to: "aldus", label: "edited for" } },
  { text: "Ran the press, chose the books, and began the small octavo classics in 1501.",
    who: "aldus", reason: "Choosing the list and the format was the publisher's work.", link: null },
  { text: "Cut the punches for the italic type and for Greek types.",
    who: "griffo", reason: "The punchcutter made the letters; Aldus commissioned them.",
    link: { from: "griffo", to: "aldus", label: "cut type for" } },
  { text: "Put money into the press as Aldus's partner, and became his father-in-law.",
    who: "torresani", reason: "A press needed capital before it sold a single book.",
    link: { from: "torresani", to: "aldus", label: "financed" } },
  { text: "Was the young Musurus's teacher of Greek.",
    who: "lascaris", reason: "Editors were trained by an earlier generation of Greek teachers.",
    link: { from: "lascaris", to: "musurus", label: "taught" } },
  { text: "Printed the Etymologicum Magnum, a huge Greek dictionary, at his own press in Venice in 1499.",
    who: "kallierges", reason: "A Cretan printer ran a Greek press of his own, separate from Aldus's.",
    link: { from: "kallierges", to: "vlastos", label: "printed for" } },
  { text: "Paid for that 1499 dictionary.",
    who: "vlastos", reason: "A Cretan merchant financed the Cretan press, as Torresani financed Aldus's.", link: null },
  { text: "Lived in Aldus's house in 1508 while the press printed his collection of proverbs, the Adagia.",
    who: "erasmus", reason: "The author came to the press, which shows how central it was.",
    link: { from: "erasmus", to: "aldus", label: "printed by" } },
  { text: "Edited Petrarch and Dante for Aldus's small Italian editions.",
    who: "bembo", reason: "The octavo format served Italian classics as well as Greek and Latin ones.",
    link: { from: "bembo", to: "aldus", label: "edited for" } },
  { text: "Received the dedication of the 1513 Plato, and in 1516 called its editor to Rome as an archbishop.",
    who: "leo", reason: "Patrons rewarded the scholars who honored them.",
    link: { from: "leo", to: "musurus", label: "patron of" } }
];
const MASTERY = 8;
const CRETE_ANSWER = 3;

const COLORS = {
  blank: { background: "#eef2f5", border: "#8aa0b0" },
  aldine: { background: "#fdf0dc", border: "#b06a1e" },
  rival: { background: "#e3eefa", border: "#2f6fae" }
};
const CRETE_BORDER = "#c79a00";

// ---------- State ----------
let network, nodes, edges;
let current = 0;
let firstChoice = [];     // person id chosen first on each card
let attempts = 0;
let solved = false;
let score = 0;
let placed = {};          // person id -> true once their card is answered
let phase = "cards";      // "cards", "crete", "done"
let creteAnswered = false;

function isInIframe() {
  try { return window.self !== window.top; } catch (e) { return true; }
}

function nodeLabel(p) {
  return placed[p.id] ? p.name + "\n" + p.dates + "\n" + p.role : p.name + "\n" + p.dates;
}

function nodeStyle(p) {
  const showCrete = creteAnswered && p.crete;
  const c = placed[p.id] ? COLORS[p.group] : COLORS.blank;
  return {
    id: p.id,
    label: nodeLabel(p),
    color: { background: c.background, border: showCrete ? CRETE_BORDER : c.border,
             highlight: { background: c.background, border: "#1f3f5f" },
             hover: { background: c.background, border: "#1f3f5f" } },
    borderWidth: showCrete ? 4 : 2,
    font: { size: 15, face: "Arial", color: "#1d2a33", multi: false }
  };
}

function refreshNode(id) { nodes.update(nodeStyle(BY_ID[id])); }
function refreshAll() { nodes.update(PEOPLE.map(nodeStyle)); }

// ---------- Network ----------
function initNetwork() {
  nodes = new vis.DataSet(PEOPLE.map(p => Object.assign(nodeStyle(p), { x: p.x, y: p.y })));
  edges = new vis.DataSet([]);
  const mouse = !isInIframe();
  const options = {
    layout: { improvedLayout: false },
    physics: { enabled: false },
    interaction: {
      dragNodes: false, dragView: mouse, zoomView: mouse,
      selectConnectedEdges: false, hover: true, navigationButtons: false
    },
    nodes: {
      shape: "box", margin: { top: 6, bottom: 6, left: 8, right: 8 },
      widthConstraint: { maximum: 170 },
      shadow: { enabled: true, color: "rgba(0,0,0,0.15)", size: 4, x: 1, y: 1 }
    },
    edges: {
      arrows: { to: { enabled: true, scaleFactor: 0.8 } },
      width: 2,
      color: { color: "#5d6d78", highlight: "#1f3f5f", hover: "#1f3f5f" },
      smooth: { enabled: true, type: "curvedCW", roundness: 0.12 },
      font: { size: 14, face: "Arial", color: "#1f3f5f", background: "rgba(255,255,255,0.92)", strokeWidth: 0, align: "horizontal" }
    }
  };
  network = new vis.Network(document.getElementById("network"), { nodes: nodes, edges: edges }, options);
  network.once("afterDrawing", fitView);
  network.on("click", params => {
    if (params.nodes.length) showInfo(params.nodes[0]);
    else hideInfo();
  });
  network.on("beforeDrawing", drawGroupLabels);
}

function fitView() {
  network.fit({ animation: false });
  const s = network.getScale();
  network.moveTo({ scale: Math.min(1.1, s * 0.96), animation: false });
}

// After the last card, name the two presses on the canvas.
function drawGroupLabels(ctx) {
  if (phase === "cards") return;
  ctx.save();
  ctx.font = "italic bold 15px Arial";
  ctx.fillStyle = "#b06a1e";
  ctx.textAlign = "center";
  ctx.fillText("Aldus's press and its circle", -335, -64);
  ctx.fillStyle = "#2f6fae";
  ctx.fillText("A rival Cretan press", 365, -130);
  ctx.restore();
}

function showInfo(id) {
  const p = BY_ID[id];
  const box = document.getElementById("info");
  if (!placed[id]) {
    box.innerHTML = '<button class="close" aria-label="Close">×</button><b>' + p.name + "</b> (" + p.dates + ")<br>" +
      "Answer this person's card first.";
  } else {
    const card = CARDS.find(c => c.who === id);
    box.innerHTML = '<button class="close" aria-label="Close">×</button><b>' + p.name + "</b> (" + p.dates + "), " +
      p.role + "<br>" + card.reason + (creteAnswered && p.crete ? '<br><span class="crete">Born on Crete</span>' : "");
  }
  box.hidden = false;
  box.querySelector(".close").addEventListener("click", hideInfo);
}

function hideInfo() { document.getElementById("info").hidden = true; }

// ---------- Quiz ----------
function updateScore() {
  document.getElementById("score").textContent = "First-choice score: " + score + " of " + CARDS.length;
}

function renderCard() {
  const C = CARDS[current];
  attempts = 0;
  solved = false;
  document.getElementById("qnum").innerHTML = "Card <b>" + (current + 1) + " of " + CARDS.length + "</b>";
  document.getElementById("role-note").textContent = "Who did this job?";
  document.getElementById("qtext").textContent = C.text;
  const box = document.getElementById("choices");
  box.innerHTML = "";
  box.style.display = "grid";
  PEOPLE.forEach(p => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = p.short;
    b.title = p.name + " (" + p.dates + ")";
    b.dataset.id = p.id;
    b.addEventListener("click", () => choose(p.id, b));
    box.appendChild(b);
  });
  document.getElementById("crete").style.display = "none";
  document.getElementById("feedback").innerHTML = "";
  const next = document.getElementById("next");
  next.disabled = true;
  next.textContent = current < CARDS.length - 1 ? "Next card" : "Last question";
  updateScore();
}

function choose(id, btn) {
  if (solved || phase !== "cards") return;
  const C = CARDS[current];
  attempts++;
  if (attempts === 1) {
    firstChoice[current] = id;
    if (id === C.who) score++;
  }
  const fb = document.getElementById("feedback");
  if (id === C.who) {
    solved = true;
    btn.classList.add("correct");
    document.querySelectorAll("#choices button").forEach(b => { b.disabled = true; });
    fb.innerHTML = '<span class="ok">Correct: ' + C.reason + "</span>" +
      (attempts > 1 ? " (Second choice, so no point.)" : "");
    placed[C.who] = true;
    if (C.link) {
      edges.add({ id: "e" + current, from: C.link.from, to: C.link.to, label: C.link.label });
    }
    refreshNode(C.who);
    network.selectNodes([C.who]);
    document.getElementById("next").disabled = false;
  } else {
    btn.classList.add("wrong");
    btn.disabled = true;
    fb.innerHTML = '<span class="no">Not ' + BY_ID[id].name + ".</span> Think about which job this is: " +
      "editing, publishing, type cutting, financing, teaching, writing, or patronage.";
  }
  updateScore();
}

function startCrete() {
  phase = "crete";
  hideInfo();
  network.redraw();
  document.getElementById("qnum").innerHTML = "<b>All ten cards answered</b>";
  document.getElementById("role-note").textContent = "";
  document.getElementById("choices").style.display = "none";
  const pass = score >= MASTERY;
  document.getElementById("qtext").innerHTML = "First-choice score: " + score + " of 10. " +
    (pass ? "You can take a famous name apart into the team behind it."
          : "Look again at cards 1, 3, and 6: Aldus did not do them.") +
    "<br><small>Last question: how many of the ten were born on Crete?</small>";
  const cr = document.getElementById("crete");
  cr.style.display = "flex";
  const inp = document.getElementById("crete-input");
  inp.value = "";
  inp.disabled = false;
  document.getElementById("crete-check").disabled = false;
  document.getElementById("feedback").innerHTML =
    "Aldus's name stands on the books, but the network shows the editors, the punchcutter, the financier, the teacher, " +
    "the author, and the patron who made them possible, and a second Greek press beside his.";
  const next = document.getElementById("next");
  next.disabled = true;
  next.textContent = "Done";
  setTimeout(() => inp.focus({ preventScroll: true }), 0);
}

function checkCrete() {
  if (phase !== "crete") return;
  const raw = document.getElementById("crete-input").value.trim();
  const n = Number(raw);
  const fb = document.getElementById("feedback");
  if (raw === "" || !Number.isInteger(n) || n < 0 || n > 10) {
    fb.innerHTML = '<span class="no">Type a whole number from 0 to 10.</span>';
    return;
  }
  phase = "done";
  creteAnswered = true;
  document.getElementById("crete-input").disabled = true;
  document.getElementById("crete-check").disabled = true;
  fb.innerHTML = (n === CRETE_ANSWER
    ? '<span class="ok">Yes: Musurus, Kallierges, and Vlastos were Cretans.</span>'
    : '<span class="no">Three: Musurus, Kallierges, and Vlastos.</span>') +
    " Their boxes now have gold borders: Cretans worked both inside Aldus's circle and in a rival press. " +
    "Click any person to read about them.";
  refreshAll();
}

function nextCard() {
  if (phase !== "cards" || !solved) return;
  hideInfo();
  network.unselectAll();
  if (current < CARDS.length - 1) { current++; renderCard(); }
  else startCrete();
}

function restart() {
  current = 0;
  score = 0;
  firstChoice = [];
  placed = {};
  phase = "cards";
  creteAnswered = false;
  edges.clear();
  refreshAll();
  hideInfo();
  renderCard();
  fitView();
}

document.addEventListener("DOMContentLoaded", function () {
  initNetwork();
  document.getElementById("next").addEventListener("click", nextCard);
  document.getElementById("again").addEventListener("click", restart);
  document.getElementById("crete-check").addEventListener("click", checkCrete);
  document.getElementById("crete-input").addEventListener("keydown", e => { if (e.key === "Enter") checkCrete(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.id !== "crete-input" && e.target.tagName !== "BUTTON") nextCard();
  });
  document.getElementById("zoom-in").addEventListener("click", () =>
    network.moveTo({ scale: network.getScale() * 1.2, animation: false }));
  document.getElementById("zoom-out").addEventListener("click", () =>
    network.moveTo({ scale: network.getScale() / 1.2, animation: false }));
  document.getElementById("zoom-reset").addEventListener("click", fitView);
  window.addEventListener("resize", () => { network.redraw(); fitView(); });
  restart();
});
