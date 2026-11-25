// Thoughtful Traveler Choices - p5.js 2.x
// CANVAS_HEIGHT: 590
// Eight situations from our route, each with three responses. The learner
// judges which response best fits the six thoughtful-traveler principles,
// commits with the A, B or C button, and sees the best response and the
// principle that decides it. A summary at the end counts the principles.

let canvasWidth = 700;
let drawHeight = 540;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

const PRINCIPLES = [
  { name: "Curiosity",    gist: "ask and look closer" },
  { name: "Humility",     gist: "we are guests" },
  { name: "Consent",      gist: "people and sacred places are not scenery" },
  { name: "Reciprocity",  gist: "fair exchange, no false promises" },
  { name: "Patience",     gist: "fit the place's rhythm" },
  { name: "Many stories", gist: "listen to more than one account" }
];

// best is 0, 1 or 2 (A, B, C); principle is an index into PRINCIPLES
const SITUATIONS = [
  { label: "Simit seller photo",
    text: "Day 1, Istanbul. A woman selling simit (sesame bread rings) from a red cart would make a perfect photo.",
    responses: [
      "Take a quick photo from across the street so you do not bother her.",
      "Buy a simit, smile, raise the camera with a questioning look, and accept a shake of the head.",
      "Photograph only the cart, but frame her at the edge of the shot."],
    best: 1, principle: 2,
    why: "A person is not scenery; asking, and accepting a no, treats her as someone at work rather than part of the view." },
  { label: "Mosque at the call to prayer",
    text: "Day 3, Istanbul. You reach a mosque just as the call to prayer begins.",
    responses: [
      "Slip in quietly at the back to watch the prayer.",
      "Go in, but keep the camera down.",
      "Wait outside or visit somewhere nearby, and come back after the prayer ends."],
    best: 2, principle: 2,
    why: "During prayer the mosque is doing its first job, worship; visitors return when it reopens to them." },
  { label: "Gallipoli guide's account",
    text: "Day 6, Gallipoli. The Turkish guide's account of the battle differs from an Australian film you have seen.",
    responses: [
      "Listen, then ask what the battle means to the guide's own family.",
      "Politely point out what the film said.",
      "Tune out, since you already know the story."],
    best: 0, principle: 5,
    why: "The guide is telling the story as Turks remember it; asking about family turns a script into a conversation." },
  { label: "Short November menu",
    text: "Day 8, Rhodes. In November the taverna's menu is short and the kitchen closes early.",
    responses: [
      "Ask for the full summer menu anyway.",
      "Leave and post a review about the limited menu.",
      "Ask what is good today and what is in season."],
    best: 2, principle: 4,
    why: "Off-season staff and supplies are cut back; asking what is fresh gets the best meal and respects a hard season." },
  { label: "Carpet seller's tea",
    text: "Day 4, Istanbul. A carpet seller invites you in for tea, and you know you will not buy.",
    responses: [
      "Accept the tea, enjoy the talk, and say kindly and clearly that you are not buying today.",
      "Refuse firmly, because tea is a sales trick.",
      "Accept, and promise to come back later even though you will not."],
    best: 0, principle: 3,
    why: "Hospitality is real even in trade; an honest no respects his time more than a false promise." },
  { label: "No English menu",
    text: "Day 11, Athens. The café has no English menu and the waiter speaks little English.",
    responses: [
      "Speak English slowly and loudly.",
      "Say kaliméra (“good morning”), then point, smile, or use a phone translation.",
      "Leave for a café with an English menu."],
    best: 1, principle: 1,
    why: "A greeting in the local language shows we know we are the guests; the rest can be worked out together." },
  { label: "Cabin steward far from home",
    text: "On the ship. Your cabin steward mentions this is the eighth month away from home.",
    responses: [
      "Keep it brief and polite, because the steward is working.",
      "Leave a larger tip at the end instead of talking.",
      "Ask about their family, learn their name, and use it."],
    best: 2, principle: 0,
    why: "The crew are travelers too, far from home for months; a name and a question say we see them as people, not service." },
  { label: "Grand Bazaar closed on Sunday",
    text: "Day 5, Istanbul. You arrive at the Grand Bazaar on Sunday and find it closed.",
    responses: [
      "Complain that a tourist site should not close.",
      "Accept it as the merchants' day off, and plan the bazaar for an open day.",
      "Ask the hotel to find a way in."],
    best: 1, principle: 4,
    why: "The bazaar is a working market whose people need a day off; the closure is in the guide, so the fix is planning." }
];

