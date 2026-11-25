// How Paul's Words Traveled - vis-timeline
// CANVAS_HEIGHT: 652
// Twelve dated events from 386 to 1999 are cards in a tray. Each card's date is
// fixed; the learner chooses only its strand by dragging it onto one of four
// lanes (or selecting it and clicking a lane). Check scores all twelve at once:
// correct cards lock, wrong ones are marked and a dashed chip shows the correct
// strand. Mastery is 10 of 12 on the first Check. The axis runs 300-2025 CE with
// three long empty stretches hidden (hatched marks show where) so that events a
// few years apart can still be told apart.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------
    const STRANDS = [
        { name: 'Grace and faith',
          def: 'Paul\'s teaching that people are put right with God by grace, through faith, was received or argued over.' },
        { name: 'Conscience and equality',
          def: 'Paul\'s words were used for, or against, individual conscience or the equal worth of people.' },
        { name: 'Contempt and its repudiation',
          def: 'Christian treatment of Jews that drew on, or later corrected, readings of Paul.' },
        { name: 'Rereading Paul',
          def: 'Scholarly work that changed how Paul is read.' }
    ];

    // y = year used for the position on the axis; strand = correct strand index
    const EVENTS = [
        { date: '386 CE', y: 386.6, short: 'Augustine\'s garden', strand: 0,
          text: 'Augustine reads Romans 13 in a garden in Milan and ends his indecision.',
          why: 'His conversion through Paul shaped his later teaching that grace comes first.' },
        { date: 'c. 386–387 CE', card: '386–87', y: 387.0, short: 'Chrysostom\'s sermons', strand: 2,
          text: 'John Chrysostom preaches eight sermons in Antioch against Christians who attend synagogue festivals.',
          why: 'The sermons are a classic of anti-Jewish preaching.' },
        { date: '1517', y: 1517.8, short: 'Luther\'s 95 Theses', strand: 0,
          text: 'Luther issues the 95 Theses against the sale of indulgences.',
          why: 'His protest grew from his reading of Romans: righteousness is a gift, not something bought or earned.' },
        { date: '1521', y: 1521.3, short: 'Luther at Worms', strand: 1,
          text: 'Luther tells the Diet of Worms his conscience is captive to the Word of God.',
          why: 'A founding moment for the idea that conscience must not be forced.' },
        { date: '1543', y: 1543.5, short: 'Luther\'s tract on Jews', strand: 2,
          text: 'Luther publishes On the Jews and Their Lies.',
          why: 'The tract urged burning synagogues and was later reprinted by the Nazis.' },
        { date: '1738', y: 1738.4, short: 'Wesley\'s warmed heart', strand: 0,
          text: 'John Wesley hears Luther\'s preface to Romans read and feels his heart "strangely warmed."',
          why: 'Romans, read through Luther, started the Methodist movement.' },
        { date: '1807', y: 1807.5, short: 'The Slave Bible', strand: 1,
          text: 'A Slave Bible printed in London for the British West Indies leaves out Galatians 3:28.',
          why: 'Removing "no longer slave or free" shows that slaveholders feared the verse\'s power.' },
        { date: '1963', y: 1963.5, short: 'Stendahl on conscience', strand: 3,
          text: 'Krister Stendahl argues that the West read its own anxious conscience into Paul.',
          why: 'A scholarly correction of the Augustine-to-Luther reading.' },
        { date: '1965', y: 1965.8, short: 'Nostra Aetate', strand: 2,
          text: 'Nostra Aetate says Jews must not be presented as rejected or accursed by God, quoting Romans 11.',
          why: 'The Catholic Church repudiated the teaching of contempt, using Paul\'s own words.' },
        { date: '1977', y: 1977.5, short: 'Sanders on Judaism', strand: 3,
          text: 'E. P. Sanders shows that the Judaism of Paul\'s day was not a religion of earning salvation.',
          why: 'His work launched the "New Perspective on Paul."' },
        { date: '1982', y: 1982.5, short: 'Dunn\'s New Perspective', strand: 3,
          text: 'James Dunn names the "New Perspective on Paul" in a lecture.',
          why: 'He read "works of the law" as the markers that separated Jews from Gentiles.' },
        { date: '1999', y: 1999.8, short: 'Joint Declaration', strand: 0,
          text: 'Lutherans and Catholics sign a Joint Declaration on the Doctrine of Justification.',
          why: 'It stated a shared understanding of the question that split the Western church in the 1500s.' }
    ];
    const LUTHER = [2, 3, 4];

    const QUESTION = 'Which strand of Paul\'s legacy did each event carry forward?';
    const MASTERY = 10;
    const YEAR_MS = 365.2425 * 24 * 3600 * 1000;

    // Visible stretches of the axis; the years between them are hidden
    const HIDDEN = [[430, 1500], [1560, 1725], [1820, 1925]];

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    function toDate(y) {
        const yi = Math.floor(y);
        const d = new Date(2000, 0, 1, 0, 0, 0);
        d.setFullYear(yi);
        return new Date(d.getTime() + (y - yi) * YEAR_MS);
    }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    let place, sel, checked, flash;   // place[i]: strand index or -1

    function reset() {
        place = EVENTS.map(() => -1);
        sel = 0;
        checked = false;
        flash = '';
    }
    const correct = i => place[i] === EVENTS[i].strand;
    const nPlaced = () => place.filter(p => p >= 0).length;
    const nCorrect = () => EVENTS.filter((E, i) => correct(i)).length;

    // ------------------------------------------------------------------
    // Timeline
    // ------------------------------------------------------------------
    const container = document.getElementById('timeline');
    const groups = new vis.DataSet();
    const items = new vis.DataSet();

    STRANDS.forEach((S, s) => groups.add({ id: 's' + s, content: S.name, order: s, className: 's' + s }));

    HIDDEN.forEach((h, k) => {
        // a hatched strip just before each hidden stretch marks the break in the axis
        items.add({ id: 'gap' + k, type: 'background', start: toDate(h[0] - 4), end: toDate(h[0]), className: 'gap',
                    title: 'The years ' + h[0] + '–' + h[1] + ' are hidden to save space.' });
    });
    items.add({ id: 'shoah', type: 'background', start: toDate(1933), end: toDate(1945), className: 'shoah',
                title: 'The Holocaust, 1933–1945: about six million Jews were murdered.' });

    function axisLabel(date) {
        const y = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
        // skip a label that would collide with the first label after a hidden stretch
        if (y < 350 || HIDDEN.some(h => y < h[0] && y > h[0] - 20)) return '';
        // on narrow screens keep only half-century marks that have room
        if (narrowAxis && (y % 50 !== 0 || y > 1990 || HIDDEN.some(h => y < h[0] && y > h[0] - 40))) return '';
        return String(y);
    }
    let narrowAxis = container.clientWidth < 560;

    const options = {
        width: '100%',
        height: '232px',
        verticalScroll: true,
        orientation: 'top',
        stack: true,
        groupOrder: 'order',
        margin: { item: { horizontal: 1, vertical: 5 }, axis: 4 },
        start: toDate(350),
        end: toDate(2025),
        min: toDate(350),
        max: toDate(2025),
        hiddenDates: HIDDEN.map(h => ({ start: toDate(h[0]), end: toDate(h[1]) })),
        zoomable: false,
        moveable: false,
        selectable: false,
        showCurrentTime: false,
        showMajorLabels: false,
        timeAxis: { scale: 'year', step: 25 },
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        format: { minorLabels: axisLabel, majorLabels: function () { return ''; } }
    };

    const timeline = new vis.Timeline(container, items, groups, options);

    window.addEventListener('resize', function () {
        const n = container.clientWidth < 560;
        if (n === narrowAxis) return;
        narrowAxis = n;
        timeline.setOptions({ format: { minorLabels: axisLabel, majorLabels: function () { return ''; } } });
    });

    // Vertical wheel scrolls the page, not the timeline
    container.addEventListener('wheel', function (e) { e.stopImmediatePropagation(); }, true);

    function refreshEventItems() {
        const old = items.getIds().filter(id => String(id).startsWith('e') || String(id).startsWith('g-'));
        items.remove(old);
        EVENTS.forEach((E, i) => {
            if (place[i] < 0) return;
            let cls = 'ev';
            let label = String(i + 1);
            let tip = (i + 1) + '. ' + E.date + ': ' + E.text;
            if (checked) {
                if (correct(i)) cls += ' ok';
                else cls += ' wrong';
                if (LUTHER.includes(i)) cls += ' luther';
            }
            if (i === sel) cls += ' cur';
            items.add({ id: 'e' + i, group: 's' + place[i], type: 'box', start: toDate(E.y),
                        content: label, className: cls, title: esc(tip) });
            if (checked && !correct(i)) {
                items.add({ id: 'g-' + i, group: 's' + E.strand, type: 'box', start: toDate(E.y),
                            content: String(i + 1), className: 'ev ghost',
                            title: esc((i + 1) + ' belongs here: ' + STRANDS[E.strand].name) });
            }
        });
    }

    timeline.on('click', function (props) {
        const id = props.item ? String(props.item) : '';
        if (id.startsWith('e')) { select(parseInt(id.slice(1), 10)); return; }
        if (id.startsWith('g-')) { select(parseInt(id.slice(2), 10)); return; }
        if (props.group && String(props.group).startsWith('s')) {
            tryPlace(sel, parseInt(String(props.group).slice(1), 10));
        }
    });

    // ------------------------------------------------------------------
    // Placing, checking
    // ------------------------------------------------------------------
    function select(i) {
        sel = i;
        flash = '';
        render();
    }

    function nextUnplaced(from) {
        for (let k = 1; k <= EVENTS.length; k++) {
            const j = (from + k) % EVENTS.length;
            if (place[j] < 0) return j;
        }
        return from;
    }

    function tryPlace(i, s) {
        sel = i;
        if (checked) {
            flash = correct(i) ? '' : 'Cards are scored. Press Try again to sort all twelve again.';
            render();
            return;
        }
        if (s < 0 || s >= STRANDS.length) { flash = 'Drop the card on one of the four strands.'; render(); return; }
        const wasUnplaced = place[i] < 0;
        place[i] = s;
        flash = '';
        // Move on to the next card that still needs a strand
        if (wasUnplaced && nPlaced() < EVENTS.length) sel = nextUnplaced(i);
        render();
    }

    function check() {
        if (checked || nPlaced() < EVENTS.length) return;
        checked = true;
        const w = EVENTS.findIndex((E, i) => !correct(i));
        sel = w >= 0 ? w : 0;
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
    const elRestart = document.getElementById('restart-btn');

    function renderTray() {
        elTray.innerHTML = '';
        EVENTS.forEach((E, i) => {
            const d = document.createElement('div');
            let cls = 'card';
            let mark = '';
            if (checked) { cls += correct(i) ? ' ok' : ' wrong'; mark = correct(i) ? ' ✓' : ' ✗'; }
            else if (place[i] >= 0) cls += ' placed';
            if (i === sel) cls += ' sel';
            d.className = cls;
            d.dataset.i = i;
            d.tabIndex = 0;
            d.setAttribute('role', 'button');
            d.title = E.date + ': ' + E.text;
            d.innerHTML = '<span class="n">' + (i + 1) + '.</span><span class="d">' + esc(E.card || E.date.replace(' CE', '')) +
                '</span>' + esc(E.short) + mark;
            d.addEventListener('pointerdown', e => startDrag(e, i));
            d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); } });
            elTray.appendChild(d);
        });
    }

    function renderPanel() {
        const E = EVENTS[sel];
        let h = '<div class="step">' + esc(QUESTION) + ' · Event ' + (sel + 1) + ' of 12</div>';
        h += '<div class="name"><span class="date">' + esc(E.date) + '</span>' + esc(E.text) + '</div>';
        let fb;
        if (flash) fb = '<span class="bad">' + esc(flash) + '</span>';
        else if (checked && correct(sel)) fb = '<span class="good">Correct.</span> ' + esc(E.why);
        else if (checked) fb = '<span class="bad">This one belongs in ' + esc(STRANDS[E.strand].name) + '.</span> ' + esc(E.why);
        else if (place[sel] >= 0) fb = '<span class="hint">Placed in ' + esc(STRANDS[place[sel]].name) +
            '. Drag it again, or click another strand, to move it.</span>';
        else fb = '<span class="hint">Drag this card onto a strand, or click a strand on the timeline. Its date is fixed.</span>';
        h += '<div class="fb">' + fb + '</div>';
        elPanel.innerHTML = h;
    }

    function renderStatus() {
        const n = nCorrect();
        elCheck.disabled = checked || nPlaced() < EVENTS.length;
        elRestart.textContent = checked ? 'Try again' : 'Start over';
        if (checked) {
            elScore.textContent = n + ' of 12 correct';
            elStatus.innerHTML = '<b>' + n + ' of 12 placed correctly. Mastery is ' + MASTERY + '.</b> ' +
                'One man, Martin Luther, appears in three strands (gold rings). Select any card to read why.';
        } else {
            elScore.textContent = 'Placed: ' + nPlaced() + ' of 12';
            const left = EVENTS.length - nPlaced();
            elStatus.innerHTML = left > 0
                ? left + (left === 1 ? ' card' : ' cards') + ' still to place. Keys 1–4 place the selected card.'
                : 'All twelve placed. Press <b>Check</b>.';
        }
    }

    function render() {
        renderTray();
        renderPanel();
        renderStatus();
        refreshEventItems();
    }

    document.getElementById('strandkey').innerHTML = STRANDS.map(S =>
        '<span><b>' + esc(S.name) + ':</b> ' + esc(S.def) + '</span>').join('') +
        '<span class="note">Hatched marks show where long stretches of years (430–1500, 1560–1725, 1820–1925) are hidden. The gray band is the Holocaust, 1933–1945.</span>';

    // ------------------------------------------------------------------
    // Dragging a card onto a strand (mouse, pen or touch)
    // ------------------------------------------------------------------
    const ghost = document.createElement('div');
    ghost.id = 'ghost';
    document.body.appendChild(ghost);
    let drag = null;

    function startDrag(e, i) {
        drag = { i: i, x: e.clientX, y: e.clientY, moved: false };
        e.preventDefault();
    }
    // Which strand lane is under the pointer? Lanes line up with the label rows.
    function strandAt(clientX, clientY) {
        const r = container.getBoundingClientRect();
        if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return -2;
        const labels = container.querySelectorAll('.vis-labelset .vis-label');
        for (let s = 0; s < labels.length; s++) {
            const b = labels[s].getBoundingClientRect();
            if (clientY >= b.top && clientY <= b.bottom) return s;
        }
        return -1;
    }
    function markHot(s) {
        container.querySelectorAll('.vis-label, .vis-foreground .vis-group').forEach(el => el.classList.remove('hot'));
        if (s < 0) return;
        const lab = container.querySelectorAll('.vis-labelset .vis-label')[s];
        const row = container.querySelectorAll('.vis-foreground .vis-group')[s];
        if (lab) lab.classList.add('hot');
        if (row) row.classList.add('hot');
    }
    document.addEventListener('pointermove', e => {
        if (!drag) return;
        if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5) {
            if (checked) return;
            drag.moved = true;
            ghost.textContent = (drag.i + 1) + '. ' + EVENTS[drag.i].short;
            ghost.style.display = 'block';
        }
        if (drag.moved) {
            ghost.style.left = (e.clientX + 10) + 'px';
            ghost.style.top = (e.clientY - 12) + 'px';
            const s = strandAt(e.clientX, e.clientY);
            container.classList.toggle('drop', s !== -2);
            markHot(s);
        }
    });
    document.addEventListener('pointerup', e => {
        if (!drag) return;
        const d = drag;
        drag = null;
        ghost.style.display = 'none';
        container.classList.remove('drop');
        markHot(-1);
        if (!d.moved) { select(d.i); return; }
        const s = strandAt(e.clientX, e.clientY);
        if (s === -2) { sel = d.i; render(); return; }
        tryPlace(d.i, s);
    });
    document.addEventListener('pointercancel', () => {
        drag = null; ghost.style.display = 'none'; container.classList.remove('drop'); markHot(-1);
    });

    // ------------------------------------------------------------------
    // Buttons and keys
    // ------------------------------------------------------------------
    elCheck.onclick = check;
    elRestart.onclick = () => { reset(); render(); };
    document.addEventListener('keydown', e => {
        if (e.target && e.target.tagName === 'BUTTON') return;
        if (e.key >= '1' && e.key <= '4') tryPlace(sel, parseInt(e.key, 10) - 1);
        else if (e.key === 'ArrowRight') select((sel + 1) % EVENTS.length);
        else if (e.key === 'ArrowLeft') select((sel + EVENTS.length - 1) % EVENTS.length);
    });

    // Expose for automated tests
    window.__sim = { tryPlace: tryPlace, check: check, select: select,
                     state: () => ({ place: place.slice(), checked: checked, correct: nCorrect() }) };

    reset();
    render();
});
