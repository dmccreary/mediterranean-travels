// Crack Linear B Like Ventris - p5.js 2.x
// CANVAS_HEIGHT: 700
// A simplified, five-step replay of the 1952 decipherment. (1) The sign count
// says "syllabary". (2) Kober's triplet a-mi-ni-so / a-mi-ni-si-jo /
// a-mi-ni-si-ja puts so and si in one grid row. (3) Three sign groups found
// only at Knossos are matched to Cretan place names (scored on the first
// Check). (4) The place names give eight signs their values, and the grid
// unlocks the signs of the Pylos tripod tablet (PY Ta 641). (5) The learner
// predicts four objects from the words, then sees the scribe's pictograms
// (scored on the first Check). Signs are real Linear B characters (Unicode
// Linear B Syllabary, drawn with Noto Sans Linear B) labeled with their
// Bennett sign numbers; values follow Ventris and Chadwick.

let canvasWidth = 700;
let drawHeight = 620;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;
const GLYPH_FONT = 'Noto Sans Linear B';

// Sign number, Unicode code point, and sound value
const SIGNS = {
  ko: { b: 'B070', cp: 0x10012 }, no: { b: 'B052', cp: 0x1001C }, so: { b: 'B012', cp: 0x10030 },
  a:  { b: 'B008', cp: 0x10000 }, mi: { b: 'B073', cp: 0x10016 }, ni: { b: 'B030', cp: 0x1001B },
  tu: { b: 'B069', cp: 0x10036 }, ri: { b: 'B053', cp: 0x1002A }, si: { b: 'B041', cp: 0x1002F },
  jo: { b: 'B036', cp: 0x1000D }, ja: { b: 'B057', cp: 0x1000A }, ti: { b: 'B037', cp: 0x10034 },
  po: { b: 'B011', cp: 0x10021 }, de: { b: 'B045', cp: 0x10006 }, qe: { b: 'B078', cp: 0x10024 },
  to: { b: 'B005', cp: 0x10035 }, ro: { b: 'B002', cp: 0x1002B }, we: { b: 'B075', cp: 0x10038 },
  o:  { b: 'B061', cp: 0x10003 }, e:  { b: 'B038', cp: 0x10001 }
};
const PLACE_SIGNS = ['ko', 'no', 'so', 'a', 'mi', 'ni', 'tu', 'ri'];
const TABLET_SIGNS = ['ti', 'po', 'de', 'qe', 'to', 'ro', 'we', 'o', 'e'];

// The grid: rows by consonant ('' = plain vowels), columns by vowel
const ROWS = ['', 'd', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'w'];
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
function cellOf(v) {
  const vowel = v.slice(-1);
  return { r: ROWS.indexOf(v.length > 1 ? v[0] : ''), c: VOWELS.indexOf(vowel) };
}

const TRIPLET = [['a', 'mi', 'ni', 'so'], ['a', 'mi', 'ni', 'si', 'jo'], ['a', 'mi', 'ni', 'si', 'ja']];

const GROUPS = [
  { id: 'A', signs: ['ko', 'no', 'so'], answer: 'Knossos',
    why: 'ko-no-so: three signs ending in the shared final sign, and its second sign is in the same row as group B’s third sign (both have n).' },
  { id: 'B', signs: ['a', 'mi', 'ni', 'so'], answer: 'Amnisos',
    why: 'a-mi-ni-so: the only four-sign group, starting with a plain-vowel sign.' },
  { id: 'C', signs: ['tu', 'ri', 'so'], answer: 'Tylissos',
    why: 'tu-ri-so: three signs ending in the shared final sign, with no sign in the n row.' }
];
const NAMES = ['Knossos', 'Amnisos', 'Tylissos', 'Phaistos'];
const PHAISTOS_NOTE = 'Phaistos would end in a different sign, because its final st is written with a t sign (pa-i-to).';
const CLUES = [
  'All three groups end with the same sign.',
  'The second sign of group A and the third sign of group B are in the same consonant row.',
  'Group B’s first sign is common at the start of words.'
];

const OBJECTS = ['tripods', 'a cup with four handles', 'a cup with three handles', 'a cup with no handles',
                 'a chariot wheel', 'a jar of oil'];
// pict: what the scribe drew beside the word; count: the number written after it
const WORDS = [
  { signs: ['ti', 'ri', 'po', 'de'], answer: 0, pict: 'tripod', count: 2,
    why: 'Tri- “three” plus podes “feet”: tripodes. The tablet counts two.' },
  { signs: ['qe', 'to', 'ro', 'we'], answer: 1, pict: 4, count: 1,
    why: 'Kwetro- “four” plus -owes “handled.”' },
  { signs: ['ti', 'ri', 'o', 'we', 'e'], answer: 2, pict: 3, count: 2,
    why: 'Tri- “three” plus -owes “handled”; the final -e marks two cups.' },
  { signs: ['a', 'no', 'we'], answer: 3, pict: 0, count: 1,
    why: 'An- “without” plus -owes “handled.”' }
];
const WORD_BANK = [
  ['tri-', '“three”'],
  ['tetra-, earlier kwetro-', '“four” (Linear B writes kwe with the sign qe)'],
  ['a- or an-', '“not, without”'],
  ['pous, plural podes', '“foot, feet”'],
  ['ous', '“ear, handle” (so -owes, “handled”)']
];

