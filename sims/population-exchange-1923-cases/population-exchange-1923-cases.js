// Who Was Exchanged in 1923? - p5.js 2.x
// CANVAS_HEIGHT: 630
// Ten illustrative households, one at a time, in a fixed order. The learner
// applies five rules, simplified from the Convention Concerning the Exchange
// of Greek and Turkish Populations (Lausanne, January 30, 1923), and decides
// whether each household was sent to Greece, sent to Turkey, or not exchanged.
// Feedback names the deciding rule, which is highlighted in the rules panel,
// and the case joins a summary grouped by outcome.

let canvasWidth = 700;
let drawHeight = 550;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const RULES = [
  'Greek Orthodox Christians living in Turkey are exchanged to Greece.',
  'Muslims living in Greece are exchanged to Turkey.',
  'People of these two groups who had already left since 1912 count as exchanged, and may not return.',
  'Exempt: the Greek Orthodox established in Istanbul before October 30, 1918; the Muslims of Western Thrace; the Greek Orthodox of Imbros and Tenedos.',
  'The exchange applies only to Greece and Turkey.'
];

const OUTCOMES = [
  { name: 'Sent to Greece', color: '#2F6E8E' },
  { name: 'Sent to Turkey', color: '#9A5B13' },
  { name: 'Not exchanged', color: '#5B5B5B' }
];

// out is an index into OUTCOMES; rules lists the deciding rule numbers (1-based)
const CASES = [
  { text: 'A Greek Orthodox family whose grandparents settled in Istanbul in 1890', chip: 'Istanbul, settled 1890',
    out: 2, rules: [4], why: 'Rule 4: established in Istanbul before October 30, 1918.' },
  { text: 'A Greek Orthodox family that moved to Istanbul from the Black Sea coast in 1920', chip: 'Istanbul, arrived 1920',
    out: 0, rules: [1, 4], why: 'Rule 4 covers only those established in Istanbul before October 30, 1918, so rule 1 applies.' },
  { text: 'A Turkish-speaking Orthodox Christian family in Cappadocia', chip: 'Cappadocia, Turkish-speaking',
    out: 0, rules: [1], why: 'Rule 1: the test was religion, not language.' },
  { text: 'A Greek-speaking Muslim family in Rethymno, Crete', chip: 'Rethymno, Greek-speaking',
    out: 1, rules: [2], why: 'Rule 2: the test was religion, not language.' },
  { text: 'A Muslim family in Komotini, Western Thrace', chip: 'Komotini, W. Thrace',
    out: 2, rules: [4], why: 'Rule 4: the Muslims of Western Thrace were exempt.' },
  { text: 'A Muslim family in Thessaloniki', chip: 'Thessaloniki',
    out: 1, rules: [2], why: 'Rule 2: Thessaloniki was in Greece, and only Western Thrace was exempt.' },
  { text: 'A Sephardic Jewish family in İzmir', chip: 'İzmir, Jewish',
    out: 2, rules: [1, 2], why: 'Rules 1 and 2 cover only Orthodox Christians and Muslims.' },
  { text: 'A Greek Orthodox family on Imbros', chip: 'Imbros',
    out: 2, rules: [4], why: 'Rule 4: the Greek Orthodox of Imbros and Tenedos were exempt.' },
  { text: 'A Muslim family on Rhodes', chip: 'Rhodes',
    out: 2, rules: [5], why: 'Rule 5: Rhodes belonged to Italy in 1923, not Greece.' },
  { text: 'A Greek Orthodox family from Smyrna who fled to Athens in September 1922', chip: 'Smyrna, fled 1922',
    out: 0, rules: [3], why: 'Rule 3: those who had already left counted as exchanged and could not return.' }
];
const MASTERY = 8;
const KEY_CASES = [2, 3];   // cases 3 and 4: the religion-not-language rule

// ---------- State ----------
let current = 0;
let answered = false;
let chosen = -1;
let results = {};
let score = 0;
let finished = false;
let hoverCase = -1;
let chipRects = [];

