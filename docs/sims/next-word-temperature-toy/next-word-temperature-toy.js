// Next-Word Prediction and Temperature - p5.js 2.x
// CANVAS_HEIGHT: 572
// Bloom: Understand (infer). Five challenge questions, in a fixed order, ask
// the learner to predict what temperature does to a language model's choice
// of the next word. The learner commits to one answer, then presses Reveal to
// see the adjusted probabilities and a draw of 20 sampled words. After
// challenge 5, free exploration unlocks: any prompt, any temperature, and as
// many draws of 20 as the learner likes.
// Temperature rule (softmax with temperature, taking logit_i = ln p_i):
// p_i(T) = p_i^(1/T) / sum_j p_j^(1/T); T = 0 means always the top word.
// Probabilities are illustrative, not from a real model. Draws use a seeded
// random generator, so the same sequence of presses gives the same counts.

let canvasWidth = 746;
let drawHeight = 492;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

// ---------- Model ----------
const PROMPTS = [
  { text: 'Know ___', words: ['thyself', 'yourself', 'the', 'your', 'nothing'], p: [60, 20, 10, 6, 4] },
  { text: 'Nothing in ___', words: ['excess', 'the', 'particular', 'life', 'common'], p: [55, 15, 12, 10, 8] },
  { text: 'On Sundays the Grand Bazaar is ___', words: ['closed', 'open', 'busy', 'quiet', 'crowded'], p: [45, 30, 15, 6, 4],
    note: 'The Grand Bazaar is usually closed on Sundays (Chapter 2). The model’s probabilities describe what is often written, not what is true.' },
  { text: 'The oracle at Delphi was ___', words: ['consulted', 'famous', 'a', 'closed', 'silent'], p: [30, 25, 20, 15, 10] }
];
const N_DRAWS = 20;

// before: temperature shown before Reveal (null = no bars yet); after: temperature at Reveal
const CHALLENGES = [
  { prompt: 0, before: null, after: 0, setting: 'Prompt 1, temperature 0',
    q: 'In 20 tries, which word will the model choose?',
    choices: ['thyself every time', 'mostly thyself, sometimes yourself', 'a different word each time'], ans: 0,
    why: 'At temperature 0 the model always takes the most likely word, so the same words always get the same answer.' },
  { prompt: 0, before: 1.0, after: 2.0, setting: 'Prompt 1, temperature raised from 1.0 to 2.0',
    q: 'What happens to the probability of “nothing”?',
    choices: ['It goes up', 'It goes down', 'It stays at 4%'], ans: 0,
    why: 'A higher temperature flattens the probabilities, so the least likely word rises from 4.0% to 10.1%.' },
  { prompt: 2, before: 1.0, after: 1.0, setting: 'Prompt 3, temperature 1.0',
    q: 'About how many of 20 sampled answers will say “open”?',
    choices: ['about 0', 'about 6', 'about 15'], ans: 1,
    why: 'At temperature 1 each word is chosen in proportion to its probability: 30% of 20 is 6, even though “open” is usually false.' },
  { prompt: 0, before: 1.0, after: 0.5, setting: 'Prompt 1, temperature lowered from 1.0 to 0.5',
    q: 'What is the probability of “thyself” now?',
    choices: ['about 30%', 'about 60%', 'about 87%'], ans: 2,
    why: 'A lower temperature sharpens the probabilities toward the favorite: 60% becomes 86.7%. The model’s knowledge is unchanged; only its way of choosing changed.' },
  { prompt: 3, before: 1.0, after: 2.0, setting: 'Prompt 4, temperatures 0, 0.5 and 2.0',
    q: 'At which temperature are the five words closest to equally likely?',
    choices: ['0', '0.5', '2.0'], ans: 2,
    why: 'The highest temperature flattens the most: at 2.0 the five range only from 24.9% to 14.4%.' }
];
const MASTERY = 4;

// Softmax with temperature on logits ln(p). T = 0 is greedy (argmax).
function adjusted(p, T) {
  if (T <= 0.0001) {
    let best = 0;
    for (let i = 1; i < p.length; i++) if (p[i] > p[best]) best = i;
    return p.map((_, i) => (i === best ? 1 : 0));
  }
  const w = p.map(x => Math.pow(x / 100, 1 / T));
  const s = w.reduce((a, b) => a + b, 0);
  return w.map(x => x / s);
}