const STEP_NAMES = ['Count the signs', 'Kober’s triplet', 'Guess the place names', 'Unlock the grid',
                    'Read the tripod tablet'];
const Q1 = { q: 'Linear B uses about 90 sound-signs. What kind of script is this?',
             choices: ['alphabet', 'syllabary', 'logographic script'], correct: 1,
             good: 'About 40 to 100 signs suggests a syllabary (Chapter 2’s sign-count rule).',
             hint: 'Count the signs: about 90.' };
const Q2 = { q: 'The last sign of word 1 is replaced by a different sign in words 2 and 3. If each sign is a syllable, ' +
                'what do the two signs probably share?',
             choices: ['the same consonant', 'the same vowel', 'nothing'], correct: 0,
             good: 'The consonant belongs to the stem, which stays the same; the vowel belongs to the ending, which changes.',
             hint: 'Which part of the word stays the same?' };

// ---------- State ----------
let step = 0;                 // 0..4
let stepDone = false;
let qFeedback = null;         // { ok, text } for steps 1 and 2
let rowFound = false;         // so and si share a row (after step 2)
let placeChecked = false, placeScore = -1, placeMarks = null, placeMsg = '';
let unlocked = false;         // step 4: the tablet signs have values
let wordChecked = false, wordScore = -1, wordMarks = null, wordMsg = '';
let showGrid = false;         // narrow layout: grid instead of the main panel

// ---------- Controls ----------
let choiceButtons = [];
let actionButton, nextButton, restartButton, gridCheckbox;
let placeSelects = [], wordSelects = [];
let mainEl;

async function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  mainEl = document.querySelector('main');
  canvas.parent(mainEl);

  for (let i = 0; i < 3; i++) {
    const b = createButton('');
    b.parent(mainEl);
    b.style('font-size', '13px');
    b.mousePressed(() => choose(i));
    choiceButtons.push(b);
  }
  actionButton = createButton('Check');
  actionButton.parent(mainEl);
  actionButton.style('font-size', '14px');
  actionButton.mousePressed(doAction);

  nextButton = createButton('Next step →');
  nextButton.parent(mainEl);
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextStep);

  restartButton = createButton('Start over');
  restartButton.parent(mainEl);
  restartButton.style('font-size', '14px');
  restartButton.mousePressed(restart);

  gridCheckbox = createCheckbox(' Show the grid', false);
  gridCheckbox.parent(mainEl);
  gridCheckbox.style('font-size', '14px');
  gridCheckbox.changed(() => { showGrid = gridCheckbox.checked(); updateControls(); });

  for (let g = 0; g < GROUPS.length; g++) {
    const s = createSelect();
    s.parent(mainEl);
    s.option('— choose —', '');
    for (const n of NAMES) s.option(n, n);
    s.style('font-size', '13px');
    s.attribute('aria-label', 'Place name for group ' + GROUPS[g].id);
    placeSelects.push(s);
  }
  for (let w = 0; w < WORDS.length; w++) {
    const s = createSelect();
    s.parent(mainEl);
    s.option('— choose —', '');
    for (const o of OBJECTS) s.option(o, o);
    s.style('font-size', '13px');
    s.attribute('aria-label', 'Object for word ' + (w + 1));
    wordSelects.push(s);
  }

  positionControls();
  restart();

  describe('A five-step puzzle that replays the decipherment of Linear B. Linear B signs are shown with their sign ' +
           'numbers. The learner decides the script is a syllabary, uses Alice Kober’s triplet to put two signs in ' +
           'one row of a grid, matches three sign groups to the Cretan place names Knossos, Amnisos, and Tylissos, ' +
           'watches the grid fill with sound values, and then reads four words on the Pylos tripod tablet and predicts ' +
           'the objects, which the scribe’s pictograms confirm.');

  // Wait briefly for the Linear B web font; the sketch draws sign numbers either way
  try {
    await Promise.race([document.fonts.load('28px "' + GLYPH_FONT + '"', String.fromCodePoint(0x10012)),
                        new Promise(r => setTimeout(r, 2500))]);
  } catch (e) { /* the fallback font or the sign numbers still identify each sign */ }
}

function isNarrow() { return canvasWidth < 600; }

