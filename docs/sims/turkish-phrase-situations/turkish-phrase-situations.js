// The Right Words at the Right Moment - p5.js 2.x
// CANVAS_HEIGHT: 420
// Ten everyday situations from our Istanbul days. For each, the learner picks
// one of three Turkish phrases, each shown with its pronunciation guide. One
// attempt per situation; the best phrase and the reason appear at once. The
// end screen is a phrase sheet of the ten best phrases and their meanings.

let canvasWidth = 700;
let drawHeight = 310;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let margin = 12;

// Phrases and pronunciations from the chapter's "Basic Turkish Phrases" table
const P = {
  gunaydin:  { tr: 'Günaydın', say: 'gün-eye-DUHN', mean: 'Good morning' },
  iyiaksam:  { tr: 'İyi akşamlar', say: 'ee-YEE ahk-shahm-LAHR', mean: 'Good evening' },
  afiyet:    { tr: 'Afiyet olsun', say: 'ah-fee-YET ol-SOON', mean: 'Enjoy your meal' },
  tesekkur:  { tr: 'Teşekkür ederim', say: 'teh-shek-KÜR eh-deh-REEM', mean: 'Thank you' },
  lutfen:    { tr: 'Lütfen', say: 'LÜT-fen', mean: 'Please' },
  hosbulduk: { tr: 'Hoş bulduk', say: 'HOSH bool-DOOK', mean: 'Glad to be here' },
  hesap:     { tr: 'Hesap, lütfen', say: 'heh-SAHP LÜT-fen', mean: 'The bill, please' },
  evet:      { tr: 'Evet', say: 'eh-VET', mean: 'Yes' },
  nekadar:   { tr: 'Ne kadar?', say: 'neh kah-DAHR', mean: 'How much?' },
  hosgeldin: { tr: 'Hoş geldiniz', say: 'HOSH gel-dee-NEEZ', mean: 'Welcome' },
  kolay:     { tr: 'Kolay gelsin', say: 'koh-LIE gel-SEEN', mean: 'May it come easy' },
  elinize:   { tr: 'Elinize sağlık', say: 'eh-lee-nee-ZEH saah-LUHK', mean: 'Health to your hands' },
  sagolun:   { tr: 'Sağ olun', say: 'SAAH oh-loon', mean: 'Thanks' },
  affeder:   { tr: 'Affedersiniz', say: 'ahf-feh-DEHR-see-neez', mean: 'Excuse me' },
  evetlut:   { tr: 'Evet, lütfen', say: 'eh-VET LÜT-fen', mean: 'Yes, please' },
  hayirtes:  { tr: 'Hayır, teşekkürler', say: 'HAH-yuhr teh-shek-kür-LEHR', mean: 'No, thank you' }
};

// best is the index (0 = A) of the best phrase; its position is fixed
const SITUATIONS = [
  { text: '8 AM: you walk into a café for breakfast.', short: '8 AM, walking into a café',
    options: ['iyiaksam', 'gunaydin', 'afiyet'], best: 1,
    why: 'Günaydın is “good morning”; İyi akşamlar is for evenings.' },
  { text: 'The simit seller hands you your simit.', short: 'The simit seller hands you a simit',
    options: ['tesekkur', 'lutfen', 'hosbulduk'], best: 0,
    why: 'Teşekkür ederim is the all-purpose “thank you.”' },
  { text: 'You want to know the price of a bag of tea at a stall.', short: 'The price of a bag of tea',
    options: ['hesap', 'evet', 'nekadar'], best: 2,
    why: 'Ne kadar? asks “how much?” about an item.' },
  { text: 'You have finished dinner and want to pay.', short: 'Paying after dinner',
    options: ['nekadar', 'hesap', 'gunaydin'], best: 1,
    why: 'Hesap, lütfen asks for the bill; Ne kadar? asks the price of one thing.' },
  { text: 'A shopkeeper greets you with “Hoş geldiniz!”', short: 'A shopkeeper says “Hoş geldiniz!”',
    options: ['hosbulduk', 'hosgeldin', 'lutfen'], best: 0,
    why: 'The set reply to “welcome” is Hoş bulduk, “we found it pleasant.”' },
  { text: 'You pass a fisherman at work on the Galata Bridge and want to greet him.', short: 'Greeting a fisherman at work',
    options: ['afiyet', 'hosbulduk', 'kolay'], best: 2,
    why: 'Kolay gelsin, “may it come easy,” is said to anyone working.' },
  { text: 'A family has served you a home-cooked meal, and you want to praise the cook.', short: 'Praising a home cook',
    options: ['elinize', 'afiyet', 'kolay'], best: 0,
    why: 'Elinize sağlık, “health to your hands,” thanks the cook; Afiyet olsun is what the cook says to you.' },
  { text: 'You need to get past someone in a crowded tram.', short: 'Getting past someone on a tram',
    options: ['sagolun', 'affeder', 'lutfen'], best: 1,
    why: 'Affedersiniz is “excuse me.”' },
  { text: 'You are leaving a restaurant at 9 PM.', short: 'Leaving a restaurant at 9 PM',
    options: ['gunaydin', 'hosgeldin', 'iyiaksam'], best: 2,
    why: 'İyi akşamlar is “good evening,” for arriving or leaving.' },
  { text: 'Your host offers more tea, and you would like some.', short: 'Your host offers more tea',
    options: ['evetlut', 'hayirtes', 'nekadar'], best: 0,
    why: 'Evet, lütfen is “yes, please”; tea from a host is never for sale.' }
];
const MASTERY = 8;

