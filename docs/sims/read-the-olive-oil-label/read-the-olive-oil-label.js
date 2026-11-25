// Read the Olive Oil Label - p5.js 2.x
// CANVAS_HEIGHT: 532
// Nine illustrative olive oil labels, in a fixed order. Each shows a claim on
// the front of the bottle; the learner can turn the label to read the back,
// then judges "Supports the claim" or "Does not support the claim". The first
// judgment is scored. Feedback gives the reason and marks the back-label
// detail that decides the case. Standards: EU Delegated Regulation 2022/2104
// (acidity limits, "cold extraction" below 27 °C, origin wording) and about
// 120 kcal per tablespoon for any olive oil. Mastery is 7 of 9.

let canvasWidth = 700;
let drawHeight = 440;   // set by computeLayout
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let mainTop = 84;
let mainH = 316;
let stacked = false;    // narrow screens: bottle above the panel
const BOTTLE_STACKED_H = 330;

const QUESTION = 'Does the bottle live up to its claim?';
const VERDICTS = ['Supports the claim', 'Does not support the claim'];

const STANDARD = [
  ['Extra virgin', 'free acidity 0.8% or less.'],
  ['Virgin', '2.0% or less. Lampante: above 2.0%, not fit to eat until refined.'],
  ['Olive oil', 'a blend of refined and virgin oils, 1.0% or less; not extra virgin.'],
  ['“Cold extraction”', 'only if the oil was kept below 27 °C.'],
  ['Freshness', 'read the harvest date, not the best-before date.'],
  ['Origin', 'where the olives were grown and pressed, not where the oil was bottled.'],
  ['Calories', 'every olive oil has about 120 kcal per tablespoon.']
];

// verdict: 0 supports, 1 does not; decide: indexes of the back-label lines that decide it
const LABELS = [
  { front: 'Fresh extra virgin olive oil', back: ['Extra virgin olive oil', 'Harvest 2026/27', 'Acidity ≤ 0.3%', 'Bottled in dark glass'],
    decide: [1, 2], verdict: 0,
    why: 'Acidity is well under the 0.8% limit, and the harvest is this season’s.' },
  { front: 'Light olive oil: fewer calories!', back: ['Olive oil composed of refined olive oils and virgin olive oils', 'Energy: 120 kcal per tablespoon'],
    decide: [1], verdict: 1,
    why: '“Light” means mild flavor and pale color; every oil has about 120 calories per tablespoon.' },
  { front: 'Extra virgin olive oil', back: ['Acidity 1.5%'],
    decide: [0], verdict: 1,
    why: 'Extra virgin requires free acidity of 0.8% or less; 1.5% is at best virgin.' },
  { front: 'Cold extraction', back: ['Extra virgin olive oil', 'Malaxation and extraction at 25 °C'],
    decide: [1], verdict: 0,
    why: 'EU rules allow “cold extraction” when the oil is kept below 27 °C, and 25 °C is below it.' },
  { front: 'Cold extraction', back: ['Extra virgin olive oil', 'Extraction at 32 °C'],
    decide: [1], verdict: 1,
    why: '32 °C is above the 27 °C limit for the words “cold extraction.”' },
  { front: 'Extra virgin olive oil', back: ['Ingredients: refined olive oils and virgin olive oils'],
    decide: [0], verdict: 1,
    why: 'A blend of refined and virgin oils is the grade “olive oil,” not extra virgin.' },
  { front: 'This season’s oil', context: 'Bought in November 2026',
    back: ['Extra virgin olive oil', 'Harvest 2024/25', 'Best before December 2026'],
    decide: [1, 2], verdict: 1,
    why: 'The oil is two harvests old; the best-before date does not make it this season’s.' },
  { front: 'Greek olive oil', back: ['Extra virgin olive oil', 'Blend of olive oils of European Union origin', 'Bottled in Greece'],
    decide: [1, 2], verdict: 1,
    why: '“Blend of EU oils” can mean oil from several countries; bottling in Greece does not make it Greek oil.' },
  { front: 'Early-harvest green oil', sub: 'agourélaio', back: ['Extra virgin olive oil', 'Harvest October 2026', 'Product of Greece'],
    decide: [1, 2], verdict: 0,
    why: 'An October harvest is early in the season, and the origin is stated as Greece.' }
];
const MASTERY = 7;

// ---------- State ----------
let current = 0;
let showBack = false;
let judged = false;
let results = {};       // label index -> { choice, ok }
let score = 0;
let finished = false;
let hoverDot = -1;
let dotRects = [];