// Main panel and grid panel rectangles
function layout() {
  const top = 46, h = drawHeight - top - margin;
  if (isNarrow() || step === 4) {
    const w = canvasWidth - 2 * margin;
    return { main: { x: margin, y: top, w: w, h: h }, grid: { x: margin, y: top, w: w, h: h } };
  }
  const mw = Math.floor((canvasWidth - 3 * margin) * 0.6);
  return { main: { x: margin, y: top, w: mw, h: h },
           grid: { x: 2 * margin + mw, y: top, w: canvasWidth - 3 * margin - mw, h: h } };
}

function positionControls() {
  const narrow = isNarrow();
  const y1 = drawHeight + 8, y2 = drawHeight + 44;
  let x = margin;
  for (const b of choiceButtons) {
    b.position(x, y1);
    x += (narrow ? 122 : 166);
    b.size(narrow ? 116 : 158, 30);
  }
  actionButton.position(margin, y1);
  nextButton.position(margin, y2);
  restartButton.position(margin + 110, y2);
  gridCheckbox.position(margin + 214, y2 + 5);
}

function restart() {
  step = 0;
  stepDone = false;
  qFeedback = null;
  rowFound = false;
  placeChecked = false; placeScore = -1; placeMarks = null; placeMsg = '';
  unlocked = false;
  wordChecked = false; wordScore = -1; wordMarks = null; wordMsg = '';
  showGrid = false;
  gridCheckbox.checked(false);
  for (const s of placeSelects) s.selected('');
  for (const s of wordSelects) s.selected('');
  updateControls();
}

function currentQ() { return step === 0 ? Q1 : Q2; }

function choose(i) {
  if (step > 1 || stepDone) return;
  const Q = currentQ();
  if (i === Q.correct) {
    qFeedback = { ok: true, text: Q.good };
    stepDone = true;
    if (step === 1) rowFound = true;
  } else {
    qFeedback = { ok: false, text: 'Not yet: ' + Q.hint, wrong: i };
  }
  updateControls();
}

function doAction() {
  if (step === 2) checkPlaces();
  else if (step === 3 && !unlocked) { unlocked = true; stepDone = true; updateControls(); }
  else if (step === 4) checkWords();
}

function checkPlaces() {
  const picks = placeSelects.map(s => s.value());
  if (picks.some(p => !p)) { placeMsg = 'Choose a name for each group first.'; return; }
  if (new Set(picks).size < picks.length) { placeMsg = 'Use each name at most once.'; return; }
  placeMarks = picks.map((p, i) => p === GROUPS[i].answer);
  const n = placeMarks.filter(Boolean).length;
  const practice = placeChecked;
  if (!placeChecked) { placeScore = n; placeChecked = true; }
  placeMsg = picks.includes('Phaistos') ? PHAISTOS_NOTE : '';
  if (practice) placeMsg = (placeMsg ? placeMsg + ' ' : '') + 'Practice check (' + n + ' of 3): not scored.';
  stepDone = true;
  updateControls();
}

function checkWords() {
  const picks = wordSelects.map(s => s.value());
  if (picks.some(p => !p)) { wordMsg = 'Choose an object for each word first.'; return; }
  if (new Set(picks).size < picks.length) { wordMsg = 'Use each object at most once.'; return; }
  wordMarks = picks.map((p, i) => p === OBJECTS[WORDS[i].answer]);
  const n = wordMarks.filter(Boolean).length;
  if (!wordChecked) { wordScore = n; wordChecked = true; wordMsg = ''; }
  else wordMsg = 'Practice check (' + n + ' of 4): not scored.';
  stepDone = true;
  updateControls();
}

function nextStep() {
  if (!stepDone || step >= 4) return;
  step++;
  stepDone = false;
  qFeedback = null;
  updateControls();
}

function show(el, on) { if (on) el.show(); else el.hide(); }

function updateControls() {
  const narrow = isNarrow();
  const gridOnly = (narrow || step === 4) && showGrid;
  for (let i = 0; i < 3; i++) {
    const b = choiceButtons[i];
    show(b, step <= 1);
    if (step <= 1) {
      b.html(currentQ().choices[i]);
      if (stepDone) b.attribute('disabled', ''); else b.removeAttribute('disabled');
    }
  }
  show(actionButton, step >= 2);
  if (step === 2) actionButton.html(placeChecked ? 'Check again' : 'Check');
  if (step === 3) actionButton.html(unlocked ? 'Unlocked' : 'Unlock the tablet signs');
  if (step === 4) actionButton.html(wordChecked ? 'Check again' : 'Check');
  if (step === 3 && unlocked) actionButton.attribute('disabled', ''); else actionButton.removeAttribute('disabled');
  actionButton.size(step === 3 ? 200 : 120, 30);

  show(nextButton, true);
  if (stepDone && step < 4) nextButton.removeAttribute('disabled'); else nextButton.attribute('disabled', '');
  show(gridCheckbox, narrow || step === 4);
  for (const s of placeSelects) show(s, step === 2 && !gridOnly);
  for (const s of wordSelects) show(s, step === 4 && !gridOnly);
}

