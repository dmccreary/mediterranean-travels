// One Walk, Seven Centuries - vis-timeline
// CANVAS_HEIGHT: 506
// Nine monuments of the downhill walk through Ephesus appear one at a time, in
// walking order, each on its own row of a 300 BCE - 500 CE timeline. For
// monuments 2 to 9 the learner predicts "older" (begun earlier) or "younger"
// (begun later) than the monument just passed, then the bar appears with
// feedback. After monument 9 a reference row adds Paul's years in Ephesus and
// the riot of the silversmiths. Mastery is 6 of 8.
// Years are signed numbers: negative = BCE, positive = CE.

(function () {
    // ------------------------------------------------------------------
    // Content (walking order)
    // ------------------------------------------------------------------
    const MONUMENTS = [
        { name: 'Memmius Monument', short: 'Memmius Mon.',
          walk: 'We start in the upper city, beside Domitian Square.',
          dateText: 'late 1st century BCE', bars: [[-40, -1]], label: 'c. 40–1 BCE',
          why: 'A monument to a grandson of Sulla, from the reign of Augustus.' },
        { name: 'Gate of Hercules', short: 'Gate of Hercules',
          walk: 'Next, at the top of Curetes Street.',
          dateText: '4th–5th century CE, built with older reliefs', bars: [[350, 450]], label: 'c. 350–450 CE',
          why: 'A late-antique gate built of older carved blocks.' },
        { name: 'Fountain of Trajan', short: 'Fountain of Trajan',
          walk: 'Next, a little way down Curetes Street.',
          dateText: 'early 2nd century CE', bars: [[102, 114]], label: 'c. 102–114 CE',
          why: 'Built under Trajan, more than two centuries before the gate we just passed.' },
        { name: 'Temple of Hadrian', short: 'Temple of Hadrian',
          walk: 'Next, on the north side of Curetes Street.',
          dateText: 'dedicated before 138 CE', bars: [[117, 138]], label: 'c. 117–138 CE',
          why: 'Dedicated to Hadrian, Trajan’s successor.' },
        { name: 'Terrace House 2', short: 'Terrace House 2',
          walk: 'Next, across the street, up the slope on the south side.',
          dateText: '1st century BCE to 3rd century CE', bars: [[-25, 270]], label: 'c. 25 BCE – 270 CE',
          why: 'The houses were begun more than a century before the temple and lived in until earthquakes in the 3rd century.' },
        { name: 'Library of Celsus', short: 'Library of Celsus',
          walk: 'Next, at the foot of Curetes Street.',
          dateText: 'begun c. 110 CE', bars: [[110, 125]], label: 'begun c. 110 CE (end date uncertain)', labelLeft: true,
          why: 'Begun around 110 CE, long after the first terrace houses.' },
        { name: 'Gate of Mazaeus and Mithridates', row: 'Mazaeus-Mithridates Gate', short: 'Gate of Mazaeus',
          walk: 'Next, right beside the library.',
          dateText: '4–3 BCE', bars: [[-4, -3]], label: 'c. 4–3 BCE',
          why: 'Built under Augustus, more than a century before the library beside it.' },
        { name: 'Great Theater', short: 'Great Theater',
          walk: 'Next, at the end of Marble Street.',
          dateText: 'first built 3rd century BCE; rebuilt 1st–2nd century CE', bars: [[-290, -250], [41, 117]],
          label: 'c. 290–250 BCE', label2: 'rebuilt c. 41–117 CE',
          why: 'Its first, Hellenistic building is about three centuries older than the gate; the Roman rebuilding came later.' },
        { name: 'Harbor Street (Arcadiane)', short: 'Harbor Street',
          walk: 'Last, the colonnaded street from the theater toward the old harbor.',
          dateText: 'rebuilt c. 400 CE', bars: [[395, 408]], label: 'rebuilt c. 395–408 CE',
          why: 'Rebuilt under the emperor Arcadius, who reigned 395–408 CE.' }
    ];
    const MASTERY = 6;
    const TOTAL = MONUMENTS.length - 1;   // eight predictions
    const AXIS_START = -300, AXIS_END = 500;
    const YEAR_MS = 365.25 * 24 * 3600 * 1000;

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    // Signed year -> Date. BCE year n is placed at astronomical year -n; the
    // one-year shift is invisible at this scale, and no label ever reads "year 0".
    function toDate(y) {
        const d = new Date(2000, 0, 1, 0, 0, 0);
        d.setFullYear(y);
        return d;
    }
    function axisLabel(date) {
        const y = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
        if (y < AXIS_START || y >= AXIS_END) return '';
        // Drop tick labels that would be cut off at either edge of the window
        if (drawn) {
            const win = timeline.getWindow();
            const yearsPerPx = (win.end - win.start) / YEAR_MS / Math.max(100, container.clientWidth - (narrow() ? 112 : 206));
            if (y < win.start.getFullYear() || win.end.getFullYear() - y < 58 * yearsPerPx) return '';
        }
        if (y === 0) return 'BCE | CE';
        return y < 0 ? (-y) + ' BCE' : y + ' CE';
    }
    function startYear(i) { return MONUMENTS[i].bars[0][0]; }
    function answerFor(i) { return startYear(i) < startYear(i - 1) ? 'older' : 'younger'; }
    const $ = id => document.getElementById(id);

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    let current = 0;        // monument index in view
    let revealed = 0;       // monuments 0..revealed-1 have bars
    let answered = true;    // item 1 needs no prediction
    let results = {};       // index -> { pred, ok }
    let score = 0;
    let finished = false;

    // ------------------------------------------------------------------
    // Timeline
    // ------------------------------------------------------------------
    const container = $('timeline');
    const groups = new vis.DataSet();
    const items = new vis.DataSet();
    const narrow = () => window.innerWidth < 560;

    const options = {
        width: '100%',
        orientation: 'top',
        stack: false,
        groupOrder: 'order',
        margin: { item: { horizontal: 0, vertical: 6 }, axis: 4 },
        min: toDate(-420),
        max: toDate(620),
        zoomMin: 40 * YEAR_MS,
        zoomMax: 1040 * YEAR_MS,
        zoomable: false,
        moveable: true,
        selectable: false,
        showCurrentTime: false,
        showMajorLabels: false,
        groupHeightMode: 'fixed',
        timeAxis: { scale: 'year', step: 100 },
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        format: {
            minorLabels: function (date) { return axisLabel(date); },
            majorLabels: function () { return ''; }
        }
    };

    let drawn = false;
    const FULL = [toDate(AXIS_START - 25), toDate(AXIS_END + 25)];
    options.onInitialDrawComplete = function () {
        drawn = true;
        timeline.setWindow(FULL[0], FULL[1], { animation: false });
    };
    const timeline = new vis.Timeline(container, items, groups, options);

    // Vertical wheel scrolls the page; horizontal wheel pans the timeline.
    container.addEventListener('wheel', function (e) {
        const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if (!isHorizontal) {
            e.stopImmediatePropagation();
        } else {
            e.preventDefault();
            const win = timeline.getWindow();
            const shift = (e.deltaX / container.clientWidth) * (win.end - win.start);
            timeline.setWindow(new Date(win.start.valueOf() + shift),
                               new Date(win.end.valueOf() + shift), { animation: false });
        }
    }, true);

    // Tick step that leaves room for labels such as "300 BCE"
    const STEPS = [5, 10, 20, 25, 50, 100, 200];
    let currentStep = 100;
    function updateAxis() {
        if (!drawn) return;
        const win = timeline.getWindow();
        const years = (win.end - win.start) / YEAR_MS;
        const px = container.clientWidth - (narrow() ? 112 : 206);
        const step = STEPS.find(st => (st / years) * px >= 52) || 200;
        if (step !== currentStep) {
            currentStep = step;
            timeline.setOptions({ timeAxis: { scale: 'year', step: step } });
        }
    }
    timeline.on('rangechanged', updateAxis);
    window.addEventListener('resize', function () { updateAxis(); refresh(); });

    function zoom(factor) {
        const win = timeline.getWindow();
        const mid = (win.start.valueOf() + win.end.valueOf()) / 2;
        const half = (win.end - win.start) * factor / 2;
        timeline.setWindow(new Date(mid - half), new Date(mid + half), { animation: true });
    }
    $('zoom-in').onclick = () => zoom(0.5);
    $('zoom-out').onclick = () => zoom(2);
    $('full-span').onclick = () => timeline.setWindow(FULL[0], FULL[1], { animation: true });

    // ------------------------------------------------------------------
    // Rendering
    // ------------------------------------------------------------------
    function groupLabel(i) {
        const M = MONUMENTS[i];
        const r = results[i];
        let mark = '';
        if (r) mark = r.ok ? ' <span class="ok">✓</span>' : ' <span class="no">✗</span>';
        return (i + 1) + '. ' + (narrow() ? M.short : (M.row || M.name)) + mark;
    }

    // Labels for bars that end late in the axis sit to the left of the bar
    function bar(id, group, s, e, text, cls, title, forceLeft) {
        const left = forceLeft || s > 150;
        items.add({ id: id, group: group, type: 'range', start: toDate(s), end: toDate(e === s ? e + 1 : e),
                    content: '<span>' + text + '</span>', className: 'bar' + (left ? ' label-left' : '') + (cls || ''),
                    title: title });
    }

    function refresh() {
        groups.clear();
        items.clear();
        MONUMENTS.forEach((M, i) => {
            let cls = '';
            if (i < revealed) cls = 'seen';
            if (!finished && i === current) cls = 'current';
            else if (!finished && i === current - 1) cls = 'prev';
            groups.add({ id: 'm' + i, content: groupLabel(i), order: i, className: cls });
        });
        // The reference row is always there (empty until the end), so the height never changes
        groups.add({ id: 'ref', content: narrow() ? 'Paul, for reference' : 'For reference: Paul', order: 99,
                     className: finished ? 'ref' : '' });

        for (let i = 0; i < revealed; i++) {
            const M = MONUMENTS[i];
            let cls = '';
            if (!finished && i === current - 1) cls = ' prevbar';
            if (!finished && i === current && answered && i > 0) cls = ' curbar';
            const tip = '<b>' + M.name + '</b><br>' + M.dateText + '<br>' + M.why;
            bar('b' + i, 'm' + i, M.bars[0][0], M.bars[0][1], M.label, cls, tip, M.labelLeft);
            if (M.bars[1]) bar('b' + i + 'x', 'm' + i, M.bars[1][0], M.bars[1][1], M.label2, cls, tip);
        }
        if (finished) {
            bar('paul', 'ref', 52, 55, 'Paul in Ephesus, c. 52–55 CE', ' ref',
                'Paul based in Ephesus, about 52 to 55 CE (Chapter 9).', true);
            items.add({ id: 'riot', group: 'ref', type: 'point', start: toDate(55), className: 'riot',
                        content: 'riot, c. 55 CE', title: 'The riot of the silversmiths in the theater (Acts 19), about 55 CE.' });
        }
    }

    function updateScore() {
        $('score').textContent = 'Correct: ' + score + ' of ' + TOTAL;
    }

    function renderPanel() {
        const M = MONUMENTS[current];
        const btnO = $('btn-older'), btnY = $('btn-younger'), next = $('btn-next'), again = $('btn-again');
        btnO.className = ''; btnY.className = '';
        again.style.display = 'none';
        if (finished) {
            $('step').textContent = 'The whole walk';
            $('question').innerHTML = 'You compared ' + score + ' of 8 correctly. Mastery is 6.';
            btnO.style.display = btnY.style.display = next.style.display = 'none';
            again.style.display = '';
            $('feedback').innerHTML = (score >= MASTERY ? '<span class="good">Mastery reached.</span> ' : '<span class="bad">Not yet.</span> ') +
                'Read the rows top to bottom: the walk zigzags across about seven centuries, from about 290 BCE to about 450 CE. ' +
                'The purple row shows Paul’s years: the riot filled a theater that was still being rebuilt. ' +
                'Drag the timeline, or zoom, to compare bars.';
            return;
        }
        $('step').textContent = 'Stop ' + (current + 1) + ' of ' + MONUMENTS.length;
        if (current === 0) {
            $('question').innerHTML = M.name + ', ' + M.dateText + '. <span class="walk">' + M.walk + '</span>';
            btnO.style.display = btnY.style.display = 'none';
            next.style.display = '';
            next.disabled = false;
            $('feedback').innerHTML = 'Its bar is on the timeline. Walking downhill, is the next monument older or younger? ' +
                'Press <b>Walk on</b> to meet it.';
            return;
        }
        const prev = MONUMENTS[current - 1];
        $('question').innerHTML = M.name + ': older or younger than the ' + prev.name + '? <span class="walk">' + M.walk + '</span>';
        btnO.style.display = btnY.style.display = '';
        next.style.display = '';
        btnO.disabled = btnY.disabled = answered;
        next.disabled = !answered;
        next.textContent = current < MONUMENTS.length - 1 ? 'Walk on' : 'See the whole walk';
        if (!answered) {
            $('feedback').innerHTML = '<span style="color:#5d6d78">Compare when each was <i>begun</i>. The gold bar is the ' +
                prev.name + ', ' + prev.dateText + '.</span>';
        } else {
            const r = results[current];
            (r.pred === 'older' ? btnO : btnY).className = r.ok ? 'chosen-ok' : 'chosen-bad';
            $('feedback').innerHTML = (r.ok ? '<span class="good">Correct.</span> '
                                            : '<span class="bad">Not quite: this one is ' + answerFor(current) + '.</span> ') +
                '<b>' + M.dateText.charAt(0).toUpperCase() + M.dateText.slice(1) + '.</b> ' + M.why;
        }
    }

    function render() { refresh(); renderPanel(); updateScore(); }

    // ------------------------------------------------------------------
    // Actions
    // ------------------------------------------------------------------
    function predict(p) {
        if (finished || answered || current === 0) return;
        const ok = (p === answerFor(current));
        if (ok) score++;
        results[current] = { pred: p, ok: ok };
        answered = true;
        revealed = current + 1;
        render();
    }

    function walkOn() {
        if (finished || !answered) return;
        if (current < MONUMENTS.length - 1) {
            current++;
            answered = false;
        } else {
            finished = true;
        }
        render();
    }

    function restart() {
        current = 0; revealed = 1; answered = true; results = {}; score = 0; finished = false;
        timeline.setWindow(FULL[0], FULL[1], { animation: false });
        render();
    }

    $('btn-older').onclick = () => predict('older');
    $('btn-younger').onclick = () => predict('younger');
    $('btn-next').onclick = walkOn;
    $('btn-again').onclick = restart;
    document.addEventListener('keydown', function (e) {
        const k = e.key.toLowerCase();
        if (k === 'o') predict('older');
        else if (k === 'y') predict('younger');
        else if (e.key === 'Enter') walkOn();
    });

    restart();
    window.walkSim = { predict: predict, walkOn: walkOn, restart: restart, answerFor: answerFor };
})();
