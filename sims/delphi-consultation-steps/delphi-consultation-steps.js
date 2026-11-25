// A Day at the Oracle - p5.js 2.x
// CANVAS_HEIGHT: 590
// Eight steps of a Delphic consultation, shown shuffled. The learner clicks
// the cards into an eight-slot sequence and presses Check; each broken
// ordering rule is named. After a valid order (or after the second invalid
// Check, when the chapter's order is shown) the learner walks through the
// consultation one step at a time. At steps 4, 6 and 8 a checkpoint asks the
// learner to predict an outcome before it is revealed.
// Mastery: a valid order within two Checks and at least 2 of 3 checkpoints.

let canvasWidth = 700;
let drawHeight = 540;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

// n: the order the chapter gives (hidden until the order is checked)
const STEPS = [
  { n: 1, title: 'Arrive on a consultation day',
    text: 'Arrive at Delphi on a consultation day, usually said to be the seventh of the month, in one of the nine months when Apollo was present.',
    src: 'Plutarch, Greek Questions 9: at first the god answered only on the seventh of Bysios, his birthday.' },
  { n: 2, title: 'Purify at the Castalian Spring',
    text: 'Purify yourself with water from the Castalian Spring.',
    src: 'Euripides, Ion: the temple servants bathe in Castalia’s water before the day’s work.' },
  { n: 3, title: 'Pay the fee (pelanos)',
    text: 'Pay the fee (pelanos); a foreigner presents himself through a Delphian sponsor (proxenos).',
    src: 'Euripides, Ion, and Delphic inscriptions such as the agreement with Phaselis, which sets the fees.' },
  { n: 4, title: 'Sprinkle the goat with water',
    text: 'The priests sprinkle a goat with cold water to test whether the god is present.',
    src: 'Plutarch, On the Obsolescence of Oracles: the goat must tremble through its whole body.' },
  { n: 5, title: 'Sacrifice the goat',
    text: 'The goat is sacrificed on the great altar before the temple’s east front; the day’s consultations can begin.',
    src: 'Plutarch; the great altar, a gift of the island of Chios, still stands before the east front.' },
  { n: 6, title: 'Wait for your turn',
    text: 'Wait for your turn: those with promanteia first, the rest by lot.',
    src: 'Herodotus 1.54 (promanteia for the Lydians); Aeschylus, Eumenides: Greeks come in “by lot, as is the custom.”' },
  { n: 7, title: 'Enter the temple and ask',
    text: 'Enter the temple, make an offering at the inner hearth, and put your question; the Pythia answers from the tripod in the adyton.',
    src: 'Plutarch; an Athenian cup of about 440 BCE, now in Berlin, shows a seated woman on the tripod.' },
  { n: 8, title: 'Carry the answer home',
    text: 'Receive the answer from the prophet, write it down, and carry it home.',
    src: 'Herodotus 7.142: the Athenian envoys wrote down the “wooden wall” answer and took it to Athens.' }
];

// Checkpoints stop the walk at these steps (1-based).
const CHECKPOINTS = [
  { at: 4, label: 'A',
    q: 'The goat is sprinkled with cold water and does not tremble. What happens?',
    choices: ['The consultation goes ahead with a smaller fee', 'There is no consultation',
              'The Pythia decides for herself', 'A second goat is bought and the line goes on'],
    correct: 1,
    fb: 'A goat that did not tremble meant the god was absent. Plutarch tells of priests who pressed on after poor omens; the Pythia answered in a strange voice, rushed out screaming, and died days later.' },
  { at: 6, label: 'B',
    q: 'On the same morning, a Lydian envoy of King Croesus and a farmer from Attica are both waiting. Who goes in first?',
    choices: ['The farmer, because he arrived first', 'The Lydian, because Lydians held promanteia',
              'Whoever pays the larger fee', 'They draw lots'],
    correct: 1,
    fb: 'Herodotus says the Delphians gave Croesus and all Lydians the right to consult first and freedom from fees. The farmer waits for the lot.' },
  { at: 8, label: 'C',
    q: 'It is about 100 CE, in Plutarch’s time. In what form will the answer most likely come?',
    choices: ['Hexameter verse', 'Plain prose', 'A written riddle in a sealed tablet', 'A nod with no words'],
    correct: 1,
    fb: 'By Plutarch’s day the answers were given in prose, and he wrote a dialogue defending the change.' }
];

const QUESTION = 'You have walked a week to ask Apollo one question. What must happen before you hear his answer?';
const NOTE = 'No ancient writer lists every step; this order is a reconstruction.';

