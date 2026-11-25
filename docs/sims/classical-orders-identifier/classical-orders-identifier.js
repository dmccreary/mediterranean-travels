// Doric, Ionic, or Corinthian? - custom HTML
// CANVAS_HEIGHT: 582
// Two stages. Explore: the three columns of the chapter's classical-orders
// poster (its image is reused by relative path, not copied), with six part
// buttons; choosing a part outlines it on all three columns and shows a
// one-sentence definition for each order side by side. Quiz: twelve cards in
// a fixed order (features, then buildings on our route); one first attempt
// each, Doric / Ionic / Corinthian, with feedback; each card joins a summary
// grouped by its correct order. Card 6 accepts Ionic or Corinthian.
// Mastery is 10 of 12.

// ---------- Content ----------
const ORDERS = [
  { key: 'doric', name: 'Doric', color: '#9A6B2F', hot: 'D' },
  { key: 'ionic', name: 'Ionic', color: '#1F6F8B', hot: 'I' },
  { key: 'corinthian', name: 'Corinthian', color: '#5E8C31', hot: 'C' }
];

// Image crop shown in the sim: x 0-1536, y 115-935 of the 1536 x 1024 poster image
const IMG_W = 1536, CROP_TOP = 115, CROP_H = 820;
const COL_CENTER = [306, 768, 1228];

// Part rectangles in image pixels [x1, y1, x2, y2] for Doric, Ionic, Corinthian,
// and the one-sentence definition for each order.
const PARTS = [
  { key: 'base', name: 'Base',
    rects: [[196, 880, 416, 928], [681, 860, 855, 907], [1143, 858, 1308, 907]],
    none: [true, false, false],
    defs: ['None. The shaft stands directly on the temple floor (the stylobate).',
           'A molded base: a stack of rings and hollows under the shaft.',
           'A molded base, like the Ionic one.'] },
  { key: 'shaft', name: 'Shaft',
    rects: [[212, 418, 399, 905], [698, 432, 842, 862], [1163, 488, 1287, 862]],
    defs: ['Sturdy and tapering, with about 20 flutes that meet in sharp edges.',
           'Slender, with about 24 flutes separated by flat strips called fillets.',
           'Slender, with the same 24 flutes and fillets as the Ionic.'] },
  { key: 'capital', name: 'Capital',
    rects: [[203, 350, 404, 418], [648, 346, 886, 432], [1108, 334, 1338, 488]],
    defs: ['A plain cushion (the echinus) under a square slab (the abacus).',
           'Two spiral scrolls, called volutes, on the front and back.',
           'A tall bell wrapped in two rows of acanthus leaves, with small scrolls at the corners.'] },
  { key: 'architrave', name: 'Architrave',
    rects: [[150, 302, 457, 352], [608, 287, 927, 346], [1068, 287, 1382, 338]],
    defs: ['A plain, heavy beam resting directly on the capitals.',
           'A beam of three bands, each stepped slightly forward.',
           'Stepped bands, like the Ionic architrave.'] },
  { key: 'frieze', name: 'Frieze',
    rects: [[150, 226, 460, 302], [608, 234, 927, 287], [1068, 230, 1382, 287]],
    defs: ['Triglyphs (blocks with three vertical bars) alternating with metopes (square panels, often carved).',
           'A continuous band, plain or carved, ideal for a long procession.',
           'A continuous band, here carved with scrolling acanthus.'] },
  { key: 'cornice', name: 'Cornice',
    rects: [[115, 182, 497, 214], [583, 182, 953, 234], [1038, 178, 1420, 230]],
    defs: ['The projecting top edge of the entablature, which throws rain clear of the frieze.',
           'The projecting top edge, here with a row of small tooth-like blocks (dentils) beneath it.',
           'The projecting top edge, here carried on small scrolled brackets (modillions).'] }
];

