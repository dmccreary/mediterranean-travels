// Two Ends of the Serpent Column - p5.js 2.x
// CANVAS_HEIGHT: 568
// Ten claim cards about the Serpent Column, shown in a fixed shuffled order.
// The learner places each card in one of three bins: Check it at Delphi,
// Check it in Istanbul, or Only in a written source. Drag a card, or select
// it and press a bin button (keys 1 to 3). Check (all ten placed) marks every
// card; unlimited re-checks, and only the first Check counts toward mastery
// (8 of 10). Correct totals: 3 Delphi, 3 Istanbul, 4 written sources.

let canvasWidth = 700;
let drawHeight = 484;
let controlHeight = 84;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const BINS = [
  { name: 'Check it at Delphi', short: 'Delphi', has: 'the place', color: '#2f6b4f', tint: '#e3f0e8' },
  { name: 'Check it in Istanbul', short: 'Istanbul', has: 'the object', color: '#1f5fa8', tint: '#e2ecf7' },
  { name: 'Only in a written source', short: 'Written', has: 'the story', color: '#7a4b9a', tint: '#efe6f4' }
];

// In the order of the chapter's table; bin: index into BINS.
const CLAIMS = [
  { label: 'Named coils', bin: 1, text: 'Bronze coils carry the names of the Greek cities that fought.',
    why: 'The inscribed coils stand in the Hippodrome, where Constantine moved them.' },
  { label: 'Stone base', bin: 0, text: 'A stone base by the great altar marks where the monument stood.',
    why: 'The base never left the sanctuary.' },
  { label: 'Bronze copy', bin: 0, text: 'A bronze copy shows how the column looked in its setting.',
    why: 'The copy stands near the altar, close to where the original stood.' },
  { label: 'Upper jaw', bin: 1, text: 'The upper jaw of one serpent head survives.',
    why: 'It is in the Istanbul Archaeology Museums, beside Gülhane Park.' },
  { label: 'Sunken pit', bin: 1, text: 'The column stands in a pit because the ground has risen since Byzantine times.',
    why: 'The pit is in the Hippodrome, at about the level of the Byzantine track.' },
  { label: 'Terrace wall', bin: 0, text: 'The temple terrace where the monument stood is held up by the polygonal wall.',
    why: 'We can walk along the wall below the terrace.' },
  { label: 'Erased boast', bin: 2, text: 'The Spartan commander Pausanias had his own name inscribed first, and it was erased.',
    why: 'Thucydides tells this story; the erased verse does not survive on the bronze.' },
  { label: 'Gold tripod', bin: 2, text: 'A golden tripod once sat on top of the three heads.',
    why: 'Herodotus and Pausanias describe the tripod; its gold was taken long ago.' },
  { label: 'Tenth of spoils', bin: 2, text: 'The monument was made from a tenth of the spoils of Plataea.',
    why: 'Herodotus gives the source of the metal; the bronze itself cannot tell us.' },
  { label: 'Phocians’ gold', bin: 2, text: 'The Phocian leaders took the tripod’s gold during the Third Sacred War.',
    why: 'The travel writer Pausanias reports it, about five hundred years later.' }
];
// Shuffled once, the same every time (and after Reset).
const ORDER = [6, 1, 3, 8, 0, 5, 9, 2, 4, 7];
const CARDS = ORDER.map(k => CLAIMS[k]);
const MASTERY = 8;
const QUESTION = 'The bronze is in Istanbul. What can only Delphi tell us?';
const SUMMARY = 'Delphi has the place, Istanbul has the object, and the writers have the story.';

// ---------- State ----------
let place = [];        // per card: -1 (tray) or bin index
let marks = [];        // per card: null | 'ok' | 'no'
let selected = 0;
let checks = 0;
let firstScore = null;
let lastScore = null;
let chipRects = [];    // { i, x, y, w, h }
let binRects = [];     // { b, x, y, w, h }
let trayRect = null;
let drag = null;       // { i, ox, oy, x, y, moved, sx, sy }

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

  positionControls();
  resetAll();

  describe('A sorting activity about the Serpent Column, the bronze victory monument from Plataea that once stood at Delphi ' +
           'and now stands in the Hippodrome of Istanbul. Ten claim cards start in a tray. The learner drags each card, ' +
           'or selects it and presses a bin button, into one of three bins: Check it at Delphi, Check it in Istanbul, or ' +
           'Only in a written source. Check marks each card correct or incorrect and shows why.');
}