// Ordering rules: [test(pos), message]. pos[n] = slot index of step n.
const RULES = [
  [p => p[1] === 0, 'Arriving comes first: nothing happens until a consultation day.'],
  [p => p[8] === 7, 'Carrying the answer home comes last.'],
  [p => p[2] < p[4] && p[3] < p[4], 'Purification and the fee come before the goat test.'],
  [p => p[4] < p[5], 'The goat is tested before it is sacrificed.'],
  [p => p[5] < p[6], 'The line forms only after the sacrifice shows the god is present.'],
  [p => p[6] < p[7], 'Everyone waits for a turn before entering the temple.']
];

// ---------- State ----------
let phase = 'order';     // 'order' | 'walk' | 'summary'
let pool = [];           // shuffled step numbers (display order of the pool)
let slots = [];          // 8 entries: step number or 0
let checks = 0;
let validOn = 0;         // Check number on which the order was valid (0 = shown after two)
let checkMsg = null;     // { ok, lines, shown }
let marks = null;        // per-slot true/false after a Check
let focusN = 0;          // card whose text is shown in the panel
let walkIdx = 0;         // 0..7
let cpAnswers = {};      // label -> chosen index
let cardRects = [];      // { kind: 'pool'|'slot', n, i, x, y, w, h }
let choiceKey = '';

// ---------- Controls ----------
let checkButton, clearButton, nextButton, againButton;
let choiceButtons = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  checkButton = createButton('Check order');
  checkButton.parent(document.querySelector('main'));
  checkButton.mousePressed(checkOrder);

  clearButton = createButton('Clear');
  clearButton.parent(document.querySelector('main'));
  clearButton.mousePressed(clearSlots);

  nextButton = createButton('Next step');
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(nextStep);

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.mousePressed(startOver);

  for (const b of [checkButton, clearButton, nextButton, againButton]) b.style('font-size', '14px');

  for (let i = 0; i < 4; i++) {
    const b = createButton('');
    b.parent(document.querySelector('main'));
    b.style('font-size', '13px');
    b.style('text-align', 'left');
    b.style('padding', '2px 8px');
    b.style('line-height', '1.15');
    b.style('background-color', 'white');
    b.style('border', '1px solid #8a6a10');
    b.style('border-radius', '5px');
    b.style('cursor', 'pointer');
    b.mousePressed(() => answerCheckpoint(i));
    choiceButtons.push(b);
  }

  positionControls();
  startOver();

  describe('An ordering and prediction activity on how a consultation at the Oracle of Delphi worked. Eight shuffled step ' +
           'cards are clicked into an eight-slot sequence and checked against ordering rules. After a valid order, the ' +
           'learner walks through the consultation one step at a time; at steps 4, 6 and 8 a checkpoint asks what happens ' +
           'when the goat does not tremble, who consults first, and in what form the answer comes in Plutarch’s day.');
}

function positionControls() {
  const y = drawHeight + 10;
  let x = margin;
  for (const b of [checkButton, clearButton, nextButton, againButton]) {
    if (b.elt.style.display === 'none') continue;
    b.position(x, y);
    x += (b.elt.offsetWidth || 90) + 10;
  }
  statusX = x + 8;
  choiceKey = '';
}
let statusX = 300;

