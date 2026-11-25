// Sort the Scripts - p5.js 2.x
// CANVAS_HEIGHT: 560
// The learner reads one script card at a time (what one sign stands for and
// how many signs there are) and sorts it into one of four bins: logographic,
// syllabary, abjad or alphabet. Feedback appears at once and the card settles
// into its correct bin. At the end every card shows its sign count.

let canvasWidth = 700;
let drawHeight = 480;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const KINDS = [
  { name: "Logographic", article: "a logographic script", def: "Most signs stand for words or parts of words", band: "hundreds or more signs", color: "#6E3F8F" },
  { name: "Syllabary",   article: "a syllabary",          def: "Each sign stands for a syllable",               band: "about 40 to 100 signs", color: "#B07030" },
  { name: "Abjad",       article: "an abjad",             def: "Each sign stands for a consonant; most vowels are left to the reader", band: "under 40 signs", color: "#2F7D4A" },
  { name: "Alphabet",    article: "an alphabet",          def: "Signs for vowels and consonants alike",          band: "under 40 signs", color: "#2E6E9E" }
];

// kind is an index into KINDS; count is used to sort the bins at the end
const CARDS = [
  { chip: "Egyptian hieroglyphs", countLabel: "~900", count: 900, kind: 0,
    text: "Egyptian hieroglyphs: about 900 signs in the classical period; most stand for words or ideas, and some stand for one or more consonant sounds.",
    why: "A few sound-signs do not make an alphabet; with hundreds of signs mostly standing for words, it is logographic." },
  { chip: "Chinese characters", countLabel: "3,000–4,000", count: 3500, kind: 0,
    text: "Chinese characters: a literate reader knows about 3,000 to 4,000; each usually stands for a syllable that is also a word or part of a word.",
    why: "Thousands of signs, each tied to a meaning, mark a logographic script." },
  { chip: "Linear A", countLabel: "~90", count: 90, kind: 1,
    text: "Linear A (Minoan Crete, undeciphered): about 90 signs, many shared with Linear B.",
    why: "We cannot read it, but about 90 signs fits a syllabary, and its signs match Linear B's syllable signs." },
  { chip: "Linear B", countLabel: "~90", count: 89, kind: 1,
    text: "Linear B (Mycenaean Greek): about 90 sound-signs, each a consonant plus a vowel, plus word-signs for goods.",
    why: "Each sound-sign stands for a whole syllable: Knossos is spelled ko-no-so." },
  { chip: "Japanese hiragana", countLabel: "46", count: 46, kind: 1,
    text: "Japanese hiragana: 46 basic signs, each a vowel, a consonant plus a vowel, or the final n.",
    why: "Each sign is a whole syllable: か is ka and み is mi." },
  { chip: "Cherokee", countLabel: "85", count: 85, kind: 1,
    text: "Cherokee: 85 signs, created by Sequoyah around 1821, each a syllable.",
    why: "Each of the 85 signs stands for a syllable." },
  { chip: "Phoenician", countLabel: "22", count: 22, kind: 2,
    text: "Phoenician: 22 letters, all for consonants.",
    why: "Only consonants are written; the reader supplies the vowels." },
  { chip: "Hebrew", countLabel: "22", count: 22, kind: 2,
    text: "Hebrew: 22 letters for consonants; vowel marks are optional and usually left out.",
    why: "Without the optional marks, vowels are left to the reader." },
  { chip: "Arabic (Ottoman)", countLabel: "28", count: 28, kind: 2,
    text: "Arabic, as used for Ottoman Turkish until 1928: 28 letters, with most short vowels not written.",
    why: "Most vowels are not written, which made it a poor fit for Turkish, a language with eight vowels." },
  { chip: "Greek", countLabel: "24", count: 24, kind: 3,
    text: "Greek: 24 letters, with separate letters for vowels, including alpha and omicron.",
    why: "Vowels and consonants each have their own letters." },
  { chip: "Latin (English)", countLabel: "26", count: 26, kind: 3,
    text: "Latin, as used for English: 26 letters for vowels and consonants.",
    why: "It came from Greek, through the Etruscans, and kept the vowel letters." },
  { chip: "Modern Turkish", countLabel: "29", count: 29, kind: 3,
    text: "Modern Turkish: 29 Latin letters, including ı, ö, ü, ç, ş and ğ.",
    why: "It writes all eight Turkish vowels with their own letters." }
];

// ---------- State ----------
let order = [];
let current = 0;
let answered = false;
let chosen = -1;
let results = {};
let score = 0;
let finished = false;
let hoverCard = -1;
let chipRects = [];

