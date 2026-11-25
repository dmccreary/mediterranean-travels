// Rhodes Changes Hands, 1912–1948 - vis-timeline
// CANVAS_HEIGHT: 768
// Two rows from 1910 to 1949: the powers that governed Rhodes (colored rule
// spans) and thirteen numbered events. Each event's number is colored by the
// span it falls in; hollow numbers mark events on the Greek mainland.
// Opening an event shows its description and names the power governing Rhodes
// at that date. Five questions, in a fixed order and answered once each, ask
// who governed the island at a given date and what followed from it; after
// each answer the span and events it depends on are highlighted.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------
    // start/end are [year, month (1-12), day]
    const SPANS = [
        { id: 'ottoman', abbr: 'Ott.', name: 'Ottoman Empire', short: 'Ottoman', color: '#2F7D4A',
          start: [1522, 12, 20], end: [1912, 5, 4], when: '1522 to May 1912' },
        { id: 'italy', abbr: 'It.', name: 'Italy', short: 'Italy', color: '#B5652B',
          start: [1912, 5, 4], end: [1943, 9, 11], when: 'May 1912 to September 1943' },
        { id: 'germany', abbr: 'Ger.', name: 'Germany (military occupation)', short: 'Germany', color: '#4D4D4D',
          start: [1943, 9, 11], end: [1945, 5, 8], when: 'September 1943 to May 8, 1945' },
        { id: 'britain', abbr: 'Br.', name: 'Britain (military administration)', short: 'Britain', color: '#6E3F8F',
          start: [1945, 5, 8], end: [1947, 3, 31], when: 'May 8, 1945 to March 31, 1947' },
        { id: 'greece', abbr: 'Gr.', name: 'Greece', short: 'Greece', color: '#0D5EAF',
          start: [1947, 3, 31], end: [1950, 6, 30], when: 'March 31, 1947 onward (formal union March 7, 1948)' }
    ];

    // where: 'rhodes' or 'mainland' (events in Athens or mainland Greece)
    const EVENTS = [
        { n: 1, date: [1912, 5, 4], when: 'May 1912', short: 'Italy seizes Rhodes', where: 'rhodes',
          title: 'Italy seizes Rhodes',
          desc: 'During the Italo-Turkish War, Italy takes Rhodes and the Dodecanese from the Ottoman Empire, calling it temporary.' },
        { n: 2, date: [1923, 1, 30], when: 'January 30, 1923', short: 'Exchange agreed', where: 'mainland',
          title: 'Greek-Turkish population exchange agreed',
          desc: 'Orthodox Christians of Turkey and Muslims of Greece are to be exchanged; Rhodes, Italian, is not included.' },
        { n: 3, date: [1923, 7, 24], when: 'July 24, 1923', short: 'Lausanne', where: 'rhodes',
          title: 'Treaty of Lausanne',
          desc: 'Turkey gives up its claim to the Dodecanese in favor of Italy.' },
        { n: 4, date: [1936, 11, 1], when: '1936', short: 'De Vecchi', where: 'rhodes',
          title: 'De Vecchi becomes governor',
          desc: 'Italianization of schools and public life intensifies.' },
        { n: 5, date: [1938, 9, 5], when: 'September 5, 1938', short: 'Anti-Jewish decree', where: 'rhodes',
          title: 'First anti-Jewish decree on Rhodes',
          desc: 'Italy’s racial laws reach the island: Jews classed as foreigners are ordered to leave, and further laws strip the community of its rights.' },
        { n: 6, date: [1940, 10, 28], when: 'October 28, 1940', short: 'Óchi', where: 'mainland',
          title: 'Greece says “óchi”',
          desc: 'Italy invades Greece; Rhodes is an Italian base.' },
        { n: 7, date: [1941, 4, 27], when: 'April 27, 1941', short: 'Athens falls', where: 'mainland',
          title: 'German troops enter Athens',
          desc: 'The occupation of mainland Greece begins.' },
        { n: 8, date: [1943, 9, 11], when: 'September 1943', short: 'Germans take Rhodes', where: 'rhodes',
          title: 'Italy surrenders; Germans take Rhodes',
          desc: 'The German garrison seizes the island from Italian troops.' },
        { n: 9, date: [1944, 7, 23], when: 'July 23, 1944', short: 'Deportation', where: 'rhodes',
          title: 'Deportation of the Jews of Rhodes',
          desc: 'More than 1,700 Jews of Rhodes are forced onto boats in the harbor; they reach Auschwitz on August 16, 1944, where most are murdered on arrival.' },
        { n: 10, date: [1944, 10, 12], when: 'October 12, 1944', short: 'Athens liberated', where: 'mainland',
          title: 'Athens liberated',
          desc: 'German troops leave Athens; Rhodes remains German.' },
        { n: 11, date: [1945, 5, 8], when: 'May 8, 1945', short: 'German surrender', where: 'rhodes',
          title: 'Germans surrender the Dodecanese',
          desc: 'British military administration begins.' },
        { n: 12, date: [1947, 2, 10], when: 'February 10, 1947', short: 'Paris treaty', where: 'rhodes',
          title: 'Paris peace treaty',
          desc: 'Italy cedes the Dodecanese to Greece.' },
        { n: 13, date: [1948, 3, 7], when: 'March 7, 1948', short: 'Union', where: 'rhodes',
          title: 'Formal union with Greece',
          desc: 'Rhodes becomes fully part of the Greek state.' }
    ];

    const QUESTIONS = [
        { q: 'Which power governed Rhodes when the Greek-Turkish population exchange was agreed in January 1923?',
          choices: ['Ottoman Empire', 'Greece', 'Italy', 'Britain'], correct: 2,
          reason: 'Italy had held Rhodes since May 1912, so the exchange between Greece and Turkey did not apply there.',
          spans: ['italy'], events: [2] },
        { q: 'On October 28, 1940, when Greece said “óchi,” which side was Rhodes on?',
          choices: ['It was occupied Greek territory', 'It was Italian territory, an Axis base', 'It was neutral', 'It was British'],
          correct: 1,
          reason: 'Rhodes was part of Italy’s empire, so it was on the side attacking Greece.',
          spans: ['italy'], events: [6] },
        { q: 'Which power controlled Rhodes when its Jews were deported in July 1944?',
          choices: ['Italy', 'Germany', 'Britain', 'Greece'], correct: 1,
          reason: 'German forces had held Rhodes since September 1943; the deportation was a German operation, helped by records from the Italian civil administration.',
          spans: ['germany'], events: [8, 9] },
        { q: 'Who governed Rhodes between the German surrender and Greek administration?',
          choices: ['Italy again', 'Britain', 'Turkey', 'the United Nations'], correct: 1,
          reason: 'A British military administration ran the islands from May 1945 until March 1947.',
          spans: ['britain'], events: [11] },
        { q: 'In the 100 years before the Paris peace treaty (February 1847 to February 1947), how many years did Rhodes spend under Greek rule?',
          choices: ['None', 'About 10', 'About 50', 'About 100'], correct: 0,
          reason: 'Greek administration began only on March 31, 1947; before that the island was Ottoman, Italian, German, and British.',
          spans: ['ottoman', 'italy', 'germany', 'britain'], events: [12] }
    ];
    const MASTERY = 4;

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    function toDate(a) {
        const d = new Date(2000, (a[1] || 1) - 1, a[2] || 1, 0, 0, 0);
        d.setFullYear(a[0]);
        return d;
    }
    const yearDate = y => toDate([y, 1, 1]);
    const YEAR_MS = 365.25 * 24 * 3600 * 1000;
    const evByN = n => EVENTS.find(e => e.n === n);
    const spanById = id => SPANS.find(s => s.id === id);
    // The span an event falls in: start <= date < end
    function spanOf(ev) {
        const t = toDate(ev.date).valueOf();
        return SPANS.find(s => toDate(s.start).valueOf() <= t && t < toDate(s.end).valueOf());
    }

    // ------------------------------------------------------------------
    // Timeline
    // ------------------------------------------------------------------
    const container = document.getElementById('timeline');
    const FULL = [yearDate(1910), toDate([1950, 1, 1])];
    const CLOSE = [toDate([1936, 1, 1]), toDate([1949, 9, 1])];
    let hlEvents = [], hlSpans = [];

    function spanItem(s) {
        const cls = ['span', s.id];
        if (hlSpans.includes(s.id)) cls.push('hl');
        else if (hlSpans.length) cls.push('dim');
        return {
            id: 's-' + s.id, group: 'rule',
            start: toDate(s.start), end: toDate(s.end),
            content: spanLabel(s), type: 'range',
            title: '<b>' + s.name + '</b><br>' + s.when,
            className: cls.join(' ')
        };
    }
    // A span's label only when it fits in the visible part of its band:
    // the full name, an abbreviation, or nothing (the legend names it)
    let viewNow = null;
    function spanLabel(s) {
        if (!viewNow) return s.short;
        const panel = container.querySelector('.vis-panel.vis-center');
        const px = panel ? panel.clientWidth : container.clientWidth - 95;
        const a = Math.max(toDate(s.start).valueOf(), viewNow[0].valueOf());
        const b = Math.min(toDate(s.end).valueOf(), viewNow[1].valueOf());
        const w = (b - a) / (viewNow[1] - viewNow[0]) * px;
        if (w >= s.short.length * 7.5 + 14) return s.short;
        if (w >= s.abbr.length * 7.5 + 12) return s.abbr;
        return '';
    }
    function eventItem(ev) {
        const s = spanOf(ev);
        const cls = ['ev', s.id];
        if (ev.where === 'mainland') cls.push('mainland');
        if (hlEvents.includes(ev.n)) cls.push('hl');
        return {
            id: ev.n, group: 'events', start: toDate(ev.date), type: 'point',
            content: '<span class="lbl"><span class="num">' + ev.n + '</span><span class="txt">' + ev.short + '</span></span>',
            title: '<b>' + ev.n + '. ' + ev.title + '</b><br>' + ev.when +
                   (ev.where === 'mainland' ? '<br>(mainland Greece)' : ''),
            className: cls.join(' ')
        };
    }
    function allItems() { return SPANS.map(spanItem).concat(EVENTS.map(eventItem)); }

    const groups = new vis.DataSet([
        { id: 'rule', content: 'Who governed<br>Rhodes', order: 0 },
        { id: 'events', content: 'Events', order: 1 }
    ]);
    const items = new vis.DataSet(allItems());

    const options = {
        width: '100%',
        height: window.innerWidth < 600 ? '250px' : '196px',
        orientation: 'top',
        xss: { disabled: false, filterOptions: { whiteList: { span: ['class'], b: [], br: [] } } },
        stack: true,
        groupOrder: 'order',
        align: 'auto',       // range labels stay in view when the band runs off-screen
        margin: { item: { horizontal: 0, vertical: 4 }, axis: 4 },   // 0 so touching spans share one row
        min: yearDate(1910),
        max: toDate([1950, 1, 1]),
        zoomMin: 5 * YEAR_MS,
        zoomMax: 41 * YEAR_MS,
        zoomable: false,        // zoom with the Full span and Close-up buttons
        moveable: true,
        selectable: true,
        showCurrentTime: false,
        showMajorLabels: false,
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        timeAxis: { scale: 'year', step: 5 },
        format: {
            minorLabels: function (date) {
                const y = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
                return String(y);
            },
            majorLabels: function () { return ''; }
        }
    };

    let timeline = null;
    let lastView = FULL;
    let drawn = false;
    function setView(view, animate) {
        lastView = view;
        if (drawn) timeline.setWindow(view[0], view[1], { animation: !!animate });
        updateAxis(view);
    }
    options.onInitialDrawComplete = function () {
        drawn = true;
        timeline.setWindow(lastView[0], lastView[1], { animation: false });
        viewNow = null;          // re-fit the span labels now that the panel has its width
        updateAxis(lastView);
    };
    timeline = new vis.Timeline(container, items, groups, options);

    // Tick step that leaves room for the year labels; short event labels
    // only when the view is narrow enough for them to fit
    function updateAxis(view) {
        const years = (view[1] - view[0]) / YEAR_MS;
        const px = Math.max(200, container.clientWidth - 110);
        const step = [1, 2, 5, 10].find(st => (st / years) * px >= 40) || 10;
        timeline.setOptions({ timeAxis: { scale: 'year', step: step } });
        const compact = px / years < 40;
        const compactChanged = compact !== container.classList.contains('compact');
        container.classList.toggle('compact', compact);
        const v = [new Date(view[0]), new Date(view[1])];
        if (!viewNow || v[0].valueOf() !== viewNow[0].valueOf() || v[1].valueOf() !== viewNow[1].valueOf()) {
            viewNow = v;
            items.update(SPANS.map(spanItem));
        }
        // labels shown or hidden: re-measure the events so they restack
        if (compactChanged) items.update(EVENTS.map(eventItem));
    }
    updateAxis(FULL);
    timeline.on('rangechanged', props => {
        lastView = [props.start, props.end];
        updateAxis(lastView);
    });
    window.addEventListener('resize', () => updateAxis(lastView));

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
        let s = win.start.valueOf() + frac * w;
        s = Math.max(FULL[0].valueOf(), Math.min(FULL[1].valueOf() - w, s));
        setView([new Date(s), new Date(s + w)], true);
    }

    document.getElementById('full-span').onclick = () => setView(FULL, true);
    document.getElementById('close-up').onclick = () => setView(CLOSE, true);
    document.getElementById('pan-left').onclick = () => pan(-0.4);
    document.getElementById('pan-right').onclick = () => pan(0.4);

    document.getElementById('legend').innerHTML = SPANS.map(s =>
        '<span><span class="swatch" style="background:' + s.color + '"></span>' + s.name + '</span>').join('');

    // ------------------------------------------------------------------
    // Event details and stepping in date order
    // ------------------------------------------------------------------
    const elDetails = document.getElementById('details');
    const btnPrev = document.getElementById('prev-btn');
    const btnNextEv = document.getElementById('next-ev-btn');
    let currentEv = 0;

    function showEvent(n, fromStep) {
        currentEv = n;
        const ev = evByN(n);
        const s = spanOf(ev);
        timeline.setSelection([n]);
        elDetails.innerHTML =
            '<div class="step">Event ' + n + ' of ' + EVENTS.length + '</div>' +
            '<h2>' + ev.title + '</h2>' +
            '<div class="when">' + ev.when + (ev.where === 'mainland' ? ' · mainland Greece' : ' · Rhodes') + '</div>' +
            '<p>' + ev.desc + '</p>' +
            '<div class="ruled"><span class="swatch" style="background:' + s.color + '"></span>' +
            'At this date Rhodes was governed by <b>' + s.name + '</b> (' + s.when + ').</div>';
        if (fromStep) {
            const t = toDate(ev.date);
            const win = timeline.getWindow();
            if (t < win.start || t > win.end) setView(FULL, true);
        }
        btnPrev.disabled = (n <= 1);
        btnNextEv.disabled = (n >= EVENTS.length);
    }

    function showSpan(id) {
        const s = spanById(id);
        const inside = EVENTS.filter(ev => spanOf(ev).id === id).map(ev => ev.n);
        elDetails.innerHTML =
            '<div class="step">Who governed Rhodes</div>' +
            '<h2><span class="swatch" style="background:' + s.color + '"></span>' + s.name + '</h2>' +
            '<div class="when">' + s.when + '</div>' +
            '<p>' + (inside.length ? 'Events in this span: ' + inside.join(', ') + '.'
                                   : 'None of the thirteen events falls in this span.') + '</p>';
    }

    btnPrev.onclick = () => { if (currentEv > 1) showEvent(currentEv - 1, true); };
    btnNextEv.onclick = () => { if (currentEv < EVENTS.length) showEvent(currentEv + 1, true); };
    btnPrev.disabled = true;

    timeline.on('select', function (props) {
        if (!props.items.length) return;
        const id = props.items[0];
        if (typeof id === 'string' && id.startsWith('s-')) showSpan(id.slice(2));
        else showEvent(Number(id), false);
    });

    function setHighlights(spans, evs) {
        hlSpans = spans;
        hlEvents = evs;
        items.update(allItems());
        if (currentEv) timeline.setSelection([currentEv]);
    }

    // ------------------------------------------------------------------
    // Questions
    // ------------------------------------------------------------------
    const elCount = document.getElementById('q-count');
    const elText = document.getElementById('q-text');
    const elChoices = document.getElementById('choices');
    const elFeedback = document.getElementById('feedback');
    const elScore = document.getElementById('score');
    const btnNext = document.getElementById('next-btn');
    const btnRestart = document.getElementById('restart-btn');
    let qIndex = 0, score = 0, answered = false, finished = false;

    function renderQuestion() {
        const Q = QUESTIONS[qIndex];
        answered = false;
        elCount.textContent = 'Question ' + (qIndex + 1) + ' of ' + QUESTIONS.length;
        elText.textContent = Q.q;
        elChoices.innerHTML = '';
        Q.choices.forEach((label, i) => {
            const b = document.createElement('button');
            b.textContent = String.fromCharCode(97 + i) + ') ' + label;
            b.onclick = () => answer(i);
            elChoices.appendChild(b);
        });
        elFeedback.innerHTML = '<span style="color:#5d6d78">Find the date on the timeline, then choose. Each question counts once.</span>';
        btnNext.disabled = true;
        btnNext.textContent = 'Next question →';
    }

    function answer(i) {
        if (answered || finished) return;
        answered = true;
        const Q = QUESTIONS[qIndex];
        const right = (i === Q.correct);
        if (right) score++;
        elScore.textContent = 'Correct: ' + score + ' of ' + QUESTIONS.length;
        [...elChoices.children].forEach((b, k) => {
            b.disabled = true;
            if (k === Q.correct) b.classList.add('correct');
            else if (k === i) b.classList.add('wrong');
        });
        setHighlights(Q.spans, Q.events);

        let html = right ? '<span class="verdict-good">Correct:</span> ' + Q.reason
                         : '<span class="verdict-bad">Not quite.</span> The answer is ' +
                           Q.choices[Q.correct] + ': ' + Q.reason;
        if (qIndex === QUESTIONS.length - 1) {
            finished = true;
            html += '<span class="final">Correct: ' + score + ' of 5. ' + (score >= MASTERY
                ? 'You can read who governed Rhodes in any year, and why it mattered.'
                : 'Look again at where 1923, 1940, and 1944 fall among the colored spans.') + '</span>';
            btnNext.disabled = true;
            btnNext.textContent = 'Done';
        } else {
            btnNext.disabled = false;
        }
        elFeedback.innerHTML = html;
    }

    btnNext.onclick = () => {
        if (!answered || finished) return;
        qIndex++;
        setHighlights([], []);
        renderQuestion();
    };
    btnRestart.onclick = () => {
        qIndex = 0;
        score = 0;
        finished = false;
        elScore.textContent = 'Correct: 0 of ' + QUESTIONS.length;
        setHighlights([], []);
        renderQuestion();
    };

    // A little state for headless testing
    window.rhodesSim = {
        answer: i => answer(i), next: () => btnNext.onclick(), showEvent: n => showEvent(n, true),
        closeUp: () => setView(CLOSE, false), spanOf: n => spanOf(evByN(n)).id,
        score: () => score
    };

    renderQuestion();
});