// ---------- Controls ----------
let turnButton, verdictButtons = [], nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  turnButton = createButton('Turn the label ↻');
  turnButton.parent(document.querySelector('main'));
  turnButton.style('font-size', '14px');
  turnButton.style('cursor', 'pointer');
  turnButton.mousePressed(turnLabel);

  const colors = ['#2F7D4A', '#A4282A'];
  for (let i = 0; i < VERDICTS.length; i++) {
    const b = createButton(VERDICTS[i]);
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('font-weight', 'bold');
    b.style('cursor', 'pointer');
    b.style('white-space', 'nowrap');
    b.style('color', colors[i]);
    b.attribute('title', VERDICTS[i] + ' (key ' + (i === 0 ? 'S' : 'D') + ')');
    b.mousePressed(() => judge(i));
    verdictButtons.push(b);
  }
  nextButton = createButton('Next label');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextLabel);

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(restart);

  computeLayout();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
  restart();

  describe('A judging activity with nine illustrative olive oil labels. A bottle shows the claim on the front of its ' +
           'label; a button turns the label to show the back, with details such as acidity, extraction temperature, ' +
           'ingredients, harvest date and origin. Beside the bottle is the standard: the EU acidity limits, the 27 ' +
           'degree rule for cold extraction, harvest versus best-before dates, and origin wording. The learner judges ' +
           'whether each label supports its claim and sees the deciding detail marked.');
}

// ---------- Layout ----------
function computeLayout() {
  stacked = canvasWidth < 560;
  mainTop = 84;
  if (stacked) {
    // bottle on top, panel below
    mainH = BOTTLE_STACKED_H + 10 + panelNeed(canvasWidth - 2 * margin);
  } else {
    mainH = Math.max(316, panelNeed(rightW()));
  }
  drawHeight = mainTop + mainH + 46;
  canvasHeight = drawHeight + controlHeight;
}

function leftW() { return Math.min(250, Math.floor(canvasWidth * 0.36)); }
function rightW() { return canvasWidth - 2 * margin - leftW() - 12; }

// Height the right-hand panel needs: the standard plus the longest feedback,
// or the end-of-set summary, whichever is taller
function panelNeed(w) {
  const tw = w - 24;
  const std = standardHeight(tw);
  let fb = 0;
  for (const L of LABELS) {
    textSize(15);
    textStyle(BOLD);
    const headW = textWidth('Look again:') + 6;
    textStyle(NORMAL);
    const first = wrapLines(L.why, tw - headW);
    const n = 1 + (first.length > 1 ? wrapLines(first.slice(1).join(' '), tw).length : 0);
    fb = Math.max(fb, n * 19);
  }
  const play = 10 + std + 12 + 18 + 22 + fb + 12;
  const summary = 10 + 3 * 21 + LABELS.length * 19 + 50;
  return Math.max(play, summary);
}

function standardHeight(tw) {
  textSize(13);
  let n = 0;
  for (const s of STANDARD) n += wrapLines(s[0] + ': ' + s[1], tw - 8).length;
  return 24 + n * 16 + 6;
}

function positionControls() {
  const y1 = drawHeight + 8;
  const avail = canvasWidth - 2 * margin;
  const turnW = stacked ? Math.floor(avail * 0.28) : 150;
  turnButton.html(stacked ? 'Turn ↻' : (showBack ? 'Turn to the front ↻' : 'Turn the label ↻'));
  turnButton.position(margin, y1);
  turnButton.size(turnW, 30);
  const vw = (avail - turnW - 12) / 2;
  verdictButtons[0].html(stacked ? 'Supports' : VERDICTS[0]);
  verdictButtons[1].html(stacked ? 'Does not support' : VERDICTS[1]);
  for (let i = 0; i < 2; i++) {
    verdictButtons[i].position(margin + turnW + 6 + i * (vw + 6), y1);
    verdictButtons[i].size(vw, 30);
  }
  nextButton.position(margin, drawHeight + 46);
  againButton.position(margin + 100, drawHeight + 46);
}

// ---------- Flow ----------
function restart() {
  current = 0;
  showBack = false;
  judged = false;
  results = {};
  score = 0;
  finished = false;
  hoverDot = -1;
  positionControls();
  updateButtonStates();
}

function turnLabel() {
  if (finished) return;
  showBack = !showBack;
  positionControls();
}

function judge(k) {
  if (finished || judged) return;
  const ok = (k === LABELS[current].verdict);
  if (ok) score++;
  results[current] = { choice: k, ok: ok };
  judged = true;
  showBack = true;   // the deciding detail is on the back
  positionControls();
  updateButtonStates();
}

