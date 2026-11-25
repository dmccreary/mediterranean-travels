// Essential or Inherited? - p5.js 2.x
// CANVAS_HEIGHT: 570
// Twelve school practices appear one at a time, in a fixed order. For each,
// the learner judges Essential (part of what a school is for) or Inherited
// (one way of doing it that answered the constraints of an earlier age).
// The first choice is scored; feedback follows and the card joins the column
// of its correct judgment, marked right or wrong. Mastery is 10 of 12 with
// cards 5 and 11, the trap pair, both correct. At the end the trap pair is
// linked by a line labeled "purpose and form".

let canvasWidth = 700;
let drawHeight = 490;   // set by computeLayout from the longest card
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let cardH = 200;
let critH = 44;
const CHIP_H = 23;
const CHIP_GAP = 3;
const LINK_ROW = 26;   // room under the columns for the trap-pair label

const KINDS = [
  { name: 'Essential', color: '#2F6E8E', fill: '#e8f1f6',
    def: 'Part of what a school is for.' },
  { name: 'Inherited', color: '#9A5B13', fill: '#f8efe2',
    def: 'One way of doing it that answered the constraints of an earlier age.' }
];

const TEST = 'The test: what problem did this solve, and does that problem still exist in the same form?';
const QUESTION = 'Is this part of what a school is for, or one way of doing it?';
const CAVEAT = 'Judgments follow this chapter’s criterion; reasonable people may weigh some forms differently.';

// kind: 0 Essential, 1 Inherited; serves: for inherited forms, the purpose on the list it serves
const CARDS = [
  { text: 'Every student learns to read, write, and reason with numbers.', chip: 'Reading, writing, numbers', kind: 0,
    why: 'This is the academic core a school exists to teach.' },
  { text: 'A high school credit equals about 120 hours of class time.', chip: 'Credit = 120 hours', kind: 1,
    why: 'The Carnegie unit was defined in 1906 to standardize transcripts and pensions; it measures hours, not learning.',
    serves: 'checking that a student has learned (card 5)' },
  { text: 'Students get timely, specific feedback on their practice.', chip: 'Timely feedback', kind: 0,
    why: 'Feedback is how practice turns into learning, whatever the method.' },
  { text: 'Students are grouped into grades by birth year.', chip: 'Grades by birth year', kind: 1,
    why: 'Age grading spread in the 19th century to move many children through a building; it sorts by age, not readiness.',
    serves: 'teaching every child the academic core (card 1)' },
  { text: 'Someone checks that a student has really learned a skill before building on it.', chip: 'Checking mastery', kind: 0,
    trap: true,
    why: 'Checking mastery is part of teaching; only the way and the timing of the check are matters of form.' },
  { text: 'A bell moves every student to a new subject about every 50 minutes.', chip: 'The 50-minute bell', kind: 1,
    why: 'The period schedule coordinates a large building; it is one way to divide time, not a purpose.',
    serves: 'making time for every part of the academic core (card 1)' },
  { text: 'Each student is known well by at least one caring adult.', chip: 'Known by a caring adult', kind: 0,
    why: 'Relationships with adults are part of what a school is for, and AI does not replace them.' },
  { text: 'Students sit in rows facing the teacher.', chip: 'Rows facing the teacher', kind: 1,
    why: 'Rows suit one person explaining to many; other arrangements suit other ways of learning.',
    serves: 'teaching the academic core by explanation (card 1)' },
  { text: 'Students practice working, talking, and disagreeing well with other people.', chip: 'Learning with others', kind: 0,
    why: 'Learning with others is a core purpose; it is what the AI-native afternoon is for.' },
  { text: 'New material is explained to the whole class at a single pace.', chip: 'One pace for the class', kind: 1,
    why: 'Explanation is essential; one pace for everyone is the inherited form, which leaves many students out of reach.',
    extra: 'Keep the explanation, question the single pace.',
    serves: 'teaching the academic core (card 1)' },
  { text: 'Every student takes the same unit test on the same day.', chip: 'Same test, same day', kind: 1, trap: true,
    why: 'Checking learning is essential (card 5); the shared date comes from moving a whole class together.',
    extra: 'The check is essential; the shared test date is a form.',
    serves: 'checking that a student has learned (card 5)' },
  { text: 'Students are safe in body and mind during the school day.', chip: 'Safe in body and mind', kind: 0,
    why: 'Safety is a precondition of learning, and families rely on it.' }
];
const MASTERY = 10;
const TRAP = [4, 10];   // cards 5 and 11

