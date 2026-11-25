// Who Could Vote in Athens? - Chart.js 4
// CANVAS_HEIGHT: 580
// One stacked bar of everyone in Attica around 431 BCE, in four estimated
// groups (adult male citizens, who could vote, and three groups who could
// not), and a second bar for a full Assembly of 6,000 on the Pnyx. The
// learner calculates the voting share, sets the estimates for the largest
// share the evidence allows, and calculates the Assembly's share. Then the
// four estimate sliders unlock for free exploration.
// All four group sizes are rounded scholarly estimates; see index.md References.

const GROUPS = [
  { name: 'Adult male citizens', short: 'Adult male citizens (could vote)', min: 30000, max: 50000, step: 5000,
    def: 40000, vote: true, fill: '#E2B84A', edge: '#8a6a10' },
  { name: "Citizens' wives, daughters, and young sons", short: "Citizens' wives, daughters, young sons",
    min: 70000, max: 130000, step: 10000, def: 100000, fill: '#A9BACB', edge: '#5a6f84' },
  { name: 'Metics, of all ages', short: 'Metics, of all ages', min: 20000, max: 40000, step: 5000,
    def: 30000, fill: '#9DBBA6', edge: '#4d6e58' },
  { name: 'Enslaved people', short: 'Enslaved people', min: 60000, max: 100000, step: 10000,
    def: 80000, fill: '#C3A196', edge: '#6e5046' }
];
const ASSEMBLY = 6000;
const ASSEMBLY_FILL = '#2F6E8E';
const MAX_SET = [50000, 70000, 20000, 60000];   // challenge 2 answer

const CHALLENGES = [
  { kind: 'typed', answer: 16.0, tol: 1.0,
    text: 'At the default estimates, what percent of everyone in Attica could vote?',
    hint: 'Divide the voters by everyone: 40,000 ÷ (40,000 + 100,000 + 30,000 + 80,000). Try once more.',
    full: 'Divide the voters by everyone: 40,000 ÷ (40,000 + 100,000 + 30,000 + 80,000) = 40,000 ÷ 250,000 = 0.16, or 16 percent.',
    right: '16.0 percent. 40,000 ÷ 250,000 = 0.16, about one person in six.' },
  { kind: 'set',
    text: 'Set the four estimates to give the largest share of voters the evidence allows, then press Check.',
    hint: 'The share is largest when the voters are as many as possible and everyone else as few as possible. Try once more.',
    full: 'The share is largest when the voters are as many as possible and everyone else as few as possible: 50,000 ÷ 200,000 = 25 percent. The estimates are now set to it.',
    right: '25.0 percent. Citizens at 50,000 and every other group at its minimum: 50,000 ÷ 200,000.' },
  { kind: 'typed', answer: 2.4, tol: 0.2,
    text: 'Back at the defaults, what percent of everyone in Attica sat in a full Assembly of 6,000?',
    hint: 'Divide the Assembly by everyone: 6,000 ÷ 250,000. Try once more.',
    full: '6,000 ÷ 250,000 = 0.024, or 2.4 percent: about one person in forty.',
    right: '2.4 percent. 6,000 ÷ 250,000 = 0.024, about one person in forty.' }
];

// ---------- State ----------
let values = GROUPS.map(g => g.def);
let ch = 0;             // current challenge index
let attempts = 0;       // wrong attempts on the current challenge
let resolved = false;   // current challenge finished (right or missed)
let results = [null, null, null];
let free = false;       // all three done: free exploration
let shareShown = false;
let assemblyShown = false;
let chart = null;
let sliders = [];

const fmt = n => n.toLocaleString('en-US');
const total = () => values.reduce((a, b) => a + b, 0);
const voteShare = () => values[0] / total() * 100;
const assemblyShare = () => ASSEMBLY / total() * 100;