// ---------- Controls ----------
let outButtons = [];
let nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < OUTCOMES.length; i++) {
    const b = createButton(OUTCOMES[i].name);
    b.parent(document.querySelector('main'));
    b.style('font-size', '15px');
    b.style('cursor', 'pointer');
    b.attribute('title', OUTCOMES[i].name + ' (key ' + (i + 1) + ')');
    b.mousePressed(() => choose(i));
    outButtons.push(b);
  }
  nextButton = createButton('Next case');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCase);

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(restart);

  positionControls();
  restart();

  describe('A rule-application activity about the 1923 Greek-Turkish population exchange. Five simplified rules of the ' +
           'convention are shown at the top. One illustrative household at a time is described, and the learner chooses ' +
           'Sent to Greece, Sent to Turkey, or Not exchanged. Feedback names the deciding rule, which is highlighted, and ' +
           'the case joins a summary grouped by outcome. A running score counts correct first answers out of ten.');
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / OUTCOMES.length;
  for (let i = 0; i < outButtons.length; i++) {
    outButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    outButtons[i].size(colW - 6, 30);
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
  hoverCase = -1;
  updateButtonStates();
}

function choose(k) {
  if (answered || finished) return;
  chosen = k;
  answered = true;
  const correct = (k === CASES[current].out);
  if (correct) score++;
  results[current] = { chosen: k, correct: correct };
  updateButtonStates();
}

function nextCase() {
  if (!answered || finished) return;
  if (current < CASES.length - 1) {
    current++;
    answered = false;
    chosen = -1;
  } else {
    finished = true;
  }
  updateButtonStates();
}

function keyPressed() {
  if (key >= '1' && key <= '3' && key.length === 1) choose(int(key) - 1);
  else if (key === 'Enter') nextCase();
}

function updateButtonStates() {
  for (const b of outButtons) {
    if (answered || finished) b.attribute('disabled', '');
    else b.removeAttribute('disabled');
  }
  if (answered && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < CASES.length - 1 ? 'Next case' : 'See result');
}

