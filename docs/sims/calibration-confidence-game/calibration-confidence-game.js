// How Calibrated Are You? - p5.js 2.x
// CANVAS_HEIGHT: 600
// Bloom: Evaluate (assess). Part A: the learner states the probability that
// each of twelve statements from this book is true (0 to 100 percent, step
// 10), committing each before the truth and reason appear. The sim then shows
// the Brier score, the 0.25 baseline for always saying 50 percent, a
// reliability table and a calibration chart, and the learner judges their own
// record (J1). Part B: two illustrative weather forecasters, A and B, and two
// more judgments (J2, J3). One attempt per judgment; mastery is 3 of 3.
// Brier score = mean of (p - o)^2, p as a fraction, o = 1 if true, 0 if false.

let canvasWidth = 746;
let drawHeight = 520;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

// ---------- Content ----------
const STATEMENTS = [
  { text: 'Mount Parnassus rises more than 2,000 m above sea level.', truth: true,
    why: 'It rises to 2,457 m (Chapter 17).' },
  { text: 'Delphi is more than 300 km by road from Athens.', truth: false,
    why: 'It is about 180 km, about two and a half hours by coach (Chapter 18).' },
  { text: 'The Oracle of Delphi gave answers for more than 1,000 years.', truth: true,
    why: 'From at least about 750 BCE to 391 CE, about 1,140 years (Chapter 17).' },
  { text: 'The Byzantine Empire lasted longer than the oracle did.', truth: false,
    why: 'The Byzantine Empire lasted 1,123 years; the oracle about 1,140 (Chapter 17).' },
  { text: 'Herodotus wrote down the Croesus prophecy within 20 years of the fall of Sardis.', truth: false,
    why: 'He wrote about 115 to 120 years later (Chapter 17).' },
  { text: 'Joseph Fontenrose collected more than 500 Delphic responses.', truth: true,
    why: 'He collected about 535 (Chapter 17).' },
  { text: 'More than 4,000 lead question tablets survive from the oracle of Zeus at Dodona.', truth: true,
    why: 'More than 4,000 survive (Chapter 17).' },
  { text: 'The Temple of Apollo whose ruins we saw at Delphi was finished in the 6th century BCE.', truth: false,
    why: 'It was finished around 330 BCE, in the 4th century; the 6th-century temple burned in 548 BCE (Chapter 17).' },
  { text: 'At Salamis, Athens supplied almost half of the Greek ships.', truth: true,
    why: '180 of 378 ships, about 48 percent (Chapter 15).' },
  { text: 'The council of the Amphictyonic League had 24 votes.', truth: true,
    why: 'Twelve member peoples with two votes each (Chapter 17).' },
  { text: 'Fewer than 100 records of freed slaves survive at Delphi.', truth: false,
    why: 'More than a thousand manumission records survive (Chapter 18).' },
  { text: 'The Athenian Treasury at Delphi was rebuilt from its original blocks in the 20th century.', truth: true,
    why: 'French archaeologists rebuilt it between 1903 and 1906 (Chapter 18).' }
];
const FORECASTERS = [
  { name: 'A', p: 0.7, days: 10, rain: 7, color: '#1b6e52' },
  { name: 'B', p: 0.9, days: 10, rain: 6, color: '#b35806' }
];
const LEVELS = [60, 70, 80, 90, 100];
const MIN_LEANED = 6;
const NOTE_SAMPLE = 'Twelve answers is a small sample; forecasters are judged over hundreds.';
const QUESTIONS = ['J1. Looking at your reliability table, how calibrated were you?',
                   'J2. Which forecaster is better calibrated?',
                   'J3. Was Forecaster B overconfident or underconfident?'];
const NOTE_BASELINE = 'Saying 50% on everything scores 0.25: never wrong, never useful.';

function brierOf(f) {
  return (f.rain * Math.pow(f.p - 1, 2) + (f.days - f.rain) * Math.pow(f.p, 2)) / f.days;
}

// ---------- State ----------
let phase = 'statements';   // 'statements' | 'record' | 'forecasters' | 'done'
let cur = 0;                // statement index
let probs = [];             // committed probabilities, in percent
let committed = false;
let judg = [null, null, null];   // chosen index for J1, J2, J3
let jStep = 0;              // 0 = J1, 1 = J2, 2 = J3 (within their phases)