// ---------- Chart plugins ----------
// "Could vote" / "Could not vote" brackets above the first bar, a divider at
// the boundary, numbers inside segments, and the Assembly's comparison outline.
const annotate = {
  id: 'annotate',
  afterDatasetsDraw(c) {
    const ctx = c.ctx;
    const segs = GROUPS.map((g, i) => c.getDatasetMeta(i).data[0]);
    const a = c.getDatasetMeta(GROUPS.length).data[1];
    const x0 = segs[0].base, xv = segs[0].x, xEnd = segs[GROUPS.length - 1].x;
    const y = segs[0].y, h = segs[0].height;
    ctx.save();
    // segment numbers
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1d2a33';
    segs.forEach((el, i) => {
      const t = fmt(values[i]);
      if (el.x - el.base > ctx.measureText(t).width + 8) ctx.fillText(t, (el.x + el.base) / 2, y);
    });
    // divider between voters and everyone else
    ctx.strokeStyle = '#1d2a33';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(xv, y - h / 2 - 2);
    ctx.lineTo(xv, y + h / 2 + 3);
    ctx.stroke();
    // brackets
    ctx.lineWidth = 1.5;
    const by = y - h / 2 - 6;
    const bracket = (xa, xb, label, color) => {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(xa + 2, by + 4); ctx.lineTo(xa + 2, by); ctx.lineTo(xb - 2, by); ctx.lineTo(xb - 2, by + 4);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.font = 'bold 13px Arial';
      ctx.textBaseline = 'bottom';
      const w = ctx.measureText(label).width;
      const mid = (xa + xb) / 2;
      ctx.textAlign = 'left';
      ctx.fillText(label, Math.max(xa + 2, Math.min(mid - w / 2, c.chartArea.right - w)), by - 2);
    };
    bracket(x0, xv, 'Could vote: ' + (shareShown ? voteShare().toFixed(1) + '%' : '?'), '#7a5c08');
    bracket(xv, xEnd, 'Could not vote', '#4a5a66');
    // Assembly row: dashed outline of everyone, for comparison
    if (a) {
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = '#7d8a94';
      ctx.lineWidth = 1;
      ctx.strokeRect(a.base, a.y - a.height / 2, xEnd - a.base, a.height);
      ctx.setLineDash([]);
      ctx.font = '12px Arial';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#1d2a33';
      ctx.textAlign = 'left';
      const lab = '6,000 people' + (assemblyShown ? ' = ' + assemblyShare().toFixed(1) + '% of everyone' : '');
      ctx.fillText(lab, a.x + 6, a.y);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#5d6d78';
      const endLab = 'everyone: ' + fmt(total());
      if (xEnd - a.x > ctx.measureText(lab).width + ctx.measureText(endLab).width + 24) ctx.fillText(endLab, xEnd - 5, a.y);
    }
    ctx.restore();
  }
};

Chart.register(annotate);
Chart.defaults.font.family = 'Arial, Helvetica, sans-serif';
Chart.defaults.font.size = 13;
Chart.defaults.color = '#333';

function buildChart() {
  const datasets = GROUPS.map((g, i) => ({
    label: g.name + (g.vote ? ' (could vote)' : ' (could not vote)'),
    data: [values[i], null],
    backgroundColor: g.fill,
    borderColor: g.edge,
    borderWidth: 1,
    barPercentage: 0.62,
    categoryPercentage: 0.92
  }));
  datasets.push({
    label: 'A full Assembly on the Pnyx',
    data: [null, ASSEMBLY],
    backgroundColor: ASSEMBLY_FILL,
    borderColor: '#1d4a60',
    borderWidth: 1,
    barPercentage: 0.62,
    categoryPercentage: 0.92
  });
  const cfg = {
    type: 'bar',
    data: { labels: [['Everyone in Attica,', 'c. 431 BCE'], ['A full Assembly', 'on the Pnyx']], datasets },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 250 },
      layout: { padding: { top: 24, right: 6 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: () => '',
            label: item => item.dataset.label + ': ' + fmt(item.raw)
          }
        }
      },
      scales: {
        x: { stacked: true, min: 0, max: 320000,
             ticks: { stepSize: 40000, callback: v => fmt(v) },
             title: { display: true, text: 'People (estimated)', padding: { top: 0 } },
             grid: { color: '#E6E6E6' } },
        y: { stacked: true, ticks: { color: '#222', font: { size: 12, weight: 'bold' } }, grid: { display: false } }
      }
    }
  };
  if (chart) chart.destroy();
  chart = new Chart(document.getElementById('chart'), cfg);
}

