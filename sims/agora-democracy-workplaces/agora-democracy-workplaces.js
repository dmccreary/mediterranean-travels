// Democracy's Workplaces in the Agora - custom HTML + inline SVG
// CANVAS_HEIGHT: 622
// A schematic plan of the Ancient Agora of Athens (not to scale) with ten
// clickable places. Nine job cards of Athenian public life come one at a
// time; the learner selects the place where each job was done and presses
// Answer. One scored attempt per card. After each answer a numbered badge
// is pinned beside the correct place. Mastery: 7 of 9 with card 5 correct.
// Sources are listed in index.md (References).

const SVGNS = 'http://www.w3.org/2000/svg';

// Shapes are in the SVG viewBox (700 x 344). badge: where the card's number
// is pinned; null for the boundary stone, which is never an answer.
const PLACES = [
  { id: 'royal', name: 'Royal Stoa',
    desc: 'Office of the King Archon, who handled religious law.',
    shape: { t: 'rect', x: 160, y: 78, w: 122, h: 26 }, label: ['Royal Stoa'], badge: [150, 91] },
  { id: 'zeus', name: 'Stoa of Zeus Eleutherios',
    desc: 'A stoa to Zeus the Freedom-Giver; ancient writers name it as a favorite spot for Socrates’ conversations.',
    shape: { t: 'rect', x: 160, y: 110, w: 122, h: 38 }, label: ['Stoa of Zeus', 'Eleutherios'], badge: [150, 129] },
  { id: 'bouleuterion', name: 'Bouleuterion',
    desc: 'The meeting hall of the Council of 500.',
    shape: { t: 'rect', x: 122, y: 156, w: 90, h: 52 }, label: ['Bouleuterion'], badge: [124, 156] },
  { id: 'metroon', name: 'Metroon',
    desc: 'The city archive, where laws and decrees were stored.',
    shape: { t: 'rect', x: 216, y: 156, w: 66, h: 52 }, label: ['Metroon'], badge: [280, 156] },
  { id: 'heroes', name: 'Monument of the Eponymous Heroes',
    desc: 'Bronze statues of the ten tribal heroes; public notices were posted on its base.',
    shape: { t: 'rect', x: 302, y: 138, w: 10, h: 86 }, label: ['Monument of the', 'Eponymous Heroes'],
    lx: 322, ly: 175, anchor: 'start', badge: [307, 127] },
  { id: 'tholos', name: 'Tholos',
    desc: 'Round building where the 50 councillors on duty dined at public expense.',
    shape: { t: 'circle', cx: 210, cy: 252, r: 28 }, label: ['Tholos'], badge: [235, 228] },
  { id: 'stone', name: 'Boundary stone',
    desc: 'Marble stone of about 500 BCE: “I am the boundary of the Agora.”',
    shape: { t: 'rect', x: 296, y: 310, w: 9, h: 14 }, label: ['Boundary stone'],
    lx: 310, ly: 321, anchor: 'start', badge: null },
  { id: 'poikile', name: 'Stoa Poikile',
    desc: 'The Painted Stoa of the 460s BCE, with paintings of Marathon; Zeno taught here.',
    shape: { t: 'rect', x: 300, y: 12, w: 190, h: 28 }, label: ['Stoa Poikile (Painted Stoa)'], badge: [490, 13] },
  { id: 'attalos', name: 'Stoa of Attalos',
    desc: 'Two-story stoa of 42 shops, a gift of Attalos II about 150 BCE; rebuilt 1953–1956 as the museum.',
    shape: { t: 'rect', x: 636, y: 96, w: 54, h: 220 }, label: ['Stoa of', 'Attalos'], badge: [637, 96] },
  { id: 'temple', name: 'Temple of Hephaestus',
    desc: 'Doric temple of Hephaestus and Athena, patrons of crafts, begun about 449 BCE.',
    shape: { t: 'rect', x: 24, y: 150, w: 80, h: 84 }, label: ['Temple of', 'Hephaestus'], badge: [25, 150] }
];
const P = Object.fromEntries(PLACES.map(p => [p.id, p]));