// ---------- Drawing ----------
function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = isNarrow();
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow ? 17 : 21);
  text(narrow ? 'Crack Linear B' : 'Crack Linear B Like Ventris', margin, 10);
  textStyle(NORMAL);
  textAlign(RIGHT, TOP);
  textSize(narrow ? 12 : 14);
  fill('#333');
  text('Step ' + (step + 1) + ' of 5: ' + STEP_NAMES[step], canvasWidth - margin, 6);
  fill('dimgray');
  textSize(12);
  text('Place names: ' + (placeScore < 0 ? '–' : placeScore) + ' of 3 · Tablet objects: ' +
       (wordScore < 0 ? '–' : wordScore) + ' of 4', canvasWidth - margin, 26);

  const L = layout();
  const gridView = (narrow || step === 4) && showGrid;
  if (!gridView) drawMain(L.main);
  if (gridView || (!narrow && step < 4)) drawGrid(L.grid);

  // Status line in the control area
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(13);
  let status = '';
  if (step <= 1) status = stepDone ? 'Press Next step.' : 'Choose an answer; you may try again.';
  else if (step === 2) status = placeChecked ? 'Scored on your first Check.' : 'Match each group, then Check.';
  else if (step === 3) status = unlocked ? 'Press Next step.' : '';
  else status = wordChecked ? (wordMsg || 'Scored on your first Check.') : 'Predict each object, then Check.';
  const sx = step === 3 ? margin + 214 : (step <= 1 ? margin + (narrow ? 372 : 508) : margin + 134);
  if (canvasWidth - sx - margin > 120) text(fitText(status, canvasWidth - sx - margin), sx, drawHeight + 23);
}

function panel(r) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(r.x, r.y, r.w, r.h, 8);
  noStroke();
}

// A sign: glyph, sign number below, and its value when unlocked
function drawSign(v, cx, y, size, opts) {
  opts = opts || {};
  const S = SIGNS[v];
  if (opts.hl) {
    noStroke();
    fill(opts.hl);
    rect(cx - size * 0.62, y - 2, size * 1.24, size * 1.2 + 12, 4);
  }
  noStroke();
  fill('black');
  textFont(GLYPH_FONT);
  textAlign(CENTER, TOP);
  textSize(size);
  text(String.fromCodePoint(S.cp), cx, y);
  textFont('sans-serif');
  textSize(Math.max(9, Math.round(size * 0.36)));
  fill('dimgray');
  text(S.b, cx, y + size * 1.12);
  if (opts.value) {
    fill(opts.valueColor || '#7a5410');
    textStyle(BOLD);
    textSize(Math.max(10, Math.round(size * 0.46)));
    text(v, cx, y + size * 1.12 + Math.max(10, size * 0.4));
    textStyle(NORMAL);
  }
  textAlign(LEFT, TOP);
}

function drawSigns(list, x, y, size, gap, opts) {
  for (let i = 0; i < list.length; i++) {
    const o = typeof opts === 'function' ? opts(i, list[i]) : opts;
    drawSign(list[i], x + i * gap + gap / 2, y, size, o);
  }
}

function drawMain(r) {
  panel(r);
  const pad = 14;
  const x = r.x + pad, tw = r.w - 2 * pad;
  let y = r.y + 12;
  textAlign(LEFT, TOP);
  if (step === 0) drawStep1(x, y, tw);
  else if (step === 1) drawStep2(x, y, tw);
  else if (step === 2) drawStep3(x, y, tw);
  else if (step === 3) drawStep4(x, y, tw);
  else drawStep5(x, y, tw, r);
}

function drawQuestion(x, y, tw, Q) {
  fill('black');
  textStyle(BOLD);
  textSize(15);
  y = drawWrapped(Q.q, x, y, tw, 19) + 6;
  textStyle(NORMAL);
  if (qFeedback) {
    textSize(14);
    fill(qFeedback.ok ? 'darkgreen' : 'firebrick');
    textStyle(BOLD);
    const lead = qFeedback.ok ? 'Correct.' : '';
    if (lead) {
      text(lead, x, y);
      const lw = textWidth(lead) + 6;
      textStyle(NORMAL);
      fill('black');
      const first = wrapLines(qFeedback.text, tw - lw);
      text(first[0], x + lw, y);
      const rest = qFeedback.text.slice(first[0].length).trim();
      y = rest ? drawWrapped(rest, x, y + 18, tw, 18) : y + 18;
    } else {
      textStyle(NORMAL);
      y = drawWrapped(qFeedback.text, x, y, tw, 18);
    }
  } else {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(13);
    y = drawWrapped('Choose an answer with the buttons below.', x, y, tw, 17);
    textStyle(NORMAL);
  }
  return y;
}

