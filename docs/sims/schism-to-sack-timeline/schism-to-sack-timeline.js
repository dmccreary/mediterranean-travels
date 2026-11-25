// From the Schism to the Sack, 1054–1261 - vis-timeline
// CANVAS_HEIGHT: 706
// Seventeen numbered events in three rows (Church, Crusades, Byzantium and
// Venice) from 1054 to 1261. Clicking an event, or stepping with Previous /
// Next event in date order, shows its date and description. Four cause
// questions, each answered once, ask which earlier event best explains a
// later one; after each answer the events it points to are highlighted.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------
    const GROUPS = [
        { id: 'church',   content: 'Church',               color: '#B8862B', className: 'g-church' },
        { id: 'crusades', content: 'Crusades',             color: '#A4282A', className: 'g-crusades' },
        { id: 'bv',       content: 'Byzantium and Venice', label: 'Byzantium<br>and Venice', color: '#2F6E8E', className: 'g-bv' }
    ];

    // start/end are [year, month (1-12), day]; a missing day or month means
    // the sources give only the month or year, and "when" is what is shown.
    const EVENTS = [
        { n: 1,  start: [1054, 7, 16], when: 'July 16, 1054', group: 'church', short: 'Excommunication',
          title: 'Excommunication in Hagia Sophia',
          desc: 'Cardinal Humbert lays a bull of excommunication on the altar; Patriarch Keroularios replies in kind. A symbol of the long drift between Rome and Constantinople.' },
        { n: 2,  start: [1071, 8, 26], when: 'August 26, 1071', group: 'bv', short: 'Manzikert',
          title: 'Battle of Manzikert',
          desc: 'The Seljuk Turks defeat the Byzantine army in eastern Anatolia; much of Anatolia is lost over the next decades.' },
        { n: 3,  start: [1082, 1, 1], when: '1082 (some historians say 1092)', group: 'bv', short: 'Venice’s privileges',
          title: 'Venice’s trading privileges',
          desc: 'Alexios I grants Venice tax-free trade and a quarter on the Golden Horn in return for naval help (some historians date the grant to 1092).' },
        { n: 4,  start: [1095, 11, 27], when: 'November 27, 1095', group: 'crusades', short: 'Clermont',
          title: 'Urban II at Clermont',
          desc: 'Answering Alexios I’s request for soldiers, the pope calls for an armed pilgrimage to Jerusalem.' },
        { n: 5,  start: [1096, 8, 1], end: [1097, 5, 31], when: '1096 to 1097', group: 'crusades', short: 'Crusaders at Constantinople',
          title: 'Crusaders at Constantinople',
          desc: 'Crusader armies camp outside the city; Alexios ferries them across the Bosphorus.' },
        { n: 6,  start: [1099, 7, 15], when: 'July 15, 1099', group: 'crusades', short: 'Jerusalem taken',
          title: 'Jerusalem taken',
          desc: 'The First Crusade captures Jerusalem; crusader states are founded.' },
        { n: 7,  start: [1147, 1, 1], end: [1149, 12, 31], when: '1147 to 1149', group: 'crusades', short: 'Second Crusade',
          title: 'Second Crusade',
          desc: 'Fails at Damascus.' },
        { n: 8,  start: [1171, 3, 12], when: 'March 12, 1171', group: 'bv', short: 'Venetians arrested',
          title: 'Venetians arrested',
          desc: 'Emperor Manuel I arrests Venetians across the empire and seizes their goods; relations break down.' },
        { n: 9,  start: [1182, 1, 1], when: '1182', group: 'bv', short: 'Massacre of the Latins',
          title: 'Massacre of the Latins',
          desc: 'A mob in Constantinople kills or drives out most of the city’s Western merchants.' },
        { n: 10, start: [1187, 10, 2], when: 'October 2, 1187', group: 'crusades', short: 'Saladin takes Jerusalem',
          title: 'Saladin takes Jerusalem',
          desc: 'After his victory at Hattin, Saladin takes Jerusalem.' },
        { n: 11, start: [1189, 1, 1], end: [1192, 12, 31], when: '1189 to 1192', group: 'crusades', short: 'Third Crusade',
          title: 'Third Crusade',
          desc: 'Acre retaken; Jerusalem remains under Saladin.' },
        { n: 12, start: [1202, 11, 15], when: 'November 1202', group: 'crusades', short: 'Zara',
          title: 'Zara taken',
          desc: 'Unable to pay Venice for its fleet, the crusaders capture the Christian city of Zara for Venice; the pope excommunicates them.' },
        { n: 13, start: [1203, 7, 15], when: 'July 1203', group: 'crusades', short: 'First attack',
          title: 'First attack on Constantinople',
          desc: 'The crusaders restore Isaac II and his son Alexios IV, who has promised them 200,000 marks he cannot pay.' },
        { n: 14, start: [1204, 4, 12], end: [1204, 4, 15], when: 'April 12 to 15, 1204', group: 'crusades', short: 'Sack',
          title: 'Sack of Constantinople',
          desc: 'The crusaders storm the city and sack it for three days; churches, palaces and Hagia Sophia are looted.' },
        { n: 15, start: [1204, 5, 16], when: 'May 16, 1204', group: 'bv', short: 'Latin emperor',
          title: 'Latin emperor crowned',
          desc: 'Baldwin of Flanders is crowned emperor in Hagia Sophia; Venice takes three-eighths of the city and empire.' },
        { n: 16, start: [1205, 6, 1], when: '1205', group: 'bv', short: 'Dandolo buried',
          title: 'Dandolo buried in Hagia Sophia',
          desc: 'The Doge of Venice dies and is buried in the church’s gallery.' },
        { n: 17, start: [1261, 7, 25], when: 'July 25, 1261', group: 'bv', short: 'Recovered',
          title: 'Constantinople recovered',
          desc: 'Forces of Michael VIII Palaiologos retake the city; the Latin Empire ends.' }
    ];

    const QUESTIONS = [
        { q: 'Why did crusader armies first come to Constantinople in 1096?',
          choices: ['Alexios I had asked the pope for soldiers after losing Anatolia to the Seljuks',
                    'They planned to capture the city',
                    'Venice hired them'],
          correct: 0,
          right: 'Yes: the Crusades began as an answer to Byzantium’s request for help.',
          wrong: 'Look at events 2 and 4: Manzikert, then Alexios’s request.',
          events: [2, 4, 5] },
        { q: 'Why did the crusaders attack Zara, a Christian city, in 1202?',
          choices: ['To pay their debt to Venice for the fleet',
                    'Because of the Schism of 1054',
                    'The pope ordered it'],
          correct: 0,
          right: 'Right: the debt to Venice redirected the crusade.',
          wrong: 'Look at event 12: the pope in fact excommunicated them for it.',
          events: [12] },
        { q: 'Why were many Byzantines hostile to Westerners in the city by 1203?',
          choices: ['The arrests of 1171 and the massacre of 1182 had poisoned relations',
                    'The First Crusade had taken Jerusalem',
                    'Saladin had taken Jerusalem'],
          correct: 0,
          right: 'Yes: a generation of conflict over trade came before the crusade.',
          wrong: 'Look at events 8 and 9.',
          events: [8, 9] },
        { q: 'Why did the crusaders storm the city in April 1204?',
          choices: ['Alexios IV could not pay the 200,000 marks he had promised them',
                    'The pope ordered the attack',
                    'Constantinople had attacked Venice'],
          correct: 0,
          right: 'Right: a broken promise of money, on top of Venice’s debts, led to the assault.',
          wrong: 'Look at event 13.',
          events: [13, 14] }
    ];
    const MASTERY = 3;

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    function toDate(a) {
        const d = new Date(2000, (a[1] || 1) - 1, a[2] || 1, 0, 0, 0);
        d.setFullYear(a[0]);
        return d;
    }
    function yearDate(y) { return toDate([y, 1, 1]); }
    const YEAR_MS = 365.25 * 24 * 3600 * 1000;
    const groupById = id => GROUPS.find(g => g.id === id);
    const evByN = n => EVENTS.find(e => e.n === n);

    // ------------------------------------------------------------------
    // Timeline
    // ------------------------------------------------------------------
    const container = document.getElementById('timeline');
    const FULL = [yearDate(1037), yearDate(1305)];   // room on the right for event 17's label
    const CLOSE = [yearDate(1199), toDate([1206, 7, 1])];
    let highlighted = [];

    function itemFor(ev) {
        const cls = ['ev', ev.group];
        if (highlighted.includes(ev.n)) cls.push('hl');
        const item = {
            id: ev.n,
            group: ev.group,
            start: toDate(ev.start),
            content: '<span class="lbl"><span class="num">' + ev.n + '</span>' + ev.short + '</span>',
            title: '<b>' + ev.n + '. ' + ev.title + '</b><br>' + ev.when,
            className: cls.join(' '),
            type: ev.end ? 'range' : 'point'
        };
        if (ev.end) item.end = toDate(ev.end);
        return item;
    }

    const groups = new vis.DataSet(GROUPS.map((g, i) => ({ id: g.id, content: g.label || g.content, order: i, className: g.className })));
    const items = new vis.DataSet(EVENTS.map(itemFor));

    const options = {
        width: '100%',
        // fixed, so the page does not jump when the view changes; taller on
        // narrow screens, where the labels stack deeper
        height: window.innerWidth < 600 ? '340px' : '250px',
        orientation: 'top',
        // keep the class on the number badge (the default XSS filter strips it)
        xss: { disabled: false, filterOptions: { whiteList: { span: ['class'], b: [], br: [] } } },
        stack: true,
        groupOrder: 'order',
        margin: { item: { horizontal: 4, vertical: 4 }, axis: 4 },
        min: yearDate(1030),
        max: yearDate(1320),
        zoomMin: 3 * YEAR_MS,
        zoomMax: 260 * YEAR_MS,
        zoomable: false,         // the view changes with the Full span and Close-up buttons
        moveable: true,
        selectable: true,
        showCurrentTime: false,
        showMajorLabels: false,
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        timeAxis: { scale: 'year', step: 10 },
        format: {
            minorLabels: function (date) {
                const y = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
                return String(y);
            },
            majorLabels: function () { return ''; }
        }
    };

    // Set the window after the first draw (headless browsers may never send
    // the rangechanged event that options.start/end wait for).
    let timeline = null;
    let lastView = FULL;
    let drawn = false;
    function setView(view, animate) {
        lastView = view;
        if (drawn) timeline.setWindow(view[0], view[1], { animation: !!animate });
        updateAxisStep(view);
    }
    options.onInitialDrawComplete = function () {
        drawn = true;
        timeline.setWindow(lastView[0], lastView[1], { animation: false });
    };
    timeline = new vis.Timeline(container, items, groups, options);

    // Tick step that leaves room for the year labels
    function updateAxisStep(view) {
        const years = (view[1] - view[0]) / YEAR_MS;
        const px = Math.max(200, container.clientWidth - 140);
        const step = [1, 2, 5, 10, 20, 25, 50].find(st => (st / years) * px >= 44) || 50;
        timeline.setOptions({ timeAxis: { scale: 'year', step: step } });
    }
    updateAxisStep(FULL);
    window.addEventListener('resize', () => updateAxisStep(lastView));

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

    document.getElementById('full-span').onclick = () => setView(FULL, true);
    document.getElementById('close-up').onclick = () => setView(CLOSE, true);

    // Legend
    document.getElementById('legend').innerHTML = GROUPS.map(g =>
        '<span><span class="swatch" style="background:' + g.color + '"></span>' + g.content + '</span>').join('');

    // ------------------------------------------------------------------
    // Event details and stepping in date order
    // ------------------------------------------------------------------
    const elDetails = document.getElementById('details');
    const btnPrev = document.getElementById('prev-btn');
    const btnNextEv = document.getElementById('next-ev-btn');
    let currentEv = 0;    // 0 = none selected, else event number

    function showEvent(n, fromStep) {
        currentEv = n;
        const ev = evByN(n);
        const g = groupById(ev.group);
        timeline.setSelection([n]);
        elDetails.innerHTML =
            '<div class="step">Event ' + n + ' of ' + EVENTS.length + '</div>' +
            '<h2>' + ev.title + '</h2>' +
            '<div class="when">' + ev.when + ' · <span class="group"><span class="swatch" style="background:' +
            g.color + '"></span>' + g.content + '</span></div>' +
            '<p>' + ev.desc + '</p>';
        // When stepping, keep the event in view if the close-up hides it
        if (fromStep) {
            const t = toDate(ev.start);
            const win = timeline.getWindow();
            if (t < win.start || t > win.end) setView(FULL, true);
        }
        btnPrev.disabled = (n <= 1);
        btnNextEv.disabled = (n >= EVENTS.length);
    }

    btnPrev.onclick = () => { if (currentEv > 1) showEvent(currentEv - 1, true); };
    btnNextEv.onclick = () => { if (currentEv < EVENTS.length) showEvent(currentEv + 1, true); };
    btnPrev.disabled = true;

    timeline.on('select', function (props) {
        if (!props.items.length) return;
        showEvent(Number(props.items[0]), false);
    });

    function setHighlights(ns) {
        highlighted = ns;
        items.update(EVENTS.map(itemFor));
        if (currentEv) timeline.setSelection([currentEv]);
    }

    // ------------------------------------------------------------------
    // Cause questions
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
        elCount.textContent = 'Cause question ' + (qIndex + 1) + ' of ' + QUESTIONS.length;
        elText.textContent = Q.q;
        elChoices.innerHTML = '';
        Q.choices.forEach((label, i) => {
            const b = document.createElement('button');
            b.textContent = String.fromCharCode(97 + i) + ') ' + label;
            b.onclick = () => answer(i);
            elChoices.appendChild(b);
        });
        elFeedback.innerHTML = '<span style="color:#5d6d78">Choose the earlier event that best explains it.</span>';
        btnNext.disabled = true;
        btnNext.textContent = 'Next question →';
    }

    function answer(i) {
        if (answered) return;
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
        setHighlights(Q.events);

        let html = right ? '<span class="verdict-good">' + Q.right + '</span>'
                         : '<span class="verdict-bad">Not quite.</span> ' + Q.wrong;
        if (qIndex === QUESTIONS.length - 1) {
            finished = true;
            html += '<span class="final">' + score + ' of 4. ' + (score >= MASTERY
                ? 'You can explain how a crusade to Egypt ended in Constantinople.'
                : 'Click events 8 to 14 again, in order, and try the questions once more.') + '</span>';
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
        setHighlights([]);
        renderQuestion();
    };
    btnRestart.onclick = () => {
        qIndex = 0;
        score = 0;
        finished = false;
        elScore.textContent = 'Correct: 0 of ' + QUESTIONS.length;
        setHighlights([]);
        renderQuestion();
    };

    // Expose a little state for headless testing
    window.schismSim = { answer: i => answer(i), next: () => btnNext.onclick(), showEvent: n => showEvent(n, true),
                         closeUp: () => setView(CLOSE, false) };

    renderQuestion();
});
