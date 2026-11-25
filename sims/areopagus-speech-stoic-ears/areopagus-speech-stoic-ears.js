// Paul's Speech Through Stoic Ears - p5.js 2.x
// CANVAS_HEIGHT: 524
// Ten lines paraphrased from Paul's Areopagus speech (Acts 17:22-31), shown
// in speech order. For each, the learner predicts whether a Stoic listener
// would hear it as common ground or as something new; the answer and the
// Stoic background are then revealed and the line is placed on a strip from
// the beginning of the speech to its end. After line 10 the audience's
// reaction (Acts 17:32-34) is revealed beside the strip.
// Mastery: 8 of 10, with lines 9 and 10 correct. The sim describes Luke's
// account and the Stoic ideas it echoes; it takes no position on belief.

let canvasWidth = 700;
let drawHeight = 440;
let controlHeight = 84;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const CATS = [
  { name: 'Common ground', lane: ['Common', 'ground'], button: '1  Common ground', short: 'Common ground',
    color: '#2f6e8e', tint: '#e3f0f6' },
  { name: 'Something new', lane: ['Something', 'new'], button: '2  Something new', short: 'Something new',
    color: '#b35806', tint: '#fbeadb' }
];

// ans: index into CATS
const LINES = [
  { ref: '17:22', ans: 0, text: '“I see that in every way you are very religious.”',
    bg: 'Stoics respected piety and treated the city’s gods as names for the one divine reason.' },
  { ref: '17:24', ans: 0, text: 'God does not live in shrines made by human hands.',
    bg: 'Zeno taught that temples were unnecessary, since no work of builders is worthy of the gods.' },
  { ref: '17:25', ans: 0, text: 'God is not served by human hands, as though he needed anything.',
    bg: 'Stoics, and Epicureans too, held that the divine needs nothing from people.' },
  { ref: '17:26', ans: 0, text: 'From one ancestor God made every nation of humankind.',
    bg: 'The Stoics taught that all people form one community, citizens of one world.' },
  { ref: '17:27', ans: 0, text: 'God is not far from each one of us.',
    bg: 'For a Stoic the divine reason runs through everything; Seneca wrote that God is near you, with you, within you.' },
  { ref: '17:28', ans: 0, text: '“For we too are his offspring.”',
    bg: 'A line from Aratus’ Phaenomena, a poem written under Stoic influence; Cleanthes’ Hymn to Zeus says much the same.' },
  { ref: '17:29', ans: 0, text: 'The divine is not like an image of gold, silver, or stone shaped by human skill.',
    bg: 'Stoic teachers criticized the worship of images as unworthy of the divine.' },
  { ref: '17:30', ans: 1, text: 'God now commands all people everywhere to repent, turning from the times of ignorance.',
    bg: 'Stoics saw wisdom as each person’s long work of reason, not a response to a command from a personal God.' },
  { ref: '17:31', ans: 1, text: 'God has fixed a day on which he will judge the world by a man he has appointed.',
    bg: 'Stoics expected the world to end in fire and begin again in endless cycles, with no single day of judgment.' },
  { ref: '17:31', ans: 1, text: 'God has given proof of this by raising that man from the dead.',
    bg: 'A Stoic might accept a soul that survived for a time, and an Epicurean not even that; neither expected a dead body raised to life.' }
];
const MASTERY = 8;
const KEY_LINES = [8, 9];   // lines 9 and 10 (indexes)
const QUESTION = 'Would a Stoic listener already agree with this, or is it something new?';
const REACTION = 'When they heard about the resurrection, some scoffed. Others said, “We will hear you again about this.” ' +
  'A few joined Paul, among them Dionysius, a member of the Areopagus council, and a woman named Damaris.';
const NOTE = 'Lines paraphrased from Acts 17:22–31. Answers follow the usual scholarly reading; Stoics were not all alike.';

