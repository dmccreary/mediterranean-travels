// Read the Ruin: Which Layer? - p5.js 2.x
// CANVAS_HEIGHT: 580
// Twelve things seen on Day 2, one card at a time, in a fixed shuffled order
// (seed 4, the same for every learner). The learner places each card in one
// of five historical layers, stacked from Roman at the bottom to Republic at
// the top, using one rule: a thing belongs to the layer in which it arrived
// here. Three trap cards were made long before they arrived. Feedback shows
// the made and arrived dates, and the card settles into its correct layer.

let canvasWidth = 700;
let drawHeight = 500;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const RULE = 'Rule: a thing belongs to the layer in which it arrived at this place, ' +
             'or, for a removal, the layer in which it was taken away.';

// Listed oldest first; drawn with Roman at the bottom of the stack
const LAYERS = [
  { name: 'Roman', button: '1 Roman', dates: 'before 330 CE', color: '#A4282A',
    def: 'The city before Constantine’s capital' },
  { name: 'Byzantine', button: '2 Byzantine', dates: '330–1453, except 1204–1261', color: '#6E3F8F',
    def: 'The Christian imperial capital' },
  { name: 'Latin occupation', button: '3 Latin', dates: '1204–1261', color: '#9A6B1F',
    def: 'Crusader and Venetian rule after 1204' },
  { name: 'Ottoman', button: '4 Ottoman', dates: '1453–1922', color: '#2F7D4A',
    def: 'The sultans’ capital' },
  { name: 'Republic', button: '5 Republic', dates: '1923–today', color: '#2F6E8E',
    def: 'The Turkish Republic' }
];

// layer is an index into LAYERS
const CARDS = [
  { card: 'The long, narrow shape of Sultanahmet Square', chip: 'Shape of the square',
    made: 'about 203 CE', arrived: 'about 203 CE', layer: 0, trap: false,
    why: 'It follows the racetrack begun under Septimius Severus, before Constantine’s capital.' },
  { card: 'Obelisk of Thutmose III', chip: 'Thutmose obelisk',
    made: 'about 1450 BCE, Egypt', arrived: 'raised here in 390 CE', layer: 1, trap: true,
    why: 'Carved in ancient Egypt, but raised in the Hippodrome by Theodosius I in 390.' },
  { card: 'Serpent Column', chip: 'Serpent Column',
    made: '479 BCE, Delphi', arrived: 'brought by 330 CE', layer: 1, trap: true,
    why: 'Cast at Delphi after Plataea, but brought here when Constantine built his capital.' },
  { card: 'Bare stone of the Walled Obelisk', chip: 'Walled Obelisk',
    made: '10th-century restoration', arrived: 'bronze plates stripped 1204', layer: 2, trap: false,
    why: 'The bare stone is the trace of a removal by Fourth Crusade soldiers.' },
  { card: 'Burial place of Enrico Dandolo, Doge of Venice, in Hagia Sophia’s gallery', chip: 'Dandolo’s burial',
    made: '1205', arrived: '1205', layer: 2, trap: false,
    why: 'The Venetian leader of the Fourth Crusade was buried in the church in 1205; the inscribed slab seen today is a later marker.' },
  { card: 'Hagia Sophia’s main dome', chip: 'Main dome',
    made: '562', arrived: '562', layer: 1, trap: false,
    why: 'Rebuilt by Isidore the Younger after the first dome collapsed in 558.' },
  { card: 'Mosaic of the Virgin and Child with Emperor John II Komnenos and Empress Irene', chip: 'Komnenos mosaic',
    made: 'about 1122', arrived: 'about 1122', layer: 1, trap: false,
    why: 'Made for the emperor and empress during the Komnenian dynasty.' },
  { card: 'Octagonal German Fountain in the Hippodrome', chip: 'German Fountain',
    made: '1900', arrived: '1900', layer: 3, trap: false,
    why: 'A gift of Kaiser Wilhelm II to Sultan Abdülhamid II, before the Republic.' },
  { card: 'Medusa heads under two columns in the Basilica Cistern', chip: 'Medusa heads',
    made: 'Roman, date unknown', arrived: '532 CE', layer: 1, trap: true,
    why: 'Roman carvings reused as column bases when Justinian built the Cistern.' },
  { card: 'Large calligraphic roundels naming God, the Prophet Muhammad and the first caliphs', chip: 'Calligraphic roundels',
    made: 'about 1850', arrived: 'about 1850', layer: 3, trap: false,
    why: 'Painted by the calligrapher Kazasker Mustafa İzzet Efendi after the Fossati restoration.' },
  { card: 'Ablution fountain in Hagia Sophia’s courtyard', chip: 'Ablution fountain',
    made: '1740', arrived: '1740', layer: 3, trap: false,
    why: 'Built for Sultan Mahmud I so worshippers could wash before prayer.' },
  { card: 'Walkways and lighting in the Basilica Cistern', chip: 'Cistern walkways',
    made: '2017–2022', arrived: '2022', layer: 4, trap: false,
    why: 'Added in the earthquake-strengthening restoration, reopened in 2022.' }
];
const MASTERY = 10;
const TRAP_MASTERY = 2;
const SEED = 4;

