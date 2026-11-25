// When Printing Arrived - Chart.js 4
// CANVAS_HEIGHT: 706
// A horizontal bar chart of the years from Gutenberg's Bible (about 1455) to
// the first printing in ten scripts and places, grouped as Western Europe or
// Ottoman Empire. Hovering or tapping a bar opens its infobox; four
// one-attempt questions are answered by reading the chart.
// Sources are listed in index.md (References).

const BASE_YEAR = 1455;

// Ordered by year, earliest at the top.
const BARS = [
  { label: 'Latin, Mainz', group: 'W', year: 1455, yearText: 'c. 1455',
    info: 'Gutenberg’s 42-line Bible, about 180 copies, finished in Mainz about 1455. About 49 copies survive.' },
  { label: 'Latin, Venice', group: 'W', year: 1469, yearText: '1469',
    info: 'The first press in Venice, set up by Johann of Speyer. Venice was soon the printing capital of Europe.' },
  { label: 'Hebrew, Italy', group: 'W', year: 1475, yearText: '1475',
    info: 'The first dated Hebrew books, printed in southern and northern Italy (Reggio di Calabria and Piove di Sacco). ' +
          'Undated Hebrew books from Rome may be a few years older.' },
  { label: 'Greek, Milan', group: 'W', year: 1476, yearText: '1476',
    info: 'The first book printed entirely in Greek, a grammar by Constantine Lascaris.' },
  { label: 'Hebrew, Istanbul', group: 'O', year: 1493, yearText: '1493',
    info: 'The ibn Nahmias brothers, Sephardic refugees, print a code of Jewish law, the Arba’ah Turim; ' +
          'some scholars date it about ten years later.' },
  { label: 'Arabic script, Italy', group: 'W', year: 1514, yearText: '1514',
    info: 'A Christian prayer book in Arabic printed in Italy for Arabic-speaking Christians, the first known Arabic book ' +
          'printed with movable type.' },
  { label: 'Armenian, Istanbul', group: 'O', year: 1567, yearText: '1567',
    info: 'The first Armenian press in the Ottoman capital, set up by Abgar Dpir of Tokat.' },
  { label: 'Greek, Istanbul', group: 'O', year: 1627, yearText: '1627',
    info: 'A Greek press set up by Nikodemos Metaxas with the support of the Ecumenical Patriarch, Cyril Lucaris. ' +
          'The authorities closed it in 1628.' },
  { label: 'Arabic script, Aleppo', group: 'O', year: 1706, yearText: '1706',
    info: 'An Arabic press for Christian books in Ottoman Syria, set up by the Patriarch Athanasius Dabbas.' },
  { label: ['Ottoman Turkish (Arabic', 'script), Istanbul'], name: 'Ottoman Turkish (Arabic script), Istanbul',
    group: 'O', year: 1729, yearText: '1729',
    info: 'İbrahim Müteferrika’s first book, an Arabic–Turkish dictionary, 1,000 copies, printed under a decree of 1727 ' +
          'that allowed non-religious books.' }
];
BARS.forEach((b, i) => {
  b.n = i + 1;
  b.years = b.year - BASE_YEAR;
  if (!b.name) b.name = b.label;
});

const GROUPS = {
  W: { name: 'Western Europe', fill: '#7F96AE', edge: '#4A6378' },
  O: { name: 'Ottoman Empire', fill: '#B5523B', edge: '#7E3322' }
};

const QUESTIONS = [
  { text: 'Which community printed first in Istanbul?',
    choices: ['Jewish', 'Greek', 'Muslim Ottoman'], answer: 0, bars: [5],
    right: 'Yes: the ibn Nahmias brothers, about 1493.', wrong: 'Look at bar 5.' },
  { text: 'About how many years after Gutenberg’s Bible did the first Ottoman Turkish book in Arabic script appear?',
    choices: ['About 40', 'About 170', 'About 275'], answer: 2, bars: [10],
    right: 'Right: 1729, about 274 years after 1455.', wrong: 'Look at bar 10.' },
  { text: 'Which statement fits the chart?',
    choices: ['Istanbul had no printing presses before 1727.',
              'Presses ran in Istanbul for more than two centuries before Arabic-script printing for Muslim readers began.',
              'Arabic script was first printed in Istanbul.'],
    answer: 1, bars: [5, 7, 8],
    right: 'Yes: Jewish, Armenian and Greek presses came first.', wrong: 'Look at bars 5, 7 and 8.' },
  { text: 'What does bar 6 show about the delay?',
    choices: ['Arabic script could be printed by 1514, so the delay was not only technical.',
              'Italy banned Arabic printing.',
              'Arabic printing began in Aleppo.'],
    answer: 0, bars: [6, 10],
    right: 'Right: the technology existed; the reasons for waiting were also cultural, economic and political.',
    wrong: 'Compare bar 6 with bar 10.' }
];

