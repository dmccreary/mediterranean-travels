// Place the Site in Its Era - p5.js 2.x
// CANVAS_HEIGHT: 460
// The learner reads one card at a time (a site or object on our trip and the
// date it was built) and assigns it to one of eight period bins with the
// period buttons below the timeline. Feedback appears at once, the card
// settles into its correct bin, and missed cards stay marked in red.

let canvasWidth = 700;
let drawHeight = 380;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let defaultTextSize = 16;

// Period bins, in timeline order. Colors match the Eras timeline MicroSim.
const PERIODS = [
  { short: "Bronze",      name: "Bronze Age",         dates: "c. 3200–1100 BCE", color: "#B07030", darkText: false },
  { short: "Iron",        name: "Iron Age",           dates: "c. 1100–800 BCE",  color: "#5E6B73", darkText: false },
  { short: "Archaic",     name: "Archaic Period",     dates: "c. 800–480 BCE",   color: "#C9A227", darkText: true },
  { short: "Classical",   name: "Classical Period",   dates: "480–323 BCE",      color: "#2E6E9E", darkText: false },
  { short: "Hellenistic", name: "Hellenistic Period", dates: "323–31 BCE",       color: "#4BA3A0", darkText: true },
  { short: "Roman",       name: "Roman Period",       dates: "31 BCE–330 CE",    color: "#A4282A", darkText: false },
  { short: "Byzantine",   name: "Byzantine Period",   dates: "330–1453 CE",      color: "#6E3F8F", darkText: false },
  { short: "Ottoman",     name: "Ottoman Period",     dates: "1453–1922 CE",     color: "#2F7D4A", darkText: false }
];

// period is an index into PERIODS
const CARDS = [
  { id: 1, text: "The first palace at Knossos, Crete", chip: "Knossos palace", built: "c. 1900 BCE", period: 0,
    why: "1900 BCE falls between 3200 and 1100 BCE; the Minoans were a Bronze Age civilization." },
  { id: 2, text: "The gold “Mask of Agamemnon” from Mycenae, now in Athens", chip: "Mask of Agamemnon", built: "c. 1550–1500 BCE", period: 0,
    why: "It is Mycenaean and about three centuries older than any date proposed for the Trojan War." },
  { id: 3, text: "The walls of Troy VI", chip: "Troy VI walls", built: "c. 1750–1300 BCE", period: 0,
    why: "Troy VI is a Late Bronze Age city; not everything at Troy is from the time of the Trojan War, but this layer is close." },
  { id: 4, text: "Painted jars from graves in the Kerameikos cemetery, Athens", chip: "Kerameikos jars", built: "c. 1000 BCE", period: 1,
    why: "1000 BCE falls in the Iron Age (c. 1100–800 BCE); people kept living, and burying their dead, even without writing." },
  { id: 5, text: "The archaic Temple of Artemis at Ephesus", chip: "Artemis temple", built: "begun c. 550 BCE", period: 2,
    why: "550 BCE falls between 800 and 480 BCE." },
  { id: 6, text: "The Athenian Treasury at Delphi", chip: "Athenian Treasury", built: "c. 500–490 BCE", period: 2,
    why: "It was built before 480 BCE, so it is Archaic even though it looks Classical." },
  { id: 7, text: "The Parthenon on the Acropolis of Athens", chip: "Parthenon", built: "447–432 BCE", period: 3,
    why: "447–432 BCE falls between 480 and 323 BCE." },
  { id: 8, text: "The Colossus of Rhodes (nothing survives)", chip: "Colossus", built: "completed c. 280 BCE", period: 4,
    why: "280 BCE falls between 323 and 31 BCE." },
  { id: 9, text: "The Stoa of Attalos in the Athenian Agora, rebuilt in the 1950s", chip: "Stoa of Attalos", built: "c. 150 BCE", period: 4,
    why: "It was first built by King Attalos II of Pergamon around 150 BCE; a modern reconstruction keeps the period of the original." },
  { id: 10, text: "The Library of Celsus, Ephesus", chip: "Library of Celsus", built: "early 2nd century CE", period: 5,
    why: "The early 2nd century CE falls between 31 BCE and 330 CE." },
  { id: 11, text: "Hadrian's Arch, Athens", chip: "Hadrian's Arch", built: "131 CE", period: 5,
    why: "131 CE falls between 31 BCE and 330 CE." },
  { id: 12, text: "Hagia Sophia, Istanbul", chip: "Hagia Sophia", built: "537 CE", period: 6,
    why: "537 CE falls between 330 and 1453 CE." },
  { id: 13, text: "The Palace of the Grand Master, Rhodes, built by crusader knights", chip: "Grand Master's Palace", built: "14th century CE", period: 6,
    why: "By date it falls in the Byzantine period (330–1453), even though it was built by the Knights Hospitaller, not by Byzantines: a period name tells when, not always who." },
  { id: 14, text: "Topkapı Palace, Istanbul", chip: "Topkapı Palace", built: "begun 1459 CE", period: 7,
    why: "1459 falls between 1453 and 1922 CE." },
  { id: 15, text: "The Süleymaniye Mosque, Istanbul", chip: "Süleymaniye Mosque", built: "1550–1557 CE", period: 7,
    why: "1550–1557 falls between 1453 and 1922 CE." }
];

