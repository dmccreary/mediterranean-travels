// Who Built What We See in the Old Town? - p5.js 2.x
// CANVAS_HEIGHT: 530
// Twelve buildings and features of the city of Rhodes, one card at a time, in
// a fixed shuffled order (seed 7, the same for every learner; no two trap
// cards in a row). The learner attributes each one to the period whose
// builders made what we see today: Ancient, Knights, Ottoman, or Italian.
// Four trap cards look older, or "less Jewish", than they are. Feedback gives
// the reason, and the card settles into its correct layer. Mastery is 10 of
// 12 with the Palace of the Grand Master and the Liberty Gate both correct.

let canvasWidth = 700;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const QUESTION = 'Who built what we see here? Choose the period whose builders made what stands today.';

// Listed oldest first; drawn with Ancient at the bottom of the stack
const LAYERS = [
  { name: 'Ancient', dates: 'before about 400 CE', color: '#2F6E8E',
    def: 'Built by the Greek or Roman city' },
  { name: 'Knights', dates: '1310–1522', color: '#A4282A',
    def: 'Built by the Knights Hospitaller' },
  { name: 'Ottoman', dates: '1523–1912', color: '#2F7D4A',
    def: 'Built under Ottoman rule' },
  { name: 'Italian', dates: '1912–1943', color: '#9A6B1F',
    def: 'Built or rebuilt under Italian rule' }
];

// layer is an index into LAYERS; n is the card number in the specification
const CARDS = [
  { n: 1, card: 'Remains of the Temple of Aphrodite, near the Liberty Gate', chip: 'Temple of Aphrodite', layer: 0,
    why: 'Foundations and column drums of a temple of the 3rd century BCE, uncovered in the Italian period.' },
  { n: 2, card: 'The ancient acropolis on Monte Smith, with the Temple of Apollo and the stadium', chip: 'Monte Smith acropolis', layer: 0,
    why: 'The Hellenistic city’s sanctuary and stadium; some columns were re-erected in the 20th century, but the stones are ancient.' },
  { n: 3, card: 'The Hospital of the Knights, now the Archaeological Museum', chip: 'Hospital of the Knights', layer: 1,
    why: 'Built between 1440 and 1489 to care for the sick, pilgrims, and the poor.' },
  { n: 4, card: 'The inns of the tongues on the Street of the Knights', chip: 'Inns of the tongues', layer: 1,
    why: 'Medieval headquarters of the national tongues; restored, but medieval in plan and largely in stone.' },
  { n: 5, card: 'The low, thick walls, bulwarks, and dry moat', chip: 'Walls and dry moat', layer: 1,
    why: 'Rebuilt after the siege of 1480 to resist cannon.' },
  { n: 6, card: 'The Palace of the Grand Master as we see it', chip: 'Grand Master’s Palace', layer: 3, trap: true,
    why: 'Wrecked by an explosion in 1856 and rebuilt from 1937 to 1940 on medieval foundations.' },
  { n: 7, card: 'The Mosque of Suleiman', chip: 'Mosque of Suleiman', layer: 2,
    why: 'Founded after the conquest of 1522 and rebuilt in 1808.' },
  { n: 8, card: 'The library of Hafiz Ahmed Agha, opposite the mosque', chip: 'Hafiz Ahmed Agha library', layer: 2,
    why: 'An Ottoman foundation of the late 18th century holding manuscripts in Arabic, Persian, and Ottoman Turkish.' },
  { n: 9, card: 'The Kahal Shalom Synagogue', chip: 'Kahal Shalom Synagogue', layer: 2, trap: true,
    why: 'Completed in 1577 by the Jewish community under Ottoman rule.' },
  { n: 10, card: 'The Liberty Gate', chip: 'Liberty Gate', layer: 3, trap: true,
    why: 'Opened through the walls in 1924 to link the Old Town with the new Italian quarter.' },
  { n: 11, card: 'The Church of the Annunciation at Mandraki', chip: 'Church at Mandraki', layer: 3, trap: true,
    why: 'Built in 1925 as a copy of the knights’ lost cathedral of St. John.' },
  { n: 12, card: 'Sokratous Street’s bazaar, fountains, and wooden balconies', chip: 'Sokratous Street bazaar', layer: 2,
    why: 'The Ottoman market street of the town and its domestic details.' }
];
const MASTERY = 10;
const KEY_CARDS = [5, 9];   // cards 6 and 10 must both be correct
const SEED = 7;

// ---------- State ----------
let attempt = 0;
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
let nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < LAYERS.length; i++) {
    const b = createButton((i + 1) + ' ' + LAYERS[i].name);
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

  describe('A layer-sorting activity about the city of Rhodes. Four building periods are stacked from Ancient at the ' +
           'bottom, through the Knights and the Ottomans, to the Italian period at the top. One card at a time names a ' +
           'building or feature, such as the Palace of the Grand Master or the Kahal Shalom Synagogue. The learner ' +
           'chooses the period whose builders made what stands today; feedback gives the dates, and the card settles ' +
           'into its correct layer.');
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / LAYERS.length;
  for (let i = 0; i < layerButtons.length; i++) {
    layerButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    layerButtons[i].size(colW - 6, 30);
  }
  nextButton.position(margin, drawHeight + 46);
  againButton.position(margin + 100, drawHeight + 46);
}

// Fixed shuffle (mulberry32), the same for every learner
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

