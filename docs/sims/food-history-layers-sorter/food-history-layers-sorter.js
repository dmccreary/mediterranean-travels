// Reading Food in Layers - p5.js 2.x
// CANVAS_HEIGHT: 560
// Fourteen foods found in Istanbul, one card at a time, in a fixed shuffled
// order (seed 1453, the same for every learner). The learner sorts each card
// into one of five historical layers; feedback appears at once and the card
// settles into its correct layer. At the end every bin is filled.

let canvasWidth = 700;
let drawHeight = 480;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const LAYERS = [
  { name: 'Ancient Mediterranean and Anatolia', button: '1 Ancient', color: '#2F6E8E',
    def: 'Grown or caught here since long before Byzantium.' },
  { name: 'Turkic herders from Central Asia', button: '2 Turkic herders', color: '#8A5A2B',
    def: 'Brought by Turkish-speaking herders who moved into Anatolia after 1071.' },
  { name: 'Ottoman trade and court', button: '3 Ottoman', color: '#7B3F8F',
    def: 'Arrived through the empire’s trade routes and palace kitchens, often from the Arab and Persian worlds.' },
  { name: 'The Americas, after 1492', button: '4 Americas', color: '#B5452B',
    def: 'Arrived through the Columbian Exchange.' },
  { name: 'The Turkish Republic, after 1923', button: '5 Republic', color: '#2E7D4F',
    def: 'A 20th-century change.' }
];

// layer is an index into LAYERS
const CARDS = [
  { food: 'Olives and olive oil', chip: 'Olives, olive oil', layer: 0,
    why: 'Olive trees have been cultivated around the eastern Mediterranean for thousands of years.' },
  { food: 'Bonito and bluefish from the Bosphorus', chip: 'Bonito, bluefish', layer: 0,
    why: 'Greek Byzantium grew rich salting and exporting the fish that migrate through the strait.' },
  { food: 'Chickpeas', chip: 'Chickpeas', layer: 0,
    why: 'Chickpeas were first farmed in what is now southeastern Turkey, thousands of years before the Greeks arrived.' },
  { food: 'Yogurt', chip: 'Yogurt', layer: 1,
    why: 'Yogurt is a Turkic word, and souring milk was how herders on the move kept it from spoiling.' },
  { food: 'Ayran (salted yogurt drink)', chip: 'Ayran', layer: 1,
    why: 'A herders’ drink made from yogurt and water, now Turkey’s everyday drink with kebab.' },
  { food: 'Kaymak (clotted cream)', chip: 'Kaymak', layer: 1,
    why: 'Kaymak is a Turkic word for a herders’ dairy food, eaten at breakfast with honey.' },
  { food: 'Mantı (tiny meat dumplings with yogurt)', chip: 'Mantı', layer: 1,
    why: 'Dumplings came west with Turkic and Mongol peoples across the Central Asian steppe.' },
  { food: 'Coffee', chip: 'Coffee', layer: 2,
    why: 'Coffee came up the Red Sea from Yemen, and the first coffeehouses opened in Istanbul in the 1550s.' },
  { food: 'Pilaf (pilav)', chip: 'Pilaf (pilav)', layer: 2,
    why: 'Pilav is a Persian word; rice pilaf was a dish of the Persian and Ottoman courts.' },
  { food: 'Şerbet (sweet fruit drink)', chip: 'Şerbet', layer: 2,
    why: 'Şerbet comes from an Arabic word for a drink; the Ottoman court served it cooled with mountain snow.' },
  { food: 'Tomatoes', chip: 'Tomatoes', layer: 3,
    why: 'Tomatoes came from the Americas and became common in Ottoman cooking only in the 1800s.' },
  { food: 'Pul biber (red pepper flakes)', chip: 'Pul biber', layer: 3,
    why: 'All chili peppers are American plants that reached the Ottoman Empire after 1492.' },
  { food: 'Corn (mısır) roasted on a street cart', chip: 'Corn (mısır)', layer: 3,
    why: 'Corn is American; its Turkish name, mısır, also means Egypt, the route by which it arrived.' },
  { food: 'Black tea (çay)', chip: 'Black tea (çay)', layer: 4,
    why: 'Turks drank coffee until the 20th century; tea plantations at Rize on the Black Sea date from the 1930s and 1940s.' }
];
const MASTERY = 11;

// ---------- State ----------
let order = [];
let current = 0;
let answered = false;
let chosen = -1;
let results = {};
let score = 0;
let finished = false;
let hoverCard = -1;
let chipRects = [];

