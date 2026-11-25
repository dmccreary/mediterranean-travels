// Who Says So? Sorting Claims About Paul - p5.js 2.x
// CANVAS_HEIGHT: 520
// Fourteen statements about Paul appear one at a time, in a fixed order. The
// learner places each one in one of four bins: Paul's own letters, Acts only,
// Scholars' inference, or Later tradition. A placed card stays in the chosen
// bin, marked correct or incorrect, and the correct bin is outlined. After
// card 14 the cards regroup by their correct bin, and hovering a card shows
// its reason again. Mastery is 11 of 14 on the first attempt.

let canvasWidth = 700;
let drawHeight = 440;   // grows on narrow screens, where text wraps more (see computeLayout)
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let cardH = 130;
const CARD_TOP = 42;
const MIN_CHIP_AREA = 140;

const BINS = [
  { name: "Paul's own letters", short: 'Letters', color: '#2F6E8E',
    def: 'Stated in one of the letters scholars agree Paul wrote, whether or not Acts also says it.' },
  { name: 'Acts only', short: 'Acts only', color: '#9A5B13',
    def: 'Stated in the Book of Acts and not in Paul\'s letters.' },
  { name: "Scholars' inference", short: 'Inference', color: '#56652A',
    def: 'Not stated in any source; reasoned from the evidence.' },
  { name: 'Later tradition', short: 'Tradition', color: '#6B3E7A',
    def: 'First told by writers after the New Testament.' }
];

// bin is an index into BINS; chip is the short label shown in the bins
const CARDS = [
  { text: 'Paul had been a Pharisee.', chip: 'A Pharisee', bin: 0, alsoActs: true,
    why: 'Paul says "as to the law, a Pharisee" (Philippians 3:5); Acts agrees (Acts 23:6).' },
  { text: 'Paul was born in Tarsus.', chip: 'Born in Tarsus', bin: 1,
    why: 'Only Acts names Tarsus (Acts 22:3); Paul\'s letters never mention it.' },
  { text: 'Paul was a Roman citizen from birth.', chip: 'Roman citizen', bin: 1,
    why: 'Only Acts says so (Acts 22:28); the letters are silent, and some scholars doubt it.' },
  { text: 'Paul also had the Hebrew name Saul.', chip: 'Named Saul', bin: 1,
    why: 'Acts calls him "Saul, who is also called Paul" (Acts 13:9); in his letters he is always Paul.' },
  { text: 'Paul persecuted the followers of Jesus before his call.', chip: 'A persecutor', bin: 0, alsoActs: true,
    why: 'Paul says he "was violently persecuting the church of God" (Galatians 1:13); Acts agrees.' },
  { text: 'A light from heaven struck Paul to the ground on the road to Damascus.', chip: 'Light on the road', bin: 1,
    why: 'The light and the fall are told in Acts 9, 22, and 26; Paul says only that God revealed his Son to him (Galatians 1:16).' },
  { text: 'After his call, Paul went away into Arabia.', chip: 'Went to Arabia', bin: 0,
    why: 'Paul mentions Arabia in Galatians 1:17; Acts does not.' },
  { text: 'Paul studied in Jerusalem under the teacher Gamaliel.', chip: 'Gamaliel\'s pupil', bin: 1,
    why: 'Only Acts says so (Acts 22:3).' },
  { text: 'Paul supported himself by working with his own hands.', chip: 'Manual work', bin: 0, alsoActs: true,
    why: 'Paul says so in 1 Thessalonians 2:9 and 1 Corinthians 4:12; Acts adds that his trade was tentmaking (Acts 18:3).' },
  { text: 'Titus, a Greek, went to Jerusalem with Paul and was not made to be circumcised.', chip: 'Titus uncircumcised', bin: 0,
    why: 'Paul tells this in Galatians 2:1–3; Titus is never named in Acts.' },
  { text: 'Paul was born in the first decade of the 1st century CE.', chip: 'Born 1–10 CE', bin: 2,
    why: 'No source gives the year; it is reasoned from Acts calling him a young man (Acts 7:58) and Paul calling himself an old man (Philemon 9).' },
  { text: 'Paul\'s call came between about 33 and 36 CE.', chip: 'Call c. 33–36', bin: 2,
    why: 'No source gives the date; it is reconstructed from the intervals in Galatians 1–2 and the death of King Aretas IV around 40 CE (2 Corinthians 11:32).' },
  { text: 'Paul was short and bald, with eyebrows that met.', chip: 'Short and bald', bin: 3,
    why: 'This description comes from the Acts of Paul and Thecla, a 2nd-century story.' },
  { text: 'Paul was beheaded in Rome under Nero.', chip: 'Beheaded in Rome', bin: 3,
    why: 'Acts ends with Paul alive under house arrest; the beheading is first told by later Christian writers.' }
];
const MASTERY = 11;
const ACTS_TOO = 'Acts says it too, but Paul\'s own words come first.';

