// Scribe or Press? - p5.js 2.x
// CANVAS_HEIGHT: 558
// Fixed cost versus marginal cost for a 200-page book. The learner predicts
// the number of copies at which printing becomes cheaper than hand-copying,
// for an ordinary copyist and for a master calligrapher, then moves the
// copies slider to watch both cost lines grow and cross.
// All numbers are an illustrative model, not historical prices.

let canvasWidth = 700;
let drawHeight = 482;
let controlHeight = 76;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

// ---------- Model (all costs in workdays) ----------
const PAGES = 200;
const PRESS_FIXED = 350;
const PRESS_PER_COPY = 0.2;
const MAX_COPIES = 500;
const SCRIBES = [
  { name: 'Ordinary copyist', who: 'copyist', rate: 8 },
  { name: 'Master calligrapher', who: 'calligrapher', rate: 2 }
];
SCRIBES.forEach(s => { s.perCopy = PAGES / s.rate; });
const X_RANGES = [25, 50, 100, 200, 500];

const INK = '#8B4513';     // scribe line
const PRESS = '#1F5F8B';   // press line

function scribeCost(s, n) { return s.perCopy * n; }
function pressCost(n) { return PRESS_FIXED + PRESS_PER_COPY * n; }
function breakEven(s) { return PRESS_FIXED / (s.perCopy - PRESS_PER_COPY); }
// Smallest whole number of copies for which press cost < scribe cost
function crossover(s) {
  let n = Math.floor(breakEven(s)) + 1;
  while (n > 1 && pressCost(n - 1) < scribeCost(s, n - 1)) n--;
  while (!(pressCost(n) < scribeCost(s, n))) n++;
  return n;
}
function equationText(s) {
  const be = breakEven(s);
  return s.perCopy + ' × N > 350 + 0.2 × N gives N > ' + (be < 10 ? be.toFixed(2) : be.toFixed(1)) +
         ', so the crossover is ' + crossover(s) + ' copies.';
}

// ---------- State ----------
let sel = 0;                 // selected scribe type
let copies = 1;
let tries = [[], []];        // predictions checked, per scribe type
let state = ['open', 'open']; // 'open', 'correct' or 'revealed'
let feedback = ['', ''];
let inputNote = '';

// ---------- Layout ----------
let stacked = false;
let tableTop = 58, rowH = 22, noteTop = 0, boxTop = 0;
let chartX, chartY, chartW, chartH, panelX, panelY, panelW, panelH;

// ---------- Controls ----------
let scribeSelect, copiesSlider, predictInput, checkButton, resetButton;

function setup() {
  updateCanvasSize();
  computeLayout();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  copiesSlider = createSlider(1, MAX_COPIES, 1, 1);
  copiesSlider.parent(document.querySelector('main'));
  copiesSlider.input(() => { copies = copiesSlider.value(); });

  scribeSelect = createSelect();
  scribeSelect.parent(document.querySelector('main'));
  SCRIBES.forEach(s => scribeSelect.option(s.name));
  scribeSelect.selected(SCRIBES[0].name);
  scribeSelect.style('font-size', '14px');
  scribeSelect.changed(changeScribe);

  predictInput = createInput('', 'number');
  predictInput.parent(document.querySelector('main'));
  predictInput.attribute('min', '1');
  predictInput.attribute('max', String(MAX_COPIES));
  predictInput.attribute('placeholder', 'copies');
  predictInput.attribute('aria-label', 'Predicted crossover, in copies');
  predictInput.style('font-size', '15px');
  predictInput.style('width', '76px');
  predictInput.elt.addEventListener('keydown', e => { if (e.key === 'Enter') checkPrediction(); });

  checkButton = createButton('Check Prediction');
  checkButton.parent(document.querySelector('main'));
  checkButton.style('font-size', '14px');
  checkButton.mousePressed(checkPrediction);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.style('font-size', '14px');
  resetButton.mousePressed(resetAll);

  positionControls();
  resetAll();

  describe('A cost comparison for copying a 200-page book. A table lists an ordinary copyist at 8 pages a day ' +
           '(25 workdays a copy), a master calligrapher at 2 pages a day (100 workdays a copy) and a printing press ' +
           'with a fixed cost of 350 workdays and 0.2 workdays a copy. The learner predicts the number of copies at ' +
           'which the press becomes cheaper, then a slider from 1 to 500 copies draws both total-cost lines and ' +
           'marks where they cross: 15 copies for the copyist and 4 for the calligrapher.');
}

