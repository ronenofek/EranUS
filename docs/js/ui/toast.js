// ── Toast Notification ──────────────────────────────────────────────────
const Toast = {
  show(msg, duration = 2800) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
  },
};

// ── Backwards-compatible global shim ───────────────────────────────────
function showToast(msg) { return Toast.show(msg); }
