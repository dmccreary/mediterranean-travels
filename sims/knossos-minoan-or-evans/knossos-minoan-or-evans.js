// Knossos: Minoan, Evans, or Copy? - p5.js 2.x
// CANVAS_HEIGHT: 580
// Ten features a visitor sees at Knossos, one card at a time in a fixed order.
// The learner sorts each into one of three bins: a Minoan original still at the
// site, an Evans reconstruction (about 1905 to 1930), or a modern copy of an
// original now in the Heraklion Archaeological Museum. The first answer is
// scored; feedback gives the reason and the card joins its correct bin.
// Mastery is 8 of 10. "What to look for" opens a material clue after answering
// (exploration, not evidence). Try Again repeats all ten cards unscored.

let canvasWidth = 700;
let drawHeight = 500;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const QUESTION = 'Who made this: the Minoans, Evans, or a modern copyist?';

const BINS = [
  { name: 'Minoan original', short: 'Minoan', color: '#8B5A2B', light: '#f6ece1',
    def: 'Built or made by the Minoans and still at the site.' },
  { name: 'Evans reconstruction', short: 'Evans', color: '#A4282A', light: '#f9e6e6',
    def: 'Built for Arthur Evans between about 1905 and 1930.' },
  { name: 'Modern copy', short: 'Copy', color: '#2F6E8E', light: '#e4f0f6',
    def: 'A painted copy at the site of an original now in the Heraklion museum.' }
];

// bin is an index into BINS
const CARDS = [
  { card: 'The lower walls and floor plan around the central court', chip: 'Walls and floor plan', bin: 0,
    why: 'The plan and the lower courses of stone survived the fire and were excavated in place.',
    look: 'Worn limestone and gypsum blocks at ground level, laid out just as the excavators found them.' },
  { card: 'Red columns, wider at the top than the bottom, at the North Entrance', chip: 'Red columns', bin: 1,
    why: 'The original columns were wooden and burned; these are painted concrete, shaped after Minoan evidence.',
    look: 'Smooth painted concrete. Wood does not survive a fire; only the stone column bases did.' },
  { card: 'The painted relief of a charging bull at the North Entrance', chip: 'Charging bull relief', bin: 2,
    why: 'The original plaster relief is in the Heraklion museum; the one on the wall is a copy.',
    look: 'A complete, bright painting outdoors. Fragile painted plaster would not last decades of rain.' },
  { card: 'The gypsum throne in the Throne Room', chip: 'Gypsum throne', bin: 0,
    why: 'The throne was found in place in 1900 and has never left the room.',
    look: 'Worn, soft gypsum, the same stone as the benches beside it, inside a roofed room.' },
  { card: 'The concrete upper floor built over the Throne Room', chip: 'Upper floor over Throne Room', bin: 1,
    why: 'Evans rebuilt a whole upper story in reinforced concrete to show how the wing may have looked.',
    look: 'Gray concrete slabs and crisp edges above head height.' },
  { card: 'Giant storage jars in the West Magazines', chip: 'Storage jars (pithoi)', bin: 0,
    why: 'Many pithoi were left where they were found, in the storerooms behind the Throne Room.',
    look: 'Hand-built fired clay with rope-pattern bands, standing in the storeroom floor.' },
  { card: 'The dolphin painting in the so-called Queen’s Megaron', chip: 'Dolphin painting', bin: 2,
    why: 'The original fragments are in the museum; the room shows a painted copy.',
    look: 'A clean, complete painting on a wall. The original survives only as fragments in a museum case.' },
  { card: 'Large stone horns of consecration on the south side', chip: 'Horns of consecration', bin: 1,
    why: 'They were re-made at large size from fragments, an Evans-era guess at the original.',
    look: 'Crisp, oversized horns with sharp edges, far larger than any set found whole.' },
  { card: 'Clay drainage pipes and stone water channels', chip: 'Pipes and channels', bin: 0,
    why: 'The palace’s water system survived underground and was excavated in place.',
    look: 'Tapered clay pipe sections and cut-stone channels below floor level, found where they were laid.' },
  { card: 'The Cup-Bearer painting on the south side', chip: 'Cup-Bearer painting', bin: 2,
    why: 'The original figure from the procession paintings is in the museum.',
    look: 'A crisp painted figure on an outdoor wall. Every original painting went to the museum.' }
];
const MASTERY = 8;

// ---------- State ----------
let practice = false;     // false on the scored first pass; true after Try Again
let current = 0;
let answered = false;
let chosen = -1;
let results = {};         // scored first-attempt results, kept through practice
let practiceResults = {};
let score = 0;
let practiceScore = 0;
let finished = false;
let showLook = false;
let hoverCard = -1;
let chipRects = [];