// ---------- Layout ----------
let wide = true;
let panelY = 96, panelH = 240, bottomY = 344;
let chartBox = null, leftBox = null, choiceY = 0;
let statusX = 300;

// ---------- Controls ----------
let probSlider, commitButton, nextButton, againButton;
let choiceButtons = [];

function setup() {
  updateCanvasSize();
  computeLayout();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  probSlider = createSlider(0, 100, 50, 10);
  probSlider.parent(document.querySelector('main'));
  probSlider.attribute('aria-label', 'Chance this statement is true, in percent');

  commitButton = createButton('Commit');
  commitButton.parent(document.querySelector('main'));
  commitButton.style('font-size', '14px');
  commitButton.mousePressed(commit);

  nextButton = createButton('Next statement');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(goNext);

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(startOver);

  for (let i = 0; i < 3; i++) {
    const b = createButton('');
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('padding', '5px 14px');
    b.style('border', '2px solid #3E4F7A');
    b.style('border-radius', '6px');
    b.style('background-color', 'white');
    b.style('color', '#1f2937');
    b.attribute('title', 'Choose this answer (key ' + (i + 1) + ')');
    b.mousePressed(() => judge(i));
    choiceButtons.push(b);
  }

  startOver();

  describe('A calibration game. Twelve statements from this book appear one at a time, and the learner sets the ' +
           'chance that each is true from 0 to 100 percent, then commits and sees whether it was true and their ' +
           'squared-error score. After all twelve, the sim shows the learner\'s Brier score beside the 0.25 baseline, ' +
           'a reliability table for confidence levels 60 to 100 percent, and a calibration chart in which points below ' +
           'the diagonal are overconfident. The learner judges their own record, then judges two illustrative weather ' +
           'forecasters: A said 70 percent and it rained on 7 of 10 days; B said 90 percent and it rained on 6 of 10.');
}

function computeLayout() {
  wide = canvasWidth >= 620;
  const inner = canvasWidth - 2 * margin;
  panelY = 96;
  if (wide) {
    const lw = Math.round(inner * 0.5);
    leftBox = { x: margin, y: panelY, w: lw, h: 244 };
    chartBox = { x: margin + lw + 10, y: panelY, w: inner - lw - 10, h: 244 };
    bottomY = panelY + 244 + 8;
    drawHeight = 520;
  } else {
    leftBox = { x: margin, y: panelY, w: inner, h: 244 };
    chartBox = { x: margin, y: panelY + 252, w: inner, h: 220 };
    bottomY = panelY + 252 + 228;
    drawHeight = bottomY + 270;
  }
  canvasHeight = drawHeight + controlHeight;
}

function positionControls() {
  const r1 = drawHeight + 10;
  const sx = margin + 150;
  const sw = Math.max(90, Math.min(300, canvasWidth - sx - 20));
  probSlider.position(sx, r1 + 2);
  probSlider.size(sw);
  let x = margin;
  for (const b of [commitButton, nextButton, againButton]) {
    b.position(x, drawHeight + 46);
    x += (b.elt.offsetWidth || 100) + 10;
  }
  statusX = x + 6;

  // judgment choices inside the bottom panel
  const opts = choiceLabels();
  let bx = margin + 12;
  let by = choiceY;
  for (let i = 0; i < choiceButtons.length; i++) {
    const b = choiceButtons[i];
    const blocked = phase === 'record' && stats().leaned < MIN_LEANED;
    if (i < opts.length && (phase === 'record' || phase === 'forecasters') && !blocked) {
      b.html((i + 1) + '. ' + opts[i]);
      b.show();
      const w = b.elt.offsetWidth || 120;
      if (bx + w > canvasWidth - margin - 12 && bx > margin + 12) { bx = margin + 12; by += 38; }
      b.position(bx, by);
      bx += w + 10;
      choiceBottom = by + 34;
    } else {
      b.hide();
    }
  }
}
let choiceBottom = 0;

function startOver() {
  phase = 'statements';
  cur = 0;
  probs = [];
  committed = false;
  judg = [null, null, null];
  jStep = 0;
  probSlider.value(50);
  syncControls();
}

function commit() {
  if (phase !== 'statements' || committed) return;
  probs[cur] = Number(probSlider.value());
  committed = true;
  syncControls();
}

