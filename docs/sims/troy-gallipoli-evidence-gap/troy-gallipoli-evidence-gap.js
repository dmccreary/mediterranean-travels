// Mind the Gap: How Old Is the Evidence? - vis-timeline
// CANVAS_HEIGHT: 716
// Eight stories about Troy and Gallipoli, in shuffled order. For each one the
// learner sees the event on a 1500 BCE - 2100 CE timeline, predicts the date of
// the earliest surviving evidence by clicking the timeline (or typing a year),
// then sees the evidence marker, the gap bar and the author's stake, and judges
// the story: Firm history, Real core with a shaped telling, or Late or
// unsupported. Two attempts per verdict; mastery is 7 of 8 on the first try.
// Years are signed numbers: negative = BCE, positive = CE.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------
    const VERDICTS = ['Firm history', 'Real core, shaped telling', 'Late or unsupported'];

    const STORIES = [
        { short: 'A burned city', story: 'A city on the Hisarlık mound burned around 1180 BCE.',
          event: -1180, eventLabel: 'c. 1180 BCE',
          evidence: -1180, evidenceLabel: 'c. 1180 BCE', evidenceShort: 'Troy VIIa ash layer',
          source: 'The burned destruction layer of Troy VIIa, excavated by Carl Blegen in 1932–1938',
          gap: 0, gapText: '0 years', stake: 'None: physical evidence', verdict: 0,
          why: 'The ash and fallen walls were made by the event itself.' },
        { short: 'Alaksandu treaty', story: 'A Hittite king made a treaty with Alaksandu, king of Wilusa.',
          event: -1280, eventLabel: 'c. 1280 BCE',
          evidence: -1280, evidenceLabel: 'c. 1280 BCE', evidenceShort: 'Hittite treaty tablet',
          source: 'The treaty tablet of Muwatalli II from the Hittite archives at Hattusa',
          gap: 0, gapText: '0 years', stake: 'A state record with no known reason to invent the treaty', verdict: 0,
          why: 'The tablet is a document of the time; that Wilusa is Troy is a separate, widely accepted identification.' },
        { short: 'Ten-year siege', story: 'A Greek army under Agamemnon besieged Troy for ten years to win back Helen.',
          event: -1180, eventLabel: 'c. 1180 BCE, if it happened',
          evidence: -700, evidenceLabel: 'c. 700 BCE', evidenceShort: 'Homer’s Iliad',
          source: 'Homer’s Iliad',
          gap: 480, gapText: 'about 480 years', stake: 'A poet shaping a tradition of songs', verdict: 2,
          why: 'The place is real, but the earliest account of the war comes nearly five centuries later.' },
        { short: 'Wooden horse', story: 'The Greeks took Troy by hiding soldiers in a wooden horse.',
          event: -1180, eventLabel: 'c. 1180 BCE, if it happened',
          evidence: -700, evidenceLabel: 'c. 700 BCE', evidenceShort: 'Homer’s Odyssey',
          source: 'Brief mentions in Homer’s Odyssey (three passages)',
          gap: 480, gapText: 'about 480 years', stake: 'A poet; the fullest telling comes from Virgil’s Aeneid, c. 19 BCE', verdict: 2,
          later: { year: -19, label: 'Virgil, c. 19 BCE' },
          why: 'The horse appears only in poems written centuries later.' },
        { short: 'Mehmed II at Troy', story: 'Mehmed II visited the ruins of Troy in 1462 and spoke of avenging the Trojans.',
          event: 1462, eventLabel: '1462 CE',
          evidence: 1467, evidenceLabel: 'c. 1467 CE', evidenceShort: 'Kritoboulos’s history',
          source: 'The history of Mehmed’s reign by his Greek courtier Kritoboulos',
          gap: 5, gapText: 'about 5 years', stake: 'An admirer writing for the sultan', verdict: 1,
          why: 'The visit is recorded within a few years, but by an author with every reason to flatter.' },
        { short: 'Priam’s Treasure', story: 'Schliemann found Priam’s Treasure in 1873, and Sophia carried it off in her shawl.',
          event: 1873, eventLabel: '1873 CE',
          evidence: 1874, evidenceLabel: '1874 CE', evidenceShort: 'Schliemann’s book',
          source: 'Schliemann’s own published account',
          gap: 1, gapText: '1 year', stake: 'Schliemann promoting his discovery; he later admitted Sophia was in Athens', verdict: 1,
          why: 'The treasure is real; the shawl scene was invented by the man who told it.' },
        { short: 'March 18, 1915', story: 'An Allied fleet lost three battleships to mines in the Dardanelles on March 18, 1915.',
          event: 1915, eventLabel: 'March 18, 1915',
          evidence: 1915, evidenceLabel: '1915 CE', evidenceShort: 'Naval records',
          source: 'Naval reports and ship records of both sides. The ships were the French Bouvet, which sank within minutes with most of her crew, and the British Irresistible and Ocean',
          gap: 0, gapText: '0 years', stake: 'Both sides recorded the losses', verdict: 0,
          why: 'Records of the time on both sides agree.' },
        { short: 'Johnnies and Mehmets', story: 'Atatürk wrote the “Johnnies and Mehmets” words in 1934.',
          event: 1934, eventLabel: '1934 CE',
          evidence: 1953, evidenceLabel: '1953 CE', evidenceShort: 'Şükrü Kaya interview',
          source: 'A newspaper interview with the former minister Şükrü Kaya',
          gap: 19, gapText: '19 years', stake: 'A former colleague recalling a speech; no record from 1934 has been found', verdict: 2,
          why: 'The earliest evidence comes 19 years later, and historians still debate whether the words are Atatürk’s.',
          note: 'As cultural memory the words are real and powerful: they are read at Anzac Day services and carved at Anzac Cove, Canberra and Wellington.' }
    ];
    const MASTERY = 7;
    const FINAL_MSG = 'A real place does not prove a story, and an early source is not always an honest one. ' +
                      'The gap and the author’s stake together tell us how far to trust it.';

    const FULL_START = -1500;
    const FULL_END = 2100;
    const YEAR_MS = 365.25 * 24 * 3600 * 1000;

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    // Signed year -> Date. BCE year n is placed at astronomical year -n; the
    // one-year shift is invisible at this scale and gaps are computed, not measured.
    function toDate(y) {
        const d = new Date(2000, 6, 1, 0, 0, 0);
        d.setFullYear(y);
        return d;
    }
    function fromDate(d) {
        const y = d.getFullYear();
        return y === 0 ? -1 : y;
    }
    function fmtYear(y) { return y < 0 ? (-y) + ' BCE' : y + ' CE'; }
    function axisLabel(date) {
        const y = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
        // Drop a tick label that would be cut off at the right edge
        if (drawn) {
            const win = timeline.getWindow();
            const yearsPerPx = (win.end - win.start) / YEAR_MS / Math.max(100, container.clientWidth - 140);
            if (win.end.getFullYear() - y < 58 * yearsPerPx) return '';
        }
        if (y === 0) return 'BCE | CE';
        return y < 0 ? (-y) + ' BCE' : y + ' CE';
    }
    // Years between two signed years, with no year zero
    function yearsBetween(a, b) {
        const lo = Math.min(a, b), hi = Math.max(a, b);
        return hi - lo - (lo < 0 && hi > 0 ? 1 : 0);
    }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    let order = [];        // shuffled story indices
    let active = -1;       // story index in progress
    let stage = 'pick';    // pick | predict | judge | done (per story) ; 'final' when all done
    let guess = null;      // signed year
    let chosen = -1;       // chosen verdict
    let wrongTries = 0;
    let results = {};      // story index -> { first: bool, guess, judged }
    let score = 0;
    let finished = false;

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
        margin: { item: { horizontal: 4, vertical: 3 }, axis: 4 },
        min: toDate(-1700),
        max: toDate(2400),
        zoomMin: 20 * YEAR_MS,
        zoomMax: 4000 * YEAR_MS,
        zoomable: false,
        moveable: true,
        selectable: false,
        showCurrentTime: false,
        showMajorLabels: false,
        groupHeightMode: 'fixed',
        tooltip: { followMouse: true, overflowMethod: 'cap' },
        format: {
            minorLabels: function (date) { return axisLabel(date); },
            majorLabels: function () { return ''; }
        }
    };

    let timeline = null;
    let lastView = [toDate(FULL_START), toDate(FULL_END)];
    let drawn = false;
    function setView(a, b, animate) {
        lastView = [toDate(a), toDate(b)];
        if (drawn) {
            const cur = timeline.getWindow();
            if ((b - a) * YEAR_MS > (cur.end - cur.start)) applyStep(b - a);
        }
        if (drawn) timeline.setWindow(lastView[0], lastView[1], { animation: !!animate });
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

    // Tick step that leaves room for labels such as "1000 BCE"
    const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
    let currentStep = 0;
    function applyStep(years) {
        const px = container.clientWidth - 140;
        const step = STEPS.find(st => (st / years) * px >= 70) || 1000;
        if (step !== currentStep) {
            currentStep = step;
            timeline.setOptions({ timeAxis: { scale: 'year', step: step } });
        }
    }
    function updateAxis() {
        if (!drawn) return;
        const win = timeline.getWindow();
        applyStep((win.end - win.start) / YEAR_MS);
    }
    timeline.on('rangechanged', updateAxis);
    window.addEventListener('resize', updateAxis);

    // Clicking the timeline places the prediction marker
    timeline.on('click', function (props) {
        if (finished || stage !== 'predict' || !props.time) return;
        if (props.what === 'group-label') return;
        setGuess(fromDate(props.time), true);
    });

    function buildGroups() {
        groups.clear();
        order.forEach((si, k) => groups.add({
            id: 's' + si,
            content: (k + 1) + '. ' + STORIES[si].short,
            order: k,
            className: si === active ? 'active' : ''
        }));
    }

    // Labels on the right half of the axis are drawn to the left of their marker,
    // so they never run past the right edge.
    const EMPTY = '<span>&nbsp;</span>';
    function lbl(text, year) {
        const left = year > 1000;
        return { content: '<span>' + text + '</span>', cls: left ? ' label-left' : '' };
    }

    function refreshItems() {
        items.clear();
        order.forEach(si => {
            const S = STORIES[si];
            const r = results[si];
            const isActive = (si === active);
            if (!isActive && !r) return;
            const g = 's' + si;
            const revealed = r || (isActive && (stage === 'judge' || stage === 'done'));

            // Event dot. On judged rows with a short gap, it carries the gap label.
            let ev = { content: EMPTY, cls: '' };
            if (revealed && S.gap < 100 && !isActive) ev = lbl('gap ' + S.gap + (S.gap === 1 ? ' yr' : ' yrs'), S.event);
            items.add({ id: 'e' + si, group: g, type: 'point', start: toDate(S.event), content: ev.content,
                        className: 'ev-event' + ev.cls, title: 'Event: ' + esc(S.eventLabel) });

            const myGuess = isActive ? guess : (r ? r.guess : null);
            if (myGuess !== null && myGuess !== undefined) {
                const gl = isActive && !revealed ? lbl('your guess: ' + fmtYear(myGuess), myGuess) : { content: EMPTY, cls: '' };
                items.add({ id: 'g' + si, group: g, type: 'point', start: toDate(myGuess), content: gl.content,
                            className: 'ev-guess' + gl.cls, title: 'Your guess: ' + fmtYear(myGuess) });
            }
            if (revealed) {
                // Short gaps are invisible at full span, so their bar is drawn only while zoomed in
                if (S.gap >= 100 || (S.gap > 0 && isActive)) {
                    items.add({ id: 'r' + si, group: g, type: 'range', start: toDate(S.event), end: toDate(S.evidence),
                                content: S.gap >= 100 ? '≈' + S.gap + ' yrs' : '', className: 'ev-gap',
                                title: 'Gap: ' + esc(S.gapText) });
                }
                const vl = isActive ? lbl(esc(S.evidenceShort) + ', ' + esc(S.evidenceLabel), S.evidence) : { content: EMPTY, cls: '' };
                items.add({ id: 'v' + si, group: g, type: 'point', start: toDate(S.evidence), content: vl.content,
                            className: 'ev-evidence' + vl.cls,
                            title: 'Earliest evidence: ' + esc(S.source) + ', ' + esc(S.evidenceLabel) });
                if (S.later) {
                    items.add({ id: 'l' + si, group: g, type: 'point', start: toDate(S.later.year),
                                content: isActive ? '<span>' + esc(S.later.label) + '</span>' : EMPTY, className: 'ev-later',
                                title: 'The fullest telling: Virgil’s Aeneid, c. 19 BCE' });
                }
            }
        });
    }

    function fitStory(S) {
        const ys = [S.event, S.evidence];
        if (guess !== null) ys.push(guess);
        if (S.later) ys.push(S.later.year);
        let lo = Math.min(...ys), hi = Math.max(...ys);
        const span = Math.max(hi - lo, 30);
        lo -= span * 0.25;
        hi += span * 0.6;     // room for labels on the right
        setView(Math.round(lo), Math.round(hi), true);
    }

    function showFullSpan(animate) { setView(FULL_START, FULL_END, animate); }
    document.getElementById('full-span').onclick = () => showFullSpan(true);

    // ------------------------------------------------------------------
    // Story cards
    // ------------------------------------------------------------------
    const elStories = document.getElementById('stories');
    function renderCards() {
        elStories.innerHTML = '';
        order.forEach((si, k) => {
            const b = document.createElement('button');
            const r = results[si];
            b.innerHTML = '<span class="n">' + (k + 1) + '.</span>' + esc(STORIES[si].short) +
                          (r ? (r.first ? ' ✓' : ' ✗') : '');
            b.title = STORIES[si].story;
            if (r) {
                b.className = r.first ? 'done-ok' : 'done-bad';
                b.onclick = () => review(si);
            } else if (si === active) {
                b.className = 'active';
            } else {
                b.onclick = () => pick(si);
                if (active >= 0 && stage !== 'done') { b.disabled = true; b.className = 'locked'; }
            }
            elStories.appendChild(b);
        });
    }

    // ------------------------------------------------------------------
    // Panel
    // ------------------------------------------------------------------
    const elPanel = document.getElementById('panel');
    const elScore = document.getElementById('score');
    const ruleEls = document.querySelectorAll('#rules .rule');

    function highlightRule(k) {
        ruleEls.forEach((el, i) => el.classList.toggle('hl', i === k));
    }

    function closeness(S, g) {
        const off = yearsBetween(g, S.evidence);
        const tol = S.event < 0 ? 50 : 5;
        const close = off <= tol;
        return (close ? 'Close: ' : 'Not close: ') + 'your guess, ' + fmtYear(g) + ', was ' +
               (off === 0 ? 'exactly right' : off.toLocaleString('en-US') + (off === 1 ? ' year' : ' years') + ' off') +
               ' (close = within ' + tol + ' years).';
    }

    function renderPanel() {
        if (finished) { renderFinal(); return; }
        if (active < 0) {
            elPanel.innerHTML =
                '<div class="step">Start</div>' +
                '<div class="story">How long after each event was the story first written down, and by whom?</div>' +
                '<p>Pick a story card above. Its event appears on the timeline as a blue dot. Then predict when the ' +
                'earliest surviving evidence for it was made, see the gap, and judge the story with one of the three verdicts.</p>' +
                '<p class="hint">Done: 0 of 8.</p>';
            return;
        }
        const S = STORIES[active];
        let h = '';
        if (stage === 'predict') {
            h += '<div class="step">Story ' + (order.indexOf(active) + 1) + ' of 8 · Step 1: predict</div>';
            h += '<div class="story">' + esc(S.story) + '</div>';
            h += '<div class="facts"><b>Event</b><span>' + esc(S.eventLabel) + '</span></div>';
            h += '<p>When was the <b>earliest surviving evidence</b> for this story made? Click the timeline in any row ' +
                 'to place your guess, or type a year.</p>';
            h += '<div class="row"><label for="g-year">Year</label><input id="g-year" type="number" min="1" max="2100" step="1" value="' +
                 (guess !== null ? Math.abs(guess) : '') + '"><select id="g-era" aria-label="BCE or CE">' +
                 '<option value="BCE"' + (guess !== null && guess < 0 ? ' selected' : (guess === null && S.event < 0 ? ' selected' : '')) + '>BCE</option>' +
                 '<option value="CE"' + (guess !== null && guess > 0 ? ' selected' : (guess === null && S.event > 0 ? ' selected' : '')) + '>CE</option></select>' +
                 '<button id="reveal-btn" class="primary"' + (guess === null ? ' disabled' : '') + '>Reveal the evidence</button></div>';
            elPanel.innerHTML = h;
            const yIn = document.getElementById('g-year'), eraIn = document.getElementById('g-era');
            const onType = () => {
                const v = parseInt(yIn.value, 10);
                if (!isNaN(v) && v > 0) setGuess(eraIn.value === 'BCE' ? -v : v, false);
            };
            yIn.addEventListener('input', onType);
            eraIn.addEventListener('change', onType);
            document.getElementById('reveal-btn').onclick = reveal;
            return;
        }
        // judge or done
        const r = results[active];
        h += '<div class="step">Story ' + (order.indexOf(active) + 1) + ' of 8 · ' +
             (stage === 'judge' ? 'Step 2: judge' : 'Judged') + '</div>';
        h += '<div class="story">' + esc(S.story) + '</div>';
        h += '<div class="facts">' +
             '<b>Event</b><span>' + esc(S.eventLabel) + '</span>' +
             '<b>Evidence</b><span>' + esc(S.source) + ', ' + esc(S.evidenceLabel) + '</span>' +
             '<b>Gap</b><span>' + esc(S.gapText) + '</span>' +
             '<b>Author’s stake</b><span>' + esc(S.stake) + '</span></div>';
        if (stage === 'judge') h += '<p class="close-note">' + closeness(S, guess) + '</p>';
        h += '<div class="row verdicts">';
        VERDICTS.forEach((v, i) => {
            let cls = '';
            if (stage === 'done') {
                if (i === S.verdict) cls = 'correct';
                else if (r && r.tried && r.tried.includes(i)) cls = 'wrong';
            } else if (curTried.includes(i)) cls = 'wrong';
            else if (i === chosen) cls = 'chosen';
            const dis = stage === 'done' || curTried.includes(i);
            h += '<button data-v="' + i + '" class="' + cls + '"' + (dis ? ' disabled' : '') + '>' + v + '</button>';
        });
        if (stage === 'judge') h += '<button id="check-btn" class="primary"' + (chosen < 0 ? ' disabled' : '') + '>Check</button>';
        if (stage === 'done') {
            h += '<button id="next-btn" class="primary push">' +
                 (Object.keys(results).length === STORIES.length ? 'See all eight' : 'Next story') + '</button>';
        }
        h += '</div>';
        h += '<div id="fb">' + (panelFeedback || '<span class="hint">Choose a verdict, then press Check. Two tries.</span>') + '</div>';
        elPanel.innerHTML = h;
        elPanel.querySelectorAll('.verdicts button[data-v]').forEach(b => {
            b.onclick = () => { chosen = parseInt(b.dataset.v, 10); renderPanel(); };
        });
        const cb = document.getElementById('check-btn');
        if (cb) cb.onclick = check;
        const nb = document.getElementById('next-btn');
        if (nb) nb.onclick = nextStory;
    }

    let panelFeedback = '';

    function renderFinal() {
        let h = '<div class="step">All eight judged</div>';
        const pass = score >= MASTERY;
        h += '<div class="story">Verdicts correct on the first try: ' + score + ' of 8. ' +
             (pass ? '<span class="good">Mastery reached.</span>' : '<span class="bad">Mastery is 7 of 8; press Start over to try again.</span>') + '</div>';
        h += '<p>' + FINAL_MSG + '</p>';
        h += '<p class="hint">Look at the timeline: the longest gap bars belong to the most famous stories, the siege and the wooden horse. ' +
             'Click a story card to review it, or hover over a marker.</p>';
        elPanel.innerHTML = h;
    }

    // ------------------------------------------------------------------
    // Flow
    // ------------------------------------------------------------------
    function pick(si) {
        if (finished || results[si]) return;
        if (active >= 0 && stage !== 'done') return;
        active = si;
        stage = 'predict';
        guess = null;
        chosen = -1;
        wrongTries = 0;
        curTried = [];
        panelFeedback = '';
        highlightRule(-1);
        buildGroups();
        refreshItems();
        renderCards();
        renderPanel();
        showFullSpan(true);
    }

    function setGuess(y, fromClick) {
        if (stage !== 'predict') return;
        guess = Math.max(-1700, Math.min(2100, y));
        refreshItems();
        if (fromClick) renderPanel();
        else {
            const rb = document.getElementById('reveal-btn');
            if (rb) rb.disabled = false;
        }
    }

    function reveal() {
        if (stage !== 'predict' || guess === null) return;
        stage = 'judge';
        refreshItems();
        renderPanel();
        fitStory(STORIES[active]);
    }

    function check() {
        if (stage !== 'judge' || chosen < 0) return;
        const S = STORIES[active];
        curTried.push(chosen);
        const right = (chosen === S.verdict);
        if (right || wrongTries >= 1) {
            const first = right && wrongTries === 0;
            if (first) score++;
            results[active] = { first: first, guess: guess, tried: curTried.slice() };
            const note = S.note ? '<p class="hint">' + esc(S.note) + '</p>' : '';
            if (right) {
                panelFeedback = '<span class="good">Correct:</span> ' + esc(S.why) +
                    (wrongTries ? ' <span class="hint">(Second try, so it does not count toward the score.)</span>' : '') + note;
            } else {
                wrongTries++;
                panelFeedback = '<span class="bad">The verdict is ' + VERDICTS[S.verdict] + '.</span> ' + esc(S.why) + note;
            }
            stage = 'done';
            highlightRule(S.verdict);
            elScore.textContent = 'Verdicts correct on the first try: ' + score + ' of 8';
            renderCards();
        } else {
            wrongTries++;
            panelFeedback = '<span class="bad">Not yet.</span> Look at the gap (' + esc(S.gapText) +
                            ') and the author’s stake, then try again.';
            chosen = -1;
        }
        renderPanel();
    }
    let curTried = [];

    function nextStory() {
        if (Object.keys(results).length === STORIES.length) {
            finished = true;
            active = -1;
            stage = 'final';
            highlightRule(-1);
            buildGroups();
            refreshItems();
            renderCards();
            renderPanel();
            showFullSpan(true);
            return;
        }
        // open the next unjudged story in card order
        const nextSi = order.find(si => !results[si]);
        active = -1;
        stage = 'pick';
        pick(nextSi);
    }

    function review(si) {
        if (!finished) return;
        const S = STORIES[si];
        const r = results[si];
        highlightRule(S.verdict);
        elPanel.innerHTML =
            '<div class="step">Review</div>' +
            '<div class="story">' + esc(S.story) + '</div>' +
            '<div class="facts">' +
            '<b>Event</b><span>' + esc(S.eventLabel) + '</span>' +
            '<b>Evidence</b><span>' + esc(S.source) + ', ' + esc(S.evidenceLabel) + '</span>' +
            '<b>Gap</b><span>' + esc(S.gapText) + '</span>' +
            '<b>Author’s stake</b><span>' + esc(S.stake) + '</span>' +
            '<b>Your guess</b><span>' + fmtYear(r.guess) + '</span>' +
            '<b>Verdict</b><span>' + VERDICTS[S.verdict] + (r.first ? ' ✓' : ' ✗') + '</span></div>' +
            '<p>' + esc(S.why) + '</p>' +
            '<div class="row"><button id="back-btn">Back to the summary</button></div>';
        document.getElementById('back-btn').onclick = () => { highlightRule(-1); renderPanel(); showFullSpan(true); };
        const ys = [S.event, S.evidence, r.guess];
        const lo = Math.min(...ys), hi = Math.max(...ys);
        const span = Math.max(hi - lo, 30);
        setView(Math.round(lo - span * 0.25), Math.round(hi + span * 0.6), true);
    }

    function restart() {
        order = STORIES.map((s, i) => i);
        for (let i = order.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
        }
        active = -1;
        stage = 'pick';
        guess = null;
        chosen = -1;
        wrongTries = 0;
        results = {};
        score = 0;
        finished = false;
        panelFeedback = '';
        elScore.textContent = 'Verdicts correct on the first try: 0 of 8';
        highlightRule(-1);
        buildGroups();
        refreshItems();
        renderCards();
        renderPanel();
        showFullSpan(true);
    }
    document.getElementById('restart-btn').onclick = restart;

    applyStep(FULL_END - FULL_START);   // before the first draw, so the full span never gets a 1-year grid
    restart();
});