function shuffled() {
  let a;
  do {
    a = [1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (a[0] === 1 && a[1] === 2);
  return a;
}

function startOver() {
  phase = 'order';
  pool = shuffled();
  slots = [0, 0, 0, 0, 0, 0, 0, 0];
  checks = 0;
  validOn = 0;
  checkMsg = null;
  marks = null;
  focusN = 0;
  walkIdx = 0;
  cpAnswers = {};
  updateControls();
}

function clearSlots() {
  if (phase !== 'order') return;
  slots = [0, 0, 0, 0, 0, 0, 0, 0];
  marks = null;
  checkMsg = null;
  updateControls();
}

function placed(n) { return slots.indexOf(n) >= 0; }
function full() { return slots.every(s => s > 0); }

function clickCard(r) {
  if (phase !== 'order') return;
  focusN = r.n;
  if (r.kind === 'view') return;
  marks = null;
  if (checkMsg && !checkMsg.ok) checkMsg = null;
  if (r.kind === 'pool') {
    if (placed(r.n)) return;
    const k = slots.indexOf(0);
    if (k >= 0) slots[k] = r.n;
  } else {
    slots[r.i] = 0;
  }
  updateControls();
}

function checkOrder() {
  if (phase !== 'order' || !full()) return;
  checks++;
  const pos = {};
  slots.forEach((n, i) => { pos[n] = i; });
  const broken = RULES.filter(r => !r[0](pos)).map(r => r[1]);
  // A card is marked when its slot is one it can hold in a valid order.
  marks = slots.map((n, i) => (n === i + 1) || ((n === 2 || n === 3) && (i === 1 || i === 2)));
  if (broken.length === 0) {
    validOn = checks;
    checkMsg = { ok: true, lines: ['Valid: this is the order the chapter reconstructs. Steps 2 and 3 could come in either order.'] };
  } else if (checks >= 2) {
    checkMsg = { ok: false, shown: true, lines: broken };
    slots = [1, 2, 3, 4, 5, 6, 7, 8];
    marks = null;
  } else {
    checkMsg = { ok: false, lines: broken };
  }
  updateControls();
}

function nextStep() {
  if (phase === 'order') {
    if (!checkMsg || !(checkMsg.ok || checkMsg.shown)) return;
    phase = 'walk';
    walkIdx = 0;
    marks = null;
  } else if (phase === 'walk') {
    const cp = cpAt(walkIdx);
    if (cp && !(cp.label in cpAnswers)) return;
    if (walkIdx < 7) walkIdx++;
    else phase = 'summary';
  }
  updateControls();
}

function cpAt(idx) { return CHECKPOINTS.find(c => c.at === idx + 1); }

function answerCheckpoint(i) {
  if (phase !== 'walk') return;
  const cp = cpAt(walkIdx);
  if (!cp || cp.label in cpAnswers) return;
  cpAnswers[cp.label] = i;
  updateControls();
}

function cpScore() { return CHECKPOINTS.filter(c => cpAnswers[c.label] === c.correct).length; }

function updateControls() {
  const ord = phase === 'order';
  const canGo = ord ? !!(checkMsg && (checkMsg.ok || checkMsg.shown)) : phase === 'walk';
  if (ord && !canGo) { checkButton.show(); clearButton.show(); } else { checkButton.hide(); clearButton.hide(); }
  if (ord && !canGo) nextButton.hide(); else nextButton.show();
  if (ord) nextButton.html('Begin the walk');
  else if (phase === 'walk') nextButton.html(walkIdx < 7 ? 'Next step' : 'See the summary');
  else nextButton.html('Done');

  if (ord && full() && !canGo) checkButton.removeAttribute('disabled'); else checkButton.attribute('disabled', '');
  if (ord && slots.some(s => s > 0) && !canGo) clearButton.removeAttribute('disabled'); else clearButton.attribute('disabled', '');

  const cp = phase === 'walk' ? cpAt(walkIdx) : null;
  const waiting = cp && !(cp.label in cpAnswers);
  if (phase === 'summary' || waiting) nextButton.attribute('disabled', ''); else nextButton.removeAttribute('disabled');

  for (let i = 0; i < 4; i++) {
    if (waiting) { choiceButtons[i].html((i + 1) + '. ' + cp.choices[i]); choiceButtons[i].show(); }
    else choiceButtons[i].hide();
  }
  positionControls();
}

function keyPressed() {
  if (['1', '2', '3', '4'].includes(key)) answerCheckpoint(Number(key) - 1);
  else if (key === 'Enter') {
    if (phase === 'order' && !(checkMsg && (checkMsg.ok || checkMsg.shown))) checkOrder();
    else nextStep();
  }
}

function mousePressed() {
  for (const r of cardRects) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      clickCard(r);
      return;
    }
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
  ROW_H = narrow ? 30 : 34;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow ? 18 : 22);
  text('A Day at the Oracle', margin, 10);
  textStyle(NORMAL);
  textSize(14);
  textAlign(RIGHT, TOP);
  fill('#4a3b10');
  let tag = phase === 'order' ? 'Checks used: ' + checks + ' of 2' : 'Checkpoints correct: ' + cpScore() + ' of 3';
  text(tag, canvasWidth - margin, 15);

  fill('#333');
  textStyle(ITALIC);
  textSize(narrow ? 14 : 15);
  textAlign(LEFT, TOP);
  const qBottom = drawWrapped(QUESTION, margin, 40, canvasWidth - 2 * margin, 19);
  textStyle(NORMAL);

  const top = Math.max(84, qBottom + 8);
  cardRects = [];
  const colGap = 12;
  const leftW = phase === 'order' ? (canvasWidth - 2 * margin - colGap) / 2 : Math.min(300, (canvasWidth - 2 * margin - colGap) * 0.44);
  const rightX = margin + leftW + colGap;
  const rightW = canvasWidth - margin - rightX;
  const listBottom = drawSequence(margin, top, leftW);

  if (phase === 'order') {
    drawPool(rightX, top, rightW);
    drawOrderPanel(margin, listBottom + 8, canvasWidth - 2 * margin, drawHeight - 30 - listBottom - 8);
  } else {
    drawWalkPanel(rightX, top, rightW, drawHeight - 30 - top);
    drawScoreBox(margin, listBottom + 8, leftW, drawHeight - 30 - listBottom - 8);
  }

  noStroke();
  fill('#4a5a66');
  textStyle(ITALIC);
  textSize(12);
  textAlign(LEFT, CENTER);
  text(fitText(NOTE, canvasWidth - 2 * margin), margin, drawHeight - 15);
  textStyle(NORMAL);

  // status text in the control row
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(13);
  let status;
  if (phase === 'order') {
    if (checkMsg && (checkMsg.ok || checkMsg.shown)) status = 'Press Begin the walk (or Enter).';
    else if (full()) status = 'Press Check order (or Enter).';
    else status = 'Click a card to put it in the next empty slot; click a placed card to take it back.';
  } else if (phase === 'walk') {
    const cp = cpAt(walkIdx);
    status = (cp && !(cp.label in cpAnswers)) ? 'Checkpoint ' + cp.label + ': choose an answer (keys 1 to 4).'
                                               : 'Step ' + (walkIdx + 1) + ' of 8. Press ' + (walkIdx < 7 ? 'Next step' : 'See the summary') + ' (or Enter).';
  } else status = 'Try Again reshuffles the cards.';
  text(fitText(status, canvasWidth - margin - statusX), statusX, drawHeight + 25);

  // hover cursor
  let over = false;
  for (const r of cardRects) if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) over = true;
  cursor(over ? HAND : ARROW);
}