// ---------- State ----------
let current = 0;
let answered = false;
let finished = false;
let results = [];      // by line index: { chosen, correct }
let reviewIdx = -1;
let chipRects = [];

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
    b.style('font-size', '15px');
    b.style('padding', '4px 0px');
    b.style('cursor', 'pointer');
    b.style('color', 'white');
    b.style('background-color', CATS[i].color);
    b.style('border', '1px solid ' + CATS[i].color);
    b.style('border-radius', '4px');
    b.attribute('title', CATS[i].name + ' (key ' + (i + 1) + ')');
    b.mousePressed(() => predict(i));
    catButtons.push(b);
  }
  nextButton = createButton('Next line');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextLine);

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(startSet);

  positionControls();
  startSet();

  describe('A prediction activity on the speech Acts gives Paul on the Areopagus. Ten lines are shown in speech order. ' +
           'For each, the learner predicts whether a Stoic listener would hear it as common ground or as something new; ' +
           'the answer and the Stoic background are revealed and the line is placed on a strip from the beginning to the end ' +
           'of the speech, in an upper lane for common ground or a lower lane for something new. After line 10 the ' +
           'audience’s reaction from Acts 17:32 to 34 is shown: some scoffed at the mention of the resurrection.');
}

function positionControls() {
  const gap = 8;
  const w = (canvasWidth - 2 * margin - gap) / 2;
  for (let i = 0; i < catButtons.length; i++) {
    catButtons[i].html(canvasWidth < 420 ? CATS[i].short : CATS[i].button);
    catButtons[i].position(margin + i * (w + gap), drawHeight + 8);
    catButtons[i].size(w, 32);
  }
  layoutRow2();
}

// Next and Try Again sit side by side; the status text starts after them.
let statusX = 222;
function layoutRow2() {
  nextButton.position(margin, drawHeight + 50);
  const nw = nextButton.elt.offsetWidth || 100;
  againButton.position(margin + nw + 10, drawHeight + 50);
  const aw = againButton.elt.offsetWidth || 90;
  statusX = margin + nw + aw + 26;
}

function startSet() {
  current = 0;
  answered = false;
  finished = false;
  results = [];
  reviewIdx = -1;
  updateButtonStates();
}

function predict(k) {
  if (answered || finished) return;
  answered = true;
  results[current] = { chosen: k, correct: k === LINES[current].ans };
  updateButtonStates();
}

function nextLine() {
  if (!answered || finished) return;
  if (current < LINES.length - 1) {
    current++;
    answered = false;
  } else {
    finished = true;
    reviewIdx = -1;
  }
  updateButtonStates();
}

function keyPressed() {
  if (key === '1' || key === '2') predict(int(key) - 1);
  else if (key === 'Enter') nextLine();
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

function updateButtonStates() {
  for (const b of catButtons) {
    if (answered || finished) { b.attribute('disabled', ''); b.style('opacity', '0.55'); b.style('cursor', 'default'); }
    else { b.removeAttribute('disabled'); b.style('opacity', '1'); b.style('cursor', 'pointer'); }
  }
  if (answered && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < LINES.length - 1 ? 'Next line' : 'See the reaction');
  layoutRow2();
}

function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = canvasWidth < 600;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow ? 17 : 21);
  text('Paul’s Speech Through Stoic Ears', margin, 10);
  textStyle(NORMAL);
  textSize(15);
  textAlign(RIGHT, TOP);
  const nDone = results.filter(r => r).length;
  const score = results.filter(r => r && r.correct).length;
  if (!narrow) text('Correct: ' + score + ' of ' + nDone, canvasWidth - margin, 14);

  const stripBottom = drawStrip(42);
  const noteH = 30;
  drawPanel(margin, stripBottom + 8, canvasWidth - 2 * margin, drawHeight - stripBottom - 16 - noteH);

  noStroke();
  fill('#4a5a66');
  textStyle(ITALIC);
  textSize(12);
  textAlign(LEFT, TOP);
  drawWrapped(NOTE, margin, drawHeight - noteH - 2, canvasWidth - 2 * margin, 15);
  textStyle(NORMAL);

  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(13);
  let status;
  if (finished) status = 'Click a line on the strip to read it again.';
  else if (answered) status = 'Press ' + (current < LINES.length - 1 ? 'Next line' : 'See the reaction') + ' (or Enter).';
  else status = 'Predict with the buttons (or keys 1 and 2). Line ' + (current + 1) + ' of 10.';
  if (narrow) status = (finished || answered) ? status : 'Line ' + (current + 1) + ' of 10. Correct: ' + score + ' of ' + nDone + '.';
  text(fitText(status, canvasWidth - margin - statusX), statusX, drawHeight + 64);
}

