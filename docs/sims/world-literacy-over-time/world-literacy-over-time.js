// World Literacy Over Two Centuries - Chart.js 4
// CANVAS_HEIGHT: 610
// Three prediction questions, each locked in before part of the chart is
// revealed: the 1820 starting point, the full line and its 50% crossing, and
// the share of adults who still cannot read. Then free exploration.
// Data: Our World in Data, World series, downloaded 2026-11-24
// (a copy with its source is in world-literacy-data.json in this folder).

// [year, percent literate]
const LITERACY = [
  [1820, 12.05], [1870, 18.74], [1880, 19.63], [1890, 20.52], [1900, 21.4], [1910, 26.45], [1920, 31.62],
  [1930, 32.53], [1940, 41.88], [1950, 35.96], [1960, 41.62], [1975, 65.42], [1976, 65.57], [1977, 65.88],
  [1978, 66.5], [1979, 67.15], [1980, 67.76], [1981, 68.35], [1982, 68.93], [1983, 69.49], [1984, 70.15],
  [1985, 70.73], [1986, 71.27], [1987, 71.94], [1988, 73.55], [1989, 74.07], [1990, 74.63], [1991, 75.06],
  [1992, 75.51], [1993, 75.97], [1994, 76.42], [1995, 76.87], [1996, 77.3], [1997, 79.3], [1998, 80.52],
  [1999, 80.9], [2000, 81.12], [2001, 81.37], [2002, 81.74], [2003, 82.22], [2004, 82.56], [2005, 82.57],
  [2006, 82.53], [2007, 83.12], [2008, 83.48], [2009, 83.8], [2010, 84.37], [2011, 84.71], [2012, 84.91],
  [2013, 85.21], [2014, 85.56], [2015, 85.96], [2016, 86.28], [2017, 86.47], [2018, 86.76], [2019, 86.79],
  [2020, 86.98], [2021, 87.17], [2022, 87.39], [2023, 87.58], [2024, 87.74]
];

const EVENTS = [
  { year: 1821, label: '1821: Sequoyah completes the Cherokee syllabary' },
  { year: 1928, label: '1928: Turkey adopts a Latin-based alphabet (Day 5)' }
];

const ADULTS_BILLIONS = 6.1;     // adults aged 15+, approximate (UN World Population Prospects 2024)
const UNESCO_MILLIONS = 750;     // adults lacking basic literacy (UNESCO, "roughly three-quarters of a billion")

const FIRST = LITERACY[0];
const LAST = LITERACY[LITERACY.length - 1];
const PERIODS = [[1820, 1869], [1870, 1919], [1920, 1969], [1970, 2020]];

// First data year at or above 50%, and the data years on either side of the crossing.
function crossing() {
  const i = LITERACY.findIndex(d => d[1] >= 50);
  const a = LITERACY[i - 1], b = LITERACY[i];
  const interp = a[0] + (50 - a[1]) * (b[0] - a[0]) / (b[1] - a[1]);
  return { first: b, before: a, interp: Math.round(interp) };
}
function periodLabel(p) { return p[0] + '–' + p[1]; }
function periodOf(year) { return PERIODS.find(p => year >= p[0] && year <= p[1]); }

function answerQ1() {
  const v = FIRST[1];
  if (v < 25) return ['Under 25%'];
  if (v < 50) return ['25–50%'];
  if (v <= 75) return ['50–75%'];
  return ['Over 75%'];
}
// The rule (first data year >= 50%) gives 1975; a straight line across the
// 1960–1975 gap in the data crosses 50% in the mid-1960s. Both periods are accepted.
function answerQ2() {
  const c = crossing();
  const set = [periodLabel(periodOf(c.first[0]))];
  const p2 = periodLabel(periodOf(c.interp));
  if (!set.includes(p2)) set.unshift(p2);
  return set;
}
function answerQ3() { return ['About 10–15%']; }

const QUESTIONS = [
  { prompt: 'Before we look: how many people could read two hundred years ago?',
    text: 'In ' + FIRST[0] + ', what share of the world’s people could read?',
    choices: ['Under 25%', '25–50%', '50–75%', 'Over 75%'], answer: answerQ1, stage: 1,
    explain: () => 'In ' + FIRST[0] + ' only about ' + FIRST[1].toFixed(1) + '% of the world’s people could read, ' +
      'fewer than one in eight. Printing had made books cheaper for more than 350 years, but most people still had no school.' },
  { prompt: 'Now picture the whole line from 1820 to today.',
    text: 'In which period did more than half the world first become literate?',
    choices: PERIODS.map(periodLabel), answer: answerQ2, stage: 2,
    explain: () => {
      const c = crossing();
      return 'The line stays under half for well over a century: ' + LITERACY.find(d => d[0] === 1900)[1].toFixed(1) +
        '% in 1900 and ' + c.before[1].toFixed(1) + '% in ' + c.before[0] + '. The data skip to ' + c.first[1].toFixed(1) + '% in ' +
        c.first[0] + ', so the crossing falls in that gap, about ' + c.interp + ' if drawn straight; either late period counts. ' +
        'Mass literacy is mostly a 20th-century achievement.';
    } },
  { prompt: 'Today about ' + UNESCO_MILLIONS + ' million adults cannot read.',
    text: 'Roughly what share of the world’s adults is that?',
    choices: ['About 5%', 'About 10–15%', 'About 30%', 'About 50%'], answer: answerQ3, stage: 3,
    explain: () => UNESCO_MILLIONS + ' million out of about ' + ADULTS_BILLIONS + ' billion adults (approximate) is about ' +
      Math.round(UNESCO_MILLIONS / (ADULTS_BILLIONS * 1000) * 100) + '%, and the chart agrees: ' + (100 - LAST[1]).toFixed(1) +
      '% not literate in ' + LAST[0] + '. The share is small, but the number is about three-quarters of a billion people, nearly two-thirds of them women.' }
];