const CARDS = [
  { job: 'Read a proposed new law, or check whether you have been called up for the army.', place: 'heroes',
    why: 'Notices were posted on its base, where every citizen passed.' },
  { job: 'Prepare the agenda for the next Assembly.', place: 'bouleuterion',
    why: 'The Council of 500 met here to prepare the Assembly’s business.' },
  { job: 'Eat dinner at public expense as one of the 50 councillors on duty.', place: 'tholos',
    why: 'The councillors on duty dined here, and some stayed overnight so the city always had a government awake.' },
  { job: 'Look up the exact wording of a decree passed years ago.', place: 'metroon',
    why: 'It was the city’s archive of laws and decrees.' },
  { job: 'File a charge of impiety, as Meletus did against Socrates.', place: 'royal',
    why: 'Impiety was religious law, so the charge went to the King Archon’s office before any trial.' },
  { job: 'Sit in the shade and talk with Socrates, as ancient writers describe.', place: 'zeus',
    why: 'Ancient writers name this stoa as a favorite spot for Socrates’ conversations.' },
  { job: 'Hear Zeno teach beside the painting of Marathon.', place: 'poikile',
    why: 'Zeno taught in the Painted Stoa, and his followers were named Stoics after it.' },
  { job: 'Buy goods in a shop given by a king of Pergamon who had studied in Athens.', place: 'attalos',
    why: 'Attalos II paid for its 42 shops about 150 BCE, two and a half centuries after Socrates.' },
  { job: 'Pray to the god of the forge above the bronze workshops.', place: 'temple',
    why: 'Hephaestus, with Athena, was the patron of the craftsmen around the Agora.' }
];
const MASTERY = 7;
const KEY_CARD = 4;   // card 5, the impiety charge (index 4)

// ---------- State ----------
let current = 0;
let answered = false;
let finished = false;
let selected = null;
let results = [];      // by card index: { chosen, correct }
let placeEls = {};

// ---------- Plan ----------
function el(tag, attrs, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

function textLines(parent, lines, x, y, anchor, cls) {
  const lh = 15;
  const y0 = y - (lines.length - 1) * lh / 2;
  lines.forEach((ln, i) => {
    const t = el('text', { x, y: y0 + i * lh, 'text-anchor': anchor, 'dominant-baseline': 'middle', class: cls }, parent);
    t.textContent = ln;
  });
}

function drawPlan() {
  const svg = document.getElementById('plan');
  svg.innerHTML = '';
  // hill and temple platform
  el('ellipse', { cx: 64, cy: 192, rx: 60, ry: 100, fill: '#e3efd9', stroke: '#b5cba5' }, svg);
  textLines(svg, ['Kolonos', 'Agoraios hill'], 64, 120, 'middle', 'minor');
  // metro tracks
  el('rect', { x: 0, y: 50, width: 700, height: 12, fill: '#c3c9ce' }, svg);
  for (let x = 4; x < 700; x += 12) el('line', { x1: x, y1: 50, x2: x, y2: 62, stroke: '#a3aab0', 'stroke-width': 2 }, svg);
  el('line', { x1: 0, y1: 53, x2: 700, y2: 53, stroke: '#7d858c' }, svg);
  el('line', { x1: 0, y1: 59, x2: 700, y2: 59, stroke: '#7d858c' }, svg);
  textLines(svg, ['Metro Line 1 (modern tracks)'], 694, 41, 'end', 'minor');
  // open square
  el('rect', { x: 292, y: 70, width: 398, height: 262, fill: '#faf6ec', stroke: '#d8ccb0', 'stroke-dasharray': '6 4' }, svg);
  textLines(svg, ['Open square'], 420, 300, 'middle', 'minor');
  // Panathenaic Way, northwest to southeast
  el('line', { x1: 346, y1: 70, x2: 626, y2: 338, stroke: '#e6d5ad', 'stroke-width': 12, 'stroke-linecap': 'round' }, svg);
  const way = el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'minor',
                           transform: 'translate(486 204) rotate(43.7)' }, svg);
  way.textContent = 'Panathenaic Way, toward the Acropolis';
  // street of offices (shown at the end)
  const street = el('g', { id: 'street' }, svg);
  el('rect', { x: 114, y: 72, width: 201, height: 216, rx: 10, fill: 'none', stroke: '#b8860b', 'stroke-width': 2,
               'stroke-dasharray': '7 5' }, street);
  const st = el('text', { x: 214, y: 300, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'lbl halo',
                          'font-weight': 'bold', fill: '#8a6a10' }, street);
  st.textContent = 'West side: the street of offices';
  // north arrow and scale note
  el('line', { x1: 24, y1: 42, x2: 24, y2: 14, stroke: '#4a5a66', 'stroke-width': 2 }, svg);
  el('path', { d: 'M17 22 L24 10 L31 22 Z', fill: '#4a5a66' }, svg);
  textLines(svg, ['N'], 38, 22, 'start', 'minor');
  const note = el('text', { x: 8, y: 336, class: 'minor', 'font-style': 'italic' }, svg);
  note.textContent = 'Schematic plan, not to scale.';

  // places
  placeEls = {};
  for (const p of PLACES) {
    const g = el('g', { class: 'place', tabindex: 0, role: 'button', 'aria-label': p.name }, svg);
    const s = p.shape;
    let bx, by, bw, bh;
    if (s.t === 'rect') {
      el('rect', { x: s.x, y: s.y, width: s.w, height: s.h, rx: 2, class: 'shape' }, g);
      bx = s.x; by = s.y; bw = s.w; bh = s.h;
    } else {
      el('circle', { cx: s.cx, cy: s.cy, r: s.r, class: 'shape' }, g);
      bx = s.cx - s.r; by = s.cy - s.r; bw = 2 * s.r; bh = 2 * s.r;
    }
    if (p.lx !== undefined) {
      textLines(g, p.label, p.lx, p.ly, p.anchor, 'lbl halo');
      const right = p.lx + 128;
      el('rect', { x: bx - 4, y: Math.min(by, p.ly - 18) - 4, width: right - bx + 8,
                   height: Math.max(by + bh, p.ly + 18) - Math.min(by, p.ly - 18) + 8, class: 'hit' }, g);
    } else {
      textLines(g, p.label, bx + bw / 2, by + bh / 2 + 1, 'middle', 'lbl');
      el('rect', { x: bx - 3, y: by - 3, width: bw + 6, height: bh + 6, class: 'hit' }, g);
    }
    g.addEventListener('click', () => pickPlace(p.id));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickPlace(p.id); } });
    placeEls[p.id] = g;
  }
  el('g', { id: 'badges' }, svg);
}

