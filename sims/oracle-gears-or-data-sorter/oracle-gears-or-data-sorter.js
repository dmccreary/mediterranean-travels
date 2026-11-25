// Oracle, Gears, or Data? - p5.js 2.x
// CANVAS_HEIGHT: 656
// Twelve predictions, shuffled once per page load. The learner sorts each into
// one of three bins by how its answer was produced: Oracle, Cycle model, or
// Learned model. Drag a card, or select it and press a bin button (keys 1-3).
// Check (all twelve placed) marks every card; only the first Check is scored
// (mastery 10 of 12); later Checks are practice. Four cards belong in each bin.

let canvasWidth = 700;
let drawHeight = 556;   // set by computeLayout
let controlHeight = 84;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let panelH = 120;
let defH = 48;

const BINS = [
  { name: 'Oracle', color: '#7a4b9a', tint: '#efe6f4',
    def: 'A person gives an answer that the people asking must interpret.' },
  { name: 'Cycle model', color: '#9a6a13', tint: '#f8efdc',
    def: 'A rule built from regular cycles counted in past records, fixed in advance and the same for everyone.' },
  { name: 'Learned model', color: '#1f5fa8', tint: '#e2ecf7',
    def: 'A rule that a computer adjusted for itself from a very large number of past examples.' }
];

// The spec's twelve cards, in the spec's order; bin: index into BINS.
const STATEMENTS = [
  { label: 'The wooden wall', bin: 0,
    text: 'Athens’s envoys are told to trust the “wooden wall” (480 BCE).',
    why: 'The Pythia’s words came through a person, and the Assembly had to argue over what they meant.' },
  { label: 'Eclipse dial', bin: 1,
    text: 'The mechanism’s lower back dial marks a possible eclipse in a month 18 years from now.',
    why: 'The 223-month Saros cycle is cut into the gears, so the dial gives the same answer every time the crank is turned.' },
  { label: 'Phone keyboard', bin: 2,
    text: 'A phone keyboard suggests the next word of a message home.',
    why: 'The keyboard learned which words usually follow which from an enormous amount of text.' },
  { label: 'Croesus and Persia', bin: 0,
    text: 'Croesus is told that if he attacks Persia, he will destroy a great empire.',
    why: 'The answer came from the Pythia, and Croesus heard the reading he wanted.' },
  { label: 'Babylonian tablet', bin: 1,
    text: 'A Babylonian scribe’s clay tablet lists the months, years ahead, when an eclipse may occur.',
    why: 'It counts the same repeating cycles as the gears; the method, not the material, decides the bin.' },
  { label: 'Fraud alert', bin: 2,
    text: 'A bank’s fraud system flags a card payment in Arachova as possibly not ours.',
    why: 'The fraud check learned from millions of past genuine and fraudulent payments.' },
  { label: 'King Laius', bin: 0,
    text: 'King Laius is told that his son will kill him.',
    why: 'A personal answer from Delphi, given by a person and fulfilled in the story of Oedipus.' },
  { label: 'Games dial', bin: 1,
    text: 'The mechanism’s games dial shows that the Olympic Games fall in this year.',
    why: 'The four-year cycle of the games is fixed in the gearing.' },
  { label: 'Chatbot on Monday', bin: 2,
    text: 'A chatbot answers the question “Will the museum be open on Monday?”',
    why: 'It predicts a likely answer from its training text; it cannot know this Monday’s hours.' },
  { label: 'Star peg calendar', bin: 1,
    text: 'A stone peg calendar says that a certain star rises today and that a west wind will blow.',
    why: 'The parapegma counts the yearly cycle of star risings; its weather forecast was tied to that cycle.' },
  { label: 'Chaerephon’s question', bin: 0,
    text: 'Chaerephon is told that no one is wiser than Socrates.',
    why: 'An answer from the Pythia that Socrates spent his life interpreting and testing.' },
  { label: 'Map app drive time', bin: 2,
    text: 'A map app predicts how long the drive back from Delphi will take.',
    why: 'It learned travel times from the movements of many other phones.' }
];