// ans: index into ORDERS; card 6 (index 5) accepts Ionic or Corinthian.
const CARDS = [
  { text: 'A column standing directly on the floor, with no base', chip: 'No base', ans: 0,
    why: 'Only the Doric order has no base.' },
  { text: 'A capital with two large spiral scrolls and no leaves', chip: 'Two scrolls, no leaves', ans: 1,
    why: 'Paired volutes without acanthus mark the Ionic capital.' },
  { text: 'A capital shaped like a basket of acanthus leaves', chip: 'Acanthus basket', ans: 2,
    why: 'The acanthus bell is the Corinthian signature.' },
  { text: 'A frieze of grooved blocks alternating with square panels', chip: 'Triglyphs and metopes', ans: 0,
    why: 'Triglyphs and metopes belong to the Doric entablature.' },
  { text: 'A fallen drum with about 20 grooves meeting in sharp ridges', chip: '20 sharp flutes', ans: 0,
    why: 'Twenty sharp-edged flutes are Doric.' },
  { text: 'A fallen drum with about 24 grooves separated by flat strips, no capital nearby', chip: '24 flutes with fillets', ans: 1, either: true,
    why: 'Ionic and Corinthian share this flute pattern; the capital is needed to separate them.' },
  { text: 'The Parthenon, Athens, 447–432 BCE', chip: 'Parthenon', ans: 0,
    why: 'The Parthenon is the great Doric temple of mainland Greece.' },
  { text: 'The Temple of Athena Nike, Athens', chip: 'Athena Nike', ans: 1,
    why: 'Athens used the Ionic order for this small, graceful temple.' },
  { text: 'The Temple of Artemis, Ephesus', chip: 'Temple of Artemis', ans: 1,
    why: 'Ephesus is in Ionia, and its temple was one of the first giant Ionic temples.' },
  { text: 'The Temple of Olympian Zeus, Athens, finished by Hadrian', chip: 'Olympian Zeus', ans: 2,
    why: 'Its surviving columns carry acanthus capitals; the Romans favored the Corinthian order.' },
  { text: 'The Basilica Stoa in the State Agora of Ephesus, with bulls’ heads on its capitals', chip: 'Basilica Stoa', ans: 1,
    why: 'Its capitals have volutes, with bulls’ heads added as a local touch.', scrolls: true },
  { text: 'A smooth, unfluted column with an acanthus capital on a street in Roman Ephesus', chip: 'Smooth shaft, acanthus', ans: 2,
    why: 'The capital decides; unfluted shafts occur in every order.' }
];
CARDS[1].scrolls = true;
const SCROLL_NOTE = 'Scrolls alone are Ionic; Corinthian needs the acanthus leaves.';
const MASTERY = 10;

// ---------- State ----------
let part = 2;          // Capital, per the starting question
let stage = 'explore';
let current = 0;
let answered = false;
let finished = false;
let score = 0;
let results = [];      // per card: { chosen, ok }

const $ = id => document.getElementById(id);

// ---------- Explore ----------
function pct(v) { return (v * 100).toFixed(3) + '%'; }

function buildParts() {
  const box = $('parts');
  PARTS.forEach((p, i) => {
    const b = document.createElement('button');
    b.textContent = p.name;
    b.addEventListener('click', () => selectPart(i));
    box.appendChild(b);
  });
}

function selectPart(i) {
  part = i;
  const P = PARTS[i];
  document.querySelectorAll('#parts button').forEach((b, k) => b.classList.toggle('on', k === i));
  const pic = $('pic');
  pic.querySelectorAll('.hl, .orderlbl').forEach(e => e.remove());
  ORDERS.forEach((O, k) => {
    const lbl = document.createElement('div');
    lbl.className = 'orderlbl';
    lbl.style.left = pct(COL_CENTER[k] / IMG_W);
    lbl.style.background = O.color;
    lbl.textContent = O.name;
    pic.appendChild(lbl);

    const r = P.rects[k];
    const hl = document.createElement('div');
    hl.className = 'hl' + (P.none && P.none[k] ? ' none' : '');
    hl.style.borderColor = O.color;
    hl.style.left = pct(r[0] / IMG_W);
    hl.style.width = pct((r[2] - r[0]) / IMG_W);
    hl.style.top = pct((r[1] - CROP_TOP) / CROP_H);
    hl.style.height = pct((r[3] - r[1]) / CROP_H);
    if (P.none && P.none[k]) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.style.background = O.color;
      tag.style.top = '-21px';
      tag.textContent = 'no base';
      hl.appendChild(tag);
    }
    pic.appendChild(hl);
  });
  $('defs').innerHTML = ORDERS.map((O, k) =>
    '<div class="def" style="border-top-color:' + O.color + '"><b style="color:' + O.color + '">' +
    O.name + ' ' + P.name.toLowerCase() + '</b>' + P.defs[k] + '</div>').join('');
}

