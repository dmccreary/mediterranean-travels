// Read a Greek Sign - p5.js 2.x
// CANVAS_HEIGHT: 520
// Twelve Greek signs from our route, in capitals. The learner types a
// transliteration in Latin letters (two attempts per sign), with a Letter key
// available at all times. A miss on the first try names the trap letters; a
// second miss shows the sign letter by letter. A summary ends the activity.

let canvasWidth = 700;
let drawHeight = 440;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

// Single-letter transliterations used on Greek road and site signs (ELOT 743).
const LETTERS = [
  ['Α', 'α', 'alfa', 'a'], ['Β', 'β', 'vita', 'v'], ['Γ', 'γ', 'gamma', 'g'], ['Δ', 'δ', 'delta', 'd'],
  ['Ε', 'ε', 'epsilon', 'e'], ['Ζ', 'ζ', 'zita', 'z'], ['Η', 'η', 'ita', 'i'], ['Θ', 'θ', 'thita', 'th'],
  ['Ι', 'ι', 'iota', 'i'], ['Κ', 'κ', 'kappa', 'k'], ['Λ', 'λ', 'lamda', 'l'], ['Μ', 'μ', 'mi', 'm'],
  ['Ν', 'ν', 'ni', 'n'], ['Ξ', 'ξ', 'xi', 'x'], ['Ο', 'ο', 'omikron', 'o'], ['Π', 'π', 'pi', 'p'],
  ['Ρ', 'ρ', 'ro', 'r'], ['Σ', 'σ ς', 'sigma', 's'], ['Τ', 'τ', 'taf', 't'], ['Υ', 'υ', 'ypsilon', 'y'],
  ['Φ', 'φ', 'fi', 'f'], ['Χ', 'χ', 'chi', 'ch'], ['Ψ', 'ψ', 'psi', 'ps'], ['Ω', 'ω', 'omega', 'o']
];
const TRANSLIT = {};
for (const l of LETTERS) TRANSLIT[l[0]] = l[3];

// traps: Greek letters named in the trap note (used for the summary tally)
const SIGNS = [
  { greek: 'ΑΘΗΝΑ', accepted: ['athina'], meaning: 'Athens', sounds: 'a-THEE-na',
    trapNote: 'Θ is th; Η is i, not h', traps: ['Θ', 'Η'] },
  { greek: 'ΠΕΙΡΑΙΑΣ', accepted: ['peiraias', 'pireas'], meaning: 'Piraeus, the port of Athens', short: 'Piraeus', sounds: 'pee-reh-AHS',
    trapNote: 'Ρ is r, not p', traps: ['Ρ'] },
  { greek: 'ΡΟΔΟΣ', accepted: ['rodos'], meaning: 'Rhodes', sounds: 'RO-thos',
    trapNote: 'Ρ is r; Δ is d, sounding like th in this', traps: ['Ρ', 'Δ'] },
  { greek: 'ΗΡΑΚΛΕΙΟ', accepted: ['irakleio', 'iraklio'], meaning: 'Heraklion', sounds: 'ee-RA-klee-o',
    trapNote: 'Η is i; Λ is l', traps: ['Η', 'Λ'] },
  { greek: 'ΚΝΩΣΟΣ', accepted: ['knosos', 'knossos'], meaning: 'Knossos', sounds: 'kno-SOS',
    trapNote: 'Ω is o, not w', traps: ['Ω'] },
  { greek: 'ΔΕΛΦΟΙ', accepted: ['delfoi', 'delfi', 'delphi'], meaning: 'Delphi', sounds: 'del-FEE',
    trapNote: 'Λ is l; Φ is f', traps: ['Λ', 'Φ'] },
  { greek: 'ΑΚΡΟΠΟΛΗ', accepted: ['akropoli'], meaning: 'Acropolis', sounds: 'a-KRO-po-lee',
    trapNote: 'Ρ is r; Η is i', traps: ['Ρ', 'Η'] },
  { greek: 'ΜΟΥΣΕΙΟ', accepted: ['mouseio', 'mousio'], meaning: 'Museum', sounds: 'moo-SEE-o',
    trapNote: 'ΟΥ is ou, sounding oo', traps: ['Υ'] },
  { greek: 'ΕΙΣΟΔΟΣ', accepted: ['eisodos', 'isodos'], meaning: 'Entrance', sounds: 'EE-so-thos',
    trapNote: 'ΕΙ sounds ee; Σ is s', traps: ['Σ'] },
  { greek: 'ΕΞΟΔΟΣ', accepted: ['exodos', 'eksodos'], meaning: 'Exit', sounds: 'EX-o-thos',
    trapNote: 'Ξ is x, sounding ks', traps: ['Ξ'] },
  { greek: 'ΚΛΕΙΣΤΟ', accepted: ['kleisto', 'klisto'], meaning: 'Closed', sounds: 'klee-STO',
    trapNote: 'Λ is l; ΕΙ sounds ee', traps: ['Λ'] },
  { greek: 'ΑΝΟΙΧΤΟ', accepted: ['anoichto', 'anichto', 'anihto'], meaning: 'Open', sounds: 'a-nee-KHTO',
    trapNote: 'Χ is ch, not x; ΟΙ sounds ee', traps: ['Χ'] }
];

