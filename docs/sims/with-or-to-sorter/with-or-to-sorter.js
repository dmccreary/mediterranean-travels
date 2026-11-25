// With or To? - p5.js 2.x
// CANVAS_HEIGHT: 555
// Eight cards, shown one at a time in a fixed order: six route stories and two
// imagined AI projects. The learner judges each one "Done with people" or
// "Done to people" against four questions that are always visible. Feedback
// appears at once; the first placement is scored, and a wrongly placed card
// may then be moved to the other bin (no score change). Mastery: 6 of 8.

let canvasWidth = 700;
let drawHeight = 520;   // set by computeLayout
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let qH = 50;
let cardH = 180;
const CHIP_H = 24;
const CHIP_GAP = 4;
const BIN_ROWS = 5;

const BINS = [
  { name: 'Done with people', short: 'With', color: '#2f6b4f', tint: '#e3f0e8', key: 'W' },
  { name: 'Done to people', short: 'To', color: '#a4442a', tint: '#f8e7e1', key: 'T' }
];
const QUESTIONS = ['Who chose it?', 'Whose language is it in?', 'Who was consulted?', 'Who keeps it going?'];
const PROMPT = 'Was this done with the people it affected, or done to them?';

// bin: 0 with, 1 to; src: chapter the story comes from (null for imagined)
const CARDS = [
  { chip: 'Greek letters, c. 800 BCE', bin: 0, src: 'Chapter 2',
    text: 'Greek traders adopt the Phoenician letters and add vowels to write their own language, about 800 BCE.',
    why: 'The people who used the script chose it for their own purposes; no one imposed it.' },
  { chip: 'Senate expels teachers, 161 BCE', bin: 1, src: 'Chapter 12',
    text: 'The Roman Senate expels Greek philosophers and teachers of rhetoric from Rome, 161 BCE.',
    why: 'The Senate decided for Roman learners which teachers they could have.' },
  { chip: 'Justinian’s law, 529 CE', bin: 1, src: 'Chapter 4',
    text: 'Justinian issues a law forbidding pagans to teach, 529 CE.',
    why: 'An emperor decided by law who could teach, and a school with centuries of teaching ended soon after.' },
  { chip: 'Hebrew press, 1493', bin: 0, src: 'Chapter 6',
    text: 'The ibn Nahmias brothers, Sephardic refugees, print a code of Jewish law in Istanbul in their community’s script, dated 1493.',
    why: 'Members of the community printed a book for it, in its own script.' },
  { chip: 'Carnegie libraries', bin: 0, src: 'Chapter 10',
    text: 'Andrew Carnegie pays for a library building only if the town provides the land and promises to pay for books, staff, and upkeep every year, 1883–1929.',
    why: 'The town had to choose the library and keep paying for it, so the community shared the decision and the cost.',
    extra: 'A donor paid, but the town chose the library and kept it running.' },
  { chip: 'Alphabet law, 1928', bin: 1, src: 'Chapter 7',
    text: 'Turkey replaces the Arabic script with a Latin-based alphabet by law within months, and bans the old script from public use, 1928.',
    why: 'It widened literacy, but it was imposed by a one-party government without a vote.',
    extra: 'Whether a reform helped and how it was made are separate questions.' },
  { chip: 'One AI tutor for all', bin: 1, src: null,
    text: 'A national ministry signs one contract and installs the same English-language AI tutor in every primary school by next term, without asking teachers or families.',
    why: 'It was chosen far away, in a language many children may not speak, with no one consulted.' },
  { chip: 'Village AI reader', bin: 0, src: null,
    text: 'Village teachers and parents choose the stories their AI reading tutor uses, have it read them aloud in the children’s own language, and check its translations before each term.',
    why: 'The community chooses the content and the language and keeps checking the tool.',
    extra: 'Using AI is not top-down in itself; it depends on who chose it and who keeps checking it.' }
];
const N = CARDS.length;
const MASTERY = 6;