// ---------- Controls ----------
let binButtons = [];
let nextButton, lookButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < BINS.length; i++) {
    const b = createButton((i + 1) + ' ' + BINS[i].name);
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('padding', '4px 0px');
    b.style('cursor', 'pointer');
    b.style('color', 'white');
    b.style('background-color', BINS[i].color);
    b.style('border', '1px solid ' + BINS[i].color);
    b.style('border-radius', '4px');
    b.attribute('title', BINS[i].name + ': ' + BINS[i].def);
    b.mousePressed(() => place(i));
    binButtons.push(b);
  }
  nextButton = createButton('Next card');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCard);

  lookButton = createButton('What to look for');
  lookButton.parent(document.querySelector('main'));
  lookButton.style('font-size', '14px');
  lookButton.mousePressed(() => { if (answered) showLook = !showLook; });

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(startPractice);

  positionControls();
  startSet();

  describe('A sorting activity about the palace of Knossos. Three bins sit side by side: Minoan original, Evans ' +
           'reconstruction, and Modern copy. One card at a time names a feature a visitor sees, such as the red ' +
           'columns at the North Entrance or the gypsum throne. The learner chooses a bin; feedback gives the reason, ' +
           'and the card joins its correct bin. The score counts first attempts out of ten.');
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / BINS.length;
  const narrow = canvasWidth < 560;
  for (let i = 0; i < binButtons.length; i++) {
    binButtons[i].html((i + 1) + ' ' + (narrow ? BINS[i].short : BINS[i].name));
    binButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    binButtons[i].size(colW - 6, 30);
  }
  nextButton.position(margin, drawHeight + 46);
  lookButton.position(margin + 92, drawHeight + 46);
  againButton.position(margin + 228, drawHeight + 46);
}

function startSet() {
  current = 0;
  answered = false;
  chosen = -1;
  finished = false;
  showLook = false;
  hoverCard = -1;
  if (practice) { practiceResults = {}; practiceScore = 0; }
  else { results = {}; score = 0; }
  updateButtonStates();
}

function startPractice() {
  if (!finished && !practice) return;   // the scored pass must be finished first
  practice = true;
  startSet();
}

function place(k) {
  if (answered || finished) return;
  chosen = k;
  answered = true;
  const correct = (k === CARDS[current].bin);
  if (practice) {
    if (correct) practiceScore++;
    practiceResults[current] = { chosen: k, correct: correct };
  } else {
    if (correct) score++;
    results[current] = { chosen: k, correct: correct };
  }
  updateButtonStates();
}

function nextCard() {
  if (!answered || finished) return;
  showLook = false;
  if (current < CARDS.length - 1) {
    current++;
    answered = false;
    chosen = -1;
  } else {
    finished = true;
  }
  updateButtonStates();
}

function activeResults() { return practice ? practiceResults : results; }

function keyPressed() {
  if (key.length === 1 && key >= '1' && key <= '3') place(int(key) - 1);
  else if (key === 'Enter') nextCard();
}

function updateButtonStates() {
  for (const b of binButtons) {
    if (answered || finished) { b.attribute('disabled', ''); b.style('opacity', '0.55'); }
    else { b.removeAttribute('disabled'); b.style('opacity', '1'); }
  }
  if (answered && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < CARDS.length - 1 ? 'Next card' : 'See result');
  if (answered && !finished) lookButton.removeAttribute('disabled');
  else lookButton.attribute('disabled', '');
  if (finished || practice) againButton.removeAttribute('disabled');
  else againButton.attribute('disabled', '');
}

function draw() {
  stroke('silver');
  strokeWeight(1);
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const narrow = canvasWidth < 560;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(narrow ? 17 : 22);
  text(narrow ? 'Minoan, Evans, or Copy?' : 'Knossos: Minoan, Evans, or Copy?', margin, 10);
  textStyle(NORMAL);
  textSize(narrow ? 13 : 16);
  textAlign(RIGHT, TOP);
  const answeredCount = Object.keys(results).length;
  text('Correct: ' + score + ' of ' + (practice ? 10 : answeredCount), canvasWidth - margin, 14);
  if (practice) {
    textSize(12);
    fill('dimgray');
    text('Practice: ' + practiceScore + ' of ' + Object.keys(practiceResults).length, canvasWidth - margin, 32);
  }

  // The question, shown throughout
  textSize(narrow ? 13 : 15);
  textStyle(BOLD);
  const qLines = wrapLines(QUESTION, canvasWidth - 2 * margin - 20);
  const qH = qLines.length * 18 + 10;
  stroke('#d9c27a');
  fill('#fff8dc');
  rect(margin, 46, canvasWidth - 2 * margin, qH, 6);
  noStroke();
  fill('#5a4a10');
  textAlign(LEFT, TOP);
  for (let i = 0; i < qLines.length; i++) text(qLines[i], margin + 10, 51 + i * 18);
  textStyle(NORMAL);

  const panelTop = 46 + qH + 8;
  const binsTop = drawHeight - binsHeight() - 10;
  drawPanel(margin, panelTop, canvasWidth - 2 * margin, binsTop - panelTop - 8);
  drawBins(binsTop);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = practice ? 'Practice done. Try Again repeats it.' : 'Done. Hover over a card to review it.';
  else if (answered) status = 'Press ' + (current < CARDS.length - 1 ? 'Next card' : 'See result') + ' (or Enter).';
  else status = practice ? 'Practice round: not scored.' : 'Choose a bin (or press 1 to 3).';
  const sx = margin + 320;
  if (canvasWidth - sx - margin > 120) text(fitText(status, canvasWidth - sx - margin), sx, drawHeight + 60);
}