// ---------- State ----------
let current = 0;
let judged = false;     // has the current card been judged?
let results = {};       // card index -> { choice, ok }
let score = 0;
let finished = false;
let hoverCard = -1;
let chipRects = [];
let binTop = 0;

// ---------- Controls ----------
let kindButtons = [];
let nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < KINDS.length; i++) {
    const b = createButton(KINDS[i].name);
    b.parent(document.querySelector('main'));
    b.style('font-size', '15px');
    b.style('font-weight', 'bold');
    b.style('cursor', 'pointer');
    b.style('white-space', 'nowrap');
    b.style('color', KINDS[i].color);
    b.attribute('title', KINDS[i].name + ' (key ' + KINDS[i].name[0] + ')');
    b.mousePressed(() => judge(i));
    kindButtons.push(b);
  }
  nextButton = createButton('Next card');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCard);

  againButton = createButton('Try again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(restart);

  computeLayout();
  resizeCanvas(canvasWidth, canvasHeight);
  restart();

  describe('A judging activity about school practices. Two columns are shown, Essential and Inherited, with the ' +
           'criterion for each. One practice appears at a time; the learner judges it Essential or Inherited and ' +
           'reads feedback, and the card joins the column of its correct judgment. A running score counts correct ' +
           'first choices out of twelve.');
}

// ---------- Layout ----------
function claimSize() { return canvasWidth < 560 ? 16 : 18; }

function feedbackText(ci, r) {
  const c = CARDS[ci];
  if (r.ok) return { head: 'Correct.', body: c.why };
  let body = c.why;
  if (r.choice === 0 && c.extra) body += ' ' + c.extra;
  return { head: 'This one is ' + KINDS[c.kind].name + '.', body: body };
}

function feedbackLines(f, tw) {
  textSize(15);
  textStyle(BOLD);
  const headW = textWidth(f.head) + 6;
  textStyle(NORMAL);
  const first = wrapLines(f.body, tw - headW);
  return 1 + (first.length > 1 ? wrapLines(first.slice(1).join(' '), tw).length : 0);
}

// Card panel: tall enough for the longest practice and its longest feedback,
// and for the summary shown after the last card
function computeLayout() {
  const tw = canvasWidth - 2 * margin - 28;
  textSize(13);
  critH = 10 + KINDS.reduce((n, K) => n + wrapLines(K.name + ': ' + K.def, canvasWidth - 2 * margin - 20).length, 0) * 17;
  let need = 0;
  for (let ci = 0; ci < CARDS.length; ci++) {
    textStyle(BOLD);
    textSize(claimSize());
    let h = 18 + wrapLines(CARDS[ci].text, tw).length * 23 + 4;
    textStyle(ITALIC);
    textSize(13);
    h += wrapLines(TEST, tw).length * 17 + 8;
    const f = feedbackText(ci, { ok: false, choice: 1 - CARDS[ci].kind });
    h += feedbackLines(f, tw) * 19;
    need = Math.max(need, h);
    // the review shown on hover after the last card
    textStyle(BOLD);
    textSize(claimSize());
    let rh = 18 + wrapLines(CARDS[ci].text, tw).length * 23 + 4 + 22 + feedbackLines(f, tw) * 19 + 4;
    if (CARDS[ci].serves) {
      textSize(14);
      rh += wrapLines(CARDS[ci].serves + '.', tw - 130).length * 18;
    }
    need = Math.max(need, rh);
  }
  need = Math.max(need, summaryHeight(tw));
  textStyle(NORMAL);
  cardH = Math.ceil(need + 14);
  const bins = 28 + 6 * (CHIP_H + CHIP_GAP) + 10 + LINK_ROW;
  drawHeight = 40 + critH + 8 + cardH + 10 + bins + 22;
  canvasHeight = drawHeight + controlHeight;
}