// Shuffled once per page load; Reset keeps the same order.
const ORDER = (() => {
  const a = STATEMENTS.map((_, k) => k);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
})();
const CARDS = ORDER.map(k => STATEMENTS[k]);
const N = CARDS.length;
const MASTERY = 10;
const QUESTION = 'How was each answer produced?';
const MASTERY_MSG = 'You can tell an oracle, a cycle model, and a learned model apart by how they work.';
const EXTRA_TO_ORACLE = 'Ancient does not mean guesswork: this answer was counted, not revealed.';
const EXTRA_TO_LEARNED = 'This rule was set once by its maker and never adjusted itself.';

// ---------- State ----------
let place = [];        // per card: -1 (tray) or bin index
let marks = [];        // per card: null | 'ok' | 'no'
let checkedAt = [];    // per card: bin it was in at the last Check
let selected = 0;
let checks = 0;
let firstScore = null;
let lastScore = null;
let chipRects = [];
let binRects = [];
let trayRect = null;
let drag = null;

// ---------- Controls ----------
let binButtons = [];
let checkButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let b = 0; b < BINS.length; b++) {
    const btn = createButton('');
    btn.parent(document.querySelector('main'));
    btn.style('font-size', '14px');
    btn.style('padding', '4px 0px');
    btn.style('color', 'white');
    btn.style('background-color', BINS[b].color);
    btn.style('border', '1px solid ' + BINS[b].color);
    btn.style('border-radius', '4px');
    btn.attribute('title', 'Place the selected card: ' + BINS[b].name + ' (key ' + (b + 1) + ')');
    btn.mousePressed(() => placeCard(selected, b, true));
    binButtons.push(btn);
  }
  checkButton = createButton('Check');
  checkButton.parent(document.querySelector('main'));
  checkButton.style('font-size', '14px');
  checkButton.mousePressed(checkAll);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.style('font-size', '14px');
  resetButton.mousePressed(resetAll);

  computeLayout();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
  resetAll();

  describe('A sorting activity with twelve predictions, from Delphi’s oracle, the Antikythera mechanism, ' +
           'Babylonian tablets, a stone peg calendar, and modern phones and apps. The learner drags each card, ' +
           'or selects it and presses a bin button, into one of three bins: Oracle, Cycle model, or Learned model. ' +
           'Check marks each card correct or not yet correct and explains how that answer was produced.');
}

// ---------- Layout ----------
const isNarrow = () => canvasWidth < 560;
const binW = () => (canvasWidth - 2 * margin - 16) / 3;

function panelLines(i, m, at) {
  // the longest feedback this card can show
  const c = CARDS[i];
  let body = c.why;
  if (m === 'no' && c.bin === 1) body += ' ' + (at === 0 ? EXTRA_TO_ORACLE : EXTRA_TO_LEARNED);
  return body;
}

function computeLayout() {
  const narrow = isNarrow();
  const tw = canvasWidth - 2 * margin - 24;
  let need = 0;
  for (let i = 0; i < N; i++) {
    textStyle(BOLD);
    textSize(narrow ? 15 : 16);
    let h = 9 + 18 + wrapLines(CARDS[i].text, tw).length * 21 + 5;
    textStyle(NORMAL);
    textSize(14);
    const worst = CARDS[i].bin === 1 ? 0 : (CARDS[i].bin + 1) % 3;
    h += wrapLines('Not quite: ' + panelLines(i, 'no', worst), tw).length * 19 + 8;
    need = Math.max(need, h);
  }
  panelH = Math.ceil(need);
  textSize(12);
  textStyle(ITALIC);
  defH = 6 + Math.max(...BINS.map(B => wrapLines(B.def, binW() - 14).length)) * 15;
  textStyle(NORMAL);
  const trayH = 22 + trayRows() * 32 + 2;
  const binsH = 28 + defH + 5 * 31 + 8;
  drawHeight = 66 + trayH + 8 + panelH + 8 + binsH + 8;
  canvasHeight = drawHeight + controlHeight;
}