const LETTERS = ["A", "B", "C"];

// ---------- State ----------
let current = 0;
let answered = false;
let chosen = -1;
let results = [];   // per situation: { chosen, correct }
let score = 0;
let finished = false;

// ---------- Controls ----------
let choiceButtons = [];
let nextButton, restartButton;
let lastButtonYs = "";

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < 3; i++) {
    const b = createButton(LETTERS[i]);
    b.parent(document.querySelector('main'));
    b.style('font-size', '18px');
    b.style('font-weight', 'bold');
    b.style('cursor', 'pointer');
    b.attribute('title', 'Choose response ' + LETTERS[i]);
    b.mousePressed(() => choose(i));
    choiceButtons.push(b);
  }
  nextButton = createButton('Next situation');
  nextButton.parent(document.querySelector('main'));
  nextButton.style('font-size', '14px');
  nextButton.mousePressed(nextSituation);

  restartButton = createButton('Restart');
  restartButton.parent(document.querySelector('main'));
  restartButton.style('font-size', '14px');
  restartButton.mousePressed(restart);

  positionControls();
  restart();

  describe('A judgment activity with eight travel situations from a trip to Istanbul, the Turkish coast, Rhodes and Athens. ' +
           'Each situation offers three responses, A, B and C. The learner chooses one with a button, and the best response ' +
           'is marked in green with the thoughtful-traveler principle that decides it. The six principles are listed at the top. ' +
           'A running score counts best choices, and a summary at the end lists each situation and its principle.');
}

function positionControls() {
  nextButton.position(margin, drawHeight + 12);
  restartButton.position(margin + 130, drawHeight + 12);
}

function restart() {
  current = 0;
  answered = false;
  chosen = -1;
  results = [];
  score = 0;
  finished = false;
  updateButtonStates();
}

function choose(i) {
  if (answered || finished) return;
  chosen = i;
  answered = true;
  const correct = (i === SITUATIONS[current].best);
  if (correct) score++;
  results[current] = { chosen: i, correct: correct };
  updateButtonStates();
}

function nextSituation() {
  if (!answered || finished) return;
  if (current < SITUATIONS.length - 1) {
    current++;
    answered = false;
    chosen = -1;
  } else {
    finished = true;
  }
  updateButtonStates();
}

function keyPressed() {
  const k = (key || '').toLowerCase();
  if (k === 'a' || k === 'b' || k === 'c') choose(LETTERS.indexOf(k.toUpperCase()));
  else if (key === 'Enter') nextSituation();
}

function updateButtonStates() {
  for (const b of choiceButtons) {
    if (finished) b.hide(); else b.show();
    if (answered || finished) b.attribute('disabled', '');
    else b.removeAttribute('disabled');
  }
  if (answered && !finished) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < SITUATIONS.length - 1 ? 'Next situation' : 'See summary');
  lastButtonYs = "";
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
  text('Thoughtful Traveler Choices', margin, 10);
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, TOP);
  text('Best choices: ' + score + ' of ' + SITUATIONS.length, canvasWidth - margin, 14);

  const decided = (answered && !finished) ? SITUATIONS[current].principle : -1;
  const pBottom = drawPrinciples(44, decided);

  if (finished) drawSummary(pBottom + 10);
  else drawSituation(pBottom + 10);

  // Control-region status
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(14);
  let status;
  if (finished) status = 'Done. Press Restart to try all eight again.';
  else if (answered) status = 'Press ' + (current < SITUATIONS.length - 1 ? 'Next situation' : 'See summary') + ' (or Enter) to continue.';
  else status = 'Choose A, B or C (buttons or keys).';
  text(fitText(status, canvasWidth - margin - 220), margin + 220, drawHeight + 25);
}

