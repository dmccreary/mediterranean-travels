// The Siege of 1453, Step by Step - p5.js 2.x
// CANVAS_HEIGHT: 540
// Eight turning points of the siege, in a fixed order. For each, the learner
// reads the date and event, sees its place highlighted on a schematic map, and
// says which of the city's defenses it defeated, or that the defenders held.
// One attempt per step; earlier steps can be revisited but not re-answered.
// A summary lists every step and counts the steps under each defense.

let canvasWidth = 700;
let drawHeight = 380;
let controlHeight = 160;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const ANSWERS = [
  { letter: 'A', text: 'The strait: supply from the Black Sea', short: 'the strait', tag: 'The strait' },
  { letter: 'B', text: 'The chain across the Golden Horn', short: 'the chain', tag: 'The chain' },
  { letter: 'C', text: 'The land walls', short: 'the land walls', tag: 'The land walls' },
  { letter: 'D', text: 'Help from the West', short: 'help from the West', tag: 'Help from the West' },
  { letter: 'E', text: "The defenders' numbers and morale", short: 'numbers and morale', tag: 'Numbers and morale' },
  { letter: 'F', text: 'None: the defenders held this time', short: 'defenders held', tag: 'Defenders held' }
];

// loc: which part of the schematic map to highlight
const STEPS = [
  { date: 'Spring–summer 1452', loc: 'rumeli', answer: 0, label: 'Rumeli Hisarı closes the strait',
    event: 'Mehmed builds the fortress of Rumeli Hisarı in about four and a half months at the narrows, about 700 m across, opposite Anadolu Hisarı. In November a Venetian ship that refuses to stop is sunk by its guns.',
    why: 'With guns on both shores, no ship can bring grain or help down from the Black Sea.' },
  { date: 'Late 1452', loc: 'edirne', answer: 2, label: 'Orban casts the great bombard',
    event: 'Orban, a Hungarian cannon-founder the emperor could not afford, casts a bronze bombard about 8 m long for Mehmed.',
    why: 'The cannon was built to smash the Theodosian land walls, which no army had broken for a thousand years.' },
  { date: 'From April 6, 1453', loc: 'romanus', answer: 2, label: 'Cannon fire breaks the walls',
    event: 'The bombardment brings down sections of wall near the Gate of St. Romanus, where the Lycus stream enters the city.',
    why: 'Each hit opens a breach; the walls are losing for the first time.' },
  { date: 'April 20', loc: 'mouth', answer: 5, label: 'Four ships reach the harbor',
    event: 'Four Christian supply ships fight through the Ottoman fleet and into the Golden Horn while Mehmed watches from the shore.',
    why: 'The ships get through and the chain holds; this is the defenders’ best day.' },
  { date: 'April 21–22', loc: 'overland', answer: 1, label: 'About 70 ships hauled overland',
    event: 'About seventy Ottoman ships are hauled overland on greased logs from the Bosphorus over the hill behind Galata and slid into the upper Golden Horn.',
    why: 'The ships go around the chain, and defenders must leave the land walls to guard the harbor walls.' },
  { date: 'Nightly, April–May', loc: 'romanus', answer: 5, label: 'Breaches rebuilt every night',
    event: 'After each day’s bombardment, defenders rebuild the breaches with timber, earth and barrels.',
    why: 'The repairs hold the line for seven weeks; cannon alone did not take the city.' },
  { date: 'May 23', loc: 'marmara', answer: 3, label: 'No Venetian fleet in sight',
    event: 'A scouting ship returns: it has found no Venetian relief fleet in the Aegean.',
    why: 'The help that was promised never came in time.' },
  { date: 'May 29, before dawn', loc: 'romanus', answer: 4, label: 'Giustiniani falls; the walls are taken',
    event: 'In the final assault, Giustiniani is badly wounded and carried away from the walls; the defenders at the breach lose heart, and the Janissaries break through. About 7,000 defenders had been holding nearly 20 km of walls.',
    why: 'Too few men, exhausted after 53 days, lost their commander at the decisive moment.' }
];
const MASTERY = 6;

