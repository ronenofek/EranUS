// ── Documents Renderer (bento cards) ────────────────────────────────────
const Docs = {
  async render() {
    const docs = await Storage.getDocs();
    document.getElementById('docsGrid').innerHTML = docs.map(d => `
      <div class="doc-bento-card" onclick="PdfViewer.openDoc('${Helpers.escHtml(d.title)}')">
        <div class="doc-bento-ico">📄</div>
        <div class="doc-bento-info">
          <div class="doc-bento-name">${Helpers.escHtml(d.title)}</div>
          <div class="doc-bento-cta">👁 פתח לצפייה</div>
        </div>
      </div>`).join('');
  },
};

// ── Backwards-compatible global shim ───────────────────────────────────
function renderDocs() { Docs.render(); }
