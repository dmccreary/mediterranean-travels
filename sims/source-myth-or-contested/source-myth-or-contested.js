// Source, Myth, or Contested? - p5.js 2.x
// CANVAS_HEIGHT: 490
// Ten statements about Byzantine Constantinople, one at a time. The learner
// classifies each as a primary source, a myth, contested history or settled
// history. Each statement is scored once; feedback and the reason appear at
// once. At the end the score, the mastery message and a review of every
// statement (missed ones in red) are shown. Try Again reshuffles the order.

let canvasWidth = 700;
let drawHeight = 410;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const CATS = [
  { name: 'Primary source', button: '1 Primary source', color: '#2F6E8E',
    def: 'Evidence written or made at the time, by someone who was there or close to it.' },
  { name: 'Myth', button: '2 Myth', color: '#7B3F8F',
    def: 'A story first recorded long after the event, with no support from the time.' },
  { name: 'Contested history', button: '3 Contested', color: '#B5452B',
    def: 'The facts are agreed, but their meaning or proper use is disputed today.' },
  { name: 'Settled history', button: '4 Settled', color: '#2E7D4F',
    def: 'A fact agreed by the sources and by modern historians.' }
];

// cat is an index into CATS
const STATEMENTS = [
  { text: 'Procopius, writing in the 550s for Justinian, says the dome seems to hang from heaven by a golden chain.',
    cat: 0, why: 'Procopius saw the building new; his praise was written for the emperor, so we read it with that purpose in mind.' },
  { text: 'On entering the finished church, Justinian cried, “Solomon, I have outdone thee!”',
    cat: 1, why: 'The line first appears in the Diēgēsis, written about three hundred years later; Procopius and Paul the Silentiary do not mention it.' },
  { text: 'Hagia Sophia was dedicated in December 537.',
    cat: 3, why: 'The date is agreed by the sources of the time and by modern historians.' },
  { text: 'The green marble columns in Hagia Sophia were taken from the Temple of Artemis at Ephesus.',
    cat: 1, why: 'It is a later tradition with no support from the 6th century; the stone is a green marble quarried in Thessaly, in Greece.' },
  { text: 'Procopius, who lived through the Nika Riots, says more than 30,000 people were killed in the Hippodrome.',
    cat: 0, why: 'It is an eyewitness-era number from one writer; the figure may be exaggerated, but the source is from the time.' },
  { text: 'Hagia Sophia should be a mosque today.',
    cat: 2, why: 'The dates of its conversions are agreed; whether it should be a mosque, a church, or a museum is a disagreement about values.' },
  { text: 'The Medusa heads in the Basilica Cistern were set upside down to cancel the gaze of the Gorgon.',
    cat: 1, why: 'No source from the time explains their position; using them as column bases to make up the height is the simpler explanation.' },
  { text: 'Niketas Choniates, a Byzantine official, wrote that crusaders seated a woman on the patriarch’s throne in Hagia Sophia in 1204.',
    cat: 0, why: 'Choniates lived through the sack; he was a bitter victim, so his account is vivid and one-sided.' },
  { text: 'The army of the Fourth Crusade captured and sacked Constantinople in April 1204.',
    cat: 3, why: 'Byzantine and crusader sources agree on the event and its date.' },
  { text: 'The four bronze horses taken from the Hippodrome in 1204 belong in Venice.',
    cat: 2, why: 'Where the horses came from is agreed; who should keep them today is a matter of opinion.' }
];
const MASTERY = 8;

// ---------- State ----------
let order = [];        // order[pos] = statement index
let current = 0;       // position in order
let answered = false;
let chosen = -1;
let results = {};      // by statement index: { chosen, correct }
let score = 0;
let finished = false;
let reviewPos = -1;    // position selected for review on the result screen
let tileRects = [];

// ---------- Controls ----------
let catButtons = [];
let nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < CATS.length; i++) {
    const b = createButton(CATS[i].button);
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('padding', '4px 0px');
    b.style('cursor', 'pointer');
    b.style('color', 'white');
    b.style('background-color', CATS[i].color);
    b.style('border', '1px solid ' + CATS[i].color);
    b.style('border-radius', '4px');
    b.attribute('title', CATS[i].name + ': ' + CATS[i].def);
    b.mousePressed(() => classify(i));
    catButtons.push(b);
  }
  nextButton = createButton('Next statement');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextStatement);

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(() => startSet(true));

  positionControls();
  startSet(false);

  describe('A classification activity. Four boxes define primary source, myth, contested history and settled history. ' +
           'One statement at a time about Byzantine Constantinople is shown, and the learner chooses one of the four kinds. ' +
           'The correct kind is outlined in green, a wrong choice in red, and the reason is shown. Ten numbered tiles track ' +
           'the answers; at the end the learner sees the score and can review each statement.');
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / CATS.length;
  for (let i = 0; i < catButtons.length; i++) {
    catButtons[i].html(canvasWidth < 560 ? CATS[i].button.split(' ').slice(0, 2).join(' ') : CATS[i].button);
    catButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    catButtons[i].size(colW - 6, 30);
  }
  nextButton.position(margin, drawHeight + 46);
  againButton.position(margin + 130, drawHeight + 46);
}