function goNext() {
  if (phase === 'statements') {
    if (!committed) return;
    if (cur < STATEMENTS.length - 1) {
      cur++;
      committed = false;
      probSlider.value(50);
    } else {
      phase = 'record';
      jStep = 0;
    }
  } else if (phase === 'record') {
    if (judg[0] === null) return;
    phase = 'forecasters';
    jStep = 1;
  } else if (phase === 'forecasters') {
    if (jStep === 1 && judg[1] !== null) jStep = 2;
    else if (jStep === 2 && judg[2] !== null) phase = 'done';
  }
  syncControls();
}

function choiceLabels() {
  if (phase === 'record') return ['Overconfident', 'About right', 'Underconfident'];
  if (phase === 'forecasters') return jStep === 1 ? ['Forecaster A', 'Forecaster B'] : ['Overconfident', 'Underconfident'];
  return [];
}

function judge(i) {
  if (phase === 'record') {
    if (judg[0] !== null || stats().leaned < MIN_LEANED) return;
    judg[0] = i;
  } else if (phase === 'forecasters') {
    if (judg[jStep] !== null || i >= choiceLabels().length) return;
    judg[jStep] = i;
  } else return;
  syncControls();
}

// ---------- Scoring ----------
function stats() {
  const n = probs.length;
  let brier = 0, leaned = 0, hits = 0, sumConf = 0;
  const rows = LEVELS.map(l => ({ level: l, n: 0, hits: 0 }));
  for (let i = 0; i < n; i++) {
    const p = probs[i];
    const o = STATEMENTS[i].truth ? 1 : 0;
    brier += Math.pow(p / 100 - o, 2);
    if (p === 50) continue;
    const conf = p > 50 ? p : 100 - p;
    const hit = (p > 50) === STATEMENTS[i].truth;
    leaned++;
    sumConf += conf;
    if (hit) hits++;
    const row = rows.find(r => r.level === conf);
    row.n++;
    if (hit) row.hits++;
  }
  // verdict in exact integer arithmetic: c - h = (sumConf - 100 hits) / leaned
  const diffNum = sumConf - 100 * hits;
  let verdict = 1;
  if (leaned > 0 && diffNum > 10 * leaned) verdict = 0;
  else if (leaned > 0 && diffNum < -10 * leaned) verdict = 2;
  return {
    brier: n ? brier / n : 0, leaned: leaned, hits: hits, rows: rows,
    c: leaned ? sumConf / leaned : 0, h: leaned ? 100 * hits / leaned : 0, verdict: verdict
  };
}

function isCorrect(j) {
  if (judg[j] === null) return false;
  if (j === 0) return judg[0] === stats().verdict;
  if (j === 1) return judg[1] === 0;
  return judg[2] === 0;
}

function enable(b, on) {
  if (on) { b.removeAttribute('disabled'); b.style('opacity', '1'); b.style('cursor', 'pointer'); }
  else { b.attribute('disabled', ''); b.style('opacity', '0.45'); b.style('cursor', 'default'); }
}

function syncControls() {
  const S = phase === 'statements';
  enable(probSlider, S && !committed);
  enable(commitButton, S && !committed);
  let canNext = false;
  let label = 'Next statement';
  if (S) {
    canNext = committed;
    label = cur < STATEMENTS.length - 1 ? 'Next statement' : 'See my record';
  } else if (phase === 'record') {
    canNext = judg[0] !== null;
    label = 'The forecasters';
  } else if (phase === 'forecasters') {
    canNext = judg[jStep] !== null;
    label = jStep === 1 ? 'Next question' : 'Finish';
  } else {
    label = 'Finish';
  }
  nextButton.html(label);
  enable(nextButton, canNext);

  // layout of the bottom panel depends on the phase; compute the choice row
  const j = phase === 'record' ? 0 : jStep;
  textSize(15);
  textStyle(BOLD);
  choiceY = bottomY + 10 + wrapLines(QUESTIONS[j], canvasWidth - 2 * margin - 24).length * 20 + 4;
  textStyle(NORMAL);
  const blocked = phase === 'record' && stats().leaned < MIN_LEANED;
  for (let i = 0; i < choiceButtons.length; i++) {
    const b = choiceButtons[i];
    const chosen = judg[j];
    const answered = chosen !== null;
    enable(b, !answered && !blocked);
    let bg = 'white', fg = '#1f2937', bd = '#3E4F7A';
    const right = j === 0 ? stats().verdict : 0;
    if (answered && i === right) { bg = '#15803d'; fg = 'white'; bd = '#15803d'; }
    else if (answered && i === chosen) { bg = '#b91c1c'; fg = 'white'; bd = '#b91c1c'; }
    b.style('background-color', bg);
    b.style('color', fg);
    b.style('border-color', bd);
    if (answered) b.style('opacity', (i === chosen || i === right) ? '1' : '0.45');
  }
  positionControls();
}

