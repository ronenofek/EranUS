// ── External Links Renderer (flip cards) ─────────────────────────────────
const Links = {
  _palette: [
    { bg: '#FFF0D0', back: '#1E4D30' },
    { bg: '#D0F0E8', back: '#235A38' },
    { bg: '#E4EDD8', back: '#2E5820' },
    { bg: '#F5E0D8', back: '#4A2C10' },
    { bg: '#E8F5D0', back: '#1E4828' },
  ],

  _linkIcon(c, emoji) {
    const em = emoji || '🔗';
    return `<svg width="70" height="70" viewBox="0 0 82 82" fill="none">
      <circle cx="41" cy="41" r="30" fill="${c.bg}"/>
      <text x="41" y="48" font-size="26" text-anchor="middle" dominant-baseline="middle">${em}</text>
    </svg>`;
  },

  _calIcon(c) {
    return `<svg width="70" height="70" viewBox="0 0 82 82" fill="none">
      <circle cx="41" cy="41" r="30" fill="${c.bg}"/>
      <rect x="18" y="24" width="46" height="36" rx="7" fill="rgba(255,255,255,.85)" stroke="#B8845A" stroke-width="1.5"/>
      <path d="M18 33h46" stroke="#B8845A" stroke-width="1.5"/>
      <path d="M30 20v8M52 20v8" stroke="#8B6040" stroke-width="2" stroke-linecap="round"/>
      <circle cx="41" cy="47" r="5" fill="#2E6B44"/>
      <circle cx="41" cy="47" r="2" fill="rgba(255,255,255,.7)"/>
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
              <div class="flip-plant">${Links._linkIcon(c, l.icon)}</div>
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
              <div class="flip-plant">${Links._calIcon(calC)}</div>
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