// ---------- State ----------
let order = [];          // shuffled card indices
let current = 0;         // position in order
let answered = false;
let chosen = -1;         // period index the learner chose for the current card
let results = {};        // card index -> { chosen, correct }
let score = 0;
let finished = false;
let hoverCard = -1;      // card index under the mouse (finished state)
let chipRects = [];      // [{ci, x, y, w, h}]

// ---------- Controls ----------
let periodButtons = [];
let nextButton, restartButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < PERIODS.length; i++) {
    const b = createButton(PERIODS[i].short);
    b.parent(document.querySelector('main'));
    b.style('font-size', '13px');
    b.style('padding', '6px 0px');
    b.style('cursor', 'pointer');
    b.attribute('title', PERIODS[i].name + ', ' + PERIODS[i].dates);
    b.mousePressed(() => assign(i));
    periodButtons.push(b);
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

  describe('A sorting activity. One card at a time names a site or object on the trip and the date it was built. ' +
           'The learner chooses one of eight period buttons, from Bronze Age to Ottoman, and the card settles into ' +
           'its correct period bin on a timeline, with missed cards marked in red. A running score counts correct first attempts.');
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / PERIODS.length;
  for (let i = 0; i < periodButtons.length; i++) {
    periodButtons[i].position(margin + i * colW + 2, drawHeight + 8);
    periodButtons[i].size(colW - 4, 30);
  }
  nextButton.position(margin, drawHeight + 44);
  restartButton.position(margin + 100, drawHeight + 44);
}

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function restart() {
  order = shuffleArray(CARDS.map((_, i) => i));
  current = 0;
  answered = false;
  chosen = -1;
  results = {};
  score = 0;
  finished = false;
  hoverCard = -1;
  updateButtonStates();
}

