// ── Messages Renderer ───────────────────────────────────────────────────
const Messages = {
  async render() {
    const msgs      = await Storage.getMessages();
    const container = document.getElementById('messagesList');
    document.getElementById('msgBadge').textContent = msgs.length;

    container.innerHTML = msgs.map(m => `
      <article class="msg-card" id="msg-${m.id}">
        ${isAdmin ? `<button class="admin-delete-btn" onclick="event.stopPropagation();AdminPanel.confirmDelete('msg','${m.id}','${Helpers.escHtml(m.title)}')">🗑</button>` : ''}
        <div class="msg-header ${m.headerClass || ''}" onclick="Messages.toggle('${m.id}')">
          <div class="msg-icon">${m.icon || '📢'}</div>
          <div class="msg-header-text">
            <span class="msg-tag">${Helpers.escHtml(m.tag || 'הודעה')}</span>
            <div class="msg-title">${Helpers.escHtml(m.title)}</div>
          </div>
          <span class="msg-chevron">▼</span>
        </div>
        <div class="msg-body">
          ${m.isDefault ? m.bodyHtml : Messages.renderCustomBody(m)}
        </div>
      </article>`).join('');
  },

  toggle(id) {
    const card = document.getElementById('msg-' + id);
    if (card) card.classList.toggle('expanded');
  },

  renderCustomBody(m) {
    let html = `<p class="msg-text">${Helpers.escHtml(m.body).replace(/\n/g,'<br>')}</p>`;
    if (m.linkText && m.linkUrl) {
      html += `<div class="divider"></div><div class="msg-actions">
        <a class="btn btn-primary" href="${Helpers.escHtml(m.linkUrl)}" target="_blank" rel="noopener">🔗 ${Helpers.escHtml(m.linkText)}</a>
      </div>`;
    }
    return html;
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function renderMessages()       { Messages.render(); }
function renderCustomMsgBody(m) { return Messages.renderCustomBody(m); }
