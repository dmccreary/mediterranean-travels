// Documented, Debated, or Tradition? - p5.js 2.x
// CANVAS_HEIGHT: 597
// Ten claims about the Christian sites of Ephesus and Selçuk appear one at a
// time, in a fixed order. For each, the learner first rates the evidence
// (Documented, Debated, or Tradition only), then chooses one of two reasons,
// shown in random order. A card is correct only when both the rating and the
// reason match. Feedback follows, and the card joins a summary column under its
// correct rating. Mastery is 8 of 10 on the first attempt.

let canvasWidth = 700;
let drawHeight = 517;   // set by computeLayout from the longest card
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
let cardH = 250;
const CARD_TOP = 42;
const MIN_CHIP_AREA = 5 * 26 + 6;

const RATINGS = [
  { name: 'Documented', color: '#2F6E8E',
    def: 'Contemporary or near-contemporary written or archaeological evidence supports it.' },
  { name: 'Debated', color: '#9A5B13',
    def: 'Some early evidence supports it, but scholars disagree about whether it is reliable.' },
  { name: 'Tradition only', color: '#6B3E7A',
    def: 'First recorded long after the events, with no early evidence for or against.' }
];

// rating: index into RATINGS; good: the correct reason; bad: the wrong reason offered
const CARDS = [
  { text: 'The Council of Ephesus met in the Church of Mary in 431 CE.', chip: 'Council in the Church of Mary', rating: 0,
    good: 'The council’s own records name the church.',
    bad: 'Guides have always said so.',
    fb: 'The acts of the council, written at the time, place it in the church called Mary.' },
  { text: 'Justinian built a great domed basilica on the hill of Ayasuluk.', chip: 'Justinian’s basilica', rating: 0,
    good: 'Procopius, writing in Justinian’s reign, describes it, and the ruins match.',
    bad: 'It is the largest ruin in Selçuk.',
    fb: 'A contemporary author and the excavated building agree.' },
  { text: 'The tower on Bülbül Dağı was a prison where Paul was held.', chip: 'Tower was Paul’s prison', rating: 2,
    good: 'The tower is a Hellenistic wall tower; no early source links it to Paul.',
    bad: 'Acts describes Paul’s imprisonment in this tower.',
    fb: 'Acts mentions no imprisonment in Ephesus; the name is a later local tradition.' },
  { text: 'The tower on Bülbül Dağı was part of the city wall of Lysimachus.', chip: 'Tower in Lysimachus’ wall', rating: 0,
    good: 'Its masonry and its position on the line of the wall date it to the early 3rd century BCE.',
    bad: 'Paul was imprisoned there.',
    fb: 'The building itself is securely dated; only its name is tradition.' },
  { text: 'John the Apostle is buried beneath the Basilica of St. John.', chip: 'John’s tomb in the basilica', rating: 2,
    good: 'The earliest written claim, about 190 CE, comes about a century after his death.',
    bad: 'A tomb is marked beneath the dome.',
    fb: 'A marked tomb shows what pilgrims believed, not who lies there.' },
  { text: 'John the Apostle lived at Ephesus in his old age.', chip: 'John lived at Ephesus', rating: 1,
    good: 'Irenaeus (about 180 CE) says so, but scholars dispute which John he meant.',
    bad: 'No ancient writer mentions it.',
    fb: 'The tradition is early and local, and scholars still argue over how reliable it is.' },
  { text: 'Silversmiths rioted in the theater of Ephesus against Paul.', chip: 'The silversmiths’ riot', rating: 1,
    good: 'Only Acts tells it, written a generation later, though its local details fit the city.',
    bad: 'Inscriptions record the riot.',
    fb: 'No inscription records the riot; Acts’ accurate local detail makes it plausible but not proven.' },
  { text: 'Mary, the mother of Jesus, lived her last years in the house on Bülbül Dağı.', chip: 'Mary’s last home', rating: 2,
    good: 'The identification comes from 19th-century visions; the chapel is mostly Byzantine.',
    bad: 'Three popes have visited it.',
    fb: 'Papal visits honor the pilgrimage; the Church has not ruled on the identification.' },
  { text: 'The chapel on Bülbül Dağı is a place where Christians and Muslims pray today.', chip: 'Shared prayer today', rating: 0,
    good: 'Visitors of both faiths can be seen praying there now.',
    bad: 'The chapel’s identification is unproven, so it is not a real holy place.',
    fb: 'Whatever its history, its present role as a shared place of prayer is a plain fact.',
    extra: 'Tradition about the past does not change what happens there today.' },
  { text: 'Paul spent two to three years based in Ephesus.', chip: 'Paul’s years in Ephesus', rating: 0,
    good: 'Paul’s own letters, written from Ephesus, and Acts both place him there.',
    bad: 'The Basilica of St. John honors him.',
    fb: 'Paul’s letters are primary sources; 1 Corinthians was written from Ephesus.' }
];
const MASTERY = 8;