// Six principle chips in a 3 x 2 grid. Returns the y below the grid.
function drawPrinciples(top, highlight) {
  const cols = 3;
  const gap = 6;
  const chipW = (canvasWidth - 2 * margin - (cols - 1) * gap) / cols;
  textSize(13);
  const gists = PRINCIPLES.map(p => wrapLines(p.gist, chipW - 16));
  const maxLines = Math.max(...gists.map(g => g.length));
  const chipH = 24 + 16 * maxLines;
  for (let i = 0; i < PRINCIPLES.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const x = margin + c * (chipW + gap), y = top + r * (chipH + gap);
    const on = (i === highlight);
    stroke(on ? 'seagreen' : 'silver');
    strokeWeight(on ? 3 : 1);
    fill(on ? 'honeydew' : 'white');
    rect(x, y, chipW, chipH, 6);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(14);
    text((i + 1) + '. ' + PRINCIPLES[i].name, x + 8, y + 4);
    textStyle(NORMAL);
    textSize(13);
    fill('dimgray');
    for (let j = 0; j < gists[i].length; j++) text(gists[i][j], x + 8, y + 21 + j * 16);
  }
  return top + 2 * chipH + gap;
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

function drawSituation(top) {
  const s = SITUATIONS[current];
  const x = margin, w = canvasWidth - 2 * margin;
  let yy = top;

  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(13);
  text('SITUATION ' + (current + 1) + ' OF ' + SITUATIONS.length, x, yy);
  yy += 18;
  fill('black');
  textSize(17);
  yy = drawWrapped(s.text, x, yy, w, 22);
  textStyle(ITALIC);
  textSize(15);
  fill('dimgray');
  text(answered ? 'The best response is marked in green.' : 'Which response best fits a thoughtful traveler?', x, yy + 4);
  textStyle(NORMAL);
  yy += 28;

  // Response cards with the A/B/C buttons at their left edge
  const btnW = 42;
  const cardX = x + btnW + 8, cardW = w - btnW - 8;
  textSize(16);
  const ys = [];
  for (let i = 0; i < 3; i++) {
    const lines = wrapLines(s.responses[i], cardW - 20);
    const h = Math.max(42, lines.length * 20 + 14);
    let border = 'silver', bg = 'white', sw = 1;
    if (answered) {
      if (i === s.best) { border = 'seagreen'; bg = 'honeydew'; sw = 3; }
      else if (i === chosen) { border = 'firebrick'; bg = 'mistyrose'; sw = 3; }
      else { bg = 'whitesmoke'; }
    }
    stroke(border);
    strokeWeight(sw);
    fill(bg);
    rect(cardX, yy, cardW, h, 6);
    noStroke();
    fill(answered && i !== s.best && i !== chosen ? 'dimgray' : 'black');
    textAlign(LEFT, TOP);
    for (let j = 0; j < lines.length; j++) text(lines[j], cardX + 10, yy + 7 + (h - 14 - lines.length * 20) / 2 + j * 20);
    ys.push(yy + (h - 36) / 2);
    yy += h + 8;
  }
  // Reposition the buttons only when the layout changes.
  const key = ys.map(v => Math.round(v)).join(',') + '|' + x;
  if (key !== lastButtonYs) {
    for (let i = 0; i < 3; i++) {
      choiceButtons[i].position(x, ys[i]);
      choiceButtons[i].size(btnW, 36);
    }
    lastButtonYs = key;
  }

  // Feedback panel
  if (answered) {
    const fb = drawFeedback(x, yy + 2, w, s);
    yy = fb;
  }
}

function drawFeedback(x, y, w, s) {
  const r = results[current];
  const pName = PRINCIPLES[s.principle].name;
  const head = r.correct ? 'Good judgment. Principle: ' + pName + '.'
                         : 'A thoughtful traveler would choose ' + LETTERS[s.best] + '. Principle: ' + pName + '.';
  textStyle(BOLD);
  textSize(16);
  const headLines = wrapLines(head, w - 24);
  textStyle(NORMAL);
  textSize(15);
  const lines = wrapLines(s.why, w - 24);
  const headH = headLines.length * 21;
  const h = 11 + headH + lines.length * 20 + 6;
  stroke(r.correct ? 'seagreen' : 'firebrick');
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x, y, w, h, 10);
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(16);
  fill(r.correct ? 'darkgreen' : 'firebrick');
  for (let j = 0; j < headLines.length; j++) text(headLines[j], x + 12, y + 8 + j * 21);
  textStyle(NORMAL);
  textSize(15);
  fill('black');
  for (let j = 0; j < lines.length; j++) text(lines[j], x + 12, y + 11 + headH + j * 20);
  return y + h;
}

