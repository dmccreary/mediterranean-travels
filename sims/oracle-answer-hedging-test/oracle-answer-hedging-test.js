// Can This Answer Lose? - p5.js 2.x
// CANVAS_HEIGHT: 534
// Eight answers, ancient and modern, shown one at a time in a fixed order.
// For each, the learner first commits to one of three categories (could be
// proven wrong / comes true either way / not a prediction), then presses
// Test both outcomes to see whether the answer comes true under each of two
// possible outcomes, with the reason. One scored attempt per card.
// Mastery: 6 of 8 on the first attempt, with cards 1 (Croesus) and 4
// (Chaerephon) both correct.

let canvasWidth = 700;
let drawHeight = 450;
let controlHeight = 84;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const CATS = [
  { name: 'Could be proven wrong', short: 'Could lose', verdict: 'This one could be proven wrong:', color: '#1b6e52', tint: '#e2f1ea',
    def: 'At least one possible outcome would show the answer to be false.' },
  { name: 'Comes true either way', short: 'Either way', verdict: 'This one comes true either way:', color: '#b35806', tint: '#fbeadb',
    def: 'Every possible outcome can be read as fulfilling it.' },
  { name: 'Not a prediction', short: 'Command', verdict: 'This one is not a prediction:', color: '#5e4fa2', tint: '#ebe8f5',
    def: 'It tells someone what to do and says nothing about what will happen.' }
];

// ans: index into CATS. a/b: outcomes; ta/tb: 'True', 'False' or 'Not applicable'
const CARDS = [
  { src: 'To Croesus, about 550 BCE · Herodotus 1.53', ans: 1,
    text: '“If you make war on the Persians, you will destroy a great empire.”',
    a: 'Lydia wins', ta: 'True', b: 'Persia wins', tb: 'True',
    why: 'It never says whose empire, so either victory fulfills it.' },
  { src: 'To the Athenians, 481 or 480 BCE · Herodotus 7.141', ans: 1,
    text: '“Divine Salamis, you will destroy the children of women.”',
    a: 'The Greeks win at Salamis', ta: 'True', b: 'The Persians win at Salamis', tb: 'True',
    why: 'It names no side, so either fleet’s dead fulfill it; Themistocles had to argue over the word “divine.”' },
  { src: 'Said to be given to Pyrrhus, about 280 BCE · a Latin line quoted by Cicero', ans: 1,
    text: '“I say that you, son of Aeacus, the Romans can defeat.” (Aio te, Aeacida, Romanos vincere posse.)',
    a: 'Pyrrhus defeats Rome', ta: 'True', b: 'Rome defeats Pyrrhus', tb: 'True',
    why: 'The Latin grammar allows both meanings; Cicero noted that Apollo never spoke Latin and the line comes from the poet Ennius.' },
  { src: 'To Chaerephon, before 399 BCE · Plato, Apology', ans: 0,
    text: '“No one is wiser than Socrates.”',
    a: 'Someone wiser than Socrates is found', ta: 'False', b: 'No one wiser is found', tb: 'True',
    why: 'One outcome would make it false, and Socrates spent his life looking for it.' },
  { src: 'To the king of Thera, about 630 BCE · Herodotus 4.150', ans: 2,
    text: '“Found a city in Libya.”',
    a: 'The Therans found Cyrene', ta: 'Not applicable', b: 'The Therans stay home', tb: 'Not applicable',
    why: 'It is a command; it says what to do, not what will happen.' },
  { src: 'To Xenophon, about 401 BCE · Xenophon, Anabasis 3.1', ans: 2,
    text: 'The names of the gods to whom he should sacrifice for a safe journey.',
    a: 'The journey goes well', ta: 'Not applicable', b: 'The journey goes badly', tb: 'Not applicable',
    why: 'It answers “to whom should I pray?”, the question Xenophon asked, not “should I go?”' },
  { src: 'To Laius · Sophocles, Oedipus the King', ans: 0,
    text: '“Your son will kill you.”',
    a: 'Laius dies at his son’s hand', ta: 'True', b: 'Laius dies some other way', tb: 'False',
    why: 'It names one outcome and could fail; in the play it comes true because every attempt to escape it leads to it.' },
  { src: 'A weather forecast tonight', ans: 0,
    text: '“It will rain at Delphi between noon and 3 PM tomorrow.”',
    a: 'It rains between noon and 3 PM', ta: 'True', b: 'It stays dry between noon and 3 PM', tb: 'False',
    why: 'A dry afternoon would prove it wrong, which is what makes it a real prediction.' }
];
const MASTERY = 6;
const KEY_CARDS = [0, 3];   // cards 1 and 4
const QUESTION = 'Could anything that happens prove this answer wrong?';

