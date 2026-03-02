// ── External Links Renderer ──────────────────────────────────────────────
const Links = {
  async render() {
    const links     = await Storage.getLinks();
    const container = document.getElementById('externalLinksList');
    if (!container) return;

    container.innerHTML = links.map(l => `
      <a class="nav-item ext-link" href="${Helpers.escHtml(l.url)}" target="_blank" rel="noopener">
        <span class="nav-icon">${l.icon || '🔗'}</span> ${Helpers.escHtml(l.title)}
      </a>`).join('');
  },
};