function keyPressed() {
  if (key === '1' || key === '2' || key === '3') judge(Number(key) - 1);
  else if (key === 'Enter') { if (phase === 'statements' && !committed) commit(); else goNext(); }
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
  text('How Calibrated Are You?', margin, 10);
  textStyle(NORMAL);
  textSize(14);
  textAlign(RIGHT, TOP);
  const nJ = judg.filter(x => x !== null).length;
  const score = [0, 1, 2].filter(isCorrect).length;
  let right = phase === 'statements' ? 'Statement ' + (cur + 1) + ' of 12'
            : 'Judgments correct: ' + score + ' of ' + nJ;
  if (canvasWidth >= 420) text(right, canvasWidth - margin, 15);

  drawStrip(44);
  if (phase === 'statements') drawStatement();
  else if (phase === 'record') { drawRecord(); drawChart(chartBox, recordPoints(), 'Your record'); drawJudgment(); }
  else { drawForecasters(); drawChart(chartBox, forecasterPoints(), 'Two forecasters, rainy-season days'); drawJudgment(); }

  // control labels
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(14);
  fill(phase === 'statements' && !committed ? 'black' : '#94a3b8');
  const v = phase === 'statements' ? (committed ? probs[cur] : Number(probSlider.value())) : 50;
  text('Chance true: ' + v + '%', margin, drawHeight + 22);
  fill('dimgray');
  textSize(13);
  let status;
  if (phase === 'statements') status = committed ? 'Press ' + (cur < 11 ? 'Next statement' : 'See my record') + ' (Enter).'
                                                 : 'Set the slider, then Commit (Enter).';
  else if (phase === 'done') status = 'Try Again clears all twelve answers.';
  else if (phase === 'record' && stats().leaned < MIN_LEANED) status = 'Press Try Again.';
  else status = 'Choose an answer (keys 1 to ' + choiceLabels().length + ').';
  if (canvasWidth - margin - statusX > 60) text(fitText(status, canvasWidth - margin - statusX), statusX, drawHeight + 60);
}

// Twelve chips: stated probability, colored by whether the lean was right.
function drawStrip(top) {
  const h = 42;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(margin, top, canvasWidth - 2 * margin, h, 8);
  const x0 = margin + 6, x1 = canvasWidth - margin - 6;
  const slotW = (x1 - x0) / 12;
  for (let i = 0; i < 12; i++) {
    const cx = x0 + (i + 0.5) * slotW;
    const w = slotW - 5, y = top + 5, ch = h - 10;
    const done = probs[i] !== undefined && (i < cur || committed || phase !== 'statements');
    const isNow = phase === 'statements' && i === cur;
    if (!done) {
      noStroke();
      fill(isNow ? '#fff1c9' : '#eef1f3');
      if (isNow) { stroke('#c8963e'); strokeWeight(2); }
      rect(cx - w / 2, y, w, ch, 5);
      noStroke();
      fill(isNow ? 'black' : '#6b7780');
      textAlign(CENTER, CENTER);
      textSize(13);
      textStyle(isNow ? BOLD : NORMAL);
      text(i + 1, cx, y + ch / 2 + 1);
      textStyle(NORMAL);
      continue;
    }
    const p = probs[i];
    const truth = STATEMENTS[i].truth;
    let col = '#64748b', bg = '#f1f5f9';
    if (p !== 50) {
      const hit = (p > 50) === truth;
      col = hit ? '#15803d' : '#b91c1c';
      bg = hit ? '#e7f5ec' : '#fbeaea';
    }
    stroke(col);
    strokeWeight(isNow ? 2.5 : 1.2);
    fill(bg);
    rect(cx - w / 2, y, w, ch, 5);
    noStroke();
    fill(col);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(w > 44 ? 13 : 11);
    text(p + '%', cx, y + ch / 2 - (w > 40 ? 6 : 0));
    textStyle(NORMAL);
    if (w > 40) {
      textSize(10);
      fill('#334155');
      text(truth ? 'true' : 'false', cx, y + ch / 2 + 9);
    }
  }
}

