// Agreed Fact or Position? - p5.js 2.x
// CANVAS_HEIGHT: 475
// Twelve statements about the Parthenon Marbles dispute, one at a time. The
// learner sorts each into one of three bins: an agreed fact (both sides accept
// it), the British Museum's position, or the Greek government's position.
// One scored attempt per card; after each answer the card joins its correct
// bin. The first round uses a fixed shuffled order; Try Again reshuffles.
// Mastery: 10 of 12, with cards 6 and 10 (facts one side relies on) correct.
// The sim describes both positions in paraphrase and takes neither side.

let canvasWidth = 700;
let drawHeight = 395;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const BINS = [
  { name: 'Agreed fact', button: '1  Agreed fact', mid: '1  Agreed fact', short: '1 Fact', color: '#4a5560',
    def: 'Something both sides accept as true.' },
  { name: "British Museum's position", button: "2  British Museum's position", mid: '2  British Museum', short: '2 Museum', color: '#6b4c9a',
    def: 'What the British Museum argues should be concluded or done.' },
  { name: "Greek government's position", button: "3  Greek government's position", mid: '3  Greek government', short: '3 Greece', color: '#2f6e8e',
    def: 'What the Greek government argues should be concluded or done.' }
];

// n: card number from the chapter's specification; bin: index into BINS
const CARDS = [
  { n: 1, bin: 0, label: 'Removed 1801–1812',
    text: "Between 1801 and 1812, Lord Elgin's agents removed sculptures from the Parthenon and shipped them to Britain.",
    why: 'Neither side disputes what was removed or when.' },
  { n: 2, bin: 0, label: 'Athens under Ottoman rule',
    text: 'Athens was part of the Ottoman Empire when the sculptures were removed.',
    why: 'This is the shared starting point of both arguments.' },
  { n: 3, bin: 0, label: 'Bought by Britain, 1816',
    text: 'In 1816 the British government bought the collection and gave it to the British Museum.',
    why: 'The purchase is documented and undisputed.' },
  { n: 4, bin: 1, label: 'The acquisition was legal',
    text: 'Elgin acted with the permission of the Ottoman authorities who governed Athens, so the acquisition was legal.',
    why: "This is the Museum's reading of the facts." },
  { n: 5, bin: 2, label: 'The permission did not cover it',
    text: 'The permission Elgin had did not cover sawing sculpture off the building, and it was given by a foreign occupier.',
    why: "This is Greece's reading of the same facts." },
  { n: 6, bin: 0, label: 'Original permit lost', trap: true,
    text: 'The original Ottoman permission document has never been found; an Italian translation survives.',
    why: 'Both sides accept it; they disagree about what the translation proves.' },
  { n: 7, bin: 2, label: 'Reunite them in Athens',
    text: 'The sculptures are parts of one monument and should be reunited in Athens within sight of the building.',
    why: 'It is an argument about where they belong.' },
  { n: 8, bin: 1, label: 'Best seen in a world museum',
    text: 'The sculptures are best seen in London, free of charge, beside the art of cultures from around the world.',
    why: "It is the Museum's argument for keeping them where they are." },
  { n: 9, bin: 0, label: 'Acropolis Museum, 2009',
    text: 'The Acropolis Museum opened in 2009 with a gallery for the frieze that shows the London pieces as plaster casts.',
    why: 'The museum and its gallery exist; what they should hold is the dispute.' },
  { n: 10, bin: 0, label: 'British Museum Act, 1963', trap: true,
    text: "A British law of 1963 restricts the Museum's trustees from permanently giving away objects in its collection.",
    why: 'The law exists; the Museum cites it most, but Greece does not deny it.' },
  { n: 11, bin: 1, label: 'Would lend them, as owner',
    text: 'The Museum would consider lending the sculptures to Athens, as their owner.',
    why: 'A loan assumes the Museum owns them.' },
  { n: 12, bin: 2, label: 'Will not borrow them',
    text: 'Greece does not accept that the British Museum owns the sculptures, so it will not borrow them.',
    why: 'It rejects the ownership a loan would imply.' }
];
// The order every learner sees first (card numbers); Try Again reshuffles.
const FIRST_ORDER = [2, 4, 9, 7, 1, 11, 6, 5, 3, 8, 12, 10];
const MASTERY = 10;
const TRAPS = [6, 10];
const QUESTION = 'Is this something both sides agree on? If not, whose position is it?';

// ---------- State ----------
let order = [];        // order[pos] = index into CARDS
let current = 0;
let answered = false;
let results = {};      // by card index: { chosen, correct, pos }
let score = 0;
let finished = false;
let reviewIdx = -1;    // card index shown in the panel on the result screen
let chipRects = [];