const trayCols = () => (isNarrow() ? 3 : 4);
const trayRows = () => Math.ceil(N / trayCols());

let statusX = 200;
function positionControls() {
  const gap = 8;
  const w = binW();
  for (let b = 0; b < binButtons.length; b++) {
    binButtons[b].html((b + 1) + '  ' + BINS[b].name);
    binButtons[b].position(margin + b * (w + gap), drawHeight + 8);
    binButtons[b].size(w, 32);
  }
  let x = margin;
  for (const btn of [checkButton, resetButton]) {
    btn.position(x, drawHeight + 50);
    x += (btn.elt.offsetWidth || 70) + 10;
  }
  statusX = x + 6;
}

function enable(btn, on) {
  if (on) { btn.removeAttribute('disabled'); btn.style('opacity', '1'); btn.style('cursor', 'pointer'); }
  else { btn.attribute('disabled', ''); btn.style('opacity', '0.5'); btn.style('cursor', 'default'); }
}

const allCorrect = () => marks.length > 0 && marks.every(m => m === 'ok');

function updateButtonStates() {
  const canMove = selected >= 0 && marks[selected] !== 'ok';
  for (const btn of binButtons) enable(btn, canMove);
  enable(checkButton, place.every(p => p >= 0) && !allCorrect());
}

// ---------- Flow ----------
function resetAll() {
  place = CARDS.map(() => -1);
  marks = CARDS.map(() => null);
  checkedAt = CARDS.map(() => -1);
  selected = 0;
  checks = 0;
  firstScore = null;
  lastScore = null;
  drag = null;
  updateButtonStates();
}

function placeCard(i, b, advance) {
  if (i < 0 || marks[i] === 'ok') return;
  if (place[i] !== b) marks[i] = null;   // a moved card waits for the next Check
  place[i] = b;
  if (advance) {
    for (let d = 1; d <= N; d++) {
      const j = (i + d) % N;
      if (place[j] < 0 || marks[j] === 'no') { selected = j; break; }
    }
  }
  updateButtonStates();
}

function checkAll() {
  if (!place.every(p => p >= 0) || allCorrect()) return;
  checks++;
  let score = 0;
  for (let i = 0; i < N; i++) {
    marks[i] = place[i] === CARDS[i].bin ? 'ok' : 'no';
    checkedAt[i] = place[i];
    if (marks[i] === 'ok') score++;
  }
  lastScore = score;
  if (firstScore === null) firstScore = score;
  const wrong = marks.indexOf('no');
  selected = wrong >= 0 ? wrong : -1;
  updateButtonStates();
}

// ---------- Input ----------
function keyPressed() {
  if (key === '1' || key === '2' || key === '3') placeCard(selected, Number(key) - 1, true);
  else if (key === 'ArrowRight') { selected = (selected + 1) % N; updateButtonStates(); }
  else if (key === 'ArrowLeft') { selected = (selected + N - 1) % N; updateButtonStates(); }
  else if (key === 'Enter') checkAll();
}

function inside(r, x, y) { return r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  for (const r of chipRects) {
    if (inside(r, mouseX, mouseY)) {
      selected = r.i;
      if (marks[r.i] !== 'ok') drag = { i: r.i, ox: mouseX - r.x, oy: mouseY - r.y, w: r.w, h: r.h,
                                        sx: mouseX, sy: mouseY, moved: false };
      updateButtonStates();
      return;
    }
  }
  for (const r of binRects) {
    if (inside(r, mouseX, mouseY)) { placeCard(selected, r.b, true); return; }
  }
}

function mouseDragged() {
  if (!drag) return;
  if (abs(mouseX - drag.sx) + abs(mouseY - drag.sy) > 5) drag.moved = true;
}