function refresh() {
  if (chart) {
    GROUPS.forEach((g, i) => { chart.data.datasets[i].data[0] = values[i]; });
    chart.update();
  }
  sliders.forEach((s, i) => {
    s.input.value = values[i];
    s.out.textContent = fmt(values[i]);
  });
  document.getElementById('total').textContent = fmt(total());
  document.getElementById('share').textContent = shareShown ? voteShare().toFixed(1) + '%' : '?';
  document.getElementById('assembly').textContent = assemblyShown ? assemblyShare().toFixed(1) + '%' : '?';
}

// ---------- Sliders ----------
function buildSliders() {
  const box = document.getElementById('sliders');
  box.innerHTML = '';
  sliders = GROUPS.map((g, i) => {
    const row = document.createElement('div');
    row.className = 'srow';
    const lab = document.createElement('label');
    const id = 'est' + i;
    lab.setAttribute('for', id);
    const nm = document.createElement('span');
    nm.className = 'name';
    nm.innerHTML = '<span class="sw" style="background:' + g.fill + ';border:1px solid ' + g.edge + '"></span>';
    nm.appendChild(document.createTextNode(g.short));
    const out = document.createElement('b');
    lab.append(nm, out);
    const input = document.createElement('input');
    input.type = 'range';
    input.id = id;
    input.min = g.min; input.max = g.max; input.step = g.step; input.value = values[i];
    input.title = g.name + ': ' + fmt(g.min) + ' to ' + fmt(g.max);
    input.addEventListener('input', () => { values[i] = Number(input.value); refresh(); });
    row.append(lab, input);
    box.appendChild(row);
    return { input, out };
  });
}

function setSlidersEnabled(on) {
  sliders.forEach(s => { s.input.disabled = !on; });
}

// ---------- Challenge flow ----------
function renderPanel() {
  const panel = document.getElementById('panel');
  panel.innerHTML = '';
  if (free) {
    const n = results.filter(r => r).length;
    const h = document.createElement('p');
    h.className = 'question';
    h.textContent = 'Challenges correct: ' + n + ' of 3. Even at its most generous, Athenian democracy gave a vote to one person in four.';
    const p = document.createElement('div');
    p.className = 'feedback';
    p.textContent = 'Free exploration: move the four estimates. No combination gives the voters more than ' +
      '25.0 percent of everyone, and none gives them less than 10.0 percent (30,000 ÷ 300,000). ' +
      'A full Assembly of 6,000 was never more than about 3 percent of Attica.';
    panel.append(h, p);
    updateControls();
    return;
  }
  const c = CHALLENGES[ch];
  const head = document.createElement('p');
  head.className = 'qhead';
  head.textContent = 'CHALLENGE ' + (ch + 1) + ' OF 3' + (c.kind === 'set' ? ' · move the estimates' : ' · type a percent');
  const q = document.createElement('p');
  q.className = 'question';
  q.textContent = c.text;
  const row = document.createElement('div');
  row.className = 'answer-row';
  if (c.kind === 'typed') {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.id = 'answer';
    inp.inputMode = 'decimal';
    inp.setAttribute('aria-label', 'Your answer, in percent');
    inp.placeholder = 'percent';
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    const pct = document.createElement('span');
    pct.textContent = '%';
    row.append(inp, pct);
  }
  const btn = document.createElement('button');
  btn.id = 'checkBtn';
  btn.textContent = 'Check';
  btn.addEventListener('click', check);
  const att = document.createElement('span');
  att.className = 'attempts';
  att.id = 'attempts';
  att.textContent = 'Two attempts.';
  row.append(btn, att);
  const fb = document.createElement('div');
  fb.className = 'feedback';
  fb.id = 'feedback';
  panel.append(head, q, row, fb);
  updateControls();
}

