// ── External Links Renderer ──────────────────────────────────────────────
const Links = {
  async render() {
    const links = await Storage.getLinks();

    // Sidebar (desktop)
    const sidebar = document.getElementById('externalLinksList');
    if (sidebar) {
      sidebar.innerHTML = links.map(l => `
        <a class="nav-item ext-link" href="${Helpers.escHtml(l.url)}" target="_blank" rel="noopener">
          <span class="nav-icon">${l.icon || '🔗'}</span> ${Helpers.escHtml(l.title)}
        </a>`).join('');
    }

    // Links view (mobile tab)
    const view = document.getElementById('linksViewList');
    if (view) {
      view.innerHTML = links.map(l => `
        <a class="links-view-item" href="${Helpers.escHtml(l.url)}" target="_blank" rel="noopener">
          <span class="lvi-icon">${l.icon || '🔗'}</span>
          <span class="lvi-title">${Helpers.escHtml(l.title)}</span>
          <span class="lvi-arrow">↗</span>
        </a>`).join('');
    }
  },
};
