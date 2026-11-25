// The Olympian Gods at Troy - p5.js 2.x
// CANVAS_HEIGHT: 620
// Twelve shuffled god cards and three bins: Helped the Greeks, Helped the
// Trojans, Above or outside the fight (Iliad, Book 20). The learner first
// predicts the three totals, then drags each card into a bin (or clicks a card
// and then a bin, or presses 1-3) and presses Check. Up to three Checks; only
// the first counts for mastery (10 of 12). After the final Check the true
// totals (5, 4, 3) appear beside the prediction, and Hera, Athena and
// Aphrodite, whose sides follow the Judgment of Paris, are highlighted.

let canvasWidth = 700;
let drawHeight = 540;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 10;

const BINS = [
  { name: 'Helped the Greeks', short: 'Greeks', color: '#2F6E8E' },
  { name: 'Helped the Trojans', short: 'Trojans', color: '#9A3B2E' },
  { name: 'Above or outside the fight', short: 'Outside', color: '#5B5B5B' }
];

// bin is the correct bin index. tag is the short line printed on the card.
const GODS = [
  { name: 'Zeus', tag: 'sky, weather, justice', domains: 'King of the gods; sky, weather, justice', symbol: 'thunderbolt, eagle', bin: 2,
    why: 'In Book 20 Zeus stays on Olympus to watch; he favors the Trojans for a time only to keep a promise to Achilles’ mother, Thetis (Book 1).' },
  { name: 'Hera', tag: 'marriage, women', domains: 'Queen of the gods; marriage, women', symbol: 'crown, peacock', bin: 0, paris: true,
    why: 'Paris judged Aphrodite more beautiful than Hera, and Hera never forgave Troy.' },
  { name: 'Poseidon', tag: 'sea, earthquakes, horses', domains: 'Sea, earthquakes, horses', symbol: 'trident', bin: 0,
    why: 'In Book 21 he recalls that an earlier Trojan king, Laomedon, cheated him of his wages for building Troy’s walls.' },
  { name: 'Demeter', tag: 'grain, harvest', domains: 'Grain, harvest', symbol: 'sheaf of wheat, torch', bin: 2,
    why: 'Demeter plays no part in the Iliad’s battles.' },
  { name: 'Athena', tag: 'wisdom, strategy, crafts', domains: 'Wisdom, strategy in war, crafts', symbol: 'owl, helmet, aegis', bin: 0, paris: true,
    why: 'Athena also lost the Judgment of Paris, and she guides Greek heroes such as Achilles and Odysseus.' },
  { name: 'Apollo', tag: 'music, prophecy, archery', domains: 'Light, music, prophecy, healing, archery', symbol: 'lyre, bow, laurel', bin: 1,
    why: 'In Book 1 Agamemnon insults Apollo’s priest, and Apollo sends a plague on the Greek camp.' },
  { name: 'Artemis', tag: 'hunting, wild animals', domains: 'Hunting, wild animals, childbirth', symbol: 'bow, deer', bin: 1,
    why: 'Apollo’s twin sister joins the Trojan side with him and their mother, Leto (Book 20).' },
  { name: 'Ares', tag: 'war and violence', domains: 'War and violence', symbol: 'spear, helmet', bin: 1,
    why: 'Ares fights for Troy; in Book 5 a Greek hero, Diomedes, wounds him with Athena’s help.' },
  { name: 'Aphrodite', tag: 'love and beauty', domains: 'Love and beauty', symbol: 'dove, mirror', bin: 1, paris: true,
    why: 'She won the Judgment of Paris by promising him Helen, and she rescues Paris from a duel in Book 3.' },
  { name: 'Hephaestus', tag: 'fire, metalwork', domains: 'Fire, metalwork, smiths', symbol: 'hammer, tongs', bin: 0,
    why: 'He forges new armor for Achilles in Book 18 and fights the Trojan river god with fire in Book 21.' },
  { name: 'Hermes', tag: 'messenger, travelers', domains: 'Messenger; travelers, trade, thieves', symbol: 'winged sandals, herald’s staff', bin: 0,
    why: 'He goes to the Greek ships in Book 20, although in Book 24 he guides old Priam safely to Achilles.' },
  { name: 'Dionysus', tag: 'wine, theater', domains: 'Wine, theater, ecstasy', symbol: 'vine, ivy, wine cup', bin: 2,
    why: 'Dionysus barely appears in the Iliad and takes no side.' }
];
const TRUE_TOTALS = [5, 4, 3];
const MASTERY = 10;
const MAX_CHECKS = 3;
const HINT = 'Think about the Judgment of Paris and old debts.';
const FINAL_MSG = 'Five helped the Greeks, four the Trojans, three stayed out. ' +
                  'The gods took sides for human reasons: pride, old debts, and favorites.';

