// Layers of the Theodosian Walls - custom HTML and SVG
// CANVAS_HEIGHT: 658
// Part 1: the learner places five layer names into five numbered positions on a
// schematic cross-section, from the outside (west) to the inside (east), then
// submits once. Positions are marked, the approximate sizes appear on the
// drawing, and each position's callout can be opened. Part 2: three
// multiple-choice questions, one attempt each, on why the design worked.

// ---------- Content (order = outside to inside) ----------
const LAYERS = [
  { name: "Moat", size: "About 20 m wide and several meters deep, with a low battlemented wall on its inner edge.",
    purpose: "Kept siege towers, rams and miners at a distance." },
  { name: "Outer terrace", size: "A narrow strip between the moat and the outer wall.",
    purpose: "Open ground where attackers were exposed to fire from both walls." },
  { name: "Outer wall", size: "About 8.5 m high and 2 m thick, with smaller towers of its own.",
    purpose: "The first wall an attacker had to climb or break." },
  { name: "Inner terrace (peribolos)", size: "About 15 to 20 m wide.",
    purpose: "Where defenders gathered; any attacker who crossed the outer wall was trapped here under fire from above." },
  { name: "Inner wall", size: "About 12 m high and nearly 5 m thick, with 96 towers up to about 20 m tall.",
    purpose: "The main wall. Its towers were set to cover the gaps between the outer towers." }
];

const QUESTIONS = [
  { q: "Why is the inner wall taller than the outer wall?",
    choices: ["So defenders on it could shoot over the outer wall at attackers", "So it could be seen from the sea",
              "Because it was built later", "It is not taller"],
    answer: 0, why: "Two heights let defenders fire from two levels at once." },
  { q: "Which emperor completed the land walls in 413?",
    choices: ["Constantine I", "Theodosius I", "Theodosius II", "Justinian"],
    answer: 2, why: "Theodosius I died in 395; his grandson Theodosius II completed the walls in 413." },
  { q: "How did the crusaders get into the city in 1204?",
    choices: ["Through a breach in the land walls", "From the Golden Horn, over the sea walls",
              "Through a tunnel", "The gates were opened by treaty"],
    answer: 1, why: "The land walls held; the attack came from the harbor, where the sea walls were lower." }
];

// Marker x positions in the drawing (viewBox 0 0 800 236), one per layer
const MARK_X = [100, 247, 295, 380, 473];

// ---------- State ----------
let placed = [];        // placed[pos] = layer index or -1
let trayOrder = [];     // shuffled layer indices
let selectedChip = -1;  // layer index picked from the tray
let phase = "place";    // "place", "part2", "done"
let layerScore = 0;
let qIndex = 0, qAnswered = false, qScore = 0;
let calloutPos = -1;

const $ = id => document.getElementById(id);

function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// ---------- Drawing ----------
function crenels(x0, x1, top, h, w) {
  let s = "";
  for (let x = x0; x + w <= x1 + 0.1; x += 2 * w) s += '<rect x="' + x + '" y="' + (top - h) + '" width="' + w + '" height="' + h + '" fill="#b59a76"/>';
  return s;
}