// ---------- State ----------
let current = 0;
let answers = [];       // learner's first answer per step, or undefined
let showSummary = false;

// ---------- Controls ----------
let answerButtons = [];
let prevButton, nextButton, restartButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < ANSWERS.length; i++) {
    const b = createButton(ANSWERS[i].letter + '. ' + ANSWERS[i].text);
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('text-align', 'left');
    b.style('padding', '4px 8px');
    b.style('border', '1px solid #8aa0b0');
    b.style('border-radius', '6px');
    b.style('cursor', 'pointer');
    b.mousePressed(() => choose(i));
    answerButtons.push(b);
  }
  prevButton = createButton('Previous');
  prevButton.parent(document.querySelector('main'));
  prevButton.style('font-size', '14px');
  prevButton.mousePressed(prevStep);

  nextButton = createButton('Next step');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextStep);

  restartButton = createButton('Restart');
  restartButton.parent(document.querySelector('main'));
  restartButton.style('font-size', '14px');
  restartButton.mousePressed(restart);

  positionControls();
  restart();

  describe('A step-through of eight turning points in the 1453 siege of Constantinople. Each step shows a date, an event and its place ' +
           'highlighted on a schematic map of the city, the Golden Horn and the Bosphorus. The learner chooses which defense the event ' +
           'defeated: the strait, the chain, the land walls, help from the West, the defenders’ numbers and morale, or none. ' +
           'A summary lists every step with the correct answer and counts the steps under each defense.');
}

function positionControls() {
  const gap = 8;
  const bw = (canvasWidth - 2 * margin - gap) / 2;
  for (let i = 0; i < answerButtons.length; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    answerButtons[i].position(margin + col * (bw + gap), drawHeight + 8 + row * 36);
    answerButtons[i].size(bw, 30);
  }
  const y = drawHeight + 118;
  prevButton.position(margin, y);
  nextButton.position(margin + 92, y);
  restartButton.position(margin + 214, y);
}

function restart() {
  current = 0;
  answers = [];
  showSummary = false;
  updateButtons();
}

function choose(i) {
  if (showSummary || answers[current] !== undefined) return;
  answers[current] = i;
  updateButtons();
}

function nextStep() {
  if (showSummary || answers[current] === undefined) return;
  if (current < STEPS.length - 1) current++;
  else showSummary = true;
  updateButtons();
}

function prevStep() {
  if (showSummary) showSummary = false;
  else if (current > 0) current--;
  updateButtons();
}

function keyPressed() {
  const k = String(key).toUpperCase();
  const idx = 'ABCDEF'.indexOf(k);
  if (k.length === 1 && idx >= 0) choose(idx);
  else if (key === 'ArrowRight' || key === 'Enter') nextStep();
  else if (key === 'ArrowLeft') prevStep();
}

function score() {
  let n = 0;
  for (let i = 0; i < STEPS.length; i++) if (answers[i] === STEPS[i].answer) n++;
  return n;
}

function updateButtons() {
  const a = answers[current];
  for (let i = 0; i < answerButtons.length; i++) {
    const b = answerButtons[i];
    let bg = '#f4f8fb', border = '1px solid #8aa0b0', op = '1';
    if (showSummary) { b.attribute('disabled', ''); op = '0.45'; }
    else if (a === undefined) b.removeAttribute('disabled');
    else {
      b.attribute('disabled', '');
      if (i === STEPS[current].answer) { bg = '#dff2df'; border = '2px solid #2e7d32'; }
      else if (i === a) { bg = '#fbe3e3'; border = '2px solid #c62828'; }
      else op = '0.55';
    }
    b.style('background-color', bg);
    b.style('border', border);
    b.style('opacity', op);
    b.style('color', '#1d2a33');
  }
  if (!showSummary && current > 0 || showSummary) prevButton.removeAttribute('disabled');
  else prevButton.attribute('disabled', '');
  if (!showSummary && a !== undefined) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < STEPS.length - 1 ? 'Next step' : 'See summary');
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
  fill('#12304a');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(canvasWidth < 560 ? 17 : 21);
  text('The Siege of 1453, Step by Step', margin, 10);
  textStyle(NORMAL);
  textSize(15);
  textAlign(RIGHT, TOP);
  fill('black');
  text('Turning points: ' + score() + ' of 8', canvasWidth - margin, 14);

  if (showSummary) drawSummary();
  else {
    const mapW = Math.max(220, Math.min(340, canvasWidth * 0.44));
    drawMap(margin, 42, mapW, drawHeight - 52, STEPS[current].loc);
    drawStepPanel(margin + mapW + 12, 42, canvasWidth - mapW - 2 * margin - 12, drawHeight - 52);
  }

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(13);
  let status;
  if (showSummary) status = 'Press Previous to revisit step 8, or Restart.';
  else if (answers[current] === undefined) status = 'Choose A to F (keys work too).';
  else status = 'Answer locked. Press ' + (current < STEPS.length - 1 ? 'Next step.' : 'See summary.');
  text(fitText(status, canvasWidth - margin - 310), margin + 300, drawHeight + 133);
}

function drawStepPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  const pad = 12, tw = w - 2 * pad;
  let yy = y + 10;
  const S = STEPS[current];
  textAlign(LEFT, TOP);
  fill('dimgray');
  textStyle(BOLD);
  textSize(12);
  text('STEP ' + (current + 1) + ' OF 8', x + pad, yy);
  yy += 18;
  fill('#8b1e1e');
  textSize(17);
  text(S.date, x + pad, yy);
  yy += 24;
  textStyle(NORMAL);
  fill('black');
  const small = tw < 330;
  textSize(small ? 13 : 14);
  yy = drawWrapped(S.event, x + pad, yy, tw, small ? 17 : 19) + 8;

  const a = answers[current];
  if (a === undefined) {
    fill('#12304a');
    textStyle(BOLDITALIC);
    textSize(14);
    drawWrapped('Which of the city’s defenses does this defeat?', x + pad, yy, tw, 19);
    textStyle(NORMAL);
    return;
  }
  const ok = a === S.answer;
  const C = ANSWERS[S.answer];
  textStyle(BOLD);
  textSize(small ? 13 : 14);
  fill(ok ? 'darkgreen' : 'firebrick');
  const head = ok ? 'Right: (' + C.letter + ') ' + C.text + '.' : 'Not quite. The answer is (' + C.letter + ') ' + C.text + '.';
  yy = drawWrapped(head, x + pad, yy, tw, small ? 17 : 19);
  textStyle(NORMAL);
  fill('black');
  let why = S.why;
  if (!ok && current === 4 && a === 2) why += ' The ships never broke the walls; they forced the defenders to spread out.';
  drawWrapped(why, x + pad, yy + 2, tw, small ? 17 : 19);
}

// Map coordinates are in units of 0 to 100 across and down the map box.
let MX, MY, MW, MH;
function px(u) { return MX + u / 100 * MW; }
function py(v) { return MY + v / 100 * MH; }
function poly(pts) {
  beginShape();
  for (const p of pts) vertex(px(p[0]), py(p[1]));
  endShape(CLOSE);
}