function drawStep1(x, y, tw) {
  fill('#333');
  textSize(14);
  y = drawWrapped('These are signs from the Knossos tablets, as Alice Kober and Michael Ventris saw them: no one could ' +
                  'read a single one. Each is labeled with its sign number from Emmett Bennett’s catalog.', x, y, tw, 18) + 10;
  const sample = ['ko', 'no', 'so', 'a', 'mi', 'ni', 'tu', 'ri', 'si', 'ti', 'po', 'de', 'qe', 'to', 'ro', 'we'];
  const size = isNarrow() ? 26 : 30;
  const gap = size * 1.5;
  const perRow = Math.max(4, Math.floor(tw / gap));
  for (let i = 0; i < sample.length; i++) {
    const rr = Math.floor(i / perRow), cc = i % perRow;
    drawSign(sample[i], x + cc * gap + gap / 2, y + rr * (size * 1.7 + 8), size);
  }
  y += Math.ceil(sample.length / perRow) * (size * 1.7 + 8) + 4;
  fill('dimgray');
  textSize(12);
  textStyle(ITALIC);
  y = drawWrapped('Sixteen of them. The full set has about 90 sound-signs, plus word-signs for things like men, sheep, and wine.',
                  x, y, tw, 16) + 12;
  textStyle(NORMAL);
  drawQuestion(x, y, tw, Q1);
}

function drawStep2(x, y, tw) {
  fill('#333');
  textSize(14);
  y = drawWrapped('Kober found words that appear in three forms with the same beginning and different endings. Here is ' +
                  'one such triplet, signs only:', x, y, tw, 18) + 10;
  const size = isNarrow() ? 26 : 30;
  const gap = size * 1.45;
  for (let w = 0; w < TRIPLET.length; w++) {
    fill('dimgray');
    textSize(12);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    text('Word ' + (w + 1), x, y + size * 0.35);
    textStyle(NORMAL);
    drawSigns(TRIPLET[w], x + 56, y, size, gap, (i) => (i === 3 ? { hl: '#fde7b0' } : {}));
    y += size * 1.6 + 10;
  }
  y += 4;
  y = drawQuestion(x, y, tw, Q2) + 8;
  if (rowFound) {
    fill('#1F4E79');
    textSize(13);
    textStyle(BOLD);
    drawWrapped('B012 and B041 now sit in the same grid row: row 1, unknown consonant.', x, y, tw, 17);
    textStyle(NORMAL);
  }
}

// Selects are DOM elements: move them only when their spot changes
function placeSelect(sel, sx, sy, w) {
  const key = Math.round(sx) + ',' + Math.round(sy) + ',' + Math.round(w);
  if (sel._spot !== key) {
    sel._spot = key;
    sel.position(sx, sy);
    sel.size(w, 26);
  }
}

function drawStep3(x, y, tw) {
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('A simplified version of Ventris’s test', x, y);
  textStyle(NORMAL);
  y += 22;
  fill('#333');
  textSize(13);
  y = drawWrapped('These three groups appear only on tablets from Knossos, never at Pylos. Ventris guessed they were ' +
                  'Cretan place names. Clues:', x, y, tw, 17) + 2;
  for (let i = 0; i < CLUES.length; i++) {
    fill('#5a4a10');
    textStyle(BOLD);
    text((i + 1) + '.', x, y);
    textStyle(NORMAL);
    fill('#333');
    y = drawWrapped(CLUES[i], x + 18, y, tw - 18, 17) + 1;
  }
  fill('dimgray');
  textStyle(ITALIC);
  y = drawWrapped('Names: Knossos, Amnisos, Tylissos, Phaistos. One is not used.', x, y + 3, tw, 17) + 8;
  textStyle(NORMAL);

  const size = 24, gap = 32;
  const selW = Math.min(150, tw - 30 - 4 * gap - 10);
  for (let g = 0; g < GROUPS.length; g++) {
    const G = GROUPS[g];
    fill('#1F4E79');
    textStyle(BOLD);
    textSize(16);
    textAlign(LEFT, TOP);
    text(G.id, x, y + 6);
    textStyle(NORMAL);
    const reveal = placeChecked && placeMarks && placeMarks[g];
    drawSigns(G.signs, x + 22, y, size, gap, () => ({ value: !!reveal }));
    placeSelect(placeSelects[g], x + tw - selW, y + 4, selW);
    y += size * 1.6 + (reveal ? 16 : 6);
    if (placeChecked && placeMarks) {
      textSize(12);
      textStyle(BOLD);
      fill(placeMarks[g] ? 'darkgreen' : 'firebrick');
      const lead = placeMarks[g] ? 'Correct:' : 'This is ' + G.answer + ':';
      text(lead, x + 22, y);
      const lw = textWidth(lead) + 5;
      textStyle(NORMAL);
      fill('black');
      const first = wrapLines(G.why, tw - 22 - lw);
      text(first[0], x + 22 + lw, y);
      const rest = G.why.slice(first[0].length).trim();
      y = (rest ? drawWrapped(rest, x + 22, y + 15, tw - 22, 15) : y + 15) + 6;
    } else {
      y += 6;
    }
  }
  if (placeMsg) {
    textSize(12);
    fill(placeMarks ? '#7a5410' : 'firebrick');
    y = drawWrapped(placeMsg, x, y + 2, tw, 15);
  }
}