function drawSection() {
  const g = 184;                 // ground line
  const m = 6;                   // pixels per meter (vertical only)
  const stone = "#c9ad86", stoneDark = "#a88b64", band = "#9c4a2c";
  const showDims = phase !== "place";
  let s = '<svg viewBox="0 0 800 236" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">';
  s += '<defs><pattern id="brick" width="12" height="16" patternUnits="userSpaceOnUse"><rect width="12" height="16" fill="' + stone + '"/>' +
       '<rect y="12" width="12" height="3" fill="' + band + '" opacity="0.55"/></pattern></defs>';
  // ground and moat
  s += '<rect x="0" y="' + g + '" width="800" height="52" fill="#cbb994"/>';
  s += '<polygon points="60,' + g + ' 76,' + (g + 34) + ' 184,' + (g + 34) + ' 200,' + g + '" fill="#a99670"/>';
  s += '<polygon points="66,' + (g + 15) + ' 76,' + (g + 34) + ' 184,' + (g + 34) + ' 194,' + (g + 15) + '" fill="#7fa8c9"/>';
  s += '<line x1="0" y1="' + g + '" x2="60" y2="' + g + '" stroke="#8a7a58" stroke-width="2"/>';
  s += '<line x1="200" y1="' + g + '" x2="800" y2="' + g + '" stroke="#8a7a58" stroke-width="2"/>';
  // low battlemented wall on the moat's inner edge (about 2 m)
  const mw = g - 2 * m;
  s += '<rect x="200" y="' + mw + '" width="8" height="' + (g - mw) + '" fill="' + stoneDark + '"/>' + crenels(200, 208, mw, 4, 3);
  // outer wall: about 8.5 m high
  const ow = g - 8.5 * m;
  s += '<rect x="285" y="' + ow + '" width="20" height="' + (g - ow) + '" fill="url(#brick)" stroke="' + stoneDark + '"/>' + crenels(285, 305, ow, 5, 4);
  // inner tower silhouette behind the inner wall: up to about 20 m
  const it = g - 20 * m;
  s += '<rect x="445" y="' + it + '" width="56" height="' + (g - it) + '" fill="#ddc9a8" stroke="#b9a07c"/>' + crenels(445, 501, it, 6, 5);
  // inner wall: about 12 m high, thicker
  const iw = g - 12 * m;
  s += '<rect x="455" y="' + iw + '" width="36" height="' + (g - iw) + '" fill="url(#brick)" stroke="' + stoneDark + '"/>' + crenels(455, 491, iw, 6, 4);
  // the city: a few roofs and a dome
  const houses = [[548, 18], [592, 24], [640, 16], [684, 22], [728, 18]];
  houses.forEach(([x, h]) => {
    s += '<rect x="' + x + '" y="' + (g - h) + '" width="30" height="' + h + '" fill="#e7dccb" stroke="#b9a891"/>';
    s += '<polygon points="' + (x - 3) + ',' + (g - h) + ' ' + (x + 15) + ',' + (g - h - 10) + ' ' + (x + 33) + ',' + (g - h) + '" fill="#b5553a"/>';
  });
  s += '<path d="M 768 ' + (g - 26) + ' a 14 14 0 0 1 28 0 z" fill="#c9c2b2" stroke="#9e9686"/><rect x="766" y="' + (g - 26) + '" width="32" height="26" fill="#e7dccb" stroke="#b9a891"/>';
  // direction labels
  s += '<text x="8" y="22" font-size="14" font-weight="bold" fill="#12304a">WEST: Thrace</text>';
  s += '<text x="8" y="40" font-size="12" fill="#4a5a66">the attackers come from here →</text>';
  s += '<text x="792" y="22" font-size="14" font-weight="bold" fill="#12304a" text-anchor="end">EAST: the city</text>';
  s += '<text x="792" y="230" font-size="11" fill="#4a5a66" text-anchor="end" font-style="italic">Schematic; not to scale</text>';
  // leader lines and numbered markers
  const targets = [[100, g + 20], [247, g - 4], [295, ow + 10], [380, g - 4], [473, iw + 10]];
  for (let i = 0; i < 5; i++) {
    const my = 62;
    s += '<line x1="' + MARK_X[i] + '" y1="' + (my + 12) + '" x2="' + targets[i][0] + '" y2="' + targets[i][1] + '" stroke="#12304a" stroke-width="1.2" stroke-dasharray="3 3"/>';
    const fill = phase === "place" ? "#12304a" : (placed[i] === i ? "#2e7d32" : "#c62828");
    s += '<g class="marker' + (calloutPos === i ? " sel" : "") + '" data-pos="' + i + '"><circle cx="' + MARK_X[i] + '" cy="' + my + '" r="12" fill="' + fill + '"/>' +
         '<text x="' + MARK_X[i] + '" y="' + (my + 5) + '" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">' + (i + 1) + '</text></g>';
  }
  // approximate sizes, shown after submission
  if (showDims) {
    const t = (x, y, str, a) => '<text x="' + x + '" y="' + y + '" font-size="11" fill="#12304a" text-anchor="' + (a || "middle") + '">' + str + '</text>';
    s += t(158, g - 6, "≈20 m wide");
    s += t(281, ow + 22, "≈8.5 m", "end");
    s += t(380, g + 14, "≈15–20 m wide");
    s += t(441, iw + 26, "≈12 m", "end");
    s += t(507, it + 12, "towers ≈20 m", "start");
    s += '<line x1="60" y1="' + (g + 41) + '" x2="491" y2="' + (g + 41) + '" stroke="#12304a" stroke-width="1"/>' +
         '<line x1="60" y1="' + (g + 37) + '" x2="60" y2="' + (g + 45) + '" stroke="#12304a"/><line x1="491" y1="' + (g + 37) + '" x2="491" y2="' + (g + 45) + '" stroke="#12304a"/>';
    s += '<rect x="221" y="' + (g + 35) + '" width="130" height="12" fill="#cbb994"/>' + t(286, g + 45, "≈60 m in all (approx.)");
  }
  s += "</svg>";
  $("section").innerHTML = s;
  document.querySelectorAll("#section .marker").forEach(el =>
    el.addEventListener("click", () => slotClicked(Number(el.dataset.pos))));
}

