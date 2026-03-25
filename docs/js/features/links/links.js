// ── External Links Renderer (bento cards) ───────────────────────────────
const Links = {
  async render(opts) {
    const links = await Storage.getLinks(opts);

    // Main links grid (new single-page layout)
    const grid = document.getElementById('linksGrid');
    if (grid) {
      const linkCards = links.map(l => `
        <a class="link-bento-card" href="${Helpers.escHtml(l.url)}" target="_blank" rel="noopener">
          <div class="link-bento-ico">${l.icon || '🔗'}</div>
          <div class="link-bento-info">
            <div class="link-bento-name">${Helpers.escHtml(l.title)}</div>
            <div class="link-bento-cta">↗ פתח קישור</div>
          </div>
        </a>`).join('');

      // Calendar card always last
      const calCard = `
        <div class="link-bento-card" onclick="App.openCalendar()" style="cursor:pointer;">
          <div class="link-bento-ico">📅</div>
          <div class="link-bento-info">
            <div class="link-bento-name">לוח שנה</div>
            <div class="link-bento-cta">← פתח לוח שנה</div>
          </div>
        </div>`;

      grid.innerHTML = linkCards + calCard;
    }

    // Legacy sidebar (kept for any old references — hidden in new layout)
    const sidebar = document.getElementById('externalLinksList');
    if (sidebar) {
      sidebar.innerHTML = links.map(l => `
        <a class="nav-item ext-link" href="${Helpers.escHtml(l.url)}" target="_blank" rel="noopener">
          <span class="nav-icon">${l.icon || '🔗'}</span> ${Helpers.escHtml(l.title)}
        </a>`).join('');
    }
  },
};