// ---------- State ----------
let current = 0;
let placed = {};      // card -> { first, bin, ok }  (bin = where it is now)
let score = 0;
let finished = false;
let hoverCard = -1;
let chipRects = [];
let binTop = 0;

// ---------- Controls ----------
let binButtons = [];
let nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let b = 0; b < BINS.length; b++) {
    const btn = createButton(BINS[b].name);
    btn.parent(document.querySelector('main'));
    btn.style('font-size', '15px');
    btn.style('font-weight', 'bold');
    btn.style('color', 'white');
    btn.style('background-color', BINS[b].color);
    btn.style('border', '1px solid ' + BINS[b].color);
    btn.style('border-radius', '4px');
    btn.style('white-space', 'nowrap');
    btn.attribute('title', BINS[b].name + ' (key ' + BINS[b].key + ')');
    btn.mousePressed(() => placeCurrent(b));
    binButtons.push(btn);
  }
  nextButton = createButton('Next card');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCard);

  againButton = createButton('Start over');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(restart);

  computeLayout();
  resizeCanvas(canvasWidth, canvasHeight);
  restart();

  describe('A judging activity with eight cards: six efforts to widen or control learning from the trip, such as the ' +
           'Greek alphabet, Justinian’s law of 529, Carnegie libraries and the Turkish alphabet law of 1928, and two ' +
           'imagined AI projects. Four judging questions stay visible. The learner places each card in one of two bins, ' +
           'Done with people or Done to people, and reads feedback at once. A score counts correct first placements.');
}

// ---------- Layout ----------
const isNarrow = () => canvasWidth < 560;
const claimSize = () => (isNarrow() ? 15 : 17);

function feedbackFor(ci, firstBin) {
  const c = CARDS[ci];
  if (firstBin === c.bin) return { head: 'Yes.', body: c.why, ok: true };
  return { head: 'Look again at the four questions.', body: c.why + (c.extra ? ' ' + c.extra : ''), ok: false };
}

function feedbackLines(f, tw) {
  textSize(14);
  textStyle(BOLD);
  const headW = textWidth(f.head) + 6;
  textStyle(NORMAL);
  const first = wrapLines(f.body, tw - headW);
  return 1 + (first.length > 1 ? wrapLines(first.slice(1).join(' '), tw).length : 0);
}

// The questions flow left to right and wrap; returns { x, y } offsets per question
function questionSlots(w) {
  textSize(14);
  textStyle(NORMAL);
  const slots = [];
  let cx = 0, row = 0;
  for (let i = 0; i < QUESTIONS.length; i++) {
    const qw = 18 + textWidth(QUESTIONS[i]);
    if (cx > 0 && cx + qw > w) { cx = 0; row++; }
    slots.push({ x: cx, row: row });
    cx += qw + 22;
  }
  return slots;
}

function computeLayout() {
  const tw = canvasWidth - 2 * margin - 28;
  const slots = questionSlots(canvasWidth - 2 * margin - 20);
  qH = 26 + (slots[slots.length - 1].row + 1) * 20;
  let need = 0;
  for (let ci = 0; ci < N; ci++) {
    textStyle(BOLD);
    textSize(claimSize());
    let h = 10 + 18 + wrapLines(CARDS[ci].text, tw).length * (claimSize() + 5) + 8;
    const f = feedbackFor(ci, 1 - CARDS[ci].bin);
    h += feedbackLines(f, tw) * 19 + 22;   // feedback plus the "move it" hint
    need = Math.max(need, h);
  }
  textStyle(NORMAL);
  need = Math.max(need, summaryHeight(tw));
  cardH = Math.ceil(need + 8);
  const bins = 28 + BIN_ROWS * (CHIP_H + CHIP_GAP) + 6;
  drawHeight = 40 + qH + 8 + cardH + 8 + bins + 10;
  canvasHeight = drawHeight + controlHeight;
}