// ---------- Controls ----------
let binButtons = [];
let nextButton, againButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < BINS.length; i++) {
    const b = createButton(BINS[i].button);
    b.parent(document.querySelector('main'));
    b.style('font-size', '14px');
    b.style('padding', '4px 0px');
    b.style('cursor', 'pointer');
    b.style('color', 'white');
    b.style('background-color', BINS[i].color);
    b.style('border', '1px solid ' + BINS[i].color);
    b.style('border-radius', '4px');
    b.attribute('title', BINS[i].name + ': ' + BINS[i].def + ' (key ' + (i + 1) + ')');
    b.mousePressed(() => sortCard(i));
    binButtons.push(b);
  }
  nextButton = createButton('Next card');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCard);

  againButton = createButton('Try Again');
  againButton.parent(document.querySelector('main'));
  againButton.style('font-size', '14px');
  againButton.mousePressed(() => startSet(true));

  positionControls();
  startSet(false);

  describe('A sorting activity about the Parthenon Marbles dispute. Three bins are defined: agreed fact, the British ' +
           "Museum's position, and the Greek government's position. One statement at a time is shown, and the learner " +
           'chooses a bin. Feedback gives the reason and the statement joins its correct bin as a short label. ' +
           'After twelve statements the three bins are shown side by side with six facts and three positions for each side.');
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / BINS.length;
  for (let i = 0; i < binButtons.length; i++) {
    binButtons[i].html(canvasWidth < 480 ? BINS[i].short : canvasWidth < 660 ? BINS[i].mid : BINS[i].button);
    binButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    binButtons[i].size(colW - 6, 30);
  }
  nextButton.position(margin, drawHeight + 46);
  againButton.position(margin + 120, drawHeight + 46);
}

function startSet(shuffle) {
  order = FIRST_ORDER.map(n => n - 1);
  if (shuffle) {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  }
  current = 0;
  answered = false;
  results = {};
  score = 0;
  finished = false;
  reviewIdx = -1;
  updateButtonStates();
}

function sortCard(k) {
  if (answered || finished) return;
  const ci = order[current];
  answered = true;
  const correct = (k === CARDS[ci].bin);
  if (correct) score++;
  results[ci] = { chosen: k, correct: correct, pos: current };
  updateButtonStates();
}

function nextCard() {
  if (!answered || finished) return;
  if (current < order.length - 1) {
    current++;
    answered = false;
  } else {
    finished = true;
    reviewIdx = -1;
  }
  updateButtonStates();
}

function keyPressed() {
  if (key.length === 1 && key >= '1' && key <= '3') sortCard(int(key) - 1);
  else if (key === 'Enter') nextCard();
}

function mousePressed() {
  for (const r of chipRects) {
    if (mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) {
      if (finished) reviewIdx = (reviewIdx === r.ci) ? -1 : r.ci;
    }
  }
}

function updateButtonStates() {
  for (const b of binButtons) {
    if (answered || finished) { b.attribute('disabled', ''); b.style('opacity', '0.55'); b.style('cursor', 'default'); }
    else { b.removeAttribute('disabled'); b.style('opacity', '1'); b.style('cursor', 'pointer'); }
  }
  if (answered && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < order.length - 1 ? 'Next card' : 'See the bins');
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
  textSize(narrow ? 18 : 22);
  text('Agreed Fact or Position?', margin, 10);
  textStyle(NORMAL);
  textSize(15);
  textAlign(RIGHT, TOP);
  const nDone = Object.keys(results).length;
  text('Correct: ' + score + ' of ' + nDone, canvasWidth - margin, 14);

  const binsBottom = drawBins(42);
  drawPanel(margin, binsBottom + 8, canvasWidth - 2 * margin, drawHeight - binsBottom - 16);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(13);
  let status;
  if (finished) status = 'Click a label in a bin to read the statement again.';
  else if (answered) status = 'Press ' + (current < order.length - 1 ? 'Next card' : 'See the bins') + ' (or Enter).';
  else status = 'Choose a bin (or press 1, 2 or 3). Card ' + (current + 1) + ' of ' + CARDS.length + '.';
  text(fitText(status, canvasWidth - margin - 236), margin + 226, drawHeight + 61);
}

