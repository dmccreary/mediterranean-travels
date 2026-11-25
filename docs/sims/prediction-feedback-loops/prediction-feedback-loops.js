// When a Prediction Feeds Itself - vis-network
// CANVAS_HEIGHT: 610
/*
 * Bloom: Analyze (differentiate). Three simplified prediction loops appear
 * one at a time: predictive policing, student risk prediction, and a traffic
 * forecast for the road to Delphi. The learner labels each link, in the fixed
 * order L1 to L10, as same direction (+) or opposite direction (-), then
 * classifies each loop as reinforcing or balancing, then answers one question
 * per loop. Every link, loop and question has one scored attempt. Mastery:
 * links >= 9 of 10, loops 3 of 3, questions >= 2 of 3.
 *
 * The loops are read from prediction-feedback-loops-cld.json (the cld-viewer
 * schema, plus a "loop" field on each node, link ids L1 to L10 on the edges,
 * and a "questions" list). Nodes are locked for learners. Add ?edit=true to
 * the URL to drag nodes and loop markers, reshape edges, step through the
 * loops, and export the updated JSON.
 */

const DATA_FILE = 'prediction-feedback-loops-cld.json';
const EDIT = new URLSearchParams(window.location.search).get('edit') === 'true';
const DRAFT_KEY = 'prediction-feedback-loops-cld-draft';

const COLORS = {
    variable: { background: '#ffffff', border: '#1e40af', highlight: { background: '#dbeafe', border: '#1e3a8a' },
        hover: { background: '#eff6ff', border: '#1e3a8a' } },
    current: { background: '#fff7e6', border: '#d97706', highlight: { background: '#fff7e6', border: '#d97706' },
        hover: { background: '#fff7e6', border: '#d97706' } },
    external: { background: '#f8fafc', border: '#94a3b8', highlight: { background: '#f1f5f9', border: '#64748b' },
        hover: { background: '#f1f5f9', border: '#64748b' } },
    positive: '#15803d',
    negative: '#b91c1c',
    pending: '#94a3b8',
    active: '#d97706',
    outside: '#94a3b8',
    reinforcing: '#b91c1c',
    balancing: '#15803d',
    unknown: '#64748b'
};
const DEFAULT_CURVE = { type: 'curvedCW', roundness: 0.15 };
const TYPE_NAME = { reinforcing: 'Reinforcing', balancing: 'Balancing' };
const SIGN_NAME = { positive: 'same', negative: 'opposite' };

let cld = null;
let network = null;
let nodes = null;
let edges = null;
let selectedEdge = null;
const curves = {};   // edge id -> {type, roundness}

// Learner state
let steps = [];      // {kind: 'link'|'loop'|'q', loopIdx, edge?, q?}
let cur = 0;
let choice = null;   // 'positive'|'negative' | 'reinforcing'|'balancing' | question choice index
let answers = [];    // per step: { choice, ok }
let shownLoop = 0;
let showingSummary = false;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function wrapText(text, maxLength) {
    const lines = [];
    let line = '';
    text.split(' ').forEach(word => {
        if (line && (line + ' ' + word).length > maxLength) {
            lines.push(line);
            line = word;
        } else {
            line = line ? line + ' ' + word : word;
        }
    });
    if (line) lines.push(line);
    return lines.join('\n');
}

function makeTooltip(text) {
    const div = document.createElement('div');
    div.style.cssText = 'max-width:240px;white-space:normal;line-height:1.4;font-size:13px;';
    div.textContent = text;
    return div;
}

function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function nodeLabel(id) {
    const n = cld.nodes.find(node => node.id === id);
    return n ? n.label : id;
}

function loopEdges(loop) {
    const result = [];
    for (let i = 0; i < loop.path.length - 1; i++) {
        const e = cld.edges.find(edge => edge.source === loop.path[i] && edge.target === loop.path[i + 1]);
        if (e) result.push(e);
    }
    return result;
}

function smoothFor(curve) {
    if (curve.type === 'straight') return { enabled: false };
    return { enabled: true, type: curve.type, roundness: curve.roundness };
}

const loopNodeIds = loop => cld.nodes.filter(n => n.loop === loop.id).map(n => n.id);
const step = () => steps[cur];
const stepOf = (kind, test) => steps.findIndex(s => s.kind === kind && test(s));
const isAnswered = i => Boolean(answers[i]);