// ---------- State ----------
let current = 0;
let attempts = 0;        // wrong attempts on the current sign
let state = 'asking';    // 'asking' | 'retry' | 'correct' | 'missed'
let lastAnswer = '';
let results = [];        // per sign: { correct, attempts }
let score = 0;
let finished = false;
let showKey = false;

// ---------- Controls ----------
let answerInput, checkButton, keyButton, nextButton, restartButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  answerInput = createInput('', 'text');
  answerInput.parent(document.querySelector('main'));
  answerInput.attribute('placeholder', 'Type the sign in Latin letters');
  answerInput.attribute('aria-label', 'Your transliteration of the sign');
  answerInput.attribute('autocomplete', 'off');
  answerInput.attribute('spellcheck', 'false');
  answerInput.style('font-size', '16px');
  answerInput.style('padding', '4px 6px');
  answerInput.elt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.stopPropagation(); e.preventDefault(); checkAnswer(); }
  });

  checkButton = createButton('Check');
  checkButton.parent(document.querySelector('main'));
  checkButton.style('font-size', '15px');
  checkButton.mousePressed(checkAnswer);

  keyButton = createButton('Letter key');
  keyButton.parent(document.querySelector('main'));
  keyButton.style('font-size', '15px');
  keyButton.mousePressed(toggleKey);

  nextButton = createButton('Next sign');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextSign);

  restartButton = createButton('Restart');
  restartButton.parent(document.querySelector('main'));
  restartButton.style('font-size', '14px');
  restartButton.mousePressed(restart);

  positionControls();
  restart();

  describe('A transliteration practice activity. A Greek sign in capital letters, such as ΑΘΗΝΑ, is shown on a blue road sign. ' +
           'The learner types it in Latin letters and presses Check. Feedback names the trap letters after a first miss and shows ' +
           'the sign letter by letter after a second miss, with its meaning and pronunciation. A Letter key button shows all 24 ' +
           'Greek capitals with their sign spellings. A summary lists all twelve signs at the end.');
}

function positionControls() {
  const inputW = Math.min(300, canvasWidth - 2 * margin - 210);
  answerInput.position(margin, drawHeight + 8);
  answerInput.size(inputW);
  checkButton.position(margin + inputW + 24, drawHeight + 8);
  keyButton.position(margin + inputW + 94, drawHeight + 8);
  nextButton.position(margin, drawHeight + 46);
  restartButton.position(margin + 115, drawHeight + 46);
}

