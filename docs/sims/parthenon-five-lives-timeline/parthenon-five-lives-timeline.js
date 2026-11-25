// The Parthenon's Five Lives - vis-timeline
// CANVAS_HEIGHT: 544
// Twelve event cards, shown one at a time in a fixed order with their dates.
// For each, the learner chooses which of the building's five lives it was
// living (temple, church, mosque, ruin, protected monument); one scored
// attempt per card. After each answer the card drops onto a timeline from
// 500 BCE to 2030 CE. After card 12 the five lives appear as background bands
// behind the cards. Mastery: 10 of 12, with the two trap cards (7 and 9) right.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------
    const LIVES = [
        { id: 'temple', name: 'Temple of Athena', as: 'the Temple of Athena', short: 'Temple', when: '447 BCE to c. 400 CE' },
        { id: 'church', name: 'Church', as: 'a church', short: 'Church', when: 'by the late 6th century to 1458' },
        { id: 'mosque', name: 'Mosque', as: 'a mosque', short: 'Mosque', when: '1458 to 1687' },
        { id: 'ruin', name: 'Ruin, with a small mosque inside', as: 'a ruin, with a small mosque inside', short: 'Ruin', when: '1687 to 1833' },
        { id: 'monument', name: 'Protected monument', as: 'a protected monument', short: 'Monument', when: '1833 to today' }
    ];
    const lifeById = id => LIVES.find(l => l.id === id);

    // y: year placed on the timeline (negative = BCE). life: correct life.
    const CARDS = [
        { n: 1, y: -447, date: '447 BCE', life: 'temple',
          text: 'Work begins on the new temple, 33 years after the Persians burned the Acropolis.',
          why: 'The Parthenon was built as Athena’s temple.' },
        { n: 2, y: -438, date: '438 BCE', life: 'temple',
          text: 'Phidias’ gold-and-ivory Athena Parthenos is dedicated inside.',
          why: 'The statue was the temple’s centerpiece.' },
        { n: 3, y: 1018, date: '1018 CE', life: 'church',
          text: 'The emperor Basil II gives thanks for his victories in the building.',
          why: 'It was then the church of the Virgin, Our Lady of Athens.' },
        { n: 4, y: 1204, date: '1204 CE', life: 'church',
          text: 'After the Fourth Crusade, the building becomes the Catholic cathedral of Athens.',
          why: 'Still a church, now Latin instead of Orthodox.' },
        { n: 5, y: 1460, date: 'Soon after 1458', life: 'mosque',
          text: 'A minaret is added at the southwest corner.',
          why: 'The Ottomans made the cathedral their mosque; the exact year of the conversion is not known.' },
        { n: 6, y: 1674, date: '1674', life: 'mosque',
          text: 'An artist with the French ambassador draws the sculptures.',
          why: 'It was a nearly complete building, in use as a mosque. The drawings are traditionally credited to Jacques Carrey.' },
        { n: 7, y: 1687, date: 'September 26, 1687', life: 'mosque', trap: true,
          text: 'A Venetian shell ignites gunpowder stored inside.',
          why: 'The explosion ended the mosque’s life, but it happened to a working mosque.' },
        { n: 8, y: 1688, date: 'Early 1688', life: 'ruin',
          text: 'Morosini’s men try to lower the horses of Athena’s chariot from the west pediment; they fall and shatter.',
          why: 'This happened in the months after the explosion, to the ruined building.' },
        { n: 9, y: 1801, end: 1812, date: '1801–1812', life: 'ruin', trap: true,
          text: 'Lord Elgin’s agents remove sculptures and ship them to Britain.',
          why: 'The building was a roofless ruin with a small mosque inside.' },
        { n: 10, y: 1835, date: '1835 onward', life: 'monument',
          text: 'The Greek state clears post-classical buildings from the Acropolis.',
          why: 'This is how the monument’s life began, after the Ottoman garrison left in 1833.' },
        { n: 11, y: 1975, date: '1975', life: 'monument',
          text: 'A new restoration program begins replacing rusted iron clamps.',
          why: 'Restoration is part of its life as a monument.' },
        { n: 12, y: 2009, date: '2009', life: 'monument',
          text: 'The Acropolis Museum opens with a gallery for the frieze.',
          why: 'Its sculptures now live in museums in Athens and London.' }
    ];

    // Bands. The end of the temple and the start of the church are debated,
    // so the years between are drawn as an uncertain, striped band.
    const BANDS = [
        { id: 'b-temple', life: 'temple', from: -447, to: 400, label: 'Temple' },
        { id: 'b-unsure', life: 'unsure', from: 400, to: 590, label: '?',
          title: 'Worship ended at the end of the 4th century CE; the building became a church probably by the late 6th century. The exact dates are debated.' },
        { id: 'b-church', life: 'church', from: 590, to: 1458, label: 'Church' },
        { id: 'b-mosque', life: 'mosque', from: 1458, to: 1687, label: 'Mosque' },
        { id: 'b-ruin', life: 'ruin', from: 1687, to: 1833, label: 'Ruin' },
        { id: 'b-monument', life: 'monument', from: 1833, to: 2030, label: 'Monument' }
    ];

    const MASTERY = 10;
    const TRAPS = [7, 9];

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    // Signed year -> Date. BCE year n is placed at astronomical year -n; the
    // one-year shift is invisible at this scale.
    function toDate(y, m) {
        const d = new Date(2000, m || 0, 1, 0, 0, 0);
        d.setFullYear(y);
        return d;
    }
    const YEAR_MS = 365.25 * 24 * 3600 * 1000;
    const $ = id => document.getElementById(id);
    const fmtYear = y => (y < 0 ? (-y) + ' BCE' : y === 0 ? 'BCE | CE' : y + ' CE');
    const VIEWS = {
        full: [toDate(-560), toDate(2090)],
        close: [toDate(1390), toDate(2045)]
    };

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    let idx = 0, score = 0, answered = false, finished = false;
    let picks = {};   // card n -> chosen life id

    // ------------------------------------------------------------------
    // Timeline
    // ------------------------------------------------------------------
    const container = $('timeline');
    const items = new vis.DataSet();
    let drawn = false;
    let lastView = VIEWS.full;

    function axisLabel(date) {
        const y = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
        if (y < -500 || y > 2030) return '';
        if (drawn) {
            // drop a label that would be cut off at the right edge
            const w = timeline.getWindow();
            const frac = (toDate(y) - w.start) / (w.end - w.start);
            if (frac * container.clientWidth > container.clientWidth - 44) return '';
        }
        return fmtYear(y);
    }
    const options = {
        width: '100%',
        height: '222px',
        orientation: 'top',
        stack: true,
        margin: { item: { horizontal: 2, vertical: 4 }, axis: 4 },
        min: toDate(-700),
        max: toDate(2200),
        zoomMin: 40 * YEAR_MS,
        zoomMax: 2900 * YEAR_MS,
        zoomable: false,       // zoom with the buttons only
        moveable: true,
        selectable: true,
        showCurrentTime: false,
        showMajorLabels: false,
        timeAxis: { scale: 'year', step: 250 },
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
    const timeline = new vis.Timeline(container, items, options);

    // Tick step that leaves room for labels such as "500 BCE"
    const STEPS = [10, 20, 25, 50, 100, 200, 250, 500];
    let currentStep = 250;
    function updateAxis() {
        if (!drawn) return;
        const w = timeline.getWindow();
        const years = (w.end - w.start) / YEAR_MS;
        const px = Math.max(150, container.clientWidth);
        const step = STEPS.find(st => (st / years) * px >= 62) || 500;
        if (step !== currentStep) {
            currentStep = step;
            timeline.setOptions({ timeAxis: { scale: 'year', step: step } });
        }
    }
    timeline.on('rangechanged', function (props) { lastView = [props.start, props.end]; updateAxis(); });
    window.addEventListener('resize', updateAxis);

    let viewName = 'full';
    function setView(name, animate) {
        viewName = name;
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

    function cardTip(c) {
        const L = lifeById(c.life);
        const pick = picks[c.n];
        return '<b>' + c.n + '. ' + c.date + '</b><br>' + c.text + '<br><i>' + L.name + '.</i> ' + c.why +
            (pick && pick !== c.life ? '<br>Your first answer: ' + lifeById(pick).name + '.' : '');
    }

    function refresh(nowN) {
        const list = [];
        CARDS.forEach(c => {
            if (!(c.n in picks)) return;
            const cls = ['cardi', c.life];
            if (picks[c.n] !== c.life) cls.push('miss');
            if (c.n === nowN) cls.push('now');
            list.push({
                id: 'c' + c.n, start: toDate(c.y, c.n === 8 ? 2 : 0), type: 'box',
                content: '<span class="num">' + c.n + '</span>',
                title: cardTip(c), className: cls.join(' ')
            });
        });
        if (finished) {
            BANDS.forEach(b => list.push({
                id: b.id, start: toDate(b.from), end: toDate(b.to), type: 'background',
                content: b.label, className: 'band ' + b.life,
                title: b.title || (lifeById(b.life).name + ': ' + lifeById(b.life).when)
            }));
        }
        items.clear();
        items.add(list);
    }

    timeline.on('select', function (props) {
        if (!props.items.length) return;
        const id = String(props.items[0]);
        if (id.startsWith('c')) showCard(Number(id.slice(1)));
    });

    // ------------------------------------------------------------------
    // Cards
    // ------------------------------------------------------------------
    const elChoices = $('choices'), elFeedback = $('feedback');
    const btnNext = $('next-btn'), btnRestart = $('restart-btn');

    function updateScore() { $('score').textContent = 'First-try score: ' + score + ' of ' + CARDS.length; }

    function feedbackFor(c) {
        const L = lifeById(c.life);
        return picks[c.n] === c.life
            ? '<span class="good">Correct.</span> ' + c.why
            : '<span class="bad">This happened during its life as ' + L.as + ':</span> ' + c.why;
    }

    function buildChoices(c, locked) {
        elChoices.innerHTML = '';
        LIVES.forEach((L, k) => {
            const b = document.createElement('button');
            b.innerHTML = L.short === 'Ruin' ? 'Ruin<small>with a small mosque</small>'
                : L.short === 'Temple' ? 'Temple<small>of Athena</small>'
                : L.short === 'Monument' ? 'Monument<small>protected</small>'
                : L.short + '<small>&nbsp;</small>';
            b.title = L.name + ' (key ' + (k + 1) + ')';
            b.style.borderLeftColor = getComputedStyle(document.documentElement).getPropertyValue('--' + L.id);
            b.onclick = () => answer(L.id);
            if (locked) {
                b.disabled = true;
                if (L.id === c.life) b.classList.add('correct');
                else if (L.id === picks[c.n]) b.classList.add('wrong');
            }
            elChoices.appendChild(b);
        });
    }

    function renderCard() {
        const c = CARDS[idx];
        answered = false;
        $('c-count').textContent = 'Card ' + c.n + ' of ' + CARDS.length;
        $('c-date').textContent = c.date;
        $('c-text').textContent = c.text;
        $('c-q').textContent = 'What was the Parthenon when this happened?';
        buildChoices(c, false);
        elFeedback.innerHTML = '<span class="muted">Choose one of the five lives. Only your first answer counts. ' +
            'The lives’ dates stay hidden until all twelve cards are placed.</span>';
        btnNext.disabled = true;
        btnNext.textContent = idx < CARDS.length - 1 ? 'Next card →' : 'Show the five lives';
    }

    // Re-read an answered card from the timeline (does not change the score)
    function showCard(n) {
        const c = CARDS.find(x => x.n === n);
        if (!(n in picks)) return;
        $('c-count').textContent = 'Card ' + c.n + ' of ' + CARDS.length + ' (review)';
        $('c-date').textContent = c.date;
        $('c-text').textContent = c.text;
        buildChoices(c, true);
        elFeedback.innerHTML = feedbackFor(c);
        if (!finished) {
            btnNext.disabled = !answered;
        }
    }

    function answer(lifeId) {
        if (answered || finished) return;
        const c = CARDS[idx];
        if (c.n in picks) return;
        answered = true;
        picks[c.n] = lifeId;
        if (lifeId === c.life) score++;
        updateScore();
        buildChoices(c, true);
        elFeedback.innerHTML = feedbackFor(c);
        btnNext.disabled = false;
        refresh(c.n);
        if (c.y > 1380 && viewName === 'full') setView('close', true);
        if (c.y < 1380 && viewName === 'close') setView('full', true);
    }

    function finish() {
        finished = true;
        refresh(0);
        setView('full', true);
        const traps = TRAPS.every(n => picks[n] === CARDS[n - 1].life);
        const pass = score >= MASTERY && traps;
        $('c-count').textContent = 'All twelve cards placed';
        $('c-date').textContent = '';
        $('c-text').textContent = 'First-try score: ' + score + ' of 12. Mastery is 10, with cards 7 and 9 both right.';
        $('c-q').textContent = '';
        elChoices.innerHTML = '';
        LIVES.forEach(L => {
            const s = document.createElement('button');
            s.disabled = true;
            s.style.borderLeftColor = getComputedStyle(document.documentElement).getPropertyValue('--' + L.id);
            s.innerHTML = L.short + '<small>' + L.when + '</small>';
            s.style.opacity = 1;
            elChoices.appendChild(s);
        });
        elFeedback.innerHTML = (pass
            ? '<span class="good">You can tell the Parthenon’s story as five lives, not one.</span> '
            : '<span class="bad">Look again at 1687 and at Elgin: was the building whole or ruined at each moment?</span> ') +
            'The temple and church lives each lasted about a thousand years; the ruin began only in 1687, after more than two thousand years of use. ' +
            'The striped band marks the debated years between temple and church. Use <b>Close-up</b> to see the last four lives.';
        btnNext.disabled = true;
        btnNext.textContent = 'Done';
    }

    btnNext.onclick = () => {
        if (!answered || finished) return;
        if (idx < CARDS.length - 1) { idx++; renderCard(); }
        else finish();
    };
    btnRestart.onclick = () => restart(true);

    document.addEventListener('keydown', e => {
        if (['1', '2', '3', '4', '5'].includes(e.key)) answer(LIVES[Number(e.key) - 1].id);
        else if (e.key === 'Enter') btnNext.onclick();
    });

    function restart(animate) {
        idx = 0; score = 0; answered = false; finished = false; picks = {};
        timeline.setSelection([]);
        updateScore();
        setView('full', animate);
        refresh(0);
        renderCard();
    }

    // A little state for headless testing
    window.parthenonLives = {
        answer: id => answer(id), next: () => btnNext.onclick(), view: name => setView(name, false),
        score: () => score, correctOf: i => CARDS[i].life
    };

    restart(false);
});
