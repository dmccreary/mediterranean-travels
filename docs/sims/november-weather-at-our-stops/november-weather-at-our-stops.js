// November Weather at Our Stops - Chart.js 4
// CANVAS_HEIGHT: 612
// Four prediction questions, each locked in before its chart is revealed,
// then free exploration of the twelve-month climate of six stops on our route.
// Data: the climate tables of each stop's English Wikipedia article,
// retrieved 2026-11-24 (station and period listed with each stop below).

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const NOV = 10; // index of November

// high = mean daily maximum (°C), low = mean daily minimum (°C), rain = mean precipitation (mm)
const STOPS = [
  { name: 'Istanbul', days: 'Days 1–5',
    station: 'Kireçburnu', period: '1991–2020 normals',
    source: 'https://en.wikipedia.org/wiki/Istanbul',
    high: [8.8, 9.4, 12.0, 16.1, 21.0, 25.7, 28.0, 28.2, 24.6, 19.9, 15.0, 10.7],
    low:  [3.6, 3.5, 4.9, 8.1, 12.8, 17.4, 20.3, 21.2, 17.4, 13.6, 9.2, 5.5],
    rain: [96.1, 87.7, 69.8, 45.1, 37.1, 44.7, 36.3, 43.5, 81.3, 98.3, 100.5, 124.8] },
  { name: 'Çanakkale', days: 'Day 6 (Troy and Gallipoli)',
    station: 'Çanakkale', period: '1991–2020 normals',
    source: 'https://en.wikipedia.org/wiki/%C3%87anakkale',
    high: [9.8, 10.5, 13.1, 17.4, 23.0, 28.4, 31.4, 31.5, 26.7, 21.1, 16.1, 11.5],
    low:  [3.6, 4.0, 5.7, 9.0, 13.7, 17.9, 20.8, 21.2, 17.1, 13.1, 8.9, 5.5],
    rain: [78.6, 76.3, 66.0, 49.0, 32.1, 27.3, 12.9, 6.8, 24.2, 67.5, 79.2, 100.4] },
  { name: 'İzmir', days: 'Day 7 (nearest major station to Ephesus)',
    station: 'İzmir', period: '1991–2020 normals',
    source: 'https://en.wikipedia.org/wiki/%C4%B0zmir',
    high: [12.7, 14.0, 17.2, 21.3, 26.5, 31.3, 33.8, 33.6, 29.5, 24.6, 18.8, 14.0],
    low:  [6.0, 6.6, 8.6, 11.8, 16.2, 20.9, 23.5, 23.7, 19.5, 15.4, 10.9, 7.7],
    rain: [127.5, 107.2, 77.8, 50.1, 32.9, 14.4, 3.0, 6.7, 23.5, 56.5, 99.6, 131.3] },
  { name: 'Rhodes', days: 'Day 8',
    station: 'Rhodes International Airport, Paradeisi', period: 'Sep 1996 – Aug 2026 averages',
    source: 'https://en.wikipedia.org/wiki/Rhodes',
    high: [15.4, 15.6, 17.4, 20.3, 24.0, 28.0, 30.6, 30.7, 28.2, 24.6, 20.8, 17.1],
    low:  [10.9, 10.8, 12.2, 14.5, 18.0, 22.1, 24.5, 25.1, 23.0, 19.3, 15.5, 12.4],
    rain: [130.3, 81.3, 55.3, 35.7, 18.7, 2.0, 0.7, 1.3, 7.9, 41.4, 97.1, 137.8] },
  { name: 'Heraklion', days: 'Day 9 (Knossos)',
    station: 'Nikos Kazantzakis Airport', period: '1991–2020 normals',
    source: 'https://en.wikipedia.org/wiki/Heraklion',
    high: [15.2, 15.3, 16.8, 20.1, 24.3, 28.5, 30.3, 30.2, 27.5, 24.0, 20.1, 16.7],
    low:  [9.4, 9.2, 10.2, 12.8, 16.2, 20.3, 22.7, 22.9, 20.4, 17.5, 14.0, 11.0],
    rain: [81.3, 60.1, 49.4, 24.2, 12.8, 4.2, 0.8, 1.2, 17.5, 43.1, 56.4, 82.2] },
  { name: 'Athens', days: 'Days 10–13',
    station: 'downtown Athens', period: '1991–2020 normals',
    source: 'https://en.wikipedia.org/wiki/Athens',
    high: [13.3, 14.2, 17.0, 21.1, 26.5, 31.6, 34.3, 34.3, 29.6, 24.4, 18.9, 14.4],
    low:  [7.1, 7.3, 9.2, 12.3, 17.0, 21.6, 24.2, 24.4, 20.4, 16.2, 12.2, 8.7],
    rain: [55.6, 44.4, 45.6, 27.6, 20.7, 11.6, 10.7, 5.4, 25.8, 38.6, 70.8, 76.3] }
];