// Seeded random numbers (mulberry32), so draws can be repeated exactly.
const SEED = 2026;
let rngState = SEED;
function rand() {
  rngState = (rngState + 0x6D2B79F5) | 0;
  let t = rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// 20 independent picks from the adjusted probabilities (inverse CDF).
function draw20(q) {
  const counts = q.map(() => 0);
  for (let k = 0; k < N_DRAWS; k++) {
    const r = rand();
    let acc = 0, pick = q.length - 1;
    for (let i = 0; i < q.length; i++) {
      acc += q[i];
      if (r < acc) { pick = i; break; }
    }
    counts[pick]++;
  }
  return counts;
}

// ---------- State ----------
let cur = 0;            // challenge index
let chosen = -1;        // this challenge's committed answer
let revealed = false;
let free = false;       // free exploration after challenge 5
let results = [];       // per challenge: true/false
let promptIdx = 0;
let temp = 0;
let showBars = false;
let counts = null;
let drawNo = 0;

// ---------- Layout ----------
let narrow = false;
let panelTop = 0;
let choicesBottom = 0;

// ---------- Controls ----------
let promptSelect, tempSlider, drawButton, revealButton, nextButton, againButton;
let choiceButtons = [];

function setup() {
  updateCanvasSize();
  computeLayout();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  for (let i = 0; i < 3; i++) {
    const b = createButton('');
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('padding', '5px 10px');
    b.style('border', '2px solid #3E4F7A');
    b.style('border-radius', '6px');
    b.style('background-color', 'white');
    b.style('color', '#1f2937');
    b.style('cursor', 'pointer');
    b.attribute('title', 'Choose this answer (key ' + (i + 1) + ')');
    b.mousePressed(() => choose(i));
    choiceButtons.push(b);
  }

  promptSelect = createSelect();
  promptSelect.parent(document.querySelector('main'));
  PROMPTS.forEach((pr, i) => promptSelect.option((i + 1) + '. “' + pr.text + '”', String(i)));
  promptSelect.style('font-size', '14px');
  promptSelect.attribute('aria-label', 'Prompt');
  promptSelect.changed(() => {
    if (!free) return;
    promptIdx = Number(promptSelect.value());
    counts = null;
  });

  tempSlider = createSlider(0, 2, 1, 0.1);
  tempSlider.parent(document.querySelector('main'));
  tempSlider.attribute('aria-label', 'Temperature');
  tempSlider.input(() => {
    if (!free) return;
    const v = Math.round(tempSlider.value() * 10) / 10;
    if (v !== temp) { temp = v; counts = null; }
  });

  drawButton = createButton('Draw 20');
  drawButton.parent(document.querySelector('main'));
  drawButton.style('font-size', '14px');
  drawButton.mousePressed(doDraw);

  revealButton = createButton('Reveal');
  revealButton.parent(document.querySelector('main'));
  revealButton.style('font-size', '14px');
  revealButton.mousePressed(reveal);

  nextButton = createButton('Next challenge');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextChallenge);

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(startOver);

  startOver();

  describe('A next-word prediction toy. A prompt such as "Know ___" is shown with five candidate next words and a ' +
           'probability bar for each; an outline marks the probabilities at temperature 1. Five challenge questions ask ' +
           'what changing the temperature will do before the learner reveals the adjusted probabilities and a draw of ' +
           '20 sampled words. At temperature 0 the top word always wins; higher temperatures flatten the bars. After ' +
           'the challenges, a prompt menu, a temperature slider and a Draw 20 button unlock free exploration.');
}

function computeLayout() {
  narrow = canvasWidth < 560;
  panelTop = narrow ? 372 : 346;
  drawHeight = narrow ? 600 : 492;
  controlHeight = narrow ? 116 : 80;
  canvasHeight = drawHeight + controlHeight;
}

