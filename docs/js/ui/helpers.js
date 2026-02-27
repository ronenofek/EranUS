// ── UI Helpers ──────────────────────────────────────────────────────────
const Helpers = {
  escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                          .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  },

  copyZoomPass() {
    navigator.clipboard.writeText('mkP%093*')
      .then(() => Toast.show('🔑 הסיסמה הועתקה: mkP%093*'))
      .catch(() => prompt('העתק את הסיסמה:', 'mkP%093*'));
  },

  toggleForm(id) {
    const el = document.getElementById(id);
    el.classList.toggle('open');
  },
};

// ── Backwards-compatible global shims ──────────────────────────────────
function escHtml(s)     { return Helpers.escHtml(s); }
function copyZoomPass() { return Helpers.copyZoomPass(); }
function toggleForm(id) { return Helpers.toggleForm(id); }