function computeLayout() {
  stacked = canvasWidth < 600;
  noteTop = tableTop + 4 * rowH + 6;
  boxTop = noteTop + (stacked ? 50 : 36);
  const inner = canvasWidth - 2 * margin;
  if (!stacked) {
    panelW = Math.round(inner * 0.40);
    chartW = inner - panelW - 10;
    chartX = margin;
    chartY = boxTop;
    chartH = 286;
    panelX = chartX + chartW + 10;
    panelY = boxTop;
    panelH = chartH;
    drawHeight = boxTop + chartH + 8;
  } else {
    panelX = margin; panelY = boxTop; panelW = inner; panelH = 206;
    chartX = margin; chartY = panelY + panelH + 8; chartW = inner; chartH = 270;
    drawHeight = chartY + chartH + 8;
  }
  canvasHeight = drawHeight + controlHeight;
}

function positionControls() {
  // Prediction input and button sit inside the feedback panel
  const py = panelY + 72;
  predictInput.position(panelX + 10, py);
  checkButton.position(panelX + 10 + 90, py);

  // Control area: row 1 copies slider, row 2 scribe selector and reset
  const y1 = drawHeight + 8;
  const sx = margin + 112;
  copiesSlider.position(sx, y1 + 2);
  copiesSlider.size(Math.max(80, canvasWidth - sx - margin - 10));
  const y2 = drawHeight + 42;
  scribeSelect.position(margin + 58, y2);
  resetButton.position(canvasWidth - margin - resetButton.elt.offsetWidth, y2);
}

function resetAll() {
  sel = 0;
  scribeSelect.selected(SCRIBES[0].name);
  tries = [[], []];
  state = ['open', 'open'];
  feedback = ['', ''];
  inputNote = '';
  setCopies(1);
  predictInput.value('');
  updateLocks();
}

function setCopies(n) {
  copies = n;
  copiesSlider.value(n);
}

function changeScribe() {
  sel = SCRIBES.findIndex(s => s.name === scribeSelect.value());
  inputNote = '';
  predictInput.value('');
  // A new prediction starts from one copy, so the lines have not crossed yet
  if (state[sel] === 'open') setCopies(1);
  updateLocks();
}

function updateLocks() {
  const open = state[sel] === 'open';
  copiesSlider.elt.disabled = open;
  predictInput.elt.disabled = !open;
  checkButton.elt.disabled = !open;
}

function checkPrediction() {
  if (state[sel] !== 'open') return;
  const raw = String(predictInput.value()).trim();
  const n = Number(raw);
  if (raw === '' || !Number.isInteger(n) || n < 1 || n > MAX_COPIES) {
    inputNote = 'Type a whole number of copies from 1 to ' + MAX_COPIES + '.';
    return;
  }
  inputNote = '';
  const s = SCRIBES[sel];
  const x = crossover(s);
  tries[sel].push(n);
  if (Math.abs(n - x) <= 1) {
    state[sel] = 'correct';
    feedback[sel] = 'Correct: from ' + x + ' copies, the press is cheaper.';
  } else if (tries[sel].length < 2) {
    feedback[sel] = 'Not quite. Try setting scribe cost equal to press cost: ' + s.perCopy + ' × N = 350 + 0.2 × N.';
    predictInput.value('');
  } else {
    state[sel] = 'revealed';
    feedback[sel] = 'Not quite. ' + equationText(s);
  }
  updateLocks();
}

