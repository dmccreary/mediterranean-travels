// Folding the Sheet: Folio, Quarto, Octavo - p5.js 2.x
// CANVAS_HEIGHT: 620
// The learner calculates the pages and the sheets of paper needed for one copy
// of Virgil's works (about 12,900 lines) in three challenge editions, then
// explores any format, page density and print run. A sheet folded once makes a
// folio (2 leaves, 4 pages), twice a quarto (4 leaves, 8 pages), three times an
// octavo (8 leaves, 16 pages). Lines per page are illustrative, not measured.

let canvasWidth = 746;
let drawHeight = 540;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

// ---------- Model ----------
const LINES = 12900;
const FORMATS = [
  { name: 'Folio', folds: 1, leaves: 2, pages: 4 },
  { name: 'Quarto', folds: 2, leaves: 4, pages: 8 },
  { name: 'Octavo', folds: 3, leaves: 8, pages: 16 }
];
const CHALLENGES = [
  { f: 0, lpp: 15, title: 'Folio, verses surrounded by commentary',
    hint: 'Pages = lines ÷ lines per page. A folio sheet makes 4 pages, so sheets = pages ÷ 4.',
    worked: '12,900 ÷ 15 = 860 pages; a folio sheet makes 4 pages, so 860 ÷ 4 = 215 sheets.' },
  { f: 2, lpp: 15, title: 'Octavo, same 15 lines per page',
    hint: 'Same text, same lines per page, so the same number of pages as challenge 1. An octavo sheet makes 16 pages, and a part-sheet still costs a whole sheet.',
    worked: 'The same 860 pages, but an octavo sheet makes 16 pages: 860 ÷ 16 = 53.75, and a part-sheet still costs a sheet, so 54.' },
  { f: 2, lpp: 30, title: 'Octavo in compact italic, no commentary',
    hint: 'Twice as many lines on each page means half as many pages. Then divide by the 16 pages of an octavo sheet and round up.',
    worked: '12,900 ÷ 30 = 430 pages; 430 ÷ 16 = 26.875, rounded up to 27 sheets.' }
];
const MAX_SHEETS = 330;   // bar scale: the most a copy can need is 323 sheets (folio, 10 lines)

function pagesFor(lpp) { return Math.ceil(LINES / lpp); }
function sheetsFor(lpp, f) { return Math.ceil(pagesFor(lpp) / FORMATS[f].pages); }

// ---------- State ----------
let cur = 0;                         // current challenge index (3 = all done)
let status = ['open', 'open', 'open'];  // 'open', 'correct', 'missed'
let tries = [0, 0, 0];
let yours = [null, null, null];      // last answer [pages, sheets]
let feedback = '';
let fbColor = '#333';
let inputNote = '';
let shownFormat = -1;                // format drawn on the sheet (-1 = unfolded)
let foldStart = 0;
let exploring = false;

// ---------- Layout ----------
let wide = true;
let lx, ly, lw, lh, rx, ry, rw, rh, sy, sh;
const TOP = 58;

// ---------- Controls ----------
let pagesInput, sheetsInput, checkButton, nextButton, formatSelect, lppSlider, copiesSlider, resetButton;

function setup() {
  updateCanvasSize();
  computeLayout();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  pagesInput = makeInput('pages', 'Pages per copy');
  sheetsInput = makeInput('sheets', 'Sheets per copy');

  checkButton = createButton('Check');
  checkButton.parent(document.querySelector('main'));
  checkButton.style('font-size', '14px');
  checkButton.mousePressed(checkAnswer);

  nextButton = createButton('Next challenge');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextChallenge);

  formatSelect = createSelect();
  formatSelect.parent(document.querySelector('main'));
  FORMATS.forEach(f => formatSelect.option(f.name));
  formatSelect.selected('Octavo');
  formatSelect.style('font-size', '14px');
  formatSelect.changed(() => { if (exploring) startFold(currentExploreFormat()); });

  lppSlider = createSlider(10, 40, 15, 5);
  lppSlider.parent(document.querySelector('main'));

  copiesSlider = createSlider(100, 2000, 1000, 100);
  copiesSlider.parent(document.querySelector('main'));

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.style('font-size', '14px');
  resetButton.mousePressed(resetAll);

  positionControls();
  resetAll();

  describe('A calculator for the paper in one copy of Virgil, about 12,900 lines. Three challenges ask for the pages ' +
           'and sheets per copy: a folio at 15 lines per page (860 pages, 215 sheets), an octavo at 15 lines per page ' +
           '(860 pages, 54 sheets) and an octavo at 30 lines per page (430 pages, 27 sheets). A drawing folds a sheet ' +
           'once, twice or three times into 2, 4 or 8 leaves, and bars compare the sheets each edition needs. After the ' +
           'challenges, a format menu and sliders for lines per page and copies unlock free exploration.');
}