// ---------- State ----------
let qIndex = 0;
let answered = false;
let score = 0;
let done = false;
let highlight = [];     // bar numbers outlined after an answer
let active = -1;        // bar index shown in the infobox
let chart = null;

// ---------- Plugins ----------
// Year and gap written at the end of each bar
const barLabels = {
  id: 'barLabels',
  afterDatasetsDraw(c) {
    const meta = c.getDatasetMeta(0), ctx = c.ctx, area = c.chartArea;
    ctx.save();
    ctx.font = 'bold 12px Arial';
    ctx.textBaseline = 'middle';
    meta.data.forEach((el, i) => {
      const b = BARS[i];
      const txt = b.yearText + ' · ' + b.years + (b.years === 1 ? ' year' : ' years');
      const w = ctx.measureText(txt).width;
      const barW = el.x - el.base;
      if (barW > w + 14) {
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        ctx.fillText(txt, el.x - 6, el.y);
      } else {
        ctx.fillStyle = '#222';
        ctx.textAlign = 'left';
        ctx.fillText(txt, Math.min(el.x + 5, area.right - w), el.y);
      }
    });
    ctx.restore();
  }
};

// Outline the bars a question points to, and the bar in the infobox
const barOutline = {
  id: 'barOutline',
  afterDatasetsDraw(c) {
    const meta = c.getDatasetMeta(0), ctx = c.ctx;
    ctx.save();
    meta.data.forEach((el, i) => {
      const n = i + 1;
      const isHi = highlight.includes(n), isActive = i === active;
      if (!isHi && !isActive) return;
      const h = el.height + 6;
      const x0 = el.base - 3, x1 = Math.max(el.x, el.base + 4) + 3;
      ctx.strokeStyle = isHi ? '#C9A227' : '#222';
      ctx.lineWidth = isHi ? 3 : 1.5;
      ctx.setLineDash(isHi ? [] : [4, 3]);
      ctx.strokeRect(x0, el.y - h / 2, x1 - x0, h);
    });
    ctx.restore();
  }
};

Chart.register(barLabels, barOutline);
Chart.defaults.font.family = 'Arial, Helvetica, sans-serif';
Chart.defaults.font.size = 13;
Chart.defaults.color = '#333';

