// Where in Paul's Life Was Each Letter Written? - vis-timeline
// CANVAS_HEIGHT: 600
// The seven undisputed letters of Paul are cards in a tray, each with one clue
// from inside the letter. The learner drags each card onto one of six periods
// of Paul's life on a 30-70 CE timeline (or selects it and clicks a period),
// then presses Check. Correct cards lock; wrong ones return for a second try.
// After the second Check any card still wrong moves to its first accepted
// period, marked "shown". Prison letters accept more than one period.
// Years are CE and fractional (52.5 = mid-52); all dates are approximate.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------
    const BANDS = [
        { id: 'A', start: 33, end: 46, name: 'Call and early years', short: 'Call, early years', dates: 'c. 33–46 CE',
          what: 'Call near Damascus; Arabia; first visit to Jerusalem; Syria and Cilicia' },
        { id: 'B', start: 46, end: 48, name: 'First journey', short: '1st', dates: 'c. 46–48 CE',
          what: 'Cyprus and southern Anatolia' },
        { id: 'C', start: 49, end: 52, name: 'Second journey', short: '2nd', dates: 'c. 49–52 CE',
          what: 'Macedonia, Athens, eighteen months in Corinth' },
        { id: 'D', start: 52, end: 57, name: 'Third journey', short: '3rd journey', dates: 'c. 52–57 CE',
          what: 'Two to three years in Ephesus, then Macedonia and Corinth' },
        { id: 'E', start: 57, end: 59, name: 'Prison in Caesarea', short: '', dates: 'c. 57–59 CE',
          what: 'Arrest in Jerusalem; two years held in Caesarea' },
        { id: 'F', start: 59, end: 62, name: 'Voyage and Rome', short: 'Rome', dates: 'c. 59–62 CE',
          what: 'Shipwreck on Malta; two years of house arrest in Rome' }
    ];

    const EVENTS = [
        { id: 'e-meet', group: 'ev1', type: 'point', start: 49, label: 'Jerusalem meeting, c. 49', cls: 'label-left',
          info: 'c. 49 CE: the meeting in Jerusalem about Gentile believers and the law (Galatians 2; Acts 15). Chapter 11 tells the story.' },
        { id: 'e-eph', group: 'ev1', type: 'range', start: 52, end: 55, label: 'Paul in Ephesus',
          info: 'c. 52–55 CE: Paul in Ephesus, two to three years by Acts\' count (Acts 19:8–10; 20:31).' },
        { id: 'e-gallio', group: 'ev2', type: 'range', start: 51, end: 52, label: 'Gallio, 51–52',
          info: '51–52 CE: Gallio proconsul of Achaia, when Paul was brought before him in Corinth (Acts 18:12). The date comes from an inscription found at Delphi, one of the few firm anchors for Paul\'s chronology.' },
        { id: 'e-death', group: 'ev2', type: 'range', start: 62, end: 67, label: 'Death (trad.)', cls: 'trad',
          info: 'c. 62–67 CE: Paul\'s death in Rome under Nero, according to later tradition. Acts ends with Paul alive under house arrest.' }
    ];

    // accept lists band indices; the first one is where a card is "shown" after the second Check
    const LETTERS = [
        { name: '1 Thessalonians', short: '1 Thess',
          clue: 'Paul stayed behind in Athens and sent Timothy to Thessalonica; Timothy has just come back with good news.',
          ref: '1 Thessalonians 3:1–6', accept: [2],
          why: 'Acts has Timothy rejoin Paul in Corinth after Athens, on the second journey, about 50 CE (Acts 18:5). It is the earliest surviving letter.' },
        { name: 'Galatians', short: 'Galatians',
          clue: 'Paul tells of the Jerusalem meeting about circumcision and of a later quarrel with Peter at Antioch.',
          ref: 'Galatians 2', accept: [3, 2],
          why: 'If, as most scholars think, Galatians 2 describes the meeting of about 49 CE, the letter is later than that: most place it in the third journey, about 54–55, and some in the second. A minority date it just before the meeting, about 48.' },
        { name: '1 Corinthians', short: '1 Cor',
          clue: '"I will stay in Ephesus until Pentecost."',
          ref: '1 Corinthians 16:8', accept: [3],
          why: 'Paul is in Ephesus, on the third journey, about 54 CE.' },
        { name: '2 Corinthians', short: '2 Cor',
          clue: 'Paul has gone on into Macedonia and found Titus there with news from Corinth.',
          ref: '2 Corinthians 7:5–7', accept: [3],
          why: 'After leaving Ephesus, Paul traveled through Macedonia on the third journey, about 55–56 CE.' },
        { name: 'Romans', short: 'Romans',
          clue: 'Paul is about to take the collection to Jerusalem and commends Phoebe of Cenchreae, Corinth\'s port.',
          ref: 'Romans 15:25–26; 16:1', accept: [3],
          why: 'Written from Corinth at the end of the third journey, about 56–57 CE, just before the trip to Jerusalem.' },
        { name: 'Philippians', short: 'Philippians',
          clue: 'Paul writes in chains and sends greetings from "the praetorium" and "Caesar\'s household."',
          ref: 'Philippians 1:13; 4:22', accept: [3, 4, 5],
          why: 'A prison letter. Scholars place it in an Ephesian imprisonment (third journey), in Caesarea, or in Rome; the guard and household could exist in any provincial capital or in Rome.' },
        { name: 'Philemon', short: 'Philemon',
          clue: 'Paul, "an old man and now also a prisoner," sends Onesimus home to Colossae and asks Philemon to prepare a guest room.',
          ref: 'Philemon 9, 22', accept: [3, 5],
          why: 'A prison letter. Ephesus, near Colossae, fits the plan to visit soon; Rome is the traditional view.' }
    ];

    const QUESTION = 'Where in Paul\'s life was each letter written?';
    const RETRY = 'Not this period. Look again at the clue: who is where, and what has just happened?';
    const MASTERY_MSG = 'All seven placed. At least four of them come from the years around Ephesus.';
    const YEAR_MS = 365.2425 * 24 * 3600 * 1000;

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    // Fractional CE year -> Date (setFullYear avoids the 1900 offset for years < 100)
    function toDate(y) {
        const yi = Math.floor(y);
        const d = new Date(2000, 0, 1, 0, 0, 0);
        d.setFullYear(yi);
        return new Date(d.getTime() + (y - yi) * YEAR_MS);
    }
    function fromDate(dt) {
        const d = new Date(dt);
        const y = d.getFullYear();
        const j = new Date(2000, 0, 1, 0, 0, 0);
        j.setFullYear(y);
        return y + (d - j) / YEAR_MS;
    }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
    function bandLabel(b) { return BANDS[b].id + ' · ' + BANDS[b].name; }

    // The band containing year t; a drop just outside a band snaps to it; else -1
    function bandAt(t) {
        for (let b = 0; b < BANDS.length; b++) if (t >= BANDS[b].start && t < BANDS[b].end) return b;
        let best = -1, bestD = 0.6;
        BANDS.forEach((B, b) => {
            const d = Math.min(Math.abs(t - B.start), Math.abs(t - B.end));
            if (d < bestD) { bestD = d; best = b; }
        });
        return best;
    }

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    let place, state, sel, checks, finished, infoEvent, flash;
    // state[i]: 'none' | 'placed' | 'ok' | 'returned' | 'shown'

    function reset() {
        place = LETTERS.map(() => -1);
        state = LETTERS.map(() => 'none');
        sel = 0;
        checks = 0;
        finished = false;
        infoEvent = null;
        flash = '';
    }

    const locked = i => state[i] === 'ok' || state[i] === 'shown' || finished;
    const accepted = i => place[i] >= 0 && LETTERS[i].accept.includes(place[i]);
    const nAccepted = () => LETTERS.filter((L, i) => state[i] === 'ok').length;

    // ------------------------------------------------------------------
    // Timeline
    // ------------------------------------------------------------------
    const container = document.getElementById('timeline');
    const groups = new vis.DataSet();
    const items = new vis.DataSet();

    const options = {
        width: '100%',
        orientation: 'top',
        stack: false,
        groupOrder: 'order',
        margin: { item: { horizontal: 0, vertical: 3 }, axis: 3 },
        start: toDate(30),
        end: toDate(70),
        min: toDate(30),
        max: toDate(70),
        zoomable: false,
        moveable: false,
        selectable: false,
        showCurrentTime: false,
        showMajorLabels: false,
        timeAxis: { scale: 'year', step: 5 },
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        format: {
            minorLabels: function (date) {
                const y = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
                return y + ' CE';
            },
            majorLabels: function () { return ''; }
        }
    };

    function buildGroups() {
        groups.clear();
        groups.add({ id: 'per', content: 'Periods', order: 0, className: 'g-period' });
        groups.add({ id: 'ev1', content: 'Events', order: 1, className: 'g-event' });
        groups.add({ id: 'ev2', content: '&nbsp;', order: 2, className: 'g-event' });
        LETTERS.forEach((L, i) => groups.add({ id: 'L' + i, content: (i + 1) + '. ' + L.name, order: 3 + i,
                                                className: 'g-letter' + (i === sel ? ' sel' : '') }));
    }
    function refreshGroupSel() {
        LETTERS.forEach((L, i) => groups.update({ id: 'L' + i, className: 'g-letter' + (i === sel ? ' sel' : '') }));
    }

    function staticItems() {
        BANDS.forEach((B, b) => {
            const tip = esc(B.id + '. ' + B.name + ', ' + B.dates + ': ' + B.what);
            items.add({ id: 'bg' + b, type: 'background', start: toDate(B.start), end: toDate(B.end),
                        className: 'bandbg band' + B.id });
            items.add({ id: 'band' + b, group: 'per', type: 'range', start: toDate(B.start), end: toDate(B.end),
                        className: 'band band' + B.id, title: tip,
                        content: '<b>' + B.id + '</b><br><small>' + B.short + '</small>' });
        });
        EVENTS.forEach(E => {
            const it = { id: E.id, group: E.group, type: E.type, start: toDate(E.start),
                         className: 'ev' + (E.cls ? ' ' + E.cls : ''), title: esc(E.info),
                         content: '<span>' + esc(E.label) + '</span>' };
            if (E.end) it.end = toDate(E.end);
            items.add(it);
        });
    }

    function refreshLetterItems() {
        const old = items.getIds().filter(id => String(id).startsWith('L') || String(id).startsWith('alt'));
        items.remove(old);
        LETTERS.forEach((L, i) => {
            if (place[i] >= 0) {
                const B = BANDS[place[i]];
                const st = state[i];
                const cls = 'lt' + (st === 'ok' ? ' ok' : st === 'shown' ? ' shown' : '');
                const mark = st === 'ok' ? '✓ ' : '';
                const tip = L.name + ': ' + bandLabel(place[i]) + (st === 'ok' ? ' (accepted)' : st === 'shown' ? ' (shown)' : ' (not yet checked)');
                items.add({ id: 'L' + i, group: 'L' + i, type: 'range', start: toDate(B.start + 0.08), end: toDate(B.end - 0.08),
                            className: cls, content: mark + B.id, title: esc(tip) });
            }
            // After the end, the other accepted periods are outlined
            if (finished) {
                L.accept.forEach(b => {
                    if (b === place[i]) return;
                    const B = BANDS[b];
                    items.add({ id: 'alt' + i + '-' + b, group: 'L' + i, type: 'range', start: toDate(B.start + 0.08),
                                end: toDate(B.end - 0.08), className: 'alt', content: 'also',
                                title: esc(L.name + ': ' + bandLabel(b) + ' is also accepted') });
                });
            }
        });
    }

    buildGroups();
    staticItems();
    const timeline = new vis.Timeline(container, items, groups, options);

    // Narrow screens: ticks every 10 years and plain numbers
    let narrowAxis = null;
    function fitAxis() {
        const narrow = container.clientWidth < 560;
        if (narrow === narrowAxis) return;
        narrowAxis = narrow;
        timeline.setOptions({
            timeAxis: { scale: 'year', step: narrow ? 10 : 5 },
            format: {
                minorLabels: function (date) {
                    const y = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
                    return narrow ? String(y) : y + ' CE';
                },
                majorLabels: function () { return ''; }
            }
        });
    }
    fitAxis();
    window.addEventListener('resize', fitAxis);

    // Vertical wheel scrolls the page, not the timeline
    container.addEventListener('wheel', function (e) { e.stopImmediatePropagation(); }, true);

    timeline.on('click', function (props) {
        const id = props.item ? String(props.item) : '';
        const ev = EVENTS.find(E => E.id === id);
        if (ev) { infoEvent = ev; render(); return; }
        if (id.startsWith('L')) { select(parseInt(id.slice(1), 10)); return; }
        if (!props.time || props.what === 'group-label') {
            if (props.group && String(props.group).startsWith('L')) select(parseInt(String(props.group).slice(1), 10));
            return;
        }
        let i = sel;
        if (props.group && String(props.group).startsWith('L')) i = parseInt(String(props.group).slice(1), 10);
        if (props.group === 'per' || props.group === 'ev1' || props.group === 'ev2' || String(props.group).startsWith('L')) {
            tryPlace(i, bandAt(fromDate(props.time)));
        }
    });

    // ------------------------------------------------------------------
    // Placing, checking
    // ------------------------------------------------------------------
    function select(i) {
        sel = i;
        infoEvent = null;
        flash = '';
        render();
    }

    function tryPlace(i, b) {
        sel = i;
        infoEvent = null;
        if (finished) { flash = ''; render(); return; }
        if (locked(i)) { flash = LETTERS[i].name + ' is locked in place.'; render(); return; }
        if (b < 0) { flash = 'Drop the card on one of the six periods, A to F.'; render(); return; }
        place[i] = b;
        state[i] = 'placed';
        flash = '';
        // Move the selection on to the next card that still needs a place
        render();
    }

    function allPlaced() { return LETTERS.every((L, i) => place[i] >= 0 && state[i] !== 'returned'); }

    function check() {
        if (finished || !allPlaced()) return;
        checks++;
        LETTERS.forEach((L, i) => {
            if (state[i] === 'ok' || state[i] === 'shown') return;
            if (accepted(i)) state[i] = 'ok';
            else if (checks >= 2) { place[i] = L.accept[0]; state[i] = 'shown'; }
            else { place[i] = -1; state[i] = 'returned'; }
        });
        if (checks >= 2 || nAccepted() === LETTERS.length) finished = true;
        // Select the first returned card, if any
        const r = state.indexOf('returned');
        sel = r >= 0 ? r : sel;
        infoEvent = null;
        flash = '';
        render();
    }

    // ------------------------------------------------------------------
    // Rendering
    // ------------------------------------------------------------------
    const elPanel = document.getElementById('panel');
    const elTray = document.getElementById('tray');
    const elScore = document.getElementById('score');
    const elStatus = document.getElementById('status');
    const elCheck = document.getElementById('check-btn');

    function renderTray() {
        elTray.innerHTML = '';
        LETTERS.forEach((L, i) => {
            const d = document.createElement('div');
            const st = state[i];
            let cls = 'card';
            let mark = '';
            if (st === 'placed') { cls += ' placed'; mark = ' → ' + BANDS[place[i]].id; }
            else if (st === 'ok') { cls += ' ok'; mark = ' ✓'; }
            else if (st === 'returned') { cls += ' wrong'; mark = ' ↺'; }
            else if (st === 'shown') { cls += ' shown'; mark = ' → ' + BANDS[place[i]].id; }
            if (i === sel) cls += ' sel';
            d.className = cls;
            d.dataset.i = i;
            d.tabIndex = 0;
            d.setAttribute('role', 'button');
            d.title = L.name + ': ' + L.clue;
            d.innerHTML = '<span class="n">' + (i + 1) + '.</span>' + esc(L.short) + mark;
            d.addEventListener('pointerdown', e => startDrag(e, i));
            d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); } });
            elTray.appendChild(d);
        });
    }

    function renderPanel() {
        if (infoEvent) {
            elPanel.innerHTML = '<div class="step">Event on the timeline</div>' +
                '<div class="name">' + esc(infoEvent.label) + '</div>' +
                '<div class="clue">' + esc(infoEvent.info) + '</div>' +
                '<div class="fb hint">Select a letter card to go back to its clue.</div>';
            return;
        }
        const L = LETTERS[sel];
        const st = state[sel];
        let h = '<div class="step">' + esc(QUESTION) + ' · Letter ' + (sel + 1) + ' of 7</div>';
        h += '<div class="name">' + esc(L.name) + '</div>';
        h += '<div class="clue">Clue: ' + esc(L.clue) + ' <span class="ref">(' + esc(L.ref) + ')</span></div>';
        let fb = '';
        if (flash) fb = '<span class="bad">' + esc(flash) + '</span>';
        else if (st === 'ok') fb = '<span class="good">Accepted.</span> ' + esc(L.why);
        else if (st === 'shown') fb = '<span class="shown">Shown: ' + esc(bandLabel(place[sel])) + '.</span> ' + esc(L.why);
        else if (st === 'returned') fb = '<span class="bad">' + esc(RETRY) + '</span>';
        else if (st === 'placed') fb = '<span class="hint">Placed in ' + esc(bandLabel(place[sel])) + '. Drag again or click another period in this row to move it.</span>';
        else fb = '<span class="hint">Drag this card onto a period, or click a period in its row on the timeline.</span>';
        h += '<div class="fb">' + fb + '</div>';
        elPanel.innerHTML = h;
    }

    function renderStatus() {
        const n = nAccepted();
        elScore.textContent = 'Accepted: ' + n + ' of 7 · Checks: ' + checks + ' of 2';
        elCheck.disabled = finished || !allPlaced();
        elCheck.textContent = checks === 0 ? 'Check' : 'Check again';
        let s;
        if (finished) {
            s = n === LETTERS.length ? '<b>' + MASTERY_MSG + '</b>'
                : '<b>' + n + ' of 7 placed in accepted periods.</b> Select any card to read why; dashed outlines mark other accepted periods.';
            if (n === LETTERS.length) s += ' Dashed outlines mark other accepted periods.';
        } else {
            const left = LETTERS.filter((L, i) => place[i] < 0 || state[i] === 'returned').length;
            s = left > 0 ? left + (left === 1 ? ' card' : ' cards') + ' still to place.'
                         : 'All seven placed. Press ' + (checks === 0 ? 'Check' : 'Check again') + '.';
            if (checks === 1) s += ' Green cards are locked; place the returned ones again.';
        }
        elStatus.innerHTML = s;
    }

    function render() {
        renderTray();
        renderPanel();
        renderStatus();
        refreshGroupSel();
        refreshLetterItems();
    }

    // Band key under the timeline
    document.getElementById('bandkey').innerHTML = BANDS.map(B =>
        '<span><b>' + B.id + '</b> ' + B.name + ', ' + B.dates + '</span>').join(' ') +
        ' <i>Dates are scholars\' reconstructions and differ by a year or two.</i>';

    // ------------------------------------------------------------------
    // Dragging a card onto the timeline (mouse, pen or touch)
    // ------------------------------------------------------------------
    const ghost = document.createElement('div');
    ghost.id = 'ghost';
    document.body.appendChild(ghost);
    let drag = null;

    function startDrag(e, i) {
        drag = { i: i, x: e.clientX, y: e.clientY, moved: false };
        e.preventDefault();
    }
    function overTimeline(e) {
        const r = container.getBoundingClientRect();
        return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    }
    function timeAtX(clientX) {
        const center = container.querySelector('.vis-panel.vis-center');
        const r = center.getBoundingClientRect();
        const w = timeline.getWindow();
        const f = (clientX - r.left) / r.width;
        return fromDate(new Date(w.start.getTime() + f * (w.end - w.start)));
    }
    document.addEventListener('pointermove', e => {
        if (!drag) return;
        if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5) {
            if (locked(drag.i)) return;
            drag.moved = true;
            ghost.textContent = LETTERS[drag.i].name;
            ghost.style.display = 'block';
        }
        if (drag.moved) {
            ghost.style.left = (e.clientX + 10) + 'px';
            ghost.style.top = (e.clientY - 12) + 'px';
            container.classList.toggle('drop', overTimeline(e));
        }
    });
    document.addEventListener('pointerup', e => {
        if (!drag) return;
        const d = drag;
        drag = null;
        ghost.style.display = 'none';
        container.classList.remove('drop');
        if (!d.moved) { select(d.i); return; }
        if (overTimeline(e)) {
            const center = container.querySelector('.vis-panel.vis-center').getBoundingClientRect();
            if (e.clientX < center.left) { flash = 'Drop the card on one of the six periods, A to F.'; sel = d.i; render(); return; }
            tryPlace(d.i, bandAt(timeAtX(e.clientX)));
        } else {
            sel = d.i;
            render();
        }
    });
    document.addEventListener('pointercancel', () => { drag = null; ghost.style.display = 'none'; container.classList.remove('drop'); });

    // ------------------------------------------------------------------
    // Buttons and keys
    // ------------------------------------------------------------------
    elCheck.onclick = check;
    document.getElementById('restart-btn').onclick = () => { reset(); render(); };
    document.addEventListener('keydown', e => {
        if (e.target && (e.target.tagName === 'BUTTON')) return;
        const k = e.key.toUpperCase();
        const b = BANDS.findIndex(B => B.id === k);
        if (b >= 0) tryPlace(sel, b);                 // keys A-F place the selected card
        else if (e.key >= '1' && e.key <= '7') select(parseInt(e.key, 10) - 1);
    });

    // Expose for automated tests
    window.__sim = { tryPlace: tryPlace, check: check, select: select, state: () => ({ place, state, checks, finished }) };

    reset();
    render();
});