function positionControls() {
  // choice buttons inside the question panel, flowing left to right
  textSize(15);
  textStyle(BOLD);
  const tw = canvasWidth - 2 * margin - 24;
  const qLines = free ? 0 : wrapLines(CHALLENGES[cur].q, tw).length;
  textStyle(NORMAL);
  let x = margin + 12;
  let y = panelTop + 10 + qLines * 20 + 6;
  const maxX = canvasWidth - margin - 12;
  for (let i = 0; i < choiceButtons.length; i++) {
    const b = choiceButtons[i];
    if (!free) b.html((i + 1) + '. ' + CHALLENGES[cur].choices[i]);
    b.style('width', narrow ? (maxX - margin - 12) + 'px' : 'auto');
    const w = b.elt.offsetWidth || 150;
    if (x + w > maxX && x > margin + 12) { x = margin + 12; y += 38; }
    b.position(x, y);
    x += w + 10;
    if (narrow) { x = margin + 12; y += 38; }
  }
  choicesBottom = narrow ? y : y + 36;
  for (const b of choiceButtons) { if (free) b.hide(); else b.show(); }

  // row 1: prompt, temperature, Draw 20 (narrow: prompt on its own row)
  const r1 = drawHeight + 10;
  const r2 = narrow ? r1 + 36 : r1;
  const selW = narrow ? canvasWidth - 2 * margin - 58 : Math.min(250, Math.max(120, canvasWidth * 0.3));
  promptSelect.position(margin + 58, r1);
  promptSelect.style('width', selW + 'px');
  sliderLabelX = narrow ? margin : margin + 58 + selW + 12;
  sliderLabelY = r2 + 12;
  const sx = sliderLabelX + 116;
  const sw = Math.max(60, canvasWidth - sx - 100);
  tempSlider.position(sx, r2 + 2);
  tempSlider.size(sw);
  drawButton.position(sx + sw + 12, r2);

  // last row: Reveal, Next, Try Again
  let bx = margin;
  rowY = r2 + 36;
  for (const b of [revealButton, nextButton, againButton]) {
    b.position(bx, rowY);
    bx += (b.elt.offsetWidth || 100) + 10;
  }
  statusX = bx + 6;
}
let sliderLabelY = 0;
let rowY = 0;
let sliderLabelX = 330;
let statusX = 330;

function startOver() {
  cur = 0;
  results = [];
  free = false;
  rngState = SEED;
  drawNo = 0;
  loadChallenge();
}

function loadChallenge() {
  const C = CHALLENGES[cur];
  chosen = -1;
  revealed = false;
  promptIdx = C.prompt;
  temp = C.before === null ? C.after : C.before;
  showBars = C.before !== null;
  counts = null;
  syncControls();
}

function choose(i) {
  if (free || chosen >= 0) return;
  chosen = i;
  results[cur] = (i === CHALLENGES[cur].ans);
  syncControls();
}

function reveal() {
  if (free || chosen < 0 || revealed) return;
  revealed = true;
  temp = CHALLENGES[cur].after;
  showBars = true;
  doDraw(true);
  syncControls();
}

function nextChallenge() {
  if (free || !revealed) return;
  if (cur < CHALLENGES.length - 1) {
    cur++;
    loadChallenge();
  } else {
    free = true;
    counts = null;
    syncControls();
  }
}

function doDraw(force) {
  if (!free && !(revealed || force === true)) return;
  counts = draw20(adjusted(PROMPTS[promptIdx].p, temp));
  drawNo++;
}

function enable(b, on) {
  if (on) { b.removeAttribute('disabled'); b.style('opacity', '1'); b.style('cursor', 'pointer'); }
  else { b.attribute('disabled', ''); b.style('opacity', '0.45'); b.style('cursor', 'default'); }
}

function syncControls() {
  promptSelect.selected(String(promptIdx));
  tempSlider.value(temp);
  enable(promptSelect, free);
  enable(tempSlider, free);
  enable(drawButton, free || revealed);
  enable(revealButton, !free && chosen >= 0 && !revealed);
  enable(nextButton, !free && revealed);
  nextButton.html(cur < CHALLENGES.length - 1 ? 'Next challenge' : 'Finish challenges');
  for (let i = 0; i < choiceButtons.length; i++) {
    const b = choiceButtons[i];
    enable(b, !free && chosen < 0);
    const C = CHALLENGES[cur];
    let bg = 'white', fg = '#1f2937', bd = '#3E4F7A';
    if (chosen === i) { bg = '#3E4F7A'; fg = 'white'; }
    if (revealed && i === C.ans) { bg = '#15803d'; fg = 'white'; bd = '#15803d'; }
    else if (revealed && chosen === i) { bg = '#b91c1c'; fg = 'white'; bd = '#b91c1c'; }
    b.style('background-color', bg);
    b.style('color', fg);
    b.style('border-color', bd);
    if (chosen >= 0) b.style('opacity', (chosen === i || (revealed && i === C.ans)) ? '1' : '0.45');
  }
  positionControls();
}