function buildChart() {
  const cfg = {
    type: 'bar',
    data: {
      labels: BARS.map(b => {
        const lab = Array.isArray(b.label) ? b.label.slice() : [b.label];
        lab[0] = b.n + '. ' + lab[0];
        return lab.length === 1 ? lab[0] : lab;
      }),
      datasets: [{
        label: 'Years after 1455',
        data: BARS.map(b => b.years),
        backgroundColor: BARS.map(b => GROUPS[b.group].fill),
        borderColor: BARS.map(b => GROUPS[b.group].edge),
        borderWidth: 1,
        barPercentage: 0.82,
        categoryPercentage: 0.9,
        minBarLength: 3
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500 },
      interaction: { mode: 'index', axis: 'y', intersect: false },
      onHover: (evt, els) => { if (els.length) showInfo(els[0].index); },
      onClick: (evt, els) => { if (els.length) showInfo(els[0].index); },
      plugins: {
        title: { display: true, text: 'Years from Gutenberg’s Bible to the first printing',
                 font: { size: 15, weight: 'bold' }, padding: { top: 2, bottom: 4 } },
        legend: {
          position: 'bottom',
          onClick: null,
          labels: {
            boxWidth: 14,
            generateLabels: () => Object.values(GROUPS).map(g => ({
              text: g.name, fillStyle: g.fill, strokeStyle: g.edge, lineWidth: 1, hidden: false
            }))
          }
        },
        tooltip: { enabled: false }
      },
      scales: {
        x: { min: 0, max: 300, title: { display: true, text: 'Years after 1455' },
             ticks: { stepSize: 50 }, grid: { color: '#E6E6E6' } },
        y: { ticks: { font: { size: 12 }, color: '#222', autoSkip: false }, grid: { display: false } }
      }
    }
  };
  if (chart) chart.destroy();
  chart = new Chart(document.getElementById('chart'), cfg);
}

// ---------- Infobox ----------
function showInfo(i) {
  if (i === active) return;
  active = i;
  renderInfo();
  if (chart) chart.draw();
}

function renderInfo() {
  const box = document.getElementById('info');
  box.innerHTML = '';
  if (active < 0) {
    const s = document.createElement('span');
    s.className = 'hint';
    s.textContent = 'Hover over or tap any bar to read who printed, where and when.';
    box.appendChild(s);
    return;
  }
  const b = BARS[active];
  const head = document.createElement('b');
  head.textContent = 'Bar ' + b.n + ': ' + b.name + ' (' + GROUPS[b.group].name + '), ' + b.yearText + ', ' +
                     b.years + ' years after 1455. ';
  box.append(head, document.createTextNode(b.info));
}

// ---------- Question flow ----------
function renderQuestion() {
  const q = QUESTIONS[qIndex];
  const panel = document.getElementById('panel');
  panel.innerHTML = '';
  const pr = document.createElement('p'); pr.className = 'prompt';
  pr.textContent = 'Question ' + (qIndex + 1) + ' of 4. Read the chart, then choose one answer.';
  const qt = document.createElement('p'); qt.className = 'question'; qt.textContent = q.text;
  const ch = document.createElement('div'); ch.className = 'choices';
  q.choices.forEach((c, k) => {
    const btn = document.createElement('button');
    btn.textContent = String.fromCharCode(97 + k) + ') ' + c;
    btn.addEventListener('click', () => choose(k));
    ch.appendChild(btn);
  });
  const fb = document.createElement('div'); fb.className = 'feedback'; fb.id = 'feedback';
  panel.append(pr, qt, ch, fb);
  updateControls();
}

function choose(k) {
  if (answered || done) return;
  const q = QUESTIONS[qIndex];
  const ok = k === q.answer;
  answered = true;
  if (ok) score++;
  document.querySelectorAll('#panel .choices button').forEach((btn, j) => {
    btn.disabled = true;
    if (j === q.answer) btn.classList.add('correct');
    else if (j === k) btn.classList.add('wrong');
  });
  const fb = document.getElementById('feedback');
  fb.innerHTML = ok ? '<b class="ok">Correct.</b> ' : '<b class="no">Not quite.</b> ';
  fb.appendChild(document.createTextNode(ok ? q.right : q.wrong + ' The answer is highlighted in green.'));
  highlight = q.bars.slice();
  active = q.bars[q.bars.length - 1] - 1;
  renderInfo();
  if (chart) chart.draw();
  updateControls();
}

function next() {
  if (!answered) return;
  if (qIndex < QUESTIONS.length - 1) {
    qIndex++;
    answered = false;
    highlight = [];
    if (chart) chart.draw();
    renderQuestion();
  } else {
    finish();
  }
}

function finish() {
  done = true;
  highlight = BARS.filter(b => b.group === 'O').map(b => b.n);
  if (chart) chart.draw();
  const panel = document.getElementById('panel');
  panel.innerHTML = '';
  const pass = score >= 3;
  const res = document.createElement('p');
  res.className = 'question';
  res.innerHTML = 'Correct: ' + score + ' of 4. <span style="color:' + (pass ? 'darkgreen' : 'firebrick') + '">' +
    (pass ? 'You can read the gap and explain what it does and doesn’t mean.'
          : 'Open the Ottoman bars again and check who did the printing.') + '</span>';
  const tip = document.createElement('p'); tip.className = 'feedback';
  tip.textContent = 'The Ottoman bars are outlined in gold. Every one before 1729 belongs to a non-Muslim community ' +
    'or to Christians printing Arabic: the gap was in Arabic-script printing for Muslim readers.';
  const ban = document.createElement('p'); ban.className = 'feedback';
  ban.textContent = 'The chart cannot show why. The popular story of a ban by Bayezid II in 1485 is contested: ' +
    'no copy of such a decree survives.';
  panel.append(res, tip, ban);
  updateControls();
}

function restart() {
  qIndex = 0; answered = false; score = 0; done = false; highlight = []; active = -1;
  renderInfo();
  buildChart();
  renderQuestion();
}

function updateControls() {
  document.getElementById('score').textContent = 'Correct: ' + score + ' of 4';
  const nb = document.getElementById('nextBtn');
  nb.disabled = !answered || done;
  nb.textContent = qIndex < QUESTIONS.length - 1 ? 'Next question' : 'See my result';
  const st = document.getElementById('status');
  if (done) st.textContent = 'Hover over the bars to review. Restart to try again.';
  else if (answered) st.textContent = 'Press ' + nb.textContent + ' to continue.';
  else st.textContent = 'One attempt per question.';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('restartBtn').addEventListener('click', restart);
  restart();
});