// The strip: slots 1-10 from the beginning of the speech to its end, an upper
// lane for common ground and a lower lane for something new. Returns its bottom y.
function drawStrip(top) {
  const narrow = canvasWidth < 600;
  const laneW = narrow ? 78 : 104;
  const x0 = margin + laneW;
  const x1 = canvasWidth - margin;
  const slotW = (x1 - x0) / LINES.length;
  const chipH = 36;
  const axisY = top + 18;
  const laneTop = [axisY + 12, axisY + 12 + chipH + 22];
  const midY = laneTop[0] + chipH + 11;
  const bottom = laneTop[1] + chipH + (finished ? 40 : 8);

  // frame
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(margin, top, canvasWidth - 2 * margin, bottom - top, 8);

  // axis: beginning -> end
  noStroke();
  fill('#4a5a66');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('Beginning of the speech', x0 + 2, axisY);
  textAlign(RIGHT, CENTER);
  text('End of the speech', x1 - 4, axisY);
  stroke('#9aa5ad');
  const bw = textWidth('Beginning of the speech') + 10, ew = textWidth('End of the speech') + 14;
  line(x0 + bw, axisY, x1 - ew, axisY);
  noStroke();
  fill('#9aa5ad');
  triangle(x1 - ew + 6, axisY, x1 - ew - 2, axisY - 4, x1 - ew - 2, axisY + 4);

  // lanes
  const showTally = answered || finished;
  for (let c = 0; c < 2; c++) {
    const y = laneTop[c];
    noStroke();
    fill(CATS[c].tint);
    rect(x0, y - 3, x1 - x0 - 2, chipH + 6, 4);
    fill(CATS[c].color);
    textStyle(BOLD);
    textSize(narrow ? 12 : 14);
    textAlign(LEFT, CENTER);
    text(CATS[c].lane[0], margin + 6, y + chipH / 2 - 8);
    let count = 0;
    results.forEach((r, i) => { if (r && LINES[i].ans === c) count++; });
    text(CATS[c].lane[1] + (showTally ? ' (' + count + ')' : ''), margin + 6, y + chipH / 2 + 8);
    textStyle(NORMAL);
  }

  // slot numbers on the line between the lanes
  for (let i = 0; i < LINES.length; i++) {
    const cx = x0 + (i + 0.5) * slotW;
    const isCur = !finished && i === current;
    noStroke();
    fill(isCur ? '#f2b632' : (results[i] ? '#c7d0d6' : '#e3e8eb'));
    circle(cx, midY, 18);
    fill(isCur ? 'black' : '#4a5a66');
    textSize(12);
    textStyle(isCur ? BOLD : NORMAL);
    textAlign(CENTER, CENTER);
    text(i + 1, cx, midY + 1);
    textStyle(NORMAL);
  }

  // chips for answered lines
  chipRects = [];
  for (let i = 0; i < LINES.length; i++) {
    const r = results[i];
    if (!r) continue;
    const c = LINES[i].ans;
    const cx = x0 + (i + 0.5) * slotW;
    const w = Math.min(slotW - 6, 64);
    const y = laneTop[c];
    const isNow = (!finished && i === current) || i === reviewIdx;
    stroke(r.correct ? 'seagreen' : 'firebrick');
    strokeWeight(isNow ? 2.5 : 1.3);
    if (!r.correct) drawingContext.setLineDash([4, 3]);
    fill(isNow ? '#fff4d6' : 'white');
    rect(cx - w / 2, y, w, chipH, 4);
    drawingContext.setLineDash([]);
    noStroke();
    fill(CATS[c].color);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(13);
    textSize(12);
    const showRef = textWidth(LINES[i].ref) + 6 <= w;
    textSize(13);
    text(i + 1, cx, showRef ? y + 11 : y + chipH / 2 + 1);
    textStyle(NORMAL);
    textSize(12);
    fill('#333');
    if (showRef) text(LINES[i].ref, cx, y + 25);
    chipRects.push({ i: i, x: cx - w / 2, y: y, w: w, h: chipH });
  }

  // after line 10: the turn, and the audience's reaction beside the strip
  if (finished) {
    const xt = x0 + 7 * slotW;
    stroke('#8a6a10');
    strokeWeight(1.5);
    drawingContext.setLineDash([5, 4]);
    line(xt, axisY + 8, xt, laneTop[1] + chipH + 4);
    drawingContext.setLineDash([]);
    const xa = x0 + 7 * slotW + 3, xb = x1 - 3;
    const yb = laneTop[1] + chipH + 8;
    stroke('#a23b2a');
    strokeWeight(1.5);
    line(xa, yb, xa, yb + 5);
    line(xa, yb + 5, xb, yb + 5);
    line(xb, yb, xb, yb + 5);
    noStroke();
    fill('#a23b2a');
    textStyle(BOLD);
    textSize(12);
    textAlign(RIGHT, TOP);
    text(fitText('Acts 17:32: here some scoffed', xb - xa + 40), xb, yb + 10);
    fill('#8a6a10');
    textAlign(RIGHT, TOP);
    text('the turn →', xt - 4, yb + 10);
    textStyle(NORMAL);
  }

  let over = false;
  for (const r of chipRects) {
    if (finished && mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) over = true;
  }
  cursor(over ? HAND : ARROW);
  noStroke();
  return bottom;
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
  const narrow = canvasWidth < 600;
  let yy = y + 9;

  if (finished && reviewIdx < 0) {
    const score = results.filter(r => r.correct).length;
    const pass = score >= MASTERY && KEY_LINES.every(i => results[i].correct);
    textStyle(BOLD);
    textSize(16);
    fill('black');
    yy = drawWrapped('You judged ' + score + ' of 10 lines correctly on the first attempt. Tally: common ground 7, something new 3.',
                     x + pad, yy, tw, 20);
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(14);
    yy = drawWrapped(pass ? 'You can see the bridge Paul built, and where he asked his listeners to cross it.'
                          : 'Look again at lines 8 to 10: which of them could a Stoic have said?',
                     x + pad, yy + 3, tw, 18);
    fill('#a23b2a');
    yy = drawWrapped('What happened next (Acts 17:32–34, paraphrased):', x + pad, yy + 6, tw, 18);
    textStyle(NORMAL);
    fill('black');
    yy = drawWrapped(REACTION, x + pad, yy, tw, 18);
    fill('dimgray');
    textSize(13);
    drawWrapped('The first seven lines build on Stoic ground; the speech breaks with it in the last three, and Luke records the scoffing at the break.',
                x + pad, yy + 5, tw, 17);
    return;
  }

  const i = finished ? reviewIdx : current;
  const L = LINES[i];
  const r = results[i];
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text((finished ? 'REVIEW: ' : '') + 'LINE ' + (i + 1) + ' OF 10 · ACTS ' + L.ref, x + pad, yy);
  yy += 18;
  fill('black');
  textSize(narrow ? 16 : 18);
  yy = drawWrapped(L.text, x + pad, yy, tw, narrow ? 20 : 23) + 6;
  textStyle(NORMAL);

  if (!r) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(15);
    drawWrapped(QUESTION, x + pad, yy, tw, 19);
    textStyle(NORMAL);
    return;
  }
  const A = CATS[L.ans];
  textSize(15);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  let head = r.correct ? 'Correct.' : 'A Stoic would have heard this as ' + A.name.toLowerCase() + ':';
  if (finished && !r.correct) head = 'A Stoic would have heard this as ' + A.name.toLowerCase() +
    ' (you chose ' + CATS[r.chosen].name.toLowerCase() + '):';
  yy = drawWrapped(head, x + pad, yy, tw, 19);
  textStyle(NORMAL);
  fill('black');
  drawWrapped(L.bg, x + pad, yy + 2, tw, 19);
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