function scores() {
    const sc = { link: 0, loop: 0, q: 0 };
    steps.forEach((s, i) => { if (answers[i] && answers[i].ok) sc[s.kind]++; });
    return sc;
}

// ---------------------------------------------------------------------------
// Build the vis-network data
// ---------------------------------------------------------------------------
function markerStyle(loop, show) {
    const color = show ? COLORS[loop.type] : COLORS.unknown;
    return {
        label: show ? (loop.type === 'reinforcing' ? 'R' : 'B') : '?',
        color: { background: color, border: '#111827', highlight: { background: color, border: '#facc15' },
            hover: { background: color, border: '#111827' } },
        title: makeTooltip(show ? loop.label + ' is ' + TYPE_NAME[loop.type].toLowerCase() + '. ' + loop.description
                                : 'The loop marker shows R or B once the loop is classified.')
    };
}

function buildNodes() {
    const list = cld.nodes.map(n => {
        const ext = n.type === 'external';
        return {
            id: n.id,
            label: ext ? wrapText(n.label, 14) + '\n(outside the loop)' : wrapText(n.label, 18),
            x: n.position.x,
            y: n.position.y,
            shape: 'box',
            margin: 9,
            borderWidth: 2,
            shapeProperties: ext ? { borderDashes: [6, 4] } : {},
            color: ext ? COLORS.external : COLORS.variable,
            font: { size: ext ? 16 : 18, face: 'Arial', color: ext ? '#475569' : '#1f2937' },
            title: makeTooltip(n.description),
            hidden: true
        };
    });
    cld.loops.forEach(loop => {
        list.push(Object.assign({
            id: 'loop_' + loop.id,
            x: loop.position.x,
            y: loop.position.y,
            shape: 'circle',
            margin: 9,
            borderWidth: 2,
            font: { size: 20, face: 'Arial', color: '#ffffff', bold: true },
            hidden: true
        }, markerStyle(loop, EDIT)));
    });
    return list;
}

function buildEdges() {
    return cld.edges.map(e => {
        curves[e.id] = Object.assign({}, DEFAULT_CURVE, e.curve || {});
        return {
            id: e.id,
            from: e.source,
            to: e.target,
            label: ' ? ',
            width: 3,
            arrows: { to: { enabled: true, scaleFactor: 0.9 } },
            smooth: smoothFor(curves[e.id]),
            dashes: Boolean(e.outside),
            font: { size: 26, face: 'Arial', strokeWidth: 0, background: '#ffffff', bold: true, vadjust: 0 },
            hidden: true
        };
    });
}

// ---------------------------------------------------------------------------
// Showing one loop and its link states
// ---------------------------------------------------------------------------
function showLoop(i) {
    shownLoop = i;
    const loop = cld.loops[i];
    const show = new Set(loopNodeIds(loop).concat(['loop_' + loop.id]));
    nodes.update(nodes.getIds().map(id => ({ id: id, hidden: !show.has(id) })));
    refreshMarks();
    fitLoop();
}

function edgeRevealed(e) {
    if (EDIT || e.outside) return true;
    const i = stepOf('link', s => s.edge.id === e.id);
    return isAnswered(i);
}

function refreshMarks() {
    const loop = cld.loops[shownLoop];
    const inView = new Set(cld.edges.filter(e => loopNodeIds(loop).includes(e.source)).map(e => e.id));
    const s = step();
    const activeId = !EDIT && s && s.kind === 'link' && !isAnswered(cur) ? s.edge.id : null;
    edges.update(cld.edges.map(e => {
        const shown = edgeRevealed(e);
        let color = shown ? COLORS[e.polarity] : COLORS.pending;
        if (e.outside) color = COLORS.outside;
        if (e.id === activeId) color = COLORS.active;
        const sign = e.polarity === 'positive' ? ' + ' : ' − ';
        const linkTag = e.outside ? '' : e.id + ' ';
        return {
            id: e.id,
            hidden: !inView.has(e.id),
            label: shown ? sign : ' ? ',
            width: e.id === activeId ? 5 : (shown ? 3 : 2),
            color: { color: color, highlight: color, hover: color },
            font: { size: 26, face: 'Arial', strokeWidth: 0, background: '#ffffff', bold: true, color: color },
            title: makeTooltip(shown ? linkTag + nodeLabel(e.source) + ' → ' + nodeLabel(e.target) + ' (' +
                (e.polarity === 'positive' ? '+' : '−') + '): ' + e.description
                : linkTag + nodeLabel(e.source) + ' → ' + nodeLabel(e.target) + ': not labeled yet.')
        };
    }));
    // highlight the two factors of the active link
    const hot = activeId ? new Set([s.edge.source, s.edge.target]) : new Set();
    nodes.update(cld.nodes.map(n => ({
        id: n.id,
        color: n.type === 'external' ? COLORS.external : (hot.has(n.id) ? COLORS.current : COLORS.variable)
    })));
    const li = stepOf('loop', st => st.loopIdx === shownLoop);
    nodes.update(Object.assign({ id: 'loop_' + loop.id }, markerStyle(loop, EDIT || isAnswered(li))));
    const over = document.getElementById('loop-overlay');
    if (over) {
        let stage = 'Label the links';
        if (s && s.kind === 'loop') stage = 'Classify the loop';
        if (s && s.kind === 'q') stage = 'Loop question';
        if (EDIT) stage = 'Edit mode';
        over.innerHTML = '<b>' + escapeHTML(loop.label) + ' of ' + cld.loops.length + '</b>' +
            '<span class="stage">' + stage + '</span>';
    }
}