// ---------- Formatting ----------
function f1(v) {
  return v.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
function copiesWord(n) { return n === 1 ? '1 copy' : n.toLocaleString('en-US') + ' copies'; }

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
  textSize(canvasWidth < 500 ? 18 : 21);
  text('Scribe or Press?', margin, 9);
  textStyle(ITALIC);
  textSize(13);
  fill('#444');
  text(fitText(canvasWidth < 560 ? 'A 200-page book. Costs in workdays. Illustrative, not historical prices.'
                                  : 'A 200-page book. All costs in workdays. Illustrative model, not historical prices.',
               canvasWidth - 2 * margin), margin, 36);
  textStyle(NORMAL);

  drawTable();
  drawPanel();
  drawChart();
  drawControlLabels();
}

function drawTable() {
  const inner = canvasWidth - 2 * margin;
  const narrow = canvasWidth < 560;
  const cols = [0, 0.31, 0.50, 0.66, 0.82].map(f => margin + f * inner);
  const heads = narrow ? ['Method', 'Rate', 'Fixed', 'Per copy', 'Total']
                       : ['Method', 'Rate', 'Fixed cost', 'Cost per copy', 'At ' + copiesWord(copies)];
  const rows = [
    { i: 0, cells: [SCRIBES[0].name, (narrow ? '8 pp/day' : '8 pages a day'), '0', '25',
                    f1(scribeCost(SCRIBES[0], copies))], color: INK },
    { i: 1, cells: [SCRIBES[1].name, (narrow ? '2 pp/day' : '2 pages a day'), '0', '100',
                    f1(scribeCost(SCRIBES[1], copies))], color: INK },
    { i: 2, cells: ['Printing press', (narrow ? 'set once' : 'type set once'), '350', '0.2',
                    f1(pressCost(copies))], color: PRESS }
  ];
  // header
  stroke('silver');
  fill('#E6EEF5');
  rect(margin, tableTop, inner, rowH);
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(narrow ? 11 : 13);
  textAlign(LEFT, CENTER);
  for (let c = 0; c < 5; c++) {
    const w = (c < 4 ? cols[c + 1] : margin + inner) - cols[c] - 8;
    text(fitText(heads[c], w), cols[c] + 6, tableTop + rowH / 2);
  }
  textStyle(NORMAL);
  for (let r = 0; r < 3; r++) {
    const y = tableTop + (r + 1) * rowH;
    const active = rows[r].i === sel || rows[r].i === 2;
    stroke('silver');
    fill(active ? (rows[r].i === 2 ? '#E8F1F8' : '#FBF1E4') : 'white');
    rect(margin, y, inner, rowH);
    // swatch
    noStroke();
    if (active) {
      fill(rows[r].color);
      rect(margin + 1, y + 1, 5, rowH - 1);
    }
    fill(active ? 'black' : '#808080');
    textSize(narrow ? 11 : 13);
    for (let c = 0; c < 5; c++) {
      const w = (c < 4 ? cols[c + 1] : margin + inner) - cols[c] - 8;
      if (c === 4 && active) textStyle(BOLD);
      text(fitText(rows[r].cells[c], w), cols[c] + 8, y + rowH / 2);
      textStyle(NORMAL);
    }
  }
  // note
  fill('#333');
  textSize(12);
  textAlign(LEFT, TOP);
  drawWrapped('Press fixed cost: casting type, building the press and setting all 200 pages. ' +
              'Per copy: printing, paper handling and binding labor.', margin, noteTop, inner, 15);
}