function drawStep4(x, y, tw) {
  fill('black');
  textStyle(BOLD);
  textSize(15);
  text('One guess, eight sounds', x, y);
  textStyle(NORMAL);
  y += 22;
  fill('#333');
  textSize(14);
  y = drawWrapped('If group A is Knossos and group B is Amnisos, eight signs have values: ko, no, so, a, mi, ni, tu, ri. ' +
                  'They are now in the grid, in gold.', x, y, tw, 18) + 8;
  const size = 26, gap = 34;
  const perRow = Math.max(4, Math.floor(tw / gap));
  for (let i = 0; i < PLACE_SIGNS.length; i++) {
    const rr = Math.floor(i / perRow), cc = i % perRow;
    drawSign(PLACE_SIGNS[i], x + cc * gap + gap / 2, y + rr * (size * 2.1), size, { value: true, hl: '#fdf0cc' });
  }
  y += Math.ceil(PLACE_SIGNS.length / perRow) * size * 2.1 + 8;
  textSize(14);
  fill('#333');
  y = drawWrapped('Ventris’s grid gave partial values to every sign sharing a row or column with these. Here are the ' +
                  'values the decipherment reached for the signs on the next tablet.', x, y, tw, 18) + 8;
  if (!unlocked) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(13);
    drawWrapped('Press “Unlock the tablet signs” below.', x, y, tw, 17);
    textStyle(NORMAL);
    return;
  }
  for (let i = 0; i < TABLET_SIGNS.length; i++) {
    const rr = Math.floor(i / perRow), cc = i % perRow;
    drawSign(TABLET_SIGNS[i], x + cc * gap + gap / 2, y + rr * (size * 2.1), size,
             { value: true, hl: '#dcebf7', valueColor: '#1F4E79' });
  }
  y += Math.ceil(TABLET_SIGNS.length / perRow) * size * 2.1 + 6;
  textSize(13);
  fill('#1F4E79');
  y = drawWrapped('B041 needs no new guess: it sits in the row of so and the column of ni, so it is si.', x, y, tw, 17) + 4;
  fill('#333');
  drawWrapped('Every value traces back to one guess, tested against the grid.', x, y, tw, 17);
}

