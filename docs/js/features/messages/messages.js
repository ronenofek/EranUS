// ── Messages Renderer (flip cards) ──────────────────────────────────────
const Messages = {
  _cache: {},

  // Plant color palette — cycles across cards
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
    const msgs = await Storage.getMessages(opts);
    Messages._cache = {};
    msgs.forEach(m => { Messages._cache[m.id] = m; });

    const badge = document.getElementById('msgBadge');
    if (badge) badge.textContent = msgs.length;

    const container = document.getElementById('messagesList');
    container.innerHTML = msgs.map((m, idx) => {
      const c       = Messages._palette[idx % Messages._palette.length];
      const pinned  = m.headerClass === 'pinned' || m.pinned;
      const preview = Messages.textPreview(m);

      return `
      <div class="flip-card${pinned ? ' pinned-card' : ''}" id="msg-${m.id}">
        ${pinned ? '<span class="pinned-badge">📌 נעוץ</span>' : ''}
        <div class="flip-card-inner">
          <div class="flip-front">
            <div class="flip-plant">${Messages._plant(c)}</div>
            <div class="flip-title">${Helpers.escHtml(m.title)}</div>
          </div>
          <div class="flip-back" style="background:${c.back}">
            <div class="flip-back-body">${Helpers.escHtml(preview.slice(0, 90))}${preview.length > 90 ? '…' : ''}</div>
            <button class="flip-btn" onclick="event.stopPropagation();Messages.openModal('${m.id}')">פתח ←</button>
          </div>
        </div>
      </div>`;
    }).join('');
  },

  openModal(id) {
    const m = Messages._cache[id];
    if (!m) return;
    const bodyHtml = m.isDefault ? m.bodyHtml : Messages.renderCustomBody(m);
    document.getElementById('msgModalTitle').textContent = m.title;
    document.getElementById('msgModalBody').innerHTML = bodyHtml;
    document.getElementById('msgModal').classList.add('open');
  },

  toggle(id) {
    // kept for backwards compat — opens modal instead
    Messages.openModal(id);
  },

  textPreview(m) {
    if (m.isDefault) {
      const tmp = document.createElement('div');
      tmp.innerHTML = m.bodyHtml || '';
      return tmp.textContent.trim().slice(0, 120);
    }
    return (m.body || '').slice(0, 120);
  },

  renderCustomBody(m) {
    let html = `<p class="msg-text">${Helpers.escHtml(m.body).replace(/\n/g, '<br>')}</p>`;
    if (m.linkText && m.linkUrl) {
      html += `<div class="divider"></div><div class="msg-actions">
        <a class="btn btn-primary" href="${Helpers.escHtml(m.linkUrl)}" target="_blank" rel="noopener">🔗 ${Helpers.escHtml(m.linkText)}</a>
      </div>`;
    }
    return html;
  },

  formatDate(ts) {
    if (!ts) return '';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
    } catch(e) { return ''; }
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function renderMessages()       { Messages.render(); }
function renderCustomMsgBody(m) { return Messages.renderCustomBody(m); }