// ---------- State ----------
let qIndex = 0;
let answered = false;
let score = 0;
let stage = 0;      // 0 empty axes, 1 the 1820 point, 2 full line, 3 gap labeled
let done = false;
let chart = null;

// ---------- Plugins ----------
const eventLines = {
  id: 'eventLines',
  beforeDatasetsDraw(c) {
    const x = c.scales.x, area = c.chartArea, ctx = c.ctx;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#8a6d00';
    ctx.lineWidth = 1.5;
    EVENTS.forEach(e => {
      const px = x.getPixelForValue(e.year);
      ctx.beginPath(); ctx.moveTo(px, area.top + 14); ctx.lineTo(px, area.bottom); ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.fillStyle = '#6b5500';
    ctx.font = 'bold 12px Arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText('1821 Cherokee', x.getPixelForValue(1821) + 4, area.top + 2);
    ctx.fillText('1928 Turkish alphabet', x.getPixelForValue(1928) + 4, area.top + 2);
    ctx.restore();
  }
};

const annotations = {
  id: 'annotations',
  afterDatasetsDraw(c) {
    const x = c.scales.x, y = c.scales.y, area = c.chartArea, ctx = c.ctx;
    ctx.save();
    ctx.font = 'bold 13px Arial';
    ctx.textBaseline = 'middle';
    if (stage >= 1) {
      const px = x.getPixelForValue(FIRST[0]), py = y.getPixelForValue(FIRST[1]);
      label(ctx, FIRST[0] + ': ' + FIRST[1].toFixed(1) + '%', px + 10, py - 16, 'left');
    }
    if (stage >= 2) {
      const cr = crossing();
      const y50 = y.getPixelForValue(50);
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(area.left, y50); ctx.lineTo(area.right, y50); ctx.stroke();
      ctx.setLineDash([]);
      const px = x.getPixelForValue(cr.interp);
      ctx.fillStyle = 'black';
      ctx.beginPath(); ctx.arc(px, y50, 6, 0, 2 * Math.PI); ctx.fill();
      label(ctx, 'crosses 50% between ' + cr.before[0] + ' and ' + cr.first[0], px - 12, y50 - 18, 'right');
    }
    if (stage >= 3) {
      const px = x.getPixelForValue(LAST[0]);
      const yTop = y.getPixelForValue(100), yLine = y.getPixelForValue(LAST[1]);
      ctx.strokeStyle = 'firebrick';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px - 6, yTop); ctx.lineTo(px, yTop); ctx.lineTo(px, yLine); ctx.lineTo(px - 6, yLine);
      ctx.stroke();
      // Leader line from the bracket down to a label in the clear area below the line.
      const yLab = y.getPixelForValue(28);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px - 6, (yTop + yLine) / 2); ctx.lineTo(px - 20, yLab - 10); ctx.stroke();
      label(ctx, (100 - LAST[1]).toFixed(1) + '% not literate ≈ ' + UNESCO_MILLIONS + ' million adults', px - 12, yLab, 'right', 'firebrick');
    }
    ctx.restore();
  }
};

function label(ctx, txt, x, y, align, color) {
  const w = ctx.measureText(txt).width + 10;
  const bx = align === 'right' ? x - w : x;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fillRect(bx, y - 10, w, 20);
  ctx.fillStyle = color || 'black';
  ctx.textAlign = 'left';
  ctx.fillText(txt, bx + 5, y);
}

Chart.register(eventLines, annotations);
Chart.defaults.font.family = 'Arial, Helvetica, sans-serif';
Chart.defaults.font.size = 13;
Chart.defaults.color = '#333';