let statusX = 200;
function positionControls() {
  const gap = 8;
  const w = (canvasWidth - 2 * margin - 2 * gap) / 3;
  const narrow = canvasWidth < 560;
  for (let b = 0; b < binButtons.length; b++) {
    binButtons[b].html((b + 1) + '  ' + (narrow ? BINS[b].short : BINS[b].name));
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

function updateButtonStates() {
  const canMove = selected >= 0 && marks[selected] !== 'ok';
  for (const btn of binButtons) enable(btn, canMove);
  const allPlaced = place.every(p => p >= 0);
  enable(checkButton, allPlaced && !allCorrect());
}

const allCorrect = () => marks.length > 0 && marks.every(m => m === 'ok');

function resetAll() {
  place = CARDS.map(() => -1);
  marks = CARDS.map(() => null);
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
    // select the next unplaced card, or (after a Check) the next wrong one
    for (let d = 1; d <= CARDS.length; d++) {
      const j = (i + d) % CARDS.length;
      if (place[j] < 0 || marks[j] === 'no') { selected = j; break; }
    }
  }
  updateButtonStates();
}

function checkAll() {
  if (!place.every(p => p >= 0) || allCorrect()) return;
  checks++;
  let score = 0;
  for (let i = 0; i < CARDS.length; i++) {
    marks[i] = place[i] === CARDS[i].bin ? 'ok' : 'no';
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
  else if (key === 'ArrowRight') { selected = (selected + 1) % CARDS.length; updateButtonStates(); }
  else if (key === 'ArrowLeft') { selected = (selected + CARDS.length - 1) % CARDS.length; updateButtonStates(); }
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
  // click on a bin (or the tray) moves the selected card there
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

  const narrow = canvasWidth < 560;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow ? 18 : 22);
  text('Two Ends of the Serpent Column', margin, 10);
  textStyle(NORMAL);
  textSize(14);
  textAlign(RIGHT, TOP);
  if (!narrow) text(lastScore === null ? 'Cards correct: – of 10' : 'Cards correct: ' + lastScore + ' of 10', canvasWidth - margin, 15);
  textAlign(LEFT, TOP);
  textStyle(ITALIC);
  textSize(15);
  fill('#4a3b10');
  text(fitText(QUESTION, canvasWidth - 2 * margin), margin, 40);
  textStyle(NORMAL);

  chipRects = [];
  binRects = [];
  const trayBottom = drawTray(64);
  const panelBottom = drawPanel(margin, trayBottom + 8, canvasWidth - 2 * margin, narrow ? 140 : 104);
  drawBins(panelBottom + 8, drawHeight - 8);

  // the card being dragged, on top
  if (drag && drag.moved) {
    drawChip(drag.i, mouseX - drag.ox, mouseY - drag.oy, drag.w, drag.h, true);
  }
  let over = false;
  for (const r of chipRects) if (inside(r, mouseX, mouseY) && marks[r.i] !== 'ok') over = true;
  for (const r of binRects) if (inside(r, mouseX, mouseY) && selected >= 0) over = true;
  cursor(drag && drag.moved ? 'grabbing' : over ? HAND : ARROW);

  // status line
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(13);
  const nPlaced = place.filter(p => p >= 0).length;
  let status;
  if (allCorrect()) status = 'All ten correct. First Check: ' + firstScore + ' of 10' + (firstScore >= MASTERY ? ' (mastery).' : ' (mastery is 8).');
  else if (checks === 0) status = nPlaced < 10 ? 'Placed: ' + nPlaced + ' of 10. Drag a card, or select it and press 1, 2 or 3.' : 'All ten placed. Press Check.';
  else status = 'First Check: ' + firstScore + ' of 10' + (firstScore >= MASTERY ? ' (mastery). ' : ' (mastery is 8). ') + 'Move the red cards and Check again.';
  if (narrow) status = checks === 0 ? 'Placed: ' + nPlaced + ' of 10' : 'Correct: ' + lastScore + ' of 10 · first: ' + firstScore;
  text(fitText(status, canvasWidth - margin - statusX), statusX, drawHeight + 64);
}

// Unplaced cards. Returns the bottom y.
function drawTray(top) {
  const x = margin, w = canvasWidth - 2 * margin;
  const cols = 5;
  const gap = 6;
  const chipH = 26;
  const h = 22 + 2 * chipH + gap + 8;
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
  // fixed slots: card i keeps its slot while it waits in the tray
  for (let i = 0; i < CARDS.length; i++) {
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
  // fill by current bin, white in the tray
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
  // number badge
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

// The selected card, in full, with feedback after a Check. Returns the bottom y.
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

  if (allCorrect()) {
    fill('black');
    textStyle(BOLD);
    textSize(16);
    yy = drawWrapped(SUMMARY, x + pad, yy, tw, 21) + 4;
    textStyle(NORMAL);
    textSize(14);
    fill('#333');
    drawWrapped('Four of the ten claims rest on ancient writers, Herodotus, Thucydides and Pausanias, not on anything we can see ' +
                'at either end. Click any card to read why it belongs where it is.', x + pad, yy, tw, 19);
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
  text(fitText('CARD ' + (selected + 1) + ' OF 10 · ' + where, tw), x + pad, yy);
  yy += 18;
  fill('black');
  textSize(canvasWidth < 560 ? 15 : 16);
  yy = drawWrapped(c.text, x + pad, yy, tw, 21) + 5;
  textStyle(NORMAL);
  textSize(14);
  if (m) {
    textStyle(BOLD);
    fill(m === 'ok' ? 'darkgreen' : 'firebrick');
    const head = m === 'ok' ? 'Correct:' : 'Not here.';
    text(head, x + pad, yy);
    const hw = textWidth(head) + 6;
    textStyle(NORMAL);
    fill('black');
    const words = c.why.split(' ');
    let first = '';
    while (words.length && textWidth(first + (first ? ' ' : '') + words[0]) <= tw - hw) first += (first ? ' ' : '') + words.shift();
    text(first, x + pad + hw, yy);
    if (words.length) drawWrapped(words.join(' '), x + pad, yy + 19, tw, 19);
  } else if (checks > 0 && b >= 0) {
    fill('#4a5a66');
    textStyle(ITALIC);
    drawWrapped('Moved. Press Check to test the new place.', x + pad, yy, tw, 19);
    textStyle(NORMAL);
  } else {
    fill('#4a5a66');
    textStyle(ITALIC);
    drawWrapped('Where could you check this claim: at Delphi, in Istanbul, or only in an ancient writer?', x + pad, yy, tw, 19);
    textStyle(NORMAL);
  }
  return y + h;
}

function drawBins(top, bottom) {
  const gap = 8;
  const w = (canvasWidth - 2 * margin - 2 * gap) / 3;
  const narrow = canvasWidth < 560;
  const h = bottom - top;
  const done = allCorrect();
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
    textSize(narrow ? 12 : 14);
    text(fitText((b + 1) + '  ' + (narrow ? B.short : B.name), w - 12), x + 8, top + 14);
    textStyle(NORMAL);
    binRects.push({ b: b, x: x, y: top, w: w, h: h });

    const members = [];
    for (let i = 0; i < CARDS.length; i++) if (place[i] === b && !(drag && drag.moved && drag.i === i)) members.push(i);
    // one column of chips; two when the bin gets crowded
    const ch = narrow ? 22 : 26;
    const cols = 34 + members.length * (ch + 5) <= h - 4 ? 1 : 2;
    const cg = 5;
    const cw = (w - 12 - (cols - 1) * cg) / cols;
    for (let k = 0; k < members.length; k++) {
      const cx = x + 6 + (k % cols) * (cw + cg);
      const cy = top + 34 + floor(k / cols) * (ch + 5);
      drawChip(members[k], cx, cy, cw, ch, false);
      chipRects.push({ i: members[k], x: cx, y: cy, w: cw, h: ch });
    }
    noStroke();
    fill(B.color);
    textAlign(CENTER, BOTTOM);
    textSize(13);
    if (done) {
      textStyle(BOLD);
      text(fitText(members.length + ' cards: ' + B.has, w - 10), x + w / 2, top + h - 6);
      textStyle(NORMAL);
    } else if (!members.length) {
      textStyle(ITALIC);
      text(fitText(narrow ? 'empty' : 'Drop cards here', w - 10), x + w / 2, top + h / 2 + 18);
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
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
}

// A little state for headless testing
window.serpentColumn = {
  placeAll: correct => { for (let i = 0; i < CARDS.length; i++) { place[i] = correct ? CARDS[i].bin : (CARDS[i].bin + 1) % 3; marks[i] = null; } updateButtonStates(); },
  check: () => checkAll(), select: i => { selected = i; updateButtonStates(); },
  place: (i, b) => placeCard(i, b, false), score: () => lastScore
};
