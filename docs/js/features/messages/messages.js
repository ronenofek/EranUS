// ── Messages Renderer (bento cards) ────────────────────────────────────
const Messages = {
  async render() {
    const msgs      = await Storage.getMessages();
    const container = document.getElementById('messagesList');

    // keep hidden badge elements in sync (for compat)
    const badge = document.getElementById('msgBadge');
    if (badge) badge.textContent = msgs.length;

    container.innerHTML = msgs.map(m => {
      const pinned    = m.headerClass === 'pinned' || m.pinned;
      const bodyHtml  = m.isDefault ? m.bodyHtml : Messages.renderCustomBody(m);

      return `
      <div class="msg-bento-card${pinned ? ' pinned' : ''}" id="msg-${m.id}"
           onclick="Messages.toggle('${m.id}')">
        ${pinned ? `<span class="msg-bento-pin">📌 נעוץ</span>` : ''}
        <div class="msg-bento-top">
          <div class="msg-bento-subject">${Helpers.escHtml(m.title)}</div>
          <div class="msg-bento-date">${Messages.formatDate(m.createdAt)}</div>
        </div>
        <div class="msg-bento-preview">${Messages.textPreview(m)}</div>
        <div class="msg-bento-full">${bodyHtml}</div>
      </div>`;
    }).join('');
  },

  toggle(id) {
    const card = document.getElementById('msg-' + id);
    if (card) card.classList.toggle('expanded');
  },

  // plain-text preview from body (strip HTML tags)
  textPreview(m) {
    if (m.isDefault) {
      const tmp = document.createElement('div');
      tmp.innerHTML = m.bodyHtml || '';
      return Helpers.escHtml(tmp.textContent.trim().slice(0, 120));
    }
    return Helpers.escHtml((m.body || '').slice(0, 120));
  },

  formatDate(ts) {
    if (!ts) return '';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
    } catch(e) { return ''; }
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
