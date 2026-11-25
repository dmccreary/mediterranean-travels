// Planning Day 3 Around the Prayer Times - p5.js 2.x
// CANVAS_HEIGHT: 574
// A drag-and-drop day planner for Friday, November 13, 2026 in Istanbul.
// The learner drags five activity cards onto a 9:00 AM to 6:00 PM grid of
// 30-minute slots, then presses Check. Every broken rule is named: mosque
// visits inside a prayer closure, Topkapi running past 5:00 PM, no time to
// walk between Sultanahmet and Suleymaniye, overlaps, unplaced cards.

let canvasWidth = 700;
let drawHeight = 528;
let controlHeight = 46;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

// ---------- Day grid ----------
const DAY_START = 9 * 60;          // 9:00 AM, in minutes after midnight
const SLOT_MIN = 30;
const SLOTS = 18;                  // 9:00 AM to 6:00 PM
const gridTop = 66;
const slotH = 24;
const gridBottom = gridTop + SLOTS * slotH;

// Closure bands, in slots from 9:00 AM: [start, end)
const BANDS = [
  { key: 'friday', name: 'Friday prayer closure', short: 'Friday prayer',
    from: 5, to: 11, range: '11:30–2:30', at: '12:55',
    msg: 'overlaps the Friday prayer closure (11:30 AM to 2:30 PM).' },
  { key: 'afternoon', name: 'Afternoon prayer closure', short: 'Afternoon prayer',
    from: 12, to: 14, range: '3:00–4:00', at: '3:25',
    msg: 'overlaps the afternoon prayer closure (3:00 to 4:00 PM).' },
  { key: 'sunset', name: 'Sunset prayer closure', short: 'Sunset prayer',
    from: 17, to: 18, range: '5:30–6:00', at: '5:50',
    msg: 'overlaps the sunset prayer closure (5:30 PM).' }
];
// Prayer times for Istanbul, Friday, November 13, 2026 (minutes after midnight)
const PRAYERS = [
  { label: '12:55', min: 12 * 60 + 55 },
  { label: '3:25', min: 15 * 60 + 25 },
  { label: '5:50', min: 17 * 60 + 50 }
];

const AREAS = {
  S: { name: 'Sultanahmet', fill: '#D9E8F5', edge: '#2F6E8E' },
  U: { name: 'Süleymaniye', fill: '#DDEFD8', edge: '#2E7D4F' },
  L: { name: 'Either area', fill: '#FBE9C9', edge: '#A8681F' }
};

const ACTS = [
  { name: 'Topkapı Palace, including the Harem', short: 'Topkapı Palace', area: 'S',
    slots: 6, kind: 'Palace, closes 5 PM', mosque: false },
  { name: 'Blue Mosque', short: 'Blue Mosque', area: 'S', slots: 2, kind: 'Mosque', mosque: true },
  { name: 'Süleymaniye Mosque and courtyard', short: 'Süleymaniye Mosque', area: 'U',
    slots: 2, kind: 'Mosque', mosque: true },
  { name: 'Rüstem Pasha Mosque', short: 'Rüstem Pasha Mosque', area: 'U', slots: 1, kind: 'Mosque', mosque: true },
  { name: 'Lunch', short: 'Lunch', area: 'L', slots: 2, kind: 'Meal', mosque: false }
];
// One valid plan from the specification (start slots)
const SOLUTION = [2, 0, 14, 11, 8];

// ---------- State ----------
let start = [];          // start slot per activity, or -1 when in the tray
let dragging = -1;
let grabDX = 0, grabDY = 0;
let checks = 0;
let invalidChecks = 0;
let result = null;       // { valid, messages, bad: Set } from the last Check
let solved = false;
let revealed = false;

// Layout (computed in computeLayout)
let timeColW = 58, laneX = 0, laneW = 0, labelX = 0, labelW = 0, panelX = 0, panelW = 0;
let trayRects = [];

