// Eras of the Eastern Mediterranean Timeline - vis-timeline
// CANVAS_HEIGHT: 440
// Nine period bands shown to scale from 3200 BCE to 2026 CE, and nothing else:
// this is the Chapter 1 introduction, so events live in a separate appendix
// sim (eastern-med-events-timeline). Six proportion questions are asked before
// the relevant bands are highlighted and their lengths shown.
// Years are stored as signed numbers: negative = BCE, positive = CE.
// There is no year zero, so durations that cross the BCE/CE line subtract one.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------
    const BOUNDARY_NOTE = 'Boundaries vary by place; see the chapter.';

    // row = which of three staggered label rows the band sits in, so the
    // names of short periods do not collide at the full 5,000-year view.
    // short = name drawn on the band; name = full name in tooltip and infobox.
    // anchors = one or two sites on our route, shown only in the infobox, so
    // each era has something concrete to hang on without crowding the bands.
    const ERAS = [
        { key: 'bronze', short: 'Bronze Age',      name: 'Bronze Age',         start: -3200, end: -1100, cStart: true,  cEnd: true,  color: '#B07030', row: 0,
          desc: 'Tools of bronze; palaces, scribes, and long-distance metal trade; Minoans, Mycenaeans, Hittites, and Troy.',
          anchors: ['First palace at Knossos (c. 1900 BCE)', 'Troy VI (c. 1750–1300 BCE)'] },
        { key: 'iron', short: 'Iron Age',        name: 'Iron Age',           start: -1100, end: -800,  cStart: true,  cEnd: true,  color: '#5E6B73', row: 1,
          desc: 'After the palaces fell; iron replaces bronze; writing disappears from Greece.',
          anchors: ['Greek speakers settle Ionia, the coast around Ephesus'] },
        { key: 'archaic', short: 'Archaic',     name: 'Archaic Period',     start: -800,  end: -480,  cStart: true,  cEnd: false, color: '#C9A227', row: 2, dark: true,
          desc: 'The alphabet, Homer, city-states, colonies, the first coins, and the first democracy.',
          anchors: ['First Olympic Games (776 BCE)', 'Byzantium founded (c. 657 BCE)'] },
        { key: 'classical', short: 'Classical',   name: 'Classical Period',   start: -480,  end: -323,  color: '#2E6E9E', row: 0,
          desc: "From the Persian Wars to Alexander's death: Athens's Parthenon, theater, and philosophy.",
          anchors: ['The Parthenon (447–432 BCE)'] },
        { key: 'hellenistic', short: 'Hellenistic', name: 'Hellenistic Period', start: -323,  end: -31,   color: '#4BA3A0', row: 1, dark: true,
          desc: "Alexander's successor kingdoms spread Greek language and culture from Egypt to Afghanistan.",
          anchors: ['Colossus of Rhodes (c. 280 BCE)'] },
        { key: 'roman', short: 'Roman',       name: 'Roman Period',       start: -31,   end: 330,   color: '#A4282A', row: 2,
          desc: 'Rome rules the whole Mediterranean; the Pax Romana; Christianity spreads.',
          anchors: ['Paul in Ephesus (c. 52–55 CE)'] },
        { key: 'byzantine', short: 'Byzantine',   name: 'Byzantine Period',   start: 330,   end: 1453,  color: '#6E3F8F', row: 0,
          desc: 'The Christian, Greek-speaking Roman Empire ruled from Constantinople.',
          anchors: ['Hagia Sophia (537 CE)'] },
        { key: 'ottoman', short: 'Ottoman',     name: 'Ottoman Period',     start: 1453,  end: 1922,  color: '#2F7D4A', row: 1,
          desc: 'The Ottoman Empire rules from Istanbul over a multi-faith population.',
          anchors: ['Topkapı Palace begun (1459 CE)'] },
        { key: 'modern', short: 'Modern',      name: 'Modern era',         start: 1922,  end: 2026,  color: '#D98B9B', row: 2, dark: true, labelLeft: true,
          desc: 'The Republic of Turkey and modern Greece.',
          anchors: ['Republic of Turkey founded (1923 CE)'] }
    ];

    const QUESTIONS = [
        { q: 'Which lasted longer: the Bronze Age or the Classical period?',
          choices: ['Bronze Age', 'Classical Period'], correct: 0,
          why: 'The Bronze Age lasted about 2,100 years; the Classical period lasted 157 years.',
          eras: ['bronze', 'classical'] },
        { q: 'About how much of the whole timeline, 3200 BCE to 2026 CE, does the Bronze Age fill?',
          choices: ['About a tenth', 'About a quarter', 'About two-fifths', 'About three-quarters'], correct: 2,
          why: 'The Bronze Age lasted about 2,100 of the 5,225 years, or about 40 percent: the whole morning on the 24-hour clock.',
          eras: ['bronze'] },
        { q: 'Which lasted longer: the Byzantine period or the Ottoman period?',
          choices: ['Byzantine Period', 'Ottoman Period'], correct: 0,
          why: 'The Byzantine period lasted 1,123 years (330–1453); the Ottoman period in Istanbul lasted 469 years (1453–1922).',
          eras: ['byzantine', 'ottoman'] },
        { q: 'Which lasted longer: the Classical, Hellenistic, and Roman periods put together, or the Byzantine period alone?',
          choices: ['Classical + Hellenistic + Roman', 'Byzantine alone'], correct: 1,
          why: '157 + 292 + 360 = 809 years for the three together, against 1,123 years for the Byzantine period alone.',
          eras: ['classical', 'hellenistic', 'roman', 'byzantine'] },
        { q: 'The Roman period ran from 31 BCE to 330 CE. How many years is that?',
          choices: ['299', '330', '360', '361'], correct: 2,
          why: 'Across the BCE/CE line we add the two numbers and subtract one, because there was no year zero: 31 + 330 − 1 = 360.',
          eras: ['roman'] },
        { q: 'In which period was writing almost unknown in Greece?',
          choices: ['Bronze Age', 'Iron Age', 'Archaic Period', 'Hellenistic Period'], correct: 1,
          why: 'After the palaces fell around 1200–1100 BCE, Linear B was forgotten; Greeks did not write again until they adopted the alphabet around 800 BCE.',
          eras: ['iron'] }
    ];

    // Full view: a little room on each side. The short Modern-era band draws
    // its label to the left of the bar so it is not clipped at the right edge.
    const FULL_START = -3350;
    const FULL_END = 2250;
    const YEAR_MS = 365.25 * 24 * 3600 * 1000;

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    // Signed year -> Date. BCE year n is placed at astronomical year -n, so the
    // axis reads "500 BCE" at the 500 BCE tick. The one-year shift this causes
    // is invisible at century scale; durations use the rule below, not pixels.
    function toDate(y) {
        const d = new Date(2000, 0, 1, 0, 0, 0);
        d.setFullYear(y);
        return d;
    }

    // Duration with no year zero: crossing BCE -> CE subtracts one.
    function duration(start, end) {
        return end - start - (start < 0 && end > 0 ? 1 : 0);
    }

    function fmtYear(y, circa) {
        const s = y < 0 ? (-y) + ' BCE' : y + ' CE';
        return circa ? 'c. ' + s : s;
    }

    function fmtNum(n) { return n.toLocaleString('en-US'); }

    function eraDates(era) {
        return fmtYear(era.start, era.cStart) + ' – ' + fmtYear(era.end, era.cEnd);
    }

    function eraByKey(key) { return ERAS.find(e => e.key === key); }

    function axisLabel(date) {
        const y = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
        if (y === 0) return 'BCE | CE';
        return y < 0 ? (-y) + ' BCE' : y + ' CE';
    }

    // ------------------------------------------------------------------
    // Build the vis-timeline items
    // ------------------------------------------------------------------
    // vis-timeline's own stacking counts a spilled label as part of a bar's
    // width, which pushes far-apart bands onto extra lines. So stacking is off
    // and each band is assigned to one of three fixed rows.
    const container = document.getElementById('timeline');
    let timeline = null;              // created below
    let qIndex = 0;
    let score = 0;
    let answered = false;
    let finished = false;

    const groups = new vis.DataSet([
        { id: 'eras0', content: 'Eras', order: 0, className: 'era-row' },
        { id: 'eras1', content: '', order: 1, className: 'era-row' },
        { id: 'eras2', content: '', order: 2, className: 'era-row era-row-last' }
    ]);

    function eraItem(era, opts) {
        opts = opts || {};
        const cls = ['era'];
        if (era.dark) cls.push('dark-text');
        if (opts.hl) cls.push('hl');
        if (opts.dim) cls.push('dim');
        if (era.labelLeft) cls.push('label-left');
        const label = opts.showDuration
            ? era.short + ' · ' + fmtNum(duration(era.start, era.end)) + ' yrs'
            : era.short;
        return {
            id: 'era-' + era.key,
            group: 'eras' + era.row,
            start: toDate(era.start),
            end: toDate(era.end),
            type: 'range',
            content: era.labelLeft ? '<span>' + label + '</span>' : label,
            title: era.name + '<br>' + eraDates(era),
            className: cls.join(' '),
            style: 'background-color:' + era.color + ';border-color:' + era.color + ';'
        };
    }

    const items = new vis.DataSet();
    // Faint full-height shading for every era, behind the bands
    ERAS.forEach(era => items.add({
        id: 'bg-' + era.key,
        start: toDate(era.start),
        end: toDate(era.end),
        type: 'background',
        className: 'era-bg',
        style: 'background-color:' + era.color + ';'
    }));
    ERAS.forEach(era => items.add(eraItem(era)));

    const options = {
        width: '100%',
        orientation: 'top',
        stack: false,            // rows are assigned above
        groupOrder: 'order',
        margin: { item: { horizontal: 6, vertical: 4 }, axis: 6 },
        min: toDate(-3700),
        max: toDate(2800),
        zoomMin: 200 * YEAR_MS,
        zoomMax: 6500 * YEAR_MS,
        zoomable: false,         // the view changes only when a question zooms in
        moveable: true,          // click-and-drag panning
        selectable: true,
        showCurrentTime: false,
        showMajorLabels: false,
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        format: {
            minorLabels: function (date) { return axisLabel(date); },
            majorLabels: function () { return ''; }
        }
    };

    // The opening window is set once the first draw is done, not with
    // options.start/end: with those, vis-timeline stays hidden until a
    // 'rangechanged' event arrives, which headless browsers may never send.
    // vis-timeline fits itself to the items on its first draw, which can come
    // late in an off-screen iframe. Re-apply the last view we asked for.
    let lastView = [toDate(FULL_START), toDate(FULL_END)];
    let drawn = false;
    function setView(start, end, animate) {
        lastView = [start, end];
        if (drawn) timeline.setWindow(start, end, { animation: !!animate });
    }
    options.onInitialDrawComplete = function () {
        drawn = true;
        timeline.setWindow(lastView[0], lastView[1], { animation: false });
    };
    timeline = new vis.Timeline(container, items, groups, options);

    // Vertical wheel scrolls the page; horizontal wheel pans the timeline.
    container.addEventListener('wheel', function (e) {
        const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if (!isHorizontal) {
            e.stopImmediatePropagation();
        } else {
            e.preventDefault();
            const win = timeline.getWindow();
            const interval = win.end - win.start;
            const shift = (e.deltaX / container.clientWidth) * interval;
            timeline.setWindow(new Date(win.start.valueOf() + shift),
                               new Date(win.end.valueOf() + shift), { animation: false });
        }
    }, true);

    // ------------------------------------------------------------------
    // Full-span button and window label
    // ------------------------------------------------------------------
    function showFullSpan(animate) {
        setView(toDate(FULL_START), toDate(FULL_END), animate);
    }

    document.getElementById('full-span').onclick = () => {
        if (finished) setHighlights([]);   // quiz over: show every band at full strength
        showFullSpan(true);
    };

    const windowLabel = document.getElementById('window-label');
    function updateWindowLabel() {
        const win = timeline.getWindow();
        const a = Math.round(win.start.getFullYear() / 10) * 10;
        const b = Math.round(win.end.getFullYear() / 10) * 10;
        const span = Math.round((win.end - win.start) / YEAR_MS / 10) * 10;
        windowLabel.textContent = 'Showing ' + fmtYear(a) + ' – ' + fmtYear(b) +
            ' (about ' + fmtNum(span) + ' years)';
    }
    timeline.on('rangechanged', updateWindowLabel);

    // Pick a tick step that leaves room for labels such as "2500 BCE"
    const STEPS = [10, 20, 25, 50, 100, 200, 250, 500, 1000];
    let currentStep = 0;
    function updateAxisStep() {
        const win = timeline.getWindow();
        const years = (win.end - win.start) / YEAR_MS;
        const px = container.clientWidth - 60;
        const minGap = 72;   // pixels between tick labels
        const step = STEPS.find(st => (st / years) * px >= minGap) || 1000;
        if (step !== currentStep) {
            currentStep = step;
            timeline.setOptions({ timeAxis: { scale: 'year', step: step } });
        }
    }
    timeline.on('rangechanged', updateAxisStep);
    window.addEventListener('resize', updateAxisStep);

    // ------------------------------------------------------------------
    // Quiz state
    // ------------------------------------------------------------------
    let revealedEras = new Set();   // eras whose durations have been shown

    const elCount = document.getElementById('q-count');
    const elText = document.getElementById('q-text');
    const elChoices = document.getElementById('choices');
    const elFeedback = document.getElementById('feedback');
    const elScore = document.getElementById('score');
    const btnNext = document.getElementById('next-btn');
    const btnRestart = document.getElementById('restart-btn');
    const elDetails = document.getElementById('details');

    function setHighlights(eraKeys) {
        const anyEra = eraKeys.length > 0;
        items.update(ERAS.map(era => eraItem(era, {
            hl: eraKeys.includes(era.key),
            dim: anyEra && !eraKeys.includes(era.key),
            showDuration: eraKeys.includes(era.key)
        })));
    }

    // Zoom to show every highlighted band with some padding
    function fitTo(eraKeys) {
        const years = [];
        eraKeys.forEach(k => { const e = eraByKey(k); years.push(e.start, e.end); });
        if (!years.length) return;
        let lo = Math.min(...years), hi = Math.max(...years);
        const pad = Math.max((hi - lo) * 0.12, 60);
        lo -= pad;
        hi += pad * 1.8;   // extra room on the right for labels
        if (hi - lo < 220) hi = lo + 220;
        setView(toDate(Math.round(lo)), toDate(Math.round(hi)), true);
    }

    function renderQuestion() {
        const Q = QUESTIONS[qIndex];
        answered = false;
        elCount.textContent = 'Question ' + (qIndex + 1) + ' of ' + QUESTIONS.length;
        elText.textContent = Q.q;
        elChoices.innerHTML = '';
        Q.choices.forEach((label, i) => {
            const b = document.createElement('button');
            b.textContent = label;
            b.onclick = () => answer(i);
            elChoices.appendChild(b);
        });
        elFeedback.innerHTML = '<span style="color:#5d6d78">Choose an answer. Use the bands above to judge the proportions.</span>';
        btnNext.disabled = true;
        btnNext.textContent = 'Next →';
    }

    function answer(i) {
        if (answered) return;
        answered = true;
        const Q = QUESTIONS[qIndex];
        const right = i === Q.correct;
        if (right) score++;
        elScore.textContent = 'Correct: ' + score + ' of ' + QUESTIONS.length;

        [...elChoices.children].forEach((b, k) => {
            b.disabled = true;
            if (k === Q.correct) b.classList.add('correct');
            else if (k === i) b.classList.add('wrong');
        });

        Q.eras.forEach(k => revealedEras.add(k));
        setHighlights(Q.eras);
        fitTo(Q.eras);

        let html = right ? '<span class="verdict-good">Correct.</span> '
                         : '<span class="verdict-bad">Not quite.</span> The answer is <b>' +
                           Q.choices[Q.correct] + '</b>. ';
        html += Q.why;

        if (qIndex === QUESTIONS.length - 1) {
            finished = true;
            const verdict = score >= 5
                ? '5 or more: you have the timeline.'
                : 'Fewer than 5: reread the 24-hour clock table, then press Restart and try again.';
            elDetails.innerHTML =
                '<h2>Correct: ' + score + ' of ' + QUESTIONS.length + '</h2>' +
                '<p><b>' + verdict + '</b></p>' +
                '<p>Press <b>Full span</b> to see all nine periods, then click any band to read about it and its length.</p>';
            btnNext.disabled = true;
            btnNext.textContent = 'Done';
        } else {
            btnNext.disabled = false;
        }
        elFeedback.innerHTML = html;
    }

    function nextQuestion() {
        if (!answered || finished) return;
        qIndex++;
        setHighlights([]);
        showFullSpan(true);
        renderQuestion();
    }

    function restart() {
        qIndex = 0;
        score = 0;
        finished = false;
        revealedEras = new Set();
        setHighlights([]);
        timeline.setSelection([]);
        elScore.textContent = 'Correct: 0 of ' + QUESTIONS.length;
        elDetails.innerHTML = '<div class="placeholder">Answer the question, then click any era band to read about it.</div>';
        showFullSpan(true);
        renderQuestion();
    }

    btnNext.onclick = nextQuestion;
    btnRestart.onclick = restart;

    // ------------------------------------------------------------------
    // Infobox
    // ------------------------------------------------------------------
    function showEra(era) {
        const showDur = finished || revealedEras.has(era.key);
        const dur = showDur
            ? ' · ' + fmtNum(duration(era.start, era.end)) + ' years'
            : ' · length shown after you answer a question about it';
        elDetails.innerHTML =
            '<h2><span class="swatch" style="background:' + era.color + '"></span>' + era.name + '</h2>' +
            '<div class="when">' + eraDates(era) + dur + '</div>' +
            '<p>' + era.desc + '</p>' +
            '<p><b>On our route:</b> ' + era.anchors.join('; ') + '.</p>' +
            '<p class="note">' + BOUNDARY_NOTE + '</p>';
    }

    timeline.on('select', function (props) {
        if (!props.items.length) return;
        const id = String(props.items[0]);
        if (id.startsWith('era-')) showEra(eraByKey(id.slice(4)));
    });

    // ------------------------------------------------------------------
    // Start: nine bands, question 1
    // ------------------------------------------------------------------
    renderQuestion();
});