// ---------- State ----------
let current = 0;
let chosen = -1;        // this card's first attempt
let tested = false;
let finished = false;
let results = [];       // by card: { chosen, correct }
let reviewIdx = -1;
let chipRects = [];

// ---------- Controls ----------
let catButtons = [];
let testButton, nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < CATS.length; i++) {
    const b = createButton('');
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('padding', '4px 0px');
    b.style('cursor', 'pointer');
    b.style('color', 'white');
    b.style('background-color', CATS[i].color);
    b.style('border', '1px solid ' + CATS[i].color);
    b.style('border-radius', '4px');
    b.attribute('title', CATS[i].name + ' (key ' + (i + 1) + ')');
    b.mousePressed(() => classify(i));
    catButtons.push(b);
  }
  testButton = createButton('Test both outcomes');
  testButton.parent(document.querySelector('main'));
  testButton.style('font-size', '14px');
  testButton.mousePressed(testOutcomes);

  nextButton = createButton('Next card');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCard);

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(startSet);

  positionControls();
  startSet();

  describe('A classification activity on hedged oracle answers. Eight answers are shown one at a time, from the Croesus ' +
           'prophecy to a modern weather forecast. For each, the learner chooses whether it could be proven wrong, comes ' +
           'true either way, or is not a prediction at all, then tests the answer against two possible outcomes to see ' +
           'whether it comes true under each. A strip at the top places each answered card in its category.');
}

let statusX = 360;
function positionControls() {
  const gap = 8;
  const w = (canvasWidth - 2 * margin - 2 * gap) / 3;
  const narrow = canvasWidth < 560;
  for (let i = 0; i < catButtons.length; i++) {
    catButtons[i].html((i + 1) + '  ' + (narrow ? CATS[i].short : CATS[i].name));
    catButtons[i].position(margin + i * (w + gap), drawHeight + 8);
    catButtons[i].size(w, 32);
  }
  layoutRow2();
}

function layoutRow2() {
  let x = margin;
  for (const b of [testButton, nextButton, againButton]) {
    b.position(x, drawHeight + 50);
    x += (b.elt.offsetWidth || 100) + 10;
  }
  statusX = x + 6;
}

function startSet() {
  current = 0;
  chosen = -1;
  tested = false;
  finished = false;
  results = [];
  reviewIdx = -1;
  updateButtonStates();
}

function classify(k) {
  if (chosen >= 0 || finished) return;
  chosen = k;
  results[current] = { chosen: k, correct: k === CARDS[current].ans };
  updateButtonStates();
}

function testOutcomes() {
  if (chosen < 0 || tested || finished) return;
  tested = true;
  updateButtonStates();
}

function nextCard() {
  if (!tested || finished) return;
  if (current < CARDS.length - 1) {
    current++;
    chosen = -1;
    tested = false;
  } else {
    finished = true;
    reviewIdx = -1;
  }
  updateButtonStates();
}

function keyPressed() {
  if (key === '1' || key === '2' || key === '3') classify(Number(key) - 1);
  else if (key === 't' || key === 'T') testOutcomes();
  else if (key === 'Enter') { if (!tested) testOutcomes(); else nextCard(); }
}

