// Sèvres or Lausanne? - custom HTML
// CANVAS_HEIGHT: 702
// Predict-then-reveal comparison table. All ten terms of the Treaty of Sèvres
// (August 10, 1920) are visible; the Treaty of Lausanne (July 24, 1923) column
// is hidden (its text is laid out invisibly, so rows keep their final height
// and the iframe does not grow as terms are revealed). For each term in order the learner predicts Reversed or Kept, and
// the Lausanne term is revealed with feedback. After ten, the learner sees the
// tally and chooses which of three explanations accounts for the pattern.

// ---------- Content ----------
const TERMS = [
  { term: "Smyrna (İzmir) and its region",
    sevres: "Greek administration for five years, then a possible vote on joining Greece",
    lausanne: "Turkish", out: "reversed",
    why: "A Turkish-majority region held at the armistice, inside the Pact, and won back in 1922." },
  { term: "Eastern Thrace (Edirne)",
    sevres: "To Greece",
    lausanne: "Turkish, with the border on the Maritsa River", out: "reversed",
    why: "Inside the Pact's claim; the nationalists' victory made it Turkish." },
  { term: "Imbros and Tenedos",
    sevres: "To Greece",
    lausanne: "Turkish, with local self-government promised to their Greek inhabitants", out: "reversed",
    why: "The islands guard the mouth of the Dardanelles, and the Pact demanded the security of Istanbul and the Sea of Marmara." },
  { term: "Armenia",
    sevres: "An independent Armenian state in eastern Anatolia, with borders to be drawn by U.S. President Wilson",
    lausanne: "Not mentioned; the eastern border agreed with the Soviet republics in 1921 stands", out: "reversed",
    why: "The nationalists won the eastern front in 1920, and the plan was dropped. The Pact claimed these provinces as Muslim-majority lands; most of their Armenians had been deported or killed in 1915–1916." },
  { term: "Kurdistan",
    sevres: "A plan for local autonomy, with possible later independence",
    lausanne: "Not mentioned", out: "reversed",
    why: "Ankara claimed these lands under the Pact, and the plan was dropped." },
  { term: "Capitulations",
    sevres: "Restored, with Allied supervision of Ottoman finances",
    lausanne: "Abolished", out: "reversed",
    why: "Full sovereignty was the heart of the national movement." },
  { term: "The Straits",
    sevres: "Under an international commission, demilitarized",
    lausanne: "Under Turkish sovereignty but still demilitarized and supervised by an international commission", out: "kept",
    why: "Lausanne kept the commission and demilitarization; full Turkish control came only with the Montreux Convention of 1936." },
  { term: "The Arab provinces",
    sevres: "Given up",
    lausanne: "Given up", out: "kept",
    why: "The Pact had left them out of its claim. (The border with Iraq around Mosul was left open and settled in Iraq's favor in 1926.)" },
  { term: "Rhodes and the Dodecanese",
    sevres: "Given up in favor of Italy",
    lausanne: "Given up in favor of Italy", out: "kept",
    why: "Italy had held them since 1912; they were handed to Greece only in 1947, with formal union in 1948." },
  { term: "Cyprus",
    sevres: "British annexation recognized",
    lausanne: "British annexation recognized", out: "kept",
    why: "Cyprus had been under British rule since 1878 and lay outside the Pact." }
];

const OUT = {
  reversed: { name: "Reversed", color: "#b35806", verb: "reversed", def: "Lausanne undid the Sèvres term" },
  kept:     { name: "Kept",     color: "#2F6E8E", verb: "kept",     def: "Lausanne left the Sèvres term in place, in substance" }
};

const EXPLANATIONS = [
  { key: "A", text: "Lausanne reversed whatever lay inside the National Pact's claim and kept what the Pact had not claimed.",
    correct: true },
  { key: "B", text: "Lausanne reversed every term that favored Greece and kept every term that favored Britain.",
    correct: false,
    reason: "The kept Straits regime was run by an international commission, and the Dodecanese went to Italy, not Britain, so this rule does not fit." },
  { key: "C", text: "Lausanne reversed everything, and the “kept” terms only look similar.",
    correct: false,
    reason: "Four terms stand in substance: the Straits regime, the Arab provinces, the Dodecanese and Cyprus." }
];

const MASTERY = 8;

// ---------- State ----------
let current = 0;
let answered = false;
let score = 0;
let preds = [];          // learner's prediction per term
let phase = "terms";     // "terms", "explain", "done"
let explChoice = null;

const $ = id => document.getElementById(id);

function buildRows() {
  const tb = $("rows");
  tb.innerHTML = "";
  TERMS.forEach((t, i) => {
    const tr = document.createElement("tr");
    tr.id = "row" + i;
    tr.innerHTML =
      '<td class="num">' + (i + 1) + "</td>" +
      '<td class="term">' + t.term + "</td>" +
      "<td>" + t.sevres + "</td>" +
      '<td class="laus hidden-cell"><span class="ghost-text">' + t.lausanne + '</span><span class="qmark">?</span></td>' +
      '<td class="out"></td>';
    tb.appendChild(tr);
  });
}

function revealRow(i) {
  const t = TERMS[i];
  const tr = $("row" + i);
  const laus = tr.querySelector(".laus");
  laus.classList.remove("hidden-cell");
  laus.textContent = t.lausanne;
  const ok = preds[i] === t.out;
  tr.querySelector(".out").innerHTML = '<span class="badge ' + t.out + '">' + OUT[t.out].name + "</span>" +
    '<span class="mark ' + (ok ? "ok" : "no") + '" title="' + (ok ? "Predicted correctly" : "Missed") + '">' + (ok ? "✓" : "✗") + "</span>";
}