function mouseReleased() {
  if (!drag) return;
  const d = drag;
  drag = null;
  if (!d.moved) return;
  for (const r of binRects) {
    if (inside(r, mouseX, mouseY)) { placeCard(d.i, r.b, false); return; }
  }
  if (inside(trayRect, mouseX, mouseY) && marks[d.i] !== 'ok') {
    place[d.i] = -1;
    marks[d.i] = null;
    updateButtonStates();
  }
}

// ---------- Drawing ----------
function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = isNarrow();
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow ? 18 : 22);
  text('Oracle, Gears, or Data?', margin, 10);
  textStyle(NORMAL);
  textSize(14);
  textAlign(RIGHT, TOP);
  const scoreText = firstScore === null ? 'First attempt: – of 12' : 'First attempt: ' + firstScore + ' of 12';
  text(scoreText, canvasWidth - margin, 15);
  textAlign(LEFT, TOP);
  textStyle(ITALIC);
  textSize(15);
  fill('#4a3b10');
  text(fitText(QUESTION + ' Look past the age and the material to the method.', canvasWidth - 2 * margin), margin, 40);
  textStyle(NORMAL);

  chipRects = [];
  binRects = [];
  const trayBottom = drawTray(66);
  const panelBottom = drawPanel(margin, trayBottom + 8, canvasWidth - 2 * margin, panelH);
  drawBins(panelBottom + 8, drawHeight - 8);

  if (drag && drag.moved) drawChip(drag.i, mouseX - drag.ox, mouseY - drag.oy, drag.w, drag.h, true);
  let over = false;
  for (const r of chipRects) if (inside(r, mouseX, mouseY) && marks[r.i] !== 'ok') over = true;
  for (const r of binRects) if (inside(r, mouseX, mouseY) && selected >= 0) over = true;
  cursor(drag && drag.moved ? 'grabbing' : over ? HAND : ARROW);

  // status line
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  const nPlaced = place.filter(p => p >= 0).length;
  let status;
  fill('dimgray');
  if (checks === 0) {
    status = nPlaced < N ? 'Placed: ' + nPlaced + ' of 12. Drag a card, or select it and press 1, 2 or 3.'
                         : 'All twelve placed. Press Check.';
  } else if (firstScore >= MASTERY && checks === 1) {
    fill('darkgreen');
    status = MASTERY_MSG;
  } else if (allCorrect()) {
    status = 'All twelve correct' + (checks > 1 ? ' (practice check ' + checks + ').' : '.') +
             (firstScore >= MASTERY ? ' Mastery shown on the first attempt.' : ' Mastery is 10 on the first attempt.');
  } else {
    status = (checks > 1 ? 'Practice check: ' + lastScore + ' of 12. ' : '') +
             (firstScore >= MASTERY ? '' : 'Mastery is 10. ') + 'Move the red cards and Check again.';
  }
  text(fitText(status, canvasWidth - margin - statusX), statusX, drawHeight + 66);
}

function drawTray(top) {
  const x = margin, w = canvasWidth - 2 * margin;
  const cols = trayCols();
  const gap = 6;
  const chipH = 26;
  const h = 22 + trayRows() * (chipH + gap) + 2;
  trayRect = { x: x, y: top, w: w, h: h };
  stroke('#c9b88f');
  strokeWeight(1);
  fill('#f6f0e2');
  rect(x, top, w, h, 8);
  noStroke();
  fill('#6b5a2a');
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  const waiting = place.filter(p => p < 0).length;
  text(waiting ? 'CARDS TO PLACE (' + waiting + ')' : 'ALL CARDS PLACED · click any card to read it', x + 8, top + 5);
  textStyle(NORMAL);
  const cw = (w - 16 - (cols - 1) * gap) / cols;
  for (let i = 0; i < N; i++) {
    const cx = x + 8 + (i % cols) * (cw + gap);
    const cy = top + 22 + floor(i / cols) * (chipH + gap);
    if (place[i] < 0) {
      if (drag && drag.moved && drag.i === i) { drawSlot(cx, cy, cw, chipH); continue; }
      drawChip(i, cx, cy, cw, chipH, false);
      chipRects.push({ i: i, x: cx, y: cy, w: cw, h: chipH });
    } else {
      drawSlot(cx, cy, cw, chipH);
    }
  }
  return top + h;
}