// ---------- State ----------
let current = 0;
let answered = false;
let chosen = -1;
let results = {};      // card index -> { chosen, correct }
let score = 0;
let finished = false;
let hoverCard = -1;
let chipRects = [];
let binTop = 0, binAreaTop = 0;

// ---------- Controls ----------
let binButtons = [];
let nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < BINS.length; i++) {
    const b = createButton(BINS[i].name);
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('cursor', 'pointer');
    b.style('white-space', 'nowrap');
    b.style('overflow', 'hidden');
    b.attribute('title', BINS[i].name + ' (key ' + (i + 1) + ')');
    b.mousePressed(() => choose(i));
    binButtons.push(b);
  }
  nextButton = createButton('Next card');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCard);

  againButton = createButton('Sort again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(restart);

  computeLayout();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
  restart();

  describe('A source-sorting activity about the apostle Paul. Four bins are shown with their definitions: ' +
           "Paul's own letters, Acts only, Scholars' inference, and Later tradition. One statement about Paul appears " +
           'at a time; the learner places it in a bin and reads why it belongs where it does. A running score counts ' +
           'correct first placements out of fourteen.');
}

// Card panel height: tall enough for the longest statement plus its longest feedback.
// Draw height: card panel + bins (header, definitions, room for five chips).
function computeLayout() {
  const tw = canvasWidth - 2 * margin - 28;
  let need = 0;
  for (const c of CARDS) {
    textStyle(BOLD);
    textSize(canvasWidth < 560 ? 16 : 18);
    let h = 18 + wrapLines(c.text, tw).length * 23 + 6;
    textSize(15);
    const head = 'This one belongs in ' + BINS[c.bin].name + '.';
    const headW = textWidth(head) + 6;
    textStyle(NORMAL);
    const reason = c.why + (c.alsoActs ? ' ' + ACTS_TOO : '');
    let fbLines;
    if (headW < tw * 0.6) {
      const first = wrapLines(reason, tw - headW);
      fbLines = 1 + (first.length > 1 ? wrapLines(first.slice(1).join(' '), tw).length : 0);
    } else {
      fbLines = wrapLines(head, tw).length + wrapLines(reason, tw).length;
    }
    h += fbLines * 19;
    need = Math.max(need, h);
  }
  textStyle(NORMAL);
  cardH = Math.max(110, Math.ceil(need + 20));
  const bins = 28 + binDefHeight() + MIN_CHIP_AREA + 8;
  drawHeight = Math.max(440, CARD_TOP + cardH + 10 + bins);
  canvasHeight = drawHeight + controlHeight;
}