function summaryLines() {
  const mastered = masteryMet();
  return [
    { s: 'You judged ' + score + ' of 12 correctly. Mastery is 10, with cards 5 and 11 both correct.', size: 17, style: BOLD, color: 'black' },
    { s: mastered ? 'You can separate a purpose from the form that carried it.'
                  : 'Look again at cards 5 and 11: which is the purpose, and which is one way of doing it?',
      size: 15, style: BOLD, color: mastered ? 'darkgreen' : 'firebrick' },
    { s: 'Every inherited form on this list serves an essential purpose on the list, which is why it is hard to ' +
         'change. Hover over a card to see which purpose it serves.', size: 14, style: NORMAL, color: 'black' }
  ];
}

function summaryHeight(tw) {
  // measured for the longer (not mastered) message
  const saveScore = score;
  score = 0;
  let h = 0;
  for (const L of summaryLines()) {
    textSize(L.size);
    textStyle(L.style);
    h += wrapLines(L.s, tw).length * (L.size + 4) + 4;
  }
  score = saveScore;
  return h;
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / KINDS.length;
  for (let i = 0; i < kindButtons.length; i++) {
    kindButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    kindButtons[i].size(colW - 6, 30);
  }
  nextButton.position(margin, drawHeight + 46);
  againButton.position(margin + 100, drawHeight + 46);
}

// ---------- Flow ----------
function restart() {
  current = 0;
  judged = false;
  results = {};
  score = 0;
  finished = false;
  hoverCard = -1;
  positionControls();
  updateButtonStates();
}

function judge(k) {
  if (finished || judged) return;
  const ok = (k === CARDS[current].kind);
  if (ok) score++;
  results[current] = { choice: k, ok: ok };
  judged = true;
  updateButtonStates();
}

function nextCard() {
  if (finished || !judged) return;
  if (current < CARDS.length - 1) {
    current++;
    judged = false;
  } else {
    finished = true;
  }
  updateButtonStates();
}

function masteryMet() {
  return score >= MASTERY && TRAP.every(i => results[i] && results[i].ok);
}

function keyPressed() {
  if (key === 'e' || key === 'E') judge(0);
  else if (key === 'i' || key === 'I') judge(1);
  else if (key === 'Enter') nextCard();
}

// Clicking a column on the canvas also chooses that judgment
function mousePressed() {
  if (finished || judged) return;
  if (mouseY < binTop || mouseY > drawHeight - 22) return;
  const colW = (canvasWidth - 2 * margin) / KINDS.length;
  const k = Math.floor((mouseX - margin) / colW);
  if (k >= 0 && k < KINDS.length) judge(k);
}