// ---------- State ----------
let current = 0;
let stage = 'rate';    // rate -> reason -> done (per card)
let rated = -1;        // rating chosen for the current card
let order = [];        // per card: [first, second] reasons, each 'good' or 'bad'
let results = {};      // card index -> { rating, reason, ok, ratingOk }
let score = 0;
let finished = false;
let hoverCard = -1;
let chipRects = [];
let binTop = 0;
let reasonTop = 0;     // y of the first reason button inside the card panel
let reasonH = [0, 0];

// ---------- Controls ----------
let rateButtons = [];
let reasonButtons = [];
let nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < RATINGS.length; i++) {
    const b = createButton(RATINGS[i].name);
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('cursor', 'pointer');
    b.style('white-space', 'nowrap');
    b.attribute('title', RATINGS[i].name + ' (key ' + (i + 1) + ')');
    b.mousePressed(() => rate(i));
    rateButtons.push(b);
  }
  for (let j = 0; j < 2; j++) {
    const b = createButton('');
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('line-height', '18px');
    b.style('text-align', 'left');
    b.style('white-space', 'normal');
    b.style('padding', '4px 10px');
    b.style('border-radius', '6px');
    b.style('cursor', 'pointer');
    b.style('font-family', 'Arial, Helvetica, sans-serif');
    b.attribute('title', 'Reason ' + (j === 0 ? 'A' : 'B') + ' (key ' + (j === 0 ? 'A' : 'B') + ')');
    b.mousePressed(() => chooseReason(j));
    reasonButtons.push(b);
  }
  nextButton = createButton('Next card');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCard);

  againButton = createButton('Judge again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(restart);

  computeLayout();
  resizeCanvas(canvasWidth, canvasHeight);
  restart();

  describe('An evidence-rating activity about the Christian sites of Ephesus and Selçuk. Three columns are shown ' +
           'with their definitions: Documented, Debated, and Tradition only. One claim appears at a time; the learner ' +
           'rates the strength of its evidence, then chooses one of two reasons, and reads feedback. A running score ' +
           'counts cards with both the rating and the reason correct, out of ten.');
}

// ---------- Layout ----------
function claimSize() { return canvasWidth < 560 ? 16 : 18; }

function reasonButtonHeight(str, w) {
  textSize(14);
  textStyle(NORMAL);
  return wrapLines(str, w - 30).length * 18 + 12;
}

function feedbackText(ci, r) {
  const c = CARDS[ci];
  let head, body = c.fb;
  if (r.ok) head = 'Correct.';
  else if (r.ratingOk) head = 'Right rating, but look again at why:';
  else head = 'This one is ' + RATINGS[c.rating].name + '.';
  if (!r.ok) body += ' The better reason: ' + c.good;
  if (!r.ok && c.extra) body += ' ' + c.extra;
  return { head: head, body: body };
}

// Card panel: tall enough for the longest claim, its two reasons, and its longest feedback
function computeLayout() {
  const tw = canvasWidth - 2 * margin - 28;
  let need = 0;
  for (let ci = 0; ci < CARDS.length; ci++) {
    const c = CARDS[ci];
    textStyle(BOLD);
    textSize(claimSize());
    let h = 18 + wrapLines(c.text, tw).length * 23 + 4;
    h += 20;                                                       // "Why?" line
    h += reasonButtonHeight(c.good, tw) + reasonButtonHeight(c.bad, tw) + 6 + 8;
    // Longest feedback: a wrong rating, with the better reason and any extra note
    const f = feedbackText(ci, { ok: false, ratingOk: false });
    textSize(15);
    textStyle(BOLD);
    const headW = textWidth(f.head) + 6;
    textStyle(NORMAL);
    const first = wrapLines(f.body, tw - headW);
    const fbLines = 1 + (first.length > 1 ? wrapLines(first.slice(1).join(' '), tw).length : 0);
    h += fbLines * 19;
    need = Math.max(need, h);
  }
  textStyle(NORMAL);
  cardH = Math.max(200, Math.ceil(need + 16));
  const bins = 28 + binDefHeight() + MIN_CHIP_AREA + 8;
  drawHeight = CARD_TOP + cardH + 10 + bins;
  canvasHeight = drawHeight + controlHeight;
}