function fitLoop() {
    const loop = cld.loops[shownLoop];
    network.fit({ nodes: loopNodeIds(loop), animation: false });
    // leave room for the title overlay above and the legend below, and for
    // the curved edges, which bow outside the boxes that fit() measures
    const scale = Math.min(network.getScale() * 0.8, 1.2);
    const view = network.getViewPosition();
    network.moveTo({ scale: scale, position: { x: view.x, y: view.y + 4 / scale }, animation: false });
}

// ---------------------------------------------------------------------------
// The learner's path
// ---------------------------------------------------------------------------
const elDetails = () => document.getElementById('details');

function buildSteps() {
    steps = [];
    cld.loops.forEach((loop, li) => {
        loopEdges(loop).forEach(e => steps.push({ kind: 'link', loopIdx: li, edge: e }));
        steps.push({ kind: 'loop', loopIdx: li });
    });
    (cld.questions || []).forEach((q, qi) => {
        steps.push({ kind: 'q', loopIdx: cld.loops.findIndex(l => l.id === q.loop), q: q, qIdx: qi });
    });
}

function resetAll() {
    answers = [];
    cur = 0;
    choice = null;
    showingSummary = false;
    document.getElementById('summary').hidden = true;
    showLoop(0);
    render();
}

function choose(c) {
    if (showingSummary || isAnswered(cur)) return;
    const s = step();
    if (s.kind === 'link' && c !== 'positive' && c !== 'negative') return;
    if (s.kind === 'loop' && c !== 'reinforcing' && c !== 'balancing') return;
    if (s.kind === 'q' && typeof c !== 'number') return;
    choice = c;
    render();
}

function submit() {
    if (showingSummary || isAnswered(cur) || choice === null) return;
    const s = step();
    let ok;
    if (s.kind === 'link') ok = choice === s.edge.polarity;
    else if (s.kind === 'loop') ok = choice === cld.loops[s.loopIdx].type;
    else ok = choice === s.q.answer;
    answers[cur] = { choice: choice, ok: ok };
    choice = null;
    refreshMarks();
    render();
}

function next() {
    if (showingSummary || !isAnswered(cur)) return;
    if (cur < steps.length - 1) {
        cur++;
        choice = null;
        if (step().loopIdx !== shownLoop) showLoop(step().loopIdx); else refreshMarks();
        render();
    } else {
        showSummary();
    }
}

function nextLabel() {
    if (cur >= steps.length - 1) return 'See results';
    const n = steps[cur + 1];
    if (n.kind === 'link') return step().kind === 'loop' ? 'Next loop' : 'Next link';
    if (n.kind === 'loop') return 'Classify the loop';
    return step().kind === 'q' ? 'Next question' : 'Loop questions';
}