// Clicking a part on the drawing selects it
$('pic').addEventListener('click', e => {
  const box = $('pic').getBoundingClientRect();
  const x = (e.clientX - box.left) / box.width * IMG_W;
  const y = CROP_TOP + (e.clientY - box.top) / box.height * CROP_H;
  for (let i = 0; i < PARTS.length; i++) {
    for (const r of PARTS[i].rects) {
      if (x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3]) { selectPart(i); return; }
    }
  }
});

// ---------- Stages ----------
function showStage(s) {
  stage = s;
  $('stage-explore').classList.toggle('on', s === 'explore');
  $('stage-quiz').classList.toggle('on', s === 'quiz');
  $('tab-explore').classList.toggle('on', s === 'explore');
  $('tab-quiz').classList.toggle('on', s === 'quiz');
  matchHeights();
}

// Both stages get the same height, so the iframe never jumps between them
function matchHeights() {
  const ex = $('stage-explore'), qz = $('stage-quiz');
  ex.style.minHeight = qz.style.minHeight = '';
  const wasEx = ex.classList.contains('on'), wasQz = qz.classList.contains('on');
  ex.classList.add('on'); qz.classList.remove('on');
  const h1 = ex.offsetHeight;
  ex.classList.remove('on'); qz.classList.add('on');
  const h2 = qz.offsetHeight;
  ex.classList.toggle('on', wasEx); qz.classList.toggle('on', wasQz);
  const h = Math.max(h1, h2);
  ex.style.minHeight = qz.style.minHeight = h + 'px';
}

// ---------- Quiz ----------
function updateScore() {
  const n = results.filter(r => r).length;
  $('score').innerHTML = n ? '<span class="long">Correct: </span>' + score + '<span class="long"> of </span><span class="short">/</span>' + CARDS.length : '';
}

function renderCard() {
  const C = CARDS[current];
  answered = false;
  $('cnum').textContent = 'CARD ' + (current + 1) + ' OF ' + CARDS.length;
  $('ctext').textContent = C.text;
  const box = $('choices');
  box.style.display = '';
  box.innerHTML = '';
  ORDERS.forEach((O, k) => {
    const b = document.createElement('button');
    b.textContent = O.name;
    b.style.borderColor = O.color;
    b.style.color = O.color;
    b.dataset.k = k;
    b.title = O.name + ' (key ' + O.hot + ')';
    b.addEventListener('click', () => choose(k));
    box.appendChild(b);
  });
  $('feedback').innerHTML = '<span style="color:#6b6259">Which order? Start with the capital if the card gives one.</span>';
  $('next').style.display = '';
  $('next').disabled = true;
  $('next').textContent = current < CARDS.length - 1 ? 'Next card' : 'See result';
  $('again').style.display = 'none';
  $('hint').textContent = 'Keys D, I and C choose; Enter goes on.';
  renderSummary();
}

function isCorrect(C, k) {
  return k === C.ans || (C.either && (k === 1 || k === 2));
}