function binDefHeight() {
  const colW = (canvasWidth - 2 * margin) / RATINGS.length;
  const defSize = colW < 170 ? 12 : 13;
  textSize(defSize);
  textStyle(ITALIC);
  let n = 0;
  for (const R of RATINGS) n = Math.max(n, wrapLines(R.def, colW - 14).length);
  textStyle(NORMAL);
  return n * (defSize + 3) + 10;
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / RATINGS.length;
  for (let i = 0; i < rateButtons.length; i++) {
    rateButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    rateButtons[i].size(colW - 6, 30);
  }
  nextButton.position(margin, drawHeight + 46);
  againButton.position(margin + 100, drawHeight + 46);
  positionReasons();
}

// The two reason buttons sit inside the card panel, under the claim
function positionReasons() {
  const tw = canvasWidth - 2 * margin - 28;
  const show = !finished && stage !== 'rate';
  let y = reasonTop;
  for (let j = 0; j < 2; j++) {
    const b = reasonButtons[j];
    if (!show) { b.hide(); continue; }
    const which = order[current][j];
    const str = (j === 0 ? 'A. ' : 'B. ') + CARDS[current][which];
    b.html(str);
    const h = reasonButtonHeight(str, tw);
    reasonH[j] = h;
    b.position(margin + 14, y);
    b.size(tw, h);
    b.show();
    y += h + 6;
  }
  styleReasons();
}

function styleReasons() {
  for (let j = 0; j < 2; j++) {
    const b = reasonButtons[j];
    const which = order[current] ? order[current][j] : 'good';
    let bg = '#f6f8fa', border = '#8aa0b0', color = '#1d2a33';
    if (stage === 'done') {
      const r = results[current];
      if (which === 'good') { bg = '#e6f4e6'; border = '#2e7d32'; }
      else if (r.reason === 'bad') { bg = '#fbe3e3'; border = '#c62828'; }
      else { color = '#7a8893'; }
      b.attribute('disabled', '');
      b.style('cursor', 'default');
    } else {
      b.removeAttribute('disabled');
      b.style('cursor', 'pointer');
    }
    b.style('background', bg);
    b.style('border', '2px solid ' + border);
    b.style('color', color);
  }
}

// ---------- Flow ----------
function restart() {
  current = 0;
  stage = 'rate';
  rated = -1;
  results = {};
  score = 0;
  finished = false;
  hoverCard = -1;
  order = CARDS.map(() => (random() < 0.5 ? ['good', 'bad'] : ['bad', 'good']));
  positionControls();
  updateButtonStates();
}

function rate(k) {
  if (finished || stage !== 'rate') return;
  rated = k;
  stage = 'reason';
  positionReasons();
  updateButtonStates();
}

function chooseReason(j) {
  if (finished || stage !== 'reason') return;
  const c = CARDS[current];
  const reason = order[current][j];
  const ratingOk = (rated === c.rating);
  const ok = ratingOk && reason === 'good';
  if (ok) score++;
  results[current] = { rating: rated, reason: reason, ok: ok, ratingOk: ratingOk };
  stage = 'done';
  styleReasons();
  updateButtonStates();
}

function nextCard() {
  if (finished || stage !== 'done') return;
  if (current < CARDS.length - 1) {
    current++;
    stage = 'rate';
    rated = -1;
  } else {
    finished = true;
  }
  positionReasons();
  updateButtonStates();
}

function keyPressed() {
  if (key >= '1' && key <= '3') rate(int(key) - 1);
  else if (key === 'a' || key === 'A') chooseReason(0);
  else if (key === 'b' || key === 'B') chooseReason(1);
  else if (key === 'Enter') nextCard();
}

// Clicking a column on the canvas also chooses that rating
function mousePressed() {
  if (finished || stage !== 'rate') return;
  if (mouseY < binTop || mouseY > drawHeight - 4) return;
  const colW = (canvasWidth - 2 * margin) / RATINGS.length;
  const k = Math.floor((mouseX - margin) / colW);
  if (k >= 0 && k < RATINGS.length) rate(k);
}