function nextLabel() {
  if (finished || !judged) return;
  if (current < LABELS.length - 1) {
    current++;
    judged = false;
    showBack = false;
  } else {
    finished = true;
  }
  positionControls();
  updateButtonStates();
}

function keyPressed() {
  if (key === 's' || key === 'S') judge(0);
  else if (key === 'd' || key === 'D') judge(1);
  else if (key === 't' || key === 'T') turnLabel();
  else if (key === 'Enter') nextLabel();
}

function updateButtonStates() {
  for (let i = 0; i < 2; i++) {
    const b = verdictButtons[i];
    if (!judged && !finished) { b.removeAttribute('disabled'); b.style('opacity', '1'); }
    else { b.attribute('disabled', ''); b.style('opacity', '0.55'); }
    const chosen = judged && !finished && results[current].choice === i;
    b.style('background', chosen ? (i === 0 ? '#e3f1e7' : '#f8e3e3') : '');
    b.style('border', chosen ? '2px solid ' + (i === 0 ? '#2F7D4A' : '#A4282A') : '');
  }
  if (finished) turnButton.attribute('disabled', '');
  else turnButton.removeAttribute('disabled');
  if (judged && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < LABELS.length - 1 ? 'Next label' : 'See result');
}

// ---------- Drawing ----------
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
  textSize(stacked ? 18 : 22);
  text(stacked ? 'Olive Oil Label' : 'Read the Olive Oil Label', margin, 10);
  textStyle(NORMAL);
  textSize(stacked ? 13 : 15);
  textAlign(RIGHT, TOP);
  text((stacked ? 'Correct: ' : 'Labels judged correctly: ') + score + ' of ' + LABELS.length, canvasWidth - margin, stacked ? 14 : 15);

  // Question bar
  stroke('#d9c27a');
  fill('#fff8dc');
  rect(margin, 42, canvasWidth - 2 * margin, 30, 6);
  noStroke();
  fill('#5a4a10');
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(14);
  text(QUESTION, margin + 10, 57);
  textStyle(ITALIC);
  textSize(12);
  fill('#8a7a3a');
  textAlign(RIGHT, CENTER);
  text('Illustrative labels', canvasWidth - margin - 10, 57);
  textStyle(NORMAL);

  if (stacked) {
    drawBottle(margin, mainTop, canvasWidth - 2 * margin, BOTTLE_STACKED_H);
    drawPanel(margin, mainTop + BOTTLE_STACKED_H + 10, canvasWidth - 2 * margin, mainH - BOTTLE_STACKED_H - 10);
  } else {
    drawBottle(margin, mainTop, leftW(), mainH);
    drawPanel(margin + leftW() + 12, mainTop, rightW(), mainH);
  }
  drawDots(mainTop + mainH + 8);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = 'Done. Hover over a number to review a label.';
  else if (!judged) status = showBack ? 'Judge it: S supports, D does not.' : 'Turn the label (T), then judge it.';
  else status = 'Press ' + (current < LABELS.length - 1 ? 'Next label' : 'See result') + ' (or Enter).';
  text(fitText(status, canvasWidth - margin - 205), margin + 200, drawHeight + 61);
}

