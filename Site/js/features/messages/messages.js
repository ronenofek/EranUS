// ── Messages Renderer ───────────────────────────────────────────────────
const Messages = {
  render() {
    const st   = Storage.loadState();
    const msgs = Storage.getMessages(st);
    const container = document.getElementById('messagesList');
    document.getElementById('msgBadge').textContent = msgs.length;

    container.innerHTML = msgs.map(m => `
      <article class="msg-card">
        ${isAdmin ? `<button class="admin-delete-btn" onclick="AdminPanel.confirmDelete('msg','${m.id}','${Helpers.escHtml(m.title)}')">🗑</button>` : ''}
        <div class="msg-header ${m.headerClass || ''}">
          <div class="msg-icon">${m.icon || '📢'}</div>
          <div>
            <span class="msg-tag">${Helpers.escHtml(m.tag || 'הודעה')}</span>
            <div class="msg-title">${Helpers.escHtml(m.title)}</div>
          </div>
        </div>
        <div class="msg-body">
          ${m.isDefault ? m.bodyHtml : Messages.renderCustomBody(m)}
        </div>
      </article>`).join('');
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
function renderMessages()      { Messages.render(); }
function renderCustomMsgBody(m) { return Messages.renderCustomBody(m); }