function drawStep5(x, y, tw, r) {
  const narrow = isNarrow();
  // Word bank (folded away on narrow screens once checked)
  if (!(narrow && wordChecked)) {
    textSize(12);
    const rows = WORD_BANK.map(([w, m]) => {
      textStyle(ITALIC);
      const ww = textWidth(w) + 6;
      textStyle(NORMAL);
      return { w: w, ww: ww, lines: wrapLines(m, tw - ww - 4) };
    });
    const bankH = 24 + rows.reduce((t, r) => t + r.lines.length * 15, 0);
    stroke('#d9c27a');
    fill('#fff8dc');
    rect(x - 4, y - 4, tw + 8, bankH, 6);
    noStroke();
    fill('#5a4a10');
    textStyle(BOLD);
    textSize(13);
    textAlign(LEFT, TOP);
    text('Word bank (Greek)', x + 2, y);
    textSize(12);
    let by = y + 18;
    for (const r of rows) {
      textStyle(ITALIC);
      fill('#5a4a10');
      text(r.w, x + 2, by);
      textStyle(NORMAL);
      fill('#333');
      for (const ln of r.lines) { text(ln, x + 2 + r.ww, by); by += 15; }
    }
    y += bankH + 6;
  }
  fill('#333');
  textSize(13);
  y = drawWrapped('Four words from the tablet Carl Blegen found at Pylos in 1952. What does each one name?', x, y, tw, 17) + 6;

  const size = narrow ? 18 : 22, gap = narrow ? 24 : 28;
  const glyphW = 5 * gap;
  const pictW = 70;
  for (let i = 0; i < WORDS.length; i++) {
    const W = WORDS[i];
    fill('#1F4E79');
    textStyle(BOLD);
    textSize(14);
    textAlign(LEFT, TOP);
    text(i + 1, x, y + 4);
    textStyle(NORMAL);
    drawSigns(W.signs, x + 16, y, size, gap, () => ({ value: true, valueColor: '#444' }));
    const signsH = size * 1.12 + Math.max(10, size * 0.4) + 14;
    let rowEnd;
    if (!narrow) {
      // [glyphs][select][pictogram][reason]
      const selX = x + 16 + glyphW + 8, selW = 190;
      placeSelect(wordSelects[i], selX, y + 6, selW);
      const px = selX + selW + 8, rx = px + pictW + 8, rw = x + tw - rx;
      rowEnd = y + signsH;
      if (wordChecked && wordMarks) {
        drawPictogram(W.pict, W.count, px + pictW / 2, y + 24, 0.8);
        rowEnd = Math.max(rowEnd, drawVerdict(i, W, rx, y + 2, rw));
      }
      y = rowEnd + 8;
    } else {
      // line 1: glyphs (and the pictogram once checked); line 2: select; then the reason
      if (wordChecked && wordMarks) drawPictogram(W.pict, W.count, x + tw - pictW / 2, y + 20, 0.7);
      y += signsH;
      placeSelect(wordSelects[i], x + 16, y, Math.min(240, tw - 16));
      y += 32;
      if (wordChecked && wordMarks) y = drawVerdict(i, W, x + 16, y, tw - 16) + 4;
      y += 4;
    }
  }
  if (wordChecked) {
    fill('dimgray');
    textSize(11);
    textStyle(ITALIC);
    textAlign(RIGHT, TOP);
    text('Pictograms simplified from the tablet (PY Ta 641)', x + tw, y - 4);
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    const pass = placeScore === 3 && wordScore >= 3;
    textSize(13);
    textStyle(BOLD);
    fill(pass ? 'darkgreen' : 'firebrick');
    let msg = pass ? 'You have just repeated the test that convinced the world in 1953.'
                   : 'Look again at the word bank: tri- and kwetro- are numbers, and a- means without.';
    if (!pass && placeScore < 3 && wordScore >= 3) msg = 'The tablet reads well; look again at the place-name clues in step 3.';
    y = drawWrapped(msg, x, y + 12, tw, 17);
    textStyle(NORMAL);
    fill('#333');
    textSize(12);
    drawWrapped('The scribe drew these pictures about 3,200 years ago; no one could have arranged them to fit Ventris’s values.',
                x, y + 2, tw, 15);
  } else if (wordMsg) {
    textSize(12);
    fill('firebrick');
    drawWrapped(wordMsg, x, y + 4, tw, 15);
  }
}

// Correct or not, with the reason; returns the y below it
function drawVerdict(i, W, x, y, w) {
  textSize(12);
  textStyle(BOLD);
  fill(wordMarks[i] ? 'darkgreen' : 'firebrick');
  const lead = wordMarks[i] ? 'Correct.' : 'It is ' + OBJECTS[W.answer] + '.';
  const lw = textWidth(lead) + 5;
  text(lead, x, y);
  textStyle(NORMAL);
  fill('black');
  if (lw > w * 0.7) return drawWrapped(W.why, x, y + 15, w, 15);
  const first = wrapLines(W.why, w - lw);
  text(first[0], x + lw, y);
  const rest = W.why.slice(first[0].length).trim();
  return rest ? drawWrapped(rest, x, y + 15, w, 15) : y + 15;
}

// Simple drawings after the tablet's pictograms, with the count as unit strokes
function drawPictogram(kind, count, cx, cy, s) {
  push();
  translate(cx - 8, cy);
  scale(s);
  stroke('#5a3a1a');
  strokeWeight(2);
  noFill();
  if (kind === 'tripod') {
    arc(0, -6, 40, 30, 0, PI);           // cauldron bowl
    line(-20, -6, 20, -6);
    ellipse(-12, -14, 8, 10);            // ring handles
    ellipse(12, -14, 8, 10);
    line(-12, 8, -18, 26);               // three legs
    line(0, 9, 0, 27);
    line(12, 8, 18, 26);
  } else {
    // goblet: bowl, stem, foot; handles on the rim
    arc(0, -10, 34, 34, 0, PI);
    line(-17, -10, 17, -10);
    line(0, 7, 0, 18);
    line(-9, 20, 9, 20);
    const n = kind;
    for (let k = 0; k < n; k++) {
      const hx = n === 1 ? 0 : -14 + k * (28 / (n - 1));
      arc(hx, -10, 8, 12, PI, TWO_PI);
    }
  }
  // count, as unit strokes
  strokeWeight(2.5);
  for (let k = 0; k < count; k++) line(28 + k * 6, -10, 28 + k * 6, 10);
  pop();
}