// The three bins, each with its definition and the cards placed in it so far.
// Returns the y of their bottom edge.
function drawBins(top) {
  const gap = 8;
  const binW = (canvasWidth - 2 * margin - 2 * gap) / 3;
  const narrow = canvasWidth < 600;
  const headH = 24, lineH = 14, chipH = 19;
  textSize(12);
  const defLines = BINS.map(b => wrapLines(b.def, binW - 12));
  const maxLines = Math.min(4, Math.max(...defLines.map(d => d.length)));
  const chipsTop = headH + 5 + maxLines * lineH + 5;
  const binH = chipsTop + 6 * (chipH + 3) + 4;

  chipRects = [];
  const ciNow = (!finished && answered) ? order[current] : -1;
  for (let i = 0; i < BINS.length; i++) {
    const x = margin + i * (binW + gap);
    const y = top;
    stroke('silver');
    strokeWeight(1);
    fill('white');
    rect(x, y, binW, binH, 6);
    noStroke();
    fill(BINS[i].color);
    rect(x, y, binW, headH, 6, 6, 0, 0);
    fill('white');
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(canvasWidth < 660 ? 12 : 14);
    text(fitText(BINS[i].name, binW - 12), x + 6, y + headH / 2 + 1);
    textStyle(NORMAL);
    textSize(12);
    fill('#333');
    textAlign(LEFT, TOP);
    for (let j = 0; j < Math.min(maxLines, defLines[i].length); j++) text(defLines[i][j], x + 6, y + headH + 5 + j * lineH);

    // Cards already sorted, in the order they were answered
    const placed = Object.keys(results).map(Number)
      .filter(ci => CARDS[ci].bin === i)
      .sort((a, b) => results[a].pos - results[b].pos);
    let cy = y + chipsTop;
    stroke('gainsboro');
    line(x + 6, cy - 3, x + binW - 6, cy - 3);
    for (const ci of placed) {
      const r = results[ci];
      const isNow = ci === ciNow || ci === reviewIdx;
      stroke(r.correct ? 'seagreen' : 'firebrick');
      strokeWeight(isNow ? 2.5 : 1.2);
      if (!r.correct) drawingContext.setLineDash([4, 3]);
      fill(isNow ? '#fff4d6' : (r.correct ? 'honeydew' : 'mistyrose'));
      rect(x + 5, cy, binW - 10, chipH, 4);
      drawingContext.setLineDash([]);
      noStroke();
      fill('black');
      textSize(narrow ? 11 : 12);
      textAlign(LEFT, CENTER);
      text(fitText(CARDS[ci].label, binW - 22), x + 10, cy + chipH / 2 + 1);
      chipRects.push({ ci: ci, x: x + 5, y: cy, w: binW - 10, h: chipH });
      cy += chipH + 3;
    }
    // Before the first answer, show what the bin is waiting for
    if (!placed.length) {
      fill('#9aa5ad');
      textStyle(ITALIC);
      textSize(12);
      textAlign(CENTER, TOP);
      text('empty', x + binW / 2, y + chipsTop + 6);
      textStyle(NORMAL);
    }
    strokeWeight(1);
    // Highlight the correct bin and a wrong choice after an answer
    if (ciNow >= 0) {
      const right = i === CARDS[ciNow].bin;
      const wrong = i === results[ciNow].chosen && !right;
      if (right || wrong) {
        noFill();
        strokeWeight(3);
        stroke(right ? 'seagreen' : 'firebrick');
        rect(x + 1.5, y + 1.5, binW - 3, binH - 3, 6);
        strokeWeight(1);
      }
    }
  }
  let over = false;
  for (const r of chipRects) {
    if (finished && mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h) over = true;
  }
  cursor(over ? HAND : ARROW);
  noStroke();
  return top + binH;
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
    textStyle(BOLD);
    textSize(17);
    fill('black');
    yy = drawWrapped('You sorted ' + score + ' of 12 correctly on the first attempt.', x + pad, yy, tw, 21);
    const traps = TRAPS.every(n => results[n - 1].correct);
    const pass = score >= MASTERY && traps;
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(14);
    yy = drawWrapped(pass ? 'You can separate the facts of a contested story from the arguments built on them.'
                          : 'Look again at the document and the 1963 law: are they arguments, or facts that both sides accept?',
                     x + pad, yy + 2, tw, 18);
    textStyle(NORMAL);
    fill('black');
    textSize(13);
    drawWrapped('Half the statements are agreed facts; each side builds its position from the same facts. ' +
                'The sim describes both positions in paraphrase and takes neither side. Click a label in a bin to read its statement.',
                x + pad, yy + 4, tw, 17);
    return;
  }

  const ci = finished ? reviewIdx : order[current];
  const c = CARDS[ci];
  const r = results[ci];
  fill('dimgray');
  textSize(12);
  textStyle(BOLD);
  const pos = r ? r.pos : current;
  text((finished ? 'REVIEW: ' : '') + 'CARD ' + (pos + 1) + ' OF ' + CARDS.length, x + pad, yy);
  yy += 17;
  fill('black');
  textSize(narrow ? 15 : 17);
  textStyle(NORMAL);
  yy = drawWrapped(c.text, x + pad, yy, tw, narrow ? 19 : 22) + 5;

  if (!r) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(15);
    drawWrapped(QUESTION, x + pad, yy, tw, 19);
    textStyle(NORMAL);
    return;
  }
  const B = BINS[c.bin];
  textSize(14);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  let head = r.correct ? 'Correct.' : 'This one is ' + (c.bin === 0 ? 'an agreed fact:' : 'the ' + B.name + ':');
  if (finished && !r.correct) head = 'This one is ' + (c.bin === 0 ? 'an agreed fact' : 'the ' + B.name) +
    '. (You chose ' + (r.chosen === 0 ? 'agreed fact' : 'the ' + BINS[r.chosen].name) + '.)';
  // head and reason run together on one wrapped paragraph
  const headW = textWidth(head) + 5;
  text(head, x + pad, yy);
  textStyle(NORMAL);
  fill('black');
  const firstLineW = tw - headW;
  const words = c.why.split(' ');
  let line1 = '';
  while (words.length && textWidth((line1 ? line1 + ' ' : '') + words[0]) <= firstLineW) line1 += (line1 ? ' ' : '') + words.shift();
  text(line1, x + pad + headW, yy);
  if (words.length) drawWrapped(words.join(' '), x + pad, yy + 18, tw, 18);
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
