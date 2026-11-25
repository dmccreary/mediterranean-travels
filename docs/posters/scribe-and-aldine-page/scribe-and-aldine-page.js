// A Scribe's Page and an Aldine Page — extensions to the shared grid overlay engine
// CANVAS_HEIGHT: 826
//
// grid-diagram.js (loaded first) builds the image, the zones,
// the infobox, and the Explore / Quiz modes from data.json. This file adds:
//   - a small hover tooltip per zone (explore mode only, text from zone.tooltip)
//   - the clicked zone's color on the infobox
//   - keyboard access to the zones (Tab, then Enter or Space)
//   - the answer's explanation inside the quiz "Correct!" modal
//   - a clear notice when the generated image has not been saved yet
// It patches methods on the global `sim` instance before sim.init() runs at
// DOMContentLoaded, so the shared library itself stays unchanged.

(function () {
  const PROMPT = 'Hover over a zone to see its name. Click a zone to compare the two pages here.';

  // ── Hover tooltip ─────────────────────────────────────────────────────────
  const tip = document.createElement('div');
  tip.id = 'tile-tooltip';
  tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);

  function hideTip() { tip.classList.remove('show'); }

  function placeTip(clientX, clientY) {
    const pad = 8;
    const w = tip.offsetWidth, h = tip.offsetHeight;
    let x = clientX + 14, y = clientY + 18;
    if (x + w > window.innerWidth - pad) x = clientX - w - 14;
    if (y + h > window.innerHeight - pad) y = clientY - h - 12;
    tip.style.left = Math.max(pad, x) + 'px';
    tip.style.top  = Math.max(pad, y) + 'px';
  }

  document.addEventListener('pointermove', (e) => {
    // Touch has no hover: a tap goes straight to the infobox instead.
    if (e.pointerType === 'touch' || !sim.data || sim.editMode || sim.mode !== 'explore') {
      hideTip();
      return;
    }
    const zoneEl = e.target.closest ? e.target.closest('.grid-zone') : null;
    if (!zoneEl) { hideTip(); return; }
    const zone = sim.data.zones.find(z => z.id === zoneEl.dataset.id);
    if (!zone) { hideTip(); return; }
    const text = zone.tooltip || zone.label;
    if (tip.textContent !== text) tip.textContent = text;
    tip.style.setProperty('--tip-color', zone.color);
    tip.classList.add('show');
    placeTip(e.clientX, e.clientY);
  });
  document.documentElement.addEventListener('mouseleave', hideTip);
  window.addEventListener('blur', hideTip);

  // ── Keyboard access to the zones ───────────────────────────────────
  const origRender = sim._renderZones.bind(sim);
  sim._renderZones = function () {
    origRender();
    for (const zone of this.data.zones) {
      const el = this.zoneEls.get(zone.id);
      if (!el) continue;
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', zone.label + ' zone');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    }
  };

  // ── Infobox takes the clicked zone's color ──────────────────────────────
  const origDetail = sim._showZoneDetail.bind(sim);
  sim._showZoneDetail = function (id) {
    origDetail(id);
    const zone = this.data.zones.find(z => z.id === id);
    if (!zone || !this.panelEl) return;
    this.panelEl.style.borderLeftColor = zone.color;
    if (this.panelLabelEl) this.panelLabelEl.style.color = zone.color;
  };

  const origPrompt = sim._showPrompt.bind(sim);
  sim._showPrompt = function (text) {
    // The engine's built-in explore prompt does not mention hovering.
    origPrompt(text === 'Click on any column to learn about it.' ? PROMPT : text);
    if (this.panelEl) this.panelEl.style.borderLeftColor = '';
  };

  // ── Mode switching: the infobox is hidden in Quiz mode ────────────────────
  const origSetMode = sim.setMode.bind(sim);
  sim.setMode = function (mode) {
    hideTip();
    origSetMode(mode);
    if (this.panelEl) this.panelEl.style.display = (mode === 'quiz') ? 'none' : '';
  };

  // ── Show the explanation in the "Correct!" modal ──────────────────────────
  const origCorrect = sim._showCorrectModal.bind(sim);
  sim._showCorrectModal = function () {
    const q = this.quizQueue[this.quizIndex];
    const panel = this.correctModal && this.correctModal.querySelector('.correct-modal-panel');
    if (panel) {
      let explain = panel.querySelector('.correct-explain');
      if (!explain) {
        explain = document.createElement('div');
        explain.className = 'correct-explain';
        panel.insertBefore(explain, panel.querySelector('.correct-ok-btn'));
      }
      explain.textContent = (q && q.explanation) || '';
      explain.style.display = explain.textContent ? 'block' : 'none';
    }
    origCorrect();
  };

  // ── Notice when the generated image is missing ────────────────────────────
  // grid-diagram.js waits for the image to load before building the zones,
  // so without the image the page would otherwise sit blank.
  fetch('data.json')
    .then(r => r.json())
    .then(data => {
      const probe = new Image();
      probe.onerror = () => {
        const wrapper = document.getElementById('image-wrapper');
        if (!wrapper) return;
        const broken = wrapper.querySelector('img.grid-image');
        if (broken) broken.style.display = 'none';
        const note = document.createElement('div');
        note.id = 'missing-image';
        note.innerHTML = '<div>Image not found: <code>' + sim._escHtml(data.image) +
          '</code><br>Generate it from <code>image-prompt.md</code> and save it in this folder.</div>';
        wrapper.prepend(note);
      };
      probe.src = data.image;
    })
    .catch(() => { /* grid-diagram.js already reports a data.json failure */ });
})();