function updateButtonStates() {
  for (let i = 0; i < rateButtons.length; i++) {
    const b = rateButtons[i];
    if (stage === 'rate' && !finished) b.removeAttribute('disabled');
    else b.attribute('disabled', '');
    b.style('font-weight', (!finished && rated === i) ? 'bold' : 'normal');
  }
  if (stage === 'done' && !finished) nextButton.removeAttribute('disabled');
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
  text(canvasWidth < 560 ? 'How Strong Is the Evidence?' : 'Documented, Debated, or Tradition?', margin, 10);
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
  if (finished) status = score >= MASTERY ? 'Done. Hover over a card to review it.' : 'Hover over a card to review it, then press Judge again.';
  else if (stage === 'rate') status = 'Rate the evidence: press a button, click a column, or press 1 to 3.';
  else if (stage === 'reason') status = 'Now choose the better reason: click it, or press A or B.';
  else status = 'Press ' + (current < CARDS.length - 1 ? 'Next card' : 'See result') + ' (or Enter) to continue.';
  text(fitText(status, canvasWidth - margin - 225), margin + 220, drawHeight + 61);
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
    textStyle(BOLD);
    textSize(17);
    fill('black');
    yy = drawWrapped('You judged ' + score + ' of 10. Mastery is 8.', x + pad, yy, tw, 22);
    fill(score >= MASTERY ? 'darkgreen' : 'firebrick');
    textSize(15);
    yy = drawWrapped(score >= MASTERY ? 'You kept the strength of the evidence apart from the strength of the belief.'
                                      : 'Press Judge again to start over from card 1. For each claim ask: who first said so, and when?',
                     x + pad, yy + 2, tw, 19);
    textStyle(NORMAL);
    fill('black');
    textSize(14);
    yy = drawWrapped('The cards are now grouped by their correct rating. Look at cards 3 and 4: the same tower on ' +
                     'Bülbül Dağı gets two different ratings, because the building and the story attached to it are ' +
                     'separate claims. The building is securely dated; the name "Paul’s Prison" is tradition.',
                     x + pad, yy + 6, tw, 18);
    drawWrapped('"Tradition only" is not "false": it means the evidence cannot settle the question either way.',
                x + pad, yy + 6, tw, 18);
    return;
  }

  const c = CARDS[current];
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text('CLAIM ' + (current + 1) + ' OF ' + CARDS.length, x + pad, yy);
  yy += 18;
  fill('black');
  textSize(claimSize());
  yy = drawWrapped(c.text, x + pad, yy, tw, 23) + 4;
  textStyle(NORMAL);

  if (stage === 'rate') {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(16);
    drawWrapped('How strong is the evidence? Choose a rating below.', x + pad, yy, tw, 20);
    textStyle(NORMAL);
    if (reasonTop !== yy + 20) reasonTop = yy + 20;
    return;
  }
  // Step 2 and feedback: the reason buttons are DOM buttons placed at reasonTop
  fill(RATINGS[rated].color);
  textSize(14);
  textStyle(BOLD);
  text('You rated it: ' + RATINGS[rated].name + '.', x + pad, yy + 1);
  textStyle(NORMAL);
  fill('dimgray');
  if (stage === 'reason') text('   Why? Choose the better reason.', x + pad + textWidth('You rated it: ' + RATINGS[rated].name + '.') + 2, yy + 1);
  if (reasonTop !== yy + 20) { reasonTop = yy + 20; positionReasons(); }

  if (stage === 'done') {
    const fy = reasonTop + reasonH[0] + reasonH[1] + 6 + 8;
    drawFeedback(current, results[current], x + pad, fy, tw);
  }
}

function drawFeedback(ci, r, x, y, tw) {
  const f = feedbackText(ci, r);
  textSize(15);
  textStyle(BOLD);
  fill(r.ok ? 'darkgreen' : (r.ratingOk ? '#9a5b13' : 'firebrick'));
  const headW = textWidth(f.head) + 6;
  text(f.head, x, y);
  textStyle(NORMAL);
  fill('black');
  const lines = wrapLines(f.body, tw - headW);
  text(lines[0], x + headW, y);
  const rest = lines.slice(1).join(' ');
  if (rest) drawWrapped(rest, x, y + 19, tw, 19);
}

