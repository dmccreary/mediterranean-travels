// Read a Freedom Record on the Polygonal Wall - custom HTML
// CANVAS_HEIGHT: 730
// A simplified composite Delphic manumission record in eight clauses. For
// each clause the learner chooses its name (one of eight) and its effect
// (protects the freed person / limits her freedom / records the facts).
// Check marks every clause; a clause is correct only when both answers are
// right. Unlimited re-checks; only the first Check counts toward mastery
// (7 of 8). Show Answers becomes available after the second Check.
// Sources are listed in index.md (References).

const NAMES = ['Date', 'Sale to the god', 'Person freed', 'Price',
               'Freedom clause', 'Guarantor', 'Paramone', 'Witnesses'];
const EFFECTS = [
  { id: 'protect', name: 'Protects the freed person', short: 'Protects her' },
  { id: 'limit', name: 'Limits the freed person’s freedom', short: 'Limits her freedom' },
  { id: 'record', name: 'Records the facts', short: 'Records the facts' }
];

// Glossary definitions follow the chapter section "Manumission Records".
const GLOSS = {
  manumission: 'Manumission: the legal act of freeing an enslaved person.',
  archon: 'Archon: the magistrate who gave his name to the Delphic year, so a record dated by him could be found and checked.',
  guarantor: 'Guarantor: a citizen bound to defend the sale if anyone later claimed the freed person as a slave.',
  witnesses: 'Witnesses: people, often including Apollo’s priests, who could testify to the sale if the freedom was challenged.',
  paramone: 'Paramone (“remaining”): a condition that the freed person stay with the former owner and serve, often until the owner’s death, before the freedom became complete.'
};

// text: clause wording; {term|shown} marks a glossary word.
// name: index into NAMES; eff: index into EFFECTS.
const CLAUSES = [
  { text: 'In the year when [name] was {archon|archon}, in the month [month],', name: 0, eff: 2,
    why: 'Dating by the archon’s year made the record findable and checkable by anyone.' },
  { text: '[owner’s name], son of [father’s name], sold to Pythian Apollo', name: 1, eff: 0,
    why: 'Once the god owned the person, no human could claim them as property.' },
  { text: 'a woman named [name], [her homeland] by birth,', name: 2, eff: 2,
    why: 'The record names the person and her origin so that she can be identified later.' },
  { text: 'for a price of [sum] of silver, and he has received the whole price,', name: 3, eff: 2,
    why: 'The price was usually the freed person’s own savings, and full payment closed the sale.' },
  { text: 'as [name] entrusted the purchase to the god, on condition that she be free and claimed by no one, doing what she wishes and going where she wishes.', name: 4, eff: 0,
    why: 'This clause states the freedom itself and forbids anyone to claim her.' },
  { text: '{guarantor|Guarantor}, according to the law of the city: [name].', name: 5, eff: 0,
    why: 'The guarantor was legally bound to defend the sale if anyone claimed her as a slave.' },
  { text: '[name] shall remain with [owner’s name] for as long as he lives, doing what she is told.', name: 6, eff: 1,
    why: 'This condition kept her serving the former owner, often until his death.' },
  { text: '{witnesses|Witnesses}: the priests of Apollo, [name], [name].', name: 7, eff: 0,
    why: 'Witnesses could testify to the sale if her freedom was ever challenged.' }
];
const MASTERY = 7;
const SUMMARY = 'Four clauses protect her freedom, three record the facts, and one keeps her bound.';

// ---------- State ----------
let sel = 0;
let ans = [];        // per clause: { name: int|null, eff: int|null }
let marks = [];      // per clause: null | 'ok' | 'name' | 'eff' | 'shown'
let checks = 0;
let firstScore = null;
let revealed = false;

const $ = id => document.getElementById(id);
let rowEls = [], nameBtns = [], effBtns = [];

function termHtml(key, shown, right) {
  return '<span class="term' + (right ? ' right' : '') + '" tabindex="0" data-def="' +
         GLOSS[key].replace(/"/g, '&quot;') + '">' + shown + '</span>';
}

function clauseHtml(t) {
  return t.replace(/\{(\w+)\|([^}]+)\}/g, (m, k, shown) => termHtml(k, shown, false));
}