// ---------- State ----------
let attempt = 0;
let order = [];
let current = 0;
let answered = false;
let chosen = -1;
let results = {};
let score = 0;
let trapScore = 0;
let finished = false;
let hoverCard = -1;
let chipRects = [];

// ---------- Controls ----------
let layerButtons = [];
let nextButton, againButton;

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
    b.style('color', 'white');
    b.style('background-color', LAYERS[i].color);
    b.style('border', '1px solid ' + LAYERS[i].color);
    b.style('border-radius', '4px');
    b.attribute('title', LAYERS[i].name + ' (' + LAYERS[i].dates + '): ' + LAYERS[i].def);
    b.mousePressed(() => place(i));
    layerButtons.push(b);
  }
  nextButton = createButton('Next card');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCard);

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(() => { attempt++; startSet(); });

  positionControls();
  startSet();

  describe('A layer-sorting activity. Five historical layers of Istanbul are stacked from Roman at the bottom, through Byzantine, ' +
           'Latin occupation and Ottoman, to the Republic at the top. One card at a time names something seen on Day 2, such as the ' +
           'obelisk in the Hippodrome or the calligraphic roundels in Hagia Sophia. The learner chooses the layer in which it arrived. ' +
           'Feedback shows when it was made and when it arrived, and the card settles into its correct layer.');
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / LAYERS.length;
  for (let i = 0; i < layerButtons.length; i++) {
    layerButtons[i].html(canvasWidth < 560 ? LAYERS[i].name.split(' ')[0] : LAYERS[i].button);
    layerButtons[i].style('font-size', canvasWidth < 560 ? '13px' : '14px');
    layerButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    layerButtons[i].size(colW - 6, 30);
  }
  nextButton.position(margin, drawHeight + 46);
  againButton.position(margin + 100, drawHeight + 46);
}

