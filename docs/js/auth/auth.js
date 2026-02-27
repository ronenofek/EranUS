// ── Auth state (globals used by all modules) ────────────────────────────
let currentUser = null;
let isAdmin = false;

// ── Auth module ─────────────────────────────────────────────────────────
const Auth = {
  handleLogin() {
    const u   = document.getElementById('username').value.trim();
    const p   = document.getElementById('password').value;
    const err = document.getElementById('loginError');
    if (USERS[u] && USERS[u] === p) {
      err.style.display = 'none';
      currentUser = u;
      isAdmin = ADMINS.has(u);
      sessionStorage.setItem('eranUser', u);
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('mainApp').style.display = 'block';
      App.initApp();
    } else {
      err.style.display = 'block';
      document.getElementById('password').value = '';
    }
  },

  handleLogout() {
    sessionStorage.removeItem('eranUser');
    currentUser = null;
    isAdmin = false;
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').style.display = 'none';
  },

  restoreSession() {
    const u = sessionStorage.getItem('eranUser');
    if (u && USERS[u]) {
      currentUser = u;
      isAdmin = ADMINS.has(u);
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('mainApp').style.display = 'block';
      App.initApp();
    }
  },
};

// ── Global event listeners ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginScreen').style.display !== 'none')
    Auth.handleLogin();
  if (e.key === 'Escape') {
    PdfViewer.closeModal();
    AdminPanel.closeConfirm();
    SearchModal.close();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  Auth.restoreSession();
});