// ---------- Controls ----------
let checkButton, solutionButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.style('touch-action', 'none');

  checkButton = createButton('Check');
  checkButton.parent(document.querySelector('main'));
  checkButton.style('font-size', '15px');
  checkButton.mousePressed(checkSchedule);

  solutionButton = createButton('Show One Solution');
  solutionButton.parent(document.querySelector('main'));
  solutionButton.style('font-size', '15px');
  solutionButton.mousePressed(showSolution);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.style('font-size', '15px');
  resetButton.mousePressed(resetAll);

  computeLayout();
  positionControls();
  resetAll();

  describe('A day planner for Friday, November 13, 2026 in Istanbul. A vertical grid runs from 9:00 AM to 6:00 PM in ' +
           '30-minute slots, with three shaded bands when mosques close to visitors: 11:30 AM to 2:30 PM for Friday ' +
           'prayer, 3:00 to 4:00 PM for afternoon prayer, and 5:30 to 6:00 PM for sunset prayer. Five cards, Topkapi ' +
           'Palace (3 hours), the Blue Mosque (1 hour), the Suleymaniye Mosque (1 hour), the Rustem Pasha Mosque ' +
           '(30 minutes) and lunch (1 hour), are dragged onto the grid. The Check button lists every broken rule.');
}

function computeLayout() {
  const inner = canvasWidth - 2 * margin;
  timeColW = 58;
  labelW = canvasWidth >= 620 ? 128 : 0;
  panelW = Math.max(190, Math.round(inner * 0.34));
  laneX = margin + timeColW;
  laneW = inner - timeColW - labelW - panelW - (labelW ? 16 : 10);
  labelX = laneX + laneW + 4;
  panelX = canvasWidth - margin - panelW;
  trayRects = [];
  for (let i = 0; i < ACTS.length; i++) {
    trayRects.push({ x: panelX, y: gridTop + 18 + i * 42, w: panelW, h: 37 });
  }
}

function positionControls() {
  const y = drawHeight + 9;
  checkButton.position(margin, y);
  solutionButton.position(margin + 76, y);
  resetButton.position(margin + 240, y);
}

function resetAll() {
  start = ACTS.map(() => -1);
  dragging = -1;
  checks = 0;
  invalidChecks = 0;
  result = null;
  solved = false;
  revealed = false;
  updateButtons();
}

function showSolution() {
  if (invalidChecks < 3) return;
  start = SOLUTION.slice();
  revealed = true;
  result = evaluate(start);
  updateButtons();
}

function updateButtons() {
  if (invalidChecks >= 3) solutionButton.removeAttribute('disabled');
  else solutionButton.attribute('disabled', '');
}

// ---------- Rules ----------
function fmt(min) {
  let h = Math.floor(min / 60), m = min % 60;
  const ap = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
}
function slotTime(s) { return DAY_START + s * SLOT_MIN; }
function span(i, st) {
  const a = fmt(slotTime(st[i])), b = fmt(slotTime(st[i] + ACTS[i].slots));
  return (a.slice(-2) === b.slice(-2) ? a.slice(0, -3) : a) + '–' + b;
}

// Returns { valid, messages[], bad:Set of activity indexes }
function evaluate(st) {
  const messages = [];
  const bad = new Set();
  const placed = [];
  for (let i = 0; i < ACTS.length; i++) if (st[i] >= 0) placed.push(i);

  // Prayer closures (mosques only)
  for (const i of placed) {
    if (!ACTS[i].mosque) continue;
    const a = st[i], b = st[i] + ACTS[i].slots;
    for (const band of BANDS) {
      if (a < band.to && b > band.from) {
        messages.push(ACTS[i].short + ' ' + band.msg);
        bad.add(i);
      }
    }
  }
  // Topkapi opening hours
  if (st[0] >= 0 && st[0] + ACTS[0].slots > 16) {
    messages.push('Topkapı must finish by 5:00 PM.');
    bad.add(0);
  }
  // Overlaps
  let overlapping = new Set();
  for (let p = 0; p < placed.length; p++) {
    for (let q = p + 1; q < placed.length; q++) {
      const i = placed[p], j = placed[q];
      if (st[i] < st[j] + ACTS[j].slots && st[j] < st[i] + ACTS[i].slots) {
        const [x, y] = st[i] <= st[j] ? [i, j] : [j, i];
        messages.push(ACTS[x].short + ' and ' + ACTS[y].short + ' overlap.');
        bad.add(i); bad.add(j);
        overlapping.add(i); overlapping.add(j);
      }
    }
  }
  // Walking: lunch can be eaten in either area, so the walk is checked between
  // consecutive sights; it needs one empty slot somewhere between them.
  const sights = placed.filter(i => ACTS[i].area !== 'L' && !overlapping.has(i))
                       .sort((i, j) => st[i] - st[j]);
  for (let k = 0; k + 1 < sights.length; k++) {
    const a = sights[k], b = sights[k + 1];
    if (ACTS[a].area === ACTS[b].area) continue;
    const from = st[a] + ACTS[a].slots, to = st[b];
    let empty = 0;
    for (let s = from; s < to; s++) {
      let used = false;
      for (const i of placed) if (s >= st[i] && s < st[i] + ACTS[i].slots) used = true;
      if (!used) empty++;
    }
    if (empty < 1) {
      messages.push('Allow 30 minutes to walk between Sultanahmet and Süleymaniye before ' + ACTS[b].short + '.');
      bad.add(b);
    }
  }
  if (placed.length < ACTS.length) messages.push('Place all five activities.');
  return { valid: messages.length === 0, messages: messages, bad: bad };
}