// ---------- Controls ----------
let kindButtons = [];
let nextButton, restartButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < KINDS.length; i++) {
    const b = createButton(KINDS[i].name);
    b.parent(document.querySelector('main'));
    b.style('font-size', '15px');
    b.style('padding', '4px 0px');
    b.style('cursor', 'pointer');
    b.attribute('title', KINDS[i].name + ': ' + KINDS[i].def);
    b.mousePressed(() => assign(i));
    kindButtons.push(b);
  }
  nextButton = createButton('Next card');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextCard);

  restartButton = createButton('Restart');
  restartButton.parent(document.querySelector('main'));
  restartButton.style('font-size', '14px');
  restartButton.mousePressed(restart);

  positionControls();
  restart();

  describe('A sorting activity. One card at a time describes a writing system: what one sign stands for and how many signs it has. ' +
           'The learner chooses one of four bins, logographic, syllabary, abjad or alphabet, and the card settles into its correct bin, ' +
           'with missed cards marked in red. At the end each card shows its sign count. A running score counts correct first attempts.');
}

function positionControls() {
  const colW = (canvasWidth - 2 * margin) / KINDS.length;
  for (let i = 0; i < kindButtons.length; i++) {
    kindButtons[i].position(margin + i * colW + 3, drawHeight + 8);
    kindButtons[i].size(colW - 6, 30);
  }
  nextButton.position(margin, drawHeight + 46);
  restartButton.position(margin + 100, drawHeight + 46);
}

function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function restart() {
  order = shuffleArray(CARDS.map((_, i) => i));
  current = 0;
  answered = false;
  chosen = -1;
  results = {};
  score = 0;
  finished = false;
  hoverCard = -1;
  updateButtonStates();
}

function assign(k) {
  if (answered || finished) return;
  const ci = order[current];
  chosen = k;
  answered = true;
  const correct = (k === CARDS[ci].kind);
  if (correct) score++;
  results[ci] = { chosen: k, correct: correct };
  updateButtonStates();
}

function nextCard() {
  if (!answered || finished) return;
  if (current < order.length - 1) {
    current++;
    answered = false;
    chosen = -1;
  } else {
    finished = true;
  }
  updateButtonStates();
}

function keyPressed() {
  if (key === '1' || key === '2' || key === '3' || key === '4') assign(int(key) - 1);
  else if (key === 'Enter') nextCard();
}

function updateButtonStates() {
  for (const b of kindButtons) {
    if (answered || finished) b.attribute('disabled', '');
    else b.removeAttribute('disabled');
  }
  if (answered && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < order.length - 1 ? 'Next card' : 'See result');
}

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
  textSize(22);
  text('Sort the Scripts', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('Correct: ' + score + ' of ' + CARDS.length, canvasWidth - margin, 14);

  const binsTop = 214;
  drawBins(binsTop);
  drawPanel(margin, 44, canvasWidth - 2 * margin, 160);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = 'Done. Press Restart to reshuffle and try again.';
  else if (answered) status = 'Press ' + (current < order.length - 1 ? 'Next card' : 'See result') + ' to continue.';
  else status = 'Choose a bin (or press 1 to 4).';
  text(fitText(status, canvasWidth - margin - 200), margin + 190, drawHeight + 60);
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

  if (finished) {
    if (hoverCard >= 0) { drawCardDetails(hoverCard, x + pad, yy, tw, true); return; }
    textStyle(BOLD);
    textSize(18);
    fill('black');
    yy = drawWrapped('All 12 scripts sorted. You scored ' + score + ' of 12.', x + pad, yy, tw, 24);
    const pass = score >= 10;
    fill(pass ? 'darkgreen' : 'firebrick');
    textSize(16);
    yy = drawWrapped(pass ? '10 or more: you can tell scripts apart.'
                          : 'Fewer than 10: reread the four kinds of writing system and try again.', x + pad, yy + 2, tw, 21);
    textStyle(NORMAL);
    fill('black');
    textSize(15);
    yy = drawWrapped('Each card now shows its sign count, most to fewest. The counts fall into the rule-of-thumb bands ' +
                     'printed under each bin: hundreds or more, about 40 to 100, and under 40.',
                     x + pad, yy + 8, tw, 20);
    fill('dimgray');
    textStyle(ITALIC);
    textSize(14);
    drawWrapped('Hover over a card to review it; red borders mark misses.', x + pad, yy + 6, tw, 18);
    textStyle(NORMAL);
    return;
  }
  drawCardDetails(order[current], x + pad, yy, tw, false);
}