const COLORS = {
  high: '#C0392B', highSoft: 'rgba(192, 57, 43, 0.35)',
  low: '#2E6E9E', lowSoft: 'rgba(46, 110, 158, 0.35)',
  rain: 'rgba(75, 163, 160, 0.75)', rainSoft: 'rgba(75, 163, 160, 0.30)',
  band: 'rgba(201, 162, 39, 0.16)', bandText: '#7A5E00'
};

function toF(c) { return Math.round(c * 9 / 5 + 32); }
function cf(c) { return c.toFixed(1) + ' °C (' + toF(c) + ' °F)'; }
function stop(name) { return STOPS.find(s => s.name === name); }
function argMax(a) { return a.indexOf(Math.max(...a)); }

// ---------- Answers computed from the data (see Rules in the spec) ----------
function answerQ1() {
  let best = 0;
  STOPS.forEach((s, i) => { if (s.high[NOV] < STOPS[best].high[NOV]) best = i; });
  return [STOPS[best].name];
}
function answerQ2() {
  const a = stop('Athens');
  const diff = a.rain[NOV] - a.rain[7];
  if (Math.abs(diff) < 10) return ['About the same'];
  return [diff > 0 ? 'Wetter' : 'Drier'];
}
function answerQ3() {
  const a = stop('Athens');
  const opts = { June: 5, July: 6, August: 7, September: 8 };
  const top = Math.max(...Object.values(opts).map(i => a.high[i]));
  return Object.keys(opts).filter(k => Math.abs(a.high[opts[k]] - top) < 0.05);
}
function q4Diff() { return Math.round(stop('Heraklion').high[NOV] - stop('Istanbul').low[NOV]); }
function answerQ4() {
  const d = q4Diff();
  if (d >= 15) return ['15 °C or more'];
  if (d >= 10) return ['10–14 °C'];
  if (d >= 5) return ['5–9 °C'];
  return ['0–4 °C'];
}

const QUESTIONS = [
  { prompt: 'We’ll be in all six places in November. Where should we pack the warmest layer for?',
    text: 'Which stop has the coolest November afternoons?',
    choices: STOPS.map(s => s.name), answer: answerQ1, view: 'novHighs',
    explain: () => {
      const ist = stop('Istanbul'), can = stop('Çanakkale');
      const south = STOPS.filter(s => ['İzmir', 'Rhodes', 'Heraklion', 'Athens'].includes(s.name)).map(s => s.high[NOV]);
      return 'Istanbul’s November afternoons average ' + cf(ist.high[NOV]) + ' and Çanakkale’s ' + cf(can.high[NOV]) +
             ', against ' + Math.min(...south).toFixed(1) + '–' + Math.max(...south).toFixed(1) +
             ' °C at the other four: the northern stops on the Turkish straits are cooler than the Aegean and Cretan stops.';
    } },
  { prompt: 'Many northern climates get their heaviest rain in summer. What about the Mediterranean?',
    text: 'In Athens, is November wetter or drier than August?',
    choices: ['Wetter', 'Drier', 'About the same'], answer: answerQ2, view: 'athensRain',
    explain: () => {
      const a = stop('Athens');
      return 'Athens gets ' + a.rain[NOV].toFixed(1) + ' mm of rain in an average November and only ' + a.rain[7].toFixed(1) +
             ' mm in August: the Mediterranean summer is dry, and November starts the wet season.';
    } },
  { prompt: 'The longest day of the year is June 21.',
    text: 'Which is the hottest month in Athens?',
    choices: ['June', 'July', 'August', 'September'], answer: answerQ3, view: 'athensHighs',
    explain: () => {
      const a = stop('Athens');
      const ans = answerQ3();
      const v = a.high[MONTHS.findIndex(m => ans[0].startsWith(m))];
      const which = ans.length > 1 ? ans.join(' and ') + ' tie at ' : ans[0] + ' peaks at ';
      return which + cf(v) + ' (June is ' + a.high[5].toFixed(1) + ' °C): the hottest month comes after the summer solstice, because land and sea keep warming after the longest day.';
    } },
  { prompt: 'Day 5 ends in Istanbul; Day 9 is a sunny afternoon at Knossos.',
    text: 'How much colder is a November night in Istanbul than a November afternoon in Heraklion?',
    choices: ['0–4 °C', '5–9 °C', '10–14 °C', '15 °C or more'], answer: answerQ4, view: 'istHer',
    explain: () => {
      const h = stop('Heraklion').high[NOV], l = stop('Istanbul').low[NOV];
      return 'A November afternoon in Heraklion averages ' + cf(h) + ' and a November night in Istanbul ' + cf(l) +
             ', about ' + q4Diff() + ' °C apart: a cool evening in Istanbul and a warm afternoon on Crete need different layers.';
    } }
];