function drawStatement() {
  const x = margin, y = panelY, w = canvasWidth - 2 * margin, h = drawHeight - panelY - 10;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  const pad = 14, tw = w - 2 * pad;
  const S = STATEMENTS[cur];
  let yy = y + 12;
  fill('dimgray');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(12);
  text('STATEMENT ' + (cur + 1) + ' OF 12', x + pad, yy);
  yy += 20;
  fill('black');
  textSize(wide ? 20 : 17);
  yy = drawWrapped(S.text, x + pad, yy, tw, wide ? 26 : 22) + 6;
  textStyle(ITALIC);
  textSize(15);
  fill('#475569');
  text('How likely is this to be true?', x + pad, yy);
  textStyle(NORMAL);
  yy += 30;

  // gauge: 0 (surely false) to 100 (surely true)
  const p = committed ? probs[cur] : Number(probSlider.value());
  const gx = x + pad + 100, gw = tw - 200, gy = yy + 14;
  const seg = gw / 22;
  textSize(12);
  fill('#b91c1c');
  textAlign(RIGHT, CENTER);
  text('surely false', gx - seg - 6, gy + 6);
  fill('#15803d');
  textAlign(LEFT, CENTER);
  text('surely true', gx + gw + seg + 6, gy + 6);
  for (let k = 0; k <= 10; k++) {
    const t = k / 10;
    fill(lerpColor(color('#f3c5c5'), color('#c4e6cf'), t));
    rect(gx + t * gw - seg, gy, 2 * seg - 2, 12);
  }
  fill('#334155');
  textAlign(CENTER, TOP);
  textSize(11);
  for (let k = 0; k <= 10; k += 5) text(k * 10 + '%', gx + k / 10 * gw, gy + 16);
  // marker
  const mx = gx + p / 100 * gw;
  fill('#1e3a8a');
  triangle(mx - 7, gy - 10, mx + 7, gy - 10, mx, gy - 1);
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, BOTTOM);
  text(p + '%', mx, gy - 11);
  textStyle(NORMAL);
  yy = gy + 36;
  textAlign(LEFT, TOP);
  textSize(14);
  fill('#1f2937');
  let lean;
  if (p > 50) lean = 'You lean true, with ' + p + '% confidence.';
  else if (p < 50) lean = 'You lean false, with ' + (100 - p) + '% confidence.';
  else lean = 'No lean: 50% means you have no idea which way it goes.';
  text(lean, x + pad, yy);
  yy += 26;

  // how scoring works, at the foot of the card
  textSize(13);
  const how = 'How scoring works: each answer scores (p − o)², with p your probability as a fraction and o = 1 if the ' +
              'statement is true, 0 if false. Saying 50% always scores 0.25. Saying 100% scores 0 if right and 1 if wrong. ' +
              'Your Brier score is the average over all twelve; lower is better.';
  const howLines = wrapLines(how, tw - 20).length;
  const hy = y + h - 14 - howLines * 17;
  fill('#f1f5f9');
  rect(x + pad, hy - 8, tw, howLines * 17 + 14, 6);
  fill('#334155');
  drawWrapped(how, x + pad + 10, hy, tw - 20, 17);
  textSize(14);

  if (!committed) {
    fill('#4a5a66');
    drawWrapped('Commit your probability before the answer appears. A committed answer cannot be changed.', x + pad, yy, tw, 19);
    return;
  }
  // truth and reason
  const o = S.truth ? 1 : 0;
  const sc = Math.pow(p / 100 - o, 2);
  textSize(15);
  const whyLines = wrapLines(S.why, tw - 20 - 60).length;
  const scoreText = 'Your score on this one: (' + (p / 100).toFixed(1) + ' − ' + o + ')² = ' + sc.toFixed(2) +
                    '   (0 is perfect, 1 is the worst)';
  textSize(14);
  const scoreLines = wrapLines(scoreText, tw - 20).length;
  const boxH = 16 + whyLines * 20 + 8 + scoreLines * 18;
  fill(S.truth ? '#eaf5ee' : '#fbeaea');
  stroke(S.truth ? '#15803d' : '#b91c1c');
  rect(x + pad, yy, tw, boxH, 6);
  noStroke();
  let ty = yy + 8;
  textStyle(BOLD);
  textSize(16);
  fill(S.truth ? '#15803d' : '#b91c1c');
  const head = S.truth ? 'True.' : 'False.';
  text(head, x + pad + 10, ty);
  const hw = textWidth(head) + 8;
  textStyle(NORMAL);
  fill('black');
  textSize(15);
  ty = drawWrapped(S.why, x + pad + 10 + hw, ty + 1, tw - 20 - hw, 20) + 6;
  textSize(14);
  fill('#1f2937');
  drawWrapped(scoreText, x + pad + 10, ty, tw - 20, 18);
}