function drawSlot(x, y, w, h) {
  noFill();
  stroke('#d8ccb0');
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  rect(x, y, w, h, 5);
  drawingContext.setLineDash([]);
}

function drawChip(i, x, y, w, h, lifted) {
  const c = CARDS[i];
  const b = place[i];
  const m = marks[i];
  const isSel = i === selected;
  fill(b >= 0 ? BINS[b].tint : 'white');
  if (lifted) fill('#fff6d6');
  if (m === 'ok') stroke('#2e7d32');
  else if (m === 'no') stroke('firebrick');
  else stroke(b >= 0 ? BINS[b].color : '#9aa7b0');
  strokeWeight(isSel ? 3 : m ? 2 : 1);
  if (m === 'no') drawingContext.setLineDash([4, 3]);
  if (isSel && !m) stroke('#c8963e');
  rect(x, y, w, h, 5);
  drawingContext.setLineDash([]);
  noStroke();
  fill(m === 'ok' ? '#2e7d32' : m === 'no' ? 'firebrick' : '#5d6d78');
  rect(x + 3, y + 3, 22, h - 6, 4);
  fill('white');
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(12);
  text(i + 1, x + 14, y + h / 2 + 1);
  textStyle(NORMAL);
  fill('#1d2a33');
  textAlign(LEFT, CENTER);
  textSize(13);
  const mark = m === 'ok' ? ' ✓' : m === 'no' ? ' ✗' : '';
  text(fitText(c.label + mark, w - 34), x + 30, y + h / 2 + 1);
}

function drawPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const pad = 12;
  const tw = w - 2 * pad;
  let yy = y + 9;

  if (allCorrect() && selected < 0) {
    fill('black');
    textStyle(BOLD);
    textSize(16);
    yy = drawWrapped('Four in each bin. The eclipse dial, the Babylonian tablet, the games dial and the star peg ' +
                     'calendar share a bin, though they are bronze, clay and stone.', x + pad, yy, tw, 21) + 4;
    textStyle(NORMAL);
    textSize(14);
    fill('#333');
    drawWrapped('The method, not the material, decides: a person interprets, a cycle is counted, or a rule is ' +
                'learned from examples. Click any card to read why it belongs where it is.', x + pad, yy, tw, 19);
    return y + h;
  }
  if (selected < 0) {
    fill('#4a5a66');
    textSize(14);
    drawWrapped('Click a card to read it.', x + pad, yy, tw, 19);
    return y + h;
  }
  const c = CARDS[selected];
  const b = place[selected];
  const m = marks[selected];
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  const where = b < 0 ? 'NOT PLACED YET' : 'IN: ' + BINS[b].name.toUpperCase();
  text(fitText('CARD ' + (selected + 1) + ' OF 12 · ' + where, tw), x + pad, yy);
  yy += 18;
  fill('black');
  textSize(isNarrow() ? 15 : 16);
  yy = drawWrapped(c.text, x + pad, yy, tw, 21) + 5;
  textStyle(NORMAL);
  textSize(14);
  if (m) {
    const head = m === 'ok' ? 'Correct:' : 'Not quite:';
    const body = m === 'ok' ? c.why : panelLines(selected, 'no', checkedAt[selected]);
    textStyle(BOLD);
    fill(m === 'ok' ? 'darkgreen' : 'firebrick');
    text(head, x + pad, yy);
    const hw = textWidth(head) + 6;
    textStyle(NORMAL);
    fill('black');
    const words = body.split(' ');
    let first = '';
    while (words.length && textWidth(first + (first ? ' ' : '') + words[0]) <= tw - hw) first += (first ? ' ' : '') + words.shift();
    text(first, x + pad + hw, yy);
    if (words.length) drawWrapped(words.join(' '), x + pad, yy + 19, tw, 19);
  } else if (checks > 0 && b >= 0) {
    fill('#4a5a66');
    textStyle(ITALIC);
    drawWrapped('Moved. Press Check to test the new place (practice only).', x + pad, yy, tw, 19);
    textStyle(NORMAL);
  } else {
    fill('#4a5a66');
    textStyle(ITALIC);
    drawWrapped('Who or what produced this answer: a person to be interpreted, a counted cycle, or a rule learned from examples?',
                x + pad, yy, tw, 19);
    textStyle(NORMAL);
  }
  return y + h;
}

