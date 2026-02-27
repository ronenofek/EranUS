// ── Document Admin ──────────────────────────────────────────────────────
const DocAdmin = {
  _pendingB64: null,

  onFileChange(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      Toast.show('❌ ניתן להעלות קבצי PDF בלבד');
      input.value = '';
      this._pendingB64 = null;
      document.getElementById('docFileInfo').textContent = 'קבצי PDF בלבד. גודל מקסימלי מומלץ: 5MB';
      return;
    }
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    document.getElementById('docFileInfo').textContent = `נבחר: ${file.name} (${sizeMB} MB) — ממיר...`;

    const reader = new FileReader();
    reader.onload = e => {
      this._pendingB64 = e.target.result.split(',')[1]; // strip data:... prefix
      document.getElementById('docFileInfo').textContent = `✅ ${file.name} (${sizeMB} MB) — מוכן`;
      if (!document.getElementById('newDocTitle').value.trim()) {
        document.getElementById('newDocTitle').value = file.name.replace(/\.pdf$/i, '');
      }
    };
    reader.readAsDataURL(file);
  },

  addDoc() {
    const title = document.getElementById('newDocTitle').value.trim();
    if (!title)           { Toast.show('יש להזין שם מסמך'); return; }
    if (!this._pendingB64) { Toast.show('יש לבחור קובץ PDF'); return; }

    const st = Storage.loadState();
    st.customDocs.push({
      id: 'doc_custom_' + Date.now(), isDefault: false,
      title, b64: this._pendingB64
    });
    try {
      Storage.saveState(st);
    } catch(e) {
      Toast.show('❌ הנפח חרג ממגבלת האחסון. נסה קובץ קטן יותר.');
      return;
    }

    document.getElementById('newDocTitle').value = '';
    document.getElementById('newDocFile').value  = '';
    document.getElementById('docFileInfo').textContent = 'קבצי PDF בלבד. גודל מקסימלי מומלץ: 5MB';
    this._pendingB64 = null;

    Helpers.toggleForm('docForm');
    Docs.render();
    AdminPanel.renderLists();
    Toast.show('✅ המסמך נוסף בהצלחה');
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
// The old code used a global `pendingDocB64` — keep alias for completeness
let pendingDocB64 = null;
function onDocFileChange(input) { DocAdmin.onFileChange(input); }
function addDoc()               { DocAdmin.addDoc(); }