function summaryLines() {
  const ok = score >= MASTERY;
  return [
    { s: 'First-try score: ' + score + ' of 8.', size: 18, style: BOLD, color: 'black' },
    { s: ok ? 'You can judge how a change was made, not only whether it worked.'
            : 'Go back to the four questions and try the cards you missed.',
      size: 15, style: BOLD, color: ok ? 'darkgreen' : 'firebrick' },
    { s: 'The alphabet law of 1928 sits in “Done to people” even though it widened literacy, and the Carnegie ' +
         'libraries sit in “Done with people” even though a rich donor paid. Hover over a card to read it again.',
      size: 14, style: NORMAL, color: '#1d2a33' }
  ];
}

function summaryHeight(tw) {
  const save = score;
  score = 0;
  let h = 10;
  for (const L of summaryLines()) {
    textSize(L.size);
    textStyle(L.style);
    h += wrapLines(L.s, tw).length * (L.size + 5) + 4;
  }
  score = save;
  textStyle(NORMAL);
  return h;
}

function positionControls() {
  const gap = 8;
  const colW = (canvasWidth - 2 * margin - gap) / 2;
  for (let b = 0; b < binButtons.length; b++) {
    binButtons[b].position(margin + b * (colW + gap), drawHeight + 8);
    binButtons[b].size(colW, 32);
  }
  nextButton.position(margin, drawHeight + 46);
  againButton.position(margin + 104, drawHeight + 46);
}

function enable(btn, on) {
  if (on) { btn.removeAttribute('disabled'); btn.style('opacity', '1'); btn.style('cursor', 'pointer'); }
  else { btn.attribute('disabled', ''); btn.style('opacity', '0.45'); btn.style('cursor', 'default'); }
}

function updateButtonStates() {
  const p = placed[current];
  for (let b = 0; b < BINS.length; b++) {
    // before placing: both bins; after a wrong first placement: the other bin, to move it
    const on = !finished && (!p || (!p.ok && p.bin !== b));
    enable(binButtons[b], on);
  }
  enable(nextButton, !finished && !!p);
  nextButton.html(current < N - 1 ? 'Next card' : 'See result');
  enable(againButton, true);
}

// ---------- Flow ----------
function restart() {
  current = 0;
  placed = {};
  score = 0;
  finished = false;
  hoverCard = -1;
  positionControls();
  updateButtonStates();
}

function placeCurrent(b) {
  if (finished) return;
  const p = placed[current];
  if (!p) {
    const ok = b === CARDS[current].bin;
    if (ok) score++;
    placed[current] = { first: b, bin: b, ok: ok };
  } else if (!p.ok && p.bin !== b) {
    p.bin = b;            // moved after feedback; the score does not change
  }
  updateButtonStates();
}

function nextCard() {
  if (finished || !placed[current]) return;
  if (current < N - 1) current++;
  else finished = true;
  updateButtonStates();
}

function keyPressed() {
  if (key === 'w' || key === 'W' || key === '1') placeCurrent(0);
  else if (key === 't' || key === 'T' || key === '2') placeCurrent(1);
  else if (key === 'Enter') nextCard();
}

function mousePressed() {
  if (finished) return;
  if (mouseY < binTop || mouseY > drawHeight - 8 || mouseX < margin || mouseX > canvasWidth - margin) return;
  const colW = (canvasWidth - 2 * margin - 8) / 2;
  const b = mouseX < margin + colW + 4 ? 0 : 1;
  const p = placed[current];
  if (!p || (!p.ok && p.bin !== b)) placeCurrent(b);
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
  textSize(isNarrow() ? 18 : 22);
  text('With or To?', margin, 10);
  textStyle(NORMAL);
  textSize(15);
  textAlign(RIGHT, TOP);
  text('First try: ' + score + ' of ' + N, canvasWidth - margin, 14);

  drawQuestions(margin, 40, canvasWidth - 2 * margin, qH);
  drawCardPanel(margin, 40 + qH + 8, canvasWidth - 2 * margin, cardH);
  drawBins(40 + qH + 8 + cardH + 8, drawHeight - 10);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(13);
  const p = placed[current];
  let status;
  if (finished) status = 'Hover over a card to review it.';
  else if (!p) status = 'Place the card: press a bin button, click a bin, or press W or T.';
  else if (!p.ok && p.bin === p.first) status = 'You may move it to the other bin. Then press ' + (current < N - 1 ? 'Next card.' : 'See result.');
  else status = 'Press ' + (current < N - 1 ? 'Next card' : 'See result') + ' (or Enter) to continue.';
  text(fitText(status, canvasWidth - margin - 220), margin + 210, drawHeight + 61);
}