function makeInput(ph, aria) {
  const inp = createInput('', 'number');
  inp.parent(document.querySelector('main'));
  inp.attribute('min', '1');
  inp.attribute('placeholder', ph);
  inp.attribute('aria-label', aria);
  inp.style('font-size', '15px');
  inp.style('width', '76px');
  inp.elt.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswer(); });
  return inp;
}

function computeLayout() {
  wide = canvasWidth >= 620;
  const inner = canvasWidth - 2 * margin;
  if (wide) {
    lw = Math.round(inner * 0.48);
    lx = margin; ly = TOP; lh = 320;
    rx = lx + lw + 10; ry = TOP; rw = inner - lw - 10; rh = lh;
    sy = TOP + lh + 8;
  } else {
    lx = margin; ly = TOP; lw = inner; lh = 320;
    rx = margin; ry = ly + lh + 8; rw = inner; rh = 306;
    sy = ry + rh + 8;
  }
  sh = 146;
  drawHeight = sy + sh + 8;
  canvasHeight = drawHeight + controlHeight;
}

function positionControls() {
  pagesInput.position(lx + 132, ly + 112);
  sheetsInput.position(lx + 132, ly + 144);
  checkButton.position(lx + 222, ly + 144);
  nextButton.position(lx + 10, ly + lh - 38);

  const y1 = drawHeight + 8;
  formatSelect.position(margin + 62, y1);
  const sx = margin + 290;
  lppSlider.position(sx, y1 + 2);
  lppSlider.size(Math.max(70, canvasWidth - sx - margin - 6));

  const y2 = drawHeight + 44;
  resetButton.position(canvasWidth - margin - resetButton.elt.offsetWidth, y2);
  const cx = margin + 120;
  copiesSlider.position(cx, y2 + 2);
  copiesSlider.size(Math.max(70, canvasWidth - cx - margin - resetButton.elt.offsetWidth - 16));
}

function resetAll() {
  cur = 0;
  status = ['open', 'open', 'open'];
  tries = [0, 0, 0];
  yours = [null, null, null];
  feedback = '';
  inputNote = '';
  exploring = false;
  shownFormat = -1;
  pagesInput.value('');
  sheetsInput.value('');
  formatSelect.selected('Octavo');
  lppSlider.value(15);
  copiesSlider.value(1000);
  updateLocks();
}

function updateLocks() {
  const open = cur < 3 && status[cur] === 'open';
  pagesInput.elt.disabled = !open;
  sheetsInput.elt.disabled = !open;
  checkButton.elt.disabled = !open;
  nextButton.elt.disabled = !(cur < 3 && !open);
  nextButton.html(cur === 2 ? 'Start exploring' : 'Next challenge');
  nextButton.style('visibility', exploring ? 'hidden' : 'visible');
  pagesInput.style('visibility', exploring ? 'hidden' : 'visible');
  sheetsInput.style('visibility', exploring ? 'hidden' : 'visible');
  checkButton.style('visibility', exploring ? 'hidden' : 'visible');
  formatSelect.elt.disabled = !exploring;
  lppSlider.elt.disabled = !exploring;
  copiesSlider.elt.disabled = !exploring;
}

function startFold(f) {
  if (f !== shownFormat) {
    shownFormat = f;
    foldStart = millis();
  }
}

function readInt(inp) {
  const raw = String(inp.value()).trim();
  const n = Number(raw);
  return (raw === '' || !Number.isInteger(n) || n < 1) ? null : n;
}