// A glass bottle with the current label on it
function drawBottle(x, y, w, h) {
  const li = finished ? (hoverDot >= 0 ? hoverDot : -1) : current;
  const bodyW = Math.min(w - 24, 200);
  const bodyH = h - 74;
  const bx = x + (w - bodyW) / 2;
  const by = y + 64;
  const cx = bx + bodyW / 2;

  // cap, neck, shoulders, body
  noStroke();
  fill('#b08d2a');
  rect(cx - 17, y + 4, 34, 18, 3);
  fill('#24452a');
  rect(cx - 13, y + 20, 26, 30);
  beginShape();
  vertex(cx - 13, y + 48);
  vertex(cx + 13, y + 48);
  vertex(bx + bodyW - 6, by + 4);
  vertex(bx + 6, by + 4);
  endShape(CLOSE);
  rect(bx, by, bodyW, bodyH, 12);
  // glass highlight
  fill(255, 255, 255, 40);
  rect(bx + 8, by + 10, 8, bodyH - 20, 4);

  // the label
  const lx = bx + 12, lw = bodyW - 24;
  const ly = by + 16, lh = bodyH - 32;
  stroke('#c9b27a');
  strokeWeight(1);
  fill('#fbf5e4');
  rect(lx, ly, lw, lh, 6);
  noStroke();

  if (li < 0) {
    fill('#5d6d78');
    textAlign(CENTER, CENTER);
    textStyle(ITALIC);
    textSize(14);
    drawWrappedCentered('Hover over a number below to see that label again.', lx + lw / 2, ly + lh / 2 - 20, lw - 20, 18);
    textStyle(NORMAL);
    return;
  }
  const L = LABELS[li];
  const back = finished ? true : showBack;
  const tw = lw - 20;
  textAlign(CENTER, TOP);
  fill('#8a7a3a');
  textStyle(BOLD);
  textSize(11);
  text('LABEL ' + (li + 1) + ' OF 9 · ' + (back ? 'BACK' : 'FRONT'), lx + lw / 2, ly + 8);
  textStyle(NORMAL);

  if (!back) {
    // The front: the claim, large
    fill('#24452a');
    textStyle(BOLD);
    textSize(lw < 150 ? 18 : 22);
    const lines = wrapLines('“' + L.front + '”', tw);
    let yy = ly + lh / 2 - lines.length * 13 - (L.sub ? 10 : 0);
    for (const s of lines) { text(s, lx + lw / 2, yy); yy += 26; }
    textStyle(NORMAL);
    if (L.sub) {
      textStyle(ITALIC);
      textSize(15);
      text('(' + L.sub + ')', lx + lw / 2, yy + 2);
      textStyle(NORMAL);
    }
    fill('#b08d2a');
    rect(lx + lw / 2 - 30, ly + lh - 30, 60, 2);
    if (L.context) {
      fill('#5d6d78');
      textStyle(ITALIC);
      textSize(12);
      text(L.context, lx + lw / 2, ly + lh - 22);
      textStyle(NORMAL);
    }
    return;
  }

  // The back: the details, one per line, the deciding ones marked once judged
  const r = results[li];
  textAlign(LEFT, TOP);
  textSize(13);
  let yy = ly + 30;
  fill('#3d4a52');
  textStyle(ITALIC);
  yy = drawWrapped('Front: “' + L.front + '”', lx + 10, yy, tw, 16) + 8;
  textStyle(NORMAL);
  if (L.context) {
    fill('#5d6d78');
    textStyle(ITALIC);
    yy = drawWrapped(L.context, lx + 10, yy - 4, tw, 16) + 8;
    textStyle(NORMAL);
  }
  stroke('#c9b27a');
  line(lx + 10, yy - 4, lx + lw - 10, yy - 4);
  noStroke();
  yy += 4;
  for (let i = 0; i < L.back.length; i++) {
    const lines = wrapLines(L.back[i], tw - 12);
    const blockH = lines.length * 16;
    const mark = r && L.decide.includes(i);
    if (mark) {
      fill('#ffe58a');
      rect(lx + 5, yy - 3, lw - 10, blockH + 5, 3);
    }
    fill(mark ? '#1d2a33' : '#24452a');
    textStyle(mark ? BOLD : NORMAL);
    text('•', lx + 10, yy);
    for (let k = 0; k < lines.length; k++) text(lines[k], lx + 22, yy + k * 16);
    textStyle(NORMAL);
    yy += blockH + 8;
  }
  if (r) {
    fill('#8a6d00');
    textStyle(ITALIC);
    textSize(11);
    drawWrapped('Highlighted: the deciding detail', lx + 10, Math.min(yy + 2, ly + lh - 30), tw, 14);
    textStyle(NORMAL);
  }
}

function drawPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  const pad = 12;
  const tw = w - 2 * pad;
  let yy = y + 10;

  if (finished && hoverDot < 0) { drawSummary(x + pad, yy, tw); return; }

  // The standard to judge by
  const sh = standardHeight(tw);
  fill('#f4f6f8');
  rect(x + pad - 4, yy - 4, tw + 8, sh, 6);
  fill('#5d6d78');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(12);
  text('THE STANDARD (EU RULES)', x + pad + 4, yy + 2);
  yy += 22;
  textSize(13);
  for (const s of STANDARD) {
    const lines = wrapLines(s[0] + ': ' + s[1], tw - 8);
    for (let n = 0; n < lines.length; n++) {
      if (n === 0) {
        textStyle(BOLD);
        fill('#24452a');
        text(s[0] + ':', x + pad + 4, yy);
        const lw = textWidth(s[0] + ':') + 6;
        textStyle(NORMAL);
        fill('#1d2a33');
        text(lines[0].slice(s[0].length + 2), x + pad + 4 + lw, yy);
      } else {
        text(lines[n], x + pad + 4, yy);
      }
      yy += 16;
    }
  }
  yy = y + 10 + sh + 10;

  const li = finished ? hoverDot : current;
  const L = LABELS[li];
  const r = results[li];
  fill('dimgray');
  textStyle(BOLD);
  textSize(12);
  text((finished ? 'REVIEW: ' : '') + 'LABEL ' + (li + 1) + ' OF ' + LABELS.length, x + pad, yy);
  yy += 18;
  fill('black');
  textSize(16);
  text(fitText('Claim: “' + L.front + '”', tw), x + pad, yy);
  textStyle(NORMAL);
  yy += 24;

  if (!r) {
    fill('#5d6d78');
    textStyle(ITALIC);
    textSize(14);
    drawWrapped(showBack ? 'Check each detail on the back against the standard above.'
                         : 'Turn the label to read the back before you judge.', x + pad, yy, tw, 18);
    textStyle(NORMAL);
    return;
  }
  if (finished) {
    textSize(13);
    fill('#3d4a52');
    yy = drawWrapped('Your judgment: ' + VERDICTS[r.choice] + '. The label ' +
                     (L.verdict === 0 ? 'supports' : 'does not support') + ' its claim.', x + pad, yy, tw, 17) + 4;
  }
  drawFeedback(L, r, x + pad, yy, tw);
}