// ---------- State ----------
let current = 0;
let answers = [];
let finished = false;

// ---------- Controls ----------
let phraseButtons = [];
let nextButton, restartButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  for (let i = 0; i < 3; i++) {
    const b = createButton('');
    b.parent(document.querySelector('main'));
    b.style('font-size', '16px');
    b.style('line-height', '1.25');
    b.style('padding', '3px 6px');
    b.style('border-radius', '8px');
    b.style('cursor', 'pointer');
    b.mousePressed(() => choose(i));
    phraseButtons.push(b);
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

  describe('A phrase-choice activity with ten everyday situations in Istanbul, such as arriving at a café at 8 AM or paying after dinner. ' +
           'For each, three Turkish phrases are offered with their pronunciation guides. After a choice, the best phrase is marked, ' +
           'its meaning and the reason are shown, and a running score counts correct first choices. The end screen is a phrase sheet ' +
           'listing the best phrase, its pronunciation and its meaning for all ten situations.');
}

function positionControls() {
  const gap = 8;
  const bw = (canvasWidth - 2 * margin - 2 * gap) / 3;
  for (let i = 0; i < 3; i++) {
    phraseButtons[i].position(margin + i * (bw + gap), drawHeight + 8);
    phraseButtons[i].size(bw, 54);
  }
  nextButton.position(margin, drawHeight + 72);
  restartButton.position(margin + 160, drawHeight + 72);
}

function restart() {
  current = 0;
  answers = [];
  finished = false;
  for (const b of phraseButtons) b.show();
  updateButtons();
}

function choose(i) {
  if (finished || answers[current] !== undefined) return;
  answers[current] = i;
  updateButtons();
}

function nextSituation() {
  if (finished || answers[current] === undefined) return;
  if (current < SITUATIONS.length - 1) current++;
  else {
    finished = true;
    for (const b of phraseButtons) b.hide();
  }
  updateButtons();
}

function keyPressed() {
  const k = String(key).toLowerCase();
  if (k === '1' || k === 'a') choose(0);
  else if (k === '2' || k === 'b') choose(1);
  else if (k === '3' || k === 'c') choose(2);
  else if (key === 'Enter') nextSituation();
}

function score() {
  let n = 0;
  for (let i = 0; i < SITUATIONS.length; i++) if (answers[i] === SITUATIONS[i].best) n++;
  return n;
}

function updateButtons() {
  const S = SITUATIONS[current];
  const a = answers[current];
  for (let i = 0; i < 3; i++) {
    const b = phraseButtons[i];
    const ph = P[S.options[i]];
    b.html('<b>' + 'ABC'[i] + '.</b> <i>' + ph.tr + '</i><br><span style="font-size:13px;color:#4a5a66">' + ph.say + '</span>');
    let bg = '#f4f8fb', border = '1px solid #8aa0b0', op = '1';
    if (a === undefined) b.removeAttribute('disabled');
    else {
      b.attribute('disabled', '');
      if (i === S.best) { bg = '#dff2df'; border = '2px solid #2e7d32'; }
      else if (i === a) { bg = '#fbe3e3'; border = '2px solid #c62828'; }
      else op = '0.55';
    }
    b.style('background-color', bg);
    b.style('border', border);
    b.style('opacity', op);
    b.style('color', '#1d2a33');
  }
  if (!finished && a !== undefined) nextButton.removeAttribute('disabled');
  else nextButton.attribute('disabled', '');
  nextButton.html(current < SITUATIONS.length - 1 ? 'Next situation' : 'See phrase sheet');
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
  fill('#12304a');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(canvasWidth < 560 ? 17 : 21);
  text('The Right Words at the Right Moment', margin, 10);
  textStyle(NORMAL);
  fill('black');
  textSize(15);
  textAlign(RIGHT, TOP);
  if (canvasWidth >= 480) text('Right words: ' + score() + ' of 10', canvasWidth - margin, 14);

  if (finished) drawSheet();
  else drawSituation(margin, 44, canvasWidth - 2 * margin, drawHeight - 54);

  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(13);
  let status;
  if (finished) status = 'Keep this sheet for the trip. Restart to try again.';
  else if (answers[current] === undefined) status = 'Choose A, B or C (keys 1 to 3 work too).';
  else status = 'Press ' + (current < SITUATIONS.length - 1 ? 'Next situation.' : 'See phrase sheet.');
  text(fitText(status, canvasWidth - margin - 250), margin + 240, drawHeight + 86);
}