function checkSchedule() {
  if (revealed) return;
  checks++;
  result = evaluate(start);
  if (result.valid) solved = true;
  else invalidChecks++;
  updateButtons();
}

// ---------- Drag and drop ----------
function blockRect(i) {
  return { x: laneX + 2, y: gridTop + start[i] * slotH + 1, w: laneW - 4, h: ACTS[i].slots * slotH - 2 };
}
function inside(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth) return;
  // Topmost placed block first (drawn last)
  for (let i = ACTS.length - 1; i >= 0; i--) {
    if (start[i] >= 0 && inside(blockRect(i), mouseX, mouseY)) {
      const r = blockRect(i);
      beginDrag(i, mouseX - r.x, mouseY - r.y);
      return false;
    }
  }
  for (let i = 0; i < ACTS.length; i++) {
    if (start[i] < 0 && inside(trayRects[i], mouseX, mouseY)) {
      beginDrag(i, Math.min(40, laneW / 3), Math.min(slotH / 2, mouseY - trayRects[i].y));
      return false;
    }
  }
}

function beginDrag(i, dx, dy) {
  if (revealed) revealed = false;
  dragging = i;
  grabDX = dx;
  grabDY = dy;
}

function dropSlot(i) {
  const top = mouseY - grabDY;
  let s = Math.round((top - gridTop) / slotH);
  return constrain(s, 0, SLOTS - ACTS[i].slots);
}
function overGrid() {
  return mouseX > margin && mouseX < labelX + labelW + 6 && mouseY > gridTop - 30 && mouseY < gridBottom + 30;
}

function mouseReleased() {
  if (dragging < 0) return;
  const i = dragging;
  dragging = -1;
  start[i] = overGrid() ? dropSlot(i) : -1;
  if (result) result = null;     // the plan changed; the last Check no longer applies
  return false;
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
  textSize(canvasWidth < 560 ? 17 : 21);
  text('Planning Day 3 Around the Prayer Times', margin, 9);
  textStyle(NORMAL);
  textSize(13);
  fill('#333');
  text(fitText('Friday, November 13, 2026, Istanbul. Shaded: mosques closed to visitors. ' +
               'Dashed: prayer times.', canvasWidth - 2 * margin), margin, 38);

  drawGrid();
  drawTray();
  drawFeedback();
  for (let i = 0; i < ACTS.length; i++) if (start[i] >= 0 && i !== dragging) drawBlock(i, blockRect(i), false);
  if (dragging >= 0) drawDragged();

  noStroke();
  fill('dimgray');
  textStyle(ITALIC);
  textSize(12);
  textAlign(LEFT, TOP);
  text(fitText('Illustrative times: check the Diyanet and site hours on the day.', canvasWidth - 2 * margin),
       margin, gridBottom + 12);
  textStyle(NORMAL);

  // Control-row status
  textAlign(LEFT, CENTER);
  textSize(14);
  fill('#333');
  const sx = margin + 240 + resetButton.elt.offsetWidth + 14;
  let status = 'Checks: ' + checks;
  if (invalidChecks >= 3 && !solved) status += '. Show One Solution is now available.';
  text(fitText(status, canvasWidth - sx - margin), sx, drawHeight + controlHeight / 2);

  cursor(dragging >= 0 ? 'grabbing' : (hoverDraggable() ? 'grab' : ARROW));
}

function hoverDraggable() {
  for (let i = 0; i < ACTS.length; i++) {
    if (start[i] >= 0 && inside(blockRect(i), mouseX, mouseY)) return true;
    if (start[i] < 0 && inside(trayRects[i], mouseX, mouseY)) return true;
  }
  return false;
}

