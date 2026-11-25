// What Did the Külliye Do? - p5.js 2.x
// CANVAS_HEIGHT: 530
// Twelve buildings of the Süleymaniye complex, one card at a time, in a fixed
// order. The learner sorts each card by the public need it served: worship,
// learning, health, food and shelter, income, or remembrance. Feedback appears
// at once and the card joins a growing summary grouped by need. Two trap
// cards (the medical school and the bath) target the most common wrong guesses.

let canvasWidth = 700;
let drawHeight = 450;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const NEEDS = [
  { name: 'Worship', color: '#2F6E8E', def: 'Buildings for prayer.' },
  { name: 'Learning', color: '#7B3F8F', def: 'Buildings for teaching and study.' },
  { name: 'Health', color: '#B5452B', def: 'Buildings for treating the sick.' },
  { name: 'Food and shelter', color: '#A8681F', def: 'Buildings that fed or housed people.' },
  { name: 'Income', color: '#2E7D4F', def: 'Property whose rent or fees paid for the foundation.' },
  { name: 'Remembrance', color: '#5B5B5B', def: 'Tombs of the founder and family.' }
];

// need is an index into NEEDS; cards appear in this order
const CARDS = [
  { building: 'The mosque', chip: 'Mosque', need: 0,
    why: 'The center of the complex, built 1550–1557.' },
  { building: 'Four medreses', chip: 'Four medreses', need: 1,
    why: 'Colleges for advanced study of Islamic law and theology, among the highest-ranked in the empire.' },
  { building: 'School of hadith (the Prophet’s sayings)', chip: 'Hadith school', need: 1,
    why: 'A specialized college for studying the sayings and practice of the Prophet.' },
  { building: 'Primary school (sıbyan mektebi)', chip: 'Primary school', need: 1,
    why: 'A free school where children learned to read the Quran and basic writing.' },
  { building: 'Medical school', chip: 'Medical school', need: 1,
    why: 'It trained physicians; the hospital next door is where patients were treated.' },
  { building: 'Hospital (darüşşifa)', chip: 'Hospital', need: 2,
    why: 'It treated the sick free of charge, paid for by the endowment.' },
  { building: 'Soup kitchen (imaret)', chip: 'Soup kitchen', need: 3,
    why: 'It fed staff, students, travelers, and the poor every day.' },
  { building: 'Guesthouse (tabhane)', chip: 'Guesthouse', need: 3,
    why: 'It gave travelers and visiting scholars free lodging.' },
  { building: 'Public bath', chip: 'Public bath', need: 4,
    why: 'Bathers paid a fee, and the income went to the foundation.' },
  { building: 'Rows of shops along the outer edges of the complex', chip: 'Shops', need: 4,
    why: 'Their rents paid salaries, stipends, and the kitchen’s food.' },
  { building: 'Tomb of Suleiman', chip: 'Suleiman’s tomb', need: 5,
    why: 'The founder’s tomb, behind the mosque.' },
  { building: 'Tomb of Hürrem', chip: 'Hürrem’s tomb', need: 5,
    why: 'The tomb of Suleiman’s wife, beside his.' }
];
const MASTERY = 10;
const TRAPS = [4, 8];   // medical school and bath (cards 5 and 9)

// ---------- State ----------
let current = 0;
let answered = false;
let chosen = -1;
let results = {};
let score = 0;
let finished = false;
let hoverCard = -1;
let chipRects = [];

