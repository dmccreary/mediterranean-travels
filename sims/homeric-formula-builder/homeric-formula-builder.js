// Finish the Line Like a Homeric Singer - p5.js 2.x
// CANVAS_HEIGHT: 560
// Six hexameter lines naming Achilles or Odysseus, in a fixed order. Each line
// shows its English opening and the metrical space left at its end, drawn to
// scale on a six-foot ruler (long = 2 beats, short = 1 beat). The learner picks
// one of the hero's three name formulas (5, 7 or 8 syllables). The chosen
// formula's syllables drop into the space: a right choice fits exactly, a wrong
// one runs past the end of the line or leaves a gap. Two attempts per line.
// A closing question then confronts "swift-footed" Achilles sitting still.

let canvasWidth = 700;
let drawHeight = 470;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

// L = long, S = short (simplified scansion; final syllable treated as long)
const FORMULAS = {
  Achilles: [
    { tr: 'dios Achilleus', syl: ['dī', 'os', 'A', 'chil', 'leus'], pat: 'LSSLL', en: 'brilliant Achilles' },
    { tr: 'podas ōkus Achilleus', syl: ['po', 'das', 'ō', 'kus', 'A', 'chil', 'leus'], pat: 'SSLSSLL', en: 'swift of feet, Achilles' },
    { tr: 'podarkēs dios Achilleus', syl: ['po', 'dar', 'kēs', 'dī', 'os', 'A', 'chil', 'leus'], pat: 'SLLLSSLL', en: 'swift-footed, brilliant Achilles' }
  ],
  Odysseus: [
    { tr: 'dios Odysseus', syl: ['dī', 'os', 'O', 'dys', 'seus'], pat: 'LSSLL', en: 'brilliant Odysseus' },
    { tr: 'polymētis Odysseus', syl: ['po', 'ly', 'mē', 'tis', 'O', 'dys', 'seus'], pat: 'SSLSSLL', en: 'Odysseus of many counsels' },
    { tr: 'polytlas dios Odysseus', syl: ['po', 'lyt', 'las', 'dī', 'os', 'O', 'dys', 'seus'], pat: 'SLLLSSLL', en: 'much-enduring, brilliant Odysseus' }
  ]
};

// ans is the index of the correct formula in the hero's list
const LINES = [
  { open: 'And answering him spoke', hero: 'Achilles', space: 'SSLSSLL', ans: 1, src: 'Iliad 1.84',
    full: 'And answering him spoke swift-footed Achilles.',
    wrong: 'Count the space: seven syllables. Only “podas ōkus Achilleus” has seven.' },
  { open: 'And answering him spoke', hero: 'Odysseus', space: 'SSLSSLL', ans: 1, src: 'Pattern example',
    full: 'And answering him spoke Odysseus of many counsels.',
    wrong: 'Same space as line 1, different hero: Odysseus’s seven-syllable formula is “polymētis Odysseus”.' },
  { open: 'So there he lay asleep,', hero: 'Odysseus', space: 'SLLLSSLL', ans: 2, src: 'Odyssey 6.1',
    full: 'So there he lay asleep, much-enduring, brilliant Odysseus.',
    wrong: 'Eight syllables left: the longest formula, “polytlas dios Odysseus”, fits exactly.' },
  { open: 'Then answered him', hero: 'Achilles', space: 'SLLLSSLL', ans: 2, src: 'Iliad 1.121',
    full: 'Then answered him swift-footed, brilliant Achilles.',
    wrong: 'Eight syllables left: “podarkēs dios Achilleus” is Achilles’s eight-syllable formula.' },
  { open: 'The son of Atreus, lord of men, and', hero: 'Achilles', space: 'LSSLL', ans: 0, src: 'Iliad 1.7',
    full: 'The son of Atreus, lord of men, and brilliant Achilles.',
    wrong: 'Only five syllables remain, so only the shortest formula, “dios Achilleus”, fits.' },
  { open: 'Swiftly beside him stood', hero: 'Odysseus', space: 'LSSLL', ans: 0, src: 'Pattern example',
    full: 'Swiftly beside him stood brilliant Odysseus.',
    wrong: 'Five syllables left: “dios Odysseus”.' }
];