// Fixed shuffle (mulberry32): seed 4 on the first run, the same for every learner.
function seededOrder(n, seed) {
  let s = seed >>> 0;
  const rand = () => {
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

function startSet() {
  // Try Again uses a new order of the same twelve cards
  order = seededOrder(CARDS.length, SEED + attempt);
  current = 0;
  answered = false;
  chosen = -1;
  results = {};
  score = 0;
  trapScore = 0;
  finished = false;
  hoverCard = -1;
  updateButtonStates();
}

function place(k) {
  if (answered || finished) return;
  const ci = order[current];
  chosen = k;
  answered = true;
  const correct = (k === CARDS[ci].layer);
  if (correct) {
    score++;
    if (CARDS[ci].trap) trapScore++;
  }
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
  if (key.length === 1 && key >= '1' && key <= '5') place(int(key) - 1);
  else if (key === 'Enter') nextCard();
}

function updateButtonStates() {
  for (const b of layerButtons) {
    if (answered || finished) { b.attribute('disabled', ''); b.style('opacity', '0.55'); }
    else { b.removeAttribute('disabled'); b.style('opacity', '1'); }
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
  text('Read the Ruin: Which Layer?', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  if (canvasWidth >= 560) text('Correct: ' + score + ' of ' + Object.keys(results).length, canvasWidth - margin, 14);

  // The rule, shown throughout
  textSize(13);
  textStyle(BOLD);
  const ruleLines = wrapLines(RULE, canvasWidth - 2 * margin - 20);
  const ruleH = ruleLines.length * 17 + 10;
  stroke('#d9c27a');
  fill('#fff8dc');
  rect(margin, 42, canvasWidth - 2 * margin, ruleH, 6);
  noStroke();
  fill('#5a4a10');
  textAlign(LEFT, TOP);
  for (let i = 0; i < ruleLines.length; i++) text(ruleLines[i], margin + 10, 47 + i * 17);
  textStyle(NORMAL);

  const panelTop = 42 + ruleH + 8;
  const stackTop = drawHeight - 5 * bandHeight() - 4 * 3 - 10;
  drawPanel(margin, panelTop, canvasWidth - 2 * margin, stackTop - panelTop - 8);
  drawStack(stackTop);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = 'Done. Try Again uses a new order.';
  else if (answered) status = 'Press ' + (current < order.length - 1 ? 'Next card' : 'See result') + ' to continue.';
  else status = 'Choose the layer (or press 1 to 5).';
  text(fitText(status, canvasWidth - margin - 210), margin + 200, drawHeight + 60);
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
  let yy = y + 9;

  if (finished) {
    if (hoverCard >= 0) { drawCardDetails(hoverCard, x + pad, yy, tw, true); return; }
    const nw = canvasWidth < 560;
    textStyle(BOLD);
    textSize(nw ? 14 : 17);
    fill('black');
    yy = drawWrapped('All twelve cards placed: ' + score + ' of 12 correct, and ' + trapScore +
                     ' of 3 trap cards.', x + pad, yy, tw, nw ? 17 : 21);
    const pass = score >= MASTERY && trapScore >= TRAP_MASTERY;
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(nw ? 13 : 15);
    yy = drawWrapped(pass ? 'You read the ruin. Try the same rule on the Library of Celsus at Ephesus on Day 7.'
                          : 'Look again at the trap cards: ask when each arrived, not when it was made.', x + pad, yy + 2, tw, nw ? 16 : 19);
    textStyle(NORMAL);
    fill('black');
    textSize(nw ? 12 : 14);
    yy = drawWrapped('Notice the Byzantine layer: it holds an Egyptian obelisk, a Greek bronze column and Roman ' +
                     'Medusa heads, all far older than Byzantium.', x + pad, yy + 4, tw, nw ? 15 : 18);
    fill('dimgray');
    textStyle(ITALIC);
    textSize(13);
    drawWrapped('Hover over a card in the stack to review it; red borders mark misses.', x + pad, yy + 3, tw, 17);
    textStyle(NORMAL);
    return;
  }
  drawCardDetails(order[current], x + pad, yy, tw, false);
}

function drawCardDetails(ci, x, y, tw, review) {
  const c = CARDS[ci];
  const r = results[ci];
  const shown = review || answered;
  let yy = y;
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  const head = review ? 'REVIEW' : 'CARD ' + (current + 1) + ' OF ' + CARDS.length;
  text(head, x, yy);
  if (shown && c.trap) {
    const hx = x + textWidth(head) + 10;
    const tag = 'TRAP CARD: MADE LONG BEFORE IT ARRIVED';
    fill('#b8860b');
    rect(hx, yy - 3, textWidth(tag) + 12, 17, 3);
    fill('white');
    text(tag, hx + 6, yy);
  }
  yy += 18;
  fill('black');
  const narrow = canvasWidth < 560;
  textSize(narrow ? 15 : 18);
  yy = drawWrapped(c.card, x, yy, tw, narrow ? 18 : 22) + 4;
  textStyle(NORMAL);

  if (!shown) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(16);
    text('In which layer did this arrive?', x, yy + 2);
    textStyle(NORMAL);
    return;
  }
  textSize(narrow ? 12 : 14);
  fill('#444');
  const dates = narrow ? 'Made: ' + c.made + ' · Arrived: ' + c.arrived
                       : 'Made: ' + c.made + '   ·   Arrived or happened here: ' + c.arrived;
  yy = drawWrapped(dates, x, yy, tw, narrow ? 15 : 18) + 3;
  const L = LAYERS[c.layer];
  textSize(narrow ? 13 : 15);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  const lead = r.correct ? 'Correct:' : 'This one arrived in the ' + L.name + ' layer:';
  // Bold lead, then the reason in normal weight on the same line where it fits
  const leadW = textWidth(lead) + 6;
  text(lead, x, yy);
  textStyle(NORMAL);
  fill('black');
  const first = wrapLines(c.why, tw - leadW);
  const firstLine = first[0];
  text(firstLine, x + leadW, yy);
  const rest = c.why.slice(firstLine.length).trim();
  if (rest) drawWrapped(rest, x, yy + (narrow ? 16 : 19), tw, narrow ? 16 : 19);
}

function bandHeight() { return canvasWidth < 560 ? 40 : 48; }

// Five horizontal bands, Roman at the bottom
function drawStack(top) {
  const bandH = bandHeight(), gap = 3;
  const narrow = canvasWidth < 560;
  const labelW = narrow ? 112 : 200;
  const areaX = margin + labelW;
  const areaW = canvasWidth - 2 * margin - labelW;
  chipRects = [];
  const curCi = finished ? -1 : order[current];

  for (let i = 0; i < LAYERS.length; i++) {
    const L = LAYERS[i];
    const y = top + (LAYERS.length - 1 - i) * (bandH + gap);
    stroke('silver');
    strokeWeight(1);
    fill(i % 2 === 0 ? 'white' : 'ghostwhite');
    rect(areaX, y, areaW, bandH);
    noStroke();
    fill(L.color);
    rect(margin, y, labelW, bandH);
    fill('white');
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(narrow ? 13 : 14);
    text((i + 1) + ' ' + (narrow ? L.name.split(' ')[0] : L.name), margin + 6, y + 4);
    textStyle(NORMAL);
    textSize(narrow ? 10 : 12);
    text(fitText(L.dates, labelW - 12), margin + 6, y + 20);
    if (!narrow) {
      textStyle(ITALIC);
      textSize(11);
      text(fitText(L.def, labelW - 12), margin + 6, y + 33);
      textStyle(NORMAL);
    }

    // Placed cards, in the order they were answered
    const placed = [];
    for (let n = 0; n <= current && n < order.length; n++) {
      const ci = order[n];
      if (results[ci] && CARDS[ci].layer === i) placed.push(ci);
    }
    // Card count at the right edge of the band
    const countW = 30;
    if (placed.length) {
      fill('dimgray');
      textAlign(RIGHT, CENTER);
      textStyle(BOLD);
      textSize(14);
      text(placed.length, areaX + areaW - 8, y + bandH / 2);
      textStyle(NORMAL);
    }
    const slots = 5, cg = 4;
    const cw = (areaW - countW - 8 - (slots - 1) * cg) / slots;
    const chipH = narrow ? 28 : 30;
    for (let n = 0; n < placed.length; n++) {
      const ci = placed[n];
      const cx = areaX + 6 + n * (cw + cg), cy = y + (bandH - chipH) / 2;
      const isNew = (ci === curCi);
      stroke(results[ci].correct ? 'seagreen' : 'firebrick');
      strokeWeight(isNew || ci === hoverCard ? 3 : 2);
      fill(results[ci].correct ? 'honeydew' : 'mistyrose');
      rect(cx, cy, cw, chipH, 5);
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(narrow ? 10 : 12);
      const lines = wrapLines(CARDS[ci].chip, cw - 6);
      if (lines.length === 1) text(lines[0], cx + cw / 2, cy + chipH / 2);
      else {
        text(fitText(lines[0], cw - 6), cx + cw / 2, cy + chipH / 2 - 7);
        text(fitText(lines.slice(1).join(' '), cw - 6), cx + cw / 2, cy + chipH / 2 + 7);
      }
      chipRects.push({ ci: ci, x: cx, y: cy, w: cw, h: chipH });
    }
  }

  if (answered && !finished) {
    const ci = order[current];
    noFill();
    strokeWeight(3);
    const bandY = k => top + (LAYERS.length - 1 - k) * (bandH + gap);
    if (chosen !== CARDS[ci].layer) {
      stroke('firebrick');
      rect(margin + 1.5, bandY(chosen) + 1.5, canvasWidth - 2 * margin - 3, bandH - 3);
    }
    stroke('seagreen');
    rect(margin + 1.5, bandY(CARDS[ci].layer) + 1.5, canvasWidth - 2 * margin - 3, bandH - 3);
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
