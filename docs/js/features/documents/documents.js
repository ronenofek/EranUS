// ── Documents Renderer (flip cards) ──────────────────────────────────────
const Docs = {
  _palette: [
    { bg: '#FFF0D0', l1: '#F0A830', l2: '#D48C20', bud: '#FFD060' },
    { bg: '#D0F0E8', l1: '#30B890', l2: '#1A9070', bud: null,      back: '#6FB3E8' },
    { bg: '#E4EDD8', l1: '#8AAE60', l2: '#6A9040', bud: '#B0CC80' },
    { bg: '#F5E0D8', l1: '#D0704A', l2: '#B85830', bud: '#F09070' },
    { bg: '#E8F5D0', l1: '#90CC40', l2: '#72A828', bud: '#C0E850' },
  ],

  _plant(c) {
    const bud = c.bud ? `<circle cx="41" cy="30" r="5" fill="${c.bud}" opacity=".6"/>` : '';
    return `<svg width="70" height="70" viewBox="0 0 82 82" fill="none">
      <circle cx="41" cy="41" r="30" fill="${c.bg}"/>
      <path d="M41 66V34" stroke="#C4956A" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M41 46 C41 46 28 38 27 24 C35 21 44 31 41 46Z" fill="${c.l1}"/>
      <path d="M41 55 C41 55 54 47 55 33 C47 30 38 40 41 55Z" fill="${c.l2}"/>
      ${bud}
      <ellipse cx="41" cy="68" rx="9" ry="2.5" fill="#C4956A" opacity=".2"/>
    </svg>`;
  },

  async render(opts) {
    const docs = await Storage.getDocs(opts);
    document.getElementById('docsGrid').innerHTML = docs.map((d, idx) => {
      const c         = Docs._palette[idx % Docs._palette.length];
      const safeTitle = Helpers.escHtml(d.title);
      const pinned    = d.pinned || false;
      const isMadrich = d.id === 'doc_default_6' || (d.title && d.title.includes('מדריך למתנדב'));
      const backContent = isMadrich
        ? `<div class="flip-back-body" style="font-size:10px;margin-bottom:10px">בחר כיצד לפתוח</div>
            <a class="flip-btn" href="madrich-mitnadev.html" target="_blank"
               onclick="event.stopPropagation()" style="text-decoration:none;margin-bottom:7px;font-size:11px">
              &#127919; מדריך אינטראקטיבי &#8599;
            </a>
            <button class="flip-btn" style="font-size:11px"
              onclick="event.stopPropagation();PdfViewer.openDoc('${safeTitle}')">
              &#128196; מסמך PDF
            </button>`
        : `<div class="flip-back-body">לחץ לצפייה במסמך</div>
            <button class="flip-btn" onclick="event.stopPropagation();PdfViewer.openDoc('${safeTitle}')">פתח &#8592;</button>`;
      return `
      <div class="flip-card flip-card-sm${pinned ? ' pinned-card' : ''}" id="doc-${Helpers.escHtml(d.id || d.title)}">
        ${pinned ? '<span class="pinned-badge">&#128204; נעוץ</span>' : ''}
        <div class="flip-card-inner">
          <div class="flip-front">
            <div class="flip-plant">${Docs._plant(c)}</div>
            <div class="flip-title">${safeTitle}</div>
          </div>
          <div class="flip-back">
            ${backContent}
          </div>
        </div>
      </div>`;
    }).join('');
  },
};

// ── Backwards-compatible global shim ───────────────────────────────────
function renderDocs() { Docs.render(); }