function drawGrid() {
  const right = labelW ? labelX + labelW : laneX + laneW;
  // Lane background
  stroke('silver');
  fill('white');
  rect(laneX, gridTop, laneW, SLOTS * slotH);

  // Closure bands
  for (const band of BANDS) {
    const y1 = gridTop + band.from * slotH, h = (band.to - band.from) * slotH;
    noStroke();
    fill(196, 72, 60, 38);
    rect(laneX, y1, right - laneX, h);
    // diagonal hatching on the lane
    stroke(196, 72, 60, 70);
    strokeWeight(1);
    for (let x = -h; x < laneW; x += 12) {
      const x1 = Math.max(0, x), y1a = y1 + (x1 - x);
      const x2 = Math.min(laneW, x + h), y2a = y1 + (x2 - x);
      if (x2 > x1) line(laneX + x1, y1a, laneX + x2, y2a);
    }
    noStroke();
    // Band label: the prayer and its closure window
    fill('#8B2A20');
    if (labelW) {
      textAlign(LEFT, TOP);
      textStyle(BOLD);
      textSize(11);
      text(band.short + ' ' + band.at, labelX + 6, y1 + 3);
      textStyle(NORMAL);
      text('closed ' + band.range, labelX + 6, y1 + 15);
    } else {
      textSize(11);
      textAlign(RIGHT, TOP);
      text('closed ' + band.range, laneX + laneW - 4, y1 + 3);
    }
  }
  // Slot lines and time labels
  for (let s = 0; s <= SLOTS; s++) {
    const y = gridTop + s * slotH;
    stroke(s % 2 === 0 ? '#B8B8B8' : '#E4E4E4');
    strokeWeight(1);
    line(laneX, y, laneX + laneW, y);
    if (s % 2 === 0) {
      noStroke();
      fill('#333');
      textAlign(RIGHT, CENTER);
      textSize(11);
      text(fmt(slotTime(s)), laneX - 6, y);
    }
  }
  // Prayer-time lines
  for (const p of PRAYERS) {
    const y = gridTop + (p.min - DAY_START) / SLOT_MIN * slotH;
    stroke('#5A2A82');
    strokeWeight(2);
    drawingContext.setLineDash([5, 4]);
    line(laneX, y, laneX + laneW, y);
    drawingContext.setLineDash([]);
  }
  noStroke();
  strokeWeight(1);
}

function drawTray() {
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(13);
  text(fitText('Drag each activity onto the day', panelW), panelX, gridTop - 2);
  textStyle(NORMAL);
  for (let i = 0; i < ACTS.length; i++) {
    const r = trayRects[i];
    if (start[i] >= 0 || i === dragging) {
      stroke('#C8C8C8');
      strokeWeight(1);
      drawingContext.setLineDash([4, 4]);
      noFill();
      rect(r.x, r.y, r.w, r.h, 6);
      drawingContext.setLineDash([]);
      noStroke();
      fill('#A0A0A0');
      textSize(12);
      textAlign(LEFT, CENTER);
      text(fitText((i + 1) + '. ' + ACTS[i].short + (start[i] >= 0 ? ': ' + span(i, start) : ''), r.w - 16),
           r.x + 8, r.y + r.h / 2);
      continue;
    }
    const A = AREAS[ACTS[i].area];
    stroke(A.edge);
    strokeWeight(1.5);
    fill(A.fill);
    rect(r.x, r.y, r.w, r.h, 6);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(13);
    text(fitText((i + 1) + '. ' + ACTS[i].name, r.w - 14), r.x + 7, r.y + 4);
    textStyle(NORMAL);
    textSize(12);
    fill('#333');
    const dur = ACTS[i].slots === 1 ? '30 min' : (ACTS[i].slots / 2) + ' h';
    text(fitText(A.name + ' · ' + dur + ' · ' + ACTS[i].kind, r.w - 14), r.x + 7, r.y + 21);
  }
}