// ---------- Controls ----------
let layerButtons = [];
let nextButton, restartButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < LAYERS.length; i++) {
    const b = createButton(LAYERS[i].button);
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('padding', '4px 0px');
    b.style('cursor', 'pointer');
    b.attribute('title', LAYERS[i].name + ': ' + LAYERS[i].def);
    b.mousePressed(() => assign(i));
    layerButtons.push(b);
  }
  nextButton = createButton('Next card');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCard);

  restartButton = createButton('Restart');
  restartButton.parent(document.querySelector('main'));
  restartButton.style('font-size', '14px');
  restartButton.mousePressed(restart);

  positionControls();
  restart();

  describe('A sorting activity. One card at a time names a food found in Istanbul. The learner chooses one of five historical layers: ' +
           'ancient Mediterranean and Anatolia, Turkic herders from Central Asia, Ottoman trade and court, the Americas after 1492, ' +
           'or the Turkish Republic after 1923. The card settles into its correct layer, with missed cards marked in red, and the ' +
           'reason is shown. A running score counts correct first placements.');
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / LAYERS.length;
  for (let i = 0; i < layerButtons.length; i++) {
    layerButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    layerButtons[i].size(colW - 6, 30);
  }
  nextButton.position(margin, drawHeight + 46);
  restartButton.position(margin + 100, drawHeight + 46);
}

// Fixed shuffle: the same card order for every learner (seed 1453).
function seededOrder(n, seed) {
  let s = seed >>> 0;
  const rand = () => {          // mulberry32
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function restart() {
  order = seededOrder(CARDS.length, 1453);
  current = 0;
  answered = false;
  chosen = -1;
  results = {};
  score = 0;
  finished = false;
  hoverCard = -1;
  updateButtonStates();
}

function assign(k) {
  if (answered || finished) return;
  const ci = order[current];
  chosen = k;
  answered = true;
  const correct = (k === CARDS[ci].layer);
  if (correct) score++;
  results[ci] = { chosen: k, correct: correct };
  updateButtonStates();
}

function nextCard() {
  if (!answered || finished) return;
  if (current < order.length - 1) {
    current++;
    answered = false;
    chosen = -1;
  } else {
    finished = true;
  }
  updateButtonStates();
}

function keyPressed() {
  if (key >= '1' && key <= '5' && key.length === 1) assign(int(key) - 1);
  else if (key === 'Enter') nextCard();
}

function updateButtonStates() {
  for (const b of layerButtons) {
    if (answered || finished) b.attribute('disabled', '');
    else b.removeAttribute('disabled');
  }
  if (answered && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < order.length - 1 ? 'Next card' : 'See result');
}

function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(canvasWidth < 560 ? 18 : 22);
  text('Reading Food in Layers', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('Layers read: ' + score + ' of ' + CARDS.length, canvasWidth - margin, 14);

  const binsTop = 188;
  drawBins(binsTop);
  drawPanel(margin, 44, canvasWidth - 2 * margin, 134);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = 'Done. Press Restart to try again (same order).';
  else if (answered) status = 'Press ' + (current < order.length - 1 ? 'Next card' : 'See result') + ' to continue.';
  else status = 'Choose a layer (or press 1 to 5).';
  text(fitText(status, canvasWidth - margin - 200), margin + 190, drawHeight + 60);
}

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

function drawPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const pad = 14;
  const tw = w - 2 * pad;
  let yy = y + 10;

  if (finished) {
    if (hoverCard >= 0) { drawCardDetails(hoverCard, x + pad, yy, tw, true); return; }
    textStyle(BOLD);
    textSize(17);
    fill('black');
    yy = drawWrapped('All 14 foods sorted. You scored ' + score + ' of 14.', x + pad, yy, tw, 22);
    const pass = score >= MASTERY;
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(15);
    yy = drawWrapped(pass ? '11 or more: you can read a menu like a history book.'
                          : 'Fewer than 11: reread “Food as History” and try again.', x + pad, yy + 2, tw, 20);
    textStyle(NORMAL);
    fill('black');
    textSize(14);
    yy = drawWrapped('Tomorrow’s breakfast holds four of these layers: olives (1), yogurt and kaymak (2), ' +
                     'tomatoes and pepper flakes (4), and the tea (5).', x + pad, yy + 6, tw, 18);
    fill('dimgray');
    textStyle(ITALIC);
    textSize(13);
    drawWrapped('Hover over a card to review it; red borders mark misses.', x + pad, yy + 4, tw, 17);
    textStyle(NORMAL);
    return;
  }
  drawCardDetails(order[current], x + pad, yy, tw, false);
}

function drawCardDetails(ci, x, y, tw, review) {
  const c = CARDS[ci];
  let yy = y;
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text(review ? 'REVIEW' : 'CARD ' + (current + 1) + ' OF ' + CARDS.length, x, yy);
  yy += 18;
  fill('black');
  textSize(20);
  yy = drawWrapped(c.food, x, yy, tw, 25) + 6;
  textStyle(NORMAL);

  const r = results[ci];
  if (!review && !answered) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(16);
    text('When did this food arrive on Istanbul’s table?', x, yy);
    textStyle(NORMAL);
    return;
  }
  const L = LAYERS[c.layer];
  const head = r.correct ? 'Right: ' + c.chip + ' belongs to ' + L.name + '.'
                         : 'Not quite: ' + c.chip + ' belongs to ' + L.name + '.';
  textSize(15);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  yy = drawWrapped(head, x, yy, tw, 19);
  textStyle(NORMAL);
  fill('black');
  drawWrapped(c.why, x, yy + 1, tw, 19);
}