function checkAnswer() {
  if (cur > 2 || status[cur] !== 'open') return;
  const p = readInt(pagesInput), s = readInt(sheetsInput);
  if (p === null || s === null) {
    inputNote = 'Type a whole number in both boxes.';
    return;
  }
  inputNote = '';
  const C = CHALLENGES[cur];
  const mp = pagesFor(C.lpp), ms = sheetsFor(C.lpp, C.f);
  tries[cur]++;
  yours[cur] = [p, s];
  startFold(C.f);
  if (p === mp && s === ms) {
    status[cur] = 'correct';
    feedback = 'Correct: ' + fmt(mp) + ' pages on ' + fmt(ms) + ' sheets.';
    fbColor = 'darkgreen';
  } else if (tries[cur] < 2) {
    let msg = 'Not quite. ';
    if (p === mp) msg += 'Your pages are right; check the sheets. ';
    else msg += 'Check the pages first. ';
    msg += C.hint;
    if (p === mp && s === ms - 1) msg += ' Remember to round a part-sheet up.';
    feedback = msg;
    fbColor = 'firebrick';
  } else {
    status[cur] = 'missed';
    feedback = 'Not this time. ' + C.worked;
    fbColor = 'firebrick';
  }
  if (status[cur] !== 'open' && cur === 2) {
    feedback += ' Same Virgil, about one-eighth of the paper: small fold, dense page.';
  }
  updateLocks();
}

function nextChallenge() {
  if (cur > 2 || status[cur] === 'open') return;
  if (cur < 2) {
    cur++;
    feedback = '';
    inputNote = '';
    shownFormat = -1;
    pagesInput.value('');
    sheetsInput.value('');
  } else {
    cur = 3;
    exploring = true;
    startFold(currentExploreFormat());
  }
  updateLocks();
}

function currentExploreFormat() {
  return FORMATS.findIndex(f => f.name === formatSelect.value());
}

function correctCount() { return status.filter(s => s === 'correct').length; }

// ---------- Formatting ----------
function fmt(n) { return n.toLocaleString('en-US'); }

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
  textSize(canvasWidth < 500 ? 17 : 21);
  text(fitText('Folding the Sheet: Folio, Quarto, Octavo', canvasWidth - 2 * margin), margin, 9);
  textStyle(ITALIC);
  textSize(13);
  fill('#444');
  text(fitText("Virgil's Eclogues, Georgics and Aeneid: about 12,900 lines. Illustrative page densities.",
               canvasWidth - 2 * margin), margin, 36);
  textStyle(NORMAL);

  drawChallengePanel();
  drawSheetPanel();
  drawStrip();
  drawControlLabels();
}

function panel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
}

