// ── External Links Renderer (flip cards) ─────────────────────────────────
const Links = {
  _palette: [
    { bg: '#FFF0D0', l1: '#F0A830', l2: '#D48C20', bud: '#FFD060', back: '#1E4D30' },
    { bg: '#D0F0E8', l1: '#30B890', l2: '#1A9070', bud: null,      back: '#235A38' },
    { bg: '#E4EDD8', l1: '#8AAE60', l2: '#6A9040', bud: '#B0CC80', back: '#2E5820' },
    { bg: '#F5E0D8', l1: '#D0704A', l2: '#B85830', bud: '#F09070', back: '#4A2C10' },
    { bg: '#E8F5D0', l1: '#90CC40', l2: '#72A828', bud: '#C0E850', back: '#1E4828' },
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
    const links = await Storage.getLinks(opts);

    const grid = document.getElementById('linksGrid');
    if (grid) {
      const linkCards = links.map((l, idx) => {
        const c = Links._palette[idx % Links._palette.length];
        const safeUrl   = Helpers.escHtml(l.url);
        const safeTitle = Helpers.escHtml(l.title);
        return `
        <div class="flip-card flip-card-sm">
          <div class="flip-card-inner">
            <div class="flip-front">
              <div class="flip-plant">${Links._plant(c)}</div>
              <div class="flip-title">${safeTitle}</div>
            </div>
            <div class="flip-back" style="background:${c.back}">
              <div class="flip-back-body">פתח קישור חיצוני</div>
              <a class="flip-btn" href="${safeUrl}" target="_blank" rel="noopener"
                 onclick="event.stopPropagation()" style="text-decoration:none">פתח ↗</a>
            </div>
          </div>
        </div>`;
      }).join('');

      // Calendar card — always last
      const calIdx = links.length;
      const calC   = Links._palette[calIdx % Links._palette.length];
      const calCard = `
        <div class="flip-card flip-card-sm" onclick="App.openCalendar()">
          <div class="flip-card-inner">
            <div class="flip-front">
              <div class="flip-plant">${Links._plant(calC)}</div>
              <div class="flip-title">לוח שנה</div>
            </div>
            <div class="flip-back" style="background:${calC.back}">
              <div class="flip-back-body">פתח לוח שנה</div>
              <button class="flip-btn" onclick="event.stopPropagation();App.openCalendar()">פתח ←</button>
            </div>
          </div>
        </div>`;

      grid.innerHTML = linkCards + calCard;
    }

    // Legacy sidebar (hidden in current layout — kept for compat)
    const sidebar = document.getElementById('externalLinksList');
    if (sidebar) {
      sidebar.innerHTML = links.map(l => `
        <a class="nav-item ext-link" href="${Helpers.escHtml(l.url)}" target="_blank" rel="noopener">
          <span class="nav-icon">${l.icon || '🔗'}</span> ${Helpers.escHtml(l.title)}
        </a>`).join('');
    }
  },
};