// ---------- Slots and tray ----------
function renderSlots() {
  const box = $("slots");
  box.innerHTML = "";
  for (let pos = 0; pos < 5; pos++) {
    const b = document.createElement("button");
    b.className = "slot";
    b.dataset.pos = pos;
    let html = '<span class="num">' + (pos + 1) + "</span>";
    if (phase === "place") {
      if (placed[pos] >= 0) { b.classList.add("filled"); html += LAYERS[placed[pos]].name; }
      else { html += '<small>' + (pos === 0 ? "outside (west)" : pos === 4 ? "inside (east)" : "drop a name here") + "</small>"; if (selectedChip >= 0) b.classList.add("target"); }
      b.title = placed[pos] >= 0 ? "Click to take this name back" : "Click to place the selected name here";
    } else {
      const ok = placed[pos] === pos;
      b.classList.add(ok ? "right" : "wrong");
      html += ok ? "<b>Correct:</b> " + LAYERS[pos].name + "."
                 : "This position is the <b>" + LAYERS[pos].name + "</b>.";
      if (calloutPos === pos) b.classList.add("picked");
      b.title = "Click to read the callout";
    }
    b.innerHTML = html;
    b.addEventListener("click", () => slotClicked(pos));
    b.addEventListener("dragover", e => { if (phase === "place") { e.preventDefault(); b.classList.add("over"); } });
    b.addEventListener("dragleave", () => b.classList.remove("over"));
    b.addEventListener("drop", e => {
      e.preventDefault();
      const li = Number(e.dataTransfer.getData("text/plain"));
      if (!isNaN(li)) placeLayer(li, pos);
    });
    box.appendChild(b);
  }
}

function renderTray() {
  const tray = $("tray");
  tray.innerHTML = "";
  trayOrder.filter(li => placed.indexOf(li) < 0).forEach(li => {
    const c = document.createElement("button");
    c.className = "chip" + (selectedChip === li ? " sel" : "");
    c.textContent = LAYERS[li].name;
    c.draggable = true;
    c.addEventListener("click", () => { selectedChip = selectedChip === li ? -1 : li; renderAll(); });
    c.addEventListener("dragstart", e => { e.dataTransfer.setData("text/plain", String(li)); selectedChip = li; });
    tray.appendChild(c);
  });
  if (!tray.children.length) {
    tray.innerHTML = '<span style="font-size:13px;color:#4a5a66">All five names are placed. Click a box to take a name back, or press <b>Submit</b>.</span>';
  }
}

function placeLayer(li, pos) {
  if (phase !== "place") return;
  const old = placed.indexOf(li);
  if (old >= 0) placed[old] = -1;           // moving a name between boxes
  placed[pos] = li;                          // a name already in this box returns to the tray
  selectedChip = -1;
  renderAll();
}

function slotClicked(pos) {
  if (phase === "place") {
    if (selectedChip >= 0) placeLayer(selectedChip, pos);
    else if (placed[pos] >= 0) { placed[pos] = -1; renderAll(); }
  } else {
    calloutPos = pos;
    renderAll();
  }
}

// ---------- Callout strip ----------
function renderCallout() {
  const c = $("callout");
  if (phase === "place") {
    c.innerHTML = "Pick a name below, then click a numbered box to place it (or drag it). Box 1 is the outside, toward Thrace; " +
                  "box 5 is the inside, next to the city. Click a filled box to take its name back.";
    return;
  }
  if (calloutPos < 0) {
    c.innerHTML = "<b>" + layerScore + " of 5 layers placed correctly.</b> Click any numbered box or marker to read its callout. " +
                  "The approximate sizes are now on the drawing.";
    return;
  }
  const L = LAYERS[calloutPos];
  c.innerHTML = "<b>" + (calloutPos + 1) + ". " + L.name + ".</b> " + L.size + " " + L.purpose;
}