const CLOSING = {
  q: 'The same words as line 1, “And answering him spoke swift-footed Achilles,” also introduce Achilles’s reply at ' +
     'Iliad 9.307, when he is sitting in his hut with guests. Why is he “swift of feet” there?',
  options: ['He has just been running', 'The space in the line called for that formula', 'Homer forgot where he was'],
  ans: 1,
  explain: 'Parry’s discovery: the epithet belongs to the hero and fits the meter. It describes who Achilles always is, not what he is doing.'
};
const MASTERY = 5;
const BEAT = { L: 2, S: 1 };

// ---------- State ----------
let current = 0;
let attempts = 0;       // wrong attempts on the current line
let tried = [];         // formula indices tried on the current line
let shown = -1;         // formula index currently drawn in the space
let resolved = false;   // current line finished (correct or missed)
let results = [];       // per line: true (first try), false (missed or second try)
let score = 0;
let phase = 'lines';    // 'lines' | 'closing' | 'done'
let closingChoice = -1;
let feedback = '';
let feedbackColor = 'black';

// ---------- Controls ----------
let formulaButtons = [];
let nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < 3; i++) {
    const b = createButton('');
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('cursor', 'pointer');
    b.style('white-space', 'normal');
    b.style('line-height', '1.15');
    b.mousePressed(() => choose(i));
    formulaButtons.push(b);
  }
  nextButton = createButton('Next line');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextLine);

  againButton = createButton('Start over');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(restart);

  positionControls();
  restart();

  describe('An activity on Homeric name formulas. Each of six lines shows an English opening, the hero (Achilles or ' +
           'Odysseus), and the space left at the end of the six-foot hexameter line as a row of long and short marks. ' +
           'The learner picks one of three formulas of five, seven or eight syllables. A formula of the right length fills ' +
           'the space exactly; a wrong one runs past the end of the line or leaves a gap. A closing question asks why ' +
           'Achilles is called swift-footed while he sits still.');
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / 3;
  for (let i = 0; i < 3; i++) {
    formulaButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    formulaButtons[i].size(colW - 6, 38);
  }
  nextButton.position(margin, drawHeight + 54);
  againButton.position(margin + 104, drawHeight + 54);
}

function restart() {
  current = 0;
  results = [];
  score = 0;
  phase = 'lines';
  closingChoice = -1;
  startLine();
}

function startLine() {
  attempts = 0;
  tried = [];
  shown = -1;
  resolved = false;
  feedback = '';
  updateButtons();
}

function heroFormulas() { return FORMULAS[LINES[current].hero]; }

function updateButtons() {
  if (phase === 'lines') {
    const F = heroFormulas();
    for (let i = 0; i < 3; i++) {
      formulaButtons[i].html(F[i].tr);
      formulaButtons[i].attribute('title', F[i].tr + ': ' + F[i].en);
      if (resolved || tried.includes(i)) formulaButtons[i].attribute('disabled', '');
      else formulaButtons[i].removeAttribute('disabled');
    }
    if (resolved) nextButton.removeAttribute('disabled'); else nextButton.attribute('disabled', '');
    nextButton.html(current < LINES.length - 1 ? 'Next line' : 'Last question');
  } else {
    for (let i = 0; i < 3; i++) {
      formulaButtons[i].html(CLOSING.options[i]);
      formulaButtons[i].attribute('title', CLOSING.options[i]);
      if (phase === 'done') formulaButtons[i].attribute('disabled', '');
      else formulaButtons[i].removeAttribute('disabled');
    }
    nextButton.attribute('disabled', '');
    nextButton.html('Next line');
  }
}

function choose(i) {
  if (phase === 'closing') {
    closingChoice = i;
    phase = 'done';
    updateButtons();
    return;
  }
  if (phase !== 'lines' || resolved || tried.includes(i)) return;
  const L = LINES[current];
  const F = heroFormulas();
  shown = i;
  tried.push(i);
  if (i === L.ans) {
    resolved = true;
    const first = (attempts === 0);
    results[current] = first;
    if (first) score++;
    feedback = 'Correct: “' + F[i].tr + '” fills ' + F[i].syl.length + ' syllables exactly.' +
               (first ? '' : ' (Second try, so this line does not count toward the score.)');
    feedbackColor = 'darkgreen';
  } else {
    attempts++;
    if (attempts >= 2) {
      resolved = true;
      results[current] = false;
      shown = L.ans;
      feedback = 'Not quite. The singer’s choice is “' + F[L.ans].tr + '”. ' + L.wrong;
      feedbackColor = 'firebrick';
    } else {
      const n = F[i].syl.length, m = L.space.length;
      feedback = (n > m ? 'Too long: ' + n + ' syllables for a space of ' + m + '. '
                        : 'Too short: ' + n + ' syllables for a space of ' + m + '. ') + L.wrong;
      feedbackColor = 'firebrick';
    }
  }
  updateButtons();
}