function mousePressed() {
  if (!finished) return;
  for (const r of chipRects) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      reviewIdx = (reviewIdx === r.i) ? -1 : r.i;
      return;
    }
  }
}

function enable(b, on) {
  if (on) { b.removeAttribute('disabled'); b.style('opacity', '1'); b.style('cursor', 'pointer'); }
  else { b.attribute('disabled', ''); b.style('opacity', '0.5'); b.style('cursor', 'default'); }
}

function updateButtonStates() {
  for (const b of catButtons) enable(b, chosen < 0 && !finished);
  enable(testButton, chosen >= 0 && !tested && !finished);
  enable(nextButton, tested && !finished);
  nextButton.html(current < CARDS.length - 1 ? 'Next card' : 'See the totals');
  layoutRow2();
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
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow ? 18 : 22);
  text('Can This Answer Lose?', margin, 10);
  textStyle(NORMAL);
  textSize(14);
  textAlign(RIGHT, TOP);
  const score = results.filter(r => r && r.correct).length;
  const nDone = results.filter(r => r).length;
  if (!narrow) text('Correct on first attempt: ' + score + ' of ' + nDone, canvasWidth - margin, 15);

  const legendBottom = drawLegend(42);
  const stripBottom = drawStrip(legendBottom + 8);
  drawPanel(margin, stripBottom + 8, canvasWidth - 2 * margin, drawHeight - stripBottom - 16);

  // status text
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(13);
  let status;
  if (finished) status = 'Click a card on the strip to read it again.';
  else if (chosen < 0) status = 'Card ' + (current + 1) + ' of 8: choose a category (keys 1 to 3).';
  else if (!tested) status = 'Now test the answer against both outcomes (T or Enter).';
  else status = 'Press ' + (current < CARDS.length - 1 ? 'Next card' : 'See the totals') + ' (or Enter).';
  if (narrow && !finished) status = 'Card ' + (current + 1) + ' of 8 · Correct: ' + score + ' of ' + nDone;
  text(fitText(status, canvasWidth - margin - statusX), statusX, drawHeight + 64);
}

// The three categories with their definitions. Returns the bottom y.
function drawLegend(top) {
  const gap = 8;
  const w = (canvasWidth - 2 * margin - 2 * gap) / 3;
  const narrow = canvasWidth < 560;
  textSize(narrow ? 12 : 13);
  let maxLines = 0;
  if (!narrow) for (const c of CATS) maxLines = Math.max(maxLines, wrapLines(c.def, w - 16).length);
  const lh = 16;
  const h = narrow ? 28 : 26 + maxLines * lh + 6;
  for (let i = 0; i < CATS.length; i++) {
    const x = margin + i * (w + gap);
    noStroke();
    fill(CATS[i].tint);
    rect(x, top, w, h, 6);
    fill(CATS[i].color);
    rect(x, top, 6, h, 6, 0, 0, 6);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(narrow ? 13 : 14);
    text(fitText((i + 1) + '. ' + (narrow ? CATS[i].short : CATS[i].name), w - 18), x + 12, top + 6);
    textStyle(NORMAL);
    if (narrow) continue;
    fill('#222');
    textSize(13);
    drawWrapped(CATS[i].def, x + 12, top + 25, w - 18, lh);
  }
  return top + h;
}

