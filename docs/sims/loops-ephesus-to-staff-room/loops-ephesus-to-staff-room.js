// Reinforcing or Balancing? Loops From Ephesus to the Staff Room - vis-network
// CANVAS_HEIGHT: 560
/*
 * Bloom: Analyze (differentiate). Six illustrative causal loops, two from
 * Paul's world and four from school change, appear one at a time. For each,
 * the learner counts the minus signs around the loop, selects Reinforcing or
 * Balancing, and submits. Only the first answer is scored; a wrong first
 * answer earns a hint and one more try, after which the answer is shown.
 * Mastery is 5 of 6 on the first attempt.
 *
 * The loops are read from loops-ephesus-to-staff-room-cld.json (the CLD JSON
 * schema used by the cld-viewer, with one extra "loop" field on each node so
 * that one file holds all six loops). Nodes are locked for learners. Add
 * ?edit=true to the URL to drag nodes and loop markers, reshape edges, step
 * through the loops with the arrow buttons, and export the updated JSON.
 */

const DATA_FILE = 'loops-ephesus-to-staff-room-cld.json';
const EDIT = new URLSearchParams(window.location.search).get('edit') === 'true';
const DRAFT_KEY = 'loops-ephesus-to-staff-room-cld-draft';

const COLORS = {
    variable: { background: '#ffffff', border: '#1e40af', highlight: { background: '#dbeafe', border: '#1e3a8a' },
        hover: { background: '#eff6ff', border: '#1e3a8a' } },
    positive: '#15803d',
    negative: '#b91c1c',
    reinforcing: '#b91c1c',
    balancing: '#15803d',
    unknown: '#64748b'
};
const DEFAULT_CURVE = { type: 'curvedCW', roundness: 0.15 };
const TYPE_NAME = { reinforcing: 'Reinforcing', balancing: 'Balancing' };
const MASTERY = 5;
const QUESTION = 'Is this loop reinforcing or balancing?';
const HINT = 'Not quite. Count every minus sign around the whole loop, then check: even or odd?';

let cld = null;
let network = null;
let nodes = null;
let edges = null;
let selectedEdge = null;
const curves = {};   // edge id -> {type, roundness}; edited in edit mode

// Learner state
let current = 0;     // index into cld.loops
let choice = null;   // 'reinforcing' | 'balancing' | null
let rec = [];        // per loop: { attempts, first, firstOk, resolved }
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

// A DOM tooltip (not a string) so vis-network lets the text wrap.
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

const loopNodeIds = loop => loop.path.slice(0, -1);
const revealed = i => EDIT || (rec[i] && rec[i].resolved);

// ---------------------------------------------------------------------------
// Build the vis-network data
// ---------------------------------------------------------------------------
function markerStyle(loop, show) {
    const color = show ? COLORS[loop.type] : COLORS.unknown;
    return {
        label: show ? (loop.type === 'reinforcing' ? 'R' : 'B') : '?',
        color: { background: color, border: '#111827', highlight: { background: color, border: '#facc15' },
            hover: { background: color, border: '#111827' } },
        title: makeTooltip(show ? loop.label + '. ' + TYPE_NAME[loop.type] + ': ' + loop.description
                                : 'The loop marker shows R or B once the loop is answered.')
    };
}