function nextLine() {
  if (phase !== 'lines' || !resolved) return;
  if (current < LINES.length - 1) {
    current++;
    startLine();
  } else {
    phase = 'closing';
    updateButtons();
  }
}

function keyPressed() {
  if (key.length === 1 && key >= '1' && key <= '3') choose(int(key) - 1);
  else if (key === 'Enter') nextLine();
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
  textSize(canvasWidth < 560 ? 17 : 22);
  text('Finish the Line Like a Homeric Singer', margin, 8);
  textStyle(NORMAL);

  textSize(14);
  textAlign(LEFT, TOP);
  fill('#33424d');
  text('Lines composed on the first try: ' + score + ' of ' + LINES.length, margin, 38);

  if (phase === 'lines') drawLinePhase();
  else drawClosingPhase();

  drawStatus();
}

function drawLinePhase() {
  const L = LINES[current];
  const F = heroFormulas();
  const x = margin, w = canvasWidth - 2 * margin;

  // ---- The line card
  let y = 62;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, 206, 8);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  fill('dimgray');
  const real = L.src !== 'Pattern example';
  text('LINE ' + (current + 1) + ' OF ' + LINES.length + '  ·  ' +
       (real ? L.src.toUpperCase() + ' (CHAPTER’S ENGLISH PARAPHRASE)' : 'PATTERN EXAMPLE: REAL FORMULAS, TYPICAL OPENING'),
       x + 12, y + 10);
  textStyle(NORMAL);

  // Opening, then either the formula's English or a blank
  textSize(canvasWidth < 560 ? 17 : 20);
  textStyle(ITALIC);
  fill('black');
  const openTxt = '“' + L.open + ' ';
  text(openTxt, x + 12, y + 30);
  const ow = textWidth(openTxt) + 5;
  if (resolved) {
    fill('darkgreen');
    textStyle(BOLDITALIC);
    text(fitText(F[L.ans].en + '.”', w - 24 - ow), x + 12 + ow, y + 30);
  } else {
    fill('#9AA7B0');
    text('. . . . . . .”', x + 12 + ow, y + 30);
  }
  textStyle(NORMAL);

  textSize(14);
  fill('#33424d');
  text('Hero: ', x + 12, y + 60);
  textStyle(BOLD);
  fill('black');
  text(L.hero, x + 12 + textWidth('Hero: ') + 2, y + 60);
  textStyle(NORMAL);
  fill('#33424d');
  const q = resolved ? 'The line is complete.' : 'Which name fits the space?';
  textAlign(RIGHT, TOP);
  textStyle(BOLD);
  text(q, x + w - 12, y + 60);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);

  drawMeter(x + 12, y + 86, w - 24, L, F);

  // ---- The hero's three formulas
  y = 276;
  const colW = w / 3;
  for (let i = 0; i < 3; i++) {
    const cx = x + i * colW + 3, cw = colW - 6;
    const isAns = resolved && i === L.ans;
    const wasWrong = tried.includes(i) && i !== L.ans;
    stroke(isAns ? 'seagreen' : (wasWrong ? 'firebrick' : 'silver'));
    strokeWeight(isAns || wasWrong ? 2 : 1);
    fill(isAns ? 'honeydew' : (wasWrong ? 'mistyrose' : 'white'));
    rect(cx, y, cw, 84, 8);
    noStroke();
    fill('dimgray');
    textSize(11);
    textStyle(BOLD);
    text('FORMULA ' + (i + 1), cx + 10, y + 8);
    textStyle(BOLD);
    textSize(15);
    fill('black');
    text(fitText(F[i].syl.join('·'), cw - 20), cx + 10, y + 24);
    textStyle(ITALIC);
    textSize(13);
    fill('#33424d');
    text(fitText('“' + F[i].en + '”', cw - 20), cx + 10, y + 46);
    textStyle(NORMAL);
    fill('dimgray');
    textSize(13);
    text(F[i].syl.length + ' syllables', cx + 10, y + 64);
  }

  // ---- Feedback
  y = 368;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, drawHeight - y - 10, 8);
  noStroke();
  textAlign(LEFT, TOP);
  if (!feedback) {
    fill('#33424d');
    textSize(14);
    drawWrapped('Count the syllables in the empty space at the end of the line, then press the button for the formula ' +
                'with the same number. The formula’s syllables will drop into the space.', x + 12, y + 10, w - 24, 19);
  } else {
    fill(feedbackColor);
    textSize(15);
    textStyle(BOLD);
    let yy = drawWrapped(feedback, x + 12, y + 10, w - 24, 20);
    textStyle(NORMAL);
    if (resolved) {
      fill('black');
      textSize(15);
      textStyle(ITALIC);
      yy = drawWrapped('“' + L.full + '”  (' + L.src + ')', x + 12, yy + 6, w - 24, 20);
      textStyle(NORMAL);
    }
  }
}