// ---------- State ----------
let qIndex = 0;
let answered = false;
let score = 0;
let picks = [];
let exploring = false;
let exploreStop = 0;
let chart = null;

// ---------- November band plugin ----------
const novemberBand = {
  id: 'novemberBand',
  beforeDatasetsDraw(c, args, opts) {
    if (!opts || !opts.show) return;
    const x = c.scales.x;
    const area = c.chartArea;
    const idx = opts.index;
    const step = x.width / x.ticks.length;
    const cx = x.getPixelForValue(idx);
    const ctx = c.ctx;
    ctx.save();
    ctx.fillStyle = COLORS.band;
    ctx.fillRect(cx - step / 2, area.top, step, area.bottom - area.top);
    ctx.fillStyle = COLORS.bandText;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(opts.label || 'our month', cx, area.top + 2);
    ctx.restore();
  }
};

// Bracket for question 4: dashed lines at the two values and the gap between them.
const gapBracket = {
  id: 'gapBracket',
  afterDatasetsDraw(c, args, opts) {
    if (!opts || !opts.show) return;
    const y = c.scales.y, area = c.chartArea, ctx = c.ctx;
    const yHi = y.getPixelForValue(opts.hi), yLo = y.getPixelForValue(opts.lo);
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1.5;
    [yHi, yLo].forEach(yy => { ctx.beginPath(); ctx.moveTo(area.left, yy); ctx.lineTo(area.right, yy); ctx.stroke(); });
    ctx.setLineDash([]);
    const bx = area.left + (area.right - area.left) / 2;
    ctx.beginPath();
    ctx.moveTo(bx, yHi); ctx.lineTo(bx, yLo); ctx.stroke();
    ctx.fillStyle = 'white';
    const label = 'about ' + opts.diff + ' °C apart';
    ctx.font = 'bold 14px Arial';
    const w = ctx.measureText(label).width + 12;
    const my = (yHi + yLo) / 2;
    ctx.fillRect(bx - w / 2, my - 11, w, 22);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, bx, my);
    ctx.restore();
  }
};

Chart.register(novemberBand, gapBracket);
Chart.defaults.font.family = 'Arial, Helvetica, sans-serif';
Chart.defaults.font.size = 13;
Chart.defaults.color = '#333';

function tempTick(v) { return v + ' °C'; }
function tempTooltip(ctx) { return ctx.dataset.label + ': ' + cf(ctx.parsed.y); }