function restart() {
  current = 0;
  attempts = 0;
  state = 'asking';
  lastAnswer = '';
  results = [];
  score = 0;
  finished = false;
  showKey = false;
  answerInput.value('');
  updateControls();
}

function normalizeAnswer(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s\-]/g, '');
}

function checkAnswer() {
  if (finished || state === 'correct' || state === 'missed') return;
  const raw = answerInput.value();
  if (!raw.trim()) return;
  lastAnswer = raw.trim();
  const sign = SIGNS[current];
  if (sign.accepted.includes(normalizeAnswer(raw))) {
    state = 'correct';
    score++;
    results[current] = { correct: true, attempts: attempts + 1 };
  } else {
    attempts++;
    if (attempts >= 2) {
      state = 'missed';
      results[current] = { correct: false, attempts: 2 };
    } else {
      state = 'retry';
      answerInput.value('');
    }
  }
  updateControls();
  if (state === 'retry') answerInput.elt.focus({ preventScroll: true });
}

function nextSign() {
  if (!(state === 'correct' || state === 'missed') || finished) return;
  if (current < SIGNS.length - 1) {
    current++;
    attempts = 0;
    state = 'asking';
    lastAnswer = '';
    answerInput.value('');
  } else {
    finished = true;
    showKey = false;
    answerInput.value('');
  }
  updateControls();
  if (!finished) answerInput.elt.focus({ preventScroll: true });
}

function toggleKey() {
  showKey = !showKey;
  updateControls();
}

function keyPressed() {
  if (document.activeElement === answerInput.elt) return;
  if (key === 'Enter') nextSign();
}