function mastered() {
  return score >= MASTERY && KEY_CASES.every(c => results[c] && results[c].correct);
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
  text('Who Was Exchanged in 1923?', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('Correct: ' + score + ' of ' + CASES.length, canvasWidth - margin, 14);

  // Which case's rules to highlight: the current answered case, or a hovered chip at the end
  let hi = [];
  if (finished && hoverCase >= 0) hi = CASES[hoverCase].rules;
  else if (answered && !finished) hi = CASES[current].rules;

  const rulesBottom = drawRules(margin, 42, canvasWidth - 2 * margin, hi);
  const caseTop = rulesBottom + 8;
  const caseH = 132;
  drawCasePanel(margin, caseTop, canvasWidth - 2 * margin, caseH);
  drawBins(caseTop + caseH + 8);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = 'Done. Hover over a case to review it, or press Try Again.';
  else if (answered) status = 'Press ' + (current < CASES.length - 1 ? 'Next case' : 'See result') + ' (or Enter) to continue.';
  else status = 'Choose an outcome (or press 1 to 3).';
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

// The five rules, always visible. Returns the bottom y of the panel.
function drawRules(x, y, w, hi) {
  const pad = 12, numW = 24, lineH = 18;
  const rs = canvasWidth < 560 ? 13 : 14;
  textSize(rs);
  textStyle(NORMAL);
  const wrapped = RULES.map(r => wrapLines(r, w - 2 * pad - numW - 6));
  let h = 10 + 18 + 4;
  for (const L of wrapped) h += L.length * lineH + 3;
  h += 6;

  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text('THE RULES, SIMPLIFIED FROM THE CONVENTION OF JANUARY 30, 1923', x + pad, y + 10);
  textStyle(NORMAL);

  let yy = y + 10 + 18 + 4;
  for (let i = 0; i < RULES.length; i++) {
    const on = hi.includes(i + 1);
    const rh = wrapped[i].length * lineH;
    if (on) {
      fill('#FFF3C4');
      stroke('#D4A017');
      strokeWeight(2);
      rect(x + pad - 6, yy - 3, w - 2 * pad + 12, rh + 4, 5);
      noStroke();
    }
    fill(on ? '#7A5A00' : '#12304a');
    textStyle(BOLD);
    textSize(rs);
    text((i + 1) + '.', x + pad, yy);
    textStyle(on ? BOLD : NORMAL);
    fill('black');
    for (let j = 0; j < wrapped[i].length; j++) text(wrapped[i][j], x + pad + numW, yy + j * lineH);
    textStyle(NORMAL);
    yy += rh + 3;
  }
  return y + h;
}

function drawCasePanel(x, y, w, h) {
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
    if (hoverCase >= 0) { drawCaseDetails(hoverCase, x + pad, yy, tw, true); return; }
    textStyle(BOLD);
    textSize(17);
    fill('black');
    yy = drawWrapped('All ten cases decided. You scored ' + score + ' of 10.', x + pad, yy, tw, 22);
    const pass = mastered();
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(15);
    yy = drawWrapped(pass ? 'You applied the convention as its officials did: by religion and by the exemptions.'
                          : 'Look again at cases 3 and 4: what did the convention test, language or faith?',
                     x + pad, yy + 2, tw, 19);
    textStyle(NORMAL);
    fill('black');
    textSize(14);
    drawWrapped('Sent to Greece 3, Sent to Turkey 2, Not exchanged 5. Half these households stayed, and language decided none of them. ' +
                'Behind the rules were real families: about 1.2 million Orthodox Christians and about 400,000 Muslims lost their homes.',
                x + pad, yy + 5, tw, 18);
    return;
  }
  drawCaseDetails(current, x + pad, yy, tw, false);
}

function drawCaseDetails(ci, x, y, tw, review) {
  const c = CASES[ci];
  let yy = y;
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text(review ? 'REVIEW: ILLUSTRATIVE CASE ' + (ci + 1) : 'ILLUSTRATIVE CASE ' + (ci + 1) + ' OF ' + CASES.length, x, yy);
  yy += 18;
  fill('black');
  textSize(canvasWidth < 560 ? 16 : 18);
  yy = drawWrapped(c.text + '.', x, yy, tw, 23) + 6;
  textStyle(NORMAL);

  const r = results[ci];
  if (!review && !answered) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(15);
    drawWrapped('Under the 1923 convention, what happens to this household?', x, yy, tw, 19);
    textStyle(NORMAL);
    return;
  }
  const head = r.correct ? 'Correct:' : 'Not quite. ' + OUTCOMES[c.out].name + ':';
  textSize(15);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  const headW = textWidth(head) + 6;
  // Head and reason as one flowing paragraph: bold head, then the reason
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
  const colW = (canvasWidth - 2 * margin) / OUTCOMES.length;
  const headH = 28;
  const areaH = drawHeight - top - headH - 8;
  chipRects = [];
  const curCi = finished ? -1 : current;
  const narrow = colW < 170;

  for (let i = 0; i < OUTCOMES.length; i++) {
    const O = OUTCOMES[i];
    const x = margin + i * colW;
    stroke('silver');
    strokeWeight(1);
    fill(i % 2 === 0 ? 'white' : 'ghostwhite');
    rect(x, top + headH, colW, areaH);
    noStroke();
    fill(O.color);
    rect(x, top, colW, headH);

    // Placed cases, in the order they were answered
    const placed = [];
    for (let n = 0; n <= current && n < CASES.length; n++) {
      if (results[n] && CASES[n].out === i) placed.push(n);
    }
    fill('white');
    textStyle(BOLD);
    textSize(narrow ? 13 : 15);
    textAlign(CENTER, CENTER);
    text(O.name + (placed.length ? ' (' + placed.length + ')' : ''), x + colW / 2, top + headH / 2);
    textStyle(NORMAL);

    const gap = 4;
    const chipH = Math.min(26, Math.floor((areaH - 8) / 5) - gap);
    for (let n = 0; n < placed.length; n++) {
      const ci = placed[n];
      const cx = x + 5, cy = top + headH + 5 + n * (chipH + gap), cw = colW - 10;
      const isNew = (ci === curCi);
      stroke(results[ci].correct ? 'seagreen' : 'firebrick');
      strokeWeight(isNew || ci === hoverCase ? 3 : 2);
      fill(results[ci].correct ? 'honeydew' : 'mistyrose');
      rect(cx, cy, cw, chipH, 5);
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(narrow ? 12 : 13);
      text(fitText((ci + 1) + '. ' + CASES[ci].chip, cw - 8), cx + cw / 2, cy + chipH / 2);
      chipRects.push({ ci: ci, x: cx, y: cy, w: cw, h: chipH });
    }
  }

  if (answered && !finished) {
    const ci = current;
    noFill();
    strokeWeight(3);
    if (chosen !== CASES[ci].out) {
      stroke('firebrick');
      rect(margin + chosen * colW + 1.5, top + 1.5, colW - 3, headH + areaH - 3);
    }
    stroke('seagreen');
    rect(margin + CASES[ci].out * colW + 1.5, top + 1.5, colW - 3, headH + areaH - 3);
  }

  hoverCase = -1;
  if (finished) {
    for (const r of chipRects) {
      if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) hoverCase = r.ci;
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