function build() {
  // glossary strip
  const keys = ['manumission', 'archon', 'guarantor', 'witnesses', 'paramone'];
  $('gloss').innerHTML = '<span>Glossary (hover or tap):</span>' +
    keys.map((k, i) => termHtml(k, k, i >= 3)).join('');

  // the record
  const rec = $('record');
  CLAUSES.forEach((c, i) => {
    const row = document.createElement('div');
    row.className = 'clause';
    row.setAttribute('role', 'listitem');
    row.tabIndex = 0;
    row.innerHTML = '<div class="num">' + (i + 1) + '</div>' +
      '<div class="ctext">“' + clauseHtml(c.text) + '”</div>' +
      '<div class="tags"></div>';
    row.addEventListener('click', () => select(i));
    row.addEventListener('keydown', e => {
      if (e.target !== row) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); }
      else if (e.key === 'ArrowDown' && i < 7) { e.preventDefault(); rowEls[i + 1].focus(); select(i + 1); }
      else if (e.key === 'ArrowUp' && i > 0) { e.preventDefault(); rowEls[i - 1].focus(); select(i - 1); }
    });
    rec.appendChild(row);
    rowEls.push(row);
  });

  // answer buttons
  NAMES.forEach((n, k) => {
    const b = document.createElement('button');
    b.textContent = n;
    if (n === 'Paramone') b.title = GLOSS.paramone;
    b.addEventListener('click', () => choose('name', k));
    $('names').appendChild(b);
    nameBtns.push(b);
  });
  EFFECTS.forEach((e, k) => {
    const b = document.createElement('button');
    b.textContent = e.name;
    b.classList.add('b-' + e.id);
    b.addEventListener('click', () => choose('eff', k));
    $('effs').appendChild(b);
    effBtns.push(b);
  });

  $('checkBtn').addEventListener('click', check);
  $('showBtn').addEventListener('click', showAnswers);
  $('restartBtn').addEventListener('click', restart);
}

function restart() {
  ans = CLAUSES.map(() => ({ name: null, eff: null }));
  marks = CLAUSES.map(() => null);
  checks = 0;
  firstScore = null;
  revealed = false;
  sel = 0;
  render();
}

const complete = i => ans[i].name !== null && ans[i].eff !== null;
const isRight = i => ans[i].name === CLAUSES[i].name && ans[i].eff === CLAUSES[i].eff;
const lockedClause = i => revealed || marks[i] === 'ok';

function select(i) {
  sel = i;
  render();
}

function choose(part, k) {
  if (lockedClause(sel)) return;
  const wasComplete = complete(sel);
  ans[sel][part] = k;
  marks[sel] = null;   // a changed answer waits for the next Check
  if (!wasComplete && complete(sel) && checks === 0) {
    // move on to the next unanswered clause
    for (let d = 1; d <= 8; d++) {
      const j = (sel + d) % 8;
      if (!complete(j)) { sel = j; break; }
    }
  }
  render();
}

function check() {
  if (!CLAUSES.every((c, i) => complete(i)) || revealed) return;
  checks++;
  let score = 0;
  CLAUSES.forEach((c, i) => {
    if (isRight(i)) { marks[i] = 'ok'; score++; }
    else if (ans[i].name !== c.name) marks[i] = 'name';
    else marks[i] = 'eff';
  });
  if (firstScore === null) firstScore = score;
  const firstWrong = marks.findIndex(m => m !== 'ok');
  if (firstWrong >= 0) sel = firstWrong;
  render();
}

function showAnswers() {
  if (checks < 2 || revealed) return;
  CLAUSES.forEach((c, i) => {
    if (marks[i] !== 'ok') { ans[i] = { name: c.name, eff: c.eff }; marks[i] = 'shown'; }
  });
  revealed = true;
  render();
}