// ---------- Controls ----------
let needButtons = [];
let nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < NEEDS.length; i++) {
    const b = createButton(NEEDS[i].name);
    b.parent(document.querySelector('main'));
    b.style('font-size', '13px');
    b.style('padding', '2px 0px');
    b.style('cursor', 'pointer');
    b.attribute('title', (i + 1) + ' ' + NEEDS[i].name + ': ' + NEEDS[i].def);
    b.mousePressed(() => assign(i));
    needButtons.push(b);
  }
  nextButton = createButton('Next card');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCard);

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(restart);

  positionControls();
  restart();

  describe('A sorting activity about the Suleymaniye mosque complex in Istanbul. One card at a time names a building: ' +
           'the mosque, four medreses, a school of hadith, a primary school, a medical school, a hospital, a soup kitchen, ' +
           'a guesthouse, a public bath, rows of shops, and the tombs of Suleiman and Hurrem. The learner chooses the ' +
           'public need it served: worship, learning, health, food and shelter, income, or remembrance. The card settles ' +
           'into its correct column, missed cards marked in red, and the reason is shown. A running score counts correct ' +
           'first answers.');
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / NEEDS.length;
  for (let i = 0; i < needButtons.length; i++) {
    needButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    needButtons[i].size(colW - 6, 30);
  }
  nextButton.position(margin, drawHeight + 46);
  againButton.position(margin + 100, drawHeight + 46);
}

function restart() {
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
  chosen = k;
  answered = true;
  const correct = (k === CARDS[current].need);
  if (correct) score++;
  results[current] = { chosen: k, correct: correct };
  updateButtonStates();
}

function nextCard() {
  if (!answered || finished) return;
  if (current < CARDS.length - 1) {
    current++;
    answered = false;
    chosen = -1;
  } else {
    finished = true;
  }
  updateButtonStates();
}

function keyPressed() {
  if (key >= '1' && key <= '6' && key.length === 1) assign(int(key) - 1);
  else if (key === 'Enter') nextCard();
}

function updateButtonStates() {
  for (const b of needButtons) {
    if (answered || finished) b.attribute('disabled', '');
    else b.removeAttribute('disabled');
  }
  if (answered && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < CARDS.length - 1 ? 'Next card' : 'See result');
}

function mastered() {
  return score >= MASTERY && TRAPS.every(t => results[t] && results[t].correct);
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
  text('What Did the Külliye Do?', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('Correct: ' + score + ' of ' + CARDS.length, canvasWidth - margin, 14);

  const binsTop = 186;
  drawBins(binsTop);
  drawPanel(margin, 44, canvasWidth - 2 * margin, 132);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = 'Done. Press Try Again to repeat all twelve cards.';
  else if (answered) status = 'Press ' + (current < CARDS.length - 1 ? 'Next card' : 'See result') + ' to continue.';
  else status = 'Choose a need (or press 1 to 6).';
  text(fitText(status, canvasWidth - margin - 200), margin + 200, drawHeight + 61);
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
    yy = drawWrapped('All 12 buildings sorted. You scored ' + score + ' of 12.', x + pad, yy, tw, 22);
    const pass = mastered();
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(15);
    yy = drawWrapped(pass ? 'You can read a külliye as a whole system of public services.'
                          : 'Look again at the medical school and the bath: who used each one, and who paid?',
                     x + pad, yy + 2, tw, 20);
    textStyle(NORMAL);
    fill('black');
    textSize(14);
    yy = drawWrapped('Worship 1, Learning 4, Health 1, Food and shelter 2, Income 2, Remembrance 2. ' +
                     'Four buildings served learning, and two existed only to pay for the rest.', x + pad, yy + 6, tw, 18);
    fill('dimgray');
    textStyle(ITALIC);
    textSize(13);
    const hint = 'Hover over a card to review it; red borders mark misses.';
    if (yy + 4 + wrapLines(hint, tw).length * 17 <= y + h - 4) drawWrapped(hint, x + pad, yy + 4, tw, 17);
    textStyle(NORMAL);
    return;
  }
  drawCardDetails(current, x + pad, yy, tw, false);
}