function keyPressed() {
  if (key === '1' || key === '2' || key === '3') choose(Number(key) - 1);
  else if (key === 'Enter') { if (!revealed) reveal(); else nextChallenge(); }
  else if (key === 'd' || key === 'D') doDraw();
}

// ---------- Drawing ----------
function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const score = results.filter(r => r === true).length;
  const nDone = results.filter(r => r !== undefined).length;

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow ? 17 : 22);
  text(narrow ? 'Next Word and Temperature' : 'Next-Word Prediction and Temperature', margin, 10);
  textStyle(NORMAL);
  textSize(14);
  textAlign(RIGHT, TOP);
  if (!narrow) text('Correct on first attempt: ' + score + ' of 5', canvasWidth - margin, 15);

  // context line
  textAlign(LEFT, TOP);
  fill('#334155');
  textSize(14);
  let ctx;
  if (free) ctx = 'Free exploration: choose any prompt and temperature, then press Draw 20.';
  else ctx = 'Challenge ' + (cur + 1) + ' of 5 · ' + CHALLENGES[cur].setting + (narrow ? ' · ' + score + ' of 5' : '');
  text(fitText(ctx, canvasWidth - 2 * margin), margin, 42);

  drawPrompt(64);
  drawBars(118);
  drawPanel(margin, panelTop, canvasWidth - 2 * margin, drawHeight - panelTop - 10);

  // control labels
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, CENTER);
  text('Prompt:', margin, drawHeight + 22);
  text('Temperature: ' + temp.toFixed(1), sliderLabelX, sliderLabelY);
  fill('dimgray');
  textSize(13);
  let status;
  if (free) status = 'Try Again replays the five challenges.';
  else if (chosen < 0) status = 'Choose an answer (keys 1 to 3).';
  else if (!revealed) status = 'Press Reveal (or Enter).';
  else status = 'Draw 20 again, or go on (Enter).';
  if (canvasWidth - margin - statusX > 60) text(fitText(status, canvasWidth - margin - statusX), statusX, rowY + 14);
}

function drawPrompt(y) {
  const P = PROMPTS[promptIdx];
  stroke('#c8963e');
  strokeWeight(1);
  fill('#fff8e6');
  rect(margin, y, canvasWidth - 2 * margin, 44, 8);
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  text('PROMPT ' + (promptIdx + 1), margin + 10, y + 22);
  fill('black');
  textSize(narrow ? 16 : 20);
  text(fitText('“' + P.text + '”', canvasWidth - 2 * margin - 90), margin + 84, y + 23);
  textStyle(NORMAL);
}