// The hexameter drawn to scale: 6 feet of 4 beats each, plus 1.5 feet of overflow room.
function drawMeter(x, y, w, L, F) {
  const unit = w / (7.5 * 4);         // pixels per beat
  const lineEnd = x + 24 * unit;
  const spaceBeats = beats(L.space);
  const spaceStart = x + (24 - spaceBeats) * unit;
  const rowY = y + 22, rowH = 30;

  // Foot numbers and boundaries
  textSize(11);
  textAlign(CENTER, TOP);
  for (let f = 0; f < 6; f++) {
    fill('dimgray');
    noStroke();
    text('foot ' + (f + 1), x + (f * 4 + 2) * unit, y + 2);
    stroke('#c9d3da');
    strokeWeight(1);
    line(x + f * 4 * unit, y + 16, x + f * 4 * unit, rowY + rowH + 22);
  }
  line(lineEnd, y + 16, lineEnd, rowY + rowH + 22);

  // The opening, already sung
  noStroke();
  fill('#e4e9ed');
  rect(x, rowY, spaceStart - x, rowH, 4, 0, 0, 4);
  fill('#5d6d78');
  textAlign(CENTER, CENTER);
  textSize(12);
  text(fitText('opening: already sung', spaceStart - x - 8), x + (spaceStart - x) / 2, rowY + rowH / 2);

  // Empty slots of the space
  let sx = spaceStart;
  for (const c of L.space) {
    const sw = BEAT[c] * unit;
    stroke('#2F6E8E');
    strokeWeight(1.5);
    fill(resolved ? 'honeydew' : '#f4f9fc');
    rect(sx + 1, rowY, sw - 2, rowH, 3);
    drawMark(c, sx + sw / 2, rowY + rowH / 2, '#2F6E8E');
    sx += sw;
  }

  // End-of-line marker
  noStroke();
  fill('#2F6E8E');
  textSize(11);
  textAlign(LEFT, CENTER);
  text(fitText('end of line', x + w - lineEnd - 6), lineEnd + 5, rowY + rowH / 2);

  // The chosen formula, syllable by syllable, below the slots
  const fy = rowY + rowH + 6;
  if (shown >= 0) {
    const Fm = F[shown];
    const fits = (Fm.pat === L.space);
    let px = spaceStart;
    for (let k = 0; k < Fm.syl.length; k++) {
      const c = Fm.pat[k];
      const sw = BEAT[c] * unit;
      const over = px + sw > lineEnd + 0.5;
      stroke(fits ? 'seagreen' : (over ? 'firebrick' : '#b5452b'));
      strokeWeight(1.5);
      fill(fits ? '#dff0e3' : (over ? '#f7d4d4' : '#fbe9e4'));
      rect(px + 1, fy, sw - 2, 34, 3);
      drawMark(c, px + sw / 2, fy + 9, fits ? 'seagreen' : 'firebrick');
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(sw < 26 ? 11 : 12);
      text(Fm.syl[k], px + sw / 2, fy + 24);
      px += sw;
    }
    // A gap left at the end of the line
    if (px < lineEnd - 0.5) {
      stroke('firebrick');
      strokeWeight(1.5);
      drawingContext.setLineDash([4, 3]);
      noFill();
      rect(px + 1, fy, lineEnd - px - 2, 34, 3);
      drawingContext.setLineDash([]);
      noStroke();
      fill('firebrick');
      textSize(11);
      textAlign(CENTER, CENTER);
      text('gap', px + (lineEnd - px) / 2, fy + 17);
    }
    noStroke();
  } else {
    noStroke();
    fill('#5d6d78');
    textAlign(LEFT, CENTER);
    textSize(12);
    text('← the space left: ' + L.space.length + ' syllables', spaceStart, fy + 14);
  }

  // Legend
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(11);
  const ly = fy + 42;
  drawMark('L', x + 8, ly + 7, 'dimgray');
  fill('dimgray');
  text('long (2 beats)', x + 20, ly);
  drawMark('S', x + 112, ly + 7, 'dimgray');
  fill('dimgray');
  text(fitText('short (1 beat)    The marks are simplified for learners.', w - 126), x + 124, ly);
}