function drawRecord() {
  const B = leftBox;
  const st = stats();
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(B.x, B.y, B.w, B.h, 10);
  noStroke();
  const pad = 12;
  let yy = B.y + 10;
  textAlign(LEFT, TOP);
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('Your Brier score: ' + st.brier.toFixed(2), B.x + pad, yy);
  textStyle(NORMAL);
  textSize(13);
  fill('#475569');
  yy += 20;
  text('Lower is better. Always saying 50% scores 0.25.', B.x + pad, yy);
  yy += 24;

  // reliability table
  const cols = [B.x + pad, B.x + pad + B.w * 0.33, B.x + pad + B.w * 0.55, B.x + pad + B.w * 0.75];
  textStyle(BOLD);
  textSize(12);
  fill('#475569');
  ['STATED', 'ANSWERS', 'RIGHT', '% RIGHT'].forEach((t, i) => text(t, cols[i], yy));
  textStyle(NORMAL);
  yy += 18;
  textSize(14);
  for (const r of st.rows) {
    stroke('#e2e8f0');
    line(B.x + pad, yy - 3, B.x + B.w - pad, yy - 3);
    noStroke();
    fill('black');
    text(r.level + '%', cols[0], yy);
    if (r.n === 0) {
      fill('#94a3b8');
      text('none', cols[1], yy);
    } else {
      text(r.n, cols[1], yy);
      text(r.hits, cols[2], yy);
      const pct = Math.round(100 * r.hits / r.n);
      fill(pct < r.level - 10 ? '#b91c1c' : pct > r.level + 10 ? '#1d4ed8' : '#15803d');
      textStyle(BOLD);
      text(pct + '%', cols[3], yy);
      textStyle(NORMAL);
    }
    yy += 20;
  }
  fill('#475569');
  textSize(12);
  const unlean = probs.filter(p => p === 50).length;
  yy = drawWrapped('Stated = confidence in the way you leaned (70% and 30% both count as 70%). ' +
                   (unlean ? unlean + ' answer' + (unlean > 1 ? 's' : '') + ' at 50% had no lean.' : ''),
                   B.x + pad, yy + 2, B.w - 2 * pad, 15);
}

function drawForecasters() {
  const B = leftBox;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(B.x, B.y, B.w, B.h, 10);
  noStroke();
  const pad = 12;
  let yy = B.y + 10;
  textAlign(LEFT, TOP);
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('Two forecasters for Delphi', B.x + pad, yy);
  textStyle(NORMAL);
  yy += 20;
  fill('#475569');
  textSize(12);
  textStyle(ITALIC);
  text('Illustrative records.', B.x + pad, yy);
  textStyle(NORMAL);
  yy += 22;
  const cols = [B.x + pad, B.x + pad + B.w * 0.2, B.x + pad + B.w * 0.45, B.x + pad + B.w * 0.72];
  textStyle(BOLD);
  textSize(12);
  ['WHO', 'SAID', 'RAINED ON', 'BRIER'].forEach((t, i) => text(t, cols[i], yy));
  textStyle(NORMAL);
  yy += 18;
  textSize(15);
  for (const f of FORECASTERS) {
    stroke('#e2e8f0');
    line(B.x + pad, yy - 3, B.x + B.w - pad, yy - 3);
    noStroke();
    fill(f.color);
    textStyle(BOLD);
    text(f.name, cols[0], yy + 2);
    textStyle(NORMAL);
    fill('black');
    text(Math.round(f.p * 100) + '% rain', cols[1], yy + 2);
    text(f.rain + ' of ' + f.days + ' days', cols[2], yy + 2);
    text(brierOf(f).toFixed(2), cols[3], yy + 2);
    yy += 26;
  }
  yy += 4;
  fill('#1f2937');
  textSize(13);
  yy = drawWrapped('Brier for A: (7 × 0.09 + 3 × 0.49) ÷ 10 = 0.21. For B: (6 × 0.01 + 4 × 0.81) ÷ 10 = 0.33. ' +
                   'Always saying 50% scores 0.25.', B.x + pad, yy, B.w - 2 * pad, 17) + 4;
}