// ---------- Chart views ----------
function buildConfig(view) {
  if (view === 'novHighs') {
    const correct = answerQ1();
    return {
      type: 'bar',
      data: {
        labels: STOPS.map(s => s.name),
        datasets: [
          { label: 'November mean daily high', data: STOPS.map(s => s.high[NOV]),
            backgroundColor: STOPS.map(s => correct.includes(s.name) ? COLORS.high : COLORS.highSoft),
            borderColor: STOPS.map(s => correct.includes(s.name) ? 'black' : COLORS.high),
            borderWidth: STOPS.map(s => correct.includes(s.name) ? 2 : 1) },
          { label: 'November mean daily low', data: STOPS.map(s => s.low[NOV]),
            backgroundColor: COLORS.lowSoft, borderColor: COLORS.low, borderWidth: 1 }
        ]
      },
      options: baseOptions({ yTitle: 'Temperature', yTick: tempTick, tooltip: tempTooltip, yMin: 0, yMax: 25,
                             title: 'November afternoons (high) and nights (low) at our six stops' })
    };
  }
  if (view === 'athensRain') {
    const a = stop('Athens');
    return {
      type: 'bar',
      data: {
        labels: MONTHS,
        datasets: [{ label: 'Athens mean monthly rainfall', data: a.rain,
          backgroundColor: a.rain.map((_, i) => (i === NOV || i === 7) ? COLORS.rain : COLORS.rainSoft),
          borderColor: a.rain.map((_, i) => (i === NOV || i === 7) ? 'black' : 'rgba(75, 163, 160, 1)'),
          borderWidth: a.rain.map((_, i) => (i === NOV || i === 7) ? 2 : 1) }]
      },
      options: baseOptions({ yTitle: 'Rainfall (mm)', yTick: v => v + ' mm', yMin: 0, yMax: 100,
                             tooltip: ctx => ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + ' mm',
                             band: true, title: 'Athens: average rainfall each month (August and November outlined)' })
    };
  }
  if (view === 'athensHighs') {
    const a = stop('Athens');
    const top = answerQ3().map(m => MONTHS.findIndex(x => m.startsWith(x)));
    return {
      type: 'line',
      data: {
        labels: MONTHS,
        datasets: [{ label: 'Athens mean daily high', data: a.high, borderColor: COLORS.high, backgroundColor: COLORS.high,
          tension: 0.25, borderWidth: 3,
          pointRadius: a.high.map((_, i) => top.includes(i) ? 7 : 3),
          pointBackgroundColor: a.high.map((_, i) => top.includes(i) ? 'black' : COLORS.high) }]
      },
      options: baseOptions({ yTitle: 'Temperature', yTick: tempTick, tooltip: tempTooltip, yMin: 0, yMax: 40,
                             band: true, title: 'Athens: average afternoon high each month' })
    };
  }
  if (view === 'istHer') {
    const ist = stop('Istanbul'), her = stop('Heraklion');
    return {
      type: 'bar',
      data: {
        labels: ['Istanbul', 'Heraklion'],
        datasets: [
          { label: 'November mean daily high', data: [ist.high[NOV], her.high[NOV]],
            backgroundColor: [COLORS.highSoft, COLORS.high], borderColor: COLORS.high, borderWidth: 1 },
          { label: 'November mean daily low', data: [ist.low[NOV], her.low[NOV]],
            backgroundColor: [COLORS.low, COLORS.lowSoft], borderColor: COLORS.low, borderWidth: 1 }
        ]
      },
      options: baseOptions({ yTitle: 'Temperature', yTick: tempTick, tooltip: tempTooltip, yMin: 0, yMax: 25,
                             gap: { show: true, hi: her.high[NOV], lo: ist.low[NOV], diff: q4Diff() },
                             title: 'Istanbul and Heraklion in November' })
    };
  }
  // Explore view: one stop, twelve months
  const s = STOPS[exploreStop];
  return {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        { type: 'line', label: 'Mean daily high', data: s.high, borderColor: COLORS.high, backgroundColor: COLORS.high,
          yAxisID: 'y', tension: 0.25, borderWidth: 3, pointRadius: 3, order: 1 },
        { type: 'line', label: 'Mean daily low', data: s.low, borderColor: COLORS.low, backgroundColor: COLORS.low,
          yAxisID: 'y', tension: 0.25, borderWidth: 3, pointRadius: 3, order: 2 },
        { type: 'bar', label: 'Rainfall', data: s.rain, backgroundColor: COLORS.rainSoft, borderColor: 'rgba(75, 163, 160, 1)',
          borderWidth: 1, yAxisID: 'y1', order: 3 }
      ]
    },
    options: (() => {
      const o = baseOptions({ yTitle: 'Temperature', yTick: tempTick, yMin: 0, yMax: 40, band: true,
                              title: s.name + ' (' + s.days + '): temperature and rainfall',
                              tooltip: ctx => ctx.dataset.yAxisID === 'y1'
                                ? 'Rainfall: ' + ctx.parsed.y.toFixed(1) + ' mm'
                                : ctx.dataset.label + ': ' + cf(ctx.parsed.y) });
      o.scales.y1 = { position: 'right', min: 0, max: 160, grid: { drawOnChartArea: false },
                      title: { display: true, text: 'Rainfall (mm)' }, ticks: { callback: v => v + ' mm' } };
      return o;
    })()
  };
}

function baseOptions(p) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      title: { display: true, text: p.title, font: { size: 15, weight: 'bold' }, padding: { top: 2, bottom: 4 } },
      legend: { position: 'bottom', labels: { boxWidth: 14, font: { size: 13 } } },
      tooltip: { callbacks: { label: p.tooltip } },
      novemberBand: { show: !!p.band, index: NOV, label: 'our month' },
      gapBracket: p.gap || { show: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 13 } } },
      y: { min: p.yMin, max: p.yMax, title: { display: true, text: p.yTitle }, ticks: { callback: p.yTick } }
    }
  };
}

function showChart(view) {
  document.getElementById('placeholder').style.display = view ? 'none' : 'flex';
  if (chart) { chart.destroy(); chart = null; }
  if (!view) { setSource(null); return; }
  chart = new Chart(document.getElementById('chart'), buildConfig(view));
  setSource(view);
}

