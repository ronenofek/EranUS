// ── Documents Renderer ──────────────────────────────────────────────────
const Docs = {
  render() {
    const st   = Storage.loadState();
    const docs = Storage.getDocs(st);
    document.getElementById('docsGrid').innerHTML = docs.map(d => `
      <div class="doc-card" onclick="PdfViewer.openDoc('${Helpers.escHtml(d.title)}')">
        ${isAdmin ? `<button class="admin-delete-btn" onclick="event.stopPropagation();AdminPanel.confirmDelete('doc','${d.id}','${Helpers.escHtml(d.title)}')">🗑</button>` : ''}
        <div class="doc-preview">
          <div class="doc-preview-icon">📄</div>
          <span class="doc-badge">PDF</span>
        </div>
        <div class="doc-info">
          <div class="doc-name">${Helpers.escHtml(d.title)}</div>
          <button class="doc-open-btn"><span>👁</span> פתח לצפייה</button>
        </div>
      </div>`).join('');
  },
};

// ── Backwards-compatible global shim ───────────────────────────────────
function renderDocs() { Docs.render(); }