function drawCardDetails(ci, x, y, tw, review) {
  const c = CARDS[ci];
  let yy = y;
  fill('dimgray');
  textSize(13);
  textStyle(BOLD);
  text(review ? 'REVIEW' : 'CARD ' + (current + 1) + ' OF ' + CARDS.length, x, yy);
  yy += 20;
  fill('black');
  textSize(17);
  textStyle(NORMAL);
  yy = drawWrapped(c.text, x, yy, tw, 22);
  yy += 6;

  const r = results[ci];
  if (!review && !answered) {
    fill('dimgray');
    textStyle(ITALIC);
    textSize(16);
    text('What does one sign stand for in this script?', x, yy);
    textStyle(NORMAL);
    return;
  }
  const head = r.correct ? 'Correct: ' + KINDS[c.kind].name.toLowerCase() + '.'
                         : 'Not quite: this is ' + KINDS[c.kind].article + '.';
  textSize(15);
  textStyle(BOLD);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  text(head, x, yy);
  const headW = textWidth(head) + 6;
  textStyle(NORMAL);
  fill('black');
  const words = c.why.split(' ');
  let first = '';
  while (words.length && textWidth((first ? first + ' ' : '') + words[0]) <= tw - headW) {
    first = (first ? first + ' ' : '') + words.shift();
  }
  text(first, x + headW, yy);
  if (words.length) drawWrapped(words.join(' '), x, yy + 20, tw, 20);
}

function drawBins(top) {
  const colW = (canvasWidth - 2 * margin) / KINDS.length;
  textSize(colW < 150 ? 11 : 13);
  const defLines = KINDS.map(k => wrapLines(k.def, colW - 12));
  const defLH = colW < 150 ? 13 : 15;
  const headH = 26 + Math.max(...defLines.map(d => d.length)) * defLH + 6;
  const bandH = finished ? 22 : 0;
  const areaH = drawHeight - top - headH - bandH - 8;
  chipRects = [];
  const curCi = finished ? -1 : order[current];

  for (let i = 0; i < KINDS.length; i++) {
    const k = KINDS[i];
    const x = margin + i * colW;
    stroke('silver');
    strokeWeight(1);
    fill(i % 2 === 0 ? 'white' : 'ghostwhite');
    rect(x, top + headH, colW, areaH + bandH);
    noStroke();
    fill(k.color);
    rect(x, top, colW, headH);
    fill('white');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(colW < 150 ? 14 : 16);
    text(k.name, x + colW / 2, top + 5);
    textStyle(NORMAL);
    textSize(colW < 150 ? 11 : 13);
    for (let j = 0; j < defLines[i].length; j++) text(defLines[i][j], x + colW / 2, top + 26 + j * defLH);

    // Placed cards in their correct bins; sorted by sign count at the end.
    let placed = [];
    for (let n = 0; n <= current && n < order.length; n++) {
      const ci = order[n];
      if (results[ci] && CARDS[ci].kind === i) placed.push(ci);
    }
    if (finished) placed.sort((a, b) => CARDS[b].count - CARDS[a].count);
    const chipH = 32, gap = 4;
    for (let n = 0; n < placed.length; n++) {
      const ci = placed[n];
      const cx = x + 5, cy = top + headH + 6 + n * (chipH + gap), cw = colW - 10;
      const isNew = (ci === curCi);
      stroke(results[ci].correct ? 'seagreen' : 'firebrick');
      strokeWeight(isNew || ci === hoverCard ? 3 : 2);
      fill(results[ci].correct ? 'honeydew' : 'mistyrose');
      rect(cx, cy, cw, chipH, 5);
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(colW < 150 ? 12 : 14);
      const label = finished ? CARDS[ci].chip + ' · ' + CARDS[ci].countLabel : CARDS[ci].chip;
      let lines = wrapLines(label, cw - 8);
      if (lines.length > 2) lines = [fitText(CARDS[ci].chip, cw - 8), CARDS[ci].countLabel];
      if (lines.length === 1) text(lines[0], cx + cw / 2, cy + chipH / 2);
      else {
        textSize(colW < 150 ? 11 : 12);
        text(lines[0], cx + cw / 2, cy + chipH / 2 - 7);
        text(lines[1], cx + cw / 2, cy + chipH / 2 + 7);
      }
      chipRects.push({ ci: ci, x: cx, y: cy, w: cw, h: chipH });
    }

    if (finished) {
      noStroke();
      fill('dimgray');
      textAlign(CENTER, CENTER);
      textStyle(ITALIC);
      textSize(colW < 150 ? 11 : 13);
      text(fitText(k.band, colW - 8), x + colW / 2, top + headH + areaH + bandH / 2);
      textStyle(NORMAL);
    }
  }

  if (answered && !finished) {
    const ci = order[current];
    noFill();
    strokeWeight(3);
    if (chosen !== CARDS[ci].kind) {
      stroke('firebrick');
      rect(margin + chosen * colW + 1.5, top + 1.5, colW - 3, headH + areaH - 3);
    }
    stroke('seagreen');
    rect(margin + CARDS[ci].kind * colW + 1.5, top + 1.5, colW - 3, headH + areaH - 3);
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

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
}