function drawSituation(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  const pad = 16, tw = w - 2 * pad;
  const S = SITUATIONS[current];
  let yy = y + 12;
  textAlign(LEFT, TOP);
  fill('dimgray');
  textStyle(BOLD);
  textSize(12);
  text('SITUATION ' + (current + 1) + ' OF 10', x + pad, yy);
  yy += 22;
  fill('black');
  textSize(20);
  yy = drawWrapped(S.text, x + pad, yy, tw, 26) + 10;
  textStyle(NORMAL);

  const a = answers[current];
  if (a === undefined) {
    fill('#12304a');
    textStyle(BOLDITALIC);
    textSize(17);
    text('What do you say?', x + pad, yy);
    textStyle(NORMAL);
    textSize(14);
    fill('dimgray');
    drawWrapped('Read the three phrases below aloud, using the pronunciation guide under each one, then choose.',
                x + pad, yy + 30, tw, 19);
    return;
  }
  const best = P[S.options[S.best]];
  const ok = a === S.best;
  textStyle(BOLD);
  textSize(16);
  fill(ok ? 'darkgreen' : 'firebrick');
  const head = ok ? 'Right: ' + best.tr + ' (' + best.say + '), “' + best.mean + '.”'
                  : 'A better choice is ' + best.tr + ' (' + best.say + '), “' + best.mean + '.”';
  yy = drawWrapped(head, x + pad, yy, tw, 21) + 4;
  textStyle(NORMAL);
  fill('black');
  textSize(15);
  yy = drawWrapped(S.why, x + pad, yy, tw, 20) + 6;
  if (!ok) {
    const mine = P[S.options[a]];
    fill('#4a5a66');
    textStyle(ITALIC);
    textSize(14);
    drawWrapped('You chose ' + mine.tr + ', which means “' + mine.mean + '.”', x + pad, yy, tw, 19);
    textStyle(NORMAL);
  }
}

function drawSheet() {
  const x = margin, y = 44, w = canvasWidth - 2 * margin, h = canvasHeight - 44 - 48;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 10);
  noStroke();
  const n = score();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  fill(n >= MASTERY ? 'darkgreen' : 'firebrick');
  text(fitText('You scored ' + n + ' of 10. ' + (n >= MASTERY ? '8 or more: you are ready for Day 1.'
       : 'Fewer than 8: review the phrase table and try again.'), w - 24), x + 12, y + 9);
  textStyle(NORMAL);

  const colPhrase = x + Math.max(190, w * 0.40);
  const rowH = 29;
  let yy = y + 34;
  for (let i = 0; i < SITUATIONS.length; i++) {
    const S = SITUATIONS[i], ph = P[S.options[S.best]], ok = answers[i] === S.best;
    fill(i % 2 ? '#f4f8fb' : '#ffffff');
    rect(x + 4, yy - 2, w - 8, rowH);
    fill('#1d2a33');
    textAlign(LEFT, CENTER);
    textSize(13);
    text(fitText((i + 1) + '. ' + S.short, colPhrase - x - 24), x + 12, yy + rowH / 2 - 2);
    textAlign(LEFT, TOP);
    textStyle(BOLDITALIC);
    textSize(14);
    text(ph.tr, colPhrase, yy + 1);
    const tw = textWidth(ph.tr);
    textStyle(NORMAL);
    textSize(13);
    text(fitText('  “' + ph.mean + '”', x + w - 40 - colPhrase - tw), colPhrase + tw, yy + 2);
    fill('#4a5a66');
    textSize(12);
    text(ph.say, colPhrase, yy + 14);
    textAlign(RIGHT, CENTER);
    textStyle(BOLD);
    textSize(14);
    fill(ok ? 'darkgreen' : 'firebrick');
    text(ok ? '✓' : '✗', x + w - 12, yy + rowH / 2 - 2);
    textStyle(NORMAL);
    yy += rowH;
  }
}

// ---------- Text helpers ----------
function wrapLines(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd;
    if (textWidth(test) > maxW && line) {
      lines.push(line);
      line = wd;
    } else line = test;
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