function buildNodes() {
    const list = cld.nodes.map(n => ({
        id: n.id,
        label: wrapText(n.label, 16),
        x: n.position.x,
        y: n.position.y,
        shape: 'box',
        margin: 9,
        borderWidth: 2,
        color: COLORS.variable,
        font: { size: 17, face: 'Arial', color: '#1f2937' },
        title: makeTooltip(n.description),
        hidden: true
    }));
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

// A space either side widens the white box behind the sign, so the edge
// line cannot hide a thin minus sign.
function edgeLabel(e, minusIndex, show) {
    if (e.polarity === 'positive') return ' + ';
    return show ? ' −' + minusIndex + ' ' : ' − ';
}

function buildEdges() {
    return cld.edges.map(e => {
        const color = COLORS[e.polarity];
        curves[e.id] = Object.assign({}, DEFAULT_CURVE, e.curve || {});
        return {
            id: e.id,
            from: e.source,
            to: e.target,
            label: e.polarity === 'positive' ? ' + ' : ' − ',
            color: { color: color, highlight: color, hover: color },
            width: 3,
            arrows: { to: { enabled: true, scaleFactor: 0.9 } },
            smooth: smoothFor(curves[e.id]),
            font: { size: 30, face: 'Arial', color: color, strokeWidth: 0, background: '#ffffff', bold: true, vadjust: 0 },
            title: makeTooltip(nodeLabel(e.source) + ' → ' + nodeLabel(e.target) + ' (' +
                (e.polarity === 'positive' ? '+' : '−') + '): ' + e.description),
            hidden: true
        };
    });
}

// ---------------------------------------------------------------------------
// Showing one loop
// ---------------------------------------------------------------------------
function showLoop(i) {
    current = i;
    const loop = cld.loops[i];
    const show = new Set(loopNodeIds(loop).concat(['loop_' + loop.id]));
    nodes.update(nodes.getIds().map(id => ({ id: id, hidden: !show.has(id) })));
    refreshLoopMarks();
    document.getElementById('loop-overlay').innerHTML =
        '<b>Loop ' + (i + 1) + ' of ' + cld.loops.length + '</b>' +
        '<span class="setting ' + escapeHTML(loop.setting) + '">' + escapeHTML(loop.setting) + '</span>';
    fitLoop();
}

// Edge visibility and labels for the current loop; once answered, the minus
// signs are numbered so the count is visible.
function refreshLoopMarks() {
    const loop = cld.loops[current];
    const inLoop = new Set(loopEdges(loop).map(e => e.id));
    const show = revealed(current);
    let k = 0;
    const counts = {};
    loopEdges(loop).forEach(e => { if (e.polarity === 'negative') counts[e.id] = ++k; });
    edges.update(cld.edges.map(e => ({
        id: e.id,
        hidden: !inLoop.has(e.id),
        label: edgeLabel(e, counts[e.id], show && !EDIT)
    })));
    nodes.update(Object.assign({ id: 'loop_' + loop.id }, markerStyle(loop, show)));
}

function fitLoop() {
    const loop = cld.loops[current];
    network.fit({ nodes: loopNodeIds(loop), animation: false });
    const scale = Math.min(network.getScale() * 0.88, 1.25);
    const view = network.getViewPosition();
    network.moveTo({ scale: scale, position: { x: view.x, y: view.y - 6 / scale }, animation: false });
}

// ---------------------------------------------------------------------------
// Answering
// ---------------------------------------------------------------------------
const elDetails = () => document.getElementById('details');

function resetSet() {
    rec = cld.loops.map(() => ({ attempts: 0, first: null, firstOk: false, resolved: false, second: null }));
    choice = null;
    showingSummary = false;
    document.getElementById('summary').hidden = true;
    showLoop(0);
    render();
}

function score() { return rec.filter(r => r.firstOk).length; }

function choose(type) {
    const r = rec[current];
    if (r.resolved || showingSummary) return;
    choice = type;
    render();
}

function submit() {
    const r = rec[current];
    if (!choice || r.resolved || showingSummary) return;
    const loop = cld.loops[current];
    const ok = choice === loop.type;
    r.attempts++;
    if (r.attempts === 1) {
        r.first = choice;
        r.firstOk = ok;
        if (ok) r.resolved = true;
    } else {
        r.second = choice;
        r.resolved = true;
    }
    if (!r.resolved) choice = null;
    refreshLoopMarks();
    render();
}

function nextLoop() {
    if (!rec[current].resolved) return;
    if (current < cld.loops.length - 1) {
        choice = null;
        showLoop(current + 1);
        render();
    } else {
        showSummary();
    }
}

function render() {
    const r = rec[current];
    const loop = cld.loops[current];
    document.getElementById('score').textContent = 'First-try correct: ' + score() + ' of ' + cld.loops.length;

    const locked = r.resolved || showingSummary;
    document.querySelectorAll('.choice').forEach(btn => {
        btn.disabled = locked;
        btn.setAttribute('aria-pressed', String(!locked && choice === btn.dataset.type));
    });
    document.getElementById('submit-btn').disabled = locked || !choice;
    document.getElementById('submit-btn').textContent = r.attempts === 1 && !r.resolved ? 'Submit again' : 'Submit';
    const next = document.getElementById('next-btn');
    next.disabled = !r.resolved || showingSummary;
    next.textContent = current < cld.loops.length - 1 ? 'Next loop' : 'See summary';

    if (showingSummary) return;
    const n = loop.minus_signs;
    const countLine = '<span class="hint">' + n + ' minus sign' + (n === 1 ? '' : 's') + ' (' +
        (n % 2 === 0 ? 'even' : 'odd') + ').</span> ';
    let h;
    if (!r.resolved && r.attempts === 0) {
        h = '<div class="q">' + escapeHTML(QUESTION) + '</div>' +
            '<div class="hint">Hover over an arrow to read what the link means. Select a type, then press Submit.</div>';
    } else if (!r.resolved) {
        h = '<div class="bad">' + escapeHTML(HINT) + '</div>' +
            '<div class="hint">Choose again. A second answer does not change the score.</div>';
    } else if (r.attempts === 1) {
        h = '<div><span class="good">Correct: ' + TYPE_NAME[loop.type] + '.</span> ' + escapeHTML(loop.description) + '</div>' +
            '<div>' + countLine + escapeHTML(loop.behavior_pattern) + '</div>';
    } else {
        const lead = r.second === loop.type ? 'Correct on the second try: ' : 'The answer is ';
        h = '<div><span class="shown">' + lead + TYPE_NAME[loop.type] + '.</span> ' + escapeHTML(loop.description) +
            ' <span class="hint">This loop counts as missed.</span></div>' +
            '<div>' + countLine + escapeHTML(loop.behavior_pattern) + '</div>';
    }
    elDetails().innerHTML = h;
}

function showSummary() {
    showingSummary = true;
    const s = score();
    let rows = '';
    cld.loops.forEach((loop, i) => {
        const r = rec[i];
        const t = loop.type === 'reinforcing' ? 'R' : 'B';
        rows += '<tr><td class="n">' + (i + 1) + '</td><td>' + escapeHTML(loop.setting) + '</td><td>' +
            escapeHTML(loop.label.replace(/^Loop \d+: /, '')) + '</td><td class="n">' + loop.minus_signs +
            '</td><td class="' + t + '">' + TYPE_NAME[loop.type] + '</td><td class="n">' +
            (r.firstOk ? '✓' : '✗') + '</td></tr>';
    });
    const el = document.getElementById('summary');
    el.innerHTML = '<h2>First-try correct: ' + s + ' of 6</h2>' +
        '<div class="final ' + (s >= MASTERY ? 'good' : 'bad') + '">' +
        (s >= MASTERY ? 'You can read a loop, in Ephesus or in a staff room.'
                      : 'Review the counting rule and try the six loops again.') + '</div>' +
        '<table><thead><tr><th>#</th><th>Setting</th><th>Loop</th><th>Minus signs</th><th>Type</th><th>First try</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table>';
    el.hidden = false;
    elDetails().innerHTML =
        '<div class="notice">Four loops are reinforcing and two balancing. Two harmful loops, 3 and 6, are ' +
        '<b>reinforcing</b>: reinforcing means self-feeding, not good. The Ephesus loop (4) has the same structure ' +
        'as the school rollout loop (2): growth provokes pushback that holds it back.</div>';
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
    // In edit mode every loop can be reached directly
    const step = d => { selectedEdge = null; updateEdgeTools(); showLoop((current + d + cld.loops.length) % cld.loops.length); render(); };
    document.getElementById('prev-edit-btn').addEventListener('click', () => step(-1));
    document.getElementById('next-edit-btn').addEventListener('click', () => step(1));
}

// ---------------------------------------------------------------------------
// Start up
// ---------------------------------------------------------------------------
function start(data, restoredDraft) {
    cld = data;
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
    legend.innerHTML = '<span class="pos">+</span> same direction &nbsp; <span class="neg">−</span> opposite direction';
    container.appendChild(legend);
    const ill = document.createElement('div');
    ill.className = 'illustrative-overlay';
    ill.textContent = 'Illustrative loops';
    container.appendChild(ill);

    const zoomBy = f => network.moveTo({ scale: network.getScale() * f, animation: false });
    document.getElementById('zoom-in').addEventListener('click', () => zoomBy(1.2));
    document.getElementById('zoom-out').addEventListener('click', () => zoomBy(1 / 1.2));
    document.getElementById('zoom-reset').addEventListener('click', fitLoop);

    document.querySelectorAll('.choice').forEach(btn => btn.addEventListener('click', () => choose(btn.dataset.type)));
    document.getElementById('submit-btn').addEventListener('click', submit);
    document.getElementById('next-btn').addEventListener('click', nextLoop);
    document.getElementById('again-btn').addEventListener('click', resetSet);
    document.addEventListener('keydown', e => {
        if (e.target && e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
        if (e.key === 'r' || e.key === 'R') choose('reinforcing');
        else if (e.key === 'b' || e.key === 'B') choose('balancing');
        else if (e.key === 'Enter') { if (rec[current].resolved) nextLoop(); else submit(); }
    });

    network.on('click', params => {
        selectedEdge = null;
        if (params.edges.length && !params.nodes.length) {
            selectedEdge = params.edges[0];
            const e = cld.edges.find(edge => edge.id === selectedEdge);
            if (!EDIT && !showingSummary) {
                const sign = e.polarity === 'positive' ? '+' : '−';
                document.getElementById('edge-note') && document.getElementById('edge-note').remove();
                const note = document.createElement('div');
                note.id = 'edge-note';
                note.className = 'hint';
                note.textContent = nodeLabel(e.source) + ' → ' + nodeLabel(e.target) + ' (' + sign + '): ' + e.description;
                elDetails().appendChild(note);
            }
        }
        if (EDIT) updateEdgeTools();
    });

    resetSet();

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