function drawSummary(top) {
  const x = margin, w = canvasWidth - 2 * margin;
  let yy = top;
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(18);
  fill('black');
  text('All eight situations judged. Best choices: ' + score + ' of 8.', x, yy);
  yy += 24;
  const pass = score >= 7;
  fill(pass ? 'darkgreen' : 'firebrick');
  textSize(16);
  text(pass ? '7 or more: you are ready to travel thoughtfully.'
            : 'Fewer than 7: reread the six principles and try again.', x, yy);
  textStyle(NORMAL);
  yy += 26;

  // Table of the eight situations
  const rowH = 24;
  const c1 = x + 8, c2 = x + 34, c3 = x + w * 0.56, c4 = x + w * 0.80;
  fill('dimgray');
  textStyle(BOLD);
  textSize(13);
  text('#', c1, yy);
  text('SITUATION', c2, yy);
  text('DECIDING PRINCIPLE', c3, yy);
  text('YOUR CHOICE', c4, yy);
  textStyle(NORMAL);
  yy += 20;
  for (let i = 0; i < SITUATIONS.length; i++) {
    const s = SITUATIONS[i], r = results[i];
    fill(i % 2 === 0 ? 'white' : 'ghostwhite');
    stroke('gainsboro');
    strokeWeight(1);
    rect(x, yy, w, rowH);
    noStroke();
    fill('black');
    textSize(15);
    textAlign(LEFT, CENTER);
    text(i + 1, c1, yy + rowH / 2);
    text(fitText(s.label, c3 - c2 - 8), c2, yy + rowH / 2);
    text(PRINCIPLES[s.principle].name, c3, yy + rowH / 2);
    textStyle(BOLD);
    fill(r.correct ? 'darkgreen' : 'firebrick');
    text(r.correct ? LETTERS[r.chosen] + '  best' : LETTERS[r.chosen] + '  (best: ' + LETTERS[s.best] + ')', c4, yy + rowH / 2);
    textStyle(NORMAL);
    yy += rowH;
  }

  // Principle counts
  yy += 12;
  const counts = PRINCIPLES.map(() => 0);
  for (const s of SITUATIONS) counts[s.principle]++;
  fill('black');
  textAlign(LEFT, TOP);
  textSize(15);
  textStyle(BOLD);
  text('Times each principle decided:', x, yy);
  textStyle(NORMAL);
  const parts = PRINCIPLES.map((p, i) => p.name + ' ' + counts[i]);
  yy = drawWrapped(parts.join('  ·  '), x, yy + 20, w, 20);
  fill('dimgray');
  textStyle(ITALIC);
  textSize(14);
  drawWrapped('Every principle decides at least one situation. Look at the wrong answers: most are polite-sounding ways of avoiding contact.', x, yy + 6, w, 18);
  textStyle(NORMAL);
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
  lastButtonYs = "";
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
}