function feedbackFor(i) {
  const c = CLAUSES[i];
  const m = marks[i];
  if (m === 'ok') return '<b class="ok">Correct:</b> ' + c.why;
  if (m === 'name') return '<b class="no">This clause is the ' + NAMES[c.name] + '.</b> ' + c.why;
  if (m === 'eff') return '<b class="no">Right name, but look again at its effect.</b> ' + c.why;
  if (m === 'shown') return '<b class="no">Answer: ' + NAMES[c.name] + ', ' + EFFECTS[c.eff].name.toLowerCase() + '.</b> ' + c.why;
  if (checks > 0 && complete(i)) return '<span class="hint">Changed. Press Check to test your new answer.</span>';
  if (!complete(i)) return '<span class="hint">Choose a name and an effect for this clause. Click any clause in the record to switch to it.</span>';
  return '<span class="hint">Answered. Click another clause, or press Check when all eight are answered.</span>';
}

function render() {
  const nDone = CLAUSES.filter((c, i) => complete(i)).length;
  const score = marks.filter(m => m === 'ok').length;
  const allRight = score === 8;

  CLAUSES.forEach((c, i) => {
    const row = rowEls[i];
    row.classList.toggle('sel', i === sel);
    row.classList.toggle('ok', marks[i] === 'ok');
    row.classList.toggle('no', marks[i] === 'name' || marks[i] === 'eff' || marks[i] === 'shown');
    row.setAttribute('aria-current', i === sel ? 'true' : 'false');
    const a = ans[i];
    const nameTag = a.name === null
      ? '<span class="tag empty">name?</span>'
      : '<span class="tag name' + (marks[i] === 'name' ? ' wrongpart' : '') + '">' +
        (marks[i] === 'ok' ? '✓ ' : '') + NAMES[a.name] + '</span>';
    const effTag = a.eff === null
      ? '<span class="tag empty">effect?</span>'
      : '<span class="tag eff eff-' + EFFECTS[a.eff].id + (marks[i] === 'eff' ? ' wrongpart' : '') + '">' +
        EFFECTS[a.eff].short + '</span>';
    row.querySelector('.tags').innerHTML = nameTag + effTag;
    row.title = marks[i] ? CLAUSES[i].why : '';
  });

  $('phead').textContent = 'Clause ' + (sel + 1) + ' of 8: what is it called, and what does it do?';
  const lock = lockedClause(sel);
  nameBtns.forEach((b, k) => { b.classList.toggle('on', ans[sel].name === k); b.disabled = lock; });
  effBtns.forEach((b, k) => {
    const on = ans[sel].eff === k;
    b.classList.toggle('on', on);
    EFFECTS.forEach(e => b.classList.remove('eff-' + e.id));
    if (on) b.classList.add('eff-' + EFFECTS[k].id);
    b.disabled = lock;
  });
  $('feedback').innerHTML = feedbackFor(sel);

  $('score').textContent = checks === 0 ? 'Clauses correct: – of 8' : 'Clauses correct: ' + score + ' of 8';
  $('checkBtn').disabled = nDone < 8 || revealed || allRight;
  $('showBtn').disabled = checks < 2 || revealed || allRight;

  const sum = $('summary');
  const first = firstScore === null ? '' :
    'First Check: ' + firstScore + ' of 8' + (firstScore >= MASTERY ? ' (mastery). ' : ' (mastery is 7). ');
  if (allRight || revealed) {
    sum.className = 'summary done';
    sum.textContent = SUMMARY + ' ' + first;
  } else {
    sum.className = 'summary';
    if (checks === 0) sum.textContent = nDone < 8
      ? 'Answered: ' + nDone + ' of 8. Answer every clause, then press Check. Only the first Check counts.'
      : 'All eight answered. Press Check.';
    else sum.textContent = first + 'Fix the red clauses and press Check again' +
      (checks >= 2 ? ', or press Show Answers.' : '.');
  }
}

// A little state for headless testing
window.freedomRecord = {
  answerAll: correct => {
    CLAUSES.forEach((c, i) => { ans[i] = { name: correct ? c.name : (c.name + 1) % 8, eff: c.eff }; marks[i] = null; });
    render();
  },
  check: () => check(), show: () => showAnswers(), select: i => select(i)
};

build();
restart();