// After the last card, hovering a chip shows that card again
function drawReview(ci, x, y, tw) {
  const c = CARDS[ci];
  const r = results[ci];
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text('REVIEW: CLAIM ' + (ci + 1), x, y);
  y += 18;
  fill('black');
  textSize(claimSize());
  y = drawWrapped(c.text, x, y, tw, 23) + 4;
  textStyle(NORMAL);
  textSize(14);
  fill('#3d4a52');
  y = drawWrapped('Your answer: ' + RATINGS[r.rating].name + '. Your reason: ' +
                  (r.reason === 'good' ? c.good : c.bad), x, y, tw, 18) + 6;
  drawFeedback(ci, r, x, y, tw);
}

function drawBins(top) {
  binTop = top;
  const colW = (canvasWidth - 2 * margin) / RATINGS.length;
  const headH = 28;
  const narrow = colW < 170;
  const defSize = narrow ? 12 : 13;
  const defLineH = defSize + 3;
  const defH = binDefHeight();
  const chipTop = top + headH + defH;
  const areaH = drawHeight - chipTop - 8;

  chipRects = [];
  const curCi = finished ? -1 : current;

  for (let i = 0; i < RATINGS.length; i++) {
    const R = RATINGS[i];
    const x = margin + i * colW;
    stroke('silver');
    strokeWeight(1);
    fill(i % 2 === 0 ? 'white' : 'ghostwhite');
    rect(x, top + headH, colW, defH + areaH);
    noStroke();
    fill(R.color);
    rect(x, top, colW, headH);

    // Judged cards join the column of their correct rating
    const placed = [];
    for (let n = 0; n < CARDS.length; n++) {
      if (results[n] && CARDS[n].rating === i) placed.push(n);
    }
    fill('white');
    textStyle(BOLD);
    textSize(narrow ? 13 : 15);
    textAlign(CENTER, CENTER);
    text(fitText(R.name + (placed.length ? ' (' + placed.length + ')' : ''), colW - 6), x + colW / 2, top + headH / 2);

    textStyle(ITALIC);
    textSize(defSize);
    fill('#3d4a52');
    textAlign(LEFT, TOP);
    drawWrapped(R.def, x + 7, top + headH + 5, colW - 14, defLineH);
    textStyle(NORMAL);
    stroke('#d8dee2');
    line(x + 6, chipTop - 2, x + colW - 6, chipTop - 2);
    noStroke();

    const gap = 3;
    const chipH = 23;
    for (let n = 0; n < placed.length; n++) {
      const ci = placed[n];
      const r = results[ci];
      const cx = x + 5, cy = chipTop + 4 + n * (chipH + gap), cw = colW - 10;
      const isNew = (ci === curCi);
      stroke(r.ok ? 'seagreen' : (r.ratingOk ? '#c58a2a' : 'firebrick'));
      strokeWeight(isNew || ci === hoverCard ? 3 : 1.5);
      fill(r.ok ? 'honeydew' : (r.ratingOk ? '#fdf3e1' : 'mistyrose'));
      rect(cx, cy, cw, chipH, 5);
      noStroke();
      fill('black');
      textAlign(LEFT, CENTER);
      textSize(narrow ? 11 : 13);
      const mark = r.ok ? ' ✓' : (r.ratingOk ? ' reason ✗' : ' ✗');
      const label = (ci + 1) + '. ' + CARDS[ci].chip;
      text(fitText(label, cw - 10 - textWidth(mark)) + mark, cx + 5, cy + chipH / 2);
      chipRects.push({ ci: ci, x: cx, y: cy, w: cw, h: chipH });
    }
  }

  // Outline the chosen rating (and the correct one, once judged)
  if (!finished && stage !== 'rate') {
    noFill();
    strokeWeight(3);
    const c = CARDS[current];
    if (stage === 'done') {
      if (rated !== c.rating) {
        stroke('firebrick');
        rect(margin + rated * colW + 1.5, top + 1.5, colW - 3, drawHeight - top - 11);
      }
      stroke('seagreen');
      rect(margin + c.rating * colW + 1.5, top + 1.5, colW - 3, drawHeight - top - 11);
    } else {
      stroke(RATINGS[rated].color);
      rect(margin + rated * colW + 1.5, top + 1.5, colW - 3, drawHeight - top - 11);
    }
  } else if (!finished && stage === 'rate') {
    const k = Math.floor((mouseX - margin) / colW);
    if (mouseY > top && mouseY < drawHeight - 4 && k >= 0 && k < RATINGS.length) {
      noFill();
      stroke(RATINGS[k].color);
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