function setSource(view) {
  const el = document.getElementById('source');
  const fmt = s => s.name + ': ' + s.station + ', ' + s.period;
  let list = [];
  if (view === 'novHighs') list = STOPS;
  else if (view === 'athensRain' || view === 'athensHighs') list = [stop('Athens')];
  else if (view === 'istHer') list = [stop('Istanbul'), stop('Heraklion')];
  else if (view === 'explore') list = [STOPS[exploreStop]];
  if (view === 'novHighs') {
    el.textContent = 'Data: 1991–2020 normals for Istanbul (Kireçburnu), Çanakkale, İzmir, Heraklion (airport) and downtown Athens; ' +
                     'Rhodes airport, 1996–2026. From the climate tables in each city\u2019s Wikipedia article, retrieved November 2026.';
    return;
  }
  el.textContent = list.length
    ? 'Data: ' + list.map(fmt).join('; ') + '. From the climate tables in each city’s Wikipedia article, retrieved November 2026.'
    : '';
}

// ---------- Question flow ----------
function renderQuestion() {
  const q = QUESTIONS[qIndex];
  const panel = document.getElementById('panel');
  panel.innerHTML = '';
  const pr = document.createElement('p'); pr.className = 'prompt'; pr.textContent = 'Question ' + (qIndex + 1) + ' of 4. ' + q.prompt;
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
  showChart(null);
  updateControls();
}

function choose(c) {
  if (answered || exploring) return;
  const q = QUESTIONS[qIndex];
  const correct = q.answer();
  const ok = correct.includes(c);
  answered = true;
  if (ok) score++;
  picks[qIndex] = { pick: c, ok: ok };
  document.querySelectorAll('#panel .choices button').forEach(b => {
    b.disabled = true;
    if (correct.includes(b.textContent)) b.classList.add('correct');
    else if (b.textContent === c) b.classList.add('wrong');
  });
  const fb = document.getElementById('feedback');
  fb.innerHTML = ok ? '<b class="ok">Right.</b> ' : '<b class="no">Not quite. ' + correct.join(' or ') + '</b> — ';
  fb.appendChild(document.createTextNode(q.explain()));
  showChart(q.view);
  updateControls();
}

function next() {
  if (!answered) return;
  if (qIndex < QUESTIONS.length - 1) {
    qIndex++;
    answered = false;
    renderQuestion();
  } else {
    startExplore();
  }
}

function startExplore() {
  exploring = true;
  const panel = document.getElementById('panel');
  panel.innerHTML = '';
  const pass = score >= 3;
  const res = document.createElement('p');
  res.className = 'question';
  res.innerHTML = 'Predictions correct: ' + score + ' of 4. <span style="color:' + (pass ? 'darkgreen' : 'firebrick') + '">' +
    (pass ? '3 or more: you can read a climate chart.' : 'Fewer than 3: reread "November Weather" and try again.') + '</span>';
  const row = document.createElement('div'); row.className = 'explore-row';
  const lab = document.createElement('label'); lab.textContent = 'Explore a stop:'; lab.htmlFor = 'stopSelect';
  const sel = document.createElement('select'); sel.id = 'stopSelect';
  STOPS.forEach((s, i) => { const o = document.createElement('option'); o.value = i; o.textContent = s.name + ' — ' + s.days; sel.appendChild(o); });
  sel.value = exploreStop;
  sel.addEventListener('change', () => { exploreStop = +sel.value; showChart('explore'); });
  row.append(lab, sel);
  const tip = document.createElement('p'); tip.className = 'feedback';
  tip.textContent = 'Compare the summer rain bars with November\u2019s. The Aegean and Cretan stops are nearly rainless in summer; Istanbul, near the Black Sea, keeps some summer rain. Every stop is wetter in November than in any summer month. Hover over a month for °C and °F.';
  panel.append(res, row, tip);
  showChart('explore');
  updateControls();
}

function restart() {
  qIndex = 0; answered = false; score = 0; picks = []; exploring = false; exploreStop = 0;
  renderQuestion();
}

function updateControls() {
  document.getElementById('score').textContent = 'Predictions correct: ' + score + ' of 4';
  const nb = document.getElementById('nextBtn');
  nb.disabled = !answered || exploring;
  nb.textContent = qIndex < QUESTIONS.length - 1 ? 'Next question' : 'Explore the stops';
  const st = document.getElementById('status');
  if (exploring) st.textContent = 'Choose any stop from the list. Restart to try the questions again.';
  else if (answered) st.textContent = 'Press ' + nb.textContent + ' to continue.';
  else st.textContent = 'Choose an answer to reveal the chart.';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('restartBtn').addEventListener('click', restart);
  renderQuestion();
});