function drawPanel() {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(panelX, panelY, panelW, panelH, 8);
  noStroke();
  const pad = 10, tw = panelW - 2 * pad;
  const s = SCRIBES[sel];
  let y = panelY + 8;
  textAlign(LEFT, TOP);
  fill('black');
  textStyle(BOLD);
  textSize(15);
  y = drawWrapped('How many copies before the press is cheaper?', panelX + pad, y, tw, 19);
  textStyle(NORMAL);
  textSize(12);
  fill('#444');
  text(fitText('Your prediction for the ' + s.name.toLowerCase() + ':', tw), panelX + pad, panelY + 56);

  // the input and button live at panelY + 72; feedback below them
  y = panelY + 108;
  textSize(13);
  if (inputNote) {
    fill('firebrick');
    y = drawWrapped(inputNote, panelX + pad, y, tw, 17) + 4;
  }
  if (state[sel] === 'open' && !feedback[sel]) {
    fill('#333');
    y = drawWrapped('Type a number and press Check Prediction. The copies slider unlocks after you check.',
                    panelX + pad, y, tw, 17) + 4;
  } else if (feedback[sel]) {
    const st = state[sel];
    fill(st === 'correct' ? 'darkgreen' : 'firebrick');
    textStyle(BOLD);
    const fb = feedback[sel];
    y = drawWrapped(fb, panelX + pad, y, tw, 17) + 4;
    textStyle(NORMAL);
    if (st === 'open') {
      fill('#555');
      y = drawWrapped('Attempt 2 of 2.', panelX + pad, y, tw, 17) + 2;
    } else if (state[0] === 'open' || state[1] === 'open') {
      fill('#333');
      y = drawWrapped('Now move the copies slider and watch the lines cross.', panelX + pad, y, tw, 17) + 2;
    }
  }

  // Both types done?
  const bothDone = state[0] !== 'open' && state[1] !== 'open';
  const maxY = panelY + panelH - 8;
  if (bothDone) {
    y += 4;
    fill('#1F3F5F');
    textStyle(BOLD);
    y = drawWrapped('The press costs more to start and less to copy. That is why it won for any book wanted ' +
                    'by more than a handful of readers.', panelX + pad, y, tw, 17, maxY) + 2;
    textStyle(NORMAL);
  } else {
    const other = 1 - sel;
    if (state[sel] !== 'open' && state[other] === 'open') {
      y += 4;
      fill('#333');
      y = drawWrapped('Next: choose ' + SCRIBES[other].name + ' below and predict again.', panelX + pad, y, tw, 17, maxY) + 2;
    }
  }
  // Status of both predictions, at the bottom of the panel or just below the text
  textSize(12);
  const sy = Math.max(y + 6, panelY + panelH - 8 - 2 * 16);
  for (let k = 0; k < 2; k++) {
    const st = state[k];
    let msg;
    if (st === 'correct') msg = 'correct on try ' + tries[k].length;
    else if (st === 'revealed') msg = 'revealed: ' + crossover(SCRIBES[k]) + ' copies';
    else msg = tries[k].length ? '1 try used' : 'not predicted yet';
    fill(st === 'correct' ? 'darkgreen' : (st === 'revealed' ? 'firebrick' : '#666'));
    const mark = st === 'correct' ? '✓ ' : (st === 'revealed' ? '✗ ' : '○ ');
    text(fitText(mark + SCRIBES[k].name + ': ' + msg, tw), panelX + pad, sy + k * 16);
  }
}

function niceStep(range, target) {
  const raw = range / target;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}

