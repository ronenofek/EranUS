// ── Documents Renderer (flip cards) ──────────────────────────────────────
const Docs = {
  _palette: [
    { bg: '#FFF0D0', back: '#1E4D30' },
    { bg: '#D0F0E8', back: '#235A38' },
    { bg: '#E4EDD8', back: '#2E5820' },
    { bg: '#F5E0D8', back: '#4A2C10' },
    { bg: '#E8F5D0', back: '#1E4828' },
  ],

  _icon(c) {
    return `<svg width="70" height="70" viewBox="0 0 82 82" fill="none">
      <circle cx="41" cy="41" r="30" fill="${c.bg}"/>
      <rect x="26" y="18" width="30" height="40" rx="6" fill="rgba(255,255,255,.85)" stroke="#B8845A" stroke-width="1.5"/>
      <path d="M33 30h16M33 37h16M33 44h10" stroke="#8B6040" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M41 54V44" stroke="#2E6B44" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M41 49 C41 49 35 47 33 42 C37 41 42 44 41 49Z" fill="#5DBE82" opacity=".9"/>
    </svg>`;
  },

  async render(opts) {
    const docs = await Storage.getDocs(opts);
    document.getElementById('docsGrid').innerHTML = docs.map((d, idx) => {
      const c = Docs._palette[idx % Docs._palette.length];
      const safeTitle = Helpers.escHtml(d.title);
      return `
      <div class="flip-card flip-card-sm" id="doc-${Helpers.escHtml(d.id || d.title)}">
        <div class="flip-card-inner">
          <div class="flip-front">
            <div class="flip-plant">${Docs._icon(c)}</div>
            <div class="flip-title">${safeTitle}</div>
          </div>
          <div class="flip-back" style="background:${c.back}">
            <div class="flip-back-body">לחץ לצפייה במסמך</div>
            <button class="flip-btn" onclick="event.stopPropagation();PdfViewer.openDoc('${safeTitle}')">פתח ←</button>
          </div>
        </div>
      </div>`;
    }).join('');
  },
};

// ── Backwards-compatible global shim ───────────────────────────────────
function renderDocs() { Docs.render(); }