// ---------- Part 2 ----------
function renderQuestion() {
  const Q = QUESTIONS[qIndex];
  qAnswered = false;
  $("qnum").innerHTML = "Part 2: question <b>" + (qIndex + 1) + " of 3</b>";
  $("score").innerHTML = "Layers <b>" + layerScore + " of 5</b>, questions <b>" + qScore + " of 3</b>";
  $("qtext").textContent = Q.q;
  const box = $("choices");
  box.innerHTML = "";
  Q.choices.forEach((ch, i) => {
    const b = document.createElement("button");
    b.textContent = ch;
    b.dataset.idx = i;
    b.addEventListener("click", () => answer(i));
    box.appendChild(b);
  });
  $("feedback").innerHTML = "";
  $("next").disabled = true;
  $("next").textContent = qIndex < 2 ? "Next question" : "See result";
}

function answer(i) {
  if (qAnswered) return;
  qAnswered = true;
  const Q = QUESTIONS[qIndex];
  const ok = i === Q.answer;
  if (ok) qScore++;
  document.querySelectorAll("#choices button").forEach(b => {
    const k = Number(b.dataset.idx);
    b.disabled = true;
    if (k === Q.answer) b.classList.add("correct");
    else if (k === i) b.classList.add("wrong");
  });
  $("feedback").innerHTML = (ok ? '<span class="ok">Right.</span> ' : '<span class="no">Not quite.</span> The answer is: ' + Q.choices[Q.answer] + ". ") + Q.why;
  $("score").innerHTML = "Layers <b>" + layerScore + " of 5</b>, questions <b>" + qScore + " of 3</b>";
  $("next").disabled = false;
}

function showResult() {
  phase = "done";
  $("qnum").innerHTML = "<b>Both parts done</b>";
  $("qtext").textContent = "Layers " + layerScore + " of 5, questions " + qScore + " of 3.";
  $("choices").innerHTML = "";
  $("feedback").innerHTML = (layerScore >= 4 ? "You can name the layers in the order an attacker met them. " :
    "Reread the section “The Theodosian Walls” and try the layers again. ") +
    "Notice that no single wall did the work: the moat kept attackers back, the outer terrace exposed them, " +
    "and the two walls let defenders fire from two heights at once. Click any box to reread its callout.";
  $("next").disabled = true;
  $("next").textContent = "Done";
}

// ---------- Flow ----------
function submit() {
  if (phase !== "place" || placed.indexOf(-1) >= 0) return;
  phase = "part2";
  layerScore = placed.filter((li, pos) => li === pos).length;
  calloutPos = -1;
  selectedChip = -1;
  qIndex = 0;
  qScore = 0;
  $("part1").classList.add("hidden");
  $("part2").classList.remove("hidden");
  $("submit").classList.add("hidden");
  $("next").classList.remove("hidden");
  renderAll();
  renderQuestion();
}

function restart() {
  placed = [-1, -1, -1, -1, -1];
  trayOrder = shuffle([0, 1, 2, 3, 4]);
  selectedChip = -1;
  phase = "place";
  layerScore = 0;
  qIndex = 0; qScore = 0; qAnswered = false;
  calloutPos = -1;
  $("part1").classList.remove("hidden");
  $("part2").classList.add("hidden");
  $("submit").classList.remove("hidden");
  $("next").classList.add("hidden");
  $("feedback").innerHTML = "";
  renderAll();
}

function renderAll() {
  drawSection();
  renderSlots();
  renderCallout();
  if (phase === "place") {
    renderTray();
    const full = placed.indexOf(-1) < 0;
    $("submit").disabled = !full;
    $("hint").textContent = full ? "One submission only." : (5 - placed.filter(x => x >= 0).length) + " names left to place.";
  } else {
    $("hint").textContent = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("submit").addEventListener("click", submit);
  $("restart").addEventListener("click", restart);
  $("next").addEventListener("click", () => {
    if (!qAnswered || phase !== "part2") return;
    if (qIndex < 2) { qIndex++; renderQuestion(); } else showResult();
  });
  restart();
});