function startSet(shuffle) {
  order = Array.from({ length: STATEMENTS.length }, (_, i) => i);
  if (shuffle) {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  }
  current = 0;
  answered = false;
  chosen = -1;
  results = {};
  score = 0;
  finished = false;
  reviewPos = -1;
  updateButtonStates();
}

function classify(k) {
  if (answered || finished) return;
  const si = order[current];
  chosen = k;
  answered = true;
  const correct = (k === STATEMENTS[si].cat);
  if (correct) score++;
  results[si] = { chosen: k, correct: correct };
  updateButtonStates();
}

function nextStatement() {
  if (!answered || finished) return;
  if (current < order.length - 1) {
    current++;
    answered = false;
    chosen = -1;
  } else {
    finished = true;
    // Open the review on the first missed statement, if any
    reviewPos = canvasWidth < 560 ? -1 : order.findIndex(si => !results[si].correct);
  }
  updateButtonStates();
}

function keyPressed() {
  if (key.length === 1 && key >= '1' && key <= '4') classify(int(key) - 1);
  else if (key === 'Enter') nextStatement();
}

function mousePressed() {
  if (!finished) return;
  for (const r of tileRects) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      // On a narrow screen, clicking the open tile again returns to the summary
      reviewPos = (canvasWidth < 560 && reviewPos === r.pos) ? -1 : r.pos;
    }
  }
}

function updateButtonStates() {
  for (const b of catButtons) {
    if (answered || finished) { b.attribute('disabled', ''); b.style('opacity', '0.55'); }
    else { b.removeAttribute('disabled'); b.style('opacity', '1'); }
  }
  if (answered && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < order.length - 1 ? 'Next statement' : 'See result');
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
  text('Source, Myth, or Contested?', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  const nDone = Object.keys(results).length;
  text('Correct: ' + score + ' of ' + nDone, canvasWidth - margin, 14);

  const defsBottom = drawDefinitions(44);
  const tilesY = drawHeight - 38;
  drawPanel(margin, defsBottom + 10, canvasWidth - 2 * margin, tilesY - defsBottom - 20);
  drawTiles(tilesY);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = canvasWidth < 560 ? 'Click a tile to review.' : 'Done. Try Again reshuffles the same ten statements.';
  else if (answered) status = 'Press ' + (current < order.length - 1 ? 'Next statement' : 'See result') + ' to continue.';
  else status = 'Choose a kind of statement (or press 1 to 4).';
  text(fitText(status, canvasWidth - margin - 240), margin + 230, drawHeight + 60);
}

// The four definition boxes; returns the y of their bottom edge
function drawDefinitions(top) {
  const cols = canvasWidth < 560 ? 2 : 4;
  const rows = CATS.length / cols;
  const gap = 6;
  const boxW = (canvasWidth - 2 * margin - (cols - 1) * gap) / cols;
  textSize(12);
  const defLines = CATS.map(c => wrapLines(c.def, boxW - 12));
  const maxLines = Math.max(...defLines.map(d => d.length));
  const headH = 22, lineH = 14;
  const boxH = headH + 5 + maxLines * lineH + 6;

  let si = -1;
  if (answered && !finished) si = order[current];

  for (let i = 0; i < CATS.length; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    const x = margin + col * (boxW + gap);
    const y = top + row * (boxH + gap);
    stroke('silver');
    strokeWeight(1);
    fill('white');
    rect(x, y, boxW, boxH, 6);
    noStroke();
    fill(CATS[i].color);
    rect(x, y, boxW, headH, 6, 6, 0, 0);
    fill('white');
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(14);
    text((i + 1) + '  ' + CATS[i].name, x + 6, y + headH / 2 + 1);
    textStyle(NORMAL);
    textSize(12);
    fill('black');
    textAlign(LEFT, TOP);
    for (let j = 0; j < defLines[i].length; j++) text(defLines[i][j], x + 6, y + headH + 5 + j * lineH);

    if (si >= 0) {
      const isRight = (i === STATEMENTS[si].cat);
      const isWrongChoice = (i === chosen && !isRight);
      if (isRight || isWrongChoice) {
        noFill();
        strokeWeight(3);
        stroke(isRight ? 'seagreen' : 'firebrick');
        rect(x + 1.5, y + 1.5, boxW - 3, boxH - 3, 6);
        strokeWeight(1);
        noStroke();
      }
    }
  }
  return top + rows * boxH + (rows - 1) * gap;
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
    // On a narrow screen the review replaces the summary; the score stays top right.
    if (canvasWidth < 560 && reviewPos >= 0) {
      drawStatementDetails(reviewPos, x + pad, yy, tw, true);
      return;
    }
    textStyle(BOLD);
    textSize(18);
    fill('black');
    yy = drawWrapped('You scored ' + score + ' of ' + STATEMENTS.length + ' on the first attempt.', x + pad, yy, tw, 22);
    const pass = score >= MASTERY;
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(15);
    yy = drawWrapped(pass ? 'You can tell a source from a story. That skill works at every stop on this trip.'
                          : 'Try the set again; watch for who wrote each statement and when.', x + pad, yy + 2, tw, 19);
    textStyle(NORMAL);
    const missed = order.map((si, p) => ({ si, p })).filter(o => !results[o.si].correct).map(o => o.p + 1);
    fill('dimgray');
    textStyle(ITALIC);
    textSize(13);
    const hint = missed.length
      ? 'Missed: ' + missed.join(', ') + '. Click any numbered tile below to review it.'
      : 'No misses. Click any numbered tile below to review a statement.';
    yy = drawWrapped(hint, x + pad, yy + 4, tw, 17);
    textStyle(NORMAL);
    if (reviewPos >= 0 && canvasWidth >= 560) {
      stroke('gainsboro');
      line(x + pad, yy + 5, x + w - pad, yy + 5);
      noStroke();
      drawStatementDetails(reviewPos, x + pad, yy + 11, tw, true);
    }
    return;
  }
  drawStatementDetails(current, x + pad, yy, tw, false);
}