function binDefHeight() {
  const colW = (canvasWidth - 2 * margin) / BINS.length;
  const defSize = colW < 150 ? 12 : 13;
  textSize(defSize);
  textStyle(ITALIC);
  let n = 0;
  for (const B of BINS) n = Math.max(n, wrapLines(B.def, colW - 14).length);
  textStyle(NORMAL);
  return n * (defSize + 3) + 10;
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / BINS.length;
  const narrow = colW < 150;
  for (let i = 0; i < binButtons.length; i++) {
    binButtons[i].html(narrow ? BINS[i].short : BINS[i].name);
    binButtons[i].style('font-size', narrow ? '13px' : '14px');
    binButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    binButtons[i].size(colW - 6, 30);
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

function choose(k) {
  if (answered || finished) return;
  chosen = k;
  answered = true;
  const correct = (k === CARDS[current].bin);
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
  if (key.length === 1 && key >= '1' && key <= '4') choose(int(key) - 1);
  else if (key === 'Enter') nextCard();
}

// Clicking a bin column on the canvas also places the card
function mousePressed() {
  if (answered || finished) return;
  if (mouseY < binTop || mouseY > drawHeight - 4) return;
  const colW = (canvasWidth - 2 * margin) / BINS.length;
  const k = Math.floor((mouseX - margin) / colW);
  if (k >= 0 && k < BINS.length) choose(k);
}

function updateButtonStates() {
  for (const b of binButtons) {
    if (answered || finished) b.attribute('disabled', '');
    else b.removeAttribute('disabled');
  }
  if (answered && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < CARDS.length - 1 ? 'Next card' : 'See result');
  if (finished) againButton.removeAttribute('disabled');
  else againButton.attribute('disabled', '');
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
  text(canvasWidth < 560 ? 'Who Says So?' : 'Who Says So? Sorting Claims About Paul', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('Correct: ' + score + ' of ' + CARDS.length, canvasWidth - margin, 14);

  drawCardPanel(margin, CARD_TOP, canvasWidth - 2 * margin, cardH);
  drawBins(CARD_TOP + cardH + 10);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(NORMAL);
  let status;
  if (finished) status = score >= MASTERY ? 'Done. Hover over a card to review it.' : 'Hover over a card to review it, then press Sort again.';
  else if (answered) status = 'Press ' + (current < CARDS.length - 1 ? 'Next card' : 'See result') + ' (or Enter) to continue.';
  else status = 'Choose a bin: press a button, click a bin, or press 1 to 4.';
  text(fitText(status, canvasWidth - margin - 210), margin + 205, drawHeight + 61);
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
    if (hoverCard >= 0) { drawCardDetails(hoverCard, x + pad, yy, tw, true); return; }
    textStyle(BOLD);
    textSize(17);
    fill('black');
    yy = drawWrapped('You sorted ' + score + ' of 14 correctly. Mastery is 11.', x + pad, yy, tw, 22);
    fill(score >= MASTERY ? 'darkgreen' : 'firebrick');
    textSize(15);
    yy = drawWrapped(score >= MASTERY ? 'You kept Paul\'s own words apart from what others said about him.'
                                      : 'Press Sort again to start over from card 1. Ask of each card: who says so?',
                     x + pad, yy + 2, tw, 19);
    textStyle(NORMAL);
    fill('black');
    textSize(14);
    drawWrapped('The cards are now grouped by their correct bin. Most of the vivid details of the familiar story ' +
                '(Tarsus, citizenship, the name Saul, the light) come from Acts; the letters give the inner story ' +
                '(Pharisee, persecutor, Arabia, work with his hands).', x + pad, yy + 5, tw, 18);
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
  text(review ? 'REVIEW: STATEMENT ' + (ci + 1) : 'STATEMENT ' + (ci + 1) + ' OF ' + CARDS.length, x, yy);
  yy += 18;
  fill('black');
  textSize(canvasWidth < 560 ? 16 : 18);
  yy = drawWrapped(c.text, x, yy, tw, 23) + 6;
  textStyle(NORMAL);

  const r = results[ci];
  if (!review && !answered) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(16);
    drawWrapped('Who says so?', x, yy, tw, 20);
    textStyle(NORMAL);
    return;
  }
  let reason = c.why;
  if (!r.correct && c.alsoActs && r.chosen === 1) reason += ' ' + ACTS_TOO;
  const head = r.correct ? 'Correct.' : 'This one belongs in ' + BINS[c.bin].name + '.';
  textSize(15);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  const headW = textWidth(head) + 6;
  if (headW < tw * 0.6) {
    text(head, x, yy);
    textStyle(NORMAL);
    fill('black');
    const lines = wrapLines(reason, tw - headW);
    text(lines[0], x + headW, yy);
    const rest = lines.slice(1).join(' ');
    if (rest) drawWrapped(rest, x, yy + 19, tw, 19);
  } else {
    yy = drawWrapped(head, x, yy, tw, 19);
    textStyle(NORMAL);
    fill('black');
    drawWrapped(reason, x, yy + 1, tw, 19);
  }
}

function drawBins(top) {
  binTop = top;
  const colW = (canvasWidth - 2 * margin) / BINS.length;
  const headH = 28;
  const narrow = colW < 150;
  const defSize = narrow ? 12 : 13;
  const defLineH = defSize + 3;

  // Definition block height: the tallest definition sets it for all four
  const defH = binDefHeight();
  binAreaTop = top + headH + defH;
  const areaH = drawHeight - binAreaTop - 8;

  chipRects = [];
  const curCi = finished ? -1 : current;

  for (let i = 0; i < BINS.length; i++) {
    const B = BINS[i];
    const x = margin + i * colW;
    stroke('silver');
    strokeWeight(1);
    fill(i % 2 === 0 ? 'white' : 'ghostwhite');
    rect(x, top + headH, colW, defH + areaH);
    noStroke();
    fill(B.color);
    rect(x, top, colW, headH);

    // Placed cards: during the sort, in the bin the learner chose; at the end, in the correct bin
    const placed = [];
    for (let n = 0; n < CARDS.length; n++) {
      if (!results[n]) continue;
      const where = finished ? CARDS[n].bin : results[n].chosen;
      if (where === i) placed.push(n);
    }
    fill('white');
    textStyle(BOLD);
    textSize(narrow ? 13 : 15);
    textAlign(CENTER, CENTER);
    text(fitText((narrow ? B.short : B.name) + (placed.length ? ' (' + placed.length + ')' : ''), colW - 6), x + colW / 2, top + headH / 2);

    // Definition
    textStyle(ITALIC);
    textSize(defSize);
    fill('#3d4a52');
    textAlign(LEFT, TOP);
    drawWrapped(B.def, x + 7, top + headH + 5, colW - 14, defLineH);
    textStyle(NORMAL);
    stroke('#d8dee2');
    line(x + 6, binAreaTop - 2, x + colW - 6, binAreaTop - 2);
    noStroke();

    const gap = 3;
    const slots = Math.max(5, placed.length);
    const chipH = Math.min(24, Math.floor((areaH - 6) / slots) - gap);
    for (let n = 0; n < placed.length; n++) {
      const ci = placed[n];
      const cx = x + 5, cy = binAreaTop + 4 + n * (chipH + gap), cw = colW - 10;
      const isNew = (ci === curCi);
      const ok = results[ci].correct;
      stroke(ok ? 'seagreen' : 'firebrick');
      strokeWeight(isNew || ci === hoverCard ? 3 : 1.5);
      fill(ok ? 'honeydew' : 'mistyrose');
      rect(cx, cy, cw, chipH, 5);
      noStroke();
      fill('black');
      textAlign(LEFT, CENTER);
      textSize(Math.max(8, Math.min(narrow ? 11 : 13, chipH - 3)));
      text(fitText((ci + 1) + '. ' + CARDS[ci].chip + (ok ? ' ✓' : ' ✗'), cw - 8), cx + 5, cy + chipH / 2);
      chipRects.push({ ci: ci, x: cx, y: cy, w: cw, h: chipH });
    }
  }

  // Outline the chosen and the correct bin for the card just placed
  if (answered && !finished) {
    const ci = current;
    noFill();
    strokeWeight(3);
    if (chosen !== CARDS[ci].bin) {
      stroke('firebrick');
      rect(margin + chosen * colW + 1.5, top + 1.5, colW - 3, drawHeight - top - 11);
    }
    stroke('seagreen');
    rect(margin + CARDS[ci].bin * colW + 1.5, top + 1.5, colW - 3, drawHeight - top - 11);
  } else if (!answered && !finished) {
    // Hover hint: which bin a click would choose
    const k = Math.floor((mouseX - margin) / colW);
    if (mouseY > top && mouseY < drawHeight - 4 && k >= 0 && k < BINS.length) {
      noFill();
      stroke(BINS[k].color);
      strokeWeight(2);
      drawingContext.setLineDash([6, 4]);
      rect(margin + k * colW + 1.5, top + 1.5, colW - 3, drawHeight - top - 11);
      drawingContext.setLineDash([]);
    }
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