function ruleHTML() {
    const s = step();
    const firstLoop = stepOf('loop', () => true);
    const reachedLoops = s.kind !== 'link' || cur > firstLoop;
    const ruleShown = steps.some((st, i) => st.kind === 'loop' && isAnswered(i));
    let h;
    if (s.kind === 'q') {
        return '<div class="count"><b>Counting rule:</b> an even number of opposite (\u2212) links, including zero, makes a loop reinforcing; an odd number makes it balancing.</div>';
    }
    if (!reachedLoops) {
        h = '<div><span class="pos">+ Same direction:</span> if the first factor rises, the second rises; if the first falls, the second falls.</div>' +
            '<div><span class="neg">− Opposite direction:</span> if the first factor rises, the second falls; if the first falls, the second rises.</div>';
    } else {
        h = '<div><span class="pos">+</span> same direction, <span class="neg">−</span> opposite direction. ' +
            '<span class="R">Reinforcing:</span> a change travels around the loop and comes back larger, in the same direction (a self-fulfilling prediction). ' +
            '<span class="B">Balancing:</span> the change comes back opposed (a self-defeating prediction).</div>';
    }
    if (ruleShown) {
        h += '<div class="count"><b>Counting rule:</b> an even number of opposite (−) links, including zero, makes a loop reinforcing; an odd number makes it balancing.</div>';
    }
    return h;
}

function render() {
    const sc = scores();
    document.getElementById('score').textContent =
        'Links ' + sc.link + ' of 10 · Loops ' + sc.loop + ' of 3 · Questions ' + sc.q + ' of 3';
    if (showingSummary) return;
    const s = step();
    const done = isAnswered(cur);
    const a = answers[cur];

    // answer bar
    const aBtn = document.getElementById('a-btn');
    const bBtn = document.getElementById('b-btn');
    let vals = null;
    if (s.kind === 'link') {
        vals = ['positive', 'negative'];
        aBtn.textContent = 'Same direction (+)';
        bBtn.textContent = 'Opposite direction (−)';
    } else if (s.kind === 'loop') {
        vals = ['reinforcing', 'balancing'];
        aBtn.textContent = 'Reinforcing';
        bBtn.textContent = 'Balancing';
    }
    [aBtn, bBtn].forEach((btn, k) => {
        btn.hidden = !vals;
        if (!vals) return;
        btn.dataset.value = vals[k];
        btn.disabled = done;
        const picked = done ? a.choice === vals[k] : choice === vals[k];
        btn.setAttribute('aria-pressed', String(picked));
    });
    document.getElementById('submit-btn').disabled = done || choice === null;
    const nx = document.getElementById('next-btn');
    nx.disabled = !done;
    nx.textContent = nextLabel();
    document.getElementById('rule').innerHTML = ruleHTML();

    // details
    let h = '';
    if (s.kind === 'link') {
        const e = s.edge;
        const loop = cld.loops[s.loopIdx];
        const first = loopEdges(loop)[0].id === e.id;
        const q = first ? loop.start_question
            : 'If “' + nodeLabel(e.source) + '” rises, what happens to “' + nodeLabel(e.target) + '”?';
        h += '<div><span class="link-name">Link ' + e.id + ' of 10:</span> ' + escapeHTML(nodeLabel(e.source)) +
             ' → ' + escapeHTML(nodeLabel(e.target)) + '</div>';
        h += '<div class="q">' + escapeHTML(q) + '</div>';
        if (!done) {
            h += '<div class="hint">Choose Same direction or Opposite direction, then Submit. One try per link.</div>';
        } else if (a.ok) {
            h += '<div><span class="good">Correct:</span> ' + escapeHTML(e.description) + '</div>';
        } else {
            h += '<div><span class="bad">This link runs the ' + SIGN_NAME[e.polarity] + ' way:</span> ' + escapeHTML(e.description) + '</div>';
        }
        if (done) {
            const outside = cld.edges.find(x => x.outside && x.target === e.target);
            if (outside) h += '<div class="hint">Outside factor: ' + escapeHTML(outside.description) + '</div>';
        }
    } else if (s.kind === 'loop') {
        const loop = cld.loops[s.loopIdx];
        h += '<div class="q">' + escapeHTML(loop.label) + ' is complete. Is it reinforcing or balancing?</div>';
        if (!done) {
            h += '<div class="hint">Trace a change once around the loop using the signs on the arrows. One try per loop.</div>';
        } else if (a.ok) {
            h += '<div><span class="good">Correct:</span> ' + escapeHTML(loop.description) + '</div>';
        } else {
            h += '<div><span class="bad">Count the opposite links: ' + loop.minus_signs + '. This loop is ' +
                 TYPE_NAME[loop.type].toLowerCase() + ':</span> ' + escapeHTML(loop.description) + '</div>';
        }
    } else {
        const q = s.q;
        h += '<div class="q">' + escapeHTML(q.id + '. ' + q.question) + '</div>';
        if (!done) {
            h += '<div class="opts">' + q.choices.map((c, k) =>
                '<button type="button" class="opt" data-k="' + k + '" aria-pressed="' + (choice === k) + '">' +
                (k + 1) + '. ' + escapeHTML(c) + '</button>').join('') + '</div>';
        } else {
            h += '<div class="mine hint">Your answer: ' + escapeHTML(q.choices[a.choice]) + '</div>';
            h += a.ok ? '<div><span class="good">Correct:</span> ' + escapeHTML(q.why) + '</div>'
                      : '<div><span class="bad">The best answer is: ' + escapeHTML(q.choices[q.answer]) + '.</span> ' + escapeHTML(q.why) + '</div>';
        }
    }
    elDetails().innerHTML = h;
    elDetails().querySelectorAll('.opt').forEach(btn => btn.addEventListener('click', () => choose(Number(btn.dataset.k))));
}