function drawCardDetails(ci, x, y, tw, review) {
  const c = CARDS[ci];
  let yy = y;
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text(review ? 'REVIEW: CARD ' + (ci + 1) : 'CARD ' + (ci + 1) + ' OF ' + CARDS.length, x, yy);
  yy += 18;
  fill('black');
  textSize(20);
  yy = drawWrapped(c.building, x, yy, tw, 25) + 6;
  textStyle(NORMAL);

  const r = results[ci];
  if (!review && !answered) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(16);
    text('What need did this building serve?', x, yy);
    textStyle(NORMAL);
    return;
  }
  const head = r.correct ? 'Correct.' : 'This one served ' + NEEDS[c.need].name + ':';
  textSize(15);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  const headW = textWidth(head) + 6;
  // Head and reason on one flowing paragraph: bold head, then the reason
  if (headW < tw * 0.6) {
    text(head, x, yy);
    textStyle(NORMAL);
    fill('black');
    const lines = wrapLines(c.why, tw - headW);
    text(lines[0], x + headW, yy);
    const rest = lines.slice(1).join(' ');
    if (rest) drawWrapped(rest, x, yy + 19, tw, 19);
  } else {
    yy = drawWrapped(head, x, yy, tw, 19);
    textStyle(NORMAL);
    fill('black');
    drawWrapped(c.why, x, yy + 1, tw, 19);
  }
}

function drawBins(top) {
  const colW = (canvasWidth - 2 * margin) / NEEDS.length;
  const narrow = colW < 120;
  const tiny = colW < 80;
  textSize(tiny ? 11 : narrow ? 13 : 14);
  textStyle(BOLD);
  const nameLines = NEEDS.map(N => wrapLines(N.name, colW - 6).map(l => fitText(l, colW - 4)));
  textStyle(NORMAL);
  textSize(12);
  const defLines = NEEDS.map(N => wrapLines(N.def, colW - 10));
  const nameLH = narrow ? 15 : 16, defLH = 14;
  const maxName = Math.max(...nameLines.map(d => d.length));
  const headH = 6 + maxName * nameLH + 3 + Math.max(...defLines.map(d => d.length)) * defLH + 6;
  const areaH = drawHeight - top - headH - 8;
  chipRects = [];
  const curCi = finished ? -1 : current;

  for (let i = 0; i < NEEDS.length; i++) {
    const N = NEEDS[i];
    const x = margin + i * colW;
    stroke('silver');
    strokeWeight(1);
    fill(i % 2 === 0 ? 'white' : 'ghostwhite');
    rect(x, top + headH, colW, areaH);
    noStroke();
    fill(N.color);
    rect(x, top, colW, headH);
    fill('white');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(tiny ? 11 : narrow ? 13 : 14);
    for (let j = 0; j < nameLines[i].length; j++) text(nameLines[i][j], x + colW / 2, top + 6 + j * nameLH);
    textStyle(NORMAL);
    textSize(12);
    const dTop = top + 6 + maxName * nameLH + 3;
    for (let j = 0; j < defLines[i].length; j++) text(defLines[i][j], x + colW / 2, dTop + j * defLH);

    // Placed cards, in the order they were answered
    const placed = [];
    for (let n = 0; n <= current && n < CARDS.length; n++) {
      if (results[n] && CARDS[n].need === i) placed.push(n);
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
      textSize(narrow ? 12 : 13);
      text(fitText(CARDS[ci].chip, cw - 8), cx + cw / 2, cy + chipH / 2);
      chipRects.push({ ci: ci, x: cx, y: cy, w: cw, h: chipH });
    }
    // Running count for the summary
    if (placed.length && top + headH + 6 + placed.length * (chipH + gap) + 14 < top + headH + areaH) {
      fill('dimgray');
      textAlign(RIGHT, BOTTOM);
      textSize(12);
      text(placed.length, x + colW - 6, top + headH + areaH - 4);
    }
  }

  if (answered && !finished) {
    const ci = current;
    noFill();
    strokeWeight(3);
    if (chosen !== CARDS[ci].need) {
      stroke('firebrick');
      rect(margin + chosen * colW + 1.5, top + 1.5, colW - 3, headH + areaH - 3);
    }
    stroke('seagreen');
    rect(margin + CARDS[ci].need * colW + 1.5, top + 1.5, colW - 3, headH + areaH - 3);
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