function updateControls() {
  const resolved = (state === 'correct' || state === 'missed');
  if (finished || resolved) {
    answerInput.attribute('disabled', '');
    checkButton.attribute('disabled', '');
  } else {
    answerInput.removeAttribute('disabled');
    checkButton.removeAttribute('disabled');
  }
  if (finished) keyButton.attribute('disabled', ''); else keyButton.removeAttribute('disabled');
  keyButton.html(showKey ? 'Hide key' : 'Letter key');
  if (resolved && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < SIGNS.length - 1 ? 'Next sign' : 'See summary');
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
  textSize(22);
  text('Read a Greek Sign', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('Signs read: ' + score + ' of ' + SIGNS.length, canvasWidth - margin, 14);

  if (finished) drawSummary(46);
  else {
    drawSign(46);
    if (showKey) drawLetterKey(192);
    else drawFeedback(192);
  }

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = 'Done. Press Restart to read all twelve again.';
  else if (state === 'correct' || state === 'missed') status = 'Press ' + (current < SIGNS.length - 1 ? 'Next sign' : 'See summary') + ' to continue.';
  else if (state === 'retry') status = 'Second try: type it again and press Check (or Enter).';
  else status = 'Type your answer and press Check (or Enter).';
  text(fitText(status, canvasWidth - margin - 210), margin + 200, drawHeight + 60);
}

function drawSign(top) {
  const s = SIGNS[current];
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(13);
  text('SIGN ' + (current + 1) + ' OF ' + SIGNS.length, margin, top);
  textStyle(NORMAL);

  // A blue Greek road sign
  textStyle(BOLD);
  textSize(48);
  const tw = textWidth(s.greek);
  const w = Math.min(canvasWidth - 2 * margin, Math.max(260, tw + 80));
  const h = 86;
  const x = (canvasWidth - w) / 2, y = top + 20;
  noStroke();
  fill('#1F4E9A');
  rect(x, y, w, h, 10);
  noFill();
  stroke('white');
  strokeWeight(3);
  rect(x + 6, y + 6, w - 12, h - 12, 7);
  noStroke();
  fill('white');
  textAlign(CENTER, CENTER);
  text(s.greek, canvasWidth / 2, y + h / 2 + 2);
  textStyle(NORMAL);

  fill('dimgray');
  textStyle(ITALIC);
  textSize(15);
  textAlign(CENTER, TOP);
  text('Sound it out: what does this sign say?', canvasWidth / 2, y + h + 8);
  textStyle(NORMAL);
}

function drawFeedback(top) {
  const s = SIGNS[current];
  const x = margin, w = canvasWidth - 2 * margin;
  if (state === 'asking') {
    noStroke();
    fill('dimgray');
    textAlign(LEFT, TOP);
    textSize(15);
    drawWrapped('Type the letters you see in Latin letters, then press Check. Most capitals look like ours; ' +
                'a few look-alikes are traps. Open the Letter key whenever you need it.', x + 4, top + 6, w - 8, 20);
    return;
  }
  const h = drawHeight - top - 10;
  stroke(state === 'correct' ? 'seagreen' : state === 'retry' ? 'darkorange' : 'firebrick');
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x, top, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  let yy = top + 10;
  const tx = x + 14, tw = w - 28;

  if (state === 'retry') {
    textStyle(BOLD);
    textSize(17);
    fill('darkorange');
    text('Not yet.', tx, yy);
    textStyle(NORMAL);
    fill('black');
    textSize(16);
    yy = drawWrapped('You typed “' + lastAnswer + '.” Watch the trap letters: ' + s.trapNote + '.', tx, yy + 26, tw, 21);
    fill('dimgray');
    textSize(15);
    drawWrapped('One more try. Read the sign one letter at a time, left to right.', tx, yy + 8, tw, 20);
    return;
  }

  textStyle(BOLD);
  textSize(17);
  if (state === 'correct') {
    fill('darkgreen');
    yy = drawWrapped('Correct: ' + s.greek + ' is ' + s.accepted[0] + ', ‘' + s.meaning + '’, sounding like ' + s.sounds + '.', tx, yy, tw, 22);
  } else {
    fill('firebrick');
    yy = drawWrapped('This sign says ' + s.accepted[0] + ': ' + s.meaning + '.', tx, yy, tw, 22);
    textStyle(NORMAL);
    textSize(15);
    fill('black');
    yy = drawWrapped('It sounds like ' + s.sounds + '. Trap letters: ' + s.trapNote + '.', tx, yy + 2, tw, 20);
  }
  textStyle(NORMAL);
  drawBreakdown(s, tx, yy + 12, tw);
  if (s.accepted.length > 1) {
    fill('dimgray');
    textSize(14);
    textAlign(LEFT, BOTTOM);
    text(fitText('Also accepted: ' + s.accepted.slice(1).join(', '), tw), tx, top + h - 8);
  }
}

// Each Greek letter above its Latin letters.
function drawBreakdown(s, x, y, w) {
  const chars = [...s.greek];
  const n = chars.length;
  const tile = Math.min(56, (w - (n - 1) * 6) / n);
  const total = n * tile + (n - 1) * 6;
  let xx = x + (w - total) / 2;
  for (let i = 0; i < n; i++) {
    const g = chars[i];
    let lat = TRANSLIT[g] || '?';
    if (g === 'Υ' && i > 0 && chars[i - 1] === 'Ο') lat = 'u';   // ΟΥ is written ou
    const trap = s.traps.includes(g);
    stroke(trap ? 'firebrick' : 'silver');
    strokeWeight(trap ? 2 : 1);
    fill(trap ? 'mistyrose' : 'white');
    rect(xx, y, tile, 64, 6);
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(26);
    fill('#1F4E9A');
    text(g, xx + tile / 2, y + 20);
    textStyle(NORMAL);
    textSize(18);
    fill('black');
    text(lat, xx + tile / 2, y + 48);
    xx += tile + 6;
  }
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, TOP);
  text('Red tiles are this sign’s trap letters.', x, y + 70);
}