function drawQuestions(x, y, w, h) {
  stroke('#c9d3da');
  strokeWeight(1);
  fill('#fbfaf7');
  rect(x, y, w, h, 6);
  noStroke();
  fill('#4a3b10');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(12);
  text('THE FOUR JUDGING QUESTIONS', x + 10, y + 6);
  textStyle(NORMAL);
  const slots = questionSlots(w - 20);
  textSize(14);
  for (let i = 0; i < QUESTIONS.length; i++) {
    const cx = x + 10 + slots[i].x;
    const cy = y + 24 + slots[i].row * 20;
    fill('#4a3b10');
    textStyle(BOLD);
    text((i + 1) + '.', cx, cy);
    textStyle(NORMAL);
    fill('#1d2a33');
    text(QUESTIONS[i], cx + 18, cy);
  }
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
    if (hoverCard >= 0) { drawCard(hoverCard, x + pad, yy, tw, true); return; }
    for (const L of summaryLines()) {
      textSize(L.size);
      textStyle(L.style);
      fill(L.color);
      yy = drawWrapped(L.s, x + pad, yy, tw, L.size + 5) + 4;
    }
    textStyle(NORMAL);
    return;
  }
  drawCard(current, x + pad, yy, tw, false);
}

function drawCard(ci, x, y, tw, review) {
  const c = CARDS[ci];
  const p = placed[ci];
  textSize(12);
  textStyle(BOLD);
  const tag = c.src ? 'ROUTE STORY · FROM ' + c.src.toUpperCase() : 'IMAGINED AI PROJECT';
  const head = (review ? 'REVIEW: ' : '') + 'CARD ' + (ci + 1) + ' OF ' + N + ' · ';
  fill('dimgray');
  text(head, x, y);
  fill(c.src ? '#4a5a66' : '#7a4b9a');
  text(tag, x + textWidth(head.trim()) + 5, y);
  y += 18;
  fill('black');
  textSize(claimSize());
  y = drawWrapped(c.text, x, y, tw, claimSize() + 5) + 8;
  textStyle(NORMAL);

  if (!p) {
    fill('#1d2a33');
    textStyle(ITALIC);
    textSize(15);
    drawWrapped(PROMPT, x, y, tw, 19);
    textStyle(NORMAL);
    return;
  }
  const f = feedbackFor(ci, p.first);
  textSize(14);
  textStyle(BOLD);
  fill(f.ok ? 'darkgreen' : 'firebrick');
  const headW = textWidth(f.head) + 6;
  text(f.head, x, y);
  textStyle(NORMAL);
  fill('black');
  const lines = wrapLines(f.body, tw - headW);
  text(lines[0], x + headW, y);
  const rest = lines.slice(1).join(' ');
  y = rest ? drawWrapped(rest, x, y + 19, tw, 19) : y + 19;
  textSize(13);
  textStyle(ITALIC);
  fill('#4a5a66');
  let note = 'Your first placement: ' + BINS[p.first].name + '.';
  if (!p.ok && p.bin !== p.first) note += ' Moved to ' + BINS[p.bin].name + ' (the score does not change).';
  text(fitText(note, tw), x, y + 3);
  textStyle(NORMAL);
}