function beats(p) {
  let b = 0;
  for (const c of p) b += BEAT[c];
  return b;
}

// Long: a bar. Short: a small cup (the breve).
function drawMark(c, cx, cy, col) {
  stroke(col);
  strokeWeight(2);
  noFill();
  if (c === 'L') line(cx - 7, cy, cx + 7, cy);
  else arc(cx, cy - 3, 10, 10, 0, PI);
  noStroke();
}

function drawClosingPhase() {
  const x = margin, w = canvasWidth - 2 * margin;
  let y = 62;

  // Summary of the six lines
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, 186, 8);
  noStroke();
  textAlign(LEFT, TOP);
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text('THE SIX LINES YOU COMPOSED', x + 12, y + 10);
  textStyle(NORMAL);
  for (let i = 0; i < LINES.length; i++) {
    const ly = y + 30 + i * 25;
    const ok = results[i];
    fill(ok ? 'darkgreen' : 'firebrick');
    textStyle(BOLD);
    textSize(14);
    text(ok ? '✓' : '✗', x + 12, ly);
    textStyle(NORMAL);
    fill('black');
    const F = FORMULAS[LINES[i].hero][LINES[i].ans];
    const tail = '  ' + F.tr + ' (' + F.syl.length + ')';
    textSize(14);
    const tw = textWidth(tail);
    text(fitText((i + 1) + '. ' + LINES[i].full, w - 50 - tw), x + 32, ly);
    fill('#2F6E8E');
    textAlign(RIGHT, TOP);
    text(tail, x + w - 12, ly);
    textAlign(LEFT, TOP);
  }

  // Closing question
  y = 256;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, drawHeight - y - 10, 8);
  noStroke();
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text('LAST QUESTION (NOT SCORED)', x + 12, y + 10);
  textStyle(NORMAL);
  fill('black');
  textSize(15);
  let yy = drawWrapped(CLOSING.q, x + 12, y + 30, w - 24, 20);

  if (phase === 'done') {
    const ok = closingChoice === CLOSING.ans;
    fill(ok ? 'darkgreen' : 'firebrick');
    textStyle(BOLD);
    yy = drawWrapped((ok ? 'Yes. ' : 'Not quite: the space in the line called for that formula. ') + CLOSING.explain,
                     x + 12, yy + 8, w - 24, 20);
    const pass = score >= MASTERY;
    fill(pass ? 'darkgreen' : '#7A5A00');
    yy = drawWrapped(pass ? 'You composed like a singer: the meter chose the words.'
                          : 'Count the syllables left, then pick the formula with that many.',
                     x + 12, yy + 8, w - 24, 20);
    textStyle(NORMAL);
    fill('#33424d');
    textSize(14);
    drawWrapped('Notice that the hero never changed, only the space, and the space alone decided the formula.',
                x + 12, yy + 6, w - 24, 19);
  } else {
    fill('#5d6d78');
    textStyle(ITALIC);
    textSize(14);
    drawWrapped('Choose an answer with the buttons below.', x + 12, yy + 8, w - 24, 19);
    textStyle(NORMAL);
  }
}

function drawStatus() {
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let s;
  if (phase === 'closing') s = 'Answer the last question.';
  else if (phase === 'done') s = 'Done. Press Start over to compose all six lines again.';
  else if (resolved) s = 'Press ' + (current < LINES.length - 1 ? 'Next line' : 'Last question') + ' (or Enter) to continue.';
  else if (attempts === 1) s = 'One more try on this line.';
  else s = 'Pick a formula (or press 1, 2, 3). Two tries per line.';
  text(fitText(s, canvasWidth - margin - 214), margin + 214, drawHeight + 69);
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