function markCurrent() {
  TERMS.forEach((t, i) => $("row" + i).classList.toggle("current", phase === "terms" && i === current));
}

function updateScore() {
  $("score").innerHTML = "Correct: <b>" + score + " of " + TERMS.length + "</b>";
}

function renderTerm() {
  const T = TERMS[current];
  answered = false;
  $("qnum").innerHTML = "Term <b>" + (current + 1) + " of " + TERMS.length + "</b>";
  $("qtext").textContent = (current + 1) + ". " + T.term + ": did Lausanne reverse or keep the Sèvres term?";
  const box = $("choices");
  box.style.display = "";
  box.className = "";
  box.innerHTML = "";
  ["reversed", "kept"].forEach(k => {
    const b = document.createElement("button");
    b.innerHTML = '<span class="sw" style="background:' + OUT[k].color + '"></span><b>' + OUT[k].name + "</b>";
    b.dataset.k = k;
    b.title = OUT[k].def + " (key " + OUT[k].name[0] + ")";
    b.addEventListener("click", () => predict(k));
    box.appendChild(b);
  });
  $("feedback").innerHTML = '<span style="color:#4a5a66"><b>Reversed:</b> ' + OUT.reversed.def +
    '. <b>Kept:</b> ' + OUT.kept.def + ".</span>";
  $("next").style.display = "";
  $("next").disabled = true;
  $("next").textContent = current < TERMS.length - 1 ? "Next term" : "See the tally";
  $("hint").textContent = "Keys R and K predict; Enter goes on.";
  markCurrent();
  updateScore();
}

function predict(k) {
  if (phase !== "terms" || answered) return;
  answered = true;
  const T = TERMS[current];
  preds[current] = k;
  const ok = k === T.out;
  if (ok) score++;
  document.querySelectorAll("#choices button").forEach(b => {
    b.disabled = true;
    if (b.dataset.k === T.out) b.classList.add("correct");
    else if (b.dataset.k === k) b.classList.add("wrong");
  });
  revealRow(current);
  $("feedback").innerHTML = (ok ? '<span class="ok">Correct:</span> '
                                : '<span class="no">Lausanne ' + OUT[T.out].verb + " this term:</span> ") + T.why;
  $("next").disabled = false;
  updateScore();
}

function nextStep() {
  if (phase === "terms") {
    if (!answered) return;
    if (current < TERMS.length - 1) { current++; renderTerm(); }
    else startExplain();
  }
}

function startExplain() {
  phase = "explain";
  markCurrent();
  const rev = TERMS.filter(t => t.out === "reversed").length;
  $("qnum").innerHTML = "<b>Tally: Reversed " + rev + ", Kept " + (TERMS.length - rev) + "</b>";
  $("qtext").textContent = "Which explanation accounts for the pattern?";
  const box = $("choices");
  box.className = "three";
  box.innerHTML = "";
  EXPLANATIONS.forEach(e => {
    const b = document.createElement("button");
    b.innerHTML = "<b>" + e.key + ".</b> " + e.text;
    b.dataset.k = e.key;
    b.title = "Explanation " + e.key + " (key " + e.key + ")";
    b.addEventListener("click", () => explain(e.key));
    box.appendChild(b);
  });
  $("feedback").innerHTML = "";
  $("next").style.display = "none";
  $("hint").textContent = "Keys A, B and C choose an explanation.";
}

function explain(key) {
  if (phase !== "explain") return;
  phase = "done";
  explChoice = key;
  const E = EXPLANATIONS.find(e => e.key === key);
  document.querySelectorAll("#choices button").forEach(b => {
    b.disabled = true;
    if (b.dataset.k === "A") b.classList.add("correct");
    else if (b.dataset.k === key) b.classList.add("wrong");
  });
  $("choices").style.display = "none";
  $("qtext").textContent = key === "A" ? "You chose A: " + EXPLANATIONS[0].text
                                       : "You chose " + key + ". The answer is A: " + EXPLANATIONS[0].text;
  let html = E.correct
    ? '<span class="ok">Yes: the National Pact predicts the treaty.</span> '
    : '<span class="no">Not quite:</span> ' + E.reason + ' <span class="ok">The National Pact predicts the treaty.</span> ';
  const pass = score >= MASTERY && E.correct;
  html += "<br><b>You predicted " + score + " of 10" + (E.correct ? " and chose A." : ".") + "</b> " + (pass
    ? "Every reversed term lay inside the Pact's claim; every kept term lay outside it."
    : "Look again at the four kept terms: did the National Pact claim any of them?");
  $("feedback").innerHTML = html;
  $("hint").textContent = "Try Again hides the Lausanne column and starts over.";
}

function restart() {
  current = 0;
  answered = false;
  score = 0;
  preds = [];
  phase = "terms";
  explChoice = null;
  buildRows();
  renderTerm();
}

document.addEventListener("DOMContentLoaded", function () {
  $("next").addEventListener("click", nextStep);
  $("restart").addEventListener("click", restart);
  document.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (phase === "terms" && (k === "r" || k === "k")) predict(k === "r" ? "reversed" : "kept");
    else if (phase === "explain" && ["a", "b", "c"].includes(k)) explain(k.toUpperCase());
    else if (e.key === "Enter") nextStep();
  });
  restart();
});