// ---------- State ----------
let order = [];          // shuffled god indices for the tray
let place = [];          // god index -> bin index, or -1 in the tray
let binOrder = [[], [], []];
let marks = [];          // god index -> null | 'ok' | 'bad' (from the last Check)
let locked = [];         // god index -> true once checked correct
let moved = [];          // god index -> true when moved by the sim after Check 3
let prediction = null;   // [g, t, o] once locked in
let checks = 0;
let firstScore = -1;
let lastScore = -1;
let finished = false;
let selected = -1;
let dragging = -1, dragDX = 0, dragDY = 0, pressX = 0, pressY = 0, dragMoved = false;
let hoverGod = -1;
let rects = [];          // [{g, x, y, w, h}] hit boxes for cards and chips
let binRects = [];
let trayRect = null;
let statusMsg = '';
let statusColor = 'dimgray';

// ---------- Controls ----------
let predInputs = [];
let lockButton, checkButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < 3; i++) {
    const inp = createInput('', 'number');
    inp.parent(document.querySelector('main'));
    inp.attribute('min', '0');
    inp.attribute('max', '12');
    inp.attribute('step', '1');
    inp.attribute('aria-label', 'Predicted number of gods: ' + BINS[i].name);
    inp.style('font-size', '15px');
    inp.style('box-sizing', 'border-box');
    predInputs.push(inp);
  }
  lockButton = createButton('Lock in prediction');
  lockButton.parent(document.querySelector('main'));
  lockButton.style('font-size', '14px');
  lockButton.mousePressed(lockPrediction);

  checkButton = createButton('Check');
  checkButton.parent(document.querySelector('main'));
  checkButton.style('font-size', '14px');
  checkButton.mousePressed(doCheck);

  againButton = createButton('Start over');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(restart);

  positionControls();
  restart();

  describe('A sorting activity about the Olympian gods in Homer’s Iliad. The learner first predicts how many of the ' +
           'twelve gods helped the Greeks, helped the Trojans, or stayed above or outside the fight, then drags twelve god ' +
           'cards into those three bins and presses Check. Correct cards are marked green with the reason from the Iliad; ' +
           'wrong cards are marked red. After the final check the true totals, five, four and three, appear beside the ' +
           'prediction, and Hera, Athena and Aphrodite are highlighted as the gods whose sides follow the Judgment of Paris.');
}

function positionControls() {
  const y1 = drawHeight + 8;
  const narrow = canvasWidth < 560;
  let x = margin + (narrow ? 0 : 84);
  const labW = narrow ? [52, 56, 52] : [56, 60, 56];
  for (let i = 0; i < 3; i++) {
    x += labW[i];
    predInputs[i].position(x, y1);
    predInputs[i].size(48, 28);
    x += 56;
  }
  lockButton.position(x + 4, y1);
  const y2 = drawHeight + 44;
  checkButton.position(margin, y2);
  againButton.position(margin + 120, y2);
}

