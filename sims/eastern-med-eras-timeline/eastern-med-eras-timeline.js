// Eras of the Eastern Mediterranean Timeline - vis-timeline
// CANVAS_HEIGHT: 672
// Nine period bands shown to scale from 3200 BCE to 2026 CE, plus 29 events.
// Six proportion questions are asked before the relevant bands and events are
// revealed. Years are stored as signed numbers: negative = BCE, positive = CE.
// There is no year zero, so durations that cross the BCE/CE line subtract one.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------
    const BOUNDARY_NOTE = 'Boundaries vary by place; see the chapter.';

    // row = which of three staggered label rows the band sits in, so the
    // names of short periods do not collide at the full 5,000-year view.
    const ERAS = [
        { key: 'bronze', short: 'Bronze Age',      name: 'Bronze Age',         start: -3200, end: -1100, cStart: true,  cEnd: true,  color: '#B07030', row: 0,
          desc: 'Tools of bronze; palaces, scribes, and long-distance metal trade; Minoans, Mycenaeans, Hittites, and Troy.' },
        { key: 'iron', short: 'Iron Age',        name: 'Iron Age',           start: -1100, end: -800,  cStart: true,  cEnd: true,  color: '#5E6B73', row: 1,
          desc: 'After the palaces fell; iron replaces bronze; writing disappears from Greece.' },
        { key: 'archaic', short: 'Archaic',     name: 'Archaic Period',     start: -800,  end: -480,  cStart: true,  cEnd: false, color: '#C9A227', row: 2, dark: true,
          desc: 'The alphabet, Homer, city-states, colonies, the first coins, and the first democracy.' },
        { key: 'classical', short: 'Classical',   name: 'Classical Period',   start: -480,  end: -323,  color: '#2E6E9E', row: 0,
          desc: "From the Persian Wars to Alexander's death: Athens's Parthenon, theater, and philosophy." },
        { key: 'hellenistic', short: 'Hellenistic', name: 'Hellenistic Period', start: -323,  end: -31,   color: '#4BA3A0', row: 1, dark: true,
          desc: "Alexander's successor kingdoms spread Greek language and culture from Egypt to Afghanistan." },
        { key: 'roman', short: 'Roman',       name: 'Roman Period',       start: -31,   end: 330,   color: '#A4282A', row: 2,
          desc: 'Rome rules the whole Mediterranean; the Pax Romana; Christianity spreads.' },
        { key: 'byzantine', short: 'Byzantine',   name: 'Byzantine Period',   start: 330,   end: 1453,  color: '#6E3F8F', row: 0,
          desc: 'The Christian, Greek-speaking Roman Empire ruled from Constantinople.' },
        { key: 'ottoman', short: 'Ottoman',     name: 'Ottoman Period',     start: 1453,  end: 1922,  color: '#2F7D4A', row: 1,
          desc: 'The Ottoman Empire rules from Istanbul over a multi-faith population.' },
        { key: 'modern', short: 'Modern',      name: 'Modern era',         start: 1922,  end: 2026,  color: '#D98B9B', row: 2, dark: true, labelLeft: true,
          desc: 'The Republic of Turkey and modern Greece.' }
    ];

    // short = name drawn on the band; name = full name in tooltip and infobox
    // label = short text drawn on the timeline; title = full name in the infobox
    const EVENTS = [
        { id: 1,  start: -1900, c: true, label: 'Knossos palace',     title: 'First palace at Knossos', ch: 13,
          desc: 'Minoans build the first great palace on Crete.' },
        { id: 2,  start: -1600, c: true, label: 'Thera erupts',       title: 'Eruption of Thera', ch: 13,
          desc: 'The volcano on Santorini erupts; its exact date is still debated.' },
        { id: 3,  start: -1450, c: true, label: 'Linear B',           title: 'Mycenaeans at Knossos', ch: 13,
          desc: 'Greek-speaking Mycenaeans take control of Knossos and write in Linear B.' },
        { id: 4,  start: -1300, c: true, label: 'Uluburun ship',      title: 'Uluburun ship sinks', ch: 1,
          desc: 'A merchant ship carrying about 10 tons of copper and 1 ton of tin sinks off southern Turkey.' },
        { id: 5,  start: -1180, c: true, label: 'Troy VIIa burns',    title: 'Troy VIIa burns', ch: 8,
          desc: "The city that may be Homer's Troy is destroyed by fire." },
        { id: 6,  start: -1200, end: -1150, c: true, label: 'Bronze Age collapse', title: 'Late Bronze Age collapse', ch: 1,
          desc: 'Palaces across Greece, Anatolia, and the Levant are destroyed or abandoned.' },
        { id: 7,  start: -800,  c: true, label: 'Greek alphabet',     title: 'The Greek alphabet', ch: 2,
          desc: 'Greeks adapt the Phoenician alphabet and add letters for vowels.' },
        { id: 8,  start: -776,  label: 'First Olympics',              title: 'First Olympic Games', ch: 1,
          desc: 'The traditional date of the first games at Olympia.' },
        { id: 9,  start: -657,  c: true, label: 'Byzantium founded',  title: 'Byzantium founded', ch: 3,
          desc: 'Greek colonists from Megara found the city that will become Istanbul.' },
        { id: 10, start: -600,  c: true, label: 'First coins',        title: 'First coins', ch: 1,
          desc: 'The kingdom of Lydia, in western Anatolia, strikes the first coins.' },
        { id: 11, start: -508,  label: 'Democracy',                   title: 'Democracy in Athens', ch: 16,
          desc: "Cleisthenes' reforms give power to the assembly of citizens." },
        { id: 12, start: -480,  label: 'Acropolis burned',            title: 'Persians burn the Acropolis; Battle of Salamis', ch: 15,
          desc: 'The Persian army burns Athens; the Greek fleet wins at Salamis.' },
        { id: 13, start: -447,  end: -432, label: 'Parthenon',        title: 'The Parthenon is built', ch: 15,
          desc: 'Athens builds the Parthenon with money from its allies.' },
        { id: 14, start: -399,  label: 'Socrates dies',               title: 'Death of Socrates', ch: 16,
          desc: 'Athens condemns Socrates to death.' },
        { id: 15, start: -323,  label: 'Alexander dies',              title: 'Death of Alexander', ch: 1,
          desc: 'Alexander the Great dies in Babylon; his generals divide his empire.' },
        { id: 16, start: -280,  c: true, label: 'Colossus',           title: 'Colossus of Rhodes', ch: 12,
          desc: 'The giant bronze statue of the sun god is completed.' },
        { id: 17, start: -146,  label: 'Corinth sacked',              title: 'Rome sacks Corinth', ch: 1,
          desc: 'Mainland Greece falls under Roman control.' },
        { id: 18, start: -31,   label: 'Actium',                      title: 'Battle of Actium', ch: 1,
          desc: 'Octavian (later Augustus) defeats Antony and Cleopatra.' },
        { id: 19, start: -27,   end: 180, label: 'Pax Romana',        title: 'Pax Romana', ch: 1,
          desc: 'About two centuries of relative peace across the Roman Empire.' },
        { id: 20, start: 52,    end: 55, c: true, label: 'Paul in Ephesus', title: 'Paul in Ephesus', ch: 9,
          desc: 'The apostle Paul teaches in Ephesus for two to three years.' },
        { id: 21, start: 330,   label: 'Constantinople',              title: 'Constantinople dedicated', ch: 3,
          desc: 'Constantine makes the old city of Byzantium his new capital.' },
        { id: 22, start: 537,   label: 'Hagia Sophia',                title: 'Hagia Sophia completed', ch: 4,
          desc: "Justinian's great church is dedicated." },
        { id: 23, start: 1054,  label: 'Great Schism',                title: 'The Great Schism', ch: 4,
          desc: 'The Orthodox and Catholic churches split.' },
        { id: 24, start: 1204,  label: 'Fourth Crusade',              title: 'Fourth Crusade sacks Constantinople', ch: 4,
          desc: 'Western crusaders capture and loot the Byzantine capital.' },
        { id: 25, start: 1453,  label: 'Ottomans take the city',      title: 'Ottomans take Constantinople', ch: 3,
          desc: 'Sultan Mehmed II captures the city.' },
        { id: 26, start: 1522,  label: 'Rhodes falls',                title: 'Ottomans take Rhodes', ch: 12,
          desc: 'Suleiman the Magnificent forces the Knights Hospitaller to leave Rhodes.' },
        { id: 27, start: 1669,  label: 'Candia falls',                title: 'Ottomans take Candia', ch: 14,
          desc: 'Heraklion falls after a siege of 21 years, ending Venetian Crete.' },
        { id: 28, start: 1821,  label: 'Greek revolt',                title: 'Greek War of Independence', ch: 7,
          desc: 'The Greek revolt against Ottoman rule begins.' },
        { id: 29, start: 1923,  label: 'Turkish Republic',            title: 'Republic of Turkey; population exchange', ch: 7,
          desc: 'The Turkish Republic is founded, and Greece and Turkey exchange populations.' }
    ];

    const QUESTIONS = [
        { q: 'Which lasted longer: the Bronze Age or the Classical period?',
          choices: ['Bronze Age', 'Classical Period'], correct: 0,
          why: 'The Bronze Age lasted about 2,100 years; the Classical period lasted 157 years.',
          eras: ['bronze', 'classical'], events: [1, 6, 12, 15] },
        { q: 'Was the Parthenon (447 BCE) built closer in time to the first palace at Knossos (c. 1900 BCE) or to Paul’s years in Ephesus (c. 52 CE)?',
          choices: ['Knossos', 'Paul'], correct: 1,
          why: 'About 498 years separate the Parthenon from Paul, but about 1,453 years separate it from the first palace at Knossos.',
          eras: [], events: [1, 13, 20] },
        { q: 'Which lasted longer: the Byzantine period or the Ottoman period?',
          choices: ['Byzantine Period', 'Ottoman Period'], correct: 0,
          why: 'The Byzantine period lasted 1,123 years (330–1453); the Ottoman period in Istanbul lasted 469 years (1453–1922).',
          eras: ['byzantine', 'ottoman'], events: [21, 22, 25, 29] },
        { q: 'Did Paul teach in Ephesus before or during the Pax Romana?',
          choices: ['Before', 'During'], correct: 1,
          why: 'The Pax Romana began in 27 BCE and lasted to 180 CE; Paul was in Ephesus around 52–55 CE.',
          eras: ['roman'], events: [18, 19, 20] },
        { q: 'How many years passed between the burning of the Acropolis (480 BCE) and the dedication of Constantinople (330 CE)?',
          choices: ['150', '809', '810', '850'], correct: 1,
          why: 'Across the BCE/CE line we add the two numbers and subtract one, because there was no year zero: 480 + 330 − 1 = 809.',
          eras: [], events: [12, 21] },
        { q: 'In which period was writing almost unknown in Greece?',
          choices: ['Bronze Age', 'Iron Age', 'Archaic Period', 'Hellenistic Period'], correct: 1,
          why: 'After the palaces fell around 1200–1100 BCE, Linear B was forgotten; Greeks did not write again until they adopted the alphabet around 800 BCE.',
          eras: ['iron'], events: [3, 6, 7] }
    ];

    const CHAPTER_DIRS = {
        1: '01-long-timeline', 2: '02-traveling-well', 3: '03-istanbul-two-continents',
        4: '04-byzantine-constantinople', 7: '07-end-of-empire-modern-turkey',
        8: '08-troy-and-gallipoli', 9: '09-paul-life-letters', 12: '12-rhodes',
        13: '13-knossos-minoans-linear-b', 14: '14-venetian-heraklion',
        15: '15-athens-acropolis', 16: '16-athens-agora-democracy'
    };

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

    function eventDate(ev) {
        if (ev.end === undefined) return fmtYear(ev.start, ev.c);
        const sameEra = (ev.start < 0) === (ev.end < 0);
        const a = sameEra ? Math.abs(ev.start) : fmtYear(ev.start, false);
        return (ev.c ? 'c. ' : '') + a + '–' + fmtYear(ev.end, false);
    }

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
    // width, which pushes far-apart bands onto extra lines. So stacking is
    // off and rows are assigned here: three fixed era rows, then a fixed
    // number of event rows that are re-packed for the current zoom. Each
    // event gets its label on the right if there is room, on the left if it
    // sits near the right edge, and otherwise only its dot (hover or click it
    // to read the name).
    const LABEL_COL = 52;   // width of the group-label column on the left
    const MAX_EVENT_ROWS = 10;
    const measureCtx = document.createElement('canvas').getContext('2d');
    measureCtx.font = 'bold 12px -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif';

    const container = document.getElementById('timeline');
    let timeline = null;              // created below
    let revealedEvents = new Set();
    let hlEvents = new Set();
    let qIndex = 0;
    let score = 0;
    let answered = false;
    let finished = false;

    function packEvents() {
        let winStart = FULL_START, winEnd = FULL_END;
        if (timeline) {
            const win = timeline.getWindow();
            winStart = win.start.getFullYear();
            winEnd = win.end.getFullYear();
        }
        const W = Math.max(280, container.clientWidth - LABEL_COL);
        const pxPerYear = W / Math.max(1, winEnd - winStart);
        const rowEnds = new Array(MAX_EVENT_ROWS).fill(-Infinity);
        const shown = EVENTS.filter(ev => revealedEvents.has(ev.id))
            .sort((p, q) => p.start - q.start);

        shown.forEach(ev => {
            const x0 = (ev.start - winStart) * pxPerYear;
            const xEnd = ev.end !== undefined ? (ev.end - winStart) * pxPerYear : x0;
            if (xEnd < 0 || x0 > W) { ev.row = 0; ev.mode = 'right'; return; }  // off screen
            const textW = measureCtx.measureText(ev.label).width + (ev.end === undefined ? 22 : 14);
            const right = { mode: 'right', a: x0 - 6, b: Math.max(xEnd, x0 + textW) };
            const left  = { mode: 'left',  a: x0 - textW, b: Math.max(xEnd, x0 + 8) };
            const dot   = { mode: 'dot',   a: x0 - 6, b: Math.max(xEnd, x0 + 8) };
            const cands = [];
            if (right.b <= W) cands.push(right);
            if (left.a >= 0) cands.push(left);
            cands.push(dot);
            for (const c of cands) {
                const r = rowEnds.findIndex(end => end + 4 <= c.a);
                if (r >= 0) { ev.row = r; ev.mode = c.mode; rowEnds[r] = c.b; return; }
            }
            // Nowhere free: put the dot in the row that ends soonest
            let r = 0;
            rowEnds.forEach((end, k) => { if (end < rowEnds[r]) r = k; });
            ev.row = r; ev.mode = 'dot'; rowEnds[r] = Math.max(rowEnds[r], dot.b);
        });
    }

    function renderEvents() {
        packEvents();
        items.update(EVENTS.filter(ev => revealedEvents.has(ev.id))
            .map(ev => eventItem(ev, hlEvents.has(ev.id))));
    }

    const groupList = [
        { id: 'eras0', content: 'Eras', order: 0, className: 'era-row' },
        { id: 'eras1', content: '', order: 1, className: 'era-row' },
        { id: 'eras2', content: '', order: 2, className: 'era-row era-row-last' }
    ];
    for (let r = 0; r < MAX_EVENT_ROWS; r++) {
        groupList.push({ id: 'ev' + r, content: r === 0 ? 'Events' : '', order: 10 + r, className: 'ev-row' });
    }
    const groups = new vis.DataSet(groupList);

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

    function eventItem(ev, hl) {
        const mode = ev.mode || 'right';
        const item = {
            id: 'ev-' + ev.id,
            group: 'ev' + (ev.row || 0),
            start: toDate(ev.start),
            content: mode === 'dot' ? '' : (mode === 'left' ? '<span>' + ev.label + '</span>' : ev.label),
            title: eventDate(ev) + ' — ' + ev.title,
            className: 'event' + (hl ? ' hl' : '') + (mode === 'left' ? ' label-left' : '')
        };
        if (ev.end !== undefined) {
            item.end = toDate(ev.end);
            item.type = 'range';
        } else {
            item.type = 'point';
        }
        return item;
    }

    const items = new vis.DataSet();
    // Faint full-height shading for every era, behind both groups
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
        height: '340px',
        orientation: 'top',
        stack: false,            // rows are assigned above
        groupOrder: 'order',
        margin: { item: { horizontal: 6, vertical: 4 }, axis: 6 },
        min: toDate(-3700),
        max: toDate(2800),
        zoomMin: 200 * YEAR_MS,
        zoomMax: 6500 * YEAR_MS,
        zoomable: false,         // buttons only, so the page can still scroll
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

    // Re-pack event rows whenever the zoom, pan, or iframe width changes
    timeline.on('rangechanged', renderEvents);
    let resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(renderEvents, 200);
    });

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
    // Navigation buttons
    // ------------------------------------------------------------------
    function showFullSpan(animate) {
        setView(toDate(FULL_START), toDate(FULL_END), animate);
    }

    function pan(fraction) {
        const win = timeline.getWindow();
        const shift = (win.end - win.start) * fraction;
        timeline.setWindow(new Date(win.start.valueOf() + shift),
                           new Date(win.end.valueOf() + shift));
    }

    document.getElementById('pan-left').onclick = () => pan(-0.3);
    document.getElementById('pan-right').onclick = () => pan(0.3);
    document.getElementById('zoom-in').onclick = () => timeline.zoomIn(0.5);
    document.getElementById('zoom-out').onclick = () => timeline.zoomOut(0.5);
    document.getElementById('full-span').onclick = () => {
        if (finished) setHighlights([], []);   // quiz over: show every band at full strength
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

    function setHighlights(eraKeys, eventIds) {
        const anyEra = eraKeys.length > 0;
        items.update(ERAS.map(era => eraItem(era, {
            hl: eraKeys.includes(era.key),
            dim: anyEra && !eraKeys.includes(era.key),
            showDuration: eraKeys.includes(era.key)
        })));
        hlEvents = new Set(eventIds);
        renderEvents();
    }

    function revealEvents(ids) {
        ids.forEach(id => revealedEvents.add(id));
        renderEvents();
    }

    function hideAllEvents() {
        items.remove(EVENTS.map(ev => 'ev-' + ev.id));
        revealedEvents = new Set();
        hlEvents = new Set();
    }

    // Zoom to show every highlighted band and event with some padding
    function fitTo(eraKeys, eventIds) {
        const years = [];
        eraKeys.forEach(k => { const e = eraByKey(k); years.push(e.start, e.end); });
        eventIds.forEach(id => {
            const ev = EVENTS.find(x => x.id === id);
            years.push(ev.start);
            if (ev.end !== undefined) years.push(ev.end);
        });
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
        revealEvents(Q.events);
        setHighlights(Q.eras, Q.events);
        fitTo(Q.eras, Q.events);

        let html = right ? '<span class="verdict-good">Correct.</span> '
                         : '<span class="verdict-bad">Not quite.</span> The answer is <b>' +
                           Q.choices[Q.correct] + '</b>. ';
        html += Q.why;

        if (qIndex === QUESTIONS.length - 1) {
            finished = true;
            revealEvents(EVENTS.map(ev => ev.id));
            setHighlights(Q.eras, Q.events);
            const verdict = score >= 5
                ? '5 or more: you have the clock.'
                : 'Fewer than 5: reread the 24-hour clock table, then press Restart and try again.';
            elDetails.innerHTML =
                '<h2>Correct: ' + score + ' of ' + QUESTIONS.length + '</h2>' +
                '<p><b>' + verdict + '</b></p>' +
                '<p>All 29 events are now on the timeline. Press <b>Full span</b> to see them all, then click any band or event to read about it.</p>';
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
        setHighlights([], []);
        showFullSpan(true);
        renderQuestion();
    }

    function restart() {
        qIndex = 0;
        score = 0;
        finished = false;
        revealedEras = new Set();
        hideAllEvents();
        setHighlights([], []);
        timeline.setSelection([]);
        elScore.textContent = 'Correct: 0 of ' + QUESTIONS.length;
        elDetails.innerHTML = '<div class="placeholder">Answer the question, then click any era band or event to read about it.</div>';
        showFullSpan(true);
        renderQuestion();
    }

    btnNext.onclick = nextQuestion;
    btnRestart.onclick = restart;

    // ------------------------------------------------------------------
    // Infobox
    // ------------------------------------------------------------------
    function chapterLink(ch) {
        if (ch === 1) return 'This chapter goes deeper.';
        const dir = CHAPTER_DIRS[ch];
        return 'Read more in <a href="../../chapters/' + dir + '/" target="_top">Chapter ' + ch + '</a>.';
    }

    function showEra(era) {
        const showDur = finished || revealedEras.has(era.key);
        const dur = showDur
            ? ' · ' + fmtNum(duration(era.start, era.end)) + ' years'
            : ' · duration shown after you answer a question about it';
        elDetails.innerHTML =
            '<h2><span class="swatch" style="background:' + era.color + '"></span>' + era.name + '</h2>' +
            '<div class="when">' + eraDates(era) + dur + '</div>' +
            '<p>' + era.desc + '</p>' +
            '<p class="note">' + BOUNDARY_NOTE + '</p>';
    }

    function showEvent(ev) {
        elDetails.innerHTML =
            '<h2>' + ev.title + '</h2>' +
            '<div class="when">' + eventDate(ev) + '</div>' +
            '<p>' + ev.desc + '</p>' +
            '<p class="note">' + chapterLink(ev.ch) + '</p>';
    }

    timeline.on('select', function (props) {
        if (!props.items.length) return;
        const id = String(props.items[0]);
        if (id.startsWith('era-')) showEra(eraByKey(id.slice(4)));
        else if (id.startsWith('ev-')) showEvent(EVENTS.find(ev => ev.id === Number(id.slice(3))));
    });

    // ------------------------------------------------------------------
    // Start: nine bands, no events, question 1
    // ------------------------------------------------------------------
    renderQuestion();
});