function recordPoints() {
  const st = stats();
  const pts = st.rows.filter(r => r.n > 0).map(r => ({ x: r.level, y: 100 * r.hits / r.n, n: r.n, color: '#1e40af', label: String(r.n) }));
  if (judg[0] !== null && st.leaned) pts.push({ x: st.c, y: st.h, n: 0, color: '#d97706', label: 'avg', star: true });
  return pts;
}

function forecasterPoints() {
  return FORECASTERS.map(f => ({ x: f.p * 100, y: 100 * f.rain / f.days, n: f.days, color: f.color, label: f.name }));
}

// Calibration (reliability) chart: stated confidence against percent right.
function drawChart(B, pts, title) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(B.x, B.y, B.w, B.h, 10);
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(13);
  textAlign(LEFT, TOP);
  text(fitText(title, B.w - 20), B.x + 10, B.y + 8);
  textStyle(NORMAL);
  const L = B.x + 46, R = B.x + B.w - 14, T = B.y + 30, Bot = B.y + B.h - 38;
  const X = v => L + (v - 50) / 50 * (R - L);
  const Y = v => Bot - v / 100 * (Bot - T);
  // regions
  fill('#fdecec');
  beginShape(); vertex(X(50), Y(50)); vertex(X(100), Y(100)); vertex(X(100), Y(0)); vertex(X(50), Y(0)); endShape(CLOSE);
  fill('#eaf0fd');
  beginShape(); vertex(X(50), Y(50)); vertex(X(100), Y(100)); vertex(X(50), Y(100)); endShape(CLOSE);
  // grid and axes
  stroke('#d6dde6');
  strokeWeight(1);
  for (let v = 0; v <= 100; v += 25) line(L, Y(v), R, Y(v));
  for (let v = 50; v <= 100; v += 10) line(X(v), T, X(v), Bot);
  stroke('#334155');
  line(L, Bot, R, Bot);
  line(L, T, L, Bot);
  // diagonal = perfect calibration
  stroke('#15803d');
  strokeWeight(2);
  drawingContext.setLineDash([6, 4]);
  line(X(50), Y(50), X(100), Y(100));
  drawingContext.setLineDash([]);
  noStroke();
  fill('#334155');
  textSize(11);
  textAlign(CENTER, TOP);
  for (let v = 50; v <= 100; v += 10) text(v + '%', X(v), Bot + 3);
  textAlign(RIGHT, CENTER);
  for (let v = 0; v <= 100; v += 25) text(v + '%', L - 4, Y(v));
  textAlign(CENTER, TOP);
  textSize(12);
  text('Stated confidence', (L + R) / 2, Bot + 18);
  push();
  translate(B.x + 12, (T + Bot) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Percent right', 0, 0);
  pop();
  textSize(11);
  textStyle(ITALIC);
  fill('#b91c1c');
  textAlign(RIGHT, BOTTOM);
  text('overconfident', R - 4, Bot - 4);
  fill('#1d4ed8');
  textAlign(LEFT, CENTER);
  text('underconfident', L + 4, Y(84));
  fill('#15803d');
  textAlign(LEFT, CENTER);
  push();
  translate(X(51), Y(51) - 9);
  rotate(-Math.atan2(Y(50) - Y(100), X(100) - X(50)));
  text('well calibrated', 0, 0);
  pop();
  textStyle(NORMAL);
  // points
  for (const p of pts) {
    const px = X(p.x), py = Y(p.y);
    if (p.star) {
      stroke('#7c2d12');
      strokeWeight(1);
      fill(p.color);
      drawStar(px, py, 5, 11);
      noStroke();
      fill('#7c2d12');
      textSize(11);
      textAlign(LEFT, CENTER);
      text('average', px + 12, py);
      continue;
    }
    const r = 8 + Math.sqrt(p.n) * 3;
    stroke('white');
    strokeWeight(1.5);
    fill(p.color);
    circle(px, py, r * 2);
    noStroke();
    fill('white');
    textStyle(BOLD);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(p.label, px, py + 1);
    textStyle(NORMAL);
  }
  if (pts.length === 0) {
    fill('#64748b');
    textSize(13);
    textAlign(CENTER, CENTER);
    text('No leaned answers to plot.', (L + R) / 2, (T + Bot) / 2);
  }
}