function drawChallengePanel() {
  panel(lx, ly, lw, lh);
  const pad = 10, tw = lw - 2 * pad;
  textAlign(LEFT, TOP);
  if (exploring) {
    fill('black');
    textStyle(BOLD);
    textSize(15);
    text('Free exploration', lx + pad, ly + 10);
    textStyle(NORMAL);
    textSize(13);
    fill(correctCount() >= 3 ? 'darkgreen' : '#8B2A20');
    text('Challenges correct: ' + correctCount() + ' of 3', lx + pad, ly + 32);
    fill('#333');
    let y = drawWrapped('Choose a format, the lines of Virgil per page and the number of copies below. ' +
                        'The results update at once.', lx + pad, ly + 56, tw, 17);
    y += 8;
    const f = currentExploreFormat(), lpp = lppSlider.value(), copies = copiesSlider.value();
    const pg = pagesFor(lpp), spc = sheetsFor(lpp, f);
    const rows = [
      ['Pages', fmt(pg), '12,900 ÷ ' + lpp + ', rounded up'],
      ['Sheets per copy', fmt(spc), fmt(pg) + ' ÷ ' + FORMATS[f].pages + ', rounded up'],
      ['Sheets per edition', fmt(spc * copies), fmt(spc) + ' × ' + fmt(copies) + ' copies']
    ];
    for (const r of rows) {
      fill('#F3F7FA');
      rect(lx + pad, y, tw, 46, 5);
      fill('#444');
      textSize(12);
      text(r[0], lx + pad + 8, y + 5);
      fill('black');
      textStyle(BOLD);
      textSize(18);
      text(r[1], lx + pad + 8, y + 21);
      textStyle(NORMAL);
      textSize(12);
      fill('#555');
      textAlign(RIGHT, TOP);
      text(fitText(r[2], tw - 110), lx + pad + tw - 8, y + 25);
      textAlign(LEFT, TOP);
      y += 52;
    }
    fill('#1F3F5F');
    textStyle(BOLD);
    textSize(13);
    drawWrapped('The fold divides the paper by 4 from folio to octavo; a page twice as dense halves it again.',
                lx + pad, y + 2, tw, 17, ly + lh - 6);
    textStyle(NORMAL);
    return;
  }

  const C = CHALLENGES[cur];
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('Challenge ' + (cur + 1) + ' of 3', lx + pad, ly + 10);
  textStyle(NORMAL);
  textSize(13);
  fill('#555');
  textAlign(RIGHT, TOP);
  text('Challenges correct: ' + correctCount() + ' of 3', lx + lw - pad, ly + 12);
  textAlign(LEFT, TOP);

  fill('#5a1f1a');
  textStyle(BOLD);
  textSize(14);
  text(fitText(C.title, tw), lx + pad, ly + 36);
  textStyle(NORMAL);
  fill('black');
  text(fitText(C.lpp + ' lines of Virgil per page', tw), lx + pad, ly + 56);
  textStyle(ITALIC);
  textSize(13);
  fill('#333');
  text(fitText('How many sheets of paper does one copy need?', tw), lx + pad, ly + 80);
  textStyle(NORMAL);

  // labels beside the two inputs
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Pages per copy:', lx + pad, ly + 124);
  text('Sheets per copy:', lx + pad, ly + 156);
  textAlign(LEFT, TOP);

  let y = ly + 182;
  textSize(13);
  const maxY = ly + lh - 44;
  if (inputNote) {
    fill('firebrick');
    y = drawWrapped(inputNote, lx + pad, y, tw, 17, maxY) + 2;
  }
  if (status[cur] === 'open' && !feedback) {
    fill('#555');
    y = drawWrapped('Type both numbers and press Check. Two attempts; the sheet folds when you check.',
                    lx + pad, y, tw, 17, maxY);
  } else if (feedback) {
    fill(fbColor);
    textStyle(status[cur] === 'correct' ? BOLD : NORMAL);
    y = drawWrapped(feedback, lx + pad, y, tw, 17, maxY) + 2;
    textStyle(NORMAL);
    if (status[cur] !== 'open' && yours[cur]) {
      const mp = pagesFor(C.lpp), ms = sheetsFor(C.lpp, C.f);
      fill('#333');
      y = drawWrapped('Pages, sheets: yours ' + fmt(yours[cur][0]) + ', ' + fmt(yours[cur][1]) + '; model ' +
                      fmt(mp) + ', ' + fmt(ms) + '.', lx + pad, y, tw, 17, maxY);
    }
  }
  // attempt counter beside the Next button
  textSize(12);
  fill('#666');
  textAlign(RIGHT, CENTER);
  const att = status[cur] === 'open' ? 'Attempt ' + (tries[cur] + 1) + ' of 2'
            : (status[cur] === 'correct' ? 'Correct on attempt ' + tries[cur] : 'Missed');
  text(att, lx + lw - pad, ly + lh - 24);
  textAlign(LEFT, TOP);
}

