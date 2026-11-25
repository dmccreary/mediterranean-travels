// Knossos From Village to Decipherment - vis-timeline
// CANVAS_HEIGHT: 676
// A to-scale timeline from 7000 BCE to 2030 CE in two bands, "Bronze Age
// Crete" and "Rediscovery". Only the first village shows at the start. Four
// prediction questions, in a fixed order and answered once each, are locked in
// before the events they ask about appear; after each answer the listed events
// and a labeled gap ("c. 150 years", "52 years") are added. In the full view
// the two clusters of events collapse into one bar each, which a click opens.
// Zoom with the buttons only; the mouse wheel scrolls the page.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data (years are signed: negative = BCE)
    // ------------------------------------------------------------------
    const EVENTS = [
        { n: 1, y: -7000, when: 'c. 7000 BCE', band: 'bronze', short: 'First village',
          desc: 'A farming village on the Kephala hill, one of the oldest settlements in Europe.' },
        { n: 2, y: -1900, when: 'c. 1900 BCE', band: 'bronze', short: 'First palace',
          desc: 'The first palace is built around the central court.' },
        { n: 3, y: -1700, when: 'c. 1700 BCE', band: 'bronze', short: 'Second palace',
          desc: 'After earthquake damage, the palace is rebuilt on a grander scale.' },
        { n: 4, y: -1700, when: 'c. 1700 BCE', band: 'bronze', short: 'Phaistos Disc',
          desc: 'The stamped clay disc is made at Phaistos.' },
        { n: 5, y: -1600, when: 'c. 1600 BCE', band: 'bronze', short: 'Thera erupts',
          desc: 'Akrotiri is buried; Minoan Crete is weakened but carries on.' },
        { n: 6, y: -1600, when: 'c. 1600 BCE', band: 'bronze', short: 'Snake Goddesses',
          title: 'Snake Goddess figurines',
          desc: 'The faience figures later found in the Temple Repositories are made.' },
        { n: 7, y: -1450, when: 'c. 1450 BCE', band: 'bronze', short: 'Mycenaeans at Knossos',
          desc: 'Most Minoan palaces are destroyed; Greek speakers rule Knossos and write Linear B.' },
        { n: 8, y: -1375, when: 'c. 1375 BCE', band: 'bronze', short: 'Knossos burns',
          desc: 'The palace is destroyed by fire; the fire bakes the Linear B tablets.' },
        { n: 9, y: -1200, when: 'c. 1200 BCE', band: 'bronze', short: 'Mainland palaces fall',
          desc: 'Pylos and other palaces burn in the Bronze Age collapse; Linear B ends.' },
        { n: 10, y: 1878, when: '1878', band: 'redisc', short: 'Kalokairinos digs',
          desc: 'Minos Kalokairinos finds the storerooms and their giant jars.' },
        { n: 11, y: 1900, when: '1900', band: 'redisc', short: 'Evans begins',
          desc: 'Arthur Evans begins excavating; the Throne Room and the first tablets are found.' },
        { n: 12, y: 1903, when: '1903', band: 'redisc', short: 'Snake Goddesses found',
          desc: 'Evans finds the faience figurines in the Temple Repositories.' },
        { n: 13, y: 1908, when: '1908', band: 'redisc', short: 'Phaistos Disc found',
          desc: 'Luigi Pernier finds the disc at Phaistos.' },
        { n: 14, y: 1905, end: 1930, when: 'c. 1905–1930', band: 'redisc', short: 'Evans reconstructions',
          desc: 'Parts of the palace are rebuilt, mainly in reinforced concrete from the 1920s.' },
        { n: 15, y: 1952, when: '1952', band: 'redisc', short: 'Linear B is read',
          desc: 'Michael Ventris shows that Linear B writes Greek.' },
        { n: 16, y: 2025, when: '2025', band: 'redisc', short: 'UNESCO listing',
          desc: 'The Minoan palatial centres of Crete, including Knossos, become a World Heritage Site.' }
    ];

    // Labeled gaps, each shown once its two events are on the timeline
    const GAPS = [
        { id: 'g1', from: 5, to: 7, band: 'bronze', label: 'c. 150 years' },
        { id: 'g2', from: 8, to: 9, band: 'bronze', label: 'c. 175 years' },
        { id: 'g3', from: 11, to: 15, band: 'redisc', label: '52 years' }
    ];

    const QUESTIONS = [
        { q: 'Did the Thera eruption come before or after most Minoan palaces were destroyed?',
          choices: ['Before', 'At the same time', 'After'], correct: 0,
          reason: 'Thera erupted about 1600 BCE; most palaces fell about 1450 BCE, so the eruption weakened Crete but did not end it.',
          reveal: [5, 7], view: 'bronze' },
        { q: 'About how many years separate the Thera eruption and the destruction of most Minoan palaces?',
          choices: ['About 10', 'About 150', 'About 500'], correct: 1,
          reason: '1600 − 1450 = about 150 years, several generations.',
          reveal: [2, 3, 4, 6], view: 'bronze' },
        { q: 'Did Knossos burn before, at the same time as, or after the mainland palaces such as Pylos?',
          choices: ['Before', 'At the same time', 'After'], correct: 0,
          reason: 'Knossos burned about 1375 BCE in the usual dating, more than a century before the mainland palaces fell around 1200 BCE.',
          reveal: [8, 9], view: 'bronze' },
        { q: 'How many years passed between Evans finding the first tablets and Ventris reading them?',
          choices: ['About 5', 'About 50', 'About 150'], correct: 1,
          reason: 'Evans found tablets in 1900; Ventris read them in 1952: 52 years, about 50.',
          reveal: [10, 11, 12, 13, 14, 15, 16], view: 'redisc' }
    ];
    const MASTERY = 3;
    const PROMPTS = [
        'Before we fill this in: what came first, the volcano or the fall?',
        'Now judge the spacing: how far apart are the volcano and the fall?',
        'Two fires baked the tablets. Which came first?',
        'The tablets are in the ground. How long until someone reads them?'
    ];

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    // Signed year -> Date. BCE year n is placed at astronomical year -n; the
    // one-year shift is invisible at this scale.
    function toDate(y) {
        const d = new Date(2000, 0, 1, 0, 0, 0);
        d.setFullYear(y);
        return d;
    }
    const YEAR_MS = 365.25 * 24 * 3600 * 1000;
    const evByN = n => EVENTS.find(e => e.n === n);
    const $ = id => document.getElementById(id);
    const narrow = () => window.innerWidth < 560;
    const fmtYear = y => (y === 0 ? 'BCE | CE' : y < 0 ? (-y) + ' BCE' : y + ' CE');

    const VIEWS = {
        full: [toDate(-7800), toDate(2700)],
        bronze: [toDate(-2020), toDate(-1060)],
        redisc: [toDate(1840), toDate(2050)]
    };
    const FAR_YEARS = 2500;   // views wider than this collapse each band into one bar

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    let qIndex = 0, score = 0, answered = false, finished = false;
    let shown = new Set([1]);
    let fresh = [];          // events added by the latest answer (highlighted)
    let currentEv = 0;

    // ------------------------------------------------------------------
    // Timeline
    // ------------------------------------------------------------------
    const container = $('timeline');
    const groups = new vis.DataSet([
        { id: 'bronze', content: narrow() ? 'Bronze Age<br>Crete' : 'Bronze Age Crete', order: 0, className: 'bronze' },
        { id: 'redisc', content: 'Rediscovery', order: 1, className: 'redisc' }
    ]);
    const items = new vis.DataSet();

    let drawn = false;
    function axisLabel(date) {
        const y = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
        if (y < -7000 || y > 2030) return '';
        if (drawn) {
            const win = timeline.getWindow();
            const px = Math.max(150, container.clientWidth - (narrow() ? 90 : 140));
            const yearsPerPx = (win.end - win.start) / YEAR_MS / px;
            if (y < win.start.getFullYear() || win.end.getFullYear() - y < 60 * yearsPerPx) return '';
        }
        return fmtYear(y);
    }
    const options = {
        width: '100%',
        height: '220px',
        orientation: 'top',
        stack: true,
        groupOrder: 'order',
        margin: { item: { horizontal: 2, vertical: 4 }, axis: 4 },
        min: toDate(-7900),
        max: toDate(2800),
        zoomMin: 60 * YEAR_MS,
        zoomMax: 10700 * YEAR_MS,
        zoomable: false,        // zoom with the buttons only
        moveable: true,
        selectable: true,
        showCurrentTime: false,
        showMajorLabels: false,
        timeAxis: { scale: 'year', step: 1000 },
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        xss: { disabled: false, filterOptions: { whiteList: { span: ['class'], b: [], br: [] } } },
        format: {
            minorLabels: function (date) { return axisLabel(date); },
            majorLabels: function () { return ''; }
        }
    };
    let lastView = VIEWS.full;
    options.onInitialDrawComplete = function () {
        drawn = true;
        timeline.setWindow(lastView[0], lastView[1], { animation: false });
        updateAxis();
        refresh();
    };
    const timeline = new vis.Timeline(container, items, groups, options);

    function viewYears() {
        const w = drawn ? timeline.getWindow() : { start: lastView[0], end: lastView[1] };
        return (w.end - w.start) / YEAR_MS;
    }
    function isFar() { return viewYears() > FAR_YEARS; }

    // Tick step that leaves room for labels such as "1500 BCE"
    const STEPS = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000];
    let currentStep = 1000;
    function updateAxis() {
        if (!drawn) return;
        const px = Math.max(150, container.clientWidth - (narrow() ? 90 : 140));
        const step = STEPS.find(st => (st / viewYears()) * px >= 64) || 2000;
        if (step !== currentStep) {
            currentStep = step;
            timeline.setOptions({ timeAxis: { scale: 'year', step: step } });
        }
        container.classList.toggle('compact', narrow());
    }

    function eventItem(ev) {
        const cls = ['ev', ev.band];
        if (fresh.includes(ev.n)) cls.push('new');
        const title = ev.title || ev.short;
        const it = {
            id: 'e' + ev.n, group: ev.band, start: toDate(ev.y),
            content: '<span class="num">' + ev.n + '</span><span class="txt">' + ev.short + '</span>',
            title: '<b>' + ev.n + '. ' + title + '</b><br>' + ev.when,
            className: cls.join(' '), type: 'box'
        };
        if (ev.end) { it.end = toDate(ev.end); it.type = 'range'; }
        return it;
    }

    function refresh() {
        const far = isFar();
        const list = [];
        const bronzeShown = [...shown].filter(n => n > 1 && evByN(n).band === 'bronze');
        const rediscShown = [...shown].filter(n => evByN(n).band === 'redisc');
        list.push(eventItem(evByN(1)));
        if (far) {
            if (bronzeShown.length) list.push({
                id: 'c-bronze', group: 'bronze', start: toDate(-1900), end: toDate(-1200), type: 'range',
                className: 'cluster bronze', content: '<span class="clbl">' + bronzeShown.length + ' palace-age events \u25B8</span>',
                title: '<b>Palace age</b><br>c. 1900–1200 BCE<br>Click to zoom in.'
            });
            if (rediscShown.length) list.push({
                id: 'c-redisc', group: 'redisc', start: toDate(1878), end: toDate(2025), type: 'range',
                className: 'cluster redisc', content: '<span class="clbl">' + rediscShown.length + ' rediscovery events \u25B8</span>',
                title: '<b>Rediscovery</b><br>1878–2025<br>Click to zoom in.'
            });
        } else {
            EVENTS.forEach(ev => { if (ev.n > 1 && shown.has(ev.n)) list.push(eventItem(ev)); });
            GAPS.forEach(g => {
                if (!shown.has(g.from) || !shown.has(g.to)) return;
                list.push({
                    id: g.id, group: g.band, start: toDate(evByN(g.from).y), end: toDate(evByN(g.to).y),
                    type: 'range', className: 'gap', content: g.label, selectable: false,
                    title: 'From event ' + g.from + ' to event ' + g.to + ': ' + g.label
                });
            });
        }
        // Linear B ends about 1200 BCE and is read again in 1952
        if (finished && far) list.push({
            id: 'silence', group: 'bronze', start: toDate(-1200), end: toDate(1952), type: 'range',
            className: 'silence', content: 'Over 3,000 years unread', selectable: false,
            title: 'Linear B falls silent about 1200 BCE and is read again in 1952 CE.'
        });
        items.clear();
        items.add(list);
        if (currentEv && shown.has(currentEv) && !far) timeline.setSelection(['e' + currentEv]);
    }

    let wasFar = true;
    timeline.on('rangechanged', function (props) {
        lastView = [props.start, props.end];
        updateAxis();
        const far = isFar();
        if (far !== wasFar) { wasFar = far; refresh(); }
    });
    window.addEventListener('resize', updateAxis);

    function setView(name, animate) {
        const v = VIEWS[name];
        lastView = v;
        if (drawn) timeline.setWindow(v[0], v[1], { animation: !!animate });
    }

    // Vertical wheel scrolls the page; horizontal wheel pans the timeline.
    container.addEventListener('wheel', function (e) {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) {
            e.stopImmediatePropagation();
        } else {
            e.preventDefault();
            const win = timeline.getWindow();
            const shift = (e.deltaX / container.clientWidth) * (win.end - win.start);
            timeline.setWindow(new Date(win.start.valueOf() + shift),
                               new Date(win.end.valueOf() + shift), { animation: false });
        }
    }, true);

    function pan(frac) {
        const win = timeline.getWindow();
        const w = win.end - win.start;
        const lo = toDate(-7900).valueOf(), hi = toDate(2800).valueOf();
        let s = win.start.valueOf() + frac * w;
        s = Math.max(lo, Math.min(hi - w, s));
        timeline.setWindow(new Date(s), new Date(s + w), { animation: true });
    }
    $('full-span').onclick = () => setView('full', true);
    $('bronze').onclick = () => setView('bronze', true);
    $('redisc').onclick = () => setView('redisc', true);
    $('pan-left').onclick = () => pan(-0.4);
    $('pan-right').onclick = () => pan(0.4);

    // ------------------------------------------------------------------
    // Event details
    // ------------------------------------------------------------------
    const elDetails = $('details');
    function showEvent(n) {
        currentEv = n;
        const ev = evByN(n);
        elDetails.innerHTML =
            '<div class="step">Event ' + n + ' of ' + EVENTS.length + ' · ' +
            (ev.band === 'bronze' ? 'Bronze Age Crete' : 'Rediscovery') + '</div>' +
            '<h2>' + (ev.title || ev.short) + '</h2>' +
            '<div class="when">' + ev.when + '</div>' +
            '<p>' + ev.desc + '</p>';
    }
    function showPlaceholder() {
        elDetails.innerHTML = '<div class="placeholder">' +
            '<p>The timeline is to scale from 7000 BCE to 2030 CE. Only the first village is on it so far.</p>' +
            '<p>Each answer adds events. Click any event to read about it here.</p></div>';
    }
    timeline.on('select', function (props) {
        if (!props.items.length) return;
        const id = String(props.items[0]);
        if (id === 'c-bronze') { timeline.setSelection([]); setView('bronze', true); }
        else if (id === 'c-redisc') { timeline.setSelection([]); setView('redisc', true); }
        else if (id.startsWith('e')) showEvent(Number(id.slice(1)));
    });

    // ------------------------------------------------------------------
    // Questions
    // ------------------------------------------------------------------
    const elCount = $('q-count'), elText = $('q-text'), elChoices = $('choices'), elFeedback = $('feedback');
    const btnNext = $('next-btn'), btnRestart = $('restart-btn');

    function updateScore() { $('score').textContent = 'Predictions correct: ' + score + ' of ' + QUESTIONS.length; }

    function renderQuestion() {
        const Q = QUESTIONS[qIndex];
        answered = false;
        $('prompt').textContent = PROMPTS[qIndex];
        elCount.textContent = 'Prediction ' + (qIndex + 1) + ' of ' + QUESTIONS.length;
        elText.textContent = Q.q;
        elChoices.innerHTML = '';
        Q.choices.forEach((label, i) => {
            const b = document.createElement('button');
            b.textContent = label;
            b.onclick = () => answer(i);
            elChoices.appendChild(b);
        });
        elFeedback.innerHTML = '<span style="color:#5d6d78">Lock in your prediction. The events appear after you answer; each question counts once.</span>';
        btnNext.disabled = true;
        btnNext.textContent = 'Next question →';
    }

    function answer(i) {
        if (answered || finished) return;
        answered = true;
        const Q = QUESTIONS[qIndex];
        const right = (i === Q.correct);
        if (right) score++;
        updateScore();
        [...elChoices.children].forEach((b, k) => {
            b.disabled = true;
            if (k === Q.correct) b.classList.add('correct');
            else if (k === i) b.classList.add('wrong');
        });
        Q.reveal.forEach(n => shown.add(n));
        fresh = Q.reveal.slice();
        let html = right ? '<span class="verdict-good">Right.</span> ' + Q.reason
                         : '<span class="verdict-bad">Not quite: ' + Q.choices[Q.correct] + '.</span> ' + Q.reason;
        if (qIndex === QUESTIONS.length - 1) {
            finished = true;
            html += '<span class="final">Predictions correct: ' + score + ' of 4. ' + (score >= MASTERY
                ? 'You can read the timeline’s spacing, not just its order.'
                : 'Look again at the gaps: about 150 years from volcano to fall, about 50 from tablet to reading.') +
                '</span><span class="final" style="font-weight:400">Press <b>Full span</b> to see the silence of more than 3,000 years between the bands.</span>';
            btnNext.disabled = true;
            btnNext.textContent = 'Done';
        } else {
            btnNext.disabled = false;
        }
        elFeedback.innerHTML = html;
        setView(Q.view, true);
        showEvent(Q.reveal[0]);
        refresh();
    }

    btnNext.onclick = () => {
        if (!answered || finished) return;
        qIndex++;
        renderQuestion();
    };
    btnRestart.onclick = () => restart(true);

    function restart(animate) {
        qIndex = 0; score = 0; answered = false; finished = false;
        shown = new Set([1]); fresh = []; currentEv = 0;
        timeline.setSelection([]);
        updateScore();
        showPlaceholder();
        setView('full', animate);
        refresh();
        renderQuestion();
    }

    // A little state for headless testing
    window.knossosTimeline = {
        answer: i => answer(i), next: () => btnNext.onclick(), view: name => setView(name, false),
        score: () => score, shown: () => [...shown]
    };

    restart(false);
});