function drawStatementDetails(pos, x, y, tw, review) {
  const si = order[pos];
  const s = STATEMENTS[si];
  let yy = y;
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text((review ? 'REVIEW: STATEMENT ' : 'STATEMENT ') + (pos + 1) + ' OF ' + STATEMENTS.length, x, yy);
  yy += 18;
  fill('black');
  const narrow = canvasWidth < 560;
  textSize(review || narrow ? 15 : 18);
  textStyle(review ? BOLD : NORMAL);
  yy = drawWrapped(s.text, x, yy, tw, review || narrow ? 19 : 23) + 6;
  textStyle(NORMAL);

  if (!review && !answered) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(16);
    text('What kind of statement is this?', x, yy);
    textStyle(NORMAL);
    return;
  }
  const r = results[si];
  const C = CATS[s.cat];
  let head = r.correct ? 'Correct: ' + C.name.toLowerCase() + '.' : 'Not quite: this is ' + C.name.toLowerCase() + '.';
  if (review && !r.correct) head += ' (You chose ' + CATS[r.chosen].name.toLowerCase() + '.)';
  textSize(narrow ? 14 : 15);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  yy = drawWrapped(head, x, yy, tw, narrow ? 17 : 19);
  textStyle(NORMAL);
  fill('black');
  drawWrapped(s.why, x, yy + 1, tw, narrow ? 17 : 19);
}

// Ten numbered tiles, one per statement in the order shown
function drawTiles(y) {
  tileRects = [];
  const n = STATEMENTS.length;
  const labelW = canvasWidth < 560 ? 0 : 76;
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(13);
  if (labelW) text('Statements', margin, y + 14);
  const gap = 5;
  const tw = Math.min(40, (canvasWidth - 2 * margin - labelW - (n - 1) * gap) / n);
  for (let p = 0; p < n; p++) {
    const tx = margin + labelW + p * (tw + gap);
    const si = order[p];
    const r = results[si];
    let fc = 'white', sc = 'silver';
    if (r) { fc = r.correct ? 'honeydew' : 'mistyrose'; sc = r.correct ? 'seagreen' : 'firebrick'; }
    const isCur = (!finished && p === current) || (finished && p === reviewPos);
    stroke(isCur ? 'black' : sc);
    strokeWeight(isCur ? 3 : 2);
    fill(fc);
    rect(tx, y, tw, 28, 5);
    noStroke();
    fill(r ? (r.correct ? 'darkgreen' : 'firebrick') : 'dimgray');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(14);
    text(p + 1, tx + tw / 2, y + 14);
    textStyle(NORMAL);
    tileRects.push({ pos: p, x: tx, y: y, w: tw, h: 28 });
  }
  strokeWeight(1);
  if (finished) {
    let over = false;
    for (const r of tileRects) {
      if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) over = true;
    }
    cursor(over ? HAND : ARROW);
  } else {
    cursor(ARROW);
  }
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