function assign(p) {
  if (answered || finished) return;
  const ci = order[current];
  chosen = p;
  answered = true;
  const correct = (p === CARDS[ci].period);
  if (correct) score++;
  results[ci] = { chosen: p, correct: correct };
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

function updateButtonStates() {
  for (const b of periodButtons) {
    if (answered || finished) b.attribute('disabled', '');
    else b.removeAttribute('disabled');
  }
  if (answered && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < order.length - 1 ? 'Next card' : 'See result');
}

function draw() {
  updateCanvasSize();

  // Regions
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title and score
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(22);
  text('Place the Site in Its Era', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('Correct: ' + score + ' of ' + CARDS.length, canvasWidth - margin, 14);

  const binsTop = 208;
  drawBins(binsTop);
  drawPanel(margin, 44, canvasWidth - 2 * margin, 156);

  // Control-region status text
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = 'Done. Press Restart to reshuffle and try again.';
  else if (answered) status = 'Press ' + (current < order.length - 1 ? 'Next card' : 'See result') + ' to continue.';
  else status = 'Choose the period this card was built in.';
  text(status, margin + 190, drawHeight + 58);
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

// Draws wrapped text and returns the y just below it.
function drawWrapped(str, x, y, maxW, lineH) {
  const lines = wrapLines(str, maxW);
  for (let i = 0; i < lines.length; i++) text(lines[i], x, y + i * lineH);
  return y + lines.length * lineH;
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
    textSize(18);
    fill('black');
    const pass = score >= 12;
    yy = drawWrapped('All 15 cards placed. You scored ' + score + ' of 15.', x + pad, yy, tw, 24);
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(16);
    yy = drawWrapped(pass ? '12 or more: you can place the route in time.'
                          : 'Fewer than 12: review the 24-hour clock table and try again.', x + pad, yy + 2, tw, 21);
    textStyle(NORMAL);
    fill('black');
    textSize(15);
    yy = drawWrapped('Look at the two trap cards. The Palace of the Grand Master is Byzantine by date though crusader knights built it, ' +
                     'and the Stoa of Attalos is Hellenistic though it was rebuilt in the 1950s. Period means when it was built, ' +
                     'not who built it or when it was restored.', x + pad, yy + 8, tw, 20);
    fill('dimgray');
    textStyle(ITALIC);
    textSize(14);
    drawWrapped('Hover over any card in the timeline to review it. Cards with a red border were missed.', x + pad, yy + 6, tw, 18);
    textStyle(NORMAL);
    return;
  }

  drawCardDetails(order[current], x + pad, yy, tw, false);
}

function drawCardDetails(ci, x, y, tw, review) {
  const c = CARDS[ci];
  let yy = y;
  fill('dimgray');
  textSize(13);
  textStyle(BOLD);
  text(review ? 'REVIEW' : 'CARD ' + (current + 1) + ' OF ' + CARDS.length, x, yy);
  yy += 20;
  fill('black');
  textSize(18);
  yy = drawWrapped(c.text, x, yy, tw, 23);
  textStyle(NORMAL);
  textSize(16);
  fill('black');
  text('Built: ' + c.built, x, yy + 2);
  yy += 28;

  const r = results[ci];
  if (!review && !answered) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(16);
    text('Which period was this built in? Choose a button under the timeline.', x, yy);
    textStyle(NORMAL);
    return;
  }
  const correctName = PERIODS[c.period].name;
  const head = r.correct ? 'Correct: ' + correctName + '.' : 'Not quite: this belongs in the ' + correctName + '.';
  textSize(15);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  text(head, x, yy);
  const headW = textWidth(head) + 6;
  textStyle(NORMAL);
  fill('black');
  // First line of the explanation continues after the heading.
  const words = c.why.split(' ');
  let first = '';
  while (words.length && textWidth((first ? first + ' ' : '') + words[0]) <= tw - headW) {
    first = (first ? first + ' ' : '') + words.shift();
  }
  text(first, x + headW, yy);
  if (words.length) drawWrapped(words.join(' '), x, yy + 20, tw, 20);
}

function drawBins(top) {
  const colW = (canvasWidth - 2 * margin) / PERIODS.length;
  const headH = 50;
  const areaH = drawHeight - top - headH - 8;
  chipRects = [];
  const curCi = finished ? -1 : order[current];

  for (let i = 0; i < PERIODS.length; i++) {
    const p = PERIODS[i];
    const x = margin + i * colW;
    // Chip area
    stroke('silver');
    strokeWeight(1);
    fill(i % 2 === 0 ? 'white' : 'ghostwhite');
    rect(x, top + headH, colW, areaH);
    // Header
    noStroke();
    fill(p.color);
    rect(x, top, colW, headH);
    fill(p.darkText ? 'black' : 'white');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(colW < 70 ? 11 : 13);
    text(p.short, x + colW / 2, top + 5);
    textStyle(NORMAL);
    textSize(colW < 70 ? 9 : 11);
    const dl = wrapLines(p.dates, colW - 6);
    for (let j = 0; j < dl.length && j < 2; j++) text(dl[j], x + colW / 2, top + 22 + j * 13);

    // Placed cards: every answered card sits in its correct bin.
    let n = 0;
    for (let k = 0; k <= current && k < order.length; k++) {
      const ci = order[k];
      if (!results[ci] || CARDS[ci].period !== i) continue;
      const cx = x + 4, cy = top + headH + 6 + n * 36, cw = colW - 8, ch = 32;
      const isNew = (ci === curCi);
      stroke(results[ci].correct ? 'seagreen' : 'firebrick');
      strokeWeight(isNew || ci === hoverCard ? 3 : 2);
      fill(results[ci].correct ? 'honeydew' : 'mistyrose');
      rect(cx, cy, cw, ch, 5);
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(colW < 70 ? 9 : 11);
      const lines = wrapLines(CARDS[ci].chip, cw - 6).slice(0, 2);
      if (lines.length === 1) text(lines[0], cx + cw / 2, cy + ch / 2);
      else { text(lines[0], cx + cw / 2, cy + ch / 2 - 7); text(lines[1], cx + cw / 2, cy + ch / 2 + 7); }
      chipRects.push({ ci: ci, x: cx, y: cy, w: cw, h: ch });
      n++;
    }
  }

  // Highlight the correct bin and a wrong choice for the card just answered.
  if (answered && !finished) {
    const ci = order[current];
    noFill();
    strokeWeight(3);
    if (chosen !== CARDS[ci].period) {
      stroke('firebrick');
      rect(margin + chosen * colW + 1.5, top + 1.5, colW - 3, headH + areaH - 3);
    }
    stroke('seagreen');
    rect(margin + CARDS[ci].period * colW + 1.5, top + 1.5, colW - 3, headH + areaH - 3);
  }

  // Hover detection for review after the last card.
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