function drawLetterKey(top) {
  const x = margin, w = canvasWidth - 2 * margin;
  const h = drawHeight - top - 10;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, top, w, h, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text('Letter key: Greek capital, small letter, and the Latin letters used on signs', x + 12, top + 8);
  textStyle(NORMAL);
  const cols = 4, rows = 6;
  const cw = (w - 24) / cols;
  const rh = (h - 62) / rows;
  for (let i = 0; i < LETTERS.length; i++) {
    const c = Math.floor(i / rows), r = i % rows;
    const cx = x + 12 + c * cw, cy = top + 34 + r * rh;
    const L = LETTERS[i];
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(20);
    fill('#1F4E9A');
    text(L[0], cx, cy + rh / 2);
    textStyle(NORMAL);
    textSize(15);
    fill('dimgray');
    text(L[1], cx + 24, cy + rh / 2);
    fill('black');
    textStyle(BOLD);
    textSize(16);
    text('= ' + L[3], cx + 62, cy + rh / 2);
    textStyle(NORMAL);
  }
  fill('dimgray');
  textSize(13);
  textAlign(LEFT, BOTTOM);
  text(fitText('Pairs: ΟΥ = ou (oo); ΑΙ sounds e; ΕΙ and ΟΙ sound ee. On signs, pairs are written letter by letter.', w - 24), x + 12, top + h - 8);
}

function drawSummary(top) {
  const x = margin, w = canvasWidth - 2 * margin;
  let yy = top;
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  fill('black');
  text('All twelve signs done. Signs read: ' + score + ' of 12.', x, yy);
  yy += 24;
  const pass = score >= 10;
  fill(pass ? 'darkgreen' : 'firebrick');
  textSize(16);
  text(pass ? '10 or more: you can read Greek signs.' : 'Fewer than 10: review the letter table and try again.', x, yy);
  textStyle(NORMAL);
  yy += 28;

  const rowH = 22;
  const half = Math.ceil(SIGNS.length / 2);
  const colW = w / 2;
  for (let i = 0; i < SIGNS.length; i++) {
    const c = Math.floor(i / half), r = i % half;
    const cx = x + c * colW, cy = yy + r * rowH;
    const s = SIGNS[i], res = results[i];
    fill(r % 2 === 0 ? 'white' : 'ghostwhite');
    stroke('gainsboro');
    rect(cx, cy, colW - 6, rowH);
    noStroke();
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(14);
    fill(res.correct ? 'darkgreen' : 'firebrick');
    text(res.correct ? (res.attempts === 1 ? '✓' : '✓ 2nd') : '✗', cx + 6, cy + rowH / 2);
    fill('#1F4E9A');
    text(s.greek, cx + 58, cy + rowH / 2);
    textStyle(NORMAL);
    fill('black');
    text(fitText(s.accepted[0] + ' — ' + (s.short || s.meaning), colW - 6 - 160 - 8), cx + 160, cy + rowH / 2);
  }
  yy += half * rowH + 14;

  // Trap letters in the signs that were missed at least once
  const tally = {};
  for (let i = 0; i < SIGNS.length; i++) {
    const res = results[i];
    if (res.correct && res.attempts === 1) continue;
    for (const g of SIGNS[i].traps) tally[g] = (tally[g] || 0) + 1;
  }
  const keys = Object.keys(tally).sort((a, b) => tally[b] - tally[a]);
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text('Trap letters in the signs you missed at least once:', x, yy);
  textStyle(NORMAL);
  const line = keys.length
    ? keys.map(g => g + ' (' + TRANSLIT[g] + ') ×' + tally[g]).join(',  ')
    : 'none — every sign read on the first try.';
  yy = drawWrapped(line, x, yy + 20, w, 20);
  fill('dimgray');
  textStyle(ITALIC);
  textSize(14);
  drawWrapped('Most Greek capitals match ours. A handful of look-alikes, Η, Ρ, Χ and Υ, cause most mistakes.', x, yy + 6, w, 18);
  textStyle(NORMAL);
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