function say(ok, msg) {
  const fb = document.getElementById('feedback');
  fb.innerHTML = '';
  if (ok !== null) {
    const b = document.createElement('b');
    b.className = ok ? 'ok' : 'no';
    b.textContent = ok ? 'Correct: ' : 'Not yet. ';
    fb.appendChild(b);
  }
  fb.appendChild(document.createTextNode(msg));
}

function check() {
  if (resolved || free) return;
  const c = CHALLENGES[ch];
  let ok;
  if (c.kind === 'typed') {
    const raw = document.getElementById('answer').value.replace(/[%\s,]/g, '');
    const v = parseFloat(raw);
    if (raw === '' || isNaN(v)) { say(null, 'Type a number, such as 12.5, then press Check.'); return; }
    ok = Math.abs(v - c.answer) <= c.tol + 1e-9;
  } else {
    ok = values.every((v, i) => v === MAX_SET[i]);
  }
  if (ok) {
    results[ch] = true;
    finishChallenge();
    say(true, c.right);
  } else {
    attempts++;
    if (attempts < 2) {
      say(false, c.hint);
      document.getElementById('attempts').textContent = 'One attempt left.';
    } else {
      results[ch] = false;
      if (c.kind === 'set') values = MAX_SET.slice();
      finishChallenge();
      say(false, c.full);
      const fb = document.getElementById('feedback');
      fb.firstChild.textContent = 'Missed. ';
    }
  }
}

function finishChallenge() {
  resolved = true;
  if (ch === 0) shareShown = true;
  if (ch === 2) assemblyShown = true;
  setSlidersEnabled(false);
  const inp = document.getElementById('answer');
  if (inp) inp.disabled = true;
  document.getElementById('checkBtn').disabled = true;
  document.getElementById('attempts').textContent = '';
  refresh();
  updateControls();
}

function next() {
  if (!resolved || free) return;
  if (ch < CHALLENGES.length - 1) {
    ch++;
    attempts = 0;
    resolved = false;
    if (ch === 1) setSlidersEnabled(true);
    if (ch === 2) { values = GROUPS.map(g => g.def); setSlidersEnabled(false); }
    refresh();
    renderPanel();
    const inp = document.getElementById('answer');
    if (inp) inp.focus({ preventScroll: true });
  } else {
    free = true;
    setSlidersEnabled(true);
    refresh();
    renderPanel();
  }
}

function restart() {
  values = GROUPS.map(g => g.def);
  ch = 0; attempts = 0; resolved = false; results = [null, null, null];
  free = false; shareShown = false; assemblyShown = false;
  buildSliders();
  setSlidersEnabled(false);
  buildChart();
  refresh();
  renderPanel();
}

function updateControls() {
  const n = results.filter(r => r).length;
  document.getElementById('score').textContent = 'Challenges correct: ' + n + ' of 3';
  const nb = document.getElementById('nextBtn');
  nb.disabled = !resolved || free;
  nb.textContent = ch < CHALLENGES.length - 1 ? 'Next challenge' : 'Explore freely';
  const st = document.getElementById('status');
  if (free) st.textContent = 'Move any estimate. Try Again repeats the three challenges.';
  else if (resolved) st.textContent = 'Press ' + nb.textContent + ' to continue.';
  else if (CHALLENGES[ch].kind === 'set') st.textContent = 'The bar and the share update as you move each estimate.';
  else st.textContent = 'Estimates are locked during this challenge.';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('restartBtn').addEventListener('click', restart);
  restart();
});
