// Eleven Centuries of the Oracle - vis-timeline
// CANVAS_HEIGHT: 482
// Fourteen dated event cards, shown one at a time in a fixed, deliberately
// non-chronological order. For each, the learner judges whether it shows the
// Oracle of Delphi's strength or a weakness or decline; one scored attempt per
// card. After each answer the card drops onto a timeline from 800 BCE to
// 450 CE, in the row of its correct category (row, triangle and color cue).
// A background band marks the oracle's 1,140-year life (750 BCE to 391 CE).
// After card 14, one reflection question asks when the signs of weakness
// begin to cluster. Mastery: 12 of 14, with at least two of the trap cards
// 3, 5 and 7 right.

document.addEventListener('DOMContentLoaded', function () {

    // ------------------------------------------------------------------
    // Data
    // ------------------------------------------------------------------
    const CATS = {
        strength: { id: 'strength', name: 'Shows strength', short: 'Strength', mark: '▲', verdict: 'shows strength' },
        weak: { id: 'weak', name: 'Shows a weakness or decline', short: 'Weakness', mark: '▼', verdict: 'shows a weakness or decline' }
    };
    const ORDER = ['strength', 'weak'];

    // y: year placed on the timeline (negative = BCE); end: last year of a range.
    const CARDS = [
        { n: 1, y: -750, date: 'c. 750 BCE', cat: 'strength',
          text: 'The Sanctuary of Apollo grows; the earliest dedications accumulate.',
          why: 'The sanctuary was growing into a meeting place for Greeks from many cities.' },
        { n: 2, y: -630, date: 'c. 630 BCE', cat: 'strength',
          text: 'Settlers from Thera found Cyrene in Libya after repeated answers from Delphi.',
          why: 'Cities sought the oracle’s approval for new foundations across the sea.' },
        { n: 3, y: -548, date: '548 BCE', cat: 'strength', trap: true,
          text: 'The temple burns; the Greek world and the king of Egypt pay to rebuild it.',
          why: 'The fire was damage, but the rebuilding shows how much the whole world valued the oracle.' },
        { n: 4, y: -550, date: 'c. 550 BCE', cat: 'strength',
          text: 'King Croesus of Lydia sends a gold lion and great mixing bowls.',
          why: 'Even a foreign king tested the oracles and chose Delphi as the one to honor.' },
        { n: 5, y: -510, date: 'c. 510 BCE', cat: 'weak', trap: true,
          text: 'The Alcmaeonids bribe the Pythia to tell the Spartans to free Athens, Herodotus says.',
          why: 'It happened at the height of the oracle’s power, but it shows that its voice could be bought.' },
        { n: 6, y: -479, date: '479 BCE', cat: 'strength',
          text: 'The Greek allies dedicate the Serpent Column after Plataea.',
          why: 'The victors chose Delphi to display their shared victory.' },
        { n: 7, y: -279, date: '279 BCE', cat: 'strength', trap: true,
          text: 'A Gaulish army attacks Delphi and is driven off; the defenders credit snow, earthquake and the god.',
          why: 'It is late, but the story added to the god’s prestige as protector of his sanctuary.' },
        { n: 8, y: -356, end: -346, date: '356–346 BCE', cat: 'weak',
          text: 'In the Third Sacred War, the Phocians seize Delphi and melt its treasures.',
          why: 'The sanctuary’s wealth was safe only while the rivals agreed to leave it alone.' },
        { n: 9, y: -87, end: -86, date: 'c. 87–86 BCE', cat: 'weak',
          text: 'The Roman general Sulla takes the sanctuary’s remaining valuables to pay for his war.',
          why: 'A Roman general treated the god’s treasure as a war chest.' },
        { n: 10, y: -44, date: '44 BCE', cat: 'weak',
          text: 'Cicero writes that Delphi’s answers have long fallen silent and nothing is more despised.',
          why: 'Educated Romans no longer took the oracle seriously.' },
        { n: 11, y: 67, date: '67 CE', cat: 'weak',
          text: 'Nero carries off about 500 bronze statues, Pausanias says.',
          why: 'An emperor stripped the sanctuary as plunder.' },
        { n: 12, y: 100, date: 'c. 100 CE', cat: 'weak',
          text: 'Plutarch writes that one Pythia is now enough where three were once needed.',
          why: 'Far fewer people came with questions.' },
        { n: 13, y: 330, date: 'by 330 CE', cat: 'weak',
          text: 'Constantine removes the Serpent Column to Constantinople.',
          why: 'The sanctuary’s monuments became decoration for a Christian capital.' },
        { n: 14, y: 391, end: 392, date: '391–392 CE', cat: 'weak',
          text: 'The Theodosian Decrees ban sacrifice and close the temples; the Pythia falls silent.',
          why: 'Without sacrifice there could be no consultation; this is the end.' }
    ];

    const FINAL = {
        q: 'After about what date do the signs of weakness cluster?',
        choices: ['About 550 BCE', 'About 360 BCE', 'About 100 CE', 'About 391 CE'],
        correct: 1,
        yes: 'Yes. From the Third Sacred War on, the signs run one way, but the end took more than 700 years.',
        no: 'Look at the timeline again: where do the weakness markers begin to crowd together?'
    };

    const MASTERY = 12;
    const TRAPS = [3, 5, 7];

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
        full: [toDate(-830), toDate(480)],
        close: [toDate(-790), toDate(-215)]
    };

    // ------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------
    let idx = 0, score = 0, answered = false, finished = false;
    let picks = {};          // card n -> chosen category id
    let finalPick = -1;

    // ------------------------------------------------------------------
    // Timeline
    // ------------------------------------------------------------------
    const container = $('timeline');
    const items = new vis.DataSet();
    const groups = new vis.DataSet([
        { id: 'strength', content: '▲ Strength', className: 'g-strength', order: 1 },
        { id: 'weak', content: '▼ Weakness<br>or decline', className: 'g-weak', order: 2 }
    ]);
    let drawn = false;
    let lastView = VIEWS.full;

    function axisLabel(date) {
        const y = (date && typeof date.year === 'function') ? date.year() : new Date(date).getFullYear();
        if (y < -800 || y > 450) return '';
        if (drawn) {
            // drop a label that would be cut off at the right edge
            const w = timeline.getWindow();
            const frac = (toDate(y) - w.start) / (w.end - w.start);
            const cw = container.querySelector('.vis-center') ? container.querySelector('.vis-center').clientWidth : container.clientWidth;
            if (frac * cw > cw - 44) return '';
        }
        return fmtYear(y);
    }
    const options = {
        width: '100%',
        height: '170px',
        verticalScroll: false,
        orientation: 'top',
        stack: true,
        groupOrder: 'order',
        margin: { item: { horizontal: 2, vertical: 4 }, axis: 4 },
        min: toDate(-900),
        max: toDate(550),
        zoomMin: 100 * YEAR_MS,
        zoomMax: 1400 * YEAR_MS,
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

    // Tick step that leaves room for labels such as "500 BCE"
    const STEPS = [10, 20, 25, 50, 100, 200, 250, 500];
    let currentStep = 100;
    function updateAxis() {
        if (!drawn) return;
        const w = timeline.getWindow();
        const years = (w.end - w.start) / YEAR_MS;
        const center = container.querySelector('.vis-center');
        const px = Math.max(150, center ? center.clientWidth : container.clientWidth);
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
        const C = CATS[c.cat];
        const pick = picks[c.n];
        return '<b>' + c.n + '. ' + c.date + '</b><br>' + c.text + '<br><i>' + C.name + '.</i> ' + c.why +
            (pick && pick !== c.cat ? '<br>Your first answer: ' + CATS[pick].name.toLowerCase() + '.' : '');
    }

    function refresh(nowN) {
        const list = [{
            id: 'life', start: toDate(-750), end: toDate(391), type: 'background', className: 'life',
            content: 'The oracle’s life: 1,140 years (750 + 391 − 1)',
            title: 'From at least c. 750 BCE to the Theodosian Decrees of 391 CE: 750 + 391 − 1 = 1,140 years, since there was no year zero.'
        }];
        CARDS.forEach(c => {
            if (!(c.n in picks)) return;
            const cls = ['cardi', c.cat];
            if (picks[c.n] !== c.cat) cls.push('miss');
            if (c.n === nowN) cls.push('now');
            const item = {
                id: 'c' + c.n, group: c.cat, start: toDate(c.y), type: 'box',
                content: '<span class="num">' + CATS[c.cat].mark + ' ' + c.n + '</span>',
                title: cardTip(c), className: cls.join(' ')
            };
            if (c.end !== undefined) { item.end = toDate(c.end, 11); item.type = 'range'; }
            list.push(item);
        });
        if (finished && finalPick >= 0) {
            list.push({
                id: 'cluster', start: toDate(-356), end: toDate(392), type: 'background', group: 'weak', className: 'cluster',
                content: '',
                title: 'Every weakness card except the Alcmaeonid bribery (c. 510 BCE) falls after about 360 BCE.'
            });
        }
        items.clear();
        items.add(list);
    }

    timeline.on('select', function (props) {
        if (!props.items.length) return;
        const id = String(props.items[0]);
        if (/^c\d+$/.test(id)) showCard(Number(id.slice(1)));
    });

    // ------------------------------------------------------------------
    // Cards
    // ------------------------------------------------------------------
    const elChoices = $('choices'), elFeedback = $('feedback');
    const btnNext = $('next-btn'), btnRestart = $('restart-btn');

    function updateScore() { $('score').textContent = 'Correct on first attempt: ' + score + ' of ' + CARDS.length; }

    function feedbackFor(c) {
        return picks[c.n] === c.cat
            ? '<span class="good">Correct:</span> ' + c.why
            : '<span class="bad">This one ' + CATS[c.cat].verdict + ':</span> ' + c.why;
    }

    function buildChoices(c, locked) {
        elChoices.innerHTML = '';
        elChoices.className = '';
        ORDER.forEach((id, k) => {
            const C = CATS[id];
            const b = document.createElement('button');
            b.textContent = (k + 1) + '. ' + C.mark + ' ' + C.name;
            b.title = C.name + ' (key ' + (k + 1) + ')';
            b.classList.add(id);
            b.onclick = () => answer(id);
            if (locked) {
                b.disabled = true;
                if (id === c.cat) b.classList.add('correct');
                else if (id === picks[c.n]) b.classList.add('wrong');
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
        $('c-q').textContent = 'Does this event show the oracle’s strength, or a weakness?';
        buildChoices(c, false);
        elFeedback.innerHTML = '<span class="muted">Only your first answer counts. The cards are not in time order; ' +
            'each one drops onto the timeline at its date once you answer.</span>';
        btnNext.disabled = true;
        btnNext.textContent = idx < CARDS.length - 1 ? 'Next card →' : 'Final question →';
    }

    // Re-read an answered card from the timeline (does not change the score)
    function showCard(n) {
        const c = CARDS.find(x => x.n === n);
        if (!(n in picks)) return;
        $('c-count').textContent = 'Card ' + c.n + ' of ' + CARDS.length + ' (review)';
        $('c-date').textContent = c.date;
        $('c-text').textContent = c.text;
        $('c-q').textContent = 'Does this event show the oracle’s strength, or a weakness?';
        buildChoices(c, true);
        elFeedback.innerHTML = feedbackFor(c);
        if (!finished) btnNext.disabled = !answered;
    }

    function answer(catId) {
        if (answered || finished) return;
        const c = CARDS[idx];
        if (c.n in picks) return;
        answered = true;
        picks[c.n] = catId;
        if (catId === c.cat) score++;
        updateScore();
        buildChoices(c, true);
        elFeedback.innerHTML = feedbackFor(c);
        btnNext.disabled = false;
        refresh(c.n);
    }

    function trapsRight() { return TRAPS.filter(n => picks[n] === CARDS[n - 1].cat).length; }

    function showFinal() {
        finished = true;
        refresh(0);
        setView('full', true);
        timeline.setSelection([]);
        $('c-count').textContent = 'All fourteen cards placed · final question (not scored)';
        $('c-date').textContent = '';
        $('c-text').textContent = FINAL.q;
        $('c-q').textContent = 'Look at the orange row before you answer.';
        buildFinalChoices();
        elFeedback.innerHTML = '<span class="muted">Choose one; this answer does not count toward the score.</span>';
        btnNext.disabled = true;
        btnNext.textContent = 'Done';
        $('hint').textContent = 'Keys 1 to 4 choose.';
    }

    function buildFinalChoices() {
        elChoices.innerHTML = '';
        elChoices.className = 'four';
        FINAL.choices.forEach((txt, k) => {
            const b = document.createElement('button');
            b.textContent = (k + 1) + '. ' + txt;
            b.onclick = () => answerFinal(k);
            if (finalPick >= 0) {
                b.disabled = true;
                if (k === FINAL.correct) b.classList.add('correct');
                else if (k === finalPick) b.classList.add('wrong');
            }
            elChoices.appendChild(b);
        });
    }

    function answerFinal(k) {
        if (!finished || finalPick >= 0) return;
        finalPick = k;
        buildFinalChoices();
        refresh(0);
        const pass = score >= MASTERY && trapsRight() >= 2;
        elFeedback.innerHTML = (k === FINAL.correct ? '<span class="good">' + FINAL.yes + '</span> '
                                                    : '<span class="bad">' + FINAL.no + '</span> ') +
            'Every weakness card except the Alcmaeonid bribery falls after about 360 BCE (the striped band), and the decline took roughly 700 years. ' +
            '<br>Score: ' + score + ' of 14; trap cards 3, 5 and 7: ' + trapsRight() + ' of 3. ' +
            (pass ? '<span class="good">Mastery reached.</span>'
                  : '<span class="bad">Mastery is 12 of 14 with two of the three traps.</span> Try Again to repeat the cards.');
    }

    btnNext.onclick = () => {
        if (!answered || finished) return;
        if (idx < CARDS.length - 1) { idx++; renderCard(); }
        else showFinal();
    };
    btnRestart.onclick = () => restart(true);

    document.addEventListener('keydown', e => {
        if (finished) {
            if (['1', '2', '3', '4'].includes(e.key)) answerFinal(Number(e.key) - 1);
            return;
        }
        if (e.key === '1' || e.key === '2') answer(ORDER[Number(e.key) - 1]);
        else if (e.key === 'Enter') btnNext.onclick();
    });

    function restart(animate) {
        idx = 0; score = 0; answered = false; finished = false; picks = {}; finalPick = -1;
        timeline.setSelection([]);
        updateScore();
        $('hint').textContent = 'Keys 1 and 2 choose; Enter goes on.';
        setView('full', animate);
        refresh(0);
        renderCard();
    }

    // A little state for headless testing
    window.oracleTimeline = {
        answer: id => answer(id), next: () => btnNext.onclick(), final: k => answerFinal(k),
        view: name => setView(name, false), score: () => score, correctOf: i => CARDS[i].cat
    };

    restart(false);
});