// Bin geometry: the definitions set where the chips start; four chips fit below
function binGeom() {
  const narrow = canvasWidth < 560;
  const gap = 8;
  const colW = (canvasWidth - 2 * margin - (BINS.length - 1) * gap) / BINS.length;
  textSize(narrow ? 10 : 12);
  textStyle(ITALIC);
  let maxLines = 1;
  for (const B of BINS) maxLines = Math.max(maxLines, wrapLines(B.def, colW - 12).length);
  textStyle(NORMAL);
  const defLH = narrow ? 12 : 15;
  const chipH = 26, cg = 4;
  const chipOff = 29 + maxLines * defLH + 6;
  return { gap: gap, colW: colW, defLH: defLH, chipH: chipH, cg: cg, chipOff: chipOff,
           h: chipOff + 4 * (chipH + cg) + 4 };
}

function binsHeight() { return binGeom().h; }

function drawPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  const pad = 14;
  const tw = w - 2 * pad;
  let yy = y + 10;
  const narrow = canvasWidth < 560;

  if (finished) {
    if (hoverCard >= 0) { drawCardDetails(hoverCard, x + pad, yy, tw, true); return; }
    textStyle(BOLD);
    textSize(narrow ? 14 : 17);
    fill('black');
    const res = practice ? practiceScore : score;
    yy = drawWrapped((practice ? 'Practice round: ' : 'All ten sorted: ') + res + ' of 10 correct' +
                     (practice ? ' (your scored result stays ' + score + ' of 10).' : ' on the first attempt.'),
                     x + pad, yy, tw, narrow ? 17 : 21);
    const pass = score >= MASTERY;
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(narrow ? 13 : 15);
    yy = drawWrapped(pass ? 'You can read Knossos in layers: Minoan bones, Evans’s body, and copies for skin.'
                          : 'Look again at the cards you missed: what is each one made of, and where is the original?',
                     x + pad, yy + 3, tw, narrow ? 16 : 19);
    textStyle(NORMAL);
    fill('black');
    textSize(narrow ? 12 : 14);
    yy = drawWrapped(narrow
      ? 'Bins: Minoan 4, Evans 3, Copy 3. The plan, throne, jars, and drains are Minoan; much of the height ' +
        'and color is the 20th century’s.'
      : 'The bins hold Minoan original 4, Evans reconstruction 3, Modern copy 3. The site is neither all ' +
        'original nor all fake: the plan, the throne, the jars, and the drains are Minoan; much of the ' +
        'height and color is the 20th century’s.', x + pad, yy + 4, tw, narrow ? 15 : 18);
    fill('dimgray');
    textStyle(ITALIC);
    textSize(narrow ? 12 : 13);
    drawWrapped(narrow ? 'Hover over a card to review it.' : 'Hover over a card in a bin to review it; red borders mark misses.',
                x + pad, yy + 3, tw, 17);
    textStyle(NORMAL);
    return;
  }
  drawCardDetails(current, x + pad, yy, tw, false);
}