function drawGrid(r) {
  panel(r);
  const pad = 10;
  const x = r.x + pad, w = r.w - 2 * pad;
  let y = r.y + 10;
  fill('black');
  textStyle(BOLD);
  textSize(14);
  textAlign(LEFT, TOP);
  text('The grid', x, y);
  textStyle(NORMAL);
  textSize(11);
  fill('dimgray');
  y += 18;
  text(fitText(step >= 3 ? 'Rows: consonants. Columns: vowels.' : 'Rows: same consonant. Columns: same vowel.', w), x, y);
  y += 16;

  const labelW = 26;
  const cw = (w - labelW) / VOWELS.length;
  const ch = Math.min(40, (r.y + r.h - y - 58) / (ROWS.length + 1));
  const known = step >= 3;
  // Column headers
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  for (let c = 0; c < VOWELS.length; c++) {
    fill(known ? '#1F4E79' : '#999');
    text(known ? VOWELS[c] : '?', x + labelW + c * cw + cw / 2, y + ch / 2);
  }
  textStyle(NORMAL);
  const gy = y + ch;
  for (let rr = 0; rr < ROWS.length; rr++) {
    const yy = gy + rr * ch;
    stroke('#e3e3e3');
    strokeWeight(1);
    for (let c = 0; c < VOWELS.length; c++) {
      fill(rr % 2 ? '#fafafa' : 'white');
      rect(x + labelW + c * cw, yy, cw, ch);
    }
    noStroke();
    let lbl = '?';
    if (known) lbl = ROWS[rr] === '' ? '–' : ROWS[rr];
    else if (rowFound && ROWS[rr] === 's') lbl = '1';
    fill(known || (rowFound && ROWS[rr] === 's') ? '#1F4E79' : '#999');
    textStyle(BOLD);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(lbl, x + labelW / 2, yy + ch / 2);
    textStyle(NORMAL);
  }
  if (rowFound && !known) {
    // so and si in row 1, values unknown
    const rs = ROWS.indexOf('s');
    noFill();
    stroke('#1F4E79');
    strokeWeight(2);
    rect(x + 1, gy + rs * ch + 1, w - 2, ch - 2, 3);
    noStroke();
    for (const v of ['so', 'si']) drawCell(v, x, gy, labelW, cw, ch, false, '#eef4fa');
  }
  if (known) {
    for (const v of PLACE_SIGNS) drawCell(v, x, gy, labelW, cw, ch, true, '#fdf0cc');
    const siColor = unlocked ? '#dcebf7' : '#f0f0f0';
    drawCell('si', x, gy, labelW, cw, ch, unlocked, siColor);
    if (unlocked) for (const v of TABLET_SIGNS) drawCell(v, x, gy, labelW, cw, ch, true, '#dcebf7');
  }

  // Legend / note
  let ny = gy + ROWS.length * ch + 8;
  textAlign(LEFT, TOP);
  textSize(11);
  fill('#444');
  let note;
  if (!rowFound) note = 'Empty: no sign has a place yet. Kober’s method fills it without any sounds.';
  else if (!known) note = 'Row 1: B012 and B041 share an unknown consonant.';
  else if (!unlocked) note = 'Gold: values from the place names. B041 shares a row with so and has no value yet.';
  else note = 'Gold: from the place names. Blue: reached through the grid. A simplified view of Ventris’s grid.';
  drawWrapped(note, x, ny, w, 14);
}

function drawCell(v, x, gy, labelW, cw, ch, withValue, bg) {
  const p = cellOf(v);
  const cx = x + labelW + p.c * cw, cy = gy + p.r * ch;
  noStroke();
  fill(bg);
  rect(cx + 1, cy + 1, cw - 2, ch - 2, 3);
  const gs = Math.min(ch * 0.62, cw * 0.5);
  fill('black');
  textFont(GLYPH_FONT);
  textSize(gs);
  if (withValue && cw > 44) {
    textAlign(LEFT, CENTER);
    text(String.fromCodePoint(SIGNS[v].cp), cx + 4, cy + ch / 2);
    textFont('sans-serif');
    textStyle(BOLD);
    textSize(Math.min(13, ch * 0.42));
    fill('#5a3a1a');
    textAlign(RIGHT, CENTER);
    text(v, cx + cw - 4, cy + ch / 2);
    textStyle(NORMAL);
  } else if (withValue) {
    textAlign(CENTER, CENTER);
    textFont('sans-serif');
    textStyle(BOLD);
    textSize(Math.min(12, ch * 0.42));
    fill('#5a3a1a');
    text(v, cx + cw / 2, cy + ch / 2);
    textStyle(NORMAL);
  } else {
    textAlign(CENTER, CENTER);
    text(String.fromCodePoint(SIGNS[v].cp), cx + cw / 2, cy + ch / 2);
  }
  textFont('sans-serif');
}

// ---------- Text helpers ----------
function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (textWidth(t) > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = t;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
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
  for (const s of placeSelects.concat(wordSelects)) s._spot = null;
  positionControls();
  updateControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
}