// Keep the trap cards apart: no trap first and no two traps in a row
function spreadTraps(o) {
  if (CARDS[o[0]].trap) return false;
  for (let i = 1; i < o.length; i++) if (CARDS[o[i]].trap && CARDS[o[i - 1]].trap) return false;
  return true;
}

function startSet() {
  // Seed 7 on the first run; Try Again moves on to the next seed that spreads the traps
  let s = SEED, found = -1;
  while (found < attempt) {
    if (spreadTraps(seededOrder(CARDS.length, s))) found++;
    if (found < attempt) s++;
  }
  order = seededOrder(CARDS.length, s);
  current = 0;
  answered = false;
  chosen = -1;
  results = {};
  score = 0;
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

function masteryMet() {
  return score >= MASTERY && KEY_CARDS.every(i => results[i] && results[i].correct);
}

function keyPressed() {
  if (key.length === 1 && key >= '1' && key <= '4') place(int(key) - 1);
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

  const narrow = canvasWidth < 560;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow ? 17 : 22);
  text(narrow ? 'Who Built What We See?' : 'Who Built What We See in the Old Town?', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('Correct: ' + score + ' of ' + Object.keys(results).length, canvasWidth - margin, 14);

  // The question, shown throughout
  textSize(13);
  textStyle(BOLD);
  const qLines = wrapLines(QUESTION, canvasWidth - 2 * margin - 20);
  const qH = qLines.length * 17 + 10;
  stroke('#d9c27a');
  fill('#fff8dc');
  rect(margin, 42, canvasWidth - 2 * margin, qH, 6);
  noStroke();
  fill('#5a4a10');
  textAlign(LEFT, TOP);
  for (let i = 0; i < qLines.length; i++) text(qLines[i], margin + 10, 47 + i * 17);
  textStyle(NORMAL);

  const panelTop = 42 + qH + 8;
  const stackTop = drawHeight - LAYERS.length * bandHeight() - (LAYERS.length - 1) * 3 - 10;
  drawPanel(margin, panelTop, canvasWidth - 2 * margin, stackTop - panelTop - 8);
  drawStack(stackTop);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = 'Done. Hover over a card to review it.';
  else if (answered) status = 'Press ' + (current < order.length - 1 ? 'Next card' : 'See result') + ' (or Enter) to continue.';
  else status = 'Choose the period (or press 1 to 4).';
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
  const narrow = canvasWidth < 560;

  if (finished) {
    if (hoverCard >= 0) { drawCardDetails(hoverCard, x + pad, yy, tw, true); return; }
    textStyle(BOLD);
    textSize(narrow ? 14 : 17);
    fill('black');
    const keyOk = KEY_CARDS.filter(i => results[i].correct).length;
    yy = drawWrapped('All twelve placed: ' + score + ' of 12 correct, and ' + keyOk +
                     ' of 2 on the palace and the Liberty Gate.', x + pad, yy, tw, narrow ? 17 : 21);
    const pass = masteryMet();
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(narrow ? 13 : 15);
    yy = drawWrapped(pass ? 'You can read Rhodes by its builders, not just its style.'
                          : 'Look again at the palace, the Liberty Gate, and the church at Mandraki: when were they built?',
                     x + pad, yy + 2, tw, narrow ? 16 : 19);
    textStyle(NORMAL);
    fill('black');
    textSize(narrow ? 12 : 14);
    yy = drawWrapped('The stack holds Ancient 2, Knights 3, Ottoman 4, Italian 3. Three of the most “medieval”-looking ' +
                     'features, the palace, the Liberty Gate, and the church at Mandraki, were built in the 20th century.',
                     x + pad, yy + 4, tw, narrow ? 15 : 18);
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
    const tag = 'TRAP CARD';
    fill('#b8860b');
    rect(hx, yy - 3, textWidth(tag) + 12, 17, 3);
    fill('white');
    text(tag, hx + 6, yy);
  }
  yy += 18;
  fill('black');
  const narrow = canvasWidth < 560;
  textSize(narrow ? 15 : 18);
  yy = drawWrapped(c.card, x, yy, tw, narrow ? 18 : 22) + 6;
  textStyle(NORMAL);

  if (!shown) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(16);
    text('Who built what we see here?', x, yy + 2);
    textStyle(NORMAL);
    return;
  }
  const L = LAYERS[c.layer];
  if (review) {
    textSize(narrow ? 12 : 14);
    fill('#444');
    yy = drawWrapped('Your choice: ' + LAYERS[r.chosen].name + '.', x, yy, tw, narrow ? 15 : 18) + 3;
  }
  textSize(narrow ? 13 : 15);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  const lead = r.correct ? 'Correct:' : 'This one is ' + L.name + ':';
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

// Four horizontal bands, Ancient at the bottom
function drawStack(top) {
  const bandH = bandHeight(), gap = 3;
  const narrow = canvasWidth < 560;
  const labelW = narrow ? 100 : 200;
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
    text((i + 1) + ' ' + L.name, margin + 6, y + 4);
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
    const countW = 30;
    if (placed.length) {
      fill('dimgray');
      textAlign(RIGHT, CENTER);
      textStyle(BOLD);
      textSize(14);
      text(placed.length, areaX + areaW - 8, y + bandH / 2);
      textStyle(NORMAL);
    }
    const slots = 4, cg = 4;
    const cw = (areaW - countW - 8 - (slots - 1) * cg) / slots;
    const chipH = narrow ? 30 : 32;
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
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (textWidth(test) > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
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