function choose(k) {
  if (stage !== 'quiz' || answered || finished) return;
  answered = true;
  const C = CARDS[current];
  const ok = isCorrect(C, k);
  if (ok) score++;
  results[current] = { chosen: k, ok: ok };
  document.querySelectorAll('#choices button').forEach(b => {
    const bk = +b.dataset.k;
    b.disabled = true;
    if (isCorrect(C, bk) && (ok ? bk === k : true)) b.classList.add('correct');
    else if (bk === k) b.classList.add('wrong');
  });
  let fb;
  if (ok) fb = '<span class="ok">Correct.</span> ' + C.why;
  else {
    const name = C.either ? 'Ionic or Corinthian' : ORDERS[C.ans].name;
    fb = '<span class="no">This one is ' + name + '.</span> ' + C.why;
    if (C.scrolls && k === 2) fb += ' ' + SCROLL_NOTE;
  }
  $('feedback').innerHTML = fb;
  $('next').disabled = false;
  updateScore();
  renderSummary();
}

function nextCard() {
  if (stage !== 'quiz' || !answered || finished) return;
  if (current < CARDS.length - 1) { current++; renderCard(); }
  else finish();
}

function finish() {
  finished = true;
  $('cnum').textContent = 'RESULT';
  $('ctext').textContent = 'You classified ' + score + ' of 12. Mastery is 10.';
  $('choices').style.display = 'none';
  $('feedback').innerHTML = score >= MASTERY
    ? '<span class="ok">Mastery reached.</span> Notice the pattern: the capital decides most cards, the flute count separates Doric from the other two, and the buildings of Ionia are Ionic.'
    : '<span class="no">Not yet.</span> Look again at the capitals in <b>Explore parts</b>, then press <b>Try again</b> to restart from card 1 in the same order.';
  $('next').style.display = 'none';
  $('again').style.display = '';
  $('again').textContent = score >= MASTERY ? 'Start over' : 'Try again';
  $('hint').textContent = 'The summary below shows every card in its correct order.';
  renderSummary();
}

function restart() {
  current = 0; score = 0; finished = false; results = [];
  updateScore();
  renderCard();
}

function renderSummary() {
  const cols = [[], [], []];
  CARDS.forEach((C, i) => {
    const r = results[i];
    if (!r) return;
    // Card 6 sits under the order the learner chose when that choice was accepted
    const where = (C.either && r.ok) ? r.chosen : C.ans;
    cols[where].push(i);
  });
  $('summary').innerHTML = ORDERS.map((O, k) =>
    '<div class="bin"><h3 style="background:' + O.color + '">' + O.name +
    (cols[k].length ? ' (' + cols[k].length + ')' : '') + '</h3><div class="chips">' +
    cols[k].map(i => {
      const r = results[i];
      const isNew = (!finished && i === current);
      return '<div class="chip ' + (r.ok ? 'ok' : 'no') + (isNew ? ' new' : '') + '">' +
        (i + 1) + '. ' + CARDS[i].chip + (CARDS[i].either ? ' (or ' + (where6(r) === 1 ? 'Corinthian' : 'Ionic') + ')' : '') +
        (r.ok ? ' ✓' : ' ✗ <span class="you">you: ' + ORDERS[r.chosen].name + '</span>') + '</div>';
    }).join('') + '</div></div>').join('');
}
function where6(r) { return r.ok ? r.chosen : 1; }

// ---------- Wiring ----------
$('tab-explore').addEventListener('click', () => showStage('explore'));
$('tab-quiz').addEventListener('click', () => showStage('quiz'));
$('go-quiz').addEventListener('click', () => showStage('quiz'));
$('next').addEventListener('click', nextCard);
$('again').addEventListener('click', restart);
document.addEventListener('keydown', e => {
  if (stage !== 'quiz') return;
  const k = e.key.toLowerCase();
  if (k === 'd') choose(0);
  else if (k === 'i') choose(1);
  else if (k === 'c') choose(2);
  else if (e.key === 'Enter') nextCard();
});
window.addEventListener('resize', matchHeights);

buildParts();
selectPart(part);
renderCard();
updateScore();
// Height matching waits for the image, whose height depends on the width
const img = document.querySelector('#pic img');
if (img.complete) matchHeights(); else img.addEventListener('load', matchHeights);
matchHeights();