function drawStar(x, y, r1, r2) {
  beginShape();
  for (let k = 0; k < 10; k++) {
    const a = -HALF_PI + k * PI / 5;
    const r = k % 2 === 0 ? r2 : r1;
    vertex(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  endShape(CLOSE);
}

function drawJudgment() {
  const x = margin, y = bottomY, w = canvasWidth - 2 * margin, h = drawHeight - bottomY - 10;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  const pad = 12, tw = w - 2 * pad;
  textAlign(LEFT, TOP);

  if (phase === 'done') {
    const score = [0, 1, 2].filter(isCorrect).length;
    fill('black');
    textStyle(BOLD);
    textSize(16);
    let yy = drawWrapped('Judgments correct: ' + score + ' of 3.', x + pad, y + 10, tw, 21) + 2;
    textSize(15);
    fill(score === 3 ? 'darkgreen' : 'firebrick');
    yy = drawWrapped(score === 3 ? 'You can judge a forecaster, including yourself: confidence has to be earned by the record.'
                                 : 'Compare the stated percentage with the percentage that came true, row by row.',
                     x + pad, yy, tw, 20) + 4;
    textStyle(NORMAL);
    fill('#333');
    textSize(14);
    const st = stats();
    drawWrapped('Your Brier score was ' + st.brier.toFixed(2) + '; Forecaster A scored 0.21, Forecaster B 0.33, and always saying 50% scores 0.25. ' +
                'B’s confident record did worse than not forecasting at all.', x + pad, yy, tw, 19);
    return;
  }

  const st = stats();
  const j = phase === 'record' ? 0 : jStep;
  fill('black');
  textStyle(BOLD);
  textSize(15);
  drawWrapped(QUESTIONS[j], x + pad, y + 10, tw, 20);
  textStyle(NORMAL);
  // the two notes always shown with the results, at the foot of the panel
  textSize(12);
  fill('#475569');
  const notes = NOTE_SAMPLE + ' ' + NOTE_BASELINE;
  drawWrapped(notes, x + pad, y + h - 8 - wrapLines(notes, tw).length * 15, tw, 15);

  if (phase === 'record' && st.leaned < MIN_LEANED) {
    fill('firebrick');
    textSize(14);
    drawWrapped('Lean one way on at least 6 statements so there is a record to judge. You leaned on ' + st.leaned +
                '. Press Try Again.', x + pad, choiceY + 4, tw, 19);
    return;
  }
  const ans = judg[j];
  if (ans === null) {
    fill('#4a5a66');
    textSize(14);
    drawWrapped(j === 0 ? 'Compare each row’s stated percentage with its percent right. One try.'
                        : 'Compare what each forecaster said with how often it rained. One try.',
                x + pad, choiceBottom + 6, tw, 19);
    return;
  }
  const whys = [
    'Your average confidence was ' + Math.round(st.c) + '% and you were right ' + Math.round(st.h) + '% of the time, so you were ' +
      ['overconfident', 'about right', 'underconfident'][st.verdict] + ' (within 10 points counts as about right).',
    'A said 70% and it rained on 7 of 10 days; B said 90% and it rained on 6 of 10.',
    'B’s 90% came true only 60% of the time, so B claimed more certainty than the record supports.'
  ];
  const ok = isCorrect(j);
  const head = ok ? 'Correct:' : 'Not quite:';
  let yy = choiceBottom + 6;
  textSize(14);
  textStyle(BOLD);
  fill(ok ? 'darkgreen' : 'firebrick');
  text(head, x + pad, yy);
  const hw = textWidth(head) + 6;
  textStyle(NORMAL);
  fill('black');
  const words = whys[j].split(' ');
  let first = '';
  while (words.length && textWidth(first + (first ? ' ' : '') + words[0]) <= tw - hw) first += (first ? ' ' : '') + words.shift();
  text(first, x + pad + hw, yy);
  if (words.length) drawWrapped(words.join(' '), x + pad, yy + 19, tw, 19);
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
  syncControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
}