function drawBlock(i, r, ghost) {
  const A = AREAS[ACTS[i].area];
  let edge = A.edge, sw = 1.5;
  if (result && !ghost) {
    if (result.bad.has(i)) { edge = 'firebrick'; sw = 3; }
    else if (result.valid || result.messages.length) { edge = 'seagreen'; sw = 2.5; }
  }
  stroke(edge);
  strokeWeight(sw);
  fill(A.fill);
  if (ghost) drawingContext.globalAlpha = 0.85;
  rect(r.x, r.y, r.w, r.h, 5);
  drawingContext.globalAlpha = 1;
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  const flagged = result && !ghost && result.bad.has(i);
  const tw = r.w - (flagged ? 24 : 12);
  const st = ghost ? previewStarts(i) : start;
  const when = st[i] >= 0 ? span(i, st) : '';
  if (ACTS[i].slots === 1) {
    textSize(12);
    textStyle(BOLD);
    const nm = ACTS[i].short;
    const full = nm + '  ' + when;
    text(fitText(full, tw), r.x + 6, r.y + r.h / 2);
    textStyle(NORMAL);
  } else {
    textSize(13);
    textStyle(BOLD);
    text(fitText(ACTS[i].short, tw), r.x + 6, r.y + 12);
    textStyle(NORMAL);
    textSize(12);
    fill('#333');
    text(fitText(when + ' · ' + AREAS[ACTS[i].area].name, tw), r.x + 6, r.y + 29);
  }
  if (result && !ghost && result.bad.has(i)) {
    fill('firebrick');
    textAlign(RIGHT, CENTER);
    textStyle(BOLD);
    textSize(15);
    text('!', r.x + r.w - 7, r.y + Math.min(r.h / 2, 12));
    textStyle(NORMAL);
  }
}

function previewStarts(i) {
  const st = start.slice();
  st[i] = overGrid() ? dropSlot(i) : -1;
  return st;
}

function drawDragged() {
  const i = dragging;
  if (overGrid()) {
    // Snap preview
    const s = dropSlot(i);
    noFill();
    stroke('#555');
    strokeWeight(2);
    drawingContext.setLineDash([6, 4]);
    rect(laneX + 2, gridTop + s * slotH + 1, laneW - 4, ACTS[i].slots * slotH - 2, 5);
    drawingContext.setLineDash([]);
  }
  const r = { x: mouseX - grabDX, y: mouseY - grabDY, w: laneW - 4, h: ACTS[i].slots * slotH - 2 };
  drawBlock(i, r, true);
}

function drawFeedback() {
  const x = panelX, y = trayRects[ACTS.length - 1].y + trayRects[0].h + 10;
  const w = panelW, h = gridBottom - y;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  const pad = 9, tw = w - 2 * pad;
  let yy = y + 8;
  textAlign(LEFT, TOP);
  const maxY = y + h - 8;

  if (!result) {
    fill('black');
    textStyle(BOLD);
    textSize(14);
    yy = drawWrapped('It’s Friday. When can we visit the mosques?', x + pad, yy, tw, 18, maxY);
    textStyle(NORMAL);
    textSize(12);
    fill('#333');
    const notes = [
      'Mosques must avoid the shaded closures.',
      'Topkapı is not affected, but closes at 5:00 PM.',
      'Leave one empty slot to walk between Sultanahmet and Süleymaniye.',
      'Lunch can be eaten in either area.',
      'Then press Check.'
    ];
    yy += 4;
    for (const n of notes) yy = drawWrapped('• ' + n, x + pad, yy, tw, 15, maxY) + 2;
    return;
  }
  if (result.valid) {
    fill('darkgreen');
    textStyle(BOLD);
    textSize(14);
    yy = drawWrapped(revealed ? 'One valid plan (others work too).'
                              : 'Valid: every mosque visit falls in an open window. This is a real plan for Day 3.',
                     x + pad, yy, tw, 18, maxY);
    textStyle(NORMAL);
    textSize(12);
    fill('#333');
    if (!revealed) yy = drawWrapped('Found in ' + checks + (checks === 1 ? ' check.' : ' checks.'), x + pad, yy + 3, tw, 15, maxY);
    drawWrapped('Notice the only long mosque windows on a Friday: the morning, and 4:00 to 5:30 PM.',
                x + pad, yy + 4, tw, 15, maxY);
    return;
  }
  fill('firebrick');
  textStyle(BOLD);
  textSize(14);
  const n = result.messages.length;
  yy = drawWrapped('Not yet: ' + n + (n === 1 ? ' rule broken.' : ' rules broken.'), x + pad, yy, tw, 18, maxY);
  textStyle(NORMAL);
  textSize(12);
  fill('black');
  for (let k = 0; k < n; k++) {
    const lines = wrapLines('• ' + result.messages[k], tw);
    if (yy + lines.length * 15 > maxY - (k < n - 1 ? 15 : 0)) {
      fill('dimgray');
      text('…and ' + (n - k) + ' more.', x + pad, yy);
      break;
    }
    yy = drawWrapped('• ' + result.messages[k], x + pad, yy + 2, tw, 15, maxY);
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
  resizeCanvas(canvasWidth, canvasHeight);
  computeLayout();
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
}
