// ── Search Modal ────────────────────────────────────────────────────────
const SearchModal = {
  open() {
    document.getElementById('searchModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('searchInput').focus(), 80);
  },

  close() {
    document.getElementById('searchModal').classList.remove('open');
    document.body.style.overflow = '';
  },

  closeOutside(e) {
    if (e.target.id === 'searchModal') SearchModal.close();
  },

  // ── Chat UI helpers ───────────────────────────────────────────────────
  _append(el) {
    const box = document.getElementById('chatMsgs');
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  },

  _userBubble(text) {
    const d = document.createElement('div');
    d.className = 'chat-bubble bubble-user';
    d.textContent = text;
    return d;
  },

  _loadingBubble() {
    const d = document.createElement('div');
    d.className = 'chat-loading';
    d.innerHTML = '<span>מחפש</span><div class="dot-pulse"><span></span><span></span><span></span></div>';
    return d;
  },

  _resultBubble(msgRes, docRes, kzRes, query) {
    const d = document.createElement('div');
    d.className = 'chat-bubble bubble-system';

    const total = msgRes.length + docRes.length + (kzRes ? kzRes.length : 0);
    if (total === 0 && kzRes !== null) {
      d.innerHTML = '<div class="chat-no-results">😕 לא נמצאו תוצאות. נסה מילות מפתח אחרות.</div>';
      return d;
    }

    let html = '';
    if (msgRes.length) {
      html += `<div class="chat-section">
        <div class="chat-section-title src-msgs">📢 הודעות (${msgRes.length})</div>`;
      msgRes.forEach(r => {
        html += `<div class="chat-result" onclick="App.showView('messages')">
          <div class="chat-result-title">${Helpers.escHtml(r.title)}</div>
          <div class="chat-result-snippet">${r.snip}</div>
        </div>`;
      });
      html += '</div>';
    }
    if (docRes.length) {
      html += `<div class="chat-section">
        <div class="chat-section-title src-docs">📄 מסמכים (${docRes.length})</div>`;
      docRes.forEach(r => {
        html += `<div class="chat-result" onclick="PdfViewer.openDoc('${Helpers.escHtml(r.title)}')">
          <div class="chat-result-title">${Helpers.escHtml(r.title)}</div>
          <div class="chat-result-snippet">${r.snip}</div>
        </div>`;
      });
      html += '</div>';
    }
    if (kzRes && kzRes.length) {
      html += `<div class="chat-section">
        <div class="chat-section-title src-kz">⚖️ כל זכות (${kzRes.length})</div>`;
      kzRes.forEach(r => {
        html += `<div class="chat-result">
          <div class="chat-result-title">${Helpers.escHtml(r.title)}</div>
          <div class="chat-result-snippet">${Helpers.escHtml(r.snip)}</div>
          <a class="chat-result-link" href="${r.url}" target="_blank" rel="noopener">פתח בכל זכות ↗</a>
        </div>`;
      });
      html += '</div>';
    }
    if (kzRes === null) {
      html += `<div class="chat-section">
        <div class="chat-section-title src-kz" style="color:var(--text-muted)">⚖️ כל זכות — לא נגיש כרגע</div>
      </div>`;
    }

    d.innerHTML = html || '<div class="chat-no-results">😕 לא נמצאו תוצאות. נסה מילות מפתח אחרות.</div>';
    return d;
  },

  // ── Main search handler ───────────────────────────────────────────────
  async doSearch() {
    const input = document.getElementById('searchInput');
    const query = (input.value || '').trim();
    if (!query) return;

    input.value = '';
    this._append(this._userBubble(query));

    const loader = this._loadingBubble();
    this._append(loader);

    await PdfExtractor.ensureCache();

    const msgRes = SearchEngine.searchInMessages(query);
    const docRes = SearchEngine.searchInDocs(query);
    const kzRes  = await KolZchutApi.search(query);

    loader.remove();
    this._append(this._resultBubble(msgRes, docRes, kzRes, query));
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function openSearchModal()        { SearchModal.open(); }
function closeSearchModal()       { SearchModal.close(); }
function closeSearchOutside(e)    { SearchModal.closeOutside(e); }
async function doSearch()         { return SearchModal.doSearch(); }