function drawSheetPanel() {
  panel(rx, ry, rw, rh);
  const pad = 10, tw = rw - 2 * pad;
  textAlign(LEFT, TOP);
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('The sheet', rx + pad, ry + 10);
  textStyle(NORMAL);

  const f = shownFormat;
  textSize(13);
  fill('#333');
  if (f < 0) {
    text(fitText('An unfolded sheet of handmade paper.', tw), rx + pad, ry + 32);
  } else {
    const F = FORMATS[f];
    fill('#5a1f1a');
    textStyle(BOLD);
    text(fitText(F.name + ': ' + F.folds + (F.folds === 1 ? ' fold' : ' folds') + ', ' + F.leaves + ' leaves, ' +
                 F.pages + ' pages per sheet', tw), rx + pad, ry + 32);
    textStyle(NORMAL);
  }

  // Sheet, landscape, ratio about 1.41 : 1
  const shH = Math.min(118, (tw * 0.55) / 1.41);
  const shW = shH * 1.41;
  const sx = rx + pad + 4, sY = ry + 58;
  const elapsed = millis() - foldStart;
  const nShown = f < 0 ? 0 : Math.min(FORMATS[f].folds, Math.floor(elapsed / 450) + 1);
  // shading of leaves once all folds are drawn
  stroke('#9a8b6a');
  strokeWeight(1);
  fill('#F7F0DC');
  rect(sx, sY, shW, shH);
  if (f >= 0 && nShown === FORMATS[f].folds) {
    const cols = f === 0 ? 2 : (f === 1 ? 2 : 4), rows = f === 0 ? 1 : 2;
    noStroke();
    for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
      if ((c + r) % 2 === 1) { fill(234, 222, 190); rect(sx + c * shW / cols, sY + r * shH / rows, shW / cols, shH / rows); }
    }
  }
  // fold lines: 1 vertical middle, 2 horizontal middle, 3 vertical quarters
  stroke('#5a1f1a');
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  if (nShown >= 1) line(sx + shW / 2, sY, sx + shW / 2, sY + shH);
  if (nShown >= 2) line(sx, sY + shH / 2, sx + shW, sY + shH / 2);
  if (nShown >= 3) { line(sx + shW / 4, sY, sx + shW / 4, sY + shH); line(sx + 3 * shW / 4, sY, sx + 3 * shW / 4, sY + shH); }
  drawingContext.setLineDash([]);
  noStroke();
  fill('#5a1f1a');
  textSize(11);
  textAlign(CENTER, BOTTOM);
  if (nShown >= 1) text('fold 1', sx + shW / 2, sY - 1);
  textAlign(LEFT, CENTER);
  if (nShown >= 2) text('fold 2', sx + shW + 4, sY + shH / 2);
  textAlign(CENTER, TOP);
  if (nShown >= 3) text('fold 3', sx + shW / 4, sY + shH + 2);
  textAlign(LEFT, TOP);

  // One leaf at the same scale, with the page numbers of every leaf
  const lx0 = sx + shW + 52;
  if (f >= 0 && nShown === FORMATS[f].folds) {
    const F = FORMATS[f];
    let a = shW / 2, b = shH;           // folio leaf
    if (f === 1) { a = shW / 2; b = shH / 2; }
    if (f === 2) { a = shW / 4; b = shH / 2; }
    const lwid = Math.min(a, b), lht = Math.max(a, b);   // a leaf is held upright
    stroke('#9a8b6a');
    fill('#FBF7EA');
    const stack = Math.min(3, F.leaves - 1);
    for (let k = stack; k >= 0; k--) rect(lx0 + k * 3, sY + k * 3, lwid, lht);
    noStroke();
    fill('#333');
    textSize(11);
    textAlign(LEFT, TOP);
    text('1 leaf,', lx0, sY + lht + 18);
    text('same scale', lx0, sY + lht + 31);
    textSize(12);
    fill('#5a1f1a');
    textStyle(BOLD);
    text('×' + F.leaves, lx0 + lwid + 14, sY + 4);
    textStyle(NORMAL);
    // page pairs
    const pairs = [];
    for (let i = 0; i < F.leaves; i++) pairs.push((2 * i + 1) + '–' + (2 * i + 2));
    fill('#333');
    textSize(12);
    let y = sY + shH + 26;
    y = drawWrapped('Folded and cut, the sheet gives ' + F.leaves + ' leaves. Each leaf has two pages, front and back:',
                    rx + pad, y, tw, 16);
    fill('black');
    textStyle(BOLD);
    y = drawWrapped(pairs.join('   '), rx + pad, y + 2, tw, 16) + 4;
    textStyle(NORMAL);
    fill('#333');
    y = drawWrapped(F.leaves + ' leaves × 2 pages = ' + F.pages + ' pages per sheet.', rx + pad, y, tw, 16) + 4;
    // the current edition's division, once the answer is settled or while exploring
    let lpp = null;
    if (exploring) lpp = lppSlider.value();
    else if (cur < 3 && status[cur] !== 'open') lpp = CHALLENGES[cur].lpp;
    if (lpp !== null) {
      const pg = pagesFor(lpp), exact = pg / F.pages;
      fill('#1F3F5F');
      textStyle(BOLD);
      drawWrapped(fmt(pg) + ' pages ÷ ' + F.pages + ' = ' + trimNum(exact) +
                  (Number.isInteger(exact) ? '' : ', rounded up') + ' = ' + fmt(Math.ceil(exact)) + ' sheets per copy.',
                  rx + pad, y, tw, 16, ry + rh - 4);
      textStyle(NORMAL);
    }
  } else {
    fill('#666');
    textSize(12);
    textAlign(LEFT, TOP);
    if (f < 0) {
      drawWrapped('Press Check and the sheet folds into this challenge\'s format.', rx + pad, sY + shH + 26, tw, 16);
    }
  }
}

