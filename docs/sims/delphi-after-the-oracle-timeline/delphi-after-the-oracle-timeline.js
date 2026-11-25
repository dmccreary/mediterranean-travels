// Delphi After the Oracle - vis-timeline
// CANVAS_HEIGHT: 590
// Nine dated events in Delphi's history after the oracle closed, revealed one
// at a time in date order. Each starts as a dated card with its label only;
// the learner predicts its stage (Silenced, Found, Dug up, Shown), and then
// the description, the correct stage and the reason are revealed. One
// prediction per event. The event then drops into its stage's row on a
// timeline from 300 to 2000 CE, where the empty centuries 400-1400 CE are
// compressed (hatched band). Mastery: 8 of 9.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------
    const STAGES = {
        silenced: { id: 'silenced', name: 'Silenced', def: 'The oracle closes and the sanctuary is abandoned or built over.' },
        found: { id: 'found', name: 'Found', def: 'Travelers identify the site from ancient texts and inscriptions.' },
        dug: { id: 'dug', name: 'Dug up', def: 'Excavation reveals and recovers the sanctuary and its finds.' },
        shown: { id: 'shown', name: 'Shown', def: 'The site and its finds are rebuilt, displayed, performed in, or recognized for visitors.' }
    };
    const ORDER = ['silenced', 'found', 'dug', 'shown'];

    // y: year placed on the timeline; end: last year of a range.
    const EVENTS = [
        { n: 1, y: 391, end: 392, date: '391–392 CE', stage: 'silenced', label: 'Theodosian Decrees',
          desc: 'Imperial decrees ban sacrifice and close the temples; with no sacrifice, the oracle falls silent.',
          why: 'The decrees ended consultations and began the sanctuary’s long burial.' },
        { n: 2, y: 1436, date: '1436', stage: 'found', label: 'Cyriac of Ancona',
          desc: 'The Italian merchant and antiquarian visits and copies inscriptions.',
          why: 'He came looking for Delphi because of what he had read.' },
        { n: 3, y: 1676, date: '1676', stage: 'found', label: 'Spon and Wheler',
          desc: 'The French doctor Jacob Spon and the English traveler George Wheler identify the village of Kastri as Delphi.',
          why: 'They matched the place to the ancient descriptions.' },
        { n: 4, y: 1892, date: '1892', stage: 'dug', label: 'The great excavation begins',
          desc: 'The French School at Athens, led by Théophile Homolle, begins excavating after Kastri is moved west.',
          why: 'Moving the village opened the sanctuary to excavation.' },
        { n: 5, y: 1896, date: '1896', stage: 'dug', label: 'The Charioteer found',
          desc: 'Excavators find the bronze Charioteer buried near the temple.',
          why: 'It was recovered from the earth that had protected it.' },
        { n: 6, y: 1903, date: '1903', stage: 'shown', label: 'The first museum opens',
          desc: 'A museum near the site opens to display the finds.',
          why: 'It presented the finds to visitors.' },
        { n: 7, y: 1903, end: 1906, date: '1903–1906', stage: 'shown', label: 'The Athenian Treasury rebuilt',
          desc: 'French archaeologists rebuild the Athenian Treasury from its original blocks, paid for by the city of Athens.',
          why: 'Rebuilding turned scattered blocks into a building visitors can see.' },
        { n: 8, y: 1927, date: '1927', stage: 'shown', label: 'The first Delphic Festival',
          desc: 'Angelos and Eva Palmer-Sikelianos stage Aeschylus’ <i>Prometheus Bound</i> in the ancient theater.',
          why: 'The theater was used again for drama.' },
        { n: 9, y: 1987, date: '1987', stage: 'shown', label: 'World Heritage Site',
          desc: 'Delphi is listed as a UNESCO World Heritage Site.',
          why: 'The listing recognized the site for the whole world.' }
    ];
    const MASTERY = 8;
    const QUESTION = 'The oracle fell silent in 391 CE. How did Delphi come back?';
    const GAP = 1436 - 392;   // 1,044 years from the decrees to Cyriac's visit

    // ------------------------------------------------------------------
    // A compressed time scale. Real years 400-1400 CE are squeezed ten to
    // one, so 1,000 years take the space of 100. The timeline runs on
    // "fake" years; the axis labels convert them back.
    // ------------------------------------------------------------------
    const SQ_FROM = 400, SQ_TO = 1400, SQ_K = 10;
    const SQ_FAKE_END = SQ_FROM + (SQ_TO - SQ_FROM) / SQ_K;     // 500
    function fake(y) {
        if (y <= SQ_FROM) return y;
        if (y < SQ_TO) return SQ_FROM + (y - SQ_FROM) / SQ_K;
        return y - (SQ_TO - SQ_FAKE_END);
    }
    function real(f) {
        if (f <= SQ_FROM) return f;
        if (f < SQ_FAKE_END) return SQ_FROM + (f - SQ_FROM) * SQ_K;
        return f + (SQ_TO - SQ_FAKE_END);
    }
    const YEAR_MS = 365.25 * 24 * 3600 * 1000;
    function fakeDate(f) {
        const d = new Date(2000, 0, 1, 0, 0, 0);
        d.setFullYear(Math.floor(f));
        return new Date(d.valueOf() + (f - Math.floor(f)) * YEAR_MS);
    }
    const toDate = y => fakeDate(fake(y));
    const $ = id => document.getElementById(id);
    const VIEWS = {
        full: [fakeDate(fake(285)), fakeDate(fake(2012))],
        close: [fakeDate(fake(1878)), fakeDate(fake(2002))]
    };

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    let idx = 0, score = 0, answered = false, finished = false;
    let picks = {};          // event n -> predicted stage id

    // ------------------------------------------------------------------
    // Timeline
    // ------------------------------------------------------------------
    const container = $('timeline');
    const items = new vis.DataSet();
    const groups = new vis.DataSet([
        { id: 'next', content: 'Next', className: 'g-next', order: 0 },
        { id: 'silenced', content: 'Silenced', className: 'g-silenced', order: 1 },
        { id: 'found', content: 'Found', className: 'g-found', order: 2 },
        { id: 'dug', content: 'Dug up', className: 'g-dug', order: 3 },
        { id: 'shown', content: 'Shown', className: 'g-shown', order: 4 }
    ]);
    let drawn = false;
    let lastView = VIEWS.full;

    function axisLabel(date) {
        const f = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
        if (f > SQ_FROM && f < SQ_FAKE_END) return '';
        const y = Math.round(real(f));
        if (y < 300 || y > 2000) return '';
        if (drawn) {
            // drop a label that would be cut off at the right edge
            const w = timeline.getWindow();
            const frac = (fakeDate(f) - w.start) / (w.end - w.start);
            const center = container.querySelector('.vis-center');
            const cw = center ? center.clientWidth : container.clientWidth;
            if (frac * cw > cw - 30) return '';
        }
        return y < 1000 ? y + ' CE' : String(y);
    }
    const options = {
        width: '100%',
        height: '252px',
        verticalScroll: false,
        orientation: 'top',
        stack: true,
        groupOrder: 'order',
        margin: { item: { horizontal: 2, vertical: 4 }, axis: 4 },
        min: fakeDate(fake(250)),
        max: fakeDate(fake(2050)),
        zoomMin: 60 * YEAR_MS,
        zoomMax: 900 * YEAR_MS,
        zoomable: false,       // zoom with the buttons only
        moveable: true,
        selectable: true,
        showCurrentTime: false,
        showMajorLabels: false,
        timeAxis: { scale: 'year', step: 100 },
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        xss: { disabled: false, filterOptions: { whiteList: { span: ['class'], b: [], br: [], i: [] } } },
        format: {
            minorLabels: function (date) { return axisLabel(date); },
            majorLabels: function () { return ''; }
        }
    };
    options.onInitialDrawComplete = function () {
        drawn = true;
        timeline.setWindow(lastView[0], lastView[1], { animation: false });
        updateAxis();
    };
    const timeline = new vis.Timeline(container, items, groups, options);

    // Tick steps that keep real-year labels round on both sides of the squeeze
    const STEPS = [10, 20, 25, 50, 100];
    let currentStep = 100;
    function updateAxis() {
        if (!drawn) return;
        const w = timeline.getWindow();
        const years = (w.end - w.start) / YEAR_MS;
        const center = container.querySelector('.vis-center');
        const px = Math.max(150, center ? center.clientWidth : container.clientWidth);
        const step = STEPS.find(st => (st / years) * px >= 56) || 100;
        if (step !== currentStep) {
            currentStep = step;
            timeline.setOptions({ timeAxis: { scale: 'year', step: step } });
        }
    }
    timeline.on('rangechanged', function (props) { lastView = [props.start, props.end]; updateAxis(); });
    window.addEventListener('resize', updateAxis);

    function setView(name, animate) {
        lastView = VIEWS[name];
        if (drawn) timeline.setWindow(lastView[0], lastView[1], { animation: !!animate });
    }
    $('full-span').onclick = () => setView('full', true);
    $('close-up').onclick = () => setView('close', true);

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

    function tipFor(ev) {
        const S = STAGES[ev.stage];
        const pick = picks[ev.n];
        return '<b>' + ev.n + '. ' + ev.date + ': ' + ev.label + '</b><br>' + ev.desc + '<br><i>' + S.name + '.</i> ' + ev.why +
            (pick && pick !== ev.stage ? '<br>Your prediction: ' + STAGES[pick].name + '.' : '');
    }

    function refresh(nowN) {
        const list = [{
            id: 'squeeze', start: toDate(SQ_FROM), end: toDate(SQ_TO), type: 'background', className: 'squeeze',
            content: '⟨ 1,000 yrs ⟩',
            title: 'Compressed: the 1,000 years from 400 to 1400 CE, with no events on this timeline, take the space of 100.'
        }];
        if (finished) {
            list.push({
                id: 'silence', start: toDate(392), end: toDate(1436), type: 'background', className: 'silence',
                content: GAP.toLocaleString('en-US') + ' years of silence',
                title: 'From the Theodosian Decrees (391–392 CE) to Cyriac of Ancona’s visit in 1436: 1436 − 392 = ' +
                       GAP.toLocaleString('en-US') + ' years.'
            });
        }
        EVENTS.forEach((ev, i) => {
            const isPending = !finished && i === idx && !(ev.n in picks);
            if (!(ev.n in picks) && !isPending) return;
            const cls = ['ev'];
            let group;
            if (isPending) { cls.push('pending', 'now'); group = 'next'; }
            else {
                cls.push(ev.stage);
                group = ev.stage;
                if (picks[ev.n] !== ev.stage) cls.push('miss');
                if (ev.n === nowN) cls.push('now');
            }
            const item = {
                id: 'e' + ev.n, group: group, start: toDate(ev.y), type: 'box',
                content: '<span class="num">' + (isPending ? '? ' : '') + ev.n + '</span>',
                title: isPending ? '<b>' + ev.n + '. ' + ev.date + ': ' + ev.label + '</b><br>Predict its stage above.' : tipFor(ev),
                className: cls.join(' ')
            };
            if (ev.end !== undefined) { item.end = toDate(ev.end + 0.9); item.type = 'range'; }
            list.push(item);
        });
        items.clear();
        items.add(list);
    }

    timeline.on('select', function (props) {
        if (!props.items.length) return;
        const id = String(props.items[0]);
        if (/^e\d+$/.test(id)) showEvent(Number(id.slice(1)));
    });

    // ------------------------------------------------------------------
    // Cards
    // ------------------------------------------------------------------
    const elChoices = $('choices'), elFeedback = $('feedback'), elDesc = $('c-desc');
    const btnNext = $('next-btn'), btnRestart = $('restart-btn');

    function updateScore() { $('score').textContent = 'Predictions correct: ' + score + ' of ' + EVENTS.length; }

    function feedbackFor(ev) {
        const S = STAGES[ev.stage];
        return picks[ev.n] === ev.stage
            ? '<span class="good">Correct: ' + S.name + '.</span> ' + ev.why
            : '<span class="bad">This one is ' + S.name + '.</span> ' + ev.why;
    }

    function buildChoices(ev, locked, counts) {
        elChoices.innerHTML = '';
        elChoices.className = counts ? 'summary' : '';
        ORDER.forEach((id, k) => {
            const S = STAGES[id];
            const b = document.createElement('button');
            const head = counts ? S.name + ': ' + counts[id] + (counts[id] === 1 ? ' event' : ' events') : (k + 1) + '. ' + S.name;
            b.innerHTML = '<b>' + head + '</b><span>' + S.def + '</span>';
            b.title = S.name + ': ' + S.def + (counts ? '' : ' (key ' + (k + 1) + ')');
            b.classList.add(id);
            b.onclick = () => answer(id);
            if (locked) {
                b.disabled = true;
                if (ev && id === ev.stage) b.classList.add('correct');
                else if (ev && id === picks[ev.n]) b.classList.add('wrong');
            }
            elChoices.appendChild(b);
        });
    }

    function showHead(ev, review) {
        $('c-count').textContent = 'Event ' + ev.n + ' of ' + EVENTS.length + (review ? ' (review)' : '');
        $('c-date').textContent = ev.date;
        $('c-label').textContent = ev.label;
    }

    function renderCard() {
        const ev = EVENTS[idx];
        answered = false;
        showHead(ev, false);
        elDesc.className = 'hidden';
        elDesc.textContent = 'The description is revealed after you predict.';
        $('c-q').textContent = 'Which stage is this? Predict before the description is revealed.';
        buildChoices(ev, false);
        elFeedback.innerHTML = idx === 0
            ? '<span class="muted">' + QUESTION + ' Read the four stages, then predict. Only your prediction counts.</span>'
            : '<span class="muted">Only your prediction counts. The event waits in the Next row at its date.</span>';
        btnNext.disabled = true;
        btnNext.textContent = idx < EVENTS.length - 1 ? 'Next event →' : 'See all stages →';
        // the modern events crowd together: move in for a closer look
        if (idx === 3) setView('close', true);
        if (idx === 0) setView('full', false);
        refresh(0);
    }

    // Re-read an answered event from the timeline (does not change the score)
    function showEvent(n) {
        const ev = EVENTS.find(x => x.n === n);
        if (!(n in picks)) return;
        showHead(ev, true);
        elDesc.className = '';
        elDesc.innerHTML = ev.desc;
        $('c-q').textContent = 'Stage: ' + STAGES[ev.stage].name + '.';
        buildChoices(ev, true);
        elFeedback.innerHTML = feedbackFor(ev);
    }

    function answer(stageId) {
        if (answered || finished) return;
        const ev = EVENTS[idx];
        if (ev.n in picks) return;
        answered = true;
        picks[ev.n] = stageId;
        if (stageId === ev.stage) score++;
        updateScore();
        elDesc.className = '';
        elDesc.innerHTML = ev.desc;
        $('c-q').textContent = 'Your prediction: ' + STAGES[stageId].name + '.';
        buildChoices(ev, true);
        elFeedback.innerHTML = feedbackFor(ev);
        btnNext.disabled = false;
        refresh(ev.n);
    }

    function showFinal() {
        finished = true;
        refresh(0);
        setView('full', true);
        timeline.setSelection([]);
        const counts = { silenced: 0, found: 0, dug: 0, shown: 0 };
        EVENTS.forEach(ev => counts[ev.stage]++);
        $('c-count').textContent = 'All nine events placed';
        $('c-date').textContent = '';
        $('c-label').textContent = 'How Delphi came back';
        elDesc.className = '';
        elDesc.innerHTML = 'Predictions correct: <b>' + score + ' of 9</b>. ' +
            (score >= MASTERY ? '<span style="color:#2f7d4a;font-weight:700">Mastery reached.</span>'
                              : '<span style="color:#a4282a;font-weight:700">Mastery is 8 of 9.</span> Restart to try again.');
        $('c-q').textContent = 'The four stages, with the number of events in each:';
        buildChoices(null, true, counts);
        elFeedback.innerHTML = 'More than a thousand years (' + GAP.toLocaleString('en-US') + ', from 392 to 1436 CE) separate the ' +
            'silence from the first rediscovery, and four of the nine events concern how Delphi is <b>shown</b>, not how it was ' +
            'found.';
        btnNext.disabled = true;
        btnNext.textContent = 'Done';
        $('hint').textContent = 'Click any badge on the timeline to read it again.';
    }

    btnNext.onclick = () => {
        if (!answered || finished) return;
        if (idx < EVENTS.length - 1) { idx++; renderCard(); }
        else showFinal();
    };
    btnRestart.onclick = () => restart(true);

    document.addEventListener('keydown', e => {
        if (finished) return;
        if (['1', '2', '3', '4'].includes(e.key)) answer(ORDER[Number(e.key) - 1]);
        else if (e.key === 'Enter') btnNext.onclick();
    });

    function restart(animate) {
        idx = 0; score = 0; answered = false; finished = false; picks = {};
        timeline.setSelection([]);
        updateScore();
        $('hint').textContent = 'Keys 1 to 4 choose; Enter goes on.';
        setView('full', animate);
        renderCard();
    }

    // A little state for headless testing
    window.afterOracle = {
        answer: id => answer(id), next: () => btnNext.onclick(), view: name => setView(name, false),
        score: () => score, correctOf: i => EVENTS[i].stage,
        playAll: wrongEvery => {
            for (let i = 0; i < EVENTS.length; i++) {
                const right = EVENTS[idx].stage;
                const k = ORDER.indexOf(right);
                answer(wrongEvery && idx % wrongEvery === 0 ? ORDER[(k + 1) % 4] : right);
                btnNext.onclick();
            }
        }
    };

    restart(false);
});