function drawBadges() {
  const layer = document.getElementById('badges');
  layer.innerHTML = '';
  results.forEach((r, ci) => {
    if (!r) return;
    const p = P[CARDS[ci].place];
    const g = el('g', { class: 'badge', role: 'button', tabindex: 0,
                        'aria-label': 'Card ' + (ci + 1) + ': ' + CARDS[ci].job }, layer);
    el('circle', { cx: p.badge[0], cy: p.badge[1], r: 10, fill: r.correct ? '#2e7d32' : '#c62828' }, g);
    const t = el('text', { x: p.badge[0], y: p.badge[1] + 1, 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, g);
    t.textContent = ci + 1;
    const show = () => showJob(ci);
    g.addEventListener('click', e => { e.stopPropagation(); show(); });
    g.addEventListener('keydown', e => { if (e.key === 'Enter') show(); });
  });
}

function paintPlaces() {
  const ci = current;
  for (const p of PLACES) {
    const g = placeEls[p.id];
    g.classList.remove('sel', 'right', 'wrong');
    if (!finished && answered) {
      if (p.id === CARDS[ci].place) g.classList.add('right');
      else if (p.id === results[ci].chosen) g.classList.add('wrong');
    } else if (!finished && p.id === selected) {
      g.classList.add('sel');
    }
  }
  document.getElementById('plan').classList.toggle('done', finished);
}

// ---------- Info strip ----------
function showPlace(id) {
  const p = P[id];
  const box = document.getElementById('info');
  box.innerHTML = '';
  const b = document.createElement('b');
  b.textContent = p.name + ': ';
  box.append(b, document.createTextNode(p.desc));
}

function showJob(ci) {
  const box = document.getElementById('info');
  box.innerHTML = '';
  const b = document.createElement('b');
  b.textContent = 'Card ' + (ci + 1) + ' → ' + P[CARDS[ci].place].name + ': ';
  box.append(b, document.createTextNode(CARDS[ci].job));
}

function hint(msg) {
  const box = document.getElementById('info');
  box.innerHTML = '<span class="hint"></span>';
  box.firstChild.textContent = msg;
}

// ---------- Flow ----------
function pickPlace(id) {
  showPlace(id);
  if (finished || answered) return;
  selected = id;
  const sel = document.getElementById('placeSelect');
  if (sel) sel.value = id;
  document.getElementById('answerBtn').disabled = false;
  paintPlaces();
}

function renderPanel() {
  const panel = document.getElementById('panel');
  panel.innerHTML = '';
  if (finished) {
    const score = results.filter(r => r.correct).length;
    const pass = score >= MASTERY && results[KEY_CARD].correct;
    const h = document.createElement('p');
    h.className = 'job';
    h.textContent = 'You placed ' + score + ' of 9 jobs correctly on the first attempt.';
    const m = document.createElement('p');
    m.className = 'feedback';
    m.innerHTML = '<b class="' + (pass ? 'ok' : 'no') + '"></b>';
    m.firstChild.textContent = pass ? 'You can read the Agora as a working government.'
      : 'Walk the west side again: archive, council, dining hall, notice board, and the King Archon’s office.';
    const n = document.createElement('p');
    n.className = 'feedback';
    n.textContent = 'Six of the nine jobs cluster along the west side, outlined in gold: the democracy’s street of offices. ' +
      'Click a numbered badge to read its job, or any place to read about it.';
    panel.append(h, m, n);
    updateControls();
    return;
  }
  const c = CARDS[current];
  const head = document.createElement('p');
  head.className = 'qhead';
  head.textContent = 'CARD ' + (current + 1) + ' OF 9';
  const job = document.createElement('p');
  job.className = 'job';
  job.textContent = c.job;
  const q = document.createElement('p');
  q.className = 'question';
  q.textContent = 'Where in the Agora would you go to do this? Click a place on the plan, or choose it here.';
  const row = document.createElement('div');
  row.className = 'answer-row';
  const sel = document.createElement('select');
  sel.id = 'placeSelect';
  sel.setAttribute('aria-label', 'Choose a place');
  const o0 = document.createElement('option');
  o0.value = ''; o0.textContent = 'Choose a place…';
  sel.appendChild(o0);
  for (const p of PLACES) {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = p.name;
    sel.appendChild(o);
  }
  sel.addEventListener('change', () => { if (sel.value) pickPlace(sel.value); });
  const btn = document.createElement('button');
  btn.id = 'answerBtn';
  btn.textContent = 'Answer';
  btn.disabled = true;
  btn.addEventListener('click', answer);
  row.append(sel, btn);
  const fb = document.createElement('div');
  fb.className = 'feedback';
  fb.id = 'feedback';
  panel.append(head, job, q, row, fb);
  updateControls();
}

function answer() {
  if (answered || finished || !selected) return;
  const c = CARDS[current];
  const ok = selected === c.place;
  results[current] = { chosen: selected, correct: ok };
  answered = true;
  document.getElementById('answerBtn').disabled = true;
  document.getElementById('placeSelect').disabled = true;
  const fb = document.getElementById('feedback');
  fb.innerHTML = '<b class="' + (ok ? 'ok' : 'no') + '"></b>';
  fb.firstChild.textContent = ok ? 'Correct. ' : 'This job belonged to the ' + P[c.place].name + ': ';
  fb.appendChild(document.createTextNode(c.why));
  showPlace(c.place);
  paintPlaces();
  drawBadges();
  updateControls();
}

function next() {
  if (!answered || finished) return;
  if (current < CARDS.length - 1) {
    current++;
    answered = false;
    selected = null;
    hint('Click any place to read about it.');
  } else {
    finished = true;
    hint('All nine jobs are pinned. Click a numbered badge to read its job.');
  }
  paintPlaces();
  renderPanel();
}

function restart() {
  current = 0; answered = false; finished = false; selected = null; results = [];
  drawPlan();
  drawBadges();
  paintPlaces();
  hint('Click any place on the plan to read about it. Then choose where card 1’s job was done.');
  renderPanel();
}

function updateControls() {
  const done = results.filter(r => r).length;
  const score = results.filter(r => r && r.correct).length;
  document.getElementById('score').textContent = 'Correct: ' + score + ' of ' + done;
  const nb = document.getElementById('nextBtn');
  nb.disabled = !answered || finished;
  nb.textContent = current < CARDS.length - 1 ? 'Next card' : 'See the plan';
  const st = document.getElementById('status');
  if (finished) st.textContent = 'Try Again repeats all nine cards.';
  else if (answered) st.textContent = 'Press ' + nb.textContent + ' to continue.';
  else st.textContent = 'One scored attempt per card.';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('restartBtn').addEventListener('click', restart);
  restart();
});