function drawBins(top, bottom) {
  binTop = top;
  const gap = 8;
  const colW = (canvasWidth - 2 * margin - gap) / 2;
  const h = bottom - top;
  chipRects = [];
  const p = placed[current];
  for (let b = 0; b < BINS.length; b++) {
    const B = BINS[b];
    const x = margin + b * (colW + gap);
    const canDrop = !finished && (!p || (!p.ok && p.bin !== b));
    const hot = canDrop && mouseX > x && mouseX < x + colW && mouseY > top && mouseY < bottom;
    stroke(B.color);
    strokeWeight(hot ? 3 : 1.5);
    fill(hot ? '#fffbe9' : B.tint);
    rect(x, top, colW, h, 8);
    noStroke();
    fill(B.color);
    rect(x, top, colW, 28, 8, 8, 0, 0);

    const members = [];
    for (let i = 0; i < N; i++) if (placed[i] && placed[i].bin === b) members.push(i);
    fill('white');
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(isNarrow() ? 14 : 16);
    text(B.name + (members.length ? ' (' + members.length + ')' : ''), x + 10, top + 14);
    textStyle(NORMAL);

    const cols = members.length > BIN_ROWS ? 2 : 1;
    const cg = 5;
    const cw = (colW - 12 - (cols - 1) * cg) / cols;
    for (let k = 0; k < members.length; k++) {
      const ci = members[k];
      const q = placed[ci];
      const cx = x + 6 + Math.floor(k / BIN_ROWS) * (cw + cg);
      const cy = top + 32 + (k % BIN_ROWS) * (CHIP_H + CHIP_GAP);
      const okNow = q.bin === CARDS[ci].bin;
      const isNew = ci === current && !finished;
      stroke(okNow ? 'seagreen' : 'firebrick');
      strokeWeight(isNew || ci === hoverCard ? 3 : 1.5);
      if (!q.ok) drawingContext.setLineDash([4, 3]);
      fill(q.ok ? 'honeydew' : okNow ? '#f3f7ef' : 'mistyrose');
      rect(cx, cy, cw, CHIP_H, 5);
      drawingContext.setLineDash([]);
      noStroke();
      fill(q.ok ? 'seagreen' : 'firebrick');
      rect(cx + 3, cy + 3, 20, CHIP_H - 6, 4);
      fill('white');
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      textSize(12);
      text(ci + 1, cx + 13, cy + CHIP_H / 2 + 1);
      textStyle(NORMAL);
      fill('#1d2a33');
      textAlign(LEFT, CENTER);
      textSize(13);
      // ✓ correct first time, ✗ wrong first time ("moved" once moved to the right bin)
      const mark = q.ok ? ' ✓' : okNow ? ' ✗, moved' : ' ✗';
      text(fitText(CARDS[ci].chip, cw - 34 - textWidth(mark)) + mark, cx + 28, cy + CHIP_H / 2 + 1);
      chipRects.push({ ci: ci, x: cx, y: cy, w: cw, h: CHIP_H });
    }
    if (!members.length) {
      fill(B.color);
      textAlign(CENTER, CENTER);
      textStyle(ITALIC);
      textSize(13);
      text('Empty', x + colW / 2, (top + 28 + bottom) / 2);
      textStyle(NORMAL);
    }
  }
  hoverCard = -1;
  if (finished) {
    for (const r of chipRects) {
      if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) hoverCard = r.ci;
    }
  }
  cursor(hoverCard >= 0 ? HAND : ARROW);
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
  computeLayout();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
}

// A little state for headless testing
window.withOrTo = {
  place: b => placeCurrent(b), next: () => nextCard(), score: () => score, height: () => canvasHeight,
  playAll: wrongEvery => {
    for (let i = 0; i < N; i++) {
      const right = CARDS[current].bin;
      if (wrongEvery && current % wrongEvery === 0) { placeCurrent(1 - right); if (current % 2 === 0) placeCurrent(right); }
      else placeCurrent(right);
      nextCard();
    }
  }
};