function drawCardDetails(ci, x, y, tw, review) {
  const c = CARDS[ci];
  const r = activeResults()[ci];
  const shown = review || answered;
  const narrow = canvasWidth < 560;
  let yy = y;
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  text(review ? 'REVIEW' : (practice ? 'PRACTICE ' : '') + 'CARD ' + (ci + 1) + ' OF ' + CARDS.length, x, yy);
  yy += 18;
  fill('black');
  textSize(narrow ? 15 : 18);
  yy = drawWrapped(c.card, x, yy, tw, narrow ? 18 : 22) + 6;
  textStyle(NORMAL);

  if (!shown) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(narrow ? 13 : 15);
    drawWrapped('Think about its material and where the original is. Then choose a bin.', x, yy + 2, tw, 18);
    textStyle(NORMAL);
    return;
  }
  const B = BINS[c.bin];
  const lh = narrow ? 16 : 19;
  if (review) {
    textSize(narrow ? 12 : 14);
    fill('#444');
    yy = drawWrapped('Your choice: ' + BINS[r.chosen].name + '.', x, yy, tw, narrow ? 15 : 18) + 3;
  }
  textSize(narrow ? 13 : 15);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  const lead = r.correct ? 'Correct.' : 'This one is ' + B.name + '.';
  yy = drawLeadAndText(lead, c.why, x, yy, tw, lh);

  if (showLook || review) {
    textSize(narrow ? 12 : 14);
    textStyle(BOLD);
    fill('#5a4a10');
    drawLeadAndText('What to look for:', c.look, x, yy + 4, tw, narrow ? 15 : 18);
  }
}

// Bold lead in the current fill, then normal black text on the same line where it fits
function drawLeadAndText(lead, body, x, y, tw, lh) {
  const leadW = textWidth(lead) + 6;
  text(lead, x, y);
  textStyle(NORMAL);
  fill('black');
  const first = wrapLines(body, tw - leadW);
  text(first[0], x + leadW, y);
  const rest = body.slice(first[0].length).trim();
  if (rest) return drawWrapped(rest, x, y + lh, tw, lh);
  return y + lh;
}

// Three bins side by side, each with its definition and the cards placed in it
function drawBins(top) {
  const narrow = canvasWidth < 560;
  const G = binGeom();
  const gap = G.gap, colW = G.colW, h = G.h;
  chipRects = [];
  const res = activeResults();
  const upTo = finished ? CARDS.length - 1 : current;

  for (let i = 0; i < BINS.length; i++) {
    const B = BINS[i];
    const x = margin + i * (colW + gap);
    stroke(B.color);
    strokeWeight(1.5);
    fill(B.light);
    rect(x, top, colW, h, 6);
    noStroke();
    fill(B.color);
    rect(x, top, colW, 24, 6, 6, 0, 0);
    fill('white');
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(narrow ? 11 : 14);
    text(fitText((i + 1) + ' ' + (narrow ? B.short : B.name), colW - 34), x + 6, top + 12);

    // Count of cards placed
    const placed = [];
    for (let n = 0; n <= upTo; n++) if (res[n] && CARDS[n].bin === i) placed.push(n);
    textAlign(RIGHT, CENTER);
    text(placed.length, x + colW - 8, top + 12);
    textStyle(NORMAL);

    // Definition
    fill('#333');
    textAlign(LEFT, TOP);
    textSize(narrow ? 10 : 12);
    textStyle(ITALIC);
    drawWrapped(B.def, x + 6, top + 29, colW - 12, G.defLH);
    textStyle(NORMAL);

    // Chips
    const chipH = G.chipH, cg = G.cg;
    const chipTop = top + G.chipOff;
    for (let n = 0; n < placed.length; n++) {
      const ci = placed[n];
      const cx = x + 6, cy = chipTop + n * (chipH + cg);
      const isNew = (!finished && ci === current);
      stroke(res[ci].correct ? 'seagreen' : 'firebrick');
      strokeWeight(isNew || ci === hoverCard ? 3 : 2);
      fill(res[ci].correct ? 'honeydew' : 'mistyrose');
      rect(cx, cy, colW - 12, chipH, 5);
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(narrow ? 10 : 12);
      const lines = wrapLines(CARDS[ci].chip, colW - 20);
      if (lines.length === 1) text(lines[0], cx + (colW - 12) / 2, cy + chipH / 2);
      else {
        const dy = narrow ? 6 : 7;
        text(fitText(lines[0], colW - 20), cx + (colW - 12) / 2, cy + chipH / 2 - dy);
        text(fitText(lines.slice(1).join(' '), colW - 20), cx + (colW - 12) / 2, cy + chipH / 2 + dy);
      }
      chipRects.push({ ci: ci, x: cx, y: cy, w: colW - 12, h: chipH });
    }
  }

  // Outline the chosen and correct bins for the current card
  if (answered && !finished) {
    noFill();
    strokeWeight(3);
    const binX = k => margin + k * (colW + gap);
    if (chosen !== CARDS[current].bin) {
      stroke('firebrick');
      rect(binX(chosen) - 2, top - 2, colW + 4, h + 4, 7);
    }
    stroke('seagreen');
    rect(binX(CARDS[current].bin) - 2, top - 2, colW + 4, h + 4, 7);
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

function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (textWidth(test) > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
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
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
}