function drawBins(top) {
  const colW = (canvasWidth - 2 * margin) / LAYERS.length;
  const narrow = colW < 135;
  textSize(narrow ? 13 : 14);
  textStyle(BOLD);
  const nameLines = LAYERS.map(L => wrapLines(L.name, colW - 10));
  textStyle(NORMAL);
  textSize(12);
  const defLines = LAYERS.map(L => wrapLines(L.def, colW - 10));
  const nameLH = narrow ? 15 : 16, defLH = 14;
  const headH = 6 + Math.max(...nameLines.map(d => d.length)) * nameLH + 3 + Math.max(...defLines.map(d => d.length)) * defLH + 6;
  const areaH = drawHeight - top - headH - 8;
  chipRects = [];
  const curCi = finished ? -1 : order[current];

  for (let i = 0; i < LAYERS.length; i++) {
    const L = LAYERS[i];
    const x = margin + i * colW;
    stroke('silver');
    strokeWeight(1);
    fill(i % 2 === 0 ? 'white' : 'ghostwhite');
    rect(x, top + headH, colW, areaH);
    noStroke();
    fill(L.color);
    rect(x, top, colW, headH);
    fill('white');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(narrow ? 13 : 14);
    for (let j = 0; j < nameLines[i].length; j++) text(nameLines[i][j], x + colW / 2, top + 6 + j * nameLH);
    textStyle(NORMAL);
    textSize(12);
    const dTop = top + 6 + Math.max(...nameLines.map(d => d.length)) * nameLH + 3;
    for (let j = 0; j < defLines[i].length; j++) text(defLines[i][j], x + colW / 2, dTop + j * defLH);

    // Placed cards, in the order they were answered
    const placed = [];
    for (let n = 0; n <= current && n < order.length; n++) {
      const ci = order[n];
      if (results[ci] && CARDS[ci].layer === i) placed.push(ci);
    }
    const chipH = 28, gap = 4;
    for (let n = 0; n < placed.length; n++) {
      const ci = placed[n];
      const cx = x + 5, cy = top + headH + 6 + n * (chipH + gap), cw = colW - 10;
      const isNew = (ci === curCi);
      stroke(results[ci].correct ? 'seagreen' : 'firebrick');
      strokeWeight(isNew || ci === hoverCard ? 3 : 2);
      fill(results[ci].correct ? 'honeydew' : 'mistyrose');
      rect(cx, cy, cw, chipH, 5);
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(narrow ? 12 : 14);
      text(fitText(CARDS[ci].chip, cw - 8), cx + cw / 2, cy + chipH / 2);
      chipRects.push({ ci: ci, x: cx, y: cy, w: cw, h: chipH });
    }
  }

  if (answered && !finished) {
    const ci = order[current];
    noFill();
    strokeWeight(3);
    if (chosen !== CARDS[ci].layer) {
      stroke('firebrick');
      rect(margin + chosen * colW + 1.5, top + 1.5, colW - 3, headH + areaH - 3);
    }
    stroke('seagreen');
    rect(margin + CARDS[ci].layer * colW + 1.5, top + 1.5, colW - 3, headH + areaH - 3);
  }

  hoverCard = -1;
  if (finished) {
    for (const r of chipRects) {
      if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) hoverCard = r.ci;
    }
  }
  noStroke();
  strokeWeight(1);
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