function drawBins(top, bottom) {
  const gap = 8;
  const w = binW();
  const h = bottom - top;
  for (let b = 0; b < BINS.length; b++) {
    const x = margin + b * (w + gap);
    const B = BINS[b];
    const hot = drag && drag.moved && inside({ x: x, y: top, w: w, h: h }, mouseX, mouseY);
    stroke(B.color);
    strokeWeight(hot ? 3 : 1.5);
    fill(hot ? '#fffbe9' : B.tint);
    rect(x, top, w, h, 8);
    noStroke();
    fill(B.color);
    rect(x, top, w, 28, 8, 8, 0, 0);
    fill('white');
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(isNarrow() ? 13 : 15);
    text(fitText((b + 1) + '  ' + B.name, w - 12), x + 8, top + 14);
    // definition, always visible
    textStyle(ITALIC);
    textSize(12);
    fill('#33404a');
    textAlign(LEFT, TOP);
    drawWrapped(B.def, x + 7, top + 32, w - 14, 15);
    textStyle(NORMAL);
    binRects.push({ b: b, x: x, y: top, w: w, h: h });

    const members = [];
    for (let i = 0; i < N; i++) if (place[i] === b && !(drag && drag.moved && drag.i === i)) members.push(i);
    const chipTop = top + 28 + defH;
    const ch = 26;
    const rows = Math.max(1, Math.floor((bottom - 6 - chipTop + 5) / (ch + 5)));
    const cols = Math.max(1, Math.ceil(members.length / rows));
    const cg = 5;
    const cw = (w - 12 - (cols - 1) * cg) / cols;
    for (let k = 0; k < members.length; k++) {
      const cx = x + 6 + floor(k / rows) * (cw + cg);
      const cy = chipTop + (k % rows) * (ch + 5);
      drawChip(members[k], cx, cy, cw, ch, false);
      chipRects.push({ i: members[k], x: cx, y: cy, w: cw, h: ch });
    }
    if (!members.length) {
      noStroke();
      fill(B.color);
      textAlign(CENTER, CENTER);
      textStyle(ITALIC);
      textSize(13);
      text('Drop cards here', x + w / 2, (chipTop + bottom) / 2);
      textStyle(NORMAL);
    }
  }
}

// ---------- Text helpers ----------
function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (textWidth(test) > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(str, x, y, maxW, lineH) {
  const lines = wrapLines(str, maxW);
  for (let i = 0; i < lines.length; i++) text(lines[i], x, y + i * lineH);
  return y + lines.length * lineH;
}

function fitText(str, maxW) {
  if (textWidth(str) <= maxW) return str;
  let s = str;
  while (s.length > 1 && textWidth(s + '…') > maxW) s = s.slice(0, -1);
  return s + '…';
}

function windowResized() {
  updateCanvasSize();
  computeLayout();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
}

// A little state for headless testing
window.oracleSorter = {
  placeAll: correct => { for (let i = 0; i < N; i++) { place[i] = correct ? CARDS[i].bin : (CARDS[i].bin + 1) % 3; marks[i] = null; } updateButtonStates(); },
  placeMixed: () => { for (let i = 0; i < N; i++) { place[i] = i % 4 === 0 ? (CARDS[i].bin + 2) % 3 : CARDS[i].bin; marks[i] = null; } updateButtonStates(); },
  check: () => checkAll(), select: i => { selected = i; updateButtonStates(); },
  height: () => canvasHeight, first: () => firstScore
};