function updateButtonStates() {
  for (let i = 0; i < kindButtons.length; i++) {
    const b = kindButtons[i];
    if (!judged && !finished) b.removeAttribute('disabled');
    else b.attribute('disabled', '');
    const chosen = judged && !finished && results[current].choice === i;
    b.style('background', chosen ? KINDS[i].fill : '');
    b.style('border', chosen ? '2px solid ' + KINDS[i].color : '');
  }
  if (judged && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < CARDS.length - 1 ? 'Next card' : 'See result');
  if (finished) againButton.removeAttribute('disabled');
  else againButton.attribute('disabled', '');
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
  textSize(canvasWidth < 560 ? 18 : 22);
  text('Essential or Inherited?', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('Correct: ' + score + ' of ' + CARDS.length, canvasWidth - margin, 14);

  drawCriterion(margin, 40, canvasWidth - 2 * margin, critH);
  drawCardPanel(margin, 40 + critH + 8, canvasWidth - 2 * margin, cardH);
  drawBins(40 + critH + 8 + cardH + 10);

  noStroke();
  fill('#5d6d78');
  textStyle(ITALIC);
  textSize(12);
  textAlign(LEFT, CENTER);
  text(fitText(CAVEAT, canvasWidth - 2 * margin), margin, drawHeight - 11);
  textStyle(NORMAL);

  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = masteryMet() ? 'Done. Hover over a card to review it.' : 'Hover over a card to review it, then press Try again.';
  else if (!judged) status = 'Judge it: press a button, click a column, or press E or I.';
  else status = 'Press ' + (current < CARDS.length - 1 ? 'Next card' : 'See result') + ' (or Enter) to continue.';
  text(fitText(status, canvasWidth - margin - 205), margin + 200, drawHeight + 61);
}

function drawCriterion(x, y, w, h) {
  stroke('#c9d3da');
  strokeWeight(1);
  fill('#fbfaf7');
  rect(x, y, w, h, 6);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  let yy = y + 5;
  for (const K of KINDS) {
    const lines = wrapLines(K.name + ': ' + K.def, w - 20);
    for (let n = 0; n < lines.length; n++) {
      if (n === 0) {
        textStyle(BOLD);
        fill(K.color);
        text(K.name + ':', x + 10, yy);
        const lw = textWidth(K.name + ':') + 5;
        textStyle(NORMAL);
        fill('#1d2a33');
        text(lines[0].slice(K.name.length + 2), x + 10 + lw, yy);
      } else {
        text(lines[n], x + 10, yy);
      }
      yy += 17;
    }
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

function drawCardPanel(x, y, w, h) {
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
    if (hoverCard >= 0) { drawReview(hoverCard, x + pad, yy, tw); return; }
    for (const L of summaryLines()) {
      textSize(L.size);
      textStyle(L.style);
      fill(L.color);
      yy = drawWrapped(L.s, x + pad, yy, tw, L.size + 4) + 4;
    }
    textStyle(NORMAL);
    return;
  }

  const c = CARDS[current];
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text('PRACTICE ' + (current + 1) + ' OF ' + CARDS.length, x + pad, yy);
  yy += 18;
  fill('black');
  textSize(claimSize());
  yy = drawWrapped(c.text, x + pad, yy, tw, 23) + 4;
  textStyle(ITALIC);
  textSize(13);
  fill('#5d6d78');
  yy = drawWrapped(TEST, x + pad, yy, tw, 17) + 8;
  textStyle(NORMAL);

  if (!judged) {
    fill('#1d2a33');
    textStyle(BOLD);
    textSize(15);
    drawWrapped(QUESTION, x + pad, yy, tw, 19);
    textStyle(NORMAL);
    return;
  }
  drawFeedback(current, results[current], x + pad, yy, tw);
}

function drawFeedback(ci, r, x, y, tw) {
  const f = feedbackText(ci, r);
  textSize(15);
  textStyle(BOLD);
  fill(r.ok ? 'darkgreen' : 'firebrick');
  const headW = textWidth(f.head) + 6;
  text(f.head, x, y);
  textStyle(NORMAL);
  fill('black');
  const lines = wrapLines(f.body, tw - headW);
  text(lines[0], x + headW, y);
  const rest = lines.slice(1).join(' ');
  if (rest) return drawWrapped(rest, x, y + 19, tw, 19);
  return y + 19;
}

// After the last card, hovering a chip shows that card again
function drawReview(ci, x, y, tw) {
  const c = CARDS[ci];
  const r = results[ci];
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text('REVIEW: PRACTICE ' + (ci + 1) + (c.trap ? ' (one of the trap pair)' : ''), x, y);
  y += 18;
  fill('black');
  textSize(claimSize());
  y = drawWrapped(c.text, x, y, tw, 23) + 4;
  textStyle(NORMAL);
  textSize(14);
  fill('#3d4a52');
  y = drawWrapped('Your judgment: ' + KINDS[r.choice].name + '.', x, y, tw, 18) + 4;
  y = drawFeedback(ci, r, x, y, tw) + 4;
  if (c.serves) {
    textSize(14);
    textStyle(BOLD);
    fill(KINDS[0].color);
    const lab = 'Purpose it serves:';
    text(lab, x, y);
    const lw = textWidth(lab) + 5;
    textStyle(NORMAL);
    fill('black');
    drawWrapped(c.serves + '.', x + lw, y, tw - lw, 18);
  }
}

function drawBins(top) {
  binTop = top;
  const colW = (canvasWidth - 2 * margin) / KINDS.length;
  const headH = 28;
  const chipTop = top + headH;
  const areaH = drawHeight - 22 - chipTop;
  const narrow = colW < 230;

  chipRects = [];
  const curCi = finished ? -1 : current;
  const pos = {};   // card index -> chip rect, for the trap-pair line

  for (let i = 0; i < KINDS.length; i++) {
    const K = KINDS[i];
    const x = margin + i * colW;
    stroke('silver');
    strokeWeight(1);
    fill(i === 0 ? 'white' : 'ghostwhite');
    rect(x, chipTop, colW, areaH);
    noStroke();
    fill(K.color);
    rect(x, top, colW, headH);

    // Judged cards join the column of their correct judgment
    const placed = [];
    for (let n = 0; n < CARDS.length; n++) {
      if (results[n] && CARDS[n].kind === i && (n !== curCi || judged)) placed.push(n);
    }
    fill('white');
    textStyle(BOLD);
    textSize(narrow ? 14 : 16);
    textAlign(CENTER, CENTER);
    text(K.name + (placed.length ? ' (' + placed.length + ')' : ''), x + colW / 2, top + headH / 2);
    textStyle(NORMAL);

    for (let n = 0; n < placed.length; n++) {
      const ci = placed[n];
      const r = results[ci];
      const cx = x + 6, cy = chipTop + 5 + n * (CHIP_H + CHIP_GAP), cw = colW - 12;
      const isNew = (ci === curCi);
      stroke(r.ok ? 'seagreen' : 'firebrick');
      strokeWeight(isNew || ci === hoverCard ? 3 : 1.5);
      fill(r.ok ? 'honeydew' : 'mistyrose');
      rect(cx, cy, cw, CHIP_H, 5);
      noStroke();
      fill('black');
      textAlign(LEFT, CENTER);
      textSize(narrow ? 12 : 13);
      const mark = r.ok ? ' ✓' : ' ✗';
      const label = (ci + 1) + '. ' + CARDS[ci].chip;
      text(fitText(label, cw - 10 - textWidth(mark)) + mark, cx + 5, cy + CHIP_H / 2);
      const rr = { ci: ci, x: cx, y: cy, w: cw, h: CHIP_H };
      chipRects.push(rr);
      pos[ci] = rr;
    }
  }

  // Outline the chosen and the correct column once a card is judged
  if (!finished && judged) {
    noFill();
    strokeWeight(3);
    const c = CARDS[current];
    const r = results[current];
    if (!r.ok) {
      stroke('firebrick');
      rect(margin + r.choice * colW + 1.5, top + 1.5, colW - 3, drawHeight - 22 - top - 3);
    }
    stroke('seagreen');
    rect(margin + c.kind * colW + 1.5, top + 1.5, colW - 3, drawHeight - 22 - top - 3);
  } else if (!finished && !judged) {
    const k = Math.floor((mouseX - margin) / colW);
    if (mouseY > top && mouseY < drawHeight - 22 && k >= 0 && k < KINDS.length) {
      noFill();
      stroke(KINDS[k].color);
      strokeWeight(2);
      drawingContext.setLineDash([6, 4]);
      rect(margin + k * colW + 1.5, top + 1.5, colW - 3, drawHeight - 22 - top - 3);
      drawingContext.setLineDash([]);
    }
  }

  // After the last card, link the trap pair: the purpose and one form of it.
  // An elbow runs along the gap between the columns so it crosses no other card.
  if (finished && pos[TRAP[0]] && pos[TRAP[1]]) {
    const a = pos[TRAP[0]], b = pos[TRAP[1]];
    const ink = '#3E4F7A';
    const gx = margin + colW;
    const y1 = a.y + a.h / 2, y2 = b.y + b.h / 2;
    noFill();
    stroke(ink);
    strokeWeight(3);
    rect(a.x, a.y, a.w, a.h, 5);
    rect(b.x, b.y, b.w, b.h, 5);
    strokeWeight(2.5);
    line(a.x + a.w, y1, gx, y1);
    line(gx, y1, gx, y2);
    line(gx, y2, b.x, y2);
    const ly = Math.max(a.y + a.h, b.y + b.h) + 14;
    line(gx, y2, gx, ly - 9);
    const lab = 'purpose and form';
    textSize(12);
    textStyle(BOLD);
    const lw = textWidth(lab) + 12;
    fill('white');
    strokeWeight(1.5);
    rect(gx - lw / 2, ly - 9, lw, 19, 9);
    noStroke();
    fill(ink);
    textAlign(CENTER, CENTER);
    text(lab, gx, ly + 1);
    textStyle(NORMAL);
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
  computeLayout();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
}
