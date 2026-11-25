// Why Athens Looks the Way It Does - vis-timeline
// CANVAS_HEIGHT: 524
// Fourteen events in modern Greek history, 1967-2023, all on the timeline from
// the start. Eight typical sights in Athens are shown one at a time in a fixed
// order; for each, the learner selects the event that explains it (on the
// timeline or in the list) and commits. Two attempts per sight; only the first
// counts toward the score. Matched events get a gold badge with the sight's
// number. Mastery: 7 of 8 on the first attempt.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data (dates from the chapter; m is the month placed on the axis)
    // ------------------------------------------------------------------
    const EVENTS = [
        { id: 'E1', y: 1967, m: 3, date: 'April 21, 1967', short: 'Junta seizes power',
          text: 'Army colonels seize power; the military dictatorship begins.' },
        { id: 'E2', y: 1973, m: 10, date: 'November 14–17, 1973', short: 'Polytechnic uprising',
          text: 'Polytechnic uprising; a tank breaks the main gate early on November 17.' },
        { id: 'E3', y: 1974, m: 6, date: 'July 1974', short: 'Cyprus; junta falls',
          text: 'After a junta-backed coup in Cyprus, Turkish troops land on the island; the junta falls days later.' },
        { id: 'E4', y: 1981, m: 0, date: 'January 1, 1981', short: 'Joins the EEC',
          text: 'Greece joins the European Economic Community.' },
        { id: 'E5', y: 1999, m: 7, date: 'August–September 1999', short: 'Earthquakes',
          text: 'Earthquakes in Turkey and Athens; rescue teams from each country help the other.' },
        { id: 'E6', y: 2002, m: 0, date: 'January 1, 2002', short: 'Euro cash',
          text: 'Euro notes and coins replace the drachma.' },
        { id: 'E7', y: 2004, m: 7, date: 'August 2004', short: 'Athens Olympics',
          text: 'Athens hosts the Olympic Games.' },
        { id: 'E8', y: 2009, m: 9, date: 'October 2009', short: 'Deficit revealed',
          text: 'A new government reveals that the budget deficit was more than twice as large as reported.' },
        { id: 'E9', y: 2010, m: 4, date: '2010', short: 'First rescue loan',
          text: 'First rescue loan; deep cuts to wages, pensions, and public spending begin.' },
        { id: 'E10', y: 2015, m: 2, date: '2015', short: 'Sea crossings',
          text: 'More than 850,000 refugees and migrants reach Greece by sea, most crossing from Turkey.' },
        { id: 'E11', y: 2015, m: 6, date: 'June–July 2015', short: 'Banks close',
          text: 'Banks close; cash withdrawals limited to €60 a day; referendum on July 5.' },
        { id: 'E12', y: 2016, m: 2, date: 'March 2016', short: 'EU–Turkey deal',
          text: 'The European Union and Turkey agree on a deal to reduce the crossings.' },
        { id: 'E13', y: 2018, m: 7, date: 'August 2018', short: 'Rescues end',
          text: 'Greece leaves its last rescue program.' },
        { id: 'E14', y: 2023, m: 11, date: 'December 2023', short: 'Athens Declaration',
          text: 'Greek and Turkish leaders sign the Athens Declaration on friendly relations.' }
    ];
    const BY_ID = {};
    EVENTS.forEach(e => { BY_ID[e.id] = e; });

    // ok: accepted event ids; main: the one revealed after two misses
    const SIGHTS = [
        { n: 1, text: 'Flowers at a twisted iron gate on Patission Street, and a march every November 17',
          ok: ['E2'], main: 'E2',
          why: 'The gate is the one the tank broke in 1973, and the march remembers the uprising.' },
        { n: 2, text: 'A café menu offering “Greek coffee,” where older Greeks remember ordering “Turkish coffee”',
          ok: ['E3'], main: 'E3', hint: 'Think about what happened between Greece and Turkey.',
          why: 'The name changed after 1974, when the war in Cyprus made the old name feel wrong to many Greeks.' },
        { n: 3, text: 'Prices in a Plaka souvenir shop written in euros',
          ok: ['E6'], main: 'E6',
          why: 'The euro replaced the drachma in everyday use in 2002.' },
        { n: 4, text: 'A metro line to the airport and a tram to the sea',
          ok: ['E7'], main: 'E7',
          why: 'Both were built for the 2004 Olympics.' },
        { n: 5, text: 'An older Athenian who remembers queuing at a cash machine for a daily €60',
          ok: ['E11'], main: 'E11',
          why: 'Withdrawals were limited to €60 a day when the banks closed in 2015.' },
        { n: 6, text: 'Empty shops with “for rent” signs, and a family whose son now works in Germany',
          ok: ['E9', 'E8'], main: 'E9',
          why: 'The rescue loans brought cuts that shrank the economy by about a quarter and sent many young Greeks abroad; the 2009 revelation set them off.' },
        { n: 7, text: 'A Syrian bakery and an Afghan grocery in central Athens',
          ok: ['E10'], main: 'E10',
          why: 'Most of the newcomers arrived in the sea crossings of 2015, and some stayed.' },
        { n: 8, text: 'News photos of the Greek and Turkish leaders promising regular meetings',
          ok: ['E14'], main: 'E14',
          why: 'The Athens Declaration of 2023 committed them to regular contact.' }
    ];
    const MASTERY = 7;
    const WRONG_1 = 'Not this one. Look for an event that would leave this mark on the street.';

    const $ = id => document.getElementById(id);
    const dateOf = (y, m) => new Date(y, m, 15);
    const VIEWS = {
        full: [new Date(1957, 0, 1), new Date(2033, 6, 1)],
        close: [new Date(2008, 3, 1), new Date(2019, 8, 1)]
    };

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    let idx = 0, score = 0, tries = 0, resolved = false, finished = false;
    let chosen = null;           // event id currently selected
    let wrongPick = null;        // the first wrong pick for this sight
    let results = {};            // sight n -> { event, first: bool }

    // ------------------------------------------------------------------
    // Timeline
    // ------------------------------------------------------------------
    const container = $('timeline');
    const items = new vis.DataSet();
    const options = {
        width: '100%',
        height: '212px',
        verticalScroll: false,
        orientation: 'top',
        stack: true,
        align: 'center',
        margin: { item: { horizontal: 3, vertical: 5 }, axis: 6 },
        min: new Date(1950, 0, 1),
        max: new Date(2040, 0, 1),
        zoomable: false,
        moveable: true,
        selectable: true,
        showCurrentTime: false,
        showMajorLabels: false,
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        xss: { disabled: false, filterOptions: { whiteList: { span: ['class'], b: [], br: [] } } },
        format: { minorLabels: { year: 'YYYY', month: 'MMM YYYY' } }
    };
    let lastView = VIEWS.full;
    let drawn = false;
    options.onInitialDrawComplete = function () {
        drawn = true;
        timeline.setWindow(lastView[0], lastView[1], { animation: false });
    };
    const timeline = new vis.Timeline(container, items, options);
    timeline.on('rangechanged', props => { lastView = [props.start, props.end]; });

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

    function badgesFor(eid) {
        return Object.keys(results).filter(n => results[n].event === eid).map(n => '<span class="sb">S' + n + '</span>').join('');
    }

    function refresh() {
        const sight = SIGHTS[idx];
        const list = EVENTS.map(ev => {
            const cls = ['ev'];
            if (!finished && ev.id === chosen) cls.push('chosen');
            if (!finished && resolved && results[sight.n] && results[sight.n].event === ev.id) cls.push('answer');
            if (!finished && !resolved && ev.id === wrongPick) cls.push('wrongpick');
            return {
                id: ev.id, start: dateOf(ev.y, ev.m), type: 'box', className: cls.join(' '),
                content: '<span class="eid">' + ev.y + '</span>' + ev.short + badgesFor(ev.id),
                title: '<b>' + ev.id + ' · ' + ev.date + '</b><br>' + ev.text
            };
        });
        items.clear();
        items.add(list);
    }

    timeline.on('select', function (props) {
        if (!props.items.length) return;
        choose(String(props.items[0]));
    });

    // ------------------------------------------------------------------
    // Sight card
    // ------------------------------------------------------------------
    const pick = $('pick');
    const elEvent = $('c-event'), elFeedback = $('feedback');
    const btnCommit = $('commit-btn'), btnNext = $('next-btn');

    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = 'Choose an event…';
    pick.appendChild(blank);
    EVENTS.forEach(ev => {
        const o = document.createElement('option');
        o.value = ev.id;
        o.textContent = ev.date + ': ' + ev.short;
        pick.appendChild(o);
    });
    pick.onchange = () => choose(pick.value || null);

    function showEventText(eid) {
        if (!eid) {
            elEvent.className = 'empty';
            elEvent.textContent = 'No event selected yet. Selecting an event shows its description here.';
            return;
        }
        const ev = BY_ID[eid];
        elEvent.className = '';
        elEvent.innerHTML = '<b>' + ev.date + ':</b> ' + ev.text;
    }

    function choose(eid) {
        if (finished) { showEventText(eid); return; }
        chosen = eid;
        pick.value = eid || '';
        showEventText(eid);
        btnCommit.disabled = resolved || !eid;
        refresh();
        timeline.setSelection(eid ? [eid] : []);
    }

    function updateScore() {
        $('score').textContent = score + ' of 8 correct on the first attempt';
    }

    function renderSight() {
        const s = SIGHTS[idx];
        tries = 0;
        resolved = false;
        chosen = null;
        wrongPick = null;
        $('c-count').textContent = 'Sight ' + s.n + ' of 8';
        $('c-sight').textContent = s.text;
        $('c-q').textContent = 'Which event explains this? Click an event on the timeline, or pick it from the list, then press Commit.';
        pick.disabled = false;
        pick.value = '';
        showEventText(null);
        elFeedback.innerHTML = '<span class="muted">Two attempts. Only the first counts toward the score.</span>';
        btnCommit.disabled = true;
        btnNext.disabled = true;
        btnNext.textContent = idx < SIGHTS.length - 1 ? 'Next sight →' : 'See all sights →';
        timeline.setSelection([]);
        refresh();
    }

    function commit() {
        if (finished || resolved || !chosen) return;
        const s = SIGHTS[idx];
        tries++;
        if (s.ok.includes(chosen)) {
            if (tries === 1) score++;
            results[s.n] = { event: chosen, first: tries === 1 };
            resolved = true;
            elFeedback.innerHTML = '<span class="good">Correct:</span> ' + s.why +
                (tries > 1 ? ' <span class="muted">(Second attempt: not counted in the score.)</span>' : '');
        } else if (tries === 1) {
            wrongPick = chosen;
            elFeedback.innerHTML = '<span class="bad">' + WRONG_1 + '</span>' + (s.hint ? ' ' + s.hint : '') +
                ' <span class="muted">One more try.</span>';
            chosen = null;
            pick.value = '';
            timeline.setSelection([]);
        } else {
            const ev = BY_ID[s.main];
            results[s.n] = { event: s.main, first: false };
            resolved = true;
            elFeedback.innerHTML = '<span class="bad">Missed.</span> The answer is <b>' + ev.date + ': ' + ev.short + '</b>. ' + s.why;
            chosen = s.main;
            showEventText(s.main);
        }
        updateScore();
        btnCommit.disabled = true;
        if (resolved) {
            pick.disabled = true;
            btnNext.disabled = false;
            const ev = BY_ID[results[s.n].event];
            if (ev.y >= 2008 && ev.y <= 2019) setView('close', true);
            else setView('full', true);
        }
        refresh();
    }

    function showFinal() {
        finished = true;
        chosen = null;
        timeline.setSelection([]);
        setView('full', true);
        refresh();
        const recent = SIGHTS.filter(s => BY_ID[results[s.n].event].y >= 2002).length;
        $('c-count').textContent = 'All eight sights matched';
        $('c-sight').textContent = 'First attempt: ' + score + ' of 8.';
        $('c-q').textContent = '';
        pick.disabled = true;
        pick.value = '';
        showEventText(null);
        elEvent.textContent = 'Click any event on the timeline to read it again.';
        elFeedback.innerHTML = (score >= MASTERY
            ? '<span class="good">Mastery reached.</span> '
            : '<span class="bad">Mastery is 7 of 8.</span> Press Restart to try again. ') +
            recent + ' of the eight sights point to events between 2002 and 2023: much of what a visitor sees in Athens ' +
            'today was shaped in the last two decades, not in antiquity.';
        btnCommit.disabled = true;
        btnNext.disabled = true;
        btnNext.textContent = 'Done';
    }

    btnCommit.onclick = commit;
    btnNext.onclick = () => {
        if (!resolved || finished) return;
        if (idx < SIGHTS.length - 1) { idx++; renderSight(); }
        else showFinal();
    };
    $('restart-btn').onclick = () => restart(true);

    document.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            if (resolved) btnNext.onclick(); else commit();
        }
    });

    function restart(animate) {
        idx = 0; score = 0; finished = false; results = {};
        updateScore();
        setView('full', animate);
        renderSight();
    }

    // A little state for headless testing
    window.modernAthens = {
        choose: id => choose(id), commit: () => commit(), next: () => btnNext.onclick(), score: () => score,
        view: name => setView(name, false),
        playAll: wrongEvery => {
            for (let i = 0; i < SIGHTS.length; i++) {
                const s = SIGHTS[idx];
                if (wrongEvery && idx % wrongEvery === 0) { choose('E4'); commit(); }
                choose(s.main); commit();
                btnNext.onclick();
            }
        }
    };

    restart(false);
});