let ROW_H = 34;
const ROW_GAP = 5;

function hoverCard() {
  for (const r of cardRects) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) return r.n;
  }
  return 0;
}

// Left column: the eight slots (ordering) or the consultation in order (walk).
function drawSequence(x, top, w) {
  noStroke();
  fill('#4a3b10');
  textStyle(BOLD);
  textSize(13);
  textAlign(LEFT, TOP);
  text(phase === 'order' ? 'YOUR ORDER' : 'THE CONSULTATION', x, top);
  textStyle(NORMAL);
  let y = top + 20;
  for (let i = 0; i < 8; i++) {
    const n = slots[i];
    const ry = y + i * (ROW_H + ROW_GAP);
    // slot number
    const isCur = phase === 'walk' && i === walkIdx;
    const done = phase === 'summary' || (phase === 'walk' && i < walkIdx);
    noStroke();
    fill(isCur ? '#f2b632' : '#dfe6ea');
    circle(x + 12, ry + ROW_H / 2, 22);
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(13);
    textStyle(BOLD);
    text(i + 1, x + 12, ry + ROW_H / 2 + 1);
    textStyle(NORMAL);
    const cx = x + 28, cw = w - 28;
    if (!n) {
      stroke('#a9b6bf');
      strokeWeight(1);
      drawingContext.setLineDash([4, 4]);
      noFill();
      rect(cx, ry, cw, ROW_H, 5);
      drawingContext.setLineDash([]);
      continue;
    }
    let border = '#8a6a10', bg = 'white', sw = 1;
    if (marks) { border = marks[i] ? 'seagreen' : 'firebrick'; sw = 2; bg = marks[i] ? '#eaf5ee' : '#fbeaea'; }
    if (phase !== 'order') { border = isCur ? '#c8963e' : '#c5ced4'; bg = isCur ? '#fff4d6' : (done ? 'white' : '#f4f6f7'); sw = isCur ? 2 : 1; }
    const cpHere = phase !== 'order' ? cpAt(i) : null;
    stroke(border);
    strokeWeight(sw);
    if (marks && !marks[i]) drawingContext.setLineDash([5, 3]);
    fill(bg);
    rect(cx, ry, cw, ROW_H, 5);
    drawingContext.setLineDash([]);
    noStroke();
    fill(phase !== 'order' && !done && !isCur ? '#6b7780' : 'black');
    textAlign(LEFT, CENTER);
    textSize(canvasWidth < 560 ? 13 : 14);
    const revealNum = phase !== 'order' || (checkMsg && (checkMsg.ok || checkMsg.shown));
    let lab = STEPS[n - 1].title;
    const badgeW = cpHere ? 26 : 0;
    text(fitText(lab, cw - 14 - badgeW), cx + 8, ry + ROW_H / 2 + 1);
    if (marks) {
      fill(marks[i] ? 'seagreen' : 'firebrick');
      textAlign(RIGHT, CENTER);
      textStyle(BOLD);
      text(marks[i] ? '✓' : '✗', cx + cw - 8, ry + ROW_H / 2 + 1);
      textStyle(NORMAL);
    }
    if (cpHere) {
      const got = cpAnswers[cpHere.label];
      fill(got === undefined ? '#8a6a10' : (got === cpHere.correct ? 'seagreen' : 'firebrick'));
      rect(cx + cw - 26, ry + 7, 20, 20, 4);
      fill('white');
      textAlign(CENTER, CENTER);
      textSize(12);
      textStyle(BOLD);
      text(cpHere.label, cx + cw - 16, ry + ROW_H / 2 + 1);
      textStyle(NORMAL);
    }
    if (phase === 'order' && !revealNum) cardRects.push({ kind: 'slot', n: n, i: i, x: cx, y: ry, w: cw, h: ROW_H });
    else if (phase === 'order') cardRects.push({ kind: 'view', n: n, i: i, x: cx, y: ry, w: cw, h: ROW_H });
  }
  return y + 8 * (ROW_H + ROW_GAP) - ROW_GAP;
}