// Eight slots; each answered card appears as a chip in its correct category's color.
function drawStrip(top) {
  const h = 44;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(margin, top, canvasWidth - 2 * margin, h, 8);
  const x0 = margin + 8, x1 = canvasWidth - margin - 8;
  const slotW = (x1 - x0) / CARDS.length;
  chipRects = [];
  for (let i = 0; i < CARDS.length; i++) {
    const cx = x0 + (i + 0.5) * slotW;
    const w = slotW - 8;
    const y = top + 6, ch = h - 12;
    const r = results[i];
    const isNow = (!finished && i === current) || i === reviewIdx;
    if (!r || (i === current && !tested && !finished)) {
      noStroke();
      fill(isNow ? '#fff1c9' : '#eef1f3');
      if (isNow) { stroke('#c8963e'); strokeWeight(2); }
      rect(cx - w / 2, y, w, ch, 5);
      noStroke();
      fill(isNow ? 'black' : '#6b7780');
      textAlign(CENTER, CENTER);
      textSize(13);
      textStyle(isNow ? BOLD : NORMAL);
      text(i + 1, cx, y + ch / 2 + 1);
      textStyle(NORMAL);
      continue;
    }
    const C = CATS[CARDS[i].ans];
    stroke(r.correct ? C.color : 'firebrick');
    strokeWeight(isNow ? 3 : 1.5);
    if (!r.correct) drawingContext.setLineDash([4, 3]);
    fill(C.tint);
    rect(cx - w / 2, y, w, ch, 5);
    drawingContext.setLineDash([]);
    noStroke();
    fill(C.color);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(13);
    const tag = (i + 1) + ' ' + C.short;
    textSize(12);
    const label = textWidth(tag) + 6 <= w ? tag : String(i + 1);
    text(label, cx, y + ch / 2 + 1);
    textStyle(NORMAL);
    chipRects.push({ i: i, x: cx - w / 2, y: y, w: w, h: ch });
  }
  let over = false;
  for (const r of chipRects) {
    if (finished && mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) over = true;
  }
  cursor(over ? HAND : ARROW);
  return top + h;
}

function drawPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const pad = 12;
  const tw = w - 2 * pad;
  const narrow = canvasWidth < 560;
  let yy = y + 10;

  if (finished && reviewIdx < 0) {
    const score = results.filter(r => r.correct).length;
    const pass = score >= MASTERY && KEY_CARDS.every(i => results[i].correct);
    fill('black');
    textStyle(BOLD);
    textSize(17);
    yy = drawWrapped('Correct on first attempt: ' + score + ' of 8.', x + pad, yy, tw, 22) + 4;
    textSize(15);
    fill(pass ? 'darkgreen' : 'firebrick');
    yy = drawWrapped(pass ? 'You can see through a hedge: an answer that cannot lose predicts nothing.'
                          : 'Look again at Croesus and Chaerephon: which one could have been proven wrong?',
                     x + pad, yy, tw, 20) + 8;
    textStyle(NORMAL);
    // totals by category
    const groups = [1, 0, 2];
    for (const c of groups) {
      const nums = CARDS.map((k, i) => k.ans === c ? i + 1 : 0).filter(n => n);
      fill(CATS[c].color);
      rect(x + pad, yy + 2, 12, 12, 3);
      fill('black');
      textSize(14);
      textStyle(BOLD);
      const head = CATS[c].name + ': ' + nums.length;
      text(head, x + pad + 20, yy);
      const hw = textWidth(head);
      textStyle(NORMAL);
      fill('#333');
      text(fitText('  (cards ' + nums.join(', ') + ')', tw - 20 - hw), x + pad + 20 + hw, yy);
      yy += 21;
    }
    yy += 6;
    fill('#333');
    textSize(14);
    yy = drawWrapped('Notice the three answers that “came true” most famously, Croesus, Salamis and Pyrrhus, are the three that could not lose. ' +
                     'The answers recorded closest to their time are mostly commands and approvals, like cards 5 and 6.',
                     x + pad, yy, tw, 19) + 6;
    fill('dimgray');
    textSize(13);
    drawWrapped('Card quotations are paraphrased translations. The Pyrrhus line comes from the poet Ennius, not from Delphi.', x + pad, yy, tw, 17);
    return;
  }

  const i = finished ? reviewIdx : current;
  const K = CARDS[i];
  const r = results[i];
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  yy = drawWrapped((finished ? 'REVIEW · ' : '') + 'CARD ' + (i + 1) + ' OF 8 · ' + K.src.toUpperCase(), x + pad, yy, tw, 16) + 3;
  fill('black');
  textSize(narrow ? 16 : 18);
  yy = drawWrapped(K.text, x + pad, yy, tw, narrow ? 20 : 23) + 4;
  textStyle(NORMAL);
  fill('dimgray');
  textStyle(ITALIC);
  textSize(14);
  yy = drawWrapped(QUESTION, x + pad, yy, tw, 18) + 8;
  textStyle(NORMAL);

  if (!r) {
    if (narrow) {
      // the legend is too narrow for the definitions, so show them here
      textSize(13);
      for (const c of CATS) {
        textStyle(BOLD);
        fill(c.color);
        yy = drawWrapped(c.name + ':', x + pad, yy, tw, 17);
        textStyle(NORMAL);
        fill('#222');
        yy = drawWrapped(c.def, x + pad, yy, tw, 17) + 4;
      }
      return;
    }
    fill('#4a5a66');
    textSize(14);
    drawWrapped('Choose one of the three categories below. Only your first choice counts. Then test the answer against two possible outcomes.',
                x + pad, yy, tw, 19);
    return;
  }

  // the learner's choice
  textSize(14);
  textStyle(BOLD);
  fill(CATS[r.chosen].color);
  yy = drawWrapped('Your choice: ' + CATS[r.chosen].name + (finished || tested ? '' : ' (locked in)'), x + pad, yy, tw, 18) + 6;
  textStyle(NORMAL);

  if (!tested && !finished) {
    fill('#4a5a66');
    drawWrapped('Press Test both outcomes to see whether the answer comes true under each.', x + pad, yy, tw, 18);
    return;
  }

  // the two outcomes
  const gap = 10;
  const bw = (tw - gap) / 2;
  textSize(narrow ? 13 : 14);
  const la = wrapLines(K.a, bw - 16).length, lb = wrapLines(K.b, bw - 16).length;
  const bh = 22 + Math.max(la, lb) * 18 + 26;
  drawOutcome(x + pad, yy, bw, bh, 'OUTCOME A', K.a, K.ta);
  drawOutcome(x + pad + bw + gap, yy, bw, bh, 'OUTCOME B', K.b, K.tb);
  yy += bh + 8;

  const C = CATS[K.ans];
  textSize(14);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  const head = r.correct ? 'Correct:' : C.verdict;
  text(head, x + pad, yy);
  const hw = textWidth(head) + 6;
  textStyle(NORMAL);
  fill('black');
  // first line continues after the head; the rest wraps at full width
  const words = K.why.split(' ');
  let first = '';
  while (words.length && textWidth(first + (first ? ' ' : '') + words[0]) <= tw - hw) first += (first ? ' ' : '') + words.shift();
  text(first, x + pad + hw, yy);
  if (words.length) drawWrapped(words.join(' '), x + pad, yy + 19, tw, 19);
}

function drawOutcome(x, y, w, h, label, what, verdict) {
  const col = verdict === 'True' ? '#1b6e52' : verdict === 'False' ? '#a4282a' : '#5d6d78';
  const bg = verdict === 'True' ? '#eaf5ee' : verdict === 'False' ? '#fbeaea' : '#f1f3f5';
  stroke(col);
  strokeWeight(1);
  fill(bg);
  rect(x, y, w, h, 6);
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text(label, x + 8, y + 6);
  textStyle(NORMAL);
  fill('black');
  textSize(canvasWidth < 560 ? 13 : 14);
  drawWrapped(what, x + 8, y + 22, w - 16, 18);
  fill(col);
  textStyle(BOLD);
  textSize(14);
  const short = w < 220;
  const v = verdict === 'True' ? (short ? '✓ Comes true' : '✓ The answer comes true')
          : verdict === 'False' ? (short ? '✗ Proven wrong' : '✗ The answer is proven wrong')
          : (short ? '– Not applicable' : '– Not applicable: no prediction');
  text(fitText(v, w - 16), x + 8, y + h - 22);
  textStyle(NORMAL);
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