function shuffle12() {
  const a = GODS.map((g, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function restart() {
  order = shuffle12();
  place = GODS.map(() => -1);
  binOrder = [[], [], []];
  marks = GODS.map(() => null);
  locked = GODS.map(() => false);
  moved = GODS.map(() => false);
  prediction = null;
  checks = 0;
  firstScore = -1;
  lastScore = -1;
  finished = false;
  selected = -1;
  dragging = -1;
  for (const inp of predInputs) { inp.value(''); inp.removeAttribute('disabled'); }
  setStatus('First, predict: how many gods went to each side? Three whole numbers that add up to 12.', 'dimgray');
  updateButtons();
}

function setStatus(msg, color) {
  statusMsg = msg;
  statusColor = color || 'dimgray';
}

function lockPrediction() {
  if (prediction) return;
  const vals = predInputs.map(inp => String(inp.value()).trim());
  const nums = vals.map(v => Number(v));
  const ok = vals.every(v => /^\d+$/.test(v)) && nums.every(n => n >= 0 && n <= 12);
  if (!ok) { setStatus('Enter three whole numbers from 0 to 12.', 'firebrick'); return; }
  const sum = nums[0] + nums[1] + nums[2];
  if (sum !== 12) { setStatus('Your three numbers add up to ' + sum + '; they must add up to 12.', 'firebrick'); return; }
  prediction = nums;
  for (const inp of predInputs) inp.attribute('disabled', '');
  setStatus('Prediction saved. Drag each card into a bin, or click a card and then a bin (or press 1, 2, 3).', 'dimgray');
  updateButtons();
}

function placedCount() { return place.filter(p => p >= 0).length; }

function updateButtons() {
  if (prediction) lockButton.attribute('disabled', ''); else lockButton.removeAttribute('disabled');
  const canCheck = prediction && !finished && placedCount() === GODS.length;
  if (canCheck) checkButton.removeAttribute('disabled'); else checkButton.attribute('disabled', '');
  const left = MAX_CHECKS - checks;
  checkButton.html(finished ? 'Check' : 'Check (' + left + ' left)');
}

function moveTo(g, b) {
  if (g < 0 || finished || locked[g] || !prediction) return;
  if (place[g] >= 0) binOrder[place[g]] = binOrder[place[g]].filter(x => x !== g);
  place[g] = b;
  if (b >= 0) binOrder[b].push(g);
  marks[g] = null;
  if (!finished && placedCount() === GODS.length && checks === 0) {
    setStatus('All twelve placed. Press Check, or keep moving cards.', 'dimgray');
  }
  updateButtons();
}

function doCheck() {
  if (!prediction || finished || placedCount() < GODS.length) return;
  checks++;
  let score = 0;
  for (let g = 0; g < GODS.length; g++) {
    const ok = place[g] === GODS[g].bin;
    marks[g] = ok ? 'ok' : 'bad';
    if (ok) { score++; locked[g] = true; }
  }
  lastScore = score;
  if (checks === 1) firstScore = score;
  selected = -1;
  if (score === GODS.length || checks >= MAX_CHECKS) {
    // Final check: move any wrong cards to their correct bins
    for (let g = 0; g < GODS.length; g++) {
      if (place[g] !== GODS[g].bin) {
        binOrder[place[g]] = binOrder[place[g]].filter(x => x !== g);
        place[g] = GODS[g].bin;
        binOrder[GODS[g].bin].push(g);
        moved[g] = true;
      }
    }
    finished = true;
    setStatus('Done. Hover over any card to read its story. Gold borders: the Judgment of Paris.', 'dimgray');
  } else if (checks === 1) {
    setStatus(score + ' of 12 correct. Red cards are misplaced. ' + HINT, 'firebrick');
  } else {
    setStatus(score + ' of 12 correct. Hover over a red card to read why, then move it and Check again.', 'firebrick');
  }
  updateButtons();
}

// ---------- Mouse and keys ----------
function hitGod(mx, my) {
  for (let i = rects.length - 1; i >= 0; i--) {
    const r = rects[i];
    if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return r.g;
  }
  return -1;
}

function hitBin(mx, my) {
  for (let i = 0; i < binRects.length; i++) {
    const r = binRects[i];
    if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return i;
  }
  return -1;
}

function inTray(mx, my) {
  const r = trayRect;
  return r && mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h;
}

function mousePressed() {
  if (mouseY > drawHeight || mouseY < 0 || mouseX < 0 || mouseX > canvasWidth) return;
  if (!prediction) {
    if (hitGod(mouseX, mouseY) >= 0) setStatus('Lock in your prediction first (the boxes below), then sort the cards.', 'firebrick');
    return;
  }
  if (finished) return;
  const g = hitGod(mouseX, mouseY);
  if (g >= 0 && !locked[g]) {
    const r = rects.find(rr => rr.g === g);
    dragging = g;
    dragDX = mouseX - r.x;
    dragDY = mouseY - r.y;
    pressX = mouseX;
    pressY = mouseY;
    dragMoved = false;
    return;
  }
  if (g >= 0 && locked[g]) { setStatus(GODS[g].name + ' is already in the right bin.', 'darkgreen'); return; }
  const b = hitBin(mouseX, mouseY);
  if (b >= 0 && selected >= 0) { moveTo(selected, b); selected = -1; return; }
  if (inTray(mouseX, mouseY) && selected >= 0) { moveTo(selected, -1); selected = -1; }
}

function mouseDragged() {
  if (dragging >= 0 && dist(mouseX, mouseY, pressX, pressY) > 5) dragMoved = true;
}

function mouseReleased() {
  if (dragging < 0) return;
  const g = dragging;
  dragging = -1;
  if (!dragMoved) {
    selected = (selected === g) ? -1 : g;
    return;
  }
  const b = hitBin(mouseX, mouseY);
  if (b >= 0) { moveTo(g, b); selected = -1; }
  else if (inTray(mouseX, mouseY)) { moveTo(g, -1); selected = -1; }
}

function keyPressed() {
  if (document.activeElement && document.activeElement.tagName === 'INPUT') {
    if (key === 'Enter') lockPrediction();
    return;
  }
  if (selected >= 0 && key.length === 1 && key >= '1' && key <= '3') {
    moveTo(selected, int(key) - 1);
    selected = -1;
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

  rects = [];
  binRects = [];

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(canvasWidth < 560 ? 18 : 22);
  text('The Olympian Gods at Troy', margin, 8);
  textStyle(NORMAL);
  textSize(15);
  textAlign(RIGHT, TOP);
  let scoreText;
  if (firstScore >= 0) scoreText = 'First check: ' + firstScore + ' of 12';
  else scoreText = 'Placed: ' + placedCount() + ' of 12';
  text(scoreText, canvasWidth - margin, 12);

  textAlign(LEFT, TOP);
  textStyle(ITALIC);
  textSize(14);
  fill('#33424d');
  text(fitText('When the gods went down to the plain of Troy, whose side was each one on?', canvasWidth - 2 * margin),
       margin, 38);
  textStyle(NORMAL);

  hoverGod = (dragging < 0) ? hitGodFromLastFrame() : -1;

  const trayTop = 60;
  const trayBottom = drawTray(trayTop);
  const binsBottom = drawBins(trayBottom + 8);
  drawInfo(binsBottom + 8, drawHeight - binsBottom - 16);

  // Dragged card on top of everything
  if (dragging >= 0 && dragMoved) {
    const w = cardW(), h = 40;
    drawCard(dragging, mouseX - dragDX, mouseY - dragDY, w, h, 'drag');
  }

  drawControlsText();
}

let lastRects = [];
function hitGodFromLastFrame() {
  for (let i = lastRects.length - 1; i >= 0; i--) {
    const r = lastRects[i];
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) return r.g;
  }
  return -1;
}

function cardW() {
  return (canvasWidth - 2 * margin - 20 - 3 * 6) / 4;
}

function drawTray(top) {
  const w = canvasWidth - 2 * margin;
  const h = 170;
  trayRect = { x: margin, y: top, w: w, h: h };
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(margin, top, w, h, 8);
  noStroke();

  if (finished) {
    drawSummary(margin + 12, top + 10, w - 24);
    lastRects = rects.slice();
    return top + h;
  }

  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('UNSORTED CARDS (' + order.filter(g => place[g] < 0).length + ')', margin + 10, top + 8);
  textStyle(NORMAL);

  if (placedCount() === GODS.length && !(dragging >= 0 && dragMoved)) {
    fill('#5d6d78');
    textAlign(CENTER, CENTER);
    textSize(15);
    const msg = checks === 0 ? 'All twelve cards are in bins. Press Check, or drag a card back here.'
      : (checks === 1 ? 'Move the red cards, then press Check again. ' + HINT
                      : 'Hover over a red card to read its story, move it, then press Check.');
    const lines = wrapLines(msg, w - 60);
    for (let i = 0; i < lines.length; i++) text(lines[i], margin + w / 2, top + h / 2 + 6 + (i - (lines.length - 1) / 2) * 20);
    textAlign(LEFT, TOP);
  }

  const cw = cardW(), ch = 40, gap = 6;
  for (let k = 0; k < order.length; k++) {
    const g = order[k];
    if (place[g] >= 0) continue;   // keep tray slots stable: leave a gap
    const col = k % 4, row = Math.floor(k / 4);
    const x = margin + 10 + col * (cw + gap);
    const y = top + 28 + row * (ch + gap);
    if (g === dragging && dragMoved) {
      drawSlot(x, y, cw, ch);
      continue;
    }
    drawCard(g, x, y, cw, ch, 'tray');
    rects.push({ g: g, x: x, y: y, w: cw, h: ch });
  }
  lastRects = rects.slice();
  return top + h;
}

function drawSlot(x, y, w, h) {
  stroke('#c9d3da');
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  noFill();
  rect(x, y, w, h, 6);
  drawingContext.setLineDash([]);
  noStroke();
}

function drawCard(g, x, y, w, h, mode) {
  const G = GODS[g];
  const isSel = (g === selected);
  const isHover = (g === hoverGod);
  stroke(isSel ? '#D4A017' : (isHover ? '#5d6d78' : '#9fb0bb'));
  strokeWeight(isSel ? 3 : (isHover ? 2 : 1));
  fill(mode === 'drag' ? '#fffbe8' : '#fdfaf3');
  if (mode === 'drag') { drawingContext.shadowBlur = 8; drawingContext.shadowColor = 'rgba(0,0,0,0.3)'; }
  rect(x, y, w, h, 6);
  drawingContext.shadowBlur = 0;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text(G.name, x + 8, y + 4);
  textStyle(NORMAL);
  textSize(12);
  fill('#4a5963');
  text(fitText(G.tag, w - 14), x + 8, y + 23);
}

function drawBins(top) {
  const gap = 8;
  const bw = (canvasWidth - 2 * margin - 2 * gap) / 3;
  const headH = 30;
  const bodyH = 6 * 28 + 6;
  for (let b = 0; b < 3; b++) {
    const B = BINS[b];
    const x = margin + b * (bw + gap);
    binRects.push({ x: x, y: top, w: bw, h: headH + bodyH });
    const inside = mouseX >= x && mouseX <= x + bw && mouseY >= top && mouseY <= top + headH + bodyH;
    const targeted = inside && ((dragging >= 0 && dragMoved) || selected >= 0);
    stroke(targeted ? '#D4A017' : 'silver');
    strokeWeight(targeted ? 3 : 1);
    fill(b % 2 === 0 ? 'white' : 'ghostwhite');
    rect(x, top, bw, headH + bodyH, 6);
    noStroke();
    fill(B.color);
    rect(x, top, bw, headH, 6, 6, 0, 0);
    fill('white');
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    let label = (b + 1) + '. ' + B.name;
    textSize(14);
    if (textWidth(label + ' (12)') > bw - 10) textSize(12);
    if (binOrder[b].length) label += ' (' + binOrder[b].length + ')';
    text(fitText(label, bw - 8), x + bw / 2, top + headH / 2);
    textStyle(NORMAL);

    // Chips: two columns of up to six
    // Narrow bins hold one column while six or fewer cards fit
    const cols = (bw < 200 && binOrder[b].length <= 6) ? 1 : 2;
    const chipW = (bw - 5 - 5 * cols) / cols, chipH = 24;
    for (let n = 0; n < binOrder[b].length; n++) {
      const g = binOrder[b][n];
      const col = n % cols, row = Math.floor(n / cols);
      const cx = x + 5 + col * (chipW + 5);
      const cy = top + headH + 6 + row * 28;
      if (g === dragging && dragMoved) { drawSlot(cx, cy, chipW, chipH); continue; }
      drawChip(g, cx, cy, chipW, chipH);
      rects.push({ g: g, x: cx, y: cy, w: chipW, h: chipH });
    }
  }
  lastRects = rects.slice();
  return top + headH + bodyH;
}

function drawChip(g, x, y, w, h) {
  const m = marks[g];
  const isSel = (g === selected);
  const isHover = (g === hoverGod);
  let fc = '#fdfaf3', sc = '#9fb0bb';
  if (m === 'ok') { fc = 'honeydew'; sc = 'seagreen'; }
  if (m === 'bad') { fc = 'mistyrose'; sc = 'firebrick'; }
  if (moved[g]) { fc = '#fff0e6'; sc = 'firebrick'; }
  const paris = finished && GODS[g].paris;
  stroke(isSel || paris ? '#D4A017' : sc);
  strokeWeight(isSel || paris ? 3 : (isHover ? 2.5 : 1.5));
  fill(fc);
  rect(x, y, w, h, 5);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(13);
  textStyle(BOLD);
  let prefix = '';
  if (m === 'ok' && !moved[g]) prefix = '✓';
  else if (m === 'bad' || moved[g]) prefix = '✗';
  fill(m === 'ok' && !moved[g] ? 'darkgreen' : (m ? 'firebrick' : 'black'));
  text(prefix, x + 5, y + h / 2 + 1);
  const pw = prefix ? textWidth(prefix) + 4 : 0;
  fill('black');
  text(fitText(GODS[g].name, w - 10 - pw), x + 5 + pw, y + h / 2 + 1);
  textStyle(NORMAL);
}

function drawInfo(top, h) {
  const x = margin, w = canvasWidth - 2 * margin;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, top, w, h, 8);
  noStroke();
  const pad = 12, tw = w - 2 * pad;
  let yy = top + 8;
  textAlign(LEFT, TOP);

  let g = -1;
  if (dragging >= 0) g = dragging;
  else if (hoverGod >= 0) g = hoverGod;
  else if (selected >= 0) g = selected;

  if (g < 0) {
    fill('dimgray');
    textSize(12);
    textStyle(BOLD);
    text('READ A CARD', x + pad, yy);
    textStyle(NORMAL);
    textSize(14);
    fill('#33424d');
    const msg = finished ? FINAL_MSG
      : 'Hover over or click a card to turn it over and read its domains and symbol. ' +
        'Think about each god’s story, not just the domain: who had a grudge, and who had a favorite?';
    drawWrapped(msg, x + pad, yy + 18, tw, 18);
    return;
  }

  const G = GODS[g];
  textStyle(BOLD);
  textSize(16);
  fill('black');
  text(G.name, x + pad, yy);
  const nw = textWidth(G.name);
  textStyle(NORMAL);
  textSize(14);
  fill('#33424d');
  text(fitText(' — ' + G.domains + '. Symbol: ' + G.symbol + '.', tw - nw), x + pad + nw, yy + 2);
  yy += 24;

  const m = marks[g];
  textSize(14);
  if (finished || m === 'ok') {
    const ok = (m === 'ok' && !moved[g]);
    const head = ok ? 'Correct:' : 'Not quite. ' + BINS[G.bin].name + ':';
    fill(ok ? 'darkgreen' : 'firebrick');
    textStyle(BOLD);
    const hw = textWidth(head) + 5;
    text(head, x + pad, yy);
    textStyle(NORMAL);
    fill('black');
    const lines = wrapLines(G.why, tw - hw);
    text(lines[0], x + pad + hw, yy);
    const rest = lines.slice(1).join(' ');
    if (rest) yy = drawWrapped(rest, x + pad, yy + 18, tw, 18);
    if (finished && G.paris) {
      fill('#7A5A00');
      textStyle(BOLD);
      drawWrapped('Gold border: this side follows the Judgment of Paris.', x + pad, yy + (rest ? 2 : 20), tw, 18);
      textStyle(NORMAL);
    }
  } else if (m === 'bad') {
    if (checks >= 2) {
      fill('firebrick');
      textStyle(BOLD);
      const head = 'Not quite.';
      const hw = textWidth(head) + 5;
      text(head, x + pad, yy);
      textStyle(NORMAL);
      fill('black');
      const lines = wrapLines(G.why, tw - hw);
      text(lines[0], x + pad + hw, yy);
      const rest = lines.slice(1).join(' ');
      if (rest) drawWrapped(rest, x + pad, yy + 18, tw, 18);
    } else {
      fill('firebrick');
      drawWrapped('Not in the right bin yet. ' + HINT, x + pad, yy, tw, 18);
    }
  } else if (!prediction) {
    fill('dimgray');
    drawWrapped('Lock in your prediction below before you sort.', x + pad, yy, tw, 18);
  } else {
    fill('dimgray');
    drawWrapped(place[g] >= 0 ? 'In bin: ' + BINS[place[g]].name + '. Drag it to move it.'
                              : 'Drag this card into a bin, or click it and then click a bin (or press 1, 2, 3).',
                x + pad, yy, tw, 18);
  }
}

function drawSummary(x, y, w) {
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('YOUR PREDICTION AND THE ILIAD, BOOK 20', x, y);
  textStyle(NORMAL);

  // A small table: rows = prediction, true totals; columns = the three bins
  const col0 = Math.min(150, w * 0.28);
  const cw = (w - col0) / 3;
  const ty = y + 22;
  textSize(13);
  for (let b = 0; b < 3; b++) {
    fill(BINS[b].color);
    rect(x + col0 + b * cw + 2, ty, cw - 4, 24, 4);
    fill('white');
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(fitText(BINS[b].name, cw - 10), x + col0 + b * cw + cw / 2, ty + 12);
  }
  textStyle(NORMAL);
  const rows = [['Your prediction', prediction || ['–', '–', '–']], ['True totals', TRUE_TOTALS]];
  for (let r = 0; r < rows.length; r++) {
    const ry = ty + 30 + r * 26;
    fill('black');
    textAlign(LEFT, CENTER);
    textStyle(r === 1 ? BOLD : NORMAL);
    textSize(14);
    text(rows[r][0], x, ry + 10);
    textAlign(CENTER, CENTER);
    textSize(16);
    for (let b = 0; b < 3; b++) {
      const v = rows[r][1][b];
      const diff = (r === 0 && prediction && v !== TRUE_TOTALS[b]);
      fill(diff ? 'firebrick' : 'black');
      text(String(v), x + col0 + b * cw + cw / 2, ry + 10);
    }
    textStyle(NORMAL);
  }

  const my = ty + 88;
  textAlign(LEFT, TOP);
  textSize(14);
  const pass = firstScore >= MASTERY;
  fill(pass ? 'darkgreen' : 'firebrick');
  textStyle(BOLD);
  const head = 'First check: ' + firstScore + ' of 12. ' +
               (pass ? 'Mastery reached (10 or more).' : 'Mastery is 10 or more on the first check; press Start over to try again.');
  const yy = drawWrapped(head, x, my, w, 18);
  textStyle(NORMAL);
  fill('#33424d');
  if (yy + 20 < trayRect.y + trayRect.h) {
    drawWrapped('Zeus watches from above; Demeter and Dionysus never enter the fight.', x, yy + 2, w, 18);
  }
}

function drawControlsText() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(14);
  const y1 = drawHeight + 22;
  const narrow = canvasWidth < 560;
  if (!narrow) {
    textStyle(BOLD);
    text('Prediction:', margin, y1);
    textStyle(NORMAL);
  }
  let x = margin + (narrow ? 0 : 84);
  const labs = ['Greeks', 'Trojans', 'Outside'];
  const labW = narrow ? [52, 56, 52] : [56, 60, 56];
  for (let i = 0; i < 3; i++) {
    fill(BINS[i].color);
    textStyle(BOLD);
    text(labs[i], x, y1);
    textStyle(NORMAL);
    x += labW[i] + 56;
  }

  fill(statusColor);
  textSize(13);
  const sx = margin + 228;
  const lines = wrapLines(statusMsg, canvasWidth - sx - margin);
  const y2 = drawHeight + 58;
  if (lines.length === 1) text(lines[0], sx, y2);
  else {
    text(lines[0], sx, y2 - 8);
    text(fitText(lines.slice(1).join(' '), canvasWidth - sx - margin), sx, y2 + 9);
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