function drawBars(top) {
  const P = PROMPTS[promptIdx];
  const base = adjusted(P.p, 1);
  const q = adjusted(P.p, temp);
  const labelW = narrow ? 78 : 96;
  const pctW = 54;
  const dotsW = narrow ? 44 : 20 * 10 + 30;
  const bx = margin + labelW;
  const bw = canvasWidth - 2 * margin - labelW - pctW - dotsW - 8;
  const dx = bx + bw + pctW + 8;
  const rowH = 30;

  // headers
  noStroke();
  fill('#475569');
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('NEXT WORD', margin, top);
  text('PROBABILITY' + (narrow ? '' : (showBars ? ' AT T = ' + temp.toFixed(1) : '')), bx, top);
  text(narrow ? 'PICKS' : 'PICKS IN 20 DRAWS' + (counts ? ' (DRAW ' + drawNo + ')' : ''), dx, top);
  textStyle(NORMAL);

  const maxP = 1;   // the bar scale is 0 to 100 percent
  let topWord = 0;
  for (let i = 1; i < q.length; i++) if (q[i] > q[topWord]) topWord = i;
  for (let i = 0; i < P.words.length; i++) {
    const y = top + 18 + i * rowH;
    // word
    fill('black');
    textSize(15);
    textStyle(showBars && i === topWord ? BOLD : NORMAL);
    textAlign(LEFT, CENTER);
    text(fitText(P.words[i], labelW - 6), margin, y + rowH / 2);
    textStyle(NORMAL);
    // track
    fill('#e5e9ee');
    rect(bx, y + 6, bw, rowH - 12, 3);
    // filled bar at the current temperature
    if (showBars) {
      fill(i === topWord ? '#1e40af' : '#5b8bd6');
      rect(bx, y + 6, bw * q[i] / maxP, rowH - 12, 3);
    }
    // outline: temperature 1.0 reference
    noFill();
    stroke('#334155');
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 3]);
    rect(bx, y + 5, Math.max(1, bw * base[i] / maxP), rowH - 10, 3);
    drawingContext.setLineDash([]);
    noStroke();
    // percent
    fill(showBars ? 'black' : '#64748b');
    textSize(14);
    textAlign(RIGHT, CENTER);
    const pct = showBars ? (q[i] * 100).toFixed(1) + '%' : '';
    text(pct, bx + bw + pctW, y + rowH / 2);
    // picks
    if (counts) {
      if (narrow) {
        fill('#b45309');
        textAlign(LEFT, CENTER);
        textStyle(BOLD);
        text('×' + counts[i], dx, y + rowH / 2);
        textStyle(NORMAL);
      } else {
        for (let k = 0; k < 20; k++) {
          fill(k < counts[i] ? '#d97706' : '#eef1f4');
          rect(dx + k * 10, y + 10, 8, 10, 2);
        }
        fill(counts[i] ? '#b45309' : '#94a3b8');
        textAlign(LEFT, CENTER);
        textStyle(BOLD);
        text(counts[i], dx + 204, y + rowH / 2);
        textStyle(NORMAL);
      }
    }
  }

  // footnote
  const fy = top + 18 + 5 * rowH + 6;
  fill('#475569');
  textSize(12);
  textAlign(LEFT, TOP);
  const foot = 'Dashed outline: probabilities at T = 1.0. Illustrative probabilities, not from a real model. ' +
               'Counts vary from draw to draw.';
  let yy = drawWrapped(foot, margin, fy, canvasWidth - 2 * margin, 15);
  if (P.note) {
    fill('#9a3412');
    textStyle(ITALIC);
    drawWrapped(P.note, margin, yy + 1, canvasWidth - 2 * margin, 15);
    textStyle(NORMAL);
  }
}

function drawPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  const pad = 12;
  const tw = w - 2 * pad;
  textAlign(LEFT, TOP);

  if (free) {
    const score = results.filter(r => r === true).length;
    let yy = y + 10;
    fill('black');
    textStyle(BOLD);
    textSize(16);
    yy = drawWrapped('Correct on first attempt: ' + score + ' of 5.', x + pad, yy, tw, 21) + 2;
    fill(score >= MASTERY ? 'darkgreen' : 'firebrick');
    textSize(15);
    yy = drawWrapped(score >= MASTERY
      ? 'You can predict what temperature does: it changes how the model chooses, not what it knows.'
      : 'Try challenges 2 and 4 again in free exploration: watch the bars as you move the temperature.',
      x + pad, yy, tw, 20) + 6;
    textStyle(NORMAL);
    fill('#333');
    textSize(14);
    drawWrapped('Things to try: choose prompt 3 at temperature 1.0 and draw several times. “Open” turns up in almost every draw. ' +
                'Then set the temperature to 0: it never does. Slide from 0 to 2.0 and watch the bars flatten while the dashed outline, ' +
                'what the model learned, stays put.', x + pad, yy, tw, 19);
    return;
  }

  const C = CHALLENGES[cur];
  fill('black');
  textStyle(BOLD);
  textSize(15);
  drawWrapped(C.q, x + pad, y + 10, tw, 20);
  textStyle(NORMAL);

  let yy = choicesBottom + 6;
  textSize(14);
  if (chosen < 0) {
    fill('#4a5a66');
    drawWrapped('Commit to one answer. Only your first choice counts. Then press Reveal to see the probabilities and a draw of 20.',
                x + pad, yy, tw, 19);
    return;
  }
  if (!revealed) {
    fill('#4a5a66');
    drawWrapped('Locked in. Press Reveal.', x + pad, yy, tw, 19);
    return;
  }
  const ok = results[cur];
  const head = ok ? 'Correct:' : 'Not quite. The answer is \u201c' + C.choices[C.ans] + '\u201d:';
  textStyle(BOLD);
  fill(ok ? 'darkgreen' : 'firebrick');
  const hw = textWidth(head) + 6;
  text(head, x + pad, yy);
  textStyle(NORMAL);
  fill('black');
  const words = C.why.split(' ');
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
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
}