function showSummary() {
    showingSummary = true;
    const sc = scores();
    const mastery = sc.link >= 9 && sc.loop === 3 && sc.q >= 2;
    let rows = '';
    cld.loops.forEach((loop, li) => {
        const linkIdx = steps.map((s, i) => i).filter(i => steps[i].kind === 'link' && steps[i].loopIdx === li);
        const linksOk = linkIdx.filter(i => answers[i] && answers[i].ok).length;
        const loopOk = answers[stepOf('loop', s => s.loopIdx === li)].ok;
        const qi = stepOf('q', s => s.loopIdx === li);
        const t = loop.type === 'reinforcing' ? 'R' : 'B';
        rows += '<tr><td>' + escapeHTML(loop.label) + '</td><td class="n">' + loop.minus_signs + '</td><td class="' + t + '">' +
            TYPE_NAME[loop.type] + '</td><td class="n">' + linksOk + ' of ' + linkIdx.length + '</td><td class="n">' +
            (loopOk ? '✓' : '✗') + '</td><td class="n">' + (qi >= 0 && answers[qi] && answers[qi].ok ? '✓' : '✗') + '</td></tr>';
    });
    const el = document.getElementById('summary');
    el.innerHTML = '<h2>Links ' + sc.link + ' of 10 · Loops ' + sc.loop + ' of 3 · Questions ' + sc.q + ' of 3</h2>' +
        '<div class="final ' + (mastery ? 'good' : 'bad') + '">' +
        (mastery ? 'You can read a feedback loop: a prediction about people can make itself come true, or keep itself from coming true.'
                 : 'Look again at Loop 2: count its opposite links before deciding.') + '</div>' +
        '<table><thead><tr><th>Loop</th><th>Opposite links</th><th>Type</th><th>Links right</th><th>Type right</th><th>Question right</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table>' +
        '<div class="row-label">Mastery: at least 9 of 10 links, all 3 loops, and at least 2 of 3 questions on the first try.</div>';
    el.hidden = false;
    elDetails().innerHTML =
        '<div class="notice">Notice that Loop 2 contains two opposite links and still reinforces: the two cancel. ' +
        'And the loop that looks like a failed forecast, Loop 3, is the one in which the forecast worked. ' +
        'Press <b>Start Over</b> to try again.</div>';
    ['a-btn', 'b-btn', 'submit-btn', 'next-btn'].forEach(id => { document.getElementById(id).disabled = true; });
    render();
}

// ---------------------------------------------------------------------------
// Edit mode: drag, curve tools, export
// ---------------------------------------------------------------------------
function exportCLD() {
    const live = network.getPositions();
    const out = JSON.parse(JSON.stringify(cld));
    out.nodes.forEach(n => {
        const p = live[n.id];
        if (p) n.position = { x: Math.round(p.x), y: Math.round(p.y) };
    });
    out.loops.forEach(l => {
        const p = live['loop_' + l.id];
        if (p) l.position = { x: Math.round(p.x), y: Math.round(p.y) };
    });
    out.edges.forEach(e => {
        const c = curves[e.id];
        if (c.type === DEFAULT_CURVE.type && c.roundness === DEFAULT_CURVE.roundness) delete e.curve;
        else e.curve = c.type === 'straight' ? { type: 'straight' } : { type: c.type, roundness: c.roundness };
    });
    out.metadata.updated_date = new Date().toISOString().slice(0, 10);
    return out;
}

function setStatus(text) {
    document.getElementById('edit-status').textContent = text;
}