function drawPool(x, top, w) {
  noStroke();
  fill('#4a3b10');
  textStyle(BOLD);
  textSize(13);
  textAlign(LEFT, TOP);
  text('CARDS, SHUFFLED', x, top);
  textStyle(NORMAL);
  const y = top + 20;
  const locked = checkMsg && (checkMsg.ok || checkMsg.shown);
  for (let i = 0; i < pool.length; i++) {
    const n = pool[i];
    const ry = y + i * (ROW_H + ROW_GAP);
    const used = placed(n);
    stroke(used ? '#d3dade' : '#8a6a10');
    strokeWeight(1);
    fill(used ? '#eef1f3' : 'white');
    rect(x, ry, w, ROW_H, 5);
    noStroke();
    fill(used ? '#9aa5ad' : 'black');
    textAlign(LEFT, CENTER);
    textSize(canvasWidth < 560 ? 13 : 14);
    const label = locked ? STEPS[n - 1].title + '  (step ' + n + ')' : STEPS[n - 1].title;
    text(fitText(label, w - 16), x + 8, ry + ROW_H / 2 + 1);
    if (!used && !locked) cardRects.push({ kind: 'pool', n: n, i: i, x: x, y: ry, w: w, h: ROW_H });
  }
}

function drawOrderPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const pad = 12, tw = w - 2 * pad;
  let yy = y + 9;
  const hn = hoverCard() || focusN;
  if (checkMsg && !hoverCard()) {
    textStyle(BOLD);
    textSize(15);
    if (checkMsg.ok) {
      fill('darkgreen');
      yy = drawWrapped(checkMsg.lines[0], x + pad, yy, tw, 19);
      textStyle(NORMAL);
      fill('#333');
      textSize(14);
      drawWrapped('Press Begin the walk to follow a consultant through the day. Three checkpoints will ask you to predict what happens.', x + pad, yy + 4, tw, 18);
    } else {
      fill('firebrick');
      yy = drawWrapped(checkMsg.shown ? 'Still not valid after two Checks:' : 'Not yet valid. Check ' + checks + ' of 2:', x + pad, yy, tw, 19);
      textStyle(NORMAL);
      fill('black');
      textSize(canvasWidth < 560 ? 13 : 14);
      yy = drawWrapped(checkMsg.lines.join(' '), x + pad, yy + 2, tw, canvasWidth < 560 ? 17 : 18);
      if (checkMsg.shown && canvasWidth >= 560) {
        fill('#333');
        drawWrapped('The slots now show the chapter’s order, steps 1 to 8. Press Begin the walk.', x + pad, yy + 4, tw, 18);
      }
    }
    return;
  }
  if (hn) {
    const s = STEPS[hn - 1];
    fill('dimgray');
    textSize(12);
    textStyle(BOLD);
    text(s.title.toUpperCase(), x + pad, yy);
    textStyle(NORMAL);
    fill('black');
    textSize(15);
    drawWrapped(s.text, x + pad, yy + 18, tw, 19);
    return;
  }
  fill('#333');
  textSize(14);
  drawWrapped('Click the eight cards on the right into the slots on the left, in the order a consultation happened. ' +
              'Hover over a card to read it in full. When all eight are placed, press Check order. You have two Checks.',
              x + pad, yy, tw, 19);
}

function drawWalkPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const pad = 12, tw = w - 2 * pad;
  let yy = y + 10;

  if (phase === 'summary') {
    const score = cpScore();
    const pass = validOn > 0 && score >= 2;
    fill('black');
    textStyle(BOLD);
    textSize(17);
    yy = drawWrapped('Summary', x + pad, yy, tw, 22) + 4;
    textSize(15);
    yy = drawWrapped(validOn ? 'Order valid on Check number ' + validOn + '.' : 'Order shown after two Checks.', x + pad, yy, tw, 20);
    yy = drawWrapped('Checkpoints correct: ' + score + ' of 3.', x + pad, yy, tw, 20) + 6;
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(14);
    yy = drawWrapped(pass ? 'You can explain how a consultation worked, gate by gate.'
                          : 'Walk it again: watch for the gates that decide whether a consultant reaches the god at all.',
                     x + pad, yy, tw, 18) + 8;
    textStyle(NORMAL);
    fill('#333');
    yy = drawWrapped('The day had gates. The calendar decided when anyone could ask; the goat decided whether the god was present at all; ' +
                     'the line, with promanteia for favored cities and the lot for everyone else, decided who was heard before the day ran out. ' +
                     'A consultant could walk a week and pass none of them.', x + pad, yy, tw, 18) + 8;
    fill('dimgray');
    textSize(13);
    drawWrapped('The order is pieced together from Plutarch, Herodotus, Euripides, Aeschylus, inscriptions and the plan of the temple.', x + pad, yy, tw, 17);
    return;
  }

  const n = slots[walkIdx];
  const s = STEPS[n - 1];
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text('STEP ' + (walkIdx + 1) + ' OF 8', x + pad, yy);
  yy += 17;
  fill('black');
  textSize(15);
  yy = drawWrapped(s.text, x + pad, yy, tw, 19) + 3;
  textStyle(NORMAL);
  fill('#4a5a66');
  textStyle(ITALIC);
  textSize(13);
  yy = drawWrapped(s.src, x + pad, yy, tw, 17) + 8;
  textStyle(NORMAL);

  const cp = cpAt(walkIdx);
  if (!cp) return;
  stroke('#e0d3b0');
  line(x + pad, yy, x + w - pad, yy);
  noStroke();
  yy += 7;
  fill('#8a6a10');
  textStyle(BOLD);
  textSize(13);
  text('CHECKPOINT ' + cp.label, x + pad, yy);
  yy += 17;
  fill('black');
  textSize(14);
  yy = drawWrapped(cp.q, x + pad, yy, tw, 18) + 6;
  textStyle(NORMAL);

  const got = cpAnswers[cp.label];
  if (got === undefined) {
    // place the choice buttons
    const bw = tw;
    const key = [x, yy, bw].map(Math.round).join(',');
    if (key !== choiceKey) {
      for (let i = 0; i < 4; i++) {
        choiceButtons[i].position(x + pad, yy + i * 38);
        choiceButtons[i].size(bw, 33);
      }
      choiceKey = key;
    }
    return;
  }
  const ok = got === cp.correct;
  textSize(14);
  fill(ok ? 'darkgreen' : 'firebrick');
  textStyle(BOLD);
  yy = drawWrapped(ok ? 'Correct.' : 'Not quite. You chose: ' + cp.choices[got] + '.', x + pad, yy, tw, 18);
  fill('black');
  yy = drawWrapped('Answer: ' + cp.choices[cp.correct] + '.', x + pad, yy, tw, 18) + 2;
  textStyle(NORMAL);
  fill('#333');
  drawWrapped(cp.fb, x + pad, yy, tw, 18);
}

function drawScoreBox(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  let yy = y + 9;
  yy = drawWrapped(validOn ? 'Order valid on Check ' + validOn + '.' : 'Order shown after two Checks.', x + 10, yy, w - 20, 18);
  yy = drawWrapped((w < 220 ? 'Checkpoints: ' : 'Checkpoints correct: ') + cpScore() + ' of 3', x + 10, yy, w - 20, 18);
  if (w < 220) return;
  fill('dimgray');
  textSize(12);
  drawWrapped('Lettered badges mark the checkpoints.', x + 10, yy + 2, w - 20, 16);
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