function buildChart() {
  const pts = stage === 0 ? [] : stage === 1 ? [FIRST] : LITERACY;
  const data = pts.map(d => ({ x: d[0], y: d[1] }));
  const top = pts.map(d => ({ x: d[0], y: 100 }));
  const cfg = {
    type: 'line',
    data: {
      datasets: [
        { label: 'Literate (% of people)', data: data, borderColor: '#2E6E9E', backgroundColor: '#2E6E9E',
          borderWidth: 3, tension: 0, pointRadius: stage === 1 ? 7 : 2.5, pointHoverRadius: 6, fill: false, order: 1 },
        { label: 'Not literate (shaded above the line)', data: stage >= 2 ? top : [], borderWidth: 0, pointRadius: 0,
          pointHoverRadius: 0, borderColor: 'rgba(192,57,43,0.25)', backgroundColor: 'rgba(192,57,43,0.18)', fill: '-1', order: 2 },
        { label: 'Events', type: 'scatter', data: EVENTS.map(e => ({ x: e.year, y: 4 })), pointStyle: 'rectRot',
          pointRadius: 8, pointHoverRadius: 10, backgroundColor: '#C9A227', borderColor: '#6b5500', order: 0 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600 },
      interaction: { mode: 'nearest', intersect: false, axis: 'x' },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 14, filter: item => item.text !== 'Events' } },
        tooltip: {
          filter: item => item.datasetIndex !== 1,
          callbacks: {
            title: items => items.length && items[0].datasetIndex === 2 ? '' : String(items[0].parsed.x),
            label: ctx => {
              if (ctx.datasetIndex === 2) return EVENTS[ctx.dataIndex].label;
              const v = ctx.parsed.y;
              return ['Literate: ' + v.toFixed(1) + '%', 'Not literate: ' + (100 - v).toFixed(1) + '%'];
            }
          }
        }
      },
      scales: {
        x: { type: 'linear', min: 1820, max: 2025, title: { display: true, text: 'Year' },
             ticks: { stepSize: 20, callback: v => String(v) } },
        y: { min: 0, max: 100, title: { display: true, text: 'Share of people who can read' },
             ticks: { stepSize: 25, callback: v => v + '%' } }
      }
    }
  };
  if (chart) chart.destroy();
  chart = new Chart(document.getElementById('chart'), cfg);
}

// ---------- Question flow ----------
function renderQuestion() {
  const q = QUESTIONS[qIndex];
  const panel = document.getElementById('panel');
  panel.innerHTML = '';
  const pr = document.createElement('p'); pr.className = 'prompt'; pr.textContent = 'Question ' + (qIndex + 1) + ' of 3. ' + q.prompt;
  const qt = document.createElement('p'); qt.className = 'question'; qt.textContent = q.text;
  const ch = document.createElement('div'); ch.className = 'choices';
  q.choices.forEach(c => {
    const b = document.createElement('button');
    b.textContent = c;
    b.addEventListener('click', () => choose(c));
    ch.appendChild(b);
  });
  const fb = document.createElement('div'); fb.className = 'feedback'; fb.id = 'feedback';
  panel.append(pr, qt, ch, fb);
  updateControls();
}

function choose(c) {
  if (answered || done) return;
  const q = QUESTIONS[qIndex];
  const correct = q.answer();
  const ok = correct.includes(c);
  answered = true;
  if (ok) score++;
  document.querySelectorAll('#panel .choices button').forEach(b => {
    b.disabled = true;
    if (correct.includes(b.textContent)) b.classList.add('correct');
    else if (b.textContent === c) b.classList.add('wrong');
  });
  const fb = document.getElementById('feedback');
  fb.innerHTML = ok ? '<b class="ok">Right.</b> ' : '<b class="no">Not quite: ' + correct.join(' or ') + '.</b> ';
  fb.appendChild(document.createTextNode(q.explain()));
  stage = q.stage;
  buildChart();
  updateControls();
}

function next() {
  if (!answered) return;
  if (qIndex < QUESTIONS.length - 1) {
    qIndex++;
    answered = false;
    renderQuestion();
  } else {
    finish();
  }
}

function finish() {
  done = true;
  const panel = document.getElementById('panel');
  panel.innerHTML = '';
  const pass = score >= 2;
  const res = document.createElement('p');
  res.className = 'question';
  res.innerHTML = 'Predictions correct: ' + score + ' of 3. <span style="color:' + (pass ? 'darkgreen' : 'firebrick') + '">' +
    (pass ? '2 or more: you can read the shape of the great widening.' : 'Fewer than 2: reread "Literacy" and try again.') + '</span>';
  const tip = document.createElement('p'); tip.className = 'feedback';
  tip.textContent = 'Hover over any point to see its year and value, and over the two gold markers at the bottom for the events. ' +
    'Notice how flat the line is through the 19th century and how steep it becomes in the 20th. ' +
    'The dip between 1940 and 1950 most likely comes from a change of sources and definitions, not a real fall.';
  panel.append(res, tip);
  updateControls();
}

function restart() {
  qIndex = 0; answered = false; score = 0; stage = 0; done = false;
  buildChart();
  renderQuestion();
}

function updateControls() {
  document.getElementById('score').textContent = 'Predictions correct: ' + score + ' of 3';
  const nb = document.getElementById('nextBtn');
  nb.disabled = !answered || done;
  nb.textContent = qIndex < QUESTIONS.length - 1 ? 'Next question' : 'Explore the chart';
  const st = document.getElementById('status');
  if (done) st.textContent = 'Explore the chart. Restart to try the questions again.';
  else if (answered) st.textContent = 'Press ' + nb.textContent + ' to continue.';
  else st.textContent = 'Choose an answer to reveal the data.';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('restartBtn').addEventListener('click', restart);
  restart();
});