function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(exportCLD())); } catch (err) { /* storage unavailable */ }
}

function loadDraft() {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        return null;
    }
}

// Take only the layout (positions and curves) from a saved draft, so text
// edits made to the JSON file since the draft was saved still show.
function applyDraftLayout(data, draft) {
    const byId = list => Object.fromEntries((list || []).map(item => [item.id, item]));
    const dNodes = byId(draft.nodes);
    const dLoops = byId(draft.loops);
    const dEdges = byId(draft.edges);
    data.nodes.forEach(n => { if (dNodes[n.id]) n.position = dNodes[n.id].position; });
    data.loops.forEach(l => { if (dLoops[l.id]) l.position = dLoops[l.id].position; });
    data.edges.forEach(e => {
        if (!dEdges[e.id]) return;
        if (dEdges[e.id].curve) e.curve = dEdges[e.id].curve; else delete e.curve;
    });
}

function updateEdgeTools() {
    ['flip-btn', 'less-btn', 'more-btn', 'straight-btn'].forEach(id => {
        document.getElementById(id).disabled = !selectedEdge;
    });
    if (selectedEdge) {
        const c = curves[selectedEdge];
        setStatus(selectedEdge + ': ' + (c.type === 'straight' ? 'straight' : c.type + ' ' + c.roundness.toFixed(2)));
    }
}

function changeCurve(fn) {
    if (!selectedEdge) return;
    const c = curves[selectedEdge];
    fn(c);
    c.roundness = Math.round(Math.max(0, Math.min(1, c.roundness)) * 100) / 100;
    edges.update({ id: selectedEdge, smooth: smoothFor(c) });
    updateEdgeTools();
    saveDraft();
}

function wireEditMode() {
    document.body.classList.add('editing');
    document.getElementById('edit-bar').hidden = false;

    const showPosition = params => {
        if (!params.nodes.length) return;
        const id = params.nodes[0];
        const p = network.getPositions([id])[id];
        setStatus(id + ': (' + Math.round(p.x) + ', ' + Math.round(p.y) + ')');
    };
    network.on('dragging', showPosition);
    network.on('dragEnd', params => {
        if (!params.nodes.length) return;
        showPosition(params);   // the last 'dragging' event can lag the drop
        saveDraft();
    });

    document.getElementById('copy-btn').addEventListener('click', async () => {
        const json = JSON.stringify(exportCLD(), null, 2);
        try {
            await navigator.clipboard.writeText(json);
            setStatus('Copied. Paste it into ' + DATA_FILE + '.');
        } catch (err) {
            elDetails().innerHTML = '<p>Clipboard write failed. Copy the JSON below into ' + DATA_FILE + ':</p>' +
                '<textarea style="width:100%;height:80px;font-family:monospace;font-size:12px;">' + escapeHTML(json) + '</textarea>';
        }
    });
    document.getElementById('download-btn').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(exportCLD(), null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = DATA_FILE;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
        setStatus('Downloaded ' + DATA_FILE + '.');
    });
    document.getElementById('reset-btn').addEventListener('click', () => {
        try { localStorage.removeItem(DRAFT_KEY); } catch (err) { /* storage unavailable */ }
        window.location.reload();
    });
    document.getElementById('flip-btn').addEventListener('click', () => changeCurve(c => {
        if (c.type === 'straight') { c.type = DEFAULT_CURVE.type; c.roundness = DEFAULT_CURVE.roundness; }
        else c.type = c.type === 'curvedCW' ? 'curvedCCW' : 'curvedCW';
    }));
    document.getElementById('less-btn').addEventListener('click', () => changeCurve(c => {
        if (c.type !== 'straight') c.roundness -= 0.05;
    }));
    document.getElementById('more-btn').addEventListener('click', () => changeCurve(c => {
        if (c.type === 'straight') { c.type = DEFAULT_CURVE.type; c.roundness = 0.05; } else c.roundness += 0.05;
    }));
    document.getElementById('straight-btn').addEventListener('click', () => changeCurve(c => { c.type = 'straight'; }));
    const stepLoop = d => {
        selectedEdge = null;
        updateEdgeTools();
        showLoop((shownLoop + d + cld.loops.length) % cld.loops.length);
    };
    document.getElementById('prev-edit-btn').addEventListener('click', () => stepLoop(-1));
    document.getElementById('next-edit-btn').addEventListener('click', () => stepLoop(1));
}