function drawMap(x, y, w, h, loc) {
  MX = x; MY = y; MW = w; MH = h;
  const water = '#a9cbe0', land = '#efe3c8', ink = '#12304a', gold = '#e8a317';
  stroke('silver');
  fill(water);
  rect(x, y, w, h);
  // European land, with the historic peninsula at its southeast corner
  noStroke();
  fill(land);
  poly([[0, 0], [60, 0], [61, 8], [60, 15], [61, 24], [62, 36], [62, 48], [61, 58], [63, 62], [67, 66], [65, 71],
        [52, 75], [34, 78], [16, 81], [0, 82]]);
  // Asian land
  poly([[100, 0], [74, 0], [73, 8], [69, 16], [72, 24], [74, 36], [75, 50], [75, 62], [73, 70], [76, 77], [84, 80], [100, 81]]);
  // Golden Horn, drawn over the European land
  fill(water);
  poly([[61, 59], [55, 55], [47, 50], [38, 46], [30, 42], [24, 39], [24, 42], [31, 46], [39, 50], [47, 54], [55, 59], [63, 64]]);

  // Galata's walled area on the north side of the Horn's mouth
  stroke('#8a6d45');
  strokeWeight(1.5);
  drawingContext.setLineDash([3, 3]);
  noFill();
  poly([[51, 51], [58, 47], [62, 52], [61, 57], [56, 55]]);
  drawingContext.setLineDash([]);

  // Land walls from the Golden Horn to the Sea of Marmara, with tower ticks
  stroke('#5b4630');
  strokeWeight(4);
  line(px(24), py(43), px(16), py(81));
  strokeWeight(2);
  for (let t = 0.04; t < 1; t += 0.08) {
    const ux = 24 + (16 - 24) * t, uy = 43 + (81 - 43) * t;
    line(px(ux), py(uy), px(ux - 2.2), py(uy));
  }

  // Chain across the mouth of the Golden Horn
  stroke(ink);
  strokeWeight(2);
  drawingContext.setLineDash([2, 3]);
  line(px(63.5), py(64.5), px(61), py(57.5));
  drawingContext.setLineDash([]);

  // Fortresses at the narrows
  noStroke();
  fill('#7a3b1e');
  rect(px(58.5) - 4, py(16) - 4, 8, 8);
  rect(px(70.5) - 3, py(17) - 3, 6, 6);

  // Overland route behind Galata (always faint; bold at step 5)
  const route = [[64, 40], [57, 37], [49, 39], [43, 44], [40, 47.5]];
  const bold = loc === 'overland';
  stroke(bold ? '#b03a2e' : '#b08a7a');
  strokeWeight(bold ? 3 : 1.5);
  drawingContext.setLineDash([5, 4]);
  noFill();
  beginShape();
  for (const p of route) vertex(px(p[0]), py(p[1]));
  endShape();
  drawingContext.setLineDash([]);
  arrowHead(route[3], route[4], bold ? '#b03a2e' : '#b08a7a');

  // Labels
  noStroke();
  textStyle(NORMAL);
  textSize(w < 260 ? 10 : 11);
  fill(ink);
  textAlign(CENTER, CENTER);
  text('Black Sea ↑', px(67), py(3));
  text('Sea of Marmara', px(42), py(91));
  text('Historic\npeninsula', px(45), py(68));
  text('Galata', px(53), py(45.5));
  text('ASIA', px(88), py(42));
  text('EUROPE', px(20), py(22));
  textAlign(RIGHT, CENTER);
  text('Rumeli Hisarı', px(56.5), py(16));
  textAlign(LEFT, CENTER);
  text('Anadolu\nHisarı', px(74), py(18));
  push();
  translate(px(67.5), py(36));
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Bosphorus', 0, 0);
  pop();
  push();
  translate(px(34), py(47.5));
  rotate(atan2((50 - 42) / 100 * MH, (39 - 30) / 100 * MW) * 0.9);
  textAlign(CENTER, CENTER);
  fill('#2f5f86');
  text('Golden Horn', 0, 0);
  pop();
  push();
  translate(px(10.5), py(70));
  rotate(-HALF_PI + 0.2);
  textAlign(CENTER, CENTER);
  fill('#5b4630');
  text('land walls', 0, 0);
  pop();
  fill(ink);
  textAlign(LEFT, CENTER);
  text('chain', px(64.5), py(60));
  // Edirne, off the map to the west
  fill(loc === 'edirne' ? '#b03a2e' : '#8a9aa6');
  textAlign(LEFT, CENTER);
  text('← to Edirne', px(1), py(33));
  text('(about 230 km)', px(1), py(37.5));

  // Highlight for this step
  noFill();
  stroke(gold);
  strokeWeight(4);
  if (loc === 'rumeli') ellipse(px(64.5), py(16.5), w * 0.17, h * 0.1);
  else if (loc === 'edirne') rect(px(0.5), py(29.5), w * 0.24, h * 0.11, 6);
  else if (loc === 'romanus') {
    ellipse(px(19.8), py(62), w * 0.11, h * 0.14);
    noStroke();
    fill('#8b1e1e');
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text('Gate of\nSt. Romanus', px(24), py(55));
    textStyle(NORMAL);
  }
  else if (loc === 'mouth') ellipse(px(62.5), py(61), w * 0.13, h * 0.13);
  else if (loc === 'overland') {
    noStroke();
    fill('#b03a2e');
    textStyle(BOLD);
    textAlign(CENTER, BOTTOM);
    text('ships hauled\nover the hill', px(46), py(34));
    textStyle(NORMAL);
  }
  else if (loc === 'marmara') {
    ellipse(px(42), py(91), w * 0.42, h * 0.1);
    noStroke();
    fill('#8b1e1e');
    textAlign(LEFT, CENTER);
    text('↙ to the Aegean', px(2), py(97));
  }

  noStroke();
  fill('#4a5a66');
  textStyle(ITALIC);
  textAlign(RIGHT, BOTTOM);
  textSize(10);
  text('Schematic map', px(99), py(99.5));
  textStyle(NORMAL);
}

