// Tutoring Effect Size Explorer - Plotly.js
// CANVAS_HEIGHT: 564
// Two normal curves on a common axis of test scores in standard deviations:
// the conventional class (mean 0, SD 1), fixed, and the program group (mean d,
// SD 1). For each of five reported effect sizes the learner types a predicted
// percentile, 100 * Phi(d), then presses Check; the program curve slides to d
// and the share of the conventional class below the program mean is shaded.
// Within 5 points counts as correct; two attempts each, only the first scored
// (mastery 4 of 5). After result 5 a free-exploration slider unlocks.

document.addEventListener('DOMContentLoaded', function () {

    const RESULTS = [
        { study: 'Bloom’s studies, one-on-one tutoring with mastery learning (1984)', d: 2.00,
          wrong: 'Two standard deviations above the middle leaves only about 2 percent of the class higher, so the average tutored student outscores about 98 percent.' },
        { study: 'Bloom’s studies, mastery learning in a class (1984)', d: 1.00,
          wrong: 'One standard deviation above the middle is the 84th percentile: about a third of the class lies between the mean and one standard deviation.' },
        { study: 'VanLehn’s review, human tutoring (2011)', d: 0.79,
          wrong: 'A bit less than one standard deviation gives a bit less than 84: about the 79th percentile.' },
        { study: 'Nickow, Oreopoulos, and Quan’s review of randomized school tutoring trials (2020)', d: 0.37,
          wrong: 'About a third of a standard deviation moves the average student from the 50th to about the 64th percentile, a real gain.',
          extra: 'A later version of this review reports about 0.29, near the 61st percentile.' },
        { study: 'Nigeria after-school AI tutor pilot, six weeks (World Bank)', d: 0.30,
          wrong: 'Three-tenths of a standard deviation moves the average student to about the 62nd percentile, from a six-week program.' }
    ];
    const MASTERY = 4;
    const TOL = 5;

    // Standard normal CDF, via the Abramowitz and Stegun 7.1.26 erf approximation (error < 1.5e-7)
    function erf(x) {
        const s = x < 0 ? -1 : 1;
        x = Math.abs(x);
        const t = 1 / (1 + 0.3275911 * x);
        const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
        return s * y;
    }
    const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
    const pct = d => Math.round(1000 * Phi(d)) / 10;          // model percentile, to 0.1
    const pdf = (x, m) => Math.exp(-0.5 * (x - m) * (x - m)) / Math.sqrt(2 * Math.PI);
    const fmt1 = v => v.toFixed(1);

    const $ = id => document.getElementById(id);
    const X0 = -3.6, X1 = 5.6, NPTS = 369;
    const XS = [];
    for (let i = 0; i < NPTS; i++) XS.push(X0 + (X1 - X0) * i / (NPTS - 1));

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    let idx = 0, score = 0, tries = 0, resolved = false, finished = false;
    let curD = 0;               // where the program curve is drawn
    let showPct = true;         // percentile number visible?
    let anim = null;
    const firstOK = {};

    // ------------------------------------------------------------------
    // Plot
    // ------------------------------------------------------------------
    const plotDiv = $('plot');
    function traces(d) {
        const shadeX = XS.filter(x => x <= d).concat([d]);
        const shadeY = shadeX.map(x => pdf(x, 0));
        const t = [
            { x: shadeX, y: shadeY, type: 'scatter', mode: 'lines', fill: 'tozeroy', line: { width: 0 },
              fillcolor: 'rgba(31,95,168,0.22)', name: 'Below the program mean', hoverinfo: 'skip' },
            { x: XS, y: XS.map(x => pdf(x, 0)), type: 'scatter', mode: 'lines', line: { color: '#5d6d78', width: 2.5 },
              name: 'Conventional class', hovertemplate: 'Conventional class<br>score %{x:.2f} SD<extra></extra>' },
            { x: XS, y: XS.map(x => pdf(x, d)), type: 'scatter', mode: 'lines', line: { color: '#1f5fa8', width: 3 },
              name: 'Program group', hovertemplate: 'Program group<br>score %{x:.2f} SD<extra></extra>' }
        ];
        if (finished) {
            t.push({ x: RESULTS.map(r => r.d), y: RESULTS.map(() => 0.012), type: 'scatter', mode: 'markers+text',
                     marker: { symbol: 'triangle-up', size: 11, color: '#c8963e' },
                     text: RESULTS.map((r, i) => String(i + 1)),
                     textposition: ['top center', 'top right', 'top center', 'top right', 'top left'],
                     textfont: { size: 11, color: '#7a5a1e' }, name: 'Five results',
                     hovertemplate: RESULTS.map((r, i) => 'Result ' + (i + 1) + ': d = ' + r.d.toFixed(2) +
                         ', percentile ' + fmt1(pct(r.d)) + '<extra></extra>') });
        }
        return t;
    }
    function layout(d) {
        const narrow = plotDiv.clientWidth < 520;
        return {
            margin: { l: 44, r: 14, t: narrow ? 8 : 30, b: 40 },
            height: 290,
            paper_bgcolor: '#fff', plot_bgcolor: '#fff',
            showlegend: !narrow,
            legend: { orientation: 'h', x: 0, xanchor: 'left', y: 1.0, yanchor: 'bottom', font: { size: 11 } },
            xaxis: { range: [X0, X1], title: { text: 'Test score, in standard deviations from the conventional class mean', font: { size: 12 } },
                     dtick: 1, zeroline: false, gridcolor: '#eef1f3', fixedrange: true },
            yaxis: { range: [0, 0.5], showticklabels: false, title: { text: 'Share of students', font: { size: 12 } },
                     gridcolor: '#eef1f3', fixedrange: true },
            shapes: [
                { type: 'line', x0: 0, x1: 0, y0: 0, y1: 0.4, line: { color: '#5d6d78', width: 1, dash: 'dot' } },
                { type: 'line', x0: d, x1: d, y0: 0, y1: 0.42, line: { color: '#1f5fa8', width: 2, dash: 'dash' } }
            ],
            annotations: [
                { x: d, y: 0.435, text: 'd = ' + d.toFixed(2), showarrow: false, font: { size: 12, color: '#1f5fa8' } },
                { x: X0 + 0.15, y: 0.495, xanchor: 'left', yanchor: 'top', showarrow: false, align: 'left',
                  text: '<b>Percentile: ' + (showPct ? fmt1(pct(d)) : '?') + '</b><br>' +
                        '<span style="font-size:11px">of the class below the program mean</span>',
                  font: { size: 14, color: '#1d2a33' }, bgcolor: 'rgba(255,255,255,0.9)' }
            ]
        };
    }
    const config = { displayModeBar: false, responsive: true };
    function draw(d) { Plotly.react(plotDiv, traces(d), layout(d), config); }
    Plotly.newPlot(plotDiv, traces(0), layout(0), config);

    function slideTo(target, done) {
        if (anim) cancelAnimationFrame(anim);
        const start = curD, t0 = performance.now(), dur = 700;
        function step(now) {
            const k = Math.min(1, (now - t0) / dur);
            const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            curD = start + (target - start) * e;
            draw(curD);
            if (k < 1) anim = requestAnimationFrame(step);
            else { anim = null; curD = target; draw(curD); if (done) done(); }
        }
        anim = requestAnimationFrame(step);
    }

    // ------------------------------------------------------------------
    // Cards
    // ------------------------------------------------------------------
    const guess = $('guess'), elFeedback = $('feedback');
    const btnCheck = $('check-btn'), btnNext = $('next-btn');
    const slider = $('d-slider'), explore = $('explore');

    function updateScore() { $('score').textContent = score + ' of 5 within 5 points on the first attempt'; }

    function setExplore(on) {
        slider.disabled = !on;
        explore.classList.toggle('locked', !on);
        explore.title = on ? '' : 'Unlocks after result 5';
    }

    function renderResult() {
        const r = RESULTS[idx];
        tries = 0; resolved = false;
        $('c-count').textContent = 'Result ' + (idx + 1) + ' of 5';
        $('c-d').textContent = 'd = ' + r.d.toFixed(2) + ' SD';
        $('c-study').textContent = r.study;
        $('c-q').textContent = 'Where does the average tutored student land in the conventional class? Type the percentile you predict.';
        guess.disabled = false;
        guess.value = '';
        btnCheck.disabled = false;
        btnNext.disabled = true;
        btnNext.textContent = idx < RESULTS.length - 1 ? 'Next result →' : 'Explore freely →';
        elFeedback.innerHTML = '<span class="muted">Predict before the curves move. Within 5 points counts; two attempts, only the first is scored.</span>';
        showPct = true;          // at d = 0 the percentile, 50.0, gives nothing away
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        curD = 0;
        draw(0);
        if (idx > 0) guess.focus({ preventScroll: true });
    }

    function check() {
        if (finished || resolved) return;
        const v = guess.value.trim();
        const p = Number(v);
        if (v === '' || !Number.isInteger(p) || p < 0 || p > 100) {
            elFeedback.innerHTML = '<span class="bad">Type a whole number from 0 to 100.</span>';
            return;
        }
        const r = RESULTS[idx];
        const P = pct(r.d);
        tries++;
        const ok = Math.abs(p - P) <= TOL;
        if (ok) {
            if (tries === 1) { score++; firstOK[idx] = true; }
            resolved = true;
            showPct = true;
            elFeedback.innerHTML = '<span class="good">Correct:</span> an effect of ' + r.d.toFixed(2) +
                ' standard deviations puts the average student above ' + fmt1(P) + ' percent of the conventional class. ' +
                'You said ' + p + '.' + (tries > 1 ? ' <span class="muted">(Second attempt: not counted.)</span>' : '');
        } else if (tries === 1) {
            showPct = false;
            elFeedback.innerHTML = '<span class="bad">Not within 5 points (you said ' + p + ').</span> ' + r.wrong +
                (r.extra ? ' ' + r.extra : '') + ' <span class="muted">One more try.</span>';
            guess.value = '';
        } else {
            resolved = true;
            showPct = true;
            elFeedback.innerHTML = '<span class="bad">Missed (you said ' + p + ').</span> The model percentile is <b>' + fmt1(P) +
                '</b>. ' + r.wrong + (r.extra ? ' ' + r.extra : '');
        }
        updateScore();
        if (resolved) {
            guess.disabled = true;
            btnCheck.disabled = true;
            btnNext.disabled = false;
        }
        slideTo(r.d);
    }

    function showFinal() {
        finished = true;
        $('c-count').textContent = 'All five results';
        $('c-d').textContent = '';
        $('c-study').textContent = 'First attempt: ' + score + ' of 5 within 5 points.';
        $('c-q').textContent = '';
        guess.disabled = true;
        guess.value = '';
        btnCheck.disabled = true;
        btnNext.disabled = true;
        btnNext.textContent = 'Done';
        elFeedback.innerHTML = (score >= MASTERY ? '<span class="good">Mastery reached.</span> '
                                                 : '<span class="bad">Mastery is 4 of 5.</span> Press Restart to try again. ') +
            'Free exploration is on: move d with the slider. The gold markers show the five results. ' +
            'Notice that 0 to 1 adds 34 percentile points, while 1 to 2 adds only about 14.';
        setExplore(true);
        showPct = true;
        slider.value = String(curD);
        onSlide();
    }

    function onSlide() {
        if (!finished) return;
        const d = Number(slider.value);
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        curD = d;
        $('d-val').textContent = 'd = ' + d.toFixed(2) + ' SD';
        $('pct-val').textContent = 'Percentile: ' + fmt1(pct(d));
        draw(d);
    }
    slider.addEventListener('input', onSlide);

    btnCheck.onclick = check;
    guess.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    btnNext.onclick = () => {
        if (!resolved || finished) return;
        if (idx < RESULTS.length - 1) { idx++; renderResult(); }
        else showFinal();
    };
    $('restart-btn').onclick = restart;

    function restart() {
        idx = 0; score = 0; finished = false;
        for (const k in firstOK) delete firstOK[k];
        updateScore();
        setExplore(false);
        slider.value = '0';
        $('d-val').textContent = 'd = 0.00 SD';
        $('pct-val').textContent = 'Percentile: 50.0';
        renderResult();
    }

    // A little state for headless testing
    window.effectSize = {
        guess: v => { guess.value = String(v); check(); }, next: () => btnNext.onclick(), score: () => score,
        model: i => pct(RESULTS[i].d),
        playAll: missEvery => {
            for (let i = 0; i < RESULTS.length; i++) {
                const P = Math.round(pct(RESULTS[idx].d));
                if (missEvery && idx % missEvery === 0) { guess.value = String(Math.max(0, P - 20)); check(); }
                guess.value = String(P); check();
                btnNext.onclick();
            }
        },
        slide: d => { slider.value = String(d); onSlide(); }
    };

    restart();
});