// ---------------------------------------------------------------------------
// Start up
// ---------------------------------------------------------------------------
function start(data, restoredDraft) {
    cld = data;
    buildSteps();
    const container = document.getElementById('network');
    nodes = new vis.DataSet(buildNodes());
    edges = new vis.DataSet(buildEdges());
    network = new vis.Network(container, { nodes: nodes, edges: edges }, {
        physics: { enabled: false },
        layout: { improvedLayout: false },
        interaction: {
            dragNodes: EDIT,          // learners cannot move nodes; edit mode can
            dragView: true,
            zoomView: false,          // zoom by buttons only; the wheel scrolls the page
            hover: true,
            selectConnectedEdges: false,
            tooltipDelay: 200
        },
        nodes: { shadow: { enabled: true, size: 4, x: 1, y: 1 } }
    });

    // Overlays go in after init: vis-network clears its container.
    const over = document.createElement('div');
    over.className = 'loop-overlay';
    over.id = 'loop-overlay';
    container.appendChild(over);
    const legend = document.createElement('div');
    legend.className = 'legend-overlay';
    legend.innerHTML = '<span class="pos">+</span> same direction &nbsp; <span class="neg">−</span> opposite direction &nbsp; ? not labeled yet';
    container.appendChild(legend);
    const ill = document.createElement('div');
    ill.className = 'illustrative-overlay';
    ill.textContent = 'Simplified causal model: directions only, no sizes.';
    container.appendChild(ill);

    const zoomBy = f => network.moveTo({ scale: network.getScale() * f, animation: false });
    document.getElementById('zoom-in').addEventListener('click', () => zoomBy(1.2));
    document.getElementById('zoom-out').addEventListener('click', () => zoomBy(1 / 1.2));
    document.getElementById('zoom-reset').addEventListener('click', fitLoop);

    document.querySelectorAll('.choice').forEach(btn => btn.addEventListener('click', () => choose(btn.dataset.value)));
    document.getElementById('submit-btn').addEventListener('click', submit);
    document.getElementById('next-btn').addEventListener('click', next);
    document.getElementById('again-btn').addEventListener('click', resetAll);
    document.addEventListener('keydown', e => {
        if (e.target && e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
        const s = step();
        if (!s) return;
        if (s.kind === 'link') {
            if (e.key === '+' || e.key === 's' || e.key === 'S') choose('positive');
            else if (e.key === '-' || e.key === 'o' || e.key === 'O') choose('negative');
        } else if (s.kind === 'loop') {
            if (e.key === 'r' || e.key === 'R') choose('reinforcing');
            else if (e.key === 'b' || e.key === 'B') choose('balancing');
        } else if (e.key === '1' || e.key === '2' || e.key === '3') {
            choose(Number(e.key) - 1);
        }
        if (e.key === 'Enter') { if (isAnswered(cur)) next(); else submit(); }
    });

    network.on('click', params => {
        selectedEdge = null;
        if (params.edges.length && !params.nodes.length) selectedEdge = params.edges[0];
        if (EDIT) updateEdgeTools();
    });

    resetAll();

    if (EDIT) {
        wireEditMode();
        setStatus(restoredDraft ? 'Restored the unsaved layout from this browser. Reset Layout discards it.' :
            'Drag boxes and R/B markers. Click an edge (or its sign) to change its curve.');
    }

    // Fit whenever the container size changes (iframe resize, window resize).
    let lastW = 0;
    let lastH = 0;
    new ResizeObserver(entries => {
        const r = entries[0].contentRect;
        if (r.width <= 0 || r.height <= 0 || (r.width === lastW && r.height === lastH)) return;
        lastW = r.width;
        lastH = r.height;
        network.setSize(r.width + 'px', r.height + 'px');
        fitLoop();
    }).observe(container);
}

document.addEventListener('DOMContentLoaded', () => {
    fetch(DATA_FILE)
        .then(response => {
            if (!response.ok) throw new Error(DATA_FILE + ' returned ' + response.status);
            return response.json();
        })
        .then(data => {
            const draft = EDIT ? loadDraft() : null;
            if (draft) applyDraftLayout(data, draft);
            start(data, Boolean(draft));
        })
        .catch(err => {
            document.getElementById('details').innerHTML = '<p>Could not load the diagram: ' + escapeHTML(err.message) +
                '. Open this page through a web server (for example mkdocs serve), not as a local file.</p>';
        });
});