function drawChart() {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(chartX, chartY, chartW, chartH, 8);
  const s = SCRIBES[sel];
  const sc = scribeCost(s, copies), pc = pressCost(copies);

  // Readout: values at the current slider position, and the verdict
  noStroke();
  textAlign(LEFT, TOP);
  textSize(13);
  let x = chartX + 10;
  const y0 = chartY + 8;
  fill(INK); rect(x, y0 + 2, 11, 11);
  fill('black');
  const t1 = s.name + ': ' + f1(sc);
  text(t1, x + 15, y0);
  x += 15 + textWidth(t1) + 14;
  fill(PRESS); rect(x, y0 + 2, 11, 11);
  fill('black');
  text(fitText('Press: ' + f1(pc) + ' workdays', chartX + chartW - x - 25), x + 15, y0);
  const cheaper = pc < sc ? 'the press' : (pc > sc ? 'the ' + s.who : 'equal');
  textStyle(BOLD);
  fill(pc < sc ? PRESS : INK);
  text(fitText(pc === sc ? 'At ' + copiesWord(copies) + ' the two costs are equal.'
                         : 'At ' + copiesWord(copies) + ', ' + cheaper + ' is cheaper.', chartW - 20),
       chartX + 10, y0 + 18);
  textStyle(NORMAL);

  // Plot area
  const px0 = chartX + 64, px1 = chartX + chartW - 14;
  const py0 = chartY + 48, py1 = chartY + chartH - 38;
  const xMax = X_RANGES.find(r => r >= copies);
  const yTop = Math.max(scribeCost(s, xMax), pressCost(xMax));
  const yStep = niceStep(yTop, 5);
  const yMax = Math.ceil(yTop / yStep) * yStep;
  const xStep = niceStep(xMax, 5);
  const X = v => px0 + (v / xMax) * (px1 - px0);
  const Y = v => py1 - (v / yMax) * (py1 - py0);

  // grid and ticks
  textSize(11);
  for (let v = 0; v <= yMax + 1e-9; v += yStep) {
    stroke('#E4E4E4');
    line(px0, Y(v), px1, Y(v));
    noStroke();
    fill('#444');
    textAlign(RIGHT, CENTER);
    text(v.toLocaleString('en-US'), px0 - 5, Y(v));
  }
  for (let v = 0; v <= xMax + 1e-9; v += xStep) {
    stroke('#E4E4E4');
    line(X(v), py0, X(v), py1);
    noStroke();
    fill('#444');
    textAlign(CENTER, TOP);
    text(String(v), X(v), py1 + 4);
  }
  stroke('#888');
  line(px0, py1, px1, py1);
  line(px0, py0, px0, py1);
  noStroke();
  fill('#333');
  textSize(12);
  textAlign(CENTER, TOP);
  text('Copies (axis widens as the slider moves)', (px0 + px1) / 2, py1 + 19);
  push();
  translate(chartX + 12, (py0 + py1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Total cost (workdays)', 0, 0);
  pop();

  // Crossover marker, once the lines have reached it
  const cx = crossover(s);
  if (copies >= cx) {
    const be = breakEven(s);
    stroke('#555');
    strokeWeight(1.5);
    drawingContext.setLineDash([5, 4]);
    line(X(cx), py0, X(cx), py1);
    drawingContext.setLineDash([]);
    noStroke();
    fill('#333');
    textSize(12);
    textStyle(BOLD);
    const lab = 'Press cheaper from ' + cx + ' copies';
    const lw = textWidth(lab) + 10;
    let lx = X(cx) + 6;
    if (lx + lw > px1) lx = X(cx) - 6 - lw;
    fill(255, 255, 255, 235);
    rect(lx, py0 + 2, lw, 18, 3);
    fill('#333');
    textAlign(LEFT, CENTER);
    text(lab, lx + 5, py0 + 11);
    textStyle(NORMAL);
    // where the lines meet
    stroke('black');
    strokeWeight(1);
    fill('gold');
    circle(X(be), Y(pressCost(be)), 9);
  }

  // Cost lines from 0 copies to the current number
  strokeWeight(3);
  stroke(PRESS);
  line(X(0), Y(PRESS_FIXED), X(copies), Y(pc));
  stroke(INK);
  line(X(0), Y(0), X(copies), Y(sc));
  strokeWeight(1);
  stroke('white');
  fill(PRESS);
  circle(X(copies), Y(pc), 10);
  fill(INK);
  circle(X(copies), Y(sc), 10);

  // Label the press's fixed cost at 0 copies
  noStroke();
  fill(PRESS);
  textSize(12);
  textAlign(LEFT, BOTTOM);
  if (copies < xMax * 0.45) text('350 to set up', X(0) + 4, Y(PRESS_FIXED) - 5);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  const y1 = drawHeight + 8 + 11;
  textStyle(BOLD);
  text('Copies: ' + copies, margin, y1);
  textStyle(NORMAL);
  const y2 = drawHeight + 42 + 12;
  text('Scribe:', margin, y2);
  if (state[sel] === 'open') {
    fill('#8B2A20');
    textSize(12);
    const sx = margin + 58 + scribeSelect.elt.offsetWidth + 12;
    const maxW = canvasWidth - margin - resetButton.elt.offsetWidth - 12 - sx;
    text(fitText('Slider locked until you check a prediction.', maxW), sx, y2);
  }
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

function drawWrapped(str, x, y, maxW, lineH, maxY) {
  const lines = wrapLines(str, maxW);
  for (let i = 0; i < lines.length; i++) {
    if (maxY && y + (i + 1) * lineH > maxY + 2) break;
    text(lines[i], x, y + i * lineH);
  }
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