function drawFeedback(L, r, x, y, tw) {
  const head = r.ok ? 'Correct:' : 'Look again:';
  textSize(15);
  textStyle(BOLD);
  fill(r.ok ? 'darkgreen' : 'firebrick');
  const headW = textWidth(head) + 6;
  text(head, x, y);
  textStyle(NORMAL);
  fill('black');
  const lines = wrapLines(L.why, tw - headW);
  text(lines[0], x + headW, y);
  const rest = lines.slice(1).join(' ');
  if (rest) return drawWrapped(rest, x, y + 19, tw, 19);
  return y + 19;
}

function drawSummary(x, y, tw) {
  textAlign(LEFT, TOP);
  const pass = score >= MASTERY;
  textStyle(BOLD);
  textSize(16);
  fill('black');
  let yy = drawWrapped('3 labels support their claims; 6 do not. You judged ' + score + ' of 9 correctly.', x, y, tw, 21);
  textSize(14);
  fill(pass ? 'darkgreen' : 'firebrick');
  yy = drawWrapped(pass ? 'You can read an olive oil label like a Greek grandmother.'
                        : 'Check the back label first: acidity, temperature, ingredients, harvest, origin.', x, yy + 2, tw, 19) + 8;
  textStyle(NORMAL);
  textSize(13);
  for (let i = 0; i < LABELS.length; i++) {
    const L = LABELS[i];
    const r = results[i];
    fill(r.ok ? 'darkgreen' : 'firebrick');
    textStyle(BOLD);
    text(r.ok ? '✓' : '✗', x, yy);
    fill('black');
    text((i + 1) + '.', x + 16, yy);
    textStyle(NORMAL);
    const verdict = L.verdict === 0 ? 'supports' : 'does not';
    const vW = textWidth('does not') + 8;
    fill(L.verdict === 0 ? '#2F7D4A' : '#A4282A');
    text(verdict, x + tw - vW + 8, yy);
    fill('#1d2a33');
    text(fitText('“' + L.front + '”', tw - 40 - vW), x + 36, yy);
    yy += 19;
  }
  fill('#5d6d78');
  textStyle(ITALIC);
  textSize(12);
  drawWrapped('Every deciding fact was on the back label.', x, yy + 4, tw, 16);
  textStyle(NORMAL);
}

// Progress: one numbered dot per label
function drawDots(y) {
  dotRects = [];
  const n = LABELS.length;
  const d = 26, gap = 10;
  const total = n * d + (n - 1) * gap;
  let x = (canvasWidth - total) / 2;
  hoverDot = -1;
  for (let i = 0; i < n; i++) {
    const cx = x + d / 2, cy = y + d / 2 + 2;
    const r = results[i];
    const isCur = !finished && i === current;
    if (finished && dist(mouseX, mouseY, cx, cy) < d / 2 + 2) hoverDot = i;
    stroke(isCur ? '#1d2a33' : (r ? (r.ok ? 'seagreen' : 'firebrick') : '#b9c3c9'));
    strokeWeight(isCur || i === hoverDot ? 3 : 1.5);
    fill(r ? (r.ok ? 'honeydew' : 'mistyrose') : 'white');
    circle(cx, cy, d);
    noStroke();
    fill('#1d2a33');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(12);
    text(i + 1, cx, cy);
    textStyle(NORMAL);
    dotRects.push({ i: i, cx: cx, cy: cy });
    x += d + gap;
  }
  strokeWeight(1);
}

// ---------- Text helpers ----------
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

function drawWrappedCentered(str, cx, y, maxW, lineH) {
  const lines = wrapLines(str, maxW);
  for (let i = 0; i < lines.length; i++) text(lines[i], cx, y + i * lineH);
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