function trimNum(v) {
  if (Number.isInteger(v)) return fmt(v);
  return v.toLocaleString('en-US', { maximumFractionDigits: 3 });
}

function drawStrip() {
  panel(margin, sy, canvasWidth - 2 * margin, sh);
  const pad = 10;
  const x0 = margin + pad, inner = canvasWidth - 2 * margin - 2 * pad;
  textAlign(LEFT, TOP);
  fill('black');
  textStyle(BOLD);
  textSize(13);
  text('Paper for one copy, in sheets', x0, sy + 8);
  textStyle(NORMAL);
  const labW = wide ? 250 : 150;
  const barX = x0 + labW, barW = inner - labW - 56;
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const C = CHALLENGES[i];
    const lab = wide ? (i + 1) + '. ' + FORMATS[C.f].name + ', ' + C.lpp + ' lines per page' + (i === 2 ? ' (Aldine style)' : '')
                     : (i + 1) + '. ' + FORMATS[C.f].name + ', ' + C.lpp + ' lines';
    rows.push({ lab: lab, v: status[i] === 'open' ? null : sheetsFor(C.lpp, C.f), col: i === 2 ? '#1F5F8B' : '#8B6B3D' });
  }
  if (exploring) {
    const f = currentExploreFormat(), lpp = lppSlider.value();
    rows.push({ lab: 'Yours: ' + FORMATS[f].name + ', ' + lpp + ' lines', v: sheetsFor(lpp, f), col: '#2E7D32' });
  } else {
    rows.push({ lab: 'Yours: unlocks after challenge 3', v: null, col: '#2E7D32' });
  }
  let y = sy + 30;
  for (const r of rows) {
    fill(r.v === null ? '#888' : 'black');
    textSize(12);
    textAlign(LEFT, CENTER);
    text(fitText(r.lab, labW - 8), x0, y + 8);
    fill('#EEF2F5');
    rect(barX, y + 1, barW, 14, 2);
    if (r.v !== null) {
      fill(r.col);
      rect(barX, y + 1, Math.max(2, barW * r.v / MAX_SHEETS), 14, 2);
      fill('black');
      textStyle(BOLD);
      text(fmt(r.v), barX + Math.max(2, barW * r.v / MAX_SHEETS) + 6, y + 8);
      textStyle(NORMAL);
    } else {
      fill('#888');
      text('?', barX + 6, y + 8);
    }
    y += 21;
  }
  textAlign(LEFT, TOP);
  textSize(12);
  fill('#333');
  let note;
  if (cur >= 2 && status[2] !== 'open') {
    note = 'For 1,000 copies: 215,000 sheets in folio against 27,000 in Aldine-style octavo, about one-eighth.';
  } else {
    note = 'Bars fill in as you finish each challenge.';
  }
  text(fitText(note, inner), x0, sy + sh - 20);
}

function drawControlLabels() {
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  fill(exploring ? 'black' : '#999');
  const y1 = drawHeight + 8 + 11;
  text('Format:', margin, y1);
  text('Lines per page: ' + lppSlider.value(), margin + 160, y1);
  const y2 = drawHeight + 44 + 11;
  text('Copies: ' + fmt(copiesSlider.value()), margin, y2);
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
