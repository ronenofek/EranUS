// ── Documents Renderer ──────────────────────────────────────────────────
const Docs = {
  async render() {
    const docs = await Storage.getDocs();
    document.getElementById('docsGrid').innerHTML = docs.map(d => `
      <div class="doc-card" onclick="PdfViewer.openDoc('${Helpers.escHtml(d.title)}')">
        <div class="doc-info">
          <div class="doc-name">📄 ${Helpers.escHtml(d.title)}</div>
          <button class="doc-open-btn"><span>👁</span> פתח לצפייה</button>
        </div>
      </div>`).join('');
  },
};

// ── Backwards-compatible global shim ───────────────────────────────────
function renderDocs() { Docs.render(); }