function arrowHead(a, b, col) {
  const x1 = px(a[0]), y1 = py(a[1]), x2 = px(b[0]), y2 = py(b[1]);
  const ang = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(ang);
  noStroke();
  fill(col);
  triangle(0, 0, -9, -5, -9, 5);
  pop();
}

function drawSummary() {
  const x = margin, y = 42, w = canvasWidth - 2 * margin, h = drawHeight - 52;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  const n = score();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(16);
  fill(n >= MASTERY ? 'darkgreen' : 'firebrick');
  text(fitText('You scored ' + n + ' of 8. ' + (n >= MASTERY ? '6 or more: you can explain why the city fell.'
       : 'Fewer than 6: reread “The Fall of Constantinople” and try again.'), w - 24), x + 12, y + 10);

  // table
  const narrow = w < 640;
  const cDate = x + 12, cEvent = x + (narrow ? 158 : 172), cDef = x + w * (narrow ? 0.62 : 0.64), cYou = x + w - 12;
  let yy = y + 38;
  textSize(12);
  fill('dimgray');
  text('STEP AND DATE', cDate, yy);
  text('EVENT', cEvent, yy);
  text('DEFENSE IT DEFEATED', cDef, yy);
  textAlign(RIGHT, TOP);
  text('YOU', cYou, yy);
  yy += 18;
  textStyle(NORMAL);
  textSize(narrow ? 12 : 13);
  for (let i = 0; i < STEPS.length; i++) {
    const S = STEPS[i], ok = answers[i] === S.answer;
    fill(i % 2 ? '#f4f8fb' : '#ffffff');
    rect(x + 4, yy - 3, w - 8, 22);
    fill('black');
    textAlign(LEFT, TOP);
    text(fitText((i + 1) + '. ' + S.date, cEvent - cDate - 6), cDate, yy);
    text(fitText(S.label, cDef - cEvent - 8), cEvent, yy);
    const C = ANSWERS[S.answer];
    text(fitText(C.letter + '. ' + C.tag, cYou - cDef - 42), cDef, yy);
    textAlign(RIGHT, TOP);
    textStyle(BOLD);
    fill(ok ? 'darkgreen' : 'firebrick');
    text((answers[i] !== undefined ? ANSWERS[answers[i]].letter : '–') + (ok ? ' ✓' : ' ✗'), cYou, yy);
    textStyle(NORMAL);
    yy += 22;
  }
  // counts per defense
  yy += 6;
  const counts = ANSWERS.map((_, k) => STEPS.filter(S => S.answer === k).length);
  fill('#12304a');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(13);
  text('Steps under each defense:', x + 12, yy);
  textStyle(NORMAL);
  const parts = ANSWERS.map((A, k) => A.letter + '. ' + A.tag + ': ' + counts[k]);
  yy = drawWrapped(parts.join('  ·  '), x + 12, yy + 18, w - 24, 17);
  fill('black');
  drawWrapped('Four different defenses (the strait, the chain, the land walls and help from the West) failed before the final assault, ' +
              'and the defenders won two rounds.', x + 12, yy + 4, w - 24, 17);
}

// ---------- Text helpers ----------
function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd;
    if (textWidth(test) > maxW && line) {
      lines.push(line);
      line = wd;
    } else line = test;
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
